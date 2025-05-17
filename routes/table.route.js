// routes/table.route.js
import express from "express";
import { getTables, addTable, updateTable, deleteTables } from "../controllers/table.controller.js";

const router = express.Router();

// GET tables for business
router.get('/get-tables', getTables);

// POST create new table
router.post('/add-table', addTable);

// PUT update table
router.put('/update-table/:table_id', updateTable);

// DELETE tables
router.delete('/delete-tables', deleteTables);

export default router;