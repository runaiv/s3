import AuthController from '../../controllers/AuthController'
import { Router } from 'express'

const router = Router()

router.post('/login', AuthController.login)
router.post('/signup', AuthController.signup)
router.post('/forgotpassword', AuthController.forgotPassword)
router.post('/resetpass', AuthController.resetPassword)


export default router;