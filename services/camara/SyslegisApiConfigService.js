/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (LIBS MODULES) *******************************
/*****************************************************************************/
// ...

/*****************************************************************************
****************************** Flickr API Config  ****************************
/*****************************************************************************/
var _baseUrl; //Ex, "http://localhost:3003/"
//methods paths
var _pesquisaMateriasMethodPath;//Ex: "materiasLegislativas"
var _tiposDeMateriaMethodPath;//Ex: "tiposDeMateria"
var _autoresMethodPath;//Ex: "autores"
var _unidadesDeTramitacaoMethodPath;//Ex: "unidadesDeTramitacao"
var _unidadesDeTramitacaoMethodPath;//Ex: "unidadesDeTramitacao"
var _listaDeStatusDeTramitacaoMethodPath;//Ex: "listaDeStatusDeTramitacao"
var _classificacoesMethodPath;//Ex: "classificacoes"
var _materiaLegislativaMethodPath;//Ex: "materiaLegislativa"
var _materiaTextoOriginalUrlDownload ;//Ex: "http://www.camarasorocaba.sp.gov.br:8383/syslegis/materiaLegislativa/imprimirTextoIntegral?idMateria="
var _materiaTextoFinalUrlDownload;//Ex: "http://www.camarasorocaba.sp.gov.br:8383/syslegis/materiaLegislativa/imprimirTextoIntegralFinal?idMateria="
var _documentoAcessorioUrlDownload;//Ex: "http://www.camarasorocaba.sp.gov.br:8383/syslegis/documentoAcessorio/imprimirTextoIntegral?idDocumentoAcessorio="
var _ordensDoDiaMethodPath;//Ex: "ordensDoDia"
var _ordemDoDiaListaDeAnosMethodPath;//Ex: "ordensDoDia/anos"
var _comissoesMethodPath;//Ex: "comissoes"
var _legislaturasMethodPath;//Ex: "legislaturas"
var _sessoesLegislativasMethodPath;//Ex: "sessoesLegislativas"
var _mesaDiretoraMethodPath;//Ex: "mesaDiretora"
var _vereadoresMethodPath;//Ex: "vereadores"
var _vereadorMethodPath;//Ex: "vereador"
var _vereadorResumoMateriasMethodPath;//Ex: "/vereador/resumoMaterias"
var _vereadorImageUrl;//Ex: "http://www.camarasorocaba.sp.gov.br:8383/syslegis/vereador/getConteudo/"
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

module.exports.setPesquisaMateriasMethodPath = function(pesquisaMateriasMethodPath) {
   _pesquisaMateriasMethodPath = pesquisaMateriasMethodPath;
}

module.exports.getPesquisaMateriasMethodPath = function() {
   return _pesquisaMateriasMethodPath;
}

module.exports.setTiposDeMateriaMethodPath = function(tiposDeMateriaMethodPath) {
   _tiposDeMateriaMethodPath = tiposDeMateriaMethodPath;
}

module.exports.getTiposDeMateriaMethodPath = function() {
   return _tiposDeMateriaMethodPath;
}

module.exports.setTiposDeMateriaMethodPath = function(tiposDeMateriaMethodPath) {
   _tiposDeMateriaMethodPath = tiposDeMateriaMethodPath;
}

module.exports.setAutoresMethodPath = function(autoresMethodPath) {
   _autoresMethodPath = autoresMethodPath;
}

module.exports.getAutoresMethodPath = function() {
   return _autoresMethodPath;
}

module.exports.setUnidadesDeTramitacaoMethodPath = function(unidadesDeTramitacaoMethodPath) {
   _unidadesDeTramitacaoMethodPath = unidadesDeTramitacaoMethodPath;
}

module.exports.getUnidadesDeTramitacaoMethodPath = function() {
   return _unidadesDeTramitacaoMethodPath;
}

module.exports.setListaDeStatusDeTramitacaoMethodPath = function(listaDeStatusDeTramitacaoMethodPath) {
   _listaDeStatusDeTramitacaoMethodPath = listaDeStatusDeTramitacaoMethodPath;
}

module.exports.getListaDeStatusDeTramitacaoMethodPath = function() {
   return _listaDeStatusDeTramitacaoMethodPath;
}

