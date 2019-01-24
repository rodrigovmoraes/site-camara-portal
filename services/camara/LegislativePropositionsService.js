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
var _getLegislativePropositionMethodURL = function () {
   return _camaraApiConfigService.getBaseUrl() +
               _camaraApiConfigService.getLegislativePropositionMethodPath();
}

var _getLegislativePropositionsMethodURL = function () {
   return _camaraApiConfigService.getBaseUrl() +
               _camaraApiConfigService.getLegislativePropositionsMethodPath();
}

var _getLegislativePropositionTypesMethodURL = function () {
   return _camaraApiConfigService.getBaseUrl() +
               _camaraApiConfigService.getLegislativePropositionTypesMethodPath();
}

var _getLegislativePropositionDownloadFileAttachmentURL = function (fileAttachmentId) {
   return _camaraApiConfigService.getBaseUrl() +
               _camaraApiConfigService.getLegislativePropositionDownloadFileAttachmentPath() + "/" + fileAttachmentId;
}

var _formatLegislativePropositionDate = function(strDate) {
   if(strDate) {
      var legislativePropositionDate = new Date(strDate);
      return Utils.toDDMMYYYY(legislativePropositionDate);
   } else {
      return null;
   }
}

var _getLegislativePropositionTypeId = function(legislativePropositionTypes, legislativeTypeCode) {
   if(legislativePropositionTypes) {
      var i;
      var legislativePropositionType = null;
      var found = false;
      for(i = 0; i < legislativePropositionTypes.length && !found; i++) {
         legislativePropositionType = legislativePropositionTypes[i];
         if(legislativePropositionType.code === legislativeTypeCode) {
            found = true;
         }
      }
      return legislativePropositionType._id;
   } else {
      return null;
   }
}

var _transformLegislativePropositionTypes = function(legislativePropositionTypes) {
   var transformedLegislativePropositionTypes = [];
   if(legislativePropositionTypes) {
      var i;
      for(i = 0; i < legislativePropositionTypes.length; i++) {
         var legislativePropositionType = legislativePropositionTypes[i];
         transformedLegislativePropositionTypes.push({
            'legislativePropositionTypeId': legislativePropositionType._id,
            'legislativePropositionTypeDescription': legislativePropositionType.description
         })
      }
   }
   return transformedLegislativePropositionTypes;
}

var _transformLastLegislativePropositionsItem = function(legislativeProposition) {
   return {
      legislativePropositionId: legislativeProposition._id,
      legislativePropositionNumber: _.padStart(legislativeProposition.number, 2, "0") + "/" + legislativeProposition.year,
      legislativePropositionYear: legislativeProposition.year,
      legislativePropositionDate: _formatLegislativePropositionDate(legislativeProposition.date),
      legislativePropositionDescription: legislativeProposition.description,
      legislativePropositionTypeDescription: legislativeProposition.typeDescription
   }
}

var _transformLastLegislativePropositions = function(legislativePropositions) {
   var transformedLegislativePropositions = [];
   if (legislativePropositions) {
      var i;
      for (i = 0; i < legislativePropositions.length; i++) {
         transformedLegislativePropositions.push(_transformLastLegislativePropositionsItem(legislativePropositions[i]));
      }
   }
   return transformedLegislativePropositions;
}

var _transformLegislativePropositionsItem = function(legislativeProposition) {
   return {
      legislativePropositionId: legislativeProposition._id,
      legislativePropositionNumber: _.padStart(legislativeProposition.number, 2, "0") + "/" + legislativeProposition.year,
      legislativePropositionDate: _formatLegislativePropositionDate(legislativeProposition.date),
      legislativePropositionDescription: legislativeProposition.description,
      legislativePropositionTypeDescription: legislativeProposition.typeDescription
   }
}

var _transformLegislativePropositionsItems = function(legislativePropositions) {
   var transformedLegislativePropositions = [];
   if (legislativePropositions) {
      var i;
      for (i = 0; i < legislativePropositions.length; i++) {
         transformedLegislativePropositions.push(_transformLegislativePropositionsItem(legislativePropositions[i]));
      }
   }
   return transformedLegislativePropositions;
}

