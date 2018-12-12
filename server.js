const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const addBedRoutes = require('./routes/bed.route')
const addChatRoutes = require('./routes/chat.route')
const addUserRoutes = require('./routes/user.route')
const session = require('express-session')
const cors = require('cors')
var http = require('http').Server(app);
var io = process.env.PORT
  ? require('socket.io').listen(http)
  : require('socket.io').listen(http, { origins: 'http://localhost:8080' });
var history = require('connect-history-api-fallback');

//var io should be addressed - according to chen it's a dirty fix


app.use(bodyParser.json());

app.use(cors({
  origin: ['http://localhost:8080'],
  credentials: true
}));
app.use(session({
  secret: 'this is a secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.use(history());

addBedRoutes(app)
addUserRoutes(app)
addChatRoutes(app)

app.use(express.static('public'));

const port = process.env.PORT || 3000;

const setupIoConnection = require('./services/socket.service')

setupIoConnection(io)

http.listen(port, () => {
  console.log(`App listening on port ${port}!`)
});

