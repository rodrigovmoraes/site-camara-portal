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
var _flickrApiKey; //
var _flickrApiGetPhotosMethod; //Ex, "flickr.photosets.getPhotos"
var _flickrApiGetPhotosetInfoMethod; //Ex, "flickr.photosets.getInfo"
var _flickrApiGetPhotoInfoMethod; //Ex, "flickr.photos.getInfo"
var _flickrApiGetPhotosetsMethod; //Ex, "flickr.photosets.getList"
var _flickrApiUserId;
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
var _flickrPhotoPageUrlPattern; //Ex, https://www.flickr.com/photos/{owner}/{photoId}/;

var _photosetsCache = { value: null, lastUpdate: null, expireInSeconds: 600};
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

module.exports.setFlickrApiGetPhotoInfoMethod = function(flickrApiGetPhotoInfoMethod) {
   _flickrApiGetPhotoInfoMethod = flickrApiGetPhotoInfoMethod;
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

module.exports.setFlickrPhotoPageUrlPattern = function(flickrPhotoPageUrlPattern) {
   _flickrPhotoPageUrlPattern = flickrPhotoPageUrlPattern;
}

module.exports.setFlickrApiGetPhotosetsMethod = function(flickrApiGetPhotosetsMethod) {
   _flickrApiGetPhotosetsMethod = flickrApiGetPhotosetsMethod;
}

module.exports.setFlickrApiUserId = function(flickrApiUserId) {
   _flickrApiUserId = flickrApiUserId;
}

var _checkPhotosetsCache = function(photosetsCache) {
   if(photosetsCache.value && photosetsCache.lastUpdate && photosetsCache.expireInSeconds) {
      var now = new Date();
      var lastUpdate = photosetsCache.lastUpdate;
      var expireInSeconds = photosetsCache.expireInSeconds;
      var expireDate = new Date(lastUpdate.getTime() + expireInSeconds * 1000);
      return expireDate.getTime() > now.getTime();
   } else {
      return false;
   }
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

 module.exports.getPhotoInfo = function(photoId, imageType) {
    return _requestService({
      url: _flickrApiBaseUrl,
      method: "GET",
      json: true,
      body: {},
      qs: {
         method: _flickrApiGetPhotoInfoMethod,
         api_key: _flickrApiKey,
         photo_id : photoId,
         format: 'json',
         nojsoncallback: 1
      }
   }).then(function(data) {
      //build the url photo to the imageType
      var farm = data.photo && data.photo.farm ? data.photo.farm : '';
      var server = data.photo && data.photo.server ? data.photo.server : '';
      var secret = data.photo && data.photo.secret ? data.photo.secret : '';
      var owner = data.photo && data.photo.owner && data.photo.owner.nsid
                        ? data.photo.owner.nsid : '';
      data.photoUrl = _flickrPhotoUrlPattern.replace('{farm-id}', farm)
                                            .replace('{server-id}', server)
                                            .replace('{id}', photoId)
                                            .replace('{secret}', secret)
                                            .replace('{image_type}', imageType);


      data.photoPageUrl = _flickrPhotoPageUrlPattern.replace('{owner}', owner)
                                                    .replace('{photoId}', photoId);
      return data;
   });
 }

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
                                 title: photoItem.title,
                                 photoid: photoItem.id
                              };
                         });
            lPhotos = photos;
            return module.exports.getPhotosetInfo(data.photoset.id, data.photoset.owner);
         }
   }).then(function(result) {
      return {  'title': result ? result.photoset.title._content : '',
                'description': result ? result.photoset.description._content : '',
                'id': result ? result.photoset.id : '',
                'owner' : result ? result.photoset.owner : '',
                'creationDate': result ? Utils.toDDMMYYYY(new Date(parseInt(result.photoset.date_create) * 1000)) : '',
                'photos': lPhotos
             }
   });

}

