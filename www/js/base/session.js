angular.module('session',['user','location','device','Super'])
.factory('Session',function($rootScope,
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

    var Session = function() {
        var self = this;
        var fecha = Super.getDate();
        created = fecha.long;
        createdMil = fecha.mil;
        currentDevice = getDevice();
        currentLocation = getLocation(0);
        status ='Iniciado';
        _id = "session_"+fecha.mil +'_'+ currentDevice.uuid;
    };
    Session.prototype.setUsuario = function (id,pass,name,group,company) {
        var temp = new User(id,pass,name,group,company);
        currentUser = temp.authenticate();
        if (currentUser.active) {
            return true;
        } else return false;
    };
    Session.prototype.getUserName = function() {
        currentUser.getUserName();
    };
    Session.prototype.getVenta = function(idPaper) {
        var venta = {
            _id :'',
            fecha : '',
            paperId: '',
            type: 'venta',
            loc: '',
            usuario:'',
            device:''
        };
        var fecha = Super.getDate();
        venta._id = "venta_" + currentUser.getUserName() +'_'+ fecha.strech;
        venta.fecha = fecha.long;
        venta.paperId = idPaper;
        venta.loc = currentLocation;
        venta.usuario = currentUser.getUserName();
        venta.device = currentDevice.export();
        return venta;
    };
	Session.prototype.retryLocation = function(){
        currentLocation = getLocation(1);
    };
    function getDevice(){
        var temp = new Device();
        return temp.getInfo();
    };
    function getLocation(retry) {
        var temp = new Location();
        $rootScope.$broadcast('Location:Search');
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
    };
    return Session;
})
