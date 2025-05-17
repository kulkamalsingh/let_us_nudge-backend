// models/Table.js
import mongoose from "mongoose";

const TableSchema = new mongoose.Schema({
  // table_id: {
  //   type: String,
  //   required: true,
  //   unique: true
  // },
  table_code: {
    type: String,
    required: true
  },
  table_location: {
    type: String,
    required: true
  },
  table_capacity: {
    type: Number,
    default: 4
  },
  business_id: {
    type: String,
    required: true
  },
  offer_amount:{
    type: String,
    default: null

  },
  offer_percent:{
    type: String,
    default: null

  },
  nudge_active: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Number,
    default: Date.now
  }
});

// Create a compound index on table_code and business_id to ensure uniqueness
TableSchema.index({ table_code: 1, business_id: 1 }, { unique: true });

export default mongoose.model('Table', TableSchema);