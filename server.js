const express = require('express')
const app = express()
const addBedRoutes = require('./routes/bed.route')

const cors = require('cors')
app.use(cors({
    origin: ['http://localhost:8080'],
    credentials: true 
}));

addBedRoutes(app)



app.listen(3000)