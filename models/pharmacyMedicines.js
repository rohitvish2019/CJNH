const mongoose = require('mongoose');

const PharmacyMedicine = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    genericName: { type: String, trim: true, default: '' },
    composition: { type: String, trim: true, default: '' },
    manufacturer: { type: String, trim: true, default: '' },
    category: { type: String, trim: true, default: 'Medicine' },
    strength: { type: String, trim: true, default: '' },
    packSize: { type: Number, default: 1 },
    unit: { type: String, trim: true, default: 'unit' },
    batchNumber: { type: String, trim: true, default: '' },
    expiryDate: { type: Date },
    purchasePrice: { type: Number, default: 0, min: 0 },
    sellingPrice: { type: Number, default: 0, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    reorderLevel: { type: Number, default: 0, min: 0 },
    supplier: { type: String, trim: true, default: '' },
    isActive: { type: Boolean, default: true },
    isCancelled: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});

module.exports = mongoose.model('PharmacyMedicine', PharmacyMedicine);
