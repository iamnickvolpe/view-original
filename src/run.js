module.exports = function calendar($rootScope, $window, $location) {  
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    if (error === "AUTH_REQUIRED") {
      $window.location.href = '/login?redirect='+$location.path();
    }
  });
};