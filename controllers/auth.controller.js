
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Customer } from "../models/customer.model.js";
import dotenv from 'dotenv';
import twilio from 'twilio';
import { OTP } from "../models/otp.model.js";

dotenv.config();

// Twilio Setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// -------------------SIGNUP--------------------

export const Signup = async (req, res) => {
    try {
        const { name, email, phone, role, password, country_code } = req.body;

        const isEmail = await User.findOne({ email });
        const isPhone = await User.findOne({ phone });

        if (isEmail) {
            return res.json({ userCreated: false, message: "Email already in use!" });
        } else if (isPhone) {
            return res.json({ userCreated: false, message: "Phone number already in use!" });
        }

        // TODO: Hash password before storing
        // const hashedPassword = await bcrypt.hash(password, 10);
        // const newUser = new User({ name, email, phone, role, password: hashedPassword, country_code });
        
        const newUser = new User({ name, email, phone, role, password, country_code });
        await newUser.save();

        res.status(200).json({ userCreated: true, message: "User registered successfully!" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// -------------------- SEND OTP TO CUSTOMER & REGISTER --------------------

export const sendotp = async (req, res) => {
    try {
        const { name, email, phone, country_code } = req.body;
        const fullPhone = `${country_code}${phone}`;

        const otpCode = generateOTP();

        await client.messages.create({
            body: `Your OTP is: ${otpCode}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: fullPhone,
        });

        await OTP.create({
            fullNumber: fullPhone,
            otp: otpCode,
            expiresAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
        });

        // Check if customer exists, else create
        let customer = await Customer.findOne({ phone });
        if (!customer) {
            customer = await Customer.create({
                name,
                email,
                phone,
                country_code,
                registeredAt: Date.now()
            });
        }

        res.status(200).json({
            success: true,
            message: "Customer registered successfully",
            data: {
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                country_code: customer.country_code,
                registeredAt: customer.registeredAt,
            }
        });

    } catch (error) {
        console.error("Send OTP error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// -------------------- VERIFY OTP --------------------

export const verifyotp = async (req, res) => {
    try {
        const { phone, country_code, otp } = req.body;
        const fullPhone = `${country_code}${phone}`;

        // Check if OTP record exists for the given phone and OTP
        const otpRecord = await OTP.findOne({ fullNumber: fullPhone, otp });

        console.log('OTP Record:', otpRecord); // Log OTP record from DB

        if (!otpRecord) {
            return res.status(400).json({ success: false, message: "Invalid OTP or OTP expired!" });
        }

        const currentTime = new Date();
        console.log('OTP Expiry Time:', otpRecord.expiresAt); // Log OTP expiry time
        console.log('Current Time:', currentTime); // Log current time to check expiration

        if (currentTime > otpRecord.expiresAt) {
            return res.status(400).json({ success: false, message: "OTP expired!" });
        }

        await OTP.deleteOne({ _id: otpRecord._id });

        // Fetch customer details dynamically
        const customer = await Customer.findOne({ phone });
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        // Generate JWT token dynamically
        const token = jwt.sign({
            id: customer._id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            country_code: customer.country_code,
            registeredAt: customer.registeredAt
        }, process.env.SECRET, { expiresIn: '7d' });

        return res.status(200).json({
            success: true,
            message: "Customer verified successfully",
            data: {
                data: {
                    registeredAt: customer.registeredAt,
                    email: customer.email,
                    country_code: customer.country_code,
                    name: customer.name,
                    phone: customer.phone
                },
                customerToken: token
            }
        });

    } catch (error) {
        console.error('Error:', error); // Log error details for better debugging
        res.status(500).json({ error: error.message });
    }
};

// --------------------CUSTOMER SIGNUP--------------------

export const Signupcustomer = async (req, res) => {
    try {
        const { name, email, phone, country_code } = req.body;
        const fullPhone = `${country_code}${phone}`;

        const isEmail = await Customer.findOne({ email });
        const isPhone = await Customer.findOne({ phone });

        if (isEmail) {
            return res.json({ userCreated: false, message: "Email already in use!" });
        } else if (isPhone) {
            return res.json({ userCreated: false, message: "Phone number already in use!" });
        }

        const otpCode = generateOTP();

        await client.messages.create({
            body: `Your OTP is: ${otpCode}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: fullPhone,
        });

        await OTP.create({
            fullNumber: fullPhone,
            otp: otpCode,
            expiresAt: new Date(Date.now() + 2 * 60 * 1000)
        });

        const newCustomer = new Customer({
            name,
            email,
            phone,
            country_code,
            registeredAt: Date.now()
        });

        await newCustomer.save();

        res.status(200).json({
            success: true,
            message: "Customer registered successfully",
            data: {
                name,
                email,
                phone,
                country_code,
                registeredAt: newCustomer.registeredAt
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt for:', email);

    const checkByEmail = await User.findOne({ email: email });
console.log(checkByEmail)
    const user = checkByEmail;
    console.log('User found:', user);

    if (!user) {
      console.log('User not found');
      return res.json({ isAuthenticated: false, userExisted: false, message: "User not found" });
    }

    // TODO: Use bcrypt.compare() to check password if you implement password hashing
    if (password == user.password) {
      const token = jwt.sign(
        { 
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }, 
        process.env.SECRET,
        { expiresIn: '24h' }
      );
      
      const expdate = new Date(Date.now() + 3600000);

      return res.cookie('access_token', token, {
        httpOnly: true,
        expires: expdate
      }).status(200).json({
        isAuthenticated: true,
        userExisted: true,
        message: "Login successful",
        token,  // Send token in JSON response
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    } else {
      return res.json({
        isAuthenticated: false,
        userExisted: true,
        hasError:false,
        message: "Invalid password"
      });
    }

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      isAuthenticated: false,
      hasError:true,
      message: "Authentication error",
      error: error.message
    });
  }
};

// -------------------- CUSTOMER LOGIN - SEND OTP --------------------
export const customerLoginSendOTP = async (req, res) => {
    try {
        const { phone, country_code } = req.body;
        const fullPhone = `${country_code}${phone}`;

        // Check if customer exists
        const customer = await Customer.findOne({ phone });
        if (!customer) {
            return res.status(404).json({ 
                success: false, 
                message: "Customer not found. Please register first." 
            });
        }

        // Generate and send OTP
        const otpCode = generateOTP();

        await client.messages.create({
            body: `Your login OTP is: ${otpCode}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: fullPhone,
        });

        // Delete any existing OTPs for this number
        await OTP.deleteMany({ fullNumber: fullPhone });

        // Save new OTP to database
        await OTP.create({
            fullNumber: fullPhone,
            otp: otpCode,
            expiresAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
        });

        res.status(200).json({
            success: true,
            message: "OTP sent successfully for login",
            data: {
                phone,
                country_code
            }
        });

    } catch (error) {
        console.error("Login Send OTP error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// -------------------- CUSTOMER LOGIN - VERIFY OTP --------------------
export const customerLoginVerifyOTP = async (req, res) => {
    try {
        const { phone, country_code, otp } = req.body;
        const fullPhone = `${country_code}${phone}`;

        // Check if OTP record exists for the given phone and OTP
        const otpRecord = await OTP.findOne({ fullNumber: fullPhone, otp });
        
        console.log('OTP Record:', otpRecord); // Log OTP record from DB

        if (!otpRecord) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid OTP or OTP expired!" 
            });
        }

        const currentTime = new Date();
        console.log('OTP Expiry Time:', otpRecord.expiresAt); // Log OTP expiry time
        console.log('Current Time:', currentTime); // Log current time to check expiration

        if (currentTime > otpRecord.expiresAt) {
            return res.status(400).json({ 
                success: false, 
                message: "OTP expired!" 
            });
        }

        // Delete the OTP record after successful verification
        await OTP.deleteOne({ _id: otpRecord._id });

        // Fetch customer details
        const customer = await Customer.findOne({ phone });
        if (!customer) {
            return res.status(404).json({ 
                success: false, 
                message: "Customer not found" 
            });
        }

        // Update last login time
        customer.lastLogin = Date.now();
        await customer.save();

        // Generate JWT token with appropriate claims and expiration
        const token = jwt.sign(
            {
                id: customer._id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                country_code: customer.country_code,
                registeredAt: customer.registeredAt
            }, 
            process.env.SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                customer: {
                    _id: customer._id,
                    name: customer.name,
                    email: customer.email,
                    phone: customer.phone,
                    country_code: customer.country_code,
                    registeredAt: customer.registeredAt,
                    lastLogin: customer.lastLogin
                },
                customerToken: token
            }
        });

    } catch (error) {
        console.error('Login Verify OTP error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// -------------------- RESEND OTP FOR REGISTRATION --------------------
export const resendRegistrationOTP = async (req, res) => {
    try {
        const { phone, country_code, email, name } = req.body;
        const fullPhone = `${country_code}${phone}`;

        // Check if customer exists
        const customer = await Customer.findOne({ phone });
        if (!customer && (!name || !email)) {
            return res.status(400).json({
                success: false,
                message: "Customer not found. For new registration, name and email are required."
            });
        }

        // Generate new OTP
        const otpCode = generateOTP();

        // Delete any existing OTPs for this number
        await OTP.deleteMany({ fullNumber: fullPhone });

        // Send OTP via SMS
        await client.messages.create({
            body: `Your registration OTP is: ${otpCode}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: fullPhone,
        });

        // Save new OTP to database
        await OTP.create({
            fullNumber: fullPhone,
            otp: otpCode,
            expiresAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
        });

        res.status(200).json({
            success: true,
            message: "Registration OTP resent successfully",
            data: {
                phone,
                country_code,
                name: customer ? customer.name : name,
                email: customer ? customer.email : email
            }
        });

    } catch (error) {
        console.error("Resend Registration OTP error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// -------------------- RESEND OTP FOR LOGIN --------------------
export const resendLoginOTP = async (req, res) => {
    try {
        const { phone, country_code } = req.body;
        const fullPhone = `${country_code}${phone}`;

        // Check if customer exists
        const customer = await Customer.findOne({ phone });
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found. Please register first."
            });
        }

        // Generate new OTP
        const otpCode = generateOTP();

        // Delete any existing OTPs for this number
        await OTP.deleteMany({ fullNumber: fullPhone });

        // Send OTP via SMS
        await client.messages.create({
            body: `Your login OTP is: ${otpCode}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: fullPhone,
        });

        // Save new OTP to database
        await OTP.create({
            fullNumber: fullPhone,
            otp: otpCode,
            expiresAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
        });

        res.status(200).json({
            success: true,
            message: "Login OTP resent successfully",
            data: {
                phone,
                country_code
            }
        });

    } catch (error) {
        console.error("Resend Login OTP error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// Add these functions to your authentication controller file

// -------------------- FORGOT PASSWORD - SEND OTP --------------------
export const forgotPasswordSendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists with this email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found with this email address." 
            });
        }

        // Combine country code and phone for sending SMS
        const fullPhone = `${user.country_code}${user.phone}`;

        // Generate OTP
        const otpCode = generateOTP();

        // Send OTP via SMS
        await client.messages.create({
            body: `Your password reset OTP is: ${otpCode}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: fullPhone,
        });

        // Delete any existing OTPs for this user
        await OTP.deleteMany({ fullNumber: fullPhone });

        // Save new OTP to database with purpose indicator
        await OTP.create({
            fullNumber: fullPhone,
            otp: otpCode,
            purpose: 'password_reset',
            userId: user._id,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        });

        res.status(200).json({
            success: true,
            message: "Password reset OTP sent to your registered mobile number",
            data: {
                email,
                phone: user.phone.substring(user.phone.length - 4).padStart(user.phone.length, '*'), // Show only last 4 digits
            }
        });

    } catch (error) {
        console.error("Forgot Password Send OTP error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// -------------------- VERIFY OTP AND RESET PASSWORD --------------------
export const verifyOTPAndResetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found." 
            });
        }

        const fullPhone = `${user.country_code}${user.phone}`;

        // Check if OTP record exists and is valid
        const otpRecord = await OTP.findOne({ 
            fullNumber: fullPhone, 
            otp,
            purpose: 'password_reset'
        });
        
        if (!otpRecord) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid OTP or OTP expired!" 
            });
        }

        const currentTime = new Date();
        if (currentTime > otpRecord.expiresAt) {
            return res.status(400).json({ 
                success: false, 
                message: "OTP expired!" 
            });
        }

        // Delete the OTP record after verification
        await OTP.deleteOne({ _id: otpRecord._id });

        // TODO: Hash the new password before saving
        // const hashedPassword = await bcrypt.hash(newPassword, 10);
        // user.password = hashedPassword;
        
        // For now, store password directly (implement hashing in production)
        user.password = newPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully. Please login with your new password."
        });

    } catch (error) {
        console.error('Reset Password error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// -------------------- RESEND PASSWORD RESET OTP --------------------
export const resendPasswordResetOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found with this email address." 
            });
        }

        const fullPhone = `${user.country_code}${user.phone}`;

        // Generate new OTP
        const otpCode = generateOTP();

        // Delete any existing OTPs for this number
        await OTP.deleteMany({ 
            fullNumber: fullPhone,
            purpose: 'password_reset'
        });

        // Send OTP via SMS
        await client.messages.create({
            body: `Your password reset OTP is: ${otpCode}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: fullPhone,
        });

        // Save new OTP to database
        await OTP.create({
            fullNumber: fullPhone,
            otp: otpCode,
            purpose: 'password_reset',
            userId: user._id,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        });

        res.status(200).json({
            success: true,
            message: "Password reset OTP resent successfully",
            data: {
                email,
                phone: user.phone.substring(user.phone.length - 4).padStart(user.phone.length, '*'), // Show only last 4 digits
            }
        });

    } catch (error) {
        console.error("Resend Password Reset OTP error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};