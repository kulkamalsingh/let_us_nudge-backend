import mongoose from "mongoose";

const VisitorSchema = new mongoose.Schema({
    PK: { type: String, required: true, unique: true },
    SK: { type: String, required: true },
    otp: { type: String },
    country_code: { type: String },
    phone: { type: String, required: true },
    email: { type: String },
    name: { type: String },
    registeredAt: { type: Number }
}, { timestamps: true });

const Visitor = mongoose.model("Visitor", VisitorSchema);

export default Visitor;
