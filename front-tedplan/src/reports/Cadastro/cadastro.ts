import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

export function cadastroPDF(dadosMunicipio: any) {
 pdfMake.vfs = pdfFonts.vfs;
  const reportTitle: any = [
    {
      text: "Dados de cadastro do Município",
      alignment: "center",
      fontSize: 16,
      bold: true,
      margin: [15, 20, 15, 45],
    },
  ];
  const content: any = [
    {
      text: "Dados do Município",
      bold: true,
      fontSize: 14,
      margin: [0, 10, 15, 0],
    },
    {
      table: {
        headerRows: 1,
        body: [
          [{ text: "Descrição" }, { text: "Valor" }],
          ["Código do IBGE", dadosMunicipio?.municipio_codigo_ibge],
          ["Município", dadosMunicipio?.municipio_nome],
          ["CNPJ", dadosMunicipio?.municipio_cnpj],
          ["Nome da Prefeitura", dadosMunicipio?.municipio_nome_prefeitura],
          ["CEP", dadosMunicipio?.municipio_cep],
          ["Endereço", dadosMunicipio?.municipio_endereco],
          ["Numero", dadosMunicipio?.municipio_numero],
          ["Bairro", dadosMunicipio?.municipio_bairro],
          ["Telefone", dadosMunicipio?.municipio_telefone],
          ["E-mail", dadosMunicipio?.municipio_email],
          ["Nome do Prefeito", dadosMunicipio?.municipio_prefeito],
        ],
      },
      layout: "headerLineOnly",
    },
    {
      text: "Titular dos Serviços Municipais de Saneamento",
      bold: true,
      fontSize: 14,
      margin: [0, 10, 15, 0],
    },
    {
      table: {
        headerRows: 1,
        body: [
          [{ text: "Descrição" }, { text: "Valor" }],
          ["Setor Responsável", dadosMunicipio?.ts_setor_responsavel],
          ["Telefone comercial", dadosMunicipio?.ts_telefone_comercial],
          ["Nome Responsável", dadosMunicipio?.ts_responsavel],
          ["Cargo", dadosMunicipio?.ts_cargo],
          //["Função", dadosMunicipio?.ts_funcao],
          ["Telefone", dadosMunicipio?.ts_telefone],
          ["Email", dadosMunicipio?.ts_email],
        ],
      },
      layout: "headerLineOnly",
    },
    {
      text: "Prestadores do Serviço de Saneamento Básico",
      bold: true,
      fontSize: 14,
      margin: [0, 10, 15, 0],
    },    
    {
      text: "Abastecimento de Água",
      bold: true,
      fontSize: 12,
      margin: [0, 10, 15, 0],
    },
    {
      table: {
        headerRows: 1,
        body: [
          [{ bold: true, text: "Descrição" }, { text: "Valor" }],
          ["Setor Responsável", dadosMunicipio?.aa_secretaria_setor_responsavel],
          ["Abrangência", dadosMunicipio?.aa_abrangencia],
          ["Natureza jurídica", dadosMunicipio?.aa_natureza_juridica],
          ["CNPJ", dadosMunicipio?.aa_cnpj],
          ["Telefone", dadosMunicipio?.aa_telefone],
          ["CEP", dadosMunicipio?.aa_cep],
          ["Endereço", dadosMunicipio?.aa_endereco],
          ["Numero", dadosMunicipio?.aa_numero],
          ["Bairro", dadosMunicipio?.aa_bairro],
          ["E-mail", dadosMunicipio?.aa_email],
          ["Nome Responsável", dadosMunicipio?.aa_responsavel],
          ["Cargo", dadosMunicipio?.aa_cargo],
          ["E-mail", dadosMunicipio?.aa_email],
        ],
      },
      layout: "headerLineOnly",
    },
    {
      text: "Regulador e Fiscalizador dos Serviços Municipais de Saneamento Básico",
      bold: true,
      fontSize: 12,
      margin: [0, 10, 15, 0],
    },
     {
      text: "Esgotamento Sanitário",
      bold: true,
      fontSize: 12,
      margin: [0, 10, 15, 0],
    },
    {
      table: {
        headerRows: 1,
        body: [
          [{ text: "Descrição" }, { text: "Valor" }],
          [
            "Secretaria ou Setor Responsável",
            dadosMunicipio?.es_secretaria_setor_responsavel,
          ],
          ["Abrangência", dadosMunicipio?.es_abrangencia],
          ["Natureza jurídica", dadosMunicipio?.es_natureza_juridica],
          ["CNPJ", dadosMunicipio?.es_cnpj],
          ["Telefone", dadosMunicipio?.es_telefone],
          ["CEP", dadosMunicipio?.es_cep],
          ["Endereço", dadosMunicipio?.es_endereco],
          ["Numero", dadosMunicipio?.es_numero],
          ["Bairro", dadosMunicipio?.es_bairro],                    
          ["Nome do Responsável", dadosMunicipio?.es_responsavel],
          ["Cargo", dadosMunicipio?.es_cargo],
          ["E-mail", dadosMunicipio?.es_email],
        ],
      },
      layout: "headerLineOnly",
    },
     {
      text: "Regulador e Fiscalizador dos Serviços Municipais de Saneamento Básico",
      bold: true,
      fontSize: 12,
      margin: [0, 10, 15, 0],
    },
     {
      text: "Drenagem e Águas Pluviais",
      bold: true,
      fontSize: 12,
      margin: [0, 10, 15, 0],
    },
    {
      table: {
        headerRows: 1,
        body: [
          [{ text: "Descrição" }, { text: "Valor" }],
          [
            "Secretaria ou Setor Responsável",
            dadosMunicipio?.da_secretaria_setor_responsavel,
          ],
          ["Abrangência", dadosMunicipio?.da_abrangencia],
          ["Natureza jurídica", dadosMunicipio?.da_natureza_juridica],
          ["CNPJ", dadosMunicipio?.da_cnpj],
          ["Telefone", dadosMunicipio?.da_telefone],
          ["CEP", dadosMunicipio?.da_cep],
          ["Endereço", dadosMunicipio?.da_endereco],
          ["Numero", dadosMunicipio?.da_numero],
          ["Bairro", dadosMunicipio?.da_bairro],
          ["E-mail", dadosMunicipio?.da_email],
          ["Nome do Responsável", dadosMunicipio?.da_responsavel],
          ["Cargo", dadosMunicipio?.da_cargo],
          ["E-mail", dadosMunicipio?.da_email],        
        ],
      },
      layout: "headerLineOnly",
    },
     {
      text: "Regulador e Fiscalizador dos Serviços Municipais de Saneamento Básico",
      bold: true,
      fontSize: 12,
      margin: [0, 10, 15, 0],
    },
     {
      text: "Limpeza Pública e Resíduos Sólidos",
      bold: true,
      fontSize: 12,
      margin: [0, 10, 15, 0],
    },
    {
      table: {
        headerRows: 1,
        body: [
          [{ text: "Descrição" }, { text: "Valor" }],
          [
            "Secretaria ou Setor Responsável",
            dadosMunicipio?.rs_secretaria_setor_responsavel,
          ],
          ["Abrangência", dadosMunicipio?.rs_abrangencia],
          ["Natureza jurídica", dadosMunicipio?.rs_natureza_juridica],
          ["CNPJ", dadosMunicipio?.rs_cnpj],
          ["Telefone", dadosMunicipio?.rs_telefone],
          ["CEP", dadosMunicipio?.rs_cep],
          ["Endereço", dadosMunicipio?.rs_endereco],
          ["Numero", dadosMunicipio?.rs_numero],
          ["Bairro", dadosMunicipio?.rs_bairro],
          ["E-mail", dadosMunicipio?.rs_email],
          ["Nome do Responsável", dadosMunicipio?.rs_responsavel],
          ["Cargo", dadosMunicipio?.rs_cargo],
          ["E-mail", dadosMunicipio?.rs_email],
        ],
      },
      layout: "headerLineOnly",
    },
    {
      text: "Regulador e Fiscalizador dos Serviços Municipais de Saneamento Básico",
      bold: true,
      fontSize: 12,
      margin: [0, 10, 15, 0],
    },
    {
      table: {
        headerRows: 1,
        body: [
          [{ text: "Descrição" }, { text: "Valor" }],
          ["Setor Responsável", dadosMunicipio?.rf_setor_responsavel],
          ["Telefone comercial", dadosMunicipio?.rf_telefone_comercial],
          ["Nome Responsável", dadosMunicipio?.rf_responsavel],
          ["Cargo", dadosMunicipio?.rf_cargo],
          //["Função", dadosMunicipio?.rf_funcao],
          ["Telefone", dadosMunicipio?.rf_telefone],
          ["Email", dadosMunicipio?.rf_email],
        ],
      },
      layout: "headerLineOnly",
    },
    
    {
      text: "Controle Social & Responsável pelo SIMISAB",
      bold: true,
      fontSize: 14,
      margin: [0, 10, 15, 0],
    },
      {
      text: "Responsável pelo SIMISAB",
      bold: true,
      fontSize: 12,
      margin: [0, 10, 15, 0],
    },
    {
      table: {
        headerRows: 1,
        body: [
          [{ bold: true, text: "Descrição" }, { text: "Valor" }],
          ["Nome", dadosMunicipio?.simisab_responsavel],         
          ["Telefone", dadosMunicipio?.simisab_telefone],
          ["Email", dadosMunicipio?.simisab_email],          
        ],
      },
      layout: "headerLineOnly",
    },
    {
      text: "Dados Geográficos",
      bold: true,
      fontSize: 12,
      margin: [0, 10, 15, 0],
    },
    {
      table: {
        headerRows: 1,
        body: [
          [{ text: "Descrição" }, { text: "Valor" }, { text: "Unidade" }],
          [
            "Secretaria ou Setor Responsável",
            dadosMunicipio?.rs_secretaria_setor_responsavel,""
          ],
          ["Nome da mesorregião geográfica", dadosMunicipio?.OGM0001,""],
          ["Nome da microrregião geográfica", dadosMunicipio?.OGM0002,""],
          ["O município pertence a uma Região Metropolitana (RM), Região Integrada de Desenvolvimento (RIDE), Aglomeração Urbana ou Microrregião legalmente instituída?", 
            dadosMunicipio?.OGM0003,""],
          ["Nome oficial (RM, RIDE, Aglomeração Urbana ou Microrregião)", dadosMunicipio?.OGM0004,""],
          ["Área territorial total", dadosMunicipio?.OGM0005,"km²"],
          ["Total de áreas urbanizadas", dadosMunicipio?.OGM0006,"km²"],
          ["Quantidade de distritos em que se divide o município (previsão de coleta: a partir de 2025)", dadosMunicipio?.OGM0007,"Unidades"],
          ["Quantidade de localidades urbanas existentes, inclusive à sede (previsão de coleta: a partir de 2025)", dadosMunicipio?.OGM0008,"Unidades"],
          ["Quantidade de aglomerados rurais de características urbanas existentes (previsão de coleta: a partir de 2025)", dadosMunicipio?.OGM0009,"Unidades"],
          ["Cota altimétrica de referência", dadosMunicipio?.OGM0010,"m"],
          ["Cota altimétrica mínima", dadosMunicipio?.OGM0011,"m"],
          ["Cota altimétrica máxima", dadosMunicipio?.OGM0012,"m"],
          ["Existem Aldeias Indígenas no município?", dadosMunicipio?.OGM0101,""],
          ["Quantidade de moradias/habitações existente nas Aldeias Indígenas (previsão de coleta: a partir de 2025)", dadosMunicipio?.OGM0102,"moradias"],
          ["População permanente estimada nas Aldeias Indígenas (previsão de coleta: a partir de 2025)", dadosMunicipio?.OGM0103,"habitantes"],
          ["Existem Terras Quilombolas no município?", dadosMunicipio?.OGM0104,""],
          ["Quantidade de moradias/habitações existente nas Terras Quilombolas (previsão de coleta: a partir de 2025)", dadosMunicipio?.OGM0105,"moradias"],
          ["População permanente estimada nas Terras Quilombolas (previsão de coleta: a partir de 2025)", dadosMunicipio?.OGM0106,"habitantes"],
          ["Existem Comunidades Extrativistas no município?", dadosMunicipio?.OGM0107,""],
          ["Quantidade de moradias/habitações existente nas Comunidades Extrativistas (previsão de coleta: a partir de 2025)", dadosMunicipio?.OGM0108,"moradias"],
          ["População permanente estimada nas Comunidades Extrativistas (previsão de coleta: a partir de 2025)", dadosMunicipio?.OGM0109,"habitantes"], 
        ],
      },
      layout: "headerLineOnly",
    },
    {
      text: "Dados Demográficos",
      bold: true,
      fontSize: 12,
      margin: [0, 10, 15, 0],
    },
    {
      table: {
        headerRows: 1,
        body: [
          [{ text: "Descrição" }, { text: "Valor" }, { text: "Unidade" }],         
          ["População Urbana", dadosMunicipio?.dd_populacao_urbana, ""],
          ["População Rural", dadosMunicipio?.dd_populacao_rural, ""],
          ["População Total", dadosMunicipio?.dd_populacao_total, ""],
          ["Total de Moradias", dadosMunicipio?.dd_total_moradias, ""],
          ["Quantidade de estabelecimentos urbanos existente no município (previsão de coleta: a partir de 2025)", dadosMunicipio?.OGM4001, "Unidades"],
          ["Quantidade de estabelecimentos rurais existente no município (previsão de coleta: a partir de 2025)", dadosMunicipio?.OGM4002, "Unidades"],
          ["Quantidade de estabelecimentos totais existente no município (previsão de coleta: a partir de 2025).", dadosMunicipio?.OGM4003, "Unidades"],
          ["Quantidade de domicílios urbanos existente no município.", dadosMunicipio?.OGM4004, "Domicílios"],
          ["Quantidade de domicílios rurais existente no município.", dadosMunicipio?.OGM4005, "Domicílios"],
          ["Quantidade de domicílios totais existente no município.", dadosMunicipio?.OGM4006, "Domicílios"],
          ["Extensão total de vias públicas urbanas com pavimento.", dadosMunicipio?.OGM4007, "Km"],
          ["Extensão total de vias públicas urbanas sem pavimento.", dadosMunicipio?.OGM4008, "Km"],
          ["Extensão total de vias públicas urbanas (com e sem pavimento).", dadosMunicipio?.OGM4009, "Km"],
        ],
      },
      layout: "headerLineOnly",
    },
  ];

  function Rodape(currentPage: string, pageCount: string) {
    return [
      {
        text: currentPage + "/" + pageCount,
        alignment: "right",
        fontSize: 12,
        margin: [0, 10, 20, 0],
      },
    ];
  }

  const docConfig: any = {
    page: "A4",
    margin: [15, 50, 15, 40],
    header: [reportTitle],
    content: [content],
    footer: Rodape,
  };

  pdfMake.createPdf(docConfig).open();
}
