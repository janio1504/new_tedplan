'use strict'
const Qualidade = use('App/Models/Concessionaria')
class QualidadeController {

  async getQualidade({ request }){
    const { id_municipio, ano } = request.all()
   try {
    const res = await Qualidade.query()
    .from('tedplan.qualidade')
    .where('id_municipio', id_municipio)
    .where('ano', ano)
    .fetch()

    return res
   } catch (error) {
    console.log(error);
   }
  }

  async createQualidade({ request }){
    const dados = request.all()
   try {
    if(!dados.id_qualidade){
      await Qualidade.query()
      .from('tedplan.qualidade')
      .insert({
        qd002: dados.QD002,
        qd003: dados.QD003,
        qd004: dados.QD004,
        qd021: dados.QD021,
        qd022: dados.QD022,
        qd015: dados.QD015,
        qd011: dados.QD011,
        qd012: dados.QD012,
        qd001: dados.QD001,
        qd020: dados.QD020,
        qd006: dados.QD006,
        qd007: dados.QD007,
        qd019: dados.QD019,
        qd008: dados.QD008,
        qd009: dados.QD009,
        qd018: dados.QD018,
        qd016: dados.QD016,
        qd017: dados.QD017,
        qd028: dados.QD028,
        qd026: dados.QD026,
        qd027: dados.QD027,
        qd023: dados.QD023,
        qd024: dados.QD024,
        qd025: dados.QD025,
        qd099: dados.QD099,
        id_municipio: dados.id_municipio,
        ano: dados.ano,
      })
    }else{

        const res = await Qualidade.query()
        .from('tedplan.qualidade')
        .where('id_qualidade', dados.id_qualidade)
        .fetch()
        const rq = res.toJSON()[0]

        await Qualidade.query()
        .from('tedplan.qualidade')
        .where('id_qualidade', dados.id_qualidade)
        .update({
          qd002: dados.QD002 ? dados.QD002 : rq.qd002,
          qd003: dados.QD003 ? dados.QD003 : rq.qd003,
          qd004: dados.QD004 ? dados.QD004 : rq.qd004,
          qd021: dados.QD021 ? dados.QD021 : rq.qd021,
          qd022: dados.QD022 ? dados.QD022 : rq.qd022,
          qd015: dados.QD015 ? dados.QD015 : rq.qd015,
          qd011: dados.QD011 ? dados.QD011 : rq.qd011,
          qd012: dados.QD012 ? dados.QD012 : rq.qd012,
          qd001: dados.QD001 ? dados.QD001 : rq.qd001,
          qd020: dados.QD020 ? dados.QD020 : rq.qd020,
          qd006: dados.QD006 ? dados.QD006 : rq.qd006,
          qd007: dados.QD007 ? dados.QD007 : rq.qd007,
          qd019: dados.QD019 ? dados.QD019 : rq.qd019,
          qd008: dados.QD008 ? dados.QD008 : rq.qd008,
          qd009: dados.QD009 ? dados.QD009 : rq.qd009,
          qd018: dados.QD018 ? dados.QD018 : rq.qd018,
          qd016: dados.QD016 ? dados.QD016 : rq.qd016,
          qd017: dados.QD017 ? dados.QD017 : rq.qd017,
          qd028: dados.QD028 ? dados.QD028 : rq.qd028,
          qd026: dados.QD026 ? dados.QD026 : rq.qd026,
          qd027: dados.QD027 ? dados.QD027 : rq.qd027,
          qd023: dados.QD023 ? dados.QD023 : rq.qd023,
          qd024: dados.QD024 ? dados.QD024 : rq.qd024,
          qd025: dados.QD025 ? dados.QD025 : rq.qd025,
          qd099: dados.QD099 ? dados.QD099 : rq.qd099,
          id_municipio: dados.id_municipio ? dados.id_municipio : ra.id_municipio,
          ano: dados.ano ? dados.ano : ra.ano,
      })
    }
   } catch (error) {
    console.log(error);
   }
  }
}

module.exports = QualidadeController
