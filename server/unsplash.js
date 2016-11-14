module.exports = function(req, res) {
  var request = require('request');
  var db = require('./firebase.js').FBApp.database();
  var ref = db.ref('/users/'+req.decoded.sub);

  console.log(req.query)

  request({url:'https://source.unsplash.com/1600x900/?'+req.query.categories}, function(error, response, body) {
    res.send(response.request.uri.href);
  })
}