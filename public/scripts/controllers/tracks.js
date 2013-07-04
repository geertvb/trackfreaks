function tracksCtrl($scope, $http, $resource, $dialog) {

    var tracksResource = $resource('/resources/tracks/:_id', {_id: '@_id'}, { update: { method: 'PUT' } });

    $scope.predicate = ['countryId','name'];

    $scope.track = {};

    $scope.tracks = tracksResource.query();

    $scope.mapOptions = {
        center: new google.maps.LatLng(50.4448, 5.9683),
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.countries = [
        {code: 'BE', label:'Belgium'},
        {code: 'FR', label:'France'},
        {code: 'NL', label:'Netherlands'},
        {code: 'DE', label:'Germany'},
        {code: 'UK', label:'United Kingdom'},
    ];

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