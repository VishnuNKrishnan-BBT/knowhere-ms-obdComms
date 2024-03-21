const documentExists = require('../helpers/documentExists');
const LiveLocation = require('../models/livelocation');
const createWaypointModel = require('../models/waypoint');
const updateLiveLocation = require('./updateLiveLocation');
const checkLocationResolutionDue = require('./checkLocationResolutionDue')
const getLastWaypoint = require('./getLastWaypoint');
const { addResolvedLocation } = require('./addResolvedLocation');
const styledLog = require('../helpers/styledLog');
const getReqId = require('../helpers/getRequestId');

const addWaypoints = ({
    trackerId = null,
    trackerPassword = null,
    waypoints = [],
    res
}) => {
    const reqId = getReqId('TXN')

    //Incoming request info
    styledLog({ colour: 'yellow', style: 'bold' }, '=== Incoming request on /addWaypoints ===')
    styledLog({ colour: 'yellow', style: 'bold' }, `ℹ ${reqId} [1/3]\t\t: Assigned Request ID`)
    styledLog({ colour: 'cyan', style: 'normal' }, `ℹ ${reqId} Tracker ID\t\t: ${trackerId || 'Not available in payload'}`)
    styledLog({ colour: 'cyan', style: 'normal' }, `ℹ ${reqId} Number of waypoints\t: ${waypoints.length}`)

    //Begin ingestion to DB
    styledLog({ colour: 'yellow', style: 'bold' }, `⚙ ${reqId} [2/3] - /addWaypoints - Waypoints ingestion in progress...`)

    var actionBlocked = false

    //Block if trackerId does not exist in trackers collection
    documentExists('trackers', { trackerId: trackerId })
        .then(result => {
            if (result === false) {
                actionBlocked = true
                styledLog({ colour: 'red', style: 'bold' }, `✘ ${reqId} [2/3] Ingestion error: Tracker ID '${trackerId}' does not exist!`)

                res.status(401).json({
                    status: 401,
                    message: `Error adding waypoint: Tracker ID ${trackerId} does not exist!`,
                    data: null
                })

                styledLog({ colour: 'red', style: 'bold' }, `✘ ${reqId} [2/3] Request aborted.`)
                styledLog({ colour: 'green', style: 'bold' }, `✓ ${reqId} [3/3] Information sent to client.`)
                return //Abort operation if action is blocked
            } else {
                const Waypoint = createWaypointModel(trackerId)

                //Add 'resolved' field to waypoint
                waypoints.forEach(obj => {
                    obj.resolved = false
                })

                Waypoint.insertMany(waypoints)
                    .then((result) => {
                        styledLog({ colour: 'green', style: 'bold' }, `✓ ${reqId} [2/3] ${result.length} waypoints ingested.`)

                        let processedTimestamps = []
                        result.forEach(obj => {
                            processedTimestamps.push(obj.timestamp)
                        })

                        res.status(200).json({
                            status: 200,
                            message: `Waypoints ingested successfully.`,
                            data: {
                                processedTimestamps
                            }
                        })

                        styledLog({ colour: 'green', style: 'bold' }, `✓ ${reqId} [3/3] Response sent to client.`)
                    })
                    .catch((error) => {
                        // console.error('Error adding documents:', error)
                        styledLog({ colour: 'red', style: 'bold' }, `✘ ${reqId} [2/3] Error ingesting waypoints: ${error}`)

                        res.status(500).json({
                            status: 500,
                            message: `Waypoints ingestion failed.`,
                            data: null
                        })
                        styledLog({ colour: 'green', style: 'bold' }, `✓ ${reqId} [3/3] Information sent to client.`)
                    })
            }
        })
}

module.exports = addWaypoints