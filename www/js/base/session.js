angular.module('session',['user',
    'location',
    'device',
    'Params',
    'Super'])
.factory('Session',function($rootScope,
                            Params,
                            Device,
                            Location,
                            User,
                            Super){
    var _id;
    var currentUser;
    var currentLocation;
    var currentDevice;
    var created;
    var createdMil;
    var status;
    var retries;

    function getDevice(){
        return new Device();
    }
    function getLocation(retry) {
        retries = retry;
        var temp = new Location();
        //$rootScope.$broadcast('Location:Search');
        temp.getNewPosition().then(function(position){
            temp.setPosition(position);
            status = 'Valido';
            currentLocation = temp.getCurrent();
            console.log('La sesion ya tiene posicion: '+retry);
            $rootScope.$broadcast('Location:Ok', { pos:temp, retries:retry});
        }, function(err){
            console.log('Error en la posición: '+retry+' //'+JSON.stringify(err));
            $rootScope.$broadcast('Location:Ko',{pos:null,retries:retry});
        });
        return new Location().getCurrent();
    }
    var Session = function() {
        var fecha = Super.getDate();
        created = fecha.long;
        createdMil = fecha.mil;
        currentDevice = getDevice();
        currentLocation = getLocation(0);
        status ='Iniciado';
        _id = "session_"+fecha.mil +'_'+ currentDevice.uuid;
    };
    Session.prototype.get = function(){
        var session = {
            device:'',
            user:'',
            location:'',
            created:'',
            createdmil:'',
            status:'',
            retries:''
        };
        session.device = currentDevice.get();
        session.user = currentUser.get();
        session.location = currentLocation.get();
        session.created = created;
        session.createdMil = createdMil;
        session.status = status;
        session.retries = retries;
        return session;
    };
    Session.prototype.getDeviceId = function(){
        return currentDevice.getId();
    };
    Session.prototype.isMobile = function(){
        return currentDevice.isMobile();
    };
    Session.prototype.setUsuario = function (id,pass,name,group,company,authenticated) {
        var temp;
        if (authenticated){
            temp = new User(Params.getUrlAPI(),id,pass,name,group,company);
            currentUser = temp.authenticate();
        } else {
            temp = new User('',id,pass,name,group,company);
            temp.active = true;
            var authError = {
                error: 'Ok',
                message:'Usuario Ok',
                user: ''
            };
            temp.created = Super.getDate("mil");
            temp.active = true;
            currentUser = temp;
            $rootScope.$broadcast('auth:ok',authError);
        }
        return currentUser.active
    };
    Session.prototype.getUserName = function() {
        currentUser.getUserName();
    };
	Session.prototype.retryLocation = function(){
        retries += 1;
        currentLocation = getLocation(retries);
    };
    Session.prototype.setBateria = function(status){
        currentDevice.setBateria(status);
    };
    return Session;
});
