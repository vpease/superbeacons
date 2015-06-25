angular.module('services',['ngCordova','db'])
.factory('Equipo',function(data){
    var equipo = {
        _id : '',
        lat : '',
        lon : '',
        pres : '',
        mac : '00000000',
        bateria : 100,
        fecha : '',
        copiado : 0,
        panico : '',
        tipo : 'track'
    };
    return {

    }
});

