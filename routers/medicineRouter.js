import express from 'express';
import { createMedicine } from '../controllers/medicinceController.js';
import { userAuth } from '../middleware/userAuth.js';

const medicineRouter = express.Router() 

medicineRouter.post('/medicine-create', userAuth, createMedicine)

export default medicineRouter;