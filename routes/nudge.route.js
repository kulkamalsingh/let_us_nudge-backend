import express from "express";
import {
  getNudgeById,
  createSampleNudge,
  customerNudgeActivate,
  extendNudge,
  getCustomerHistory,
  customerNudgeConsent,
  nudgeFinish,
  customerNudgeScan
} from "../controllers/nudge.controller.js";

const router = express.Router();

// ✅ POST: customer_nudge_get 
router.post("/customer_nudge_get", getNudgeById);

// ✅ POST: customer_nudge_manual 
router.post("/customer_nudge_manual", createSampleNudge);

// ✅ POST: customer_nudge_activation
router.post("/customer_nudge_activation", customerNudgeActivate);

// ✅ POST: customer_nudge_extend
router.post("/customer_nudge_extend", extendNudge);

// ✅ POST: customer_nudge_history (updated to POST)
router.post("/customer_nudge_history", getCustomerHistory);

// ✅ POST: Consent API
router.post("/customer_nudge_consent", customerNudgeConsent); 

// ✅ POST: Nudge Finish 
router.post('/customer_nudge_finish', nudgeFinish);

// ✅ POST: Nudge Scan
router.post("/customer_nudge_scan", customerNudgeScan);

export default router;
