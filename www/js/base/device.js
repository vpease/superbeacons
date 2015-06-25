angular.module('device',['ngCordova','ionic','Super'])
.factory('Device',function($cordovaDevice,
                           $ionicPlatform,
                           Super){
    var currentDevice = {
        _id : '',
        cordova : '',
        model : '',
        platform : '',
        uuid : '',
        mac: '',
        version : '',
        battery:'',
        type : 'device'
    };
    function getInfo() {
        var platform = ionic.Platform.platform();
        if (platform ==="win32" || platform ==="win64" || platform ==="macintel"){
            currentDevice.cordova = '4';
            currentDevice.model = 'PC';
            currentDevice.platform = 'Win32';
            currentDevice.uuid = '010101010101';
            currentDevice.mac = '010101010101';
            currentDevice.version = 'Win10';
            currentDevice.type = 'computer';
        } else {
            currentDevice.cordova = $cordovaDevice.getCordova();
            currentDevice.model = $cordovaDevice.getModel();
            currentDevice.platform = $cordovaDevice.getPlatform();
            currentDevice.uuid = $cordovaDevice.getUUID();
            currentDevice.version = $cordovaDevice.getVersion();
            currentDevice.type ='mobile';
            window.MacAddress.getMacAddress(
                function(macAddress){
                    currentDevice.mac = macAddress;
                }, function(fail){
                    console.log('device.js: error: '+fail);
                    currentDevice.mac = $cordovaDevice.getUUID();
                }
            );
        }
    }
    var Device = function(){
        getInfo();
        currentDevice._id = "dev_"+currentDevice.model+"_"+currentDevice.platform+"_"+Super.getDate().mil;
    };
    Device.prototype.isMobile = function(){
        console.log('El type es : '+currentDevice.type)
        return (currentDevice.type=="mobile");
    };
    Device.prototype.getId=function(){
        return currentDevice._id;
    };
    Device.prototype.get = function(){
        return currentDevice;
    };
    Device.prototype.setBateria = function(status) {
        currentDevice.battery = status;
    };
    Device.prototype.export = function(){
        return currentDevice;
    };
    return Device;
});
