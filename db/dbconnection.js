import mongoose, { mongo } from "mongoose";

const dbconnection = async(MONGO)=>{
try {
    await mongoose.connect(MONGO);
    console.log("database connected!");
} catch (error) {
    console.log("from dbconnection",error);
}
}


export default dbconnection;