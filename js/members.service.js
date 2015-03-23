//IIFE - keeps code isolated and off global scope
(function() {
    angular
        .module('members',[])
        .service('MembersService', MembersService);

    //injection for js minification
    MembersService.$inject = [
        '$log'
    ];

    //service begins
    function MembersService($log) {
        $log = $log.getInstance('MembersService', false);

        this.tallyPickPoints = tallyPickPoints;
        this.findMemberByPickCode = findMemberByPickCode;
        this.getMemberPicksAsArray = getMemberPicksAsArray;
        this.checkIfPicksAreValid = checkIfPicksAreValid;
        this.setMemberPicksAsString = setMemberPicksAsString;
        this.hasCompletedPicks = hasCompletedPicks;
        this.gatherAllMemberPicks = gatherAllMemberPicks;
        this.generateRandomPick = generateRandomPick;

        //internal methods
        function tallyPickPoints(houseguests, member) {
            var tally = 0;
            for (var h = 0; h < houseguests.length; h++) {
                //loop through each houseguest and then loop through the members picks
                var picks = member.picks.split(',');
                for (var m = 0; m < picks.length; m++) {
                    var pick = picks[m];
                    if (pick == houseguests[h].$id) {
                        tally += houseguests[h].hoh + houseguests[h].pov + houseguests[h].weeks;
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
                if (member.pickcode.toLowerCase() == pickCode.toLowerCase()) {
                    response.isValidCode = true;
                    response.member = member;
                }
            }
            return response;
        }

        function getMemberPicksAsArray(member) {
            var a = [];
            if (member.picks) {
                if (member.picks.length) {
                    a = member.picks.split(',');
                }
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

        function checkIfPicksAreValid(members, currentpicks) {
            $log.debug("checkIfPicksAreValid", members, currentpicks);
            var arePicksValid = false;

            var allCurrentPicksAsArrayOfSortedStrings = this.gatherAllMemberPicks(members);
            var pickSetIsUsed = _.includes(allCurrentPicksAsArrayOfSortedStrings, currentpicks);
            $log.debug("pickSetIsUsed", pickSetIsUsed);

            if (!pickSetIsUsed) {
                arePicksValid = true;
            }

            $log.debug("arePicksValid", arePicksValid);
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

        function gatherAllMemberPicks(members) {
            var picks = [];
            for (var m = 0; m < members.length; m++) {
                var member = members[m];
                var memberPicksArray = this.getMemberPicksAsArray(member);
                var memberPicksAsSortedString = this.setMemberPicksAsString(memberPicksArray);
                picks.push(memberPicksAsSortedString);
            }
            $log.debug("gatherMemberPicks", picks);
            return picks;
        }


        function generateRandomPick(members, houseguests) {
            var allCurrentPicksAsArrayOfSortedStrings = this.gatherAllMemberPicks(members);
            var pickSetIsUsed = true;

            //randomize order of houseguests
            var randomizedHouseguestsOrder = _.shuffle(houseguests);
            // $log.debug("randomizedHouseguestsOrder", randomizedHouseguestsOrder);
            var randomSample = [];
            var availablePickSet = "";

            // $log.debug("allCurrentPicksAsArrayOfSortedStrings", allCurrentPicksAsArrayOfSortedStrings);
            while (pickSetIsUsed) {
                //generate 5 unique random index #s
                randomSample = _.sample(randomizedHouseguestsOrder, 5);
                // $log.debug("randomSample", randomSample);
                var randomSampleIds = _.map(randomSample, '$id');
                var randomSampleString = this.setMemberPicksAsString(randomSampleIds);
                // $log.debug("randomSampleString", randomSampleString);
                //check if randomSample is used
                pickSetIsUsed = _.includes(allCurrentPicksAsArrayOfSortedStrings, randomSampleString);
                $log.debug("generateRandomPick", pickSetIsUsed, randomSampleString);
                if (!pickSetIsUsed) {
                    availablePickSet = randomSampleString.split(",");
                }
            }

            return availablePickSet;

        }

    }
    //service ends
})();