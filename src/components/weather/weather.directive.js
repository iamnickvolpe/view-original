module.exports = function time($http, $interval, $cookies, $rootScope) {  
    return {
      scope: true,
      controller: function($scope, $element, $attrs) {
        getData();
        
        $interval(function() {
          getData();
        }, 600000);

        if (!$rootScope.ftux) {
          $rootScope.ftux = {};
        }
        
        function getData() {
          $scope.firebaseUser.getToken().then(function(token) {
            $http.get('/api/weather', { headers: {'x-access-token': token} })
            .success(function(response) {
              if (!response.response.error) {
                $scope.data = [];
                $scope.data = response;
                $rootScope.ftux.weather = false;
              } else {
                $rootScope.ftux.weather = true;
              }
            });
          });
        }
      },
      templateUrl: './components/weather/weather.template.html'
    }
};