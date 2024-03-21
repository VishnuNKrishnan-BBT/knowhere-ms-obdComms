const mongoose = require('mongoose');
const styledLog = require('./helpers/styledLog');
require('dotenv').config();

const connectToDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_DB_URI)
        styledLog({ colour: 'green', style: 'bold', blankLine: 3 }, `✓ Connected to the database`)
        return connection
    } catch (error) {
        console.error('Error connecting to the database:', error)
        styledLog({ colour: 'red', style: 'bold', blankLine: 3 }, `✘ Error connecting to the database: ${error}`)
        throw error
    }
}

const disconnectFromDB = async () => {
    mongoose.connection.close()
    styledLog({ colour: 'red', style: 'bold', blankLine: 3 }, `! Disconnected from database`)
}

module.exports = { connectToDB, disconnectFromDB }