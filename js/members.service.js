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
        this.findMemberByPickCode = findMemberByPickCode;
        this.getMemberPicksAsArray = getMemberPicksAsArray;
        this.checkIfPicksAreValid = checkIfPicksAreValid;
        this.setMemberPicksAsString = setMemberPicksAsString;
        this.hasCompletedPicks = hasCompletedPicks;

        //internal methods
        function get() {
            $log.debug("get");
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
            var tally = 0;
            for (var h = 0; h < houseguests.length; h++) {
                //loop through each houseguest and then loop through the members picks
                var picks = member.picks.split(',');
                for (var m = 0; m < picks.length; m++) {
                    var pick = picks[m];
                    if (pick == houseguests[h].$id) {
                        tally += houseguests[h].points;
                    }
                }
            }
            $log.debug("tallyPickPoints", tally);
            return tally;
        }

        function findMemberByPickCode(members, pickCode) {
            $log.debug("findMemberByPickCode", pickCode);

            var response = {
                isValidCode: false,
                member: null
            };

            for (var m = 0; m < members.length; m++) {
                var member = members[m];
                if (member.pickcode == pickCode) {
                    response.isValidCode = true;
                    response.member = member;
                }
            }
            return response;
        }

        function getMemberPicksAsArray(member) {
            var a = [];
            if (member.picks !== "") {
                a = member.picks.split(',');
            }
            return a;
        }

        function setMemberPicksAsString(memberpicks) {

            function compareNumbers(a, b) {
              return a - b;
            }

            //sort by numeric order and then return as a string.
            //ex.  ["3", "2", "1"] becomes "1,2,3"
            var s = memberpicks.sort(compareNumbers).join();
            $log.debug("setMemberPicksAsString", memberpicks, s);
            return s;
        }

        function checkIfPicksAreValid(memberpicks) {
            $log.debug("checkIfPicksAreValid", memberpicks);
            var arePicksValid = true;
            return arePicksValid;
        }

        function hasCompletedPicks(member, maxpicks) {
            $log.debug("hasCompletedPicks", member, maxpicks);
            var r = false;
            if (member.picks.split(",").length === maxpicks) {
                r = true;
            }
            return r;

        }

    }
    //service ends
})();