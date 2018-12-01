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
    return mongoService.connect()
        .then(db => {
            const user = db.collection('user').findOne({ email })
            if (user) console.log('found user', user);
        })
}


function addUser(user) {
    return mongoService.connect()
        .then(db => db.collection('user').insertOne(user))
        .then(res => {
            user._id = res.insertedId
            return user
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
function remove(userId) {
    userId = new ObjectId(userId)
    return mongoService.connectToDb()
        .then(dbConn => {
            const userCollection = dbConn.collection('user');
            return userCollection.remove({ _id: userId })
        })
}

module.exports = {
    query,
    getById,
    remove,
    checkLogin,
    addUser
}

