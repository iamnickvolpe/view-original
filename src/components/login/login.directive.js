module.exports = function login($http, $cookies, $window, $firebaseAuth) {  
    return {
      scope: true,
      controller: function($scope, $element, $attrs) {
        $scope.authObj = $firebaseAuth();
        $scope.vm = {};
        $scope.authenticate = function() {
          $scope.authObj.$signInWithEmailAndPassword($scope.vm.username, $scope.vm.password).then(function(firebaseUser) {
            $window.location.href = '/app';
          }).catch(function(error) {
            alert(error);
          });
        }
      },
      templateUrl: './components/login/login.template.html'
    }
};