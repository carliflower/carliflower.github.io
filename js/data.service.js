//IIFE - keeps code isolated and off global scope
;(function() {
  angular.module("data", []).service("DataService", DataService)

  //injection for js minification
  DataService.$inject = ["$log", "$http"]

  //service begins
  function DataService($log, $http) {
    $log = $log.getInstance("DataService", false)

    //internal method attached to service
    this.houseguests = []
    this.members = []
    this.useFirebase = true
    this.teamSize = 3
    this.firebaseUrl = "bb-pool.firebaseio.com"
    this.get = get

    //internal methods
    function get() {
      var self = this
      return $http.get("/app.json")
    }
  }
  //service ends
})()
