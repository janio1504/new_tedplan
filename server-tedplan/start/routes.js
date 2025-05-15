"use strict";

const { RouteResource } = require("@adonisjs/framework/src/Route/Manager");

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */

const Route = use("Route");

Route.post("login", "SessionController.store");

Route.delete("deletePublicacao", "PublicacaoController.destroy");
Route.post("addPublicacao", "PublicacaoController.store");
Route.post("updatePublicacao", "PublicacaoController.update");
Route.post("updateImagemPublicacao", "PublicacaoController.updateImagem");
Route.get("listTipoPublicacao", "PublicacaoController.listTipoPublicacao");
Route.get("getPublicacoes", "PublicacaoController.index");
Route.get("getPublicacao", "PublicacaoController.getPublicacao");
Route.get("getPorFiltroPublicacoes", "PublicacaoController.buscaPorFiltro");
Route.get("getEixos", "EixoController.index");
Route.get("getCategorias", "CategoriaController.index");
Route.get("getMunicipios", "MunicipioController.index");
Route.get("getMunicipio", "MunicipioController.getMunicipio");
Route.post("addMunicipio", "MunicipioController.store");
Route.get("getEscalas", "EscalaController.index");

Route.get("getFile", "FileController.showFile");
Route.get("getImagem", "FileController.showImagem");
Route.get("getImagens", "FileController.show");
Route.delete("deleteImagem", "FileController.destroyImagem");

Route.get("getGalerias", "GaleriaController.index");
Route.post("getPorFiltroGaleria", "GaleriaController.getGaleriaPorFiltro");

Route.get("getManual", "ManualController.getManual");
Route.get("getManuais", "ManualController.index");
Route.post("addManual", "ManualController.store");
Route.delete("deleteManual", "ManualController.destroy");
Route.post("updateManual", "ManualController.update");
Route.post("updateImagemManual", "ManualController.updateImagem");

Route.post(
  "addRepresentanteServicos",
  "GestaoIndicadoresController.addRepresentanteServicos"
);
Route.get(
  "getRepresentantesServicos",
  "GestaoIndicadoresController.getRepresentantesServicos"
);

Route.get("get-all-presidencia-conselho-municipal/:id", "GestaoIndicadoresController.getAllPresidenciaConselhoMunicipal");
Route.post("create-presidencia-conselho-municipal", "GestaoIndicadoresController.addPresidenciaConselhoMunicipal");
Route.put("update-presidencia-conselho-municipal", "GestaoIndicadoresController.updatePresidenciaConselhoMunicipal");
Route.delete("delete-presidencia-conselho-municipal/:id", "GestaoIndicadoresController.destroyPresidenciaConselhoMunicipal");
Route.get("get-presidencia-conselho-municipal/:id", "GestaoIndicadoresController.getPresidenciaConselhoMunicipal");

Route.get("get-conselhos-municipais/:id", "GestaoIndicadoresController.getConselhosMunicipais");
Route.post("create-conselho-municipal", "GestaoIndicadoresController.addConselhoMunicipal");
Route.put("update-conselho-municipal", "GestaoIndicadoresController.updateConselhoMunicipal");
Route.delete("delete-conselho-municipal/:id", "GestaoIndicadoresController.destroyConselhoMunicipal");
Route.get("get-conselho-municipal/:id", "GestaoIndicadoresController.getConselhoMunicipal");

Route.delete("remover-representante", "GestaoIndicadoresController.destroyRepresentante");
Route.delete("remover-politica", "GestaoIndicadoresController.destroyPolitica");
Route.delete("remover-plano", "GestaoIndicadoresController.destroyPlano");
Route.delete(
  "remover-participacao",
  "GestaoIndicadoresController.destroyParticipacao"
);
Route.post("addGestaoIndicadores", "GestaoIndicadoresController.store");
Route.get("getGestao", "GestaoIndicadoresController.getGestaoAssociada");
Route.get("getPlanos", "GestaoIndicadoresController.getPlanos");
Route.get("getPoliticas", "GestaoIndicadoresController.getPoliticas");
Route.get(
  "getParticipacaoControleSocial",
  "GestaoIndicadoresController.getParticipacaoCS"
);
Route.post("addFinanceiro", "FinanceiroController.store");
Route.post("addDadosFinanceiros", "FinanceiroController.store");

Route.post("addPsResiduosColeta", "PsResiduosColetaController.store");
Route.post("get-ps-residuos-coleta", "PsResiduosColetaController.getRsc");
Route.post("get-ps-residuos-coleta-por-ano", "PsResiduosColetaController.getRscPorAno");

Route.post("create-unidade-rsc", "PsResiduosColetaController.createUnidadeRsc");
Route.post("list-unidades-rsc", "PsResiduosColetaController.getUnidadesRsc");
Route.delete("remover-unidade-rsc", "PsResiduosColetaController.removerUnidadeRsc");

Route.post("create-unidade-rss", "PsResiduosColetaController.createUnidadeRss");
Route.post("list-unidades-rss", "PsResiduosColetaController.getUnidadesRss");
Route.delete("remover-unidade-rss", "PsResiduosColetaController.removerUnidadeRss");

Route.post("create-cooperativa-catadores", "PsResiduosColetaController.createCooperativaCatadores");
Route.post("list-cooperativas-catadores", "PsResiduosColetaController.getCooperativasCatadores");
Route.delete("delete-cooperativa-catadores", "PsResiduosColetaController.destroyCAC");

