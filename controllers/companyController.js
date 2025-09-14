import companyModel from "../models/Company.js";

export const createCompany = async (req, res) => {
  const userId = req.userId;
  let { name } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: "Company name(s) required" });
    }

    if (!Array.isArray(name)) {
      name = [name]; 
    }

    const inserted = await companyModel.insertMany(
      name.map(n => ({ owner: userId, name: n }))
    );

    res.status(201).json({ message: "Companies added", inserted });

  } catch (error) {
    console.log(error, 'company creation error');
    res.status(500).json({ message: 'Server error' });
  }
};



export const getAllCompanies = async (req, res) => {
  const userId = req.userId;
    try {
        const companies = await companyModel.find({owner: userId}).populate('medicines');
        res.status(200).json({ message: "All companies", companies });
    } catch (error) {
        console.log(error, 'get all companies error');
        res.status(500).json({ message: 'Server error' });
    }
}

export const getCompanyById = async (req, res) => {
    const userId = req.userId;
    const { companyId } = req.body;
    try {
        const company = await companyModel.findById(companyId)
        if (!company) {
            return res.status(400).json({ message: "Invalid company" });
        }
        const medicines = await company.medicines.map(m => m.toString());
        res.status(200).json({ message: "Company retrieved successfully", company });
    } catch (error) {
        console.log(error, 'company retrieval error');
        res.status(500).json({ message: 'Server error' });
    }
}
