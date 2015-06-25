angular.module('app',['session','data','Params','beacons','Super'])
.factory('App',function($q,
                        $state,
                        $rootScope,
                        Session,
                        Data,
                        Params,
                        Beacon,
                        Super){
    var currentApp = {
        _id : '',
        name : '',
        author : '',
        company : '',
        type : 'app',
        syncStatus:''
    };
    var currentSession;
    var data;
    var beacon;
    var locOk=false;
    var dataOk=false;
    var authOk = false;
    var bootstrap = false;

    return {
        initApp : function(){
            currentApp.name = Params.getAppName();
            currentApp.author = Params.getAppAuthor();
            currentApp.company = Params.getAppCompany();
            currentApp._id = Params.getAppId();
            currentSession = new Session();
            data = new Data(Params.getDbUrl(),Params.getDbName(),currentSession.getDeviceId(),Params.getDbInit());
            console.log('App initiated');
        },
        setLocOk: function(status){
            locOk = status;
        },
        setDataOk: function(status){
            dataOk = status;
        },
        setAuthOk: function(status){
            authOk = status;
        },
        getInitStatus: function(check){
            if (!check)
                return (authOk && dataOk);
            else
                return !bootstrap;
        },
        setBoot: function(){
            bootstrap = true;
        },
        startBeacon:function(pUUID){
            if (currentSession.isMobile()){
                console.log('Es un mobile');
                beacon = new Beacon(pUUID);
            }
        },
        startMonitoring: function(){
            if (currentSession.isMobile()){
                console.log('Es un mobile');
                beacon.startMonitoring();
            }
        },
        stopMonitoring: function(){
            if (currentSession.isMobile()){
                console.log('Es un mobile');
                beacon.stopMonitoring();
            }
        },
        startRanging: function(major){
            if (currentSession.isMobile()){
                console.log('Es un mobile');
                beacon.startRanging(major);
            }
        },
        stopRanging: function(major){
            if (currentSession.isMobile()){
                console.log('Es un mobile');
                beacon.stopRanging(major);
            }
        },
        get : function(){
            var json = {
                app: '',
                session: ''
            };
            json.app = currentApp;
            json.session = currentSession.get();
            return json;
        },
        Authenticated: function(){
            var res = Params.getAppAuthenticated();
            if (!res)
                currentSession.setUsuario(currentSession.getDeviceId(),'jdoe','test','supermio',false);
            return res;
        },
        authenticate : function(user,pass){
            currentSession.setUsuario(user,pass,'test','supermio',true);
        },
        replicate : function(){
            data.replicate();
        },
        retryLocation : function(){
            currentSession.retryLocation();
        },
        getPosition : function(location){
            currentSession.currentLocation = location;
        },
        setBateria : function(status){
            currentSession.setBateria(status);
        },
        setSyncStatus: function(message){
            currentApp.syncStatus = message + Super.getDate().long;
        },
        getSyncStatus: function(){
            return currentApp.syncStatus;
        },

        getDB: function(key){
            var dfd = $q.defer();
            data.get(key)
                .then(function(result){
                    dfd.resolve(result);
                },function(error){
                    console.log('localapp: error en get: '+error);
                });
            return dfd.promise;
        },
        getMall: function(){
            var dfd = $q.defer();
            data.getMall()
                .then(function(result){
                    dfd.resolve(result);
                },function(error){
                    console.log('localapp: error en get: '+error);
                });
            return dfd.promise;
        },
        salir : function(){
            this.initApp();
            $rootScope.$broadcast('App:Exit');
        }
    };
});
