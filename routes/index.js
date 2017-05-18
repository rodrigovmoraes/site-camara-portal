var express = require('express');
var router = express.Router();

/*****************************************************************************
********************* REQUIRE CONTROLLERS MODULES ****************************
/*****************************************************************************/
var portalControllers = require('../controller/portalControllers');

/*****************************************************************************
***************************** ROUTER DEFINITIONS *****************************
/*****************************************************************************/
router.get('/', portalControllers.homePageController);
router.get('/index.html', portalControllers.homePageController);

module.exports = router;
