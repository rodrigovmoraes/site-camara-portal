/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (LIBS MODULES) *******************************
/*****************************************************************************/
var winston = require('winston');
var _requestService = require('request-promise');
var _ = require('lodash');

/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (OTHERS MODULES) *******************************
/*****************************************************************************/
var Utils = require('./Utils.js');
var _camaraApiConfigService = require('./CamaraApiConfigService.js');

/*****************************************************************************
*************************** Private Methods **********************************
/*****************************************************************************/

var _getBreakingNewsMethodURL = function () {
   return _camaraApiConfigService.getBaseUrl() + _camaraApiConfigService.getBreakingNewsMethodPath();
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
module.exports.getBreakingNewsItems = function() {
   return _requestService({
      url: _getBreakingNewsMethodURL(),
      method: "GET",
      json: true
   }).then(function(result) {
      return result.breakingNewsItems;
   });
}
