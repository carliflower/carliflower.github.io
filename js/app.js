angular.module('app', ['ngRoute', 'firebase'])

// .value('fbURL', 'https://ng-projects-list.firebaseio.com/')
// .service('fbRef', function(fbURL) {
//   return new Firebase(fbURL);
// })
// .service('Projects', function($q, $firebase, fbRef, fbAuth) {
//   var self = this;
//   this.fetch = function () {
//     if (this.projects) return $q.when(this.projects);
//     return fbAuth().then(function(auth) {
//       var deferred = $q.defer();
//       var ref = fbRef.child('projects/' + auth.auth.uid);
//       var $projects = $firebase(ref);
//       ref.on('value', function(snapshot) {
//         if (snapshot.val() === null) {
//           $projects.$set(window.projectsArray);
//         }
//         self.projects = $projects.$asArray();
//         deferred.resolve(self.projects);
//       });
//       return deferred.promise;
//     });
//   };
// })

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

.controller('homeCtrl', function($scope) {
    var ref = new Firebase("https://luminous-heat-7812.firebaseio.com/");
    // create an AngularFire reference to the data
    var sync = $firebase(ref);
    // download the data into a local object
    $scope.data = sync.$asObject();
})