module.exports = function settings($location) {  
    return {
      controller: function($scope, $element, $attrs) {
        $scope.section = "feeds";
        $scope.navigate = function(section) {
          $scope.section = section;
        }
      },
      templateUrl: './components/remote/remote.template.html'
    }
};