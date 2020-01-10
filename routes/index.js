/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (LIBS MODULES) *******************************
/*****************************************************************************/
var winston = require('winston');
var express = require('express');
var router = express.Router();
var Utils = require('../services/camara/Utils.js');
var GoogleAnalyticsConfig = require('../services/camara/GoogleAnalyticsConfig.js');

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
      res.locals.googleAnalyticsTrackingID = GoogleAnalyticsConfig.getTrackingID();
      //set if there is just one banner
      if (banners && banners.length && banners.length === 1) {
         res.locals.banners.isSingle = true;
      } else {
         res.locals.banners.isSingle = false;
      }
      next();
   }).catch(function(err) {
      res.locals.menuItems = [];
      //Utils.next(err.statusCode, err.error || err, next); //don't crash portal screen
      next();
      winston.error("Error while getting items of the portal, err = [%s]", err);
   });
});

/*****************************************************************************
***************************** ROUTER DEFINITIONS *****************************
/*****************************************************************************/
router.get('/', portalControllers.homePageController);
router.get('/index.html', portalControllers.homePageController);
router.get('/newsitem.html', portalControllers.newsItemController);
router.get('/newsitem_sharing.html', portalControllers.newsItemSharingController);
router.get('/news.html', portalControllers.newsController);
router.get('/page.html', portalControllers.pageController);
router.get('/page_sharing.html', portalControllers.pageSharingController);
router.get('/calendar.html', portalControllers.calendarController);
router.get('/event.html', portalControllers.showEventCalendarController);
router.get('/licitacoes.html', portalControllers.licitacoesController);
router.get('/licitacao.html', portalControllers.licitacaoController);
router.get('/licitacao_sharing.html', portalControllers.licitacaoSharingController);
router.get('/proposituras.html', portalControllers.propositurasController);
router.get('/propositura.html', portalControllers.proposituraController);
router.get('/propositura_sharing.html', portalControllers.proposituraSharingController);
router.get('/propositura_texto_anexo.html', portalControllers.proposituraTextoAnexoController);
router.get('/propositura_texto_original.html', portalControllers.proposituraTextoOriginalController);
router.get('/propositura_arquivos_anexos.html', portalControllers.proposituraArquivosAnexosController);
router.get('/propositura_alteracoes.html', portalControllers.proposituraAlteracoesController);
router.get('/albuns.html', portalControllers.albunsController);
router.get('/fotos.html', portalControllers.fotosController);
router.get('/videos.html', portalControllers.videosController);
router.get('/materias.html', portalControllers.materiasLegislativasController);
router.post('/materias.html', portalControllers.materiasLegislativasController);
router.get('/materia.html', portalControllers.materiaLegislativaController);
router.get('/materia_sharing.html', portalControllers.materiaLegislativaSharingController);
router.get('/ordens_do_dia.html', portalControllers.ordensDoDiaController);
router.get('/comissoes.html', portalControllers.comissoesController);
router.get('/mesa_diretora.html', portalControllers.mesaDiretoraController);
router.get('/vereadores.html', portalControllers.vereadoresController);
router.get('/vereador.html', portalControllers.vereadorController);
router.get('/arquivos_publicos.html', portalControllers.arquivosPublicos);
router.get('/busca.html', portalControllers.busca);

//popup-renders
router.get('/popup-render-flickr-set-carousel.html', popupRendersControllers.flickrSetPopupRenderControllerCarousel);
router.get('/popup-render-flickr-set-big-single-image.html', popupRendersControllers.flickrSetPopupRenderControllerBigSingleImage);
router.get('/flickr-photo-big-single-image.html', popupRendersControllers.flickrPhotoPopupRenderControllerOpenSingleImage);

module.exports = router;

