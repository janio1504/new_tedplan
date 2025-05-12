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
          ["Nome Responsável", dadosMunicipio?.ts_responsavel],
          ["Cargo", dadosMunicipio?.ts_cargo],
          ["Função", dadosMunicipio?.ts_funcao],
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
          [{ text: "<b>Descrição</b>" }, { text: "Valor" }],
          ["Setor Responsável", dadosMunicipio?.rf_setor_responsavel],
          ["Telefone Comercial", dadosMunicipio?.rf_telefone_comercial],
          ["Nome Responsável", dadosMunicipio?.rf_responsavel],
          ["Cargo", dadosMunicipio?.rf_cargo],
          //["Função", dadosMunicipio?.rf_funcao],
         // ["Endereço", dadosMunicipio?.aa_endereco],
          ["Telefone", dadosMunicipio?.rf_telefone],
          ["E-mail", dadosMunicipio?.rf_email],
          //["Nome do Responsável", dadosMunicipio?.aa_responsavel],
        ],
      },
      layout: "headerLineOnly",
    },
    // {
    //   text: "Esgotamento Sanitário",
    //   bold: true,
    //   fontSize: 12,
    //   margin: [0, 10, 15, 0],
    // },
    // {
    //   table: {
    //     headerRows: 1,
    //     body: [
    //       [{ text: "<b>Descrição</b>" }, { text: "Valor" }],
    //       [
    //         "Secretaria ou Setor Responsável",
    //         dadosMunicipio?.es_secretaria_setor_responsavel,
    //       ],
    //       ["Abrangência", dadosMunicipio?.es_abrangencia],
    //       ["Natureza jurídica", dadosMunicipio?.es_natureza_juridica],
    //       ["CNPJ", dadosMunicipio?.es_cnpj],
    //       ["CEP", dadosMunicipio?.es_cep],
    //       ["Endereço", dadosMunicipio?.es_endereco],
    //       ["Numero", dadosMunicipio?.es_numero],
    //       ["Bairro", dadosMunicipio?.es_bairro],
    //       ["Telefone", dadosMunicipio?.es_telefone],
    //       ["E-mail", dadosMunicipio?.es_email],
    //       ["Nome do Responsável", dadosMunicipio?.es_responsavel],
    //     ],
    //   },
    //   layout: "headerLineOnly",
    // },
    // {
    //   text: "Drenagem e Àguas pluviais",
    //   bold: true,
    //   fontSize: 12,
    //   margin: [0, 10, 15, 0],
    // },
    // {
    //   table: {
    //     headerRows: 1,
    //     body: [
    //       [{ text: "<b>Descrição</b>" }, { text: "Valor" }],
    //       [
    //         "Secretaria ou Setor Responsável",
    //         dadosMunicipio?.da_secretaria_setor_responsavel,
    //       ],
    //       ["Abrangência", dadosMunicipio?.da_abrangencia],
    //       ["Natureza jurídica", dadosMunicipio?.da_natureza_juridica],
    //       ["CNPJ", dadosMunicipio?.da_cnpj],
    //       ["CEP", dadosMunicipio?.da_cep],
    //       ["Endereço", dadosMunicipio?.da_endereco],
    //       ["Numero", dadosMunicipio?.da_numero],
    //       ["Bairro", dadosMunicipio?.da_bairro],
    //       ["Telefone", dadosMunicipio?.da_telefone],
    //       ["E-mail", dadosMunicipio?.da_email],
    //       ["Nome do Responsável", dadosMunicipio?.da_responsavel],
    //     ],
    //   },
    //   layout: "headerLineOnly",
    // },
    // {
    //   text: "Resíduos Sólidos",
    //   bold: true,
    //   fontSize: 12,
    //   margin: [0, 10, 15, 0],
    // },
    // {
    //   table: {
    //     headerRows: 1,
    //     body: [
    //       [{ text: "<b>Descrição</b>" }, { text: "Valor" }],
    //       [
    //         "Secretaria ou Setor Responsável",
    //         dadosMunicipio?.rs_secretaria_setor_responsavel,
    //       ],
    //       ["Abrangência", dadosMunicipio?.rs_abrangencia],
    //       ["Natureza jurídica", dadosMunicipio?.rs_natureza_juridica],
    //       ["CNPJ", dadosMunicipio?.rs_cnpj],
    //       ["CEP", dadosMunicipio?.rs_cep],
    //       ["Endereço", dadosMunicipio?.rs_endereco],
    //       ["Numero", dadosMunicipio?.rs_numero],
    //       ["Bairro", dadosMunicipio?.rs_bairro],
    //       ["Telefone", dadosMunicipio?.rs_telefone],
    //       ["E-mail", dadosMunicipio?.rs_email],
    //       ["Nome do Responsável", dadosMunicipio?.rs_responsavel],
    //     ],
    //   },
    //   layout: "headerLineOnly",
    // },
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
