angular.module('posicion', [])
.factory('Posicion',function($filter,$rootScope){
    var status = true;
    var tope = 5;
    var beacons =[];

    function addBeacon(pBeacon){
        var beacon = {
            id: '',
            major:'',
            minor:'',
            uuid:'',
            rssi:0,
            accuracy:0,
            cont:0
        };
        beacon.id = pBeacon.id;
        beacon.major=pBeacon.major;
        beacon.minor=pBeacon.minor;
        beacon.uuid=pBeacon.uuid;
        beacon.rssi=pBeacon.rssi;
        beacon.accuracy=pBeacon.accuracy;
        beacon.cont = 0;
        beacons.push(beacon);
    }
    function updateBeacon(pBeacon,item,index){
        var beacon = {
            id: '',
            major:'',
            minor:'',
            uuid:'',
            rssi:0,
            accuracy:0,
            cont:0
        };
        /*beacon.id = pBeacon.id; beacon.major= pBeacon.major;beacon.minor= pBeacon.minor; beacon.uuid= pBeacon.uuid; beacon.rssi= pBeacon.rssi;*/
        if (pBeacon.accuracy>0) item.accuracy = item.accuracy + pBeacon.accuracy;
        item.cont = item.cont+1;
        beacons.splice(index,1);
        beacons.push(item);
        return detectTope(item);
    }
    function compare(a,b){
        return a.accuracy - b.accuracy;
    }
    function detectTope(pBeacon){
        if (pBeacon.cont > tope){
            beacons.sort(function(a, b){return a.accuracy-b.accuracy});
            item = beacons[0];
            resetBeacons();
            status = false;
            $rootScope.$broadcast('Beacon:Detected',{beacon:item});
            return true;
        } else {
            return false;
        }
    }
    function setBeacon(pBeacon){
        console.log('Exit Point 0: ingresando: '+JSON.stringify(pBeacon));
        console.log('Exit Point 0: ingresando Beacons: '+JSON.stringify(beacons));
        if (beacons.length>0){
            console.log('Exit Point 0: buscando: '+pBeacon.id+'//'+JSON.stringify(pBeacon));
            var found = $filter('getById')(beacons,pBeacon.id);
            if (found){
                //beacon = found.item;
                console.log('Exit Point 0: encontrado '+ JSON.stringify(beacons));
                updateBeacon(pBeacon,found.item,found.index);
            } else {
                console.log('Exit Point 0: not found beacons: '+JSON.stringify(beacons));
                console.log('Exit Point 0: not found beacon: '+JSON.stringify(pBeacon));
                addBeacon(pBeacon);
            }
        } else{
            console.log('Exit Point 0: not found 0 beacons: '+JSON.stringify(beacons));
            console.log('Exit Point 0: not found 0 beacon: '+JSON.stringify(pBeacon));
            addBeacon(pBeacon);
        }
    }
    function resetBeacons(){
        beacons=[];
    }
    var Posicion = function(){
    };
    Posicion.prototype.start = function(){
        status = true;
    };
    Posicion.prototype.stop = function(){
        status = false;
    };
    Posicion.prototype.setBeacons = function(pBeacons){
        console.log('Exit Point 0: '+JSON.stringify(pBeacons));
        console.log('Exit Point 0 original: '+JSON.stringify(beacons));
        if (status){
            angular.forEach(pBeacons,function(value,key){
                console.log('Exit Point 0: index: '+key+' '+JSON.stringify(value));
                value.id=value.uuid+value.major+value.minor;
                setBeacon(value);
                console.log('Exit Point 0: Beacons: '+beacons.length+':: ' + +key+' '+JSON.stringify(beacons));
            });
        } else {
            resetBeacons();
        }
    };
    return Posicion;
});
