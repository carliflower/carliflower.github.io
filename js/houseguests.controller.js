//IIFE - keeps code isolated and off global scope
(function() {
    angular
        .module('houseguests', [])
        .controller('HouseguestsCtrl', HouseguestsCtrl);

    //injection for js minification
    HouseguestsCtrl.$inject = [
        '$log',
        'HouseguestsService',
        '$window',
        'DataService'
    ];

    //controller begins
    function HouseguestsCtrl($log, HouseguestsService, $window, DataService) {
        $log = $log.getInstance('HouseguestsCtrl', false);

        //controllerAs 'vm' scope
        var vm = this;

        //dependancy injections on scope
        vm.HouseguestsService = HouseguestsService;
        vm.DataService = DataService;

        //apply internal methods to scope
        vm.loadData = loadData;
        vm.init = init;
        vm.showBio = showBio;
        vm.totalPoints = totalPoints;
        vm.houseguests = [];
        vm.members = [];

        //start controller
        vm.loadData();

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
                        console.log("Error: loading data");
                    });
            }

        }

        function init() {
            $log.debug("init");
            for (var i = 0; i < vm.houseguests.length; i++) {
                vm.houseguests[i].points = vm.HouseguestsService.tallyPoints(vm.houseguests[i]);
                // vm.houseguests.$save(i);
            }
        }

        function showBio(bio) {
            $log.debug("showBio");
            $window.open(bio, '_blank');
        }

        function totalPoints(houseguest) {
            return houseguest.hoh + houseguest.pov + houseguest.weeks;
        }

    }
    //controller ends
})();