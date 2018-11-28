const mongoService = require('./mongo.service')
const ObjectId = require('mongodb').ObjectId;

function query({ byCountry = '', byCity = '', type = 'rating', order = 1, accessibility = false,
    wifi = false, acceptsPets = false, airConditioner = false, shampoo = false, parking = false }) {
    const sortBy = { type, order: +order }
    const filterByAmeneties = { accessibility, wifi, acceptsPets, airConditioner, shampoo, parking }
    const queryObj = {
        $and: [
            { $or: [{ 'location.country': { $regex: `.*${byCountry.toLowerCase()}.*` } }, { 'location.country': { $regex: `.*${byCountry.toUpperCase()}.*` } }] },
            { $or: [{ 'location.city': { $regex: `.*${byCity.toLowerCase()}.*` } }, { 'location.city': { $regex: `.*${byCity.toUpperCase()}.*` } }] }
        ]
    }
    for (const key in filterByAmeneties) {
        if (JSON.parse(filterByAmeneties[key])) {
            queryObj.$and.push({ [`ameneties.${key}`]: true })
        }
    }
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

