module.exports = function login($http, $cookies, $window, $firebaseAuth, $location, Auth) {  
    return {
      scope: true,
      controller: function($scope, $element, $attrs) {
        Auth.$onAuthStateChanged(function(user) {
          if (user) {
           $window.location.href = $location.search().redirect || '/dashboard';
          }
        });

        var redirect = $location.search.redirect;
        $scope.authObj = $firebaseAuth();
        $scope.vm = {};
        $scope.authenticate = function() {
          $scope.authObj.$signInWithEmailAndPassword($scope.vm.username, $scope.vm.password).then(function(firebaseUser) {
            $window.location.href = $location.search().redirect || '/dashboard';
          }).catch(function(error) {
            alert(error);
          });
        }
      },
      templateUrl: './components/login/login.template.html'
    }
};