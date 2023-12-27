const LiveLocation = require('../models/livelocation')

const updateLiveLocation = async (filter, update) => {
    try {
        const result = await LiveLocation.updateOne(filter, update)

        //console.log(result)

        if (result.modifiedCount === 1) {
            console.log('Live Location updated successfully')
        } else {
            console.log('Live location not updated. No document matched the filter criteria')
        }
    } catch (error) {
        console.error('Error updating Live Location:', error)
    }
}

module.exports = updateLiveLocation