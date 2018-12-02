
const userService = require('../services/user.service')


function addRoutes(app) {
    //WORKS. NOT IN USE CURRENTLY   
    app.get('/api/user', (req, res) => {
        userService.query()
            .then(users => res.json(users))
    });

    app.post('/api/user/login', (req, res) => {
        const { email, pass } = req.body;
        userService.checkLogin(email, pass)
            .then(user => {
                req.session.loggedinUser = user;
                return res.json(user);
            })
            .catch(err => res.status(401).send(err))
    })

    app.post('/api/user/signup', (req, res) => {
        const user = req.body.newUser;
        userService.addUser(user)
            .then(user => {
                req.session.loggedinUser = user;
                return res.json(user)
            })
            .catch(err => res.status(403).send(err))
    })

    app.get('/api/user/userBeds/:userId', (req, res) => {
        const userId = req.params.userId;
        userService.getUserBeds(userId)
            .then(userBeds => res.json(userBeds))
    })

    //WORKS. NOT IN USE CURRENTLY
    app.delete('/api/user/:userId', (req, res) => {
        const userId = req.params.userId;
        userService.remove(userId)
            .then(() => res.end())
    })

    app.get('/api/user/:userId', (req, res) => {
        const userId = req.params.bedId;
        userService.getById(userId)
            .then(user => res.json(user))
    })

}



module.exports = addRoutes