'use strict'
const Indicador = use('App/Models/Indicador')
const Imagem = use("App/Models/Imagem");
const Helpers = use("Helpers");
const Fs = use("fs");

class IndicadorController {

  async getIndicador({ params }) {
    try {
      const res = await Indicador.query()
        .from('tedplan.descricao_indicador')
        .where('id_descricao_indicador', params.id)
        .fetch()

      return res
    } catch (error) {
      console.log(error)
    }
  }

  async getIndicadorPorCodigo({ request }) {
    const { codigo, eixo } = request.all()
    try {
      const res = await Indicador.query()
        .from('tedplan.descricao_indicador')
        .where('codigo', codigo)
        .where('eixo', eixo)
        .fetch()

      return res
    } catch (error) {
      console.log(error)
    }
  }

  async getIndicadores() {
    try {
      const res = await Indicador.query()
        .from('tedplan.descricao_indicador')
        .fetch()

      return res
    } catch (error) {
      console.log(error)
    }
  }

  async createDescricaoIndicador({ request, response }) {
    const dados = request.all()
    try {


      if (!dados.codigo) {
        return response.status(400).send({ message: 'Código do indicador é obrigatório' })
      }

      const res = await Indicador.query()
        .from('tedplan.descricao_indicador')
        .where('codigo', dados.codigo)
        .where('eixo', dados.eixo)
        .fetch()
      if (res.rows.length > 0) {
        return response.status(400).send({ message: 'Código do indicador já cadastrado' })
      }

      if (!request.file("imagem")) return response.status(400).send({ message: 'Imagem é obrigatória' });

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
            id_imagem: imagem.id,
            finalidade: dados.finalidade,
            limitacoes: dados.limitacoes,
          })
        return response.status(200).send({ message: 'Indicador cadastrado com sucesso' })
      }
    } catch (error) {
      console.log(error)
    }
  }

  async updateIndicador({ request, response }) {
    const dados = request.all()

    try {
      await Indicador.query()
        .from('tedplan.descricao_indicador')
        .where('id_descricao_indicador', dados.id_descricao_indicador)
        .update({
          nome_indicador: dados.nome_indicador,
          eixo: dados.eixo,
          codigo: dados.codigo,
          unidade: dados.unidade,
          descricao: dados.descricao,
          finalidade: dados.finalidade,
          limitacoes: dados.limitacoes,
        })

      return response.status(200).send({ message: 'Indicador atualizado com sucesso' })
    } catch (error) {
      console.log(error)
    }
  }

  // async deleteIndicador({ params, response }) {
  //   try {
  //     await Indicador.query()
  //       .from('tedplan.descricao_indicador')
  //       .where('id_descricao_indicador', params.id)
  //       .delete()

  //     return response.status(200).send({ message: 'Indicador excluído com sucesso' })
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  async deleteIndicador({ params, request, response }) {

    try {
      const { id } = params;
      const { id_imagem } = request.body

      await Indicador.query()
        .table("tedplan.descricao_indicador")
        .where("id_descricao_indicador", id)
        .delete();

      if (id_imagem) {
        const imagem = await Imagem.findBy('id', id_imagem);
        if (imagem) {
          await Fs.unlinkSync(Helpers.tmpPath(`uploads/${imagem.file}`));
          await imagem.delete();
        }
      }

      return response.status(200).send({ message: 'Indicador excluído com sucesso' });
    } catch (error) {
      console.log(error);
      return response.status(500).send({ message: 'Erro ao excluir indicador' });
      return error;
    }
  }
}


module.exports = IndicadorController
