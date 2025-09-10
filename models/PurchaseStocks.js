import mongoose from "mongoose";

const purchaseStockSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy' },
    medicine : { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
} , {timestamps: true});

const purchaseStockModel =  mongoose.models.PurchaseStock || mongoose.model('PurchaseStock', purchaseStockSchema)   
export default purchaseStockModel;