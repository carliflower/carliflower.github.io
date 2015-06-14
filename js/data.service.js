//IIFE - keeps code isolated and off global scope
(function() {
    angular
        .module('data', [])
        .service('DataService', DataService);

    //injection for js minification
    DataService.$inject = [
        '$log',
        '$http'
    ];

    //service begins
    function DataService($log, $http) {
        $log = $log.getInstance('DataService', false);

        //internal method attached to service
        this.houseguests = [];
        this.members = [];
        this.useFirebase = false;
        this.firebaseUrl = "bbuspool2015.firebaseio.com";
        this.get = get;

        //internal methods
        function get() {
            var self = this;
            // $log.debug("get");
            return $http.get('http://127.0.0.1:4000/app.json');
        }
    }
    //service ends
})();