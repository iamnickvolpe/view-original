module.exports = function feed($http, $interval, $timeout, $firebaseObject) {  
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
          getData();
        });

        $scope.feedNumber = 0;
        var transitionSeconds = 15;
        var loaderEl = $element[0].querySelector('.feed__loader');
        jQuery(loaderEl).css('animationDuration', transitionSeconds+'s');

        $interval(function(){
          var loaderEl = $element[0].querySelector('.feed__loader');
          var newone = jQuery(loaderEl).clone(true); 
          jQuery(loaderEl).before(newone);
          jQuery("." + jQuery(loaderEl).attr("class") + ":last").remove();

          if($scope.feedNumber < 19) {
            $scope.feedNumber ++;
          } else {
            $scope.feedNumber = 0;
          }
        }, transitionSeconds * 1000);

        $interval(function() {
          getData();
        }, 900000)
        
        function getData() {
          $scope.firebaseUser.getToken().then(function(token) {
            $http.get('/api/feedly/feed', { headers: {'x-access-token': token} })
            .success(function(response) {
              $scope.items = response.items;
            });
          });
        }
      },
      templateUrl: './components/feed/feed.template.html'
    }
};