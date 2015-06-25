/**
 * Created by vpease on 20/12/2014.
 */
angular.module('db',['Params'])
.factory('DB',function($q,
                       $timeout,
                       Params,
                       $rootScope) {
        var self = this;
        var dbl,init;
        var db;
        var syncparam;
        //self.remoteserver = 'http://andentleationsteathediti:OEpyUVQK75oJdQV3MmlrxpPl@supercomics.supermio.com/supercomics';
     var remoteserver = 'http://control:supermio@couchdb-00fafc66-1.vpease.cont.tutum.io:49154/supercomics';
        self.init = function(pRemote,pDbl,pSyncparam,pInit) {
            remoteserver = pRemote;
            dbl = pDbl;
            init = pInit;
            syncparam = pSyncparam;

            if (!db) {
                console.log('database is closed');
                db = new window.PouchDB(dbl,{
                    adapter: 'websql',
                    size: 50,
                    auto_compaction:true});
                if (!db.adapter){
                    db  = new window.PouchDB(dbl,{
                        size: 50,
                        auto_compation: true
                    });
                    console.log('Usando: ' + db.adapter);
                } else {
                    console.log('Usando websql');
                }

                db.compact({},function(){
                    console.log('db compactada');
                    if (init){
                        self.initial();
                    }
                });
                //console.log('ya se grabó');
            }
        };
        self.initial = function(){
            window.localStorage['cargando']="false";
            window.localStorage['cont']=0;
            var datos = window.localStorage['datos']|'0';
            console.log('verificando si hay datos cargados:'+datos);
            if (datos=='0'){
                console.log('Entrando a la carga de data.txt');
                var dumpFiles = ['data01.txt','data02.txt','data03.txt','data04.txt','data05.txt','data06.txt','data07.txt','data08.txt','data09.txt','data10.txt','data11.txt','data12.txt','data13.txt','data14.txt','data15.txt','data16.txt','data17.txt','data18.txt','data19.txt','data20.txt','data21.txt','data22.txt'];
                var series = PouchDB.utils.Promise.resolve();
                var cont = 0;
                dumpFiles.forEach(function (dumpFile) {
                    console.log('Cargando archivo: '+dumpFile);
                    db.load('data/' + dumpFile)
                        .then(function(){
                            cont+=1;
                            window.localStorage['cont']=cont;
                            console.log('archivo ok: '+dumpFile + ' contador: '+window.localStorage['cont']);
                            if (window.localStorage['cont'] == dumpFiles.length) {
                                console.log('archivo final');
                                window.localStorage['datos']='1';
                                $rootScope.$broadcast('dbinit:uptodate');
                            }
                        })
                        .catch(function(err){
                            console.log('Error al cargar: '+dumpFile+ ' '+JSON.stringify(err));
                        })
                });
            } else {
                if (window.localStorage['cargando']!=="true") {
                    console.log('La carga no fue necesaria');
                    $rootScope.$broadcast('dbinit:uptodate');
                }
            }
        };
        self.replicate = function(forced){
            console.log('db.js empezar a replicar con :'+remoteserver);
            if (forced || Params.getDbInserts()>0){
                var sync = db.sync(
                    remoteserver,
                    {live:false,
                        retry:true,
                        filter:'supershopper/filtro',
                        query_params:{'key':'"'+syncparam+'"'}
                    })
                    .on('paused',function(info){
                        console.log('Estoy en el estado paused');
                        //$rootScope.$broadcast('db:uptodate');
                    })
                    .on('change',function(info){
                        console.log('Cambios en la base de datos'+JSON.stringify(info));
                    }).on('complete',function(info){
                        var timeOut = Params.getDbTimeOut();
                        console.log('Sync data complete.Regreso en : '+timeOut);
                        $rootScope.$broadcast('db:uptodate',{msg:'Sync Ok'});
                        $timeout(function(){
                            console.log('sync nuevamente');
                            self.replicate();
                        },timeOut);
                    }).on('uptodate',function(info){
                        console.log('Actualizado datos'+JSON.stringify(info));
                        //$rootScope.$broadcast('db:uptodate');
                    }).on('error',function(err){
                        console.log('Error en sync datos: '+JSON.stringify(err));
                    })
            } else {
                var timeOut = Params.getDbTimeOut();
                console.log('Nada que sincronizar. Regreso en: '+timeOut);
                $rootScope.$broadcast('db:uptodate',{msg:'Sync Not Needed'});
                $timeout(function(){
                    console.log('sync nuevamente');
                    self.replicate();
                },timeOut);
            }
        };
        self.getView = function(view,options){
            return db.query(view,options);
        };
        self.getAll = function(query){
          return db.allDocs(query);
        };
        self.remove = function (key){
          db.remove(key,function(err,response){
              if (err){
                  console.log(err);
              } else {
                  console.log(response);
              }
          });
        };
        self.get = function(key){
            return db.get(key);
        };
        self.getWithAttach = function(key){
            return db.get(key,{attachments:true});
        };
        self.getAttach = function(key,attach){
            return db.getAttachment(key,attach);
        };
        self.put = function(object){
            if (!db){
                self.init();
            }
            db.get(object._id,function(err,doc){
                if (!err){
                    if (doc){
                        object._rev = doc._rev;
                        doc = object;
                        db.put(doc).then(function(response){
                            console.log('Update Ok');
                        }).catch(function(error){
                            console.log('Error en Update:'+error.toString());
                        });
                    } else {
                        db.put(object).then(function(response){
                            console.log('Insert Ok');
                        }).catch(function(error){
                            console.log('Error al insertar: '+error.toString());
                        });
                    }
                } else {
                    if (err.status==404){
                        db.put(object).then(function(response){
                            console.log('Insert Ok');
                        }).catch(function(error){
                            console.log('Error al insertar: '+error.toString());
                        });
                    } else {
                        console.log("Error: "+err);
                    }
                }
            });
        };
        self.bulk = function(objects){
            if (!db){
                self.init();
            }
            db.bulkDocs(objects,{new_edits:true},function(err,response){
                if (!err){
                    console.log('Todo ok con el bulk: '+response.toString());
                } else {
                    console.log('Error:'+ err.toString());
                }
            });
        };
    return self;
});
