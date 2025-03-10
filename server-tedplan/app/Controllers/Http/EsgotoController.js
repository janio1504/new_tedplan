'use strict'
const Esgoto = use('App/Models/Concessionaria')
class EsgotoController {

  async getEsgoto({ request }){
    const { id_municipio} = request.all()
   try {
    const res = await Esgoto.query()
    .from('tedplan.esgoto')
    .where('id_municipio', id_municipio)
    .fetch()

    return res
   } catch (error) {
    console.log(error);
   }
  }

  async getEsgotoPorAno({ request }){
    const { id_municipio, ano } = request.all()
   try {
    const res = await Esgoto.query()
    .from('tedplan.esgoto')
    .where('id_municipio', id_municipio)
    .where('ano', ano)
    .where("ano", "is not", null)
    .fetch()

    return res
   } catch (error) {
    console.log(error);
   }
  }

  async createEsgoto({ request }){
    const dados = request.all()
   try {
    if(!dados.id_esgoto){
      await Esgoto.query()
      .from('tedplan.esgoto')
      .insert({
        es009: dados.ES009,
        es002: dados.ES002,
        es003: dados.ES003,
        es008: dados.ES008,
        es005: dados.ES005,
        es006: dados.ES006,
        es007: dados.ES007,
        es012: dados.ES012,
        es015: dados.ES015,
        es004: dados.ES004,
        es028: dados.ES028,
        es098: dados.ES098,
        es099: dados.ES099,
        id_municipio: dados.id_municipio,
        ano: dados.ano,
      })
    }else{

        const res = await Esgoto.query()
        .from('tedplan.esgoto')
        .where('id_esgoto', dados.id_esgoto)
        .fetch()
        const re = res.toJSON()[0]

        await Esgoto.query()
        .from('tedplan.esgoto')
        .where('id_esgoto', dados.id_esgoto)
        .update({
          es009: dados.ES009 ? dados.ES009 : re.es009,
          es002: dados.ES002 ? dados.ES002 : re.es002,
          es003: dados.ES003 ? dados.ES003 : re.es003,
          es008: dados.ES008 ? dados.ES008 : re.es008,
          es005: dados.ES005 ? dados.ES005 : re.es005,
          es006: dados.ES006 ? dados.ES006 : re.es006,
          es007: dados.ES007 ? dados.ES007 : re.es007,
          es012: dados.ES012 ? dados.ES012 : re.es012,
          es015: dados.ES015 ? dados.ES015 : re.es015,
          es004: dados.ES004 ? dados.ES004 : re.es004,
          es028: dados.ES028 ? dados.ES028 : re.ag028,
          es098: dados.ES098 ? dados.ES098 : re.es098,
          es099: dados.ES099 ? dados.ES099 : re.es099,
          id_municipio: dados.id_municipio ? dados.id_municipio : ra.id_municipio,
          ano: dados.ano ? dados.ano : ra.ano,
      })



    }
   } catch (error) {
    console.log(error);
   }
  }
}

module.exports = EsgotoController
