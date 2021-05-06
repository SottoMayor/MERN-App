const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const initDB = cb => {

    if(_db){
        console.log('The Database is prepared!');
        return cb(null, _db);
    }

    MongoClient.connect('mongodb+srv://David:u1d0ToycqwH1YlXj@cluster0.9gsy2.mongodb.net/shop?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then( client => {
        console.log('We are connected!');
        _db = client;
        cb(null, _db)
    })
    .catch( err => {
        cb(err);
    });

}

const getDB = () => {
    if(!_db){
        throw new Error('Error! The Datebase is not available yet!');
    }

    return _db;
}

exports.initDB = initDB;
exports.getDB = getDB;