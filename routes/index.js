/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (LIBS MODULES) *******************************
/*****************************************************************************/
var winston = require('winston');
var express = require('express');
var router = express.Router();
var Utils = require('../services/camara/Utils.js');

/*****************************************************************************
********************* REQUIRE CONTROLLERS MODULES ****************************
/*****************************************************************************/
var portalControllers = require('../controller/portalControllers');
var popupRendersControllers = require('../controller/popupRendersControllers.js');

/*****************************************************************************
********************* REQUIRE SERVICES MODULES *******************************
/*****************************************************************************/
var camaraMenuService = require('../services/camara/MenuService');
var camaraBannersService = require('../services/camara/BannersService');

/*****************************************************************************
*********************** SET COMMON LOCALS FOR THE CONTROLLERS*****************
/*****************************************************************************/
router.use(function(req, res, next) {
   camaraMenuService.getMenuPortal().then(function(menuItems) {
      res.locals.menuItems = portalControllers.transformMenuItems(menuItems);
      return camaraBannersService.getBanners();
   }).then(function(banners) {
      res.locals.banners = portalControllers.transformBanners(banners);
      next();
   }).catch(function(err) {
      res.locals.menuItems = [];
      Utils.next(err.statusCode, err.error || err, next);
      winston.error("Error while getting items of the portal, err = [%s]", err);
   });
});

/*****************************************************************************
***************************** ROUTER DEFINITIONS *****************************
/*****************************************************************************/
router.get('/', portalControllers.homePageController);
router.get('/index.html', portalControllers.homePageController);
router.get('/newsitem.html', portalControllers.newsItemController);
router.get('/news.html', portalControllers.newsController);
router.get('/page.html', portalControllers.pageController);
//popup-renders
router.get('/popup-render-flickr-set-carousel.html', popupRendersControllers.flickrSetPopupRenderControllerCarousel);
router.get('/popup-render-flickr-set-big-single-image.html', popupRendersControllers.flickrSetPopupRenderControllerBigSingleImage);

module.exports = router;
