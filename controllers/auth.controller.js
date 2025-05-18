// // controllers/authController.js

// import jwt from "jsonwebtoken";
// import { User } from "../models/user.model.js";
// import { Customer } from "../models/customer.model.js";
// import bcryptjs from 'bcryptjs';
// import dotenv from 'dotenv';
// import twilio from 'twilio';
// import { OTP } from "../models/otp.model.js";

// dotenv.config();

// // Twilio Setup
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;
// const client = twilio(accountSid, authToken);


// const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// // -------------------- USER SIGNUP --------------------

// export const Signup = async (req, res) => {
//     try {
//         const { name, email, phone, role, password, country_code } = req.body;

//         const isEmail = await User.findOne({ email });
//         const isPhone = await User.findOne({ phone });

//         if (isEmail) {
//             return res.json({ userCreated: false, message: "Email already in use!" });
//         } else if (isPhone) {
//             return res.json({ userCreated: false, message: "Phone number already in use!" });
//         }

//         const hashedPassword = bcryptjs.hashSync(password, 10);
//         const newUser = new User({ name, email, phone, role, password: hashedPassword, country_code });
//         await newUser.save();

//         res.status(200).json({ userCreated: true, message: "User registered successfully!" });

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // -------------------- SEND OTP USING TWILIO VERIFY --------------------

// export const sendotp = async (req, res) => {
//     try {
//         const { phone, country_code } = req.body;
//         const fullPhone = `${country_code}${phone}`;

       
//         const otpCode = generateOTP();
//         await client.messages.create({
//       body: `Your OTP is: ${otpCode}`,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: fullPhone,
//     });

//         await OTP.create({
//             fullNumber: fullPhone,
//             otp: otpCode,
//             expiresAt: new Date(Date.now() + 2 * 60 * 1000) // 2 minutes from now
//         });

//         res.status(200).json({
//             success: true,
//             message: `OTP sent to ${fullPhone}`,
            
//         });

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


// // -------------------- VERIFY OTP --------------------

// export const verifyotp = async (req, res) => {
//     try {
//         const { phone, country_code, otp } = req.body;
//         const fullPhone = `${country_code}${phone}`;

//         const otpRecord = await OTP.findOne({ fullNumber: fullPhone, otp });
//         if (!otpRecord) {
//             return res.status(400).json({ success: false, message: "Invalid OTP or OTP expired!" });
//         }

//         const currentTime = new Date();
//         if (currentTime > otpRecord.expiresAt) {
//             return res.status(400).json({ success: false, message: "OTP expired!" });
//         }
//         await OTP.deleteOne({ _id: otpRecord._id });
//         res.status(200).json({ success: true, message: "OTP verified successfully!" });

//     }
//     catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }


// // -------------------- CUSTOMER SIGNUP --------------------

// export const Signupcustomer = async (req, res) => {
//     try {
//         const { name, email, phone, country_code } = req.body;

//         const isEmail = await Customer.findOne({ email });
//         const isPhone = await Customer.findOne({ phone });

//         if (isEmail) {
//             return res.json({ userCreated: false, message: "Email already in use!" });
//         } else if (isPhone) {
//             return res.json({ userCreated: false, message: "Phone number already in use!" });
//         }

//         const fullPhone = `${country_code}${phone}`;
//         await client.verify.v2.services(verifySid)
//             .verifications.create({ to: fullPhone, channel: "sms" });

//         const newCustomer = new Customer({ name, email, phone, country_code });
//         await newCustomer.save();

//         res.status(200).json({ userCreated: true, message: "OTP sent successfully! Please verify." });

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // -------------------- LOGIN --------------------

// export const Login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const checkByEmail = await User.findOne({ email: email });
//         const checkByUsername = await User.findOne({ username: email });

//         if (checkByEmail || checkByUsername) {
//             const user = checkByEmail || checkByUsername;

//             if (await bcryptjs.compare(password, user.password)) {
//                 const token = jwt.sign({ id: user._id }, process.env.SECRET);
//                 const expdate = new Date(Date.now() + 3600000);

//                 return res.cookie('access_token', token, {
//                     httpOnly: true,
//                     expires: expdate
//                 }).status(200).json({
//                     isAuthenticated: true,
//                     userExisted: true,
//                     user
//                 });
//             } else {
//                 return res.json({ isAuthenticated: false, userExisted: true });
//             }
//         } else {
//             return res.json({ isAuthenticated: false, userExisted: false });
//         }

//     } catch (error) {
//         return res.json({ isAuthenticated: false });
//     }
// };


// // controllers/authController.js

// import jwt from "jsonwebtoken";
// import { User } from "../models/user.model.js";
// import { Customer } from "../models/customer.model.js";
// import bcryptjs from 'bcryptjs';
// import dotenv from 'dotenv';
// import twilio from 'twilio';
// import { OTP } from "../models/otp.model.js";

// dotenv.config();

// // Twilio Setup
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = twilio(accountSid, authToken);

