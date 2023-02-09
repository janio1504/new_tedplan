'use strict'
const PsFinanceiro = use('App/Models/PsFinanceiro')

class PsResiduosUnidadeController {
  async getUnidadesProcessamento({ request }){
    const dados = request.all()
    const dadosRuc = await PsFinanceiro.query()
        .from('tedplan.residuos_unidade_processamento')
        .where('id_municipio', dados.id_municipio)
        .where('ano', dados.ano)
        .fetch()

      return dadosRuc
  }

  async getUnidadeProcessamento({ request }){
    const dados = request.all()
    const dadosRuc = await PsFinanceiro.query()
        .from('tedplan.residuos_unidade_processamento')
        .where('id_residuos_unidade_processamento', dados.id_residuos_unidade_processamento)
        .fetch()

      return dadosRuc
  }

  async destroy({ params }){
    try {
      await PsFinanceiro.query()
      .table('tedplan.residuos_unidade_processamento')
      .where('id_residuos_unidade_processamento', params.id)
      .delete()
    } catch (error) {
      console.log(error);
    }
  }

  async createUnidadeProcessamento({ request }){
    const dados = request.all()
    try {
      if(!dados.id_residuos_unidade_processamento){
        const res = await PsFinanceiro.query()
        .from('tedplan.residuos_unidade_processamento')
        .insert({
          up001: dados.UP001,
          up002: dados.UP002,
          up003: dados.UP003,
          up004: dados.UP004,
          up012: dados.UP012,
          up015: dados.UP015,
          up016: dados.UP016,
          up017: dados.UP017,
          up018: dados.UP018,
          up019: dados.UP019,
          up020: dados.UP020,
          up021: dados.UP021,
          up022: dados.UP022,
          up023: dados.UP023,
          up024: dados.UP024,
          up027: dados.UP027,
          up028: dados.UP028,
          up029: dados.UP029,
          up030: dados.UP030,
          up031: dados.UP031,
          up032: dados.UP032,
          up033: dados.UP033,
          up034: dados.UP034,
          up035: dados.UP035,
          up036: dados.UP036,
          up037: dados.UP037,
          up038: dados.UP038,
          up039: dados.UP039,
          up040: dados.UP040,
          up050: dados.UP050,
          up051: dados.UP051,
          up052: dados.UP052,
          up053: dados.UP053,
          up054: dados.UP054,
          up065: dados.UP065,
          up066: dados.UP066,
          up068: dados.UP068,
          up069: dados.UP069,
          up070: dados.UP070,
          up071: dados.UP071,
          up072: dados.UP072,
          up073: dados.UP073,
          up074: dados.UP074,
          up075: dados.UP075,
          up079: dados.UP079,
          up081: dados.UP081,
          up082: dados.UP082,
          up083: dados.UP083,
          up084: dados.UP084,
          up085: dados.UP085,
          up086: dados.UP086,
          up087: dados.UP087,
          municipio_unidade: dados.municipio_unidade,
          nome_unidade: dados.nome_unidade,
          observacoes_unidade: dados.observacoes_unidade,
          id_municipio: dados.id_municipio,
          ano: dados.ano,
          })
      }else{
        const dadosRuc = await PsFinanceiro.query()
        .from('tedplan.residuos_unidade_processamento')
        .where('id_residuos_unidade_processamento', dados.id_residuos_unidade_processamento)
        .fetch()
        const ruc = dadosRuc.toJSON()[0]

        const res = await PsFinanceiro.query()
        .from('tedplan.residuos_unidade_processamento')
        .where('id_residuos_unidade_processamento', dados.id_residuos_unidade_processamento)
        .update({
          up001: dados.UP001 ? dados.UP001 : ruc.up001,
          up002: dados.UP002 ? dados.UP002 : ruc.up002,
          up003: dados.UP003 ? dados.UP003 : ruc.up003,
          up004: dados.UP004 ? dados.UP004 : ruc.up004,
          up012: dados.UP012 ? dados.UP012 : ruc.up012,
          up015: dados.UP015 ? dados.UP015 : ruc.up015,
          up016: dados.UP016 ? dados.UP016 : ruc.up016,
          up017: dados.UP017 ? dados.UP017 : ruc.up017,
          up018: dados.UP018 ? dados.UP018 : ruc.up018,
          up019: dados.UP019 ? dados.UP019 : ruc.up019,
          up020: dados.UP020 ? dados.UP020 : ruc.up020,
          up021: dados.UP021 ? dados.UP021 : ruc.up021,
          up022: dados.UP022 ? dados.UP022 : ruc.up022,
          up023: dados.UP023 ? dados.UP023 : ruc.up023,
          up024: dados.UP024 ? dados.UP024 : ruc.up024,
          up027: dados.UP027 ? dados.UP027 : ruc.up027,
          up028: dados.UP028 ? dados.UP028 : ruc.up028,
          up029: dados.UP029 ? dados.UP029 : ruc.up029,
          up030: dados.UP030 ? dados.UP030 : ruc.up030,
          up031: dados.UP031 ? dados.UP031 : ruc.up031,
          up032: dados.UP032 ? dados.UP032 : ruc.up032,
          up033: dados.UP033 ? dados.UP033 : ruc.up033,
          up034: dados.UP034 ? dados.UP034 : ruc.up034,
          up035: dados.UP035 ? dados.UP035 : ruc.up035,
          up036: dados.UP036 ? dados.UP036 : ruc.up036,
          up037: dados.UP037 ? dados.UP037 : ruc.up037,
          up038: dados.UP038 ? dados.UP038 : ruc.up038,
          up039: dados.UP039 ? dados.UP039 : ruc.up039,
          up040: dados.UP040 ? dados.UP040 : ruc.up040,
          up050: dados.UP050 ? dados.UP050 : ruc.up050,
          up051: dados.UP051 ? dados.UP051 : ruc.up051,
          up052: dados.UP052 ? dados.UP052 : ruc.up052,
          up053: dados.UP053 ? dados.UP053 : ruc.up053,
          up054: dados.UP054 ? dados.UP054 : ruc.up054,
          up065: dados.UP065 ? dados.UP065 : ruc.up065,
          up066: dados.UP066 ? dados.UP066 : ruc.up066,
          up068: dados.UP068 ? dados.UP068 : ruc.up068,
          up069: dados.UP069 ? dados.UP069 : ruc.up069,
          up070: dados.UP070 ? dados.UP070 : ruc.up070,
          up071: dados.UP071 ? dados.UP071 : ruc.up071,
          up072: dados.UP072 ? dados.UP072 : ruc.up072,
          up073: dados.UP073 ? dados.UP073 : ruc.up073,
          up074: dados.UP074 ? dados.UP074 : ruc.up074,
          up075: dados.UP075 ? dados.UP075 : ruc.up075,
          up079: dados.UP079 ? dados.UP079 : ruc.up079,
          up081: dados.UP081 ? dados.UP081 : ruc.up081,
          up082: dados.UP082 ? dados.UP082 : ruc.up082,
          up083: dados.UP083 ? dados.UP083 : ruc.up083,
          up084: dados.UP084 ? dados.UP084 : ruc.up084,
          up085: dados.UP085 ? dados.UP085 : ruc.up085,
          up086: dados.UP086 ? dados.UP086 : ruc.up086,
          up087: dados.UP087 ? dados.UP087 : ruc.up087,
          municipio_unidade: dados.municipio_unidade ? dados.municipio_unidade : ruc.municipio_unidade,
          nome_unidade: dados.nome_unidade ? dados.nome_unidade : ruc.nome_unidade,
          observacoes_unidade: dados.observacoes_unidade ? dados.observacoes_unidade : ruc.observacoes_unidade,
          })
      }

    } catch (error) {
      console.log(error);
    }

  }
}

module.exports = PsResiduosUnidadeController
