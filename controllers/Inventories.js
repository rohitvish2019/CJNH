const InventoriesData = require('../models/inventories');
const PurchaseData = require('../models/purchases')
module.exports.addInventory = async function(req, res){
    try{
        try{
            await InventoriesData.create({
                Name:req.body.ItemName,
                Price:req.body.Price,
                AvailableQuantity:req.body.Quantity,
                AlertQuantity:10000,
                Expirydate:new Date(req.body.expiryDate)
            })
        }catch(err){
            console.log(err)
            return res.status(500).json({
                message:'Unable to create Inventory'
            })
        }
        
        try{
            await PurchaseData.create({
                Name:req.body.Name,
                Price:req.body.Price,
                Quantity:req.body.Quantity,
            })
        }catch(err){
            return res.status(500).json({
                message:'Unable to add in purchases'
            })
        }
        return res.status(200).json({
            message:'Purchase created and Inventories added'
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal server error : Purchase or inventory update failed'
        })
    }
}

