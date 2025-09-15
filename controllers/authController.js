import pharmacyModel from "../models/Pharmacy.js";
import bcrypt from 'bcrypt';
import * as jwt from "jsonwebtoken";


export const signUp = async (req, res) => {

    const { name, address, phone, email, password } = req.body;
    try {
        if (!name || !address || !phone || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // check if user already exists
        const existingUser = await pharmacyModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new pharmacyModel({
            name,
            address,
            phone,
            email,
            password: hashedPassword
        });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' , sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax' , maxAge: 8 * 60 * 60 * 1000 }); // 8 hours

        res.status(201).json({ message: 'User created successfully' } , { success: true });

    } catch (error) {
        console.log('signUp error', error);
        res.status(500).json({ message: 'Internal server error , Signup failed' });
    }
}


export const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const user = await pharmacyModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }


        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
             return res.status(400).json({ message: 'Invalid credentials' });
        }
           
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' , sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax' , maxAge: 86400000});

        res.status(200).json({ message: 'User signed in successfully', user: { id: user._id, name: user.name, email: user.email } });
        
        
    } catch (error) {
        console.log('signIn error', error);
        res.status(500).json({ message: 'Internal server error , Login failed' });
    }
}

export const signOut = (req, res) => {
    try {
        res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' , sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax' });
        res.status(200).json({ message: 'User signed out successfully' });
    } catch (error) {
        console.log('logout error', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export const isAuthenticated = async(req, res) => {
try {
    const userId = req.userId;
    // console.log(userId)
    const user = await pharmacyModel.findById(userId);
    res.status(200).json({ message: 'User is authenticated' , user } );
} catch (error) {
    console.log('isAuthenticated error', error);
    res.status(500).json({ message: 'Internal server error' });
}
}

export const getPharmacyById = async (req, res) => {
    const userId = req.userId;
    // const { pharmacyId } = req.body;
    try {
        // console.log(pharmacyId, 'pharmacyId')
        const pharmacy = await pharmacyModel.findById(userId);
        if (!pharmacy) {
            return res.status(400).json({ message: "Invalid pharmacy" });
        }
        const medicines = await pharmacy.medicines.map(m => m.toString());
        res.status(200).json({ message: "Pharmacy retrieved successfully", pharmacy });
    } catch (error) {
        console.log(error, 'pharmacy retrieval error');
        res.status(500).json({ message: 'Server error' });
    }
}