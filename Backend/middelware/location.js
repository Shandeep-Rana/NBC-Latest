const axios = require('axios');

async function geocodeAddress(req, res, next) {
    try {
        const { address } = req.body;

        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: address,
                key: 'AIzaSyAsakRoLYMEz64CaAFiFaI0fl__mw9_rfE'
            }
        });

        const { results } = response.data;
        if (results && results.length > 0) {
            const { geometry } = results[0];
            const { location } = geometry;
            const { lat, lng } = location;
            req.coordinates = { latitude: location.lat, longitude: location.lng };
            next();
        } else {
            throw new Error('No results found');
        }
    } catch (error) {
        console.error('Error geocoding address:', error.message);
        throw error;
    }
}

module.exports = geocodeAddress;