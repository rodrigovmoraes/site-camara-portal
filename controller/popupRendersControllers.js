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
   return _FlickrService.getPhotoThumbnailUrlsFromSet(req.query.setId, 'z').then(function(data){
         res.render('popups-renders/flickr-set-carousel', {
           layout: false,
           id: data.id,
           photos: data.photos,
           title: data.title,
           owner: data.owner,
           creationDate: data.creationDate
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
   return _FlickrService.getPhotoThumbnailUrlsFromSet(req.query.setId, 'b').then(function(data){
         res.render('popups-renders/flickr-set-big-single-image', {
           layout: false,
           id: data.id,
           photos: data.photos,
           title: data.title,
           owner: data.owner,
           creationDate: data.creationDate
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

module.exports.flickrPhotoPopupRenderControllerOpenSingleImage = function(req, res) {
   return _FlickrService.getPhotoInfo(req.query.photoId, 'b').then(function(data){
         res.render('popups-renders/flickr-photo-big-single-image', {
           layout: false,
           id: req.query.photoId,
           photoUrl: data.photoUrl,
           photoPageUrl: data.photoPageUrl,
           title: data.photo && data.photo.title && data.photo.title._content
                     ? data.photo.title._content : '',
           owner: data.photo && data.photo.owner && data.photo.owner.nsid
                     ? data.photo.owner.nsid : '',
           setId: req.query.setId
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
