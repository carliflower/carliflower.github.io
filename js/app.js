//IIFE - keeps code isolated and off global scope
(function() {
    angular
        .module('app', [
            'ui.router',
            'firebase',
            'log.ex.uo',
            'members',
            'houseguests',
            'AuthService',
            'standings'])
        .config(appConfig);

    function appConfig($urlRouterProvider, $stateProvider, $interpolateProvider, $locationProvider, logExProvider) {
      logExProvider.enableLogging(true);

      //required since we are using jekyll and its templates use {{}}
      $interpolateProvider.startSymbol('{[{').endSymbol('}]}');

      //enable html5 history api mode
      $locationProvider.html5Mode(false);

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                controller:'StandingsCtrl as vm',
                templateUrl:'/templates/standings.html',
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
            .state('rules', {
                url: '/rules',
                controller:'StandingsCtrl as vm',
                templateUrl:'/templates/rules.html',
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
            .state('picks', {
                url: '/picks',
                controller:'StandingsCtrl as vm',
                templateUrl:'/templates/picks.html',
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
            .state('posts', {
                url: '/posts',
                controller:'StandingsCtrl as vm',
                templateUrl:'/templates/posts.html',
                resolve: {
                    // controller will not be loaded until $requireAuth resolves
                    // Auth refers to our $firebaseAuth wrapper in the example above
                    "CurrentAuth": ["AuthService", function(AuthService) {
                        // $requireAuth returns a promise so the resolve waits for it to complete
                        // If the promise is rejected, it will throw a $stateChangeError (see above)
                        return AuthService.$requireAuth();
                    }]
                }
            });
    }
})();