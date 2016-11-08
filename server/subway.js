module.exports = function(req, res) {
  var request = require('request');
  var options;
  var db = require('./firebase.js').FBApp.database();
  var ref = db.ref('/users/'+req.decoded.sub);
  var parseString = require('xml2js').parseString;

  ref.once("value", function(snapshot) {
    options = {
      url: 'http://web.mta.info/status/serviceStatus.txt'
    };
    request(options, callback);
  });

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      parseString(body, function (err, result) {
        res.send(result);
      });
    } else {
      res.send({'success': false, 'response': response, 'error': error});
    }
  }
}