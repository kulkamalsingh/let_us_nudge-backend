import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  fullNumber: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 2 * 60 * 1000) // 2 minutes from now
  },
}, {
  timestamps: true
});

// Automatically delete expired OTPs after 'expiresAt'
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OTP = mongoose.model('OTP', otpSchema);
