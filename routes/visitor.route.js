import express from "express";
import { bulkCreateVisitors } from "../controllers/visitor.controller.js";

const router = express.Router();

router.post("/bulkCreate", bulkCreateVisitors);

export default router;