Route.post("create-unidade-processamento", "PsResiduosUnidadeController.createUnidadeProcessamento");
Route.post("create-dados-unidade-processamento", "PsResiduosUnidadeController.createDadosUnidadeProcessamento");
Route.post("list-unidades-processamento", "PsResiduosUnidadeController.getUnidadesProcessamento");
Route.post("list-unidades-processamento-por-tipo", "PsResiduosUnidadeController.getUnidadesProcessamento");
Route.post("get-unidade-processamento", "PsResiduosUnidadeController.getUnidadeProcessamento");
Route.post("get-dados-unidade-processamento", "PsResiduosUnidadeController.getDadosUnidadeProcessamento");
Route.delete("detete-unidade-processamento/:id", "PsResiduosUnidadeController.destroy");

Route.post("create-geral", "GeralController.store");
Route.post("get-geral", "GeralController.getDadosGerais");
Route.post("get-geral-por-ano", "GeralController.getDadosGeraisAno");

Route.post("create-agua", "AguaController.createAgua");
Route.post("get-agua", "AguaController.getAgua");
Route.post("get-agua-por-ano", "AguaController.getAguaAno");

Route.post("create-balanco", "BalancoController.createBalanco");
Route.post("get-balanco", "BalancoController.getBalanco");
Route.post("get-balanco-por-ano", "BalancoController.getBalancoPorAno");

Route.post("create-drenagem", "DrenagemController.createDrenagem");
Route.post("get-drenagem", "DrenagemController.getDrenagem");
Route.post("get-drenagem-por-ano", "DrenagemController.getDrenagemPorAno");

Route.post("create-qualidade", "QualidadeController.createQualidade");
Route.post("get-qualidade", "QualidadeController.getQualidade");

Route.post("create-esgoto", "EsgotoController.createEsgoto");
Route.post("get-esgoto", "EsgotoController.getEsgoto");
Route.post("get-esgoto-por-ano", "EsgotoController.getEsgotoPorAno");

Route.post("create-tarifa", "TarifaController.createTarifa");
Route.post("get-tarifa", "TarifaController.getTarifa");

Route.get("get-concessionaria/:id", "ConcessionariaController.getConcessionaria");
Route.post("get-concessionarias", "ConcessionariaController.getConcessionarias");
Route.post("create-concessionaria", "ConcessionariaController.store");


Route.post("create-residuos-recebidos", "PsQuantResiduosRecebidoController.createResiduosRecebidos");
Route.post("list-residuos-recebidos", "PsQuantResiduosRecebidoController.getResiduosRecebidos");

Route.post("addPsFinanceiro", "PsFinanceiroController.store");
Route.post("get-ps-financeiro", "PsFinanceiroController.getDadosFinanceiros");
Route.post("get-ps-financeiro-por-ano", "PsFinanceiroController.getDadosFinanceirosPorAno");

Route.get("getUsuario", "UsuariosController.getUsuario");

Route.post("create-descricao-indicador", "IndicadorController.createDescricaoIndicador");
Route.get("get-indicador/:id", "IndicadorController.getIndicador");
Route.post("get-indicador-por-codigo", "IndicadorController.getIndicadorPorCodigo");
Route.get("get-indicadores", "IndicadorController.getIndicadores");
Route.put("update-descricao-indicador", "IndicadorController.updateIndicador");
Route.delete("delete-descricao-indicador/:id", "IndicadorController.deleteIndicador");

Route.get("getNormas", "NormaController.index");
Route.get("getNorma", "NormaController.getNorma");
Route.get("getPorFiltroNormas", "NormaController.buscaPorFiltro");
Route.get("listTipoNorma", "NormaController.listTipoNormas");

Route.get('codigo-snis', 'CodigoSnisController.getAll');
Route.get('codigo-snis/:id', 'CodigoSnisController.getById');
Route.post('codigo-snis', 'CodigoSnisController.create');
Route.put('codigo-snis/:id', 'CodigoSnisController.update');
Route.delete('codigo-snis/:id', 'CodigoSnisController.delete');

Route.get("get-responsaveis-simisab/:id", "UsuariosController.getResponsaveisSimisab");

// Rotas autenticadas ------------------------------- //
Route.group(() => {
  Route.post("addPost", "PostsController.store");
  Route.get("getPosts", "PostsController.index");
  Route.post("updateImagemPost", "PostsController.updateImagem");
  Route.post("updatePost", "PostsController.update");
  Route.get("getPost", "PostsController.show");
  Route.delete("deletePost", "PostsController.destroy");

  Route.post("addUsuario", "UsuariosController.store");
  Route.delete("removerUsuario", "UsuariosController.destroyUsuario");
  Route.get("getUsuarios", "UsuariosController.index");
  Route.get("getTipoUsuario", "UsuariosController.getTipoUsuario");
  Route.get("getSistemas", "UsuariosController.getSistemas");
  Route.post("updatePermissoes", "UsuariosController.updatePermissoesUsuario");
  Route.get("listGalerias", "GaleriaController.index");
  
  Route.get("get-permissoes", "UsuariosController.getPermissoes");

  Route.post("addImagensGaleria", "GaleriaController.storeImagens");

  Route.get("getStatus", "ArquivoOndriveController.indexStatus");
  Route.get("getTipoArquivo", "ArquivoOndriveController.indexTipoArquivo");
  Route.get("getArquivosOndrive", "ArquivoOndriveController.index");
  Route.post("addArquivoOndrive", "ArquivoOndriveController.store");

  Route.get("getPermissaoSistema", "UsuariosController.getPermissaoSistema");

  Route.post("addNorma", "NormaController.store");
  Route.post("updateNorma", "NormaController.update");
  Route.post("updateImagemNorma", "NormaController.updateImagem");
  Route.delete("deleteNorma", "NormaController.destroy");



  Route.post("addFile", "FileController.store");
  Route.post("addGaleria", "GaleriaController.store");
  Route.delete("deleteGaleria", "GaleriaController.destroy");
}).middleware(["auth"]);
