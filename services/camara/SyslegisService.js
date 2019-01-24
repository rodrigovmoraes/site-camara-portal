/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (LIBS MODULES) *******************************
/*****************************************************************************/
var winston = require('winston');
var _requestService = require('request-promise');
var _ = require('lodash');
var Utils = require('./Utils.js');

/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (OTHERS MODULES) *******************************
/*****************************************************************************/
var _syslegisApiConfigService = require('./SyslegisApiConfigService.js');

/*****************************************************************************
*************************** Private Methods **********************************
/*****************************************************************************/
var _getPesquisaMateriasMethodURL = function () {
   return _syslegisApiConfigService.getBaseUrl() +
               _syslegisApiConfigService.getPesquisaMateriasMethodPath();
}

var _getMateriaLegislativaMethodURL = function() {
   return _syslegisApiConfigService.getBaseUrl() +
               _syslegisApiConfigService.getMateriaLegislativaMethodPath();
}

var _getTiposDeMateriaMethodURL = function() {
   return _syslegisApiConfigService.getBaseUrl() +
               _syslegisApiConfigService.getTiposDeMateriaMethodPath();
}

var _getAutoresMethodURL = function() {
   return _syslegisApiConfigService.getBaseUrl() +
               _syslegisApiConfigService.getAutoresMethodPath();
}

var _getUnidadesDeTramitacaoMethodURL = function() {
   return _syslegisApiConfigService.getBaseUrl() +
               _syslegisApiConfigService.getUnidadesDeTramitacaoMethodPath();
}

var _getListaDeStatusDeTramitacaoMethodURL = function() {
   return _syslegisApiConfigService.getBaseUrl() +
               _syslegisApiConfigService.getListaDeStatusDeTramitacaoMethodPath();
}

var _getClassificacoesMethodURL = function() {
   return _syslegisApiConfigService.getBaseUrl() +
               _syslegisApiConfigService.getClassificacoesMethodPath();
}

var _getOrdensDoDiaMethodURL = function() {
   return _syslegisApiConfigService.getBaseUrl() +
               _syslegisApiConfigService.getOrdensDoDiaMethodPath();
}

var _getOrdemDoDiaListaDeAnosMethodURL = function() {
   return _syslegisApiConfigService.getBaseUrl() +
               _syslegisApiConfigService.getOrdemDoDiaListaDeAnosMethodPath();
}

var _getComissoesMethodURL = function() {
   return _syslegisApiConfigService.getBaseUrl() +
               _syslegisApiConfigService.getComissoesMethodPath();
}

var _getMesaDiretoraMethodURL = function() {
   return _syslegisApiConfigService.getBaseUrl() +
               _syslegisApiConfigService.getMesaDiretoraMethodPath();
}

var _getLegislaturasMethodURL = function() {
   return _syslegisApiConfigService.getBaseUrl() +
               _syslegisApiConfigService.getLegislaturasMethodPath();
}

var _getSessoesLegislativasMethodURL = function() {
   return _syslegisApiConfigService.getBaseUrl() +
               _syslegisApiConfigService.getSessoesLegislativasMethodPath();
}

var _getVereadoresMethodURL = function() {
   return _syslegisApiConfigService.getBaseUrl() +
               _syslegisApiConfigService.getVereadoresMethodPath();
}

var _getVereadorMethodURL = function() {
   return _syslegisApiConfigService.getBaseUrl() +
               _syslegisApiConfigService.getVereadorMethodPath();
}

var _getVereadorResumoMateriasMethodURL = function() {
   return _syslegisApiConfigService.getBaseUrl() +
               _syslegisApiConfigService.getVereadorResumoMateriasMethodPath();
}

var _formatLeiDate = function(strDate) {
   if(strDate) {
      var leiDate = new Date(strDate);
      return Utils.toDDMMYYYY(leiDate);
   } else {
      return null;
   }
}

var _truncLastLeiEmenta = function(strLeiEmenta) {
   if(strLeiEmenta) {
      if(strLeiEmenta.length > 150) {
         return strLeiEmenta.substring(0, 150) + " ...";
      } else {
         return strLeiEmenta;
      }
   } else {
      return "";
   }
}

