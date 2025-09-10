import express from 'express';
import { createMedicine, getMedicines } from '../controllers/medicinceController.js';
import { userAuth } from '../middleware/userAuth.js';

const medicineRouter = express.Router() 

medicineRouter.post('/medicine-create', userAuth, createMedicine)
medicineRouter.get('/medicines', userAuth, getMedicines)

export default medicineRouter;