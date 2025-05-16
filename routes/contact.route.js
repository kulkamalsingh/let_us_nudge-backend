import express from 'express';
import { SubmitContactForm } from '../controllers/contact.controller.js';

const router = express.Router();

router.post('/contact-us', SubmitContactForm);


export default router;
