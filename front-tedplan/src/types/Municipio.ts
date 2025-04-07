export type Municipio = {
  id_municipio: string;
  municipio_codigo_ibge: string;
  municipio_nome: string;
  municipio_cnpj: string;
  municipio_nome_prefeitura: string;
  municipio_cep: string;
  municipio_endereco: string;
  municipio_numero: string;
  municipio_bairro: string;
  municipio_telefone: string;
  municipio_email: string;
  municipio_prefeito: string;
  //titular dos serviços municipais de saneamento
  id_titular_servicos_ms: string;
  ts_setor_responsavel: string;
  ts_telefone_comercial: string;
  ts_responsavel: string;
  ts_cargo: string;
  ts_telefone: string;
  ts_email: string;

  //prestador do serviço de seneamento basico
  //abastecimento de agua
  id_ps_abastecimento_agua: string;
  aa_abrangencia: string;
  aa_natureza_juridica: string;
  aa_cnpj: string;
  aa_telefone: string;
  aa_cep: string;
  aa_endereco: string;
  aa_numero: string;
  aa_bairro: string;
  aa_responsavel: string;
  aa_cargo: string;
  aa_email: string;
  aa_secretaria_setor_responsavel: string;

  //esgotamento sanitario
  id_ps_esgotamento_sanitario: string;
  es_secretaria_setor_responsavel: string;
  es_abrangencia: string;
  es_natureza_juridica: string;
  es_cnpj: string;
  es_telefone: string;
  es_cep: string;
  es_endereco: string;
  es_numero: string;
  es_bairro: string;
  es_responsavel: string;
  es_cargo: string;
  es_email: string;
  //drenagem e àguas pluvias
  id_ps_drenagem_aguas_pluviais: string;
  da_secretaria_setor_responsavel: string;
  da_abrangencia: string;
  da_natureza_juridica: string;
  da_cnpj: string;
  da_telefone: string;
  da_cep: string;
  da_endereco: string;
  da_numero: string;
  da_bairro: string;
  da_responsavel: string;
  da_cargo: string;
  da_email: string;
  //Resíduos Sólidos
  id_ps_residuo_solido: string;
  rs_secretaria_setor_responsavel: string;
  rs_abrangencia: string;
  rs_natureza_juridica: string;
  rs_cnpj: string;
  rs_telefone: string;
  rs_cep: string;
  rs_endereco: string;
  rs_numero: string;
  rs_bairro: string;
  rs_responsavel: string;
  rs_cargo: string;
  rs_email: string;

  //Regulador e Fiscalizador dos Serviços de Saneamento
  id_regulador_fiscalizador_ss: string;
  rf_setor_responsavel: string;
  rf_telefone_comercial: string;
  rf_responsavel: string;
  rf_cargo: string;
  rf_telefone: string;
  rf_email: string;
  rf_descricao: string;

  //Controle Social dos Serços Municipais de Saneamento
  id_controle_social_sms: string;
  setor_responsavel_cs_sms: string;
  telefone_cs_sms: string;
  email_cs_sms: string;

  //Responsável pelo SIMISAB
  id_responsavel_simisab: string;
  simisab_responsavel: string;
  simisab_telefone: string;
  simisab_email: string;
  cs_setor_responsavel: string;
  cs_telefone: string;
  cs_email: string;

  //Dados demográficos
  id_dados_demograficos: string;
  dd_populacao_urbana: string;
  dd_populacao_rural: string;
  dd_populacao_total: string;
  dd_total_moradias: string;
  OGM4001: string;
  OGM4002: string;
  OGM4003: string;
  OGM4004: string;
  OGM4005: string;
  OGM4006: string;
  OGM4007: string;
  OGM4008: string;
  OGM4009: string;

  // Dados Geográficos
  id_dados_geograficos?: string;
  OGM0001?: string; // Nome da mesorregião geográfica
  OGM0002?: string; // Nome da microrregião geográfica
  OGM0003?: string; // Pertence à Região Metropolitana
  OGM0004?: string; // Nome oficial (RM, RIDE, etc)
  OGM0005?: string; // Área territorial total
  OGM0006?: string; // Total de áreas urbanizadas
  OGM0007?: string; // Quantidade de distritos
  OGM0008?: string; // Quantidade de localidades urbanas
  OGM0009?: string; // Quantidade de aglomerados rurais
  OGM0010?: string; // Cota altimétrica de referência
  OGM0011?: string; // Cota altimétrica mínima
  OGM0012?: string; // Cota altimétrica máxima
  OGM0101?: string; // Existem Aldeias Indígenas
  OGM0102?: string; // Quantidade de moradias nas Aldeias Indígenas
  OGM0103?: string; // População nas Aldeias Indígenas
  OGM0104?: string; // Existem Comunidades Quilombolas
  OGM0105?: string; // Quantidade de moradias nas Comunidades Quilombolas
  OGM0106?: string; // População nas Comunidades Quilombolas
  OGM0107?: string; // Existem Comunidades Extrativistas
  OGM0108?: string; // Quantidade de moradias nas Comunidades Extrativistas
  OGM0109?: string; // População nas Comunidades Extrativistas
};
