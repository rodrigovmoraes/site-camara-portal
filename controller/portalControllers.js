/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (LIBS MODULES) *******************************
/*****************************************************************************/
var winston = require('winston');
var config = require('config');
var NewsService = require('../services/camara/NewsService.js');
var PagesService = require('../services/camara/PagesService.js');
var AccessService = require('../services/camara/AccessService.js');
var camaraLicitacoesService = require('../services/camara/LicitacoesService');
var camaraHotNewsService = require('../services/camara/HotNewsService');
var camaraBreakingNewsService = require('../services/camara/BreakingNewsService');
var camaraFBreakingNewsService = require('../services/camara/FBreakingNewsService');
var camaraEventsCalendarService = require('../services/camara/EventsCalendarService');
var camaraLicitacoesService = require('../services/camara/LicitacoesService');
var camaraLegislativePropositionsService = require('../services/camara/LegislativePropositionsService');
var camaraSyslegisService = require('../services/camara/SyslegisService');
var camaraPublicFinancesService = require('../services/camara/PublicFinancesService');
var FlickrService = require('../services/FlickrService');
var YoutubeService = require('../services/YoutubeService');
var SyslegisApiConfigService = require('../services/camara/SyslegisApiConfigService');
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
         if (breakingNewsItem.date) {
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
         if (fbreakingNewsItem.date) {
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

//transform today events calendar
var _transformTodayEventsCalendar = function(todayEventsCalendar) {
   var events = [];
   if(todayEventsCalendar) {
      var i;
      for(i = 0; i < todayEventsCalendar.length; i++) {
         var todayEventsCalendarItem = todayEventsCalendar[i];
         events.push({
            'todayEventsCalendarId': todayEventsCalendarItem.id,
            'todayEventsCalendarDate': todayEventsCalendarItem.start_date,
            'todayEventsCalendarDateDescription': todayEventsCalendarItem.start_time_description,
            'todayEventsCalendarDescription': todayEventsCalendarItem.title,
            'todayEventsCalendarPlace': todayEventsCalendarItem.place
         });
      }
      return { 'todayDescription': Utils.getTodayDescription(),
               'todayEvents': events };
   }else {
      return { 'todayDescription': Utils.getTodayDescription(),
               'todayEvents': [] };
   }
}

//transform next events calendar
var _transformNextEventsCalendar = function(nextEventsCalendar) {
   var events = [];
   if(nextEventsCalendar) {
      var i;
      for(i = 0; i < nextEventsCalendar.length; i++) {
         var nextEventsCalendarItem = nextEventsCalendar[i];
         events.push({
            'nextEventsCalendarId': nextEventsCalendarItem.id,
            'nextEventsCalendarDate': nextEventsCalendarItem.start_date,
            'nextEventsCalendarDateDescription': nextEventsCalendarItem.start_date_description,
            'nextEventsCalendarTimeDescription': nextEventsCalendarItem.all_day ? '' : nextEventsCalendarItem.start_time_description,
            'nextEventsCalendarWeekdayDescription': nextEventsCalendarItem.start_weekday_description,
            'nextEventsCalendarDescription': nextEventsCalendarItem.title,
            'nextEventsCalendarPlace': nextEventsCalendarItem.place
         });
      }
      return events;
   }else {
      return [];
   }
}

var _transformEventCalendar = function(eventCalendar) {
   if (eventCalendar) {
      return {
         'eventCalendarId': eventCalendar.id,
         'eventCalendarAllDay' : eventCalendar.all_day,
         'eventCalendarStartDate': eventCalendar.start_date,
         'eventCalendarStartDateDescription': eventCalendar.start_date_description,
         'eventCalendarStartTimeDescription': eventCalendar.all_day ? '' : eventCalendar.start_time_description,
         'eventCalendarStartWeekdayDescription': eventCalendar.start_weekday_description,
         'eventCalendarEndDate': eventCalendar.end_date,
         'eventCalendarEndDateDescription': eventCalendar.end_date_description,
         'eventCalendarEndTimeDescription': eventCalendar.all_day ? '' : eventCalendar.end_time_description,
         'eventCalendarEndWeekdayDescription': eventCalendar.end_weekday_description,
         'eventCalendarTitle': eventCalendar.title,
         'eventCalendarDescription': eventCalendar.description,
         'eventCalendarPlace': eventCalendar.place
      };
   } else {
      return null;
   }
}

/*****************************************************************************
******************************* PUBLIC ***************************************
*****************************************************************************/
//module methods

/* GET '/index.html' page */
module.exports.homePageController = function(req, res, next) {
   var newsItems = null;
   var lastNewsUpdate  = null;
   var legislativePropositions  = null;
   var lastLegislativePropositionsUpdate = null;
   var lastProjetosDeLei = null;
   var lastProjetosDeLeiUpdate = null;
   var hotNewsItems = null;
   var breakingNewsItems = null;
   var fbreakingNewsItems = null;
   var todayEventsCalendar = null;
   var nextEventsCalendar = null;
   var lastLicitacoesEvents = null;
   var lastLicitacoesEventsUpdate = null;
   var lastPhotosets = null;
   var lastVideos = null;
   return camaraSyslegisService
     .getLastProjetosDeLei(8)
     .then(function(getLastProjetosDeLeiResult) {
         lastProjetosDeLei = getLastProjetosDeLeiResult.lastProjetosDeLei;
         lastProjetosDeLeiUpdate = getLastProjetosDeLeiResult.lastProjetosDeLeiUpdate;
         return YoutubeService.getLastVideos(7);
   }).then(function(plastVideos){
      lastVideos = plastVideos;
      return FlickrService.getLastPhotosets(7);
   }).then(function(plastPhotosets) {
      lastPhotosets = plastPhotosets;
      return NewsService.getLastNews(9);
   }).then(function(data) {
      newsItems = data.news;
      lastNewsUpdate = data.lastNewsUpdate;
      return camaraLegislativePropositionsService.getLastLegislativePropositions(8)
   }).then(function(getLastLegislativePropositionsResult){
      lastLegislativePropositionsUpdate = getLastLegislativePropositionsResult.lastLegislativePropositionsUpdate;
      legislativePropositions = getLastLegislativePropositionsResult.legislativePropositions;
      return camaraHotNewsService.getHotNewsItems();
   }).then(function(photNewsItems) {
      hotNewsItems = _transformHotNewsItems(photNewsItems);
      return camaraBreakingNewsService.getBreakingNewsItems();
   }).then(function(pbreakingNewsItems) {
      breakingNewsItems = _transformBreakingNewsItems(pbreakingNewsItems);
      return camaraEventsCalendarService.getTodayEvents();
   }).then(function(ptodayEventsCalendar) {
      todayEventsCalendar = _transformTodayEventsCalendar(ptodayEventsCalendar);
      return camaraEventsCalendarService.getNextEvents();
   }).then(function(pnextEventsCalendar) {
      nextEventsCalendar = _transformNextEventsCalendar(pnextEventsCalendar);
      return camaraFBreakingNewsService.getFBreakingNewsItems();
   }).then(function(pfbreakingNewsItems) {
      fbreakingNewsItems = _transformFBreakingNewsItems(pfbreakingNewsItems);
      return camaraLicitacoesService.getLastLicitacoesEvents(5);
   }).then(function(plastLicitacoesEvents) {
      lastLicitacoesEvents = plastLicitacoesEvents.events;
      lastLicitacoesEventsUpdate = plastLicitacoesEvents.lastUpdate;
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
          'todayEventsCalendar' : todayEventsCalendar,
          'nextEventsCalendar' : nextEventsCalendar,
          'fbreakingNewsItem1' : fbreakingNewsItem1,
          'fbreakingNewsItem2' : fbreakingNewsItem2,
          'fbreakingNewsItem3' : fbreakingNewsItem3,
          'lastLicitacoesEvents' : lastLicitacoesEvents,
          'lastLicitacoesEventsUpdate' : lastLicitacoesEventsUpdate,
          'legislativeProposition1': legislativePropositions && 0 < legislativePropositions.length ? legislativePropositions[0] : null,
          'legislativeProposition2': legislativePropositions && 1 < legislativePropositions.length ? legislativePropositions[1] : null,
          'legislativeProposition3': legislativePropositions && 2 < legislativePropositions.length ? legislativePropositions[2] : null,
          'legislativeProposition4': legislativePropositions && 3 < legislativePropositions.length ? legislativePropositions[3] : null,
          'legislativeProposition5': legislativePropositions && 4 < legislativePropositions.length ? legislativePropositions[4] : null,
          'legislativeProposition6': legislativePropositions && 5 < legislativePropositions.length ? legislativePropositions[5] : null,
          'legislativeProposition7': legislativePropositions && 6 < legislativePropositions.length ? legislativePropositions[6] : null,
          'legislativeProposition8': legislativePropositions && 7 < legislativePropositions.length ? legislativePropositions[7] : null,
          'lastProjetosDeLei1': lastProjetosDeLei && 0 < lastProjetosDeLei.length ? lastProjetosDeLei[0] : null,
          'lastProjetosDeLei2': lastProjetosDeLei && 1 < lastProjetosDeLei.length ? lastProjetosDeLei[1] : null,
          'lastProjetosDeLei3': lastProjetosDeLei && 2 < lastProjetosDeLei.length ? lastProjetosDeLei[2] : null,
          'lastProjetosDeLei4': lastProjetosDeLei && 3 < lastProjetosDeLei.length ? lastProjetosDeLei[3] : null,
          'lastProjetosDeLei5': lastProjetosDeLei && 4 < lastProjetosDeLei.length ? lastProjetosDeLei[4] : null,
          'lastProjetosDeLei6': lastProjetosDeLei && 5 < lastProjetosDeLei.length ? lastProjetosDeLei[5] : null,
          'lastProjetosDeLei7': lastProjetosDeLei && 6 < lastProjetosDeLei.length ? lastProjetosDeLei[6] : null,
          'lastProjetosDeLei8': lastProjetosDeLei && 7 < lastProjetosDeLei.length ? lastProjetosDeLei[7] : null,
          'lastLegislativePropositionsUpdate': lastLegislativePropositionsUpdate,
          'lastProjetosDeLeiUpdate': lastProjetosDeLeiUpdate,
          'lastFlickrPhotosets': lastPhotosets,
          'lastYoutubeVideos': lastVideos
      });
   }).catch(function(err) {
      //render the error page
      Utils.next(err.statusCode, err, next);
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
         Utils.next(err.statusCode, err, next);
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
      Utils.next(err.statusCode, err, next);
   });
}