var _formatOrdemDoDiaData = function(strDate) {
   if(strDate) {
      var ordemDoDiaDate = new Date(strDate);
      return Utils.toDDMMYYYY(ordemDoDiaDate);
   } else {
      return null;
   }
}

var _formatOrdemDoDiaDataPostagem = function(strDate) {
   if(strDate) {
      var ordemDoDiaDate = new Date(strDate);
      return Utils.toDDMMYYYYHHhmm(ordemDoDiaDate);
   } else {
      return null;
   }
}

var _extractOrdemDoDiaAno = function(strDate) {
   if(strDate) {
      var ordemDoDiaDate = new Date(strDate);
      return ordemDoDiaDate.getFullYear().toString();
   } else {
      return null;
   }
}

//transform a version suitable to be displayed on the portal
var _transformLastProjetoDeLeiItem = function(lastProjetoDeLeiItem) {
   return {
      "lastProjetoDeLeiId": lastProjetoDeLeiItem.id,
      "lastProjetoDeLeiAutor": lastProjetoDeLeiItem.autor,
      "lastProjetoDeLeiDataApresentacao": _formatLeiDate(lastProjetoDeLeiItem.data_apresentacao),
      "lastProjetoDeLeiDataPublicacao": _formatLeiDate(lastProjetoDeLeiItem.data_publicacao),
      "lastProjetoDeLeiEmenta": lastProjetoDeLeiItem.ementa,
      "lastProjetoDeLeiEmentaTruncated": _truncLastLeiEmenta(lastProjetoDeLeiItem.ementa),
      "lastProjetoDeLeiNumero": lastProjetoDeLeiItem.numero,
      "lastProjetoDeLeiUltimaTramitacao": lastProjetoDeLeiItem.ultimaTramicao,
      "lastProjetoDeLeiDescription": "Projeto de Lei Ordinária " + _.padStart(lastProjetoDeLeiItem.numero, 3, "0") + "/" + lastProjetoDeLeiItem.ano
   }
}

var _transformLastProjetosDeLei = function(lastProjetosDeLeiItems) {
   var transformedLastProjetosDeLei = [];
   if(lastProjetosDeLeiItems) {
      lastProjetosDeLeiItems.forEach(function(lastProjetoDeLeiItem) {
         transformedLastProjetosDeLei.push(_transformLastProjetoDeLeiItem(lastProjetoDeLeiItem));
      });
   }
   return transformedLastProjetosDeLei;
}

//transform a version suitable to be displayed on the portal
var _transformMateriaLegislativaItem = function(materiaLegislativaItem) {
   return {
      "materiaLegislativaId": materiaLegislativaItem.id,
      "materiaLegislativaTipoDocumento": materiaLegislativaItem.tipoDocumento,
      "materiaLegislativaAutor": materiaLegislativaItem.autor,
      "materiaLegislativaDataApresentacao": _formatLeiDate(materiaLegislativaItem.data_apresentacao),
      "materiaLegislativaDataPublicacao": _formatLeiDate(materiaLegislativaItem.data_publicacao),
      "materiaLegislativaDataPrazoExecutivo": _formatLeiDate(materiaLegislativaItem.data_prazo_executivo),
      "materiaLegislativaDataPrazoProcesso": _formatLeiDate(materiaLegislativaItem.data_prazo_processo),
      "materiaLegislativaEmenta": materiaLegislativaItem.ementa,
      "materiaLegislativaNumero": materiaLegislativaItem.numero,
      "materiaLegislativaUltimaTramitacao": materiaLegislativaItem.ultimaTramicao,
      "materiaLegislativaDescription": materiaLegislativaItem.tipoDocumento + " " + _.padStart(materiaLegislativaItem.numero, 3, "0") + "/" + materiaLegislativaItem.ano
   }
}

var _transformMateriasLegislativas = function(materiasLegislativasItems) {
   var transformedMateriasLegislativas = [];
   if(materiasLegislativasItems) {
      materiasLegislativasItems.forEach(function(materiaLegislativaItem) {
         transformedMateriasLegislativas.push(_transformMateriaLegislativaItem(materiaLegislativaItem));
      });
   }
   return transformedMateriasLegislativas;
}

