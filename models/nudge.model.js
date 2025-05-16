import mongoose from "mongoose";

const NudgeSchema = new mongoose.Schema(
  {
    business_logo: String,
    business_id: { type: String, required: true },
    business_name: String,

    table_id: { type: String, required: true },
    table_code: String,
    table_capacity: Number,
    table_location: String,

    email: String,
    name: String,
    phone: String,
    country_code: String,

    active: { type: Boolean, default: false },
    isManual: { type: Boolean, default: false },
    isInProgress: { type: Boolean, default: false },

    nudge_id: { type: String, required: true, unique: true },
    nudge_tracking_id: { type: String, required: true },

    offer_type: String,
    offer_value: String,
    offer_code: String,
    minInvoiceVal: String,

    restaurant_type: String,
    visit_type: String,

    scanAt: Number,
    nudgeAt: Date,
    acceptedAt: Number,
    extendedAt: Number,
    finishAt: Number,

    stage: String,
    stageLabel: String,
    success: String,
    extended: String,

    visited: { type: Boolean, default: false },
    expiry_date: Date,

    // Customer History
    customer_id: String,
    visit_date: Date,
    history_details: String,

    // Consent
    consent: { type: String, default: "pending" },
    consentAt: Number,
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Nudge", NudgeSchema);
