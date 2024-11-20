const ServicesData = require('../models/servicesAndCharges');
const SalesData = require('../models/sales')
const PatientData = require('../models/patients');
const Tracker = require('../models/tracker');
const Visits = require('../models/visits')
module.exports.salesHistoryHome = function(req, res){
    try{
        return res.render('salesHistory',{user:req.user});
    }catch(err){
        return res.render('Error_500')
    }
    
}

module.exports.newPathologyBill = async function(req, res){
    try{
        let services = await ServicesData.find({}, 'Name');
        return res.render('pathologyBill', {services, user:req.user})
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
        let day = new Date().getDate()
        let month = +new Date().getMonth()
        let year = new Date().getFullYear()
        let date = year +'-'+ (month+1) +'-'+ day; 
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
            //BillDate:new Date().toISOString().split('T')[0],
            BillDate:date,
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
            return res.render('billTemplate',{bill, user:req.user})
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



module.exports.getBillsByDate = async function(req, res){
    try{
        //date to be fixed to handle all date formats
        console.log(req.query)
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


module.exports.cancelSale = async function(req, res){
    try{
        console.log(req.body)
        let sale = await SalesData.findById(req.body.saleId);
        let appointment = await Visits.findOne({SaleId:sale._id},'isCancelled')
        await sale.updateOne({isCancelled:true})
        if(appointment){
            if(appointment.VisitData && appointment.VisitData.complaint.length > 0){
                return res.status(424).json({
                    message:'Appointment already completed'
                })
            }else{
                await appointment.updateOne({isCancelled:true})
            }
        }
        return res.status(200).json({
            message:'Sales cancelled'
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Error cancelling sales'
        })
    }
}


module.exports.validateBill = async function(req , res){
    try{
        let bill = await SalesData.findOne({ReportNo:req.query.billNumber, Name:req.query.Name});
        console.log(bill)
        if(bill){
            return res.status(200).json({
                isValid : true
            })
        }else{
            return res.status(200).json({
                isValid :false
            })
        }
    }catch(err){
        return res.status(500).json({
            message:'Unable to validate bill'
        })
    }
}