'use strict'

const TipoCampoIndicadorRepository = use('App/Repositories/TipoCampoIndicadorRepository');

class TipoCampoIndicadorController {
  constructor() {
    this.tipoCampoRepository = new TipoCampoIndicadorRepository();
  }

  async index({ response }) {
    try {
      const tipos = await this.tipoCampoRepository.getAllTiposCampo();
      return response.status(200).json(tipos);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async show({ params, response }) {
    try {
      const { id } = params;
      const tipo = await this.tipoCampoRepository.getTipoCampoById(id);
      
      if (!tipo) {
        return response.status(404).json({ error: 'Tipo de campo não encontrado' });
      }
      
      return response.status(200).json(tipo);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async store({ request, response }) {
    try {
      const data = request.all();
      
      // Validações básicas
      if (!data.name_campo) {
        return response.status(400).json({ error: 'Nome do campo é obrigatório' });
      }
      
      if (!data.type) {
        return response.status(400).json({ error: 'Tipo do campo é obrigatório' });
      }

      // Define como ativo por padrão se não especificado
      if (data.enable === undefined) {
        data.enable = true;
      }

      const tipo = await this.tipoCampoRepository.addTipoCampo(data);
      return response.status(201).json(tipo);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async update({ params, request, response }) {
    try {
      const { id } = params;
      const data = request.all();
      
      const tipo = await this.tipoCampoRepository.updateTipoCampo(id, data);
      return response.status(200).json(tipo);
    } catch (error) {
      console.log(error);
      if (error.name === 'ModelNotFoundException') {
        return response.status(404).json({ error: 'Tipo de campo não encontrado' });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async destroy({ params, response }) {
    try {
      const { id } = params;
      const result = await this.tipoCampoRepository.deleteTipoCampo(id);
      return response.status(200).json(result);
    } catch (error) {
      console.log(error);
      if (error.name === 'ModelNotFoundException') {
        return response.status(404).json({ error: 'Tipo de campo não encontrado' });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getTiposAtivos({ response }) {
    try {
      const tipos = await this.tipoCampoRepository.getTiposCampoAtivos();
      return response.status(200).json(tipos);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getTiposPorTipo({ params, response }) {
    try {
      const { tipo } = params;
      const tipos = await this.tipoCampoRepository.getTiposCampoPorTipo(tipo);
      return response.status(200).json(tipos);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async toggleStatus({ params, response }) {
    try {
      const { id } = params;
      const tipo = await this.tipoCampoRepository.toggleStatusTipoCampo(id);
      return response.status(200).json(tipo);
    } catch (error) {
      console.log(error);
      if (error.name === 'ModelNotFoundException') {
        return response.status(404).json({ error: 'Tipo de campo não encontrado' });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async search({ request, response }) {
    try {
      const { q } = request.get();
      
      if (!q) {
        return response.status(400).json({ error: 'Parâmetro de busca é obrigatório' });
      }

      const tipos = await this.tipoCampoRepository.searchTiposCampo(q);
      return response.status(200).json(tipos);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = TipoCampoIndicadorController;
