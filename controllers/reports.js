const PatientData = require('../models/patients');
const ReportsData = require('../models/reports');
const Tracker = require('../models/tracker');
const ServicesData = require('../models/servicesAndCharges');
const SalesData = require('../models/sales')
const VisitData = require('../models/visits')
const BirthData = require('../models/birthCertificates')

module.exports.PathalogyHome = async function(req, res){
    try{
        let patient = await PatientData.findById(req.params.id);
        let services = await ServicesData.find({});
        return res.render('pathalogyHome', {patient, services, billId:req.query.bill, user:req.user});
    }catch(err){
        console.log(err);
        return res.render('Error_500')
    }
}

module.exports.PathalogyHomeEmpty = async function(req, res){
    try{
        let services = await ServicesData.find({});
        return res.render('pathalogyHomeEmpty', {services, user:req.user})
    }catch(err){
        console.log(err);
        return res.render('Error_500')
    }
}

module.exports.saveServicesUpdates = async function(req, res){
    try{
        console.log(req.body)
        await ServicesData.findByIdAndUpdate(req.body.id,{Price:req.body.Price})
        return res.status(200).json({
            message:'Price updated successfully'
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal Server Error : Unable to Update Price'
        })
    }
}

module.exports.addServicesData = async function(req, res){
    try{
        if(req.user.Role == 'Admin'){
            let service = await ServicesData.create({
                Name:req.body.Name,
                Price:req.body.Price,
                Category:req.body.Category,
                RefRangeMax:req.body.RefRangeMax,
                RefRangeMin:req.body.RefRangeMin,
                RefRangeUnit:req.body.RefRangeUnit,
                Notes:req.body.Notes,
                Type:req.body.Type
            })
            return res.status(200).json({
                message:'Service item added successfully'
            })
        }else{
            return res.status(403).json({
                message:'Unauthorized request'
            })
        }
        
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal Server Error : Unable to add in services'
        })
    }
}

module.exports.deleteService = async function(req, res){
    try{
        if(req.user.Role == 'Admin'){
            await ServicesData.findByIdAndDelete(req.params.serviceId);
            return res.status(200).json({
                message:'Service data deleted'
            })
        }else{
            return res.status(403).json({
                message:'Unauthorized request'
            })
        }
        
    }catch(err){
        return res.status(500).json({
            message:'Internal Server Error : Unable to delete service'
        })
    }
}
module.exports.saveReport = async function(req, res){
    //Items will be an array of string where each element will be in below format
    //Itemname$price$category$result
    try{
        let patient=null
        let Name, Age, Address, Mobile, Id, Gender;
        if(req.body.id){
            patient = await PatientData.findOne({Id:req.body.id});
            if(!patient || patient == null){
                return res.status(400).json({
                    message:'Invalid Patient'
                })
            }
            Name = patient.Name
            Age = patient.Age
            Address = patient.Address
            Mobile = patient.Mobile
            Id = patient._id
            Gender = patient.Gender
        }else{
            Name = req.body.patient.Name
            Age = req.body.patient.Age
            Address = req.body.patient.Address
            Mobile = req.body.patient.Mobile,
            Gender = Gender
            Id = null
        }
        let tracker = await Tracker.findOne({});
        let newReportNo = +tracker.ReportNo + 1
        let day = new Date().getDate().toString().padStart(2,'0')
        let month = +new Date().getMonth()
        let year = new Date().getFullYear()
        let date = year +'-'+ (month+1).toString().padStart(2,'0') +'-'+ day; 
        let report = await ReportsData.create({
            Patient:Id,
            Name:Name,
            Age:Age,
            Gender:Gender,
            Address:Address,
            Mobile:Mobile,
            ReportNo:'RPT'+newReportNo,
            Items: req.body.tests,
            Doctor:req.body.patient.Doctor,
            Date: date,
            User:req.user._id,
            Username:req.user.Name
        });
        
        await tracker.updateOne({ReportNo:newReportNo});
        if(patient){
            patient.Reports.push(report._id);
            await patient.save()
        }
        return res.status(200).json({
            message:'Report saved',
            report_id : report._id
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal Server Error : Unable to save report',
        })
    }
}


