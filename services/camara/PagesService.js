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

var _getPageMethodURL = function () {
   return _camaraApiConfigService.getBaseUrl() + _camaraApiConfigService.getPageMethodPath();
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
module.exports.getPage = function(pageId) {
   return _requestService({
      url: _getPageMethodURL() + "/" + pageId,
      method: "GET",
      json: true
   }).then(function(result) {
      return result.page;
   });
}

module.exports.getPageByTag = function(tag) {
   return _requestService({
      url: _getPageMethodURL() + "/tag/" + tag,
      method: "GET",
      json: true
   }).then(function(result) {
      return result.page;
   });
}
