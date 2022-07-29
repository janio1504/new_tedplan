'use strict'
const Geral = use('App/Models/PsFinanceiro')

class GeralController {
  async index(){

  }

  async getDadosGerais({ request }){
    const { ano, id_municipio } = request.all()
    try {
      const resGe = await Geral.query()
        .from('tedplan.geral_da_ae_dh')
        .where("id_municipio", id_municipio)
        .where("ano", ano)
        .fetch()
        return resGe
    } catch (error) {
      console.log(error);
    }
  }

  async store({ request }){
    const dados = request.all()
    try {
      if(!dados.id_geral_da_ae_dh){
        await Geral.query()
        .table('tedplan.geral_da_ae_dh')
        .insert({
          ge001: dados.GE001,
          ge002: dados.GE002,
          ge007: dados.GE007,
          ge008da: dados.GE008DA,
          ge016: dados.GE016,
          ge010: dados.GE010,
          ge011: dados.GE011,
          ge012: dados.GE012,
          ad001: dados.AD001,
          ad002: dados.AD002,
          ad004: dados.AD004,
          ie001: dados.IE001,
          ie012: dados.IE012,
          ie013: dados.IE013,
          ie014: dados.IE014,
          ie016: dados.IE016,
          ie016a: dados.IE016A,
          op001_1: dados.OP001_1,
          op001_2: dados.OP001_2,
          op001_3: dados.OP001_3,
          op001a: dados.OP001A,
          ri001_1: dados.RI001_1,
          ri001_2: dados.RI001_2,
          ri001_3: dados.RI001_3,
          ri001a: dados.RI001A,
          ri002_1: dados.RI002_1,
          ri002_2: dados.RI002_2,
          ri002_3: dados.RI002_3,
          ri002a: dados.RI002A,
          ri003_1: dados.RI003_1,
          ri003_2: dados.RI003_2,
          ri003_3: dados.RI003_3,
          ri003a: dados.RI003A,
          ri004_1: dados.RI004_1,
          ri004_2: dados.RI004_2,
          ri004_3: dados.RI004_3,
          ri004a: dados.RI004A,
          ri005: dados.RI005,
          ri007: dados.RI007,
          ri009: dados.RI009,
          ri010: dados.RI010,
          ri011: dados.RI011,
          ri012: dados.RI012,
          ri013: dados.RI013,
          ge999da: dados.GE999DA,
          ge005: dados.GE005,
          ge05a: dados.GE05A,
          ge05b: dados.GE05B,
          ge008ae: dados.GE008AE,
          ge009: dados.GE001,
          ge010ae: dados.GE010AE,
          ge011ae: dados.GE011AE,
          ge019: dados.GE019,
          ge020: dados.GE020,
          ag026: dados.AG026,
          ag001: dados.AG001,
          es026: dados.ES026,
          es001: dados.ES001,
          gd06a: dados.GD06A,
          gd06b: dados.GD06B,
          gd12a: dados.GD12A,
          gd12b: dados.GD12B,
          fn026: dados.FN026,
          ge099: dados.GE099,
          ge201: dados.GE201,
          ge202: dados.GE202,
          co164: dados.CO164,
          co050: dados.CO050,
          co165: dados.CO165,
          co147: dados.CO147,
          co134: dados.CO134,
          co135: dados.CO135,
          co136: dados.CO136,
          cs050: dados.CO050,
          co162: dados.CO162,
          co178: dados.CO178,
          ge999dh: dados.GE999DH,
          ano: dados.ano,
          id_municipio: dados.id_municipio,
        })
      }else{

        const resGe = await Geral.query()
        .from('tedplan.geral_da_ae_dh')
        .where("id_geral_da_ae_dh", dados.id_geral_da_ae_dh)
        .fetch()
        const ge = resGe.toJSON()[0]
        console.log(dados.OP001_1);
        await Geral.query()
        .table('tedplan.geral_da_ae_dh')
        .where("id_geral_da_ae_dh", dados.id_geral_da_ae_dh)
        .update({
          ge001: dados.GE001 ? dados.GE001 : ge.ge001 ,
          ge002: dados.GE002 ? dados.GE002 : ge.ge002 ,
          ge007: dados.GE007 ? dados.GE007 : ge.ge007 ,
          ge008da: dados.GE008DA ? dados.GE008DA : ge.ge008da ,
          ge016: dados.GE016 ? dados.GE016 : ge.ge016 ,
          ge010: dados.GE010 ? dados.GE010 : ge.ge010 ,
          ge011: dados.GE011 ? dados.GE011 : ge.ge011 ,
          ge012: dados.GE012 ? dados.GE012 : ge.ge012 ,
          ad001: dados.AD001 ? dados.AD001 : ge.ad001 ,
          ad002: dados.AD002 ? dados.AD002 : ge.ad002 ,
          ad004: dados.AD004 ? dados.AD004 : ge.ad004 ,
          ie001: dados.IE001 ? dados.IE001 : ge.ie001 ,
          ie012: dados.IE012 ? dados.IE012 : ge.ie012 ,
          ie013: dados.IE013 ? dados.IE013 : ge.ie013 ,
          ie014: dados.IE014 ? dados.IE014 : ge.ie014 ,
          ie016: dados.IE016 ? dados.IE016 : ge.ie016 ,
          ie016a: dados.IE016A ? dados.IE016A : ge.ie016a ,
          op001_1: dados.OP001_1 ,
          op001_2: dados.OP001_2 ,
          op001_3: dados.OP001_3 ,
          op001a: dados.OP001A ? dados.OP001A : ge.op001a ,
          ri001_1: dados.RI001_1 ,
          ri001_2: dados.RI001_2 ,
          ri001_3: dados.RI001_3 ,
          ri001a: dados.RI001A ? dados.RI001A : ge.ri001a ,
          ri002_1: dados.RI002_1 ,
          ri002_2: dados.RI002_2 ,
          ri002_3: dados.RI002_3 ,
          ri002a: dados.RI002A ? dados.RI002A : ge.ri002a ,
          ri003_1: dados.RI003_1 ,
          ri003_2: dados.RI003_2 ,
          ri003_3: dados.RI003_3 ,
          ri003a: dados.RI003A ? dados.RI003A : ge.ri003a ,
          ri004_1: dados.RI004_1 ,
          ri004_2: dados.RI004_2 ,
          ri004_3: dados.RI004_3 ,
          ri004a: dados.RI004A ? dados.RI004A : ge.ri004a ,
          ri005: dados.RI005 ? dados.RI005 : ge.ri005 ,
          ri007: dados.RI007 ? dados.RI007 : ge.ri007 ,
          ri009: dados.RI009 ? dados.RI009 : ge.ri009 ,
          ri010: dados.RI010 ? dados.RI010 : ge.ri010 ,
          ri011: dados.RI011 ? dados.RI011 : ge.ri011 ,
          ri012: dados.RI012 ? dados.RI012 : ge.ri012 ,
          ri013: dados.RI013 ? dados.RI013 : ge.ri013 ,
          ge999da: dados.GE999DA ? dados.GE999DA : ge.ge999da ,
          ge005: dados.GE005 ? dados.GE005 : ge.ge005 ,
          ge05a: dados.GE05A ? dados.GE05A : ge.ge05a ,
          ge05b: dados.GE05B ? dados.GE05B : ge.ge05b ,
          ge008ae: dados.GE008AE ? dados.GE008AE : ge.ge008ae ,
          ge009: dados.GE001 ? dados.GE001 : ge.ge009 ,
          ge010ae: dados.GE010AE ? dados.GE010AE : ge.ge010ae ,
          ge011ae: dados.GE011AE ? dados.GE011AE : ge.ge011ae ,
          ge019: dados.GE019 ? dados.GE019 : ge.ge019 ,
          ge020: dados.GE020 ? dados.GE020 : ge.ge020 ,
          ag026: dados.AG026 ? dados.AG026 : ge.ag026 ,
          ag001: dados.AG001 ? dados.AG001 : ge.ag001 ,
          es026: dados.ES026 ? dados.ES026 : ge.es026 ,
          es001: dados.ES001 ? dados.ES001 : ge.es001 ,
          gd06a: dados.GD06A ? dados.GD06A : ge.gd06a ,
          gd06b: dados.GD06B ? dados.GD06B : ge.gd06b ,
          gd12a: dados.GD12A ? dados.GD12A : ge.gd12a ,
          gd12b: dados.GD12B ? dados.GD12B : ge.gd12b ,
          fn026: dados.FN026 ? dados.FN026 : ge.fn026 ,
          ge099: dados.GE099 ? dados.GE099 : ge.ge099 ,
          ge201: dados.GE201 ? dados.GE201 : ge.ge201 ,
          ge202: dados.GE202 ? dados.GE202 : ge.ge202 ,
          co164: dados.CO164 ? dados.CO164 : ge.co164 ,
          co050: dados.CO050 ? dados.CO050 : ge.co050 ,
          co165: dados.CO165 ? dados.CO165 : ge.co165 ,
          co147: dados.CO147 ? dados.CO147 : ge.co147 ,
          co134: dados.CO134 ? dados.CO134 : ge.co134 ,
          co135: dados.CO135 ? dados.CO135 : ge.co135 ,
          co136: dados.CO136 ? dados.CO136 : ge.co136 ,
          cs050: dados.CO050 ? dados.CO050 : ge.cs050 ,
          co162: dados.CO162 ? dados.CO162 : ge.co162 ,
          co178: dados.CO178 ? dados.CO178 : ge.co178 ,
          ge999dh: dados.GE999DH ? dados.GE999DH : ge.ge999dh ,
          ano: dados.ano ? dados.ano : ge.ano ,
          id_municipio: dados.id_municipio ? dados.id_municipio : ge.id_municipio ,
        })
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = GeralController
