const mongoose = require('mongoose')
const Schema = mongoose.Schema

const trackerSchema = new Schema({
    trackerId: {
        type: String,
        required: true
    },
    isAssigned: { //Is assigned to a vehicle Id
        type: String,
        required: true
    },
    trackerPassword: {
        type: String,
        required: true
    },
    simId: {
        type: String,
        required: false
    },
    ipV4: {
        type: String,
        required: false
    },
    port: { //Port on which the device server listens for connections
        type: Number,
        required: false
    }
}, { timestamps: true })

const Tracker = mongoose.model('Tracker', trackerSchema)

module.exports = Tracker