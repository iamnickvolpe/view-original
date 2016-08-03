module.exports = function calendar($rootScope, $window) {  
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    if (error === "AUTH_REQUIRED") {
      $window.location.href = '/login';
    }
  });
};