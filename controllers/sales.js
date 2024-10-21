const ServicesData = require('../models/servicesAndCharges');
const SalesData = require('../models/sales')
const PatientData = require('../models/patients');
const Tracker = require('../models/tracker')
module.exports.salesHistoryHome = function(req, res){
    try{
        return res.render('salesHistory');
    }catch(err){
        return res.render('Error_500')
    }
    
}

module.exports.newPathologyBill = async function(req, res){
    try{
        let services = await ServicesData.find({}, 'Name');
        return res.render('pathologyBill', {services})
    }catch(err){
        return res.render('Error_500')
    }
}



module.exports.addSales = async function(req, res){
    //Items should be an array and each value of array will be in below format
    //ItemName$Quantity$Price$Notes
    try{
        let Name, Age, Address, Mobile, Id, Gender, Patient
        if(req.body.id){
            console.log('Getting by id')
            let patient = await PatientData.findOne({Id:req.body.id});
            if(!patient || patient == null){
                return res.status(400).json({
                    message:'Invalid patient details'
                })
            }
            Name = patient.Name,
            Age = patient.Age,
            Address = patient.Address,
            Mobile = patient.Mobile,
            Id = patient.Id
            Gender = patient.Gender
            Patient = patient._id
        }else{
            console.log('Getting by req body')
            console.log(req.body)
            Name = req.body.patient.Name,
            Age = req.body.patient.Age,
            Address = req.body.patient.Address,
            Mobile = req.body.patient.Mobile,
            Gender = req.body.patient.Gender
            Id = null,
            Patient = null
        }

        let tracker = await Tracker.findOne({});
        let PathologyBillNo = +tracker.PathologyBillNo + 1
        let sale = await SalesData.create({
            Patient:Id,
            Name:Name,
            Age:Age,
            Mobile:Mobile,
            Gender:Gender,
            Address:Address,
            PatiendID:Id,
            type:'Pathology',
            ReportNo:"PATH"+PathologyBillNo,
            Patient:Patient,
            UserName:req.user.Name,
            User:req.user._id,
            BillDate:new Date().toISOString().split('T')[0],
            Total:req.body.Total,
            Items:req.body.Items,
        })
        await tracker.updateOne({PathologyBillNo:PathologyBillNo});
    return res.status(200).json({
        message:'Bill created successfully',
        Bill_id : sale._id
    })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal Server Error : Unable to add new bill'
        })
    }
}


module.exports.getBillById = async function(req, res){
    let bill 
    try{
        console.log(req.params.id);
        bill = await SalesData.findOne({_id:req.params.id});
        
        if(bill && req.xhr){
            return res.status(200).json({
                bill
            })
        }else if(bill && !req.xhr){
            return res.render('billTemplate',{bill})
        }
        else if(req.xhr && (!bill || bill == null)){
            return res.status(404).json({
                message:'No bill found'
            })
        }
        else{
            return res.render('Error_404')
        } 
    }catch(err){
        console.log(err)
        return res.render('Error_500')
    }
}
/*
Unused functions

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

*/


module.exports.getBillsByDate = async function(req, res){
    try{
        //date to be fixed to handle all date formats
        let date = req.query.selectedDate;
        console.log(req.query)
        let billsList = await SalesData.find({BillDate:date,type:req.query.BillType, isCancelled:false, isValid:true});
        return res.status(200).json({
            message:'Bills fetched',
            billsList
        })
       
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal Server Error : unable to find bills on specific date'
        })
    }
}

module.exports.getBillsByDateRange = async function(req, res){
    try{
        let billsList = await SalesData.find({
            $and: [
                {createdAt:{$gte :new Date(req.query.startDate)}},
                {createdAt: {$lte : new Date(req.query.endDate)}},
                {type:req.query.BillType,isCancelled:false, isValid:true}
            ]
        })
        
        return res.status(200).json({
            message:'Bills fetched',
            billsList
        })
        
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal Server Error : unable to find bills on specific dates'
        })
    }
}

/*
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

*/