"use strict";

const Municipio = use("App/Models/Municipio");

// Helper function para sanitizar valores integer
function sanitizeInteger(value) {
  // Se for undefined, null, string vazia ou string "undefined"/"null", retorna null
  if (value === undefined || value === null || value === '' || 
      (typeof value === 'string' && (value.toLowerCase() === 'undefined' || value.toLowerCase() === 'null'))) {
    return null;
  }
  // Se já for um número válido, retorna ele mesmo
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  // Tenta converter para integer
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
}

// Helper function para sanitizar valores decimal
function sanitizeDecimal(value) {
  // Se for undefined, null, string vazia ou string "undefined"/"null", retorna null
  if (value === undefined || value === null || value === '' || 
      (typeof value === 'string' && (value.toLowerCase() === 'undefined' || value.toLowerCase() === 'null'))) {
    return null;
  }
  // Se já for um número válido, retorna ele mesmo
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  // Tenta converter para decimal
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

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

      if (!id_municipio) {
        return response.status(400).json({
          error: 'ID do município é obrigatório'
        });
      }

      const municipioId = parseInt(id_municipio);
      if (isNaN(municipioId)) {
        return response.status(400).json({
          error: 'ID do município inválido'
        });
      }

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
          "id_conselho_municipal_saneamento_basico",
          //"cm.possui_conselho",
          //"cm.descricao_outros",
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

          "tsms.setor_responsavel_tsms as ts_setor_responsavel",
          "tsms.telefone_comercial_tsms as ts_telefone_comercial",
          "tsms.nome_responsavel_tsms as ts_responsavel",
          "tsms.cargo_tsms as ts_cargo",
          "tsms.funcao_tsms as ts_funcao",
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
          //"rfss.funcao as rf_funcao",
          "rfss.telefone as rf_telefone",
          "rfss.email as rf_email",
          "rfss.descricao as rf_descricao",

          "setor_responsavel_cs_sms as cs_setor_responsavel",
          "telefone_cs_sms as cs_telefone",
          "email_cs_sms as cs_email",

          "simisab_nome_responsavel as simisab_responsavel",
          "simisab_telefone as simisab_telefone",
          "simisab_email as simisab_email",

          "dd.populacao_urbana as dd_populacao_urbana",
          "dd.populacao_rural as dd_populacao_rural",
          "dd.populacao_total as dd_populacao_total",
          "dd.total_moradias as dd_total_moradias",

          // Campos de dados demográficos completos
          "dd.OGM4001 as OGM4001",
          "dd.OGM4002 as OGM4002",
          "dd.OGM4003 as OGM4003",
          "dd.OGM4004 as OGM4004",
          "dd.OGM4005 as OGM4005",
          "dd.OGM4006 as OGM4006",
          "dd.OGM4007 as OGM4007",
          "dd.OGM4008 as OGM4008",
          "dd.OGM4009 as OGM4009",

          // Campos de dados geográficos completos
          "dg.id_dados_geograficos as id_dados_geograficos",
          "dg.ogm0001 as OGM0001",
          "dg.ogm0002 as OGM0002",
          "dg.ogm0003 as OGM0003",
          "dg.ogm0004 as OGM0004",
          "dg.ogm0005 as OGM0005",
          "dg.ogm0006 as OGM0006",
          "dg.ogm0007 as OGM0007",
          "dg.ogm0008 as OGM0008",
          "dg.ogm0009 as OGM0009",
          "dg.ogm0010 as OGM0010",
          "dg.ogm0011 as OGM0011",
          "dg.ogm0012 as OGM0012",
          "dg.ogm0101 as OGM0101",
          "dg.ogm0102 as OGM0102",
          "dg.ogm0103 as OGM0103",
          "dg.ogm0104 as OGM0104",
          "dg.ogm0105 as OGM0105",
          "dg.ogm0106 as OGM0106",
          "dg.ogm0107 as OGM0107",
          "dg.ogm0108 as OGM0108",
          "dg.ogm0109 as OGM0109"
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
        ).leftJoin(
          "tedplan.conselho_municipal_saneamento_basico as cm",
          "m.id_municipio",
          "cm.id_municipio"
        )
        .leftJoin(
          "tedplan.dados_demograficos as dd",
          "m.id_municipio",
          "dd.id_municipio"
        )
        .leftJoin(
          "tedplan.dados_geograficos as dg",
          "m.id_municipio",
          "dg.id_municipio"
        )
        .first();

      if (!municipio) {
        return response.status(404).json({
          error: 'Dados do Município não encontrado'
        });
      }

      return response.status(200).json(municipio);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao buscar município' });
    }
  }

  async store({ request, response }) {
    const payload = request.all();
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
      ts_funcao,
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
      rf_funcao,
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

      //Conselho Municipal de Saneamento
      id_conselho_municipal,
      possui_conselho,
      descricao_outros,

      //Dados demográficos
      id_dados_demograficos,
      dd_populacao_urbana,
      dd_populacao_rural,
      dd_populacao_total,
      dd_total_moradias,
      dd_ano,

      // Novos campos OGM
      OGM4001,
      OGM4002,
      OGM4003,
      OGM4004,
      OGM4005,
      OGM4006,
      OGM4007,
      OGM4008,
      OGM4009,

      // Dados geográficos
      id_dados_geograficos,
      OGM0001,
      OGM0002,
      OGM0003,
      OGM0004,
      OGM0005,
      OGM0006,
      OGM0007,
      OGM0008,
      OGM0009,
      OGM0010,
      OGM0011,
      OGM0012,
      OGM0101,
      OGM0102,
      OGM0103,
      OGM0104,
      OGM0105,
      OGM0106,
      OGM0107,
      OGM0108,
      OGM0109
    } = payload;

    try {
      // Sanitizar id_municipio
      const sanitizedIdMunicipio = sanitizeInteger(id_municipio);
      if (!sanitizedIdMunicipio) {
        return response.status(400).json({
          error: 'ID do município é obrigatório e deve ser um número válido'
        });
      }

      // Sanitizar todos os IDs
      const sanitizedIdTitularServicosMs = sanitizeInteger(id_titular_servicos_ms);
      const sanitizedIdPsAbastecimentoAgua = sanitizeInteger(id_ps_abastecimento_agua);
      const sanitizedIdPsEsgotamentoSanitario = sanitizeInteger(id_ps_esgotamento_sanitario);
      const sanitizedIdPsDrenagemAguasPluviais = sanitizeInteger(id_ps_drenagem_aguas_pluviais);
      const sanitizedIdPsResiduoSolido = sanitizeInteger(id_ps_residuo_solido);
      const sanitizedIdReguladorFiscalizadorSs = sanitizeInteger(id_regulador_fiscalizador_ss);
      const sanitizedIdControleSocialSms = sanitizeInteger(id_controle_social_sms);
      const sanitizedIdConselhoMunicipal = sanitizeInteger(id_conselho_municipal);
      const sanitizedIdResponsavelSimisab = sanitizeInteger(id_responsavel_simisab);
      const sanitizedIdDadosGeograficos = sanitizeInteger(id_dados_geograficos);
      const sanitizedIdDadosDemograficos = sanitizeInteger(id_dados_demograficos);

      // Helpers de detecção de "menu a menu": só processar o submenu se o payload contém campos dele
      const payloadKeys = Object.keys(payload || {});
      const hasKey = (key) => Object.prototype.hasOwnProperty.call(payload, key);
      const hasAnyKey = (keys) => keys.some(hasKey);
      const hasAnyPrefix = (prefixes) =>
        payloadKeys.some((k) => prefixes.some((p) => k.startsWith(p)));

      const shouldProcessMunicipio = hasAnyKey([
        "municipio_codigo_ibge",
        "municipio_nome",
        "municipio_cnpj",
        "municipio_nome_prefeitura",
        "municipio_cep",
        "municipio_endereco",
        "municipio_numero",
        "municipio_bairro",
        "municipio_telefone",
        "municipio_email",
        "municipio_prefeito",
      ]);

      const shouldProcessTitular = hasKey("id_titular_servicos_ms") || hasAnyPrefix(["ts_"]);
      const shouldProcessPsAbastecimentoAgua = hasKey("id_ps_abastecimento_agua") || hasAnyPrefix(["aa_"]);
      const shouldProcessPsEsgotamentoSanitario = hasKey("id_ps_esgotamento_sanitario") || hasAnyPrefix(["es_"]);
      const shouldProcessPsDrenagemAguasPluviais = hasKey("id_ps_drenagem_aguas_pluviais") || hasAnyPrefix(["da_"]);
      const shouldProcessPsResiduoSolido = hasKey("id_ps_residuo_solido") || hasAnyPrefix(["rs_"]);
      const shouldProcessReguladorFiscalizador = hasKey("id_regulador_fiscalizador_ss") || hasAnyPrefix(["rf_"]);
      const shouldProcessControleSocial = hasKey("id_controle_social_sms") || hasAnyPrefix(["cs_"]);
      const shouldProcessConselhoMunicipal = hasKey("id_conselho_municipal") || hasKey("possui_conselho") || hasKey("descricao_outros");
      const shouldProcessResponsavelSimisab = hasKey("id_responsavel_simisab") || hasAnyPrefix(["simisab_"]);
      const shouldProcessDadosGeograficos = hasKey("id_dados_geograficos") || hasAnyPrefix(["OGM0"]);
      const shouldProcessDadosDemograficos = hasKey("id_dados_demograficos") || hasAnyPrefix(["dd_", "OGM4"]);

      if (shouldProcessMunicipio) {
        // Atualizar somente os campos enviados no payload (não sobrescrever com undefined)
        const municipioUpdate = {};
        if (hasKey("municipio_nome")) municipioUpdate.nome = municipio_nome;
        if (hasKey("municipio_codigo_ibge")) municipioUpdate.codigo_ibge = municipio_codigo_ibge;
        if (hasKey("municipio_cnpj")) municipioUpdate.cnpj = municipio_cnpj;
        if (hasKey("municipio_cep")) municipioUpdate.cep = municipio_cep;
        if (hasKey("municipio_endereco")) municipioUpdate.endereco = municipio_endereco;
        if (hasKey("municipio_numero")) municipioUpdate.numero = municipio_numero;
        if (hasKey("municipio_bairro")) municipioUpdate.bairro = municipio_bairro;
        if (hasKey("municipio_telefone")) municipioUpdate.municipio_telefone = municipio_telefone;
        if (hasKey("municipio_email")) municipioUpdate.municipio_email = municipio_email;
        if (hasKey("municipio_prefeito")) municipioUpdate.nome_prefeito = municipio_prefeito;
        if (hasKey("municipio_nome_prefeitura")) municipioUpdate.nome_prefeitura = municipio_nome_prefeitura;

        const updatedMunicipioRows = await Municipio.query()
          .from("tedplan.municipios")
          .where("id_municipio", sanitizedIdMunicipio)
          .update(municipioUpdate);

        // store() apenas atualiza municípios; se não encontrar, retornar 404
        if (!updatedMunicipioRows) {
          return response.status(404).json({ error: "Município não encontrado" });
        }
      }

      // Definir todas as funções internas dentro do escopo do try
      async function updateTitularServicosMS() {
        const ts = await Municipio.query()
          .from("tedplan.titular_servicos_ms")
          .where("id_municipio", sanitizedIdMunicipio)
          .where("id_titular_servicos_ms", sanitizedIdTitularServicosMs)
          .update({
            setor_responsavel_tsms: ts_setor_responsavel,
            telefone_comercial_tsms: ts_telefone_comercial,
            nome_responsavel_tsms: ts_responsavel,
            cargo_tsms: ts_cargo,
            funcao_tsms: ts_funcao,
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
            funcao_tsms: ts_funcao,
            telefone_tsms: ts_telefone,
            email_tsms: ts_email,
            id_municipio: sanitizedIdMunicipio,
          });
      }

      async function updatePsAbastecimentoAgua() {
        // Atualizar usando apenas id_municipio para garantir que atualiza o registro correto
        const ts = await Municipio.query()
          .from("tedplan.ps_abastecimento_agua")
          .where("id_municipio", sanitizedIdMunicipio)
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
        // Verificar se já existe um registro para este município
        const existing = await Municipio.query()
          .from("tedplan.ps_abastecimento_agua")
          .where("id_municipio", sanitizedIdMunicipio)
          .first();

        if (existing) {
          // Se já existe, atualizar ao invés de criar novo (garantir apenas um registro por município)
          await Municipio.query()
            .from("tedplan.ps_abastecimento_agua")
            .where("id_municipio", sanitizedIdMunicipio)
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
        } else {
          // Se não existe, criar novo
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
              id_municipio: sanitizedIdMunicipio,
            });
        }
      }

      async function updatePsEsgotamentoSanitario() {
        // Atualizar usando apenas id_municipio para garantir que atualiza o registro correto
        const ts = await Municipio.query()
          .from("tedplan.ps_esgotamento_sanitario")
          .where("id_municipio", sanitizedIdMunicipio)
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
        // Verificar se já existe um registro para este município
        const existing = await Municipio.query()
          .from("tedplan.ps_esgotamento_sanitario")
          .where("id_municipio", sanitizedIdMunicipio)
          .first();

        if (existing) {
          // Se já existe, atualizar ao invés de criar novo
          const existingId = existing.id_ps_esgotamento_sanitario || existing.toJSON()?.id_ps_esgotamento_sanitario;
          await Municipio.query()
            .from("tedplan.ps_esgotamento_sanitario")
            .where("id_municipio", sanitizedIdMunicipio)
            .where("id_ps_esgotamento_sanitario", existingId)
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
        } else {
          // Se não existe, criar novo
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
              id_municipio: sanitizedIdMunicipio,
            });
        }
      }

      async function updatePsDrenagemAguasPluviais() {
        // Atualizar usando apenas id_municipio para garantir que atualiza o registro correto
        const ts = await Municipio.query()
          .from("tedplan.ps_drenagem_aguas_pluviais")
          .where("id_municipio", sanitizedIdMunicipio)
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
        // Verificar se já existe um registro para este município
        const existing = await Municipio.query()
          .from("tedplan.ps_drenagem_aguas_pluviais")
          .where("id_municipio", sanitizedIdMunicipio)
          .first();

        if (existing) {
          // Se já existe, atualizar ao invés de criar novo
          const existingId = existing.id_ps_drenagem_aguas_pluviais || existing.toJSON()?.id_ps_drenagem_aguas_pluviais;
          await Municipio.query()
            .from("tedplan.ps_drenagem_aguas_pluviais")
            .where("id_municipio", sanitizedIdMunicipio)
            .where("id_ps_drenagem_aguas_pluviais", existingId)
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
        } else {
          // Se não existe, criar novo
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
              id_municipio: sanitizedIdMunicipio,
            });
        }
      }

      async function updatePsResiduoSolido() {
        // Atualizar usando apenas id_municipio para garantir que atualiza o registro correto
        const ts = await Municipio.query()
          .from("tedplan.ps_residuo_solido")
          .where("id_municipio", sanitizedIdMunicipio)
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
        // Verificar se já existe um registro para este município
        const existing = await Municipio.query()
          .from("tedplan.ps_residuo_solido")
          .where("id_municipio", sanitizedIdMunicipio)
          .first();

        if (existing) {
          // Se já existe, atualizar ao invés de criar novo
          const existingId = existing.id_ps_residuo_solido || existing.toJSON()?.id_ps_residuo_solido;
          await Municipio.query()
            .from("tedplan.ps_residuo_solido")
            .where("id_municipio", sanitizedIdMunicipio)
            .where("id_ps_residuo_solido", existingId)
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
        } else {
          // Se não existe, criar novo
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
              id_municipio: sanitizedIdMunicipio,
            });
        }
      }

      async function updateReguladorFiscalizador() {
        const ts = await Municipio.query()
          .from("tedplan.regulador_fiscalizador_ss")
          .where("id_municipio", sanitizedIdMunicipio)
          .where("id_regulador_fiscalizador_ss", sanitizedIdReguladorFiscalizadorSs)
          .update({
            setor_responsavel: rf_setor_responsavel,
            telefone_comercial: rf_telefone_comercial,
            nome_responsavel: rf_responsavel,
            cargo: rf_cargo,
            funcao: rf_funcao,
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
            funcao: rf_funcao,
            telefone: rf_telefone,
            email: rf_email,
            descricao: rf_descricao,
            id_municipio: sanitizedIdMunicipio,
          });
      }

      async function updateControleSocial() {
        const ts = await Municipio.query()
          .from("tedplan.controle_social_sms")
          .where("id_municipio", sanitizedIdMunicipio)
          .where("id_controle_social_sms", sanitizedIdControleSocialSms)
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
            id_municipio: sanitizedIdMunicipio,
          });
      }

      async function updateResponsavelSimisab() {
        const ts = await Municipio.query()
          .from("tedplan.responsavel_simisab")
          .where("id_municipio", sanitizedIdMunicipio)
          .where("id_responsavel_simisab", sanitizedIdResponsavelSimisab)
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
            id_municipio: sanitizedIdMunicipio,
          });
      }

      async function updateConselhoMunicipal() {
        try {
          if (!sanitizedIdMunicipio || !sanitizedIdConselhoMunicipal) {
            throw new Error('Missing required IDs');
          }

          const ts = await Municipio.query()
            .from("tedplan.conselho_municipal")
            .where("id_municipio", sanitizedIdMunicipio)
            .where("id_conselho_municipal", sanitizedIdConselhoMunicipal)
            .update({
              possui_conselho: possui_conselho,
              descricao_outros: descricao_outros,
              updated_at: new Date()
            });

          return ts;
        } catch (error) {
          throw error;
        }
      }

      async function addConselhoMunicipal() {
        try {
          if (!sanitizedIdMunicipio) {
            throw new Error('Missing municipio ID');
          }

          const ts = await Municipio.query()
            .from("tedplan.conselho_municipal")
            .insert({
              possui_conselho: possui_conselho,
              descricao_outros: descricao_outros,
              id_municipio: sanitizedIdMunicipio,
              created_at: new Date(),
              updated_at: new Date()
            });

          return ts;
        } catch (error) {
          throw error;
        }
      }

      async function updateDadosGeograficos() {
        const resDg = await Municipio.query()
          .from("tedplan.dados_geograficos")
          .where("id_municipio", sanitizedIdMunicipio)
          .where("id_dados_geograficos", sanitizedIdDadosGeograficos)
          .fetch();

        if (resDg.rows.length === 0) {
          return response.status(404).send({
            message: "Dados geográficos não encontrados",
          });
        }

        const ogm = resDg.rows[0].toJSON();

        const ts = await Municipio.query()
          .from("tedplan.dados_geograficos")
          .where("id_municipio", sanitizedIdMunicipio)
          .where("id_dados_geograficos", sanitizedIdDadosGeograficos)
          .update({
            ogm0001: sanitizeInteger(OGM0001) ?? ogm.ogm0001,
            ogm0002: sanitizeInteger(OGM0002) ?? ogm.ogm0002,
            ogm0003: sanitizeInteger(OGM0003) ?? ogm.ogm0003,
            ogm0004: sanitizeInteger(OGM0004) ?? ogm.ogm0004,
            ogm0005: sanitizeDecimal(OGM0005) ?? ogm.ogm0005,
            ogm0006: sanitizeDecimal(OGM0006) ?? ogm.ogm0006,
            ogm0007: sanitizeInteger(OGM0007) ?? ogm.ogm0007,
            ogm0008: sanitizeInteger(OGM0008) ?? ogm.ogm0008,
            ogm0009: sanitizeInteger(OGM0009) ?? ogm.ogm0009,
            ogm0010: sanitizeDecimal(OGM0010) ?? ogm.ogm0010,
            ogm0011: sanitizeDecimal(OGM0011) ?? ogm.ogm0011,
            ogm0012: sanitizeDecimal(OGM0012) ?? ogm.ogm0012,
            ogm0101: sanitizeInteger(OGM0101) ?? ogm.ogm0101,
            ogm0102: sanitizeInteger(OGM0102) ?? ogm.ogm0102,
            ogm0103: sanitizeInteger(OGM0103) ?? ogm.ogm0103,
            ogm0104: sanitizeInteger(OGM0104) ?? ogm.ogm0104,
            ogm0105: sanitizeInteger(OGM0105) ?? ogm.ogm0105,
            ogm0106: sanitizeInteger(OGM0106) ?? ogm.ogm0106,
            ogm0107: sanitizeInteger(OGM0107) ?? ogm.ogm0107,
            ogm0108: sanitizeInteger(OGM0108) ?? ogm.ogm0108,
            ogm0109: sanitizeInteger(OGM0109) ?? ogm.ogm0109
          });
      }

      async function addDadosGeograficos() {
        const ts = await Municipio.query()
          .from("tedplan.dados_geograficos")
          .insert({
            ogm0001: sanitizeInteger(OGM0001),
            ogm0002: sanitizeInteger(OGM0002),
            ogm0003: sanitizeInteger(OGM0003),
            ogm0004: sanitizeInteger(OGM0004),
            ogm0005: sanitizeDecimal(OGM0005),
            ogm0006: sanitizeDecimal(OGM0006),
            ogm0007: sanitizeInteger(OGM0007),
            ogm0008: sanitizeInteger(OGM0008),
            ogm0009: sanitizeInteger(OGM0009),
            ogm0010: sanitizeDecimal(OGM0010),
            ogm0011: sanitizeDecimal(OGM0011),
            ogm0012: sanitizeDecimal(OGM0012),
            ogm0101: sanitizeInteger(OGM0101),
            ogm0102: sanitizeInteger(OGM0102),
            ogm0103: sanitizeInteger(OGM0103),
            ogm0104: sanitizeInteger(OGM0104),
            ogm0105: sanitizeInteger(OGM0105),
            ogm0106: sanitizeInteger(OGM0106),
            ogm0107: sanitizeInteger(OGM0107),
            ogm0108: sanitizeInteger(OGM0108),
            ogm0109: sanitizeInteger(OGM0109),
            id_municipio: sanitizedIdMunicipio,
          });
      }

      async function updateDadosDemograficos() {
        const resDd = await Municipio.query()
          .from("tedplan.dados_demograficos")
          .where("id_municipio", sanitizedIdMunicipio)
          .where("id_dados_demograficos", sanitizedIdDadosDemograficos)
          .fetch();

        if (resDd.rows.length === 0) {
          response.status(404).send({
            message: "Dados demograficos não encontrados",
          });
        }

        const omg = resDd.rows[0].toJSON();

        const ts = await Municipio.query()
          .from("tedplan.dados_demograficos")
          .where("id_municipio", sanitizedIdMunicipio)
          .where("id_dados_demograficos", sanitizedIdDadosDemograficos)
          .update({
            populacao_urbana: sanitizeInteger(dd_populacao_urbana),
            populacao_rural: sanitizeInteger(dd_populacao_rural),
            populacao_total: sanitizeInteger(dd_populacao_total),
            total_moradias: sanitizeInteger(dd_total_moradias),
            // Novos campos OGM - usando maiúsculas e sanitizando valores
            "OGM4001": sanitizeInteger(OGM4001) ?? (omg.OGM4001 || null),
            "OGM4002": sanitizeInteger(OGM4002) ?? (omg.OGM4002 || null),
            "OGM4003": sanitizeInteger(OGM4003) ?? (omg.OGM4003 || null),
            "OGM4004": sanitizeInteger(OGM4004) ?? (omg.OGM4004 || null),
            "OGM4005": sanitizeInteger(OGM4005) ?? (omg.OGM4005 || null),
            "OGM4006": sanitizeInteger(OGM4006) ?? (omg.OGM4006 || null),
            "OGM4007": sanitizeDecimal(OGM4007) ?? (omg.OGM4007 || null),
            "OGM4008": sanitizeDecimal(OGM4008) ?? (omg.OGM4008 || null),
            "OGM4009": sanitizeDecimal(OGM4009) ?? (omg.OGM4009 || null)
          });
      }

      async function addDadosDemograficos() {
        const ts = await Municipio.query()
          .from("tedplan.dados_demograficos")
          .insert({
            populacao_urbana: sanitizeInteger(dd_populacao_urbana),
            populacao_rural: sanitizeInteger(dd_populacao_rural),
            populacao_total: sanitizeInteger(dd_populacao_total),
            total_moradias: sanitizeInteger(dd_total_moradias),
            // Novos campos OGM - usando maiúsculas e sanitizando valores
            "OGM4001": sanitizeInteger(OGM4001),
            "OGM4002": sanitizeInteger(OGM4002),
            "OGM4003": sanitizeInteger(OGM4003),
            "OGM4004": sanitizeInteger(OGM4004),
            "OGM4005": sanitizeInteger(OGM4005),
            "OGM4006": sanitizeInteger(OGM4006),
            "OGM4007": sanitizeDecimal(OGM4007),
            "OGM4008": sanitizeDecimal(OGM4008),
            "OGM4009": sanitizeDecimal(OGM4009),
            id_municipio: sanitizedIdMunicipio,
          });
      }

      // Titular de Serviços (menu a menu): garantir 1 registro por município (upsert por id_municipio)
      if (shouldProcessTitular) {
        const titularUpdate = {};
        // Atualizar apenas campos enviados (não sobrescrever com undefined)
        if (hasKey("ts_setor_responsavel")) titularUpdate.setor_responsavel_tsms = ts_setor_responsavel;
        if (hasKey("ts_telefone_comercial")) titularUpdate.telefone_comercial_tsms = ts_telefone_comercial;
        if (hasKey("ts_responsavel")) titularUpdate.nome_responsavel_tsms = ts_responsavel;
        if (hasKey("ts_cargo")) titularUpdate.cargo_tsms = ts_cargo;
        if (hasKey("ts_funcao")) titularUpdate.funcao_tsms = ts_funcao;
        if (hasKey("ts_telefone")) titularUpdate.telefone_tsms = ts_telefone;
        if (hasKey("ts_email")) titularUpdate.email_tsms = ts_email;

        const hasTitularData = Object.keys(titularUpdate).length > 0;
        if (hasTitularData) {
          const existingTitular = await Municipio.query()
            .from("tedplan.titular_servicos_ms")
            .where("id_municipio", sanitizedIdMunicipio)
            .first();

          if (existingTitular) {
            await Municipio.query()
              .from("tedplan.titular_servicos_ms")
              .where("id_municipio", sanitizedIdMunicipio)
              .update(titularUpdate);
          } else {
            await Municipio.query()
              .from("tedplan.titular_servicos_ms")
              .insert({
                ...titularUpdate,
                id_municipio: sanitizedIdMunicipio,
              });
          }
        }
      }

      if (shouldProcessPsAbastecimentoAgua) {
        if (sanitizedIdPsAbastecimentoAgua) {
          await updatePsAbastecimentoAgua();
        } else {
          await addPsAbastecimentoAgua();
        }
      }

      if (shouldProcessPsEsgotamentoSanitario) {
        if (sanitizedIdPsEsgotamentoSanitario) {
          await updatePsEsgotamentoSanitario();
        } else {
          await addPsEsgotamentoSanitario();
        }
      }

      if (shouldProcessPsDrenagemAguasPluviais) {
        if (sanitizedIdPsDrenagemAguasPluviais) {
          await updatePsDrenagemAguasPluviais();
        } else {
          await addPsDrenagemAguasPluviais();
        }
      }

      if (shouldProcessPsResiduoSolido) {
        if (sanitizedIdPsResiduoSolido) {
          await updatePsResiduoSolido();
        } else {
          await addPsResiduoSolido();
        }
      }

      if (shouldProcessReguladorFiscalizador) {
        if (sanitizedIdReguladorFiscalizadorSs) {
          await updateReguladorFiscalizador();
        } else {
          await addReguladorFiscalizador();
        }
      }

      if (shouldProcessControleSocial) {
        if (sanitizedIdControleSocialSms) {
          await updateControleSocial();
        } else {
          await addControleSocial();
        }
      }

      if (shouldProcessConselhoMunicipal) {
        if (sanitizedIdConselhoMunicipal) {
          await updateConselhoMunicipal();
        } else {
          await addConselhoMunicipal();
        }
      }

      if (shouldProcessResponsavelSimisab) {
        if (sanitizedIdResponsavelSimisab) {
          await updateResponsavelSimisab();
        } else {
          await addResponsavelSimisab();
        }
      }

      if (shouldProcessDadosGeograficos) {
        if (sanitizedIdDadosGeograficos) {
          await updateDadosGeograficos();
        } else {
          await addDadosGeograficos();
        }
      }

      if (shouldProcessDadosDemograficos) {
        if (sanitizedIdDadosDemograficos) {
          await updateDadosDemograficos();
        } else {
          await addDadosDemograficos();
        }
      }

      return response.status(200).json({ message: 'Dados salvos com sucesso' });
    } catch (error) {
      return response.status(500).json({
        error: 'Erro ao salvar dados do município',
        details: error.message
      });
    }
  }
}

module.exports = MunicipioController;
