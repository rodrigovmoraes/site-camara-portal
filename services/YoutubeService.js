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
var _playlistItemsMethod;//Ex, "playlistItems"
var _youtubeChannelId; //Ex, "UCWQR_GgpIhrfoG1vikt94bA"
var _youtubePlaylistId;//Ex, "UUWQR_GgpIhrfoG1vikt94bA"

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

module.exports.setPlaylistItemsMethod = function(playlistItemsMethod) {
   _playlistItemsMethod = playlistItemsMethod;
}

module.exports.setYoutubeChannelId = function(youtubeChannelId) {
   _youtubeChannelId = youtubeChannelId;
}

module.exports.setYoutubePlaylistId = function(youtubePlaylistId) {
   _youtubePlaylistId = youtubePlaylistId;
}

/*****************************************************************************
**************************  Module functions *********************************
/*****************************************************************************/
module.exports.getLastVideos = function(amountOfVideos) {
    return _requestService({
      url: _youtubeApiBaseUrl + "/" + _playlistItemsMethod,
      method: "GET",
      json: true,
      qs: {
         'part' : "snippet",
         'maxResults' : amountOfVideos,
         'key' : _youtubeApiKey,
         'playlistId' : _youtubePlaylistId
      }
   }).then(function(data) {
      var i;
      var videosResult = [];
      if(data.items) {
         for(i = 0; i < data.items.length; i++) {
            var resultItem = data.items[i];
            videosResult.push({
               youtubeVideoId: resultItem.snippet && resultItem.snippet.resourceId && resultItem.snippet.resourceId.videoId
                                    ? resultItem.snippet.resourceId.videoId : '',
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

module.exports.getVideosPage = function(pageToken, pageSize) {
   var videosResult = [];
   var totalResults = 0;
   var nextPageToken = null;
   var prevPageToken = null;

   var qsParams = {
      'part' : "snippet",
      'maxResults' : pageSize,
      'key' : _youtubeApiKey,
      'playlistId' : _youtubePlaylistId
   };
   //set page token
   if(pageToken) {
      qsParams['pageToken'] = pageToken;
   }
   return _requestService({
      url: _youtubeApiBaseUrl + "/" +  _playlistItemsMethod,
      method: "GET",
      json: true,
      qs: qsParams
   }).then(function(data) {
      var i;

      if(data.items) {
         for(i = 0; i < data.items.length; i++) {
            var resultItem = data.items[i];
            videosResult.push({
               youtubeVideoId: resultItem.snippet && resultItem.snippet.resourceId && resultItem.snippet.resourceId.videoId
                                    ? resultItem.snippet.resourceId.videoId : '',
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
      nextPageToken = data.nextPageToken ? data.nextPageToken : null;
      prevPageToken = data.prevPageToken ? data.prevPageToken : null;
      return {
            'videos': videosResult,
            'totalResults': totalResults,
            'nextPageToken': nextPageToken,
            'prevPageToken': prevPageToken
      };
   });
}
