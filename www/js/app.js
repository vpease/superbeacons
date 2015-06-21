// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('shopper', ['ionic','controller','app'])
.run(function($ionicPlatform,App) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    };
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

.config(function($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('splash', {
            url: "/",
            views: {
              "home":{
                templateUrl: "templates/splash.html",
                controller: "SplashController as splash"
              }
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
            }
          })
          .state('main',{
            url:"/menu/",
            views: {
              "home":{
                templateUrl: "templates/main.html",
                controller: "MainController as main"
              }
            },
            resolve:{
              papers: function(data){
                res = data.getPapers();
                return res;
              }
            }
          })
      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/');
    });