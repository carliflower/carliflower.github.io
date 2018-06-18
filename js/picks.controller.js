//IIFE - keeps code isolated and off global scope
(function() {
  angular.module("picks", []).controller("PicksCtrl", PicksCtrl);

  //injection for js minification
  PicksCtrl.$inject = [
    "$log",
    "$scope",
    "MembersService",
    "HouseguestsService"
  ];

  //controller begins
  function PicksCtrl($log, $scope, MembersService, HouseguestsService) {
    $log = $log.getInstance("PicksCtrl", false);

    //controllerAs 'vm' scope
    var vm = this;

    //dependancy injections on scope
    vm.MembersService = MembersService;
    vm.HouseguestsService = HouseguestsService;
    vm.currentAuth = false;

    //apply internal properties
    vm.isLoaded = false;
    vm.maxPicks = this.MembersService.DataService.teamSize;
    vm.pickCode = "";
    vm.codeMessage = "";
    vm.memberPicks = [];
    vm.isValidPickCode = false;
    vm.picksSaved = false;
    vm.check = {;}

    //apply internal methods to scope
    vm.loadData = loadData;
    vm.init = init;
    vm.onPickCodeChange = onPickCodeChange;
    vm.selectPick = selectPick;
    vm.savePicks = savePicks;
    vm.savePicksCopy = savePicksCopy;
    vm.getAvailableRandomPick = getAvailableRandomPick;
    vm.getPickNameString = getPickNameString;
    vm.clearSelections = clearSelections;

    //start controller
    vm.loadData();

    //internal methods
    function loadData() {
      var vmSelf = vm;

      // $log.debug("loadData");
      vm.members = vm.MembersService.get();
      $log.debug(vm.members);
      vm.members.$loaded().then(function() {
        // $log.debug(vm.members);
        vmSelf.houseguests = vm.HouseguestsService.get();
        vmSelf.houseguests.$loaded().then(function() {
          // $log.debug(vm.houseguests);
          vmSelf.init();
        });
      });
    }

    function init() {
      $log.debug("init");
      vm.isLoaded = true;

      //mark all houseguests as unselected initially
      for (var i = 0; i < vm.houseguests.length; i++) {
        vm.houseguests[i].selected = false;
      }

      //watch for a pickcode being entered
      $scope.$watch(
        angular.bind(vm, function(pickCode) {
          return this.pickCode.toLowerCase();
        }),
        function(newVal) {
          vm.onPickCodeChange();
        }
      );
    }

    function onPickCodeChange() {
      vm.check = vm.MembersService.findMemberByPickCode(
        vm.members,
        vm.pickCode
      );
      $log.debug("onPickCodeChange", vm.pickCode, vm.check);
      vm.isValidCode = vm.check.isValidCode;

      if (vm.check.isValidCode && vm.check.member && vm.check.member.paid) {
        vm.codeMessage = "";
        vm.member = vm.check.member;

        if (vm.MembersService.hasCompletedPicks(vm.member, vm.maxPicks)) {
          vm.picksSaved = true;
        }

        vm.memberPicks = vm.MembersService.getMemberPicksAsArray(vm.member);
      } else {
        vm.codeMessage = "Invalid Pick Code. Please enter your full code.";
        if (vm.check.member !== null && !vm.check.member.paid) {
          console.log(check);
          vm.codeMessage = "You must pay to enabled your pick code.";
        }
      }
    }

    function selectPick(houseguestID) {
      $log.debug("selectPick", houseguestID);

      //check if pick is already in memberpicks to unselect
      if (vm.memberPicks.indexOf(houseguestID) > -1) {
        vm.houseguests[houseguestID].selected = false;
        //remove from picks

        var index = vm.memberPicks.indexOf(houseguestID);
        if (index > -1) {
          vm.memberPicks.splice(index, 1);
        }
      } else {
        //its a new selection see if we have room
        if (vm.memberPicks.length < vm.maxPicks) {
          vm.memberPicks.push(houseguestID);
          vm.houseguests[houseguestID].selected = true;
        } else {
          alert("you already have picked " + vm.maxPicks + " houseguests!");
        }
      }
    }

    function savePicksCopy() {
      $log.debug("savePicksCopy");
      var s = "Save Your Picks Now";
      var pickCount = vm.memberPicks.length;
      if (pickCount < vm.maxPicks) {
        s =
          vm.maxPicks -
          pickCount +
          " picks left before you can save your team.";
      }
      return s;
    }

    function savePicks() {
      $log.debug("savePicks");
      console.log("savePicks", vm.memberPicks, vm.member);
      //check if picks are valid
      var picks = vm.MembersService.setMemberPicksAsString(vm.memberPicks);
      var arePicksValid = vm.MembersService.checkIfPicksAreValid(
        vm.members,
        picks
      );
      if (arePicksValid) {
        //save and notify users
        vm.MembersService.ref.child(vm.member.$id).update({
          picks: picks
        });
        vm.picksSaved = true;
      } else {
        //notify user to make new picks
        alert(
          "Sorry, That combination of houseguests is taken. Try a new combination."
        );
      }
    }

    function getPickNameString() {
      var names = "";
      for (var i = 0; i < vm.memberPicks.length; i++) {
        names += vm.houseguests[vm.memberPicks[i]].name + ", ";
      }
      return names;
    }

    function clearSelections() {
      $log.debug("clearSelections");
      for (var i = 0; i < vm.houseguests.length; i++) {
        vm.houseguests[i].selected = false;
      }
      vm.memberPicks = [];
    }

    function getAvailableRandomPick() {
      $log.debug("randomPicks");
      vm.clearSelections();
      vm.memberPicks = vm.MembersService.generateRandomPick(
        vm.members,
        vm.houseguests
      );
      for (var i = 0; i < vm.memberPicks.length; i++) {
        vm.houseguests[vm.memberPicks[i]].selected = true;
      }
    }
  }
  //controller ends
})();
