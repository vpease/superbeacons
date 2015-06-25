/**
 * Created by control on 23/06/2015.
 */
angular.module('data',['db'])
.factory('Data',function($q,DB){
        var Remote,Dbl,syncParam,Init;
        var data = function(pRemote,pDbl,pSyncparam,pInit){
            Remote = pRemote;
            Dbl = pDbl;
            syncParam = pSyncparam;
            Init = pInit;
            DB.init(pRemote,pDbl,pSyncparam,pInit);
        };
        data.prototype.replicate = function(){
            DB.replicate();
        };
        data.prototype.getDB = function(){
            var dfd = $q.defer();
            DB.get(key)
                .then(function(result){
                    dfd.resolve(result);
                },function(error){
                    console.log('Error en get: '+error);
                });
            return dfd.promise;
        };
        data.prototype.getMall = function(){
            var dfd = $q.defer();
            DB.getAll({startkey:'mall_',endkey:'mall_\uffff',include_docs:true})
                .then(function(result){
                    console.log('Recuperando Malls');
                    dfd.resolve(result);
                },function(error){
                    console.log('Error en getMall: '+error);
                });
            return dfd.promise;
        };
        return data;
    });