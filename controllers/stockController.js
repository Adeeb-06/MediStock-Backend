import medicineModel from "../models/Medicine.js";
import stockModel from "../models/Stock.js";
import purchaseStockModel from "../models/PurchaseStocks.js";
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

        const newStock = await stockModel.insertMany(stocks.map(s => ({ owner: userId, medicine: s.medicine, quantity: s.quantity, totalPrice: s.totalPrice, expiryDate: s.expiryDate })));
        const purchaseStocks = await purchaseStockModel.insertMany(stocks.map(s => ({ owner: userId, medicine: s.medicine, quantity: s.quantity, totalPrice: s.totalPrice, expiryDate: s.expiryDate })));
        

        for (const stock of newStock) {
            const medicine = medicines.find(m => m._id.toString() === stock.medicine.toString());
          if(medicine) {
            medicine.stocks.push(stock._id);
            medicine.stockNumber = stock.quantity;
            await medicine.save();
          }
        }
   ;

        res.status(201).json({ message: "Stock added" }, { success: true });

    } catch (error) {
        console.log(error, 'stock creation error');
        res.status(500).json({ message: 'Server error' });
    }
}




export const sellStock = async (req, res) => {
    const userId = req.userId;
    const { medicineId, quantity } = req.body;

    try {
        const medicine = await medicineModel.findById(medicineId).populate('stocks');
        if (!medicine) {
            return res.status(400).json({ message: "Invalid medicine" });
        }

        const totalAvailable = medicine.stocks.reduce((sum, s) => sum + s.quantity, 0);
        if (totalAvailable < quantity) {
            return res.status(400).json({ 
                message: `Only ${totalAvailable} stocks are available, you requested ${quantity}.` 
            });
        }

        const sortedStocks = medicine.stocks.sort((a, b) => a.expiryDate - b.expiryDate);

        let remainingQuantity = quantity;
        const soldStocks = []; // will only contain the stock batches used

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

            // only add the stock that was touched in this sale
            if(soldFromThisStock > 0){

                soldStocks.push({
                    soldBy: userId,
                    medicineId: medicine._id,
                    soldQuantity: soldFromThisStock,
                    stockId: stock._id,
                });
            }

        }

        
        if(soldStocks.length > 0){
            const sales = await salesModel.insertMany(soldStocks);
        }


        console.log(soldStocks)
        medicine.stockNumber -= quantity;
        await medicine.save();

        res.status(200).json({ 
            message: `${quantity} stock sold successfully.`,
            soldStocks // 👈 only affected stocks are returned
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