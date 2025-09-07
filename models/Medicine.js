import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
    name: String,
    price: Number,
    stock: Number,
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  } , { timestamps: true });

const medicineModel = mongoose.models.Medicine || mongoose.model('Medicine', medicineSchema);

export default medicineModel;