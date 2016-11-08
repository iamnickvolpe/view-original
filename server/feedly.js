var Feedly = require('feedly');
var request = require('request');
var fs = require('fs');
var options;
var db = require('../app.js').FBApp.database();

exports.getFeed = function(req, res) {
  var ref = db.ref('/users/'+req.decoded.sub);
  ref.once("value", function(snapshot) {

    var token = snapshot.child('credentials').child('feedly').child('token').val();
    var category = snapshot.child('preferences').child('category').val();
    var userId = snapshot.child('credentials').child('feedly').child('userId').val();
    var url;

    if(category === 'global.all' || !category || category === '') {
      url = 'http://cloud.feedly.com/v3/streams/contents?streamId=user/'+userId+'/category/global.all'
    } else {
      url = 'http://cloud.feedly.com/v3/streams/contents?streamId='+JSON.parse(category).id;
    }

    options = {
      url: url,
      headers: {
        'Authorization': 'OAuth ' + token
      }
    };
    request(options, callback);
  });

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(JSON.parse(body));
    } else {
      res.send({'success': false, 'response': response, 'error': error});
    }
  }
}

exports.getCategories = function(req, res) {
  var ref = db.ref('/users/'+req.decoded.sub);
  
  ref.once("value", function(snapshot) {
    var token = snapshot.child('credentials').child('feedly').child('token').val();

    options = {
      url: 'http://cloud.feedly.com/v3/categories',
      headers: {
        'Authorization': 'OAuth ' + token
      }
    };
    request(options, callback);
  });

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(JSON.parse(body));
    } else {
      res.send({'success': false, 'response': response, 'error': error});
    }
  }
}

/*
This is for sandbox authorization. Get new key on Google forums.
var f = new Feedly({
  client_id: 'sandbox',
  client_secret: '1QA6I3662OW2KEG48WA6',
  base: 'http://sandbox.feedly.com',
  port: 8080
});
app.get('/streams', function(req, res) {
  f.reads().then(function(results) {
      console.log(results)
  },
  function (error) {
      // process error
  });
})
*/