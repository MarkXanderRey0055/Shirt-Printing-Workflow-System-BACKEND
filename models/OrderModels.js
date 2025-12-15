import pool from './db.js';

export const getAllOrders = async () => {
    try {
        const [rows] = await pool.query(`
            SELECT * FROM reports
            ORDER BY date DESC, created_at DESC
        `);
        return rows;
    } catch (error) {
        console.error('Error in getAllOrders:', error);
        throw error;
    }
};

export const createOrder = async (orderData) => {
    try {
        const { customer, design, items, amount, status = 'pending' } = orderData;
        
        const [result] = await pool.query(`
            INSERT INTO reports (customer, design, items, amount, status, date)
            VALUES (?, ?, ?, ?, ?, CURDATE())
        `, [customer, design, parseInt(items), parseFloat(amount), status]);
        
        return result.insertId;
    } catch (error) {
        console.error('Error in createOrder:', error);
        throw error;
    }
};

export const updateOrderStatus = async (id, status) => {
    try {
        const [result] = await pool.query(
            'UPDATE reports SET status = ? WHERE orderID = ?',
            [status, id]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error in updateOrderStatus:', error);
        throw error;
    }
};

export const deleteOrder = async (id) => {
    try {
        const [result] = await pool.query('DELETE FROM reports WHERE orderID = ?', [id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error in deleteOrder:', error);
        throw error;
    }
};

export const getOrderStats = async () => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                COUNT(*) as total_orders,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
                SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_orders,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_orders,
                SUM(amount) as total_revenue
            FROM reports
        `);
        return rows[0];
    } catch (error) {
        console.error('Error in getOrderStats:', error);
        throw error;
    }
};