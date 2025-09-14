import medicineModel from "../models/Medicine.js";
import stockModel from "../models/Stock.js";
import salesModel from "../models/Sales.js";

export const createStock = async (req, res) => {
    const userId = req.userId;
    const { stocks } = req.body;

    try {
        const medicineIds = [...new Set(stocks.map(s => s.medicine))];
        const medicines = await medicineModel.find({ _id: { $in: medicineIds } });

        if (medicines.length !== medicineIds.length) {
            return res.status(400).json({ message: "Invalid medicine" });
        }

        // resolve all totalPrice calculations properly
        const enrichedStocks = await Promise.all(
            stocks.map(async (s) => {
                // const medicine = medicines.find(m => m._id.toString() === s.medicine.toString());
                const totalPrice = s.quantity * s.price;

                return {
                    owner: userId,
                    medicine: s.medicine,
                    medicinePrice: s.price,
                    quantity: s.quantity,
                    qtyCopy: s.quantity,
                    totalPrice,
                    expiryDate: s.expiryDate
                };
            })
        );

        // Insert into both collections
        const newStock = await stockModel.insertMany(enrichedStocks);
        // const purchaseStocks = await purchaseStockModel.insertMany(enrichedStocks);

        // update medicines
        for (const stock of newStock) {
            const medicine = medicines.find(m => m._id.toString() === stock.medicine.toString());
            if (medicine) {
                medicine.stocks.push(stock._id);
                medicine.stockNumber += stock.quantity; // += instead of = so it accumulates
                await medicine.save();
            }
        }

        res.status(201).json({ message: "Stock added", success: true });

    } catch (error) {
        console.log(error, 'stock creation error');
        res.status(500).json({ message: 'Server error' });
    }
};




export const sellStock = async (req, res) => {
    const userId = req.userId;
    const { stocks } = req.body; 
    // stocks example: [{ medicine: "id1", quantity: 5 }, { medicine: "id2", quantity: 3 }]

    try {
        // 1. Collect all medicine IDs
        if(!Array.isArray(stocks) || stocks.length === 0){
            return res.status(400).json({ message: "Stocks required" });
        }
        const medicineIds = [...new Set(stocks.map(s => s.medicine))];
        const medicines = await medicineModel.find({ _id: { $in: medicineIds } }).populate('stocks');

        if (medicines.length !== medicineIds.length) {
            return res.status(400).json({ message: "Invalid medicine detected" });
        }


        // 2. Process each medicine one by one
        for (const { medicine, quantity } of stocks) {
            const med = medicines.find(m => m._id.toString() === medicine);
            if (!med) continue;

            // check available
            if (med.stockNumber < quantity) {
                return res.status(400).json({
                    message: `Only ${med.stockNumber} stocks available for ${med.name}, you requested ${quantity}. Another Input Medicines Are Sold.`
                });
            }

            // sort by expiry date (FIFO)
            const sortedStocks = med.stocks.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

            let remainingQuantity = quantity;
            const soldStocks = [];

            for (const stock of sortedStocks) {
                if (remainingQuantity === 0) break;

                let soldFromThisStock = 0;

                if (stock.quantity >= remainingQuantity) {
                    stock.quantity -= remainingQuantity;
                    soldFromThisStock = remainingQuantity;
                    remainingQuantity = 0;
                } else {
                    soldFromThisStock = stock.quantity;
                    remainingQuantity -= stock.quantity;
                    stock.quantity = 0;
                }

                stock.owner = userId;
                
                await stock.save();

                if (soldFromThisStock > 0) {
                    soldStocks.push({
                        soldBy: userId,
                        medicine: med._id,
                        totalPrice: Number((stock.medicinePrice * soldFromThisStock).toFixed(2)),
                        soldQuantity: soldFromThisStock,
                        stockId: stock._id,
                    });
                }
            }

            // reduce main medicine stock
            if(med.stockNumber > 0){
                med.stockNumber -= quantity;
                await med.save();
            }
            if (soldStocks.length > 0) {
                await salesModel.insertMany(soldStocks);
                
            }
        }

        res.status(200).json({
            message: "Medicines sold successfully",
        });

    } catch (error) {
        console.log(error, 'stock selling error');
        res.status(500).json({ message: 'Server error' });
    }
};



export const getStockByMedicine = async (req, res) => {
    const userId = req.userId;
    const { medicineId } = req.body;
    try {
        const medicine = await medicineModel.findById(medicineId).populate('stocks');
        if (!medicine) {
            return res.status(400).json({ message: "Invalid medicine" });
        }
        const stocks = await stockModel.find({ owner: userId, medicine: medicine._id });
        // const stocks = medicine.stocks.filter(s => s.owner.toString() === userId.toString());
        res.status(200).json({ message: "Stock retrieved successfully", stocks });
    } catch (error) {
        console.log(error, 'stock retrieval error');
        res.status(500).json({ message: 'Server error' });
    }
}

export const getAllStocks = async (req, res) => {
    const userId = req.userId;
    try {
        const stocks = await stockModel.find({ owner: userId }).populate('medicine', 'name');
        
        res.status(200).json({ message: "All stocks retrieved successfully", stocks });
    } catch (error) {
        console.log(error, 'stock retrieval error');
        res.status(500).json({ message: 'Server error' });
    }
}


export const getSales = async (req, res) => {
    const userId = req.userId;
    try {
        const sales = await salesModel.find({ soldBy: userId }).populate('medicine', 'name');
        res.status(200).json({ message: "All sales retrieved successfully", sales });
    } catch (error) {
        console.log(error, 'sales retrieval error');
        res.status(500).json({ message: 'Server error' });
    }
}


export const deleteStock = async (req, res) => {
    const userId = req.userId;
    const { stockId } = req.body;
    try {
        const stock = await stockModel.findByIdAndDelete(stockId);
        if (!stock) {
            return res.status(400).json({ message: "Stock not found" });
        }
        res.status(200).json({ message: "Stock deleted successfully" });
    } catch (error) {
        console.log(error, 'stock deletion error');
        res.status(500).json({ message: 'Server error' });
    }
}

export const getSalesByDate = async (req, res) => {
    const userId = req.userId;
    const { startDate, endDate } = req.body;
    try {
         const start = new Date(startDate);
        const end = new Date(endDate);

        // Ensure the end date includes the whole day
        end.setHours(23, 59, 59, 999);
        const sales = await salesModel.find({ soldBy: userId, createdAt: { $gte: start, $lte: end } }).populate('medicine', 'name');
        res.status(200).json({ message: "All sales retrieved successfully", sales });
    } catch (error) {
        console.log(error, 'sales retrieval error');
        res.status(500).json({ message: 'Server error' });
    }
}