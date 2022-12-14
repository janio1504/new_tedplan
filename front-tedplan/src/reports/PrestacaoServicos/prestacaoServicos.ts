import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

export function prestacaoServicos(dados: any, concessionarias: any, financeiro: any,
    dadosAgua: any, dadosEsgoto: any, dadosDrenagem: any, dadosResiduosColeta: any){
    pdfMake.vfs = pdfFonts.pdfMake.vfs 
    
    const reportTitle: any = [
        {
            text: 'Prestação de Serviços',
            alignment: 'center',
            fontSize: 16,
            bold: true,
            margin: [15, 20, 15, 45],
        }
    ]
    const content: any = [
       {text: 'Informações Gerais', bold: true,fontSize: 14, margin: [0, 10, 15, 0]},
       {text: 'Água e Esgoto Sanitário', bold: true,fontSize: 14, margin: [0, 10, 15, 0]},
       {
        table: {
            headerRows: 1,
            body: [
                [{text: 'Código SNIS'},{text: 'Descrição'}, {text: dados.ano}],
                ['GE05A', 'Quantidade de Municípios atendidos', dados.ge05a],
                ['GE05B','Quantidade de Municípios atendidos', dados.ge05b],
                ['GE008','Quantidade de sedes atendidas com abastecimento de água',dados.ge008ae],
                ['GE009','Quantidade de sedes atendidas com esgotamento sanitário	',dados.ge009],
                ['GE010','Quantidade de localidades atendidas com abastecimneto de água	',dados.ge010ae],
                ['GE011','Quantidade de localidades atendidas com esgotamento sanitário	',dados.ge011ae],
                ['GE019','Onde atende com abastecimento de água',dados.ge019],
                ['GE020','Onde atende com esgotamento sanitário	',dados.ge020],
                ['AG026','População urbana atendida com abastecimento de água', dados.ag026],
                ['AG001','População total atendida com abastecimento de água', dados.ag001],
                ['ES026','População urbana atendida com esgotamento sanitário', dados.es026],
                ['ES001','População total atendida com esgotamento sanitário', dados.es001],
                ['GD06A','População urbana residente no(s) município(s) com abastecimento de água	',dados.gd06a],
                ['GD06B','População urbana residente no(s) município(s) com esgotamento sanitário	',dados.gd06b],
                ['GD12A','População total residente no(s) município(s) com abastecimento de água (Fonte: IBGE)	',dados.gd12a],
                ['GD12B','População total residente no(s) município(s) com esgotamento sanitário (Fonte: IBGE)	',dados.gd12b],
                ['FN026','Quantidade de empregados próprios	',dados.fn026],
                ['GE099','Observações',dados.ge099]
                
            ]
        },
        layout: 'headerLineOnly'
       },
       {text: 'Drenagem de Águas Pluviais', bold: true,fontSize: 14, margin: [0, 10, 15, 0]},
       {
        table: {
            headerRows: 1,
            body: [
                [{text: 'Código SNIS'},{text: 'Descrição'}, {text: dados.ano}],
                ['GE001', 'Área territorial total do município (Fonte IBGE)	', dados.ge001],               
                ['GE002','Área urbana total, incluido áreas urbanas isoladas	',dados.ge002],
                ['GE007','Quantidade total de imóveis existentes na área urbana do município',dados.ge007],
                ['GE008','Quantidade total de domicilios urbanos existentes no município',dados.ge008da],
                ['GE016','Município Crítico (Fonte: CPRM)',dados.ge016],
                ['GE010','Região Hidrográfica em que se encontra o município "(Fonte:ANA)"',dados.ge010],
                ['GE011','Nome da(s) bacia(s) hidrografica(s) a que pertence o município (Fonte: ANA)',dados.ge011_1 ? "Sim" : "Não"],
                ['GE012','Existe Comitê de Bacia ou Sob-bacia Hidrográfica organizada?',dados.ge012],
                ['AD001','Quantidade de pessoal próprio alocado',dados.ad001],
                ['AD002','Quantidade de pessoal terceirizado alocado',dados.ad002],
                ['AD004','Quantidade total de pessoal alocado',dados.ad004],
                ['IE001','Existe Plano Diretor de Drenagem e Manejo das Água Pluviais Urbanas?',dados.ie001],
                ['IE012','Existe cadastro técnico de obras lineares?',dados.ie012],
                ['IE013','Existe projeto básico, executivo ou "as built" de unidades operacionais?	',dados.ie013],
                ['IE014','Existe obras ou projetos em andamento?',dados.ie014],
                ['IE016','Qual o tipo de sistema de Drenagem Urbana?',dados.ie016],
                ['IE016A','Especifique qual é o outro tipo de sistema de drenagem Urbana',dados.ie016a],
             
            ]
        },
        layout: 'headerLineOnly'
       },
       {
        table: {
            headerRows: 1,
            body: [
                [{text: 'Código SNIS'},{text: 'Descrição'}],
                ['OP001','Quais da seguintes intervenções ou manutenções foram realizadas?'],
                ['Não houve intervenção ou manutenção',dados.qp001_1 ? "Sim" : "Não"],
                ['Manutenção ou recuperação de sarjetas',dados.qp001_2 ? "Sim" : "Não"],
                ['Não houve intervenção ou manutenção',dados.qp001_3 ? "Sim" : "Não"], 
            ]
        },
        layout: 'headerLineOnly'
       },
       {
        table: {
            headerRows: 1,
            body: [
                ['OP001A', 'Especifique qual é a outra intervenção ou manutenção', dados.op001a],
            ]
        },
        layout: 'headerLineOnly'
       },
       {
        table: {
            headerRows: 1,
            body: [
                [{text: 'Código SNIS'},{text: 'Descrição'}],
                ['RI001','Indique quais das seguintes instituições existem'],
                ['Não há instituições relacionadas com à gestão de riscos ou respostas a desastres',dados.ri001_1 ? "Sim" : "Não"],
                ['Unidades de corpos de bombeiros',dados.ri001_2 ? "Sim" : "Não"],
                ['Coordenação Municipal de Defesa Civil (COMDEC)',dados.ri001_3 ? "Sim" : "Não"],
            ]
        },
        layout: 'headerLineOnly'
       },
       {
        table: {
            headerRows: 1,
            body: [
                ['RI001A', 'Especifique qual é a outra instituição que atua na prevenção', dados.ri001a],
            ]
        },
        layout: 'headerLineOnly'
       },
       {
        table: {
            headerRows: 1,
            body: [
                [{text: 'Código SNIS'},{text: 'Descrição'}],
                ['RI002','Quais da intervenções ou situações a seguir existem na área rural a montante das áreas urbanas?'],
                ['Nenhuma intervenção ou situação',dados.ri002_1 ? "Sim" : "Não"],
                ['Barragens',dados.ri002_2 ? "Sim" : "Não"],
                ['Retificações de cursos de água naturais',dados.ri002_3 ? "Sim" : "Não"],
            ]
        },
        layout: 'headerLineOnly'
       },
       {
        table: {
            headerRows: 1,
            body: [
                ['RI002A', 'Especifique qual é a outra intervenção com potencial de risco', dados.ri002a],
            ]
        },
        layout: 'headerLineOnly'
       },
       {
        table: {
            headerRows: 1,
            body: [
                [{text: 'Código SNIS'},{text: 'Descrição'}],
                ['RI003','Instrumento de controle e monitoramento hidrlólicos existentes'],
                ['Nenhum instrumento',dados.ri003_1 ? "Sim" : "Não"],
                ['Pluviômetro',dados.ri003_2 ? "Sim" : "Não"],
                ['Pluviógrafo',dados.ri003_3 ? "Sim" : "Não"],
            ]
        },
        layout: 'headerLineOnly'
       },
       {
        table: {
            headerRows: 1,
            body: [
                ['RI003A', 'Especifique qual é o outro instrumento de controle de monitoramento', dados.ri003a],
            ]
        },
        layout: 'headerLineOnly'
       },
       {
        table: {
            headerRows: 1,
            body: [
                [{text: 'Código SNIS'},{text: 'Descrição'}],
                ['RI004','Dados hidrolólicos monitorados e metodologia de monitoramento'],
                ['Quantidade chuva por registro auto..',dados.ri004_1 ? "Sim" : "Não"],
                ['Quantidade chuva por frequência diária',dados.ri004_2 ? "Sim" : "Não"],
                ['Quantidade chuva por frequência hora..',dados.ri004_3 ? "Sim" : "Não"],
            ]
        },
        layout: 'headerLineOnly'
       },
       {
        table: {
            headerRows: 1,
            body: [
                ['RI004A', 'Especifique qual é o outro dado hidrológico monitorado', dados.ri004a],
            ]
        },
        layout: 'headerLineOnly'
       },
       {
        table: {
            
            body: [
               
                ['RI005', 'Existem sistemas de alerta de riscos hidrológicos(alagamentos, enxurradas, inundaçoẽs)?	', dados.ri005], 
                ['RI007', 'Existe cadastro ou demarcação de marcas históricas de inundações?	', dados.ri007], 
                ['RI009', 'Existe mapeamento de áreas de risco de inundações dos cursos de água urbana?	', dados.ri009], 
                ['RI010', 'O mapeamento é parcial ou integral?	', dados.ri010], 
                ['RI011', 'Qual percentual de área total do município está mapeada?	', dados.ri011], 
                ['RI012', 'Tempo de recorrência(ou periodo de retorno) adotado para o mapeamento	', dados.ri012], 
                ['RI013', 'Quantidade docmicílios sujeitos a risco de inundação', dados.ri013],               
                ['GE999', 'Observações, esclarecimentos e sugestões', dados.ge999da],  
             
            ]
        },
        layout: 'headerLineOnly'
       },

       {text: 'Dados hidrográficos', bold: true,fontSize: 14, margin: [0, 10, 15, 0]},
       {
        table: {
            headerRows: 1,
            body: [
                [{text: 'Código SNIS'},{text: 'Descrição'}, {text: dados.ano}],
                ['GE201', 'O oŕgão(Prestador) é também o prestador - direto ou indireto - de outros serviços de Saneamento?	', dados.ge201],               
                ['GE202','Há empresa com contrato de DELEGAÇÂO (conceção ou contrato de programa) para algum ou todos os serviços de limpeza urbana?',dados.ge202],
               
            ]
        },
        layout: 'headerLineOnly'
       },
       {
        table: {
            headerRows: 1,
            body: [   
                [{text: 'Dados das CONCESSIONARIAS'}],            
                [concessionarias.map((value: { razao_social: string; cnpj: string; ano_inicio: string; duracao: string; vigente: string; capina_e_rocada: string; coleta_res_construcao_civil: string; coleta_res_domiciliar: string; coleta_res_servicos_saude: string; coleta_res_publico: string; operacao_aterro_sanitario: string; operacao_incinerador: string; operacao_outras_unidades_processamento: string; operacao_unidade_compostagem: string; operacao_triagem: string; outros: string; tipo_desconhecido: string; varricao_logradouros_publicos: string })=>(                    
                    [                                                 
                        ['Razão Social Concessionária: '+ value.razao_social],
                        ['CNPJ: '+ value.cnpj],
                        ['Ano de inicio: '+ value.ano_inicio],
                        ['Duração(em anos): '+ value.duracao],
                        ['Vigente?: '+ value.vigente],
                        ['Capina e roçada: '+ value.capina_e_rocada],
                        ['Coleta de res. contrucão civil: '+ value.coleta_res_construcao_civil],
                        ['Coleta de res. Domiciliar: '+ value.coleta_res_domiciliar],
                        ['Coleta de res. dos Serviços da Saúde:'+ value.coleta_res_servicos_saude],
                        ['Coleta de res. Público:'+ value.coleta_res_publico],
                        ['Operação de aterro sanitário:'+ value.operacao_aterro_sanitario],
                        ['Operação de incinerador:'+ value.operacao_incinerador],
                        ['Operação de outras unidades de processamento:'+ value.operacao_outras_unidades_processamento],
                        ['Operação de unidade de compostagem:'+ value.operacao_unidade_compostagem],
                        ['Operação de triagem:'+ value.operacao_triagem],
                        ['Outros:'+ value.outros],
                        ['Tipo desconhecido:'+ value.tipo_desconhecido],
                        ['Varrição de logradouros públicos:'+ value.varricao_logradouros_publicos],


                        ['-----------------------------------------------------------------------------------------------------------']
                    ]
                ))]
            ]
        },
        layout: 'headerLineOnly'
       },

       {
        table: {
            headerRows: 1,
            body: [
                [{text: 'Código SNIS'},{text: 'Descrição'}, {text: dados.ano}],
                ['CO164', 'População total atendida no município', dados.co164],               
                ['CO050','População urbana atendida no município, abrangendo sede e localidades	',dados.co050],
                ['CO165','População urbana atendida pelo serviço de coleta domiciliar direta, ou seja, porta a porta	',dados.co165],
                ['CO147','População rural atendida com serviço de coleta domiciliar	',dados.co147],
                ['CO134','Percentual da população atendida com frequência diária',dados.co134],
                ['CO135','Percentual da população atendida com frequência de 2 a 3 vezes por semana',dados.co135],
                ['CO136','Percentual da população atendida com frequência de 1 veze por semana',dados.co136],
                ['CS050','Percentual da população atendida com a COLETA SELETIVA de porta a porta',dados.cs050],
                ['CO162','Valor contratual (Preço unitario) do serviço de aterramento de RDO e RDU',dados.co162],
                ['CO178','Percentual da população atendida com a COLETA SELETIVA de porta a porta',dados.co178],
                ['GE999','Observações, esclarecimentos e sugestões',dados.ge999dh],

             
            ]
        },
        layout: 'headerLineOnly'
       },



       {text: 'Informações Financeiras', bold: true,fontSize: 14, margin: [0, 10, 15, 0]},
       {text: 'Água e Esgoto Sanitário', bold: true,fontSize: 14, margin: [0, 10, 15, 0]},
       {
        table: {
            headerRows: 1,
            body: [
                [{text: 'Código SNIS'},{text: 'Descrição'}, {text: dados.ano}],
                ['FN002', 'Receita operacional direta de Água', financeiro.fn002],
                ['FN003', 'Receita operacional direta de Esgoto', financeiro.fn003],
                ['FN007', 'Receita operacional direta de Água exportada (Bruta ou Tratada)', financeiro.fn007],
                ['FN038', 'Receita operacional direta - Esgoto bruto importado', financeiro.fn038],
                ['FN001', 'Receita operacional direta de Total', financeiro.fn001],
                ['FN004', 'Receita operacional indireta', financeiro.fn004],
                ['FN005', 'Receita operacional Total (Direta + Indireta)', financeiro.fn005], 
                ['FN006', 'Arrecadação total operacional indireta', financeiro.fn006],
                ['FN008', 'Créditos de contas a receber', financeiro.fn008],
                ['FN010', 'Despesa com pessoal próprio', financeiro.fn010],
                ['FN011', 'Despesa com produtos químicos', financeiro.fn011],
                ['FN013', 'Despesa com energia elétrica', financeiro.aes_fn013],
                ['FN014', 'Despesa com serviços de terceiros', financeiro.fn014],
                ['FN020', 'Despesa com água importada (Bruta ou tratada)', financeiro.aes_fn020], 
                ['FN039', 'Despesa com esgoto exportado', financeiro.fn039],
                ['FN021', 'Despesas fiscais ou tributarias computadas na dex', financeiro.aes_fn021],
                ['FN027', 'Outras despesas de exploração', financeiro.fn027],
                ['FN015', 'Despesas de exploração (DEX)', financeiro.aes_fn015],
                ['FN035', 'Despesas com juros e encargos do serviço da divida', financeiro.fn035],
                ['FN036', 'Despesas com variações monetárias e cambiais das dividas', financeiro.fn036],
                ['FN016', 'Despesas com juros e encargos do serviço da divida', financeiro.fn016], 
                ['FN019', 'Despesas com depreciação, amortização do ativo deferido', financeiro.aes_fn019],
                ['FN022', 'Despesas fiscais ou tributarias não computadas na dex', financeiro.aes_fn022],
                ['FN028', 'Outras depesas com os servicos', financeiro.fn028],
                ['FN017', 'Despesas totais com os serviços (DTS)', financeiro.aes_fn017],
                ['FN034', 'Despesa com amortização do serviço da dívida', financeiro.fn034],
                ['FN037', 'Despesas totais com o serviço da dívida', financeiro.fn037],                 
                ['FN018','Despesas capitalizáveis realizadas pelo prestador de serviços',financeiro.fn018],
                ['FN023','Investimentos realizados em abastecimento de água pelo prestador de serviços',financeiro.fn023],
                ['FN024','Despesa com água importada (Bruta ou Tratada)',financeiro.fn024],
                ['FN025','Outros investimentos realizados pelo prestador de serviços',financeiro.fn025],
                ['FN030','Investimento com recursos próprios realizado pelo prestador de serviços',financeiro.fn030],
                ['FN031','nvestimento com recursos onerosos realizado pelo prestador de serviços',financeiro.fn031],
                ['FN032','Investimento com recursos não onerosos realizado pelo prestador de serviços',financeiro.fn032],
                ['FN033','Investimentos totais realizados pelo prestador de serviços',financeiro.fn033],
                ['FN041','Despesas capitalizáveis realizadas pelo munícipio',financeiro.fn041],
                ['FN042','Investimentos realizados em abastecimento de água pelo munícipio',financeiro.fn042],
                ['FN043','Investimentos realizados em esgotamento sanitário pelo munícipio',financeiro.fn043],
                ['FN044','Outros investimentos realizados pelo munícipio',financeiro.fn044],
                ['FN045','Investimento com recursos próprios realizado pelo munícipio',financeiro.fn045],
                ['FN046','Investimento com recursos onerosos realizado pelo munícipio',financeiro.fn046],
                ['FN047','Investimento com recursos não onerosos realizado pelo munícipio',financeiro.fn047],
                ['FN048','Investimentos totais realizados pelo munícipio',financeiro.fn048],
                ['FN051','Despesas capitalizáveis realizadas pelo estado',financeiro.fn051],
                ['FN052','Investimentos realizados em abastecimento de água pelo estado',financeiro.fn052],
                ['FN053','Investimentos realizados em esgotamento sanitário pelo estado',financeiro.fn053],
                ['FN054','Outros investimentos realizados pelo estado',financeiro.fn054],
                ['FN055','Investimento com recursos próprios realizado pelo estado',financeiro.fn055],
                ['FN056','Investimento com recursos onerosos realizado pelo estado',financeiro.fn056],
                ['FN057','Investimento com recursos não onerosos realizado pelo estado',financeiro.fn057],
                ['FN058','Investimentos totais realizados pelo estado',financeiro.fn048],
                ['FN098','Campo de justificativa',financeiro.fn098],
                ['FN099','Observações',financeiro.fn099],
                
            ]
        },
        layout: 'headerLineOnly'
       },

       
       {text: 'Drenagem e Águas Pluviais', bold: true,fontSize: 14, margin: [0, 10, 15, 0]},
       {
        table: {
            headerRows: 1,
            body: [
                [{text: 'Código SNIS'},{text: 'Descrição'}, {text: dados.ano}],
                ['CB001', 'Existe alguma forma de cobrança pelos serviços de drenagem e manejo das APU', financeiro.cb001],
                ['CB002', 'Qual é a forma de cobrança adotada?', financeiro.cb002],
                ['CB002A', 'Especifique qual é a forma de cobrança adotada', financeiro.cb002a],
                ['CB003', 'Quantidade total de imóveis urbanos tributados pelos serviços de drenagem das APU', financeiro.cb003],
                ['CB004', 'Valor cobrado pelos serviços de Drenagem e Manejo das APU por ímovel urbano', financeiro.cb004],
                ['CB999', 'Observações, esclarecimentos ou sugestões', financeiro.cb999],
                ['FN003', 'Receita total (Saúde, Educação, Pagamento de pessoal, etc...)', financeiro.fn003],
                ['FN004', 'Fontes de recursos para custeio dos serviços de drenagem e manejo de APU', financeiro.fn004],
                ['FN004A', 'Especifique qual é a outra fonte de recursos para custeio dos serviços', financeiro.fn004a],
                ['FN005', 'Receita operacional total dos serviços de drenagem e manejo de APU', financeiro.fn005],
                ['FN008', 'Receita não operacional total dos serviços de drenagem e manejo de APU', financeiro.fn008],
                ['FN009', 'Receita total serviços de drenagem e manejo de APU', financeiro.fn009],
                ['FN012', 'Despesa total do município (Saúde, Educação, pagamento de pessoal, etc...)', financeiro.fn012],
                ['FN013', 'Despesas de Exploração(DEX) diretas ou de custeio total dos serviços de Drenagem e Manejo de APU', financeiro.fn013],
                ['FN015', 'Despesa total com serviço da dívida para os serviços de drenagem e Manejo de APU', financeiro.fn015],
                ['FN016', 'Despesa total com serviços de Drenagem e Manejo de APU', financeiro.fn016],
                ['FN024', 'Investimento com recursos próprios em Drenagem e Manejo das APU contratados pelo município no ano de referência', financeiro.fn024],
                ['FN018', 'Investimento com recursos onerosos em Drenagem e Manejo das APU contratados pelo município no ano de referência', financeiro.fn018],
                ['FN020', 'Investimento com recursos não onerosos em Drenagem e Manejo das APU contratados pelo município no ano de referência', financeiro.fn020],
                ['FN022', 'Investimento total em Drenagem das APU contratado pelo município no ano de referência', financeiro.fn022],
                ['FN017', 'Desembolsos de investimentos com recursos próprios em Drenagem e Manejo das APU realizados pelo Município no ano de referência', financeiro.fn017],
                ['FN019', 'Desembolsos de investimentos com recursos onerosos em Drenagem e Manejo das APU realizados pelo Município no ano de referência', financeiro.fn019],
                ['FN021', 'Desembolsos de investimentos com recursos não onerosos em Drenagem e Manejo das APU realizados pelo Município no ano de referência', financeiro.fn021],
                ['FN023', 'Desembolsos total de investimentos em Drenagem e Manejo das APU realizados pelo Município no ano de referência', financeiro.fn023],
                ['FN999', 'Observações, esclarecimentos ou sugestões', financeiro.drenagem_fn999],
           
            ]
        },
        layout: 'headerLineOnly'
       },


       {text: 'Resíduos Sólidos', bold: true,fontSize: 14, margin: [0, 10, 15, 0]},
       {
        table: {
            headerRows: 1,
            body: [
                [{text: 'Código SNIS'},{text: 'Descrição'}, {text: dados.ano}],
                ['FN201', 'A prefeitura (prestadora) cobra pelos serviços de coleta regular, transporte e destinação final de RSU?', financeiro.fn201],
                ['FN202', 'Principal forma adotada', financeiro.fn202],
                ['FN203', 'Descrição da outra forma adotada', financeiro.fn203],
                ['FN204', 'Unidade adotada para a cobrança (No caso de tarifa)', financeiro.fn204],
                ['FN205', 'A prefeitura cobra pela prestação de serviços especiais ou eventuais de manejo de RSU?', financeiro.fn205],
                ['FN206', 'Despesa dos agentes públicos com o serviço de coleta de RDO e RPU', financeiro.fn201],
                ['FN207', 'Despesa com agentes privados para execução do serviço de coleta de RDO e RPU', financeiro.fn207],
                ['FN208', 'Despesa com o serviço de coleta de RDO e RPU', financeiro.fn208],
                ['FN209', 'Despesa com agentes públicos com a coleta RSS', financeiro.fn209],
                ['FN210', 'Despesa com empresas contratadas para coleta RSS', financeiro.fn210],
                ['FN211', 'Despesa total com a coleta RSS', financeiro.fn211],
                ['FN212', 'Despesa dos agentes públicos com o serviço de varrição', financeiro.fn212],
                ['FN213', 'Despesa com empresas contratadas para o serviço de varrição', financeiro.fn213],
                ['FN214', 'Despesa total com serviço de varrição', financeiro.fn214],
                ['FN215', 'Despesas com agentes públicos executores dos demais serviços quando não especificado sem campo próprio', financeiro.fn215],
                ['FN216', 'Despesas com agentes privados executores dos demais serviços quando não especificado sem campo próprio', financeiro.fn216],
                ['FN217', 'Despesas total com todos os agentes executores dos demais serviços quando não especificado sem campo próprio', financeiro.fn217],
                ['FN218', 'Despesa dos agentes públicos executores de serviços de manejo de RSU', financeiro.fn218],
                ['FN219', 'Despesa dos agentes privados executores de serviços de manejo de RSU', financeiro.fn219],
                ['FN220', 'Despesa total com os serviços de manejo de RSU', financeiro.fn220],
                ['FN223', 'Despesa corrente da prefeitura durante o ano com todos os serviços do município (Saúde, educação, pagamento de pessoal, etc...)', financeiro.fn223],
                ['FN221', 'Receita orçada com a cobrança de taxas e tarifas referentes á getão e manejo de RSU', financeiro.fn221],
                ['FN222', 'Receita arrecadada com taxas e tarifas referentes á gestão e manejo de RSU', financeiro.fn222],
                ['FN224', 'A prefeitura recebeu algum recurso federal para aplicação no setor de manejo de RSU?', financeiro.fn224],
                ['FN225', 'Valor repassado', financeiro.fn225],
                ['FN226', 'Tipo de recurso', financeiro.fn226],
                ['FN227', 'Em que foi aplicado o recurso?', financeiro.fn227],
                ['FN999', 'Observações, esclarecimentos ou sugestões	', financeiro.residuos_fn999],
              
           
            ]
        },
        layout: 'headerLineOnly'
       },

       {text: 'Água', bold: true,fontSize: 14, margin: [0, 10, 15, 0]},
       {
        table: {
            headerRows: 1,
            body: [
                [{text: 'Código SNIS'},{text: 'Descrição'}, {text: dados.ano}],
                ['AG021', 'Quantidade de ligações totais de água', dadosAgua.ag021],
                ['AG002','Quantidade de ligações ativas de água',dadosAgua.ag002],
                ['AG004','Quantidade de ligações ativas de água micromedidas',dadosAgua.ag004],
                ['AG003','Quantidade de economias ativas de água',dadosAgua.ag003],
                ['AG014','Quantidade de economias ativas de água micromedidas',dadosAgua.ag014],
                ['AG013','Quantidade de economias residenciais ativas de água',dadosAgua.ag013],
                ['AG022','Quantidade de economias residenciais ativas de água micromedidas',dadosAgua.ag022],
                ['AG006','Volume de água produzido',dadosAgua.ag006],
                ['AG024','Volume de água de serviço',dadosAgua.ag024],
                ['AG016','Volume de água bruta importado',dadosAgua.ag016],
                ['AG018','Volume de água tratada importado',dadosAgua.ag018],
                ['AG017','Volume de água bruta exportado',dadosAgua.ag017],
                ['AG019','Volume de água tratada exportado',dadosAgua.ag019],
                ['AG007','Volume de água tratada em ETA(s)',dadosAgua.ag007],
                ['AG015','Volume de água de água tratada por simples desinfecção',dadosAgua.ag015],
                ['AG027','Volume de água fluoretada',dadosAgua.ag027],
                ['AG012','Volume de água macromedida',dadosAgua.ag012],
                ['AG008','Volume de água micromedida',dadosAgua.ag008],
                ['AG010','Volume de água consumido',dadosAgua.ag010],
                ['AG011','Volume de água faturado',dadosAgua.ag011],
                ['AG020','Volume micromedido nas economias residenciais de água',dadosAgua.ag020],
                ['AG005','Extenção da rede de água',dadosAgua.ag005],
                ['AG028','Consumo total de energia elétrica nos sistemas de água',dadosAgua.ag028],
                ['AG098','Campo de justificativa',dadosAgua.ag098],
                ['AG099','Observações',dadosAgua.ag099],
                
            ]
        },
        layout: 'headerLineOnly'
       },

       {text: 'Esgoto', bold: true,fontSize: 14, margin: [0, 10, 15, 0]},
       
       {
        table: {
            headerRows: 1,
            body: [
                [{text: 'Código SNIS'},{text: 'Descrição'}, {text: dados.ano}],
                ['ES009', 'Quantidade de ligações totais de esgoto', dadosEsgoto.es009 ],
                ['ES002', 'Quantidade de ligações ativas de esgoto', dadosEsgoto.es002 ],
                ['ES003', 'Quantidade de economias ativas de esgoto', dadosEsgoto.es003 ],
                ['ES008', 'Quantidade de economias residenciais ativas de esgoto', dadosEsgoto.es008 ],
                ['ES005', 'Volume de esgoto coletado', dadosEsgoto.es005 ],
                ['ES006', 'Volume de esgoto tratado', dadosEsgoto.es006 ],
                ['ES007', 'Volume de esgoto faturado', dadosEsgoto.es007 ],
                ['ES012', 'Volume de esgoto bruto exportado', dadosEsgoto.es012 ],
                ['ES015', 'Volume de esgoto bruto tratado nas instalações do importador', dadosEsgoto.es015 ],
                ['ES004', 'Extenção da rede', dadosEsgoto.es004 ],
                ['ES028', 'Consumo total de energia elétrica nos sistemas de água', dadosEsgoto.es028 ],
                ['ES098', 'Campo de justificativa', dadosEsgoto.es098 ],
                ['ES099', 'Observações', dadosEsgoto.es099 ],
               
               
            ]
        },
        layout: 'headerLineOnly'
       },

      
        {text: 'Drenagem e Águas Pluviais', bold: true,fontSize: 14, margin: [0, 10, 15, 0]},
        {
         table: {
             headerRows: 1,
             body: [
                 [{text: 'Código SNIS'},{text: 'Descrição'}, {text: dados.ano}],
                 ['IE017', 'Extensão total das vias públicas urbanas', dadosDrenagem.ie017 ],
                 ['IE018', 'Extensão total das vias públicas urbanas implantadas', dadosDrenagem.ie018 ],
                 ['IE019', 'Extensão total das vias públicas com pavimento e meio-fio(ou semelhante)', dadosDrenagem.ie019 ],
                 ['IE020', 'Extensão total das vias públicas com pavimento e meio-fio(ou semelhante) implantadas no ano de referência', dadosDrenagem.ie020 ],
                 ['IE021', 'Quantidade de bocas de lobo existentes', dadosDrenagem.ie021 ],
                 ['IE022', 'Quantidade de bocas de leão ou de bocas de lobo múltiplas(duas ou mais bocas de lobo conjugadas) existentes', dadosDrenagem.ie022 ],
                 ['IE023', 'Quantidade de poços de visita (PV) existentes', dadosDrenagem.ie023 ],
                 ['IE024', 'Extensão total das vias públicas urbanas com redes de águas pluviais subterrâneos', dadosDrenagem.ie024 ],
                 ['IE025', 'Extensão total das vias públicas urbanas com redes de águas pluviais subterrâneos implantados no ano de referência', dadosDrenagem.ie025 ],
                 ['IE026', 'Existem vias públicas urbanas com canais artificiais abertos?', dadosDrenagem.ie026 ],
                 ['IE027', 'Existem vias públicas urbanas com soluções de drenagem natural(faixas ou valas de infiltração)?', dadosDrenagem.ie027 ],
                 ['IE028', 'Extensão total das vias públicas urbanas com soluções de drenagem natural(faixas ou valas de infiltração)', dadosDrenagem.ie028 ],
                 ['IE029', 'Existem estenções elevatórias de águas pluviais na rede de drenagem?', dadosDrenagem.ie029 ],
                 ['IE032', 'Extensão total dos Cursos d’água naturais perenes', dadosDrenagem.ie032 ],
                 ['IE040', 'Extensão total dos Cursos d’água naturais perenes copm outro tipo de intervenção', dadosDrenagem.ie040 ],
                 ['IE033', 'Extensão total dos Cursos d’água naturais perenes com diques', dadosDrenagem.ie033 ],
                 ['IE034', 'Extensão total dos Cursos d’água naturais perenes canalizados abertos', dadosDrenagem.ie034 ],
                 ['IE035', 'Extensão total dos Cursos d’água naturais perenes canalizados fechados', dadosDrenagem.ie035 ],
                 ['IE036', 'Extensão total dos Cursos d’água naturais perenes com retificação', dadosDrenagem.ie036 ],
                 ['IE037', 'Extensão total dos Cursos d’água naturais perenes com desenrocamento ou rebaixamento do leito', dadosDrenagem.ie037 ],
                 ['IE041', 'Existe serviço de drenagem ou desassoreamento dos Cursos d’água naturais perenes?', dadosDrenagem.ie041 ],
                 ['IE044', 'Extensão total de parques lineares ao longo de Cursos d’água perenes', dadosDrenagem.ie044 ],
                 ['IE050', 'Existem algum tipo de tratamento das águas pluviais?', dadosDrenagem.ie050 ],
                 ['IE050A', 'Especifique qual é o outro tipo de tratamento das águas pluviais', dadosDrenagem.ie050a ],
                 ['IE999', 'Observações, esclarecimentos ou sugestões', dadosDrenagem.ie999 ],
                 ['RI023', 'Numero de enxurradas na área urbana do município', dadosDrenagem.ri023 ],
                 ['RI025', 'Numero de alagementos na área urbana do município', dadosDrenagem.ri025 ],
                 ['RI027', 'Numero de inundações na área urbana do município', dadosDrenagem.ri027 ],
                 ['RI029', 'Numero de pessoas desabrigadas ou desalojadas, na área urbana do município', dadosDrenagem.ri029 ],
                 ['RI031', 'Numero de óbitos, na área urbana do município', dadosDrenagem.ri031 ],
                 ['RI032', 'Numero de imóveis urbanos atingidos', dadosDrenagem.ri032 ],
                 ['RI042', 'Houve alojamento ou reassentamento de população residente em área de risco hidrológico, durante ou após eventos hidrológicos impactantes', dadosDrenagem.ri042 ],
                 ['RI043', 'Quantidade de pessoas tranferidas para habitações provisórias durante ou após os eventos hidrológicos impactantes', dadosDrenagem.ri043 ],
                 ['RI044', 'Quantidade de pessoas realocadas para habitações permanentes durante ou após os eventos hidrológicos impactantes', dadosDrenagem.ri044 ],
                 ['RI045', 'Houve atuação (federal, estadual ou municipal) para reassentamento da população e/ou para recuperação de imóveis urbanos afetados por eventos hidrológicos impactantes?', dadosDrenagem.ri045 ],
                 ['RI999', 'Observações, esclarecimentos ou sugestões', dadosDrenagem.ri999 ],
               
                 
                
                 
             ]
         },
         layout: 'headerLineOnly'
        },

        {text: 'Resíduos Sólidos Coleta', bold: true,fontSize: 14, margin: [0, 10, 15, 0]},
       {
        table: {
            headerRows: 1,
            body: [
                [{text: 'Código SNIS'},{text: 'Descrição'}, {text: dados.ano}],
                ['TB001', 'Coletores e Motoristas de agentes PÚBLICOS, alocados na coleta', dadosResiduosColeta.tb001],
                ['TB003', 'Agentes PÚBLICOS envolvidos na varrição', dadosResiduosColeta.tb003],
                ['TB005', 'Agentes PÚBLICOS envolvidos com a capina e roçada', dadosResiduosColeta.tb005],
                ['TB007', 'Agentes PÚBLICOS alocados nas unidades de manejo, tratamento ou disposição final', dadosResiduosColeta.tb007],
                ['TB009', 'Agentes PÚBLICOS envolvidos nos demais serviços quando não especificados acima', dadosResiduosColeta.tb009],
                ['TB011', 'Agentes PÚBLICOS alocados na Gerencia ou Administração(Planejamento ou Fiscalização)', dadosResiduosColeta.tb011],
                ['TB013', 'Total de Agentes PÚBLICOS envolvidos', dadosResiduosColeta.tb013],
                ['TB002', 'Coletores e Motoristas de agentes PRIVADOS, alocados na coleta', dadosResiduosColeta.tb002],
                ['TB004', 'Agentes PRIVADOS envolvidos na varrição', dadosResiduosColeta.tb004],
                ['TB006', 'Agentes PRIVADOS envolvidos com a capina e roçada', dadosResiduosColeta.tb006],
                ['TB008', 'Agentes PRIVADOS alocados nas unidades de manejo, tratamento ou disposição final', dadosResiduosColeta.tb008],
                ['TB010', 'Agentes PRIVADOS envolvidos nos demais serviços quando não especificados acima', dadosResiduosColeta.tb010],
                ['TB012', 'Agentes PRIVADOS alocados na Gerencia ou Administração(Planejamento ou Fiscalização)', dadosResiduosColeta.tb012],
                ['TB014', 'Total de Agentes PRIVADOS envolvidos', dadosResiduosColeta.tb014],
                ['TB015', 'Total de trabalhadores envolvidos nos servicos de Manejo de RSU', dadosResiduosColeta.tb015],
                ['TB016', 'Existem frentes de trabalho temporário?', dadosResiduosColeta.tb016],
                ['TB017', 'Quantidades de trabalhadores Frente !', dadosResiduosColeta.tb017],
                ['TB020', 'Duração de frente 1', dadosResiduosColeta.tb020],
                ['TB023', 'Atuam em mais de um tipo de serviço, Frente 1?', dadosResiduosColeta.tb023],
                ['TB026', 'Tipo de serviço predominate de Frente 1', dadosResiduosColeta.tb026],
                ['TB018', 'Quantidade de trabalhadores Frente 2', dadosResiduosColeta.tb018],
                ['TB021', 'Duração de Frente 2', dadosResiduosColeta.tb021],
                ['TB024', 'Atuam em mais de um tipo de serviço, Frente 2?', dadosResiduosColeta.tb024],
                ['TB027', 'Tipo de serviço predominante da Frente 2', dadosResiduosColeta.tb027],
                ['TB019', 'Quantidade de trabalhadores Frente 3', dadosResiduosColeta.tb019],
                ['TB022', 'Duração de Frente 3', dadosResiduosColeta.tb022],
                ['TB025', 'Atuam em mais de um tipo de serviços, Frente 3?', dadosResiduosColeta.tb025],
                ['TB028', 'Tipo de serviços predominante da Frente 3', dadosResiduosColeta.tb028],
                           
                
            ]
        },
        layout: 'headerLineOnly'
       },

       {text: 'Frota de coleta domiciliar e pública', bold: true,fontSize: 14, margin: [0, 10, 15, 0]},      
       {
        table: {
            headerRows: 1,
            body: [
                [{text: 'Tipo de veiculos(Quant.)'},{text: ''},{text: 'Prefeitura SLU'},{text: ''},{text: ''}, {text: 'Empr. Contratada'},{text: ''}],
                [' ', '0 a 5 anos', '5 a 10 anos','Maior que 10 anos','0 a 5 anos','5 a 10 anos','Maior que 10 anos' ],
                [' ', 'CO054', 'CO055','CO056','CO057','CO058','CO059' ],
                ['Caminhão compactador', dadosResiduosColeta.co054, dadosResiduosColeta.co055
                ,dadosResiduosColeta.co056,dadosResiduosColeta.co057,dadosResiduosColeta.co058,dadosResiduosColeta.co059 ],
                [' ', 'CO063', 'CO064','CO065','CO066','CO067','CO068' ],
                ['Caminhão basculante, baú ou carroceria', dadosResiduosColeta.co063, dadosResiduosColeta.co064
                ,dadosResiduosColeta.co065,dadosResiduosColeta.co066,dadosResiduosColeta.co067,dadosResiduosColeta.co068 ],
                [' ', 'CO072', 'CO073','CO074','CO075','CO076','CO077' ],
                ['Caminhão poliguindastes (brook)', dadosResiduosColeta.co072, dadosResiduosColeta.co073
                ,dadosResiduosColeta.co074,dadosResiduosColeta.co075,dadosResiduosColeta.co076,dadosResiduosColeta.co077 ],
                [' ', 'CO071', 'CO082','CO083','CO084','CO085','CO086' ],
                ['Trator agrícola com reboque', dadosResiduosColeta.co071, dadosResiduosColeta.co082
                ,dadosResiduosColeta.co083,dadosResiduosColeta.co084,dadosResiduosColeta.co085,dadosResiduosColeta.co086 ],
                [' ', 'CO090', 'CO091','CO092','CO093','CO094','CO095' ],
                ['Tração animal', dadosResiduosColeta.co090, dadosResiduosColeta.co091
                ,dadosResiduosColeta.co092,dadosResiduosColeta.co093,dadosResiduosColeta.co094,dadosResiduosColeta.co095 ],
                [' ', 'CO155', 'CO156','CO157','CO158','CO159','CO160' ],
                ['Tração animal', dadosResiduosColeta.co155, dadosResiduosColeta.co156
                ,dadosResiduosColeta.co157,dadosResiduosColeta.co158,dadosResiduosColeta.co159,dadosResiduosColeta.co160 ],
            ]
        },
        layout: 'headerLineOnly'
       },

            
       {
        table: {
            headerRows: 1,
            body: [
                
                ['CO163','Outros veículos', dadosResiduosColeta.co163],
               
            ]
        },
        layout: 'headerLineOnly'
       },

       
       {
        table: {
            headerRows: 1,
            body: [
                [{text: 'Código SNIS'},{text: 'Descrição'}, {text: ''}],
                ['CO154', 'Os residuos provenientes da varrição ou limpeza de logradouros públicos são recolhidos junto com os residuos domiciliares?', dadosResiduosColeta.co154 ],
                ['CO012', 'Valor contratado (preço unitário) do serviço de RDO e RPU diurna', dadosResiduosColeta.co012 ],
                ['CO146', 'Valor contratual (preço unitário) do serviço de transporte de RDO e RPU até a unidade de destinação final', dadosResiduosColeta.co146 ],
                ['CO148', 'No preço acima está incluido o transporte de RDO e RPU coletados até a destinação final?', dadosResiduosColeta.co148 ],
                ['CO149', 'A distancia média do centro de massa à unidade de destinação final é superior a 15 km?', dadosResiduosColeta.co149 ],
                ['CO150', 'Especifique a distancia do centro de massa à unidade de destinação final superior a 15km', dadosResiduosColeta.co150 ],
                ['CO151', 'A distancia média de transporte à unidade de destinação final é superior a 15km?', dadosResiduosColeta.co151 ],
                ['CO152', 'Especifique a distancia de transporte à unidade de destinação final superior a 15km', dadosResiduosColeta.co152 ],
            ]
        },
        layout: 'headerLineOnly'
       },

       {
        table: {
            headerRows: 1,
            body: [
                [{text: 'Tipo de resíduos(Quantidade em toneladas)'},{text: 'Prefeitura ou SLU'}
                ,{text: 'Empresas ou autônomos contratados'},{text: 'Assoc. ou Coop. de Catadores c/ coleta seletiva'}
                ,{text: 'Outros (inclusive proprios gerad. exceto catadores)'}, {text: 'Total'}],                
                [' ', 'CO108', 'CO109','CS048','CO140','CO111' ],
                ['Domiciliar e Comercial', dadosResiduosColeta.co108, dadosResiduosColeta.co109
                ,dadosResiduosColeta.cs048,dadosResiduosColeta.co140,dadosResiduosColeta.co111 ],
                [' ', 'CO112', 'CO113',' ','CO141','CO115' ],
                ['Público(Limpeza de logradouros)', dadosResiduosColeta.co112, dadosResiduosColeta.co113
                ,' ',dadosResiduosColeta.co141,dadosResiduosColeta.co115 ],
                [' ', 'CO116', 'CO117','CS048','CO142','CO119' ],
                ['Total', dadosResiduosColeta.co116, dadosResiduosColeta.co117
                ,dadosResiduosColeta.cs048,dadosResiduosColeta.co142,dadosResiduosColeta.co117 ],
              
            ]
        },
        layout: 'headerLineOnly'
       },

       {
        table: {
            headerRows: 1,
            body: [
                [{text: 'Código SNIS'},{text: 'Descrição'}, {text: ''}],
                ['CO021', 'É utilizada balança para pesagem rotineira dos residuos sólidos coletados?', dadosResiduosColeta.co021 ],
                ['CO019', 'Os resíduos sólidos DOMICILIARES coletados são enviados para outro município?', dadosResiduosColeta.co019 ],
                ['CO020', 'Município(s) de destino de RDO e RPU exportado', '' ],
               
            ]
        },
        layout: 'headerLineOnly'
       },
       {
        table: {
            headerRows: 1,
            body: [   
                [{text: 'Municípios'}],            
                [concessionarias.map((value: { razao_social: string; cnpj: string; ano_inicio: string; duracao: string; vigente: string; capina_e_rocada: string; coleta_res_construcao_civil: string; coleta_res_domiciliar: string; coleta_res_servicos_saude: string; coleta_res_publico: string; operacao_aterro_sanitario: string; operacao_incinerador: string; operacao_outras_unidades_processamento: string; operacao_unidade_compostagem: string; operacao_triagem: string; outros: string; tipo_desconhecido: string; varricao_logradouros_publicos: string })=>(                    
                    [                                                 
                        ['Razão Social Concessionária: '+ value.razao_social],
                        ['CNPJ: '+ value.cnpj],
                        ['Ano de inicio: '+ value.ano_inicio],
                        ['Duração(em anos): '+ value.duracao],
                        ['Vigente?: '+ value.vigente],
                        ['Capina e roçada: '+ value.capina_e_rocada],
                        ['Coleta de res. contrucão civil: '+ value.coleta_res_construcao_civil],
                        ['Coleta de res. Domiciliar: '+ value.coleta_res_domiciliar],
                        ['Coleta de res. dos Serviços da Saúde:'+ value.coleta_res_servicos_saude],
                        ['Coleta de res. Público:'+ value.coleta_res_publico],
                        ['Operação de aterro sanitário:'+ value.operacao_aterro_sanitario],
                        ['Operação de incinerador:'+ value.operacao_incinerador],
                        ['Operação de outras unidades de processamento:'+ value.operacao_outras_unidades_processamento],
                        ['Operação de unidade de compostagem:'+ value.operacao_unidade_compostagem],
                        ['Operação de triagem:'+ value.operacao_triagem],
                        ['Outros:'+ value.outros],
                        ['Tipo desconhecido:'+ value.tipo_desconhecido],
                        ['Varrição de logradouros públicos:'+ value.varricao_logradouros_publicos],


                        ['-----------------------------------------------------------------------------------------------------------']
                    ]
                ))]
            ]
        },
        layout: 'headerLineOnly'
       },
       
    ]
   
    
    function Rodape(currentPage: string, pageCount: string){
        return [
            {
                text: currentPage + "/" + pageCount,
                alignment: 'right',
                fontSize: 12,
                margin: [0, 10, 20, 0],
            }
        ]
    }

    const docConfig: any = {
        page: 'A4',
        margin: [15, 50, 15, 40],
        header: [reportTitle],
        content: [content],
        footer: Rodape
    }

    

    pdfMake.createPdf(docConfig).open()

}