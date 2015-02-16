//IIFE - keeps code isolated and off global scope
(function() {
    angular
        .module('houseguests',[])
        .service('HouseguestsService', HouseguestsService);

    //injection for js minification
    HouseguestsService.$inject = [
        '$log',
        '$firebase'
    ];

    //service begins
    function HouseguestsService($log, $firebase) {
        $log = $log.getInstance('HouseguestsService', true);

        //interal vars
        this.ref = false;

        //internal method attached to service
        this.get = get;
        this.tallyPoints = tallyPoints;

        //internal methods
        function get() {
            // $log.debug("get");
            // create a reference to the user's profile
            this.ref = new Firebase("https://luminous-heat-7812.firebaseio.com/houseguests/");
            // return it as a synchronized object

            // this.ref.orderByChild("points").on("child_changed", function(snapshot) {
            //   // console.log(snapshot.key() + " has " + snapshot.val().points + " points");
            // });

            // this.ref.orderByChild("points").on("child_added", function(snapshot) {
            //   // console.log(snapshot.key() + " has " + snapshot.val().points + " points");
            // });


            return $firebase(this.ref).$asArray();
        }

        function tallyPoints(houseguest) {
            // $log.debug("tallyPoints", houseguest);
            var tally = houseguest.hoh + houseguest.pov;
            $log.debug("tallyPoints", tally);
            return tally;
        }

    }
    //service ends
})();