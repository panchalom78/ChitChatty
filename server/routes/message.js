import express from 'express'
import {getMessages} from '../controllers/messageController.js'
import { updateProfileWithOutProfile, updateProfileWithProfile, uploadImage, uploadProfile } from '../controllers/fileUploadController.js'
import conditionalUpload from '../FileHandel/Upload.js'
import authMiddleware from '../Middlewares/authMiddleware.js'


const router = express.Router()

router.use(authMiddleware)

router.post('/getmessage',authMiddleware,getMessages)
router.post('/profile',conditionalUpload(),uploadProfile)
router.post('/uploadImage',conditionalUpload(),uploadImage)
router.post('/updatewithprofile',conditionalUpload(),updateProfileWithProfile)
router.post('/updatewithoutprofile',updateProfileWithOutProfile)

export default router