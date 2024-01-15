const mongoose = require('mongoose')
const Schema = mongoose.Schema

const liveLocationSchema = new Schema({
    trackerId: {
        type: String,
        required: true
    },
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
    resolvedLocation: {
        type: Object,
        required: false
    }
}, { timestamps: true })

const LiveLocation = mongoose.model('LiveLocation', liveLocationSchema)

module.exports = LiveLocation