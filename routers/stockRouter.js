import express from 'express';
import { userAuth } from '../middleware/userAuth.js';
import { createStock, getAllStocks, getStockByMedicine, sellStock } from '../controllers/stockController.js';


const stockRouter = express.Router();

stockRouter.post('/stock-create', userAuth, createStock);
stockRouter.post('/stock-sell', userAuth, sellStock);
stockRouter.post('/stock-by-medicine', userAuth, getStockByMedicine);
stockRouter.get('/stock-all', userAuth, getAllStocks);

export default stockRouter;