var _transformTiposDeMateria = function(tiposDeMateria) {
   var transformedTiposDeMateria = [];
   if(tiposDeMateria) {
      tiposDeMateria.forEach(function(tipoDeMateriaItem) {
         transformedTiposDeMateria.push(_transformTipoDeMateriaItem(tipoDeMateriaItem));
      });
   }
   return transformedTiposDeMateria;
}

var _transformTipoDeMateriaItem = function(tipoDeMateriaItem) {
   return {
      "tipoDeMateriaId": tipoDeMateriaItem.id,
      "tipoDeMateriaDescricao": tipoDeMateriaItem.descricao
   }
}

var _transformAutores = function(autores) {
   var transformedAutores = [];
   if(autores) {
      autores.forEach(function(autor) {
         transformedAutores.push(_transformAutorItem(autor));
      });
   }
   return transformedAutores;
}

var _transformAutorItem = function(autorItem) {
   return {
      "materiaAutorId": autorItem.id,
      "materiaAutorDescricao": autorItem.descricao
   }
}

var _transformUnidades = function(unidades) {
   var transformedUnidades = [];
   if(unidades) {
      unidades.forEach(function(unidade) {
         transformedUnidades.push(_transformUnidadeItem(unidade));
      });
   }
   return transformedUnidades;
}

var _transformUnidadeItem = function(unidadeItem) {
   return {
      "materiaUnidadeTramitacaoId": unidadeItem.id,
      "materiaUnidadeTramitacaoDescricao": unidadeItem.descricao
   }
}

var _transformListaDeStatusDeTramitacao = function(listaDeStatusDeTramitacao) {
   var transformedListaDeStatusDeTramitacao = [];
   if(listaDeStatusDeTramitacao) {
      listaDeStatusDeTramitacao.forEach(function(listaDeStatusDeTramitacaoItem) {
         transformedListaDeStatusDeTramitacao.push(_transformListaDeStatusDeTramitacaoItem(listaDeStatusDeTramitacaoItem));
      });
   }
   return transformedListaDeStatusDeTramitacao;
}

var _transformListaDeStatusDeTramitacaoItem = function(listaDeStatusDeTramitacaoItem) {
   return {
      "statusDeTramitacaoId": listaDeStatusDeTramitacaoItem.id,
      "statusDeTramitacaoDescricao": listaDeStatusDeTramitacaoItem.descricao
   }
}

var _transformClassificacoes = function(classificacoes) {
   var transformedClassificacoes = [];
   if(classificacoes) {
      classificacoes.forEach(function(classificacaoItem) {
         transformedClassificacoes.push(_transformClassificacaoItem(classificacaoItem));
      });
   }
   return transformedClassificacoes;
}

var _transformClassificacaoItem = function(classificacaoItem) {
   return {
      "classificacaoId": classificacaoItem.id,
      "classificacaoDescricao": classificacaoItem.descricao
   }
}

var _transformMateriaObject = function(prefix, obj) {
   var i;
   var j;
   var props = [];
   if(obj) {
      props = [];
      for(var prop in obj) {
         props.push(prop);
      }
      for(j = 0; j < props.length; j++) {
         obj[prefix + props[j]] = obj[props[j]];
         delete obj[props[j]];
      }
   }
}

var _transformMateriaCollection = function(prefix, collection) {
   var i;
   var j;
   var props = [];
   if(collection) {
      for(i = 0; i < collection.length; i++) {
         _transformMateriaObject(prefix, collection[i]);
      }
   }
}

var _transformOrdensDoDiaAnos = function(anos) {
   var i;
   var transformedAnos = [];
   if(anos) {
      for(i = 0; i < anos.length; i++) {
         transformedAnos.push({ 'anoValue': anos[i].ano });
      }
   }
   return transformedAnos;
}

var _transformClassificacaoItem = function(classificacaoItem) {
   return {
      "classificacaoId": classificacaoItem.id,
      "classificacaoDescricao": classificacaoItem.descricao
   }
}

