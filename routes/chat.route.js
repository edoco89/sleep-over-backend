
const chatService = require('../services/chat.service')


function addRoutes(app) {
    app.get('/api/chat/:chatId1/:chatId2', (req, res) => {
        const chatId1 = req.params.chatId1;
        const chatId2 = req.params.chatId2;
        chatService.getByIds(chatId1, chatId2)
            .then(chat => res.json(chat));
    })
    app.get('/api/chat/:chatId', (req, res) => {
        const chatId = req.params.chatId;
        chatService.getById(chatId)
            .then(chat => res.json(chat));
    })
    app.post('/api/chat/:chatId1/:chatId2', (req, res) => {
        const chatId1 = req.body.chatId1;
        const chatId2 = req.body.chatId2;
        chatService.create(chatId1, chatId2)
            .then(chat => {
                console.log(chat);
                return res.json(chat)
            });
    })
    app.put('/api/chat/:chatId', (req, res) => {
        const chatId = req.params.chatId;
        const message = req.body;
        chatService.update(chatId, message)
            .then(chat => {
                console.log(chat);
                return res.json(chat)
            });
    })

}



module.exports = addRoutes