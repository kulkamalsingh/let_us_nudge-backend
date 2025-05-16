import express from 'express';
import { addTable, createStaff } from '../controllers/table.controller.js';

const router = express.Router();

router.post('/add-table', addTable); // already working
router.post('/create-staff', createStaff); // ✅ Staff API route

export default router;
