import { Request, Response } from 'express';
import { AvailabilityService } from './service.js';
import {
  createAvailabilitySchema,
  updateAvailabilitySchema,
  availabilityQuerySchema,
} from './validation.js';

export class AvailabilityController {
  public static getByProvider = (req: Request, res: Response): void => {
    try {
      const { id } = req.params; // providerId
      const queryResult = availabilityQuerySchema.safeParse(req.query);
      if (!queryResult.success) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: queryResult.error.format(),
        });
        return;
      }

      const result = AvailabilityService.getByProviderId(id, queryResult.data);
      if (result.providerNotFound) {
        res.status(404).json({ success: false, error: 'Service Provider not found' });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.data,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Internal server error', message: err.message });
    }
  };

  public static create = (req: Request, res: Response): void => {
    try {
      const { id } = req.params; // providerId
      const bodyResult = createAvailabilitySchema.safeParse(req.body);
      if (!bodyResult.success) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: bodyResult.error.format(),
        });
        return;
      }

      const result = AvailabilityService.create(id, bodyResult.data);
      if (result.providerNotFound) {
        res.status(404).json({ success: false, error: 'Service Provider not found' });
        return;
      }

      res.status(201).json({ success: true, data: result.availability });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Internal server error', message: err.message });
    }
  };

  public static update = (req: Request, res: Response): void => {
    try {
      const { id, availabilityId } = req.params;
      const bodyResult = updateAvailabilitySchema.safeParse(req.body);
      if (!bodyResult.success) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: bodyResult.error.format(),
        });
        return;
      }

      const result = AvailabilityService.update(id, availabilityId, bodyResult.data);
      if (result.notFound) {
        res.status(404).json({ success: false, error: 'Availability slot not found' });
        return;
      }

      res.status(200).json({ success: true, data: result.availability });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Internal server error', message: err.message });
    }
  };

  public static delete = (req: Request, res: Response): void => {
    try {
      const { id, availabilityId } = req.params;
      const result = AvailabilityService.delete(id, availabilityId);
      if (result.notFound) {
        res.status(404).json({ success: false, error: 'Availability slot not found' });
        return;
      }

      res.status(200).json({ success: true, message: 'Availability slot deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Internal server error', message: err.message });
    }
  };
}
