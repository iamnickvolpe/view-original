var firebase = require('../app.js').FBApp;

module.exports = function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;
  if (!token) {
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
  }
  firebase.auth().verifyIdToken(token).then(function(decoded) {
    req.decoded = decoded;
    next();
  }).catch(function(error) {
    return res.status(403).send({ 
        success: false, 
        message: 'The token your provided is invalid.' 
    });
  });
}