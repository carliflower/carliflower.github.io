//IIFE - keeps code isolated and off global scope
(function() {
    angular
        .module('app', [
            'ngRoute',
            'firebase',
            'log.ex.uo',
            'members',
            'AuthService',
            'standings'])
        .config(appConfig);

    function appConfig($routeProvider, $interpolateProvider, $locationProvider, logExProvider) {
      logExProvider.enableLogging(true);

      //required since we are using jekyll and its templates use {{}}
      $interpolateProvider.startSymbol('{[{').endSymbol('}]}');

      //enable html5 history api mode
      $locationProvider.html5Mode(true);

      $routeProvider
        .when('/', {
            controller:'StandingsCtrl as vm',
            templateUrl:'templates/standings.html',
            resolve: {
                // controller will not be loaded until $requireAuth resolves
                // Auth refers to our $firebaseAuth wrapper in the example above
                "CurrentAuth": ["AuthService", function(AuthService) {
                    // $requireAuth returns a promise so the resolve waits for it to complete
                    // If the promise is rejected, it will throw a $stateChangeError (see above)
                    return AuthService.$requireAuth();
                }]
            }
        })
        .when('/rules', {
            controller:'StandingsCtrl as vm',
            templateUrl:'templates/rules.html',
            resolve: {
                // controller will not be loaded until $requireAuth resolves
                // Auth refers to our $firebaseAuth wrapper in the example above
                "CurrentAuth": ["AuthService", function(AuthService) {
                    // $requireAuth returns a promise so the resolve waits for it to complete
                    // If the promise is rejected, it will throw a $stateChangeError (see above)
                    return AuthService.$requireAuth();
                }]
            }
        })
        .when('/picks', {
            controller:'StandingsCtrl as vm',
            templateUrl:'templates/picks.html',
            resolve: {
                // controller will not be loaded until $requireAuth resolves
                // Auth refers to our $firebaseAuth wrapper in the example above
                "CurrentAuth": ["AuthService", function(AuthService) {
                    // $requireAuth returns a promise so the resolve waits for it to complete
                    // If the promise is rejected, it will throw a $stateChangeError (see above)
                    return AuthService.$requireAuth();
                }]
            }
        })
        .when('/posts', {
            controller:'StandingsCtrl as vm',
            templateUrl:'templates/posts.html',
            resolve: {
                // controller will not be loaded until $requireAuth resolves
                // Auth refers to our $firebaseAuth wrapper in the example above
                "CurrentAuth": ["AuthService", function(AuthService) {
                    // $requireAuth returns a promise so the resolve waits for it to complete
                    // If the promise is rejected, it will throw a $stateChangeError (see above)
                    return AuthService.$requireAuth();
                }]
            }
        })
        .otherwise({
          redirectTo:'/'
        });
    }
})();