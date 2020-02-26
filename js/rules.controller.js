//IIFE - keeps code isolated and off global scope
(function() {
  angular.module("rules", []).controller("RulesCtrl", RulesCtrl);

  //injection for js minification
  RulesCtrl.$inject = ["$log", "DataService"];

  //controller begins
  function RulesCtrl($log, DataService) {
    $log = $log.getInstance("RulesCtrl", false);

    //controllerAs 'vm' scope
    var vm = this;
    vm.DataService = DataService;
    ga("send", "pageview");
  }
  //controller ends
})();
