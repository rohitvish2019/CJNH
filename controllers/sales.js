const BillsData = require('../models/bills')
const PatientData = require('../models/patients');
const UsersData = require('../models/users')

module.exports.salesHistoryHome = function(req, res){
    return res.render('salesHistory');
}
module.exports.addSales = async function(req, res){
    //Items should be an array and each value of array will be in below format
    //ItemName$Price$Quantity$Notes
    try{
        let Name, Age, Address, Mobile, Id
        if(req.body.PatientId){
            let patient = await PatientData.findById(req.body.PatientId);
            if(!patient || patient == null){
                return res.status(400).json({
                    message:'Invalid patient details'
                })
            }
            Name = patient.Name,
            Age = patient.Age,
            Address = patient.Address,
            Mobile = patient.Mobile,
            Id = patient._id
        }else{
            Name = req.body.Name,
            Age = req.body.Age,
            Address = req.body.Address,
            Mobile = req.body.Mobile,
            Id = null
        }
        let bill = await BillsData.create({
            Type:req.body.Type,
            Patient:Id,
            Name:Name,
            Age:Age,
            Mobile:Mobile,
            Address:Address,
            UserName:req.user.Name,
            User:req.user._id,
            BillDate:new Date().toISOString().split('T')[0],
            Total:req.body.Total,
            Items:req.body.Items
        })
    return res.status(200).json({
        message:'Bill created successfully',
        Bill_id : bill._id
    })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal Server Error : Unable to add new bill'
        })
    }
}

module.exports.cancelSale = async function(req,res){
    try{
        let bill = await BillsData.findByIdAndUpdate(req.body.id, {$set:{isCancelled:true}});
        if(bill){
            return res.status(200).json({
                message:'Bill cancelled'
            })
        }else{
            return res.status(404).json({
                message:'No bill found'
            })
        }
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal Server Error : Unable to cancel sale'
        })
    }
}

module.exports.getBillById = async function(req, res){
    let bill 
    try{
        bill = await BillsData.findById(req.body.id);
        if(bill){
            return res.status(200).json({
                message:'Bill fetched successfully',
                bill,
            })
        }else{
            return res.status(404).json({
                message:'No bill found by id',
                bill,
            })
        } 
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal Server Error : Unable to fetch bill',
        })
    }
}


module.exports.getBillsByDate = async function(req, res){
    try{
        //date to be fixed to handle all date formats
        let date = req.body.date;
        let billsList = await BillsData.find({BillDate:date, isCancelled:false, isValid:true});
        if(billsList.length > 0){
            return res.status(200).json({
                message:'Bills fetched',
                billsList
            })
        }else{
            return res.status(404).json({
                message:'No bills found on specified date'
            })
        }
    }catch(err){
        return res.status(500).json({
            message:'Internal Server Error : unable to find bills on specific date'
        })
    }
}

module.exports.getBillsByDateRange = async function(req, res){
    let bills = await BillsData.find({
        $and: [
            {createdAt:{$gte :new Date(req.query.startDate)}},
            {createdAt: {$lte : new Date(req.query.endDate)}},
            {isCancelled:false, isValid:true}
        ]
    })
}

module.exports.getAllBillsByPatient = async function(req, res){
    try{
        let bills = await BillsData.find({Patient:req.body.PatientId});
        if(bills.length > 0){
            return res.status(200).json({
                message:bills.length +' Bills fetched',
                bills
            })
        }else{
            return res.status(404).json({
                message:'No bills found for the patient'
            })
        }
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal Server Error : Unable to find bill by patient id'
        })
    }
}


module.exports.getAllBillsByUser = async function(req, res){
    let user = await UsersData.findById(req.body.id);
    try{
        let bills = await BillsData.find({User:user._id});
        if(bills.length > 0){
            return res.status(200).json({
                message:bills.length +' Bills fetched',
                bills
            })
        }else{
            return res.status(404).json({
                message:'No bills found for the patient'
            })
        }
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal Server Error : Unable to find bill by patient id'
        })
    }
}