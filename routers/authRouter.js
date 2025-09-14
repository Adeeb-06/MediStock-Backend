import express from 'express';
import { signUp , signIn, signOut, isAuthenticated, getPharmacyById } from '../controllers/authController.js';
import { userAuth } from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post('/signup', signUp);
authRouter.post('/signin', signIn);
authRouter.post('/signout', signOut)
authRouter.get('/isAuthenticated',userAuth , isAuthenticated)
authRouter.post('/pharmacy-by-id', userAuth, getPharmacyById)

export default authRouter;
