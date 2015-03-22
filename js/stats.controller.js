//IIFE - keeps code isolated and off global scope
(function() {
    angular
        .module('stats', [])
        .controller('StatsCtrl', StatsCtrl);

    //injection for js minification
    StatsCtrl.$inject = [
        '$log',
        'MembersService',
        'HouseguestsService'
    ];

    //controller begins
    function StatsCtrl($log, MembersService, HouseguestsService) {
        $log = $log.getInstance('StatsCtrl', false);

        //controllerAs 'vm' scope
        var vm = this;

        //dependancy injections on scope
        vm.MembersService = MembersService;
        vm.HouseguestsService = HouseguestsService;


        //apply internal methods to scope
        vm.loadData = loadData;
        vm.init = init;
        vm.houseguestPopularity = houseguestPopularity;

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
            vm.houseguestPopularity();
        }

        function houseguestPopularity() {
            console.log("houseguestPopularity");

            var d = [];
            for (var i=0; i < vm.members.length; i++) {
                if (vm.members[i].picks.length) {
                      var m = vm.members[i].picks;
                      d.push(m);
                 }
            }

            //have list of lists now
            var counts = [];
            for (var i = 0; i < vm.houseguests.length; i++) {
                counts[i] = 0;
            }


            for (var i = 0; i < d.length; i++) {
                var outer = d[i].split(",");
                // console.log(outer);
                for (var x = 0; x < outer.length; x++) {
                    var inner = outer[x].split(",");
                    // console.log("-", inner);
                    for (var z = 0; z < inner.length; z++) {
                        // console.log("--", inner[z]);
                        counts[inner[z]]++;
                    }
                }
            }

            //generate data obj
            var dataObjs = [];
            for (var i = 0; i < vm.houseguests.length; i++) {

                var o = {
                    name: vm.houseguests[i].name,
                    photo: vm.houseguests[i].photo,
                    count: counts[i]
                };

                dataObjs.push(o);
            }

            vm.houseguestPopularityData = dataObjs.sort(function sortNumber(a,b) {
                                                                return b.count - a.count;
                                                            });


        }

    }
    //controller ends
})();