// index.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import dbconnection from "./db/dbconnection.js";
import AuthRoute from "./routes/auth.route.js";
import ContactRoute from "./routes/contact.route.js";
import ConsentRoute from "./routes/consent.route.js";  // Import using ES module syntax
import TableRoute from "./routes/table.route.js";
import VisitorRoute from "./routes/visitor.route.js";
import NudgeRoute from "./routes/nudge.route.js";




import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS config
const corsOptions = {
  origin: "*",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());






// Routes
app.use("/0auth", AuthRoute);
app.use('/contact', ContactRoute);
app.use('/consent', ConsentRoute);  // Use the consent route
app.use("/api/tables", TableRoute);
app.use("/api/visitors", VisitorRoute);
app.use("/api/nudges", NudgeRoute);





// Start server and connect to DB
app.listen(PORT, () => {
  console.log(`🚀 Server started at port ${PORT}`);
  if (!process.env.MONGO) {
    console.error("❌ MONGO environment variable not found in .env file!");
    return;
  }
  dbconnection(process.env.MONGO);
});
