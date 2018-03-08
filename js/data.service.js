//IIFE - keeps code isolated and off global scope
(function() {
  angular.module("data", []).service("DataService", DataService);

  //injection for js minification
  DataService.$inject = ["$log", "$http"];

  //service begins
  function DataService($log, $http) {
    $log = $log.getInstance("DataService", false);

    //internal method attached to service
    this.houseguests = [];
    this.members = [];
    this.useFirebase = false;
    this.teamSize = 5;
    // this.firebaseUrl = "luminous-heat-7812.firebaseio.com/";
    this.firebaseUrl = "bb-pool.firebaseio.com";
    this.get = get;

    //internal methods
    function get() {
      var self = this;
      return $http.get("/app.json");
    }
  }
  //service ends
})();
