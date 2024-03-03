//MODULE IMPORTS
const express = require('express')
const cors = require('cors')
require('dotenv').config();
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
    addWaypoint({ ...req.body.trackerId, ...req.body.waypoints, res })
})

app.post('/addWaypoints', (req, res) => {
    console.log('Add Waypoints')
    console.table(req.body)

    var returnData = []

    req.body.map(obj => {
        returnData.push(obj.timestamp)
        addWaypoint(obj)
    })

    res.json(returnData)

    return {
        status: 'success',
        message: null,
        data: returnData
    }
})

//Start app
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})