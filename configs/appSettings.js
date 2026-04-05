const path = require('path');
const PropertiesReader = require('properties-reader');

const settingsFilePath = path.join(__dirname, 'device.properties');

function getPropertiesReader() {
    return PropertiesReader(settingsFilePath, { writer: { saveSections: true } });
}

function isOpdRegistrationEnabled() {
    const properties = getPropertiesReader();
    const value = properties.get('opd_registration_enabled');
    if (value === undefined || value === null || value === '') {
        return true;
    }
    return value.toString().toLowerCase() === 'true';
}

async function setOpdRegistrationEnabled(status) {
    const properties = getPropertiesReader();
    properties.set('opd_registration_enabled', status ? 'true' : 'false');
    await properties.save(settingsFilePath);
    return isOpdRegistrationEnabled();
}

module.exports = {
    isOpdRegistrationEnabled,
    setOpdRegistrationEnabled
};