/* GET '/fotos.html' page */
module.exports.fotosController = function(req, res, next) {
   if(req.query.setId)
   {
      //set the page and pageSize
      var page = 1;
      var pageSize = 9;
      var paginationSize = 11;
      var setId = req.query.setId;

      //page
      if(req.query.page) {
         page = req.query.page;
      }

      FlickrService.getPagePhotosFromSet(setId, 'z', page, pageSize)
                   .then(function(result) {
         var returnedPage = result.page;
         var pageCount = result.pageCount;

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
         res.render('fotos', {
             'flickrPhotoset': result,
             'pages' : pages,
             'showPagination' : pageCount > 1,
         });
      }).catch(function(err) {
         //render the error page
         Utils.next(err.statusCode, err, next);
      });
   } else {
      Utils.next(400, { message: "O id do álbum (setId) precisa ser definido" }, next);
   }
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
         Utils.next(err.statusCode, err, next);
      });
   } else {
      Utils.next(400, { message: "O id da página precisa ser definido" }, next);
   }
};

/* GET '/calendar.html' page */
module.exports.calendarController = function(req, res, next) {
   res.render('calendar');
};

/* GET '/event.html' page */
module.exports.showEventCalendarController = function(req, res, next) {
   if (req.query.id) {
      var idEvent = req.query.id;
      camaraEventsCalendarService
         .getEvent(idEvent)
         .then(function(event) {
            res.render('event', {
                'eventCalendar': _transformEventCalendar(event),
                'layout': '_layouts/clean'
            });
         }).catch(function(err) {
            //render the error page
            Utils.next(err.statusCode, err, next);
         });
   } else {
      Utils.next(400, { message: "O id do evento precisa ser definido" }, next);
   }
};

