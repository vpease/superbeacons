angular.module('controller',['ngCordova','services','app','Super'])
    .controller('SplashController',function($ionicPlatform,
                                         $rootScope,
                                         $scope){

    /*$ionicPlatform.ready(function(){
        $scope.onBatteryStatus = function(result) {
            //data.init();
            //data.replicate();
            //$scope.posicion.mac = Equipo.getMac();
            //console.log('El nivel es: ' + result.level);
            //console.log('El id es: '+Equipo.getMac());
            //Equipo.setBateria(result.level);
            //$scope.posicion.bateria = result.level;
            //Equipo.replicate(this.mac);
        };

        if (!$rootScope.batteryEvtAttached) {
        // prevent from registering multiple times
        // Ideally needs to be added in .run()
        // This is for the sake of example

        window.addEventListener('batterystatus', $scope.onBatteryStatus, false);
             $rootScope.batteryEvtAttached = true;
         }
        }
    );*/
})
.controller('LoginController',function($ionicHistory,$scope,App,msg){
    this.msg = msg;
    this.user= '';
    this.pass= '';
    $ionicHistory.clearHistory();
    this.login = function(){
        App.authenticate(this.user,this.pass);
        this.pass='';
    };
        $scope.salir = function(){
            ionic.Platform.exitApp()
        };
})
.controller('MainController',function($scope,
                                      $cordovaDialogs,
                                      $state,
                                      App,
                                      mall){
    $scope.mall = mall.rows;
    if ($scope.mall.length>0){
        App.startBeacon($scope.mall[0].doc.regions[0].region);
        App.startMonitoring();
        console.log('Monitoreo de Beacons iniciado');
    }
    $scope.Session = App.get();
    $scope.entrarMall = function(){
        $state.go('mall',{mall:$scope.mall[0].doc.regions[0].region});
    };
    $scope.salir = function(){
        ionic.Platform.exitApp()
    };
    $scope.$on('db:uptodate',function(event,args){
        App.setSyncStatus('Ok:');
        $scope.syncStatus = App.getSyncStatus(args.msg);
        $scope.$apply();
    });
})
.controller('MallController',function($scope,App,mallId){
        $scope.mall = mallId;
        App.startRanging(207);
        $scope.salir = function(){
            ionic.Platform.exitApp()
        };
    });
