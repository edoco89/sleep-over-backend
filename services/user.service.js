const mongoService = require('./mongo.service')
const ObjectId = require('mongodb').ObjectId;

//QUERY-WORKS. NOT IN USE CURRENTLY
function query() {
    return mongoService.connectToDb()
        .then(dbConn => {
            const userCollection = dbConn.collection('user');
            return userCollection.find().toArray()
        })
}

//LOGIN
function checkLogin(email, pass) {
    return mongoService.connectToDb()
        .then(dbConn => {
            return dbConn.collection('user').findOne({ email })
                .then(user => {
                    if (user.password === pass) return user
                    else throw Error('user dont excist!')
                })
        })
}

//ADD
function addUser(user) {
    return mongoService.connectToDb()
        .then(dbConn => {
            const email = user.email
            return dbConn.collection('user').findOne({ email })
                .then((excist) => {
                    if (!excist) {
                        return dbConn.collection('user').insertOne(user)
                            .then(res => {
                                user._id = res.insertedId
                                return user
                            })
                    }
                    else throw Error('user excist!')
                })
        })
}

//GET BY ID
function getById(userId) {
    userId = new ObjectId(userId)
    return mongoService.connectToDb()
        .then(dbConn => {
            const userCollection = dbConn.collection('user');
            return userCollection.findOne({ _id: userId })
        })
}

//DELETE- WORKS. NOT IN USE CURRENTLY
function remove(userId) {
    userId = new ObjectId(userId)
    return mongoService.connectToDb()
        .then(dbConn => {
            const userCollection = dbConn.collection('user');
            return userCollection.remove({ _id: userId })
        })
}

//USER WITH ALL HIS BEDS
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
    getUserBeds
}

