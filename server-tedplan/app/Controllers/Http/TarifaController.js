'use strict'
const Tarifa = use('App/Models/Concessionaria')

class TarifaController {
  async getTarifa({ request }){
    const { id_municipio, ano } = request.all()
    try {
     const res = await Tarifa.query()
     .from('tedplan.tarifa')
     .where('id_municipio', id_municipio)
     .where('ano', ano)
     .fetch()

     return res
    } catch (error) {
     console.log(error);
    }
  }

  async createTarifa({ request }){
    const dados = request.all()
   try {
    if(!dados.id_tarifa){
      await Tarifa.query()
      .from('tedplan.tarifa')
      .insert({
        tr001: dados.TR001,
        tr002: dados.TR002,
        tr003: dados.TR003,
        tr005: dados.TR005,
        tr006: dados.TR006,
        tr007: dados.TR007,
        tr009: dados.TR009,
        tr010: dados.TR010,
        tr011: dados.TR011,
        tr013: dados.TR013,
        tr014: dados.TR014,
        tr015: dados.TR015,
        tr016: dados.TR016,
        tr017: dados.TR017,
        tr018: dados.TR018,
        tr019: dados.TR019,
        tr020: dados.TR020,
        tr021: dados.TR021,
        tr022: dados.TR022,
        tr023: dados.TR023,
        tr024: dados.TR024,
        tr025: dados.TR025,
        tr026: dados.TR026,
        tr027: dados.TR027,
        tr028: dados.TR028,
        tr029: dados.TR029,
        tr030: dados.TR030,
        tr031: dados.TR031,
        tr032: dados.TR032,
        tr033: dados.TR033,
        tr034: dados.TR034,
        tr099: dados.TR099,
        id_municipio: dados.id_municipio,
        ano: dados.ano,
      })
    }else{

        const res = await Tarifa.query()
        .from('tedplan.tarifa')
        .where('id_tarifa', dados.id_tarifa)
        .fetch()
        const ta = res.toJSON()[0]

        await Tarifa.query()
        .from('tedplan.tarifa')
        .where('id_tarifa', dados.id_tarifa)
        .update({
          tr001: dados.TR001 ? dados.TR001 : ta.tr001,
          tr002: dados.TR002 ? dados.TR002 : ta.tr002,
          tr003: dados.TR003 ? dados.TR003 : ta.tr003,
          tr005: dados.TR005 ? dados.TR005 : ta.tr005,
          tr006: dados.TR006 ? dados.TR006 : ta.tr006,
          tr007: dados.TR007 ? dados.TR007 : ta.tr007,
          tr009: dados.TR009 ? dados.TR009 : ta.tr009,
          tr010: dados.TR010 ? dados.TR010 : ta.tr010,
          tr011: dados.TR011 ? dados.TR011 : ta.tr011,
          tr013: dados.TR013 ? dados.TR013 : ta.tr013,
          tr014: dados.TR014 ? dados.TR014 : ta.tr014,
          tr015: dados.TR015 ? dados.TR015 : ta.tr015,
          tr016: dados.TR016 ? dados.TR016 : ta.tr016,
          tr017: dados.TR017 ? dados.TR017 : ta.tr017,
          tr018: dados.TR018 ? dados.TR018 : ta.tr018,
          tr019: dados.TR019 ? dados.TR019 : ta.tr019,
          tr020: dados.TR020 ? dados.TR020 : ta.tr020,
          tr021: dados.TR021 ? dados.TR021 : ta.tr021,
          tr022: dados.TR022 ? dados.TR022 : ta.tr022,
          tr023: dados.TR023 ? dados.TR023 : ta.tr023,
          tr024: dados.TR024 ? dados.TR024 : ta.tr024,
          tr025: dados.TR025 ? dados.TR025 : ta.tr025,
          tr026: dados.TR026 ? dados.TR026 : ta.tr026,
          tr027: dados.TR027 ? dados.TR027 : ta.tr027,
          tr028: dados.TR028 ? dados.TR028 : ta.tr028,
          tr029: dados.TR029 ? dados.TR029 : ta.tr029,
          tr030: dados.TR030 ? dados.TR030 : ta.tr030,
          tr031: dados.TR031 ? dados.TR031 : ta.tr031,
          tr032: dados.TR032 ? dados.TR032 : ta.tr032,
          tr033: dados.TR033 ? dados.TR033 : ta.tr033,
          tr034: dados.TR034 ? dados.TR034 : ta.tr034,
          tr099: dados.TR099 ? dados.TR099 : ta.tr099,
          id_municipio: dados.id_municipio ? dados.id_municipio : ra.id_municipio,
          ano: dados.ano ? dados.ano : ra.ano,
      })



    }
   } catch (error) {
    console.log(error);
   }
  }
}

module.exports = TarifaController
