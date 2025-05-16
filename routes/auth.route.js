import express from 'express';
import { Login, sendotp, Signup, Signupcustomer, verifyotp } from '../controllers/auth.controller.js';
const router = express.Router();

router.post('/business/register',Signup);
router.post('/login',Login);
router.post('/customer/register/send-otp',Signupcustomer)
router.post('/send-otp',sendotp)
router.post('/customer/register/verify-otp',verifyotp)


export default router;