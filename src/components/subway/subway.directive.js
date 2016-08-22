module.exports = function subway($http, $interval) {  
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

        $scope.filter = function(line) {
          return line.status[0] !== "GOOD SERVICE";
        }
      },
      templateUrl: './components/subway/subway.template.html'
    }
};