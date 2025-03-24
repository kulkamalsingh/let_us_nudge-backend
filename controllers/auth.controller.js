
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

//sign up
export const Signup= async (req,res)=>{
    try {
        const {username,email,password} = req.body;
        const isUsername = await User.findOne({username: username});
        const isEmail = await User.findOne({email: email});
        if(isUsername)
        {
           return  res.json({
                userCreated:false,
                message:"username  already taken!"
            })
        }
        else if (isEmail) {
             return  res.json({
                userCreated:false,
                message:"email already in use!"
            })
        }

        const hashedpassword= bcryptjs.hashSync(password,10)
        const newUser = new User({username,email,password:hashedpassword});
        await newUser.save();
        res.status(200).json({
            userCreated:true
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
};

//login
export const Login= async(req,res)=>{
    try {
        const{identity,password} = req.body;
        const checkByEmail = await User.findOne({email: identity});
        const checkByUsername = await User.findOne({username: identity});
    
        if(checkByEmail || checkByUsername) 
        {  
let user = checkByEmail || checkByUsername;
        if(await bcryptjs.compare(password,user.password))
        {
           const token = jwt.sign({id:user._id},process.env.SECRET);
           
    const expdate = new Date(Date.now()+3600000);
            return res.cookie('access_token',token,{httpOnly:true,expires:expdate}).status(200).json({
                isAuthenticated:true,
                 userExisted:true,
                 user                
            })
        }
        else{
            return res.json({
                isAuthenticated:false,
                 userExisted:true,
                               
            }) 
        }
        }

        else{
            
           return res.json({
                isAuthenticated:false,
                 userExisted:false                
            })
        }
    
 
    } catch (error) {
       return res.json({
            isAuthenticated:false 
             
        })
    }

};