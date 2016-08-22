module.exports = function subway($http, $interval, $firebaseObject) {  
    return {
      scope: true,
      controller: function($scope, $element, $attrs) {
        getData();
        
        $interval(function() {
          getData();
        }, 300000);

        function getData() {
          $scope.firebaseUser.getToken().then(function(token) {
            $http.get('/api/subway', { headers: {'x-access-token': token} })
            .success(function(response) {
              $scope.data = response.service.subway[0].line;
            });
          });
        }

        $scope.lines = [];

        $scope.filter = function(line) {
          return line.status[0] !== "GOOD SERVICE" && $scope.lines[line.name[0]]===true;
        }

        var subwayRef = firebase.database().ref('users/'+$scope.firebaseUser.uid+'/preferences/lines');
        var lines = $firebaseObject(subwayRef);

        lines.$watch(function() {
          $scope.lines = lines;
        });

      },
      templateUrl: './components/subway/subway.template.html'
    }
};