// const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// // -------------------SIGNUP--------------------

// export const Signup = async (req, res) => {
//     try {
//         const { name, email, phone, role, password, country_code } = req.body;

//         const isEmail = await User.findOne({ email });
//         const isPhone = await User.findOne({ phone });

//         if (isEmail) {
//             return res.json({ userCreated: false, message: "Email already in use!" });
//         } else if (isPhone) {
//             return res.json({ userCreated: false, message: "Phone number already in use!" });
//         }

//         const hashedPassword = bcryptjs.hashSync(password, 10);
//         const newUser = new User({ name, email, phone, role, password: hashedPassword, country_code });
//         await newUser.save();

//         res.status(200).json({ userCreated: true, message: "User registered successfully!" });

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // -------------------- SEND OTP TO CUSTOMER & REGISTER --------------------

// export const sendotp = async (req, res) => {
//     try {
//         const { name, email, phone, country_code } = req.body;
//         const fullPhone = `${country_code}${phone}`;

//         const otpCode = generateOTP();

//         await client.messages.create({
//             body: `Your OTP is: ${otpCode}`,
//             from: process.env.TWILIO_PHONE_NUMBER,
//             to: fullPhone,
//         });

//         await OTP.create({
//             fullNumber: fullPhone,
//             otp: otpCode,
//             expiresAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
//         });

//         // Check if customer exists, else create
//         let customer = await Customer.findOne({ phone });
//         if (!customer) {
//             customer = await Customer.create({
//                 name,
//                 email,
//                 phone,
//                 country_code,
//                 registeredAt: Date.now()
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Customer registered successfully",
//             data: {
//                 name: customer.name,
//                 email: customer.email,
//                 phone: customer.phone,
//                 country_code: customer.country_code,
//                 registeredAt: customer.registeredAt,
//             }
//         });

//     } catch (error) {
//         console.error("Send OTP error:", error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // -------------------- VERIFY OTP --------------------

// export const verifyotp = async (req, res) => {
//     try {
//         const { phone, country_code, otp } = req.body;
//         const fullPhone = `${country_code}${phone}`;

//         // Check if OTP record exists for the given phone and OTP
//         const otpRecord = await OTP.findOne({ fullNumber: fullPhone, otp });

//         console.log('OTP Record:', otpRecord); // Log OTP record from DB

//         if (!otpRecord) {
//             return res.status(400).json({ success: false, message: "Invalid OTP or OTP expired!" });
//         }

//         const currentTime = new Date();
//         console.log('OTP Expiry Time:', otpRecord.expiresAt); // Log OTP expiry time
//         console.log('Current Time:', currentTime); // Log current time to check expiration

//         if (currentTime > otpRecord.expiresAt) {
//             return res.status(400).json({ success: false, message: "OTP expired!" });
//         }

//         await OTP.deleteOne({ _id: otpRecord._id });

//         // Fetch customer details dynamically
//         const customer = await Customer.findOne({ phone });
//         if (!customer) {
//             return res.status(404).json({ success: false, message: "Customer not found" });
//         }

//         const hardcodedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWdpc3RlcmVkQXQiOjE3NDU1MjMwNTEzOTIsIm90cCI6IjE2OTMiLCJlbWFpbCI6Imt1bGthbWFsc2luZ2gzNzM0NEBnbWFpbC5jb20iLCJjb3VudHJ5X2NvZGUiOiIrOTEiLCJuYW1lIjoiS3Vsa2FtYWwgU2luIiwicGhvbmUiOiI4OTMxOTE1NTU1IiwiaWF0IjoxNzQ1NTIzMjQ4fQ.lfbwJj4dSOqu-DZmarbpqOfTSjvLKyy_qdvBSNBPRiM";

//         return res.status(200).json({
//             success: true,
//             message: "Customer verified successfully",
//             data: {
//                 data: {
//                     registeredAt: Date.now(),
//                     otp: otp,
//                     email: customer.email,
//                     country_code: customer.country_code,
//                     name: customer.name,
//                     phone: customer.phone
//                 },
//                 customerToken: hardcodedToken
//             }
//         });

//     } catch (error) {
//         console.error('Error:', error); // Log error details for better debugging
//         res.status(500).json({ error: error.message });
//     }
// };


// // --------------------CUSTOMER SIGNUP--------------------

// export const Signupcustomer = async (req, res) => {
//     try {
//         const { name, email, phone, country_code } = req.body;
//         const fullPhone = `${country_code}${phone}`;

//         const isEmail = await Customer.findOne({ email });
//         const isPhone = await Customer.findOne({ phone });

//         if (isEmail) {
//             return res.json({ userCreated: false, message: "Email already in use!" });
//         } else if (isPhone) {
//             return res.json({ userCreated: false, message: "Phone number already in use!" });
//         }

//         const otpCode = generateOTP();

//         await client.messages.create({
//             body: `Your OTP is: ${otpCode}`,
//             from: process.env.TWILIO_PHONE_NUMBER,
//             to: fullPhone,
//         });

