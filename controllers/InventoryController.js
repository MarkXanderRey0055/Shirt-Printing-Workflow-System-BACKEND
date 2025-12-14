import * as InventoryModel from '../models/InventoryModels.js';

const VALID_CATEGORIES = ['t-shirt', 'polo shirt', 'jersey', 'raw materials'];

export const getAllItems = async (req, res) => {
    try {
        const items = await InventoryModel.getAllItems();
        
        res.json({
            success: true,
            data: items,
            count: items.length
        });
    } catch (error) {
        console.error('Error fetching inventory items:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch inventory items'
        });
    }
};

export const createItem = async (req, res) => {
    try {
        const { name, category, quantity, unitPrice, minStock } = req.body; 
        
        if (
            !name || 
            !category || 
            quantity === undefined || 
            unitPrice === undefined || 
            minStock === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, category, quantity, unitPrice, minStock'
            });
        }
        
        const qty = Number(quantity);
        const price = Number(unitPrice);
        const minS = Number(minStock);

        if (Number.isNaN(qty) || Number.isNaN(price) || Number.isNaN(minS)) {
            return res.status(400).json({
                success: false,
                message: 'Quantity, unitPrice, and minStock must be valid numbers'
            });
        }
        
        if (!VALID_CATEGORIES.includes(category)) {
            return res.status(400).json({
                success: false,
                message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`
            });
        }
        
        if (qty < 0 || price <= 0 || minS < 0) {
            return res.status(400).json({
                success: false,
                message: 'Quantity and minStock must be >= 0, unitPrice must be > 0'
            });
        }
        
        const itemId = await InventoryModel.createItem({
            name: name.trim(),
            category,
            quantity: qty,
            unitPrice: price,
            minStock: minS
        });
        
        res.status(201).json({
            success: true,
            message: 'Inventory item created successfully',
            data: { id: itemId }
        });
    } catch (error) {
        console.error('Error creating inventory item:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create inventory item'
        });
    }
};

export const updateItem = async (req, res) => {
    try {
        const { id } = req.params; 
        const { name, category, quantity, unitPrice, minStock } = req.body;
        
        const updateData = {};
        
        if (name !== undefined) updateData.name = name.trim();
        
        if (category !== undefined) {
            if (!VALID_CATEGORIES.includes(category)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`
                });
            }
            updateData.category = category;
        }
        
        if (quantity !== undefined) {
            const qty = Number(quantity);
            if (Number.isNaN(qty) || qty < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Quantity must be a non-negative number'
                });
            }
            updateData.quantity = qty;
        }
        
        if (unitPrice !== undefined) {
            const price = Number(unitPrice);
            if (Number.isNaN(price) || price <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Unit price must be a positive number'
                });
            }
            updateData.unitPrice = price;
        }
        
        if (minStock !== undefined) {
            const minS = Number(minStock);
            if (Number.isNaN(minS) || minS < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Min stock must be a non-negative number'
                });
            }
            updateData.minStock = minS;
        }
        
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update provided'
            });
        }
        
        const updated = await InventoryModel.updateItem(id, updateData);
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Inventory item not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Inventory item updated successfully'
        });
    } catch (error) {
        console.error('Error updating inventory item:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update inventory item'
        });
    }
};

export const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await InventoryModel.deleteItem(id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Inventory item not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Inventory item deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete inventory item'
        });
    }
};

export const getStats = async (req, res) => {
    try {
        const stats = await InventoryModel.getInventoryStats();
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching inventory stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch inventory statistics'
        });
    }
};