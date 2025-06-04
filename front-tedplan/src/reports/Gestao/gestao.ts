import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

const PATH_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/pdf/'

export function gestaoPDF(gestao: any, listParticipacoes: any, listPlanos: any, listPoliticas: any, representantes: any){
    pdfMake.vfs = pdfFonts.vfs
    
    const reportTitle: any = [
        {
            text: 'Gestão',
            alignment: 'center',
            fontSize: 16,
            bold: true,
            margin: [15, 20, 15, 45],
        }
    ]
    const content: any = [
       {text: 'Gestão Associada', bold: true,fontSize: 14, margin: [0, 10, 15, 0]},
       {
        table: {
            headerRows: 1,
            body: [
                [{text: 'Descrição'},{text: 'Valor'}],
                ['Nome da associação: ', gestao[0].ga_nome],
                ['Norma da associação: ', gestao[0].ga_norma],
                ['Saneamento Rural: ', gestao[0].sr_descricao],
                ['Comunidades Tradicionais: ', gestao[0].nomes_comunidades_beneficiadas],                
                ['Breve descrição: ', gestao[0].ct_descricao],
            ]
        },
        layout: 'headerLineOnly'
       },
       {text: 'Representantes', bold: true,fontSize: 14, margin: [0, 10, 15, 0]},
       {
        table: {
            headerRows: 1,
            body: [
                [{text: 'Descrição'}],
                [representantes?.map((representante: {nome: string, cargo: string, telefone: string, email: string}) =>(
                    [
                        ['Nome:  ' + representante.nome],
                        ['Cargo:  ' + representante.cargo],
                        ['Telefone:  ' + representante.telefone],
                        ['Email:  ' + representante.email],
                        ['-----------------------------------------------------------------------------------------------------------']
                    ]
                ))],
             
            ]
        },
        layout: 'headerLineOnly'
       },
       {text: 'Política Municipal de Saneamento Básico', bold: true,fontSize: 14, margin: [0, 10, 15, 0]},
       {
        table: {
            headerRows: 1,
            body: [
                [{text: 'Descrição'}],
                [listPoliticas?.map((politica: {titulo: string, id_arquivo: number, ano: string}) =>(
                    [
                        ['titulo:  ' + politica.titulo,'Ano:  ' + politica.ano],
                        ['URL:  ' +PATH_URL+'/pdf/'+ politica.id_arquivo],
                        ['-----------------------------------------------------------------------------------------------------------']
                    ]
                ))],
             
            ]
        },
        layout: 'headerLineOnly'
       },
       {text: 'Plano Municipal de Saneamento Básico', bold: true,fontSize: 14, margin: [0, 10, 15, 0]},
       {
        table: {
            headerRows: 1,
            body: [
                [{text: 'Descrição'}],
                [listPlanos?.map((plano: {titulo: string, id_arquivo: number, ano: string}) =>(
                    [
                        ['Titulo:  ' + plano.titulo,'Ano:  ' + plano.ano],
                        ['URL:  ' +PATH_URL+'/pdf/'+plano.id_arquivo],
                        ['-----------------------------------------------------------------------------------------------------------']
                    ]
                ))],
             
            ]
        },
        layout: 'headerLineOnly'
       },
       {text: 'Participações', bold: true,fontSize: 14, margin: [0, 10, 15, 0]},
       {
        table: {
            headerRows: 1,
            body: [
                [{text: 'Descrição'}],
                [listParticipacoes?.map((participacao: {titulo: string, id_arquivo: number, ano: string}) =>(
                    [
                        ['titulo:  ' + participacao.titulo,'Ano:  ' + participacao.ano],
                        ['URL:  ' +PATH_URL+'/pdf/'+ participacao.id_arquivo,''],
                        ['-----------------------------------------------------------------------------------------------------------']
                    ]
                ))],
             
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