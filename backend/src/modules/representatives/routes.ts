import { Router } from 'express';
import { RepresentativeController } from './controller.js';

const router = Router();

router.get('/', RepresentativeController.getAll);
router.get('/:id', RepresentativeController.getById);
router.post('/', RepresentativeController.create);
router.put('/:id', RepresentativeController.update);
router.delete('/:id', RepresentativeController.delete);

export default router;
