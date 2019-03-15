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

var _getFolderContentsMethodURL = function () {
   return _camaraApiConfigService.getBaseUrl() + _camaraApiConfigService.getPublicFinancesFolderContentsMethodPath();
}

var _getFolderPathMethodURL = function () {
   return _camaraApiConfigService.getBaseUrl() + _camaraApiConfigService.getPublicFinancesFolderPathMethodPath();
}

var _getDownloadFilePathMethodURL = function (fileId) {
   return _camaraApiConfigService.getBaseUrl() + _camaraApiConfigService.getDownloadFilePathMethodPath() + "/" + fileId;
}

var _transformPublicFinancesCollectionDeeply = function(prefix, collectionOrObj) {
   if(collectionOrObj) {
      if(!Array.isArray(collectionOrObj)) {
         //base case
         var props = [];
         var j, k;
         for(var prop in collectionOrObj) {
            props.push(prop);
         }
         for(j = 0; j < props.length; j++) {
            collectionOrObj[prefix + props[j]] = collectionOrObj[props[j]];
            delete collectionOrObj[props[j]];
            if (collectionOrObj[prefix + props[j]] &&
                  Array.isArray(collectionOrObj[prefix + props[j]])) {
               _transformPublicFinancesCollectionDeeply(prefix, collectionOrObj[prefix + props[j]]);
            }
         }
      } else {
         var i;
         for(i = 0; i < collectionOrObj.length; i++) {
            _transformPublicFinancesCollectionDeeply(prefix, collectionOrObj[i]);
         }
      }
   }
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
module.exports.getFolderContents = function(folderId) {
   return _requestService({
      url: _getFolderContentsMethodURL() + ( folderId ? "/" + folderId : "" ),
      method: "GET",
      json: true,
      body: {}
   }).then(function(result) {
      result.objects;
      _transformPublicFinancesCollectionDeeply('ContasPublicas_', result.objects);
      var k;
      if(result.objects) {
         for (k = 0; k < result.objects.length; k++) {
            result.objects[k]['ContasPublicas_downloadFileURL'] = _getDownloadFilePathMethodURL(result.objects[k]['ContasPublicas__id']);
         }
      }
      return result.objects;
   });
}

module.exports.getFolderPath = function(folderId) {
   if(folderId) {
      return _requestService({
         url: _getFolderPathMethodURL() + "/" + folderId,
         method: "GET",
         json: true,
         body: {}
      }).then(function(result) {
         result.objects;
         _transformPublicFinancesCollectionDeeply('ContasPublicasPath_', result.path);
         return result.path;
      });
   } else {
      return Promise.resolve( [] );
   }
}
