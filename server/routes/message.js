import express from 'express'
import {getMessages} from '../controllers/messageController.js'
import { updateProfileWithOutProfile, updateProfileWithProfile, uploadImage, uploadProfile } from '../controllers/fileUploadController.js'
import conditionalUpload from '../FileHandel/Upload.js'


const router = express.Router()

router.post('/getmessage',getMessages)
router.post('/profile',conditionalUpload(),uploadProfile)
router.post('/uploadImage',conditionalUpload(),uploadImage)
router.post('/updatewithprofile',conditionalUpload(),updateProfileWithProfile)
router.post('/updatewithoutprofile',updateProfileWithOutProfile)

export default router