// import mongoose from 'mongoose';

// const otpSchema = new mongoose.Schema({
//   fullNumber: {
//     type: String,
//     required: true
//   },
//   otp: {
//     type: String,
//     required: true
//   },
//   expiresAt: {
//     type: Date,
//     default: () => new Date(Date.now() + 2 * 60 * 1000) // 2 minutes from now
//   },
// }, {
//   timestamps: true
// });

// // Automatically delete expired OTPs after 'expiresAt'
// otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// export const OTP = mongoose.model('OTP', otpSchema);


// models/otp.model.js
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
    purpose: {
        type: String,
        enum: ['login', 'registration', 'password_reset'],
        default: 'login'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Only required for password reset
    },
    expiresAt: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // Automatically delete records after 5 minutes
    }
});

export const OTP = mongoose.model('OTP', otpSchema);