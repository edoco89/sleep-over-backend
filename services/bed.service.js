const mongoService = require('./mongo.service')
const ObjectId = require('mongodb').ObjectId;

function query({ byLat = 32.0853, byLng = 34.7818, type = 'rating', order = 1, accessibility = false,
    wifi = false, acceptsPets = false, airConditioner = false, shampoo = false, parking = false, children = false,
    byStart = new Date().toLocaleDateString("en-US"), byEnd = new Date().toLocaleDateString("en-US") }) {
    const sortBy = { type, order: +order }
    const filterByAmeneties = { accessibility, wifi, acceptsPets, airConditioner, shampoo, parking, children }
    console.log(byStart, byEnd);

    const queryObj = {
        $and: [
            {
                'location.coords': {
                    $near: {
                        $geometry:
                            { type: "Point", coordinates: [+byLng, +byLat] }, $maxDistance: 2000
                    }
                }
            },
        ],
        $nor: [
            {
                unAvailable: {
                    $elemMatch: {
                        start: { $gte: new Date(byStart) },
                        end: { $gte: new Date(byEnd) }
                    }
                }
            }
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


function addBed(bed) {
    return mongoService.connectToDb()
        .then(dbConn => {
            return dbConn.collection('bed').insertOne(bed)
                .then(res => {
                    bed._id = res.insertedId
                    return bed
                })
        })
}

module.exports = {
    query,
    getById,
    remove,
    addBed
}
