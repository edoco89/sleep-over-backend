
const bedService = require('../services/bed.service')


function addRoutes(app) {
    app.get('/api/bed', (req, res) => {
        const filter = req.query;
        bedService.query(filter)
            .then(beds => res.json(beds))
    });

    app.post('/api/bed', (req, res) => {
        const bed = req.body.bed;
        bedService.addBed(bed)
            .then(beds => res.json(beds))
    });

    //update bed with new review
    app.post('/api/bed/:bedId', (req, res) => {
        console.log('server side post bed route', req.body)
        const bedId = req.params.bedId;
        const reviews = req.body;
        bedService.updateBedReviews(reviews, bedId)
    });

    app.get('/api/bed/:bedId', (req, res) => {
        const bedId = req.params.bedId;
        bedService.getById(bedId)
            .then(bed => res.json(bed))
    })

    app.delete('/api/bed/:bedId', (req, res) => {
        const bedId = req.params.bedId;
        bedService.remove(bedId)
            .then(() => res.end())
    })

}



module.exports = addRoutes