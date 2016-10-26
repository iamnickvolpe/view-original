module.exports = function calendar($http, $interval, $cookies, $firebaseAuth, $rootScope) {  
    return {
      scope: true,
      controller: function($scope, $element, $attrs) {
        getData();

        $interval(function() {
          getData();
        }, 900000);

        if (!$rootScope.ftux) {
          $rootScope.ftux = {};
        }

        function getData() {
          $scope.items = [];
          $scope.firebaseUser.getToken().then(function(token) {
            $http.get('/api/google/events', { headers: {'x-access-token': token} })
              .success(function(response) {
                if (response.success !== false) {
                  $scope.items = response;
                  $rootScope.ftux.calendar = false;
                } else {
                  $rootScope.ftux.calendar = true;
                }
              });
          });
        }
      },
      templateUrl: './components/calendar/calendar.template.html'
    }
};