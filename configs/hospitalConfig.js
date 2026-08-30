const path = require('path');
const PropertiesReader = require('properties-reader');

const propertiesPath = path.join(__dirname, 'hospital.properties');
const properties = PropertiesReader(propertiesPath);

function getValue(key, fallback = '') {
    const value = properties.get(key);
    return value === undefined || value === null ? fallback : value;
}

function getHospitalConfig() {
    const doctors = (getValue('hospital.doctors.list', '') || '')
        .split(',')
        .map((doctorKey) => doctorKey.trim())
        .filter(Boolean)
        .map((doctorKey) => {
            const descriptionRows = parseInt(getValue(`${doctorKey}.description.rows`, '0'), 10) || 0;
            const description = [];

            for (let index = 1; index <= descriptionRows; index += 1) {
                description.push(getValue(`${doctorKey}.description.row.${index}`, ''));
            }

            return {
                key: doctorKey,
                name: getValue(`${doctorKey}.name`, ''),
                nameHindi: getValue(`${doctorKey}.name.hindi`, ''),
                qualification: getValue(`${doctorKey}.qualification`, ''),
                fees: getValue(`${doctorKey}.fees`, ''),
                description
            };
        });

    const doctorMap = {};
    doctors.forEach((doctor) => {
        doctorMap[doctor.key] = doctor;
    });

    return {
        name: getValue('hospital.name', ''),
        nameHindi: getValue('hospital.name.hindi', ''),
        address: getValue('hospital.address', ''),
        addressHindi: getValue('hospital.address.hindi', ''),
        registrationNumber: getValue('hospital.registration.number', ''),
        phone: getValue('hospital.phone', ''),
        mobile: getValue('hospital.mobile', ''),
        logoPath: getValue('hospital.logo.path', ''),
        otherDescription: getValue('hospital.other.description', ''),
        otherDescription1: getValue('hospital.other.description1', ''),
        otherDescription2: getValue('hospital.other.description2', ''),
        doctors,
        doctorMap
    };
}

module.exports = {
    getHospitalConfig
};
