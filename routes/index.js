var express = require('express');
var router = express.Router();

/*****************************************************************************
********************* REQUIRE CONTROLLERS MODULES ****************************
/*****************************************************************************/
var portalControllers = require('../controller/portalControllers');
var popupRendersControllers = require('../controller/popupRendersControllers.js');

/*****************************************************************************
***************************** ROUTER DEFINITIONS *****************************
/*****************************************************************************/
router.get('/', portalControllers.homePageController);
router.get('/index.html', portalControllers.homePageController);
//popup-renders
router.get('/popup-render-flickr-set-carousel.html', popupRendersControllers.flickrSetPopupRenderControllerCarousel);
router.get('/popup-render-flickr-set-big-single-image.html', popupRendersControllers.flickrSetPopupRenderControllerBigSingleImage);

module.exports = router;
