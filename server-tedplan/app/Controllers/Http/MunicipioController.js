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
      .select(
        "id_municipio",
        "nome as municipio_nome",
        "codigo_ibge as municipio_codigo_ibge"
      )
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
          //"tsms.funcao_tsms as ts_funcao",
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
          "rfss.funcao as rf_funcao",
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
          // "dd.OGM4001 as OGM4001",
          // "dd.OGM4002 as OGM4002",
          // "dd.OGM4003 as OGM4003",
          // "dd.OGM4004 as OGM4004",
          // "dd.OGM4005 as OGM4005",
          // "dd.OGM4006 as OGM4006",
          // "dd.OGM4007 as OGM4007",
          // "dd.OGM4008 as OGM4008",
          // "dd.OGM4009 as OGM4009",

          // Campos de dados geográficos completos
          // "dg.id_dados_geograficos as id_dados_geograficos",
          // "dg.ogm0001 as OGM0001",
          // "dg.ogm0002 as OGM0002",
          // "dg.ogm0003 as OGM0003",
          // "dg.ogm0004 as OGM0004",
          // "dg.ogm0005 as OGM0005",
          // "dg.ogm0006 as OGM0006",
          // "dg.ogm0007 as OGM0007",
          // "dg.ogm0008 as OGM0008",
          // "dg.ogm0009 as OGM0009",
          // "dg.ogm0010 as OGM0010",
          // "dg.ogm0011 as OGM0011",
          // "dg.ogm0012 as OGM0012",
          // "dg.ogm0101 as OGM0101",
          // "dg.ogm0102 as OGM0102",
          // "dg.ogm0103 as OGM0103",
          // "dg.ogm0104 as OGM0104",
          // "dg.ogm0105 as OGM0105",
          // "dg.ogm0106 as OGM0106",
          // "dg.ogm0107 as OGM0107",
          // "dg.ogm0108 as OGM0108",
          // "dg.ogm0109 as OGM0109"
        )
        .from("tedplan.municipios as m")
        .where("m.id_municipio", municipioId)
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
      console.error('Erro em getMunicipio:', error);
      console.error('Stack:', error.stack);
      return response.status(500).json({
        error: 'Erro ao buscar município',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
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

      const shouldProcessTitular = hasAnyPrefix(["ts_"]);
      const shouldProcessPsAbastecimentoAgua = hasAnyPrefix(["aa_"]);
      const shouldProcessPsEsgotamentoSanitario = hasAnyPrefix(["es_"]);
      const shouldProcessPsDrenagemAguasPluviais = hasAnyPrefix(["da_"]);
      const shouldProcessPsResiduoSolido = hasAnyPrefix(["rs_"]);
      const shouldProcessReguladorFiscalizador = hasAnyPrefix(["rf_"]);
      const shouldProcessControleSocial = hasAnyPrefix(["cs_"]);
      const shouldProcessConselhoMunicipal = hasKey("possui_conselho") || hasKey("descricao_outros");
      const shouldProcessResponsavelSimisab = hasAnyPrefix(["simisab_"]);
      const shouldProcessDadosGeograficos = hasAnyPrefix(["OGM0"]);
      const shouldProcessDadosDemograficos = hasAnyPrefix(["dd_", "OGM4"]);

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

      async function addPsAbastecimentoAgua() {
        // Construir objeto de update apenas com campos enviados no payload
        const updateData = {};
        if (hasKey("aa_abrangencia")) updateData.ps_abrangencia = aa_abrangencia;
        if (hasKey("aa_natureza_juridica")) updateData.ps_natureza_juridica = aa_natureza_juridica;
        if (hasKey("aa_cnpj")) updateData.ps_cnpj = aa_cnpj;
        if (hasKey("aa_telefone")) updateData.ps_telefone = aa_telefone;
        if (hasKey("aa_cep")) updateData.ps_cep = aa_cep;
        if (hasKey("aa_endereco")) updateData.ps_endereco = aa_endereco;
        if (hasKey("aa_numero")) updateData.ps_numero = aa_numero;
        if (hasKey("aa_bairro")) updateData.ps_bairro = aa_bairro;
        if (hasKey("aa_responsavel")) updateData.ps_nome_responsavel = aa_responsavel;
        if (hasKey("aa_cargo")) updateData.ps_cargo = aa_cargo;
        if (hasKey("aa_email")) updateData.ps_email = aa_email;
        if (hasKey("aa_secretaria_setor_responsavel")) updateData.ps_setor_responsavel = aa_secretaria_setor_responsavel;

        // Verificar se já existe um registro para este município
        const existing = await Municipio.query()
          .from("tedplan.ps_abastecimento_agua")
          .where("id_municipio", sanitizedIdMunicipio)
          .first();

        if (existing) {
          // Se já existe, atualizar apenas os campos enviados
          await Municipio.query()
            .from("tedplan.ps_abastecimento_agua")
            .where("id_municipio", sanitizedIdMunicipio)
            .update(updateData);
        } else {
          // Se não existe, criar novo com todos os campos disponíveis
          await Municipio.query()
            .from("tedplan.ps_abastecimento_agua")
            .insert({
              ...updateData,
              id_municipio: sanitizedIdMunicipio,
            });
        }
      }

      async function addPsEsgotamentoSanitario() {
        // Construir objeto de update apenas com campos enviados no payload
        const updateData = {};
        if (hasKey("es_abrangencia")) updateData.ps_abrangencia = es_abrangencia;
        if (hasKey("es_natureza_juridica")) updateData.ps_natureza_juridica = es_natureza_juridica;
        if (hasKey("es_cnpj")) updateData.ps_cnpj = es_cnpj;
        if (hasKey("es_telefone")) updateData.ps_telefone = es_telefone;
        if (hasKey("es_cep")) updateData.ps_cep = es_cep;
        if (hasKey("es_endereco")) updateData.ps_endereco = es_endereco;
        if (hasKey("es_numero")) updateData.ps_numero = es_numero;
        if (hasKey("es_bairro")) updateData.ps_bairro = es_bairro;
        if (hasKey("es_responsavel")) updateData.ps_nome_responsavel = es_responsavel;
        if (hasKey("es_cargo")) updateData.ps_cargo = es_cargo;
        if (hasKey("es_email")) updateData.ps_email = es_email;
        if (hasKey("es_secretaria_setor_responsavel")) updateData.ps_setor_responsavel = es_secretaria_setor_responsavel;

        // Verificar se já existe um registro para este município
        const existing = await Municipio.query()
          .from("tedplan.ps_esgotamento_sanitario")
          .where("id_municipio", sanitizedIdMunicipio)
          .first();

        if (existing) {
          // Se já existe, atualizar apenas os campos enviados
          await Municipio.query()
            .from("tedplan.ps_esgotamento_sanitario")
            .where("id_municipio", sanitizedIdMunicipio)
            .update(updateData);
        } else {
          // Se não existe, criar novo com todos os campos disponíveis
          await Municipio.query()
            .from("tedplan.ps_esgotamento_sanitario")
            .insert({
              ...updateData,
              id_municipio: sanitizedIdMunicipio,
            });
        }
      }

      async function addPsDrenagemAguasPluviais() {
        // Construir objeto de update apenas com campos enviados no payload
        const updateData = {};
        if (hasKey("da_abrangencia")) updateData.ps_abrangencia = da_abrangencia;
        if (hasKey("da_natureza_juridica")) updateData.ps_natureza_juridica = da_natureza_juridica;
        if (hasKey("da_cnpj")) updateData.ps_cnpj = da_cnpj;
        if (hasKey("da_telefone")) updateData.ps_telefone = da_telefone;
        if (hasKey("da_cep")) updateData.ps_cep = da_cep;
        if (hasKey("da_endereco")) updateData.ps_endereco = da_endereco;
        if (hasKey("da_numero")) updateData.ps_numero = da_numero;
        if (hasKey("da_bairro")) updateData.ps_bairro = da_bairro;
        if (hasKey("da_responsavel")) updateData.ps_nome_responsavel = da_responsavel;
        if (hasKey("da_cargo")) updateData.ps_cargo = da_cargo;
        if (hasKey("da_email")) updateData.ps_email = da_email;
        if (hasKey("da_secretaria_setor_responsavel")) updateData.ps_setor_responsavel = da_secretaria_setor_responsavel;

        // Verificar se já existe um registro para este município
        const existing = await Municipio.query()
          .from("tedplan.ps_drenagem_aguas_pluviais")
          .where("id_municipio", sanitizedIdMunicipio)
          .first();

        if (existing) {
          // Se já existe, atualizar apenas os campos enviados
          await Municipio.query()
            .from("tedplan.ps_drenagem_aguas_pluviais")
            .where("id_municipio", sanitizedIdMunicipio)
            .update(updateData);
        } else {
          // Se não existe, criar novo com todos os campos disponíveis
          await Municipio.query()
            .from("tedplan.ps_drenagem_aguas_pluviais")
            .insert({
              ...updateData,
              id_municipio: sanitizedIdMunicipio,
            });
        }
      }

      async function addPsResiduoSolido() {
        // Construir objeto de update apenas com campos enviados no payload
        const updateData = {};
        if (hasKey("rs_abrangencia")) updateData.ps_abrangencia = rs_abrangencia;
        if (hasKey("rs_natureza_juridica")) updateData.ps_natureza_juridica = rs_natureza_juridica;
        if (hasKey("rs_cnpj")) updateData.ps_cnpj = rs_cnpj;
        if (hasKey("rs_telefone")) updateData.ps_telefone = rs_telefone;
        if (hasKey("rs_cep")) updateData.ps_cep = rs_cep;
        if (hasKey("rs_endereco")) updateData.ps_endereco = rs_endereco;
        if (hasKey("rs_numero")) updateData.ps_numero = rs_numero;
        if (hasKey("rs_bairro")) updateData.ps_bairro = rs_bairro;
        if (hasKey("rs_responsavel")) updateData.ps_nome_responsavel = rs_responsavel;
        if (hasKey("rs_cargo")) updateData.ps_cargo = rs_cargo;
        if (hasKey("rs_email")) updateData.ps_email = rs_email;
        if (hasKey("rs_secretaria_setor_responsavel")) updateData.ps_setor_responsavel = rs_secretaria_setor_responsavel;

        // Verificar se já existe um registro para este município
        const existing = await Municipio.query()
          .from("tedplan.ps_residuo_solido")
          .where("id_municipio", sanitizedIdMunicipio)
          .first();

        if (existing) {
          // Se já existe, atualizar apenas os campos enviados
          await Municipio.query()
            .from("tedplan.ps_residuo_solido")
            .where("id_municipio", sanitizedIdMunicipio)
            .update(updateData);
        } else {
          // Se não existe, criar novo com todos os campos disponíveis
          await Municipio.query()
            .from("tedplan.ps_residuo_solido")
            .insert({
              ...updateData,
              id_municipio: sanitizedIdMunicipio,
            });
        }
      }

      async function addReguladorFiscalizador() {
        // Construir objeto de update apenas com campos enviados no payload
        const updateData = {};
        if (hasKey("rf_setor_responsavel")) updateData.setor_responsavel = rf_setor_responsavel;
        if (hasKey("rf_telefone_comercial")) updateData.telefone_comercial = rf_telefone_comercial;
        if (hasKey("rf_responsavel")) updateData.nome_responsavel = rf_responsavel;
        if (hasKey("rf_cargo")) updateData.cargo = rf_cargo;
        if (hasKey("rf_funcao")) updateData.funcao = rf_funcao;
        if (hasKey("rf_telefone")) updateData.telefone = rf_telefone;
        if (hasKey("rf_email")) updateData.email = rf_email;
        if (hasKey("rf_descricao")) updateData.descricao = rf_descricao;

        // Verificar se já existe um registro para este município
        const existing = await Municipio.query()
          .from("tedplan.regulador_fiscalizador_ss")
          .where("id_municipio", sanitizedIdMunicipio)
          .first();

        if (existing) {
          // Se já existe, atualizar apenas os campos enviados
          await Municipio.query()
            .from("tedplan.regulador_fiscalizador_ss")
            .where("id_municipio", sanitizedIdMunicipio)
            .update(updateData);
        } else {
          // Se não existe, criar novo com todos os campos disponíveis
          await Municipio.query()
            .from("tedplan.regulador_fiscalizador_ss")
            .insert({
              ...updateData,
              id_municipio: sanitizedIdMunicipio,
            });
        }
      }

      async function addControleSocial() {
        // Construir objeto de update apenas com campos enviados no payload
        const updateData = {};
        if (hasKey("cs_setor_responsavel")) updateData.setor_responsavel_cs_sms = cs_setor_responsavel;
        if (hasKey("cs_telefone")) updateData.telefone_cs_sms = cs_telefone;
        if (hasKey("cs_email")) updateData.email_cs_sms = cs_email;

        // Verificar se já existe um registro para este município
        const existing = await Municipio.query()
          .from("tedplan.controle_social_sms")
          .where("id_municipio", sanitizedIdMunicipio)
          .first();

        if (existing) {
          // Se já existe, atualizar apenas os campos enviados
          await Municipio.query()
            .from("tedplan.controle_social_sms")
            .where("id_municipio", sanitizedIdMunicipio)
            .update(updateData);
        } else {
          // Se não existe, criar novo com todos os campos disponíveis
          await Municipio.query()
            .from("tedplan.controle_social_sms")
            .insert({
              ...updateData,
              id_municipio: sanitizedIdMunicipio,
            });
        }
      }

      async function addResponsavelSimisab() {
        // Construir objeto de update apenas com campos enviados no payload
        const updateData = {};
        if (hasKey("simisab_responsavel")) updateData.simisab_nome_responsavel = simisab_responsavel;
        if (hasKey("simisab_telefone")) updateData.simisab_telefone = simisab_telefone;
        if (hasKey("simisab_email")) updateData.simisab_email = simisab_email;

        // Verificar se já existe um registro para este município
        const existing = await Municipio.query()
          .from("tedplan.responsavel_simisab")
          .where("id_municipio", sanitizedIdMunicipio)
          .first();

        if (existing) {
          // Se já existe, atualizar apenas os campos enviados
          await Municipio.query()
            .from("tedplan.responsavel_simisab")
            .where("id_municipio", sanitizedIdMunicipio)
            .update(updateData);
        } else {
          // Se não existe, criar novo com todos os campos disponíveis
          await Municipio.query()
            .from("tedplan.responsavel_simisab")
            .insert({
              ...updateData,
              id_municipio: sanitizedIdMunicipio,
            });
        }
      }

      async function addConselhoMunicipal() {
        // Construir objeto de update apenas com campos enviados no payload
        const updateData = {};
        if (hasKey("possui_conselho")) updateData.possui_conselho = possui_conselho;
        if (hasKey("descricao_outros")) updateData.descricao_outros = descricao_outros;

        // Verificar se já existe um registro para este município
        const existing = await Municipio.query()
          .from("tedplan.conselho_municipal")
          .where("id_municipio", sanitizedIdMunicipio)
          .first();

        if (existing) {
          // Se já existe, atualizar apenas os campos enviados
          await Municipio.query()
            .from("tedplan.conselho_municipal")
            .where("id_municipio", sanitizedIdMunicipio)
            .update(updateData);
        } else {
          // Se não existe, criar novo com todos os campos disponíveis
          await Municipio.query()
            .from("tedplan.conselho_municipal")
            .insert({
              ...updateData,
              id_municipio: sanitizedIdMunicipio,
            });
        }
      }

      async function addDadosGeograficos() {
        // Construir objeto de update apenas com campos enviados no payload
        const updateData = {};
        // Campos de texto (nomes)
        if (hasKey("OGM0001")) updateData.ogm0001 = OGM0001 || null;
        if (hasKey("OGM0002")) updateData.ogm0002 = OGM0002 || null;
        if (hasKey("OGM0004")) updateData.ogm0004 = OGM0004 || null;
        // Campos select (Sim/Não) - texto
        if (hasKey("OGM0003")) updateData.ogm0003 = OGM0003 || null;
        if (hasKey("OGM0101")) updateData.ogm0101 = OGM0101 || null;
        if (hasKey("OGM0104")) updateData.ogm0104 = OGM0104 || null;
        if (hasKey("OGM0107")) updateData.ogm0107 = OGM0107 || null;
        // Campos decimais
        if (hasKey("OGM0005")) updateData.ogm0005 = sanitizeDecimal(OGM0005);
        if (hasKey("OGM0006")) updateData.ogm0006 = sanitizeDecimal(OGM0006);
        if (hasKey("OGM0010")) updateData.ogm0010 = sanitizeDecimal(OGM0010);
        if (hasKey("OGM0011")) updateData.ogm0011 = sanitizeDecimal(OGM0011);
        if (hasKey("OGM0012")) updateData.ogm0012 = sanitizeDecimal(OGM0012);
        // Campos integer
        if (hasKey("OGM0007")) updateData.ogm0007 = sanitizeInteger(OGM0007);
        if (hasKey("OGM0008")) updateData.ogm0008 = sanitizeInteger(OGM0008);
        if (hasKey("OGM0009")) updateData.ogm0009 = sanitizeInteger(OGM0009);
        if (hasKey("OGM0102")) updateData.ogm0102 = sanitizeInteger(OGM0102);
        if (hasKey("OGM0103")) updateData.ogm0103 = sanitizeInteger(OGM0103);
        if (hasKey("OGM0105")) updateData.ogm0105 = sanitizeInteger(OGM0105);
        if (hasKey("OGM0106")) updateData.ogm0106 = sanitizeInteger(OGM0106);
        if (hasKey("OGM0108")) updateData.ogm0108 = sanitizeInteger(OGM0108);
        if (hasKey("OGM0109")) updateData.ogm0109 = sanitizeInteger(OGM0109);

        // Verificar se já existe um registro para este município
        const existing = await Municipio.query()
          .from("tedplan.dados_geograficos")
          .where("id_municipio", sanitizedIdMunicipio)
          .first();

        if (existing) {
          // Se já existe, atualizar apenas os campos enviados
          await Municipio.query()
            .from("tedplan.dados_geograficos")
            .where("id_municipio", sanitizedIdMunicipio)
            .update(updateData);
        } else {
          // Se não existe, criar novo com todos os campos disponíveis
          await Municipio.query()
            .from("tedplan.dados_geograficos")
            .insert({
              ...updateData,
              id_municipio: sanitizedIdMunicipio,
            });
        }
      }

      async function addDadosDemograficos() {
        const updateData = {};
        if (hasKey("dd_populacao_urbana")) updateData.populacao_urbana = dd_populacao_urbana || null;
        if (hasKey("dd_populacao_rural")) updateData.populacao_rural = dd_populacao_rural || null;
        if (hasKey("dd_populacao_total")) updateData.populacao_total = dd_populacao_total || null;
        if (hasKey("dd_total_moradias")) updateData.total_moradias = dd_total_moradias || null;
        if (hasKey("OGM4001")) updateData.OGM4001 = sanitizeInteger(OGM4001);
        if (hasKey("OGM4002")) updateData.OGM4002 = sanitizeInteger(OGM4002);
        if (hasKey("OGM4003")) updateData.OGM4003 = sanitizeInteger(OGM4003);
        if (hasKey("OGM4004")) updateData.OGM4004 = sanitizeInteger(OGM4004);
        if (hasKey("OGM4005")) updateData.OGM4005 = sanitizeInteger(OGM4005);
        if (hasKey("OGM4006")) updateData.OGM4006 = sanitizeInteger(OGM4006);
        if (hasKey("OGM4007")) updateData.OGM4007 = sanitizeDecimal(OGM4007);
        if (hasKey("OGM4008")) updateData.OGM4008 = sanitizeDecimal(OGM4008);
        if (hasKey("OGM4009")) updateData.OGM4009 = sanitizeDecimal(OGM4009);

        const existing = await Municipio.query()
          .from("tedplan.dados_demograficos")
          .where("id_municipio", sanitizedIdMunicipio)
          .first();

        if (existing) {
          await Municipio.query()
            .from("tedplan.dados_demograficos")
            .where("id_municipio", sanitizedIdMunicipio)
            .update(updateData);
        } else {
          await Municipio.query()
            .from("tedplan.dados_demograficos")
            .insert({
              ...updateData,
              id_municipio: sanitizedIdMunicipio,
            });
        }
      }

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
        await addPsAbastecimentoAgua();
      }

      if (shouldProcessPsEsgotamentoSanitario) {
        await addPsEsgotamentoSanitario();
      }

      if (shouldProcessPsDrenagemAguasPluviais) {
        await addPsDrenagemAguasPluviais();
      }

      if (shouldProcessPsResiduoSolido) {
        await addPsResiduoSolido();
      }

      if (shouldProcessReguladorFiscalizador) {
        await addReguladorFiscalizador();
      }

      if (shouldProcessControleSocial) {
        await addControleSocial();
      }

      if (shouldProcessConselhoMunicipal) {
        await addConselhoMunicipal();
      }

      if (shouldProcessResponsavelSimisab) {
        await addResponsavelSimisab();
      }

      if (shouldProcessDadosGeograficos) {
        await addDadosGeograficos();
      }

      if (shouldProcessDadosDemograficos) {
        await addDadosDemograficos();
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
