using System.Text.RegularExpressions;
using AssetBridge.Backend.Data;
using AssetBridge.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace AssetBridge.Backend.Services
{
    public interface IAgent3RecommendationService
    {
        Task<AgentRecommendationDto> RunAgent3RecommendationAsync(string incidentId, decimal budget);
        Task<List<RagSearchResultDto>> QueryRagKnowledgeBaseAsync(string query);
        Task<InspectionWorkSuggestionDto> AnalyzeInspectionFindingsAsync(string inspectionId);
    }

    public class RagSearchResultDto
    {
        public string DocumentName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string MatchedSnippet { get; set; } = string.Empty;
        public double RelevanceScore { get; set; }
        public List<string> ExtractedSafetyPoints { get; set; } = new();
    }

    public class InspectionWorkSuggestionDto
    {
        public string InspectionId { get; set; } = string.Empty;
        public string Priority { get; set; } = "HIGH";
        public List<string> RequiredExpertise { get; set; } = new();
        public List<string> SuggestedWorkItems { get; set; } = new();
        public decimal EstimatedCostRangeMin { get; set; }
        public decimal EstimatedCostRangeMax { get; set; }
        public List<string> ImmediateSafetySteps { get; set; } = new();
        public string RAGSourceDocument { get; set; } = string.Empty;
    }

    public class Agent3RecommendationService : IAgent3RecommendationService
    {
        private readonly AssetBridgeDbContext _context;
        private readonly IComparisonService _comparisonService;
        private readonly string _ragDirectoryPath;

        public Agent3RecommendationService(
            AssetBridgeDbContext context,
            IComparisonService comparisonService,
            IWebHostEnvironment env)
        {
            _context = context;
            _comparisonService = comparisonService;
            
            // Traverse upwards to find rag-knowledge-base folder robustly
            var dir = new DirectoryInfo(Directory.GetCurrentDirectory());
            while (dir != null && !Directory.Exists(Path.Combine(dir.FullName, "rag-knowledge-base")))
            {
                dir = dir.Parent;
            }
            _ragDirectoryPath = dir != null 
                ? Path.Combine(dir.FullName, "rag-knowledge-base") 
                : Directory.GetCurrentDirectory();
        }

        public async Task<AgentRecommendationDto> RunAgent3RecommendationAsync(string incidentId, decimal budget)
        {
            // Execute Agent 3 tool flow:
            // 1. GetInspection
            var inspection = await _context.Inspections.FirstOrDefaultAsync(i => i.IncidentId == incidentId);
            
            // 2. GetQuotations & CompareQuotations
            var comparison = await _comparisonService.CompareQuotationsForIncidentAsync(incidentId, budget);
            
            // 3. GetMaintenanceHistory
            var history = inspection != null 
                ? await _context.MaintenanceHistories.Where(h => h.AssetId == inspection.AssetId).ToListAsync() 
                : new List<MaintenanceHistory>();

            // 4. Incorporate RAG Knowledge for safety and pricing validation
            var ragQuery = inspection != null ? $"{inspection.ProblemCategory} {inspection.Finding}" : "Water Leakage";
            var ragResults = await QueryRagKnowledgeBaseAsync(ragQuery);
            var topRag = ragResults.FirstOrDefault();

            var recommendation = comparison.AiRecommendation ?? new AgentRecommendationDto();
            
            if (topRag != null)
            {
                recommendation.RagKnowledgeRetrieved = $"{topRag.DocumentName} (Relevance {topRag.RelevanceScore:P0})";
                foreach (var safety in topRag.ExtractedSafetyPoints)
                {
                    if (!recommendation.SafetyAndPolicyNotes.Contains(safety))
                    {
                        recommendation.SafetyAndPolicyNotes.Add(safety);
                    }
                }
            }

            return recommendation;
        }

        public async Task<InspectionWorkSuggestionDto> AnalyzeInspectionFindingsAsync(string inspectionId)
        {
            var inspection = await _context.Inspections.FindAsync(inspectionId);
            if (inspection == null)
            {
                throw new KeyNotFoundException($"Inspection {inspectionId} not found");
            }

            var query = $"{inspection.ProblemCategory} {inspection.Finding} {inspection.RequiredWork}";
            var ragResults = await QueryRagKnowledgeBaseAsync(query);

            var requiredTrades = new List<string> { "Plumbing" };
            var safetySteps = new List<string>
            {
                "Turn off main water stopcock immediately.",
                "Isolate electrical circuit breakers feeding wet zones before opening walls."
            };

            if (inspection.Finding.Contains("electric", StringComparison.OrdinalIgnoreCase) ||
                inspection.Finding.Contains("socket", StringComparison.OrdinalIgnoreCase) ||
                inspection.ProblemCategory.Contains("electric", StringComparison.OrdinalIgnoreCase))
            {
                requiredTrades.Add("Electrical");
                safetySteps.Insert(0, "CRITICAL: Immediate electrical supply isolation required (IET BS 7671).");
            }

            return new InspectionWorkSuggestionDto
            {
                InspectionId = inspection.Id,
                Priority = inspection.Priority,
                RequiredExpertise = requiredTrades,
                SuggestedWorkItems = new List<string>
                {
                    "PPR 25mm pipe section replacement with PN20 fusion joints",
                    "Waterproof polymer plaster repair to moisture-damaged masonry",
                    "30-minute hydrostatic pressure hold test at 6.0 bar",
                    "Moisture meter scan (<12% WME) before final coating"
                },
                EstimatedCostRangeMin = 35000,
                EstimatedCostRangeMax = 45000,
                ImmediateSafetySteps = safetySteps,
                RAGSourceDocument = ragResults.FirstOrDefault()?.DocumentName ?? "Water_Leakage_Maintenance_Guide.md"
            };
        }

        public async Task<List<RagSearchResultDto>> QueryRagKnowledgeBaseAsync(string query)
        {
            var results = new List<RagSearchResultDto>();
            if (!Directory.Exists(_ragDirectoryPath))
            {
                return results;
            }

            var keywords = query.Split(new[] { ' ', ',', '.', ';', '?' }, StringSplitOptions.RemoveEmptyEntries)
                                .Where(w => w.Length > 2)
                                .Select(w => w.ToLowerInvariant())
                                .Distinct()
                                .ToList();

            var mdFiles = Directory.GetFiles(_ragDirectoryPath, "*.md", SearchOption.AllDirectories);

            foreach (var file in mdFiles)
            {
                var fileName = Path.GetFileName(file);
                var content = await File.ReadAllTextAsync(file);

                int matchCount = 0;
                foreach (var kw in keywords)
                {
                    if (content.Contains(kw, StringComparison.OrdinalIgnoreCase))
                    {
                        matchCount++;
                    }
                }

                if (matchCount > 0)
                {
                    double score = (double)matchCount / Math.Max(keywords.Count, 1);
                    var paragraphs = content.Split(new[] { "\n\n", "\r\n\r\n" }, StringSplitOptions.RemoveEmptyEntries);
                    var bestParagraph = paragraphs.FirstOrDefault(p => keywords.Any(k => p.Contains(k, StringComparison.OrdinalIgnoreCase))) ?? paragraphs.FirstOrDefault() ?? "";

                    var safetyPoints = new List<string>();
                    var lines = content.Split('\n');
                    foreach (var line in lines)
                    {
                        if (line.Contains("Shut off", StringComparison.OrdinalIgnoreCase) ||
                            line.Contains("Isolate", StringComparison.OrdinalIgnoreCase) ||
                            line.Contains("hazard", StringComparison.OrdinalIgnoreCase) ||
                            line.Contains("testing", StringComparison.OrdinalIgnoreCase) ||
                            line.Contains("warranty", StringComparison.OrdinalIgnoreCase))
                        {
                            var clean = line.Trim().TrimStart('-', '*', '#', ' ');
                            if (clean.Length > 15 && clean.Length < 160 && !safetyPoints.Contains(clean))
                            {
                                safetyPoints.Add(clean);
                                if (safetyPoints.Count >= 3) break;
                            }
                        }
                    }

                    results.Add(new RagSearchResultDto
                    {
                        DocumentName = fileName,
                        Category = fileName.Replace("_", " ").Replace(".md", ""),
                        MatchedSnippet = bestParagraph.Length > 280 ? bestParagraph.Substring(0, 280) + "..." : bestParagraph,
                        RelevanceScore = Math.Min(1.0, score + 0.3),
                        ExtractedSafetyPoints = safetyPoints
                    });
                }
            }

            return results.OrderByDescending(r => r.RelevanceScore).ToList();
        }
    }
}
