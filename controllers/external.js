const { default: axios } = require("axios");
const PatientData = require('../models/patients');
const VisitData = require('../models/visits');
const Tracker = require('../models/tracker');
const Sales = require('../models/sales');
const Users = require('../models/users');
require('dotenv').config();

module.exports.onlineAppointmentsHome = function(req,res){
    res.render('onlineAppointments',)
}

module.exports.getAppointments = async function(req,res){
    try{
        const date = req.query.date;
        let finalURL = process.env.External_API_URL + `?date=${date}`;
        console.log('Fetching appointments from:', finalURL);
        let appointments = await axios.get(finalURL, { headers : { Authorization: `Bearer ${process.env.External_JWT_Token}` } });
        appointments = appointments.data;
        return res.status(200).json({ appointments });
    }catch(err){
        console.error('Error fetching appointments:', err);
        return res.status(500).json({ error: 'Failed to fetch appointments' });
    }
}

function normalizeExternalAppointment(appointment) {
    const patientDetails = appointment.patientDetails || {};
    return {
        appointmentId: appointment.appointmentId,
        doctorId: appointment.doctorId,
        ehrDoctorId: appointment.ehrDoctorId || '',
        doctorName: appointment.doctorName || '',
        date: appointment.date,
        patientName: patientDetails.name || '',
        patientAge: patientDetails.age || 0,
        patientMobile: patientDetails.mobile || '',
        patientGender: patientDetails.gender || 'Other',
        patientAddress: patientDetails.address || '',
        patientGuardianName: patientDetails.guardianName || '',
        paymentType: (appointment.amountPaid || 0) > 0 ? 'Online' : 'Cash',
        paidAmount: Number(appointment.amountPaid || 0),
    };
}

async function syncAppointmentWebhook({ appointmentId, doctorId, visitId }) {
    try {
        if (!process.env.External_Webhook_URL) {
            return {
                synced: false,
                message: 'External webhook URL not configured'
            };
        }

        const payload = {
            doctorId,
            appointmentId
        };

        const webhookResponse = await axios.post(
            process.env.External_Webhook_URL,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${process.env.External_JWT_Token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const responseData = webhookResponse.data || {};
        const webhookSuccess = responseData.success === true
            || responseData.status === 'success'
            || responseData.message === 'success';

        if (webhookSuccess) {
            await VisitData.findByIdAndUpdate(visitId, { isWebhookSynced: true });
        }

        return {
            synced: webhookSuccess,
            data: responseData
        };
    } catch (err) {
        console.log('Webhook sync failed:', err.message);
        return {
            synced: false,
            message: err.message
        };
    }
}

async function saveExternalAppointment({ appointment, linkedPatient }) {
    const normalized = normalizeExternalAppointment(appointment);
    if (!normalized.appointmentId || !normalized.doctorId || !normalized.date) {
        const error = new Error('Invalid appointment payload');
        error.statusCode = 400;
        throw error;
    }

    const tracker = await Tracker.findOne({});
    if (!tracker) {
        const error = new Error('Tracker not configured');
        error.statusCode = 500;
        throw error;
    }

    const existingVisit = await VisitData.findOne({
        externalVisitId: normalized.appointmentId,
        isCancelled: false
    });
    if (existingVisit) {
        const error = new Error('Appointment already accepted');
        error.statusCode = 409;
        throw error;
    }

    let patient = linkedPatient || null;
    let patientIdForSale;

    if (!patient) {
        patientIdForSale = tracker.patientId + 1;
        patient = await PatientData.create({
            Name: normalized.patientName,
            Age: normalized.patientAge,
            Address: normalized.patientAddress,
            Mobile: normalized.patientMobile,
            Id: patientIdForSale,
            Gender: normalized.patientGender,
            Husband: normalized.patientGuardianName
        });
        await tracker.updateOne({ patientId: patientIdForSale });
    } else {
        patientIdForSale = patient.Id;
    }

    const doctor = await Users.findById(normalized.ehrDoctorId);
    if (!doctor) {
        const error = new Error('Doctor not found');
        error.statusCode = 400;
        throw error;
    }

    const visit = await VisitData.create({
        Patient: patient._id,
        Type: 'OPD',
        Fees: normalized.paidAmount,
        Doctor: doctor.Name || normalized.doctorName,
        Visit_date: normalized.date,
        PaymentType: normalized.paymentType,
        externalVisitId: normalized.appointmentId,
        externalDoctorId: normalized.doctorId,
        isWebhookSynced: false
    });

    await patient.updateOne({ $push: { Visits: visit._id } });

    let cashPaid = 0;
    let onlinePaid = 0;
    let indiqooPaid = 0;
    
    if (normalized.paymentType === 'Cash') {
        cashPaid = normalized.paidAmount;
    } else if (normalized.paymentType === 'Online') {
        onlinePaid = normalized.paidAmount;
    } else if (normalized.paymentType === 'Paid to Indiqoo') {
        indiqooPaid = normalized.paidAmount;
    }

    const sale = await Sales.create({
        Patient: patient._id,
        Visit: visit._id,
        Name: patient.Name,
        Age: patient.Age,
        Address: patient.Address,
        Mobile: patient.Mobile,
        Doctor: doctor.Name || normalized.doctorName,
        Gender: patient.Gender,
        Husband: patient.Husband,
        PatiendID: patientIdForSale,
        Items: [`OPD (${new Date(normalized.date).toLocaleDateString('en-IN', {day:'2-digit', month:'2-digit', year:'numeric'})})$1$${normalized.paidAmount}`],
        type: 'Appointment',
        ReportNo: 'OPD' + tracker.AppointmentNumber,
        Total: normalized.paidAmount,
        PaymentType: normalized.paymentType,
        CashPaid: cashPaid,
        OnlinePaid: onlinePaid,
        indiqooPaid: indiqooPaid,
        BillDate: normalized.date,
    });
    
    await visit.updateOne({ SaleId: sale._id });
    
    await tracker.updateOne({ AppointmentNumber: tracker.AppointmentNumber + 1 });

    const webhook = await syncAppointmentWebhook({
        appointmentId: normalized.appointmentId,
        doctorId: normalized.doctorId,
        visitId: visit._id
    });

    return {
        visitId: visit._id,
        patientMongoId: patient._id,
        patientId: patientIdForSale,
        webhookSynced: webhook.synced,
        webhookResponse: webhook.data
    };
}

module.exports.acceptAppointment = async function(req, res) {
    try {
        const appointment = req.body.appointment;
        const result = await saveExternalAppointment({ appointment });
        return res.status(200).json({
            success: true,
            message: 'Appointment accepted successfully',
            result
        });
    } catch (err) {
        console.log(err);
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Unable to accept appointment'
        });
    }
}

module.exports.linkAndAcceptAppointment = async function(req, res) {
    try {
        const appointment = req.body.appointment;
        const patientId = req.body.patientId;

        if (!patientId) {
            return res.status(400).json({
                success: false,
                message: 'Patient Id is required'
            });
        }

        const linkedPatient = await PatientData.findOne({
            Id: patientId,
            isCancelled: false,
            isValid: true
        });

        if (!linkedPatient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        const result = await saveExternalAppointment({ appointment, linkedPatient });
        return res.status(200).json({
            success: true,
            message: 'Appointment linked and accepted successfully',
            result
        });
    } catch (err) {
        console.log(err);
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Unable to link and accept appointment'
        });
    }
}
