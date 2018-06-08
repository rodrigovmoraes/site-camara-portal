/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (LIBS MODULES) *******************************
/*****************************************************************************/
// ...

/*****************************************************************************
****************************** Flickr API Config  ****************************
/*****************************************************************************/
var _baseUrl; //Ex, "http://localhost:3002/"
//methods paths
var _portalMenuMethodPath; //Ex, "menuPortalTree"
var _newsMethodPath; //Ex, "newsItems"
var _newsItemMethodPath; //Ex, "newsItem"
var _incrementNewsViewsMethodPath; //Ex, "incrementNewsViews"
var _pageMethodPath; //Ex, "page"
var _bannersMethodPath; //Ex, "banners"
var _hotNewsMethodPath; //Ex, "hotnews"
var _breakingNewsMethodPath; //Ex, "breakingNews"
var _fbreakingNewsMethodPath; //Ex, "fbreakingNews"

/*****************************************************************************
*************************** Private Methods **********************************
/*****************************************************************************/

/*****************************************************************************
************************** Module Setters and Getters*************************
/*****************************************************************************/
module.exports.setBaseUrl = function(baseUrl) {
   _baseUrl = baseUrl;
}

module.exports.getBaseUrl = function() {
   return _baseUrl;
}

module.exports.setPortalMenuMethodPath = function(portalMenuMethodPath) {
   _portalMenuMethodPath = portalMenuMethodPath;
}

module.exports.getPortalMenuMethodPath = function() {
   return _portalMenuMethodPath;
}

module.exports.setNewsMethodPath = function(newsMethodPath) {
   _newsMethodPath = newsMethodPath;
}

module.exports.getNewsMethodPath = function() {
   return _newsMethodPath;
}

module.exports.setNewsItemMethodPath = function(newsItemMethodPath) {
   _newsItemMethodPath = newsItemMethodPath;
}

module.exports.getNewsItemMethodPath = function() {
   return _newsItemMethodPath;
}

module.exports.setIncrementNewsViewsMethodPath = function(incrementNewsViewsMethodPath) {
   _incrementNewsViewsMethodPath = incrementNewsViewsMethodPath;
}

module.exports.getIncrementNewsViewsMethodPath = function() {
   return _incrementNewsViewsMethodPath;
}

module.exports.setPageMethodPath = function(pageMethodPath) {
   _pageMethodPath = pageMethodPath;
}

module.exports.getPageMethodPath = function() {
   return _pageMethodPath;
}

module.exports.setBannersMethodPath = function(bannersMethodPath) {
   _bannersMethodPath = bannersMethodPath;
}

module.exports.getBannersMethodPath = function() {
   return _bannersMethodPath;
}

module.exports.setHotNewsMethodPath = function(hotNewsMethodPath) {
   _hotNewsMethodPath = hotNewsMethodPath;
}

module.exports.getHotNewsMethodPath = function() {
   return _hotNewsMethodPath;
}

module.exports.setBreakingNewsMethodPath = function(breakingNewsMethodPath) {
   _breakingNewsMethodPath = breakingNewsMethodPath;
}

module.exports.getBreakingNewsMethodPath = function() {
   return _breakingNewsMethodPath;
}

module.exports.setFBreakingNewsMethodPath = function(fbreakingNewsMethodPath) {
   _fbreakingNewsMethodPath = fbreakingNewsMethodPath;
}

module.exports.getFBreakingNewsMethodPath = function() {
   return _fbreakingNewsMethodPath;
}
