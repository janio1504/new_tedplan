import { table } from "console";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

export function prestacaoServicos(
  dados: any,
  concessionarias: any,
  financeiro: any,
  dadosAgua: any,
  dadosEsgoto: any,
  dadosDrenagem: any,
  dadosResiduosColeta: any,
  residuosUnidadesProcessamento: any,
  residuosRecebidos: any,
) {
  pdfMake.vfs = pdfFonts.vfs;
  console.log(residuosRecebidos);
  
  if (dados?.length == 0) {
    alert("Não existem dados gerais cadastrados para gerar o relatório!");
    return;
  }
  if (concessionarias?.length == 0) {
    alert(
      "Não existem dados de concessionarias cadastrados para gerar o relatório!"
    );
  }
  if (financeiro?.length == 0) {
    alert("Não existem dados financeiros cadastrados para gerar o relatório!");
  }
  if (dadosAgua?.length == 0) {
    alert("Não existem dados de aguas cadastrados para gerar o relatório!");
  }
  if (dadosEsgoto?.length == 0) {
    alert("Não existem dados de esgotos cadastrados para gerar o relatório!");
  }
  if (dadosDrenagem?.length == 0) {
    alert("Não existem dados de drenagem cadastrados para gerar o relatório!");
  }
  if (dadosResiduosColeta?.length == 0) {
    alert("Não existem dados de residuos cadastrados para gerar o relatório!");
  }
  const reportTitle: any = [
    {
      text: "Prestação de Serviços",
      alignment: "center",
      fontSize: 16,
      bold: true,
      margin: [15, 20, 15, 45],
    },
  ];
  const content: any = [
    {
      text: "Informações Gerais",
      bold: true,
      fontSize: 14,
      margin: [0, 10, 15, 0],
    },
    {
      text: "Água e Esgoto Sanitário",
      bold: true,
      fontSize: 14,
      margin: [0, 10, 15, 0],
    },
    {
      table: {
        headerRows: 1,
        body: [
          [
            { text: "Código", fontSize: 12 },
            { text: "Descrição", fontSize: 12 },
            { text: dados?.ano, fontSize: 12 },
          ],
          [
            { text: "GE05A", fontSize: 10 },
            { text: "Quantidade de Municípios atendidos", fontSize: 10 },
            { text: dados?.ge05a, fontSize: 10 },
          ],
          [
            { text: "GE05B", fontSize: 10 },
            { text: "Quantidade de Municípios atendidos", fontSize: 10 },
            { text: dados?.ge05b, fontSize: 10 },
          ],
          [
            { text: "GE008", fontSize: 10 },
            {
              text: "Quantidade de sedes atendidas com abastecimento de água",
              fontSize: 10,
            },
            { text: dados?.ge008ae, fontSize: 10 },
          ],
          [
            { text: "GE009", fontSize: 10 },
            {
              text: "Quantidade de sedes atendidas com esgotamento sanitário	",
              fontSize: 10,
            },
            { text: dados?.ge009, fontSize: 10 },
          ],
          [
            { text: "GE010", fontSize: 10 },
            {
              text: "Quantidade de localidades atendidas com abastecimneto de água",
              fontSize: 10,
            },
            { text: dados?.ge010ae, fontSize: 10 },
          ],
          [
            { text: "GE011", fontSize: 10 },
            {
              text: "Quantidade de localidades atendidas com esgotamento sanitário",
              fontSize: 10,
            },
            { text: dados?.ge011ae, fontSize: 10 },
          ],
          [
            { text: "GE019", fontSize: 10 },
            { text: "Onde atende com abastecimento de água", fontSize: 10 },
            { text: dados?.ge019, fontSize: 10 },
          ],
          [
            { text: "GE020", fontSize: 10 },
            { text: "Onde atende com esgotamento sanitário	", fontSize: 10 },
            { text: dados?.ge020, fontSize: 10 },
          ],
          [
            { text: "AG026", fontSize: 10 },
            {
              text: "População urbana atendida com abastecimento de água",
              fontSize: 10,
            },
            { text: dados?.ag026, fontSize: 10 },
          ],
          [
            { text: "AG001", fontSize: 10 },
            {
              text: "População total atendida com abastecimento de água",
              fontSize: 10,
            },
            { text: dados?.ag001, fontSize: 10 },
          ],
          [
            { text: "ES026", fontSize: 10 },
            {
              text: "População urbana atendida com esgotamento sanitário",
              fontSize: 10,
            },
            { text: dados?.es026, fontSize: 10 },
          ],
          [
            { text: "ES001", fontSize: 10 },
            {
              text: "População total atendida com esgotamento sanitário",
              fontSize: 10,
            },
            { text: dados?.es001, fontSize: 10 },
          ],
          [
            { text: "GD06A", fontSize: 10 },
            {
              text: "População urbana residente no(s) município(s) com abastecimento de água",
              fontSize: 10,
            },
            { text: dados?.gd06a, fontSize: 10 },
          ],
          [
            { text: "GD06B", fontSize: 10 },
            {
              text: "População urbana residente no(s) município(s) com esgotamento sanitário",
              fontSize: 10,
            },
            { text: dados?.gd06b, fontSize: 10 },
          ],
          [
            { text: "GD12A", fontSize: 10 },
            {
              text: "População total residente no(s) município(s) com abastecimento de água (Fonte: IBGE)	",
              fontSize: 10,
            },
            { text: dados?.gd12a, fontSize: 10 },
          ],
          [
            { text: "GD12B", fontSize: 10 },
            {
              text: "População total residente no(s) município(s) com esgotamento sanitário (Fonte: IBGE)	",
              fontSize: 10,
            },
            { text: dados?.gd12b, fontSize: 10 },
          ],
          [
            { text: "FN026", fontSize: 10 },
            { text: "Quantidade de empregados próprios	", fontSize: 10 },
            { text: dados?.fn026, fontSize: 10 },
          ],
          [
            { text: "GE099", fontSize: 10 },
            { text: "Observações", fontSize: 10 },
            { text: dados?.ge099, fontSize: 10 },
          ],
        ],
      },
      layout: "headerLineOnly",
    },
    {
      text: "Drenagem de Águas Pluviais",
      bold: true,
      fontSize: 14,
      margin: [0, 10, 15, 0],
    },
    {
      table: {
        headerRows: 1,
        body: [
          [
            { text: "Código", fontSize: 12 },
            { text: "Descrição", fontSize: 12 },
            { text: dados?.ano, fontSize: 12 },
          ],
          [
            { text: "GE001", fontSize: 10 },
            {
              text: "Área territorial total do município (Fonte IBGE)	",
              fontSize: 10,
            },
            { text: dados?.ge001, fontSize: 10 },
          ],
          [
            { text: "GE002", fontSize: 10 },
            {
              text: "Área urbana total, incluido áreas urbanas isoladas	",
              fontSize: 10,
            },
            { text: dados?.ge002, fontSize: 10 },
          ],
          [
            { text: "GE007", fontSize: 10 },
            {
              text: "Quantidade total de imóveis existentes na área urbana do município",
              fontSize: 10,
            },
            { text: dados?.ge007, fontSize: 10 },
          ],
          [
            { text: "GE008", fontSize: 10 },
            {
              text: "Quantidade total de domicilios urbanos existentes no município",
              fontSize: 10,
            },
            { text: dados?.ge008da, fontSize: 10 },
          ],
          [
            { text: "GE016", fontSize: 10 },
            { text: "Município Crítico (Fonte: CPRM)", fontSize: 10 },
            { text: dados?.ge016, fontSize: 10 },
          ],
          [
            { text: "GE010", fontSize: 10 },
            {
              text: 'Região Hidrográfica em que se encontra o município "(Fonte:ANA)"',
              fontSize: 10,
            },
            { text: dados?.ge010, fontSize: 10 },
          ],
          [
            { text: "GE011", fontSize: 10 },
            {
              text: "Nome da(s) bacia(s) hidrografica(s) a que pertence o município (Fonte: ANA)",
              fontSize: 10,
            },
            { text: dados?.ge011_1 ? "Sim" : "Não", fontSize: 10 },
          ],
          [
            { text: "GE012", fontSize: 10 },
            {
              text: "Existe Comitê de Bacia ou Sob-bacia Hidrográfica organizada?",
              fontSize: 10,
            },
            { text: dados?.ge012, fontSize: 10 },
          ],
          [
            { text: "AD001", fontSize: 10 },
            { text: "Quantidade de pessoal próprio alocado", fontSize: 10 },
            { text: dados?.ad001, fontSize: 10 },
          ],
          [
            { text: "AD002", fontSize: 10 },
            {
              text: "Quantidade de pessoal terceirizado alocado",
              fontSize: 10,
            },
            { text: dados?.ad002, fontSize: 10 },
          ],
          [
            { text: "AD004", fontSize: 10 },
            { text: "Quantidade total de pessoal alocado", fontSize: 10 },
            { text: dados?.ad004, fontSize: 10 },
          ],
          [
            { text: "IE001", fontSize: 10 },
            {
              text: "Existe Plano Diretor de Drenagem e Manejo das Água Pluviais Urbanas?",
              fontSize: 10,
            },
            { text: dados?.ie001, fontSize: 10 },
          ],
          [
            { text: "IE012", fontSize: 10 },
            {
              text: "Existe cadastro técnico de obras lineares?",
              fontSize: 10,
            },
            { text: dados?.ie012, fontSize: 10 },
          ],
          [
            { text: "IE013", fontSize: 10 },
            {
              text: 'Existe projeto básico, executivo ou "as built" de unidades operacionais?	',
              fontSize: 10,
            },
            { text: dados?.ie013, fontSize: 10 },
          ],
          [
            { text: "IE014", fontSize: 10 },
            { text: "Existe obras ou projetos em andamento?", fontSize: 10 },
            { text: dados?.ie014, fontSize: 10 },
          ],
          [
            { text: "IE016", fontSize: 10 },
            {
              text: "Qual o tipo de sistema de Drenagem Urbana?",
              fontSize: 10,
            },
            { text: dados?.ie016, fontSize: 10 },
          ],
          [
            { text: "IE016A", fontSize: 10 },
            {
              text: "Especifique qual é o outro tipo de sistema de drenagem Urbana",
              fontSize: 10,
            },
            { text: dados?.ie016a, fontSize: 10 },
          ],
        ],
      },
      layout: "headerLineOnly",
    },
    {
      table: {
        headerRows: 1,
        body: [
          [
            { text: "Código", fontSize: 12 },
            { text: "Descrição", fontSize: 12 },
          ],
          [
            { text: "OP001", fontSize: 10 },
            {
              text: "Quais da seguintes intervenções ou manutenções foram realizadas?",
              fontSize: 10,
            },
          ],
          [
            { text: "Não houve intervenção ou manutenção", fontSize: 10 },
            { text: dados?.qp001_1 ? "Sim" : "Não", fontSize: 10 },
          ],
          [
            { text: "Manutenção ou recuperação de sarjetas", fontSize: 10 },
            { text: dados?.qp001_2 ? "Sim" : "Não", fontSize: 10 },
          ],
          [
            { text: "Não houve intervenção ou manutenção", fontSize: 10 },
            { text: dados?.qp001_3 ? "Sim" : "Não", fontSize: 10 },
          ],
        ],
      },
      layout: "headerLineOnly",
    },
    {
      table: {
        headerRows: 1,
        body: [
          [
            { text: "OP001A", fontSize: 10 },
            {
              text: "Especifique qual é a outra intervenção ou manutenção",
              fontSize: 10,
            },
            { text: dados?.op001a, fontSize: 10 },
          ],
        ],
      },
      layout: "headerLineOnly",
    },
    {
      table: {
        headerRows: 1,
        body: [
          [
            { text: "Código", fontSize: 12 },
            { text: "<b>Descrição</b>", fontSize: 12 },
          ],
          [
            { text: "RI001", fontSize: 10 },
            {
              text: "Indique quais das seguintes instituições existem",
              fontSize: 10,
            },
          ],
          [
            {
              text: "Não há instituições relacionadas com à gestão de riscos ou respostas a desastres",
              fontSize: 10,
            },
            { text: dados?.ri001_1 ? "Sim" : "Não", fontSize: 10 },
          ],
          [
            { text: "Unidades de corpos de bombeiros", fontSize: 10 },
            { text: dados?.ri001_2 ? "Sim" : "Não", fontSize: 10 },
          ],
          [
            {
              text: "Coordenação Municipal de Defesa Civil (COMDEC)",
              fontSize: 10,
            },
            { text: dados?.ri001_3 ? "Sim" : "Não", fontSize: 10 },
          ],
        ],
      },
      layout: "headerLineOnly",
    },
    {
      table: {
        headerRows: 1,
        body: [
          [
            { text: "RI001A", fontSize: 10 },
            {
              text: "Especifique qual é a outra instituição que atua na prevenção",
              fontSize: 10,
            },
            { text: dados?.ri001a, fontSize: 10 },
          ],
        ],
      },
      layout: "headerLineOnly",
    },
    {
      table: {
        headerRows: 1,
        body: [
          [
            { text: "Código", fontSize: 12 },
            { text: "<b>Descrição</b>", fontSize: 12 },
          ],
          [
            { text: "RI002", fontSize: 10 },
            {
              text: "Quais da intervenções ou situações a seguir existem na área rural a montante das áreas urbanas?",
              fontSize: 10,
            },
          ],
          [
            { text: "Nenhuma intervenção ou situação", fontSize: 10 },
            { text: dados?.ri002_1 ? "Sim" : "Não", fontSize: 10 },
          ],
          [
            { text: "Barragens", fontSize: 10 },
            { text: dados?.ri002_2 ? "Sim" : "Não", fontSize: 10 },
          ],
          [
            { text: "Retificações de cursos de água naturais", fontSize: 10 },
            { text: dados?.ri002_3 ? "Sim" : "Não", fontSize: 10 },
          ],
        ],
      },
      layout: "headerLineOnly",
    },
    {
      table: {
        headerRows: 1,
        body: [
          [
            { text: "RI002A", fontSize: 10 },
            {
              text: "Especifique qual é a outra intervenção com potencial de risco",
              fontSize: 10,
            },
            { text: dados?.ri002a, fontSize: 10 },
          ],
        ],
      },
      layout: "headerLineOnly",
    },
    {
      table: {
        headerRows: 1,
        body: [
          [
            { text: "Código", fontSize: 12 },
            { text: "<b>Descrição</b>", fontSize: 12 },
          ],
          [
            { text: "RI003", fontSize: 10 },
            {
              text: "Instrumento de controle e monitoramento hidrlólicos existentes",
              fontSize: 10,
            },
          ],
          [
            { text: "Nenhum instrumento", fontSize: 10 },
            { text: dados?.ri003_1 ? "Sim" : "Não", fontSize: 10 },
          ],
          [
            { text: "Pluviômetro", fontSize: 10 },
            { text: dados?.ri003_2 ? "Sim" : "Não", fontSize: 10 },
          ],
          [
            { text: "Pluviógrafo", fontSize: 10 },
            { text: dados?.ri003_3 ? "Sim" : "Não", fontSize: 10 },
          ],
        ],
      },
      layout: "headerLineOnly",
    },
    {
      table: {
        headerRows: 1,
        body: [
          [
            { text: "RI003A", fontSize: 10 },
            {
              text: "Especifique qual é o outro instrumento de controle de monitoramento",
              fontSize: 10,
            },
            { text: dados?.ri003a, fontSize: 10 },
          ],
        ],
      },
      layout: "headerLineOnly",
    },
    {
      table: {
        headerRows: 1,
        body: [
          [
            { text: "Código", fontSize: 12 },
            { text: "<b>Descrição</b>", fontSize: 12 },
          ],
          [
            { text: "RI004", fontSize: 10 },
            {
              text: "Dados hidrolólicos monitorados e metodologia de monitoramento",
              fontSize: 10,
            },
          ],
          [
            { text: "Quantidade chuva por registro auto..", fontSize: 10 },
            { text: dados?.ri004_1 ? "Sim" : "Não", fontSize: 10 },
          ],
          [
            { text: "Quantidade chuva por frequência diária", fontSize: 10 },
            { text: dados?.ri004_2 ? "Sim" : "Não", fontSize: 10 },
          ],
          [
            { text: "Quantidade chuva por frequência hora..", fontSize: 10 },
            { text: dados?.ri004_3 ? "Sim" : "Não", fontSize: 10 },
          ],
        ],
      },
      layout: "headerLineOnly",
    },
    {
      table: {
        headerRows: 1,
        body: [
          [
            { text: "RI004A", fontSize: 10 },
            {
              text: "Especifique qual é o outro dado hidrológico monitorado",
              fontSize: 10,
            },
            { text: dados?.ri004a, fontSize: 10 },
          ],
        ],
      },
      layout: "headerLineOnly",
    },
    {
      table: {
        body: [
          [
            { text: "RI005", fontSize: 10 },
            {
              text: "Existem sistemas de alerta de riscos hidrológicos(alagamentos, enxurradas, inundaçoẽs)?",
              fontSize: 10,
            },
            { text: dados?.ri005, fontSize: 10 },
          ],
          [
            { text: "RI007", fontSize: 10 },
            {
              text: "Existe cadastro ou demarcação de marcas históricas de inundações?",
              fontSize: 10,
            },
            { text: dados?.ri007, fontSize: 10 },
          ],
          [
            { text: "RI009", fontSize: 10 },
            {
              text: "Existe mapeamento de áreas de risco de inundações dos cursos de água urbana?",
              fontSize: 10,
            },
            { text: dados?.ri009, fontSize: 10 },
          ],
          [
            { text: "RI010", fontSize: 10 },
            { text: "O mapeamento é parcial ou integral?", fontSize: 10 },
            { text: dados?.ri010, fontSize: 10 },
          ],
          [
            { text: "RI011", fontSize: 10 },
            {
              text: "Qual percentual de área total do município está mapeada?",
              fontSize: 10,
            },
            { text: dados?.ri011, fontSize: 10 },
          ],
          [
            { text: "RI012", fontSize: 10 },
            {
              text: "Tempo de recorrência(ou periodo de retorno) adotado para o mapeamento",
              fontSize: 10,
            },
            { text: dados?.ri012, fontSize: 10 },
          ],
          [
            { text: "RI013", fontSize: 10 },
            {
              text: "Quantidade docmicílios sujeitos a risco de inundação",
              fontSize: 10,
            },
            { text: dados?.ri013, fontSize: 10 },
          ],
          [
            { text: "GE999", fontSize: 10 },
            { text: "Observações, esclarecimentos e sugestões", fontSize: 10 },
            { text: dados?.ge999da, fontSize: 10 },
          ],
        ],
      },
      layout: "headerLineOnly",
    },

    {
      text: "Dados hidrográficos",
      bold: true,
      fontSize: 14,
      margin: [0, 10, 15, 0],
    },
    {
      table: {
        headerRows: 1,
        body: [
          [
            { text: "Código", fontSize: 12 },
            { text: "Descrição", fontSize: 12 },
            { text: dados?.ano, fontSize: 12 },
          ],
          [
            { text: "GE201", fontSize: 10 },
            {
              text: "O oŕgão(Prestador) é também o prestador - direto ou indireto - de outros serviços de Saneamento?",
              fontSize: 10,
            },
            { text: dados?.ge201, fontSize: 10 },
          ],
          [
            { text: "GE202", fontSize: 10 },
            {
              text: "Há empresa com contrato de DELEGAÇÂO (conceção ou contrato de programa) para algum ou todos os serviços de limpeza urbana?",
              fontSize: 10,
            },
            { text: dados?.ge202, fontSize: 10 },
          ],
        ],
      },
      layout: "headerLineOnly",
    },
    {
      table: {
        headerRows: 1,
        body: [
          [{ text: "Dados das CONCESSIONARIAS", fontSize: 12, bold: true }],
          [
            concessionarias?.map(
              (value: {
                razao_social: string;
                cnpj: string;
                ano_inicio: string;
                duracao: string;
                vigente: string;
                capina_e_rocada: string;
                coleta_res_construcao_civil: string;
                coleta_res_domiciliar: string;
                coleta_res_servicos_saude: string;
                coleta_res_publico: string;
                operacao_aterro_sanitario: string;
                operacao_incinerador: string;
                operacao_outras_unidades_processamento: string;
                operacao_unidade_compostagem: string;
                operacao_triagem: string;
                outros: string;
                tipo_desconhecido: string;
                varricao_logradouros_publicos: string;
              }) => [
                [
                  {
                    text: "Razão Social Concessionária: " + value?.razao_social,
                    fontSize: 10,
                  },
                ],
                [{ text: "CNPJ: " + value?.cnpj, fontSize: 10 }],
                [{ text: "Ano de inicio: " + value?.ano_inicio, fontSize: 10 }],
                [{ text: "Duração(em anos): " + value?.duracao, fontSize: 10 }],
                [{ text: "Vigente?: " + value?.vigente, fontSize: 10 }],
                [
                  {
                    text: "Capina e roçada: " + value?.capina_e_rocada,
                    fontSize: 10,
                  },
                ],
                [
                  {
                    text:
                      "Coleta de res. contrucão civil: " +
                      value?.coleta_res_construcao_civil,
                    fontSize: 10,
                  },
                ],
                [
                  {
                    text:
                      "Coleta de res. Domiciliar: " +
                      value?.coleta_res_domiciliar,
                    fontSize: 10,
                  },
                ],
                [
                  {
                    text:
                      "Coleta de res. dos Serviços da Saúde:" +
                      value?.coleta_res_servicos_saude,
                    fontSize: 10,
                  },
                ],
                [
                  {
                    text: "Coleta de res. Público:" + value?.coleta_res_publico,
                    fontSize: 10,
                  },
                ],
                [
                  {
                    text:
                      "Operação de aterro sanitário:" +
                      value?.operacao_aterro_sanitario,
                    fontSize: 10,
                  },
                ],
                [
                  {
                    text:
                      "Operação de incinerador:" + value?.operacao_incinerador,
                    fontSize: 10,
                  },
                ],
                [
                  {
                    text:
                      "Operação de outras unidades de processamento:" +
                      value?.operacao_outras_unidades_processamento,
                    fontSize: 10,
                  },
                ],
                [
                  {
                    text:
                      "Operação de unidade de compostagem:" +
                      value?.operacao_unidade_compostagem,
                    fontSize: 10,
                  },
                ],
                [
                  {
                    text: "Operação de triagem:" + value?.operacao_triagem,
                    fontSize: 10,
                  },
                ],
                [{ text: "Outros:" + value?.outros, fontSize: 10 }],
                [
                  {
                    text: "Tipo desconhecido:" + value?.tipo_desconhecido,
                    fontSize: 10,
                  },
                ],
                [
                  {
                    text:
                      "Varrição de logradouros públicos:" +
                      value?.varricao_logradouros_publicos,
                    fontSize: 10,
                  },
                ],
                [
                  {
                    text: "-----------------------------------------------------------------------------------------------------------",
                    fontSize: 10,
                  },
                ],
              ]
            ),
          ],
        ],
      },
      layout: "headerLineOnly",
    },

    {
      table: {
        headerRows: 1,
        body: [
          [
            { text: "Código", fontSize: 12 },
            { text: "Descrição", fontSize: 12 },
            { text: dados?.ano, fontSize: 12 },
          ],
          [
            { text: "CO164", fontSize: 10 },
            { text: "População total atendida no município", fontSize: 10 },
            { text: dados?.co164, fontSize: 10 },
          ],
          [
            { text: "CO050", fontSize: 10 },
            {
              text: "População urbana atendida no município, abrangendo sede e localidades",
              fontSize: 10,
            },
            { text: dados?.co050, fontSize: 10 },
          ],
          [
            { text: "CO165", fontSize: 10 },
            {
              text: "População urbana atendida pelo serviço de coleta domiciliar direta, ou seja, porta a porta",
              fontSize: 10,
            },
            { text: dados?.co165, fontSize: 10 },
          ],
          [
            { text: "CO147", fontSize: 10 },
            {
              text: "População rural atendida com serviço de coleta domiciliar",
              fontSize: 10,
            },
            { text: dados?.co147, fontSize: 10 },
          ],
          [
            { text: "CO134", fontSize: 10 },
            {
              text: "Percentual da população atendida com frequência diária",
              fontSize: 10,
            },
            { text: dados?.co134, fontSize: 10 },
          ],
          [
            { text: "CO135", fontSize: 10 },
            {
              text: "Percentual da população atendida com frequência de 2 a 3 vezes por semana",
              fontSize: 10,
            },
            { text: dados?.co135, fontSize: 10 },
          ],
          [
            { text: "CO136", fontSize: 10 },
            {
              text: "Percentual da população atendida com frequência de 1 veze por semana",
              fontSize: 10,
            },
            { text: dados?.co136, fontSize: 10 },
          ],
          [
            { text: "CS050", fontSize: 10 },
            {
              text: "Percentual da população atendida com a COLETA SELETIVA de porta a porta",
              fontSize: 10,
            },
            { text: dados?.cs050, fontSize: 10 },
          ],
          [
            { text: "CO162", fontSize: 10 },
            {
              text: "Valor contratual (Preço unitario) do serviço de aterramento de RDO e RDU",
              fontSize: 10,
            },
            { text: dados?.co162, fontSize: 10 },
          ],
          [
            { text: "CO178", fontSize: 10 },
            {
              text: "Percentual da população atendida com a COLETA SELETIVA de porta a porta",
              fontSize: 10,
            },
            { text: dados?.co178, fontSize: 10 },
          ],
          [
            { text: "GE999", fontSize: 10 },
            { text: "Observações, esclarecimentos e sugestões", fontSize: 10 },
            { text: dados?.ge999dh, fontSize: 10 },
          ],
        ],
      },
      layout: "headerLineOnly",
    },

    {
      text: "Informações Financeiras",
      bold: true,
      fontSize: 14,
      margin: [0, 10, 15, 0],
    },
    {
      text: "Água e Esgoto Sanitário",
      bold: true,
      fontSize: 14,
      margin: [0, 10, 15, 0],
    },
    {
      table: {
        headerRows: 1,
        body: [
          [
            { text: "Código", fontSize: 12 },
            { text: "Descrição", fontSize: 12 },
            { text: dados?.ano, fontSize: 12 },
          ],
          [
            { text: "FN002", fontSize: 10 },
            { text: "Receita operacional direta de Água", fontSize: 10 },
            { text: financeiro?.fn002, fontSize: 10 },
          ],
          [
            { text: "FN003", fontSize: 10 },
            { text: "Receita operacional direta de Esgoto", fontSize: 10 },
            { text: financeiro?.fn003, fontSize: 10 },
          ],
          [
            { text: "FN007", fontSize: 10 },
            {
              text: "Receita operacional direta de Água exportada (Bruta ou Tratada)",
              fontSize: 10,
            },
            { text: financeiro?.fn007, fontSize: 10 },
          ],
          [
            { text: "FN038", fontSize: 10 },
            {
              text: "Receita operacional direta - Esgoto bruto importado",
              fontSize: 10,
            },
            { text: financeiro?.fn038, fontSize: 10 },
          ],
          [
            { text: "FN001", fontSize: 10 },
            { text: "Receita operacional direta de Total", fontSize: 10 },
            { text: financeiro?.fn001, fontSize: 10 },
          ],
          [
            { text: "FN004", fontSize: 10 },
            { text: "Receita operacional indireta", fontSize: 10 },
            { text: financeiro?.fn004, fontSize: 10 },
          ],
          [
            { text: "FN005", fontSize: 10 },
            {
              text: "Receita operacional Total (Direta + Indireta)",
              fontSize: 10,
            },
            { text: financeiro?.fn005, fontSize: 10 },
          ],
          [
            { text: "FN006", fontSize: 10 },
            { text: "Arrecadação total operacional indireta", fontSize: 10 },
            { text: financeiro?.fn006, fontSize: 10 },
          ],
          [
            { text: "FN008", fontSize: 10 },
            { text: "Créditos de contas a receber", fontSize: 10 },
            { text: financeiro?.fn008, fontSize: 10 },
          ],
          [
            { text: "FN010", fontSize: 10 },
            { text: "Despesa com pessoal próprio", fontSize: 10 },
            { text: financeiro?.fn010, fontSize: 10 },
          ],
          [
            { text: "FN011", fontSize: 10 },
            { text: "Despesa com produtos químicos", fontSize: 10 },
            { text: financeiro?.fn011, fontSize: 10 },
          ],
          [
            { text: "FN013", fontSize: 10 },
            { text: "Despesa com energia elétrica", fontSize: 10 },
            { text: financeiro?.aes_fn013, fontSize: 10 },
          ],
          [
            { text: "FN014", fontSize: 10 },
            { text: "Despesa com serviços de terceiros", fontSize: 10 },
            { text: financeiro?.fn014, fontSize: 10 },
          ],
          [
            { text: "FN020", fontSize: 10 },
            {
              text: "Despesa com água importada (Bruta ou tratada)",
              fontSize: 10,
            },
            { text: financeiro?.aes_fn020, fontSize: 10 },
          ],
          [
            { text: "FN039", fontSize: 10 },
            { text: "Despesa com esgoto exportado", fontSize: 10 },
            { text: financeiro?.fn039, fontSize: 10 },
          ],
          [
            { text: "FN021", fontSize: 10 },
            {
              text: "Despesas fiscais ou tributarias computadas na dex",
              fontSize: 10,
            },
            { text: financeiro?.aes_fn021, fontSize: 10 },
          ],
          [
            { text: "FN027", fontSize: 10 },
            { text: "Outras despesas de exploração", fontSize: 10 },
            { text: financeiro?.fn027, fontSize: 10 },
          ],
          [
            { text: "FN015", fontSize: 10 },
            { text: "Despesas de exploração (DEX)", fontSize: 10 },
            { text: financeiro?.aes_fn015, fontSize: 10 },
          ],
          [
            { text: "FN035", fontSize: 10 },
            {
              text: "Despesas com juros e encargos do serviço da divida",
              fontSize: 10,
            },
            { text: financeiro?.fn035, fontSize: 10 },
          ],
          [
            { text: "FN036", fontSize: 10 },
            {
              text: "Despesas com variações monetárias e cambiais das dividas",
              fontSize: 10,
            },
            { text: financeiro?.fn036, fontSize: 10 },
          ],
          [
            { text: "FN016", fontSize: 10 },
            {
              text: "Despesas com juros e encargos do serviço da divida",
              fontSize: 10,
            },
            { text: financeiro?.fn016, fontSize: 10 },
          ],
          [
            { text: "FN019", fontSize: 10 },
            {
              text: "Despesas com depreciação, amortização do ativo deferido",
              fontSize: 10,
            },
            { text: financeiro?.aes_fn019, fontSize: 10 },
          ],
          [
            { text: "FN022", fontSize: 10 },
            {
              text: "Despesas fiscais ou tributarias não computadas na dex",
              fontSize: 10,
            },
            { text: financeiro?.aes_fn022, fontSize: 10 },
          ],
          [
            { text: "FN028", fontSize: 10 },
            { text: "Outras depesas com os servicos", fontSize: 10 },
            { text: financeiro?.fn028, fontSize: 10 },
          ],
          [
            { text: "FN017", fontSize: 10 },
            { text: "Despesas totais com os serviços (DTS)", fontSize: 10 },
            { text: financeiro?.aes_fn017, fontSize: 10 },
          ],
          [
            { text: "FN034", fontSize: 10 },
            {
              text: "Despesa com amortização do serviço da dívida",
              fontSize: 10,
            },
            { text: financeiro?.fn034, fontSize: 10 },
          ],
          [
            { text: "FN037", fontSize: 10 },
            { text: "Despesas totais com o serviço da dívida", fontSize: 10 },
            { text: financeiro?.fn037, fontSize: 10 },
          ],
          [
            { text: "FN018", fontSize: 10 },
            {
              text: "Despesas capitalizáveis realizadas pelo prestador de serviços",
              fontSize: 10,
            },
            { text: financeiro?.fn018, fontSize: 10 },
          ],
          [
            { text: "FN023", fontSize: 10 },
            {
              text: "Investimentos realizados em abastecimento de água pelo prestador de serviços",
              fontSize: 10,
            },
            { text: financeiro?.fn023, fontSize: 10 },
          ],
          [
            { text: "FN024", fontSize: 10 },
            {
              text: "Despesa com água importada (Bruta ou Tratada)",
              fontSize: 10,
            },
            { text: financeiro?.fn024, fontSize: 10 },
          ],
          [
            { text: "FN025", fontSize: 10 },
            {
              text: "Outros investimentos realizados pelo prestador de serviços",
              fontSize: 10,
            },
            { text: financeiro?.fn025, fontSize: 10 },
          ],
          [
            { text: "FN030", fontSize: 10 },
            {
              text: "Investimento com recursos próprios realizado pelo prestador de serviços",
              fontSize: 10,
            },
            { text: financeiro?.fn030, fontSize: 10 },
          ],
          [
            { text: "FN031", fontSize: 10 },
            {
              text: "Investimento com recursos onerosos realizado pelo prestador de serviços",
              fontSize: 10,
            },
            { text: financeiro?.fn031, fontSize: 10 },
          ],
          [
            { text: "FN032", fontSize: 10 },
            {
              text: "Investimento com recursos não onerosos realizado pelo prestador de serviços",
              fontSize: 10,
            },
            { text: financeiro?.fn032, fontSize: 10 },
          ],
          [
            { text: "FN033", fontSize: 10 },
            {
              text: "Investimentos totais realizados pelo prestador de serviços",
              fontSize: 10,
            },
            { text: financeiro?.fn033, fontSize: 10 },
          ],
          [
            { text: "FN041", fontSize: 10 },
            {
              text: "Despesas capitalizáveis realizadas pelo munícipio",
              fontSize: 10,
            },
            { text: financeiro?.fn041, fontSize: 10 },
          ],
          [
            { text: "FN042", fontSize: 10 },
            {
              text: "Investimentos realizados em abastecimento de água pelo munícipio",
              fontSize: 10,
            },
            { text: financeiro?.fn042, fontSize: 10 },
          ],
          [
            { text: "FN043", fontSize: 10 },
            {
              text: "Investimentos realizados em esgotamento sanitário pelo munícipio",
              fontSize: 10,
            },
            { text: financeiro?.fn043, fontSize: 10 },
          ],
          [
            { text: "FN044", fontSize: 10 },
            {
              text: "Outros investimentos realizados pelo munícipio",
              fontSize: 10,
            },
            { text: financeiro?.fn044, fontSize: 10 },
          ],
          [
            { text: "FN045", fontSize: 10 },
            {
              text: "Investimento com recursos próprios realizado pelo munícipio",
              fontSize: 10,
            },
            { text: financeiro?.fn045, fontSize: 10 },
          ],
          [
            { text: "FN046", fontSize: 10 },
            {
              text: "Investimento com recursos onerosos realizado pelo munícipio",
              fontSize: 10,
            },
            { text: financeiro?.fn046, fontSize: 10 },
          ],
          [
            { text: "FN047", fontSize: 10 },
            {
              text: "Investimento com recursos não onerosos realizado pelo munícipio",
              fontSize: 10,
            },
            { text: financeiro?.fn047, fontSize: 10 },
          ],
          [
            { text: "FN048", fontSize: 10 },
            {
              text: "Investimentos totais realizados pelo munícipio",
              fontSize: 10,
            },
            { text: financeiro?.fn048, fontSize: 10 },
          ],
          [
            { text: "FN051", fontSize: 10 },
            {
              text: "Despesas capitalizáveis realizadas pelo estado",
              fontSize: 10,
            },
            { text: financeiro?.fn051, fontSize: 10 },
          ],
          [
            { text: "FN052", fontSize: 10 },
            {
              text: "Investimentos realizados em abastecimento de água pelo estado",
              fontSize: 10,
            },
            { text: financeiro?.fn052, fontSize: 10 },
          ],
          [
            { text: "FN053", fontSize: 10 },
            {
              text: "Investimentos realizados em esgotamento sanitário pelo estado",
              fontSize: 10,
            },
            { text: financeiro?.fn053, fontSize: 10 },
          ],
          [
            { text: "FN054", fontSize: 10 },
            {
              text: "Outros investimentos realizados pelo estado",
              fontSize: 10,
            },
            { text: financeiro?.fn054, fontSize: 10 },
          ],
          [
            { text: "FN055", fontSize: 10 },
            {
              text: "Investimento com recursos próprios realizado pelo estado",
              fontSize: 10,
            },
            { text: financeiro?.fn055, fontSize: 10 },
          ],
          [
            { text: "FN056", fontSize: 10 },
            {
              text: "Investimento com recursos onerosos realizado pelo estado",
              fontSize: 10,
            },
            { text: financeiro?.fn056, fontSize: 10 },
          ],
          [
            { text: "FN057", fontSize: 10 },
            {
              text: "Investimento com recursos não onerosos realizado pelo estado",
              fontSize: 10,
            },
            { text: financeiro?.fn057, fontSize: 10 },
          ],
          [
            { text: "FN058", fontSize: 10 },
            {
              text: "Investimentos totais realizados pelo estado",
              fontSize: 10,
            },
            { text: financeiro?.fn048, fontSize: 10 },
          ],
          [
            { text: "FN098", fontSize: 10 },
            { text: "Campo de justificativa", fontSize: 10 },
            { text: financeiro?.fn098, fontSize: 10 },
          ],
          [
            { text: "FN099", fontSize: 10 },
            { text: "Observações", fontSize: 10 },
            { text: financeiro?.fn099, fontSize: 10 },
          ],
        ],
      },
      layout: "headerLineOnly",
    },

    {
      text: "Drenagem e Águas Pluviais",
      bold: true,
      fontSize: 14,
      margin: [0, 10, 15, 0],
    },
    {
      table: {
        headerRows: 1,
        body: [
          [
            { text: "Código", fontSize: 12 },
            { text: "Descrição", fontSize: 12 },
            { text: dados?.ano, fontSize: 12 },
          ],
          [
            { text: "CB001", fontSize: 10 },
            {
              text: "Existe alguma forma de cobrança pelos serviços de drenagem e manejo das APU",
              fontSize: 10,
            },
            { text: financeiro?.cb001, fontSize: 10 },
          ],
          [
            { text: "CB002", fontSize: 10 },
            { text: "Qual é a forma de cobrança adotada?", fontSize: 10 },
            { text: financeiro?.cb002, fontSize: 10 },
          ],
          [
            { text: "CB002A", fontSize: 10 },
            {
              text: "Especifique qual é a forma de cobrança adotada",
              fontSize: 10,
            },
            { text: financeiro?.cb002a, fontSize: 10 },
          ],
          [
            { text: "CB003", fontSize: 10 },
            {
              text: "Quantidade total de imóveis urbanos tributados pelos serviços de drenagem das APU",
              fontSize: 10,
            },
            { text: financeiro?.cb003, fontSize: 10 },
          ],
          [
            { text: "CB004", fontSize: 10 },
            {
              text: "Valor cobrado pelos serviços de Drenagem e Manejo das APU por ímovel urbano",
              fontSize: 10,
            },
            { text: financeiro?.cb004, fontSize: 10 },
          ],
          [
            { text: "CB999", fontSize: 10 },
            { text: "Observações, esclarecimentos ou sugestões", fontSize: 10 },
            { text: financeiro?.cb999, fontSize: 10 },
          ],
          [
            { text: "FN003", fontSize: 10 },
            {
              text: "Receita total (Saúde, Educação, Pagamento de pessoal, etc...)",
              fontSize: 10,
            },
            { text: financeiro?.fn003, fontSize: 10 },
          ],
          [
            { text: "FN004", fontSize: 10 },
            {
              text: "Fontes de recursos para custeio dos serviços de drenagem e manejo de APU",
              fontSize: 10,
            },
            { text: financeiro?.fn004, fontSize: 10 },
          ],
          [
            { text: "FN004A", fontSize: 10 },
            {
              text: "Especifique qual é a outra fonte de recursos para custeio dos serviços",
              fontSize: 10,
            },
            { text: financeiro?.fn004a, fontSize: 10 },
          ],
          [
            { text: "FN005", fontSize: 10 },
            {
              text: "Receita operacional total dos serviços de drenagem e manejo de APU",
              fontSize: 10,
            },
            { text: financeiro?.fn005, fontSize: 10 },
          ],
          [
            { text: "FN008", fontSize: 10 },
            {
              text: "Receita não operacional total dos serviços de drenagem e manejo de APU",
              fontSize: 10,
            },
            { text: financeiro?.fn008, fontSize: 10 },
          ],
          [
            { text: "FN009", fontSize: 10 },
            {
              text: "Receita total serviços de drenagem e manejo de APU",
              fontSize: 10,
            },
            { text: financeiro?.fn009, fontSize: 10 },
          ],
          [
            { text: "FN012", fontSize: 10 },
            {
              text: "Despesa total do município (Saúde, Educação, pagamento de pessoal, etc...)",
              fontSize: 10,
            },
            { text: financeiro?.fn012, fontSize: 10 },
          ],
          [
            { text: "FN013", fontSize: 10 },
            {
              text: "Despesas de Exploração(DEX) diretas ou de custeio total dos serviços de Drenagem e Manejo de APU",
              fontSize: 10,
            },
            { text: financeiro?.fn013, fontSize: 10 },
          ],
          [
            { text: "FN015", fontSize: 10 },
            {
              text: "Despesa total com serviço da dívida para os serviços de drenagem e Manejo de APU",
              fontSize: 10,
            },
            { text: financeiro?.fn015, fontSize: 10 },
          ],
          [
            { text: "FN016", fontSize: 10 },
            {
              text: "Despesa total com serviços de Drenagem e Manejo de APU",
              fontSize: 10,
            },
            { text: financeiro?.fn016, fontSize: 10 },
          ],
          [
            { text: "FN024", fontSize: 10 },
            {
              text: "Investimento com recursos próprios em Drenagem e Manejo das APU contratados pelo município no ano de referência",
              fontSize: 10,
            },
            { text: financeiro?.fn024, fontSize: 10 },
          ],
          [
            { text: "FN018", fontSize: 10 },
            {
              text: "Investimento com recursos onerosos em Drenagem e Manejo das APU contratados pelo município no ano de referência",
              fontSize: 10,
            },
            { text: financeiro?.fn018, fontSize: 10 },
          ],
          [
            { text: "FN020", fontSize: 10 },
            {
              text: "Investimento com recursos não onerosos em Drenagem e Manejo das APU contratados pelo município no ano de referência",
              fontSize: 10,
            },
            { text: financeiro?.fn020, fontSize: 10 },
          ],
          [
            { text: "FN022", fontSize: 10 },
            {
              text: "Investimento total em Drenagem das APU contratado pelo município no ano de referência",
              fontSize: 10,
            },
            { text: financeiro?.fn022, fontSize: 10 },
          ],
          [
            { text: "FN017", fontSize: 10 },
            {
              text: "Desembolsos de investimentos com recursos próprios em Drenagem e Manejo das APU realizados pelo Município no ano de referência",
              fontSize: 10,
            },
            { text: financeiro?.fn017, fontSize: 10 },
          ],
          [
            { text: "FN019", fontSize: 10 },
            {
              text: "Desembolsos de investimentos com recursos onerosos em Drenagem e Manejo das APU realizados pelo Município no ano de referência",
              fontSize: 10,
            },
            { text: financeiro?.fn019, fontSize: 10 },
          ],
          [
            { text: "FN021", fontSize: 10 },
            {
              text: "Desembolsos de investimentos com recursos não onerosos em Drenagem e Manejo das APU realizados pelo Município no ano de referência",
              fontSize: 10,
            },
            { text: financeiro?.fn021, fontSize: 10 },
          ],
          [
            { text: "FN023", fontSize: 10 },
            {
              text: "Desembolsos total de investimentos em Drenagem e Manejo das APU realizados pelo Município no ano de referência",
              fontSize: 10,
            },
            { text: financeiro?.fn023, fontSize: 10 },
          ],
          [
            { text: "FN999", fontSize: 10 },
            { text: "Observações, esclarecimentos ou sugestões", fontSize: 10 },
            { text: financeiro?.drenagem_fn999, fontSize: 10 },
          ],
        ],
      },
      layout: "headerLineOnly",
    },

    {
      text: "Resíduos Sólidos",
      bold: true,
      fontSize: 14,
      margin: [0, 10, 15, 0],
    },
    {
      table: {
        headerRows: 1,
        body: [
          [
            { text: "Código", fontSize: 12 },
            { text: "Descrição", fontSize: 12 },
            { text: dados?.ano, fontSize: 12 },
          ],
          [
            { text: "FN201", fontSize: 10 },
            {
              text: "A prefeitura (prestadora) cobra pelos serviços de coleta regular, transporte e destinação final de RSU?",
              fontSize: 10,
            },
            { text: financeiro?.fn201, fontSize: 10 },
          ],
          [
            { text: "FN202", fontSize: 10 },
            { text: "Principal forma adotada", fontSize: 10 },
            { text: financeiro?.fn202, fontSize: 10 },
          ],
          [
            { text: "FN203", fontSize: 10 },
            { text: "Descrição da outra forma adotada", fontSize: 10 },
            { text: financeiro?.fn203, fontSize: 10 },
          ],
          [
            { text: "FN204", fontSize: 10 },
            {
              text: "Unidade adotada para a cobrança (No caso de tarifa)",
              fontSize: 10,
            },
            { text: financeiro?.fn204, fontSize: 10 },
          ],
          [
            { text: "FN205", fontSize: 10 },
            {
              text: "A prefeitura cobra pela prestação de serviços especiais ou eventuais de manejo de RSU?",
              fontSize: 10,
            },
            { text: financeiro?.fn205, fontSize: 10 },
          ],
          [
            { text: "FN206", fontSize: 10 },
            {
              text: "Despesa dos agentes públicos com o serviço de coleta de RDO e RPU",
              fontSize: 10,
            },
            { text: financeiro?.fn201, fontSize: 10 },
          ],
          [
            { text: "FN207", fontSize: 10 },
            {
              text: "Despesa com agentes privados para execução do serviço de coleta de RDO e RPU",
              fontSize: 10,
            },
            { text: financeiro?.fn207, fontSize: 10 },
          ],
          [
            { text: "FN208", fontSize: 10 },
            {
              text: "Despesa com o serviço de coleta de RDO e RPU",
              fontSize: 10,
            },
            { text: financeiro?.fn208, fontSize: 10 },
          ],
          [
            { text: "FN209", fontSize: 10 },
            {
              text: "Despesa com agentes públicos com a coleta RSS",
              fontSize: 10,
            },
            { text: financeiro?.fn209, fontSize: 10 },
          ],
          [
            { text: "FN210", fontSize: 10 },
            {
              text: "Despesa com empresas contratadas para coleta RSS",
              fontSize: 10,
            },
            { text: financeiro?.fn210, fontSize: 10 },
          ],
          [
            { text: "FN211", fontSize: 10 },
            { text: "Despesa total com a coleta RSS", fontSize: 10 },
            { text: financeiro?.fn211, fontSize: 10 },
          ],
          [
            { text: "FN212", fontSize: 10 },
            {
              text: "Despesa dos agentes públicos com o serviço de varrição",
              fontSize: 10,
            },
            { text: financeiro?.fn212, fontSize: 10 },
          ],
          [
            { text: "FN213", fontSize: 10 },
            {
              text: "Despesa com empresas contratadas para o serviço de varrição",
              fontSize: 10,
            },
            { text: financeiro?.fn213, fontSize: 10 },
          ],
          [
            { text: "FN214", fontSize: 10 },
            { text: "Despesa total com serviço de varrição", fontSize: 10 },
            { text: financeiro?.fn214, fontSize: 10 },
          ],
          [
            { text: "FN215", fontSize: 10 },
            {
              text: "Despesas com agentes públicos executores dos demais serviços quando não especificado sem campo próprio",
              fontSize: 10,
            },
            { text: financeiro?.fn215, fontSize: 10 },
          ],
          [
            { text: "FN216", fontSize: 10 },
            {
              text: "Despesas com agentes privados executores dos demais serviços quando não especificado sem campo próprio",
              fontSize: 10,
            },
            { text: financeiro?.fn216, fontSize: 10 },
          ],
          [
            { text: "FN217", fontSize: 10 },
            {
              text: "Despesas total com todos os agentes executores dos demais serviços quando não especificado sem campo próprio",
              fontSize: 10,
            },
            { text: financeiro?.fn217, fontSize: 10 },
          ],
          [
            { text: "FN218", fontSize: 10 },
            {
              text: "Despesa dos agentes públicos executores de serviços de manejo de RSU",
              fontSize: 10,
            },
            { text: financeiro?.fn218, fontSize: 10 },
          ],
          [
            { text: "FN219", fontSize: 10 },
            {
              text: "Despesa dos agentes privados executores de serviços de manejo de RSU",
              fontSize: 10,
            },
            { text: financeiro?.fn219, fontSize: 10 },
          ],
          [
            { text: "FN220", fontSize: 10 },
            {
              text: "Despesa total com os serviços de manejo de RSU",
              fontSize: 10,
            },
            { text: financeiro?.fn220, fontSize: 10 },
          ],
          [
            { text: "FN223", fontSize: 10 },
            {
              text: "Despesa corrente da prefeitura durante o ano com todos os serviços do município (Saúde, educação, pagamento de pessoal, etc...)",
              fontSize: 10,
            },
            { text: financeiro?.fn223, fontSize: 10 },
          ],
          [
            { text: "FN221", fontSize: 10 },
            {
              text: "Receita orçada com a cobrança de taxas e tarifas referentes á getão e manejo de RSU",
              fontSize: 10,
            },
            { text: financeiro?.fn221, fontSize: 10 },
          ],
          [
            { text: "FN222", fontSize: 10 },
            {
              text: "Receita arrecadada com taxas e tarifas referentes á gestão e manejo de RSU",
              fontSize: 10,
            },
            { text: financeiro?.fn222, fontSize: 10 },
          ],
          [
            { text: "FN224", fontSize: 10 },
            {
              text: "A prefeitura recebeu algum recurso federal para aplicação no setor de manejo de RSU?",
              fontSize: 10,
            },
            { text: financeiro?.fn224, fontSize: 10 },
          ],
          [
            { text: "FN225", fontSize: 10 },
            { text: "Valor repassado", fontSize: 10 },
            { text: financeiro?.fn225, fontSize: 10 },
          ],
          [
            { text: "FN226", fontSize: 10 },
            { text: "Tipo de recurso", fontSize: 10 },
            { text: financeiro?.fn226, fontSize: 10 },
          ],
          [
            { text: "FN227", fontSize: 10 },
            { text: "Em que foi aplicado o recurso?", fontSize: 10 },
            { text: financeiro?.fn227, fontSize: 10 },
          ],
          [
            { text: "FN999", fontSize: 10 },
            { text: "Observações, esclarecimentos ou sugestões", fontSize: 10 },
            { text: financeiro?.residuos_fn999, fontSize: 10 },
          ],
        ],
      },
      layout: "headerLineOnly",
    },

    { text: "Água", bold: true, fontSize: 14, margin: [0, 10, 15, 0] },
    {
      table: {
        headerRows: 1,
        body: [
          [
            { text: "Código", fontSize: 12 },
            { text: "Descrição", fontSize: 12 },
            { text: dados?.ano, fontSize: 12 },
          ],
          [
            { text: "AG021", fontSize: 10 },
            { text: "Quantidade de ligações totais de água", fontSize: 10 },
            { text: dadosAgua?.ag021, fontSize: 10 },
          ],
          [
            { text: "AG002", fontSize: 10 },
            { text: "Quantidade de ligações ativas de água", fontSize: 10 },
            { text: dadosAgua?.ag002, fontSize: 10 },
          ],
          [
            { text: "AG004", fontSize: 10 },
            {
              text: "Quantidade de ligações ativas de água micromedidas",
              fontSize: 10,
            },
            { text: dadosAgua?.ag004, fontSize: 10 },
          ],
          [
            { text: "AG003", fontSize: 10 },
            { text: "Quantidade de economias ativas de água", fontSize: 10 },
            { text: dadosAgua?.ag003, fontSize: 10 },
          ],
          [
            { text: "AG014", fontSize: 10 },
            {
              text: "Quantidade de economias ativas de água micromedidas",
              fontSize: 10,
            },
            { text: dadosAgua?.ag014, fontSize: 10 },
          ],
          [
            { text: "AG013", fontSize: 10 },
            {
              text: "Quantidade de economias residenciais ativas de água",
              fontSize: 10,
            },
            { text: dadosAgua?.ag013, fontSize: 10 },
          ],
          [
            { text: "AG022", fontSize: 10 },
            {
              text: "Quantidade de economias residenciais ativas de água micromedidas",
              fontSize: 10,
            },
            { text: dadosAgua?.ag022, fontSize: 10 },
          ],
          [
            { text: "AG006", fontSize: 10 },
            { text: "Volume de água produzido", fontSize: 10 },
            { text: dadosAgua?.ag006, fontSize: 10 },
          ],
          [
            { text: "AG024", fontSize: 10 },
            { text: "Volume de água de serviço", fontSize: 10 },
            { text: dadosAgua?.ag024, fontSize: 10 },
          ],
          [
            { text: "AG016", fontSize: 10 },
            { text: "Volume de água bruta importado", fontSize: 10 },
            { text: dadosAgua?.ag016, fontSize: 10 },
          ],
          [
            { text: "AG018", fontSize: 10 },
            { text: "Volume de água tratada importado", fontSize: 10 },
            { text: dadosAgua?.ag018, fontSize: 10 },
          ],
          [
            { text: "AG017", fontSize: 10 },
            { text: "Volume de água bruta exportado", fontSize: 10 },
            { text: dadosAgua?.ag017, fontSize: 10 },
          ],
          [
            { text: "AG019", fontSize: 10 },
            { text: "Volume de água tratada exportado", fontSize: 10 },
            { text: dadosAgua?.ag019, fontSize: 10 },
          ],
          [
            { text: "AG007", fontSize: 10 },
            { text: "Volume de água tratada em ETA(s)", fontSize: 10 },
            { text: dadosAgua?.ag007, fontSize: 10 },
          ],
          [
            { text: "AG015", fontSize: 10 },
            {
              text: "Volume de água de água tratada por simples desinfecção",
              fontSize: 10,
            },
            { text: dadosAgua?.ag015, fontSize: 10 },
          ],
          [
            { text: "AG027", fontSize: 10 },
            { text: "Volume de água fluoretada", fontSize: 10 },
            { text: dadosAgua?.ag027, fontSize: 10 },
          ],
          [
            { text: "AG012", fontSize: 10 },
            { text: "Volume de água macromedida", fontSize: 10 },
            { text: dadosAgua?.ag012, fontSize: 10 },
          ],
          [
            { text: "AG008", fontSize: 10 },
            { text: "Volume de água micromedida", fontSize: 10 },
            { text: dadosAgua?.ag008, fontSize: 10 },
          ],
          [
            { text: "AG010", fontSize: 10 },
            { text: "Volume de água consumido", fontSize: 10 },
            { text: dadosAgua?.ag010, fontSize: 10 },
          ],
          [
            { text: "AG011", fontSize: 10 },
            { text: "Volume de água faturado", fontSize: 10 },
            { text: dadosAgua?.ag011, fontSize: 10 },
          ],
          [
            { text: "AG020", fontSize: 10 },
            {
              text: "Volume micromedido nas economias residenciais de água",
              fontSize: 10,
            },
            { text: dadosAgua?.ag020, fontSize: 10 },
          ],
          [
            { text: "AG005", fontSize: 10 },
            { text: "Extenção da rede de água", fontSize: 10 },
            { text: dadosAgua?.ag005, fontSize: 10 },
          ],
          [
            { text: "AG028", fontSize: 10 },
            {
              text: "Consumo total de energia elétrica nos sistemas de água",
              fontSize: 10,
            },
            { text: dadosAgua?.ag028, fontSize: 10 },
          ],
          [
            { text: "AG098", fontSize: 10 },
            { text: "Campo de justificativa", fontSize: 10 },
            { text: dadosAgua?.ag098, fontSize: 10 },
          ],
          [
            { text: "AG099", fontSize: 10 },
            { text: "Observações", fontSize: 10 },
            { text: dadosAgua?.ag099, fontSize: 10 },
          ],
        ],
      },
      layout: "headerLineOnly",
    },

    { text: "Esgoto", bold: true, fontSize: 14, margin: [0, 10, 15, 0] },

    {
      table: {
        headerRows: 1,
        body: [
          [
            { text: "Código", fontSize: 12 },
            { text: "Descrição", fontSize: 12 },
            { text: dados?.ano, fontSize: 12 },
          ],
          [
            { text: "ES009", fontSize: 10 },
            { text: "Quantidade de ligações totais de esgoto", fontSize: 10 },
            { text: dadosEsgoto?.es009, fontSize: 10 },
          ],
          [
            { text: "ES002", fontSize: 10 },
            { text: "Quantidade de ligações ativas de esgoto", fontSize: 10 },
            { text: dadosEsgoto?.es002, fontSize: 10 },
          ],
          [
            { text: "ES003", fontSize: 10 },
            { text: "Quantidade de economias ativas de esgoto", fontSize: 10 },
            { text: dadosEsgoto?.es003, fontSize: 10 },
          ],
          [
            { text: "ES008", fontSize: 10 },
            {
              text: "Quantidade de economias residenciais ativas de esgoto",
              fontSize: 10,
            },
            { text: dadosEsgoto?.es008, fontSize: 10 },
          ],
          [
            { text: "ES005", fontSize: 10 },
            { text: "Volume de esgoto coletado", fontSize: 10 },
            { text: dadosEsgoto?.es005, fontSize: 10 },
          ],
          [
            { text: "ES006", fontSize: 10 },
            { text: "Volume de esgoto tratado", fontSize: 10 },
            { text: dadosEsgoto?.es006, fontSize: 10 },
          ],
          [
            { text: "ES007", fontSize: 10 },
            { text: "Volume de esgoto faturado", fontSize: 10 },
            { text: dadosEsgoto?.es007, fontSize: 10 },
          ],
          [
            { text: "ES012", fontSize: 10 },
            { text: "Volume de esgoto bruto exportado", fontSize: 10 },
            { text: dadosEsgoto?.es012, fontSize: 10 },
          ],
          [
            { text: "ES015", fontSize: 10 },
            {
              text: "Volume de esgoto bruto tratado nas instalações do importador",
              fontSize: 10,
            },
            { text: dadosEsgoto?.es015, fontSize: 10 },
          ],
          [
            { text: "ES004", fontSize: 10 },
            { text: "Extenção da rede", fontSize: 10 },
            { text: dadosEsgoto?.es004, fontSize: 10 },
          ],
          [
            { text: "ES028", fontSize: 10 },
            {
              text: "Consumo total de energia elétrica nos sistemas de água",
              fontSize: 10,
            },
            { text: dadosEsgoto?.es028, fontSize: 10 },
          ],
          [
            { text: "ES098", fontSize: 10 },
            { text: "Campo de justificativa", fontSize: 10 },
            { text: dadosEsgoto?.es098, fontSize: 10 },
          ],
          [
            { text: "ES099", fontSize: 10 },
            { text: "Observações", fontSize: 10 },
            { text: dadosEsgoto?.es099, fontSize: 10 },
          ],
        ],
      },
      layout: "headerLineOnly",
    },

    {
      text: "Drenagem e Águas Pluviais",
      bold: true,
      fontSize: 14,
      margin: [0, 10, 15, 0],
    },
    {
      table: {
        headerRows: 1,
        body: [
          [
            { text: "Código", fontSize: 12 },
            { text: "Descrição", fontSize: 12 },
            { text: dados?.ano, fontSize: 12 },
          ],
          [
            { text: "IE017", fontSize: 10 },
            { text: "Extensão total das vias públicas urbanas", fontSize: 10 },
            { text: dadosDrenagem?.ie017, fontSize: 10 },
          ],
          [
            { text: "IE018", fontSize: 10 },
            {
              text: "Extensão total das vias públicas urbanas implantadas",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ie018, fontSize: 10 },
          ],
          [
            { text: "IE019", fontSize: 10 },
            {
              text: "Extensão total das vias públicas com pavimento e meio-fio(ou semelhante)",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ie019, fontSize: 10 },
          ],
          [
            { text: "IE020", fontSize: 10 },
            {
              text: "Extensão total das vias públicas com pavimento e meio-fio(ou semelhante) implantadas no ano de referência",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ie020, fontSize: 10 },
          ],
          [
            { text: "IE021", fontSize: 10 },
            { text: "Quantidade de bocas de lobo existentes", fontSize: 10 },
            { text: dadosDrenagem?.ie021, fontSize: 10 },
          ],
          [
            { text: "IE022", fontSize: 10 },
            {
              text: "Quantidade de bocas de leão ou de bocas de lobo múltiplas(duas ou mais bocas de lobo conjugadas) existentes",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ie022, fontSize: 10 },
          ],
          [
            { text: "IE023", fontSize: 10 },
            {
              text: "Quantidade de poços de visita (PV) existentes",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ie023, fontSize: 10 },
          ],
          [
            { text: "IE024", fontSize: 10 },
            {
              text: "Extensão total das vias públicas urbanas com redes de águas pluviais subterrâneos",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ie024, fontSize: 10 },
          ],
          [
            { text: "IE025", fontSize: 10 },
            {
              text: "Extensão total das vias públicas urbanas com redes de águas pluviais subterrâneos implantados no ano de referência",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ie025, fontSize: 10 },
          ],
          [
            { text: "IE026", fontSize: 10 },
            {
              text: "Existem vias públicas urbanas com canais artificiais abertos?",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ie026, fontSize: 10 },
          ],
          [
            { text: "IE027", fontSize: 10 },
            {
              text: "Existem vias públicas urbanas com soluções de drenagem natural (faixas ou valas de infiltração)?",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ie027, fontSize: 10 },
          ],
          [
            { text: "IE028", fontSize: 10 },
            {
              text: "Extensão total das vias públicas urbanas com soluções de drenagem natural (faixas ou valas de infiltração)",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ie028, fontSize: 10 },
          ],
          [
            { text: "IE029", fontSize: 10 },
            {
              text: "Existem estenções elevatórias de águas pluviais na rede de drenagem?",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ie029, fontSize: 10 },
          ],
          [
            { text: "IE032", fontSize: 10 },
            {
              text: "Extensão total dos Cursos d’água naturais perenes",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ie032, fontSize: 10 },
          ],
          [
            { text: "IE040", fontSize: 10 },
            {
              text: "Extensão total dos Cursos d’água naturais perenes copm outro tipo de intervenção",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ie040, fontSize: 10 },
          ],
          [
            { text: "IE033", fontSize: 10 },
            {
              text: "Extensão total dos Cursos d’água naturais perenes com diques",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ie033, fontSize: 10 },
          ],
          [
            { text: "IE034", fontSize: 10 },
            {
              text: "Extensão total dos Cursos d’água naturais perenes canalizados abertos",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ie034, fontSize: 10 },
          ],
          [
            { text: "IE035", fontSize: 10 },
            {
              text: "Extensão total dos Cursos d’água naturais perenes canalizados fechados",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ie035, fontSize: 10 },
          ],
          [
            { text: "IE036", fontSize: 10 },
            {
              text: "Extensão total dos Cursos d’água naturais perenes com retificação",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ie036, fontSize: 10 },
          ],
          [
            { text: "IE037", fontSize: 10 },
            {
              text: "Extensão total dos Cursos d’água naturais perenes com desenrocamento ou rebaixamento do leito",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ie037, fontSize: 10 },
          ],
          [
            { text: "IE041", fontSize: 10 },
            {
              text: "Existe serviço de drenagem ou desassoreamento dos Cursos d’água naturais perenes?",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ie041, fontSize: 10 },
          ],
          [
            { text: "IE044", fontSize: 10 },
            {
              text: "Extensão total de parques lineares ao longo de Cursos d’água perenes",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ie044, fontSize: 10 },
          ],
          [
            { text: "IE050", fontSize: 10 },
            {
              text: "Existem algum tipo de tratamento das águas pluviais?",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ie050, fontSize: 10 },
          ],
          [
            { text: "IE050A", fontSize: 10 },
            {
              text: "Especifique qual é o outro tipo de tratamento das águas pluviais",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ie050a, fontSize: 10 },
          ],
          [
            { text: "IE999", fontSize: 10 },
            { text: "Observações, esclarecimentos ou sugestões", fontSize: 10 },
            { text: dadosDrenagem?.ie999, fontSize: 10 },
          ],
          [
            { text: "RI023", fontSize: 10 },
            {
              text: "Numero de enxurradas na área urbana do município",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ri023, fontSize: 10 },
          ],
          [
            { text: "RI025", fontSize: 10 },
            {
              text: "Numero de alagementos na área urbana do município",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ri025, fontSize: 10 },
          ],
          [
            { text: "RI027", fontSize: 10 },
            {
              text: "Numero de inundações na área urbana do município",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ri027, fontSize: 10 },
          ],
          [
            { text: "RI029", fontSize: 10 },
            {
              text: "Numero de pessoas desabrigadas ou desalojadas, na área urbana do município",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ri029, fontSize: 10 },
          ],
          [
            { text: "RI031", fontSize: 10 },
            {
              text: "Numero de óbitos, na área urbana do município",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ri031, fontSize: 10 },
          ],
          [
            { text: "RI032", fontSize: 10 },
            { text: "Numero de imóveis urbanos atingidos", fontSize: 10 },
            { text: dadosDrenagem?.ri032, fontSize: 10 },
          ],
          [
            { text: "RI042", fontSize: 10 },
            {
              text: "Houve alojamento ou reassentamento de população residente em área de risco hidrológico, durante ou após eventos hidrológicos impactantes",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ri042, fontSize: 10 },
          ],
          [
            { text: "RI043", fontSize: 10 },
            {
              text: "Quantidade de pessoas tranferidas para habitações provisórias durante ou após os eventos hidrológicos impactantes",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ri043, fontSize: 10 },
          ],
          [
            { text: "RI044", fontSize: 10 },
            {
              text: "Quantidade de pessoas realocadas para habitações permanentes durante ou após os eventos hidrológicos impactantes",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ri044, fontSize: 10 },
          ],
          [
            { text: "RI045", fontSize: 10 },
            {
              text: "Houve atuação (federal, estadual ou municipal) para reassentamento da população e/ou para recuperação de imóveis urbanos afetados por eventos hidrológicos impactantes?",
              fontSize: 10,
            },
            { text: dadosDrenagem?.ri045, fontSize: 10 },
          ],
          [
            { text: "RI999", fontSize: 10 },
            { text: "Observações, esclarecimentos ou sugestões", fontSize: 10 },
            { text: dadosDrenagem?.ri999, fontSize: 10 },
          ],
        ],
      },
      layout: "headerLineOnly",
    },

    {
      text: "Resíduos Sólidos Coleta",
      bold: true,
      fontSize: 14,
      margin: [0, 10, 15, 0],
    },
    {
      table: {
        headerRows: 1,
        body: [
          [
            { text: "Código", fontSize: 12 },
            { text: "Descrição", fontSize: 12 },
            { text: dados?.ano, fontSize: 12 },
          ],
          [
            { text: "TB001", fontSize: 10 },
            {
              text: "Coletores e Motoristas de agentes PÚBLICOS, alocados na coleta",
              fontSize: 10,
            },
            { text: dadosResiduosColeta?.tb001, fontSize: 10 },
          ],
          [
            { text: "TB003", fontSize: 10 },
            { text: "Agentes PÚBLICOS envolvidos na varrição", fontSize: 10 },
            { text: dadosResiduosColeta?.tb003, fontSize: 10 },
          ],
          [
            { text: "TB005", fontSize: 10 },
            {
              text: "Agentes PÚBLICOS envolvidos com a capina e roçada",
              fontSize: 10,
            },
            { text: dadosResiduosColeta?.tb005, fontSize: 10 },
          ],
          [
            { text: "TB007", fontSize: 10 },
            {
              text: "Agentes PÚBLICOS alocados nas unidades de manejo, tratamento ou disposição final",
              fontSize: 10,
            },
            { text: dadosResiduosColeta?.tb007, fontSize: 10 },
          ],
          [
            { text: "TB009", fontSize: 10 },
            {
              text: "Agentes PÚBLICOS envolvidos nos demais serviços quando não especificados acima",
              fontSize: 10,
            },
            { text: dadosResiduosColeta?.tb009, fontSize: 10 },
          ],
          [
            { text: "TB011", fontSize: 10 },
            {
              text: "Agentes PÚBLICOS alocados na Gerencia ou Administração (Planejamento ou Fiscalização)",
              fontSize: 10,
            },
            { text: dadosResiduosColeta?.tb011, fontSize: 10 },
          ],
          [
            { text: "TB013", fontSize: 10 },
            { text: "Total de Agentes PÚBLICOS envolvidos", fontSize: 10 },
            { text: dadosResiduosColeta?.tb013, fontSize: 10 },
          ],
          [
            { text: "TB002", fontSize: 10 },
            {
              text: "Coletores e Motoristas de agentes PRIVADOS, alocados na coleta",
              fontSize: 10,
            },
            { text: dadosResiduosColeta?.tb002, fontSize: 10 },
          ],
          [
            { text: "TB004", fontSize: 10 },
            { text: "Agentes PRIVADOS envolvidos na varrição", fontSize: 10 },
            { text: dadosResiduosColeta?.tb004, fontSize: 10 },
          ],
          [
            { text: "TB006", fontSize: 10 },
            {
              text: "Agentes PRIVADOS envolvidos com a capina e roçada",
              fontSize: 10,
            },
            { text: dadosResiduosColeta?.tb006, fontSize: 10 },
          ],
          [
            { text: "TB008", fontSize: 10 },
            {
              text: "Agentes PRIVADOS alocados nas unidades de manejo, tratamento ou disposição final",
              fontSize: 10,
            },
            { text: dadosResiduosColeta?.tb008, fontSize: 10 },
          ],
          [
            { text: "TB010", fontSize: 10 },
            {
              text: "Agentes PRIVADOS envolvidos nos demais serviços quando não especificados acima",
              fontSize: 10,
            },
            { text: dadosResiduosColeta?.tb010, fontSize: 10 },
          ],
          [
            { text: "TB012", fontSize: 10 },
            {
              text: "Agentes PRIVADOS alocados na Gerencia ou Administração (Planejamento ou Fiscalização)",
              fontSize: 10,
            },
            { text: dadosResiduosColeta?.tb012, fontSize: 10 },
          ],
          [
            { text: "TB014", fontSize: 10 },
            { text: "Total de Agentes PRIVADOS envolvidos", fontSize: 10 },
            { text: dadosResiduosColeta?.tb014, fontSize: 10 },
          ],
          [
            { text: "TB015", fontSize: 10 },
            {
              text: "Total de trabalhadores envolvidos nos servicos de Manejo de RSU",
              fontSize: 10,
            },
            { text: dadosResiduosColeta?.tb015, fontSize: 10 },
          ],
          [
            { text: "TB016", fontSize: 10 },
            { text: "Existem frentes de trabalho temporário?", fontSize: 10 },
            { text: dadosResiduosColeta?.tb016, fontSize: 10 },
          ],
          [
            { text: "TB017", fontSize: 10 },
            { text: "Quantidades de trabalhadores Frente !", fontSize: 10 },
            { text: dadosResiduosColeta?.tb017, fontSize: 10 },
          ],
          [
            { text: "TB020", fontSize: 10 },
            { text: "Duração de frente 1", fontSize: 10 },
            { text: dadosResiduosColeta?.tb020, fontSize: 10 },
          ],
          [
            { text: "TB023", fontSize: 10 },
            {
              text: "Atuam em mais de um tipo de serviço, Frente 1?",
              fontSize: 10,
            },
            { text: dadosResiduosColeta?.tb023, fontSize: 10 },
          ],
          [
            { text: "TB026", fontSize: 10 },
            { text: "Tipo de serviço predominate de Frente 1", fontSize: 10 },
            { text: dadosResiduosColeta?.tb026, fontSize: 10 },
          ],
          [
            { text: "TB018", fontSize: 10 },
            { text: "Quantidade de trabalhadores Frente 2", fontSize: 10 },
            { text: dadosResiduosColeta?.tb018, fontSize: 10 },
          ],
          [
            { text: "TB021", fontSize: 10 },
            { text: "Duração de Frente 2", fontSize: 10 },
            { text: dadosResiduosColeta?.tb021, fontSize: 10 },
          ],
          [
            { text: "TB024", fontSize: 10 },
            {
              text: "Atuam em mais de um tipo de serviço, Frente 2?",
              fontSize: 10,
            },
            { text: dadosResiduosColeta?.tb024, fontSize: 10 },
          ],
          [
            { text: "TB027", fontSize: 10 },
            { text: "Tipo de serviço predominante da Frente 2", fontSize: 10 },
            { text: dadosResiduosColeta?.tb027, fontSize: 10 },
          ],
          [
            { text: "TB019", fontSize: 10 },
            { text: "Quantidade de trabalhadores Frente 3", fontSize: 10 },
            { text: dadosResiduosColeta?.tb019, fontSize: 10 },
          ],
          [
            { text: "TB022", fontSize: 10 },
            { text: "Duração de Frente 3", fontSize: 10 },
            { text: dadosResiduosColeta?.tb022, fontSize: 10 },
          ],
          [
            { text: "TB025", fontSize: 10 },
            {
              text: "Atuam em mais de um tipo de serviços, Frente 3?",
              fontSize: 10,
            },
            { text: dadosResiduosColeta?.tb025, fontSize: 10 },
          ],
          [
            { text: "TB028", fontSize: 10 },
            { text: "Tipo de serviços predominante da Frente 3", fontSize: 10 },
            { text: dadosResiduosColeta?.tb028, fontSize: 10 },
          ],
        ],
      },
      layout: "headerLineOnly",
    },

    {
      text: "Frota de coleta domiciliar e pública",
      bold: true,
      fontSize: 14,
      margin: [0, 10, 15, 0],
    },
    {
      table: {
        headerRows: 1,
        body: [
          [
            { text: "Tipo de veiculos(Quant?.)" },
            { text: "" },
            { text: "Prefeitura SLU" },
            { text: "" },
            { text: "" },
            { text: "Empr?. Contratada" },
            { text: "" },
          ],
          [
            { text: " ", fontSize: 10 },
            { text: "0 a 5 anos", fontSize: 10 },
            { text: "5 a 10 anos", fontSize: 10 },
            { text: "Maior que 10 anos", fontSize: 10 },
            { text: "0 a 5 anos", fontSize: 10 },
            { text: "5 a 10 anos", fontSize: 10 },
            { text: "Maior que 10 anos", fontSize: 10 },
          ],
          [
            { text: " ", fontSize: 10 },
            { text: "CO054", fontSize: 10 },
            { text: "CO055", fontSize: 10 },
            { text: "CO056", fontSize: 10 },
            { text: "CO057", fontSize: 10 },
            { text: "CO058", fontSize: 10 },
            { text: "CO059", fontSize: 10 },
          ],
          [
            { text: "Caminhão compactador", fontSize: 10 },
            { text: dadosResiduosColeta?.co054, fontSize: 10 },
            { text: dadosResiduosColeta?.co055, fontSize: 10 },
            { text: dadosResiduosColeta?.co056, fontSize: 10 },
            { text: dadosResiduosColeta?.co057, fontSize: 10 },
            { text: dadosResiduosColeta?.co058, fontSize: 10 },
            { text: dadosResiduosColeta?.co059, fontSize: 10 },
          ],
          [
            { text: " ", fontSize: 10 },
            { text: "CO063", fontSize: 10 },
            { text: "CO064", fontSize: 10 },
            { text: "CO065", fontSize: 10 },
            { text: "CO066", fontSize: 10 },
            { text: "CO067", fontSize: 10 },
            { text: "CO068", fontSize: 10 },
          ],
          [
            { text: "Caminhão basculante, baú ou carroceria", fontSize: 10 },
            { text: dadosResiduosColeta?.co063, fontSize: 10 },
            { text: dadosResiduosColeta?.co064, fontSize: 10 },
            { text: dadosResiduosColeta?.co065, fontSize: 10 },
            { text: dadosResiduosColeta?.co066, fontSize: 10 },
            { text: dadosResiduosColeta?.co067, fontSize: 10 },
            { text: dadosResiduosColeta?.co068, fontSize: 10 },
          ],
          [
            { text: " ", fontSize: 10 },
            { text: "CO072", fontSize: 10 },
            { text: "CO073", fontSize: 10 },
            { text: "CO074", fontSize: 10 },
            { text: "CO075", fontSize: 10 },
            { text: "CO076", fontSize: 10 },
            { text: "CO077", fontSize: 10 },
          ],
          [
            { text: "Caminhão poliguindastes (brook)", fontSize: 10 },
            { text: dadosResiduosColeta?.co072, fontSize: 10 },
            { text: dadosResiduosColeta?.co073, fontSize: 10 },
            { text: dadosResiduosColeta?.co074, fontSize: 10 },
            { text: dadosResiduosColeta?.co075, fontSize: 10 },
            { text: dadosResiduosColeta?.co076, fontSize: 10 },
            { text: dadosResiduosColeta?.co077, fontSize: 10 },
          ],
          [
            { text: " ", fontSize: 10 },
            { text: "CO071", fontSize: 10 },
            { text: "CO082", fontSize: 10 },
            { text: "CO083", fontSize: 10 },
            { text: "CO084", fontSize: 10 },
            { text: "CO085", fontSize: 10 },
            { text: "CO086", fontSize: 10 },
          ],
          [
            { text: "Trator agrícola com reboque", fontSize: 10 },
            { text: dadosResiduosColeta?.co071, fontSize: 10 },
            { text: dadosResiduosColeta?.co082, fontSize: 10 },
            { text: dadosResiduosColeta?.co083, fontSize: 10 },
            { text: dadosResiduosColeta?.co084, fontSize: 10 },
            { text: dadosResiduosColeta?.co085, fontSize: 10 },
            { text: dadosResiduosColeta?.co086, fontSize: 10 },
          ],
          [
            { text: " ", fontSize: 10 },
            { text: "CO090", fontSize: 10 },
            { text: "CO091", fontSize: 10 },
            { text: "CO092", fontSize: 10 },
            { text: "CO093", fontSize: 10 },
            { text: "CO094", fontSize: 10 },
            { text: "CO095", fontSize: 10 },
          ],
          [
            { text: "Tração animal", fontSize: 10 },
            { text: dadosResiduosColeta?.co090, fontSize: 10 },
            { text: dadosResiduosColeta?.co091, fontSize: 10 },
            { text: dadosResiduosColeta?.co092, fontSize: 10 },
            { text: dadosResiduosColeta?.co093, fontSize: 10 },
            { text: dadosResiduosColeta?.co094, fontSize: 10 },
            { text: dadosResiduosColeta?.co095, fontSize: 10 },
          ],
          [
            { text: " ", fontSize: 10 },
            { text: "CO155", fontSize: 10 },
            { text: "CO156", fontSize: 10 },
            { text: "CO157", fontSize: 10 },
            { text: "CO158", fontSize: 10 },
            { text: "CO159", fontSize: 10 },
            { text: "CO160", fontSize: 10 },
          ],
          [
            { text: "Tração animal", fontSize: 10 },
            { text: dadosResiduosColeta?.co155, fontSize: 10 },
            { text: dadosResiduosColeta?.co156, fontSize: 10 },
            { text: dadosResiduosColeta?.co157, fontSize: 10 },
            { text: dadosResiduosColeta?.co158, fontSize: 10 },
            { text: dadosResiduosColeta?.co159, fontSize: 10 },
            { text: dadosResiduosColeta?.co160, fontSize: 10 },
          ],
        ],
      },
      layout: "headerLineOnly",
    },

    {
      table: {
        headerRows: 1,
        body: [["CO163", "Outros veículos", dadosResiduosColeta?.co163]],
      },
      layout: "headerLineOnly",
    },

    {
      table: {
        headerRows: 1,
        body: [
          [
            { text: "Código", fontSize: 12 },
            { text: "Descrição", fontSize: 12 },
            { text: "" },
          ],
          [
            { text: "CO154", fontSize: 10 },
            {
              text: "Os residuos provenientes da varrição ou limpeza de logradouros públicos são recolhidos junto com os residuos domiciliares?",
              fontSize: 10,
            },
            { text: dadosResiduosColeta?.co154, fontSize: 10 },
          ],
          [
            { text: "CO012", fontSize: 10 },
            {
              text: "Valor contratado (preço unitário) do serviço de RDO e RPU diurna",
              fontSize: 10,
            },
            { text: dadosResiduosColeta?.co012, fontSize: 10 },
          ],
          [
            { text: "CO146", fontSize: 10 },
            {
              text: "Valor contratual (preço unitário) do serviço de transporte de RDO e RPU até a unidade de destinação final",
              fontSize: 10,
            },
            { text: dadosResiduosColeta?.co146, fontSize: 10 },
          ],
          [
            { text: "CO148", fontSize: 10 },
            {
              text: "No preço acima está incluido o transporte de RDO e RPU coletados até a destinação final?",
              fontSize: 10,
            },
            { text: dadosResiduosColeta?.co148, fontSize: 10 },
          ],
          [
            { text: "CO149", fontSize: 10 },
            {
              text: "A distancia média do centro de massa à unidade de destinação final é superior a 15 km?",
              fontSize: 10,
            },
            { text: dadosResiduosColeta?.co149, fontSize: 10 },
          ],
          [
            { text: "CO150", fontSize: 10 },
            {
              text: "Especifique a distancia do centro de massa à unidade de destinação final superior a 15km",
              fontSize: 10,
            },
            { text: dadosResiduosColeta?.co150, fontSize: 10 },
          ],
          [
            { text: "CO151", fontSize: 10 },
            {
              text: "A distancia média de transporte à unidade de destinação final é superior a 15km?",
              fontSize: 10,
            },
            { text: dadosResiduosColeta?.co151, fontSize: 10 },
          ],
          [
            { text: "CO152", fontSize: 10 },
            {
              text: "Especifique a distancia de transporte à unidade de destinação final superior a 15km",
              fontSize: 10,
            },
            { text: dadosResiduosColeta?.co152, fontSize: 10 },
          ],
          [
            { text: "CO021", fontSize: 10 },
            {
              text: "É utilizada balança para pesagem rotineira dos residuos sólidos coletados?",
              fontSize: 10,
            },
            { text: dadosResiduosColeta?.co021, fontSize: 10 },
          ],
          [
            { text: "CO019", fontSize: 10 },
            {
              text: "Os resíduos sólidos DOMICILIARES coletados são enviados para outro município?",
              fontSize: 10,
            },
            { text: dadosResiduosColeta?.co019, fontSize: 10 },
          ],
          [
            { text: "CO020", fontSize: 10 },
            {
              text: "Município(s) de destino de RDO e RPU exportado",
              fontSize: 10,
            },
            { text: "", fontSize: 10 },
          ],
        ],
      },
      layout: "headerLineOnly",
    },
    {
      table: {
        headerRows: 1,
        body: [
          [{ text: "Municípios", fontSize: 12, bold: true }],
          [
            concessionarias?.map(
              (value: {
                razao_social: string;
                cnpj: string;
                ano_inicio: string;
                duracao: string;
                vigente: string;
                capina_e_rocada: string;
                coleta_res_construcao_civil: string;
                coleta_res_domiciliar: string;
                coleta_res_servicos_saude: string;
                coleta_res_publico: string;
                operacao_aterro_sanitario: string;
                operacao_incinerador: string;
                operacao_outras_unidades_processamento: string;
                operacao_unidade_compostagem: string;
                operacao_triagem: string;
                outros: string;
                tipo_desconhecido: string;
                varricao_logradouros_publicos: string;
              }) => [
                [
                  {
                    text: "Razão Social Concessionária: " + value?.razao_social,
                    fontSize: 10,
                  },
                ],
                [{ text: "CNPJ: " + value?.cnpj, fontSize: 10 }],
                [{ text: "Ano de inicio: " + value?.ano_inicio, fontSize: 10 }],
                [{ text: "Duração(em anos): " + value?.duracao, fontSize: 10 }],
                [{ text: "Vigente?: " + value?.vigente, fontSize: 10 }],
                [
                  {
                    text: "Capina e roçada: " + value?.capina_e_rocada,
                    fontSize: 10,
                  },
                ],
                [
                  {
                    text:
                      "Coleta de res. contrucão civil: " +
                      value?.coleta_res_construcao_civil,
                    fontSize: 10,
                  },
                ],
                [
                  {
                    text:
                      "Coleta de res. Domiciliar: " +
                      value?.coleta_res_domiciliar,
                    fontSize: 10,
                  },
                ],
                [
                  {
                    text:
                      "Coleta de res. dos Serviços da Saúde:" +
                      value?.coleta_res_servicos_saude,
                    fontSize: 10,
                  },
                ],
                [
                  {
                    text: "Coleta de res. Público:" + value?.coleta_res_publico,
                    fontSize: 10,
                  },
                ],
                [
                  {
                    text:
                      "Operação de aterro sanitário:" +
                      value?.operacao_aterro_sanitario,
                    fontSize: 10,
                  },
                ],
                [
                  {
                    text:
                      "Operação de incinerador:" + value?.operacao_incinerador,
                    fontSize: 10,
                  },
                ],
                [
                  {
                    text:
                      "Operação de outras unidades de processamento:" +
                      value?.operacao_outras_unidades_processamento,
                    fontSize: 10,
                  },
                ],
                [
                  {
                    text:
                      "Operação de unidade de compostagem:" +
                      value?.operacao_unidade_compostagem,
                    fontSize: 10,
                  },
                ],
                [
                  {
                    text: "Operação de triagem:" + value?.operacao_triagem,
                    fontSize: 10,
                  },
                ],
                [{ text: "Outros:" + value?.outros, fontSize: 10 }],
                [
                  {
                    text: "Tipo desconhecido:" + value?.tipo_desconhecido,
                    fontSize: 10,
                  },
                ],
                [
                  {
                    text:
                      "Varrição de logradouros públicos:" +
                      value?.varricao_logradouros_publicos,
                    fontSize: 10,
                  },
                ],
                [
                  {
                    text: "-----------------------------------------------------------------------------------------------------------",
                    fontSize: 10,
                  },
                ],
              ]
            ),
          ],
        ],
      },
      layout: "headerLineOnly",
    },
    ...residuosUnidadesProcessamento.map(
      (unidade: {
        nome: string;
        tipo: string;
        capacidade: string;
        ano_inicio: string;
        ano_fim: string;
        quantidade_residuos_processados: string;
        residuosUnidade: [];
      }) => {
        return {
          table: {
            headerRows: 1,
            body: [
              [{ text: "Unidade de Processamento de Resíduos Sólidos" }],
              [unidade.nome],
              [
                unidade.residuosUnidade?.map((residuo: any) => {
                  return [
                    {
                      table: {
                        headerRows: 1,
                        body: [
                          [
                            { text: "Código SNIS: ", fontSize: 12 },
                            { text: "Descrição: ", fontSize: 12 },
                            { text: "Valor", fontSize: 12 },
                          ],
                          [
                            { text: "UP079", fontSize: 10 },
                            {
                              text: "Razão Social Concessionária: ",
                              fontSize: 10,
                            },
                            { text: residuo?.up079, fontSize: 10 },
                          ],
                          [
                            { text: "UP003", fontSize: 10 },
                            { text: "Tipo de unidade: ", fontSize: 10 },
                            { text: residuo?.up003, fontSize: 10 },
                          ],
                          [
                            { text: "UP001", fontSize: 10 },
                            { text: "Nome da unidade:", fontSize: 10 },
                            {
                              text: residuo?.nome_unidade_processamento || "",
                              fontSize: 10,
                            },
                          ],
                          [
                            { text: "UP065", fontSize: 10 },
                            { text: "Proprietário:", fontSize: 10 },
                            { text: residuo?.up065 || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP087", fontSize: 10 },
                            { text: "Endereço:", fontSize: 10 },
                            { text: residuo?.endereco || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP051", fontSize: 10 },
                            {
                              text: "Unidade esteve em operação no ano de referência?",
                              fontSize: 10,
                            },
                            { text: residuo?.up051 || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP002", fontSize: 10 },
                            {
                              text: "Ano de início da operação:",
                              fontSize: 10,
                            },
                            { text: residuo?.up002 || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP066", fontSize: 10 },
                            {
                              text: "Ano de cadastro da unidade:",
                              fontSize: 10,
                            },
                            { text: residuo?.up066 || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP004", fontSize: 10 },
                            { text: "Operador da unidade:", fontSize: 10 },
                            { text: residuo?.up004 || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP084", fontSize: 10 },
                            { text: "Vala RSS na mesma área:", fontSize: 10 },
                            { text: residuo?.up084 || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP050", fontSize: 10 },
                            {
                              text: "Tipo de licença ambiental emitida:",
                              fontSize: 10,
                            },
                            { text: residuo?.up050 || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP012", fontSize: 10 },
                            {
                              text: "Recebe resíduos de outros municípios:",
                              fontSize: 10,
                            },
                            { text: residuo?.up012 || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP085", fontSize: 10 },
                            {
                              text: "Nome do titular da licença de operação:",
                              fontSize: 10,
                            },
                            { text: residuo?.up085 || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP086", fontSize: 10 },
                            {
                              text: "CNPJ do titular de Licença de Operação:",
                              fontSize: 10,
                            },
                            { text: residuo?.cnpj || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP027", fontSize: 10 },
                            {
                              text: "Existe cercamento da área?",
                              fontSize: 10,
                            },
                            { text: residuo?.up027 || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP028", fontSize: 10 },
                            {
                              text: "Existe instalações administrativas ou de apoio aos trabalhadores?",
                              fontSize: 10,
                            },
                            { text: residuo?.up028 || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP029", fontSize: 10 },
                            {
                              text: "Existe impermeabilização da base do aterro (com argila ou manta)?",
                              fontSize: 10,
                            },
                            { text: residuo?.up029 || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP030", fontSize: 10 },
                            {
                              text: "Qual a frequência do recolhimento de resíduos?",
                              fontSize: 10,
                            },
                            { text: residuo?.up030 || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP031", fontSize: 10 },
                            { text: "Existe drenagem de gases?", fontSize: 10 },
                            { text: residuo?.up031 || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP052", fontSize: 10 },
                            {
                              text: "Existe algum tipo de reaproveitamento de gases drenados?",
                              fontSize: 10,
                            },
                            { text: residuo?.up052 || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP032", fontSize: 10 },
                            {
                              text: "Existe sistema de drenagem do líquido percolado (chorume)?",
                              fontSize: 10,
                            },
                            { text: residuo?.up032 || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP033", fontSize: 10 },
                            {
                              text: "Existe unidade de tratamento do líquido percolado na área da unidade?",
                              fontSize: 10,
                            },
                            { text: residuo?.up033 || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP053", fontSize: 10 },
                            {
                              text: "Existe unidade de tratamento do líquido percolado localizado fora da área da unidade?",
                              fontSize: 10,
                            },
                            { text: residuo?.up053 || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP054", fontSize: 10 },
                            {
                              text: "Existe sistema de drenagem de águas pluviais?",
                              fontSize: 10,
                            },
                            { text: residuo?.up054 || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP034", fontSize: 10 },
                            {
                              text: "Existe recirculação do líquido percolado (chorume)?",
                              fontSize: 10,
                            },
                            { text: residuo?.up034 || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP035", fontSize: 10 },
                            {
                              text: "Há vigilância diurna e noturna na unidade?",
                              fontSize: 10,
                            },
                            { text: residuo?.up035 || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP036", fontSize: 10 },
                            {
                              text: "Há algum tipo de monitoramento ambiental da instalação?",
                              fontSize: 10,
                            },
                            { text: residuo?.up036 || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP037", fontSize: 10 },
                            {
                              text: "É feita queima de resíduos a céu aberto?",
                              fontSize: 10,
                            },
                            { text: residuo?.up037 || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP038", fontSize: 10 },
                            {
                              text: "Há presença de animais (exceto aves) na área (porcos, cavalos, vacas...)?",
                              fontSize: 10,
                            },
                            { text: residuo?.up038 || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP081", fontSize: 10 },
                            {
                              text: "Existem catadores de materiais recicláveis?",
                              fontSize: 10,
                            },
                            { text: residuo?.up081 || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP082", fontSize: 10 },
                            {
                              text: "Quantidade de catadores até 14 anos?",
                              fontSize: 10,
                            },
                            { text: residuo?.up082 || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP083", fontSize: 10 },
                            {
                              text: "Quantidade de catadores maiores de 14 anos?",
                              fontSize: 10,
                            },
                            { text: residuo?.up083 || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP039", fontSize: 10 },
                            {
                              text: "Há domicílios de catadores na área da unidade?",
                              fontSize: 10,
                            },
                            { text: residuo?.up039 || "", fontSize: 10 },
                          ],
                          [
                            { text: "UP040", fontSize: 10 },
                            {
                              text: "Quantidade de domicílios de catadores na área?",
                              fontSize: 10,
                            },
                            { text: residuo?.up040 || "", fontSize: 10 },
                          ],
                        ],
                      },
                      layout: "headerLineOnly",
                    },
                    {
                      table: {
                        headerRows: 1,
                        body: [
                          [
                            {
                              text: "Quantidade de veículos e Equipamentos",
                              fontSize: 12,
                              bold: true,
                            },
                            { text: "" },
                            { text: "" },
                            { text: "" },
                          ],
                          [
                            {
                              text: "Tipo de equipamentos",
                              fontSize: 12,
                              bold: true,
                            },
                            {
                              text: "Da prefeitura ou SLU",
                              fontSize: 12,
                              bold: true,
                            },
                            { text: "", fontSize: 12, bold: true },
                            {
                              text: "De empresas contratadas",
                              fontSize: 12,
                              bold: true,
                            },
                          ],
                          [
                            { text: "", fontSize: 10 },
                            { text: "Código SNIS", fontSize: 10 },
                            { text: "", fontSize: 10 },
                            { text: "Código SNIS", fontSize: 10 },
                          ],
                          [
                            { text: "Trato de esteiras", fontSize: 10 },
                            { text: "UP015", fontSize: 10 },
                            { text: "", fontSize: 10 },
                            { text: "UP020", fontSize: 10 },
                          ],
                          [
                            { text: "", fontSize: 10 },
                            { text: residuo?.up015 ?? "", fontSize: 10 },
                            { text: "", fontSize: 10 },
                            { text: residuo?.up020 ?? "", fontSize: 10 },
                          ],
                          [
                            { text: "Retro-escavadeira", fontSize: 10 },
                            { text: "UP016", fontSize: 10 },
                            { text: "", fontSize: 10 },
                            { text: "UP021", fontSize: 10 },
                          ],
                          [
                            { text: "", fontSize: 10 },
                            { text: residuo?.up016 ?? "", fontSize: 10 },
                            { text: "", fontSize: 10 },
                            { text: residuo?.up021 ?? "", fontSize: 10 },
                          ],
                          [
                            { text: "Pá carregadeira", fontSize: 10 },
                            { text: "UP017", fontSize: 10 },
                            { text: "", fontSize: 10 },
                            { text: "UP022", fontSize: 10 },
                          ],
                          [
                            { text: "", fontSize: 10 },
                            { text: residuo?.up017 ?? "", fontSize: 10 },
                            { text: "", fontSize: 10 },
                            { text: residuo?.up022 ?? "", fontSize: 10 },
                          ],
                          [
                            { text: "Caminhão basculante", fontSize: 10 },
                            { text: "UP018", fontSize: 10 },
                            { text: "", fontSize: 10 },
                            { text: "UP023", fontSize: 10 },
                          ],
                          [
                            { text: "", fontSize: 10 },
                            { text: residuo?.up018 ?? "", fontSize: 10 },
                            { text: "", fontSize: 10 },
                            { text: residuo?.up023 ?? "", fontSize: 10 },
                          ],
                          [
                            { text: "Caminhão-pipa", fontSize: 10 },
                            { text: "UP071", fontSize: 10 },
                            { text: "", fontSize: 10 },
                            { text: "UP075", fontSize: 10 },
                          ],
                          [
                            { text: "", fontSize: 10 },
                            { text: residuo?.up071 ?? "", fontSize: 10 },
                            { text: "", fontSize: 10 },
                            { text: residuo?.up075 ?? "", fontSize: 10 },
                          ],
                          [
                            { text: "Escavadeira hidráulica", fontSize: 10 },
                            { text: "UP068", fontSize: 10 },
                            { text: "", fontSize: 10 },
                            { text: "UP072", fontSize: 10 },
                          ],
                          [
                            { text: "", fontSize: 10 },
                            { text: residuo?.up068 ?? "", fontSize: 10 },
                            { text: "", fontSize: 10 },
                            { text: residuo?.up072 ?? "", fontSize: 10 },
                          ],
                          [
                            {
                              text: "Trator com rolo compactador",
                              fontSize: 10,
                            },
                            { text: "UP069", fontSize: 10 },
                            { text: "", fontSize: 10 },
                            { text: "UP073", fontSize: 10 },
                          ],
                          [
                            { text: "", fontSize: 10 },
                            { text: residuo?.up069 ?? "", fontSize: 10 },
                            { text: "", fontSize: 10 },
                            { text: residuo?.up073 ?? "", fontSize: 10 },
                          ],
                          [
                            {
                              text: "Trator de pneus com rolo compactador",
                              fontSize: 10,
                            },
                            { text: "UP070", fontSize: 10 },
                            { text: "", fontSize: 10 },
                            { text: "UP074", fontSize: 10 },
                          ],
                          [
                            { text: "", fontSize: 10 },
                            { text: residuo?.up070 ?? "", fontSize: 10 },
                            { text: "", fontSize: 10 },
                            { text: residuo?.up074 ?? "", fontSize: 10 },
                          ],
                          [
                            { text: "Outros", fontSize: 10 },
                            { text: "UP019", fontSize: 10 },
                            { text: "", fontSize: 10 },
                            { text: "UP024", fontSize: 10 },
                          ],
                          [
                            { text: "", fontSize: 10 },
                            { text: residuo?.up019 ?? "", fontSize: 10 },
                            { text: "", fontSize: 10 },
                            { text: residuo?.up024 ?? "", fontSize: 10 },
                          ],
                        ],
                      },
                      layout: "headerLineOnly",
                    },
                    {                        
                      table: {
                        headerRows: 1,
                        body: [
                            [
                                { text: 'Município', fontSize: 12, bold: true },
                                { text: 'RDO + RPU', fontSize: 12, bold: true },
                                { text: 'RSS', fontSize: 12, bold: true },
                                { text: 'RIN', fontSize: 12, bold: true },
                                { text: 'RCC', fontSize: 12, bold: true },
                                { text: 'RPO', fontSize: 12, bold: true },
                                { text: 'Outros', fontSize: 12, bold: true },
                                { text: 'Total', fontSize: 12, bold: true }
                            ],
                           
                            ...residuosRecebidos?.map(rr => [
                                { text: rr.nome_municipio || '', fontSize: 10 },
                                { text: rr.up007 || '', fontSize: 10 },
                                { text: rr.up008 || '', fontSize: 10 },
                                { text: rr.up009 || '', fontSize: 10 },
                                { text: rr.up010 || '', fontSize: 10 },
                                { text: rr.up067 || '', fontSize: 10 },
                                { text: rr.up011 || '', fontSize: 10 },
                                { text: rr.up080 || '', fontSize: 10 }
                            ])

                         ]
                      },                  
                      layout: "headerLineOnly",
                    },
                  ];
                }),
              ],
            ],
          },
          layout: "headerLineOnly",
        };
      }
    ),
  ];

  function Rodape(currentPage: string, pageCount: string) {
    return [
      {
        text: currentPage + "/" + pageCount,
        alignment: "right",
        fontSize: 10,
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
