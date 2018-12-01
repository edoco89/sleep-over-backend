
const userService = require('../services/user.service')


function addRoutes(app) {
    //CHECK    
    app.get('/api/user', (req, res) => {
        const filter = req.query;
        userService.query(filter)
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

    app.post('/api/user/singup', (req, res) => {
        const user = req.body.user
        userService.addUser(user)
            .then(user => res.json(user))
    })

    //CHECK
    app.delete('/api/user/:userId', (req, res) => {
        const userId = req.params.userId;
        userService.remove(userId)
            .then(() => res.end())
    })

}



module.exports = addRoutes