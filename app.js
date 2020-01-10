/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (LIBS MODULES) *******************************
/*****************************************************************************/
require('dotenv').load();
var express = require('express');
var path = require('path');
var logger = require('morgan');
var winston = require('winston');
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
var YoutubeService = require('./services/YoutubeService.js');
var CamaraApiConfigService = require('./services/camara/CamaraApiConfigService.js');
var SyslegisApiConfigService = require('./services/camara/SyslegisApiConfigService.js');
var SearchConfigService = require('./services/camara/SearchConfigService.js');
var FacebookSharingConfig = require('./services/camara/FacebookSharingConfig.js');
var GoogleAnalyticsConfig = require('./services/camara/GoogleAnalyticsConfig.js');

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
//partials, "templates"
app.set('partials', {
   menu: '_templates/menu',
   submenu: '_templates/submenu',
   menu_access: '_templates/menu-access',
   fbreaking_news_item_tpl: '_templates/fbreaking-news-item-tpl'
});
app.enable('view cache');
app.engine('html', require('hogan-express'));
//routes config
// portal routes
var portalRoutes = require('./routes/index.js');
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
//logger
var logConfig = config.get("Log")
//log configuration
winston.setLevels(logConfig.levels);
winston.addColors(logConfig.levelsColors);
winston.configure({
    transports: [
      new (winston.transports.Console)({ colorize: true })
    ]
 });
winston.level = logConfig.level;
//Services
var FlickServiceConfig = config.get('Services.FlickrService');
FlickrService.setFlickrApiBaseUrl(FlickServiceConfig.baseUrl);
FlickrService.setFlickrApiKey(FlickServiceConfig.apiKey);
FlickrService.setFlickrApiGetPhotosMethod(FlickServiceConfig.getPhotosMethod);
FlickrService.setFlickrApiGetPhotosetInfoMethod(FlickServiceConfig.getPhotosetInfoMethod);
FlickrService.setFlickrApiGetPhotoInfoMethod(FlickServiceConfig.getPhotoInfoMethod);
FlickrService.setUnexpectedFlickrDataFormatErrorMessage(FlickServiceConfig.unexpectedFlickrDataFormatErrorMessage);
FlickrService.setFlickrPhotoUrlPattern(FlickServiceConfig.photoUrlPattern);
FlickrService.setFlickrPhotoPageUrlPattern(FlickServiceConfig.photoPageUrlPattern);
FlickrService.setFlickrApiGetPhotosetsMethod(FlickServiceConfig.getPhotosetsMethod);
FlickrService.setFlickrApiUserId(FlickServiceConfig.userId);

var YoutubeServiceConfig = config.get('Services.YoutubeService');
YoutubeService.setYoutubeApiBaseUrl(YoutubeServiceConfig.urlBase);
YoutubeService.setYoutubeApiKey(YoutubeServiceConfig.apiKey);
YoutubeService.setYoutubeApiSearchVideosMethod(YoutubeServiceConfig.urlsMethods.search);
YoutubeService.setPlaylistItemsMethod(YoutubeServiceConfig.urlsMethods.playlistItems);
YoutubeService.setYoutubeChannelId(YoutubeServiceConfig.channelId);
YoutubeService.setYoutubePlaylistId(YoutubeServiceConfig.playlistId);

var camaraApiConfig = config.get('Services.CamaraApi');
CamaraApiConfigService.setBaseUrl(camaraApiConfig.baseUrl);
CamaraApiConfigService.setPortalMenuMethodPath(camaraApiConfig.portalMenuMethodPath);
CamaraApiConfigService.setNewsMethodPath(camaraApiConfig.newsMethodPath);
CamaraApiConfigService.setNewsItemMethodPath(camaraApiConfig.newsItemMethodPath);
CamaraApiConfigService.setIncrementNewsViewsMethodPath(camaraApiConfig.incrementNewsViewsMethodPath);
CamaraApiConfigService.setPageMethodPath(camaraApiConfig.pageMethodPath);
CamaraApiConfigService.setBannersMethodPath(camaraApiConfig.bannersMethodPath);
CamaraApiConfigService.setHotNewsMethodPath(camaraApiConfig.hotNewsMethodPath);
CamaraApiConfigService.setBreakingNewsMethodPath(camaraApiConfig.breakingNewsMethodPath);
CamaraApiConfigService.setFBreakingNewsMethodPath(camaraApiConfig.fbreakingNewsMethodPath);
CamaraApiConfigService.setEventsCalendarMethodPath(camaraApiConfig.eventsCalendarMethodPath);
CamaraApiConfigService.setEventCalendarMethodPath(camaraApiConfig.eventCalendarMethodPath);
CamaraApiConfigService.setEventsCalendarUTCOffset(camaraApiConfig.eventsCalendarUTCOffset);
CamaraApiConfigService.setLastLicitacoesEventsMethodPath(camaraApiConfig.lastLicitacoesEventsMethodPath);
CamaraApiConfigService.setLicitacaoDownloadEventFilePath(camaraApiConfig.licitacaoDownloadEventFilePath);
CamaraApiConfigService.setLicitacoesMethodPath(camaraApiConfig.licitacoesMethodPath);
CamaraApiConfigService.setLicitacoesCategoriesMethodPath(camaraApiConfig.licitacoesCategoriesMethodPath);
CamaraApiConfigService.setLicitacaoMethodPath(camaraApiConfig.licitacaoMethodPath);
CamaraApiConfigService.setLegislativePropositionsMethodPath(camaraApiConfig.legislativePropositionsMethodPath);
CamaraApiConfigService.setLegislativePropositionTypesMethodPath(camaraApiConfig.legislativePropositionTypesMethodPath);
CamaraApiConfigService.setLegislativePropositionTagsMethodPath(camaraApiConfig.legislativePropositionTagsMethodPath);
CamaraApiConfigService.setLegislativePropositionMethodPath(camaraApiConfig.legislativePropositionMethodPath);
CamaraApiConfigService.setLegislativePropositionDownloadFileAttachmentPath(camaraApiConfig.legislativePropositionDownloadFileAttachmentPath);
CamaraApiConfigService.setPublicFilesFolderContentsMethodPath(camaraApiConfig.publicFilesFolderContentsMethodPath);
CamaraApiConfigService.setPublicFilesFolderPathMethodPath(camaraApiConfig.publicFilesFolderPathMethodPath);
CamaraApiConfigService.setDownloadFilePathMethodPath(camaraApiConfig.publicFilesDownloadFile);

