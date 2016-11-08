module.exports = function(req, res) {
  var request = require('request');
  var options;
  var db = require('../app.js').FBApp.database();
  var ref = db.ref('/users/'+req.decoded.sub);

  ref.once("value", function(snapshot) {
    var token = snapshot.child('credentials').child('weatherUnderground').val();
    var zip = snapshot.child('preferences').child('zip').val();
    options = {
      url: 'http://api.wunderground.com/api/'+token+'/conditions/forecast/q/'+zip+'.json'
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