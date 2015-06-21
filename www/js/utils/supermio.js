/**
 * Created by vpease on 26/03/15.
 */
angular.module('Super',[])

/* Detectar si es movil o desktop */
.factory ('Super',function(){
    self.mobile='';

    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i)|| false;
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i)|| false;
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i)|| false;
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i)|| false;
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i)|| false;
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
    function completar(cadena,long){
        cadena = cadena.toString();
        if (cadena.length < long){
            cadena = "0"+cadena;
        };
        return cadena;
    };
    return {
        set: function(){
            self.mobile = isMobile.any();
            console.log ('Es mobile: '+isMobile.any());
        },
        getMobile: function() {
            return self.mobile;
        },
        getDate : function() {
            var temp = new Date();
            var res1,res2,res3 ;
            var dia = completar(temp.getDate(),2);
            var mes = completar(temp.getMonth()+1,2);
            var anio = completar(temp.getFullYear(),2);
            var hora = completar(temp.getHours(),2);
            var min = completar(temp.getMinutes(),2);
            var seg = completar(temp.getSeconds(),2);
            var mil = completar(temp.getMilliseconds(),2);

            res1 = anio + "-"+mes+"-"+dia + " "+hora+":"+min +":"+seg + '.'+mil;
            res2 = temp.getTime();
            res3 = anio.toString() + mes.toString() + dia.toString() + hora.toString() + min.toString() + seg.toString()+mil.toString();

            return {'long':res1,'mil':res2,'strech':res3};
        }
    }
})
.factory('Base64', function () {
    /* jshint ignore:start */

    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };

    /* jshint ignore:end */
});

