'use strict'
const Agua = use('App/Models/Concessionaria')
class AguaController {
  async getAgua({ request }){
    const { id_municipio } = request.all()
    
   try {
    const res = await Agua.query()
    .from('tedplan.agua')
    .where('id_municipio', id_municipio)
    .orderBy('ano', 'asc')   
    .fetch()
    
    return res
   } catch (error) {
    console.log(error);
   }
  }

  async getAguaAno({ request }){
    const { id_municipio, ano } = request.all()
    
   try {
    const res = await Agua.query()
    .from('tedplan.agua')
    .where('id_municipio', id_municipio)
    .where('ano', ano)
    .fetch()
    
    return res
   } catch (error) {
    console.log(error);
   }
  }

  async createAgua({ request }){
    const dados = request.all()
   try {
    if(!dados.id_agua){
      await Agua.query()
      .from('tedplan.agua')
      .insert({
        ag021: dados.AG021,
        ag002: dados.AG002,
        ag004: dados.AG004,
        ag003: dados.AG003,
        ag014: dados.AG014,
        ag013: dados.AG013,
        ag022: dados.AG022,
        ag006: dados.AG006,
        ag024: dados.AG024,
        ag016: dados.AG016,
        ag018: dados.AG018,
        ag017: dados.AG017,
        ag019: dados.AG019,
        ag007: dados.AG007,
        ag015: dados.AG015,
        ag027: dados.AG027,
        ag012: dados.AG012,
        ag008: dados.AG008,
        ag010: dados.AG010,
        ag011: dados.AG011,
        ag020: dados.AG020,
        ag005: dados.AG005,
        ag028: dados.AG028,
        ag098: dados.AG098,
        ag099: dados.AG099,
        id_municipio: dados.id_municipio,
        ano: dados.ano,
      })
    }else{

        const res = await Agua.query()
        .from('tedplan.agua')
        .where('id_agua', dados.id_agua)
        .fetch()
        const ra = res.toJSON()[0]

        await Agua.query()
        .from('tedplan.agua')
        .where('id_agua', dados.id_agua)
        .update({
          ag021: dados.AG021 ? dados.AG021 : ra.ag021,
          ag002: dados.AG002 ? dados.AG002 : ra.ag002,
          ag004: dados.AG004 ? dados.AG004 : ra.ag004,
          ag003: dados.AG003 ? dados.AG003 : ra.ag003,
          ag014: dados.AG014 ? dados.AG014 : ra.ag014,
          ag013: dados.AG013 ? dados.AG013 : ra.ag013,
          ag022: dados.AG022 ? dados.AG022 : ra.ag022,
          ag006: dados.AG006 ? dados.AG006 : ra.ag006,
          ag024: dados.AG024 ? dados.AG024 : ra.ag024,
          ag016: dados.AG016 ? dados.AG016 : ra.ag016,
          ag018: dados.AG018 ? dados.AG018 : ra.ag018,
          ag017: dados.AG017 ? dados.AG017 : ra.ag017,
          ag019: dados.AG019 ? dados.AG019 : ra.ag019,
          ag007: dados.AG007 ? dados.AG007 : ra.ag007,
          ag015: dados.AG015 ? dados.AG015 : ra.ag015,
          ag027: dados.AG027 ? dados.AG027 : ra.ag027,
          ag012: dados.AG012 ? dados.AG012 : ra.ag012,
          ag008: dados.AG008 ? dados.AG008 : ra.ag008,
          ag010: dados.AG010 ? dados.AG010 : ra.ag010,
          ag011: dados.AG011 ? dados.AG011 : ra.ag011,
          ag020: dados.AG020 ? dados.AG020 : ra.ag020,
          ag005: dados.AG005 ? dados.AG005 : ra.ag005,
          ag028: dados.AG028 ? dados.AG028 : ra.ag028,
          ag098: dados.AG098 ? dados.AG098 : ra.ag098,
          ag099: dados.AG099 ? dados.AG099 : ra.ag099,
          id_municipio: dados.id_municipio ? dados.id_municipio : ra.id_municipio,
          ano: dados.ano ? dados.ano : ra.ano,
      })



    }
   } catch (error) {
    console.log(error);
   }
  }
}

module.exports = AguaController