module.exports.cancelReport = async function(req,res){
    try{
        if(req.user.Role == 'Admin' || req.user.Role == 'Doctor'){
            let report = await ReportsData.findByIdAndUpdate(req.body.id, {$set:{isCancelled:true}});
            if(report){
                return res.status(200).json({
                    message:'Report cancelled'
                })
            }else{
                return res.status(404).json({
                    message:'No report found'
                })
            }
        }else{
            return res.status(403).json({
                message:'Unauthorized action'
            })
        }
        
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal Server Error : Unable to cancel report'
        })
    }
}

module.exports.cancelBirthReport = async function(req,res){
    try{
        if(req.user.Role == 'Admin' || req.user.Role == 'Doctor'){
            let report = await BirthData.findByIdAndUpdate(req.body.id, {$set:{isCancelled:true}});
            if(report){
                return res.status(200).json({
                    message:'Certificate cancelled'
                })
            }else{
                return res.status(404).json({
                    message:'No certificate found'
                })
            }
        }else{
            return res.status(403).json({
                message:'Unauthorized actiom'
            })
        }
        
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal Server Error : Unable to cancel certificate'
        })
    }
}




module.exports.viewReport = async function(req, res){
    try{
        let report = await ReportsData.findById(req.params.pid);
        let patient = await PatientData.findOne(report.Patient);
        return res.render('pathalogyReportTemplate', {report, user:req.user, patient});
    }catch(err){
        console.log(err);
        return res.render('Error_500')
    }
}


module.exports.getReportByNumber = async function(req, res){
    try{
        let report = await ReportsData.findOne({ReportNo:req.query.reportNo});
        if(report){
            return res.status(200).json({
                report:report.Items
            })
        }else{
            return res.status(404).json({
                message:'No report found'
            })
        }
    }catch(err){
        return res.status(500).json({
            message:'Unable to fetch report'
        })
    }
}

module.exports.getDefaultTests = async function(req, res){
    try{
        let report = await ServicesData.find({Type:'DischargeTest'});
        if(report){
            return res.status(200).json({
                report
            })
        }else{
            return res.status(404).json({
                message:'No report found'
            })
        }
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Unable to fetch report'
        })
    }
}
module.exports.pathologyHistoryHome = function(req, res){
    try{
        return res.render('pathReportsHistory',{user:req.user})
    }catch(err){
        return res.render('Error_500')
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
module.exports.getHistoryByRange = async function(req, res){
    try{
        console.log(req.query)
        let status = req.query.status;
        let reportsList;
        console.log(req.query.status)
        if(status == 'generated'){
            reportsList = await ReportsData.find({
                $and: [
                    {Date:{$gte :req.query.startDate}},
                    {Date: {$lte : req.query.endDate}},
                    {isCancelled:false, isValid:true}
                ]
            }).populate('Patient').sort("createdAt");
            
            return res.status(200).json({
                message:reportsList.length+' reports found',
                reportsList
            })          
            
        }else if(status == 'cancelled'){
            reportsList = await ReportsData.find({
                $and: [
                    {Date:{$gte :req.query.startDate}},
                    {Date: {$lte : req.query.endDate}},
                    {isCancelled:true, isValid:true}
                ]
            }).populate('Patient').sort("createdAt");
            
            return res.status(200).json({
                message:reportsList.length+' reports found',
                reportsList
            })
            
        }else{
            return res.status(404).json({
                message:'No reports found'
            })
        }
        
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'Internal Server Error : Unable to find receipts'
        })
    }
}

module.exports.getHistoryByDate = async function(req, res){
    let status = req.query.status
    console.log(req.query)
    try{
        let reportsList
        if(status == 'generated'){
            reportsList = await ReportsData.find({
                Date:req.query.selectedDate,
                isCancelled:false, isValid:true
            }).populate('Patient').sort("createdAt");
            
            return res.status(200).json({
                message:reportsList.length+' reports found',
                reportsList
            })
            
        }else if(status == 'cancelled'){
            reportsList = await ReportsData.find({
                Date:req.query.selectedDate,
                isCancelled:true, isValid:true
            }).populate('Patient').sort("createdAt");
            
            return res.status(200).json({
                message:reportsList.length+' reports found',
                reportsList
            })
            
        }else{
            return res.status(404).json({
                message:'No reports found'
            })
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'Internal Server Error : Unable to find receipts'
        })
    }
}




