module.exports = function($scope, Auth, $window, $location) { 
  Auth.$onAuthStateChanged(function(user) {
    if (user) {
      $window.location.href = ('/app');
    }
  });
};