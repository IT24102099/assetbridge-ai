import { db, AgentRun, ToolExecution } from '../../db/storage.js';
import { ServiceProvider, ProviderSearchCriteria } from '../providers/types.js';
import { ProviderService } from '../providers/service.js';
import { AvailabilityService } from '../availability/service.js';
import { DeterministicMatchingEngine } from '../providers/matching.js';

export interface ProviderIntelligenceRequest {
  maintenanceRequirement: string;
  requiredSkill?: string;
  location?: string;
  requiredDate?: string;
  maxDistance?: number;
}

export interface ProviderRecommendationItem {
  providerId: string;
  providerName: string;
  matchScore: number; // 0.0 to 1.0 scale
  reasons: string[];
  availability: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
  relevantExperience: string;
  rating: number;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'UNVERIFIED';
  distanceKm: number;
  warnings?: string[];
}

export interface ProviderIntelligenceResponse {
  request: ProviderIntelligenceRequest;
  recommendations: ProviderRecommendationItem[];
  warnings: string[];
  agentRunId: string;
  timestamp: string;
}

export class ProviderIntelligenceAgent {
  public static async execute(
    request: ProviderIntelligenceRequest
  ): Promise<ProviderIntelligenceResponse> {
    const runId = `agent-run-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const startTime = new Date().toISOString();
    const toolExecutions: ToolExecution[] = [];

    // Record initial AgentRun entry
    db.write((state) => {
      state.agentRuns.push({
        id: runId,
        agentName: 'Provider Intelligence Agent',
        requestInput: request as unknown as Record<string, unknown>,
        startTime,
        status: 'RUNNING',
        toolCalls: [],
      });
    });

    const executeTool = <T>(
      toolName: string,
      input: Record<string, unknown>,
      action: () => T
    ): T => {
      const toolId = `tool-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const timestamp = new Date().toISOString();
      const output = action();

      const toolExec: ToolExecution = {
        id: toolId,
        agentRunId: runId,
        toolName,
        input,
        output,
        timestamp,
      };

      toolExecutions.push(toolExec);
      return output;
    };

