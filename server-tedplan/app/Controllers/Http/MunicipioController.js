"use strict";

const Municipio = use("App/Models/Municipio");

class MunicipioController {
  async index() {
    const municipios = await Municipio.query()
      .from("tedplan.municipios")
      .fetch();

    return municipios;
  }

  async getMunicipio({ request, response }) {
    try {
      const { id_municipio } = request.all();

      const municipio = await Municipio.query()
        .select(
          "m.id_municipio",
          "tsms.id_titular_servicos_ms",
          "psaa.id_ps_abastecimento_agua",
          "pses.id_ps_esgotamento_sanitario",
          "psdap.id_ps_drenagem_aguas_pluviais",
          "psrs.id_ps_residuo_solido",
          "rfss.id_regulador_fiscalizador_ss",
          "id_controle_social_sms",
          "id_responsavel_simisab",
          "id_dados_demograficos",

          "m.nome as municipio_nome",
          "m.codigo_ibge as municipio_codigo_ibge",
          "m.cnpj as municipio_cnpj",
          "m.cep as municipio_cep",
          "m.endereco as municipio_endereco",
          "m.numero as municipio_numero",
          "m.bairro as municipio_bairro",
          "m.municipio_telefone as municipio_telefone",
          "m.municipio_email as municipio_email",
          "m.nome_prefeito as municipio_prefeito",
          "m.nome_prefeitura as municipio_nome_prefeitura",

          "tsms.setor_responsavel_tsms as ts_setor_reponsavel",
          "tsms.telefone_comercial_tsms as ts_telefone_comercial",
          "tsms.nome_responsavel_tsms as ts_responsavel",
          "tsms.cargo_tsms as ts_cargo",
          "tsms.telefone_tsms as ts_telefone",
          "tsms.email_tsms as ts_email",

          "psaa.ps_setor_responsavel as aa_secretaria_setor_responsavel",
          "psaa.ps_abrangencia as  aa_abrangencia",
          "psaa.ps_natureza_juridica as aa_natureza_juridica",
          "psaa.ps_cnpj as aa_cnpj",
          "psaa.ps_telefone as aa_telefone",
          "psaa.ps_cep as aa_cep",
          "psaa.ps_endereco as aa_endereco",
          "psaa.ps_numero as aa_numero",
          "psaa.ps_bairro as aa_bairro",
          "psaa.ps_nome_responsavel as aa_responsavel",
          "psaa.ps_cargo as aa_cargo",
          "psaa.ps_email as aa_email",

          "pses.ps_setor_responsavel as es_secretaria_setor_responsavel",
          "pses.ps_abrangencia as  es_abrangencia",
          "pses.ps_natureza_juridica as es_natureza_juridica",
          "pses.ps_cnpj as es_cnpj",
          "pses.ps_telefone as es_telefone",
          "pses.ps_cep as es_cep",
          "pses.ps_endereco as es_endereco",
          "pses.ps_numero as es_numero",
          "pses.ps_bairro as es_bairro",
          "pses.ps_nome_responsavel as es_responsavel",
          "pses.ps_cargo as es_cargo",
          "pses.ps_email as es_email",

          "psdap.ps_setor_responsavel as da_secretaria_setor_responsavel",
          "psdap.ps_abrangencia as  da_abrangencia",
          "psdap.ps_natureza_juridica as da_natureza_juridica",
          "psdap.ps_cnpj as da_cnpj",
          "psdap.ps_telefone as da_telefone",
          "psdap.ps_cep as da_cep",
          "psdap.ps_endereco as da_endereco",
          "psdap.ps_numero as da_numero",
          "psdap.ps_bairro as da_bairro",
          "psdap.ps_nome_responsavel as da_responsavel",
          "psdap.ps_cargo as da_cargo",
          "psdap.ps_email as da_email",

          "psrs.ps_setor_responsavel as rs_secretaria_setor_responsavel",
          "psrs.ps_abrangencia as  rs_abrangencia",
          "psrs.ps_natureza_juridica as rs_natureza_juridica",
          "psrs.ps_cnpj as rs_cnpj",
          "psrs.ps_telefone as rs_telefone",
          "psrs.ps_cep as rs_cep",
          "psrs.ps_endereco as rs_endereco",
          "psrs.ps_numero as rs_numero",
          "psrs.ps_bairro as rs_bairro",
          "psrs.ps_nome_responsavel as rs_responsavel",
          "psrs.ps_cargo as rs_cargo",
          "psrs.ps_email as rs_email",

          "rfss.setor_responsavel as rf_setor_responsavel",
          "rfss.telefone_comercial as rf_telefone_comercial",
          "rfss.nome_responsavel as rf_responsavel",
          "rfss.cargo as rf_cargo",
          "rfss.telefone as rf_telefone",
          "rfss.email as rf_email",
          "rfss.descricao as rf_descricao",

          "setor_responsavel_cs_sms as cs_setor_responsavel",
          "telefone_cs_sms as cs_telefone",
          "email_cs_sms as cs_email",

          "simisab_nome_responsavel as simisab_responsavel",
          "simisab_telefone as simisab_telefone",
          "simisab_email as simisab_email",

          "populacao_urbana as dd_populacao_urbana",
          "populacao_rural as dd_populacao_rural",
          "populacao_total as dd_populacao_total",
          "total_moradias as dd_total_moradias"
        )
        .from("tedplan.municipios as m")
        .where("m.id_municipio", id_municipio)
        .leftJoin(
          "tedplan.titular_servicos_ms as tsms",
          "m.id_municipio",
          "tsms.id_municipio"
        )
        .leftJoin(
          "tedplan.ps_abastecimento_agua as psaa",
          "m.id_municipio",
          "psaa.id_municipio"
        )
        .leftJoin(
          "tedplan.ps_esgotamento_sanitario as pses",
          "m.id_municipio",
          "pses.id_municipio"
        )
        .leftJoin(
          "tedplan.ps_drenagem_aguas_pluviais as psdap",
          "m.id_municipio",
          "psdap.id_municipio"
        )
        .leftJoin(
          "tedplan.ps_residuo_solido as psrs",
          "m.id_municipio",
          "psrs.id_municipio"
        )
        .leftJoin(
          "tedplan.regulador_fiscalizador_ss as rfss",
          "m.id_municipio",
          "rfss.id_municipio"
        )
        .leftJoin(
          "tedplan.controle_social_sms as cssms",
          "m.id_municipio",
          "cssms.id_municipio"
        )
        .leftJoin(
          "tedplan.responsavel_simisab as rs",
          "m.id_municipio",
          "rs.id_municipio"
        )
        .leftJoin(
          "tedplan.dados_demograficos as dd",
          "m.id_municipio",
          "dd.id_municipio"
        )
        .fetch();
        
      return municipio;
    } catch (error) {
      console.log(error);
    }
  }

