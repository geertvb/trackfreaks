var trackServices = angular.module('trackServices', ['ngResource']);

trackServices.factory('trackResource', ['$resource',
    function ($resource) {
        return $resource('http://localhost:3000/tracks/:id', {id: '@id'});
    }]);