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

var _getLegislativePropositionTagsMethodURL = function () {
   return _camaraApiConfigService.getBaseUrl() +
               _camaraApiConfigService.getLegislativePropositionTagsMethodPath();
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

var _transformLegislativePropositionTags = function(legislativePropositionTags) {
   var transformedLegislativePropositionTags = [];
   if(legislativePropositionTags) {
      var i;
      for(i = 0; i < legislativePropositionTags.length; i++) {
         var legislativePropositionTag = legislativePropositionTags[i];
         transformedLegislativePropositionTags.push({
            'legislativePropositionTagId': legislativePropositionTag._id,
            'legislativePropositionTagDescription': legislativePropositionTag.description
         })
      }
   }
   return transformedLegislativePropositionTags;
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
   var legislativePropositionRelationships = [];
   var legislativePropositionRelationshipsByType = [];
   var legislativePropositionRelationshipType = null;
   var legislativePropositionTags = [];
   var i;
   if(legislativeProposition.consolidatedFileAttachments &&
         legislativeProposition.consolidatedFileAttachments.length > 0) {
      for(i = 0; i < legislativeProposition.consolidatedFileAttachments.length; i++) {
         var legislativePropositionFileAttachment = legislativeProposition.consolidatedFileAttachments[i];
         legislativePropositionFileAttachments.push({
            'legislativePropositionAttachmentId': legislativePropositionFileAttachment._id,
            'legislativePropositionAttachmentFileName': legislativePropositionFileAttachment.originalFilename,
            'legislativePropositionAttachmentURL': _getLegislativePropositionDownloadFileAttachmentURL(legislativePropositionFileAttachment._id)
         });
      }
   } else if(legislativeProposition.fileAttachments &&
             legislativeProposition.fileAttachments.length > 0) {
      for(i = 0; i < legislativeProposition.fileAttachments.length; i++) {
         var legislativePropositionFileAttachment = legislativeProposition.fileAttachments[i];
         legislativePropositionFileAttachments.push({
            'legislativePropositionAttachmentId': legislativePropositionFileAttachment._id,
            'legislativePropositionAttachmentFileName': legislativePropositionFileAttachment.originalFilename,
            'legislativePropositionAttachmentURL': _getLegislativePropositionDownloadFileAttachmentURL(legislativePropositionFileAttachment._id)
         });
      }
   }
   //relationships
   if (legislativeProposition.relationships &&
             legislativeProposition.relationships.length > 0) {
      for (i = 0; i < legislativeProposition.relationships.length; i++) {
         var legislativePropositionRelationship = legislativeProposition.relationships[i];
         legislativePropositionRelationships.push({
            'otherLegislativePropositionId': legislativePropositionRelationship.otherLegislativeProposition._id,
            'legislativePropositionRelationshipTypeId': legislativePropositionRelationship.type._id,
            'legislativePropositionRelationshipTypeDescription': legislativePropositionRelationship.type.description,
            'otherLegislativePropositionDate': _formatLegislativePropositionDate(legislativePropositionRelationship.otherLegislativeProposition.date),
            'otherLegislativePropositionDateObj': new Date(legislativePropositionRelationship.otherLegislativeProposition.date),
            'otherLegislativePropositionNumber': _.padStart(legislativePropositionRelationship.otherLegislativeProposition.number, 2, "0") + "/" + legislativePropositionRelationship.otherLegislativeProposition.year,
            'otherLegislativePropositionDescription': legislativePropositionRelationship.otherLegislativeProposition.description
         });
      }
      //sort by date in descending order
      legislativePropositionRelationships = _.sortBy(legislativePropositionRelationships, [function(o) { return -1 * o.otherLegislativePropositionDateObj.getTime(); }]);
      //group by relationship type
      legislativePropositionRelationshipsByType = _.groupBy(legislativePropositionRelationships, function(o) {
         return o.legislativePropositionRelationshipTypeId ? o.legislativePropositionRelationshipTypeId : null;
      });
      legislativePropositionRelationships = [];
      var legislativePropositionRelationshipTypeKeys = Object.keys(legislativePropositionRelationshipsByType);
      if (legislativePropositionRelationshipTypeKeys) {
         for (i = 0; i < legislativePropositionRelationshipTypeKeys.length; i++) {
            if ( legislativePropositionRelationshipTypeKeys[i] &&
                 legislativePropositionRelationshipsByType[legislativePropositionRelationshipTypeKeys[i]] &&
                 legislativePropositionRelationshipsByType[legislativePropositionRelationshipTypeKeys[i]].length > 0 ) {
               legislativePropositionRelationships.push({
                  legislativePropositionRelationshipType: {
                     legislativePropositionRelationshipTypeId: legislativePropositionRelationshipsByType[legislativePropositionRelationshipTypeKeys[i]][0].legislativePropositionRelationshipTypeId,
                     legislativePropositionRelationshipTypeDescription: legislativePropositionRelationshipsByType[legislativePropositionRelationshipTypeKeys[i]][0].legislativePropositionRelationshipTypeDescription
                  },
                  otherLegislativePropositionRelationships: legislativePropositionRelationshipsByType[legislativePropositionRelationshipTypeKeys[i]]
               });
            }
         }
      }
      //sort by the description of relationship type
      legislativePropositionRelationships = _.sortBy(legislativePropositionRelationships, [function(o) {
         return o.legislativePropositionRelationshipType &&
                o.legislativePropositionRelationshipType.legislativePropositionRelationshipTypeDescription
                  ? o.legislativePropositionRelationshipType.legislativePropositionRelationshipTypeDescription : "";
      }]);
   }
   if (legislativeProposition.tags && legislativeProposition.tags.length > 0) {
      for (i = 0; i < legislativeProposition.tags.length; i++) {
         legislativePropositionTags.push({
            legislativePropositionTagId: legislativeProposition.tags[i]._id,
            legislativePropositionTagDescription: legislativeProposition.tags[i].description,
            legislativePropositionTagLast: i === ( legislativeProposition.tags.length - 1 )
         });
      }
   }
   return {
      'legislativePropositionId': legislativeProposition._id,
      'legislativePropositionNumber': _.padStart(legislativeProposition.number, 2, "0") + "/" + legislativeProposition.year,
      'legislativePropositionDate': _formatLegislativePropositionDate(legislativeProposition.date),
      'legislativePropositionTypeDescription': legislativeProposition.type ? legislativeProposition.type.description : '',
      'legislativePropositionProcess': legislativeProposition.legislativeProcessId ? legislativeProposition.legislativeProcessId : null,
      'legislativePropositionDescription': legislativeProposition.description,
      'legislativePropositionText': legislativeProposition.consolidatedText ? legislativeProposition.consolidatedText : legislativeProposition.text,
      'legislativePropositionOriginalText': legislativeProposition.consolidatedText ? legislativeProposition.text : "",
      'legislativePropositionTextAttachment': legislativeProposition.consolidatedTextAttachment ? legislativeProposition.consolidatedTextAttachment : legislativeProposition.textAttachment,
      'legislativePropositionFileAttachments': legislativePropositionFileAttachments,
      'legislativePropositionRelationships': legislativePropositionRelationships,
      'legislativePropositionTags': legislativePropositionTags,
      'legislativePropositionShowNumber': legislativeProposition.type &&  (legislativeProposition.type.code !== 5 && legislativeProposition.type.code !== 6)
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
      json: true
   }).then(function(data) {
      return _transformLegislativePropositionTypes(data.legislativePropositionTypes);
   });
}

