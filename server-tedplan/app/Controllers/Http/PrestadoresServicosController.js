"use strict";

const PrestadorServico = use("App/Models/PrestadorServico");

class PrestadoresServicosController {
  async getPrestadoresServicos({ request }) {
    const { id_municipio, eixo } = request.all();

    try {
      switch (eixo) {
        case "agua":
          return await this.getPrestadoresServicosAgua(id_municipio);
        case "drenagem":
          return await this.getPrestadoresServicosDrenagem(id_municipio);
        case "residuos":
          return await this.getPrestadoresServicosResiduos(id_municipio);
        case "esgoto":
          return await this.getPrestadoresServicosEsgoto(id_municipio);
        default:
          return [];
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getPrestadoresServicosAgua(id_municipio) {
    let query = PrestadorServico.query()
      .select("*")
      .from("tedplan.ps_abastecimento_agua as ps_aa")
      .where("ps_aa.id_municipio", id_municipio)
      .orderBy("ps_aa.id_ps_abastecimento_agua", "desc")
      .limit(1);

    const result = await query.fetch();
    return result;
  }

  async getPrestadoresServicosDrenagem(id_municipio) {
    let query = PrestadorServico.query()
      .select("*")
      .from("tedplan.ps_drenagem_aguas_pluviais as ps_dap")
      .where("ps_dap.id_municipio", id_municipio);
    const result = await query.fetch();
    return result;
  }

  async getPrestadoresServicosResiduos(id_municipio) {
    let query = PrestadorServico.query()
      .select("*")
      .from("tedplan.ps_residuo_solido as ps_rs")
      .where("ps_rs.id_municipio", id_municipio);
    const result = await query.fetch();
    return result;
  }

  async getPrestadoresServicosEsgoto(id_municipio) {
    let query = PrestadorServico.query()
      .select("*")
      .from("tedplan.ps_esgotamento_sanitario as ps_es")
      .where("ps_es.id_municipio", id_municipio);
    const result = await query.fetch();
    return result;
  }
}

module.exports = PrestadoresServicosController;
