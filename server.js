const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const addBedRoutes = require('./routes/bed.route')
const addChatRoutes = require('./routes/chat.route')
const addUserRoutes = require('./routes/user.route')
const session = require('express-session')
const cors = require('cors')
var http = require('http').Server(app);
var io = require('socket.io').listen(http, {origins: 'http://localhost:8080'});

app.use(express.static('public'));

app.use(bodyParser.json());

app.use(session({
    secret: 'this is a secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use(cors({
    origin: ['http://localhost:8080'],
    credentials: true
}));

addBedRoutes(app)
addUserRoutes(app)
addChatRoutes(app)

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
 });
 


io.on("connection", function(socket){
  console.log("Socket Connection Established with ID :"+ socket.id)
  socket.on("chat", async function(chat){
    chat.created = new Date()
    let response = await new message(chat).save()
    socket.emit("chat",chat)
  })
})



