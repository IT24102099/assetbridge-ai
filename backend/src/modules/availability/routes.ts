import { Router } from 'express';
import { AvailabilityController } from './controller.js';

const router = Router({ mergeParams: true });

router.get('/', AvailabilityController.getByProvider);
router.post('/', AvailabilityController.create);
router.put('/:availabilityId', AvailabilityController.update);
router.delete('/:availabilityId', AvailabilityController.delete);

export default router;
