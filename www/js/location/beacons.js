angular.module('beacons',[])
.factory('beacons',function($rootScope){
    var delegate;
    var mall = {
        uuid:'',
        id: 'SuperMall',
        typeName: 'BeaconRegion'
    };
    var tienda ={
        uuid:'',
        identifier:'SuperTienda',
        major:'',
        typeName:'BeaconRegion'
    };
    var uuid;
    var monRegions;
    var beaconRegion;
    function getMonitoredRegions(pRegion){
        cordova.plugins.locationManager.getMonitoredRegions()
        .then(function(monitoredRegions){
            monRegions = monitoredRegions;
            $rootScope.$broadcast('Beacons:MonitorOn',{regs:monRegions});
        })
    };
    function getMallRegion(){
        mall.uuid = uuid;
        var beaconRegion = cordova.plugins.locationManager.Regions.fromJson(mall);
        return beaconRegion;
    };

    function getStoreRegion(major){
        tienda.uuid = uuid;
        tienda.major= major;
        var beaconRegion = cordova.plugins.locationManager.Regions.fromJson(tienda);
        return beaconRegion;
    };

    var beacon = function(pUUID){
        mall.uuid=pUUID;
        delegate = new cordova.plugins.locationManager.Delegate();
        delegate.didStartMonitoringForRegion = function(pluginResult){
            getMonitoredRegions();
            $rootScope.$broadcast('Region:MonitorStarted',{result:pluginResult});
        };
        delegate.didRangeBeaconsInRegion = function(pluginResult){
            pluginResult.id= new Date().getTime();
            $rootScope.$broadcast('Beacons:Ranged',{beacons:pluginResult.beacons})
        };
        delegate.didDetermineStateForRegion = function(pluginResult){
            switch(pluginResult.state){
                case "CLRegionStateInside":
                    major = pluginResult.
                    $rootScope.$broadcast('Region:Inside',{region:pluginResult.region});
                    break;
                case "CLRegionStateOutside":
                    $rootScope.$broadcast('Region:Outside',{region:pluginResult.region});
                    break;
            }
        };
        cordova.plugins.locationManager.requestAlwaysAuthorization();
        cordova.plugins.locationManager.setDelegate(delegate);
    };
    beacon.prototype.startMonitoring = function(){
        cordova.plugins.locationManager.startMonitoringForRegion(getMallRegion());
        .fail(function(error){
            console.log('Error al iniciar el monitoreo:'+error);
        })
        .done(function(){
            console.log('Ok al iniciar el monitoreo');
        });
    };
    beacon.prototype.stopMonitoring = function(){
        cordova.plugins.locationManager.stopMonitoringForRegion(beaconRegion)
        .fail(function(error){
            console.log('Error al terminar el monitoreo:'+error);
        })
        .done(function(){
            console.log('Ok al terminar el monitoreo');
        });
    };
    beacon.prototype.startRanging = function(major){
        cordova.plugins.locationManager.startRangingBeaconsInRegion(getStoreRegion(major))
        .fail(function(error){
            console.log('Error al iniciar Ranging: '+error);
        })
        .done();
    };
    beacon.prototype.stopRanging = function(beaconRegion){
        cordova.plugins.locationManager.stopRangingBeaconsInRegion(beaconRegion)
        .fail(function(error){
            console.log('Error al terminar el ranging: '+error);
        })
        .done();
    }
})