var _transformGetLegislativePropositionResult = function(legislativeProposition) {
   //build file attachments
   var legislativePropositionFileAttachments = [];
   var i;
   if(legislativeProposition.consolidatedFileAttachments &&
         legislativeProposition.consolidatedFileAttachments.length > 0)
   {
      for(i = 0; i < legislativeProposition.consolidatedFileAttachments.length; i++) {
         var legislativePropositionFileAttachment = legislativeProposition.consolidatedFileAttachments[i];
         legislativePropositionFileAttachments.push({
            'legislativePropositionAttachmentId': legislativePropositionFileAttachment._id,
            'legislativePropositionAttachmentFileName': legislativePropositionFileAttachment.originalFilename,
            'legislativePropositionAttachmentURL': _getLegislativePropositionDownloadFileAttachmentURL(legislativePropositionFileAttachment._id)
         });
      }
   } else if(legislativeProposition.fileAttachments &&
             legislativeProposition.fileAttachments.length > 0)
   {
      for(i = 0; i < legislativeProposition.fileAttachments.length; i++) {
         var legislativePropositionFileAttachment = legislativeProposition.fileAttachments[i];
         legislativePropositionFileAttachments.push({
            'legislativePropositionAttachmentId': legislativePropositionFileAttachment._id,
            'legislativePropositionAttachmentFileName': legislativePropositionFileAttachment.originalFilename,
            'legislativePropositionAttachmentURL': _getLegislativePropositionDownloadFileAttachmentURL(legislativePropositionFileAttachment._id)
         });
      }
   }
   return {
      'legislativePropositionId': legislativeProposition._id,
      'legislativePropositionNumber': _.padStart(legislativeProposition.number, 2, "0") + "/" + legislativeProposition.year,
      'legislativePropositionDate': _formatLegislativePropositionDate(legislativeProposition.date),
      'legislativePropositionTypeDescription': legislativeProposition.type ? legislativeProposition.type.description : '',
      'legislativePropositionDescription': legislativeProposition.description,
      'legislativePropositionText': legislativeProposition.consolidatedText ? legislativeProposition.consolidatedText : legislativeProposition.text,
      'legislativePropositionTextAttachment': legislativeProposition.consolidatedTextAttachment ? legislativeProposition.consolidatedTextAttachment : legislativeProposition.textAttachment,
      'legislativePropositionFileAttachments': legislativePropositionFileAttachments
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
module.exports.getLegislativePropositionTypes = function() {
   return _requestService({
      url: _getLegislativePropositionTypesMethodURL(),
      method: "GET",
      json: true,
      body: {}
   }).then(function(data) {
      return _transformLegislativePropositionTypes(data.legislativePropositionTypes);
   });
}

module.exports.getLegislativePropositions = function(filter, page, pageSize) {
   var qs = {
      'page': page,
      'pageSize': pageSize,
      'sort': 'date',
      'sortDirection': -1
   };

   //publication date begin
   if(filter.keywords) {
      qs['keywords'] = filter.keywords;
   }

   //publication date begin
   if(filter.date1) {
      qs['date1'] = filter.date1;
   }

   //publication date end
   if(filter.date2) {
      qs['date2'] = filter.date2;
   }

   //category
   if(filter.type) {
      qs['type'] = filter.type;
   }

   //number
   if(filter.number) {
      qs['number'] = filter.number;
   }

   //year
   if(filter.year) {
      qs['year'] = filter.year;
   }

   return _requestService({
      'url': _getLegislativePropositionsMethodURL(),
      'method': "GET",
      'json': true,
      'qs': qs,
      'body': {}
   }).then(function(data) {
      data.legislativePropositions = _transformLegislativePropositionsItems(data.legislativePropositions);
      return data;
   });
}

module.exports.getLegislativeProposition = function(legislativePropositionId) {
   return _requestService({
      url: _getLegislativePropositionMethodURL() + "/" + legislativePropositionId,
      method: "GET",
      json: true,
      body: {}
   }).then(function(result) {
      return _transformGetLegislativePropositionResult(result.legislativeProposition);
   });
}

module.exports.getLastLegislativePropositions = function(amountOfLegislativePropositions) {
   var legislativePropositionTypes = null;
   return _requestService({
      url: _getLegislativePropositionTypesMethodURL(),
      method: "GET",
      json: true,
      body: {}
   }).then(function(data){
      legislativePropositionTypes = data.legislativePropositionTypes;
      return _requestService({
         url: _getLegislativePropositionsMethodURL(),
         method: "GET",
         json: true,
         qs: {
            page: 1,
            pageSize: amountOfLegislativePropositions,
            sort: 'date',
            sortDirection: -1,
            //get only propositions of the type "Lei Ordinária" Code=1
            type: _getLegislativePropositionTypeId(legislativePropositionTypes, 1)
         },
         body: {}
      })
   }).then(function(data) {
      //last update info
      var lastLegislativePropositionsUpdate = null;
      if(data.legislativePropositions && data.legislativePropositions.length > 0) {
         lastLegislativePropositionsUpdate = new Date(data.legislativePropositions[0].date);
         lastLegislativePropositionsUpdate = Utils.getElapsedTimeDescription(lastLegislativePropositionsUpdate);
      }
      return {
         'legislativePropositions': _transformLastLegislativePropositions(data.legislativePropositions),
         'lastLegislativePropositionsUpdate' : lastLegislativePropositionsUpdate
      }
   });
}
