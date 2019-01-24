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

var _getEventsCalendarMethodURL = function () {
   return _camaraApiConfigService.getBaseUrl() + _camaraApiConfigService.getEventsCalendarMethodPath();
}

var _getEventCalendarMethodURL = function () {
   return _camaraApiConfigService.getBaseUrl() + _camaraApiConfigService.getEventCalendarMethodPath();
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
module.exports.getTodayEvents = function() {
   var todayRange = Utils.getTodayRange();
   var minDate = todayRange.minDate;
   var maxDate = todayRange.maxDate;

   return _requestService({
      url: _getEventsCalendarMethodURL(),
      method: "GET",
      json: true,
      body: {},
      qs: {
         'minDate' : minDate,
         'maxDate' : maxDate
      }
   }).then(function(result) {
      return result.events;
   });
}

module.exports.getNextEvents = function() {
   var todayRange = Utils.getTodayRange();
   var minDate = todayRange.minDate;
   var maxResult = 7;

   return _requestService({
      url: _getEventsCalendarMethodURL(),
      method: "GET",
      json: true,
      body: {},
      qs: {
         'minDate' : minDate,
         'unlimitedMaxDate' : true
      }
   }).then(function(result) {
      if(result.events) {
         if(result.events.length > maxResult) {
            result.events = result.events.slice(0, maxResult);
         }
      }
      return result.events;
   });
}

module.exports.getEvent = function(eventId) {
   return _requestService({
      url: _getEventCalendarMethodURL(),
      method: "GET",
      json: true,
      body: {},
      qs: {
         'id' : eventId
      }
   }).then(function(result) {
      return result.event;
   });
}
