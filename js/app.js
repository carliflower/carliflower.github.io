//IIFE - keeps code isolated and off global scope
(function() {
    angular
        .module('app', [
            'ui.router',
            'firebase',
            'log.ex.uo',
            'AuthService',
            'members',
            'houseguests',
            'standings',
            'picks',
            'rules',
            'posts'])
        .config(appConfig);

    function appConfig($urlRouterProvider, $stateProvider, $interpolateProvider, $locationProvider, logExProvider) {
      logExProvider.enableLogging(true);

      //required since we are using jekyll and its templates use {{}}
      $interpolateProvider.startSymbol('{[{').endSymbol('}]}');

      //enable html5 history api mode
      $locationProvider.html5Mode(false);

      // console.log("here");

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                controller:'StandingsCtrl as vm',
                templateUrl:'/templates/standings.html',
            })
            .state('houseguests', {
                url: '/houseguests',
                controller:'HouseguestsCtrl as vm',
                templateUrl:'/templates/houseguests.html'
            })
            .state('rules', {
                url: '/rules',
                controller:'RulesCtrl as vm',
                templateUrl:'/templates/rules.html'
            })
            .state('picks', {
                url: '/picks',
                controller:'PicksCtrl as vm',
                templateUrl:'/templates/picks.html'
            })
            .state('posts', {
                url: '/posts',
                controller:'PostsCtrl as vm',
                templateUrl:'/templates/posts.html'
            });
    }
})();