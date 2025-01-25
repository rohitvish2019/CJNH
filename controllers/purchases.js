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
    let inventory = await InventoriesData.find({},'Name').distinct('Name')
    let sellers = await PurchaseData.find({},'Seller').distinct('Seller');
    console.log(sellers);
    return res.render('purchaseHistory',{user:req.user, inventory, sellers});
}

module.exports.savePurchase = async function(req, res){
    try{
        let purchases = req.body.purchases;
        for(let i=0;i<purchases.length;i++){
            if(purchases[i].length > 0){
                let item = purchases[i].split('$');
                let inventoryEntry = await InventoriesData.findOne({Name:item[0]});
                console.log(inventoryEntry);
                let day = new Date().getDate().toString().padStart(2,'0')
                let month = +new Date().getMonth().toString().padStart(2,'0')
                let year = new Date().getFullYear()
                let date = year +'-'+ (month+1) +'-'+ day; 
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
                    Seller:item[4],
                    Category:item[5],
                    Bought_Date: item[6]
                })
            }else{
                continue;
            }
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
/*
function addOneDay(date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        throw new Error("Input must be a valid Date object.");
    }

    // Create a new Date object to avoid modifying the original
    const newDate = new Date(date);
    
    // Add one day
    newDate.setDate(newDate.getDate() + 1);

    // Check if the date is still within JavaScript's supported range
    if (Math.abs(newDate.getTime()) > 8.64e15) {
        throw new Error("Resulting date is out of range for JavaScript Date object.");
    }

    return newDate;
}
    */
module.exports.getPurchaseHistory = async function(req, res){
    try{
        let purchases;
        let searchType = req.query.type
        if(searchType == 'byDate'){
            if(req.query.Seller == 'All'){
                if(req.query.Item == 'All'){
                    purchases = await PurchaseData.find({
                        isCancelled:false, isValid:true,
                        Bought_Date:req.query.selectedDate,
                    }).sort('createdAt');
                }else{
                    purchases = await PurchaseData.find({
                        Name:req.query.Item,
                        Bought_Date:req.query.selectedDate,
                        isCancelled:false, 
                        isValid:true
                    }).sort('createdAt');
                }
            }else{
                if(req.query.Item == 'All'){
                    purchases = await PurchaseData.find({
                        Seller:req.query.Seller,
                        isCancelled:false, isValid:true,
                        Bought_Date:req.query.selectedDate,
                    }).sort('createdAt');
                }else{
                    purchases = await PurchaseData.find({
                        Seller:req.query.Seller,
                        Name:req.query.Item,
                        isCancelled:false,
                        isValid:true
                    }).sort('createdAt');
                }
            }
        }else if(searchType == 'byDateRange'){
            if(req.query.Seller == 'All'){
                if(req.query.Item == 'All'){
                    purchases = await PurchaseData.find({
                        $and : [
                            {Bought_Date:{$gte : req.query.startDate}},
                            {Bought_Date : {$lte: req.query.endDate}},
                            {isCancelled:false, isValid:true}
                        ]
                    }).sort('createdAt');
                }else{
                    purchases = await PurchaseData.find({
                        Name:req.query.Item,
                        $and : [
                            {Bought_Date:{$gte : req.query.startDate}},
                            {Bought_Date : {$lte: req.query.endDate}},
                            {isCancelled:false, isValid:true}
                        ]
                    }).sort('createdAt');
                }
                
            }else{
                if(req.query.Item == 'All'){
                    purchases = await PurchaseData.find({
                        Seller:req.query.Seller,
                        $and : [
                            {Bought_Date:{$gte : req.query.startDate}},
                            {Bought_Date : {$lte: req.query.endDate}},
                            {isCancelled:false, isValid:true}
                        ]
                    }).sort('createdAt');
                }else{
                    purchases = await PurchaseData.find({
                        Seller:req.query.Seller,
                        Name:req.query.Item,
                        $and : [
                            {Bought_Date:{$gte : req.query.startDate}},
                            {Bought_Date : {$lte: req.query.endDate}},
                            {isCancelled:false, isValid:true}
                        ]
                    }).sort('createdAt');
                }
            }
            
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

module.exports.cancelPurchases = async function(req, res){
    try{
        if(req.user.Role == 'Admin' || req.user.Role == 'Doctor'){
            await PurchaseData.findByIdAndDelete(req.params.id,{isCancelled:true});
            return res.status(200).json({
                message:'Purchase cancelled'
            })
        }else{
            return res.status(403).json({
                message:'Unautorized action'
            })
        }
    }catch(err){
        return res.status(500).json({
            message:'Unable to cancel purchase'
        })
    }
}