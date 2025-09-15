import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectMongoDb from './config/mongodb.js';
import dotenv from 'dotenv';
import authRouter from './routers/authRouter.js';
import companyRouter from './routers/companyRouter.js';
import medicineRouter from './routers/medicineRouter.js';
import stockRouter from './routers/stockRouter.js';

dotenv.config({ path: '.env' });


const app = express();


connectMongoDb();


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(cors({
  origin: ['https://pharma-track-adeeb.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/api/auth', authRouter);
app.use('/api/company', companyRouter);
app.use('/api/medicine', medicineRouter);
app.use('/api/stock', stockRouter);


app.listen(8000, () => {
  console.log('Server is running on port 8000');
});