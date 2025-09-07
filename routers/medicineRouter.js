import express from 'express';
import { createMedicine } from '../controllers/medicinceController.js';

const medicineRouter = express.Router() 

medicineRouter.post('/medicine-create', createMedicine)

export default medicineRouter;