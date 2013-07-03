var express = require('express');
var trackfreaks = require('./routes/tracks');
 
var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

app.get('/resources/tracks/:id', trackfreaks.findTrackById);
app.put('/resources/tracks/:id', trackfreaks.updateTrack);
// app.post('/resources/tracks/:id', trackfreaks.updateTrack); // workaround for Angular Resource
app.post('/resources/tracks', trackfreaks.createTrack);
app.get('/resources/tracks', trackfreaks.findAllTracks);
app.delete('/resources/tracks/:id', trackfreaks.deleteTrack);

app.use(express.static(__dirname + '/public'));

app.listen(3000);
