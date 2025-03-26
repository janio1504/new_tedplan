'use strict'

const CodigoSnis = use('App/Models/CodigoSnis');

class CodigoSnisController {
  async getAll({ response }) {
    try {
      const res = await CodigoSnis.all();
      return res;
    } catch (error) {
      console.log(error);
      return response.status(500).send({ error: 'Erro ao buscar os códigos SNIS' });
    }
  }

  async getById({ params, response }) {
    try {
      const res = await CodigoSnis.find(params.id);
      if (!res) {
        return response.status(404).send({ error: 'Código SNIS não encontrado' });
      }
      return res;
    } catch (error) {
      console.log(error);
      return response.status(500).send({ error: 'Erro ao buscar o código SNIS' });
    }
  }

  async create({ request, response }) {
    const { codigo, descricao_codigo, eixo } = request.all();
    try {
      const codigoSnis = new CodigoSnis();
      codigoSnis.codigo = codigo;
      codigoSnis.descricao_codigo = descricao_codigo;
      codigoSnis.eixo = eixo;
      await codigoSnis.save();
      return { message: 'Código SNIS criado com sucesso', id_codigo_snis: codigoSnis.id_codigo_snis };
    } catch (error) {
      console.log(error);
      return response.status(500).send({ error: 'Erro ao criar o código SNIS' });
    }
  }

  async update({ params, request, response }) {
    const { codigo, descricao_codigo, eixo } = request.all();
    try {
      const codigoSnis = await CodigoSnis.find(params.id);
      if (!codigoSnis) {
        return response.status(404).send({ error: 'Código SNIS não encontrado' });
      }
      codigoSnis.codigo = codigo;
      codigoSnis.descricao_codigo = descricao_codigo;
      codigoSnis.eixo = eixo;
      await codigoSnis.save();
      return { message: 'Código SNIS atualizado com sucesso' };
    } catch (error) {
      console.log(error);
      return response.status(500).send({ error: 'Erro ao atualizar o código SNIS' });
    }
  }

  async delete({ params, response }) {
    try {
      const codigoSnis = await CodigoSnis.find(params.id);
      if (!codigoSnis) {
        return response.status(404).send({ error: 'Código SNIS não encontrado' });
      }
      await codigoSnis.delete();
      return { message: 'Código SNIS excluído com sucesso' };
    } catch (error) {
      console.log(error);
      return response.status(500).send({ error: 'Erro ao excluir o código SNIS' });
    }
  }
}

module.exports = CodigoSnisController;
