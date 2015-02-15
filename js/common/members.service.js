//IIFE - keeps code isolated and off global scope
(function() {
    angular
        .module('members',[])
        .service('MembersService', MembersService);

    //injection for js minification
    MembersService.$inject = [
        '$log',
        '$firebase'
    ];

    //service begins
    function MembersService($log, $firebase) {
        $log = $log.getInstance('MembersService', true);

        //internal method attached to service
        this.getMembers = getMembers;
        this.getMemberByName = getMemberByName;

        //internal methods
        function getMembers() {
            $log.debug("getMembers");
            // create a reference to the user's profile
            var ref = new Firebase("https://luminous-heat-7812.firebaseio.com/members/");
            // return it as a synchronized object

            return $firebase(ref).$asArray();
        }

        function getMemberByName(name) {
            // create a reference to the user's profile
            var ref = new Firebase("https://luminous-heat-7812.firebaseio.com/members/").child(name);
            // return it as a synchronized object
            return $firebase(ref).$asObject();
        }

    }
    //service ends
})();