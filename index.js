//MODULE IMPORTS
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { connectToDB } = require('./connectToDB')

//CORE FUNTIONS IMPORT


//INITIALIZE EXPRESS
const app = express()
const port = process.env.PORT || 4001

//MIDDLEWARE - REQUEST FORMATTING
const bodyParser = require('body-parser');
const addWaypoint = require('./coreFunctions/addWaypoint');
const collectionExists = require('./helpers/collectionExists');
const documentExists = require('./helpers/documentExists');
const { resolveLocation } = require('./helpers/resolveLocation');
const { addResolvedLocation } = require('./coreFunctions/addResolvedLocation');
const styledLog = require('./helpers/styledLog')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Enable CORS for all routes
app.use(cors())

//INITIALIZE CONNECTION WITH DB
connectToDB()

// MIDDLEWARE - AUTHENTICATION
const authenticate = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token || token !== 'your-secret-token') {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next()
}

// Use the authentication middleware for all routes
app.use(authenticate)

// ---------------------------------

//ROUTES
app.get('/', (req, res) => {
    res.send('Invalid request')
})

app.post('/', (req, res) => {
    res.send('Invalid request')
})

app.post('/addWaypoint', (req, res) => {
    addWaypoint({ ...req.body.waypoints, res })
})

app.post('/addWaypoints', (req, res) => {
    styledLog({ colour: 'yellow', style: 'bold' }, '=== Incoming request on /addWaypoints ===')

    styledLog({ colour: 'yellow', style: 'normal' }, `> Assigned TXN ID\t: TXN0920102 [1/3]`)
    styledLog({ colour: 'white', style: 'normal' }, `> Tracker ID\t\t: ${req.body[0]?.trackerId || 'Not available in payload'}`)
    styledLog({ colour: 'white', style: 'normal', blankLine: 0 }, `> Number of objects\t: ${req.body.length}`)

    styledLog({ colour: 'yellow', style: 'bold' }, '> TXN0920102 [2/3] - /addWaypoints - Waypoints ingestion in progress...')
    styledLog({ colour: 'green', style: 'bold', blankLine: 0 }, '> TXN0920102 [2/3] - /addWaypoints - ✔ Waypoints successfully ingested...')

    var returnData = {
        processedTimestamps: []
    }

    req.body.map(obj => {
        returnData.processedTimestamps.push(obj.timestamp)
        // addWaypoint(obj)
    })

    styledLog({ colour: 'white', style: 'normal', blankLine: 0 }, `> TXN0920102 [3/3] - /addWaypoints - Processed Timestamps: ${JSON.stringify(returnData.processedTimestamps)}`)

    res.json(returnData)

    return {
        status: 'success',
        message: null,
        data: returnData
    }
})

//Start app
app.listen(port, () => {
    styledLog({ colour: 'green', style: 'bold' }, `✓ KW-MS-OBDCOMMS - Server initialized on port ${port}`)
})