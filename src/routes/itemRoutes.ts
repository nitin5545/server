import express from 'express';
import * as itemController from '../controllers/itemController';

const router = express.Router();

router.get('/items', itemController.getItems);
router.post('/items', itemController.createItem);
router.put('/items/updateItems', itemController.updateItems);
router.put('/items/:id', itemController.updateItem);
router.delete('/items/:id', itemController.deleteItem);


export default router;