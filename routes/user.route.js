
const userService = require('../services/user.service')


function addRoutes(app) {

    //QUERY-WORKS. NOT IN USE CURRENTLY   
    app.get('/api/user', (req, res) => {
        userService.query()
            .then(users => res.json(users))
    });

    //LOGIN
    app.post('/api/user/login', (req, res) => {
        const { email, pass } = req.body;
        userService.checkLogin(email, pass)
            .then(user => {
                req.session.loggedinUser = user;
                return res.json(user);
            })
            .catch(err => res.status(401).send(err))
    })

    //SIGNUP
    app.post('/api/user/signup', (req, res) => {
        const user = req.body.newUser;
        userService.addUser(user)
            .then(user => {
                req.session.loggedinUser = user;
                return res.json(user)
            })
            .catch(err => res.status(403).send(err))
    })

    //USER WITH ALL ITS BEDS
    app.get('/api/user/userBeds/:userId', (req, res) => {
        const userId = req.params.userId;
        userService.getUserBeds(userId)
            .then(userBeds => res.json(userBeds))
    })

    //DELETE- WORKS. NOT IN USE CURRENTLY
    app.delete('/api/user/:userId', (req, res) => {
        const userId = req.params.userId;
        userService.remove(userId)
            .then(() => res.end())
    })

    //USER BY ID- WORKS. NOT IN USE CURRENTLY
    app.get('/api/user/:userId', (req, res) => {
        const userId = req.params.userId;
        userService.getById(userId)
            .then(user => res.json(user))
    })

}



module.exports = addRoutes