/* GET '/licitacoes.html' page */
module.exports.licitacoesController = function(req, res, next) {
   //set the page and pageSize
   var page = 1;
   var pageSize = 9;
   var paginationSize = 11;
   var filter = {}; //keywords + publication date begin + publication date end
   var categories;

   //page
   if(req.query.page) {
      page = req.query.page;
   }

   //keywords
   if(req.query.keywords) {
      filter['keywords'] = req.query.keywords;
   }
   //publication date begin
   if(req.query.publicationDate1) {
      var publicationDate1 = Utils.toDateFromDDMMYYYY(req.query.publicationDate1);
      filter['publicationDate1'] = publicationDate1;
   }
   //publication date end
   if(req.query.publicationDate2) {
      var publicationDate2 = Utils.toDateFromDDMMYYYY(req.query.publicationDate2);
      publicationDate2.setHours(23);
      publicationDate2.setMinutes(59);
      publicationDate2.setSeconds(59);
      publicationDate2.setMilliseconds(999);
      filter['publicationDate2'] = publicationDate2;
   }
   //category
   if(req.query.category) {
      filter['category'] = req.query.category;
   }

   //number
   if(req.query.number) {
      filter['number'] = req.query.number;
   }

   //year
   if(req.query.year) {
      filter['year'] = req.query.year;
   }

   if(req.query.number && req.query.year) {
      filter = {
         'number' : req.query.number,
         'year' : req.query.year
      }
   }

   camaraLicitacoesService
      .getLicitacoesCategories()
      .then(function(categoriesResult) {
         categories = categoriesResult;
         var i;
         if(categories) {
            for(i = 0; i < categories.length; i++) {
               if( filter.category &&
                   filter.category === categories[i].licitacaoCategoryId) {
                  categories[i]['licitacaoCategorySelect'] = true;
               } else {
                  categories[i]['licitacaoCategorySelect'] = false;
               }
            }
         }
         return camaraLicitacoesService.getLicitacoes(filter, page, pageSize);
      }).then(function(result) {
         var licitacoesItems = result.licitacoes;
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
         res.render('licitacoes', {
             'licitacoes': licitacoesItems,
             'licitacoesCategories' : categories,
             'pages' : pages,
             'showPagination' : pageCount > 1,
             'pageCount' : pageCount,
             'publicationDate1' : req.query.publicationDate1 ? req.query.publicationDate1 : null,
             'publicationDate2' : req.query.publicationDate2 ? req.query.publicationDate2 : null,
             'category' : req.query.category ? req.query.category : null,
             'keywords' : req.query.keywords ? req.query.keywords : null,
             'number' : req.query.number ? req.query.number : null,
             'year' : req.query.year ? req.query.year : null
         });
      }).catch(function(err) {
         //render the error page
         Utils.next(err.statusCode, err, next);
      });
}

/* GET '/licitacao.html' page */
module.exports.licitacaoController = function(req, res, next) {
   if(req.query.id) {
      camaraLicitacoesService.getLicitacao(req.query.id).then(function(licitacao) {
         //render the page
         res.render('licitacao', {
             'licitacao': licitacao
         });
      }).catch(function(err) {
         //render the error page
         Utils.next(err.statusCode, err, next);
      });
   } else {
      Utils.next(400, { message: "O id da licitação precisa ser definido" }, next);
   }
};

