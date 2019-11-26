/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (LIBS MODULES) *******************************
/*****************************************************************************/
var winston = require('winston');
var elasticsearch = require('elasticsearch');
var _ = require('lodash');

/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (OTHERS MODULES) *******************************
/*****************************************************************************/
var _ = require('lodash');
var Utils = require('./Utils.js');
var _searchConfigService = require('./SearchConfigService.js');

/*****************************************************************************
*************************** Private Methods **********************************
/*****************************************************************************/

var _getElasticSearchConnectionConfig = function() {
   return _.clone( _searchConfigService.getElasticSearchConnectionConfig() );
}

//build url for the hit item based on url mappings defined in config file
var _buildUrl = function(hitItem) {
   var urlMapping = _searchConfigService.getSearchResultUrlMappings()[hitItem['_source']['type']];
   if (urlMapping) {
      return {
         url: _.template(urlMapping.urlPattern)({ id: hitItem['_source']['datasourceId'] }),
         target: urlMapping.target
      }
   } else {
      return {
         url: '',
         target: '_self'
      }
   }
}

var _formatHitItemDate = function(strDate) {
   if(strDate) {
      var hitItemDate = new Date(strDate);
      return Utils.toDDMMYYYYHHhmm(hitItemDate);
   } else {
      return null;
   }
}

var _extractTitle = function(hitItem) {
   if (hitItem.highlight) {
      //try title field
      if (hitItem.highlight['title'] && hitItem.highlight['title'].length > 0) {
         return hitItem.highlight['title'][0];
      //try description field
      } else {
         return hitItem['_source']['title'];
      }
   } else {
      //else return descripton field
      return hitItem['_source']['title'];
   }
}

var _extractDescription = function(hitItem) {
   if (hitItem.highlight) {
      //try title field
      if (hitItem.highlight['description'] && hitItem.highlight['description'].length > 0) {
         return hitItem.highlight['description'][0];
      //try description field
      } else {
         return hitItem['_source']['description'];
      }
   } else {
      //else return descripton field
      return hitItem['_source']['description'];
   }
}


var _extractText = function(hitItem) {
   if (hitItem.highlight) {
      //try title field
      if (hitItem.highlight['text'] && hitItem.highlight['text'].length > 0) {
         return "&ldquo; " + hitItem.highlight['text'][0] + " &rdquo;";
      //try description field
      } else {
         return "";
      }
   } else {
      //else return descripton field
      return "";
   }
}

var _transformSearchHitsItem = function(prefix, hitItem) {
   var transformedItem = {};
   var urlResult;
   transformedItem[prefix + 'Titulo'] = _extractTitle(hitItem);
   transformedItem[prefix + 'Id'] = hitItem['_source']['datasourceId'];
   transformedItem[prefix + 'Tipo'] = hitItem['_source']['type'];
   transformedItem[prefix + 'TipoDescricao'] = hitItem['_source']['typeDescription'];
   transformedItem[prefix + 'SubtipoDescricao'] = hitItem['_source']['subtypeDescription'];
   transformedItem[prefix + 'Descricao'] = _extractDescription(hitItem);
   transformedItem[prefix + 'Texto'] = _extractText(hitItem);
   transformedItem[prefix + 'Data'] = _formatHitItemDate(hitItem['_source']['date']);
   transformedItem[prefix + 'DataDescricao'] = _formatHitItemDate(hitItem['_source']['dateDescription']);
   urlResult = _buildUrl(hitItem);
   transformedItem[prefix + 'Url'] = urlResult.url;
   transformedItem[prefix + 'Target'] = urlResult.target;
   return transformedItem;
}

var _transformSearchHits = function (prefix, hits) {
   var resultItems = [];
   var i;
   if (hits && hits.hits) {
      for (i = 0; i < hits.hits.length; i++) {
         resultItems.push(_transformSearchHitsItem(prefix, hits.hits[i]))
      }
   }
   return {
      'resultItems': resultItems,
      'total': hits ? hits.total : 0
   }
}

var _queryWithDocumentTypeFilter = function(filter) {
   return {  "dis_max" : {
                "tie_breaker" : 0.7,
                "queries" : [
                      {
                        "bool": {
                           "must": {
                               "match" : {
                                   "title" : {
                                      "query": filter.keywords,
                                      "analyzer": "brazilian_analyzer",
                                      "boost": 3
                                   }
                               }
                           },
                           "filter": {  "term": {
                                    "type": filter['documentTypeTag']
                                 }
                           }
                        }
                     },
                     {
                       "bool": {
                          "must": {
                               "match" : {
                                    "description" : {
                                       "query": filter.keywords,
                                       "analyzer": "brazilian_analyzer",
                                       "boost": 2
                                    }
                               }
                          },
                          "filter": {  "term": {
                                   "type": filter['documentTypeTag']
                                }
                          }
                       }
                     },
                     {
                       "bool": {
                          "must": {
                               "match" : {
                                    "text" : {
                                       "query": filter.keywords,
                                       "analyzer": "brazilian_analyzer",
                                       "boost": 1
                                    }
                                 }
                          },
                          "filter": {  "term": {
                                   "type": filter['documentTypeTag']
                                }
                          }
                       }
                     }
                ]
             }
          }
}

var _queryWithoutDocumentTypeFilter = function(filter) {
   return { "dis_max" : {
               "tie_breaker" : 0.7,
               "queries" : [
                  {
                        "match" : {
                             "title" : {
                                "query": filter.keywords,
                                "analyzer": "brazilian_analyzer",
                                "boost": 3
                             }
                        }
                  },
                  {
                        "match" : {
                             "description" : {
                                "query": filter.keywords,
                                "analyzer": "brazilian_analyzer",
                                "boost": 2
                             }
                        }
                  },
                  {
                        "match" : {
                             "text" : {
                                "query": filter.keywords,
                                "analyzer": "brazilian_analyzer",
                                "boost": 1
                             }
                        }
                  }
               ]
            }
          }
}

/*****************************************************************************
*************************** Module Setters ***********************************
/*****************************************************************************/
//...
//..
//.

/*****************************************************************************
**************************  Module functions *********************************
/*****************************************************************************/
module.exports.search = function(filter) {
   var elasticsearchClient = new elasticsearch.Client( _getElasticSearchConnectionConfig() );
   return elasticsearchClient
            .search({
               'index': 'camara_portal',
               'type': "_doc",
               'size': filter.limit,
               'from': filter.offset,
               'body': {
                         "_source": [ "type", "typeDescription", "subtypeDescription",
                                       "datasourceId", "dateDescription", "date", "title", "description" ],
                         "query": filter['documentTypeTag'] ? _queryWithDocumentTypeFilter(filter)
                                                            : _queryWithoutDocumentTypeFilter(filter),
                         "highlight" : {
                             "fields" : [
                                 { "title" : { "number_of_fragments": 1, "fragment_size": 500 } },
                                 { "description" : { "number_of_fragments": 1, "fragment_size": 500 } },
                                 { "text" : { "number_of_fragments": 1, "fragment_size": 500 } }
                             ]
                         }
               }
            }).then(function(result) {
               return _transformSearchHits('buscaItem', result.hits)
            });
}
