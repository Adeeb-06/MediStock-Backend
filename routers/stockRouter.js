import express from 'express';
import { userAuth } from '../middleware/userAuth.js';
import { createStock, getStockByMedicine, sellStock } from '../controllers/stockController.js';


const stockRouter = express.Router();

stockRouter.post('/stock-create', userAuth, createStock);
stockRouter.post('/stock-sell', userAuth, sellStock);
stockRouter.get('/stock-by-medicine', userAuth, getStockByMedicine);

export default stockRouter;