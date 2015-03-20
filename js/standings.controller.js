//IIFE - keeps code isolated and off global scope
(function() {
    angular
        .module('standings', [])
        .controller('StandingsCtrl', StandingsCtrl);

    //injection for js minification
    StandingsCtrl.$inject = [
        '$log',
        'MembersService',
        'HouseguestsService'
    ];

    //controller begins
    function StandingsCtrl($log, MembersService, HouseguestsService) {
        $log = $log.getInstance('StandingsCtrl', false);

        //controllerAs 'vm' scope
        var vm = this;

        //dependancy injections on scope
        vm.MembersService = MembersService;
        vm.HouseguestsService = HouseguestsService;

        //apply internal methods to scope
        vm.loadData = loadData;
        vm.init = init;
        vm.generateStandings = generateStandings;
        vm.statReports = statReports;

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
            vm.statReports();
        }

        function generateStandings() {
            $log.debug("generateStandings", vm.members, vm.houseguests);

            for (var i = 0; i < vm.houseguests.length; i++) {
                vm.houseguests[i].points = vm.HouseguestsService.tallyPoints(vm.houseguests[i]);
                // vm.houseguests.$save(i);
            }

            for (var x = 0; x < vm.members.length; x++) {
                vm.members[x].points = vm.MembersService.tallyPickPoints(vm.houseguests, vm.members[x]);
                // vm.members.$save(x);
            }
        }

        function statReports() {

            console.log("----------  REPORTS -----------");

            //how many people have picked
            var t = 0;
            for (var i=0; i < vm.members.length; i++) {
                if (vm.members[i].picks.length) {
                      t++;
                 }
            }
            console.log(t + " people have made their picks.");

            //duplicate check
            var p = [];
            for (var i=0; i < vm.members.length; i++) {
                if (vm.members[i].picks.length) {
                      var m = vm.members[i].picks.split();
                      p.push(m.join(""));
                 }
            }

            p.sort();

            var c = p.slice(0);

            for (var i=0; i < c.length; i++) {
                var pick = c[i];

                //loop through p and count how many times it exists
                var t = 0;
                for (var x=0; x < p.length;x++) {
                    if (p[x] === pick) {
                        t++;
                    }
                }

                console.log(pick + ": " + t);
            }


        }

    }
    //controller ends
})();