//IIFE - keeps code isolated and off global scope
(function() {
    angular
        .module('houseguests')
        .service('HouseguestsService', HouseguestsService);

    //injection for js minification
    HouseguestsService.$inject = [
        '$log'
    ];

    //service begins
    function HouseguestsService($log) {
        $log = $log.getInstance('HouseguestsService', false);

        //internal method attached to service
        this.tallyPoints = tallyPoints;

        //internal methods
        function tallyPoints(houseguest) {
            $log.debug("tallyPoints", houseguest);
            var tally = houseguest.hoh + houseguest.pov + houseguest.weeks;
            $log.debug("tallyPoints", tally);
            return tally;
        }

    }
    //service ends
})();