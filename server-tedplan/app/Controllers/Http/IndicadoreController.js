'use strict'
const Geral = use('App/Models/Concessionaria')

class IndicadoreController {
  async txEmpregPopUrb({ request }){
    const { id_municipio, ano } = request.all()
    const resDd = await Geral.query()
    .from('tedplan.dados_demograficos')
    .where('id_municipio', id_municipio)
    .fetch()

    const resRsc = await Geral.query()
    .from('tedplan.dados_demograficos')
    .where('id_municipio', id_municipio)
    .fetch()

    const PUB_URB = resDd.toJSON()[0].populacao_urbana



  }
}

module.exports = IndicadoreController
