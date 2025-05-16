// model.js
const mongoose = require('mongoose');

const nudgeSchema = new mongoose.Schema({
  nudge_id: String,
  table_id: String,
  consent: String,
  consentAt: Number,
  name: String,
  email: String,
  phone: String,
  table_code: String,
  table_capacity: Number,
  business_id: String,
  business_name: String,
  restaurant_type: String,
  table_location: String,
  active: String,
  isInProgress: String,
  stageLabel: String,
  stage: String,
  isManual: String,
  acceptedAt: Number,
  scanAt: Number,
  country_code: String,
  nudge_tracking_id: String,
}, { timestamps: true });

module.exports = mongoose.model('Nudge', nudgeSchema);
