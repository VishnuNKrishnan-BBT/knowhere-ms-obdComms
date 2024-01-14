const mongoose = require('mongoose')
const Schema = mongoose.Schema

const waypointSchema = new Schema({
    timestamp: {
        type: Number,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    heading: {
        type: Number,
        required: true
    },
    speed: { //Speed in m/s. Multiply value with 3.6 to get value in km/h
        type: Number,
        required: true
    },
    altitude: {
        type: Number,
        required: false
    },
    accuracy: {
        type: Number,
        required: false
    },
    resolved: {
        type: Boolean,
        required: true
    }
}, { timestamps: true })


const createWaypointModel = trackerId => { //This is required as the table name is dynamic.
    return mongoose.model(`WP_${trackerId}`, waypointSchema)
}

module.exports = createWaypointModel