import { Request, Response } from 'express';
import { RepresentativeService } from './service.js';
import {
  createRepresentativeSchema,
  updateRepresentativeSchema,
  representativeQuerySchema,
} from './validation.js';

export class RepresentativeController {
  public static getAll = (req: Request, res: Response): void => {
    try {
      const queryResult = representativeQuerySchema.safeParse(req.query);
      if (!queryResult.success) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: queryResult.error.format(),
        });
        return;
      }

      const result = RepresentativeService.getAll(queryResult.data);
      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Internal server error', message: err.message });
    }
  };

  public static getById = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const rep = RepresentativeService.getById(id);
      if (!rep) {
        res.status(404).json({ success: false, error: 'Representative not found' });
        return;
      }

      res.status(200).json({ success: true, data: rep });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Internal server error', message: err.message });
    }
  };

  public static create = (req: Request, res: Response): void => {
    try {
      const bodyResult = createRepresentativeSchema.safeParse(req.body);
      if (!bodyResult.success) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: bodyResult.error.format(),
        });
        return;
      }

      const result = RepresentativeService.create(bodyResult.data);
      if (result.conflict) {
        res.status(409).json({ success: false, error: result.error });
        return;
      }

      res.status(201).json({ success: true, data: result.representative });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Internal server error', message: err.message });
    }
  };

  public static update = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const bodyResult = updateRepresentativeSchema.safeParse(req.body);
      if (!bodyResult.success) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: bodyResult.error.format(),
        });
        return;
      }

      const result = RepresentativeService.update(id, bodyResult.data);
      if (result.notFound) {
        res.status(404).json({ success: false, error: result.error });
        return;
      }
      if (result.conflict) {
        res.status(409).json({ success: false, error: result.error });
        return;
      }

      res.status(200).json({ success: true, data: result.representative });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Internal server error', message: err.message });
    }
  };

  public static delete = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const result = RepresentativeService.delete(id);
      if (result.notFound) {
        res.status(404).json({ success: false, error: 'Representative not found' });
        return;
      }

      res.status(200).json({ success: true, message: 'Representative deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Internal server error', message: err.message });
    }
  };
}
