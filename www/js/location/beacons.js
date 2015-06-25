angular.module('beacons',['posicion'])
.factory('Beacon',function($rootScope,Posicion){
    var pos;
    var delegate;
    var mall = {
        uuid:'',
        identifier: 'SuperMall',
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
    var mallRegion;
    var storeRegion;
    function getMonitoredRegions(pRegion){
        cordova.plugins.locationManager.getMonitoredRegions()
        .then(function(monitoredRegions){
            monRegions = monitoredRegions;
            $rootScope.$broadcast('Beacons:MonitorOn',{regs:monRegions});
        })
    }
    function getMallRegion(){
        console.log('beacons.js: mall es:'+JSON.stringify(mall));
        mallRegion = cordova.plugins.locationManager.Regions.fromJson(mall);
    }
    function getStoreRegion(major){
        tienda.uuid = uuid;
        tienda.major= major;
        storeRegion=cordova.plugins.locationManager.Regions.fromJson(tienda);
    }
    var Beacon = function(pUUID){
        pos = new Posicion();
        var temp = pUUID.indexOf('region_');
        if (temp>=0)
        uuid = pUUID.substring(7);
        mall.uuid=uuid;
        tienda.uuid=uuid;
        delegate = new cordova.plugins.locationManager.Delegate();
        delegate.didStartMonitoringForRegion = function(pluginResult){
            getMonitoredRegions();
            $rootScope.$broadcast('Region:MonitorStarted',{result:pluginResult});
        };
        delegate.didRangeBeaconsInRegion = function(pluginResult){
            pluginResult.id= new Date().getTime();
            pos.setBeacons(pluginResult.beacons);
            $rootScope.$broadcast('Beacons:Ranged',{beacons:pluginResult.beacons})
        };
        delegate.didDetermineStateForRegion = function(pluginResult){
            switch(pluginResult.state){
                case "CLRegionStateInside":
                    $rootScope.$broadcast('Region:Inside',{region:pluginResult.region});
                    break;
                case "CLRegionStateOutside":
                    $rootScope.$broadcast('Region:Outside',{region:pluginResult.region});
                    break;
            }
        };
        cordova.plugins.locationManager.requestAlwaysAuthorization();
        cordova.plugins.locationManager.setDelegate(delegate);
        console.log('beacon.js: Beacon iniciado')
    };
    Beacon.prototype.startMonitoring = function(){
        getMallRegion();
        cordova.plugins.locationManager.startMonitoringForRegion(mallRegion)
        .fail(function(error){
            console.log('Error al iniciar el monitoreo:'+error);
        })
        .done(function(){
            console.log('Ok al iniciar el monitoreo');
        });
    };
    Beacon.prototype.stopMonitoring = function(){
        cordova.plugins.locationManager.stopMonitoringForRegion(mallRegion)
        .fail(function(error){
            console.log('Error al terminar el monitoreo:'+error);
        })
        .done(function(){
            console.log('Ok al terminar el monitoreo');
        });
    };
    Beacon.prototype.startRanging = function(major){
        pos.start();
        getStoreRegion(major);
        cordova.plugins.locationManager.startRangingBeaconsInRegion(storeRegion)
        .fail(function(error){
            console.log('Error al iniciar Ranging: '+error);
        })
        .done();
    };
    Beacon.prototype.stopRanging = function(){
        pos.stop();
        cordova.plugins.locationManager.stopRangingBeaconsInRegion(storeRegion)
        .fail(function(error){
            console.log('Error al terminar el ranging: '+error);
        })
        .done();
    };
        return Beacon;
});
