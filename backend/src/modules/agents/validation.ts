import { z } from 'zod';

export const providerIntelligenceRequestSchema = z.object({
  maintenanceRequirement: z.string().min(2, 'maintenanceRequirement is required'),
  requiredSkill: z.string().optional(),
  location: z.string().optional(),
  requiredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'requiredDate must be YYYY-MM-DD').optional(),
  maxDistance: z.number().min(0).optional(),
});
