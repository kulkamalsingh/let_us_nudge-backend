import express from 'express';
import { updateConsent } from '../controllers/consent.controller.js';

const router = express.Router();

router.post('/consent', updateConsent);

export default router;
