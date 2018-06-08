/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (LIBS MODULES) *******************************
/*****************************************************************************/
var winston = require('winston');
var config = require('config');
var NewsService = require('../services/camara/NewsService.js');
var PagesService = require('../services/camara/PagesService.js');
var AccessService = require('../services/camara/AccessService.js');
var camaraHotNewsService = require('../services/camara/HotNewsService');
var camaraBreakingNewsService = require('../services/camara/BreakingNewsService');
var camaraFBreakingNewsService = require('../services/camara/FBreakingNewsService');
var Utils = require('../services/camara/Utils.js');
var _ = require('lodash');

/*****************************************************************************
******************************* PRIVATE **************************************
/*****************************************************************************/
//transform hot news items to show in the portal page
var _transformHotNewsItems = function(hotNewsItems) {
   if(hotNewsItems) {
      var i;
      for(i = 0; i < hotNewsItems.length; i++) {
         var hotNewsItem = hotNewsItems[i];
         AccessService.transformAccess('hotNewsItem', hotNewsItem);
      }
   }
   return hotNewsItems;
}

//transform breaking news items to show in the portal page
var _transformBreakingNewsItems = function(breakingNewsItems) {
   if(breakingNewsItems) {
      var i;
      for(i = 0; i < breakingNewsItems.length; i++) {
         var breakingNewsItem = breakingNewsItems[i];
         if(breakingNewsItem.date) {
            breakingNewsItem.date = Utils.toDDMMYYYY(new Date(breakingNewsItem.date));
         }
         AccessService.transformAccess('breakingNewsItem', breakingNewsItem);
      }
   }
   return breakingNewsItems;
}

//transform fixed breaking news items to show in the portal page
var _transformFBreakingNewsItems = function(fbreakingNewsItems) {
   var imagesDimensions = config.FBreakingNews.imagesDimensions;

   if(fbreakingNewsItems) {
      var i;
      for(i = 0; i < fbreakingNewsItems.length; i++) {
         var fbreakingNewsItem = fbreakingNewsItems[i];
         if(fbreakingNewsItem.date) {
            fbreakingNewsItem.date = Utils.toDDMMYYYY(new Date(fbreakingNewsItem.date));
         }
         var imageDimension = imagesDimensions[fbreakingNewsItem.order.toString()]
         fbreakingNewsItem.imageWidth = imageDimension.width;
         fbreakingNewsItem.imageHeight = imageDimension.height;
         AccessService.transformAccess('fbreakingNewsItem', fbreakingNewsItem);
      }
   }
   return fbreakingNewsItems;
}

/*****************************************************************************
******************************* PUBLIC ***************************************
*****************************************************************************/
//module methods

/* GET '/index.html' page */
module.exports.homePageController = function(req, res, next) {
   var newsItems = null;
   var lastNewsUpdate  = null;
   var hotNewsItems = null;
   var breakingNewsItems = null;
   var fbreakingNewsItems = null;

   NewsService.getLastNews(9).then(function(data) {
      newsItems = data.news;
      lastNewsUpdate = data.lastNewsUpdate;
      return camaraHotNewsService.getHotNewsItems();
   }).then(function(photNewsItems) {
      hotNewsItems = _transformHotNewsItems(photNewsItems);
      return camaraBreakingNewsService.getBreakingNewsItems();
   }).then(function(pbreakingNewsItems) {
      breakingNewsItems = _transformBreakingNewsItems(pbreakingNewsItems);
      return camaraFBreakingNewsService.getFBreakingNewsItems();
   }).then(function(pfbreakingNewsItems) {
      fbreakingNewsItems = _transformFBreakingNewsItems(pfbreakingNewsItems);
      var fbreakingNewsItem1 = camaraFBreakingNewsService.getFBreakingNewsItemByOrder(fbreakingNewsItems, 1);
      var fbreakingNewsItem2 = camaraFBreakingNewsService.getFBreakingNewsItemByOrder(fbreakingNewsItems, 2);
      var fbreakingNewsItem3 = camaraFBreakingNewsService.getFBreakingNewsItemByOrder(fbreakingNewsItems, 3);
      res.render('index', {
          'news0': newsItems && 0 < newsItems.length ? newsItems[0] : null,
          'news1': newsItems && 1 < newsItems.length ? newsItems[1] : null,
          'news2': newsItems && 2 < newsItems.length ? newsItems[2] : null,
          'news3': newsItems && 3 < newsItems.length ? newsItems[3] : null,
          'news4': newsItems && 4 < newsItems.length ? newsItems[4] : null,
          'news5': newsItems && 5 < newsItems.length ? newsItems[5] : null,
          'news6': newsItems && 6 < newsItems.length ? newsItems[6] : null,
          'news7': newsItems && 7 < newsItems.length ? newsItems[7] : null,
          'news8': newsItems && 8 < newsItems.length ? newsItems[8] : null,
          'lastNewsUpdate': lastNewsUpdate,
          'hotNewsItems' : hotNewsItems,
          'breakingNewsItems' : breakingNewsItems,
          'fbreakingNewsItem1' : fbreakingNewsItem1,
          'fbreakingNewsItem2' : fbreakingNewsItem2,
          'fbreakingNewsItem3' : fbreakingNewsItem3
      });
   }).catch(function(err) {
      //render the error page
      Utils.next(err.statusCode, err.error, next);
   });
};