var _transformComissaoCollectionDeeply = function(prefix, collectionOrObj) {
   if(collectionOrObj) {
      if(!Array.isArray(collectionOrObj)) {
         //base case
         var props = [];
         var j, k;
         for(var prop in collectionOrObj) {
            props.push(prop);
         }
         for(j = 0; j < props.length; j++) {
            collectionOrObj[prefix + props[j]] = collectionOrObj[props[j]];
            delete collectionOrObj[props[j]];
            if (collectionOrObj[prefix + props[j]] &&
                  Array.isArray(collectionOrObj[prefix + props[j]])) {
               _transformComissaoCollectionDeeply(prefix, collectionOrObj[prefix + props[j]]);
            } else if(collectionOrObj[prefix + props[j]] === false || collectionOrObj[prefix + props[j]] === true){
               //transform boolean values
               collectionOrObj[prefix + props[j]] = collectionOrObj[prefix + props[j]] ? "Sim" : "Não";
            }
         }
      } else {
         var i;
         for(i = 0; i < collectionOrObj.length; i++) {
            _transformComissaoCollectionDeeply(prefix, collectionOrObj[i]);
         }
      }
   }
}

var _transformMesaDiretoraCollectionDeeply = function(prefix, collectionOrObj) {
   if(collectionOrObj) {
      if(!Array.isArray(collectionOrObj) &&
            collectionOrObj instanceof Object) {
         //base case
         var props = [];
         var j, k;
         for(var prop in collectionOrObj) {
            props.push(prop);
         }
         for(j = 0; j < props.length; j++) {
            collectionOrObj[prefix + props[j]] = collectionOrObj[props[j]];
            delete collectionOrObj[props[j]];
            if (collectionOrObj[prefix + props[j]] === false || collectionOrObj[prefix + props[j]] === true) {
               //transform boolean values
               collectionOrObj[prefix + props[j]] = collectionOrObj[prefix + props[j]] ? "Sim" : "Não";
            }
            _transformMesaDiretoraCollectionDeeply(prefix, collectionOrObj[prefix + props[j]]);
         }
      } else if(Array.isArray(collectionOrObj)) {
         var i;
         for(i = 0; i < collectionOrObj.length; i++) {
            _transformMesaDiretoraCollectionDeeply(prefix, collectionOrObj[i]);
         }
      }
   }
}

var _transformVereadoresComunicacoesVirtuais = function(prefix, parentObj, comunicacoesVirtuaisCollection) {
   var i;
   delete parentObj[prefix + 'comunicacoesVirtuais'];
   parentObj[prefix + 'vereadorEmail'] = [];
   //Site
   parentObj[prefix + 'vereadorSite'] = [];
   //Blog
   parentObj[prefix + 'vereadorBlog'] = [];
   //Facebook
   parentObj[prefix + 'vereadorFacebook'] = [];
   //Instagram
   parentObj[prefix + 'vereadorInstagram'] = [];
   for(i = 0; i < comunicacoesVirtuaisCollection.length; i++) {
      switch(comunicacoesVirtuaisCollection[i].vereadorComunicacaoVirtualTipoId) {
          case 1:
              //Email
              parentObj[prefix + 'vereadorEmail'].push(comunicacoesVirtuaisCollection[i].vereadorEnderecoVirtual);
              break;
          case 2:
              //Site
              parentObj[prefix + 'vereadorSite'].push(comunicacoesVirtuaisCollection[i].vereadorEnderecoVirtual);
              break;
          case 3:
              //Blog
              parentObj[prefix + 'vereadorBlog'].push(comunicacoesVirtuaisCollection[i].vereadorEnderecoVirtual);
              break;
          case 4:
              //Facebook
              parentObj[prefix + 'vereadorFacebook'].push(comunicacoesVirtuaisCollection[i].vereadorEnderecoVirtual);
              break;
          case 5:
              //Instagram
              parentObj[prefix + 'vereadorInstagram'].push(comunicacoesVirtuaisCollection[i].vereadorEnderecoVirtual);
              break;
          default:
      }
   }
}

