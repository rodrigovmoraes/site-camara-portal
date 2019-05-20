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
var _getNewsMethodURL = function () {
   return _camaraApiConfigService.getBaseUrl() +
               _camaraApiConfigService.getNewsMethodPath();
}

var _getNewsItemMethodURL = function () {
   return _camaraApiConfigService.getBaseUrl() +
               _camaraApiConfigService.getNewsItemMethodPath();
}

var _getIncrementNewsViewsMethodURL = function () {
   return _camaraApiConfigService.getBaseUrl() +
               _camaraApiConfigService.getIncrementNewsViewsMethodPath();
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

var _formatNewsDate = function(paramNewsDate) {
   if(paramNewsDate) {
      var newsDate = new Date(paramNewsDate);
      return Utils.toDDMMYYYYHHhmm(newsDate);
   } else {
      return null;
   }
}

//transform the new item to a version suitable to be displayed on the portal
var _transformNewsItem = function(newsItem) {
   newsItem.publicationDate = _formatNewsDate(newsItem.publicationDate);
   newsItem.changedDate = _formatNewsDate(newsItem.changedDate);
   //set views description
   if(newsItem.views && newsItem.views > 1) {
      newsItem.views = newsItem.views + ' visualizações';
   } else if(newsItem.views && newsItem.views === 1) {
      newsItem.views = newsItem.views + ' visualização';
   } else {
      newsItem.views = '';
   }
}

var _transformNewsItems = function(newsItems) {
   if(newsItems) {
      newsItems.forEach(function(newsItem) {
         _transformNewsItem(newsItem);
      });
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
module.exports.getLastNews = function(amountOfNewsItems) {
   return _requestService({
      url: _getNewsMethodURL(),
      method: "GET",
      json: true,
      qs: {
         page: 1,
         pageSize: amountOfNewsItems,
         publication: "PUBLISHED"
      },
      body: {}
   }).then(function(data) {
      //last update info
      if(data.news && data.news.length > 0) {
         var lastNewsUpdate = new Date(data.news[0].publicationDate);
         data.lastNewsUpdate = Utils.getElapsedTimeDescription(lastNewsUpdate);
      } else {
         data.lastNewsUpdate = null;
      }
      _transformNewsItems(data.news);
      return data;
   });
}

module.exports.getNews = function(filter, page, pageSize) {
   var qs = {
      'page': page,
      'pageSize': pageSize,
      'publication': "PUBLISHED"
   };

   //date1
   if(filter.keywords) {
      qs['keywords'] = filter.keywords;
   }

   //date1
   if(filter.date1) {
      qs['date1'] = filter.date1;
   }

   //date2
   if(filter.date2) {
      qs['date2'] = filter.date2;
   }

   return _requestService({
      'url': _getNewsMethodURL(),
      'method': "GET",
      'json': true,
      'qs': qs,
      'body': {}
   }).then(function(data) {
      _transformNewsItems(data.news);
      return data;
   });
}

module.exports.getItem = function(newsItemId) {
   return _requestService({
      url: _getNewsItemMethodURL() + "/" + newsItemId,
      method: "GET",
      json: true,
      body: {}
   }).then(function(result) {
      _transformNewsItem(result.newsItem);
      return result.newsItem;
   });
}

module.exports.incrementViews = function(newsItemId) {
   return _requestService({
      url: _getIncrementNewsViewsMethodURL() + "/" + newsItemId,
      method: "GET",
      json: true,
      body: {}
   });
}
