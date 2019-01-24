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

var _getLastLicitacoesEventsMethodURL = function () {
   return _camaraApiConfigService.getBaseUrl() +
               _camaraApiConfigService.getLastLicitacoesEventsMethodPath();
}

var _getLicitacaoDownloadEventFileURL = function (eventId) {
   return _camaraApiConfigService.getBaseUrl() +
               _camaraApiConfigService.getLicitacaoDownloadEventFilePath() + "/" + eventId;
}

var _getLicitacoesMethodURL = function () {
   return _camaraApiConfigService.getBaseUrl() +
               _camaraApiConfigService.getLicitacoesMethodPath();
}

var _getLastLicitacoesCategoriesMethodURL = function() {
   return _camaraApiConfigService.getBaseUrl() +
               _camaraApiConfigService.getLicitacoesCategoriesMethodPath();
}

var _getLicitacaoMethodURL = function() {
   return _camaraApiConfigService.getBaseUrl() +
               _camaraApiConfigService.getLicitacaoMethodPath();
}

var _formatLicitacaoEventTimeDescription = function(strTime) {
   if(strTime) {
      var licitacaoEventDate = new Date(strTime);
      return Utils.toDDMMYYYY(licitacaoEventDate);
   } else {
      return null;
   }
}

var _formatLicitacaoDate = function(strDate) {
   if(strDate) {
      var licitacaoDate = new Date(strDate);
      return Utils.toDDMMYYYY(licitacaoDate);
   } else {
      return null;
   }
}

var _transformLicitacoesCategory = function(licitacaoCategory) {
   return {
      'licitacaoCategoryId' : licitacaoCategory._id,
      'licitacaoCategoryDescription' : licitacaoCategory.description
   }
}

var _transformLicitacoesCategories = function(licitacoesCategories) {
   var rLicitacoesCategories = [];
   if(licitacoesCategories) {
      var i;
      for(i = 0; i < licitacoesCategories.length; i++) {
         var licitacaoCategory = licitacoesCategories[i];
         rLicitacoesCategories.push(_transformLicitacoesCategory(licitacaoCategory))
      }
   }
   return rLicitacoesCategories;
}

var _transformLicitacaoItem = function(licitacao) {
   licitacao.licitacaoNumber = _.padStart(licitacao.number, 2, "0") + "/" + licitacao.year;
   licitacao.publicationDate = _formatLicitacaoDate(licitacao.publicationDate);
}

var _transformLicitacoesItems = function(licitacoes) {
   if(licitacoes) {
      licitacoes.forEach(function(licitacao) {
         _transformLicitacaoItem(licitacao);
      });
   }
}

//transform next events calendar
var _transformLastLicitacaoEvents = function(licitacoesEvents) {
   var events = [];
   if(licitacoesEvents) {
      var i;
      for(i = 0; i < licitacoesEvents.length; i++) {
         var licitacaoEvent = licitacoesEvents[i];
         events.push({
            'lastLicitacaoEventLicitacaoId': licitacaoEvent.licitacao._id,
            'lastLicitacaoEventNumber': _.padStart(licitacaoEvent.licitacao.number, 2, "0") + "/" + licitacaoEvent.licitacao.year,
            'lastLicitacaoEventId': licitacaoEvent._id,
            'lastLicitacaoEventLicitacaoDescription': licitacaoEvent.licitacao.description,
            'lastLicitacaoEventDescription': licitacaoEvent.description,
            'lastLicitacaoEventTimeDescription': _formatLicitacaoEventTimeDescription(licitacaoEvent.date),
            'lastLicitacaoEventCategory': licitacaoEvent.licitacao.category.description,
            'lastLicitacaoEventFileDownloadUrl': _getLicitacaoDownloadEventFileURL(licitacaoEvent._id)
         });
      }
      return events;
   }else {
      return [];
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
module.exports.getLicitacoesCategories = function() {
   return _requestService({
      url: _getLastLicitacoesCategoriesMethodURL(),
      method: "GET",
      json: true,
      body: {}
   }).then(function(data) {
      return _transformLicitacoesCategories(data.categories);
   });
}

module.exports.getLastLicitacoesEvents = function(amountOfLicitacoesEvents) {
   return _requestService({
      url: _getLastLicitacoesEventsMethodURL(),
      method: "GET",
      json: true,
      qs: {
         size: amountOfLicitacoesEvents
      },
      body: {}
   }).then(function(licitacoesEvents) {
      //last update info
      var lastUpdateDescription;
      if(licitacoesEvents && licitacoesEvents.length > 0) {
         var lastUpdate = new Date(licitacoesEvents[0].date);
         lastUpdateDescription = Utils.getElapsedTimeDescriptionDayPrecision(lastUpdate);
      } else {
         lastUpdateDescription = null;
      }
      return {
         'lastUpdate': lastUpdateDescription,
         'events': _transformLastLicitacaoEvents(licitacoesEvents)
      };
   });
}

module.exports.getLicitacoes = function(filter, page, pageSize) {
   var qs = {
      'page': page,
      'pageSize': pageSize,
      'sort': 'publicationDate',
      'sortDirection': -1,
      'state': 1
   };

   //publication date begin
   if(filter.keywords) {
      qs['keywords'] = filter.keywords;
   }

   //publication date begin
   if(filter.publicationDate1) {
      qs['publicationDate1'] = filter.publicationDate1;
   }

   //publication date end
   if(filter.publicationDate2) {
      qs['publicationDate2'] = filter.publicationDate2;
   }

   //category
   if(filter.category) {
      qs['category'] = filter.category;
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
      'url': _getLicitacoesMethodURL(),
      'method': "GET",
      'json': true,
      'qs': qs,
      'body': {}
   }).then(function(data) {
      _transformLicitacoesItems(data.licitacoes);
      return data;
   });
}

var _transformGetLicitacaoResult = function(licitacao) {
   //id
   licitacao.licitacaoId = licitacao._id;
   delete licitacao._id;
   //number
   licitacao.licitacaoNumber = _.padStart(licitacao.number, 2, "0") + "/" + licitacao.year;
   //category
   licitacao.categoryDescription = licitacao.category.description;
   delete licitacao.category;
   //publication date
   licitacao.publicationDate = _formatLicitacaoDate(licitacao.publicationDate);
   //events
   var i;
   var events = [];
   if(licitacao.events) {
      for(i = 0; i < licitacao.events.length; i++) {
         var event = licitacao.events[i];
         events.push({
            'licitacaoEventId': event._id,
            'licitacaoEventDescription': event.description,
            'licitacaoEventDate': _formatLicitacaoEventTimeDescription(event.date),
            'licitacaoEventFileDownloadUrl': _getLicitacaoDownloadEventFileURL(event._id)
         })
      }
   }
   delete licitacao.events;
   licitacao['licitacaoEvents'] = events;
   return licitacao;
}

module.exports.getLicitacao = function(licitacaoId) {
   return _requestService({
      url: _getLicitacaoMethodURL() + "/" + licitacaoId,
      method: "GET",
      json: true,
      body: {}
   }).then(function(result) {
      return _transformGetLicitacaoResult(result.licitacao);
   });
}
