var myApp = angular.module('myApp', ['ui.bootstrap', 'ngResource']);

myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/tracks', { templateUrl: 'views/tracks.html',   controller: tracksCtrl }).
        when('/organizations', { templateUrl: 'views/organizations.html' }).
        when('/riders', { templateUrl: 'views/riders.html' }).
        when('/calendar', { templateUrl: 'views/calendar.html' }).
        when('/laptiming', { templateUrl: 'views/laptiming.html' }).
        otherwise({redirectTo: '/tracks'});
}]);

function navCtrl($scope, $http, $location) {

    $scope.test = function() {
        console.log($location.$$path);
        console.log($location.$$path == '/tracks');
    }

    $scope.isActive = function(loc) {
        return $location.path() == loc;
    }

};