const mongoService = require('./mongo.service')
const ObjectId = require('mongodb').ObjectId;

function query({ byLat = 32.0853, byLng = 34.7818, type = 'rating', order = 1, accessibility = false,
    wifi = false, acceptsPets = false, airConditioner = false, shampoo = false, parking = false }) {
    const sortBy = { type, order: +order }
    const filterByAmeneties = { accessibility, wifi, acceptsPets, airConditioner, shampoo, parking }
    // _getDistanceFromLatLonInKm(byLat,byLng,lat2,lon2)
    console.log(byLat, byLng);

    const queryObj = {
            $and: [
                {'location.coords': {
                    $near: {
                        $geometry:
                            { type: "Point", coordinates: [+byLng, +byLat] }, $maxDistance: 20000
                    }
                }
                },
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
            bedCollection.createIndex({ 'location.coords': "2dsphere" });
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

function _getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = _deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = _deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function _deg2rad(deg) {
    return deg * (Math.PI / 180)
}