//         await OTP.create({
//             fullNumber: fullPhone,
//             otp: otpCode,
//             expiresAt: new Date(Date.now() + 2 * 60 * 1000)
//         });

//         const newCustomer = new Customer({
//             name,
//             email,
//             phone,
//             country_code,
//             registeredAt: Date.now()
//         });

//         await newCustomer.save();

//         res.status(200).json({
//             success: true,
//             message: "Customer registered successfully",
//             data: {
//                 name,
//                 email,
//                 phone,
//                 country_code,
//                 registeredAt: newCustomer.registeredAt
//             }
//         });

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // -------------------- LOGIN --------------------

// export const Login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const checkByEmail = await User.findOne({ email: email });
//         const checkByUsername = await User.findOne({ username: email });

//         if (checkByEmail || checkByUsername) {
//             const user = checkByEmail || checkByUsername;

//             if (await bcryptjs.compare(password, user.password)) {
//                 const token = jwt.sign({ id: user._id }, process.env.SECRET);
//                 const expdate = new Date(Date.now() + 3600000);

//                 return res.cookie('access_token', token, {
//                     httpOnly: true,
//                     expires: expdate
//                 }).status(200).json({
//                     isAuthenticated: true,
//                     userExisted: true,
//                     user
//                 });
//             } else {
//                 return res.json({ isAuthenticated: false, userExisted: true });
//             }
//         } else {
//             return res.json({ isAuthenticated: false, userExisted: false });
//         }

//     } catch (error) {
//         return res.json({ isAuthenticated: false });
//     }
// };


// controllers/authController.js
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

        // Store password directly without hashing
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

        const hardcodedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWdpc3RlcmVkQXQiOjE3NDU1MjMwNTEzOTIsIm90cCI6IjE2OTMiLCJlbWFpbCI6Imt1bGthbWFsc2luZ2gzNzM0NEBnbWFpbC5jb20iLCJjb3VudHJ5X2NvZGUiOiIrOTEiLCJuYW1lIjoiS3Vsa2FtYWwgU2luIiwicGhvbmUiOiI4OTMxOTE1NTU1IiwiaWF0IjoxNzQ1NTIzMjQ4fQ.lfbwJj4dSOqu-DZmarbpqOfTSjvLKyy_qdvBSNBPRiM";

        return res.status(200).json({
            success: true,
            message: "Customer verified successfully",
            data: {
                data: {
                    registeredAt: Date.now(),
                    otp: otp,
                    email: customer.email,
                    country_code: customer.country_code,
                    name: customer.name,
                    phone: customer.phone
                },
                customerToken: hardcodedToken
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

// -------------------- LOGIN --------------------

// export const Login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
        
//         // Debug information
//         console.log('Login attempt for:', email);
        
//         const checkByEmail = await User.findOne({ email: email });
//         // const checkByUsername = await User.findOne({ username: email });
        
//         const user = checkByEmail;
//         console.log('User found:', user); // Log user found
        
//         if (!user) {
//             console.log('User not found');
//             return res.json({ isAuthenticated: false, userExisted: false, message: "User not found" });
//         }
        
//         console.log('User found:', user.email || user.username);
        
//         // Direct password comparison without hashing
//         if (password == user.password) {
//             const token = jwt.sign({ id: user._id }, process.env.SECRET);
//             const expdate = new Date(Date.now() + 3600000);

//             return res.cookie('access_token', token, {
//                 httpOnly: true,
//                 expires: expdate
//             }).status(200).json({
//                 isAuthenticated: true,
//                 userExisted: true,
//                 message: "Login successful",
//                 user: {
//                     _id: user._id,
//                     name: user.name,
//                     email: user.email,
//                     phone: user.phone,
//                     role: user.role
//                 }
//             });
//         } else {
//             return res.json({ 
//                 isAuthenticated: false, 
//                 userExisted: true, 
//                 message: "Invalid password" 
//             });
//         }

//     } catch (error) {
//         console.error('Login error:', error);
//         return res.status(500).json({ 
//             isAuthenticated: false, 
//             message: "Authentication error", 
//             error: error.message 
//         });
//     }
// }; 

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt for:', email);

    const checkByEmail = await User.findOne({ email: email });

    const user = checkByEmail;
    console.log('User found:', user);

    if (!user) {
      console.log('User not found');
      return res.json({ isAuthenticated: false, userExisted: false, message: "User not found" });
    }

    if (password == user.password) {
      const token = jwt.sign({ id: user._id }, process.env.SECRET);
      const expdate = new Date(Date.now() + 3600000);

      return res.cookie('access_token', token, {
        httpOnly: true,
        expires: expdate
      }).status(200).json({
        isAuthenticated: true,
        userExisted: true,
        message: "Login successful",
        token,  // <-- Add this line to send token in JSON
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
        message: "Invalid password"
      });
    }

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      isAuthenticated: false,
      message: "Authentication error",
      error: error.message
    });
  }
};