  async store({ request, response }) {
    const {
      //dados do municipio
      id_municipio,
      municipio_codigo_ibge,
      municipio_nome,
      municipio_cnpj,
      municipio_nome_prefeitura,
      municipio_cep,
      municipio_endereco,
      municipio_numero,
      municipio_bairro,
      municipio_telefone,
      municipio_email,
      municipio_prefeito,
      //titular dos serviços municipais de saneamento
      id_titular_servicos_ms,
      ts_setor_responsavel,
      ts_telefone_comercial,
      ts_responsavel,
      ts_cargo,
      ts_telefone,
      ts_email,

      //prestador do serviço de seneamento basico
      //abastecimento de agua
      id_ps_abastecimento_agua,
      aa_abrangencia,
      aa_natureza_juridica,
      aa_cnpj,
      aa_telefone,
      aa_cep,
      aa_endereco,
      aa_numero,
      aa_bairro,
      aa_responsavel,
      aa_cargo,
      aa_email,
      aa_secretaria_setor_responsavel,

      //esgotamento sanitario
      id_ps_esgotamento_sanitario,
      es_secretaria_setor_responsavel,
      es_abrangencia,
      es_natureza_juridica,
      es_cnpj,
      es_telefone,
      es_cep,
      es_endereco,
      es_numero,
      es_bairro,
      es_responsavel,
      es_cargo,
      es_email,
      //drenagem e àguas pluvias
      id_ps_drenagem_aguas_pluviais,
      da_secretaria_setor_responsavel,
      da_abrangencia,
      da_natureza_juridica,
      da_cnpj,
      da_telefone,
      da_cep,
      da_endereco,
      da_numero,
      da_bairro,
      da_responsavel,
      da_cargo,
      da_email,
      //Resíduos Sólidos
      id_ps_residuo_solido,
      rs_secretaria_setor_responsavel,
      rs_abrangencia,
      rs_natureza_juridica,
      rs_cnpj,
      rs_telefone,
      rs_cep,
      rs_endereco,
      rs_numero,
      rs_bairro,
      rs_responsavel,
      rs_cargo,
      rs_email,

      //Regulador e Fiscalizador dos Serviços de Saneamento
      id_regulador_fiscalizador_ss,
      rf_setor_responsavel,
      rf_telefone_comercial,
      rf_responsavel,
      rf_cargo,
      rf_telefone,
      rf_email,
      rf_descricao,

      //Controle Social dos Serços Municipais de Saneamento
      id_controle_social_sms,
      cs_setor_responsavel,
      cs_telefone,
      cs_email,

      //Responsável pelo SIMISAB
      id_responsavel_simisab,
      simisab_responsavel,
      simisab_telefone,
      simisab_email,

      //Dados demográficos
      id_dados_demograficos,
      dd_populacao_urbana,
      dd_populacao_rural,
      dd_populacao_total,
      dd_total_moradias,
    } = request.all();
    console.log(request.all());
    
    try {
      const municipios = await Municipio.query()
        .from("tedplan.municipios")
        .where("id_municipio", id_municipio)
        .update({
          nome: municipio_nome,
          codigo_ibge: municipio_codigo_ibge,
          cnpj: municipio_cnpj,
          cep: municipio_cep,
          endereco: municipio_endereco,
          numero: municipio_numero,
          bairro: municipio_bairro,
          municipio_telefone: municipio_telefone,
          municipio_email: municipio_email,
          nome_prefeito: municipio_prefeito,
          nome_prefeitura: municipio_nome_prefeitura,
        });

      if (id_titular_servicos_ms) {
        updateTitularServicosMS();
      } else {
        addTitularServicosMS();
      }

      if (id_ps_abastecimento_agua) {
        updatePsAbastecimentoAgua();
      } else {
        addPsAbastecimentoAgua();
      }

      if (id_ps_esgotamento_sanitario) {
        updatePsEsgotamentoSanitario();
      } else {
        addPsEsgotamentoSanitario();
      }

      if (id_ps_drenagem_aguas_pluviais) {
        updatePsDrenagemAguasPluviais();
      } else {
        addPsDrenagemAguasPluviais();
      }

      if (id_ps_residuo_solido) {
        updatePsResiduoSolido();
      } else {
        addPsResiduoSolido();
      }

      if (id_regulador_fiscalizador_ss) {
        updateReguladorFiscalizador();
      } else {
        addReguladorFiscalizador();
      }

      if (id_controle_social_sms) {
        updateControleSocial();
      } else {
        addControleSocial();
      }

      if (id_responsavel_simisab) {
        updateResponsavelSimisab();
      } else {
        addResponsavelSimisab();
      }

      if (id_dados_demograficos) {
        updateDadosDemograficos();
      } else {
        addDadosDemograficos();
      }
    } catch (error) {
      console.log(error);
    }

    async function updateTitularServicosMS() {
      const ts = await Municipio.query()
        .from("tedplan.titular_servicos_ms")
        .where("id_municipio", id_municipio)
        .where("id_titular_servicos_ms", id_titular_servicos_ms)
        .update({
          setor_responsavel_tsms: ts_setor_responsavel,
          telefone_comercial_tsms: ts_telefone_comercial,
          nome_responsavel_tsms: ts_responsavel,
          cargo_tsms: ts_cargo,
          telefone_tsms: ts_telefone,
          email_tsms: ts_email,
        });
    }
    async function addTitularServicosMS() {
      const ts = await Municipio.query()
        .from("tedplan.titular_servicos_ms")
        .insert({
          setor_responsavel_tsms: ts_setor_responsavel,
          telefone_comercial_tsms: ts_telefone_comercial,
          nome_responsavel_tsms: ts_responsavel,
          cargo_tsms: ts_cargo,
          telefone_tsms: ts_telefone,
          email_tsms: ts_email,
          id_municipio: id_municipio,
        });
    }

    async function updatePsAbastecimentoAgua() {
      const ts = await Municipio.query()
        .from("tedplan.ps_abastecimento_agua")
        .where("id_municipio", id_municipio)
        .where("id_ps_abastecimento_agua", id_ps_abastecimento_agua)
        .update({
          ps_abrangencia: aa_abrangencia,
          ps_natureza_juridica: aa_natureza_juridica,
          ps_cnpj: aa_cnpj,
          ps_telefone: aa_telefone,
          ps_cep: aa_cep,
          ps_endereco: aa_endereco,
          ps_numero: aa_numero,
          ps_bairro: aa_bairro,
          ps_nome_responsavel: aa_responsavel,
          ps_cargo: aa_cargo,
          ps_email: aa_email,
          ps_setor_responsavel: aa_secretaria_setor_responsavel,
        });
    }
    async function addPsAbastecimentoAgua() {
      const ts = await Municipio.query()
        .from("tedplan.ps_abastecimento_agua")
        .insert({
          ps_abrangencia: aa_abrangencia,
          ps_natureza_juridica: aa_natureza_juridica,
          ps_cnpj: aa_cnpj,
          ps_telefone: aa_telefone,
          ps_cep: aa_cep,
          ps_endereco: aa_endereco,
          ps_numero: aa_numero,
          ps_bairro: aa_bairro,
          ps_nome_responsavel: aa_responsavel,
          ps_cargo: aa_cargo,
          ps_email: aa_email,
          ps_setor_responsavel: aa_secretaria_setor_responsavel,
          id_municipio: id_municipio,
        });
    }

    async function updatePsEsgotamentoSanitario() {
      const ts = await Municipio.query()
        .from("tedplan.ps_esgotamento_sanitario")
        .where("id_municipio", id_municipio)
        .where("id_ps_esgotamento_sanitario", id_ps_esgotamento_sanitario)
        .update({
          ps_abrangencia: es_abrangencia,
          ps_natureza_juridica: es_natureza_juridica,
          ps_cnpj: es_cnpj,
          ps_telefone: es_telefone,
          ps_cep: es_cep,
          ps_endereco: es_endereco,
          ps_numero: es_numero,
          ps_bairro: es_bairro,
          ps_nome_responsavel: es_responsavel,
          ps_cargo: es_cargo,
          ps_email: es_email,
          ps_setor_responsavel: es_secretaria_setor_responsavel,
        });
    }
    async function addPsEsgotamentoSanitario() {
      const ts = await Municipio.query()
        .from("tedplan.ps_esgotamento_sanitario")
        .insert({
          ps_abrangencia: es_abrangencia,
          ps_natureza_juridica: es_natureza_juridica,
          ps_cnpj: es_cnpj,
          ps_telefone: es_telefone,
          ps_cep: es_cep,
          ps_endereco: es_endereco,
          ps_numero: es_numero,
          ps_bairro: es_bairro,
          ps_nome_responsavel: es_responsavel,
          ps_cargo: es_cargo,
          ps_email: es_email,
          ps_setor_responsavel: es_secretaria_setor_responsavel,
          id_municipio: id_municipio,
        });
    }

    async function updatePsDrenagemAguasPluviais() {
      const ts = await Municipio.query()
        .from("tedplan.ps_drenagem_aguas_pluviais")
        .where("id_municipio", id_municipio)
        .where("id_ps_drenagem_aguas_pluviais", id_ps_drenagem_aguas_pluviais)
        .update({
          ps_abrangencia: da_abrangencia,
          ps_natureza_juridica: da_natureza_juridica,
          ps_cnpj: da_cnpj,
          ps_telefone: da_telefone,
          ps_cep: da_cep,
          ps_endereco: da_endereco,
          ps_numero: da_numero,
          ps_bairro: da_bairro,
          ps_nome_responsavel: da_responsavel,
          ps_cargo: da_cargo,
          ps_email: da_email,
          ps_setor_responsavel: da_secretaria_setor_responsavel,
        });
    }
    async function addPsDrenagemAguasPluviais() {
      const ts = await Municipio.query()
        .from("tedplan.ps_drenagem_aguas_pluviais")
        .insert({
          ps_abrangencia: da_abrangencia,
          ps_natureza_juridica: da_natureza_juridica,
          ps_cnpj: da_cnpj,
          ps_telefone: da_telefone,
          ps_cep: da_cep,
          ps_endereco: da_endereco,
          ps_numero: da_numero,
          ps_bairro: da_bairro,
          ps_nome_responsavel: da_responsavel,
          ps_cargo: da_cargo,
          ps_email: da_email,
          ps_setor_responsavel: da_secretaria_setor_responsavel,
          id_municipio: id_municipio,
        });
    }

    async function updatePsResiduoSolido() {
      const ts = await Municipio.query()
        .from("tedplan.ps_residuo_solido")
        .where("id_municipio", id_municipio)
        .where("id_ps_residuo_solido", id_ps_residuo_solido)
        .update({
          ps_abrangencia: rs_abrangencia,
          ps_natureza_juridica: rs_natureza_juridica,
          ps_cnpj: rs_cnpj,
          ps_telefone: rs_telefone,
          ps_cep: rs_cep,
          ps_endereco: rs_endereco,
          ps_numero: rs_numero,
          ps_bairro: rs_bairro,
          ps_nome_responsavel: rs_responsavel,
          ps_cargo: rs_cargo,
          ps_email: rs_email,
          ps_setor_responsavel: rs_secretaria_setor_responsavel,
        });
    }
    async function addPsResiduoSolido() {
      const ts = await Municipio.query()
        .from("tedplan.ps_residuo_solido")
        .insert({
          ps_abrangencia: rs_abrangencia,
          ps_natureza_juridica: rs_natureza_juridica,
          ps_cnpj: rs_cnpj,
          ps_telefone: rs_telefone,
          ps_cep: rs_cep,
          ps_endereco: rs_endereco,
          ps_numero: rs_numero,
          ps_bairro: rs_bairro,
          ps_nome_responsavel: rs_responsavel,
          ps_cargo: rs_cargo,
          ps_email: rs_email,
          ps_setor_responsavel: rs_secretaria_setor_responsavel,
          id_municipio: id_municipio,
        });
    }

    async function updateReguladorFiscalizador() {
      const ts = await Municipio.query()
        .from("tedplan.regulador_fiscalizador_ss")
        .where("id_municipio", id_municipio)
        .where("id_regulador_fiscalizador_ss", id_regulador_fiscalizador_ss)
        .update({
          setor_responsavel: rf_setor_responsavel,
          telefone_comercial: rf_telefone_comercial,
          nome_responsavel: rf_responsavel,
          cargo: rf_cargo,
          telefone: rf_telefone,
          email: rf_email,
          descricao: rf_descricao,
        });
    }
    async function addReguladorFiscalizador() {
      const ts = await Municipio.query()
        .from("tedplan.regulador_fiscalizador_ss")
        .insert({
          setor_responsavel: rf_setor_responsavel,
          telefone_comercial: rf_telefone_comercial,
          nome_responsavel: rf_responsavel,
          cargo: rf_cargo,
          telefone: rf_telefone,
          email: rf_email,
          descricao: rf_descricao,
          id_municipio: id_municipio,
        });
    }

    async function updateControleSocial() {
      const ts = await Municipio.query()
        .from("tedplan.controle_social_sms")
        .where("id_municipio", id_municipio)
        .where("id_controle_social_sms", id_controle_social_sms)
        .update({
          setor_responsavel_cs_sms: cs_setor_responsavel,
          telefone_cs_sms: cs_telefone,
          email_cs_sms: cs_email,
        });
    }
    async function addControleSocial() {
      const ts = await Municipio.query()
        .from("tedplan.controle_social_sms")
        .insert({
          setor_responsavel_cs_sms: cs_setor_responsavel,
          telefone_cs_sms: cs_telefone,
          email_cs_sms: cs_email,
          id_municipio: id_municipio,
        });
    }

    async function updateResponsavelSimisab() {
      const ts = await Municipio.query()
        .from("tedplan.responsavel_simisab")
        .where("id_municipio", id_municipio)
        .where("id_responsavel_simisab", id_responsavel_simisab)
        .update({
          simisab_nome_responsavel: simisab_responsavel,
          simisab_telefone: simisab_telefone,
          simisab_email: simisab_email,
        });
    }
    async function addResponsavelSimisab() {
      const ts = await Municipio.query()
        .from("tedplan.responsavel_simisab")
        .insert({
          simisab_nome_responsavel: simisab_responsavel,
          simisab_telefone: simisab_telefone,
          simisab_email: simisab_email,
          id_municipio: id_municipio,
        });
    }

    async function updateDadosDemograficos() {
      const ts = await Municipio.query()
        .from("tedplan.dados_demograficos")
        .where("id_municipio", id_municipio)
        .where("id_dados_demograficos", id_dados_demograficos)
        .update({
          populacao_urbana: dd_populacao_urbana,
          populacao_rural: dd_populacao_rural,
          populacao_total: dd_populacao_total,
          total_moradias: dd_total_moradias,
        });
    }
    async function addDadosDemograficos() {
      const ts = await Municipio.query()
        .from("tedplan.dados_demograficos")
        .insert({
          populacao_urbana: dd_populacao_urbana,
          populacao_rural: dd_populacao_rural,
          populacao_total: dd_populacao_total,
          total_moradias: dd_total_moradias,
          id_municipio: id_municipio,
        });
    }
  }
}

module.exports = MunicipioController;