/*****************************************************************************/
var syslegisApiConfig = config.get('Services.SyslegisApi');
SyslegisApiConfigService.setBaseUrl(syslegisApiConfig.baseUrl);
SyslegisApiConfigService.setPesquisaMateriasMethodPath(syslegisApiConfig.pesquisaMateriasMethodPath);
SyslegisApiConfigService.setTiposDeMateriaMethodPath(syslegisApiConfig.tiposDeMateriaMethodPath);
SyslegisApiConfigService.setAutoresMethodPath(syslegisApiConfig.autoresMethodPath);
SyslegisApiConfigService.setUnidadesDeTramitacaoMethodPath(syslegisApiConfig.unidadesDeTramitacaoMethodPath);
SyslegisApiConfigService.setListaDeStatusDeTramitacaoMethodPath(syslegisApiConfig.listaDeStatusDeTramitacaoMethodPath);
SyslegisApiConfigService.setClassificacoesMethodPath(syslegisApiConfig.classificacoesMethodPath);
SyslegisApiConfigService.setMateriaLegislativaMethodPath(syslegisApiConfig.materiaLegislativaMethodPath);
SyslegisApiConfigService.setMateriaTextoOriginalUrlDownload(syslegisApiConfig.materiaTextoOriginalUrlDownload);
SyslegisApiConfigService.setMateriaTextoFinalUrlDownload(syslegisApiConfig.materiaTextoFinalUrlDownload);
SyslegisApiConfigService.setDocumentoAcessorioUrlDownload(syslegisApiConfig.documentoAcessorioUrlDownload);
SyslegisApiConfigService.setOrdensDoDiaMethodPath(syslegisApiConfig.ordensDoDiaMethodPath);
SyslegisApiConfigService.setOrdemDoDiaListaDeAnosMethodPath(syslegisApiConfig.ordemDoDiaListaDeAnosMethodPath);
SyslegisApiConfigService.setComissoesMethodPath(syslegisApiConfig.comissoesMethodPath);
SyslegisApiConfigService.setLegislaturasMethodPath(syslegisApiConfig.legislaturasMethodPath);
SyslegisApiConfigService.setSessoesLegislativasMethodPath(syslegisApiConfig.sessoesLegislativasMethodPath);
SyslegisApiConfigService.setMesaDiretoraMethodPath(syslegisApiConfig.mesaDiretoraMethodPath);
SyslegisApiConfigService.setVereadoresMethodPath(syslegisApiConfig.vereadoresMethodPath);
SyslegisApiConfigService.setVereadorMethodPath(syslegisApiConfig.vereadorMethodPath);
SyslegisApiConfigService.setVereadorResumoMateriasMethodPath(syslegisApiConfig.vereadorResumoMateriasMethodPath);
SyslegisApiConfigService.setVereadorImageUrl(syslegisApiConfig.vereadorImageUrl);

var searchConfigService = config.get('Services.SearchService');
SearchConfigService.setElasticSearchConnectionConfig(searchConfigService.elasticSearchConnectionConfig);
SearchConfigService.setSearchResultUrlMappings(searchConfigService.searchResultUrlMappings);
SearchConfigService.setDocumentTypes(searchConfigService.documentTypes);
SearchConfigService.setMaxResultSize(searchConfigService.maxResultSize);

var facebookSharingConfig = config.get("FacebookSharing");
FacebookSharingConfig.setCamaraPortalUrlBase(facebookSharingConfig.camaraPortalUrlBase);
FacebookSharingConfig.setNewsItemUrl(facebookSharingConfig.newsItemUrl);
FacebookSharingConfig.setOpenNewsItemUrl(facebookSharingConfig.openNewsItemUrl);
FacebookSharingConfig.setPageUrl(facebookSharingConfig.pageUrl);
FacebookSharingConfig.setOpenPageUrl(facebookSharingConfig.openPageUrl);
FacebookSharingConfig.setLegislativePropositionUrl(facebookSharingConfig.legislativePropositionUrl);
FacebookSharingConfig.setOpenLegislativePropositionUrl(facebookSharingConfig.openLegislativePropositionUrl);
FacebookSharingConfig.setMateriaUrl(facebookSharingConfig.materiaUrl);
FacebookSharingConfig.setOpenMateriaUrl(facebookSharingConfig.openMateriaUrl);
FacebookSharingConfig.setLicitacaoUrl(facebookSharingConfig.licitacaoUrl);
FacebookSharingConfig.setOpenLicitacaoUrl(facebookSharingConfig.openLicitacaoUrl);

var googleAnalyticsConfig = config.get("GoogleAnalytics");
GoogleAnalyticsConfig.setTrackingID(googleAnalyticsConfig.trackingID);

/*****************************************************************************
************************** ERROR HANDLING SECTION ****************************
/*****************************************************************************/
// development error handler
// it prints stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err.toString()
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
