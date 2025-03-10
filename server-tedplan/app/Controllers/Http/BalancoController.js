'use strict'
const Balanco = use('App/Models/Concessionaria')
class BalancoController {

  async getBalanco({ request }){
    const { id_municipio } = request.all()
   try {
    const res = await Balanco.query()
    .from('tedplan.balanco')
    .where('id_municipio', id_municipio)
    .fetch()

    return res
   } catch (error) {
    console.log(error);
   }
  }

  async getBalancoPorAno({ request }){
    const { id_municipio, ano } = request.all()
   try {
    const res = await Balanco.query()
    .from('tedplan.balanco')
    .where('id_municipio', id_municipio)
    .where('ano', ano)
    .where("ano", "is not", null)
    .fetch()

    return res
   } catch (error) {
    console.log(error);
   }
  }

  async createBalanco({ request }){
    const dados = request.all()
   try {
    if(!dados.id_balanco){
      await Balanco.query()
      .from('tedplan.balanco')
      .insert({
        bl002: dados.BL002,
        bl001: dados.BL001,
        bl010: dados.BL010,
        bl005: dados.BL005,
        bl003: dados.BL003,
        bl008: dados.BL008,
        bl006: dados.BL006,
        bl007: dados.BL007,
        bl009: dados.BL009,
        bl012: dados.BL012,
        bl004: dados.BL004,
        bl011: dados.BL011,
        bl099: dados.BL099,
        id_municipio: dados.id_municipio,
        ano: dados.ano,
      })
    }else{

        const res = await Balanco.query()
        .from('tedplan.balanco')
        .where('id_balanco', dados.id_balanco)
        .fetch()
        const rb = res.toJSON()[0]

        await Balanco.query()
        .from('tedplan.balanco')
        .where('id_balanco', dados.id_balanco)
        .update({
          bl002: dados.BL002 ? dados.BL002 : rb.bl002,
          bl001: dados.BL001 ? dados.BL001 : rb.bl001,
          bl010: dados.BL010 ? dados.BL010 : rb.bl010,
          bl005: dados.BL005 ? dados.BL005 : rb.bl005,
          bl003: dados.BL003 ? dados.BL003 : rb.bl003,
          bl008: dados.BL008 ? dados.BL008 : rb.bl008,
          bl006: dados.BL006 ? dados.BL006 : rb.bl006,
          bl007: dados.BL007 ? dados.BL007 : rb.bl007,
          bl009: dados.BL009 ? dados.BL009 : rb.bl009,
          bl012: dados.BL012 ? dados.BL012 : rb.bl012,
          bl004: dados.BL004 ? dados.BL004 : rb.bl004,
          bl011: dados.BL011 ? dados.BL011 : rb.bl011,
          bl099: dados.BL099 ? dados.BL099 : rb.bl099,
          id_municipio: dados.id_municipio ? dados.id_municipio : ra.id_municipio,
          ano: dados.ano ? dados.ano : ra.ano,
      })
    }
   } catch (error) {
    console.log(error);
   }
  }
}

module.exports = BalancoController
