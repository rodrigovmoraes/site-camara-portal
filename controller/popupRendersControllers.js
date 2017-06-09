/*
TODOS:

- Retocar o layout:
    -ok: cor de fundo que combine com o portal
    -ok: margem
    -ok: títulos nas fotos

- Fazer sendResponse e sendError, sendJson ou algo assim

*/

/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (LIBS MODULES) *******************************
/*****************************************************************************/
var _FlickrService = require('../services/FlickrService.js')

/*****************************************************************************
*************************** Module Setters ***********************************
/*****************************************************************************/
module.exports._setFlickrService = function(flickrService) {
   _FlickrService = flickrApiBaseUrl;
}

module.exports.flickrSetPopupRenderControllerCarousel = function(req, res){
   _FlickrService.getPhotoThumbnailUrlsFromSet(req.query.setId, 'b').then(function(data){
         res.render('popups-renders/flickr-set-carousel', {
           layout: false,
           photos: data.photos
         });
   }).catch(function(error) {
      res.status(500);
      res.render('error', {
          message: error.message,
          error: error,
          layout: false
      });
   });

};

module.exports.flickrSetPopupRenderControllerBigSingleImage = function(req, res){
   _FlickrService.getPhotoThumbnailUrlsFromSet(req.query.setId, 'b').then(function(data){
         res.render('popups-renders/flickr-set-big-single-image', {
           layout: false,
           photos: data.photos
         });
   }).catch(function(error) {
      res.status(500);
      res.render('error', {
          message: error.message,
          error: error,
          layout: false
      });
   });

};
