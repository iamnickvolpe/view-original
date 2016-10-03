module.exports = function ftux($rootScope) {  
    return {
      scope: true,
      controller: function($scope, $element, $attrs) {  
        $scope.dismiss = function(className) {
          jQuery($element).find(className).remove()
        }
        $scope.ftux = $rootScope.ftux;
      },
      templateUrl: './components/ftux/ftux.template.html'
    }
};