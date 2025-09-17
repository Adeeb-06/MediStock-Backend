import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy' },
    medicine : { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
    medicinePrice: { type: Number, required: true },
    costPrice: { type: Number },
    quantity: { type: Number, required: true },
    qtyCopy: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
} , {timestamps: true});

const stockModel =  mongoose.models.Stock || mongoose.model('Stock', stockSchema)   
export default stockModel;