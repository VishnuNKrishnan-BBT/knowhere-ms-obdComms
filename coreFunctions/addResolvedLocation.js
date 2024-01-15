const { resolveLocation } = require("../helpers/resolveLocation")
const createResolvedLocationModel = require("../models/resolvedLocation")
const createWaypointModel = require("../models/waypoint")
const { v4: uuidv4 } = require('uuid')

const addResolvedLocation = (
    trackerId = null,
    timestamp = null, //As sent from on board device.
    latitude = null,
    longitude = null,
    newLeg = false
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

        if (!res.results) {
            return {
                status: 'fail',
                message: 'Geolocation resolution failed.',
                data: null
            }
        }

        resolvedLocation = res?.results[0]

        // console.log(resolvedLocation);

        const ResolvedLocation = createResolvedLocationModel(trackerId)
        const newResolvedLocation = ResolvedLocation({
            timestamp: timestamp,
            latitude: latitude,
            longitude: longitude,
            locationMain: resolvedLocation?.components?.suburb || resolvedLocation?.components?.road,
            locationSub: resolvedLocation?.components?.state,
            uuid: uuidv4(),
            newLeg: newLeg,
            serviceResult: resolvedLocation
        })

        newResolvedLocation.save()
    }).then(() => {
        return {
            status: 'success',
            message: 'Location resolved.',
            data: resolvedLocation
        }
    })
}

module.exports = { addResolvedLocation }