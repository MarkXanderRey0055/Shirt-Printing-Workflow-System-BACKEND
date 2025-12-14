    import * as OrderModel from '../models/OrderModels.js';

    export const getAllOrders = async (req, res) => {
        try {
            const orders = await OrderModel.getAllOrders();
            
            res.json({
                success: true,
                data: orders,
                count: orders.length
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch orders'
            });
        }
    };

    export const createOrder = async (req, res) => {
        try {
            const { customer, design, items, amount, status = 'pending' } = req.body;
            
            // Validation
            if (!customer || !design || !items || !amount) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields: customer, design, items, amount'
                });
            }
            
            if (isNaN(items) || isNaN(amount)) {
                return res.status(400).json({
                    success: false,
                    message: 'Items and amount must be numbers'
                });
            }
            
            const orderId = await OrderModel.createOrder({
                customer,
                design,
                items: parseInt(items),
                amount: parseFloat(amount),
                status
            });
            
            res.status(201).json({
                success: true,
                message: 'Order created successfully',
                data: { id: orderId }
            });
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create order'
            });
        }
    };


    export const updateOrder = async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            
            if (!['pending', 'in_progress', 'completed'].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status. Must be: pending, in_progress, or completed'
                });
            }
            
            const updated = await OrderModel.updateOrderStatus(id, status);
            
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }
            
            res.json({
                success: true,
                message: 'Order status updated successfully'
            });
        } catch (error) {
            console.error('Error updating order:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update order'
            });
        }
    };

    export const deleteOrder = async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await OrderModel.deleteOrder(id);
            
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }
            
            res.json({
                success: true,
                message: 'Order deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting order:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete order'
            });
        }
    };

    export const getStats = async (req, res) => {
        try {
            const stats = await OrderModel.getOrderStats();
            
            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Error fetching order stats:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch order statistics'
            });
        }
    };