/* GET '/proposituras.html' page */
module.exports.propositurasController = function(req, res, next) {
   //set the page and pageSize
   var page = 1;
   var pageSize = 10;
   var paginationSize = 11;
   var filter = {}; //keywords + publication date begin + publication date end
   var types;
   var printLimit = 50;

   var printMode = req.query.print;

   //page
   if(req.query.page) {
      page = req.query.page;
   }

   //keywords
   if(req.query.keywords) {
      filter['keywords'] = req.query.keywords;
   }
   //publication date begin
   if(req.query.publicationDate1) {
      var publicationDate1 = Utils.toDateFromDDMMYYYY(req.query.publicationDate1);
      filter['date1'] = publicationDate1;
   }
   //publication date end
   if(req.query.publicationDate2) {
      var publicationDate2 = Utils.toDateFromDDMMYYYY(req.query.publicationDate2);
      publicationDate2.setHours(23);
      publicationDate2.setMinutes(59);
      publicationDate2.setSeconds(59);
      publicationDate2.setMilliseconds(999);
      filter['date2'] = publicationDate2;
   }
   //category
   if(req.query.type) {
      filter['type'] = req.query.type;
   }

   //number
   if(req.query.number) {
      filter['number'] = req.query.number;
   }

   //year
   if(req.query.year) {
      filter['year'] = req.query.year;
   }

   //if it is print mode, set limit to 1000 and without pagination
   if (printMode) {
      page = 1;
      //limit and offset
      pageSize = printLimit;
   }

   camaraLegislativePropositionsService
      .getLegislativePropositionTypes()
      .then(function(typesResult) {
         types = typesResult;
         var i;
         if(types) {
            for(i = 0; i < types.length; i++) {
               if( filter.type &&
                   filter.type === types[i].legislativePropositionTypeId) {
                  types[i]['legislativePropositionTypeSelect'] = true;
               } else {
                  types[i]['legislativePropositionTypeSelect'] = false;
               }
            }
         }
         return camaraLegislativePropositionsService.getLegislativePropositions(filter, page, pageSize);
      }).then(function(result) {
         var legislativePropositionsItems = result.legislativePropositions;
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
         res.render('proposituras', {
             'legislativePropositions': legislativePropositionsItems,
             'legislativePropositionTypes': types,
             'pages': printMode ? [] : pages,
             'showPagination': pageCount > 1 && !printMode,
             'pageCount': printMode ? 1 : pageCount,
             'publicationDate1': req.query.publicationDate1 ? req.query.publicationDate1 : null,
             'publicationDate2': req.query.publicationDate2 ? req.query.publicationDate2 : null,
             'type': req.query.type ? req.query.type : null,
             'keywords': req.query.keywords ? req.query.keywords : null,
             'number': req.query.number ? req.query.number : null,
             'year': req.query.year ? req.query.year : null,
             'print': printMode,
             'overPrint': printMode ? result.totalLength > printLimit : false,
             'printLimit': printMode ? printLimit : null,
             'printTotalCount': printMode ? result.totalLength : null
         });
      }).catch(function(err) {
         //render the error page
         Utils.next(err.statusCode, err, next);
      });
}

/* GET '/propositura.html' page */
module.exports.proposituraController = function(req, res, next) {
   if (req.query.id) {
      camaraLegislativePropositionsService
      .getLegislativeProposition(req.query.id)
      .then(function(legislativeProposition) {
         var result = {};
         result.legislativeProposition = legislativeProposition;
         if(req.query.print) {
            result.print = true;
         } else {
            result.print = false;
         }
         //render the page
         res.render('propositura', result);
      }).catch(function(err) {
         //render the error page
         Utils.next(err.statusCode, err, next);
      });
   } else {
      Utils.next(400, { message: "O id da propositura precisa ser definido" }, next);
   }
}

/* GET '/propositura_texto_anexo.html' page */
module.exports.proposituraTextoAnexoController = function(req, res, next) {
   if (req.query.id) {
      camaraLegislativePropositionsService
      .getLegislativeProposition(req.query.id)
      .then(function(legislativeProposition) {
         var result = {};
         result.legislativeProposition = legislativeProposition;
         if(req.query.print) {
            result.print = true;
         } else {
            result.print = false;
         }
         //render the page
         res.render('propositura_texto_anexo', result);
      }).catch(function(err) {
         //render the error page
         Utils.next(err.statusCode, err, next);
      });
   } else {
      Utils.next(400, { message: "O id da propositura precisa ser definido" }, next);
   }
};

/* GET '/propositura_arquivos_anexos.html' page */
module.exports.proposituraArquivosAnexosController = function(req, res, next) {
   if (req.query.id) {
      camaraLegislativePropositionsService
      .getLegislativeProposition(req.query.id)
      .then(function(legislativeProposition) {
         //render the page
         res.render('propositura_arquivos_anexos', {
             'legislativeProposition': legislativeProposition
         });
      }).catch(function(err) {
         //render the error page
         Utils.next(err.statusCode, err, next);
      });
   } else {
      Utils.next(400, { message: "O id da propositura precisa ser definido" }, next);
   }
};

