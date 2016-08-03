module.exports = function time($timeout) {  
    return {
      scope: {
        style: '@'
      },
      controller: function($scope, $element, $attrs) {
        $scope.clock = "...";
        $scope.tickInterval = 1000;
        var tick = function() {
            $scope.clock = Date.now();
            $timeout(tick, $scope.tickInterval);
        }
        $timeout(tick, $scope.tickInterval);
      },
      templateUrl: './components/time/time.template.html'
    }
};