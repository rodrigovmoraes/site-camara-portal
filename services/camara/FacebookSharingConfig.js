/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (LIBS MODULES) *******************************
/*****************************************************************************/
//...
//..
//.

/*****************************************************************************
****************************** Flickr API Config  ****************************
/*****************************************************************************/
var _camaraPortalUrlBase; //Ex: "http://www.camarasorocaba.sp.gov.br"
var _newsItemUrl; //Ex: "http://www.camarasorocaba.sp.gov.br/newsitem_sharing.html?id="
var _openNewsItemUrl; //Ex: "http://www.camarasorocaba.sp.gov.br/newsitem.html?id="
var _pageUrl; //Ex: "http://www.camarasorocaba.sp.gov.br/page_sharing.html?id="
var _openPageUrl; //Ex: "http://www.camarasorocaba.sp.gov.br/page.html?id="
var _legislativePropositionUrl; //Ex: "http://www.camarasorocaba.sp.gov.br/propositura_sharing.html?id="
var _openLegislativePropositionUrl; //Ex: "http://www.camarasorocaba.sp.gov.br/propositura.html?id="
var _materiaUrl; //Ex: "http://www.camarasorocaba.sp.gov.br/materia_sharing.html?id="
var _openMateriaUrl; //Ex: "http://www.camarasorocaba.sp.gov.br/materia.html?id="
var _licitacaoUrl; //Ex: "http://www.camarasorocaba.sp.gov.br/licitacao_sharing.html?id="
var _openLicitacaoUrl; //Ex: "http://www.camarasorocaba.sp.gov.br/licitacao.html?id="

/*****************************************************************************
*************************** Private Methods **********************************
/*****************************************************************************/

/*****************************************************************************
************************** Module Setters and Getters*************************
/*****************************************************************************/
module.exports.setCamaraPortalUrlBase = function(camaraPortalUrlBase) {
   _camaraPortalUrlBase = camaraPortalUrlBase;
}

module.exports.getCamaraPortalUrlBase = function() {
   return _camaraPortalUrlBase;
}

module.exports.setNewsItemUrl = function(newsItemUrl) {
   _newsItemUrl = newsItemUrl;
}

module.exports.getNewsItemUrl = function() {
   return _newsItemUrl;
}

module.exports.setOpenNewsItemUrl = function(openNewsItemUrl) {
   _openNewsItemUrl = openNewsItemUrl;
}

module.exports.getOpenNewsItemUrl = function() {
   return _openNewsItemUrl;
}

module.exports.setPageUrl = function(pageUrl) {
   _pageUrl = pageUrl;
}

module.exports.getPageUrl = function() {
   return _pageUrl;
}

module.exports.setOpenPageUrl = function(openPageUrl) {
   _openPageUrl = openPageUrl;
}

module.exports.getOpenPageUrl = function() {
   return _openPageUrl;
}


module.exports.setLegislativePropositionUrl = function(legislativePropositionUrl) {
   _legislativePropositionUrl = legislativePropositionUrl;
}

module.exports.getLegislativePropositionUrl = function() {
   return _legislativePropositionUrl;
}

module.exports.setOpenLegislativePropositionUrl = function(openLegislativePropositionUrl) {
   _openLegislativePropositionUrl = openLegislativePropositionUrl;
}

module.exports.getOpenLegislativePropositionUrl = function() {
   return _openLegislativePropositionUrl;
}

module.exports.setMateriaUrl = function(materiaUrl) {
   _materiaUrl = materiaUrl;
}

module.exports.getMateriaUrl = function() {
   return _materiaUrl;
}

module.exports.setOpenMateriaUrl = function(openMateriaUrl) {
   _openMateriaUrl = openMateriaUrl;
}

module.exports.getOpenMateriaUrl = function() {
   return _openMateriaUrl;
}

module.exports.setLicitacaoUrl = function(licitacaoUrl) {
   _licitacaoUrl = licitacaoUrl;
}

module.exports.getLicitacaoUrl = function() {
   return _licitacaoUrl;
}

module.exports.setOpenLicitacaoUrl = function(openLicitacaoUrl) {
   _openLicitacaoUrl = openLicitacaoUrl;
}

module.exports.getOpenLicitacaoUrl = function() {
   return _openLicitacaoUrl;
}

