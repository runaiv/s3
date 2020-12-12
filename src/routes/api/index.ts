import { Router } from 'express'
import user from './user'
import auth from './auth'
import checkJwt from '../../middlewares/checkJwt';


//API ROUTES 
const router  = Router()

router.use('/users', checkJwt(), user)
router.use('/auth', auth);

export default router
