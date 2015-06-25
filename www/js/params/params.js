angular.module('Params',['Super'])
.factory('Params',function(Base64){
    var AppName = "SuperBeacons";
    var AppAuthor = "VMPS";
    var AppCompany = "Supermio";
    var AppId = "SuperBeacons";
    var AppAuthenticated = false;

    var beaconNear = 3;
    var beaconTope = 3;
    var protAuth = 'http://';
    var protAPI = 'https://';
    var keyAPI='akedowermightfuldsolveri';
    var passAPI='klhcQg0JDiAcUhdMDaFOEjDu';
    var dbServer = 'superdemos.cloudant.com/supershopper';
    var urlAPI = 'supershopper.supermio.com/_all_docs';
    var dbName ='supershopper';
    var dbTimeOut = '600000';
    var dbInserts = 0;
    var dbInit = false;
    var dbSyncType =  1; //0: mobile2server 1:server2mobile

    var posTimeOut = 3000;
    var posHighAcc = false;
    var posMaximumAge = 864000000;

    var posWatchFreq = 900000;

    return {
        getAppName: function() {
            return AppName;
        },
        getAppAuthor: function(){
            return AppAuthor;
        },
        getAppCompany: function(){
            return AppCompany;
        },
        getAppId: function(){
            return AppId;
        },
        getAppAuthenticated: function(){
            return AppAuthenticated;
        },
        getBeaconNear: function(){
            return beaconNear;
        },
        getBeaconTope: function(){
            return beaconTope;
        },
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
        getUrlAPI: function(){
            var res = protAuth+urlAPI+'?include_docs=true&key="';
            return res;
        },
        getAuthData: function(){
            return Base64.encode(keyAPI+':'+passAPI);
        },
        getDbTimeOut: function(){
            return dbTimeOut;
        },
        getDbInit: function(){
            return dbInit;
        },
        getDbInserts: function(){
            var res;
            if (dbSyncType==0){
                res = dbInserts;
            } else {
                res = 1;
            }
            return res;
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
        }
    }
});
