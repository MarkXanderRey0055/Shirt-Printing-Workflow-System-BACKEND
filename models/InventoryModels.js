import pool from './db.js';

export const getAllItems = async () => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                id,
                name,
                category,
                quantity,
                unit_price as unitPrice,
                min_stock as minStock,
                date as dateAdded
            FROM tblinventory 
            ORDER BY date DESC 
        `);
        return rows;
    } catch (error) {
        console.error('Error in getAllItems:', error);
        throw error;
    }
};

export const getItemById = async (id) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                id,
                name,
                category,
                quantity,
                unit_price as unitPrice,
                min_stock as minStock,
                date as dateAdded 
            FROM tblinventory 
            WHERE id = ?
        `, [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error in getItemById:', error);
        throw error;
    }
};

export const createItem = async (itemData) => {
    try {
        const { name, category, quantity, unitPrice, minStock } = itemData; 
        const dateValue = new Date().toISOString().slice(0, 10); 

        const [result] = await pool.query(`
            INSERT INTO tblinventory (name, category, quantity, unit_price, min_stock, date)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [name, category, quantity, unitPrice, minStock, dateValue]);
        
        return result.insertId;
    } catch (error) {
        console.error('Error in createItem:', error);
        throw error;
    }
};

export const updateItem = async (id, updateData) => {
    try {
        const updates = [];
        const params = [];
        
        if (updateData.name !== undefined) {
            updates.push('name = ?');
            params.push(updateData.name);
        }
        
        if (updateData.category !== undefined) {
            updates.push('category = ?');
            params.push(updateData.category);
        }
        
        if (updateData.quantity !== undefined) {
            updates.push('quantity = ?');
            params.push(updateData.quantity); 
        }
        
        if (updateData.unitPrice !== undefined) {
            updates.push('unit_price = ?');
            params.push(updateData.unitPrice); 
        }
        
        if (updateData.minStock !== undefined) {
            updates.push('min_stock = ?');
            params.push(updateData.minStock); 
        }
        
        if (updates.length === 0) {
            return false;
        }
        
        params.push(id);
        
        const query = `UPDATE tblinventory SET ${updates.join(', ')} WHERE id = ?`;
        const [result] = await pool.query(query, params);
        
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error in updateItem:', error);
        throw error;
    }
};

export const deleteItem = async (id) => {
    try {
        const [result] = await pool.query('DELETE FROM tblinventory WHERE id = ?', [id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error in deleteItem:', error);
        throw error;
    }
};

export const getInventoryStats = async () => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                COUNT(*) as total_items,
                SUM(quantity) as total_units,
                SUM(quantity * unit_price) as total_value,
                SUM(CASE WHEN quantity < min_stock THEN 1 ELSE 0 END) as low_stock_items,
                SUM(CASE WHEN quantity = 0 THEN 1 ELSE 0 END) as out_of_stock_items
            FROM tblinventory
        `);
        return rows[0];
    } catch (error) {
        console.error('Error in getInventoryStats:', error);
        throw error;
    }
};

export const searchItems = async (searchQuery, category) => {
    try {
        let query = `
            SELECT 
                id,
                name,
                category,
                quantity,
                unit_price as unitPrice,
                min_stock as minStock,
                date as dateAdded 
            FROM tblinventory 
            WHERE 1=1
        `;
        
        const params = [];
        
        if (searchQuery) {
            query += ' AND (name LIKE ? OR category LIKE ?)';
            params.push(`%${searchQuery}%`, `%${searchQuery}%`);
        }
        
        if (category && category !== 'all') {
            query += ' AND category = ?';
            params.push(category);
        }
        
        query += ' ORDER BY date DESC'; 
        
        const [rows] = await pool.query(query, params);
        return rows;
    } catch (error) {
        console.error('Error in searchItems:', error);
        throw error;
    }
};