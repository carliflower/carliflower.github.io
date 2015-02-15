//IIFE - keeps code isolated and off global scope
(function() {
    angular
        .module('AuthService', [])
        .factory('AuthService', AuthService);

    //injection for js minification
    AuthService.$inject = [
        '$log',
        '$firebaseAuth'
    ];

    //factory begins
    function AuthService($log, $firebaseAuth) {
        $log = $log.getInstance('AuthService', true);
        var ref = new Firebase("https://luminous-heat-7812.firebaseio.com/");
        var fbAuth = $firebaseAuth(ref);
        $log.debug(fbAuth);
        return fbAuth;
    }
    //factory ends
})();