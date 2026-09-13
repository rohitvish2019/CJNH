const mongoose = require('mongoose');

const PharmacyPurchase = new mongoose.Schema({
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'PharmacyMedicine' },
    name: { type: String, required: true, trim: true },
    batchNumber: { type: String, trim: true, default: '' },
    expiryDate: { type: Date },
    purchasePrice: { type: Number, default: 0, min: 0 },
    sellingPrice: { type: Number, default: 0, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    supplier: { type: String, trim: true, default: '' },
    category: { type: String, trim: true, default: 'Medicine' },
    purchasedDate: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isValid: { type: Boolean, default: true },
    isCancelled: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('PharmacyPurchase', PharmacyPurchase);
