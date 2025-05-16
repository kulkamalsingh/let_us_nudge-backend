import mongoose from 'mongoose';

// New Staff Schema for creating staff
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

const Staff = mongoose.model("Staff", staffSchema);
export default Staff;