var _transformVereadoresCollectionDeeply = function(prefix, collectionOrObj, parentProp) {
   if(parentProp === undefined) {
      parentProp = null;
   }
   if(collectionOrObj) {
      if(!Array.isArray(collectionOrObj) &&
            collectionOrObj instanceof Object) {
         //base case
         var props = [];
         var j, k;
         for(var prop in collectionOrObj) {
            props.push(prop);
         }
         for(j = 0; j < props.length; j++) {
            collectionOrObj[prefix + props[j]] = collectionOrObj[props[j]];
            delete collectionOrObj[props[j]];
            if (prefix + props[j] !== prefix + 'comunicacoesVirtuais') {
               _transformVereadoresCollectionDeeply(prefix, collectionOrObj[prefix + props[j]], prefix + props[j]);
            } else {
               //implode comunicacoesVirtual to five properties:
               //    1 - vereadorEmail
               //    2 - vereadorSite
               //    3 - vereadorBlog
               //    4 - vereadorFacebook
               //    5 - vereadorInstagram
               _transformVereadoresComunicacoesVirtuais(prefix, collectionOrObj, collectionOrObj[prefix + 'comunicacoesVirtuais']);
            }
         }
         //if the vereador is not active set communication properties
         //to empty
         if(parentProp === prefix + 'vereadores') {
            if(!collectionOrObj[prefix + 'vereadorAtivo']) {
                  collectionOrObj[prefix + 'vereadorGabineteDescricao'] = null;
                  collectionOrObj[prefix + 'vereadorTelefone'] = null;
                  collectionOrObj[prefix + 'vereadorEmail'] = [];
                  collectionOrObj[prefix + 'vereadorSite'] = [];
                  collectionOrObj[prefix + 'vereadorBlog'] = [];
                  collectionOrObj[prefix + 'vereadorFacebook'] = [];
                  collectionOrObj[prefix + 'vereadorInstagram'] = [];
            }
         }
      } else if(Array.isArray(collectionOrObj)) {
         var i;
         for(i = 0; i < collectionOrObj.length; i++) {
            _transformVereadoresCollectionDeeply(prefix, collectionOrObj[i], parentProp);
         }
      }
   }
}

var _transformVereadorObjDeeply = function(prefix, collectionOrObj, parentProp) {
   if(parentProp === undefined) {
      parentProp = null;
   }
   if(collectionOrObj) {
      if(!Array.isArray(collectionOrObj) &&
            collectionOrObj instanceof Object) {
         //base case
         var props = [];
         var j, k;
         for(var prop in collectionOrObj) {
            props.push(prop);
         }
         for(j = 0; j < props.length; j++) {
            collectionOrObj[prefix + props[j]] = collectionOrObj[props[j]];
            delete collectionOrObj[props[j]];
            if (prefix + props[j] !== prefix + 'comunicacoesVirtuais') {
               _transformVereadorObjDeeply(prefix, collectionOrObj[prefix + props[j]], prefix + props[j]);
            } else {
               //implode comunicacoesVirtual to five properties:
               //    1 - vereadorEmail
               //    2 - vereadorSite
               //    3 - vereadorBlog
               //    4 - vereadorFacebook
               //    5 - vereadorInstagram
               _transformVereadoresComunicacoesVirtuais(prefix, collectionOrObj, collectionOrObj[prefix + 'comunicacoesVirtuais']);
            }
         }
         //if the vereador is not active set communication properties
         //to null
         if(parentProp === null) {
            if(!collectionOrObj[prefix + 'vereadorAtivo']) {
                  collectionOrObj[prefix + 'vereadorGabineteDescricao'] = null;
                  collectionOrObj[prefix + 'vereadorTelefone'] = null;
                  collectionOrObj[prefix + 'vereadorEmail'] = null;
                  collectionOrObj[prefix + 'vereadorSite'] = null;
                  collectionOrObj[prefix + 'vereadorEmail'] = null;
                  collectionOrObj[prefix + 'vereadorBlog'] = null;
                  collectionOrObj[prefix + 'vereadorEmail'] = null;
                  collectionOrObj[prefix + 'vereadorFacebook'] = null;
                  collectionOrObj[prefix + 'vereadorInstagram'] = null;
            }
         }
      } else if(Array.isArray(collectionOrObj)) {
         var i;
         for(i = 0; i < collectionOrObj.length; i++) {
            _transformVereadoresCollectionDeeply(prefix, collectionOrObj[i], parentProp);
         }
      }
   }
}

