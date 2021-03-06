//IIFE - keeps code isolated and off global scope
(function() {
  angular.module("AuthService", []).factory("AuthService", AuthService);

  //injection for js minification
  AuthService.$inject = ["$log", "$firebaseAuth"];

  //factory begins
  function AuthService($log, $firebaseAuth) {
    $log = $log.getInstance("AuthService", false);
    var ref = new Firebase("https://bb-pool.firebaseio.com/");
    var fbAuth = $firebaseAuth(ref);
    return fbAuth;
  }
  //factory ends
})();
