const axios = require('axios')

const resolveLocation = async (lat, lon) => {
    const reverseGeocodingServiceApi = `https://api.opencagedata.com/geocode/v1/json?key=${process.env.REVERSE_GEOCODER_KEY}&q=${lat}%2C+${lon}&pretty=1&no_annotations=1`

    const resolvedLocationData = await axios.get(reverseGeocodingServiceApi)
    return resolvedLocationData.data //Use .then and retrieve the data
}

module.exports = { resolveLocation }