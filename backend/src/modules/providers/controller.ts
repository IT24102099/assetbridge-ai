import { Request, Response } from 'express';
import { ProviderService } from './service.js';
import {
  createProviderSchema,
  updateProviderSchema,
  providerQuerySchema,
  providerSearchCriteriaSchema,
} from './validation.js';

export class ProviderController {
  public static getAll = (req: Request, res: Response): void => {
    try {
      const queryResult = providerQuerySchema.safeParse(req.query);
      if (!queryResult.success) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: queryResult.error.format(),
        });
        return;
      }

      const result = ProviderService.getAll(queryResult.data);
      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Internal server error', message: err.message });
    }
  };

  public static searchMatching = (req: Request, res: Response): void => {
    try {
      const queryResult = providerSearchCriteriaSchema.safeParse(req.query);
      if (!queryResult.success) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: queryResult.error.format(),
        });
        return;
      }

      const matches = ProviderService.searchAndMatch(queryResult.data);
      res.status(200).json({
        success: true,
        data: matches,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Internal server error', message: err.message });
    }
  };

  public static getById = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const provider = ProviderService.getById(id);
      if (!provider) {
        res.status(404).json({ success: false, error: 'Service Provider not found' });
        return;
      }

      res.status(200).json({ success: true, data: provider });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Internal server error', message: err.message });
    }
  };

  public static create = (req: Request, res: Response): void => {
    try {
      const bodyResult = createProviderSchema.safeParse(req.body);
      if (!bodyResult.success) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: bodyResult.error.format(),
        });
        return;
      }

      const result = ProviderService.create(bodyResult.data);
      if (result.conflict) {
        res.status(409).json({ success: false, error: result.error });
        return;
      }

      res.status(201).json({ success: true, data: result.provider });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Internal server error', message: err.message });
    }
  };

  public static update = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const bodyResult = updateProviderSchema.safeParse(req.body);
      if (!bodyResult.success) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: bodyResult.error.format(),
        });
        return;
      }

      const result = ProviderService.update(id, bodyResult.data);
      if (result.notFound) {
        res.status(404).json({ success: false, error: result.error });
        return;
      }
      if (result.conflict) {
        res.status(409).json({ success: false, error: result.error });
        return;
      }

      res.status(200).json({ success: true, data: result.provider });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Internal server error', message: err.message });
    }
  };

  public static delete = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const result = ProviderService.delete(id);
      if (result.notFound) {
        res.status(404).json({ success: false, error: 'Service Provider not found' });
        return;
      }

      res.status(200).json({ success: true, message: 'Service Provider deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Internal server error', message: err.message });
    }
  };
}
