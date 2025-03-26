'use strict'
const Indicador = use('App/Models/Indicador')
const Imagem = use("App/Models/Imagem");

class IndicadorController {

  async getIndicador({ params }) {
    try {
      const res = await Indicador.query()
        .from('tedplan.descricao_indicador')
        .where('id_descricao_indicador',params.id)
        .fetch()

      return res
    } catch (error) {
      console.log(error)
    }
  }

  async getIndicadorPorCodigo({ params }) {
    try {
      const res = await Indicador.query()
        .from('tedplan.descricao_indicador')
        .where('codigo',params.id)
        .fetch()

      return res
    } catch (error) {
      console.log(error)
    }
  }

  async getIndicadores({ request }) {
    const { eixo } = request.all()
    try {
      const res = await Indicador.query()
        .from('tedplan.descricao_indicador')
        .where('eixo',eixo)
        .fetch()

      return res
    } catch (error) {
      console.log(error)
    }
  }

  async createDescricaoIndicador({ request }) {
    const dados = request.all()
    try {

        if (!request.file("imagem")) return;

        const upload = request.file("imagem", { size: "2mb" });
        const fileName = `${Date.now()}.${upload.subtype}`;
        await upload.move(Helpers.tmpPath("uploads"), {
          name: fileName,
        });
  
        if (!upload.moved()) {
          throw upload.error;
        }
  
        const imagem = await Imagem.create({
          file: fileName,
          name: upload.clientName,
          type: upload.type,
          subtype: upload.subtype,
        });

      if (!dados.id_descricao_indicador) {
        await Indicador.query()
          .from('tedplan.descricao_indicador')
          .insert({            
            nome_indicador: dados.nome_indicador,
            eixo: dados.eixo,
            codigo: dados.codigo,
            unidade: dados.unidade,
            descricao: dados.descricao,
            id_imagem: imagem.id            
          })
      return { message: 'Indicador criado com sucesso' }
      } else {
        const res = await Indicador.query()
          .from('tedplan.descricao_indicador')
          .where('id_descricao_indicador', dados.id_indicador)
          .fetch()
        const rd = res.toJSON()[0]
        await Indicador.query()
          .from('tedplan.descricao_indicador')
          .where('id_descricao_indicador', dados.id_descricao_indicador)
          .update({
            nome_indicador: dados.nome_indicador,
            eixo: dados.eixo,
            codigo: dados.codigo,
            unidade: dados.unidade,
            descricao: dados.descricao,
            id_imagem: imagem.id
          })
      }
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = IndicadorController
