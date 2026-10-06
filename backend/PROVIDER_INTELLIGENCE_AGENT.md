# Member 2: Provider Intelligence Agent

## Overview
The **Provider Intelligence Agent** is an agentic AI service designed to evaluate asset maintenance requirements, query controlled provider database tools, validate business rules using the deterministic matching engine, and generate structured provider recommendations with traceable execution auditing.

---

## Agent Architecture & Flow

```
Maintenance Requirement Request
        ↓
Provider Intelligence Agent (agent.ts)
        ↓
Controlled Tools Executions (searchProviders, checkAvailability, runDeterministicMatching)
        ↓
Deterministic Rule Engine Validation (matching.ts)
        ↓
Ranked Provider Candidates & Rationale Synthesis
        ↓
AgentRun & ToolExecution Trace Log Persistence (db/storage.ts)
        ↓
Human-in-the-Loop Review & Representative Assignment
```

---

## Inputs & Parameters
- `maintenanceRequirement` (string, required): Qualitative description of the asset issue or maintenance task.
- `requiredSkill` (string, optional): Required category (e.g. `Maintenance`, `Inspection`, `HVAC`, `Valuation`, `Legal`).
- `location` (string, optional): Geographic region or target territory.
- `requiredDate` (string YYYY-MM-DD, optional): Requested date for dispatch.
- `maxDistance` (number, optional): Maximum radius boundary in kilometers.

---

## Controlled Tools
1. `searchProvidersTool`: Searches provider records by skill and location.
2. `checkProviderAvailabilityTool`: Queries provider availability slots for requested date.
3. `runDeterministicMatchingTool`: Executes business-rule matching logic in `backend/src/modules/providers/matching.ts`.

---

## Structured Output Schema
```json
{
  "request": {
    "maintenanceRequirement": "Emergency HVAC cooling breakdown",
    "requiredSkill": "Maintenance",
    "location": "North Region",
    "requiredDate": "2026-10-06"
  },
  "recommendations": [
    {
      "providerId": "prov-1",
      "providerName": "Apex Maintenance Services Ltd.",
      "matchScore": 0.95,
      "reasons": [
        "Possesses required maintenance skill: 'Maintenance'",
        "Proximity match: Local operator located within 5 km of North Region",
        "Available for dispatch on requested date 2026-10-06",
        "Proven track record: 142 completed asset maintenance jobs with 4.8/5.0 rating",
        "Compliance verified: Certified service provider with active insurance"
      ],
      "availability": "AVAILABLE",
      "relevantExperience": "142 completed jobs (Maintenance, HVAC, Electrical Repair)",
      "rating": 4.8,
      "verificationStatus": "VERIFIED",
      "distanceKm": 5
    }
  ],
  "warnings": [],
  "agentRunId": "agent-run-1700000000000",
  "timestamp": "2026-10-05T19:00:00.000Z"
}
```

---

## API Endpoints
- `POST /api/agents/provider-intelligence/recommend`: Triggers agent execution and returns structured recommendation.
- `GET /api/agents/runs/:runId`: Retrieves complete audit log of `AgentRun` and `ToolExecution` steps.

---

## Safety & Human-in-the-Loop
- **Human Review**: The agent presents recommendations to representatives/managers for human review and assignment. It does not automatically re-assign providers without human approval.
- **Deterministic Safeguards**: AI output is bounded by business validation rules in `matching.ts`.
- **Traceability**: All agent runs and tool executions are logged with unique IDs (`agentRunId`, `toolId`).
