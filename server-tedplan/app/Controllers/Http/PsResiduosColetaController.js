'use strict'
const PsFinanceiro = use('App/Models/PsFinanceiro')

class PsResiduosColetaController {
  async index(){
    return await PsFinanceiro.query()
    .from('')
  }

  async getUnidadesRsc({ request }){
    const { ano, id_municipio} = request.all()
    try {
      const res = await PsFinanceiro.query()
      .from('tedplan.unidades_residuos_solidos')
      .where('id_municipio', id_municipio)
      .where('ano', ano)
      .fetch()
      return res
    } catch (error) {
      console.log(error);
    }
  }

  async createUnidadeRsc({request}){
    const { municipio, nome_unidade, operador_unidade,
    cnpj_unidade, quant_residuos_exportados, ano, id_municipio }
    = request.all()
    try {
      await PsFinanceiro.query()
      .from('tedplan.unidades_residuos_solidos')
      .insert({
        municipio: municipio,
        nome_unidade: nome_unidade,
        operador_unidade: operador_unidade,
        cnpj_unidade: cnpj_unidade,
        quant_residuos_exportados: quant_residuos_exportados,
        ano: ano,
        id_municipio: id_municipio,
      })
    } catch (error) {
      console.log(error);
    }
  }
  // Lista de unidades de RSS
  async getUnidadesRss({ request }){
    const { ano, id_municipio} = request.all()
    try {
      const res = await PsFinanceiro.query()
      .from('tedplan.unidades_residuos_solidos_rss')
      .where('id_municipio', id_municipio)
      .where('ano', ano)
      .fetch()
      return res
    } catch (error) {
      console.log(error);
    }
  }
  // Criar unidades de RSS
  async createUnidadeRss({request}){
    const { municipio, nome_unidade, operador_unidade,
    cnpj_unidade, quant_residuos_exportados, ano, id_municipio }
    = request.all()
    try {
      await PsFinanceiro.query()
      .from('tedplan.unidades_residuos_solidos_rss')
      .insert({
        municipio: municipio,
        nome_unidade: nome_unidade,
        operador_unidade: operador_unidade,
        cnpj_unidade: cnpj_unidade,
        quant_residuos_exportados: quant_residuos_exportados,
        ano: ano,
        id_municipio: id_municipio,
      })
    } catch (error) {
      console.log(error);
    }
  }

  async getRsc({ request }){
    const { ano, id_municipio } = request.all()
    if(ano && id_municipio){
    return await PsFinanceiro.query()
    .from('tedplan.residuos_solidos_coleta')
    .where('id_municipio', id_municipio)
    .where('ano', ano)
    .fetch()
    }
    return null
  }

