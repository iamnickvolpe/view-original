module.exports = function(req, res) {
  var request = require('request');
  var db = require('./firebase.js').FBApp.database();
  var ref = db.ref('/users/'+req.decoded.sub);
  if (req.query.type==='search') {
    request({url:'https://source.unsplash.com/1600x900/?'+req.query.categories}, function(error, response, body) {
      res.send(response.request.uri.href);
    })
  } else {
    request({url:'https://source.unsplash.com/random/1440x900'}, function(error, response, body) {
      res.send(response.request.uri.href);
    })

  }

  
}