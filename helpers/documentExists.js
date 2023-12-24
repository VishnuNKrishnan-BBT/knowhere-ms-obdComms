const { MongoClient } = require('mongodb')

//Check if a document matching a criteria exists in a collection and return a Boolean value
const documentExists = async (collectionName, criteria = {}) => {
    const client = new MongoClient(process.env.MONGO_DB_URI)

    try {
        await client.connect()

        const database = client.db()
        const collection = database.collection(collectionName)

        // Use findOne to check if a document exists that matches the criteria
        const existingDocument = await collection.findOne(criteria)

        if (existingDocument) {
            //console.log('Document exists:', existingDocument)
            return true
        } else {
            //console.log('Document does not exist.')
            return false
        }
    } finally {
        await client.close()
    }
}

module.exports = documentExists