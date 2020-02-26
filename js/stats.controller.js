//IIFE - keeps code isolated and off global scope
(function() {
  angular.module("stats", []).controller("StatsCtrl", StatsCtrl);

  //injection for js minification
  StatsCtrl.$inject = [
    "$log",
    "MembersService",
    "HouseguestsService",
    "DataService"
  ];

  //controller begins
  function StatsCtrl($log, MembersService, HouseguestsService, DataService) {
    $log = $log.getInstance("StatsCtrl", false);
    ga("send", "pageview");

    //controllerAs 'vm' scope
    var vm = this;

    //dependancy injections on scope
    vm.MembersService = MembersService;
    vm.HouseguestsService = HouseguestsService;
    vm.DataService = DataService;

    //apply internal methods to scope
    vm.loadData = loadData;
    vm.loadDataFirebase = loadDataFirebase;
    vm.init = init;
    vm.houseguestPopularity = houseguestPopularity;

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
        vm.DataService.get()
          .success(function(data, status, headers, config) {
            $log.debug("loadData", data);
            _vm.houseguests = data["houseguests"];
            _vm.members = data["members"];
            _vm.init();
          })
          .error(function(data, status, headers, config) {
            console.log("Error: loading data");
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
          $log.debug(vm.houseguests);
          _vm.init();
        });
      });
    }

    function init() {
      $log.debug("init");
      vm.houseguestPopularity();
    }

    function houseguestPopularity() {
      var d = [];
      for (var i = 0; i < vm.members.length; i++) {
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
          points: vm.HouseguestsService.tallyPoints(vm.houseguests[i]),
          hoh: vm.houseguests[i].hoh,
          pov: vm.houseguests[i].pov,
          weeks: vm.houseguests[i].weeks,
          count: counts[i]
        };

        dataObjs.push(o);
      }

      vm.houseguestPopularityData = dataObjs.sort(function sortNumber(a, b) {
        return b.count - a.count;
      });
    }
  }
  //controller ends
})();
