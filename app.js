/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (LIBS MODULES) *******************************
/*****************************************************************************/
require('dotenv').load();
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var config = require('config');

/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (APPS MODULES) *******************************
/*****************************************************************************/
var defaultViewMiddleware = require('./middlewares/default-view.js')('./views');
var FlickrService = require('./services/FlickrService.js');

//-----------------------------------------------------------------------------
var app = express();

/*****************************************************************************
********************* MIDDLEWARES CONFIG SECTION *****************************
/*****************************************************************************/
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//templating config
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');    // use .html extension for templates
app.set('layout', '_layouts/layout');       // use layout.html as the default layout
app.enable('view cache');
app.engine('html', require('hogan-express'));
//routes config
// portal routes
var portalRoutes = require('./routes/index.js')
app.use('/', portalRoutes);

//if an existing file in the views folder is requested,
//return its content applying the layout
app.use(defaultViewMiddleware);

/*****************************************************************************
************************ ERROR HANDLING  SECTION *****************************
/*****************************************************************************/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/*****************************************************************************
***************************** APP CONFIG SECTION *****************************
/*****************************************************************************/
//Services
var FlickServiceConfig = config.get('Services.FlickrService');
FlickrService.setFlickrApiBaseUrl(FlickServiceConfig.flickrApiBaseUrl);
FlickrService.setFlickrApiKey(FlickServiceConfig.flickrApiKey);
FlickrService.setFlickrApiGetPhotosMethod(FlickServiceConfig.flickrApiGetPhotosMethod);
FlickrService.setUnexpectedFlickrDataFormatErrorMessage(FlickServiceConfig.unexpectedFlickrDataFormatErrorMessage);
FlickrService.setFlickrPhotoUrlPattern(FlickServiceConfig.flickrPhotoUrlPattern);

/*****************************************************************************
************************** ERROR HANDLING SECTION ****************************
/*****************************************************************************/
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err.toString(),
            layout: false
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
