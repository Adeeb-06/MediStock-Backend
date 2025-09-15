import express from 'express';
import { createCompany, getAllCompanies, getCompanyById, updateCompany } from '../controllers/companyController.js';
import { userAuth } from '../middleware/userAuth.js';


const companyRouter = express.Router()

companyRouter.post('/company-create', userAuth, createCompany)
companyRouter.get('/all-companies',userAuth, getAllCompanies)
companyRouter.post('/company-by-id', userAuth, getCompanyById)
companyRouter.post('/company-update', userAuth, updateCompany)

export default companyRouter;