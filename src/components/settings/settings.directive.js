module.exports = function settings($http, $cookies, $window, $firebaseObject, Auth, $location) {  
    return {
      controller: function($scope, $element, $attrs) {
        $scope.auth = Auth;
        $scope.userInfo = getUserInfo();
        getCalendars();
        var path = $location.path();

        function getUserInfo() {
          return $firebaseObject(firebase.database().ref("users/"+$scope.firebaseUser.uid));
        }

        function getCalendars() {
          $scope.firebaseUser.getToken().then(function(token) {
            $http.get('/api/google/calendars', { headers: {'x-access-token': token} })
            .success(function(response) {
              $scope.calendars = response;
            });
          });
        }
        
        $scope.saveUserInfo = function() {
          $scope.userInfo.$save().then(function() {
            console.log('Profile saved!');
          }).catch(function(error) {
            alert(error)
          });
        };

        $scope.connectGoogle = function() {
          $scope.firebaseUser.getToken().then(function(token) {
            $cookies.put('token', token);
            $cookies.put('redirect', path);
            $window.location.href = '/google-auth';
          });
        }

        $scope.disconnectGoogle = function() {
          $firebaseObject(firebase.database().ref("users/"+$scope.firebaseUser.uid+'/credentials/google')).$remove().then(function(ref) {
            console.log('Google disconnected.');
          }, function(error) {
            alert(error);
          });

          $firebaseObject(firebase.database().ref("users/"+$scope.firebaseUser.uid+'/preferences/calendar')).$remove().then(function(ref) {
            console.log('Calendar removed.');
          }, function(error) {
            alert(error);
          });
        }
        
        $scope.logout = function() {
          $scope.auth.$signOut();
          $window.location.href = '/login';
        }
      },
      templateUrl: './components/settings/settings.template.html'
    }
};