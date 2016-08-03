module.exports = function notesEdit($http, $interval, $timeout, $firebaseArray) {  
    return {
      scope: true,
      controller: function($scope, $element, $attrs) {  
        var ref = firebase.database().ref('users').child($scope.firebaseUser.uid).child("notes");
        $scope.notes = $firebaseArray(ref);

        $scope.addNote = function() {
          $scope.notes.$add({text: $scope.note.text});
          $scope.note.text = '';
        }

        $scope.removeNote = function(key) {
          $scope.notes.$remove($scope.notes[key]);
        }
      },
      templateUrl: './components/notes-edit/notes-edit.template.html'
    }
};