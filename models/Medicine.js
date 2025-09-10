import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stockNumber: { type: Number, default: 0 },
    stocks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stock' }],
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  },
  { timestamps: true }
);

const medicineModel =
  mongoose.models.Medicine || mongoose.model('Medicine', medicineSchema);

export default medicineModel;
