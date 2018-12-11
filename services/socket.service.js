const chatService = require('./chat.service')
const userService = require('./user.service')
const ObjectId = require('mongodb').ObjectId;
const gChats = [];
const idToSocket = {};

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
        let loggedInUserId = null;
        socket.on('loggedIn', async (userId) => {
            loggedInUserId = userId;
            idToSocket[userId] = socket.id;
            let user = await userService.updateUserNewMsg(loggedInUserId, 0)
            socket.emit('setNewMsg', {number: user.newMsg})
        })
        socket.on('loggedOut', () => {
            delete idToSocket[loggedInUserId];
            loggedInUserId = null;
        })
        socket.on('chatRequest', ({ currUserId, userId, chatId }) => {
            var chat = findChat(chatId);
            if (!chat) {
                chat = createChat(chatId, currUserId, userId);
                gChats.push(chat);
                const userSocketId = idToSocket[userId];
                if (userSocketId) {
                    io.to(userSocketId).emit('newChat')
                }
            }
            socket.join(chatId);
            io.to(idToSocket[userId]).emit('newChat')
        })

        socket.on('sendMsg', async ({ chatId, message, userId }) => {
            chatService.sendNewMsg(chatId, message)
            const toUserId = findChat(chatId).members.find(id => id !== userId);
            const userSocketId = idToSocket[toUserId];
            let user = await userService.updateUserNewMsg(toUserId, 1)
            socket.emit('getMsg', {message, chatId})
            io.to(userSocketId).emit('getMsg', {message, chatId})
            io.to(userSocketId).emit('setNewMsg', {number: user.newMsg})
        })

        socket.on('setNewMsgPerChatL', async ({ chatId, userId, number }) => {
            const currUserId = findChat(chatId).members.find(id => id !== userId);
            const userSocketId = idToSocket[currUserId];
            chatService.udateNewMsgPerChat(chatId, userId);
            let user = await userService.updateUserNewMsg(currUserId, -number)
            socket.emit('setNewMsg', {number: user.newMsg})
            socket.emit('setNewMsgPerChat', {userId} )
        }),
        socket.on('disconnect', () => {
            if (!loggedInUserId) return
            delete idToSocket[loggedInUserId]
        })

    })
}

module.exports = setupIO
