import express from 'express';
import { createMedicine, getMedicineById, getMedicines, updateMedicine } from '../controllers/medicinceController.js';
import { userAuth } from '../middleware/userAuth.js';

const medicineRouter = express.Router() 

medicineRouter.post('/medicine-create', userAuth, createMedicine)
medicineRouter.get('/medicines', userAuth, getMedicines)
medicineRouter.post('/medicine-by-id', userAuth, getMedicineById)
medicineRouter.post('/medicine-update', userAuth, updateMedicine)

export default medicineRouter;