const Tracker = require('../models/tracker')
const createWaypointModel = require('../models/waypoint')

const getLastWaypoint = async trackerId => {
    //Check if trackerId exists
    const trackerSearchResult = await Tracker.find({ trackerId: trackerId })

    if (trackerSearchResult.length == 0) {
        const errMessage = `Tracker ID ${trackerId} does not exist!`
        console.log(errMessage)
        return {
            status: 'fail',
            message: errMessage
        }
    }

    // Find the last document based on the timestamp field in descending order
    const Waypoint = createWaypointModel(trackerId)

    try {
        const lastWaypoint = await Waypoint.findOne({}).sort({ timestamp: -1 }).exec()

        if (lastWaypoint) {
            return {
                status: 'success',
                message: null,
                data: {
                    timestamp: lastWaypoint.timestamp,
                    latitude: lastWaypoint.latitude,
                    longitude: lastWaypoint.longitude,
                    heading: lastWaypoint.heading,
                    speed: lastWaypoint.speed,
                    altitude: lastWaypoint.altitude,
                    accuracy: lastWaypoint.accuracy,
                }
            }
        } else {
            return {
                status: 'fail',
                message: 'No documents found in the collection.',
                data: null
            }
        }
    } catch (err) {
        console.error(err)
        return {
            status: 'fail',
            message: 'Error while fetching the last waypoint.',
            data: null
        }
    }
}

module.exports = getLastWaypoint