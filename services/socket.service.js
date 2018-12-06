const chatService = require('./chat.service')
const userService = require('./user.service')
const ObjectId = require('mongodb').ObjectId;
const gChats = [];

const findChat = (chatId) =>
    gChats.find(chat => chat.id === chatId);

const findUser = (chat, currUserId) =>
    chat.members.find(userId => userId === currUserId);

const createChat = (chatId, currUserId, userId) => ({
    members: [currUserId, userId],
    id: chatId
});

function setupIO(io) {
    io.on('connection', socket => {
        socket.on('chatRequest', ({ currUserId, userId, chatId }) => {
            console.log('chatRequest', currUserId, userId, chatId )
            chatService.getById
            var chat = findChat(chatId);
            if (!chat) {
                chat = createChat(chatId, currUserId, userId);
                gChats.push(chat);
            }
            socket.join(chatId);
            io.to(chatId).emit('userConnected', userId);
        })
        socket.on('sendMsg', ({ chatId, message, userId }) => {
            chatService.sendNewMsg(chatId, message)
            userService.updateUserNewMsg(userId, 1)
            io.to(chatId).emit('getMsg', message)
            socket.to(chatId).emit('setNewMsg', 1)
        })

        socket.on('setNewMsg', ({ chatId, userId, number }) => {
            userService.updateUserNewMsg(userId, +number)
            socket.to(chatId).emit('setNewMsg', +number)
        })

    })
}

module.exports = setupIO
