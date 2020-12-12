import { Router } from 'express'
import UserController from '../../controllers/UserController'

const router = Router()


router.post('/', UserController.save);
router.get('/:uuid', UserController.findOne);
router.get('/', UserController.findAll);
router.put('/:uuid', UserController.update);
router.delete('/:uuid', UserController.remove);
router.delete('/', UserController.removeAll);

export default router