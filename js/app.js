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
  var sync = $firebase(ref);
  // download the data into a local object
  var syncObject = sync.$asObject();
  // synchronize the object with a three-way data binding
  // click on `index.html` above to see it used in the DOM!
  syncObject.$bindTo($scope, "data");

// var postsRef = ref.child("projects");

//   postsRef.push({
//     author: "gracehop",
//     title: "Announcing COBOL, a New Programming Language"
//   });

//   postsRef.push({
//     author: "alanisawesome",
//     title: "The Turing Machine"
//   });

});
