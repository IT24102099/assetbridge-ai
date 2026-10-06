using AssetBridge.Backend.Data;
using AssetBridge.Backend.Models;
using AssetBridge.Backend.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace AssetBridge.Tests
{
    public class QuotationAndBudgetTests
    {
        private AssetBridgeDbContext CreateInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AssetBridgeDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var context = new AssetBridgeDbContext(options);
            DbInitializer.Initialize(context);
            return context;
        }

        [Fact]
        public async Task QuotationComparison_SelectsProviderA_AsOptimalRecommendation()
        {
            // Arrange
            using var context = CreateInMemoryDbContext();
            var service = new ComparisonService(context);

            // Act
            var result = await service.CompareQuotationsForIncidentAsync("INC-1021", 75000);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("INC-1021", result.IncidentId);
            Assert.Equal(3, result.Quotations.Count);
            
            // Optimal provider according to PDF wireframe is ABC Plumbing / Provider A for LKR 38,000
            Assert.NotNull(result.RecommendedQuotation);
            Assert.Contains("ABC Plumbing", result.RecommendedQuotation.ProviderName);
            Assert.Equal(38000, result.RecommendedQuotation.AmountLkr);
            Assert.True(result.RecommendedQuotation.IsAiRecommended);
            Assert.True(result.AiRecommendation!.IsWithinBudget);
            Assert.Equal(37000, result.AiRecommendation.BudgetSavings); // 75,000 - 38,000
        }

        [Fact]
        public async Task BudgetCheck_FlagsQuotation_WhenExceedingBudget()
        {
            // Arrange
            using var context = CreateInMemoryDbContext();
            var service = new ComparisonService(context);

            // Act with a lower owner budget of LKR 40,000 (Provider B = 42k, Provider C = 55k exceed this)
            var result = await service.CompareQuotationsForIncidentAsync("INC-1021", 40000);

            // Assert
            Assert.NotNull(result.RecommendedQuotation);
            Assert.Equal(38000, result.RecommendedQuotation.AmountLkr); // Only Provider A fits
            Assert.True(result.RecommendedQuotation.AmountLkr <= 40000);

            // Check Provider B and C exceed the 40k budget
            var overBudgetQuotes = result.Quotations.Where(q => q.AmountLkr > 40000).ToList();
            Assert.Equal(2, overBudgetQuotes.Count);
        }

        [Fact]
        public async Task QuotationLineItems_SumMatchesStatedTotal()
        {
            // Arrange
            using var context = CreateInMemoryDbContext();
            var quote = await context.Quotations.FirstAsync(q => q.Id == "QT-2026-001");

            // Act
            decimal lineItemSum = quote.LineItems.Sum(item => item.TotalPrice);

            // Assert (Pipe 8k + Labour 15k + Wall repair 12k + Testing 3k = 38k)
            Assert.Equal(38000, lineItemSum);
            Assert.Equal(quote.AmountLkr, lineItemSum);
        }

        [Fact]
        public async Task MaintenanceJob_ProgressLifecycle_CompletesSuccessfully()
        {
            // Arrange
            using var context = CreateInMemoryDbContext();
            var job = await context.MaintenanceJobs.FirstAsync(j => j.Id == "JOB-101");

            // Act: Progress to Completed
            job.Status = "Completed";
            job.ProgressPercentage = 100;
            job.CompletedDate = DateTime.UtcNow;
            job.CompletionNotes = "Water pipe replaced and tested under 6 bar pressure. Zero leaks.";
            job.CompletionPhotos.Add("https://images.unsplash.com/photo-1581092160607-ee22621dd758");
            await context.SaveChangesAsync();

            // Assert
            var updatedJob = await context.MaintenanceJobs.FindAsync("JOB-101");
            Assert.NotNull(updatedJob);
            Assert.Equal("Completed", updatedJob.Status);
            Assert.Equal(100, updatedJob.ProgressPercentage);
            Assert.Single(updatedJob.CompletionPhotos);
        }

        [Fact]
        public async Task Agent3_RAGKnowledgeQuery_IdentifiesSafetyAndPlumbingGuides()
        {
            // Arrange
            using var context = CreateInMemoryDbContext();
            var mockEnv = new Mock<IWebHostEnvironment>();
            var comparisonService = new ComparisonService(context);
            var agent3Service = new Agent3RecommendationService(context, comparisonService, mockEnv.Object);

            // Act: Search for "water leak near electrical socket" (exact example from Page 16!)
            var ragResults = await agent3Service.QueryRagKnowledgeBaseAsync("water leak electrical socket");

            // Assert
            Assert.NotEmpty(ragResults);
            // Should match Electrical Safety Guide and Water Leakage Guide
            Assert.Contains(ragResults, r => r.DocumentName.Contains("Electrical") || r.DocumentName.Contains("Water"));
        }
    }
}
