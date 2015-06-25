angular.module('user',['Super','Params'])
.factory('User',function($http,
                          $rootScope,
                          Super) {
    var currentUser = {
        _id : '',
        user : '',
        name : '',
        group : '',
        company : '',
        created : '',
        hash : '',
        active : false,
        type : 'user'
    };
    var auth = {
        include_docs: true,
        key: ''
    };
    var request = {
        url:'',
        method: 'GET'
    };
    function configure(params){
        request.url = params.url;
    }
    var User = function(params, id, pass, name,group,company){
        currentUser._id = 'user_'+id;
        currentUser.user = id;
        currentUser.name = name;
        currentUser.group = group;
        currentUser.company = company;
        currentUser.created = '000000';
        currentUser.type = 'user';
        currentUser.hash = CryptoJS.RIPEMD160("app-"+pass);
        configure(params);
    };
    User.prototype.get = function(){
        return currentUser;
    };
    User.prototype.getUserName = function(){
        if (currentUser.active){
            return currentUser.user;
        } else {
            return '';
        }
    };
    User.prototype.authenticate = function() {
        var authError;
        auth.key= currentUser.user.toLowerCase();
        request.url = url+'"'+auth.key+'"';

        $http(request)
        .success(function(data){
            if (data.rows.length>0){
                var hash = CryptoJS.RIPEMD160('app-'+data.rows[0].doc.clave);
                if (currentUser.hash.toString() === hash.toString()){
                    authError = {
                        error: 'Ok',
                        message:'Usuario Ok',
                        user: currentUser.user
                    };
                    currentUser.created = Super.getDate("mil");
                    currentUser.active = true;
                    $rootScope.$broadcast('auth:ok',authError);
                } else {
                    authError = {
                        error:'Ko',
                        message:'Clave inválida',
                        user: ''
                    };
                    currentUser.active=false;
                    $rootScope.$broadcast('auth:ko',authError);
                }
            } else {
                authError = {
                    error:'Ko',
                    message:'Usuario no existe',
                    user:''
                };
                $rootScope.$broadcast('auth:ko',authError);
            }
        })
        .error(function(data,status,headers,config){
            console.log('Error en http: '+data + ' status: '+status+' headers:'+headers+' config:'+config);
        });
        return this;
    };
    return User;
});
