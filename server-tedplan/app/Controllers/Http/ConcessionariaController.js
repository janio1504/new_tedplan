'use strict'
const Concessioraria = use('App/Models/Concessionaria')

class ConcessionariaController {

  async getConcessionarias({ request }){
    const dados = request.all()
    
    try {
      const res = await Concessioraria.query()
      .from('tedplan.concessionarias')
      .where('id_municipio', dados.id_municipio)
      .where('ano', dados.ano)
      .fetch()

      return res
    } catch (error) {
      console.log(error);
    }

  }

  async getConcessionaria({ params }){
    
    try {
      const res = await Concessioraria.query()
      .from('tedplan.concessionarias')
      .where('id_concessionaria', params.id)
      .fetch()

    return res
    } catch (error) {
      console.log(error);
    }
  }

  async store({ request }){
    const dados = request.all()
    console.log(dados);
    
    try {
      if(!dados.id_concessionaria){
        const res = await Concessioraria.query()
        .from('tedplan.concessionarias')
        .insert({
            cnpj: dados.cnpj,
            razao_social: dados.razao_social,
            ano_inicio: dados.cnpj,
            duracao: dados.duracao,
            vigente: dados.vigente,
            capina_e_rocada: dados.capina_e_rocada,
            coleta_res_construcao_civil: dados.coleta_res_construcao_civil,
            coleta_res_domiciliar: dados.coleta_res_domiciliar,
            coleta_res_servicos_saude: dados.coleta_res_servicos_saude,
            coleta_res_publico: dados.coleta_res_publico,
            operacao_aterro_sanitario: dados.operacao_aterro_sanitario,
            operacao_incinerador: dados.operacao_incinerador,
            operacao_outras_unidades_processamento: dados.operacao_outras_unidades_processamento,
            operacao_unidade_compostagem: dados.operacao_unidade_compostagem,
            operacao_triagem: dados.operacao_triagem,
            outros: dados.outros,
            tipo_desconhecido: dados.tipo_desconhecido,
            varricao_logradouros_publicos: dados.varricao_logradouros_publicos,
            id_municipio: dados.id_municipio,
            ano: dados.ano,
        })
      }else{
        const res = await Concessioraria.query()
        .from('tedplan.concessionarias')
        .where('id_concessionaria', dados.id_concessionaria)
        .fetch()

        const rc = res.toJSON()[0]

        await Concessioraria.query()
        .from('tedplan.concessionarias')
        .update({
            cnpj: dados.cnpj ? dados.cnpj : rc.cnpj,
            razao_social: dados.razao_social ? dados.razao_social : rc.razao_social,
            ano_inicio: dados.ano_inicio ? dados.ano_inicio : rc.ano_inicio,
            duracao: dados.duracao ? dados.duracao : rc.duracao,
            vigente: dados.vigente ? dados.vigente : rc.vigente,
            capina_e_rocada: dados.capina_e_rocada ? dados.capina_e_rocada : rc.capina_e_rocada,
            coleta_res_construcao_civil: dados.coleta_res_construcao_civil ? dados.coleta_res_construcao_civil : rc.coleta_res_construcao_civil,
            coleta_res_domiciliar: dados.coleta_res_domiciliar ? dados.coleta_res_domiciliar : rc.coleta_res_domiciliar,
            coleta_res_servicos_saude: dados.coleta_res_servicos_saude ? dados.coleta_res_servicos_saude : rc.coleta_res_servicos_saude,
            coleta_res_publico: dados.coleta_res_publico ? dados.coleta_res_publico : rc.coleta_res_publico,
            operacao_aterro_sanitario: dados.operacao_aterro_sanitario ? dados.operacao_aterro_sanitario : rc.operacao_aterro_sanitario,
            operacao_incinerador: dados.operacao_incinerador ? dados.operacao_incinerador : rc.operacao_incinerador,

            operacao_outras_unidades_processamento: dados.operacao_outras_unidades_processamento ?
             dados.operacao_outras_unidades_processamento : rc.operacao_outras_unidades_processamento,

            operacao_unidade_compostagem: dados.operacao_unidade_compostagem ? dados.operacao_unidade_compostagem : rc.operacao_unidade_compostagem,
            operacao_triagem: dados.operacao_triagem ? dados.operacao_triagem : rc.operacao_triagem,
            outros: dados.outros ? dados.outros : rc.outros,
            tipo_desconhecido: dados.tipo_desconhecido ? dados.tipo_desconhecido : rc.tipo_desconhecido,
            varricao_logradouros_publicos: dados.varricao_logradouros_publicos ? dados.varricao_logradouros_publicos : rc.varricao_logradouros_publicos,
            id_municipio: dados.id_municipio ? dados.id_municipio : rc.id_municipio,
            ano: dados.ano ? dados.ano : rc.ano,
        })
      }

    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ConcessionariaController
