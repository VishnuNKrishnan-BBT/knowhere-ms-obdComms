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
const addWaypoints = require('./coreFunctions/addWaypoints')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Enable CORS for all routes
app.use(cors())

styledLog({ colour: 'yellow', style: 'bold' }, '⚙ Initializing KW-MS-OBDCOMMS Server...')

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
    addWaypoints({ ...req.body, res })
})

//Start app
try {
    app.listen(port, () => {
        styledLog({ colour: 'green', style: 'bold' }, `✓ KW-MS-OBDCOMMS - Server initialized on port ${port}.`)
    })
} catch (error) {
    styledLog({ colour: 'red', style: 'bold' }, `✘ KW-MS-OBDCOMMS - Failed to initialize server!`)
    styledLog({ colour: 'red', style: 'normal' }, error)
}
