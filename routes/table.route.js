// routes/table.route.js
import express from "express";
import { getTables, addTable, updateTable, deleteTables, createOffer } from "../controllers/table.controller.js";

const router = express.Router();

// GET tables for business
router.get('/get-tables', getTables);

// POST create new table
router.post('/add-table', addTable);

// PUT update table
router.post('/create-offer/:table_id', createOffer);

// DELETE tables
router.delete('/delete-tables', deleteTables);

export default router;