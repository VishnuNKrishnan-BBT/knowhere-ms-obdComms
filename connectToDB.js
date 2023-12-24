const mongoose = require('mongoose')
require('dotenv').config();

const connectToDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_DB_URI)
        console.log('Connected to the database')
        return connection
    } catch (error) {
        console.error('Error connecting to the database:', error)
        throw error
    }
}

const disconnectFromDB = async () => {
    mongoose.connection.close()
    console.log('Disconnected from DB.');
}

module.exports = { connectToDB, disconnectFromDB }