module.exports.getHistoryById = async function(req, res){
    try{
        let status = req.query.status
        let reportsList
        let patient = await PatientData.findOne({
            $or: [
                {Id:req.query.id},
                {Mobile:req.query.id},
                
            ],
            isCancelled:false, isValid:true
        });
    
        if(patient){
            if(status == 'generated'){
                let reportsList = await ReportsData.find({
                    Patient:patient._id,
                    isCancelled:false, isValid:true
                }).populate('Patient').sort("createdAt");
                return res.status(200).json({
                    message:reportsList.length+' reports found',
                    reportsList
                })
                
            }else if(status == 'cancelled'){
                let reportsList = await ReportsData.find({
                    Patient:patient._id,
                    isCancelled:true, isValid:true
                }).populate('Patient').sort("createdAt");
                
                return res.status(200).json({
                    message:reportsList.length+' reports found',
                    reportsList
                })
                
            }else{
                return res.status(200).json({
                    reportsList,
                    message:'No reports found'
                })
            }
        }else{
            return res.status(200).json({
                reportsList,
                message:'No reports found'
            })
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'Internal Server Error : Unable to find receipts'
        })
    }
}



module.exports.getAllServices = async function(req, res){
    try{    
        let services = await ServicesData.find({}).sort('Type Name');
        return res.status(200).json({
            services,
        })
    }catch(err){
        return res.status(500).json({
            message:'Internal server error : Unable to find services'
        })
    }
}

module.exports.getServiceByName = async function(req, res){
    try{    
        let service = await ServicesData.findOne({Name:req.query.name});
        return res.status(200).json({
            service,
        })
    }catch(err){
        return res.status(500).json({
            message:'Internal server error : Unable to find services'
        })
    }
}


module.exports.dashboard = async function(req, res){
    try{
        if(req.user.Role == 'Admin'){
            let day = new Date().getDate().toString().padStart(2,'0')
            let month = +new Date().getMonth()
            let year = new Date().getFullYear()

            //let today = new Date().toISOString().split('T')[0]
            let today = year +'-'+ (month+1).toString().padStart(2,'0') +'-'+ day;
            let appointments = await SalesData.find({type:'Appointment', BillDate:today}).countDocuments()
            let cancelledApt = await SalesData.find({type:'Appointment', BillDate:today, isValid:false}).countDocuments()
            let pathBills = await SalesData.find({type:'Pathology', BillDate:today}).countDocuments()
            let cancelledPath = await SalesData.find({type:'Pathology', BillDate:today, isValid:false}).countDocuments()
            let ultraSoundBill = await SalesData.find({type:'Ultrasound',BillDate:today}).countDocuments();
            return res.status(200).json({
                appointments,
                cancelledApt,
                pathBills,
                cancelledPath,
                ultraSoundBill
            })
        }else{
            return res.status(403).json({
                message:'Unauthorized action : Please check with Admin'
            })
        }
        
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'Unable to fetch dashboard data'
        })
    }
}

module.exports.birthCertificateHistory = async function(req, res){
    try{
        return res.render('birthCertificateHistory', {user:req.user});
    }catch(err){
        console.log(err);
        return res.render('Error_500')
    }
}

module.exports.getBirthHistoryByRange = async function(req, res){
    try{
        let reportsList;
        reportsList = await BirthData.find({
            $and: [
                {GeneratedOn:{$gte :req.query.startDate}},
                {GeneratedOn: {$lte : req.query.endDate}},
                {isCancelled:false, isValid:true}
            ]
        }).sort("createdAt");
        
        return res.status(200).json({
            message:reportsList.length+' reports found',
            reportsList
        })          
        
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'Internal Server Error : Unable to find receipts'
        })
    }
}

module.exports.getBirthHistoryByDate = async function(req, res){
    console.log(req.query)
    try{
        let reportsList
        reportsList = await BirthData.find({
            GeneratedOn:req.query.selectedDate,
            isCancelled:false, isValid:true
        }).sort("createdAt");
        
        return res.status(200).json({
            message:reportsList.length+' reports found',
            reportsList
        }) 
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'Internal Server Error : Unable to find receipts'
        })
    }
}




module.exports.getBirthHistoryById = async function(req, res){
    try{        
        let reportsList = await BirthData.find({
            OPDId:req.query.id,
            isCancelled:false, isValid:true
        }).sort("createdAt");
        return res.status(200).json({
            message:reportsList.length+' reports found',
            reportsList
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'Internal Server Error : Unable to find receipts'
        })
    }
}