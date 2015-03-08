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

            $log.debug("loadData");
            vm.members = vm.MembersService.get();
            vm.members.$loaded().then(function() {
                $log.debug(vm.members, vm.members.length);
                vmSelf.houseguests = vm.HouseguestsService.get();
                vmSelf.houseguests.$loaded().then(function() {
                    $log.debug(vm.houseguests);
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

            for (var i = 0; i < vm.houseguests.length; i++) {
                vm.houseguests[i].points = vm.HouseguestsService.tallyPoints(vm.houseguests[i]);
                vm.houseguests.$save(i);
            }

            for (var x = 0; x < vm.members.length; x++) {
                vm.members[x].points = vm.MembersService.tallyPickPoints(vm.houseguests, vm.members[x]);
                vm.members.$save(x);
            }
        }

    }
    //controller ends
})();