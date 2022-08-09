"use strict";
const GA = use("App/Models/GestaoAssociada");
const RepresentanteServicos = use("App/Models/RepresentanteServicos");
const PlanoMunicipal = use("App/Models/PlanoMunicipal");
const PoliticaMunicipal = use("App/Models/PoliticaMunicipal");
const ParticipacaoControleSocial = use("App/Models/ParticipacaoControleSocial");
const SaneamentoRural = use("App/Models/SaneamentoRural");
const ComunidadesTradicionais = use("App/Models/ComunidadesTradicionais");
const Helpers = use("Helpers");
const Fs = use("fs");
const File = use("App/Models/File");

class GestaoIndicadoresController {
  async index() {}
  async store({ request }) {
    try {
      const {
        id_municipio,
        id_gestao_associada,
        id_saneamento_rural,
        id_comunidades_tradicionais,

        nome_associacao,
        norma_associacao,

        pcs_ano,
        pcs_titulo,

        plano_ano,
        plano_titulo,

        politica_ano,
        politica_titulo,

        sr_descricao,

        ct_nomes_comunidades,
        ct_descricao,
      } = request.all();

      if (id_gestao_associada) {
        updateGa();
        console.log(id_gestao_associada);
      } else {
        addGa();
      }
      if (id_saneamento_rural) {
        updateSaneamentoRural();
      } else {
        addSaneamentoRural();
      }
      if (id_comunidades_tradicionais) {
        updateComunidadesTradicionais();
      } else {
        addComunidadesTradicionais();
      }
      async function addGa() {
        await GA.create({
          nome: nome_associacao,
          norma: norma_associacao,
          id_municipio: id_municipio,
        });
      }

      async function updateGa() {
        await GA.query()
          .from("tedplan.gestao_associada")
          .where("id_municipio", id_municipio)
          .update({
            nome: nome_associacao,
            norma: norma_associacao,
            id_municipio: id_municipio,
          });
      }

      //Só será adcionado participacao e o controle social se existir arquivo pdf anexo
      if (request.file("pcs_arquivo")) {
        const upload_file = request.file("pcs_arquivo", { size: "100mb" });
        const fileName = `${Date.now()}.${upload_file.subtype}`;
        await upload_file.move(Helpers.tmpPath("uploads"), {
          name: fileName,
        });
        if (!upload_file.moved()) {
          throw upload_file.error;
        }

        const file = await File.create({
          file: fileName,
          name: upload_file.clientName,
          type: upload_file.type,
          subtype: upload_file.subtype,
        });
        await ParticipacaoControleSocial.create({
          titulo: pcs_titulo,
          ano: pcs_ano,
          id_municipio: id_municipio,
        });
      }
      async function updateParticipacaoControleSocial() {
        await ParticipacaoControleSocial.query()
          .from("tedplan.participacao_controle_social")
          .where("id_municipio", id_municipio)
          .update({
            titulo: pcs_titulo,
            ano: pcs_ano,
            id_municipio: id_municipio,
          });
      }

      //Só será adcionado um novo plano municipal se existir arquivo pdf anexo
      if (request.file("plano_arquivo")) {
        const upload_file = request.file("plano_arquivo", { size: "100mb" });
        const fileName = `${Date.now()}.${upload_file.subtype}`;
        await upload_file.move(Helpers.tmpPath("uploads"), {
          name: fileName,
        });
        if (!upload_file.moved()) {
          throw upload_file.error;
        }

        const file = await File.create({
          file: fileName,
          name: upload_file.clientName,
          type: upload_file.type,
          subtype: upload_file.subtype,
        });

        await PlanoMunicipal.create({
          titulo: plano_titulo,
          ano: plano_ano,
          id_municipio: id_municipio,
          id_arquivo: file.id,
        });
      }
      async function updatePlanoMunicipal() {
        await PlanoMunicipal.query()
          .from("tedplan.plano_municipal")
          .where("id_municipio", id_municipio)
          .update({
            titulo: plano_titulo,
            ano: plano_ano,
            id_municipio: id_municipio,
          });
      }

      //Só será adcionado uma nova politica municipal se existir arquivo pdf anexo
      if (request.file("politica_arquivo")) {
        const upload_file = request.file("politica_arquivo", {
          size: "100mb",
        });
        const fileName = `${Date.now()}.${upload_file.subtype}`;
        await upload_file.move(Helpers.tmpPath("uploads"), {
          name: fileName,
        });
        if (!upload_file.moved()) {
          throw upload_file.error;
        }

        const file = await File.create({
          file: fileName,
          name: upload_file.clientName,
          type: upload_file.type,
          subtype: upload_file.subtype,
        });

        await PoliticaMunicipal.create({
          titulo: politica_titulo,
          ano: politica_ano,
          id_municipio: id_municipio,
          id_arquivo: file.id,
        });
      }

      async function updatePoliticaMunicipal() {
        await PoliticaMunicipal.query()
          .from("teplan.politica_municipal")
          .where("id_municipio", id_municipio)
          .update({
            titulo: politica_titulo,
            ano: politica_ano,
            id_municipio: id_municipio,
          });
      }
      async function addSaneamentoRural() {
        await SaneamentoRural.create({
          descricao: sr_descricao,
          id_municipio: id_municipio,
        });
      }
      async function updateSaneamentoRural() {
        await SaneamentoRural.query()
          .from("tedplan.saneamento_rural")
          .where("id_municipio", id_municipio)
          .update({
            descricao: sr_descricao,
          });
      }

      async function addComunidadesTradicionais() {
        await ComunidadesTradicionais.create({
          nomes_comunidades_beneficiadas: ct_nomes_comunidades,
          descricao: ct_descricao,
          id_municipio: id_municipio,
        });
      }

      async function updateComunidadesTradicionais() {
        await ComunidadesTradicionais.query()
          .from("tedplan.comunidades_tradicionais")
          .where("id_municipio", id_municipio)
          .update({
            nomes_comunidades_beneficiadas: ct_nomes_comunidades,
            descricao: ct_descricao,
            id_municipio: id_municipio,
          });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async addRepresentanteServicos({ request }) {
    try {
      const {
        ga_nome_representante,
        ga_cargo,
        ga_telefone,
        ga_email,
        id_municipio,
      } = request.all();

      const rs = await RepresentanteServicos.create({
        nome: ga_nome_representante,
        cargo: ga_cargo,
        telefone: ga_telefone,
        email: ga_email,
        id_municipio: id_municipio,
      });

      return rs;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async updateRepresentanteServicos() {
    await RepresentanteServicos.query()
      .from("tedplan.representante_servicos_ga")
      .where("id_municipio", id_municipio)
      .update({
        nome: ga_nome_representante,
        cargo: ga_cargo,
        telefone: ga_telefone,
        email: ga_email,
        id_municipio: id_municipio,
      });
  }

  async getRepresentantesServicos({ request }) {
    const { id_municipio } = request.all();
    const resGa = await RepresentanteServicos.query()
      .from("tedplan.representante_servicos_ga")
      .where("id_municipio", id_municipio)
      .fetch();
    return resGa;
  }

  async getPlanos({ request }) {
    const { id_municipio } = request.all();
    const resGa = await PlanoMunicipal.query()
      .from("tedplan.plano_municipal")
      .where("id_municipio", id_municipio)
      .orderBy("id_plano_municipal", "desc")
      .fetch();
    return resGa;
  }

  async getPoliticas({ request }) {
    const { id_municipio } = request.all();
    const resGa = await PoliticaMunicipal.query()
      .from("tedplan.politica_municipal")
      .where("id_municipio", id_municipio)
      .orderBy("id_politica_municipal", "desc")
      .fetch();
    return resGa;
  }

  async getParticipacaoCS({ request }) {
    const { id_municipio } = request.all();
    const resGa = await ParticipacaoControleSocial.query()
      .from("tedplan.participacao_controle_social")
      .where("id_municipio", id_municipio)
      .orderBy("id_participacao_controle_social", "desc")
      .fetch();
    return resGa;
  }

  async getGestaoAssociada({ request }) {
    const { id_municipio } = request.all();
    const resGa = await GA.query()
      .select(
        "ga.id as id_gestao_associada",
        "sr.id_saneamento_rural",
        "ct.id_comunidades_tradicionais",
        "ga.nome as ga_nome",
        "ga.norma as ga_norma",
        "sr.descricao as sr_descricao",
        "ct.nomes_comunidades_beneficiadas",
        "ct.descricao as ct_descricao"
      )
      .from("tedplan.gestao_associada as ga")
      .innerJoin(
        "tedplan.saneamento_rural as sr",
        "ga.id_municipio",
        "sr.id_municipio"
      )
      .innerJoin(
        "tedplan.comunidades_tradicionais as ct",
        "ga.id_municipio",
        "ct.id_municipio"
      )
      .where("ga.id_municipio", id_municipio)
      .orderBy("ga.id", "desc")
      .fetch();
    return resGa;
  }

  async destroyPolitica({ request }) {
    try {
      const { id_arquivo, id } = request.all();

      const politica = await PoliticaMunicipal.findBy(
        "id_politica_municipal",
        id
      );
      await politica.delete();
      if (id_arquivo) {
        const file = await File.findBy("id", id_arquivo);
        if (file) {
          Fs.unlinkSync(Helpers.tmpPath(`uploads/${file.file}`));
          await file.delete();
        }
      }
    } catch (error) {
      console.log(error);
      return new CustomException().handle(error, { response });
    }
  }

  async destroyPlano({ request }) {
    try {
      const { id_arquivo, id } = request.all();

      const plano = await PlanoMunicipal.findBy("id_plano_municipal", id);
      await plano.delete();
      if (id_arquivo) {
        const file = await File.findBy("id", id_arquivo);
        if (file) {
          Fs.unlinkSync(Helpers.tmpPath(`uploads/${file.file}`));
          await file.delete();
        }
      }
    } catch (error) {
      return new CustomException().handle(error, { response });
    }
  }

  async destroyParticipacao({ request }) {
    try {
      const { id_arquivo, id } = request.all();

      const plano = await ParticipacaoControleSocial.findBy(
        "id_participacao_controle_social",
        id
      );
      await plano.delete();
      if (id_arquivo) {
        const file = await File.findBy("id", id_arquivo);
        if (file) {
          Fs.unlinkSync(Helpers.tmpPath(`uploads/${file.file}`));
          await file.delete();
        }
      }
    } catch (error) {
      return new CustomException().handle(error, { response });
    }
  }

  async destroyRepresentante({ request }){
    const { id } = request.all();
    try {
      const representante = await RepresentanteServicos.findBy(
        "id_representante_servicos_ga", id)
      await representante.delete()
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = GestaoIndicadoresController;
