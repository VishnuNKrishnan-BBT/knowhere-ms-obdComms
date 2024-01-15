const mongoose = require('mongoose')
const Schema = mongoose.Schema

const resolveLocationSchema = new Schema({
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
    locationMain: {
        type: String,
        required: true
    },
    locationSub: {
        type: String,
        required: true
    },
    uuid: {
        type: String,
        required: true
    },
    serviceResult: {
        type: Object,
        required: true
    }
}, { timestamps: true })

const createResolvedLocationModel = trackerId => { //This is required as the table name is dynamic.
    return mongoose.model(`RL_${trackerId}`, resolveLocationSchema)
}

module.exports = createResolvedLocationModel