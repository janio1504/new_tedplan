'use strict'
const Drenagem = use('App/Models/Concessionaria')
class DrenagemController {

  async getDrenagem({ request }){
    const { id_municipio, ano } = request.all()
   try {
    const res = await Drenagem.query()
    .from('tedplan.drenagem_aguas_pluviais')
    .where('id_municipio', id_municipio)
    .where('ano', ano)
    .fetch()

    return res
   } catch (error) {
    console.log(error);
   }
  }

  async createDrenagem({ request }){

    const dados = request.all()
   try {
    if(!dados.id_drenagem_aguas_pluviais){
      await Drenagem.query()
      .from('tedplan.drenagem_aguas_pluviais')
      .insert({
        ie017: dados.IE017,
        ie018: dados.IE018,
        ie019: dados.IE019,
        ie020: dados.IE020,
        ie021: dados.IE021,
        ie022: dados.IE022,
        ie023: dados.IE023,
        ie024: dados.IE024,
        ie025: dados.IE025,
        ie026: dados.IE026,
        ie027: dados.IE027,
        ie028: dados.IE028,
        ie029: dados.IE029,
        ie032: dados.IE032,
        ie040: dados.IE040,
        ie033: dados.IE033,
        ie034: dados.IE034,
        ie035: dados.IE035,
        ie036: dados.IE036,
        ie037: dados.IE037,
        ie041: dados.IE041,
        ie044: dados.IE044,
        ie050: dados.IE050,
        ie050a: dados.IE050A,
        ie999: dados.IE999,
        ri023: dados.RI023,
        ri025: dados.RI025,
        ri027: dados.RI027,
        ri029: dados.RI029,
        ri031: dados.RI031,
        ri032: dados.RI032,
        ri042: dados.RI042,
        ri043: dados.RI043,
        ri044: dados.RI044,
        ri045: dados.RI045,
        ri999: dados.RI999,
        id_municipio: dados.id_municipio,
        ano: dados.ano,
      })
    }else{

        const res = await Drenagem.query()
        .from('tedplan.drenagem_aguas_pluviais')
        .where('id_drenagem_aguas_pluviais', dados.id_drenagem_aguas_pluviais)
        .fetch()
        const rd = res.toJSON()[0]
        await Drenagem.query()
        .from('tedplan.drenagem_aguas_pluviais')
        .where('id_drenagem_aguas_pluviais', dados.id_drenagem_aguas_pluviais)
        .update({
          ie017: dados.IE017 ? dados.IE017 : rd.ie017,
          ie018: dados.IE018 ? dados.IE018 : rd.ie018,
          ie019: dados.IE019 ? dados.IE019 : rd.ie019,
          ie020: dados.IE020 ? dados.IE020 : rd.ie020,
          ie021: dados.IE021 ? dados.IE021 : rd.ie021,
          ie022: dados.IE022 ? dados.IE022 : rd.ie022,
          ie023: dados.IE023 ? dados.IE023 : rd.ie023,
          ie024: dados.IE024 ? dados.IE024 : rd.ie024,
          ie025: dados.IE025 ? dados.IE025 : rd.ie025,
          ie026: dados.IE026 ? dados.IE026 : rd.ie026,
          ie027: dados.IE027 ? dados.IE027 : rd.ie027,
          ie028: dados.IE028 ? dados.IE028 : rd.ie028,
          ie029: dados.IE029 ? dados.IE029 : rd.ie029,
          ie032: dados.IE032 ? dados.IE032 : rd.ie032,
          ie040: dados.IE040 ? dados.IE040 : rd.ie040,
          ie033: dados.IE033 ? dados.IE033 : rd.ie033,
          ie034: dados.IE034 ? dados.IE034 : rd.ie034,
          ie035: dados.IE035 ? dados.IE035 : rd.ie035,
          ie036: dados.IE036 ? dados.IE036 : rd.ie036,
          ie037: dados.IE037 ? dados.IE037 : rd.ie037,
          ie041: dados.IE041 ? dados.IE041 : rd.ie041,
          ie044: dados.IE044 ? dados.IE044 : rd.ie044,
          ie050: dados.IE050 ? dados.IE050 : rd.ie050,
          ie050a: dados.IE050A ? dados.IE050A : rd.ie050a,
          ie999: dados.IE999 ? dados.IE999 : rd.ie999,
          ri023: dados.RI023 ? dados.RI023 : rd.ri023,
          ri025: dados.RI025 ? dados.RI025 : rd.ri025,
          ri027: dados.RI027 ? dados.RI027 : rd.ri027,
          ri029: dados.RI029 ? dados.RI029 : rd.ri029,
          ri031: dados.RI031 ? dados.RI031 : rd.ri031,
          ri032: dados.RI032 ? dados.RI032 : rd.ri032,
          ri042: dados.RI042 ? dados.RI042 : rd.ri042,
          ri043: dados.RI043 ? dados.RI043 : rd.ri043,
          ri044: dados.RI044 ? dados.RI044 : rd.ri044,
          ri045: dados.RI045 ? dados.RI045 : rd.ri045,
          ri999: dados.RI999 ? dados.RI999 : rd.ri999,
          id_municipio: dados.id_municipio ? dados.id_municipio : ra.id_municipio,
          ano: dados.ano ? dados.ano : ra.ano,
      })
    }
   } catch (error) {    
    console.log(error);
   }
  }
}

module.exports = DrenagemController
