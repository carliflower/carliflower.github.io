//IIFE - keeps code isolated and off global scope
(function() {
    angular
        .module('rules', [])
        .controller('RulesCtrl', RulesCtrl);

    //injection for js minification
    RulesCtrl.$inject = [
        '$log'
    ];

    //controller begins
    function RulesCtrl($log) {
        $log = $log.getInstance('RulesCtrl', true);

        //controllerAs 'vm' scope
        var vm = this;

    }
    //controller ends
})();