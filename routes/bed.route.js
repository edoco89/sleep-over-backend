
const bedService = require('../services/bed.service')


function addRoutes(app) {
    app.get('/api/bed', (req, res) => {
        const filter = req.query;
        bedService.query(filter)
            .then(beds => res.json(beds))
    });
    
    app.get('/api/bed/:bedId', (req, res) => {
        const bedId = req.params.bedId;
        bedService.getById(bedId)
            .then(toy => res.json(bed))  
    })
    
    app.delete('/api/bed/:bedId', (req, res) => {
        const bedId = req.params.bedId;
        bedService.remove(bedId)
            .then(() => res.end())  
    })
    
}



module.exports = addRoutes