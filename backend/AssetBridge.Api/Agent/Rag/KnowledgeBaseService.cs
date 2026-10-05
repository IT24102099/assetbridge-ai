using AssetBridge.Api.Agent.Models;

namespace AssetBridge.Api.Agent.Rag;

public class KnowledgeBaseService : IKnowledgeBaseService
{
    private readonly List<KnowledgeDocument> _documents = new()
    {
        new KnowledgeDocument
        {
            Id = "DOC-PLUMB-01",
            Title = "Residential Kitchen & Municipal Water Leakage Response Manual (SLS 147)",
            Category = "Plumbing & Hydraulics",
            Content = "Emergency guidelines for domestic kitchen sinks, bathroom pipe bursts, pressurized water lines, booster pumps, and valve failures. Outlines immediate water shut-off protocols, isolation valves under sinks, pressure surge relief, and water diversion. Critical in preventing structural undermining, tenant disruption, and mold growth.",
            Keywords = new() { "water", "leak", "kitchen", "sink", "pipe", "pump", "pressure", "valve", "cavitation", "burst", "plumbing", "drainage", "tap", "flooding", "bathroom" },
            ImmediateSafetyActions = new()
            {
                "Immediately shut off the primary intake valve or under-sink stopcock.",
                "Turn off booster pumps and nearby electrical sockets to prevent electrical shocks.",
                "Relieve residual line pressure through the lowest cold water tap.",
                "Deploy temporary catchment containers and towels to divert runoff."
            },
            RecommendedTrade = "Licensed Commercial & Residential Plumber"
        },
        new KnowledgeDocument
        {
            Id = "DOC-ELEC-06",
            Title = "Residential Electrical Socket, Wall Outlet & Wiring Safety Guidelines (CEB / IET)",
            Category = "Residential Electrical & Safety",
            Content = "Standard operating procedures for domestic electrical socket issues, wall outlet sparks, burning smells, tripping circuit breakers (MCB/RCD), and short circuits in residential and commercial premises. Outlines electrical disconnection, insulation testing, and hazardous arc prevention.",
            Keywords = new() { "electrical", "socket", "outlet", "plug", "switch", "spark", "tripping", "breaker", "short", "wire", "shock", "power", "fuse", "burn" },
            ImmediateSafetyActions = new()
            {
                "Immediately switch off the main Residual Current Device (RCD / RCCB) or branch circuit breaker on the distribution panel.",
                "Do NOT touch scorched, sparking, or warm wall sockets with bare hands.",
                "Unplug all connected kitchen or household appliances from the affected circuit line.",
                "Keep a dry powder or CO2 fire extinguisher accessible; NEVER use water on electrical defects."
            },
            RecommendedTrade = "Licensed Domestic & Commercial Electrician"
        },
        new KnowledgeDocument
        {
            Id = "DOC-ELEC-02",
            Title = "Standby Diesel Generator & Critical Power Electrical Safety Guidelines",
            Category = "Electrical & Power Generation",
            Content = "Standard operating procedures for generator coolant leaks, radiator overheating, emergency stop sequences, and electrical lockout/tagout (LOTO). Regulates emergency backup power units in hospitals, continuous data operations, and commercial establishments under Ceylon Electricity Board (CEB) standards.",
            Keywords = new() { "generator", "coolant", "overheat", "diesel", "power", "electrical", "engine", "radiator", "sensor", "heat", "voltage", "blackout" },
            ImmediateSafetyActions = new()
            {
                "Do NOT open the radiator pressure cap while the engine is hot (severe scalding risk).",
                "Switch generator controller to MANUAL/STOP override if emergency cooling fails.",
                "Verify automated transfer switch (ATS) has reverted to grid power safely.",
                "Inspect ground for diesel fuel or coolant pooling; keep fire extinguishers on standby."
            },
            RecommendedTrade = "Certified Heavy Electrical & Generator Technician"
        },
        new KnowledgeDocument
        {
            Id = "DOC-HYDR-03",
            Title = "Coastal Sluice Gate & Drainage Canal Maintenance Protocol",
            Category = "Civil & Flood Defense",
            Content = "Operational manual for tidal drainage sluice gates, automated winches, and hydraulic actuator rams. Outlines marine debris removal, salt water corrosion prevention, seal replacement, and emergency manual winching during high tide flood threats in coastal districts (Galle, Matara, Colombo).",
            Keywords = new() { "sluice", "gate", "drainage", "flood", "canal", "hydraulic", "debris", "coastal", "tide", "jam", "marine" },
            ImmediateSafetyActions = new()
            {
                "Disengage automated hydraulic pump if ram cylinder is jammed against rigid debris.",
                "Deploy manual cable winch with safety pawl engaged to prevent uncontrolled gate drops.",
                "Ensure ground team wears life vests and fall-arrest harnesses near fast-flowing channels.",
                "Coordinate with local Irrigation Department or Municipal Council flood desk."
            },
            RecommendedTrade = "Marine & Hydraulic Systems Specialist"
        },
        new KnowledgeDocument
        {
            Id = "DOC-SOLAR-04",
            Title = "Solar Photovoltaic Inverter & Array Diagnostic Standard",
            Category = "Renewable Energy",
            Content = "Field troubleshooting manual for grid-tied solar inverters, MPPT heat sink thermal throttling, DC ground fault detection, and tropical dust accumulation. Guidelines for maintaining solar array efficiency across Sri Lanka's Northern and Eastern provinces.",
            Keywords = new() { "solar", "inverter", "photovoltaic", "pv", "dust", "heat sink", "panel", "clean", "energy", "array" },
            ImmediateSafetyActions = new()
            {
                "Isolate DC input disconnect switch prior to accessing inverter ventilation enclosures.",
                "Do not spray high-pressure cold water onto hot solar panels during peak sun hours.",
                "Use dry, non-conductive brushes or compressed air to clear heat sink dust blocks.",
                "Check inverter LCD or telemetry log for specific DC arc-fault or ground-fault codes."
            },
            RecommendedTrade = "Solar PV & Renewable Energy Systems Engineer"
        },
        new KnowledgeDocument
        {
            Id = "DOC-STRUC-05",
            Title = "Building Envelope & Roof Rainwater Penetration Standard",
            Category = "Structural & Waterproofing",
            Content = "Inspection procedures for monsoon roof leakages, expansion joint failures, blocked rainwater downpipes, and concrete spalling. Focuses on rapid water diversion and preserving tenant asset continuity.",
            Keywords = new() { "roof", "leak", "ceiling", "rain", "monsoon", "waterproof", "gutter", "downpipe", "moisture", "damp", "crack" },
            ImmediateSafetyActions = new()
            {
                "Clear blocked gutter drains and leaf guards carefully without stepping on fragile asbestos or tile sheets.",
                "Place protective waterproof tarpaulins over indoor equipment and furniture.",
                "Isolate ceiling light circuits in rooms experiencing direct overhead drip leaks.",
                "Monitor load-bearing drywall or plasterboard ceilings for dangerous water sagging."
            },
            RecommendedTrade = "Waterproofing & Roofing Specialist"
        }
    };

