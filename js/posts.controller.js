//IIFE - keeps code isolated and off global scope
(function() {
    angular
        .module('posts', [])
        .controller('PostsCtrl', PostsCtrl);

    //injection for js minification
    PostsCtrl.$inject = [
        '$log'
    ];

    //controller begins
    function PostsCtrl($log) {
        $log = $log.getInstance('PostsCtrl', true);

        //controllerAs 'vm' scope
        var vm = this;

    }
    //controller ends
})();