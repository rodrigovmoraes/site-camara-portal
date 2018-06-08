/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (LIBS MODULES) *******************************
/*****************************************************************************/
var _ = require('lodash');
var winston = require('winston');
var _requestService = require('request-promise');
var Utils = require('./camara/Utils.js');
/*****************************************************************************
****************************** Flickr API Config  ****************************
/*****************************************************************************/
var _flickrApiBaseUrl; //Ex, "https://api.flickr.com/services/rest/"
var _flickrApiKey; //Ex, "0f90801c8a3de3619be8252f7e6d9d71"
var _flickrApiGetPhotosMethod; //Ex, "flickr.photosets.getPhotos"
var _flickrApiGetPhotosetInfoMethod; //Ex, "flickr.photosets.getInfo"
var _unexpectedFlickrDataFormatErrorMessage; //Ex, "The Flickr service has returned an unexpected data format"
/* Url pattern used to build the photo url. The built url is used in order to
*  obtain the photos from Flickr. Each word embraced by {}
*  in the pattern is replaced by respective field value of the photo request.
*  The fields used to request a photo from Flickr are:
*
*   farm-id: the id of the cluster serving the photo request
*   server: id of the server serving the photo request
*   id: the id of the photo
*   secret: the secret of the photo
*   image_type: the code of the desired version of the photo.
*     The following codes are supported (30/05/2017): s	small square 75x75;
*     t thumbnail, 100 on longest side; q	large square 150x150; m	small,
*     240 on longest side; n	small, 320 on longest side;
*     -	medium, 500 on longest side; z	medium 640, 640 on longest side;
*     c	medium 800, 800 on longest side; b	large, 1024 on longest side;
*     o	original image, either a jpg, gif or png, depending on source format
*/
var _flickrPhotoUrlPattern; //Ex, "https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_{image_type}.jpg"
/*****************************************************************************
*************************** Module Setters ***********************************
/*****************************************************************************/
module.exports.setFlickrApiBaseUrl = function(flickrApiBaseUrl) {
   _flickrApiBaseUrl = flickrApiBaseUrl;
}

module.exports.setFlickrApiKey = function(flickrApiKey) {
   _flickrApiKey = flickrApiKey;
}

module.exports.setFlickrApiGetPhotosMethod = function(flickrApiGetPhotosMethod) {
   _flickrApiGetPhotosMethod = flickrApiGetPhotosMethod;
}

module.exports.setFlickrApiGetPhotosetInfoMethod = function(flickrApiGetPhotosetInfoMethod) {
   _flickrApiGetPhotosetInfoMethod = flickrApiGetPhotosetInfoMethod;
}

module.exports._setRequestService = function(requestService) {
   _requestService = requestService;
}

module.exports.setUnexpectedFlickrDataFormatErrorMessage = function(unexpectedFlickrDataFormatErrorMessage) {
   _unexpectedFlickrDataFormatErrorMessage = unexpectedFlickrDataFormatErrorMessage;
}

module.exports.setFlickrPhotoUrlPattern = function(flickrPhotoUrlPattern) {
   _flickrPhotoUrlPattern = flickrPhotoUrlPattern;
}
/*****************************************************************************
**************************  Module functions *********************************
/*****************************************************************************/

/**
 * getPhotoThumbnailUrlsFromSet: Get urls of photo thumbnails from a set
 * @param {string} photoSetId - the id of the set (album, collection, exposition, ...)
 * @param {string} imageType - code of the desired version of the
 * images, this code is a character used by Flickr Api. The following codes
 * are supported (30/05/2017): s	small square 75x75; t	thumbnail,
 * 100 on longest side; q	large square 150x150; m	small, 240 on longest side;
 * n	small, 320 on longest side; -	medium, 500 on longest side;
 * z	medium 640, 640 on longest side; c	medium 800, 800 on longest side;
 * b	large, 1024 on longest side; o	original image, either a jpg, gif or png,
 * depending on source format
 * @return {object} A promisse that returns a JSON object containing the
 * urls of the photos on success:
 * { photos: [ {  url: "http://...",
                  url: "http://...",
                 url: "http://..."
              }
            ]
 * }
 **/
module.exports.getPhotoThumbnailUrlsFromSet = function(photoSetId, imageType) {
   // assume large square 150x150 thumbnail format if imageType
   // is not defined by the caller
   if(imageType === undefined) {
      imageType = 'q';
   }
   var lPhotos = null;
   return _requestService({
      url: _flickrApiBaseUrl,
      method: "GET",
      json: true,
      body: {},
      qs: {
         method: _flickrApiGetPhotosMethod,
         api_key: _flickrApiKey,
         photoset_id: photoSetId,
         format: 'json',
         nojsoncallback: 1
      }
   }).then(function(data) {
         //validate data from Flickr
         if(!data.photoset || !data.photoset.photo) {
            var error = new Error(_unexpectedFlickrDataFormatErrorMessage);
            error.data = data;
            //log section
            winston.error(_unexpectedFlickrDataFormatErrorMessage);
            winston.debug("data = [%s]", JSON.stringify(data));

            throw error;
         } else {
            //valid data
            var photosFromFlickr = data.photoset.photo;
            var photos = _.map(photosFromFlickr, function(photoItem, index) {
                              return {
                                 url: _flickrPhotoUrlPattern.replace('{farm-id}', photoItem.farm)
                                                            .replace('{server-id}', photoItem.server)
                                                            .replace('{id}', photoItem.id)
                                                            .replace('{secret}', photoItem.secret)
                                                            .replace('{image_type}', imageType),
                                 title: photoItem.title
                              };
                         });
            lPhotos = photos;
            return module.exports.getPhotosetInfo(data.photoset.id, data.photoset.owner);
         }
   }).then(function(result) {
      return {  'title': result.photoset.title._content,
                'id': result.photoset.id,
                'owner' : result.photoset.owner,
                'creationDate': Utils.toDDMMYYYY(new Date(parseInt(result.photoset.date_create) * 1000)),
                'photos': lPhotos
             }
   });

}

module.exports.getPhotosetInfo = function(photoSetId, userId) {
   return _requestService({
      url: _flickrApiBaseUrl,
      method: "GET",
      json: true,
      body: {},
      qs: {
         method: _flickrApiGetPhotosetInfoMethod,
         api_key: _flickrApiKey,
         photoset_id: photoSetId,
         user_id: userId,
         format: 'json',
         nojsoncallback: 1
      }
   })
}
