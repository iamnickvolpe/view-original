module.exports = function(req, res) {
  var request = require('request');
  var options;
  var db = require('./firebase.js').FBApp.database();
  var ref = db.ref('/users/'+req.decoded.sub);

  ref.once("value", function(snapshot) {
    var key = snapshot.child('credentials').child('ifttt').child("key").val();
    options = {
      url: 'https://maker.ifttt.com/trigger/'+req.query.trigger+'/with/key/'+key
    };
    request(options, callback);
  });

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    } else {
      res.send({'success': false, 'response': response, 'error': error});
    }
  }
}