import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
    soldBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy' },
    medicine : { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
    totalPrice: { type: Number, required: true },
    soldQuantity: { type: Number, required: true },
    stockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock' },
} , {timestamps: true});

const salesModel =  mongoose.models.Sales || mongoose.model('Sales', salesSchema)   
export default salesModel;