import companyModel from "../models/Company.js";

export const createCompany = async (req, res) => {
    const { name } = req.body;
    try {
        if (!name) {
            return res.status(400).json({ message: "Companie required" });
        }

        const inserted = await companyModel.insertMany(name.map(n => ({ name: n }), { ordered: false }));

        res.status(201).json({ message: "Companies added", inserted });

    } catch (error) {
        console.log(error, 'company creation error');
        res.status(500).json({ message: 'Server error' });
    }
}


export const getAllCompanies = async (req, res) => {
    try {
        const companies = await companyModel.find();
        res.status(200).json({ message: "All companies", companies });
    } catch (error) {
        console.log(error, 'get all companies error');
        res.status(500).json({ message: 'Server error' });
    }
}
