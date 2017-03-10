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
        'DataService',
        '$window'
    ];

    //controller begins
    function StandingsCtrl($log, MembersService, HouseguestsService, DataService, $window) {
        $log = $log.getInstance('StandingsCtrl', false);

        //controllerAs 'vm' scope
        var vm = this;

        vm.sortedMembers = [];

        //dependancy injections on scope
        vm.DataService = DataService;
        vm.MembersService = MembersService;
        vm.HouseguestsService = HouseguestsService;

        //apply internal methods to scope
        vm.loadData = loadData;
        vm.loadDataFirebase = loadDataFirebase;
        vm.init = init;
        vm.generateStandings = generateStandings;
        vm.statReports = statReports;
        vm.showBio = showBio;

        //start controller
        if (vm.DataService.useFirebase) {
            vm.loadDataFirebase();
        } else {
            vm.loadData();
        }

        //internal methods
        function loadData() {
            var _vm = vm;
            if (!vm.DataService.houseguests.length) {
                vm.DataService.get().
                    success(function(data, status, headers, config) {
                        $log.debug("loadData", data);
                        _vm.houseguests = data['houseguests'];
                        _vm.members = data['members'];
                        _vm.init();
                    }).
                    error(function(data, status, headers, config) {
                        console.log("Error: loading data", data, status, headers, config);
                    });
            }
        }

        function loadDataFirebase() {
            var _vm = vm;

            $log.debug("loadData");
            vm.members = vm.MembersService.get();
            vm.members.$loaded().then(function() {
                $log.debug(vm.members, _vm.members.length);
                _vm.houseguests = _vm.HouseguestsService.get();
                _vm.houseguests.$loaded().then(function() {
                    $log.debug(_vm.houseguests);
                    _vm.init();
                });

            });
        }

        function showBio(bio) {
            $log.debug("showBio");
            $window.open(bio, '_blank');
        }
        function init() {
            $log.debug("init");
            vm.generateStandings();
            vm.statReports();
        }

        function generateStandings() {

            for (var i = 0; i < vm.houseguests.length; i++) {
                vm.houseguests[i].points = vm.HouseguestsService.tallyPoints(vm.houseguests[i]);
                // vm.houseguests.$save(i);
            }

            for (var x = 0; x < vm.members.length; x++) {
                vm.members[x].points = vm.MembersService.tallyPickPoints(vm.houseguests, vm.members[x]);
                // vm.members.$save(x);
            }

            //sort members by points and alphaname
            vm.sortedMembers = _.sortByOrder(vm.members, ['points', 'name'], [false, true]);

            var pointCounts = _.countBy(vm.sortedMembers, function(member) {
              return member.points;
            });
            var sortedPoints = _.pairs(pointCounts)
            // $log.info("sortedPoints", sortedPoints);

            // //used when the point spread has start to thin out and show the prize values/
            // vm.firstPlacePointValue = sortedPoints[sortedPoints.length-1][0];
            // vm.secondPlacePointValue = sortedPoints[sortedPoints.length-2][0];
            // vm.thirdPlacePointValue = sortedPoints[sortedPoints.length-3][0];
            // vm.fourthPlacePointValue = sortedPoints[sortedPoints.length-4][0];
            // vm.lastPlacePointValue = sortedPoints[0][0];

            // $log.debug("generateStandings", vm.members, vm.houseguests);
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


            //payee count
            var outstandingPayees = 0;
            for (var i=0; i < vm.members.length; i++) {
                if (!vm.members[i].paid) {
                      outstandingPayees++;
                 }
            }

            console.log(outstandingPayees + " of " + vm.members.length + " still owe us money.");

        }

    }
    //controller ends
})();