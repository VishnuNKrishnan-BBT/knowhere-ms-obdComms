//OBJECTIVE: 1) Accept a trackerId. Check if 150 or more waypoints have been added after the last resolution.

const Tracker = require('../models/tracker')
const createWaypointModel = require('../models/waypoint')

const checkLocationResolutionDue = async trackerId => {
    //Check if trackerId exists
    const trackerSearchResult = await Tracker.find({ trackerId: trackerId })

    if (trackerSearchResult.length == 0) {
        const errMessage = `Tracker ID ${trackerId} does not exist!`
        console.log(errMessage)
        return {
            status: 'fail',
            message: errMessage,
            data: null
        }
    }

    // Find the last document based on the timestamp field in descending order
    const Waypoint = createWaypointModel(trackerId)

    try {
        const lastResolvedLocation = await Waypoint.find({ resolved: true }).sort({ timestamp: -1 }).exec()

        if (lastResolvedLocation.length > 0) {
            const lastResolvedTimestamp = lastResolvedLocation[0].timestamp;

            // Find the number of documents created after the last resolved location
            const countAfterLastResolved = await Waypoint.countDocuments({
                timestamp: { $gt: lastResolvedTimestamp }
            })

            console.table({
                lastResolvedTimestamp: lastResolvedTimestamp,
                count: countAfterLastResolved,
                due: countAfterLastResolved >= 150 //Boolean
            })

            return {
                status: 'success',
                message: countAfterLastResolved >= 150 ? 'Due for resolution.' : 'Not due for resolution.',
                data: {
                    count: countAfterLastResolved,
                    due: countAfterLastResolved >= 150 //Boolean
                }
            }
        } else {

            if (lastResolvedLocation.length == 0) {
                return {
                    status: 'success',
                    message: '0 documents in Waypoints. Resolving first waypoint',
                    data: {
                        count: 0,
                        due: true //Boolean
                    }
                }
            }

            return {
                status: 'fail',
                message: 'No documents in collection.',
                data: null
            }
        }

    } catch (err) {
        console.error(err)
        return {
            status: 'fail',
            message: 'Error while checking last resolved location.',
            data: null
        }
    }
}

module.exports = checkLocationResolutionDue