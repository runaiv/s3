import s3Controller from '../../controllers/s3Controller'
import { Router } from 'express'
const multer  = require('multer')
import fs from 'fs'
import { extname } from 'path'


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log(req)
      const { uuid, bucketName } = req.params
      const path = `./myS3DATA/${uuid}/${bucketName}`
      fs.mkdirSync(path, { recursive: true })
      return cb(null, path)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname)
    }
  })

const upload = multer({ storage: storage })



  

const router = Router()

router.get('/:uuid/blobs', s3Controller.findAllBlobs)
router.post('/:uuid/createBucket', s3Controller.createBucket)
router.post('/:uuid/editBucket', s3Controller.editBucket)
router.delete('/:uuid/deleteBucket', s3Controller.deleteBucket)
router.head('/:uuid/checkBucket', s3Controller.checkBucket)
router.post('/:uuid/:bucketName/addBlob',upload.single('blob'), s3Controller.addBlob)
router.delete('/:uuid/:bucketName/deleteBlob', s3Controller.deleteBlob)
router.get('/:uuid/:bucketName/getBlob', s3Controller.getBlob)


export default router;