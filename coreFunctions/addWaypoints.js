const documentExists = require('../helpers/documentExists');
const LiveLocation = require('../models/livelocation');
const createWaypointModel = require('../models/waypoint');
const updateLiveLocation = require('./updateLiveLocation');
const checkLocationResolutionDue = require('./checkLocationResolutionDue')
const getLastWaypoint = require('./getLastWaypoint');
const { addResolvedLocation } = require('./addResolvedLocation');

const addWaypoints = (waypointsArray = [], res) => {

    let trackerId = null

    if (waypointsArray.length == 0) {
        res.status(401).json({
            status: 'fail',
            message: 'Waypoints array has no elements!',
            data: null
        })
        return
    } else if (!trackerId) {
        res.status(401).json({
            status: 'fail',
            message: 'Tracker ID not provided!',
            data: null
        })
        return
    }

    trackerId = waypointsArray[0]?.trackerId

    const Waypoint = createWaypointModel(trackerId)

    Waypoint.insertMany(waypointsArray)
        .then((result) => {
            console.log('Documents added:', result)
        })
        .catch((error) => {
            console.error('Error adding documents:', error)
        })

}

module.exports = addWaypoints