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
        setLat : function(plat) {
            equipo.lat = plat;
            return plat;
        },
        setLon : function(plon) {
            equipo.lon = plon;
            return plon;
        },
        setPres : function(pPres) {
            equipo.pres = pPres;
            return pPres;
        },
        setBateria : function(status) {
            equipo.bateria = status;
        },
        setMac : function(uuid) {
            equipo.mac = uuid;
        },
        getBateria : function(){
            return equipo.bateria;
        },
        getMac : function() {
            return equipo.mac;
        },
        getFecha : function() {
            currentdate = new Date();
            var dia = currentdate.getDate();
            var mes = currentdate.getMonth()+1;
            var anio = currentdate.getFullYear();
            var hora = currentdate.getHours();
            var min = currentdate.getMinutes();
            var seg = currentdate.getSeconds();
            if (dia < 10) dia = '0'+ dia;
            if (mes < 10) mes = '0'+ mes;
            if (hora < 10) hora = '0'+ hora;
            if (min < 10) min = '0'+ min;
            if (seg < 10) seg = '0'+ seg;
            equipo.fecha =  anio + "-"
                + mes + "-"
                + dia + " "
                + hora + ":"
                + min + ":"
                + seg;
            equipo._id = equipo.mac+equipo.fecha;
            return equipo.fecha;
        },
        getObj : function() {
            return equipo;
        },
        save : function() {
            data.put(equipo);
        },
        initData : function() {
            data.init();
        },
        replicate : function() {
            data.replicate();
        }
    }
})
.factory('data',function($q,DB){
    return {
        init: function(){
            DB.init();
        },
        replicate: function() {
            DB.replicate();
        },
        put: function(object){
            DB.put(object);
        }
    };
})
