var CamaraUtils = (function() {
    "use strict";

    /*open a pop-up in order to show the event calendar information*/
    var _openEventCalendar = function (idEvent) {
       $.get( 'event.html', {
          'id': idEvent
       }, function( html ) {
          $.magnificPopup.open({
            items: {
              'src': html,
              'type': 'inline'
            }
          });
       });
    }


    var _toUTCISOFormat = function(date) {
         if(date) {
            return _.padStart(date.getUTCFullYear(), 4, '0') + "-" +
                   _.padStart(date.getUTCMonth() + 1, 2, '0')  + "-" +
                   _.padStart(date.getUTCDate(), 2, '0') + "T" +
                   _.padStart(date.getUTCHours(), 2, '0') + ":" +
                   _.padStart(date.getUTCMinutes(), 2, '0') + ":" +
                   _.padStart(date.getUTCSeconds(), 2, '0') + "." +
                   _.padStart(date.getUTCMilliseconds(), 3, '0') + "Z";

         } else {
            return "";
         }
    }

    var _camaraConfig = function(url) {
       var req = new XMLHttpRequest();
       req.open("GET", url + ".js", false); // 'false': synchronous.
       req.send(null);
       return eval("(function () { return " + req.responseText +  " })();");
    }

    var camUtils = {};
    camUtils.toUTCISOFormat = _toUTCISOFormat;
    camUtils.camaraConfig = _camaraConfig;
    camUtils.openEventCalendar = _openEventCalendar;
    return camUtils;
})();
