angular.module('location',['ngCordova','Super','Params'])
.factory('Location',function($cordovaGeolocation,Params,Super){
    var currentPosOptions = {
        timeout : Params.getPosTimeOut(),
        enableHighAccuracy : Params.getPosHighAcc(),
        maximumAge: Params.getPosMaxAge()
    }
    var currentWatchOptions = {
        frequency : Params.getPosWatchFreq(),
        timeout : Params.getPosTimeOut(),
        enableHighAccuracy : Params.getPosHighAcc()
    }
    var currentLocation = {
        _id : '',
        lat : '',
        lon : '',
        alt : '',
        acc : '',
        hea : '',
        spe : '',
        ts : '',
        type : 'feature'
    };
    var status = false;
    var Location = function (){
        status = false;
    };
    Location.prototype.setPosition = function(position){
        currentLocation._id = 'loc_'+Super.getDate().mil;
        currentLocation.lat = position.coords.latitude;
        currentLocation.lon = position.coords.longitude;
        currentLocation.alt = position.coords.altitude;
        currentLocation.acc = position.coords.accuracy;
        currentLocation.hea = position.coords.heading;
        currentLocation.spe = position.coords.speed;
        currentLocation.ts = position.coords.timestamp;
        status = true;
    };
    Location.prototype.get = function(){
        return currentLocation;
    };
    Location.prototype.getCurrent = function() {
        return this;
    };
    Location.prototype.getNewPosition = function() {
        return $cordovaGeolocation
            .getCurrentPosition(currentPosOptions);
    };
    return Location;
});
