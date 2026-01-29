"use strict";
const GA = use("App/Models/GestaoAssociada");
const RepresentanteServicos = use("App/Models/RepresentanteServicos");
const PlanoMunicipal = use("App/Models/PlanoMunicipal");
const PoliticaMunicipal = use("App/Models/PoliticaMunicipal");
const ParticipacaoControleSocial = use("App/Models/ParticipacaoControleSocial");
const SaneamentoRural = use("App/Models/SaneamentoRural");
const ComunidadesTradicionais = use("App/Models/ComunidadesTradicionais");
const Cmsb = use("App/Models/ConselhoMunicipalSaneamentoBasico");
const DataBase = use("App/Models/DatabaseTedplan");
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
        id_politica_municipal,
        id_plano_municipal,

        nome_associacao,
        norma_associacao,

        pcs_ano,
        pcs_titulo,

        plano_ano,
        plano_titulo,
        plano_situacao,

        politica_ano,
        politica_titulo,
        politica_situacao,

        sr_descricao,

        ct_nomes_comunidades,
        ct_descricao,
      } = request.all();

      if (id_gestao_associada) {
        updateGa();
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

      if (id_politica_municipal) {
        updatePoliticaMunicipal();
      }

      if (id_plano_municipal) {
        updatePlanoMunicipal();
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
          id_arquivo: file.id,
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
          situacao: plano_situacao || "aprovado",
        });
      }
      async function updatePlanoMunicipal() {
        try {
          // Buscar o plano atual para preservar dados existentes
          const existingPlan = await PlanoMunicipal.query()
            .from("tedplan.plano_municipal")
            .where("id_plano_municipal", id_plano_municipal)
            .first();

          if (!existingPlan) {
            console.log("Plano municipal não encontrado");
            return {
              success: false,
              message: "Plano municipal não encontrado",
            };
          }

          // Preparar dados para atualização, preservando valores existentes quando não fornecidos
          const updateData = {
            titulo: plano_titulo || existingPlan.titulo,
            ano: plano_ano || existingPlan.ano,
            id_municipio: id_municipio,
            situacao: plano_situacao || existingPlan.situacao || "aprovado",
          };

          // Realizar a atualização
          await PlanoMunicipal.query()
            .from("tedplan.plano_municipal")
            .where("id_plano_municipal", id_plano_municipal)
            .update(updateData);

          return {
            success: true,
            message: "Plano municipal atualizado com sucesso",
          };
        } catch (error) {
          console.log("Erro ao atualizar plano municipal:", error);
          return {
            success: false,
            message: "Erro ao atualizar plano municipal",
            error,
          };
        }
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
          situacao: politica_situacao || "aprovado",
        });
      }

      // async function updatePoliticaMunicipal() {
      //   await PoliticaMunicipal.query()
      //     .from("tedplan.politica_municipal")
      //     .where("id_municipio", id_municipio)
      //     .update({
      //       titulo: politica_titulo,
      //       ano: politica_ano,
      //       id_municipio: id_municipio,
      //       situacao: politica_situacao || "aprovado",
      //     });
      // }

      async function updatePoliticaMunicipal() {
        try {
          const existingPolicy = await PoliticaMunicipal.query()
            .from("tedplan.politica_municipal")
            .where("id_politica_municipal", id_politica_municipal)
            .first();

          if (!existingPolicy) {
            console.log("Política municipal não encontrada");
            return {
              success: false,
              message: "Política municipal não encontrada",
            };
          }

          const updateData = {
            titulo: politica_titulo || existingPolicy.titulo,
            ano: politica_ano || existingPolicy.ano,
            id_municipio: id_municipio,
            situacao:
              politica_situacao || existingPolicy.situacao || "aprovado",
          };

          await PoliticaMunicipal.query()
            .from("tedplan.politica_municipal")
            .where("id_politica_municipal", id_politica_municipal)
            .update(updateData);

          return {
            success: true,
            message: "Política municipal atualizada com sucesso",
          };
        } catch (error) {
          console.log("Erro ao atualizar política municipal:", error);
          return {
            success: false,
            message: "Erro ao atualizar política municipal",
            error,
          };
        }
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
        id_representante_servicos_ga,
        ga_nome_representante,
        ga_cargo,
        ga_telefone,
        ga_email,
        id_municipio,
      } = request.all();

      if (id_representante_servicos_ga) {
        return await updateRepresentanteServicos(id_representante_servicos_ga);
      } else {
        const rs = await RepresentanteServicos.create({
          nome: ga_nome_representante,
          cargo: ga_cargo,
          telefone: ga_telefone,
          email: ga_email,
          id_municipio: id_municipio,
        });

        return rs;
      }
      async function updateRepresentanteServicos(id) {
        await RepresentanteServicos.query()
          .from("tedplan.representante_servicos_ga")
          .where("id_representante_servicos_ga", id)
          .update({
            nome: ga_nome_representante,
            cargo: ga_cargo,
            telefone: ga_telefone,
            email: ga_email,
            id_municipio: id_municipio,
          });
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getRepresentantesServicos({ request }) {
    const { id_municipio } = request.all();
    const resGa = await RepresentanteServicos.query()
      .from("tedplan.representante_servicos_ga")
      .where("id_municipio", id_municipio)
      .fetch();
    return resGa;
  }

  // async addConselhoMunicipal({ request, response }) {
  //   try {
  //     const { titulo, ano, id_municipio, operacao } = request.all();

  //     if (request.file("arquivo")) {
  //       const upload_file = request.file("arquivo", { size: "100mb" });
  //       const fileName = `${Date.now()}.${upload_file.subtype}`;
  //       await upload_file.move(Helpers.tmpPath("uploads"), {
  //         name: fileName,
  //       });
  //       if (!upload_file.moved()) {
  //         throw upload_file.error;
  //       }

  //       const file = await File.create({
  //         file: fileName,
  //         name: upload_file.clientName,
  //         type: upload_file.type,
  //         subtype: upload_file.subtype,
  //       });
  //       console.log(request.all());

  //       await Cmsb.create({
  //         titulo: titulo,
  //         ano: ano,
  //         id_municipio: id_municipio,
  //         operacao: operacao,
  //         id_arquivo: file.id,
  //       });

  //       return response.status(200).send({
  //         message:
  //           "Conselho Municipal de Saneamento Básico adicionado com sucesso",
  //       });
  //     }
  //     return response.status(400).send({
  //       message: "Erro ao adicionar o Conselho Municipal de Saneamento Básico",
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async addConselhoMunicipal({ request, response }) {
    try {
      const { titulo, ano, id_municipio, operacao, situacao } = request.all();

      // Validação dos campos obrigatórios
      if (!titulo || !ano || !id_municipio) {
        return response.status(400).send({
          message: "Título, ano e id_municipio são obrigatórios",
        });
      }

      let id_arquivo = null;

      // Processa arquivo se fornecido
      if (request.file("arquivo")) {
        const upload_file = request.file("arquivo", { size: "100mb" });
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
        id_arquivo = file.id;
      }

      // Cria o conselho com ou sem arquivo
      await Cmsb.create({
        titulo: titulo,
        ano: ano,
        id_municipio: id_municipio,
        operacao: operacao || null,
        situacao: situacao || "operante",
        id_arquivo: id_arquivo,
      });

      return response.status(200).send({
        message:
          "Conselho Municipal de Saneamento Básico adicionado com sucesso",
      });
    } catch (error) {
      console.log("Erro ao adicionar conselho municipal:", error);
      return response.status(500).send({
        message: "Erro ao adicionar o Conselho Municipal de Saneamento Básico",
        error: error.message,
      });
    }
  }

  async updateConselhoMunicipal({ request, response }) {
    try {
      const {
        id_conselho_municipal_saneamento_basico,
        titulo,
        ano,
        operacao,
        situacao,
      } = request.all();

      const res = await Cmsb.query()
        .from("tedplan.conselho_municipal_saneamento_basico")
        .where(
          "id_conselho_municipal_saneamento_basico",
          id_conselho_municipal_saneamento_basico
        )
        .fetch();
      const conselho = res.toJSON()[0];
      if (!conselho) {
        return response.status(404).send({
          message: "Conselho Municipal de Saneamento Básico não encontrado",
        });
      }

      await Cmsb.query()
        .from("tedplan.conselho_municipal_saneamento_basico")
        .where(
          "id_conselho_municipal_saneamento_basico",
          id_conselho_municipal_saneamento_basico
        )
        .update({
          titulo: titulo ? titulo : conselho.titulo,
          ano: ano ? ano : conselho.ano,
          operacao: operacao ? operacao : conselho.operacao,
          situacao: situacao ? situacao : conselho.situacao || "operante",
        });
      return response.status(200).send({
        message:
          "Conselho Municipal de Saneamento Básico atualizado com sucesso",
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getConselhoMunicipal({ params }) {
    const res = await DataBase.query()
      .from("tedplan.conselho_municipal_saneamento_basico")
      .where("id_conselho_municipal_saneamento_basico", params.id)
      .fetch();
    return res;
  }

  async getConselhosMunicipais({ params }) {
    const res = await DataBase.query()
      .from("tedplan.conselho_municipal_saneamento_basico")
      .where("id_municipio", params.id)
      .orderBy("id_conselho_municipal_saneamento_basico", "desc")
      .fetch();
    return res;
  }

  async destroyConselhoMunicipal({ params, response }) {
    try {
      const resConselho = await DataBase.query()
        .from("tedplan.conselho_municipal_saneamento_basico")
        .where("id_conselho_municipal_saneamento_basico", params.id)
        .fetch();
      const conselho = resConselho.toJSON()[0];
      if (!conselho) {
        return response.status(404).send({
          message: "Conselho Municipal de Saneamento Básico não encontrado",
        });
      }
      const id_arquivo = conselho.id_arquivo;
      await DataBase.query()
        .from("tedplan.conselho_municipal_saneamento_basico")
        .where("id_conselho_municipal_saneamento_basico", params.id)
        .delete();

      if (id_arquivo) {
        const file = await File.findBy("id", id_arquivo);
        if (file) {
          Fs.unlinkSync(Helpers.tmpPath(`uploads/${file.file}`));
          await file.delete();
        }
      }
      return response.status(200).send({
        message: "Conselho Municipal de Saneamento Básico removido com sucesso",
      });
    } catch (error) {
      console.log(error);
    }
  }

  async addPresidenciaConselhoMunicipal({ request, response }) {
    try {
      const {
        nome_presidente,
        setor_responsavel,
        telefone_presidente,
        email_presidente,
        id_conselho_municipal_saneamento_basico,
        integrantes,
        id_municipio,
      } = request.all();

      const presidencia = await DataBase.query()
        .from("tedplan.presidencia_conselho_municipal_saneamento_basico")
        .where("id_municipio", id_municipio)
        .insert({
          nome_presidente: nome_presidente,
          setor_responsavel: setor_responsavel,
          telefone_presidente: telefone_presidente,
          email_presidente: email_presidente,
          id_conselho_municipal_saneamento_basico:
            id_conselho_municipal_saneamento_basico,
          integrantes: integrantes,
          id_municipio: id_municipio,
        });

      return response.status(200).send({
        message: "Presidência do Conselho Municipal adicionada com sucesso",
        data: presidencia,
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send({
        message: "Erro ao adicionar a Presidência do Conselho Municipal",
      });
    }
  }

  async updatePresidenciaConselhoMunicipal({ request, response }) {
    try {
      const {
        id_presidencia_conselho_municipal_saneamento_basico,
        nome_presidente,
        setor_responsavel,
        telefone_presidente,
        email_presidente,
        id_conselho_municipal_saneamento_basico,
        integrantes,
        id_municipio,
      } = request.all();

      const res = await DataBase.query()
        .from("tedplan.presidencia_conselho_municipal_saneamento_basico")
        .where(
          "id_presidencia_conselho_municipal_saneamento_basico",
          id_presidencia_conselho_municipal_saneamento_basico
        )
        .fetch();
      const presidencia = res[0];
      if (!presidencia) {
        await DataBase.query()
          .from("tedplan.presidencia_conselho_municipal_saneamento_basico")
          .where(
            "id_presidencia_conselho_municipal_saneamento_basico",
            id_presidencia_conselho_municipal_saneamento_basico
          )
          .update({
            nome_presidente: nome_presidente
              ? nome_presidente
              : presidencia.nome_presidente,
            setor_responsavel: setor_responsavel
              ? setor_responsavel
              : presidencia.setor_responsavel,
            telefone_presidente: telefone_presidente
              ? telefone_presidente
              : presidencia.telefone_presidente,
            email_presidente: email_presidente
              ? email_presidente
              : presidencia.email_presidente,
            id_conselho_municipal_saneamento_basico:
              id_conselho_municipal_saneamento_basico
                ? id_conselho_municipal_saneamento_basico
                : presidencia.id_conselho_municipal_saneamento_basico,
            integrantes: integrantes ? integrantes : presidencia.integrantes,
            id_municipio: id_municipio
              ? id_municipio
              : presidencia.id_municipio,
          });

        return response.status(200).send({
          message: "Presidência do Conselho Municipal atualizada com sucesso",
        });
      }
      return response.status(404).send({
        message: "Presidência do Conselho Municipal não encontrada",
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send({
        message: "Erro ao atualizar a Presidência do Conselho Municipal",
      });
    }
  }

  async getPresidenciaConselhoMunicipal({ params }) {
    const res = await DataBase.query()
      .from("tedplan.presidencia_conselho_municipal_saneamento_basico")
      .where("id_presidencia_conselho_municipal_saneamento_basico", params.id)
      .fetch();
    return res;
  }

  async getAllPresidenciaConselhoMunicipal({ params }) {
    const res = await DataBase.query()
      .from("tedplan.presidencia_conselho_municipal_saneamento_basico")
      .where("id_municipio", params.id)
      .fetch();
    return res;
  }

  async destroyPresidenciaConselhoMunicipal({ params, response }) {
    try {
      await DataBase.query()
        .from("tedplan.presidencia_conselho_municipal_saneamento_basico")
        .where("id_presidencia_conselho_municipal_saneamento_basico", params.id)
        .delete();

      return response.status(200).send({
        message: "Presidência do Conselho Municipal removida com sucesso",
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send({
        message: "Erro ao remover a Presidência do Conselho Municipal",
      });
    }
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
    
    // Buscar apenas o registro de gestao_associada (sem JOINs que causam produto cartesiano)
    const gestaoAssociada = await GA.query()
      .where("id_municipio", id_municipio)
      .orderBy("id", "desc")
      .first();
    
    if (!gestaoAssociada) {
      return [];
    }
    
    // Buscar primeiro registro de saneamento_rural se existir
    const srData = await SaneamentoRural.query()
      .where("id_municipio", id_municipio)
      .orderBy("id_saneamento_rural", "desc")
      .first();
    
    // Buscar primeiro registro de comunidades_tradicionais se existir
    const ctData = await ComunidadesTradicionais.query()
      .where("id_municipio", id_municipio)
      .orderBy("id_comunidades_tradicionais", "desc")
      .first();
    
    // Retornar apenas um registro único combinando os dados
    return [{
      id_gestao_associada: gestaoAssociada.id,
      id_saneamento_rural: srData ? srData.id_saneamento_rural : null,
      id_comunidades_tradicionais: ctData ? ctData.id_comunidades_tradicionais : null,
      ga_nome: gestaoAssociada.nome,
      ga_norma: gestaoAssociada.norma,
      sr_descricao: srData ? srData.descricao : null,
      nomes_comunidades_beneficiadas: ctData ? ctData.nomes_comunidades_beneficiadas : null,
      ct_descricao: ctData ? ctData.descricao : null
    }];
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
      console.log(error);
      //return new CustomException().handle(error, { response });
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

  async destroyRepresentante({ request }) {
    const { id } = request.all();
    try {
      const representante = await RepresentanteServicos.findBy(
        "id_representante_servicos_ga",
        id
      );
      await representante.delete();
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = GestaoIndicadoresController;
