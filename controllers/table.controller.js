import Table from "../models/table.model.js";
import { Staff } from "../models/table.model.js"; // Importing the Staff model
import { v4 as uuidv4 } from 'uuid';

export const addTable = async (req, res) => {
    try {
        const { table_code, table_capacity, table_location, nudge_active, business_id } = req.body;

        const newTable = new Table({
            table_code,
            table_capacity,
            table_location,
            nudge_active,
            business_id,
            table_id: uuidv4(),
            active: true,
            createdAt: Date.now()
        });

        const savedTable = await newTable.save();

        res.status(201).json({
            success: true,
            message: "Business table added successfully",
            data: [savedTable]
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err.message
        });
    }
};

// New API for Staff creation
export const createStaff = async (req, res) => {
    try {
      const { name, email, country_code, phone, business_id, user_id } = req.body;
  
      const existingStaff = await Staff.findOne({ $or: [{ email }, { user_id }] });
  
      if (existingStaff) {
        return res.status(200).json({
          success: true,
          message: "Staff already exists",
          data: {
            success: [],
            failed: [req.body]
          }
        });
      }
  
      const newStaff = new Staff({
        name,
        email,
        country_code,
        phone,
        business_id,
        user_id,
        type: "staff",
        createdAt: Date.now()
      });
  
      const savedStaff = await newStaff.save();
  
      res.status(201).json({
        success: true,
        message: "Staff members created successfully",
        data: {
          success: [savedStaff],
          failed: []
        }
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: err.message
      });
    }
  };