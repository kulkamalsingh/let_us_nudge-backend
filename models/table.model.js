import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    country_code: { type: String, required: true },
    phone: { type: String, required: true },
    business_id: { type: String, required: true },
    user_id: { type: String, required: true, unique: true },
    createdAt: { type: Number, default: Date.now },
    type: { type: String, default: 'staff' }
});

const tableSchema = new mongoose.Schema({
    table_code: { type: String, required: true },
    table_capacity: { type: Number, required: true },
    table_location: { type: String, required: true },
    nudge_active: { type: Boolean, default: false },
    business_id: { type: String, required: true },
    table_id: { type: String, required: true },
    active: { type: Boolean, default: true },
    createdAt: { type: Number, default: Date.now },
});

// Attach staffSchema as a model export too
export const Staff = mongoose.model("Staff", staffSchema);
export default mongoose.model("Table", tableSchema);
