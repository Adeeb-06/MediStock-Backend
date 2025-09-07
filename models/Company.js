import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    // medicines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }]
});

const companyModel =  mongoose.models.company || mongoose.model('Company', companySchema) 
export default companyModel;