/* GET '/materias.html' page */
module.exports.materiasLegislativasController = function(req, res, next) {
   //set the page and pageSize
   var page = 1;
   var pageSize = 10;
   var paginationSize = 11;
   var filter = {};
   var types;
   var body = req.body;
   var unidadesDeTramitacao = null;
   var tiposDeMateria = null;
   var autores = null;
   var listaDeStatusDeTramitacao = null;
   var classificacoes = null;
   var printLimit = 50;

   if(req.method === 'GET') {
      body = req.query;
   }

   var printMode = body.print;

   //page
   if(body.page) {
      page = parseInt(body.page);
   }
   //limit and offset
   filter['limit'] = pageSize;
   filter['offset'] = (page - 1) * pageSize;
   //autor id
   if(body.autorId) {
      filter['autorId'] = parseInt(body.autorId);
   }
   //tipo de materia
   if(body.tipoMateriaId) {
      filter['tipoMateriaId'] = parseInt(body.tipoMateriaId);
   }
   //numero da materia
   if(body.numeroMateria) {
      filter['numeroMateria'] = parseInt(body.numeroMateria);
   }
   //ano
   if(body.anoMateria) {
      filter['anoMateria'] = parseInt(body.anoMateria);
   }
   //emTramitacao
   if(body.emTramitacao) {
      if(body.emTramitacao === "1") {
         filter['emTramitacao'] = 1;
      } else if(body.emTramitacao === "0") {
         filter['emTramitacao'] = 0;
      }
   }
   //palavras-chave
   if(body.palavrasChave) {
      filter['palavrasChave'] = body.palavrasChave;
   }
   //data da apresentacao inicial
   if(body.dataApresentacaoInicial) {
      filter['dataApresentacaoInicial'] = Utils.toDateFromDDMMYYYY(body.dataApresentacaoInicial);
   }
   //data da apresentacao final
   if(body.dataApresentacaoFinal) {
      filter['dataApresentacaoFinal'] = Utils.toDateFromDDMMYYYY(body.dataApresentacaoFinal);
   }
   //data da publicacao inicial
   if(body.dataPublicacaoInicial) {
      filter['dataPublicacaoInicial'] = Utils.toDateFromDDMMYYYY(body.dataPublicacaoInicial);
   }
   //data da publicacao final
   if(body.dataPublicacaoFinal) {
      filter['dataPublicacaoFinal'] = Utils.toDateFromDDMMYYYY(body.dataPublicacaoFinal);
   }
   //data fim de prazo executivo inicial
   if(body.dataPrazoExecutivoInicial) {
      filter['dataPrazoExecutivoInicial'] = Utils.toDateFromDDMMYYYY(body.dataPrazoExecutivoInicial);
   }
   //data fim de prazo executivo final
   if(body.dataPrazoExecutivoFinal) {
      filter['dataPrazoExecutivoFinal'] = Utils.toDateFromDDMMYYYY(body.dataPrazoExecutivoFinal);
   }
   //data fim de prazo do processo (data inicial para o filtro da pesquisa)
   if(body.dataPrazoProcessoInicial) {
      filter['dataPrazoProcessoInicial'] = Utils.toDateFromDDMMYYYY(body.dataPrazoProcessoInicial);
   }
   //data fim de prazo do processo (data final para o filtro da pesquisa)
   if(body.dataPrazoProcessoFinal) {
      filter['dataPrazoProcessoFinal'] = Utils.toDateFromDDMMYYYY(body.dataPrazoProcessoFinal);
   }
   //localizacao
   if(body.localizacaoId) {
      filter['localizacaoId'] = parseInt(body.localizacaoId);
   }
   //status tramitacao
   if(body.statusTramitacaoId) {
      filter['statusTramitacaoId'] = parseInt(body.statusTramitacaoId);
   }
   //classificacao
   if(body.classificacaoId) {
      filter['classificacaoId'] = parseInt(body.classificacaoId);
   }

   //if it is print mode, set limit to 1000 and without pagination
   if (printMode) {
      page = 1;
      //limit and offset
      filter['limit'] = printLimit;
      filter['offset'] = 0;
   }

   return camaraSyslegisService
      .getClassificacoes()
      .then(function(pclassificacoes) {
         classificacoes = pclassificacoes;
         //select classificacao
         if(filter.classificacaoId && classificacoes) {
            for(i = 0; i < classificacoes.length; i++) {
               classificacoes[i]['classificacaoSelect'] = filter.classificacaoId ===  classificacoes[i].classificacaoId;
            }
         }
         return camaraSyslegisService.getListaDeStatusDeTramitacao();
      }).then(function(plistaDeStatusDeTramitacao) {
         listaDeStatusDeTramitacao = plistaDeStatusDeTramitacao;
         //select status tramitacao
         if(filter.statusTramitacaoId && listaDeStatusDeTramitacao) {
            for(i = 0; i < listaDeStatusDeTramitacao.length; i++) {
               listaDeStatusDeTramitacao[i]['statusDeTramitacaoSelect'] = filter.statusTramitacaoId ===  listaDeStatusDeTramitacao[i].statusDeTramitacaoId;
            }
         }
         return camaraSyslegisService.getUnidadesDeTramitacao();
      }).then(function(punidadesDeTramitacao) {
         unidadesDeTramitacao = punidadesDeTramitacao;
         //select unidade de tramitacao
         if(filter.localizacaoId && unidadesDeTramitacao) {
            for(i = 0; i < unidadesDeTramitacao.length; i++) {
               unidadesDeTramitacao[i]['unidadeDeTramitacaoSelect'] = filter.localizacaoId ===  unidadesDeTramitacao[i].materiaUnidadeTramitacaoId;
            }
         }
         return camaraSyslegisService.getAutores();
      }).then(function(pautores) {
         autores = pautores;
         //select autor
         if(filter.autorId && autores) {
            for(i = 0; i < autores.length; i++) {
               autores[i]['materiaAutoreSelect'] = filter.autorId ===  autores[i].materiaAutorId;
            }
         }
         return camaraSyslegisService.getTiposDeMateria();
      }).then(function(ptiposDeMateria) {
         var i;
         tiposDeMateria = ptiposDeMateria;
         //select tipo de materia
         if(filter.tipoMateriaId && tiposDeMateria) {
            for(i = 0; i < tiposDeMateria.length; i++) {
               tiposDeMateria[i]['tipoDeMateriaSelect'] = filter.tipoMateriaId ===  tiposDeMateria[i].tipoDeMateriaId;
            }
         }
         return camaraSyslegisService.pesquisaMateriasLegislativas(filter);
      }).then(function(result) {
         var materiasLegislativasItems = result.materiasLegislativas;
         var pageCount = Math.ceil(result.total / pageSize);
         var returnedPage = page > pageCount ? pageCount : page;

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
         res.render('materias', {
            'materiasLegislativas': materiasLegislativasItems,
            'unidadesDeTramitacao': unidadesDeTramitacao,
            'tiposDeMateria': tiposDeMateria,
            'materiaAutores': autores,
            'materiaAutores': autores,
            'listaDeStatusDeTramitacao': listaDeStatusDeTramitacao,
            'classificacoes': classificacoes,
            'pages': printMode ? [] : pages,
            'showPagination': pageCount > 1 && !printMode,
            'pageCount': printMode ? 1 : pageCount,
            'numeroMateria': body.numeroMateria ? body.numeroMateria : '',
            'anoMateria': body.anoMateria ? body.anoMateria : '',
            'palavrasChave': body.palavrasChave ? body.palavrasChave : '',
            'dataApresentacaoInicial': body.dataApresentacaoInicial ? body.dataApresentacaoInicial : '',
            'dataApresentacaoFinal': body.dataApresentacaoFinal ? body.dataApresentacaoFinal : '',
            'dataPrazoExecutivoInicial': body.dataPrazoExecutivoInicial ? body.dataPrazoExecutivoInicial : '',
            'dataPrazoExecutivoFinal': body.dataPrazoExecutivoFinal ? body.dataPrazoExecutivoFinal : '',
            'dataPrazoProcessoInicial': body.dataPrazoProcessoInicial ? body.dataPrazoProcessoInicial : '',
            'dataPrazoProcessoFinal': body.dataPrazoProcessoFinal ? body.dataPrazoProcessoFinal : '',
            'statusTramitacaoId': body.statusTramitacaoId ? body.statusTramitacaoId : '',
            'classificacaoId': body.classificacaoId ? body.classificacaoId : '',
            'emTramitacaoSim': body.emTramitacao === "1",
            'emTramitacaoNao': body.emTramitacao === "0",
            'emTramitacaoTodos': !(body.emTramitacao === "1" ||  body.emTramitacao === "0"),
            'print': printMode,
            'overPrint': printMode ? result.total > printLimit : false,
            'printLimit': printMode ? printLimit : null,
            'printTotalCount': printMode ? result.total : null
         });
      }).catch(function(err) {
         //render the error page
         Utils.next(err.statusCode, err, next);
      });
}

