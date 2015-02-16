//IIFE - keeps code isolated and off global scope
(function() {
    angular
        .module('standings', [])
        .controller('StandingsCtrl', StandingsCtrl);

    //injection for js minification
    StandingsCtrl.$inject = [
        '$log',
        'MembersService',
        'HouseguestsService',
        'AuthService',
        '$timeout'
    ];

    //controller begins
    function StandingsCtrl($log, MembersService, HouseguestsService, AuthService, $timeout) {
        $log = $log.getInstance('StandingsCtrl', true);

        //controllerAs 'vm' scope
        var vm = this;

        //dependancy injections on scope
        vm.MembersService = MembersService;
        vm.HouseguestsService = HouseguestsService;
        vm.currentAuth = false;

        //apply internal methods to scope
        vm.loadData = loadData;
        vm.init = init;
        vm.generateStandings = generateStandings;

        //start controller
        vm.loadData();

        //internal methods
        function loadData() {
            var vmSelf = vm;

            vm.currentAuth = AuthService.$requireAuth();

            // $log.debug("loadData");
            vm.members = vm.MembersService.get();
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
            vm.generateStandings();
        }

        function generateStandings() {
            $log.debug("generateStandings", vm.members, vm.houseguests);
            //loop through houseguests and tally their point value
            //then loop through members and tally point total of all their picks
            //then sort by points

            for (var i = 0; i < vm.houseguests.length; i++) {
                var x = i;
                vm.houseguests[i].points = vm.HouseguestsService.tallyPoints(vm.houseguests[i]);
                vm.houseguests.$save(i).then(function(ref) {
                  ref.key() === vm.houseguests[x].$id; // true
                });
            };

            for (var i = 0; i < vm.members.length; i++) {
                var x = i;
                vm.members[i].points = vm.MembersService.tallyPickPoints(vm.houseguests, vm.members[i]);
                vm.members.$save(i).then(function(ref) {
                  ref.key() === vm.members[x].$id; // true
                });
            };

            //reverse lists so they are in desc point value
            // vm.houseguests.reverse();
            // vm.members.reverse();

        }

    }
    //controller ends
})();