const documentExists = require('../helpers/documentExists');
const LiveLocation = require('../models/livelocation');
const createWaypointModel = require('../models/waypoint');
const updateLiveLocation = require('./updateLiveLocation');
const getLastWaypoint = require('./getLastWaypoint');

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

    console.log(
        trackerId,
        timestamp,
        latitude,
        longitude,
        heading,
        speed,
        altitude,
        accuracy
    );

    var actionBlocked = false

    //Block if trackerId does not exist in trackers collection
    documentExists('trackers', { trackerId: trackerId }).then(result => {
        if (result === false) {
            actionBlocked = true
            console.log(`Error adding waypoint: Tracker ID ${trackerId} does not exist!`)

            res.status(500).json({
                status: 500,
                timestamp: timestamp,
                message: `Error adding waypoint: Tracker ID ${trackerId} does not exist!`
            })
            return //Abort operation if action is blocked
        } else { //Continue operation if action is not blocked

            if (
                trackerId === undefined ||
                timestamp === undefined ||
                latitude === undefined ||
                longitude === undefined ||
                heading === undefined ||
                speed === undefined
            ) {
                res.status(500).json({
                    status: 500,
                    timestamp: timestamp,
                    message: `Ignoring request due to undefined fields.`
                })
            } else {

                // Ignore if last speed == 0 or close to stationary
                getLastWaypoint(trackerId).then(result => {
                    if (result.status == 'success') {
                        console.log(`--${result.data.speed < 2 && speed < 2}----${result.data.speed}------${speed}-----`);
                        if (result.data.speed < 2 && speed < 2) {
                            res.json({
                                status: 200,
                                timestamp: timestamp,
                                message: `Waypoint ignored as movement is negligible.`
                            })
                            return
                        } else {
                            add()
                        }
                    }
                })

                const add = () => {
                    const Waypoint = createWaypointModel(trackerId)
                    const newWaypoint = Waypoint({
                        timestamp: timestamp,
                        latitude: latitude,
                        longitude: longitude,
                        heading: heading,
                        speed: speed,
                        altitude: altitude,
                        accuracy: accuracy,
                        resolved: false
                    })

                    newWaypoint.save()
                    updateLiveLocation(
                        { trackerId: trackerId }, //Filter criteria
                        {
                            $set: { //New values
                                trackerId: trackerId,
                                timestamp: timestamp,
                                latitude: latitude,
                                longitude: longitude,
                                heading: heading,
                                speed: speed,
                                altitude: altitude,
                                accuracy: accuracy
                            },
                        }
                    )

                    res.status(200).json({
                        status: 200,
                        timestamp: timestamp,
                        message: `Waypoint added successfully!`
                    })
                }
            }
        }
    })
}

module.exports = addWaypoint