module.exports.materiaLegislativaController = function(req, res, next) {
   if (req.query.id) {
      return camaraSyslegisService
      .getMateriaLegislativa(req.query.id)
      .then(function(result) {
         //render the page
         result.materiaTextoOriginalUrlDownload = SyslegisApiConfigService.getMateriaTextoOriginalUrlDownload();
         result.materiaTextoFinalUrlDownload = SyslegisApiConfigService.getMateriaTextoFinalUrlDownload();
         result.documentoAcessorioUrlDownload = SyslegisApiConfigService.getDocumentoAcessorioUrlDownload();
         if(req.query.print) {
            result.print = true;
         } else {
            result.print = false;
         }
         res.render('materia', result);
      }).catch(function(err) {
         //render the error page
         Utils.next(err.statusCode, err, next);
      });
   } else {
      Utils.next(400, { message: "O id da materia precisa ser definido" }, next);
   }
}

/* GET '/albuns.html' page */
module.exports.albunsController = function(req, res, next) {
   //set the page and pageSize
   var page = 1;
   var pageSize = 9;
   var paginationSize = 11;
   var filter = {}; //keywords + date begin + date end
   var types;

   //page
   if(req.query.page) {
      page = req.query.page;
   }

   //keywords
   if(req.query.keywords) {
      filter['keywords'] = req.query.keywords;
   }
   // date begin
   if(req.query.begin) {
      var date1 = Utils.toDateFromDDMMYYYY(req.query.begin);
      filter['date1'] = date1;
   }
   //date end
   if(req.query.end) {
      var date2 = Utils.toDateFromDDMMYYYY(req.query.end);
      date2.setHours(23);
      date2.setMinutes(59);
      date2.setSeconds(59);
      date2.setMilliseconds(999);
      filter['date2'] = date2;
   }

   FlickrService
      .getPhotosetsPage(filter, page, pageSize)
      .then(function(result) {
         var photosets = result.photosets;
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
         res.render('albuns', {
             'flickrPhotoset': photosets,
             'pages': pages,
             'showPagination': pageCount > 1,
             'pageCount': pageCount,
             'begin': req.query.begin ? req.query.begin : null,
             'end': req.query.end ? req.query.end : null,
             'keywords': req.query.keywords ? req.query.keywords : null
         });
      }).catch(function(err) {
         //render the error page
         Utils.next(err.statusCode, err, next);
      });
}

/* GET '/videos.html' page */
module.exports.videosController = function(req, res, next) {
   //set the page and pageSize
   var pageToken = null;
   var pageSize = 9;
   var filter = {}; //keywords + date begin + date end

   //page
   if(req.query.pageToken) {
      pageToken = req.query.pageToken;
   }

   //keywords
   if(req.query.keywords) {
      filter['q'] = req.query.keywords;
   }
   // date begin
   if(req.query.begin) {
      var date1 = Utils.toDateFromDDMMYYYY(req.query.begin);
      filter['publishedAfter'] = date1;
   }
   //date end
   if(req.query.end) {
      var date2 = Utils.toDateFromDDMMYYYY(req.query.end);
      date2.setHours(23);
      date2.setMinutes(59);
      date2.setSeconds(59);
      date2.setMilliseconds(999);
      filter['publishedBefore'] = date2;
   }

   YoutubeService
      .getVideosPage(filter, pageToken, pageSize)
      .then(function(result) {
         //render the page
         res.render('videos', {
             'youtubeVideos': result.videos,
             'nextPageToken': result.nextPageToken,
             'prevPageToken': result.prevPageToken,
             'totalResults': result.totalResults,
             'showPagination': result.nextPageToken || result.prevPageToken,
             'begin': req.query.begin ? req.query.begin : null,
             'end': req.query.end ? req.query.end : null,
             'keywords': req.query.keywords ? req.query.keywords : null
         });
      }).catch(function(err) {
         //render the error page
         Utils.next(err.statusCode, err, next);
      });
}

