const documentExists = require('../helpers/documentExists');
const createWaypointModel = require('../models/waypoint')

const addWaypoint = ({
    trackerId,
    timestamp,
    latitude,
    longitude,
    heading,
    speed,
    altitude = null,
    accuracy = null,
    res
}) => {

    console.log('Adding new waypoint...');

    var actionBlocked = false

    //Block if trackerId does not exist in trackers collection
    documentExists('trackers', { trackerId: trackerId }).then(result => {
        if (result === false) {
            actionBlocked = true
            console.log(`Error adding waypoint: Tracker ID ${trackerId} does not exist!`)

            res.json({
                status: 500,
                message: `Error adding waypoint: Tracker ID ${trackerId} does not exist!`
            })
            return //Abort operation if action is blocked
        } else { //Continue operation if action is not blocked
            const Waypoint = createWaypointModel(trackerId)
            const newWaypoint = Waypoint({
                timestamp: timestamp,
                latitude: latitude,
                longitude: longitude,
                heading: heading,
                speed: speed,
                altitude: altitude,
                accuracy: accuracy
            })

            newWaypoint.save()
            res.json({
                status: 200,
                message: `Waypoint added successfully!`
            })
        }
    })
}

module.exports = addWaypoint