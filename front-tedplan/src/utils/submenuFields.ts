/**
 * Mapeamento de campos por submenu
 * Fase 1: Mapeamento de Campos por Submenu
 * 
 * Este arquivo define quais campos pertencem a cada submenu,
 * incluindo campos obrigatórios, opcionais e validações condicionais.
 */

export interface SubmenuFieldConfig {
  required: string[];
  optional: string[];
  conditional?: {
    field: string;
    condition: (data: any) => boolean;
  }[];
}

export interface SubmenuFields {
  [key: string]: SubmenuFieldConfig;
}

/**
 * Mapeamento completo de campos por submenu
 */
export const submenuFields: SubmenuFields = {
  dadosMunicipio: {
    required: [
      'municipio_nome_prefeitura',
      'municipio_cep',
      'municipio_endereco',
      'municipio_numero',
      'municipio_bairro',
      'municipio_telefone',
      'municipio_email',
      'municipio_prefeito'
    ],
    optional: [
      'id_municipio',
      'municipio_codigo_ibge',
      'municipio_nome',
      'municipio_cnpj'
    ]
  },

  titularServicos: {
    required: [
      'ts_setor_responsavel',
      'ts_telefone_comercial',
      'ts_responsavel',
      'ts_cargo',
      'ts_funcao',
      'ts_telefone',
      'ts_email'
    ],
    optional: [
      'id_titular_servicos_ms'
    ]
  },

  prestadoresServicos: {
    required: [
      // Abastecimento de Água (Step 0)
      'aa_secretaria_setor_responsavel',
      'aa_abrangencia',
      'aa_natureza_juridica',
      'aa_cnpj',
      'aa_telefone',
      'aa_cep',
      'aa_endereco',
      'aa_numero',
      'aa_bairro',
      'aa_responsavel',
      'aa_cargo',
      'aa_email',
      // Esgotamento Sanitário (Step 1)
      'es_secretaria_setor_responsavel',
      'es_abrangencia',
      'es_natureza_juridica',
      'es_cnpj',
      'es_telefone',
      'es_cep',
      'es_endereco',
      'es_numero',
      'es_bairro',
      'es_responsavel',
      'es_cargo',
      'es_email',
      // Drenagem e Águas Pluviais (Step 2)
      'da_secretaria_setor_responsavel',
      'da_abrangencia',
      'da_natureza_juridica',
      'da_cnpj',
      'da_telefone',
      'da_cep',
      'da_endereco',
      'da_numero',
      'da_bairro',
      'da_responsavel',
      'da_cargo',
      'da_email',
      // Resíduos Sólidos (Step 3)
      'rs_secretaria_setor_responsavel',
      'rs_abrangencia',
      'rs_natureza_juridica',
      'rs_cnpj',
      'rs_telefone',
      'rs_cep',
      'rs_endereco',
      'rs_numero',
      'rs_bairro',
      'rs_responsavel',
      'rs_cargo',
      'rs_email'
    ],
    optional: [
      'id_ps_abastecimento_agua',
      'id_ps_esgotamento_sanitario',
      'id_ps_drenagem_aguas_pluviais',
      'id_ps_residuo_solido'
    ]
  },

  // Submenus individuais para cada step de Prestadores de Serviços
  prestadoresAbastecimentoAgua: {
    required: [
      'aa_secretaria_setor_responsavel',
      'aa_abrangencia',
      'aa_natureza_juridica',
      'aa_cnpj',
      'aa_telefone',
      'aa_cep',
      'aa_endereco',
      'aa_numero',
      'aa_bairro',
      'aa_responsavel',
      'aa_cargo',
      'aa_email'
    ],
    optional: [
      'id_ps_abastecimento_agua'
    ]
  },

  prestadoresEsgotamentoSanitario: {
    required: [
      'es_secretaria_setor_responsavel',
      'es_abrangencia',
      'es_natureza_juridica',
      'es_cnpj',
      'es_telefone',
      'es_cep',
      'es_endereco',
      'es_numero',
      'es_bairro',
      'es_responsavel',
      'es_cargo',
      'es_email'
    ],
    optional: [
      'id_ps_esgotamento_sanitario'
    ]
  },

  prestadoresDrenagemAguasPluviais: {
    required: [
      'da_secretaria_setor_responsavel',
      'da_abrangencia',
      'da_natureza_juridica',
      'da_cnpj',
      'da_telefone',
      'da_cep',
      'da_endereco',
      'da_numero',
      'da_bairro',
      'da_responsavel',
      'da_cargo',
      'da_email'
    ],
    optional: [
      'id_ps_drenagem_aguas_pluviais'
    ]
  },

  prestadoresResiduosSolidos: {
    required: [
      'rs_secretaria_setor_responsavel',
      'rs_abrangencia',
      'rs_natureza_juridica',
      'rs_cnpj',
      'rs_telefone',
      'rs_cep',
      'rs_endereco',
      'rs_numero',
      'rs_bairro',
      'rs_responsavel',
      'rs_cargo',
      'rs_email'
    ],
    optional: [
      'id_ps_residuo_solido'
    ]
  },

  reguladorFiscalizador: {
    required: [
      'rf_setor_responsavel',
      'rf_telefone_comercial',
      'rf_responsavel',
      'rf_cargo',
      'rf_funcao',
      'rf_telefone',
      'rf_email',
      'rf_descricao'
    ],
    optional: [
      'id_regulador_fiscalizador_ss'
    ]
  },

  controleSocial: {
    required: [
      // Controle Social
      'cs_setor_responsavel',
      'cs_telefone',
      'cs_email',
      // Responsável SIMISAB
      'simisab_responsavel',
      'simisab_telefone',
      'simisab_email',
      // Conselho Municipal
      'possui_conselho'
    ],
    optional: [
      'id_controle_social_sms',
      'id_responsavel_simisab',
      'id_conselho_municipal',
      'descricao_outros'
    ],
    conditional: [
      {
        field: 'descricao_outros',
        condition: (data) => data.possui_conselho === 'outros'
      }
    ]
  },

  dadosGeograficos: {
    required: [
      'OGM0001',
      'OGM0002',
      'OGM0003',
      'OGM0005',
      'OGM0006',
      'OGM0007',
      'OGM0008',
      'OGM0009',
      'OGM0010',
      'OGM0011',
      'OGM0012',
      'OGM0101',
      'OGM0104',
      'OGM0107'
    ],
    optional: [
      'id_dados_geograficos',
      'OGM0004',
      'OGM0102',
      'OGM0103',
      'OGM0105',
      'OGM0106',
      'OGM0108',
      'OGM0109'
    ],
    conditional: [
      {
        field: 'OGM0004',
        condition: (data) => data.OGM0003 === 'Sim'
      },
      {
        field: 'OGM0102',
        condition: (data) => data.OGM0101 === 'Sim'
      },
      {
        field: 'OGM0103',
        condition: (data) => data.OGM0101 === 'Sim'
      },
      {
        field: 'OGM0105',
        condition: (data) => data.OGM0104 === 'Sim'
      },
      {
        field: 'OGM0106',
        condition: (data) => data.OGM0104 === 'Sim'
      },
      {
        field: 'OGM0108',
        condition: (data) => data.OGM0107 === 'Sim'
      },
      {
        field: 'OGM0109',
        condition: (data) => data.OGM0107 === 'Sim'
      }
    ]
  },

  dadosDemograficos: {
    required: [
      'dd_populacao_urbana',
      'dd_populacao_rural',
      'dd_total_moradias',
      'OGM4001',
      'OGM4002',
      'OGM4004',
      'OGM4005',
      'OGM4007',
      'OGM4008'
    ],
    optional: [
      'id_dados_demograficos',
      'dd_populacao_total',
      'OGM4003',
      'OGM4006',
      'OGM4009'
    ]
  }
};

