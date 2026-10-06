import { Request, Response } from 'express';
import { ProviderIntelligenceAgent } from './provider-intelligence-agent.js';
import { providerIntelligenceRequestSchema } from './validation.js';

export class AgentController {
  public static recommendProviders = async (req: Request, res: Response): Promise<void> => {
    try {
      const parseResult = providerIntelligenceRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: parseResult.error.format(),
        });
        return;
      }

      const result = await ProviderIntelligenceAgent.execute(parseResult.data);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message || 'An unexpected error occurred during agent execution',
      });
    }
  };

  public static getAgentRunTrace = (req: Request, res: Response): void => {
    try {
      const { runId } = req.params;
      const trace = ProviderIntelligenceAgent.getRunTrace(runId);
      if (!trace) {
        res.status(404).json({ success: false, error: 'Agent run trace not found' });
        return;
      }

      res.status(200).json({ success: true, data: trace });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Internal server error', message: err.message });
    }
  };
}
