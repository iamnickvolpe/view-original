module.exports = function register($http, $cookies, $window, $firebaseAuth, $firebaseArray, $firebaseObject) {  
    return {
      scope: true,
      controller: function($scope, $element, $attrs) {
        $scope.authObj = $firebaseAuth();
        $scope.vm = {};

        $scope.register = function() {
          $scope.authObj.$createUserWithEmailAndPassword($scope.vm.username, $scope.vm.password).then(function(firebaseUser) {
            signIn($scope.vm.username, $scope.vm.password);
          }).catch(function(error) {
            alert(error);
          });
        }

        function signIn(username, password) {
          $scope.authObj.$signInWithEmailAndPassword(username, password).then(function(firebaseUser) {
            createProfile(firebaseUser);
          }).catch(function(error) {
            alert(error)
          });
        }

        var userData = {
          credentials: '',
          preferences: ''
        }

        //TODO Abstract this away from the register flow and into
        //the main app so it's not dependent on signing in from the UI
        function createProfile(userInfo) {
          var userId = userInfo.uid;
          var users = {};
          users['/users/' + userId] = userData;
          firebase.database().ref().update(users).then(function() {
            $window.location.href = '/dashboard';
          })
        }
      },
      templateUrl: './components/register/register.template.html'
    }
};