/**
 * Retorna o nome amigável do submenu
 */
export const getSubmenuName = (submenuKey: string): string => {
  const names: { [key: string]: string } = {
    dadosMunicipio: 'Dados do Município',
    titularServicos: 'Titular dos Serviços',
    prestadoresServicos: 'Prestadores de Serviços',
    prestadoresAbastecimentoAgua: 'Abastecimento de Água',
    prestadoresEsgotamentoSanitario: 'Esgotamento Sanitário',
    prestadoresDrenagemAguasPluviais: 'Drenagem e Águas Pluviais',
    prestadoresResiduosSolidos: 'Limpeza Pública e Resíduos Sólidos',
    reguladorFiscalizador: 'Regulador e Fiscalizador',
    controleSocial: 'Controle Social & Responsável pelo SIMISAB',
    dadosGeograficos: 'Dados Geográficos',
    dadosDemograficos: 'Dados Demográficos'
  };
  return names[submenuKey] || submenuKey;
};

/**
 * Retorna todos os campos de um submenu (required + optional)
 */
export const getAllSubmenuFields = (submenuKey: string): string[] => {
  const config = submenuFields[submenuKey];
  if (!config) return [];
  
  return [
    ...config.required,
    ...config.optional
  ];
};

/**
 * Verifica se um campo é obrigatório condicionalmente
 */
export const isConditionallyRequired = (
  submenuKey: string,
  fieldName: string,
  formData: any
): boolean => {
  const config = submenuFields[submenuKey];
  if (!config || !config.conditional) return false;

  const conditional = config.conditional.find(c => c.field === fieldName);
  if (!conditional) return false;

  return conditional.condition(formData);
};

/**
 * Retorna todos os campos obrigatórios de um submenu (incluindo condicionais)
 */
export const getRequiredFields = (
  submenuKey: string,
  formData: any = {}
): string[] => {
  const config = submenuFields[submenuKey];
  if (!config) return [];

  const required = [...config.required];

  // Adicionar campos condicionais se a condição for verdadeira
  if (config.conditional) {
    config.conditional.forEach(conditional => {
      if (conditional.condition(formData)) {
        required.push(conditional.field);
      }
    });
  }

  return required;
};

