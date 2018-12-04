const chatService = require('./chat.service')

function setupIO(io) {
    io.on('connection', function (socket) {
        console.log("Socket Connection Established with ID :" + socket.id)
        socket.on("chat", async function (chat) {
            chat.created = new Date()
            let response = await new message(chat).save()
            socket.emit("chat", chat)
        })
    })
}

module.exports = setupIO
