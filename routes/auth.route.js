import express from 'express';
import { Login, sendotp, Signup, Signupcustomer, verifyotp } from '../controllers/auth.controller.js';
const router = express.Router();

router.post('/signup',Signup);
router.post('/login',Login);
router.post('/sendotp',Signupcustomer)
router.post('/send-otp',sendotp)
router.post('/verify-otp',verifyotp)


export default router;