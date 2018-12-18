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
function checkLogin(email, password) {
    return mongoService.connectToDb()
        .then(dbConn => {
            return dbConn.collection('user').findOne({ email })
                .then(user => {
                    if (user.password === password) {
                        return getUserBeds(user._id)
                            .then(beds => {
                                (beds.length > 0) ? user.hostBeds = beds : user.hostBeds = [];
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
    const _id = new ObjectId(user._id)
    delete user._id;
    return mongoService.connectToDb()
        .then(async dbConn => {
            await dbConn.collection('user').updateOne({ _id },
                { $set: { ...user } })
            return dbConn.collection('user').findOne({ _id })
        })
}


function updateUserChatHistory(chatId, userId) {
    chatId = new ObjectId(chatId)
    userId = new ObjectId(userId)
    return mongoService.connectToDb()
        .then(dbConn => {
            const userCollection = dbConn.collection('user');
            return userCollection.updateOne({ _id: userId },
                { $push: { chatHistory: chatId } })
        })
}

function updateUserNewMsg(userId, num) {
    userId = new ObjectId(userId)
    return mongoService.connectToDb()
        .then(async dbConn => {
            const userCollection = dbConn.collection('user');
            await userCollection.updateOne({ _id: userId },
                { $inc: { newMsg: num } })
            return userCollection.findOne({ _id: userId })
        })
}

function updateUserStays(guestId, sleepOver) {
    guestId = new ObjectId(guestId)
    return mongoService.connectToDb()
        .then(async dbConn => {
            const userCollection = dbConn.collection('user');
            await userCollection.updateOne({ _id: guestId },
                { $push: { stays: sleepOver } })
            return userCollection.findOne({ _id: guestId })
        })
}

function updateUserNewBookRequest(userId, num) {
    userId = new ObjectId(userId)
    return mongoService.connectToDb()
        .then(async dbConn => {
            const userCollection = dbConn.collection('user');
            await userCollection.updateOne({ _id: userId },
                { $inc: { newBookRequest: num } })
            return userCollection.findOne({ _id: userId })
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
    updateUser,
    updateUserChatHistory,
    updateUserNewMsg,
    updateUserNewBookRequest,
    updateUserStays
}

