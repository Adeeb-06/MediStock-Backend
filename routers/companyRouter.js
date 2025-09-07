import express from 'express';
import { createCompany, getAllCompanies } from '../controllers/companyController.js';


const companyRouter = express.Router()

companyRouter.post('/company-create', createCompany)
companyRouter.get('/all-companies', getAllCompanies)

export default companyRouter;