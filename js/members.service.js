//IIFE - keeps code isolated and off global scope
(function() {
    angular
        .module('members',[])
        .service('MembersService', MembersService);

    //injection for js minification
    MembersService.$inject = [
        '$log',
        '$firebase'
    ];

    //service begins
    function MembersService($log, $firebase) {
        $log = $log.getInstance('MembersService', true);


        this.ref = false;

        //internal method attached to service
        this.get = get;
        this.tallyPickPoints = tallyPickPoints;

        //internal methods
        function get() {
            // $log.debug("get");
            // create a reference to the user's profile
            this.ref = new Firebase("https://luminous-heat-7812.firebaseio.com/members/");
            // return it as a synchronized object

            // this.ref.orderByChild("points").on("child_changed", function(snapshot) {
            //   // console.log(snapshot.key() + " has " + snapshot.val().points + " points");
            // });

            // this.ref.orderByChild("points").on("child_added", function(snapshot) {
            //   // console.log(snapshot.key() + " has " + snapshot.val().points + " points");
            // });

            return $firebase(this.ref).$asArray();
        }

        function tallyPickPoints(houseguests, member) {
            // $log.debug("tallyPickPoints", houseguests, member);
            var tally = 0;
            for (var h = 0; h < houseguests.length; h++) {
                //loop through each houseguest and then loop through the members picks
                var picks = member.picks.split(',');
                for (var m = 0; m < picks.length; m++) {
                    var pick = picks[m];
                    if (pick == houseguests[h].$id) {
                        tally += houseguests[h].points;
                    }
                };
            };
            $log.debug("tallyPickPoints", tally);
            return tally;
        }

    }
    //service ends
})();