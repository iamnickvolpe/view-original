var firebase = require("firebase");
var key = process.env.FBS_PRIVATEKEY.replace(/\\n/g, '\n');

var FbApp = firebase.initializeApp({
  serviceAccount: {
    project_id: process.env.FBS_PROJECTID,
    private_key: key,
    client_email: process.env.FBS_CLIENTEMAIL
  },
  databaseURL: process.env.FBC_DBURL
});

module.exports.FBApp = FbApp;