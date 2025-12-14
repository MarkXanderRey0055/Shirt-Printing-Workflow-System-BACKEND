import express from 'express';
import * as InventoryController from '../controllers/InventoryController.js';

const router = express.Router();

router.get('/all', InventoryController.getAllItems);
router.get('/stats', InventoryController.getStats);
router.post('/create', InventoryController.createItem);
router.put('/:id', InventoryController.updateItem);
router.delete('/:id', InventoryController.deleteItem);
    
export default router;