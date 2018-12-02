const mongoService = require('./mongo.service')
const ObjectId = require('mongodb').ObjectId;

//MAKE BETTER
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
            const user = dbConn.collection('user').findOne({ email })
            if (user) console.log('found user', user);
        })
}


function addUser(user) {
    return mongoService.connectToDb()
        .then(dbConn => dbConn.collection('user').insertOne(user))
        .then(res => {
            user._id = res.insertedId
            return user
        })
}

function getById(userId) {
    // userId = new ObjectId(userId)
    return mongoService.connectToDb()
        .then(dbConn => {
            const userCollection = dbConn.collection('user');
            return userCollection.findOne({ _id: userId })
        })
}

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
                    $unwind: '$beds'
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
    getUserBeds
}