  async store({ response, request }){
    const dados = request.all()

    try {
      if(!dados.id_residuos_solidos_coleta){

        await PsFinanceiro.query()
        .from('tedplan.residuos_solidos_coleta')
        .insert({
          ca004: dados.CA004,
          ca005: dados.CA005,
          ca006: dados.CA006,
          ca007: dados.CA007,
          ca008: dados.CA008,
          ca009: dados.CA009,
          cc010: dados.CC010,
          cc013: dados.CC013,
          cc014: dados.CC014,
          cc015: dados.CC015,
          cc017: dados.CC017,
          cc018: dados.CC018,
          cc019: dados.CC019,
          cc020: dados.CC020,
          cc099: dados.CC099,
          co008: dados.CO008,
          co012: dados.CO012,
          co019: dados.CO019,
          co020: dados.CO020,
          co021: dados.CO021,
          co054: dados.CO054,
          co055: dados.CO055,
          co056: dados.CO056,
          co057: dados.CO057,
          co058: dados.CO058,
          co059: dados.CO059,
          co063: dados.CO063,
          co064: dados.CO064,
          co065: dados.CO065,
          co066: dados.CO066,
          co067: dados.CO067,
          co068: dados.CO068,
          co071: dados.CO071,
          co072: dados.CO072,
          co073: dados.CO073,
          co074: dados.CO074,
          co075: dados.CO075,
          co076: dados.CO076,
          co077: dados.CO077,
          co082: dados.CO082,
          co083: dados.CO083,
          co084: dados.CO084,
          co085: dados.CO085,
          co086: dados.CO086,
          co090: dados.CO090,
          co091: dados.CO091,
          co092: dados.CO092,
          co093: dados.CO093,
          co094: dados.CO094,
          co095: dados.CO095,
          co108: dados.CO108,
          co109: dados.CO109,
          co110: dados.CO110,
          co111: dados.CO111,
          co112: dados.CO112,
          co113: dados.CO113,
          co115: dados.CO115,
          co116: dados.CO116,
          co117: dados.CO117,
          co118: dados.CO118,
          co119: dados.CO119,
          co131: dados.CO131,
          co140: dados.CO140,
          co141: dados.CO141,
          co142: dados.CO142,
          co146: dados.CO146,
          co148: dados.CO148,
          co149: dados.CO149,
          co150: dados.CO150,
          co151: dados.CO151,
          co152: dados.CO152,
          co154: dados.CO154,
          co155: dados.CO155,
          co156: dados.CO156,
          co157: dados.CO157,
          co158: dados.CO158,
          co159: dados.CO159,
          co160: dados.CO160,
          co163: dados.CO163,
          co999: dados.CO999,
          cp001: dados.CP001,
          cp002: dados.CP002,
          cp003: dados.CP003,
          cp004: dados.CP004,
          cp099: dados.CP099,
          cs001: dados.CS001,
          cs009: dados.CS009,
          cs010: dados.CS010,
          cs011: dados.CS011,
          cs012: dados.CS012,
          cs013: dados.CS013,
          cs014: dados.CS014,
          cs023: dados.CS023,
          cs024: dados.CS024,
          cs025: dados.CS025,
          cs026: dados.CS026,
          cs027: dados.CS027,
          cs028: dados.CS028,
          cs030: dados.CS030,
          cs031: dados.CS031,
          cs032: dados.CS032,
          cs034: dados.CS034,
          cs035: dados.CS035,
          cs036: dados.CS036,
          cs038: dados.CS038,
          cs042: dados.CS042,
          cs043: dados.CS043,
          cs044: dados.CS044,
          cs045: dados.CS045,
          cs046: dados.CS046,
          cs047: dados.CS047,
          cs048: dados.CS048,
          cs049: dados.CS049,
          cs051: dados.CS051,
          cs053: dados.CS053,
          cs054: dados.CS054,
          cs055: dados.CS055,
          cs056: dados.CS056,
          cs057: dados.CS057,
          cs057a: dados.CS057a,
          cs058: dados.CS058,
          cs059: dados.CS059,
          cs061: dados.CS061,
          cs062: dados.CS061,
          os001: dados.OS001,
          os003: dados.OS003,
          os004: dados.OS004,
          os005: dados.OS005,
          os006: dados.OS006,
          os007: dados.OS007,
          os008: dados.OS008,
          os009: dados.OS009,
          os010: dados.OS010,
          os011: dados.OS011,
          os012: dados.OS012,
          os014: dados.OS014,
          os015: dados.OS015,
          os016: dados.OS016,
          os017: dados.OS017,
          os018: dados.OS018,
          os019: dados.OS019,
          os020: dados.OS020,
          os021: dados.OS021,
          os022: dados.OS022,
          os023: dados.OS023,
          os025: dados.OS025,
          os026: dados.OS026,
          os027: dados.OS027,
          os028: dados.OS028,
          os029: dados.OS029,
          os030: dados.OS030,
          os031: dados.OS031,
          os032: dados.OS032,
          os033: dados.OS033,
          os040: dados.OS040,
          os041: dados.OS041,
          os042: dados.OS042,
          os043: dados.OS043,
          os044: dados.OS044,
          os045: dados.OS045,
          os047: dados.OS047,
          os048: dados.OS048,
          os049: dados.OS049,
          os050: dados.OS050,
          os051: dados.OS051,
          os052: dados.OS052,
          rs003: dados.RS003,
          rs004: dados.RS004,
          rs008: dados.RS008,
          rs020: dados.RS020,
          rs026: dados.RS026,
          rs027: dados.RS027,
          rs028: dados.RS028,
          rs030: dados.RS030,
          rs036: dados.RS036,
          rs038: dados.RS038,
          rs040: dados.RS040,
          rs041: dados.RS041,
          rs042: dados.RS042,
          rs043: dados.RS043,
          rs044: dados.RS044,
          rs045: dados.RS045,
          rs046: dados.RS046,
          tb001: dados.TB001,
          tb002: dados.TB002,
          tb003: dados.TB003,
          tb004: dados.TB004,
          tb005: dados.TB005,
          tb006: dados.TB006,
          tb007: dados.TB007,
          tb008: dados.TB008,
          tb009: dados.TB009,
          tb010: dados.TB010,
          tb011: dados.TB011,
          tb012: dados.TB012,
          tb013: dados.TB013,
          tb014: dados.TB014,
          tb015: dados.TB015,
          tb016: dados.TB016,
          tb017: dados.TB017,
          tb018: dados.TB018,
          tb019: dados.TB019,
          tb020: dados.TB020,
          tb021: dados.TB021,
          tb022: dados.TB022,
          tb023: dados.TB023,
          tb024: dados.TB024,
          tb025: dados.TB025,
          tb026: dados.TB026,
          tb027: dados.TB027,
          tb028: dados.TB028,
          va010: dados.VA010,
          va011: dados.VA011,
          va016: dados.VA016,
          va020: dados.VA020,
          va039: dados.VA039,
          ano: dados.ano,
          id_municipio: dados.id_municipio,
        })
      }


      if(dados.id_residuos_solidos_coleta){

        const dadosRs = await PsFinanceiro.query()
        .from('tedplan.residuos_solidos_coleta')
        .where('id_residuos_solidos_coleta', dados.id_residuos_solidos_coleta)
        .fetch()
        const rsc = dadosRs.toJSON()[0]

        await PsFinanceiro.query()
        .from('tedplan.residuos_solidos_coleta')
        .where('id_residuos_solidos_coleta', dados.id_residuos_solidos_coleta)
        .update({
          ca004: dados.CA004 ? dados.CA004 : rsc.ca004,
          ca005: dados.CA005 ? dados.CA005 : rsc.ca005,
          ca006: dados.CA006 ? dados.CA006 : rsc.ca006,
          ca007: dados.CA007 ? dados.CA007 : rsc.ca007,
          ca008: dados.CA008 ? dados.CA008 : rsc.ca008,
          ca009: dados.CA009 ? dados.CA009 : rsc.CA009,
          cc010: dados.CC010 ? dados.CC010 : rsc.CC010,
          cc013: dados.CC013 ? dados.CC013 : rsc.CC013,
          cc014: dados.CC014 ? dados.CC014: rsc.CC014,
          cc015: dados.CC015 ? dados.CC015: rsc.CC015,
          cc017: dados.CC017 ? dados.CC017: rsc.CC017,
          cc018: dados.CC018 ? dados.CC018: rsc.CC018,
          cc019: dados.CC019 ? dados.CC019: rsc.CC019,
          cc020: dados.CC020 ? dados.CC020: rsc.CC020,
          cc099: dados.CC099 ? dados.CC099: rsc.CC099,
          co008: dados.CO008 ? dados.CO008: rsc.CO008,
          co012: dados.CO012 ? dados.CO012: rsc.CO012,
          co019: dados.CO019 ? dados.CO019: rsc.CO019,
          co020: dados.CO020 ? dados.CO020: rsc.CO020,
          co021: dados.CO021 ? dados.CO021: rsc.CO021,
          co054: dados.CO054 ? dados.CO054: rsc.CO054,
          co055: dados.CO055 ? dados.CO055: rsc.CO055,
          co056: dados.CO056 ? dados.CO056: rsc.CO056,
          co057: dados.CO057 ? dados.CO057: rsc.CO057,
          co058: dados.CO058 ? dados.CO058: rsc.CO058,
          co059: dados.CO059 ? dados.CO059: rsc.CO059,
          co063: dados.CO063 ? dados.CO063: rsc.CO063,
          co064: dados.CO064 ? dados.CO064: rsc.CO064,
          co065: dados.CO065 ? dados.CO065: rsc.CO065,
          co066: dados.CO066 ? dados.CO066: rsc.CO066,
          co067: dados.CO067 ? dados.CO067: rsc.CO067,
          co068: dados.CO068 ? dados.CO068: rsc.CO068,
          co071: dados.CO071 ? dados.CO071: rsc.CO071,
          co072: dados.CO072 ? dados.CO072: rsc.CO072,
          co073: dados.CO073 ? dados.CO073: rsc.CO073,
          co074: dados.CO074 ? dados.CO074: rsc.CO074,
          co075: dados.CO075 ? dados.CO075: rsc.CO075,
          co076: dados.CO076 ? dados.CO076: rsc.CO076,
          co077: dados.CO077 ? dados.CO077: rsc.CO077,
          co082: dados.CO082 ? dados.CO082: rsc.CO082,
          co083: dados.CO083 ? dados.CO083: rsc.CO083,
          co084: dados.CO084 ? dados.CO084: rsc.CO084,
          co085: dados.CO085 ? dados.CO085: rsc.CO085,
          co086: dados.CO086 ? dados.CO086: rsc.CO086,
          co090: dados.CO090 ? dados.CO090: rsc.CO090,
          co091: dados.CO091 ? dados.CO091: rsc.CO091,
          co092: dados.CO092 ? dados.CO092: rsc.CO092,
          co093: dados.CO093 ? dados.CO093: rsc.CO093,
          co094: dados.CO094 ? dados.CO094: rsc.CO094,
          co095: dados.CO095 ? dados.CO095: rsc.CO095,
          co108: dados.CO108 ? dados.CO108: rsc.CO108,
          co109: dados.CO109 ? dados.CO109: rsc.CO109,
          co110: dados.CO110 ? dados.CO110: rsc.CO110,
          co111: dados.CO111 ? dados.CO111: rsc.CO111,
          co112: dados.CO112 ? dados.CO112: rsc.CO112,
          co113: dados.CO113 ? dados.CO113: rsc.CO113,
          co115: dados.CO115 ? dados.CO115: rsc.CO115,
          co116: dados.CO116 ? dados.CO116: rsc.CO116,
          co117: dados.CO117 ? dados.CO117: rsc.CO117,
          co118: dados.CO118 ? dados.CO118: rsc.CO118,
          co119: dados.CO119 ? dados.CO119: rsc.CO119,
          co131: dados.CO131 ? dados.CO131: rsc.CO131,
          co140: dados.CO140 ? dados.CO140: rsc.CO140,
          co141: dados.CO141 ? dados.CO141: rsc.CO141,
          co142: dados.CO142 ? dados.CO142: rsc.CO142,
          co146: dados.CO146 ? dados.CO146: rsc.CO146,
          co148: dados.CO148 ? dados.CO148: rsc.CO148,
          co149: dados.CO149 ? dados.CO149: rsc.CO149,
          co150: dados.CO150 ? dados.CO150: rsc.CO150,
          co151: dados.CO151 ? dados.CO151: rsc.CO151,
          co152: dados.CO152 ? dados.CO152: rsc.CO152,
          co154: dados.CO154 ? dados.CO154: rsc.CO154,
          co155: dados.CO155 ? dados.CO155: rsc.CO155,
          co156: dados.CO156 ? dados.CO156: rsc.CO156,
          co157: dados.CO157 ? dados.CO157: rsc.CO157,
          co158: dados.CO158 ? dados.CO158: rsc.CO158,
          co159: dados.CO159 ? dados.CO159: rsc.CO159,
          co160: dados.CO160 ? dados.CO160: rsc.CO160,
          co163: dados.CO163 ? dados.CO163: rsc.CO163,
          co999: dados.CO999 ? dados.CO999: rsc.CO999,
          cp001: dados.CP001 ? dados.CP001: rsc.CP001,
          cp002: dados.CP002 ? dados.CP002: rsc.CP002,
          cp003: dados.CP003 ? dados.CP003: rsc.CP003,
          cp004: dados.CP004 ? dados.CP004: rsc.CP004,
          cp099: dados.CP099 ? dados.CP099: rsc.CP099,
          cs001: dados.CS001 ? dados.CS001: rsc.CS001,
          cs009: dados.CS009 ? dados.CS009: rsc.CS009,
          cs010: dados.CS010 ? dados.CS010: rsc.CS010,
          cs011: dados.CS011 ? dados.CS011: rsc.CS011,
          cs012: dados.CS012 ? dados.CS012: rsc.CS012,
          cs013: dados.CS013 ? dados.CS013: rsc.CS013,
          cs014: dados.CS014 ? dados.CS014: rsc.CS014,
          cs023: dados.CS023 ? dados.CS023: rsc.CS023,
          cs024: dados.CS024 ? dados.CS024: rsc.CS024,
          cs025: dados.CS025 ? dados.CS025: rsc.CS025,
          cs026: dados.CS026 ? dados.CS026: rsc.CS026,
          cs027: dados.CS027 ? dados.CS027: rsc.CS027,
          cs028: dados.CS028 ? dados.CS028: rsc.CS028,
          cs030: dados.CS030 ? dados.CS030: rsc.CS030,
          cs031: dados.CS031 ? dados.CS031: rsc.CS031,
          cs032: dados.CS032 ? dados.CS032: rsc.CS032,
          cs034: dados.CS034 ? dados.CS034: rsc.CS034,
          cs035: dados.CS035 ? dados.CS035: rsc.CS035,
          cs036: dados.CS036 ? dados.CS036: rsc.CS036,
          cs038: dados.CS038 ? dados.CS038: rsc.CS038,
          cs042: dados.CS042 ? dados.CS042: rsc.CS042,
          cs043: dados.CS043 ? dados.CS043: rsc.CS043,
          cs044: dados.CS044 ? dados.CS044: rsc.CS044,
          cs045: dados.CS045 ? dados.CS045: rsc.CS045,
          cs046: dados.CS046 ? dados.CS046: rsc.CS046,
          cs047: dados.CS047 ? dados.CS047: rsc.CS047,
          cs048: dados.CS048 ? dados.CS048: rsc.CS048,
          cs049: dados.CS049 ? dados.CS049: rsc.CS049,
          cs051: dados.CS051 ? dados.CS051: rsc.CS051,
          cs053: dados.CS053 ? dados.CS053: rsc.CS053,
          cs054: dados.CS054 ? dados.CS054: rsc.CS054,
          cs055: dados.CS055 ? dados.CS055: rsc.CS055,
          cs056: dados.CS056 ? dados.CS056: rsc.CS056,
          cs057: dados.CS057 ? dados.CS057: rsc.CS057,
          cs057a: dados.CS057a ? dados.CS057a: rsc.CS057a,
          cs058: dados.CS058 ? dados.CS058: rsc.CS058,
          cs059: dados.CS059 ? dados.CS059: rsc.CS059,
          cs061: dados.CS061 ? dados.CS061: rsc.CS061,
          cs062: dados.CS062 ? dados.CS062: rsc.CS062,
          os001: dados.OS001 ? dados.OS001: rsc.OS001,
          os003: dados.OS003 ? dados.OS003: rsc.OS003,
          os004: dados.OS004 ? dados.OS004: rsc.OS004,
          os005: dados.OS005 ? dados.OS005: rsc.OS005,
          os006: dados.OS006 ? dados.OS006: rsc.OS006,
          os007: dados.OS007 ? dados.OS007: rsc.OS007,
          os008: dados.OS008 ? dados.OS008: rsc.OS008,
          os009: dados.OS009 ? dados.OS009: rsc.OS009,
          os010: dados.OS010 ? dados.OS010: rsc.OS010,
          os011: dados.OS011 ? dados.OS011: rsc.OS011,
          os012: dados.OS012 ? dados.OS012: rsc.OS012,
          os014: dados.OS014 ? dados.OS014: rsc.OS014,
          os015: dados.OS015 ? dados.OS015: rsc.OS015,
          os016: dados.OS016 ? dados.OS016: rsc.OS016,
          os017: dados.OS017 ? dados.OS017: rsc.OS017,
          os018: dados.OS018 ? dados.OS018: rsc.OS018,
          os019: dados.OS019 ? dados.OS019: rsc.OS019,
          os020: dados.OS020 ? dados.OS020: rsc.OS020,
          os021: dados.OS021 ? dados.OS021: rsc.OS021,
          os022: dados.OS022 ? dados.OS022: rsc.OS022,
          os023: dados.OS023 ? dados.OS023: rsc.OS023,
          os025: dados.OS025 ? dados.OS025: rsc.OS025,
          os026: dados.OS026 ? dados.OS026: rsc.OS026,
          os027: dados.OS027 ? dados.OS027: rsc.OS027,
          os028: dados.OS028 ? dados.OS028: rsc.OS028,
          os029: dados.OS029 ? dados.OS029: rsc.OS029,
          os030: dados.OS030 ? dados.OS030: rsc.OS030,
          os031: dados.OS031 ? dados.OS031: rsc.OS031,
          os032: dados.OS032 ? dados.OS032: rsc.OS032,
          os033: dados.OS033 ? dados.OS033: rsc.OS033,
          os040: dados.OS040 ? dados.OS040: rsc.OS040,
          os041: dados.OS041 ? dados.OS041: rsc.OS041,
          os042: dados.OS042 ? dados.OS042: rsc.OS042,
          os043: dados.OS043 ? dados.OS043: rsc.OS043,
          os044: dados.OS044 ? dados.OS044: rsc.OS044,
          os045: dados.OS045 ? dados.OS045: rsc.OS045,
          os047: dados.OS047 ? dados.OS047: rsc.OS047,
          os048: dados.OS048 ? dados.OS048: rsc.OS048,
          os049: dados.OS049 ? dados.OS049: rsc.OS049,
          os050: dados.OS050 ? dados.OS050: rsc.OS050,
          os051: dados.OS051 ? dados.OS051: rsc.OS051,
          os052: dados.OS052 ? dados.OS052: rsc.OS052,
          rs003: dados.RS003 ? dados.RS003: rsc.RS003,
          rs004: dados.RS004 ? dados.RS004: rsc.RS004,
          rs008: dados.RS008 ? dados.RS008: rsc.RS008,
          rs020: dados.RS020 ? dados.RS020: rsc.RS020,
          rs026: dados.RS026 ? dados.RS026: rsc.RS026,
          rs027: dados.RS027 ? dados.RS027: rsc.RS027,
          rs028: dados.RS028 ? dados.RS028: rsc.RS028,
          rs030: dados.RS030 ? dados.RS030: rsc.RS030,
          rs036: dados.RS036 ? dados.RS036: rsc.RS036,
          rs038: dados.RS038 ? dados.RS038: rsc.RS038,
          rs040: dados.RS040 ? dados.RS040: rsc.RS040,
          rs041: dados.RS041 ? dados.RS041: rsc.RS041,
          rs042: dados.RS042 ? dados.RS042: rsc.RS042,
          rs043: dados.RS043 ? dados.RS043: rsc.RS043,
          rs044: dados.RS044 ? dados.RS044: rsc.RS044,
          rs045: dados.RS045 ? dados.RS045: rsc.RS045,
          rs046: dados.RS046 ? dados.RS046: rsc.RS046,
          tb001: dados.TB001 ? dados.TB001: rsc.TB001,
          tb002: dados.TB002 ? dados.TB002: rsc.TB002,
          tb003: dados.TB003 ? dados.TB003: rsc.TB003,
          tb004: dados.TB004 ? dados.TB004: rsc.TB004,
          tb005: dados.TB005 ? dados.TB005: rsc.TB005,
          tb006: dados.TB006 ? dados.TB006: rsc.TB006,
          tb007: dados.TB007 ? dados.TB007: rsc.TB007,
          tb008: dados.TB008 ? dados.TB008: rsc.TB008,
          tb009: dados.TB009 ? dados.TB009: rsc.TB009,
          tb010: dados.TB010 ? dados.TB010: rsc.TB010,
          tb011: dados.TB011 ? dados.TB011: rsc.TB011,
          tb012: dados.TB012 ? dados.TB012: rsc.TB012,
          tb013: dados.TB013 ? dados.TB013: rsc.TB013,
          tb014: dados.TB014 ? dados.TB014: rsc.TB014,
          tb015: dados.TB015 ? dados.TB015: rsc.TB015,
          tb016: dados.TB016 ? dados.TB016: rsc.TB016,
          tb017: dados.TB017 ? dados.TB017: rsc.TB017,
          tb018: dados.TB018 ? dados.TB018: rsc.TB018,
          tb019: dados.TB019 ? dados.TB019: rsc.TB019,
          tb020: dados.TB020 ? dados.TB020: rsc.TB020,
          tb021: dados.TB021 ? dados.TB021: rsc.TB021,
          tb022: dados.TB022 ? dados.TB022: rsc.TB022,
          tb023: dados.TB023 ? dados.TB023: rsc.TB023,
          tb024: dados.TB024 ? dados.TB024: rsc.TB024,
          tb025: dados.TB025 ? dados.TB025: rsc.TB025,
          tb026: dados.TB026 ? dados.TB026: rsc.TB026,
          tb027: dados.TB027 ? dados.TB027: rsc.TB027,
          tb028: dados.TB028 ? dados.TB028: rsc.TB028,
          va010: dados.VA010 ? dados.VA010: rsc.VA010,
          va011: dados.VA011 ? dados.VA011: rsc.VA011,
          va016: dados.VA016 ? dados.VA016: rsc.VA016,
          va020: dados.VA020 ? dados.VA020: rsc.VA020,
          va039: dados.VA039 ? dados.VA039: rsc.VA039,
        });


      }
    } catch (error) {
      console.log(error);
    }
  }

  async getCooperativasCatadores({ request }){
    const dados = request.all()
    try {
      const res = await PsFinanceiro.query()
      .from('tedplan.cooperativa_associacao_catadores')
      .where('id_municipio', dados.id_municipio)
      .where('ano', dados.ano)
      .fetch()

      return res
    } catch (error) {
      console.log(error);
    }
  }

  async createCooperativaCatadores({ request }){
    const dados = request.all()
    try {
      const res = await PsFinanceiro.query()
      .from('tedplan.cooperativa_associacao_catadores')
      .insert({
        nome_associacao: dados.nome_associacao,
        numero_associados: dados.numero_associados,
        ano: dados.ano,
        id_municipio: dados.id_municipio
      })
      return res
    } catch (error) {
      console.log(error);
    }
  }

  async destroyCAC({ request }){
    const { id } = request.all()
    try {
      const res = await PsFinanceiro.query()
      .from('tedplan.cooperativa_associacao_catadores')
      .where('id_cooperativa_associacao_catadores', id)
      .delete()
      return res
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = PsResiduosColetaController
