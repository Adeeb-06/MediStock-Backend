import mongoose from 'mongoose';

const pharmacySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    medicines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }]
});

const pharmacyModel =  mongoose.models.pharmacy || mongoose.model('Pharmacy', pharmacySchema) 
export default pharmacyModel;