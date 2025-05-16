import Visitor from "../models/visitor.model.js";

// Bulk create visitors
export const bulkCreateVisitors = async (req, res) => {
    const visitors = req.body.visitors;

    if (!Array.isArray(visitors) || visitors.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Visitors array is required."
        });
    }

    const insertedItem = [];
    const failedItem = [];

    for (const visitor of visitors) {
        try {
            const existing = await Visitor.findOne({ PK: visitor.PK });

            if (existing) {
                failedItem.push(visitor); // Skip duplicates
            } else {
                const newVisitor = new Visitor(visitor);
                await newVisitor.save();
                insertedItem.push(visitor);
            }
        } catch (err) {
            failedItem.push(visitor);
        }
    }

    return res.status(200).json({
        success: true,
        message: "Successfully imported",
        data: {
            success: insertedItem.length,
            failed: failedItem.length,
            insertedItem,
            failedItem
        }
    });
};
