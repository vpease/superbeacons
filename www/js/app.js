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

.run(function($rootScope,$state,$location,$cordovaDialogs,$cordovaBatteryStatus,App){
    $rootScope.$on('App:Exit',function(){
        $location.url("/");
    });

    $rootScope.$on('Region:Inside',function(event,args){
        $state.go("mall",{mall:args.uuid});
        console.log('X:Region:Inside detected');
    });
    $rootScope.$on('Region:Outside',function(event,args){
        //$state.go("menu",{mall:args.uuid});
        console.log('X:Region:Outside detected event:'+event +' args:'+JSON.stringify(args));
    });
    $rootScope.$on('Beacon:Detected',function(event,args){
        App.stopRanging(207);
        $cordovaDialogs.confirm('Alerta Becon:'+JSON.stringify(args.beacon), 'SuperMall')
            .then(function(buttonIndex) {
                switch (buttonIndex){
                    case 1:
                        App.startRanging(207);
                        break;
                    case 2:
                        App.stopRanging(207);
                        break;
                }
            });
    });

    $rootScope.$on('Location:Ok',function(event,args){
        console.log('Location: Ok');
        App.getPosition(args.pos);
        App.setLocOk(true);
        console.log('Posición Ok sin problemas');
        if (App.getInitStatus(true)){
            if (App.Authenticated())
                $location.url("/login/Bienvenido");
        }
      });

    $rootScope.$on('Location:Ko',function(event,args){
        console.log('Location: Ko');
        App.retryLocation();
        if (args.retries===0){
          console.log('Posición Ko con problemas');
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
        console.log('Base de datos Ok: event:'+event+' args:'+JSON.stringify(args));
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
