import { Router } from 'express';
import { AgentController } from './controller.js';

const router = Router();

router.post('/provider-intelligence/recommend', AgentController.recommendProviders);
router.get('/runs/:runId', AgentController.getAgentRunTrace);

export default router;
