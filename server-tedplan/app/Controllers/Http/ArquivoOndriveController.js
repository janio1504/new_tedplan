"use strict";

const Arquivo = use("App/Models/ArquivoOndrive");

class ArquivoOndriveController {
  async index() {
    try {
      const arquivos = await Arquivo.query()
        .select(
          "a.id_arquivo_ondrive",
          "a.titulo",
          "a.link",
          "a.id_eixo",
          "e.nome as eixo",
          "a.id_tipo_arquivo_ondrive",
          "tao.nome as tipo_arquivo_ondrive",
          "a.id_status",
          "s.nome as status",
          "data_entrega",
          "data_final"
        )
        .from("tedplan.arquivo_ondrive as a")
        .innerJoin("tedplan.eixos as e", "a.id_eixo", "e.id_eixo")
        .innerJoin("tedplan.status as s", "a.id_status", "s.id_status")
        .innerJoin(
          "tedplan.tipo_arquivo_ondrive as tao",
          "a.id_tipo_arquivo_ondrive",
          "tao.id_tipo_arquivo_ondrive"
        )
        .fetch();
      return arquivos;
    } catch (error) {
      console.log(error);
    }
  }

  async indexTipoArquivo() {
    const tipoArquivos = await Arquivo.query()
      .from("tedplan.tipo_arquivo_ondrive")
      .fetch();
    return tipoArquivos;
  }

  async indexStatus() {
    const status = await Arquivo.query().from("tedplan.status").fetch();
    return status;
  }

  async store({ request, response }) {
    const {
      titulo,
      link,
      id_eixo,
      id_status,
      id_tipo_arquivo_ondrive,
      data_entrega,
      data_final,
    } = request.all();

    const resArq = await Arquivo.query()
      .from("tedplan.arquivo_ondrive")
      .insert({
        titulo: titulo,
        link: link,
        id_eixo: id_eixo,
        id_status: id_status,
        id_tipo_arquivo_ondrive: id_tipo_arquivo_ondrive,
        data_entrega: data_entrega,
        data_final: data_final,
      });

    return resArq;
  }
}

module.exports = ArquivoOndriveController;
