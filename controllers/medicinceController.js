import companyModel from "../models/Company.js";
import medicineModel from "../models/Medicine.js";

export const createMedicine = async (req, res) => {
    const userId = req.userId
    const { medicines } = req.body;
    try {
        if (!Array.isArray(medicines) || medicines.length === 0) {
            return res.status(400).json({ message: "Medicine required" });
        }
        
        const companyIds = [...new Set(medicines.map(m => m.company))];
        const companies = await companyModel.find({_id:{$in:companyIds}});
        if (companies.length !== companyIds.length) {
            return res.status(400).json({ message: "Invalid company" });
        }

        const medicinesData = medicines.map(m => ({
            owner: userId,
            name: m.name,
            price: m.price,
            company: m.company
        }));


        const newMedicine = await medicineModel.insertMany(medicinesData);


        for (const company of companies) {
            const relatedMedicines = newMedicine.filter(m => m.company.toString() === company._id.toString());

            company.medicines.push(...relatedMedicines.map(m => m._id));
            await company.save();
            
        }

        res.status(201).json({ message: "Medicines added" }, {success: true});

    } catch (error) {
        console.log(error, 'medicine creation error');
        res.status(500).json({ message: 'Server error' });
    }
}

export const getMedicines = async (req, res) => {
    const userId = req.userId;
    try {
        const medicines = await medicineModel.find({owner: userId}).populate('company' , 'name');
        res.status(200).json({ message: "Medicines retrieved successfully", medicines });
    } catch (error) {
        console.log(error, 'medicine retrieval error');
        res.status(500).json({ message: 'Server error' });
    }
}