const mongoService = require('./mongo.service')
const ObjectId = require('mongodb').ObjectId;

function query({ byLat = 32.0853, byLng = 34.7818, type = 'rating', order = 1, accessibility = false,
    wifi = false, acceptsPets = false, airConditioner = false, shampoo = false, parking = false, children = false,
    byStart = new Date().getTime(), byEnd = new Date().getTime() }) {
    const sortBy = { type, order: +order }
    const filterByAmeneties = { accessibility, wifi, acceptsPets, airConditioner, shampoo, parking, children }
    const queryObj = {
        $and: [
            {
                'location.coords': {
                    $near: {
                        $geometry:
                            { type: "Point", coordinates: [+byLng, +byLat] }, $maxDistance: 20000
                    }
                }
            }
            ,
            {
                $nor: [
                    { unAvailable: { $elemMatch: { start: { $gte: +byStart, $lte: +byEnd } } } },
                    { unAvailable: { $elemMatch: { end: { $gte: +byStart, $lte: +byEnd } } } }
                ]
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
    bed.hostId = new ObjectId(bed.hostId)
    const _id = new ObjectId(bed._id)
    delete bed._id;
    return mongoService.connectToDb()
        .then(dbConn => {
            dbConn.collection('bed').updateOne({ _id },
                { $set: { ...bed } }, { upsert: true })
            return dbConn.collection('bed').findOne({ _id })
        })
}

//built currently only for reviews

function updateBedReviews(reviews, bedId) {
    console.log(reviews)
    // _id = new ObjectId(reviews[reviews.length - 1].bedId)
    return mongoService.connectToDb()
        .then(dbConn => {
            return dbConn.collection('bed').updateOne({ _id: bedId }, { $set: { reviews } })
                .then(res => {
                    console.log('action complete review')
                    return res.modifiedCount
                })
        })
}

module.exports = {
    query,
    getById,
    remove,
    addBed,
    updateBedReviews
}
