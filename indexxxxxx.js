import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Import Routes
import dbconnection from "./db/dbconnection.js";
import AuthRoute from "./routes/auth.route.js";
import TableRoute from "./routes/table.route.js";
import VisitorRoute from "./routes/visitor.route.js";
import NudgeRoute from "./routes/nudge.route.js";
import CustomerRoute from "./routes/customer.route.js";
import CampaignRoute from "./routes/campaign.route.js";

dotenv.config();

const app = express();

// CORS
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/0auth", AuthRoute);
app.use("/api/tables", TableRoute);
app.use("/api/visitors", VisitorRoute);
app.use("/api/nudges", NudgeRoute);
app.use("/api/customers", CustomerRoute);
app.use("/api/campaigns", CampaignRoute);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await dbconnection(process.env.MONGO);
    console.log(`🚀 Server started at port ${PORT}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});
