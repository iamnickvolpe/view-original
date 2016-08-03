module.exports = function time($http, $interval, $cookies) {  
    return {
      scope: true,
      controller: function($scope, $element, $attrs) {
        getData();
        
        $interval(function() {
          getData();
        }, 600000);

        function getData() {
          $scope.firebaseUser.getToken().then(function(token) {
            $http.get('/api/weather', { headers: {'x-access-token': token} })
            .success(function(response) {
              $scope.data = response;
            });
          });
        }
      },
      templateUrl: './components/weather/weather.template.html'
    }
};