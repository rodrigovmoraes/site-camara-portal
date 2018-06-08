/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (LIBS MODULES) *******************************
/*****************************************************************************/
var winston = require('winston');
var _requestService = require('request-promise');
var _ = require('lodash');
var Utils = require('./Utils.js');

/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (OTHERS MODULES) *******************************
/*****************************************************************************/
var _camaraApiConfigService = require('./CamaraApiConfigService.js');

/*****************************************************************************
*************************** Private Methods **********************************
/*****************************************************************************/

var _getFBreakingNewsMethodURL = function () {
   return _camaraApiConfigService.getBaseUrl() + _camaraApiConfigService.getFBreakingNewsMethodPath();
}

/*****************************************************************************
*************************** Module Setters ***********************************
/*****************************************************************************/
//...
//..
//.

/*****************************************************************************
**************************  Module functions *********************************
/*****************************************************************************/
module.exports.getFBreakingNewsItems = function() {
   return _requestService({
      url: _getFBreakingNewsMethodURL(),
      method: "GET",
      json: true,
      body: {}
   }).then(function(result) {
      return result.fbreakingNewsItems;
   });
}

//search the fixed breaking news item in fbreakingNewsItems
//by the order
module.exports.getFBreakingNewsItemByOrder = function(fbreakingNewsItems, order) {
   if(fbreakingNewsItems) {
      var i;
      for(i = 0; i < fbreakingNewsItems.length; i++) {
         var fbreakingNewsItem = fbreakingNewsItems[i];
         if(fbreakingNewsItem.order === order) {
            return fbreakingNewsItem;
         }
      }
      return null;
   } else {
      return null;
   }
}
