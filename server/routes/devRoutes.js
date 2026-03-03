import express from 'express'
import { createDevUser, checkUser, loginDevUser, signupDevUser, resetPassword, sendOtp } from '../controllers/devController.js'
import { upload } from '../configs/multer.js'

const router = express.Router()

router.post('/create', createDevUser)
router.post('/signup', upload.fields([{ name: 'profile', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), signupDevUser)
router.post('/check-user', checkUser)
router.post('/login', loginDevUser)
router.post('/reset-password', resetPassword)
router.post('/send-otp', sendOtp)

export default router
