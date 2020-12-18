import { Router } from 'express'
import user from './user'
import auth from './auth'
import s3 from './s3'
import checkJwt from '../../middlewares/checkJwt';
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })


//API ROUTES 
const router  = Router()

router.use('/myS3DATA', checkJwt(), user)
router.use('/auth', auth);
router.use('/myS3DATA', checkJwt(), s3)

export default router
