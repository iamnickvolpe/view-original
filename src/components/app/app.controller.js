module.exports = function($scope, Auth, $window, $cookies, firebaseUser, $location, $firebaseObject) {  
  $scope.firebaseUser = firebaseUser;
    var preferencesRef = firebase.database().ref('users/'+$scope.firebaseUser.uid+'/preferences');
    if(!$firebaseObject(preferencesRef).showDashboard) {
      preferencesRef.update({showDashboard: true});
    }
    if(!$firebaseObject(preferencesRef).brightness) {
      preferencesRef.update({brightness: 100});
    }
};