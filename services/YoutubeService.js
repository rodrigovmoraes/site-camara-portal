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
var _youtubeApiBaseUrl; //Ex, "https://www.googleapis.com/youtube/v3"
var _youtubeApiKey; //
var _youtubeApiSearchVideosMethod; //Ex, ""search"
var _youtubeChannelId; //Ex, "UCWQR_GgpIhrfoG1vikt94bA"
/*****************************************************************************
*************************** Module Setters ***********************************
/*****************************************************************************/
module.exports.setYoutubeApiBaseUrl = function(youtubeApiBaseUrl) {
   _youtubeApiBaseUrl = youtubeApiBaseUrl;
}

module.exports.setYoutubeApiKey = function(youtubeApiKey) {
   _youtubeApiKey = youtubeApiKey;
}

module.exports.setYoutubeApiSearchVideosMethod = function(youtubeApiSearchVideosMethod) {
   _youtubeApiSearchVideosMethod = youtubeApiSearchVideosMethod;
}

module.exports.setYoutubeChannelId = function(youtubeChannelId) {
   _youtubeChannelId = youtubeChannelId;
}


/*****************************************************************************
**************************  Module functions *********************************
/*****************************************************************************/
module.exports.getLastVideos = function(amountOfVideos) {
    return _requestService({
      url: _youtubeApiBaseUrl + "/" + _youtubeApiSearchVideosMethod,
      method: "GET",
      json: true,
      qs: {
         'part' : "snippet",
         'maxResults' : amountOfVideos,
         'order': "date",
         'type': "video",
         'key' : _youtubeApiKey,
         'channelId' : _youtubeChannelId
      }
   }).then(function(data) {
      var i;
      var videosResult = [];
      if(data.items) {
         for(i = 0; i < data.items.length; i++) {
            var resultItem = data.items[i];
            videosResult.push({
               youtubeVideoId: resultItem.id && resultItem.id.videoId
                                    ? resultItem.id.videoId : '',
               youtubeVideoTitle: resultItem.snippet && resultItem.snippet.title
                                    ? resultItem.snippet.title : '',
               youtubeVideoThumbnailURL: resultItem.snippet && resultItem.snippet.thumbnails && resultItem.snippet.thumbnails.default && resultItem.snippet.thumbnails.default.url
                                    ? resultItem.snippet.thumbnails.default.url : '',
               youtubeVideoDate: resultItem.snippet && resultItem.snippet.publishedAt
                                    ? new Date( resultItem.snippet.publishedAt  ) : null,
               youtubeVideoDateDescription: resultItem.snippet && resultItem.snippet.publishedAt
                                    ? Utils.toDDMMYYYY( new Date( resultItem.snippet.publishedAt  ) ) : ''
            });
         }
      }
      return videosResult;
   });
}

module.exports.getVideosPage = function(filter, pageToken, pageSize) {
   var videosResult = [];
   var totalResults = 0;
   var nextPageToken = null;
   var prevPageToken = null;

   var qsParams = {
      'part' : "snippet",
      'maxResults' : pageSize,
      'order': "date",
      'type': "video",
      'key' : _youtubeApiKey,
      'channelId' : _youtubeChannelId
   };
   //keywords filter
   if(filter.q) {
      qsParams['q'] = filter.q;
   }
   //date begin filter
   if(filter.publishedAfter) {
      qsParams['publishedAfter'] = filter.publishedAfter;
   }
   //date end filter
   if(filter.publishedAfter) {
      qsParams['publishedBefore'] = filter.publishedBefore;
   }
   //set page token
   if(pageToken) {
      qsParams['pageToken'] = pageToken;
   }
   return _requestService({
      url: _youtubeApiBaseUrl + "/" + _youtubeApiSearchVideosMethod,
      method: "GET",
      json: true,
      qs: qsParams
   }).then(function(data) {
      var i;

      if(data.items) {
         for(i = 0; i < data.items.length; i++) {
            var resultItem = data.items[i];
            videosResult.push({
               youtubeVideoId: resultItem.id && resultItem.id.videoId
                                    ? resultItem.id.videoId : '',
               youtubeVideoTitle: resultItem.snippet && resultItem.snippet.title
                                    ? resultItem.snippet.title : '',
               youtubeVideoThumbnailURL: resultItem.snippet && resultItem.snippet.thumbnails && resultItem.snippet.thumbnails.high && resultItem.snippet.thumbnails.high.url
                                    ? resultItem.snippet.thumbnails.high.url : '',
               youtubeVideoDate: resultItem.snippet && resultItem.snippet.publishedAt
                                    ? new Date( resultItem.snippet.publishedAt  ) : null,
               youtubeVideoDateDescription: resultItem.snippet && resultItem.snippet.publishedAt
                                    ? Utils.toDDMMYYYY( new Date( resultItem.snippet.publishedAt  ) ) : ''
            });
         }
      }
      totalResults = data.pageInfo && data.pageInfo.totalResults
                           ? (videosResult.length > 0 ? data.pageInfo.totalResults : 0)
                           : 0;
      nextPageToken = data.nextPageToken ? data.nextPageToken : null,
      prevPageToken = data.prevPageToken ? data.prevPageToken : null
      //check next page,
      //if the next page is empty set that the next doesn't exist
      if(nextPageToken) {
         qsParams['pageToken'] = data.nextPageToken ? data.nextPageToken : null;
         return _requestService({
            url: _youtubeApiBaseUrl + "/" + _youtubeApiSearchVideosMethod,
            method: "GET",
            json: true,
            qs: qsParams
         });
      } else {
         return null;
      }
   }).then(function(data) {
      nextPageToken = data && data.items && data.items.length > 0 ? nextPageToken : null;
      //check prev page
      //if the next page is empty set that the previous page doesn't exist
      if(prevPageToken) {
         qsParams['pageToken'] = data.prevPageToken ? data.prevPageToken : null;
         return _requestService({
            url: _youtubeApiBaseUrl + "/" + _youtubeApiSearchVideosMethod,
            method: "GET",
            json: true,
            qs: qsParams
         });
      } else {
         return null;
      }
   }).then(function(data) {
      prevPageToken = data && data.items && data.items.length > 0 ? prevPageToken : null;
      return {
            'videos': videosResult,
            'totalResults': totalResults,
            'nextPageToken': nextPageToken,
            'prevPageToken': prevPageToken
      };
   });
}
