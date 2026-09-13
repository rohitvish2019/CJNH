const PharmacyMedicine = require('../models/pharmacyMedicines');
const PharmacyPurchase = require('../models/pharmacyPurchases');

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports.manageStockHome = function(req, res){
    return res.render('pharmacyManageStock', {user: req.user});
};

module.exports.stockHome = async function(req, res){
    try {
        const inventory = await PharmacyMedicine.find({isActive: true, isCancelled: false}, 'name').distinct('name');
        const sellers = await PharmacyPurchase.find({}, 'supplier').distinct('supplier');
        return res.render('pharmacyStock', {inventory, sellers, user: req.user});
    } catch (err) {
        console.log(err);
        return res.render('Error_500');
    }
};

module.exports.billingHome = async function(req, res){
    try {
        const inventory = await PharmacyMedicine.find({isActive: true, isCancelled: false}, 'name').distinct('name');
        return res.render('pharmacyBilling', {inventory, user: req.user});
    } catch (err) {
        console.log(err);
        return res.render('Error_500');
    }
};

module.exports.addStock = async function(req, res){
    try {
        const name = (req.body.name || '').trim();
        const batchNumber = (req.body.batchNumber || '').trim();
        const quantity = Number(req.body.quantity);
        if (!name || !Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({message: 'Medicine name and a positive whole quantity are required'});
        }

        let stock = await PharmacyMedicine.findOne({
            name,
            batchNumber,
            isActive: true,
            isCancelled: false
        });
        const existingStock = Boolean(stock);
        const previousQuantity = stock ? stock.quantity : 0;

        if (stock) {
            stock.quantity += quantity;
            await stock.save();
        } else {
            stock = await PharmacyMedicine.create({
                name,
                batchNumber,
                expiryDate: req.body.expiryDate || undefined,
                purchasePrice: req.body.purchasePrice || 0,
                sellingPrice: req.body.sellingPrice || 0,
                quantity,
                supplier: req.body.supplier,
                category: req.body.category,
                createdBy: req.user._id
            });
        }
        const purchasedDate = new Date().toISOString().slice(0, 10);
        try {
            await PharmacyPurchase.create({
                medicineId: stock._id,
                name,
                batchNumber,
                expiryDate: req.body.expiryDate || undefined,
                purchasePrice: req.body.purchasePrice || 0,
                sellingPrice: req.body.sellingPrice || 0,
                quantity,
                supplier: req.body.supplier,
                category: req.body.category,
                purchasedDate,
                createdBy: req.user._id
            });
        } catch (historyError) {
            if (existingStock) {
                stock.quantity = previousQuantity;
                await stock.save();
            } else {
                await PharmacyMedicine.deleteOne({_id: stock._id});
            }
            throw historyError;
        }
        return res.status(201).json({message: 'Stock added', stock});
    } catch (err) {
        console.log(err);
        return res.status(400).json({message: 'Unable to add stock'});
    }
};

module.exports.purchaseHistoryHome = async function(req, res){
    try {
        const inventory = await PharmacyPurchase.find({}, 'name').distinct('name');
        const suppliers = await PharmacyPurchase.find({}, 'supplier').distinct('supplier');
        return res.render('pharmacyPurchaseHistory', {inventory, suppliers, user: req.user});
    } catch (err) {
        console.log(err);
        return res.render('Error_500');
    }
};

module.exports.getPurchaseHistory = async function(req, res){
    try {
        const query = {isCancelled: false, isValid: true};
        if (req.query.name && req.query.name !== 'All') query.name = req.query.name;
        if (req.query.supplier && req.query.supplier !== 'All') query.supplier = req.query.supplier;
        if (req.query.startDate) query.purchasedDate = {$gte: req.query.startDate, $lte: req.query.endDate || req.query.startDate};
        const purchases = await PharmacyPurchase.find(query).sort({purchasedDate: -1, createdAt: -1});
        return res.status(200).json({purchases});
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: 'Unable to find pharmacy purchase history'});
    }
};

module.exports.getMedicine = async function(req, res){
    try {
        const medicine = await PharmacyMedicine.findOne({
            name: req.query.name,
            isActive: true,
            isCancelled: false,
            quantity: {$gt: 0}
        }).sort({expiryDate: 1, createdAt: 1});
        
        if (!medicine) {
            return res.status(404).json({message: 'Medicine not found in stock'});
        }

        return res.status(200).json({medicine});
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: 'Unable to find medicine'});
    }
};

module.exports.allocateMedicineStock = async function(req, res){
    try {
        const name = (req.query.name || '').trim();
        const requestedQuantity = Number(req.query.quantity);
        if (!name || !Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
            return res.status(400).json({message: 'Medicine name and a positive whole quantity are required'});
        }

        const batches = await PharmacyMedicine.find({
            name,
            isActive: true,
            isCancelled: false,
            quantity: {$gt: 0}
        }).sort({expiryDate: 1, createdAt: 1});

        const availableQuantity = batches.reduce((total, batch) => total + batch.quantity, 0);
        if (availableQuantity < requestedQuantity) {
            return res.status(400).json({message: `Only ${availableQuantity} tablets available for ${name}`});
        }

        let remainingQuantity = requestedQuantity;
        const allocations = [];
        for (const batch of batches) {
            if (remainingQuantity === 0) break;
            const quantity = Math.min(batch.quantity, remainingQuantity);
            allocations.push({
                medicineId: batch._id,
                name: batch.name,
                batchNumber: batch.batchNumber,
                expiryDate: batch.expiryDate,
                quantity,
                sellingPrice: batch.sellingPrice
            });
            remainingQuantity -= quantity;
        }

        return res.status(200).json({allocations});
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: 'Unable to allocate medicine stock'});
    }
};

module.exports.searchStock = async function(req, res){
    try {
        const name = (req.query.name || '').trim();
        if (!name) return res.status(400).json({message: 'Medicine name is required'});
        const medicines = await PharmacyMedicine.find({
            name: {$regex: escapeRegex(name), $options: 'i'},
            isActive: true,
            isCancelled: false
        }).sort({name: 1, expiryDate: 1, batchNumber: 1});
        return res.status(200).json({medicines});
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: 'Unable to search stock'});
    }
};

module.exports.addStockToBatch = async function(req, res){
    try {
        const quantity = Number(req.body.quantity);
        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({message: 'Quantity must be a positive whole number'});
        }
        const medicine = await PharmacyMedicine.findOneAndUpdate(
            {_id: req.params.id, isActive: true, isCancelled: false},
            {$inc: {quantity}},
            {new: true, runValidators: true}
        );
        if (!medicine) return res.status(404).json({message: 'Medicine batch not found'});
        return res.status(200).json({message: 'Stock added', medicine});
    } catch (err) {
        console.log(err);
        return res.status(400).json({message: 'Unable to add stock'});
    }
};
