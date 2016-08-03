module.exports = function categories($http, $cookies, $window, $firebaseObject) {  
    return {
      controller: function($scope, $element, $attrs) {
        getCategories();
        $scope.channel;

        var ref = firebase.database().ref('users/'+$scope.firebaseUser.uid+'/preferences/category');
        var category = $firebaseObject(ref);

        category.$watch(function() {
          if(category.$value === 'global.all') {
            $scope.channel = 'global.all'
          } else {
            $scope.channel = JSON.parse(category.$value).label;
          }
        });

        function getCategories() {
          $scope.firebaseUser.getToken().then(function(token) {
            $http.get('/api/feedly/categories', { headers: {'x-access-token': token} })
            .success(function(response) {
              $scope.categories = response;
            });
          });
        }

        $scope.setCategory = function(category) {
          if (category==="all") {
            ref.set('global.all', function() {
              console.log('Profile saved!');
            }).catch(function(error) {
              alert(error)
            });
          } else {
            ref.set(JSON.stringify({id: category.id, label: category.label}), function() {
              console.log('Profile saved!');
            }).catch(function(error) {
              alert(error)
            });
          }
        };
      },
      templateUrl: './components/categories/categories.template.html'
    }
};