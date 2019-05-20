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

var _getFolderContentsMethodURL = function () {
   return _camaraApiConfigService.getBaseUrl() + _camaraApiConfigService.getPublicFilesFolderContentsMethodPath();
}

var _getFolderPathMethodURL = function () {
   return _camaraApiConfigService.getBaseUrl() + _camaraApiConfigService.getPublicFilesFolderPathMethodPath();
}

var _getDownloadFilePathMethodURL = function (fileId) {
   return _camaraApiConfigService.getBaseUrl() + _camaraApiConfigService.getDownloadFilePathMethodPath() + "/" + fileId;
}

var _transformPublicFilesCollectionDeeply = function(prefix, collectionOrObj) {
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
               _transformPublicFilesCollectionDeeply(prefix, collectionOrObj[prefix + props[j]]);
            }
         }
      } else {
         var i;
         for(i = 0; i < collectionOrObj.length; i++) {
            _transformPublicFilesCollectionDeeply(prefix, collectionOrObj[i]);
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
      _transformPublicFilesCollectionDeeply('ArquivosPublicos_', result.objects);
      var k;
      if(result.objects) {
         for (k = 0; k < result.objects.length; k++) {
            result.objects[k]['ArquivosPublicos_downloadFileURL'] = _getDownloadFilePathMethodURL(result.objects[k]['ArquivosPublicos__id']);
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
         _transformPublicFilesCollectionDeeply('ArquivosPublicosPath_', result.path);
         return result.path;
      });
   } else {
      return Promise.resolve( [] );
   }
}
