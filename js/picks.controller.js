//IIFE - keeps code isolated and off global scope
(function() {
    angular
        .module('picks', [])
        .controller('PicksCtrl', PicksCtrl);

    //injection for js minification
    PicksCtrl.$inject = [
        '$log',
        '$scope',
        'MembersService',
        'HouseguestsService',
        'AuthService'
    ];

    //controller begins
    function PicksCtrl($log, $scope, MembersService, HouseguestsService, AuthService) {
        $log = $log.getInstance('PicksCtrl', false);

        //controllerAs 'vm' scope
        var vm = this;

        //dependancy injections on scope
        vm.MembersService = MembersService;
        vm.HouseguestsService = HouseguestsService;
        vm.currentAuth = false;

        //apply internal properties
        vm.isLoaded = false;
        vm.maxPicks = 5;
        vm.pickCode = "";
        vm.codeMessage = "";
        vm.memeber = {};
        vm.memberPicks = [];
        vm.isValidPickCode = false;
        vm.picksSaved = false;

        //apply internal methods to scope
        vm.loadData = loadData;
        vm.init = init;
        vm.onPickCodeChange = onPickCodeChange;
        vm.selectPick = selectPick;
        vm.savePicks = savePicks;
        vm.savePicksCopy = savePicksCopy;
        vm.randomPicks = randomPicks;

        //start controller
        vm.loadData();

        //internal methods
        function loadData() {
            var vmSelf = vm;

            // $log.debug("loadData");
            vm.members = vm.MembersService.get();
            $log.debug(vm.members);
            vm.members.$loaded().then(function() {
                // $log.debug(vm.members);
                vmSelf.houseguests = vm.HouseguestsService.get();
                vmSelf.houseguests.$loaded().then(function() {
                    // $log.debug(vm.houseguests);
                    vmSelf.init();
                });

            });
        }

        function init() {
            $log.debug("init");
            vm.isLoaded = true;

            //mark all houseguests as unselected initially
            for (var i = 0; i < vm.houseguests.length; i++) {
                vm.houseguests[i].selected = false;
            }

            //watch for a pickcode being entered
            $scope.$watch(angular.bind(vm, function (pickCode) {
              return this.pickCode;
            }), function (newVal) {
              vm.onPickCodeChange();
            });

        }

        function onPickCodeChange() {
            var check = vm.MembersService.findMemberByPickCode(vm.members, vm.pickCode);
            $log.debug("onPickCodeChange", vm.pickCode, check);
            vm.isValidCode = check.isValidCode;

            if (check.isValidCode && check.member) {
                vm.codeMessage = "";
                vm.member = check.member;

                if (vm.MembersService.hasCompletedPicks(vm.member, vm.maxPicks)) {
                    vm.picksSaved = true;
                }

                vm.memberPicks = vm.MembersService.getMemberPicksAsArray(vm.member);
            } else {
                vm.codeMessage = "Invalid Pick Code. Please enter your full code.";
            }

        }

        function selectPick(houseguestID) {
            $log.debug("selectPick", houseguestID);


            //check if pick is already in memberpicks to unselect
            if (vm.memberPicks.indexOf(houseguestID) > -1) {
                    vm.houseguests[houseguestID].selected = false;
                    //remove from picks

                    var index = vm.memberPicks.indexOf(houseguestID);
                    if (index > -1) {
                        vm.memberPicks.splice(index, 1);
                    }

            } else {
                //its a new selection see if we have room
                if (vm.memberPicks.length < 5) {
                    vm.memberPicks.push(houseguestID);
                    vm.houseguests[houseguestID].selected = true;
                    console.log(vm.houseguests[houseguestID]);
                } else {
                    alert("you already have picked 5 houseguests!");
                }
            }
        }

        function savePicksCopy() {
            $log.debug("savePicksCopy");
            var s = "Save Your Picks Now";
            var pickCount = vm.memberPicks.length;
            if (pickCount < vm.maxPicks) {
                s = vm.maxPicks - pickCount + " picks left before you can save your team.";
            }
            return s;
        }

        function savePicks() {
            $log.debug("savePicks");
            //check if picks are valid
            var picks = vm.MembersService.setMemberPicksAsString(vm.memberPicks);
            var arePicksValid = vm.MembersService.checkIfPicksAreValid(picks);
            if (arePicksValid) {
                //save and notify users
                vm.MembersService.ref.child(vm.member.$id).update({
                  "picks": picks
                });
                vm.picksSaved = true;
            } else {
                //notify user to make new picks
            }
        }

        function randomPicks() {
            $log.debug("randomPicks");
            //make a random team and then loop through all member picks
            //and check to see if the team exists
        }

    }
    //controller ends
})();