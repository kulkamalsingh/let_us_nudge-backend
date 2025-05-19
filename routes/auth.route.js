import express from 'express';
import { 
    Signup, 
    Login, 
    Signupcustomer, 
    sendotp, 
    verifyotp,
    customerLoginSendOTP,
    customerLoginVerifyOTP,
    resendRegistrationOTP,
    resendLoginOTP
} from '../controllers/auth.controller.js';

const router = express.Router();

// Business routes
router.post('/business/register', Signup);
router.post('/login', Login);

// Customer registration routes
router.post('/customer/register/send-otp', Signupcustomer);
router.post('/customer/register/verify-otp', verifyotp);
router.post('/customer/register/resend-otp', resendRegistrationOTP);

// General send OTP route (used for existing customer registration)
router.post('/send-otp', sendotp);

// Customer login routes
router.post('/customer/login/send-otp', customerLoginSendOTP);
router.post('/customer/login/verify-otp', customerLoginVerifyOTP);
router.post('/customer/login/resend-otp', resendLoginOTP);

export default router;