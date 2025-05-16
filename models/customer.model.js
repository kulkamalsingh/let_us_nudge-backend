import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    country_code:{
        type:String,
        required:true
    },
},
{timestamps:true}
);

export const Customer = mongoose.model("foodlover",userSchema);
