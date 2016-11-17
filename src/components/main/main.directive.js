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
            'add a note *todo': function(todo) {
              window.speechSynthesis.cancel();
              var msg = new SpeechSynthesisUtterance('Adding your reminder: ' +todo+'.');
              msg.lang = 'en-US';
              window.speechSynthesis.speak(msg);
              $scope.notes.$add({text: todo});
            },
            'show the dashboard': function() {
              window.speechSynthesis.cancel();
              var msg = new SpeechSynthesisUtterance('Showing the dashboard.');
              msg.lang = 'en-US';
              window.speechSynthesis.speak(msg);
              preferencesRef.update({showDashboard:true});
            },
            'hide the dashboard': function() {
              window.speechSynthesis.cancel();
              var msg = new SpeechSynthesisUtterance('Hiding the dashboard.');
              msg.lang = 'en-US';
              window.speechSynthesis.speak(msg);
              preferencesRef.update({showDashboard:false});
            },
            'show an image of *search': function(search) {
              window.speechSynthesis.cancel();
              var msg = new SpeechSynthesisUtterance('Showing an image of ' +search+'.');
              msg.lang = 'en-US';
              window.speechSynthesis.speak(msg);
              searchImage(search);
            },
            'show a random image': function() {
              window.speechSynthesis.cancel();
              var msg = new SpeechSynthesisUtterance('Showing a random image.');
              msg.lang = 'en-US';
              window.speechSynthesis.speak(msg);
              randomImage();
            },
            'hello view': function() {
              window.speechSynthesis.cancel();

              $scope.firebaseUser.getToken().then(function(token) {
                $http.get('/api/weather', { headers: {'x-access-token': token} })
                .success(function(response) {
                  if (!response.response.error) {
                    var greeting;
                    var d = new Date();
                    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
                    var hh = d.getHours();
                    var m = d.getMinutes();
                    var dd = "AM";
                    var h = hh;

                    if (hh > 5 && h < 12) {
                      greeting = 'Good morning! ';
                    } else if (hh > 11 && hh < 18) {
                      greeting = 'Good afternoon! ';
                    } else {
                      greeting = 'Good evening! ';
                    }

                    if (h >= 12) {
                        h = hh-12;
                        dd = "PM";
                    }
                    if (h == 0) {
                        h = 12;
                    }
                    m = m<10?"0"+m:m;
                    var msg = new SpeechSynthesisUtterance(greeting+'It is '+days[d.getDay()]+', '+months[d.getMonth()]+' '+d.getDate()+' '+h+':'+m+' '+dd+'. The current temperature is '+response.current_observation.temp_f+' degrees. The upcoming weather forecast is '+response.forecast.txt_forecast.forecastday[0].fcttext);
                    msg.lang = 'en-US';
                    window.speechSynthesis.speak(msg);
                  }
                });
              });
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