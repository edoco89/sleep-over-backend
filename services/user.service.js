const mongoService = require('./mongo.service')
const ObjectId = require('mongodb').ObjectId;

//WORKS. NOT IN USE CURRENTLY
function query() {
    return mongoService.connectToDb()
        .then(dbConn => {
            const userCollection = dbConn.collection('user');
            return userCollection.find().toArray()
        })
}


function checkLogin(email, pass) {
    return mongoService.connectToDb()
        .then(dbConn => {
            return dbConn.collection('user').findOne({ email })
                .then(user => {
                    if (user.password === pass) return user
                    else throw Error('User doesnt exist!')
                })
        })
}


function addUser(user) {
    return mongoService.connectToDb()
        .then(dbConn => {
            const email = user.email
            return dbConn.collection('user').findOne({ email })
                .then((exists) => {
                    if (!exists) {
                        return dbConn.collection('user').insertOne(user)
                            .then(res => {
                                user._id = res.insertedId
                                return user
                            })
                    }
                    else throw Error('User already exists!')
                })
        })
}

// Added update** upsert is true so should be used for add as well

function updateUser(user) {
    return mongoService.connectToDb()
        .then(dbConn => {
            const email = user.email
            return dbConn.collection('user').updateOne({ email }, {$set: {user}}, { upsert: true })
                .then(res => {
                    return user
                })
        })
}

function getById(userId) {
    userId = new ObjectId(userId)
    return mongoService.connectToDb()
        .then(dbConn => {
            const userCollection = dbConn.collection('user');
            return userCollection.findOne({ _id: userId })
        })
}

//WORKS. NOT IN USE CURRENTLY
function remove(userId) {
    userId = new ObjectId(userId)
    return mongoService.connectToDb()
        .then(dbConn => {
            const userCollection = dbConn.collection('user');
            return userCollection.remove({ _id: userId })
        })
}


function getUserBeds(userId) {
    const id = new ObjectId(userId)
    console.log('server gets', userId);

    return mongoService.connectToDb()
        .then(dbConn =>
            dbConn.collection('user').aggregate([
                {
                    $match: { _id: id }
                },
                {
                    $lookup:
                    {
                        from: 'bed',
                        localField: 'hostBedsId',
                        foreignField: 'likeId',
                        as: 'bed'
                    }
                }, {
                    $unwind: '$bed'
                },
                {
                    $group:
                    {
                        _id: "beds",
                        beds: { $push: "$bed" }
                    }
                }
            ]).toArray()
        )
}

module.exports = {
    query,
    getById,
    remove,
    checkLogin,
    addUser,
    getUserBeds,
    updateUser
}

