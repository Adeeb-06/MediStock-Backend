import express from 'express';
import { userAuth } from '../middleware/userAuth.js';
import { createStock, deleteStock, getAllStocks, getSales, getSalesByDate, getStockByMedicine, sellStock } from '../controllers/stockController.js';


const stockRouter = express.Router();

stockRouter.post('/stock-create', userAuth, createStock);
stockRouter.post('/stock-sell', userAuth, sellStock);
stockRouter.post('/stock-by-medicine', userAuth, getStockByMedicine);
stockRouter.get('/stock-all', userAuth, getAllStocks);
stockRouter.get('/sales', userAuth, getSales);
stockRouter.delete('/stock-delete', userAuth, deleteStock);
stockRouter.post('/sales-by-date', userAuth, getSalesByDate);

export default stockRouter;