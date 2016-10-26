module.exports = function feed($http, $interval, $timeout, $firebaseObject, $rootScope) {  
    return {
      scope: true,
      controller: function($scope, $element, $attrs) {  

        $scope.channel;
        $scope.qr;

        var ref = firebase.database().ref('users/'+$scope.firebaseUser.uid+'/preferences/category');
        var category = $firebaseObject(ref);

        var qrRef = firebase.database().ref('users/'+$scope.firebaseUser.uid+'/preferences/qr');
        var qr = $firebaseObject(qrRef);

        qr.$watch(function() {
          $scope.qr = qr;
        });

        category.$watch(function() {
          if(category.$value === 'global.all') {
            $scope.channel = 'All'
          } else {
            $scope.channel = JSON.parse(category.$value).label;
          }
          $interval.cancel($scope.interval);
          $scope.startInterval();
          start();
          getData();
        });

        var transitionSeconds = 15;
        start();

        $interval(function() {
          getData();
        }, 900000)

        if (!$rootScope.ftux) {
          $rootScope.ftux = {};
        }

        function start() {
          $scope.feedNumber = 0;
          loader();
        }

        $scope.startInterval = function() {
          $scope.interval = $interval(function(){
            loader();
            if($scope.feedNumber < 19) {
              $scope.feedNumber ++;
            } else {
              $scope.feedNumber = 0;
            }
          }, transitionSeconds * 1000);
        }
        

        function loader() {
          var loaderEl = $element[0].querySelector('.feed__loader');
          jQuery(loaderEl).css('animationDuration', transitionSeconds+'s');
          var newone = jQuery(loaderEl).clone(true); 
          jQuery(loaderEl).before(newone);
          jQuery("." + jQuery(loaderEl).attr("class") + ":last").remove();
        }
        
        function getData() {
          $scope.firebaseUser.getToken().then(function(token) {
            $http.get('/api/feedly/feed', { headers: {'x-access-token': token} })
            .success(function(response) {
              if (response.success !== false) {
                $scope.items = [];
                $scope.items = response.items;
                $rootScope.ftux.feed = false;
              } else {
                $rootScope.ftux.feed = true;
              }
            });
          });
        }
      },
      templateUrl: './components/feed/feed.template.html'
    }
};