const documentExists = require('../helpers/documentExists');
const LiveLocation = require('../models/livelocation');
const createWaypointModel = require('../models/waypoint');
const updateLiveLocation = require('./updateLiveLocation');
const checkLocationResolutionDue = require('./checkLocationResolutionDue')
const getLastWaypoint = require('./getLastWaypoint');
const { addResolvedLocation } = require('./addResolvedLocation');

const addWaypoint = ({
    trackerId,
    timestamp,
    latitude,
    longitude,
    heading,
    speed,
    altitude = null,
    accuracy = null,
    newLeg = false,
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
        accuracy,
        newLeg
    );

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
                        if (result.data.speed < 0.277778 && speed < 0.277778) { // 0.277778m/s = 1km/h
                            res.json({
                                status: 200,
                                timestamp: timestamp,
                                message: `Waypoint ignored as movement is negligible.`
                            })
                            return
                        } else {
                            add()
                        }
                    } else if (result.status == 'fail') {
                        add() //If fetching last waypoint failed for some reason, add the lastwaypoint anyway. This is the case when a new tracker sends waypoints - there won't be any waypoints in the table, and getLastWaypoint will fail.
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
                        resolved: false,
                        newLeg: newLeg
                    })

                    newWaypoint.save()

                    //Update on live location table
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

                    //Resolve location if required
                    let resolverMessage
                    checkLocationResolutionDue(trackerId).then(result => {
                        console.log('resolverMessage', result.message)
                        if (newLeg || result?.data?.due) { //Resolution should happen if 1) this is the first wapoint of a new leg OR 2) resolutionDue == true
                            addResolvedLocation(trackerId, timestamp, latitude, longitude, newLeg)
                        }
                    }).finally(() => {
                        res.status(200).json({
                            status: 200,
                            timestamp: timestamp,
                            message: `Waypoint added successfully! ${resolverMessage}`
                        })
                    })
                }
            }
        }
    })
}

module.exports = addWaypoint