var express = require('express');
var trackfreaks = require('./routes/tracks');
//var mongodb = require('mongodb');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

passport.use(new LocalStrategy(
    function(username, password, done) {
        /*
        User.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
        */
        if (username === password) {
            return done(null, {username:username, password: '********'});
        } else {
            return done(null, false, { message: 'Incorrect username or password.' });
        }
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(object, done) {
    done(null, object);
    /*
    User.findById(id, function(err, user) {
        done(err, user);
    });
    */
});

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({ secret: 'keyboard cat' }));
    app.use(passport.initialize());
    app.use(passport.session());
});

app.post('/login',
    passport.authenticate('local', {
        successReturnToOrRedirect: '/',
        failureRedirect: '/login'})
);

app.get('/login', function(req, res){
    //res.send('hello world');
    res.sendfile(__dirname + '/public/login.html');
});

app.all('/*', ensureLoggedIn('/login'));

app.get('/resources/tracks/:id', trackfreaks.findTrackById);
app.put('/resources/tracks/:id', trackfreaks.updateTrack);
// app.post('/resources/tracks/:id', trackfreaks.updateTrack); // workaround for Angular Resource
app.post('/resources/tracks', trackfreaks.createTrack);
app.get('/resources/tracks', trackfreaks.findAllTracks);
app.delete('/resources/tracks/:id', trackfreaks.deleteTrack);

app.use(express.static(__dirname + '/public'));

app.listen(3000);
