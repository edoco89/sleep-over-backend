
const userService = require('../services/user.service')
const chatService = require('../services/chat.service')
const ObjectId = require('mongodb').ObjectId;

function addRoutes(app) {
    app.get('/api/chat/:userId1/:userId2', (req, res) => {
        const userId1 = req.params.userId1;
        const userId2 = req.params.userId2;
        chatService.getByIds(userId1, userId2)
            .then(chat => res.json(chat));
    })

    app.get('/api/chat/:userId', (req, res) => {
        const userId = req.params.userId;
        chatService.getByUserId(userId)
            .then(chat => res.json(chat));
    })

    app.post('/api/chat/:userId1/:userId2', (req, res) => {
        const userId1 = req.params.userId1;
        const userId2 = req.params.userId2;
        chatService.create(userId1, userId2)
            .then(chat =>  res.json(chat))
            })

    app.put('/api/chat/:chatId', (req, res) => {
        const chatId = req.params.chatId;
        const message = req.body;
        chatService.update(chatId, message)
            .then(chat => {
                return res.json(chat)
            });
    })

}



module.exports = addRoutes