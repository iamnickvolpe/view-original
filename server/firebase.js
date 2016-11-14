var admin = require("firebase-admin");
var key = process.env.FBS_PRIVATEKEY.replace(/\\n/g, '\n');

var FbApp = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FBS_PROJECTID,
    clientEmail: process.env.FBS_CLIENTEMAIL,
    privateKey: key
  }),
  databaseURL: process.env.FBC_DBURL
});

module.exports.FBApp = FbApp;