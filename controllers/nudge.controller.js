import { v4 as uuidv4 } from "uuid"; // Import UUID for generating unique IDs
import NudgeModel from "../models/nudge.model.js";

// ✅ POST: Get nudge by ID (corrected version)
export const getNudgeById = async (req, res) => {
    const { nudge_id } = req.body; 
  
    try {
      const nudge = await NudgeModel.findOne({ nudge_id });
  
      if (!nudge) {
        return res.status(404).json({ success: false, message: "Nudge not found" });
      }
  
      const responseData = {
        business_logo: nudge.business_logo || "",
        extended: nudge.extended ? "true" : "false",
        table_id: nudge.table_id || "",
        email: nudge.email || "",
        name: nudge.name || "",
        table_code: nudge.table_code || "",
        active: nudge.active ? "true" : "false",
        scanAt: nudge.scanAt ? new Date(nudge.scanAt).getTime() : null,
        stageLabel: nudge.stageLabel || "",
        isInProgress: nudge.isInProgress ? "true" : "false",
        table_capacity: nudge.table_capacity || 0,
        consentAt: nudge.consentAt ? new Date(nudge.consentAt).getTime() : null,
        phone: nudge.phone || "",
        business_id: nudge.business_id || "",
        business_name: nudge.business_name || "",
        stage: nudge.stage || "",
        offer_value: nudge.offer_value ? String(nudge.offer_value) : "",
        visit_type: "", 
        nudgeAt: nudge.nudgeAt ? new Date(nudge.nudgeAt).getTime() : null,
        restaurant_type: nudge.restaurant_type || "",
        table_location: nudge.table_location || "",
        isManual: nudge.isManual ? "true" : "false",
        consent: nudge.consent ? "true" : "false",
        acceptedAt: nudge.acceptedAt ? new Date(nudge.acceptedAt).getTime() : null,
        extendedAt: nudge.extendedAt ? new Date(nudge.extendedAt).getTime() : null,
        offer_type: nudge.offer_type || "",
        country_code: nudge.country_code || "",
        nudge_id: nudge.nudge_id || "",
        nudge_tracking_id: nudge.nudge_tracking_id || "",
      };
  
      res.status(200).json({
        success: true,
        message: "Nudge details loaded successfully", 
        data: responseData,
      });
    } catch (error) {
      console.error("Error fetching nudge:", error);
      res.status(500).json({ success: false, message: "Server error", error });
    }
  };
  

// ✅ POST: Create a sample/manual nudge
export const createSampleNudge = async (req, res) => {
  try {
    console.log("Request Body: ", req.body); // Log request to debug

    const {
      business_id,
      business_name,
      business_logo,
      table_id,
      table_code,
      table_capacity,
      table_location,
      email,
      name,
      phone,
      country_code,
      offer_type,
      offer_value,
      restaurant_type
    } = req.body;

    if (!business_id || !table_id) {
      return res.status(400).json({
        success: false,
        message: "business_id and table_id are required",
      });
    }

    const nudge_id = uuidv4();
    const nudge_tracking_id = `active#${business_id}#${table_id}#${nudge_id}`;
    const e_token = uuidv4(); // If e_token is a unique identifier, generate it using uuid

    const newNudge = await NudgeModel.create({
      business_id,
      business_name,
      business_logo,
      table_id,
      table_code,
      table_capacity,
      table_location,
      email,
      name,
      phone,
      country_code,
      offer_type,
      offer_value,
      restaurant_type,
      nudge_id,
      nudge_tracking_id,
      isManual: true,
      active: true,
      isInProgress: true,
      scanAt: Date.now(),
      nudgeAt: Date.now(),
      stage: "Manual",
      stageLabel: "Manual"
    });

    const responseData = {
      business_logo: newNudge.business_logo || "",
      extended: newNudge.extended ? "true" : "false",
      table_id: newNudge.table_id || "",
      email: newNudge.email || "",
      name: newNudge.name || "",
      table_code: newNudge.table_code || "",
      active: newNudge.active ? "true" : "false",
      scanAt: new Date(newNudge.scanAt).getTime(),
      stageLabel: newNudge.stageLabel || "",
      isInProgress: newNudge.isInProgress ? "true" : "false",
      table_capacity: newNudge.table_capacity || 0,
      consentAt: newNudge.consentAt ? new Date(newNudge.consentAt).getTime() : null,
      phone: newNudge.phone || "",
      business_id: newNudge.business_id || "",
      business_name: newNudge.business_name || "",
      stage: newNudge.stage || "",
      offer_value: newNudge.offer_value ? String(newNudge.offer_value) : "",
      visit_type: "", 
      nudgeAt: new Date(newNudge.nudgeAt).getTime(),
      restaurant_type: newNudge.restaurant_type || "",
      table_location: newNudge.table_location || "",
      isManual: newNudge.isManual ? "true" : "false",
      consent: newNudge.consent ? "true" : "false",
      acceptedAt: newNudge.acceptedAt ? new Date(newNudge.acceptedAt).getTime() : null,
      extendedAt: newNudge.extendedAt ? new Date(newNudge.extendedAt).getTime() : null,
      offer_type: newNudge.offer_type || "",
      country_code: newNudge.country_code || "",
      nudge_id: newNudge.nudge_id || "",
      nudge_tracking_id: newNudge.nudge_tracking_id || "",
      e_token: e_token, 
    };

    res.status(200).json({
      success: true,
      message: "Nudge created successfully",
      data: responseData, 
    });
  } catch (error) {
    console.error("❌ createSampleNudge error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message || {},
    });
  }
};


