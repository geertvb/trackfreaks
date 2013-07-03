function tracksCtrl($scope, $http, $resource, $dialog) {

    var tracksResource = $resource('/resources/tracks/:_id', {_id: '@_id'}, { update: { method: 'PUT' } });

    $scope.predicate = ['countryId','name'];

    $scope.track = {};

    $scope.tracks = tracksResource.query();

    $scope.selectTrack = function(trackId) {
        $scope.track = tracksResource.get({_id: trackId});
    }

    $scope.deleteTrack = function(trackId) {
        var msgbox = $dialog.messageBox('Delete Track', 'Are you sure?', [{label:'Yes', result: 'yes'},{label:'No', result: 'no'}]);
        msgbox.open().then(function(result){
            if(result === 'yes') {
                tracksResource.delete({_id: trackId});
                $scope.tracks = tracksResource.query();
            }
        });
    }

    $scope.reset = function() {
        $scope.track = {};
    }

    $scope.save = function() {
        if ($scope.track._id) {
            tracksResource.update($scope.track);
        } else {
            tracksResource.save($scope.track);
            $scope.track = {};
        }
        $scope.tracks = tracksResource.query();
    }

};