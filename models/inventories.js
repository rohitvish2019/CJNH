const mongoose = require('mongoose');
const Inventories = new mongoose.Schema({
    Name:String,
},
{
    timestamps:true
});

const Inventory = mongoose.model('Inventory', Inventories);
module.exports = Inventory;