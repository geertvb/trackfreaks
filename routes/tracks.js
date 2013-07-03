var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var Server = mongodb.Server;
var BSON = mongodb.BSONPure;
var db;

var server = new Server('localhost', 27017);
var mongoClient = new MongoClient(server);

mongoClient.open(function (err, mongoClient) {
    db = mongoClient.db("trackfreaks");
    db.collection('tracks', {strict: true}, function (err, collection) {
        if (err) {
            console.log("The 'employees' collection doesn't exist. Creating it with sample data...");
            populateTracks();
        }
    });
});


exports.findTrackById = function (req, res) {
    var id = new BSON.ObjectID(req.params.id);
    console.log('findTrackById: ' + id);

    db.collection('tracks', function (err, collection) {
        collection.findOne({'_id': id}, function (err, item) {
            console.log(item);
            res.json(item);
        });
    });
};

exports.createTrack = function (req, res) {
    var track = req.body;
    console.log('createTrack: ' + JSON.stringify(track));

    db.collection('tracks', function (err, collection) {
        collection.insert(track, {safe: true}, function (err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};

exports.updateTrack = function (req, res) {
    var id = new BSON.ObjectID(req.params.id);
    var track = req.body;
    delete track['_id'];
    console.log('updateTrack: ' + id + ', ' + JSON.stringify(track));

    db.collection('tracks', function (err, collection) {
        collection.update({'_id': id}, track, {safe: true}, function (err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            }   else {
                res.send(track);
            }
        });
    });
};

exports.deleteTrack = function (req, res) {
    var id = new BSON.ObjectID(req.params.id);
    console.log('deleteTrack: ' + id);

    db.collection('tracks', function (err, collection) {
        collection.remove({'_id': id}, {safe: true}, function (err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            }   else {
                res.send();
            }
        });
    });
};

exports.findAllTracks = function (req, res) {
    console.log('findAllTracks');

    db.collection('tracks', function (err, collection) {
        collection.find().toArray(function (err, items) {
            res.json(items);
        });
    });
};

var populateTracks = function () {
    console.log("populateTracks");

    var tracks = [
        {"name": "Zolder", "countryId": "BE"},
        {"name": "Francorchamps", countryId: "BE"},
        {"name": "Mettet", countryId: "BE"},
        {"name": "Zandvoort", countryId: "NL"},
        {"name": "Assen", countryId: "NL"},
        {"name": "Croix", countryId: "FR"},
        {"name": "Folembray", countryId: "FR"}
    ];

    db.collection('tracks', function (err, collection) {
        collection.insert(tracks, {safe: true}, function (err, result) {
        });
    });

};