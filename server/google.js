require('dotenv').config({silent: true});
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var firebase = require('firebase');
var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

var clientSecret = process.env.GOOGLE_CLIENTSECRET;
var clientId  = process.env.GOOGLE_CLIENTID;

exports.getEvents = function(req, res) {
  var db = firebase.database();
  var ref = db.ref('/users/'+req.decoded.sub);

  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, getRedirectUrl(req));
  
  ref.once("value", function(snapshot) {
    var credentials = snapshot.child('credentials').child('google').val();
    var calendarId = snapshot.child('preferences').child('calendar').val();
    oauth2Client.credentials = credentials;

    google.calendar('v3').events.list({
      auth: oauth2Client,
      calendarId: calendarId,
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime'
    }, function(err, response) {
      if (err) {
        res.send({'success': false, 'error': err});
        return;
      }
      res.send(response.items);
    });
  });
}

exports.getCalendars = function(req, res) {
  var db = firebase.database();
  var ref = db.ref('/users/'+req.decoded.sub);
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, getRedirectUrl(req));
  
  ref.once("value", function(snapshot) {
    var credentials = snapshot.child('credentials').child('google').val();
    oauth2Client.credentials = credentials;
    
    if (credentials) {
      google.calendar('v3').calendarList.list({
      auth: oauth2Client
      }, function(err, response) {
        if (err) {
          res.send({'success': false, 'error': err});
          return;
        }
        res.send(response.items);
      });
    }
  });
}

exports.connect = function(req, res) {
  var db = firebase.database();
  var ref = db.ref('/users/'+req.decoded.sub+'/credentials/google');
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, getRedirectUrl(req));

  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    approval_prompt: 'force'
  });
  if(!req.query.code) {
    res.redirect(authUrl);
  } else {
    oauth2Client.getToken(req.query.code, function(err, token) {
      if (err) {
        res.send({'success': false, 'error': err});
      } else {
        oauth2Client.credentials = token;
        ref.set(token);
      }
      res.redirect(req.cookies.redirect);
    });
  }
}

function getRedirectUrl(req) {
  if(req.headers.host === 'localhost:3000') {
    return process.env.GOOGLE_DEVREDIRECT;
  } else {
    return process.env.GOOGLE_PRODREDIRECT;
  }
}