var _transformVereadorResumoMateriasObject = function(prefix, obj) {
   var i;
   var j;
   var props = [];
   if(obj) {
      props = [];
      for(var prop in obj) {
         props.push(prop);
      }
      for(j = 0; j < props.length; j++) {
         obj[prefix + props[j]] = obj[props[j]];
         delete obj[props[j]];
      }
   }
}

var _transformVereadorResumoMateriasCollection = function(prefix, collection) {
   var i;
   var j;
   var total = 0;
   var props = [];
   if(collection) {
      for(i = 0; i < collection.length; i++) {
         _transformVereadorResumoMateriasObject(prefix, collection[i]);
         if(collection[i][prefix + 'quantidade']) {
            total += collection[i][prefix + 'quantidade'];
         }
      }
   }
   return total;
}

var _transformLegislaturasObject = function(prefix, obj) {
   var i;
   var j;
   var props = [];
   if(obj) {
      props = [];
      for(var prop in obj) {
         props.push(prop);
      }
      for(j = 0; j < props.length; j++) {
         obj[prefix + props[j]] = obj[props[j]];
         delete obj[props[j]];
      }
   }
}

var _transformLegislaturasCollection = function(prefix, collection) {
   var i;
   var j;
   var props = [];
   if(collection) {
      for(i = 0; i < collection.length; i++) {
         _transformLegislaturasObject(prefix, collection[i]);
      }
   }
}

var _transformSessoesLegislativasObject = function(prefix, obj) {
   var i;
   var j;
   var props = [];
   if(obj) {
      props = [];
      for(var prop in obj) {
         props.push(prop);
      }
      for(j = 0; j < props.length; j++) {
         obj[prefix + props[j]] = obj[props[j]];
         delete obj[props[j]];
      }
   }
}

var _transformSessoesLegislativasCollection = function(prefix, collection) {
   var i;
   var j;
   var props = [];
   if(collection) {
      for(i = 0; i < collection.length; i++) {
         _transformSessoesLegislativasObject(prefix, collection[i]);
      }
   }
}

