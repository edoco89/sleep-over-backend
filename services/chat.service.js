const mongoService = require('./mongo.service')
const ObjectId = require('mongodb').ObjectId;


function getById(chatId) {
    chatId = new ObjectId(chatId)
    return mongoService.connectToDb()
        .then(dbConn => {
            const chatCollection = dbConn.collection('chat');
            return chatCollection.findOne({ _id: chatId })
        })
}
function remove(chatId) {
    chatId = new ObjectId(chatId)
    return mongoService.connectToDb()
        .then(dbConn => {
            const chatCollection = dbConn.collection('chat');
            return chatCollection.remove({ _id: chatId })
        })
}
function update(chat) {
    const chatId = new ObjectId(chat._id)
    return mongoService.connectToDB()
        .then(dbConn => {
            const chatCollection = dbConn.collection('chat');
            return chatCollection.updateOne({ _id: chatId },
                { $set: { name: chat.name, price: chat.price, type: chat.type, inStock: chat.inStock } })
        })
}

module.exports = {
    getById,
    remove,
    update
}