    public Task<List<KnowledgeDocument>> GetAllDocumentsAsync()
    {
        return Task.FromResult(_documents);
    }

    public Task<List<KnowledgeDocument>> RetrieveRelevantDocumentsAsync(string query, int topK = 3)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return Task.FromResult(_documents.Take(topK).ToList());
        }

        var terms = query.ToLower()
            .Split(new[] { ' ', ',', '.', ';', ':', '-', '(', ')', '/', '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries)
            .Where(t => t.Length > 2)
            .Distinct()
            .ToList();

        var scored = _documents.Select(doc =>
        {
            double score = 0;
            var docText = $"{doc.Title} {doc.Category} {doc.Content}".ToLower();

            foreach (var term in terms)
            {
                // Exact keyword match is weighted heavily
                if (doc.Keywords.Any(k => k.Equals(term, StringComparison.OrdinalIgnoreCase)))
                {
                    score += 5.0;
                }
                // Partial keyword match
                else if (doc.Keywords.Any(k => k.Contains(term, StringComparison.OrdinalIgnoreCase)))
                {
                    score += 2.5;
                }

                // Title occurrence
                if (doc.Title.Contains(term, StringComparison.OrdinalIgnoreCase))
                {
                    score += 3.0;
                }

                // General content occurrence
                if (docText.Contains(term))
                {
                    score += 1.0;
                }
            }

            return new KnowledgeDocument
            {
                Id = doc.Id,
                Title = doc.Title,
                Category = doc.Category,
                Content = doc.Content,
                Keywords = doc.Keywords,
                ImmediateSafetyActions = doc.ImmediateSafetyActions,
                RecommendedTrade = doc.RecommendedTrade,
                RelevanceScore = score
            };
        })
        .Where(d => d.RelevanceScore > 0)
        .OrderByDescending(d => d.RelevanceScore)
        .Take(topK)
        .ToList();

        // If no direct matches, return top document with general guidance
        if (scored.Count == 0)
        {
            scored = _documents.Take(1).Select(d => new KnowledgeDocument
            {
                Id = d.Id,
                Title = d.Title,
                Category = d.Category,
                Content = d.Content,
                Keywords = d.Keywords,
                ImmediateSafetyActions = d.ImmediateSafetyActions,
                RecommendedTrade = d.RecommendedTrade,
                RelevanceScore = 0.5
            }).ToList();
        }

        return Task.FromResult(scored);
    }
}
