//IIFE - keeps code isolated and off global scope
(function() {
    angular
        .module('standings', [])
        .controller('StandingsCtrl', StandingsCtrl);

    //injection for js minification
    StandingsCtrl.$inject = [
        '$log',
        'CurrentAuth',
        'MembersService',
        'AuthService'
    ];

    //controller begins
    function StandingsCtrl($log, CurrentAuth, MembersService, AuthService) {
        $log = $log.getInstance('StandingsCtrl', true);

        //controllerAs 'vm' scope
        var vm = this;

        //dependancy injections on scope
        vm.MembersService = MembersService;
        vm.CurrentAuth = CurrentAuth;

        // //variables on scope

        // vm.data = $stateParams.shipmentID;
        // vm.shipment = {};

        //apply internal methods to scope
        vm.loadData = loadData;
        vm.init = init;

        //start controller
        vm.loadData();

        //internal methods
        function loadData() {
            $log.debug("loadData");

            vm.members = vm.MembersService.getMembers();
            vm.init();
        }

        function init() {
            $log.debug("init");


            $log.debug(vm.members);
            // $log.debug(vm.CurrentAuth);
            // // any time auth status updates, add the user data to scope
            // vm.currentAuth.$onAuth(function(authData) {
            //     vm.authData = authData;
            // });
        }
    }
    //controller ends
})();