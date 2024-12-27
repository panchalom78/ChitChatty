import express from 'express'
import {getMessages} from '../controllers/messageController.js'
import { updateProfileWithOutProfile, updateProfileWithProfile, uploadImage, uploadProfile } from '../controllers/fileUploadController.js'
import upload from '../FileHandel/Upload.js'


const router = express.Router()

router.post('/getmessage',getMessages)
router.post('/profile',upload.single('photo'),uploadProfile)
router.post('/uploadImage',upload.single('photo'),uploadImage)
router.post('/updatewithprofile',upload.single('photo'),updateProfileWithProfile)
router.post('/updatewithoutprofile',updateProfileWithOutProfile)

export default router