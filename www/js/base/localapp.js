angular.module('app',['session','db','Super'])
.factory('App',function($state,Session,data,DB,Super){
    var currentApp = {
        _id : '',
        name : '',
        author : '',
        company : '',
        type : 'app',
        syncStatus:''
    };
    var currentSession;

    var log = {
        _id : '',
        app : '',
        session : '',
    };
    return {
        initApp : function(){
            currentApp.name = 'SuperGPS';
            currentApp.author = 'VMPS';
            currentApp.company = 'Supermio';
            currentApp._id = 'SuperGPS'
            currentSession = new Session();
            DB.init();
        },
        authenticate : function(user,pass){
            if (currentSession.setUsuario(user,pass,'test','supermio')){
                $state.go('main');
            } else {
                $state.go('login')
            };

        },
        replicate : function(user){
            console.log('Voy a replicar');
            DB.replicate(user);
        },
		retyLocation : function(){
            currentSession.retryLocation();
        },
        getPosition : function(location){
            currentSession.currentLocation = location;
        },
        saveClick : function(idPaper){
            var temp = currentSession.getVenta(idPaper);
            DB.put(temp);
        },
        setSyncStatus: function(message){
            currentApp.syncStatus = message + Super.getDate().long;
        },
        getSyncStatus: function(){
            return currentApp.syncStatus;
        },
        salir : function(){
            $state.go('splash');
            this.initApp();
        }
    };
});
