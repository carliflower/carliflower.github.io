//IIFE - keeps code isolated and off global scope
(function() {
    angular
        .module('houseguests', [])
        .controller('HouseguestsCtrl', HouseguestsCtrl);

    //injection for js minification
    HouseguestsCtrl.$inject = [
        '$log',
        'HouseguestsService',
        '$window'
    ];

    //controller begins
    function HouseguestsCtrl($log, HouseguestsService, $window) {
        $log = $log.getInstance('HouseguestsCtrl', true);

        //controllerAs 'vm' scope
        var vm = this;

        //dependancy injections on scope
        vm.HouseguestsService = HouseguestsService;

        //apply internal methods to scope
        vm.loadData = loadData;
        vm.init = init;
        vm.showBio = showBio;

        vm.randomNum = function() {
            return Math.floor((Math.random() * 100000) + 1);
        };

        //start controller
        vm.loadData();

        //internal methods
        function loadData() {
            vm.houseguests = vm.HouseguestsService.get();
            vm.houseguests.$loaded().then(function() {
                $log.debug("loadData", vm.houseguests);
                vm.init();
            });
        }

        function init() {
            $log.debug("init");
        }

        function showBio(bio) {
            $log.debug("showBio");
            $window.open(bio, '_blank');
        }

    }
    //controller ends
})();