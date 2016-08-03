module.exports = function notesView($http, $interval, $timeout, $firebaseArray) {  
    return {
      scope: true,
      controller: function($scope, $element, $attrs) {  
        var ref = firebase.database().ref('users').child($scope.firebaseUser.uid).child("notes");
        $scope.notes = $firebaseArray(ref);
      },
      templateUrl: './components/notes-view/notes-view.template.html'
    }
};