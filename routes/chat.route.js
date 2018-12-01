
const chatService = require('../services/chat.service')


function addRoutes(app) {
    app.get('/api/chat/:chatId', (req, res) => {
        const chatId = req.params.chatId;
        chatService.getById(chatId)
            .then(chat => res.json(chat))
    })
    app.put('/api/chat/:chatId', (req, res) => {
        const chat = req.body;
        chatService.update(chat)
            .then(chat => res.json(chat));
    })

    // app.put('/api/chat/:chatId', (req, res) => {
    //     const bedId = req.body;
    //     bedService.remove(bedId)
    //         .then(() => res.end())  
    // })

}



module.exports = addRoutes