module.exports.getPagePhotosFromSet = function(photoSetId, imageType, ppage, ppageSize) {
   return module.exports.getPhotoThumbnailUrlsFromSet(photoSetId, imageType)
                        .then(function(result) {
                           if(result && result.photos && result.photos.length > 0) {
                              //do pagination
                              var photos = result.photos;
                              var page = parseInt(ppage) < 0 || isNaN(ppage) ? 1 : parseInt(ppage);
                              var pageSize = parseInt(ppageSize) < 0 || isNaN(ppageSize) ? 1 : parseInt(ppageSize);
                              var pageCount = Math.ceil(photos.length / pageSize);
                              page = page > pageCount ? pageCount : page;
                              result.photos = _.slice(photos, (page - 1) * pageSize, page * pageSize);
                              return { 'flickrPhotosetTitle': result.title,
                                       'flickrPhotosetDescription': result.description,
                                       'flickrPhotosetId': result.id,
                                       'flickrPhotosetOwner': result.owner,
                                       'flickrPhotosetCreationDateDescription': result.creationDate,
                                       'flickrPhotosetPhotos': result.photos,
                                       'pageCount': pageCount,
                                       'page': page,
                                       'setId': photoSetId
                                     };
                           } else {
                              return { 'flickrPhotosetTitle': result.title,
                                       'flickrPhotosetDescription': result.description,
                                       'flickrPhotosetId': result.id,
                                       'flickrPhotosetOwner': result.owner,
                                       'flickrPhotosetCreationDateDescription': result.creationDate,
                                       'flickrPhotosetPhotos': [],
                                       'pageCount': 1,
                                       'page': 1,
                                       'setId': photoSetId
                                     };
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
   });
}

module.exports.getPhotosets = function() {
   if(_checkPhotosetsCache(_photosetsCache)) {
      //there is a valid result in the cache
      return new Promise(function(resolve, reject) {
         resolve(_photosetsCache.value);
      });
   } else {
      //cache is invalid or expired
      return _requestService({
        url: _flickrApiBaseUrl,
        method: "GET",
        json: true,
        body: {},
        qs: {
           method: _flickrApiGetPhotosetsMethod,
           api_key: _flickrApiKey,
           user_id: _flickrApiUserId,
           format: 'json',
           primary_photo_extras: 'path_alias,url_s,url_m',
           nojsoncallback: 1
        }
     }).then(function(result) {
         if(result.photosets && result.photosets.photoset) {
            var photosetsResult = [];
            var photosets = result.photosets.photoset;
            //process the result
            var i = 0;
            for(i = 0; i < photosets.length; i++) {
               var photoset = photosets[i];
               photosetsResult.push({
                  flickrPhotosetTitle: photoset.title && photoset.title._content ?
                                       photoset.title._content : "",
                  flickrPhotosetDescription: photoset.description && photoset.description._content ?
                                             photoset.description._content : "",
                  flickrPhotosetId: photoset.id,
                  flickrPhotosetPath: photoset.primary_photo_extras && photoset.primary_photo_extras.pathalias
                                      ? photoset.primary_photo_extras.pathalias : "",
                  flickrPhotosetThumbnailUrl: photoset.primary_photo_extras && photoset.primary_photo_extras.url_s
                                      ? photoset.primary_photo_extras.url_s : "",
                  flickrPhotosetThumbnailHeight: photoset.primary_photo_extras && photoset.primary_photo_extras.height_s
                                      ? photoset.primary_photo_extras.height_s : 0,
                  flickrPhotosetThumbnailWidth: photoset.primary_photo_extras && photoset.primary_photo_extras.width_s
                                      ? photoset.primary_photo_extras.width_s : 0,
                 flickrPhotosetThumbnailUrlM: photoset.primary_photo_extras && photoset.primary_photo_extras.url_m
                                      ? photoset.primary_photo_extras.url_m : "",
                 flickrPhotosetThumbnailHeightM: photoset.primary_photo_extras && photoset.primary_photo_extras.height_m
                                      ? photoset.primary_photo_extras.height_m : 0,
                 flickrPhotosetThumbnailWidthM: photoset.primary_photo_extras && photoset.primary_photo_extras.width_m
                                      ? photoset.primary_photo_extras.width_m : 0,
                  flickrPhotosetCreationDate: new Date(parseInt(photoset.date_create * 1000)),
                  flickrPhotosetCreationDateDescription: Utils.toDDMMYYYY( new Date(parseInt(photoset.date_create * 1000)) )
               });
            }
            //sort by creation date
            photosetsResult = _.sortBy(photosetsResult, [function(photosetsResultEntry) {
               return photosetsResultEntry.flickrPhotosetCreationDate ? -1 * photosetsResultEntry.flickrPhotosetCreationDate.getTime()
                                                                      : 0;
            }]);
            return photosetsResult;
         } else {
            return null;
         }
      }).then(function(photosetsResult) {
         //set cache update
         _photosetsCache.value = photosetsResult;
         _photosetsCache.lastUpdate = new Date();
         return new Promise(function(resolve, reject) {
            resolve(_photosetsCache.value);
         });
      });
   }
};

module.exports.getLastPhotosets = function(amountOfPhotosets) {
   return module.exports.getPhotosets()
                        .then(function(photosetsResult) {
                           if(photosetsResult) {
                              return photosetsResult.slice(0, Math.min(amountOfPhotosets, photosetsResult.length));
                           } else {
                              return null;
                           }
                        });
}

module.exports.getPhotosetsPage = function(filter, ppage, ppageSize) {
   return module.exports.getPhotosets().then(function(photosetsResult) {
      var photosets = photosetsResult;
      //filtering
      if(photosets && photosets.length > 0) {
         //keywords filtering
         if(filter.keywords) {
            photosets = _.filter(photosets, function(photosetEntry) {
               return photosetEntry.flickrPhotosetDescription &&
                        photosetEntry.flickrPhotosetDescription.toLowerCase().indexOf(filter.keywords.toLowerCase()) >= 0 ||
                      photosetEntry.flickrPhotosetTitle &&
                        photosetEntry.flickrPhotosetTitle.toLowerCase().indexOf(filter.keywords.toLowerCase()) >= 0;
            });
         }
         //date filtering
         //date1
         if(filter.date1) {
            //return entries which date is after the parameter date1
            photosets = _.filter(photosets, function(photosetEntry) {
               return photosetEntry.flickrPhotosetCreationDate &&
                        photosetEntry.flickrPhotosetCreationDate.getTime() >= filter.date1.getTime();
            });
         }
         //date2
         if(filter.date2) {
            //return entries which date is before the parameter date2
            photosets = _.filter(photosets, function(photosetEntry) {
               return photosetEntry.flickrPhotosetCreationDate &&
                        photosetEntry.flickrPhotosetCreationDate.getTime() <= filter.date2.getTime();
            });
         }
      }
      if(photosets && photosets.length > 0) {
         var page = parseInt(ppage) < 0 || isNaN(ppage) ? 1 : parseInt(ppage);
         var pageSize = parseInt(ppageSize) < 0 || isNaN(ppageSize) ? 1 : parseInt(ppageSize);
         var pageCount = Math.ceil(photosets.length / pageSize);
         page = page > pageCount ? pageCount : page;
         return {
            'photosets': _.slice(photosets, (page - 1) * pageSize, page * pageSize),
            'page': page,
            'pageCount': pageCount,
            'totalLength': photosets.length,
            'pageSize': pageSize
         }
      } else {
         return {
            'photosets': [],
            'page': 1,
            'pageCount': 0,
            'totalLength': 0,
            'pageSize': ppageSize < 0 ? 1 : ppageSize
         }
      }

   });
}
