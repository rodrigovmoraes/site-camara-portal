/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (LIBS MODULES) *******************************
/*****************************************************************************/
var winston = require('winston');
var _requestService = require('request-promise');

/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (OTHERS MODULES) *******************************
/*****************************************************************************/
var _camaraApiConfigService = require('./CamaraApiConfigService.js');

/*****************************************************************************
*************************** Private Methods **********************************
/*****************************************************************************/
var _getMenuPortalMethodURL = function () {
   return _camaraApiConfigService.getBaseUrl() +
               _camaraApiConfigService.getPortalMenuMethodPath();
}

//visit each menu item and set the hasMenuItems
//property
var _processMenuItem = function(menuItem) {
   if(menuItem) {
      if(menuItem.menuItems && menuItem.menuItems.length > 0) {
         menuItem.hasMenuItems = true;
         menuItem.menuItems.forEach(function(childMenuItem) {
            _processMenuItem(childMenuItem);
         })
      } else {
         menuItem.hasMenuItems = false;
      }
   }
};

var _processMenu = function(menu) {
   menu.forEach(function(menuItem) {
      _processMenuItem(menuItem);
   });
}

/*****************************************************************************
*************************** Module Setters ***********************************
/*****************************************************************************/
module.exports.setCamaraApiBaseUrl = function(camaraApiBaseUrl) {
   _camaraApiBaseUrl = camaraApiBaseUrl;
}

module.exports.setCamaraApiGetPortalMenuMethod = function(camaraApiGetPortalMenuMethod) {
   _camaraApiGetPortalMenuMethod = camaraApiGetPortalMenuMethod;
}

/*****************************************************************************
**************************  Module functions *********************************
/*****************************************************************************/
module.exports.getMenuPortal = function() {
   return _requestService({
      url: _getMenuPortalMethodURL(),
      method: "GET",
      json: true
   }).then(function(data) {
      var menuPortalTree = data.menuPortalTree;
      _processMenu(menuPortalTree);
      return menuPortalTree;
   });
}
