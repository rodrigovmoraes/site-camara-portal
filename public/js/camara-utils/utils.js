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

    var _highlight = function(containers, keywords) {
       if (containers) {
          var highlighterOptions  = {
             "element": "span",
             "className": "generalSearchHighlight",
             "separateWordSearch": true,
             "diacritics": false,
             "filter": function (node, term, totalCounter, counter){
                          if (term && term.length <= 3) {
                             return false;
                          } else {
                             return true;
                          }
                       }
          };
          var beetwenQuotesRegex = new RegExp("^\&quot;.*\&quot;$", 'i');
          if (beetwenQuotesRegex.test(keywords)) {
             //6 is the size of substring &quot;
             //strip quotes from beginning and end
             keywords = keywords.substring(6, keywords.length - 6);
             highlighterOptions.separateWordSearch = false;
          }
          containers.mark(keywords, highlighterOptions); //require Markjs Jquery Plugin
       }
    }

    var _unhighlight = function(containers) {
      if (containers) {
         containers.unmark(); //require Markjs Jquery Plugin
      }
    }

   //make iframe embed videos in froala-view elements responsive
    var _makeFroalaVideosResponsive = function() {
      $('div.fr-view .fr-video.responsiveFroalaVideo').wrap('<div class="embed-container"></div>')
    }

    var camUtils = {};
    camUtils.toUTCISOFormat = _toUTCISOFormat;
    camUtils.camaraConfig = _camaraConfig;
    camUtils.openEventCalendar = _openEventCalendar;
    camUtils.highlight = _highlight;
    camUtils.unhighlight = _unhighlight;
    camUtils.makeFroalaVideosResponsive = _makeFroalaVideosResponsive;
    return camUtils;
})();
