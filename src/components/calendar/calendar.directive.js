module.exports = function calendar($http, $interval, $cookies, $firebaseAuth) {  
    return {
      scope: true,
      controller: function($scope, $element, $attrs) {
        getData();

        $interval(function() {
          getData();
        }, 900000);

        function getData() {
          $scope.firebaseUser.getToken().then(function(token) {
            $http.get('/api/google/events', { headers: {'x-access-token': token} })
              .success(function(response) {
                $scope.items = response;
              });
          });
        }
      },
      templateUrl: './components/calendar/calendar.template.html'
    }
};