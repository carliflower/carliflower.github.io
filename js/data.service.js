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
        $log = $log.getInstance('DataService', true);

        //internal method attached to service
        this.houseguests = [];
        this.members = [];

        this.get = get;

        //internal methods
        function get() {
            var self = this;
            $log.debug("get");
            return $http.get('/app.json');
        }
    }
    //service ends
})();