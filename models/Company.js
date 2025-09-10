import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy' },
    name: {
        type: String,
        required: true,
    },
    medicines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }]
});

const companyModel =  mongoose.models.Company || mongoose.model('Company', companySchema) 
export default companyModel;