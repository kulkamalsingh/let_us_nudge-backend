import mongoose from 'mongoose';

const contactRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  country_code: { type: String },
  description: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('ContactRequest', contactRequestSchema);
