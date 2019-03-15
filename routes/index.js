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
router.get('/calendar.html', portalControllers.calendarController);
router.get('/event.html', portalControllers.showEventCalendarController);
router.get('/licitacoes.html', portalControllers.licitacoesController);
router.get('/licitacao.html', portalControllers.licitacaoController);
router.get('/proposituras.html', portalControllers.propositurasController);
router.get('/propositura.html', portalControllers.proposituraController);
router.get('/propositura_texto_anexo.html', portalControllers.proposituraTextoAnexoController);
router.get('/propositura_arquivos_anexos.html', portalControllers.proposituraArquivosAnexosController);
router.get('/albuns.html', portalControllers.albunsController);
router.get('/fotos.html', portalControllers.fotosController);
router.get('/videos.html', portalControllers.videosController);
router.get('/materias.html', portalControllers.materiasLegislativasController);
router.post('/materias.html', portalControllers.materiasLegislativasController);
router.get('/materia.html', portalControllers.materiaLegislativaController);
router.get('/ordens_do_dia.html', portalControllers.ordensDoDiaController);
router.get('/comissoes.html', portalControllers.comissoesController);
router.get('/mesa_diretora.html', portalControllers.mesaDiretoraController);
router.get('/vereadores.html', portalControllers.vereadoresController);
router.get('/vereador.html', portalControllers.vereadorController);
router.get('/contas_publicas.html', portalControllers.contasPublicas);

//popup-renders
router.get('/popup-render-flickr-set-carousel.html', popupRendersControllers.flickrSetPopupRenderControllerCarousel);
router.get('/popup-render-flickr-set-big-single-image.html', popupRendersControllers.flickrSetPopupRenderControllerBigSingleImage);
router.get('/flickr-photo-big-single-image.html', popupRendersControllers.flickrPhotoPopupRenderControllerOpenSingleImage);

module.exports = router;
