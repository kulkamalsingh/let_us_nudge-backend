// controllers/table.controller.js
import mongoose from "mongoose";
import Table from "../models/Table.js";
import { offer } from "../models/offer.model.js";

// Get all tables for a business
export const getTables = async (req, res) => {
  try {
    const { business_id } = req.query;
    
    if (!business_id) {
      return res.status(400).json({
        success: false,
        message: 'Business ID is required'
      });
    }

    // Find all tables for the given business_id
    const tables = await Table.find({ business_id });

    return res.status(200).json({
      success: true,
      message: 'Tables retrieved successfully',
      data: tables
    });
  } catch (error) {
    console.error('Error fetching tables:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch tables',
      error: error.message
    });
  }
};

// Add a new table
export const addTable = async (req, res) => {
  try {
    const { table_code, table_location, table_capacity, business_id, nudge_active } = req.body;
    
    // Validate required fields
    if (!table_code || !table_location || !business_id) {
      return res.status(400).json({
        success: false,
        message: 'Table code, location, and business ID are required'
      });
    }

    // Check if table with same code already exists for this business
    const existingTable = await Table.findOne({ table_code, business_id });
    if (existingTable) {
      return res.status(400).json({
        success: false,
        message: 'A table with this code already exists for this business'
      });
    }

    // Create new table
    const newTable = new Table({
      
      table_code,
      table_location,
      table_capacity: table_capacity || 4, // Default to 4 if not provided
      business_id,
      nudge_active: nudge_active || false,
      active: true,
      createdAt: Date.now()
    });

    // Save the table
    await newTable.save();

    return res.status(201).json({
      success: true,
      message: 'Table created successfully',
      data: [newTable] // Return as array to match frontend expectations
    });
  } catch (error) {
    console.error('Error creating table:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create table',
      error: error.message
    });
  }
};

// Update a table
export const updateTable = async (req, res) => {
  try {
    const { table_id } = req.params;
    const { table_code, table_location, table_capacity, business_id } = req.body;
    
    // Validate required fields
    if (!table_code || !table_location || !business_id) {
      return res.status(400).json({
        success: false,
        message: 'Table code, location, and business ID are required'
      });
    }

    // Check if table exists
    const table = await Table.findOne({ table_id });
    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }

    // Check if the table belongs to the specified business
    if (table.business_id !== business_id) {
      return res.status(403).json({
        success: false,
        message: 'Table does not belong to this business'
      });
    }

    // Update table
    const updatedTable = await Table.findOneAndUpdate(
      { table_id },
      { 
        table_code, 
        table_location, 
        table_capacity: table_capacity || 4 
      },
      { new: true } // Return the updated document
    );

    return res.status(200).json({
      success: true,
      message: 'Table updated successfully',
      data: updatedTable
    });
  } catch (error) {
    console.error('Error updating table:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update table',
      error: error.message
    });
  }
};

export const createOffer = async (req, res) => {
  try {
    const { table_id } = req.params;
    const { 
      offer_type,offer_amount,offer_percentage,offer_code,offer_exp 
    } = req.body;
    
   

    // Check if table exists - using MongoDB _id
    const table = await Table.findOne({ _id: table_id });
    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }

const newoffer = new offer({offer_type,offer_amount,offer_percentage,offer_code,offer_exp,table_id });
      
  await newoffer.save();

    return res.status(200).json({
      success: true,
      message: 'offer created successfully',
      data: newoffer
    });
  } catch (error) {
    console.error('Error creating offer:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create offer',
      error: error.message
    });
  }
};

// Delete tables
export const deleteTables = async (req, res) => {
  try {
    const { table_ids, business_id } = req.body;
    
    // Validate required fields
    if (!table_ids || !table_ids.length || !business_id) {
      return res.status(400).json({
        success: false,
        message: 'Table IDs and business ID are required'
      });
    }

    // Find and delete tables that match both table_id and business_id
    const result = await Table.deleteMany({
      table_id: { $in: table_ids },
      business_id
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No tables found or tables do not belong to this business'
      });
    }

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} tables deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting tables:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete tables',
      error: error.message
    });
  }
};