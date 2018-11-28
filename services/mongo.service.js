
const MongoClient = require('mongodb').MongoClient;


const url = 'mongodb://sleepOver:abcd1234@ds217864.mlab.com:17864/bed_db';

const dbName = 'bed_db';

var dbConnection = null;

function connectToDb() {
    if (dbConnection) return Promise.resolve(dbConnection);
    return new Promise((resolve, reject)=>{
         MongoClient.connect(url , (err, client) => {
            if (err) return reject('Cannot connect to Mongo');
            console.log("Connected successfully to server");
            dbConnection = client.db(dbName);
            resolve(dbConnection)
        });

    });
}


module.exports = {
    connectToDb
}