// ✅ POST: Extend a nudge 
export const extendNudge = async (req, res) => {
  try {
    const { nudge_id } = req.body;

    if (!nudge_id) {
      return res.status(400).json({ success: false, message: "nudge_id is required" });
    }

    const nudge = await NudgeModel.findOne({ nudge_id });

    if (!nudge) {
      return res.status(404).json({ success: false, message: "Nudge not found" });
    }

    nudge.extended = true;
    nudge.extendedAt = Date.now();
    nudge.stage = "Extended";
    nudge.stageLabel = "Extended";

    await nudge.save();

    res.status(200).json({
      success: true,
      message: "Nudge extended successfully",
      data: nudge,
    });
  } catch (error) {
    console.error("Extend Nudge Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};


// ✅ POST: Get customer history
export const getCustomerHistory = async (req, res) => {
  try {
    const { email } = req.body;
    const nudges = await NudgeModel.find({ email }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "History fetched successfully",
      data: nudges,
    });
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};


// ✅ POST: Consent API
export const customerNudgeConsent = async (req, res) => {
  try {
    const { nudge_id, consent } = req.body;
    const nudge = await NudgeModel.findOne({ nudge_id });

    if (!nudge) {
      return res.status(404).json({ success: false, message: "Nudge not found" });
    }

    nudge.consent = consent;
    await nudge.save();

    res.status(200).json({
      success: true,
      message: "Nudge updated successfully",
      data: nudge,
    });
  } catch (error) {
    console.error("Error saving consent:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ✅ POST: Activate a nudge
export const customerNudgeActivate = async (req, res) => {
  try {
    const { nudge_id } = req.body;

    // Step 1: Find the current nudge
    const nudge = await NudgeModel.findOne({ nudge_id });
    if (!nudge) {
      return res.status(404).json({
        success: false,
        message: "Nudge not found",
      });
    }

    // Step 2: Activate the current nudge
    nudge.active = true;
    nudge.nudgeAt = Date.now();
    await nudge.save();

    // Step 3: Get customer history based on email
    const history = await NudgeModel.find({ email: nudge.email })
      .sort({ createdAt: -1 });

    // Step 4: Format response to match live website's response structure
    const response = {
      success: true,
      message: "Nudge details loaded successfully",
      data: history.map(item => ({
        business_logo: item.business_logo, // Assuming business_logo is part of the item
        table_id: item.table_id,
        email: item.email,
        name: item.name,
        table_code: item.table_code,
        active: item.active,
        scanAt: item.scanAt,
        stageLabel: item.stageLabel,
        isInProgress: item.isInProgress,
        table_capacity: item.table_capacity,
        phone: item.phone,
        business_id: item.business_id,
        business_name: item.business_name,
        stage: item.stage,
        offer_value: item.offer_value,
        visit_type: item.visit_type,
        nudgeAt: item.nudgeAt,
        restaurant_type: item.restaurant_type,
        table_location: item.table_location,
        isManual: item.isManual,
        acceptedAt: item.acceptedAt,
        success: item.success,
        offer_type: item.offer_type,
        finishAt: item.finishAt,
        country_code: item.country_code,
        nudge_id: item.nudge_id,
        nudge_tracking_id: item.nudge_tracking_id
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error activating nudge:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};



// ✅ POST: Finish a Nudge
export const nudgeFinish = async (req, res) => {
  try {
    const { nudge_id } = req.body;

    if (!nudge_id) {
      return res.status(400).json({ success: false, message: "nudge_id is required" });
    }

    // Find the nudge by ID
    const nudge = await NudgeModel.findOne({ nudge_id });

    if (!nudge) {
      return res.status(404).json({ success: false, message: "Nudge not found" });
    }

    // Update the nudge as completed
    nudge.active = false;
    nudge.isInProgress = false;
    nudge.stage = "Completed";
    nudge.stageLabel = "Completed";
    nudge.finishAt = Date.now();

    await nudge.save();

    
    const responseData = {
      business_logo: nudge.business_logo || "",
      table_id: nudge.table_id || "",
      email: nudge.email || "",
      name: nudge.name || "",
      table_code: nudge.table_code || "",
      active: nudge.active ? "true" : "false",
      scanAt: nudge.scanAt ? new Date(nudge.scanAt).getTime() : null,
      isInProgress: nudge.isInProgress ? "true" : "false",
      stageLabel: nudge.stageLabel || "",
      table_capacity: nudge.table_capacity || 0,
      phone: nudge.phone || "",
      business_id: nudge.business_id || "",
      business_name: nudge.business_name || "",
      stage: nudge.stage || "",
      offer_value: nudge.offer_value ? String(nudge.offer_value) : "",
      visit_type: "", 
      nudgeAt: nudge.nudgeAt ? new Date(nudge.nudgeAt).getTime() : null,
      restaurant_type: nudge.restaurant_type || "",
      table_location: nudge.table_location || "",
      isManual: nudge.isManual ? "true" : "false",
      acceptedAt: nudge.acceptedAt ? new Date(nudge.acceptedAt).getTime() : null,
      success: "",
      offer_type: nudge.offer_type || "",
      finishAt: new Date(nudge.finishAt).getTime(),
      country_code: nudge.country_code || "",
      nudge_id: nudge.nudge_id || "",
      nudge_tracking_id: nudge.nuge_tracking_id || "",
    };

    // Return the formatted response
    res.status(200).json({
      success: true,
      message: "Nudge completed successfully",
      data: responseData,
    });

  } catch (error) {
    console.error("Error finishing nudge:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ✅ POST: Nudge Scan 
// ✅ POST: Customer Nudge Scan (get by nudge_id)
export const customerNudgeScan = async (req, res) => {
  try {
    const { nudge_id } = req.body;

    const nudge = await NudgeModel.findOne({ nudge_id });

    if (!nudge) {
      return res.status(404).json({ success: false, message: "Nudge not found" });
    }

    const responseData = {
      business_logo: nudge.business_logo || "",
      table_id: nudge.table_id || "",
      email: nudge.email || "",
      name: nudge.name || "",
      table_code: nudge.table_code || "",
      active: nudge.active ? "true" : "false",
      scanAt: nudge.scanAt ? new Date(nudge.scanAt).getTime() : null,
      stageLabel: nudge.stageLabel || "",
      isInProgress: nudge.isInProgress ? "true" : "false",
      table_capacity: nudge.table_capacity || 0,
      phone: nudge.phone || "",
      business_id: nudge.business_id || "",
      business_name: nudge.business_name || "",
      stage: nudge.stage || "",
      offer_value: nudge.offer_value ? String(nudge.offer_value) : "",
      visit_type: "", 
      nudgeAt: nudge.nudgeAt ? new Date(nudge.nudgeAt).getTime() : null,
      restaurant_type: nudge.restaurant_type || "",
      table_location: nudge.table_location || "",
      isManual: nudge.isManual ? "true" : "false",
      acceptedAt: nudge.acceptedAt ? new Date(nudge.acceptedAt).getTime() : null,
      success: "",
      offer_type: nudge.offer_type || "",
      finishAt: nudge.finishAt ? new Date(nudge.finishAt).getTime() : null,
      country_code: nudge.country_code || "",
      nudge_id: nudge.nudge_id || "",
      nudge_tracking_id: nudge.nudge_tracking_id || "",
    };

    res.status(200).json({
      success: true,
      message: "Nudge activated successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error scanning nudge:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

