require('dotenv').config({silent: true});
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var express = require('express');
var app = module.exports = express();

var https_redirect = function(req, res, next) {
    if (process.env.NODE_ENV === 'production') {
        if (req.headers['x-forwarded-proto'] != 'https') {
            return res.redirect('https://' + req.headers.host + req.url);
        } else {
            return next();
        }
    } else {
        return next();
    }
};

app.use(https_redirect);

// Express settings
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static files
app.use('/normalize', express.static(__dirname + '/node_modules/normalize.css/'));
app.use('/font-awesome', express.static(__dirname + '/node_modules/font-awesome'));
app.use('/qrcode-generator', express.static(__dirname + '/node_modules/qrcode-generator'));
app.use('/angular-qrcode', express.static(__dirname + '/node_modules/angular-qrcode'));
app.use('/artyom.js', express.static(__dirname + '/node_modules/artyom.js/'));
app.use(express.static(path.join(__dirname, 'dist')));

// Server files
var google = require('./server/google.js');
var feedly = require('./server/feedly.js');
var weather = require('./server/weather.js');
var subway = require('./server/subway.js');
var verify = require('./server/verify.js');
var unsplash = require('./server/unsplash.js');
var ifttt = require('./server/ifttt.js');

// Middleware to prevent API access
app.use('/api', verify);
app.use('/google-auth', verify);

// Google API
app.get('/api/google/events', google.getEvents);
app.get('/api/google/calendars', google.getCalendars);

// Feedly API
app.get('/api/feedly/feed', feedly.getFeed);
app.get('/api/feedly/categories', feedly.getCategories);

// Weather API
app.get('/api/weather', weather);

// MTP API
app.get('/api/subway', subway);

// Unsplash API
app.get('/api/unsplash', unsplash);

// Google auth URL
app.get('/google-auth', google.connect);

// IFTTT API
app.get('/api/ifttt', ifttt);

// Serve index
app.get('/', function(req, res, next) {
    res.sendFile('/dist/site-index.html', { root: __dirname });
});

app.get('/dashboard', function(req, res, next) {
    res.sendFile('/dist/app-index.html', { root: __dirname });
});

app.get('/remote', function(req, res, next) {
    res.sendFile('/dist/app-index.html', { root: __dirname });
});

app.get('/login', function(req, res, next) {
    res.sendFile('/dist/app-index.html', { root: __dirname });
});

app.get('/register', function(req, res, next) {
    res.sendFile('/dist/app-index.html', { root: __dirname });
});

app.get('/*', function(req, res, next) {
    res.redirect('/')
});

// Start server
app.listen();