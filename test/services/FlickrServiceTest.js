/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (LIBS MODULES) *******************************
/*****************************************************************************/
var _ = require('lodash');
const expect = require('chai').expect;
const assert = require('chai').assert;
var winston = require('winston');
//log config for test
winston.configure({
   transports: [
      new (winston.transports.Console)()
   ],
   level: 'debug'
});
/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
*************************** (APP TEST MODULES) *******************************
/*****************************************************************************/
var RequestPromiseMock = require('../utils/mocks/RequestPromiseMock')

describe("Services", function() {

describe("FlickrService", function() {

   /*****************************************************************************
   ***************************** Test Suite Config ******************************
   /*****************************************************************************/
   var errorMessage = "ErrorTest";
   var unexpectedFlickrDataFormatErrorMessage = "UnexpectedFlickrDataFormatErrorMessage";
   var flickrApiGetPhotosMethod = "flickr.photosets.getPhotos.Test"
   var flickrApiKey =  "0f90801c8a3de3619be8252f7e6d9d71.Test"
   var flickrApiBaseUrl = "https://api.flickr.com/services/rest/test/";
   var flickrPhotoUrlPattern = "https://farmtest{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_{image_type}.jpg";

   beforeEach(function() {
       flickrService = require("../../services/FlickrService.js");
       flickrService.setFlickrApiKey(flickrApiKey);
       flickrService.setFlickrApiBaseUrl(flickrApiBaseUrl);
       flickrService.setFlickrApiGetPhotosMethod(flickrApiGetPhotosMethod);
       flickrService.setUnexpectedFlickrDataFormatErrorMessage(unexpectedFlickrDataFormatErrorMessage);
       flickrService.setFlickrPhotoUrlPattern(flickrPhotoUrlPattern);

       requestPromiseError = {
          message: errorMessage
       }
   });

   /*****************************************************************************
   ********************************* Test Cases *********************************
   /*****************************************************************************/
   describe("getPhotoThumbnailUrlsFromSet", function() {

      var requestPromiseMockError;
      var requestPromiseMockSuccess;
      var photoSetId = '72157682093844471';
      var expectedFlickrDataFromPhotosMethod = { "photoset": { "id": "72157682093844471", "primary": "34865147036", "owner": "41309384@N07", "ownername": "Câmara Municipal de Sorocaba",
                                                 "photo": [
                                                   { "id": "34773882311", "secret": "a9a18e8238", "server": "4226", "farm": 1, "title": "LQO_0462", "isprimary": 0, "ispublic": 1, "isfriend": 0, "isfamily": 0 },
                                                   { "id": "34518461500", "secret": "62d4f87bcc", "server": "4268", "farm": 3, "title": "LQO_0464", "isprimary": 0, "ispublic": 1, "isfriend": 0, "isfamily": 0 },
                                                   { "id": "34865147556", "secret": "1e7a366b6d", "server": "4224", "farm": 2, "title": "LQO_0466", "isprimary": 0, "ispublic": 1, "isfriend": 0, "isfamily": 0 },
                                                   { "id": "34518461350", "secret": "e3a40bd6d9", "server": "4246", "farm": 50, "title": "LQO_0467", "isprimary": 0, "ispublic": 1, "isfriend": 0, "isfamily": 0 }
                                                ]}
                                              };
      var codeImageType = 'X';
      var expectedMethodReturn = [
        {url: "https://farmtest1.staticflickr.com/4226/34773882311_a9a18e8238_X.jpg", title: "LQO_0462"},
        {url: "https://farmtest3.staticflickr.com/4268/34518461500_62d4f87bcc_X.jpg", title: "LQO_0464"},
        {url: "https://farmtest2.staticflickr.com/4224/34865147556_1e7a366b6d_X.jpg", title: "LQO_0466"},
        {url: "https://farmtest50.staticflickr.com/4246/34518461350_e3a40bd6d9_X.jpg", title: "LQO_0467"}
       ];
      var expectedMethodReturnNoCodeImageType = [
        {url: "https://farmtest1.staticflickr.com/4226/34773882311_a9a18e8238_q.jpg", title: "LQO_0462"},
        {url: "https://farmtest3.staticflickr.com/4268/34518461500_62d4f87bcc_q.jpg", title: "LQO_0464"},
        {url: "https://farmtest2.staticflickr.com/4224/34865147556_1e7a366b6d_q.jpg", title: "LQO_0466"},
        {url: "https://farmtest50.staticflickr.com/4246/34518461350_e3a40bd6d9_q.jpg", title: "LQO_0467"}
       ];

      beforeEach(function() {
          requestPromiseMockSuccess = new RequestPromiseMock({});
          requestPromiseMockSuccess.setData({});

          requestPromiseMockError = new RequestPromiseMock({});
          requestPromiseMockError.setError(requestPromiseError);

          flickrService._setRequestService(requestPromiseMockSuccess.promise());
      });

      it("'catch' should be executed when an error is thrown", function(done) {
         flickrService._setRequestService(requestPromiseMockError.promise());
         flickrService.getPhotoThumbnailUrlsFromSet(-10).then(function(result) {
            assert.isNotOk(true, "This should not be executed");
         }).catch(function(error) {
            expect(error.message).to.equal(errorMessage);
            done();
         });
         requestPromiseMockError.flushErrors();
      });

      it("'catch' should be executed when an unexpected data format is returned by Flickr", function(done) {
         var unexpectedFlickrDataFormat = {f1: '', f2: '', f3: ''};
         requestPromiseMockSuccess.setData(unexpectedFlickrDataFormat);
         flickrService.getPhotoThumbnailUrlsFromSet(10).then(function(result) {
            assert.isNotOk(true, "This should not be executed");
         }).catch(function(error) {
            expect(error.message).to.equal(unexpectedFlickrDataFormatErrorMessage);
            expect(error.data).to.not.be.undefined;
            expect(error.data == unexpectedFlickrDataFormat).to.be.true;
            done();
         });
         requestPromiseMockSuccess.flushErrors();
      });

      it("should return photo urls from a Flickr photoset with a specific photoset id", function(done) {

         requestPromiseMockSuccess.setData(expectedFlickrDataFromPhotosMethod);
         flickrService.getPhotoThumbnailUrlsFromSet(photoSetId, codeImageType).then(function(result) {
            //check params
            var params = requestPromiseMockSuccess.getParams();
            expect(params.qs).to.not.be.undefined;
            expect(params.qs.api_key).to.equal(flickrApiKey);
            expect(params.url).to.equal(flickrApiBaseUrl);
            expect(params.qs.method).to.equal(flickrApiGetPhotosMethod);
            expect(params.qs.photoset_id).to.equal(photoSetId);

            //check static fields of params
            expect(params.method).to.equal("GET");
            expect(params.json).to.equal(true);
            expect(params.qs.format).to.equal('json');
            expect(params.body).to.eql({});

            //check result length
            expect(result.photos).to.not.be.undefined;
            expect(result.photos.length).to.equal(expectedFlickrDataFromPhotosMethod.photoset.photo.length);
            _.forEach(result.photos, function(photo, index){
               expect(photo.url).to.not.be.undefined;
               expect(photo.url).to.not.be.null;
               //check urls contents
               expect(photo.url).to.equal(expectedMethodReturn[index].url);
            });
            done();
         }).catch(function(error) {
            console.log(error);
            assert.isNotOk(true, "This should not be executed");
         });
         requestPromiseMockSuccess.flushErrors();
      });

      it("should return photo urls of code 'q' when the code is not defined by the caller", function(done) {

         requestPromiseMockSuccess.setData(expectedFlickrDataFromPhotosMethod);
         flickrService.getPhotoThumbnailUrlsFromSet(photoSetId).then(function(result) {
            //check result length
            expect(result.photos).to.not.be.undefined;
            expect(result.photos.length).to.equal(expectedFlickrDataFromPhotosMethod.photoset.photo.length);
            //check result items content
            _.forEach(result.photos, function(photo, index){
               expect(photo.url).to.not.be.undefined;
               expect(photo.url).to.not.be.null;
               //check urls contents
               expect(photo.url).to.equal(expectedMethodReturnNoCodeImageType[index].url);
            });
            done();
         }).catch(function(error) {
            console.log(error);
            assert.isNotOk(true, "This should not be executed");
         });
         requestPromiseMockSuccess.flushErrors();
      });

      it("should return photos titles", function(done) {
         requestPromiseMockSuccess.setData(expectedFlickrDataFromPhotosMethod);
         flickrService.getPhotoThumbnailUrlsFromSet(photoSetId).then(function(result) {
            //check result length
            expect(result.photos).to.not.be.undefined;
            expect(result.photos.length).to.equal(expectedFlickrDataFromPhotosMethod.photoset.photo.length);
            //check result items content
            _.forEach(result.photos, function(photo, index){
               expect(photo.title).to.not.be.undefined;
               expect(photo.title).to.not.be.null;
               //check urls contents
               expect(photo.title).to.equal(expectedMethodReturnNoCodeImageType[index].title);
            });
            done();
         }).catch(function(error) {
            console.log(error);
            assert.isNotOk(true, "This should not be executed");
         });
         requestPromiseMockSuccess.flushErrors();
      });

   });

});

});
