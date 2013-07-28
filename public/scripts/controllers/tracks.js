function tracksCtrl($scope, $http, $resource, $dialog) {

    var tracksResource = $resource('/resources/tracks/:_id', {_id: '@_id'}, { update: { method: 'PUT' } });
    var service = new google.maps.DirectionsService();

    $scope.path = [];
    $scope.poly;

    $scope.predicate = ['countryId','name'];

    $scope.track = {};

    $scope.tracks = tracksResource.query();

    $scope.markers = [];

    $scope.mapOptions = {
        center: new google.maps.LatLng(50.4448, 5.9683),
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.$watch('tracks', function() {
        $scope.createMarkers();
    }, true);

    $scope.countries = [
        {code: 'BE', label:'Belgium'},
        {code: 'FR', label:'France'},
        {code: 'NL', label:'Netherlands'},
        {code: 'DE', label:'Germany'},
        {code: 'UK', label:'United Kingdom'},
        {code: 'SP', label:'Spain'},
        {code: 'IT', label:'Italy'},
        {code: 'CZ', label:'Czech Republic'}
    ];

    $scope.setCenter = function(lat, lng) {
        var latLng = new google.maps.LatLng(lat, lng);
        $scope.myMap.setCenter(latLng);
        $scope.myMap.setZoom(14);
    }

    $scope.marker = function(lat, lng) {
        var latLng = new google.maps.LatLng(lat, lng);
        var marker = new google.maps.Marker({
            position: latLng,
            map: $scope.myMap
        });
        $scope.markers.push(marker);
    }

    $scope.createMarkers = function() {
        var lm;
        for (lm in $scope.markers) {
            lm.setMap(null);
        }
        $scope.markers.length = 0;

        var lt;
        for (lt in $scope.tracks) {
            $scope.marker($scope.tracks[lt].lat, $scope.tracks[lt].lng);
        }
        $scope.fitMarkers();
    }

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

    $scope.addMarker = function($event, $params) {
        var latLng = $params[0].latLng;
        if ($scope.path.length == 0) {
            $scope.path.push(latLng);
            $scope.poly = new google.maps.Polyline({ map: $scope.myMap });
            $scope.poly.setPath($scope.path);
        } else {
            service.route({
                origin: $scope.path[$scope.path.length - 1],
                destination: latLng,
                travelMode: google.maps.TravelMode.BICYCLING
            }, function(result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    $scope.path = $scope.path.concat(result.routes[0].overview_path);
                    $scope.poly.setPath($scope.path);
                }
            });
        }
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

    $scope.fitMarkers = function() {
        if ($scope.tracks.length > 1) {
            var sw = new google.maps.LatLng(
                Math.min($scope.tracks[0].lat, $scope.tracks[1].lat),
                Math.min($scope.tracks[0].lng, $scope.tracks[1].lng)
            );
            var ne = new google.maps.LatLng(
                Math.max($scope.tracks[0].lat, $scope.tracks[1].lat),
                Math.max($scope.tracks[0].lng, $scope.tracks[1].lng)
            );
            var bounds = new google.maps.LatLngBounds(sw, ne);
            for (var i=2; i<$scope.tracks.length; i++) {
                bounds.extend(new google.maps.LatLng($scope.tracks[i].lat, $scope.tracks[i].lng));
            }
            $scope.myMap.fitBounds(bounds);
        }
    }

};