/* GET '/newsitem.html' page */
module.exports.newsItemController = function(req, res, next) {
   if(req.query.id) {
      NewsService.getItem(req.query.id).then(function(newsItem) {
         NewsService.incrementViews(req.query.id);
         //render the page
         res.render('newsitem', {
             'newsItem': newsItem
         });
      }).catch(function(err) {
         //render the error page
         Utils.next(err.statusCode, err.error, next);
      });
   } else {
      Utils.next(400, { message: "O id da notícia precisa ser definido" }, next);
   }
};

/* GET '/news.html' page */
module.exports.newsController = function(req, res, next) {
   //set the page and pageSize
   var page = 1;
   var pageSize = 9;
   var paginationSize = 11;
   var filter = {}; //keywords + date begin + date end

   //page
   if(req.query.page) {
      page = req.query.page;
   }

   //keywords
   if(req.query.keywords) {
      filter['keywords'] = req.query.keywords;
   }
   //publication date begin
   if(req.query.begin) {
      var date1 = Utils.toDateFromDDMMYYYY(req.query.begin);
      filter['date1'] = date1;
   }
   //publication date end
   if(req.query.end) {
      var date2 = Utils.toDateFromDDMMYYYY(req.query.end);
      date2.setHours(23);
      date2.setMinutes(59);
      date2.setSeconds(59);
      date2.setMilliseconds(999);
      filter['date2'] = date2;
   }

   NewsService.getNews(filter, page, pageSize).then(function(result) {
      var newsItems = result.news;
      var returnedPage = result.page;
      var pageCount = Math.ceil(result.totalLength / result.pageSize);

      var paginationLowerBound = Math.max(1, returnedPage - Math.floor(paginationSize / 2));
      var paginationUpperBound = Math.min(pageCount, paginationLowerBound + paginationSize - 1);
      //last pagination adjustment
      paginationLowerBound = Math.max(1, paginationUpperBound - paginationSize + 1);

      var pages = [];
      var i;
      for(i = paginationLowerBound; i <= paginationUpperBound; i++) {
         pages.push({
            'page': i,
            'active': i === returnedPage
         });
      }
      //render the page
      res.render('news', {
          'news': newsItems,
          'pages' : pages,
          'showPagination' : pageCount > 1,
          'pageCount' : pageCount,
          'begin' : req.query.begin ? req.query.begin : null,
          'end' : req.query.end ? req.query.end : null,
          'keywords' : req.query.keywords ? req.query.keywords : null
      });
   }).catch(function(err) {
      //render the error page
      Utils.next(err.statusCode, err.error, next);
   });
}

/* GET '/page.html' page */
module.exports.pageController = function(req, res, next) {
   if(req.query.id) {
      PagesService.getPage(req.query.id).then(function(page) {
         //render the page
         res.render('page', {
             'page': page
         });
      }).catch(function(err) {
         //render the error page
         Utils.next(err.statusCode, err.error, next);
      });
   } else {
      Utils.next(400, { message: "O id da página precisa ser definido" }, next);
   }
};

//transform menuItems to show in the portal page
var _transformMenuItemDFS = function(menuItem) {
   AccessService.transformAccess('menuItem', menuItem);
   if(menuItem.menuItems) {
      var i = 0;
      for(i = 0; i < menuItem.menuItems.length; i++) {
         var child = menuItem.menuItems[i];
         _transformMenuItemDFS(child);
      }
   }
}

module.exports.transformMenuItems = function(menuItems) {
   if(menuItems) {
      var i;
      for(i = 0; i < menuItems.length; i++) {
         var menuItem = menuItems[i];
         _transformMenuItemDFS(menuItem);
      }
   }
   return menuItems;
}

//transform banners to show in the portal page
module.exports.transformBanners = function(banners) {
   if(banners) {
      var i;
      for(i = 0; i < banners.length; i++) {
         var banner = banners[i];
         AccessService.transformAccess('banner', banner);
      }
   }
   return banners;
}
