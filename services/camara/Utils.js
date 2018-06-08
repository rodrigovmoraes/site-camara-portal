/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (LIBS MODULES) *******************************
/*****************************************************************************/
var winston = require('winston');
var _ = require('lodash');

/*****************************************************************************
******************************* PRIVATE **************************************
/*****************************************************************************/
//...

/*****************************************************************************
******************************* PUBLIC ***************************************
*****************************************************************************/
//module methods
module.exports.toDateFromDDMMYYYY = function(strDate) {
   var dateParts = strDate.split("/");
   var days = parseInt(dateParts[0]);
   var months = parseInt(dateParts[1]);
   var years = parseInt(dateParts[2]);
   return new Date(years, months, days);
}

module.exports.toDDMMYYYYHHhmm = function(pdate) {
   if(pdate) {
      return _.padStart(pdate.getDate(), 2, '0') + "/" +
                        _.padStart(pdate.getMonth() + 1, 2, '0')  + "/" +
                        _.padStart(pdate.getFullYear(), 4, '0') + " " +
                        _.padStart(pdate.getHours(), 2, '0') + "h" +
                        _.padStart(pdate.getMinutes(), 2, '0')
   } else {
      return "";
   }
}

module.exports.toDDMMYYYY = function(pdate) {
   if(pdate) {
      return _.padStart(pdate.getDate(), 2, '0') + "/" +
             _.padStart(pdate.getMonth() + 1, 2, '0')  + "/" +
             _.padStart(pdate.getFullYear(), 4, '0')
   } else {
      return "";
   }
}

//build a string describing how much time has elapsed
//since pdate: eg. 15 minitos atrás, 1 dia atrás, 2 horas atrás,
//3 horas atrás
module.exports.getElapsedTimeDescription = function(pdate) {
   if(pdate) {
      var now = new Date();
      var desc = "";
      var diff = now.getTime() - pdate.getTime();
      //days, hours, minutes
      var days = Math.floor( diff / (1000 * 60 * 60 * 24) );
      diff = diff - days * (1000 * 60 * 60 * 24);
      var hours = Math.floor( diff / (1000 * 60 * 60) );
      diff = diff - hours * (1000 * 60 * 60);
      var minutes = Math.floor( diff / (1000 * 60) );
      if(days > 0) {
         desc = days + (days > 1 ? " dias" : " dia");
      } else if(hours > 0) {
         desc = hours + (hours > 1 ? " horas" : " hora");
      } else {
         if(minutes <= 0) {
            minutes = 1;
         }
         desc = minutes + (minutes > 1 ? " minutos" : " minuto");
      }
      if(desc !== "") {
         desc += " atrás"
      }
      return desc;
   } else {
      return "";
   }
}

module.exports.next = function(httpStatus, err, next){
   err.status = httpStatus;
   next(err);
}
