import express from 'express';
import { createCompany, getAllCompanies } from '../controllers/companyController.js';
import { userAuth } from '../middleware/userAuth.js';


const companyRouter = express.Router()

companyRouter.post('/company-create', userAuth, createCompany)
companyRouter.get('/all-companies',userAuth, getAllCompanies)

export default companyRouter;