var _joinCollection = function(collection, field, character) {
   var i;
   var sValue = "";
   if(collection) {
      for(i = 0; i < collection.length; i++) {
         sValue += ( i === 0 ? '' :  character) + collection[i][field];
      }
   }
   return sValue;
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
module.exports.getLastProjetosDeLei = function(qtdProjetosDeLei) {
   return _requestService({
      url: _getPesquisaMateriasMethodURL(),
      method: "POST",
      json: true,
      body: {
         "filter" : {
      		"tipoMateriaId": 24,
            "limit": qtdProjetosDeLei,
            "offset": 0
	      }
      }
   }).then(function(data) {
      var lastUpdate = null;
      if(data.materiasLegislativas && data.materiasLegislativas.length > 0) {
         lastUpdate = new Date(data.materiasLegislativas[0].data_apresentacao);
         lastUpdate = Utils.getElapsedTimeDescription(lastUpdate);
      }
      return {
         "lastProjetosDeLeiUpdate": lastUpdate,
         "lastProjetosDeLei": _transformLastProjetosDeLei(data.materiasLegislativas)
      }
   });
}

module.exports.pesquisaMateriasLegislativas = function(filter) {
   return _requestService({
      url: _getPesquisaMateriasMethodURL(),
      method: "POST",
      json: true,
      body: {
         "filter" : filter
      }
   }).then(function(data) {
      return {
         materiasLegislativas: _transformMateriasLegislativas(data.materiasLegislativas),
         total: data.total
      }
   });
}

module.exports.getMateriaLegislativa = function(idMateria) {
   return _requestService({
      url: _getMateriaLegislativaMethodURL() + "/" + idMateria,
      method: "GET",
      json: true,
      body: {}
   }).then(function(data) {
      var i;
      _transformMateriaObject("Materia_", data.materia);
      //set number description
      data.materia["materiaLegislativaNumberDescription"] = _.padStart(data.materia["Materia_numero"], 3, "0") + "/" + data.materia["Materia_ano"];
      //set data apresentacao
      data.materia["Materia_data_apresentacao"] = _formatLeiDate(data.materia["Materia_data_apresentacao"]);
      data.materia["Materia_dataFimPrazoExecutivo"] = data.materia["Materia_dataFimPrazoExecutivo"] ? _formatLeiDate(data.materia["Materia_dataFimPrazoExecutivo"]) : null;
      data.materia["Materia_dataFimPrazoProcesso"] = data.materia["Materia_dataFimPrazoProcesso"] ? _formatLeiDate(data.materia["Materia_dataFimPrazoProcesso"]) : null;
      data.materia["Materia_classificacoes"] = _joinCollection(data.classificacoes, 'descricao', ', ');
      //coAutores
      data.materia["Materia_coatores"] = _joinCollection(data.coAutores, 'descricao', ', ');
      _transformMateriaCollection("Classificacao_", data.classificacoes);
      _transformMateriaCollection("CoAutores_", data.coAutores);
      _transformMateriaCollection("DocumentoAcessorio_", data.documentosAcessorios);
      //set data documento acessório
      if(data.documentosAcessorios) {
         for(i = 0; i < data.documentosAcessorios.length; i++) {
            data.documentosAcessorios[i]['DocumentoAcessorio_data'] = _formatLeiDate(data.documentosAcessorios[i]['DocumentoAcessorio_data']);
         }
      }
      _transformMateriaCollection("Tramitacao_", data.tramitacoes);
      //set data tramitacao
      if(data.tramitacoes) {
         for(i = 0; i < data.tramitacoes.length; i++) {
            data.tramitacoes[i]['Tramitacao_dataTramitacao'] = _formatLeiDate(data.tramitacoes[i]['Tramitacao_dataTramitacao']);
         }
      }
      return data;
   });
}

module.exports.getTiposDeMateria = function() {
   return _requestService({
      url: _getTiposDeMateriaMethodURL(),
      method: "GET",
      json: true,
      body: {}
   }).then(function(data) {
      return _transformTiposDeMateria(data.tiposDeMateria);
   });
}

module.exports.getAutores = function() {
   return _requestService({
      url: _getAutoresMethodURL(),
      method: "GET",
      json: true,
      body: {}
   }).then(function(data) {
      return _transformAutores(data.autores);
   });
}

module.exports.getUnidadesDeTramitacao = function() {
   return _requestService({
      url: _getUnidadesDeTramitacaoMethodURL(),
      method: "GET",
      json: true,
      body: {}
   }).then(function(data) {
      return _transformUnidades(data.unidades);
   });
}

module.exports.getListaDeStatusDeTramitacao = function() {
   return _requestService({
      url: _getListaDeStatusDeTramitacaoMethodURL(),
      method: "GET",
      json: true,
      body: {}
   }).then(function(data) {
      return _transformListaDeStatusDeTramitacao(data.listaDeStatus);
   });
}

module.exports.getClassificacoes = function() {
   return _requestService({
      url: _getClassificacoesMethodURL(),
      method: "GET",
      json: true,
      body: {}
   }).then(function(data) {
      return _transformClassificacoes(data.classificacoes);
   });
}

module.exports.getOrdensDoDia = function(filter) {
   return _requestService({
      url: _getOrdensDoDiaMethodURL(),
      method: "GET",
      json: true,
      qs: {
         'limit': filter.limit ? filter.limit : null,
         'offset': filter.offset ? filter.offset : null,
         'ano': filter.ano ? filter.ano : null,
         'mes': filter.mes ? filter.mes : null,
         'dia': filter.dia ? filter.dia : null
      }
   }).then(function(data) {
      var i;
      _transformMateriaCollection("OrdemDoDia_", data.ordensDoDia);
      if(data.ordensDoDia) {
         for(i = 0; i < data.ordensDoDia.length; i++) {
            var ordemDoDia = data.ordensDoDia[i];
            ordemDoDia['OrdemDoDia_ano'] = ordemDoDia['OrdemDoDia_data'] ? _extractOrdemDoDiaAno(ordemDoDia['OrdemDoDia_data']) : "";
            //set data
            ordemDoDia['OrdemDoDia_data'] = ordemDoDia['OrdemDoDia_data'] ? _formatOrdemDoDiaData(ordemDoDia['OrdemDoDia_data']) : "";
            //set data de postagem
            ordemDoDia['OrdemDoDia_dataPostagem'] = ordemDoDia['OrdemDoDia_dataPostagem'] ? _formatOrdemDoDiaDataPostagem(ordemDoDia['OrdemDoDia_dataPostagem']) : "";
         }
      }
      return {
         ordensDoDia: data.ordensDoDia,
         total: data.total
      }
   });
}

module.exports.getOrdemDoDiaListaDeAnos = function() {
   return _requestService({
      url: _getOrdemDoDiaListaDeAnosMethodURL(),
      method: "GET",
      json: true,
      body: {}
   }).then(function(data) {
      return _transformOrdensDoDiaAnos(data.anos);
   });
}

module.exports.getComissoes = function(filter) {
   var qs = {};
   if(filter.sessaoAtual) {
      qs.sessaoAtual = filter.sessaoAtual;
   } else if (filter.sessaoId) {
      qs.sessaoId = filter.sessaoId;
   } else if (filter.legislaturaId) {
      qs.legislaturaId = filter.legislaturaId;
   }
   return _requestService({
      url: _getComissoesMethodURL(),
      method: "GET",
      json: true,
      'qs': qs
   }).then(function(data) {
      _transformComissaoCollectionDeeply("Comissoes_", data.legislaturas);
      return data.legislaturas;
   });
}

module.exports.getMesaDiretora = function(filter) {
   var qs = {};
   if(filter.sessaoAtual) {
      qs.sessaoAtual = filter.sessaoAtual;
   } else if (filter.sessaoId) {
      qs.sessaoId = filter.sessaoId;
   } else if (filter.legislaturaId) {
      qs.legislaturaId = filter.legislaturaId;
   }

   return _requestService({
      url: _getMesaDiretoraMethodURL(),
      method: "GET",
      json: true,
      'qs': qs
   }).then(function(data) {
      _transformMesaDiretoraCollectionDeeply("MesaDiretora_", data.legislaturas);
      return data.legislaturas;
   });
}

module.exports.getLegislaturas = function() {
   return _requestService({
      url: _getLegislaturasMethodURL(),
      method: "GET",
      json: true,
      body: {}
   }).then(function(data) {
      _transformSessoesLegislativasCollection("Legislaturas_", data.legislaturas);
      return data.legislaturas;
   });
}

module.exports.getSessoesLegislativas = function(filter) {
   var qs = {};
   if (filter.legislaturaId) {
      qs.legislaturaId = filter.legislaturaId;
   }
   return _requestService({
      url: _getSessoesLegislativasMethodURL(),
      method: "GET",
      json: true,
      'qs': qs
   }).then(function(data) {
      _transformSessoesLegislativasCollection("SessoesLegislativas_", data.sessoes);
      return data.sessoes;
   });
}

module.exports.getVereadores = function(filter) {
   var qs = {};

   if(filter.legislaturaAtual) {
      qs.legislaturaAtual = filter.legislaturaAtual;
   } else if (filter.legislaturaId) {
      qs.legislaturaId = filter.legislaturaId;
   }

   return _requestService({
      url: _getVereadoresMethodURL(),
      method: "GET",
      json: true,
      'qs': qs
   }).then(function(data) {
      _transformVereadoresCollectionDeeply("Vereadores_", data.legislaturas);
      return data.legislaturas;
   });
}

module.exports.getVereador = function(idVereador) {
   return _requestService({
      url: _getVereadorMethodURL() + "/" + idVereador,
      method: "GET",
      json: true,
      body: {}
   }).then(function(data) {
      _transformVereadorObjDeeply("Vereador_", data.vereador);
      return data.vereador;
   });
}

module.exports.getVereadorResumoMaterias = function(idVereador) {
   return _requestService({
      url: _getVereadorResumoMateriasMethodURL() + "/" + idVereador,
      method: "GET",
      json: true,
      body: {}
   }).then(function(data) {
      var total = _transformVereadorResumoMateriasCollection("VereadorResumo_", data.resumo);
      data.total = total;
      return data;
   });
}
