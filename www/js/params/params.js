angular.module('Params',['Super'])
.factory('params',function(Base64){
    var protAuth = 'http://';
    var protAPI = 'https://';
    var keyAPI='akedowermightfuldsolveri';
    var passAPI='klhcQg0JDiAcUhdMDaFOEjDu';
    var dbServer = 'superdemos.cloudant.com/supershopper';
    var urlAPI = 'supershopper.supermio.com/_all_docs';
    var dbName ='supershopper';
    var dbTimeOut = '30000';
    var dbInserts = 0;

    var posTimeOut = 3000;
    var posHighAcc = false;
    var posMaximumAge = 864000000;

    var posWatchFreq = 900000;



    return {
        getDbName: function(){
            return dbName;
        },
        getDbUrl: function(){
            return protAPI+keyAPI+':'+passAPI+'@'+dbServer;
        },
        getKeyAPI: function(){
            return keyAPI;
        },
        getPassAPI: function(){
            return passAPI;
        },
        getUrlAPI: function(auth){
            var res = protAuth+urlAPI+'?include_docs=true&key="'+auth.key+'"';
            console.log('Cadena de autenticación : '+res);
            return res;
        },
        getAuthData: function(){
            return Base64.encode(keyAPI+':'+passAPI);
        },
        getDbTimeOut: function(){
            return dbTimeOut;
        },
        getDbInserts: function(){
            return dbInserts;
        },
        putDbInserts: function(){
            dbInserts+=1;
        },
        resetDbInserts: function(){
            dbInserts=0;
        },
        getPosTimeOut: function(){
            return posTimeOut;
        },
        getPosHighAcc: function(){
            return posHighAcc;
        },
        getPosMaxAge: function(){
            return posMaximumAge;
        },
        getPosWatchFreq: function(){
            return posWatchFreq;
        },
    }
})
