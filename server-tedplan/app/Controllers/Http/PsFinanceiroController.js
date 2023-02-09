"use strict";

const PsFinanceiro = use("App/Models/PsFinanceiro");

class PsFinanceiroController {
  async getDadosFinanceiros({ request }) {
    const { id_municipio, ano } = request.all();
    return await PsFinanceiro.query()
      .select('*', 'fn_aes.fn003 as aes_fn003',
      'fn_aes.fn004 as aes_fn004',
      'fn_aes.fn005 as aes_fn005',
      'fn_aes.fn008 as aes_fn008',
      'fn_aes.fn013 as aes_fn013',
      'fn_aes.fn015 as aes_fn015',
      'fn_aes.fn016 as aes_fn016',
      'fn_aes.fn017 as aes_fn017',
      'fn_aes.fn018 as aes_fn018',
      'fn_aes.fn019 as aes_fn019',
      'fn_aes.fn020 as aes_fn020',
      'fn_aes.fn021 as aes_fn021',
      'fn_aes.fn022 as aes_fn022',
      'fn_aes.fn023 as aes_fn023',
      'fn_aes.fn024 as aes_fn024',
      'fn_dap.fn016 as dap_fn016',
      'fn_rs.fn999 as residuos_fn999',
      'fn_dap.fn999 as drenagem_fn999')
      .from("tedplan.fn_residuos_solidos as fn_rs")
      .innerJoin(
        "tedplan.fn_drenagem_aguas_pluviais as fn_dap",
        "fn_rs.id_municipio",
        "fn_dap.id_municipio"
      )
      .innerJoin(
        "tedplan.fn_agua_esgoto_sanitario as fn_aes",
        "fn_rs.id_municipio",
        "fn_aes.id_municipio"
      )
      .where("fn_rs.id_municipio", id_municipio)
      .where("fn_rs.ano", ano)
      .fetch();
  }
  async store({ request }) {
    try {
      const data = new Date();
      const dados = request.all();
      const ano = dados.ano ? dados.ano : data.getFullYear();

      if (dados.id_fn_residuos_solidos) {
        const rs = await PsFinanceiro.query()
        .from("tedplan.fn_residuos_solidos")
        .where("id_fn_residuos_solidos", dados.id_fn_residuos_solidos)
        .fetch()

        

        await PsFinanceiro.query()
          .from("tedplan.fn_residuos_solidos")
          .where("id_fn_residuos_solidos", dados.id_fn_residuos_solidos)
          .update({
            fn201: dados.FN201 ? dados.FN201 : rs.fn201 ,
            fn202: dados.FN202 ? dados.FN202 : rs.fn202 ,
            fn203: dados.FN203 ? dados.FN203 : rs.fn203 ,
            fn204: dados.FN204 ? dados.FN204 : rs.fn204 ,
            fn205: dados.FN205 ? dados.FN205 : rs.fn205 ,
            fn206: dados.FN206 ? dados.FN206 : rs.fn206 ,
            fn207: dados.FN207 ? dados.FN207 : rs.fn207 ,
            fn208: dados.FN208 ? dados.FN208 : rs.fn208 ,
            fn209: dados.FN209 ? dados.FN209 : rs.fn209 ,
            fn210: dados.FN210 ? dados.FN210 : rs.fn210 ,
            fn211: dados.FN211 ? dados.FN211 : rs.fn211 ,
            fn212: dados.FN212 ? dados.FN212 : rs.fn212 ,
            fn213: dados.FN213 ? dados.FN213 : rs.fn213 ,
            fn214: dados.FN214 ? dados.FN214 : rs.fn214 ,
            fn215: dados.FN215 ? dados.FN215 : rs.fn215 ,
            fn216: dados.FN216 ? dados.FN216 : rs.fn216 ,
            fn217: dados.FN217 ? dados.FN217 : rs.fn217 ,
            fn218: dados.FN218 ? dados.FN218 : rs.fn218 ,
            fn219: dados.FN219 ? dados.FN219 : rs.fn219 ,
            fn220: dados.FN220 ? dados.FN220 : rs.fn220 ,
            fn223: dados.FN223 ? dados.FN223 : rs.fn223 ,
            fn221: dados.FN221 ? dados.FN221 : rs.fn221 ,
            fn222: dados.FN222 ? dados.FN222 : rs.fn222 ,
            fn224: dados.FN224 ? dados.FN224 : rs.fn224 ,
            fn225: dados.FN225 ? dados.FN225 : rs.fn225 ,
            fn226: dados.FN226 ? dados.FN226 : rs.fn226 ,
            fn227: dados.FN227 ? dados.FN227 : rs.fn227 ,
            fn999: dados.RESIDUOS_FN999 ? dados.RESIDUOS_FN999 : rs.fn999 ,
          });
      } else {
        const resRs = await PsFinanceiro.query()
          .from("tedplan.fn_residuos_solidos")
          .insert({
            fn201: dados.FN201,
            fn202: dados.FN202,
            fn203: dados.FN203,
            fn204: dados.FN204,
            fn205: dados.FN205,
            fn206: dados.FN206,
            fn207: dados.FN207,
            fn208: dados.FN208,
            fn209: dados.FN209,
            fn210: dados.FN210,
            fn211: dados.FN211,
            fn212: dados.FN212,
            fn213: dados.FN213,
            fn214: dados.FN214,
            fn215: dados.FN215,
            fn216: dados.FN216,
            fn217: dados.FN217,
            fn218: dados.FN218,
            fn219: dados.FN219,
            fn220: dados.FN220,
            fn223: dados.FN223,
            fn221: dados.FN221,
            fn222: dados.FN222,
            fn224: dados.FN224,
            fn225: dados.FN225,
            fn226: dados.FN226,
            fn227: dados.FN227,
            fn999: dados.RESIDUOS_FN999,
            ano: ano,
            id_municipio: dados.id_municipio,
          });
      }

      if (dados.id_fn_drenagem_aguas_pluviais) {

        const resDap = await PsFinanceiro.query()
        .from("tedplan.fn_drenagem_aguas_pluviais")
        .where(
          "id_fn_drenagem_aguas_pluviais",
          dados.id_fn_drenagem_aguas_pluviais
        )
        .fetch()

        await PsFinanceiro.query()
          .from("tedplan.fn_drenagem_aguas_pluviais")
          .where(
            "id_fn_drenagem_aguas_pluviais",
            dados.id_fn_drenagem_aguas_pluviais
          )
          .update({
            cb001: dados.CB001 ? dados.CB001 : resDap.cb001 ,
            cb002: dados.CB002 ? dados.CB002 : resDap.cb002 ,
            cb002a: dados.CB002A ? dados.CB002A : resDap.cb002a ,
            cb003: dados.CB003 ? dados.CB003 : resDap.cb003 ,
            cb004: dados.CB004 ? dados.CB004 : resDap.cb004 ,
            cb999: dados.CB999 ? dados.CB999 : resDap.cb999 ,
            fn003: dados.FN003 ? dados.FN003 : resDap.fn003 ,
            fn004: dados.FN004 ? dados.FN004 : resDap.fn004 ,
            fn004a: dados.FN004A ? dados.FN004A : resDap.fn004a ,
            fn005: dados.FN005 ? dados.FN005 : resDap.fn005 ,
            fn008: dados.FN008 ? dados.FN008 : resDap.fn008 ,
            fn009: dados.FN009 ? dados.FN009 : resDap.fn009 ,
            fn015: dados.FN015 ? dados.FN015 : resDap.fn015 ,
            fn016: dados.FN016 ? dados.FN016 : resDap.fn016 ,
            fn013: dados.FN013 ? dados.FN013 : resDap.fn013 ,
            fn012: dados.FN012 ? dados.FN012 : resDap.fn012 ,
            fn024: dados.FN024 ? dados.FN024 : resDap.fn024 ,
            fn018: dados.FN018 ? dados.FN018 : resDap.fn018 ,
            fn020: dados.FN020 ? dados.FN020 : resDap.fn020 ,
            fn022: dados.FN022 ? dados.FN022 : resDap.fn022 ,
            fn017: dados.FN017 ? dados.FN017 : resDap.fn017 ,
            fn019: dados.FN019 ? dados.FN019 : resDap.fn019 ,
            fn021: dados.FN021 ? dados.FN021 : resDap.fn021 ,
            fn023: dados.FN023 ? dados.FN023 : resDap.fn023 ,
            fn999: dados.DRENAGEM_FN999 ? dados.DRENAGEM_FN999 : resDap.fn999 ,

          });
      } else {
        const resDap = await PsFinanceiro.query()
          .from("tedplan.fn_drenagem_aguas_pluviais")
          .insert({
            cb001: dados.CB001,
            cb002: dados.CB002,
            cb002a: dados.CB002A,
            cb003: dados.CB003,
            cb004: dados.CB004,
            cb999: dados.CB999,
            fn003: dados.FN003,
            fn004: dados.FN004,
            fn004a: dados.FN004A,
            fn005: dados.FN005,
            fn008: dados.FN008,
            fn009: dados.FN009,
            fn015: dados.FN015,
            fn016: dados.FN016,
            fn013: dados.FN013,
            fn012: dados.FN012,
            fn024: dados.FN024,
            fn018: dados.FN018,
            fn020: dados.FN020,
            fn022: dados.FN022,
            fn017: dados.FN017,
            fn019: dados.FN019,
            fn021: dados.FN021,
            fn023: dados.FN023,
            fn999: dados.DRENAGEM_FN999,
            ano: ano,
            id_municipio: dados.id_municipio,
          });
      }
      
      if (dados.id_fn_agua_esgoto_sanitario) {

        const resAes = await PsFinanceiro.query()
        .from("tedplan.fn_agua_esgoto_sanitario")
        .where(
          "id_fn_agua_esgoto_sanitario",
          dados.id_fn_agua_esgoto_sanitario
        ).fetch()
        console.log(dados.AES_FN004);
        await PsFinanceiro.query()
          .from("tedplan.fn_agua_esgoto_sanitario")
          .where(
            "id_fn_agua_esgoto_sanitario",
            dados.id_fn_agua_esgoto_sanitario
          )
          .update({
            fn002: dados.FN002 ? dados.FN002 : resAes.fn002 ,
            fn003: dados.AES_FN003 ? dados.AES_FN003 : resAes.fn003 ,
            fn007: dados.FN007 ? dados.FN007 : resAes.fn007 ,
            fn038: dados.FN038 ? dados.FN038 : resAes.fn038 ,
            fn001: dados.FN001 ? dados.FN001 : resAes.fn001 ,
            fn004: dados.AES_FN004 ? dados.AES_FN004 : resAes.fn004 ,
            fn005: dados.AES_FN005 ? dados.AES_FN005 : resAes.fn005 ,
            fn006: dados.FN006 ? dados.FN006 : resAes.fn006 ,
            fn008: dados.AES_FN008 ? dados.AES_FN008 : resAes.fn008 ,
            fn010: dados.FN010 ? dados.FN010 : resAes.fn010 ,
            fn011: dados.FN011 ? dados.FN011 : resAes.fn011 ,
            fn013: dados.AES_FN013 ? dados.AES_FN013 : resAes.fn013 ,
            fn014: dados.FN014 ? dados.FN014 : resAes.fn014 ,
            fn020: dados.AES_FN020 ? dados.AES_FN020 : resAes.fn020 ,
            fn039: dados.FN039 ? dados.FN039 : resAes.fn039 ,
            fn021: dados.AES_FN021 ? dados.AES_FN021 : resAes.fn021 ,
            fn027: dados.FN027 ? dados.FN027 : resAes.fn027 ,
            fn015: dados.AES_FN015 ? dados.AES_FN015 : resAes.fn015 ,
            fn035: dados.FN035 ? dados.FN035 : resAes.fn035 ,
            fn036: dados.FN036 ? dados.FN036 : resAes.fn036 ,
            fn016: dados.AES_FN016 ? dados.AES_FN016 : resAes.fn016 ,
            fn019: dados.AES_FN019 ? dados.AES_FN019 : resAes.fn019 ,
            fn022: dados.AES_FN022 ? dados.AES_FN022 : resAes.fn022 ,
            fn028: dados.FN028 ? dados.FN028 : resAes.fn028 ,
            fn017: dados.AES_FN017 ? dados.AES_FN017 : resAes.fn017 ,
            fn034: dados.FN034 ? dados.FN034 : resAes.fn034 ,
            fn037: dados.FN037 ? dados.FN037 : resAes.fn037 ,
            fn018: dados.AES_FN018 ? dados.AES_FN018 : resAes.fn018 ,
            fn023: dados.AES_FN023 ? dados.AES_FN023 : resAes.fn023 ,
            fn024: dados.AES_FN024 ? dados.AES_FN024 : resAes.fn024 ,
            fn025: dados.FN025 ? dados.FN025 : resAes.fn025 ,
            fn030: dados.FN030 ? dados.FN030 : resAes.fn030 ,
            fn031: dados.FN031 ? dados.FN031 : resAes.fn031 ,
            fn032: dados.FN032 ? dados.FN032 : resAes.fn032 ,
            fn033: dados.FN033 ? dados.FN033 : resAes.fn033 ,
            fn041: dados.FN041 ? dados.FN041 : resAes.fn041 ,
            fn042: dados.FN042 ? dados.FN042 : resAes.fn042 ,
            fn043: dados.FN043 ? dados.FN043 : resAes.fn043 ,
            fn044: dados.FN044 ? dados.FN044 : resAes.fn044 ,
            fn045: dados.FN045 ? dados.FN045 : resAes.fn045 ,
            fn046: dados.FN046 ? dados.FN046 : resAes.fn046 ,
            fn047: dados.FN047 ? dados.FN047 : resAes.fn047 ,
            fn048: dados.FN048 ? dados.FN048 : resAes.fn048 ,
            fn051: dados.FN051 ? dados.FN051 : resAes.fn051 ,
            fn052: dados.FN052 ? dados.FN052 : resAes.fn052 ,
            fn053: dados.FN053 ? dados.FN053 : resAes.fn053 ,
            fn054: dados.FN054 ? dados.FN054 : resAes.fn054 ,
            fn055: dados.FN055 ? dados.FN055 : resAes.fn055 ,
            fn056: dados.FN056 ? dados.FN056 : resAes.fn056 ,
            fn057: dados.FN057 ? dados.FN057 : resAes.fn057 ,
            fn058: dados.FN058 ? dados.FN058 : resAes.fn058 ,
            fn098: dados.FN098 ? dados.FN098 : resAes.fn098 ,
            fn099: dados.FN099 ? dados.FN099 : resAes.fn099 ,

          });
      } else {
        console.log(dados.FN001);
        const resAes = await PsFinanceiro.query()
          .from("tedplan.fn_agua_esgoto_sanitario")
          .insert({
            fn002: dados.FN002,
            fn003: dados.FN003,
            fn007: dados.FN007,
            fn038: dados.FN038,
            fn001: dados.FN001,
            fn004: dados.AES_FN004,
            fn005: dados.FN005,
            fn006: dados.FN006,
            fn008: dados.FN008,
            fn010: dados.FN010,
            fn011: dados.FN011,
            fn013: dados.AES_FN013,
            fn014: dados.FN014,
            fn020: dados.FN020,
            fn039: dados.FN039,
            fn021: dados.FN021,
            fn027: dados.FN027,
            fn015: dados.AES_FN015,
            fn035: dados.FN035,
            fn036: dados.FN036,
            fn016: dados.AES_FN016,
            fn019: dados.FN019,
            fn022: dados.FN022,
            fn028: dados.FN028,
            fn017: dados.FN017,
            fn034: dados.FN034,
            fn037: dados.FN037,
            fn018: dados.FN018,
            fn023: dados.FN023,
            fn024: dados.FN024,
            fn025: dados.FN025,
            fn030: dados.FN030,
            fn031: dados.FN031,
            fn032: dados.FN032,
            fn033: dados.FN033,
            fn041: dados.FN041,
            fn042: dados.FN042,
            fn043: dados.FN043,
            fn044: dados.FN044,
            fn045: dados.FN045,
            fn046: dados.FN046,
            fn047: dados.FN047,
            fn048: dados.FN048,
            fn051: dados.FN051,
            fn052: dados.FN052,
            fn053: dados.FN053,
            fn054: dados.FN054,
            fn055: dados.FN055,
            fn056: dados.FN056,
            fn057: dados.FN057,
            fn058: dados.FN058,
            fn098: dados.FN098,
            fn099: dados.FN099,
            ano: ano,
            id_municipio: dados.id_municipio,
          });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = PsFinanceiroController;
