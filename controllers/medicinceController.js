import companyModel from "../models/Company.js";
import medicineModel from "../models/Medicine.js";

export const createMedicine = async (req, res) => {
    const { name, price, stock, company } = req.body;
    try {
        if (!name  || !price || !stock || !company) {
            return res.status(400).json({ message: "Medicine required" });
        }
        const companyId = await companyModel.findById(company);
        if (!companyId) {
            return res.status(400).json({ message: "Invalid company" });
        }
        const newMedicine = new medicineModel({
            name,
            price,
            stock,
            company
        });
        
        await newMedicine.save();
        companyId.medicines.push(newMedicine._id);
        await companyId.save();

        res.status(201).json({ message: "Medicines added" }, {success: true});

    } catch (error) {
        console.log(error, 'medicine creation error');
        res.status(500).json({ message: 'Server error' });
    }
}