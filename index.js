import express from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import dbconnection from "./db/dbconnection.js";
import AuthRoute from "./routes/auth.route.js";
import cors from "cors";
dotenv.config();
const app = express();
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials:true
  };
  
  app.use(cors(corsOptions));
app.use(express.json());

app.listen(5000,()=>{
    console.log("server started at port 5000");
    dbconnection(process.env.MONGO);
});

app.use('/0auth',AuthRoute);