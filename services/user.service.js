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
                    if (user.password === pass) {
                        return getUserBeds(user._id)
                            .then(beds => {
                                (beds[0]) ? user.hostBeds = beds[0].beds : user.hostBeds = [];
                                return user
                            })
                    }
                    else throw Error('User doesnt exist!')
                })
        })
}

//ADD
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
    console.log(user)
    _id = new ObjectId(user._id)
    console.log ('objectid' , _id)
    return mongoService.connectToDb()
        .then(dbConn => {
            return dbConn.collection('user').updateOne({_id}, {$set: {hobbies: user.hobbies,
                 languages: user.languages,
                 aboutMe: user.aboutMe,
                 age: user.age,
                gender: user.gender
                }})
                .then(res => {
                    console.log('userservice age', user.age)
                    return res.modifiedCount
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
                        localField: '_id',
                        foreignField: 'hostId',
                        as: 'beds'
                    }
                }, 
                {
                    $project:
                    {
                        _id: false,
                        beds: 1
                    }
                }
            ]).toArray().then(res => res[0].beds)
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

