const mongoService = require('./mongo.service')
const ObjectId = require('mongodb').ObjectId;


function query({ byCountry = '', byCity = '', sortBy = {type: 'rating', order: 1} , filterByAmeneties = {} }) {
    const queryObj = {
        $and: [
            { $or: [{ 'location.country': { $regex: `.*${byCountry.toLowerCase()}.*` } },{'location.country':  { $regex: `.*${byCountry.toUpperCase()}.*` } }] },
            { $or: [{ 'location.city': { $regex: `.*${byCity.toLowerCase()}.*` } }, {'location.city': { $regex: `.*${byCity.toUpperCase()}.*` } }] }
        ]
    }
    if (filterByAmeneties.accessibility) queryObj.$and.push({ 'ameneties.accessibility': true })
    if (filterByAmeneties.wifi) queryObj.$and.push({ 'ameneties.wifi': true })
    if (filterByAmeneties.acceptsPets) queryObj.$and.push({ 'ameneties.acceptsPets': true })
    if (filterByAmeneties.shampoo) queryObj.$and.push({ 'ameneties.shampoo': true })
    if (filterByAmeneties.parking) queryObj.$and.push({ 'ameneties.parking': true })
    return mongoService.connectToDb()
        .then(dbConn => {
            const bedCollection = dbConn.collection('bed');
            return bedCollection.find(queryObj).sort({ [sortBy.type]: sortBy.order }).toArray()
        })
}

function getById(bedId) {
    bedId = new ObjectId(bedId)
    return mongoService.connectToDb()
        .then(dbConn => {
            const bedCollection = dbConn.collection('bed');
            return bedCollection.findOne({ _id: bedId })
        })
}
function remove(bedId) {
    bedId = new ObjectId(bedId)
    return mongoService.connectToDb()
        .then(dbConn => {
            const bedCollection = dbConn.collection('bed');
            return bedCollection.remove({ _id: bedId })
        })
}

module.exports = {
    query,
    getById,
    remove
}

