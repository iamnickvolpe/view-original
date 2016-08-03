module.exports = function($locationProvider, $routeProvider, ENV_VARS) {
  // Initialize Firebase on the front-end
  var config = {
    apiKey: ENV_VARS.apiKey,
    authDomain: ENV_VARS.authDomain,
    databaseURL: ENV_VARS.databaseURL,
    storageBucket: ENV_VARS.storageBucket
  };

  firebase.initializeApp(config);

  // Routes
  $routeProvider.when('/app', {
    templateUrl: './routes/main/index.html',
    controller: 'AppController',
    resolve: {
      "firebaseUser": ["Auth", function(Auth) {
        return Auth.$requireSignIn();
      }]
    }
  })
  .when('/remote', {
    templateUrl: './routes/remote/index.html',
    controller: 'AppController',
    resolve: {
      "firebaseUser": ["Auth", function(Auth) {
        return Auth.$requireSignIn();
      }]
    }
  })
  .when('/login', {
    templateUrl: './routes/login/index.html',
    controller: 'LoginController',
  })
  /*.when('/', {
    templateUrl: './routes/home/index.html',
    controller: 'HomeController',
  })*/
  .otherwise({
    redirectTo: '/login'
  });

  // Remove # from URLs
  $locationProvider.html5Mode(true);
}
