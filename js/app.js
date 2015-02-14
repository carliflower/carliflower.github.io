angular.module('app', ['ngRoute', 'firebase'])
.config(function($routeProvider, $interpolateProvider) {
  $interpolateProvider.startSymbol('{[{').endSymbol('}]}');

  $routeProvider
    .when('/', {
      controller:'homeCtrl',
      templateUrl:'templates/home.html'
      // resolve: {
      //   projects: function (Projects) {
      //     return Projects.fetch();
      //   }
      // }
    })
    .otherwise({
      redirectTo:'/'
    });
})

.controller('homeCtrl', function($scope, $firebase) {
    var ref = new Firebase("https://luminous-heat-7812.firebaseio.com/");
    // create an AngularFire reference to the data
    var sync = $firebase(ref);
    // download the data into a local object
    $scope.data = sync.$asObject();
});