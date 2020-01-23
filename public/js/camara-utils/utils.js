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

    var _instantSearch = {
       "highlight": function (container, highlightText) {
         var internalHighlighter = function (options) {
            var id = {
                container: "container",
                tokens: "tokens",
                all: "all",
                token: "token",
                className: "className",
                sensitiveSearch: "sensitiveSearch"
            },
            tokens = options[id.tokens],
            allClassName = options[id.all][id.className],
            allSensitiveSearch = options[id.all][id.sensitiveSearch];


            function checkAndReplace(node, tokenArr, classNameAll, sensitiveSearchAll)
            {
                var nodeVal = node.nodeValue, parentNode = node.parentNode,
                    i, j, curToken, myToken, myClassName, mySensitiveSearch,
                    finalClassName, finalSensitiveSearch,
                    foundIndex, begin, matched, end,
                    textNode, span, isFirst;

                for (i = 0, j = tokenArr.length; i < j; i++)
                {
                    curToken = tokenArr[i];
                    myToken = curToken[id.token];
                    myClassName = curToken[id.className];
                    mySensitiveSearch = curToken[id.sensitiveSearch];

                    finalClassName = (classNameAll ? myClassName + " " + classNameAll : myClassName);

                    finalSensitiveSearch = (typeof sensitiveSearchAll !== "undefined" ? sensitiveSearchAll : mySensitiveSearch);

                    isFirst = true;
                    while (true)
                    {
                        if (finalSensitiveSearch)
                            foundIndex = nodeVal.indexOf(myToken);
                        else
                            foundIndex = nodeVal.toLowerCase().indexOf(myToken.toLowerCase());

                        if (foundIndex < 0)
                        {
                            if (isFirst)
                                break;

                            if (nodeVal)
                            {
                                textNode = document.createTextNode(nodeVal);
                                parentNode.insertBefore(textNode, node);
                            } // End if (nodeVal)

                            parentNode.removeChild(node);
                            break;
                        } // End if (foundIndex < 0)

                        isFirst = false;


                        begin = nodeVal.substring(0, foundIndex);
                        matched = nodeVal.substr(foundIndex, myToken.length);

                        if (begin)
                        {
                            textNode = document.createTextNode(begin);
                            parentNode.insertBefore(textNode, node);
                        } // End if (begin)

                        span = document.createElement("span");
                        span.className += finalClassName;
                        span.appendChild(document.createTextNode(matched));
                        parentNode.insertBefore(span, node);

                        nodeVal = nodeVal.substring(foundIndex + myToken.length);
                    } // Whend

                } // Next i
            }; // End Function checkAndReplace

            function iterator(p)
            {
                if (p === null) return;

                var children = Array.prototype.slice.call(p.childNodes), i, cur;

                if (children.length)
                {
                    for (i = 0; i < children.length; i++)
                    {
                        cur = children[i];
                        if (cur.nodeType === 3)
                        {
                            checkAndReplace(cur, tokens, allClassName, allSensitiveSearch);
                        }
                        else if (cur.nodeType === 1)
                        {
                            iterator(cur);
                        }
                    }
                }
            }; // End Function iterator

            iterator(options[id.container]);
         }; // End Function highlighter

         internalHighlighter({
             container: container,
             all: {
                className: "generalSearchHighlighter"
             },
             tokens: [{
                token: highlightText,
                className: "generalSearchHighlight",
                sensitiveSearch: false
             }]
         }); // End Call internalHighlighter

       } // End Function highlight
    };

    var _highlight = function(containers, keywords) {
       var k, w;
       var words = [];

       if (containers) {
          for (w = 0; w < containers.length; w++) {
             if (keywords) {
                words = _.words(keywords);
                for (k = 0; k < words.length; k++) {
                   _instantSearch.highlight(containers[w], words[k]);
                }
            }
          }
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
    camUtils.makeFroalaVideosResponsive = _makeFroalaVideosResponsive;
    return camUtils;
})();
