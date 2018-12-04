const mongoService = require('./mongo.service')
const ObjectId = require('mongodb').ObjectId;


function getByIds(chatId1, chatId2) {
    chatId1 = new ObjectId(chatId1)
    chatId2 = new ObjectId(chatId2)
    console.log(chatId1, chatId2);
    return mongoService.connectToDb()
        .then(dbConn => {
            const chatCollection = dbConn.collection('chat');
            return chatCollection.findOne(
                {
                    $or: [
                        { usersId: [chatId1, chatId2] },
                        { usersId: [chatId2, chatId1] }
                    ]
                })
        })
}
function getByUserId(userId) {
    const id = new ObjectId(userId)
    console.log({ id })
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
                    $project: {
                        _id: false,
                        users: true
                    }
                }
            ]).toArray().then(res => res[0].users)
        )
}

function create(chatId1, chatId2) {
    chatId1 = new ObjectId(chatId1)
    chatId2 = new ObjectId(chatId2)
    const usersId = [chatId1, chatId2]
    usersId.sort((id1, id2) => id1 > id2 ? 1 : -1)
    console.log(chatId1, chatId2);
    return mongoService.connectToDb()
        .then(dbConn => {
            const chatCollection = dbConn.collection('chat');
            return chatCollection.insertOne(
                {
                    usersId,
                    messages: []
                })
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
function update(chatId, message) {
    chatId = new ObjectId(chatId)
    console.log(chatId, message);
    return mongoService.connectToDb()
        .then(dbConn => {
            const chatCollection = dbConn.collection('chat');
            chatCollection.update({ _id: chatId },
                { $push: { messages: message } })
            return chatCollection.findOne({ _id: chatId })
        })
}

module.exports = {
    getByIds,
    remove,
    update,
    create,
    getByUserId
}
