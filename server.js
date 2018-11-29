const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const addBedRoutes = require('./routes/bed.route')
const addUserRoutes = require('./routes/user.route')
const session = require('express-session')
const cors = require('cors')

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



app.listen(3000)