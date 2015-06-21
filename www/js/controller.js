angular.module('controller',['ngCordova','services','app','Super'])
.controller('SplashController',function($ionicPlatform,
                                         $rootScope,
                                         $scope,
                                         $timeout,
                                         $cordovaGeolocation,
                                         $cordovaDevice,
                                         $cordovaBackgroundGeolocation,
                                         Equipo,
                                         App,
                                        Super){
    $scope.posicion = {
        lat: '',
        lon: '',
        fecha: '',
        bateria:'',
        mac: ''
    };
    var watch;
    this.capturando = false;
    this.butonText = 'Iniciar Captura';
    this.freq = 30000;
    this.accion = 'Capturando...';
    this.mac = '';

    this.capturar = function(){
        if (this.capturando) {
            this.butonText = 'Iniciar Captura';
            this.capturando = false;
            //watch.clearWatch();
            $cordovaBackgroundGeolocation.stop();
        } else {
            this.butonText = 'Detener Captura';
            this.capturando = true;

            var watchOptions = {
                frequency : this.freq,
                timeout : 3000,
                enableHighAccuracy : false
            };
            var posOptions = {
                timeout: 3000,
                enableHighAccuracy : false
            };
            var backOptions = {
                url: 'http://localhost',
                notificationTitle: 'SuperGPS tracking',
                notificationText: 'Activo',
                debug: true,
                stopOnTerminate: true
            }

            $cordovaBackgroundGeolocation.configure(backOptions)
            .then(
                null,
                function (err){ console.log(err)},
                function (location){
                    console.log('Posición capturada!');
                    $scope.posicion.lat = Equipo.setLat(position.location.latitude);
                    $scope.posicion.lon = Equipo.setLon(position.location.longitude);
                    $scope.posicion.pres = Equipo.setPres(position.location.accuracy);
                    $scope.posicion.fecha = Equipo.getFecha();
                    $scope.posicion.bateria = Equipo.getBateria();
                    $scope.posicion.mac = Equipo.getMac();
                    console.log('la bateria es: '+Equipo.getBateria());
                    Equipo.save();
                }
            );

        }
    };

    $ionicPlatform.ready(function(){
        Equipo.initData();
        var platform = ionic.Platform.platform();
        if (platform  ==="win32" || platform ==="win64" || platform ==="macintel" ){
            Equipo.setMac('01010101010');
        } else {
            window.MacAddress.getMacAddress(
            function(macAddress) {
                Equipo.setMac(macAddress);
            },function(fail) {
                Equipo.setMac($cordovaDevice.getUUID());
            });
        };

        $scope.onBatteryStatus = function(result) {
            //data.init();
            //data.replicate();
            $scope.posicion.mac = Equipo.getMac();
            console.log('El nivel es: ' + result.level);
            console.log('El id es: '+Equipo.getMac());
            Equipo.setBateria(result.level);
            $scope.posicion.bateria = result.level;
            Equipo.replicate(this.mac);
        }

        if (!$rootScope.batteryEvtAttached) {
        // prevent from registering multiple times
        // Ideally needs to be added in .run()
        // This is for the sake of example

        window.addEventListener('batterystatus', $scope.onBatteryStatus, false);
             $rootScope.batteryEvtAttached = true;
         }
        }
    );
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
})
.controller('MainController',function($scope,
                                       $cordovaDialogs,
                                       App,
                                       papers){
    $scope.papers = papers;
    $scope.numColumns = 4;
    $scope.rows = [];
    $scope.cols = [];
    $scope.rows.length = Math.ceil($scope.papers.length / $scope.numColumns);
    $scope.cols.length = $scope.numColumns;
    $scope.click = function(id){
        App.saveClick(id);
        $cordovaDialogs.beep();
    };
    $scope.salir = function(){
        App.salir();
    };

    $scope.$on('db:uptodate',function(event,args){
        App.setSyncStatus('Ok:');
        $scope.syncStatus = App.getSyncStatus(args.msg);
        $scope.$apply();
    });
})
