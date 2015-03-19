//IIFE - keeps code isolated and off global scope
(function() {
    angular
        .module('houseguests')
        .service('HouseguestsService', HouseguestsService);

    //injection for js minification
    HouseguestsService.$inject = [
        '$log',
        '$firebaseArray'
    ];

    //service begins
    function HouseguestsService($log, $firebaseArray) {
        $log = $log.getInstance('HouseguestsService', false);

        //interal vars
        this.ref = false;

        //internal method attached to service
        this.get = get;
        this.tallyPoints = tallyPoints;

        //internal methods
        function get() {
            $log.debug("get");
            this.ref = new Firebase("https://luminous-heat-7812.firebaseio.com/houseguests/");
            // this.ref = new Firebase("https://bbcantest.firebaseio.com/houseguests/");
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