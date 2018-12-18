
const userService = require('../services/user.service')


function addRoutes(app) {

    //QUERY-WORKS. NOT IN USE CURRENTLY   
    app.get('/api/user', (req, res) => {
        userService.query()
            .then(users => res.json(users))
    });

    //LOGIN
    app.post('/api/user/login', (req, res) => {
        const { email, password } = req.body;
        userService.checkLogin(email, password)
            .then(user => {
                req.session.loggedInUser = { email: user.email, password: user.password };
                return res.json(user);
            })
            .catch(err => res.status(401).send(err))
    })

    //LOGOUT
    app.delete(`/api/user/logout`, (req, res) => {
        req.session.destroy();
    })

    //SIGNUP
    app.post('/api/user/signup', (req, res) => {
        const user = req.body.newUser;
        userService.addUser(user)
            .then(user => {
                req.session.loggedInUser = { email: user.email, password: user.password };
                return res.json(user)
            })
            .catch(err => res.status(403).send(err))
    })

    //Added update
    app.put('/api/user/:userId', (req, res) => {
        const user = req.body.user;
        userService.updateUser(user)
            .then(user => {
                req.session.loggedInUser = { email: user.email, password: user.password };
                return res.json(user)
            })
            .catch(err => res.status(403).send(err))
    })

    //AGGREGATE
    app.get('/api/user/userBeds/:userId', (req, res) => {
        const userId = req.params.userId;
        userService.getUserBeds(userId)
            .then(userBeds => res.json(userBeds))
    })

    //DELETE- WORKS. NOT IN USE CURRENTLY
    app.post('/api/user/:userId', (req, res) => {
        const userId = req.params.userId;
        userService.remove(userId)
            .then(() => res.end())
    })

    //USER BY ID
    app.get('/api/user/:userId', (req, res) => {
        const userId = req.params.userId;
        userService.getById(userId)
            .then(user => res.json(user))
    })

}



module.exports = addRoutes