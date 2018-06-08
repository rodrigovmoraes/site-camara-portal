/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (LIBS MODULES) *******************************
/*****************************************************************************/
var winston = require('winston');
var _ = require('lodash');
var Utils = require('./Utils.js');

/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (OTHERS MODULES) *******************************
/*****************************************************************************/


/*****************************************************************************
*************************** Private Methods **********************************
/*****************************************************************************/

/*****************************************************************************
*************************** Module Setters ***********************************
/*****************************************************************************/
//...
//..
//.

/*****************************************************************************
**************************  Module functions *********************************
/*****************************************************************************/
module.exports.transformAccess = function(prefix, obj) {
   if(obj) {
      if (obj.type) {
         var accessProperty = prefix + 'Type' + _.capitalize(obj.type);
         obj[accessProperty] = obj.access;
         if(obj[accessProperty].title) {
            obj[accessProperty].accessTitle = obj[accessProperty].title;
            delete obj[accessProperty].title;
         }
         if(obj[accessProperty].thumbnailsShowMode) {
            switch (obj[accessProperty].thumbnailsShowMode) {
               case 'b':
                  obj[accessProperty].onePerLineShowMode = true;
                  break;
               case 'm':
                  obj[accessProperty].threePerLineShowMode = true;
                  break;
               default:
                  obj[accessProperty].onePerLineShowMode = true;
            }
         } else {
            obj[accessProperty].onePerLineShowMode = true;
         }
         if(obj[accessProperty].id) {
            obj[accessProperty].accessId = obj[accessProperty].id;
            delete obj[accessProperty].id;
         }
         obj[prefix + 'HasAccess'] = true;
      } else {
         obj[prefix + 'HasAccess'] = false;
      }
   }
}
