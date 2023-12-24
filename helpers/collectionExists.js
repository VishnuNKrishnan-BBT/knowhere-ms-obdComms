const { MongoClient } = require('mongodb')

//Check if a collection exists and return a Boolean value
const collectionExists = async (collectionName = '') => {
    const client = new MongoClient(process.env.MONGO_DB_URI)

    try {
        await client.connect()

        const database = client.db()
        const collections = await database.listCollections().toArray()

        // Check if the desired collection name exists in the list of collections
        const collectionExists = collections.some(collection => collection.name === collectionName)

        if (collectionExists) {
            return true
        } else {
            return false
        }
    } finally {
        await client.close()
    }
}

// Example Usage

// (documentExists('trackers', { trackerId: 'AXS-901-JIK-211' }).then(res => {
//     console.log(res)
// }))

module.exports = collectionExists