/* GET '/ordens_do_dia.html' page */
module.exports.ordensDoDiaController = function(req, res, next) {
   //set the page and pageSize
   var page = 1;
   var pageSize = 9;
   var paginationSize = 11;
   var filter = {};
   var anos = null;
   var meses = [];
   var dias = [];

   var k = 0;

   //page
   if(req.query.page) {
      page = parseInt(req.query.page);
   }
   //limit and offset
   filter['limit'] = pageSize;
   filter['offset'] = (page - 1) * pageSize;

   //build the filter object based on request params
   if (req.query.ano) {
      filter.ano = parseInt(req.query.ano);
   }
   if (req.query.mes) {
      filter.mes = parseInt(req.query.mes);
   }
   if (req.query.dia) {
      filter.dia = parseInt(req.query.dia);
   }

   //meses
   for(k = 1; k <= 12; k++) {
      if (filter.mes && k === filter.mes) {
         meses.push({ mesValue: k, mesSelect: true });
      } else {
         meses.push({ mesValue: k, mesSelect: false });
      }
   }
   //dias
   for(k = 1; k <= 31; k++) {
      if(filter.dia && k === filter.dia) {
         dias.push({ diaValue: k, diaSelect: true });
      } else {
         dias.push({ diaValue: k, diaSelect: false });
      }
   }

   return camaraSyslegisService
      .getOrdemDoDiaListaDeAnos()
      .then(function(panos) {
         anos = panos;
         for(k = 0; k < anos.length; k++) {
            if(filter.ano && anos[k].anoValue === filter.ano) {
               anos[k]['anoSelect'] = true;
            } else {
               anos[k]['anoSelect'] = false;
            }
         }
         return camaraSyslegisService.getOrdensDoDia(filter);
      }).then(function(result) {
         var ordensDoDia = result.ordensDoDia;
         var pageCount = Math.ceil(result.total / pageSize);
         var returnedPage = page > pageCount ? pageCount : page;

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
         res.render('ordens_do_dia', {
            'ordensDoDia': ordensDoDia,
            'pages': pages,
            'showPagination': pageCount > 1,
            'pageCount': pageCount,
            'anos': anos,
            'meses': meses,
            'dias': dias,
            'ano': req.query.ano,
            'mes': req.query.mes,
            'dia': req.query.dia
         });
      }).catch(function(err) {
         //render the error page
         Utils.next(err.statusCode, err, next);
      });
}

/* GET '/comissoes.html' page */
module.exports.comissoesController = function(req, res, next) {
   //set the page and pageSize
   var filter = {};
   var k;
   var filterSessoesLegislativas = {};
   var legislaturas = null;
   var sessoesLegislativas = null;
   var comissoes = null;

   //build the filter object based on request params
   if (req.query.sessaoAtual) {
      filter.sessaoAtual = parseInt(req.query.sessaoAtual);
   }
   if (req.query.sessaoId) {
      filter.sessaoId = parseInt(req.query.sessaoId);
   }
   if (req.query.legislaturaId) {
      filter.legislaturaId = parseInt(req.query.legislaturaId);
      filterSessoesLegislativas.legislaturaId = parseInt(req.query.legislaturaId);
   }
   return camaraSyslegisService
      .getLegislaturas()
      .then(function(plegislaturas) {
         legislaturas = plegislaturas;
         for(k = 0; k < legislaturas.length; k++) {
            if(filter.legislaturaId && legislaturas[k]['Legislaturas_id'] === filter.legislaturaId) {
               legislaturas[k]['legislaturaSelect'] = true;
            } else if(!filter.legislaturaId) {
               if(k === 0) {
                  legislaturas[k]['legislaturaSelect'] = true;
                  filter.legislaturaId = legislaturas[k]['Legislaturas_id'];
                  filterSessoesLegislativas.legislaturaId = legislaturas[k]['Legislaturas_id'];
               }
            }
            else {
               legislaturas[k]['legislaturaSelect'] = false;
            }
         }
         return camaraSyslegisService.getSessoesLegislativas(filterSessoesLegislativas);
      }).then(function(psessoesLegislativas) {
         sessoesLegislativas = psessoesLegislativas;
         for(k = 0; k < sessoesLegislativas.length; k++) {
            if(filter.sessaoId && sessoesLegislativas[k]['SessoesLegislativas_id'] === filter.sessaoId) {
               sessoesLegislativas[k]['sessaoLegislativaSelect'] = true;
            } else if(!filter.sessaoId) {
               if (k === 0) {
                  sessoesLegislativas[k]['sessaoLegislativaSelect'] = true;
                  filter.sessaoId = sessoesLegislativas[k]['SessoesLegislativas_id'];
               }
            } else {
               sessoesLegislativas[k]['sessaoLegislativaSelect'] = false;
            }
         }
         return camaraSyslegisService.getComissoes(filter);
      }).then(function(pcomissoes) {
         var comissoes = pcomissoes;
         //render the page
         res.render('comissoes', {
            'Comissoes_legislaturas': comissoes,
            'legislaturas': legislaturas,
            'sessoesLegislativas': sessoesLegislativas,
            'sessaoId': filter.sessaoId,
            'legislaturaId': filter.legislaturaId
         });
      }).catch(function(err) {
         //render the error page
         Utils.next(err.statusCode, err, next);
      });
}

