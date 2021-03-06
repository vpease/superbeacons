angular.module('shopper', ['ionic','controller','ngCordova','beacons','posicion','app'])
.run(function($ionicPlatform,App) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    App.initApp();
  });
})
.filter('getById',function(){
      return function(input,id){
        var i= 0,len=input.length;
        for(;i<len;i++){
          if(input[i].id== id){
            return {index:i,item:input[i]};
          }
        }
        return null;
      }
    })

.run(function($rootScope,$state,$location,$ionicModal,$cordovaDialogs,$cordovaBatteryStatus,App){
    $rootScope.$on('App:Exit',function(){
        $location.url("/");
    });

    $rootScope.$on('Region:Inside',function(event,args){
        App.stopMonitoring();
        $state.go("mall",{mall:args.uuid});
        console.log('X:Region:Inside detected');
    });
    $rootScope.$on('Region:Outside',function(event,args){
        //$state.go("menu",{mall:args.uuid});
        console.log('X:Region:Outside detected event:'+event +' args:'+JSON.stringify(args));
    });
    $rootScope.$on('Beacon:Detected',function(event,args){
        console.log('X1: args:'+JSON.stringify(args));
        App.stopRanging(207);
        $ionicModal.fromTemplateUrl('modal.html', function($ionicModal) {
            $rootScope.modal = $ionicModal;
        }, {
            scope: $rootScope,
            animation: 'slide-in-up'
        });
        $rootScope.closeModal = function() {
            $rootScope.modal.hide();
        };
        $rootScope.$on('modal.hidden', function() {
            App.startRanging(207);
        });
        App.getBanner(args.beacon.id)
            .then(function(result){
                banner = result.rows[0];
                console.log('X1: '+JSON.stringify(result));
                $rootScope.texto = banner.doc.texto;
                App.getAttach(banner.value._id,Object.keys(banner.doc._attachments)[0])
                    .then(function(result){
                        $rootScope.banner = result;
                        $rootScope.modal.show();
                    });
            },function(error){
                console.log('problemas con el banner');
            });
    });

    $rootScope.$on('Location:Ok',function(event,args){
        console.log('Location: Ok');
        App.getPosition(args.pos);
        App.setLocOk(true);
        console.log('Posici�n Ok sin problemas');
        if (App.getInitStatus(true)){
            if (App.Authenticated())
                $location.url("/login/Bienvenido");
        }
      });

    $rootScope.$on('Location:Ko',function(event,args){
        console.log('Location: Ko');
        App.retryLocation();
        if (args.retries===0){
          console.log('Posici�n Ko con problemas');
          $location.url("/login/Bienvenido");
        }
      });

    $rootScope.$on('auth:ok',function(event,args){
        App.setAuthOk(true);
        App.replicate(args.user);
        console.log('Auth ok: '+args.message);
        if (App.getInitStatus(true)) {
            App.setBoot();
            $location.url("/menu/");
        }
      });

    $rootScope.$on('auth:ko',function(event,args){
        console.log('Auth ko: '+args.message);
        $location.url("/login/"+args.message);
      });
    $rootScope.$on('$cordovaBatteryStatus:status', function (result) {
        App.setBateria(result.level);
    });
    $rootScope.$on('$cordovaBatteryStatus:critical', function (result) {
        App.setBateria(result.level);
    });
    $rootScope.$on('$cordovaBatteryStatus:low', function (result) {
        App.setBateria(result.level);
    });

    $rootScope.$on('db:init',function(event,args){
      });

    $rootScope.$on('db:uptodate',function(event,args){
        console.log('Base de datos Ok: event:'+JSON.stringify(event)+' args:'+JSON.stringify(args));
        App.setDataOk(true);
        if (App.getInitStatus(true)){
            App.setBoot();
            $location.url("/menu/");
        }
      });
    })
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
      .state('splash', {
          url: "/",
          views: {
              "home":{
                  templateUrl: "templates/splash.html",
                  controller: "SplashController as splash"
              }
          },
          onEnter:function(){
              console.log('Estoy entrando al estado splash');
          },
          onExit:function(){
              console.log('Estoy saliendo al estado splash');
          }
      })
      .state('login',{
          url:"/login/:msg",
          views: {
              "home":{
                  templateUrl: "templates/login.html",
                  controller: "LoginController as login"
              }
          },
          resolve: {
              msg: function($stateParams){
                  return $stateParams.msg;
              }
          },
          onEnter:function(){
              console.log('Estoy entrando al estado login');
          },
          onExit:function(){
              console.log('Estoy saliendo al estado login');
            }
      })
      .state('menu',{
          url:"/menu/",
          views: {
              "home":{
                  templateUrl: "templates/main.html",
                  controller: "MainController as main"
              }
          },
          resolve: {
              mall: function(App){
                  return App.getMall();
              }
          },
          onEnter:function(){
              console.log('X:Estoy entrando al estado menu');
          },
          onExit:function(){
              console.log('X:Estoy saliendo al estado menu');
          }
      })
      .state('mall',{
          url:"/mall/:mallId",
          views: {
              "home":{
                  templateUrl: "templates/mall.html",
                  controller: "MallController as mall"
              }
          },
          resolve:{
              mallId:function($stateParams){
                  return $stateParams.mallId;
              }
          },
          onEnter:function(){
              console.log('X:Estoy entrando al estado mall');
          },
          onExit:function(){
              console.log('X:Estoy saliendo al estado mall');
          }
      });
      $urlRouterProvider.otherwise('/');
    });
