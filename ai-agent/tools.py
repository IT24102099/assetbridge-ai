"""
AssetBridge AI — Agent 3: Maintenance & Cost Recommendation Agent
Member 3 Distinct AI Contribution: Maintenance Planning & Quotation Management

This module implements the 7 tools required by Agent 3:
1. GetInspection(inspectionId)
2. GetMaintenanceHistory(assetId)
3. GetQuotations(incidentId)
4. CompareQuotations(incidentId, budget)
5. CheckBudget(quotationId, budget)
6. CalculateTotalCost(quotationId)
7. GetWarrantyInformation(quotationId)
"""

import json
from typing import Dict, Any, List, Optional

# Mock in-memory database reflecting live system state
MOCK_INSPECTIONS = {
    "INS-1021": {
        "inspectionId": "INS-1021",
        "incidentId": "INC-1021",
        "assetId": "AS-KDY-001",
        "assetName": "Kandy House",
        "issue": "Kitchen pipe leakage",
        "finding": "Damaged water pipe behind kitchen cabinet leaking at joint",
        "requiredWork": [
            "Pipe replacement",
            "Wall repair",
            "Leak testing"
        ],
        "priority": "HIGH",
        "damageLevel": "Moderate"
    }
}

MOCK_MAINTENANCE_HISTORY = {
    "AS-KDY-001": [
        {
            "jobId": "JOB-091",
            "type": "Water Pump Overhaul",
            "provider": "ABC Plumbing",
            "cost": 28000,
            "date": "2026-06-15",
            "rating": 5.0,
            "status": "Resolved"
        },
        {
            "jobId": "JOB-078",
            "type": "Electrical Inspection",
            "provider": "ElectroSafe Kandy",
            "cost": 16500,
            "date": "2026-03-20",
            "rating": 4.8,
            "status": "Resolved"
        }
    ]
}

MOCK_QUOTATIONS = {
    "INC-1021": [
        {
            "quotationId": "QT-001",
            "provider": "Provider A (ABC Plumbing)",
            "providerId": "PRV-001",
            "rating": 4.8,
            "previousJobs": 24,
            "distanceKm": 4.2,
            "lineItems": {
                "Pipe": 8000,
                "Labour": 15000,
                "Wall repair": 12000,
                "Testing": 3000
            },
            "totalCost": 38000,
            "deadlineDays": 2,
            "warrantyMonths": 12,
            "warrantyCoverage": "Full leak-free coverage on replaced pipework & masonry seal"
        },
        {
            "quotationId": "QT-002",
            "provider": "Provider B (QuickFix Plumbing)",
            "providerId": "PRV-002",
            "rating": 4.5,
            "previousJobs": 18,
            "distanceKm": 8.5,
            "lineItems": {
                "Pipe": 10000,
                "Labour": 18000,
                "Repair": 10000,
                "Testing": 4000
            },
            "totalCost": 42000,
            "deadlineDays": 3,
            "warrantyMonths": 6,
            "warrantyCoverage": "6 months standard workmanship warranty"
        },
        {
            "quotationId": "QT-003",
            "provider": "Provider C (Home Services Lanka)",
            "providerId": "PRV-003",
            "rating": 4.1,
            "previousJobs": 9,
            "distanceKm": 14.0,
            "lineItems": {
                "Pipe": 12000,
                "Labour": 22000,
                "Repair": 15000,
                "Testing": 6000
            },
            "totalCost": 55000,
            "deadlineDays": 5,
            "warrantyMonths": 3,
            "warrantyCoverage": "3 months limited warranty"
        }
    ]
}


