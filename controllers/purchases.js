const InventoriesData = require('../models/inventories');
const PurchaseData = require('../models/purchases');
module.exports.home = async function(req, res){
    let inventory;
    try{
        inventory = await InventoriesData.find({}).distinct('Name');
    }catch(err){
        console.log(err + 'unable to find Inventories')
    }
    return res.render('purchases', {inventory, user:req.user});
}

module.exports.purchaseHistoryHome = async function(req, res){
    let inventory = await InventoriesData.find({}).distinct('Name')
    return res.render('purchaseHistory',{user:req.user, inventory});
}

module.exports.savePurchase = async function(req, res){
    try{
        let purchases = req.body.purchases;
        for(let i=0;i<purchases.length;i++){
            let item = purchases[i].split('$');
            let expDate = item[3];
            let inventoryEntry = await InventoriesData.findOne({Name:item[0]});
            console.log(inventoryEntry);
            if(!inventoryEntry || inventoryEntry == null){
                console.log('Inside if block')
                await InventoriesData.create({
                    Name:item[0],
                });
            }
            
            await PurchaseData.create({
                Name:item[0],
                Batch:item[1],
                Price:item[2],
                Quantity:item[3],
                Bought_Date:new Date().toISOString().split('T')[0],
                Seller:item[4]
            })
        }
        return res.status(200).json({
            message:'Purchase added'
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Unable to add purchase'
        })
    }
     
}

module.exports.getPurchaseHistory = async function(req, res){
    try{
        let purchases;
        let searchType = req.query.type
        if(searchType == 'byItem'){
            purchases = await PurchaseData.find({
                Name:req.query.Item
            });
        }else if(searchType == 'byDateRange'){
            purchases = await PurchaseData.find({
                $and : [
                    {createdAt:{$gte : req.query.startDate}},
                    {createdAt : {$lte: req.query.endDate}},
                    {isCancelled:false, isValid:true}
                ]
            }).sort('createdAt');
        }else{
            return res.status(422).json({
                message:'Invalid search type'
            })
        }
        return res.status(200).json({
            purchases
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'Internal Server Error : Unable to fin purchase'
        })
    }
}

