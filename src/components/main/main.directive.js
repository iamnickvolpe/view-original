module.exports = function main($http, $cookies, $window, Auth, $firebaseArray, $firebaseObject) {  
    return {
      scope: true,
      controller: function($scope, $element, $attrs) {
        var preferencesRef = firebase.database().ref('users/'+$scope.firebaseUser.uid+'/preferences');

        $scope.backgroundImage;
        var backgroundImageRef = firebase.database().ref('users/'+$scope.firebaseUser.uid+'/preferences/backgroundImage');
        var backgroundImage = $firebaseObject(backgroundImageRef);
        backgroundImage.$watch(function() {
          if(backgroundImage.$value && backgroundImage.$value !== 'undefined') {
            jQuery($element).find('.main-wrapper').css('background-image', 'url('+backgroundImage.$value+')');
          } else {
            jQuery($element).find('.main-wrapper').removeAttr( 'style' );
          }
        });

        $scope.showDashboard;
        var showDashboardRef = firebase.database().ref('users/'+$scope.firebaseUser.uid+'/preferences/showDashboard');
        var showDashboard = $firebaseObject(showDashboardRef);
        showDashboard.$watch(function() {
          $scope.showDashboard = showDashboard;
        });

        var ref = firebase.database().ref('users').child($scope.firebaseUser.uid).child("notes");
        $scope.notes = $firebaseArray(ref);
        if (annyang) {
          var commands = {
            'remind me to *todo': function(todo) {
              var msg = new SpeechSynthesisUtterance('Adding your reminder: ' +todo+'.');
              window.speechSynthesis.speak(msg);
              $scope.notes.$add({text: todo});
            },
            'show the dashboard': function() {
              var msg = new SpeechSynthesisUtterance('Showing the dashboard.');
              window.speechSynthesis.speak(msg);
              preferencesRef.update({showDashboard:true});
            },
            'hide the dashboard': function() {
              var msg = new SpeechSynthesisUtterance('Hiding the dashboard.');
              window.speechSynthesis.speak(msg);
              preferencesRef.update({showDashboard:false});
            },
            'show me an image of *search': function(search) {
              var msg = new SpeechSynthesisUtterance('Showing you an image of ' +search+'.');
              window.speechSynthesis.speak(msg);
              searchImage(search);
            },
            'show me a random image': function() {
              var msg = new SpeechSynthesisUtterance('Showing you a random image.');
              window.speechSynthesis.speak(msg);
              randomImage();
            }
          };
          annyang.addCommands(commands);
          annyang.start();
        }

        position();
        $scope.inspectorOpen = false;
        
        jQuery($window).on('resize', function() {
          position();
        })

        function position() {
          var windowHeight = jQuery($element).find('.main').parent().height();
          var mainHeight = jQuery($element).find('.main').height();
          var mainWidth = jQuery($element).find('.main').width();
          var marginTop = (windowHeight - mainHeight) / 2;
          var widgetNumber = jQuery($element[0].querySelector('.main')).find('>div').length;
          
          jQuery($element[0].querySelector('.main')).css('marginTop', marginTop);
          jQuery($element[0].querySelector('.main')).find('>div').css('width', mainWidth/widgetNumber)
        }

        $scope.toggleInspector = function() {
          $scope.inspectorOpen = !$scope.inspectorOpen;
        }

        $scope.openInspector = function() {
          $scope.inspectorOpen = true;
        }

        function searchImage(categories) {
          $scope.firebaseUser.getToken().then(function(token) {
            $http.get('/api/unsplash?type=search&categories='+categories, { headers: {'x-access-token': token} })
            .success(function(response) {
              preferencesRef.update({backgroundImage:response});
            });
          });
        }

        function randomImage() {
          $scope.firebaseUser.getToken().then(function(token) {
            $http.get('/api/unsplash?type=random', { headers: {'x-access-token': token} })
            .success(function(response) {
              preferencesRef.update({backgroundImage:response});
            });
          });
        }

      },
      templateUrl: './components/main/main.template.html'
    }
};