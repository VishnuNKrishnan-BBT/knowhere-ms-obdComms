const { resolveLocation } = require("../helpers/resolveLocation")
const createResolvedLocationModel = require("../models/resolvedLocation")

const addResolvedLocation = (
    trackerId = null,
    timestamp = null, //As sent from on board device.
    latitude = null,
    longitude = null
) => {
    if (
        trackerId == null ||
        timestamp == null ||
        latitude == null ||
        longitude == null
    ) {
        return {
            status: 'fail',
            message: 'Null fields provided.',
            data: null
        }
    }

    let resolvedLocation = null
    resolveLocation(latitude, longitude).then(res => {
        resolvedLocation = res?.results[0]

        console.log(resolvedLocation)

        const ResolvedLocation = createResolvedLocationModel(trackerId)
        const newResolvedLocation = ResolvedLocation({
            timestamp: timestamp,
            latitude: latitude,
            longitude: longitude,
            locationMain: 'TEST',
            locationSub: 'Test',
            serviceResult: resolvedLocation
        })

        newResolvedLocation.save()
    })
}

module.exports = { addResolvedLocation }