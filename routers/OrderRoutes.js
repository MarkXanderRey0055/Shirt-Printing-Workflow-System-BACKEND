import express from 'express';
import * as OrderController from '../controllers/OrderController.js';

const router = express.Router();

router.get('/all', OrderController.getAllOrders);
router.get('/stats', OrderController.getStats);
router.post('/create', OrderController.createOrder);
router.put('/:id', OrderController.updateOrder);
router.delete('/:id', OrderController.deleteOrder);

export default router;