    try {
      // Tool 1: Search provider candidates by skill and location
      const candidates = executeTool(
        'searchProvidersTool',
        { skill: request.requiredSkill, location: request.location },
        () => {
          const res = ProviderService.getAll({
            skill: request.requiredSkill,
            location: request.location,
            limit: 100,
          });
          return res.data;
        }
      );

      // Tool 2: Check provider availability if requiredDate is provided
      const availabilityMap = new Map<string, 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE'>();
      if (request.requiredDate) {
        for (const candidate of candidates) {
          executeTool(
            'checkProviderAvailabilityTool',
            { providerId: candidate.id, date: request.requiredDate },
            () => {
              const res = AvailabilityService.getByProviderId(candidate.id, {
                date: request.requiredDate,
              });
              if (res.data && res.data.length > 0) {
                const hasAvailable = res.data.some((s) => s.status === 'AVAILABLE');
                const hasBusy = res.data.some((s) => s.status === 'BUSY');
                availabilityMap.set(
                  candidate.id,
                  hasAvailable ? 'AVAILABLE' : hasBusy ? 'BUSY' : 'UNAVAILABLE'
                );
              } else {
                availabilityMap.set(candidate.id, 'AVAILABLE');
              }
              return { status: availabilityMap.get(candidate.id) };
            }
          );
        }
      }

      // Tool 3: Run deterministic matching logic to apply business validation rules
      const criteria: ProviderSearchCriteria = {
        skill: request.requiredSkill,
        location: request.location,
        maxDistance: request.maxDistance,
        availableDate: request.requiredDate,
      };

      const matchResults = executeTool(
        'runDeterministicMatchingTool',
        { criteria },
        () => {
          const data = db.read();
          return DeterministicMatchingEngine.match(candidates, data.availability, criteria);
        }
      );

      // Evaluate and synthesize structured recommendations
      const recommendations: ProviderRecommendationItem[] = [];
      const globalWarnings: string[] = [];

      if (matchResults.length === 0) {
        globalWarnings.push(
          `No providers found matching skill '${request.requiredSkill || 'All'}' in region '${request.location || 'All'}'.`
        );
      }

      for (const match of matchResults) {
        const p: ServiceProvider = match.provider;
        const reasons: string[] = [];
        const itemWarnings: string[] = [];

        // Evaluate skill match
        if (request.requiredSkill) {
          const hasSkill = p.skills.some((s) =>
            s.toLowerCase().includes(request.requiredSkill!.toLowerCase())
          );
          if (hasSkill) {
            reasons.push(`Possesses required maintenance skill: '${request.requiredSkill}'`);
          } else {
            itemWarnings.push(`Missing exact skill match for '${request.requiredSkill}'`);
          }
        }

        // Evaluate location proximity
        if (request.location) {
          if (match.distance <= 10) {
            reasons.push(`Proximity match: Local operator located within ${match.distance} km of ${request.location}`);
          } else {
            reasons.push(`Service area coverage: Serves ${request.location} (${match.distance} km distance)`);
          }
        }

        // Evaluate availability
        if (match.availability === 'AVAILABLE') {
          reasons.push(`Available for dispatch on requested date ${request.requiredDate || 'immediately'}`);
        } else if (match.availability === 'BUSY') {
          itemWarnings.push(`Provider is currently busy on ${request.requiredDate}`);
        } else {
          itemWarnings.push(`Provider is unavailable on ${request.requiredDate}`);
        }

        // Evaluate track record & history
        if (p.jobsCount > 0) {
          reasons.push(`Proven track record: ${p.jobsCount} completed asset maintenance jobs with ${p.rating}/5.0 rating`);
        }

        if (p.verificationStatus === 'VERIFIED') {
          reasons.push(`Compliance verified: Certified service provider with active insurance`);
        } else {
          itemWarnings.push(`Provider verification status is ${p.verificationStatus}`);
        }

        // Calculate score normalized to [0.0, 1.0]
        let baseScore = 0.5;
        if (p.verificationStatus === 'VERIFIED') baseScore += 0.2;
        if (match.availability === 'AVAILABLE') baseScore += 0.15;
        baseScore += (p.rating / 5.0) * 0.15;
        const normalizedScore = Math.min(0.99, Math.max(0.4, Number(baseScore.toFixed(2))));

        recommendations.push({
          providerId: p.id,
          providerName: p.companyName,
          matchScore: normalizedScore,
          reasons,
          availability: match.availability,
          relevantExperience: `${p.jobsCount} completed jobs (${p.skills.slice(0, 3).join(', ')})`,
          rating: p.rating,
          verificationStatus: p.verificationStatus,
          distanceKm: match.distance,
          warnings: itemWarnings.length > 0 ? itemWarnings : undefined,
        });
      }

      // Sort recommendations descending by score
      recommendations.sort((a, b) => b.matchScore - a.matchScore);

      const response: ProviderIntelligenceResponse = {
        request,
        recommendations,
        warnings: globalWarnings,
        agentRunId: runId,
        timestamp: new Date().toISOString(),
      };

      // Record successful AgentRun completion
      db.write((state) => {
        const runIndex = state.agentRuns.findIndex((r) => r.id === runId);
        if (runIndex !== -1) {
          state.agentRuns[runIndex] = {
            ...state.agentRuns[runIndex],
            status: 'COMPLETED',
            endTime: new Date().toISOString(),
            outputResult: response as unknown as Record<string, unknown>,
            toolCalls: toolExecutions,
          };
        }
      });

      return response;
    } catch (err: any) {
      // Record failed AgentRun execution safely
      db.write((state) => {
        const runIndex = state.agentRuns.findIndex((r) => r.id === runId);
        if (runIndex !== -1) {
          state.agentRuns[runIndex] = {
            ...state.agentRuns[runIndex],
            status: 'FAILED',
            endTime: new Date().toISOString(),
            errorMessage: err.message || 'An error occurred during agent execution',
            toolCalls: toolExecutions,
          };
        }
      });

      return {
        request,
        recommendations: [],
        warnings: [`Agent execution failed: ${err.message || 'Unknown error'}`],
        agentRunId: runId,
        timestamp: new Date().toISOString(),
      };
    }
  }

  public static getRunTrace(runId: string): AgentRun | null {
    const data = db.read();
    return data.agentRuns.find((r) => r.id === runId) || null;
  }
}