module.exports.setClassificacoesMethodPath = function(classificacoesMethodPath) {
   _classificacoesMethodPath = classificacoesMethodPath;
}

module.exports.getClassificacoesMethodPath = function() {
   return _classificacoesMethodPath;
}

module.exports.setMateriaLegislativaMethodPath = function(materiaLegislativaMethodPath) {
   _materiaLegislativaMethodPath = materiaLegislativaMethodPath;
}

module.exports.getMateriaLegislativaMethodPath = function() {
   return _materiaLegislativaMethodPath;
}

module.exports.setMateriaTextoOriginalUrlDownload = function(materiaTextoOriginalUrlDownload) {
   _materiaTextoOriginalUrlDownload = materiaTextoOriginalUrlDownload;
}

module.exports.getMateriaTextoOriginalUrlDownload = function() {
   return _materiaTextoOriginalUrlDownload;
}

module.exports.setMateriaTextoFinalUrlDownload = function(materiaTextoFinalUrlDownload) {
   _materiaTextoFinalUrlDownload = materiaTextoFinalUrlDownload;
}

module.exports.getMateriaTextoFinalUrlDownload = function() {
   return _materiaTextoFinalUrlDownload;
}

module.exports.setDocumentoAcessorioUrlDownload = function(documentoAcessorioUrlDownload) {
   _documentoAcessorioUrlDownload = documentoAcessorioUrlDownload;
}

module.exports.getDocumentoAcessorioUrlDownload = function() {
   return _documentoAcessorioUrlDownload;
}

module.exports.setOrdensDoDiaMethodPath = function(ordensDoDiaMethodPath) {
   _ordensDoDiaMethodPath = ordensDoDiaMethodPath;
}

module.exports.getOrdensDoDiaMethodPath = function() {
   return _ordensDoDiaMethodPath;
}

module.exports.setOrdemDoDiaListaDeAnosMethodPath = function(ordemDoDiaListaDeAnosMethodPath) {
   _ordemDoDiaListaDeAnosMethodPath = ordemDoDiaListaDeAnosMethodPath;
}

module.exports.getOrdemDoDiaListaDeAnosMethodPath = function() {
   return _ordemDoDiaListaDeAnosMethodPath;
}

module.exports.setComissoesMethodPath = function(comissoesMethodPath) {
   _comissoesMethodPath = comissoesMethodPath;
}

module.exports.getComissoesMethodPath = function() {
   return _comissoesMethodPath;
}

module.exports.setLegislaturasMethodPath = function(legislaturasMethodPath) {
   _legislaturasMethodPath = legislaturasMethodPath;
}

module.exports.getLegislaturasMethodPath = function() {
   return _legislaturasMethodPath;
}

module.exports.setSessoesLegislativasMethodPath = function(sessoesLegislativasMethodPath) {
   _sessoesLegislativasMethodPath = sessoesLegislativasMethodPath;
}

module.exports.getSessoesLegislativasMethodPath = function() {
   return _sessoesLegislativasMethodPath;
}

module.exports.setMesaDiretoraMethodPath = function(mesaDiretoraMethodPath) {
   _mesaDiretoraMethodPath = mesaDiretoraMethodPath;
}

module.exports.getMesaDiretoraMethodPath = function() {
   return _mesaDiretoraMethodPath;
}

module.exports.setVereadoresMethodPath = function(vereadoresMethodPath) {
   _vereadoresMethodPath = vereadoresMethodPath;
}

module.exports.getVereadoresMethodPath = function() {
   return _vereadoresMethodPath;
}

module.exports.setVereadorMethodPath = function(vereadorMethodPath) {
   _vereadorMethodPath = vereadorMethodPath;
}

module.exports.getVereadorMethodPath = function() {
   return _vereadorMethodPath;
}

module.exports.setVereadorResumoMateriasMethodPath = function(vereadorResumoMateriasMethodPath) {
   _vereadorResumoMateriasMethodPath = vereadorResumoMateriasMethodPath;
}

module.exports.getVereadorResumoMateriasMethodPath = function() {
   return _vereadorResumoMateriasMethodPath;
}

module.exports.setVereadorImageUrl = function(vereadorImageUrl) {
   _vereadorImageUrl = vereadorImageUrl;
}

module.exports.getVereadorImageUrl = function() {
   return _vereadorImageUrl;
}
