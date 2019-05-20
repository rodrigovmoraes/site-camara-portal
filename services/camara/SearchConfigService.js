/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (LIBS MODULES) *******************************
/*****************************************************************************/
// ...

/*****************************************************************************
****************************** Flickr API Config  ****************************
/*****************************************************************************/
var _elasticSearchConnectionConfig;
var _searchResultUrlMappings;
var _documentTypes;
var _maxResultSize;

/*****************************************************************************
*************************** Private Methods **********************************
/*****************************************************************************/

/*****************************************************************************
************************** Module Setters and Getters*************************
/*****************************************************************************/
module.exports.setElasticSearchConnectionConfig = function(elasticSearchConnectionConfig) {
   _elasticSearchConnectionConfig = elasticSearchConnectionConfig;
}

module.exports.getElasticSearchConnectionConfig = function() {
   return _elasticSearchConnectionConfig;
}

module.exports.setSearchResultUrlMappings = function(searchResultUrlMappings) {
   _searchResultUrlMappings = searchResultUrlMappings;
}

module.exports.getSearchResultUrlMappings = function() {
   return _searchResultUrlMappings;
}

module.exports.setDocumentTypes = function(documentTypes) {
   _documentTypes = documentTypes;
}

module.exports.getDocumentTypes = function() {
   return _documentTypes;
}

module.exports.setMaxResultSize = function(maxResultSize) {
   _maxResultSize = maxResultSize;
}

module.exports.getMaxResultSize = function() {
   return _maxResultSize;
}
