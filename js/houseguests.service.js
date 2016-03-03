//IIFE - keeps code isolated and off global scope
(function() {
    angular
        .module('houseguests')
        .service('HouseguestsService', HouseguestsService);

    //injection for js minification
    HouseguestsService.$inject = [
        '$log',
        '$firebaseArray',
        'DataService'
    ];

    //service begins
    function HouseguestsService($log, $firebaseArray, DataService) {
        $log = $log.getInstance('HouseguestsService', false);

        //internal method attached to service
        this.tallyPoints = tallyPoints;
        this.DataService = DataService;
        this.get = get;

        //internal methods
        function get() {
            this.ref = new Firebase("https://"+this.DataService.firebaseUrl+"/houseguests/");
            return $firebaseArray(this.ref);
        }

        function tallyPoints(houseguest) {
            $log.debug("tallyPoints", houseguest);
            var tally = houseguest.hoh + houseguest.pov + houseguest.weeks;
            $log.debug("tallyPoints", tally);
            return tally;
        }

    }
    //service ends
})();