class Agent3Tools:
    """Agent 3 Tools matching the architecture diagram."""

    @staticmethod
    def GetInspection(inspection_id: str) -> Dict[str, Any]:
        """Tool 1: Retrieves on-site inspection findings, damages, and required work."""
        inspection = MOCK_INSPECTIONS.get(inspection_id)
        if not inspection:
            return {"error": f"Inspection {inspection_id} not found."}
        return inspection

    @staticmethod
    def GetMaintenanceHistory(asset_id: str) -> List[Dict[str, Any]]:
        """Tool 2: Retrieves asset maintenance history and past contractor performance."""
        return MOCK_MAINTENANCE_HISTORY.get(asset_id, [])

    @staticmethod
    def GetQuotations(incident_id: str) -> List[Dict[str, Any]]:
        """Tool 3: Fetches all submitted quotations for an incident."""
        return MOCK_QUOTATIONS.get(incident_id, [])

    @staticmethod
    def CalculateTotalCost(quotation_id: str) -> Dict[str, Any]:
        """Tool 4: Computes and audits the line-item sum for a given quotation."""
        for inc_quotes in MOCK_QUOTATIONS.values():
            for q in inc_quotes:
                if q["quotationId"] == quotation_id:
                    computed_sum = sum(q["lineItems"].values())
                    return {
                        "quotationId": quotation_id,
                        "lineItems": q["lineItems"],
                        "computedTotal": computed_sum,
                        "statedTotal": q["totalCost"],
                        "isAccurate": computed_sum == q["totalCost"]
                    }
        return {"error": f"Quotation {quotation_id} not found."}

    @staticmethod
    def CheckBudget(quotation_id: str, owner_budget: float) -> Dict[str, Any]:
        """Tool 5: Checks whether a quotation adheres to the owner's budget allocation."""
        for inc_quotes in MOCK_QUOTATIONS.values():
            for q in inc_quotes:
                if q["quotationId"] == quotation_id:
                    diff = owner_budget - q["totalCost"]
                    is_within = diff >= 0
                    percent_saved = (diff / owner_budget * 100) if is_within else 0.0
                    return {
                        "quotationId": quotation_id,
                        "cost": q["totalCost"],
                        "budget": owner_budget,
                        "isWithinBudget": is_within,
                        "savingsLkr": diff if is_within else 0,
                        "overrunLkr": abs(diff) if not is_within else 0,
                        "percentSaved": round(percent_saved, 1)
                    }
        return {"error": f"Quotation {quotation_id} not found."}

    @staticmethod
    def GetWarrantyInformation(quotation_id: str) -> Dict[str, Any]:
        """Tool 6: Retrieves warranty coverage terms for a quotation."""
        for inc_quotes in MOCK_QUOTATIONS.values():
            for q in inc_quotes:
                if q["quotationId"] == quotation_id:
                    return {
                        "quotationId": quotation_id,
                        "provider": q["provider"],
                        "warrantyMonths": q["warrantyMonths"],
                        "warrantyCoverage": q["warrantyCoverage"],
                        "meetsMinimumPolicy": q["warrantyMonths"] >= 6
                    }
        return {"error": f"Quotation {quotation_id} not found."}

    @staticmethod
    def CompareQuotations(incident_id: str, owner_budget: float = 75000.0) -> Dict[str, Any]:
        """Tool 7: Multi-criteria comparison balancing cost, quality, warranty, and turnaround."""
        quotes = MOCK_QUOTATIONS.get(incident_id, [])
        if not quotes:
            return {"error": f"No quotations found for incident {incident_id}."}

        min_cost = min(q["totalCost"] for q in quotes)
        ranked = []

        for q in quotes:
            # Score formula:
            # Cost (40 pts)
            cost_pts = max(0, 40 * (1 - (q["totalCost"] - min_cost) / owner_budget)) if q["totalCost"] <= owner_budget else 0
            # Warranty (20 pts)
            warranty_pts = min(20, (q["warrantyMonths"] / 12) * 20)
            # Rating (20 pts)
            rating_pts = (q["rating"] / 5.0) * 20
            # Speed (10 pts)
            speed_pts = 10 if q["deadlineDays"] <= 2 else (7 if q["deadlineDays"] <= 3 else 4)
            # History (10 pts)
            history_pts = min(10, (q["previousJobs"] / 25) * 10)

            total_score = round(cost_pts + warranty_pts + rating_pts + speed_pts + history_pts, 1)

            ranked.append({
                "quotationId": q["quotationId"],
                "provider": q["provider"],
                "totalCost": q["totalCost"],
                "deadlineDays": q["deadlineDays"],
                "warrantyMonths": q["warrantyMonths"],
                "rating": q["rating"],
                "score": total_score,
                "isWithinBudget": q["totalCost"] <= owner_budget
            })

        ranked.sort(key=lambda x: x["score"], reverse=True)
        return {
            "incidentId": incident_id,
            "ownerBudget": owner_budget,
            "comparisonMatrix": ranked,
            "topRecommended": ranked[0]
        }
