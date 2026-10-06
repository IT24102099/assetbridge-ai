import { Router } from 'express';
import { ProviderController } from './controller.js';

const router = Router();

router.get('/search', ProviderController.searchMatching);
router.get('/', ProviderController.getAll);
router.get('/:id', ProviderController.getById);
router.post('/', ProviderController.create);
router.put('/:id', ProviderController.update);
router.delete('/:id', ProviderController.delete);

export default router;
