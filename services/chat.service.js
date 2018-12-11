const mongoService = require('./mongo.service')
const userService = require('./user.service')
const ObjectId = require('mongodb').ObjectId;


function getByIds(userId1, userId2) {
    userId1 = new ObjectId(userId1)
    userId2 = new ObjectId(userId2)
    const usersId = [userId1, userId2]
    usersId.sort((id1, id2) => id1 > id2 ? 1 : -1)
    return mongoService.connectToDb()
        .then(dbConn => {
            const chatCollection = dbConn.collection('chat');
            return chatCollection.findOne({ usersId })
        })
}

function getByUserId(userId) {
    const id = new ObjectId(userId)
    return mongoService.connectToDb()
        .then(dbConn =>
            dbConn.collection('chat').aggregate([
                {
                    $match: {
                        usersId: { $in: [id] }
                    }
                },
                {
                    $lookup:
                        {
                            from: 'user',
                            let: {
                                usersId: '$usersId'
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $ne: ['$_id', id] },
                                                { $in: ['$_id', '$$usersId'] }
                                            ]
                                        }
                                    }
                                }
                            ],
                            as: 'users'
                        }
                },
                {
                    $unwind: '$users'
                },
                {
                    $group: {
                        _id: 'usersId',
                        users: { $push: '$users' }
                    }
                }
            ]).toArray()
                .then(res => (res.length > 0) ? res[0].users : [])
        )
}

function create(userId1, userId2) {
    userId1 = new ObjectId(userId1)
    userId2 = new ObjectId(userId2)
    const usersId = [userId1, userId2]
    usersId.sort((id1, id2) => id1 > id2 ? 1 : -1)
    return mongoService.connectToDb()
        .then(async dbConn => {
            const chatCollection = dbConn.collection('chat');
            const result = await chatCollection.insertOne(
                {
                    usersId,
                    messages: []
                })
            const chatId = result.insertedId
            userService.updateUserChatHistory(chatId, userId1)
            userService.updateUserChatHistory(chatId, userId2)
            return chatCollection.findOne({ usersId })
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
function sendNewMsg(chatId, message) {
    chatId = new ObjectId(chatId)
    return mongoService.connectToDb()
        .then(dbConn => {
            const chatCollection = dbConn.collection('chat');
            chatCollection.updateOne({ _id: chatId },
                { $push: { messages: message } })
        })
}

function udateNewMsg(chatId, message) {
    chatId = new ObjectId(chatId)
    return mongoService.connectToDb()
        .then(dbConn => {
            const chatCollection = dbConn.collection('chat');
            chatCollection.updateOne({ _id: chatId },
                { $push: { messages: message } })
            return chatCollection.findOne({ _id: chatId })
        })
}

function udateNewMsgPerChat(chatId, userId) {
    chatId = new ObjectId(chatId)
    return mongoService.connectToDb()
        .then(dbConn => {
            const chatCollection = dbConn.collection('chat');
            chatCollection.findOneAndUpdate({ _id: chatId }, {
                $set: {
                    'messages.$[msg].isRead': true
                }
            },
                {
                    multi: true,
                    arrayFilters: [{ 'msg.from': userId }],
                })
        })
}

module.exports = {
    getByIds,
    remove,
    sendNewMsg,
    create,
    getByUserId,
    udateNewMsgPerChat
}
