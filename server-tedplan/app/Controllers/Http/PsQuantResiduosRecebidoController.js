'use strict'
const PsFinanceiro = use('App/Models/PsFinanceiro')

class PsQuantResiduosRecebidoController {

  async getResiduosRecebidos({ request }){
    const { id_municipio, ano } = request.all()
    const res = await PsFinanceiro.query()
    .from('tedplan.quant_residuos_recebidos')
    .where('id_municipio', id_municipio)
    .where('ano', ano)
    .fetch()

    return res
  }

  async createResiduosRecebidos({ request }){
    const dados = request.all()
    try {
      if(!dados.id_quant_residuos_recebidos){

        const res = await PsFinanceiro.query()
          .from('tedplan.quant_residuos_recebidos')
          .insert({
            up080: dados.UP080,
            up011: dados.UP011,
            up067: dados.UP067,
            up010: dados.UP010,
            up009: dados.UP009,
            up008: dados.UP008,
            up007: dados.UP007,
            up025: dados.UP025,
            id_municipio: dados.id_municipio,
            ano: dados.ano,
          })
      }else{

        const resQrr = await PsFinanceiro.query()
        .from('tedplan.quant_residuos_recebidos')
        .where('id_quant_residuos_recebidos', id_quant_residuos_recebidos)
        .fetch()

        const qrr = resQrr.JSON()[0]

        const res = await PsFinanceiro.query()
          .from('tedplan.quant_residuos_recebidos')
          .where('id_quant_residuos_recebidos', id_quant_residuos_recebidos)
          .update({
            up080: dados.UP080 ? dados.UP080 : qrr.up080,
            up011: dados.UP011 ? dados.UP011 : qrr.up011,
            up067: dados.UP067 ? dados.UP067 : qrr.up067,
            up010: dados.UP010 ? dados.UP010 : qrr.up010,
            up009: dados.UP009 ? dados.UP009 : qrr.up009,
            up008: dados.UP008 ? dados.UP008 : qrr.up008,
            up007: dados.UP007 ? dados.UP007 : qrr.up007,
            up025: dados.UP025 ? dados.UP025 : qrr.up025,
            id_municipio: dados.id_municipio ? dados.id_municipio : qrr.id_municipio,
            ano: dados.ano ? dados.ano : qrr.ano,
          })
      }
    } catch (error) {
      console.log(error);
    }

    return res
  }
}

module.exports = PsQuantResiduosRecebidoController
