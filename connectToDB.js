const mongoose = require('mongoose');
const styledLog = require('./helpers/styledLog');
require('dotenv').config();

const connectToDB = async () => {
    styledLog({ colour: 'yellow', style: 'bold' }, `⚙ Attempting to connect to database...`)
    try {
        const connection = await mongoose.connect(process.env.MONGO_DB_URI)
        styledLog({ colour: 'green', style: 'bold', blankLine: 3 }, `✓ Connected to the database.`)
        return connection
    } catch (error) {
        styledLog({ colour: 'red', style: 'bold' }, `✘ Error connecting to the database!`)
        styledLog({ colour: 'red', style: 'normal', blankLine: 3 }, error)
        throw error
    }
}

const disconnectFromDB = async () => {
    mongoose.connection.close()
    styledLog({ colour: 'red', style: 'bold', blankLine: 3 }, `⚠ Disconnected from database`)
}

module.exports = { connectToDB, disconnectFromDB }