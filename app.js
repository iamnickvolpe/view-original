require('dotenv').config({silent: true});
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var express = require('express');
var app = module.exports = express();

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
app.use(express.static(path.join(__dirname, 'dist')));

// Initialize Firebase on the server
var firebase = require("firebase");
var key = process.env.FBS_PRIVATEKEY.replace(/\\n/g, '\n');

firebase.initializeApp({
  serviceAccount: {
    project_id: process.env.FBS_PROJECTID,
    private_key: key,
    client_email: process.env.FBS_CLIENTEMAIL
  },
  databaseURL: process.env.FBC_DBURL
});

// Server files
var google = require('./server/google.js');
var feedly = require('./server/feedly.js');
var weather = require('./server/weather.js');
var verify = require('./server/verify.js');

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

// Google auth URL
app.get('/google-auth', google.connect);

// Serve index
app.get('/*', function(req, res, next) {
    res.sendFile('/dist/index.html', { root: __dirname });
});

// Start server
app.listen();