/* GET '/mesa_diretora.html' page */
module.exports.mesaDiretoraController = function(req, res, next) {
   //set the page and pageSize
   var filter = {};
   var k;
   var filterSessoesLegislativas = {};
   var legislaturas = null;
   var sessoesLegislativas = null;
   var mesasDiretoras = null;

   //build the filter object based on request params
   if (req.query.sessaoAtual) {
      filter.sessaoAtual = parseInt(req.query.sessaoAtual);
   }
   if (req.query.sessaoId) {
      filter.sessaoId = parseInt(req.query.sessaoId);
   }
   if (req.query.legislaturaId) {
      filter.legislaturaId = parseInt(req.query.legislaturaId);
      filterSessoesLegislativas.legislaturaId = parseInt(req.query.legislaturaId);
   }
   return camaraSyslegisService
      .getLegislaturas()
      .then(function(plegislaturas) {
         legislaturas = plegislaturas;
         for(k = 0; k < legislaturas.length; k++) {
            if(filter.legislaturaId && legislaturas[k]['Legislaturas_id'] === filter.legislaturaId) {
               legislaturas[k]['legislaturaSelect'] = true;
            } else if(!filter.legislaturaId) {
               if(k === 0) {
                  legislaturas[k]['legislaturaSelect'] = true;
                  filter.legislaturaId = legislaturas[k]['Legislaturas_id'];
                  filterSessoesLegislativas.legislaturaId = legislaturas[k]['Legislaturas_id'];
               }
            }
            else {
               legislaturas[k]['legislaturaSelect'] = false;
            }
         }
         return camaraSyslegisService.getSessoesLegislativas(filterSessoesLegislativas);
      }).then(function(psessoesLegislativas) {
         sessoesLegislativas = psessoesLegislativas;
         for(k = 0; k < sessoesLegislativas.length; k++) {
            if(filter.sessaoId && sessoesLegislativas[k]['SessoesLegislativas_id'] === filter.sessaoId) {
               sessoesLegislativas[k]['sessaoLegislativaSelect'] = true;
            } else if(!filter.sessaoId) {
               if (k === 0) {
                  sessoesLegislativas[k]['sessaoLegislativaSelect'] = true;
                  filter.sessaoId = sessoesLegislativas[k]['SessoesLegislativas_id'];
               }
            } else {
               sessoesLegislativas[k]['sessaoLegislativaSelect'] = false;
            }
         }
         return camaraSyslegisService.getMesaDiretora(filter);
      }).then(function(pmesasDiretoras) {
         var mesasDiretoras = pmesasDiretoras;
         //render the page
         res.render('mesa_diretora', {
            'MesaDiretora_legislaturas': mesasDiretoras,
            'legislaturas': legislaturas,
            'sessoesLegislativas': sessoesLegislativas,
            'sessaoId': filter.sessaoId,
            'legislaturaId': filter.legislaturaId
         });
      }).catch(function(err) {
         //render the error page
         Utils.next(err.statusCode, err, next);
      });
}

/* GET '/vereadores.html' page */
module.exports.vereadoresController = function(req, res, next) {
   //set the page and pageSize
   var filter = {};
   var k;
   var legislaturas = null;
   var vereadores = null;

   //build the filter object based on request params
   if (req.query.legislaturaId) {
      filter.legislaturaId = parseInt(req.query.legislaturaId);
   } else {
      filter.legislaturaAtual = req.query.legislaturaAtual;
   }
   return camaraSyslegisService
      .getLegislaturas()
      .then(function(plegislaturas) {
         legislaturas = plegislaturas;
         for(k = 0; k < legislaturas.length; k++) {
            if(filter.legislaturaId && legislaturas[k]['Legislaturas_id'] === filter.legislaturaId) {
               legislaturas[k]['legislaturaSelect'] = true;
               if(k === 0) {
                  filter.legislaturaAtual = 1;
                  filter.legislaturaId = null;
               }
            } else if(!filter.legislaturaId) {
               if(k === 0) {
                  legislaturas[k]['legislaturaSelect'] = true;
                  filter.legislaturaAtual = 1;
                  filter.legislaturaId = null;
               }
            }
            else {
               legislaturas[k]['legislaturaSelect'] = false;
            }
         }
         return camaraSyslegisService.getVereadores(filter);
      }).then(function(pvereadores) {
         var vereadores = pvereadores;
         //render the page
         res.render('vereadores', {
            'Vereadores_legislaturas': vereadores,
            'legislaturas': legislaturas,
            'legislaturaId': filter.legislaturaId,
            'vereadorImageUrl': SyslegisApiConfigService.getVereadorImageUrl()
         });
      }).catch(function(err) {
         //render the error page
         Utils.next(err.statusCode, err, next);
      });
}

/* GET '/vereador.html' page */
module.exports.vereadorController = function(req, res, next) {
   if (req.query.id) {
      var result = {};

      return camaraSyslegisService
      .getVereador(req.query.id)
      .then(function(vereador) {
         result['Vereador_vereador'] = vereador;
         return camaraSyslegisService.getVereadorResumoMaterias(req.query.id);
      }).then(function(resultResumoVereador) {
         result['VereadorResumo_resumo'] = resultResumoVereador.resumo;
         result['VereadorResumo_resumoTotal'] = resultResumoVereador.total;
         result['vereadorImageUrl'] = SyslegisApiConfigService.getVereadorImageUrl();
         res.render('vereador', result);
      }).catch(function(err) {
         //render the error page
         Utils.next(err.statusCode, err, next);
      });
   } else {
      Utils.next(400, { message: "O id do vereador precisa ser definido" }, next);
   }
}

/* GET '/contas_publicas.html' page */
module.exports.contasPublicas = function(req, res, next) {
   var folderId = null;
   var folderPath = null;

   if (req.query.id) {
      folderId = req.query.id
   };

   return camaraPublicFinancesService
   .getFolderPath(req.query.id)
   .then(function(pfolderPath) {
      folderPath = pfolderPath;
      return camaraPublicFinancesService.getFolderContents(folderId);
   }).then(function(objects) {
      res.render('contas_publicas', {
         'ContasPublicas_objects': objects,
         'ContasPublicas_folderPath': folderPath
      });
   }).catch(function(err) {
      //render the error page
      Utils.next(err.statusCode, err, next);
   });
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
