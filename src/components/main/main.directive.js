module.exports = function main($http, $cookies, $window, Auth) {  
    return {
      scope: true,
      controller: function($scope, $element, $attrs) {
        center();
        $scope.inspectorOpen = false;
        
        jQuery($window).on('resize', function() {
          center();
        })

        function center() {
          var windowHeight = jQuery($element).find('.main').parent().height();
          var mainHeight = jQuery($element).find('.main').height();
          var marginTop = (windowHeight - mainHeight) / 2;
          jQuery($element[0].querySelector('.main')).css('marginTop', marginTop);
        }

        $scope.toggleInspector = function() {
          $scope.inspectorOpen = !$scope.inspectorOpen;
        }

      },
      templateUrl: './components/main/main.template.html'
    }
};