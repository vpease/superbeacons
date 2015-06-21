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
    var papers =[
        {_id: '1', tipo:'paper',avatar:'elcomercio.png',nombre: 'El Comercio'},
        {_id: '2', tipo:'paper',avatar:'peru21.png',nombre: 'Perú 21'},
        {_id: '3', tipo:'paper',avatar:'gestion.png',nombre: 'Gestion'},
        {_id: '4', tipo:'paper',avatar:'depor.png',nombre: 'Depor'},
        {_id: '5', tipo:'paper',avatar:'trome.png',nombre: 'Trome'},
        {_id: '6', tipo:'paper',avatar:'larepublica.png',nombre: 'La República'},
        {_id: '7', tipo:'paper',avatar:'larazon.png',nombre: 'La Razón'},
        {_id: '8', tipo:'paper',avatar:'expreso.png',nombre: 'Expreso'},
        {_id: '9', tipo:'paper',avatar:'exitosa.png',nombre: 'Exitosa'},
        {_id: '10', tipo:'paper',avatar:'ojo.png',nombre: 'Ojo'},
        {_id: '11', tipo:'paper',avatar:'elmen.png',nombre: 'El Men'},
        {_id: '12', tipo:'paper',avatar:'elperuano.png',nombre: 'El Peruano'},
        {_id: '13', tipo:'paper',avatar:'elpopular.png',nombre: 'El Popular'},
        {_id: '14', tipo:'paper',avatar:'laprimera.png',nombre: 'La Primera'},
        {_id: '15', tipo:'paper',avatar:'diario16.png',nombre: 'Diario 16'},
        {_id: '16', tipo:'paper',avatar:'elbocon.png',nombre: 'El Bocon'},
        {_id: '17', tipo:'paper',avatar:'todosport.png',nombre: 'Todo Sport'},
        {_id: '18', tipo:'paper',avatar:'libero.png',nombre: 'Libero'},
        {_id: '19', tipo:'paper',avatar:'delpais.png',nombre: 'Del País'},
        {_id: '20', tipo:'paper',avatar:'correo.png',nombre: 'Correo'},
        {_id: '21', tipo:'paper',avatar:'elchino.png',nombre: 'El Chino'}
    ];
    return {
        init: function(){
            DB.init();
        },
        replicate: function() {
            DB.replicate();
        },
        put: function(object){
            DB.put(object);
        },
        getPapers: function(){
            var dfd = $q.defer();
            dfd.resolve(papers);
            return dfd.promise;
        }
    };
})