module.exports.getLegislativePropositionTags = function(legislativePropositionType) {
   return _requestService({
      url: _getLegislativePropositionTagsMethodURL() + "/" + legislativePropositionType,
      method: "GET",
      json: true
   }).then(function(data) {
      return _transformLegislativePropositionTags(data.legislativePropositionTags);
   });
}

module.exports.getLegislativePropositions = function(filter, page, pageSize) {
   var qs = {
      'page': page,
      'pageSize': pageSize,
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

   //tag
   if(filter.tag) {
      qs['tag'] = filter.tag;
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
      json: true
   }).then(function(result) {
      return _transformGetLegislativePropositionResult(result.legislativeProposition);
   });
}

module.exports.getLegislativePropositionByNumber = function(number, typeCode) {
   return _requestService({
      url: _getLegislativePropositionMethodURL(),
      method: "GET",
      json: true,
      qs: {
         'number': number,
         'typeCode': typeCode
      }
   }).then(function(result) {
      return _transformGetLegislativePropositionResult(result.legislativeProposition);
   });
}

module.exports.getLastLegislativePropositions = function(amountOfLegislativePropositions) {
   var legislativePropositionTypes = null;
   return _requestService({
      url: _getLegislativePropositionTypesMethodURL(),
      method: "GET",
      json: true
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
         }
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
