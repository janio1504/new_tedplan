'use strict'

const TipoUnidadeRepository = use('App/Repositories/TipoUnidadeRepository');

class TipoUnidadeController {
  constructor() {
    this.tipoUnidadeRepository = new TipoUnidadeRepository();
  }

  async index({ request, response }) {
    try {
      const { q, id_eixo } = request.get();

      // Se houver filtro por eixo, buscar tipos de unidade por eixo
      if (id_eixo) {
        const tiposUnidade = await this.tipoUnidadeRepository.getTiposUnidadeByEixo(id_eixo);
        return response.status(200).json(tiposUnidade);
      }

      // Se houver parâmetro de busca, usar busca por termo
      if (q) {
        const tiposUnidade = await this.tipoUnidadeRepository.searchTiposUnidade(q);
        return response.status(200).json(tiposUnidade);
      }

      // Caso contrário, retornar todos os tipos de unidade
      const tiposUnidade = await this.tipoUnidadeRepository.getAllTiposUnidade();
      return response.status(200).json(tiposUnidade);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async show({ params, response }) {
    try {
      const { id } = params;
      const tipoUnidade = await this.tipoUnidadeRepository.getTipoUnidadeById(id);

      if (!tipoUnidade) {
        return response.status(404).json({ error: 'Tipo de unidade não encontrado' });
      }

      return response.status(200).json(tipoUnidade);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async store({ request, response }) {
    try {
      const data = request.all();

      // Validações básicas
      if (!data.nome_tipo_unidade || data.nome_tipo_unidade.trim() === '') {
        return response.status(400).json({ error: 'Nome do tipo de unidade é obrigatório' });
      }

      // Sanitizar dados - converter strings vazias e "undefined" para null
      const sanitizedData = {
        nome_tipo_unidade: data.nome_tipo_unidade,
        id_eixo: this.parseToIntOrNull(data.id_eixo),
      };

      const tipoUnidade = await this.tipoUnidadeRepository.addTipoUnidade(sanitizedData);
      return response.status(201).json(tipoUnidade);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async update({ params, request, response }) {
    try {
      const { id } = params;
      const data = request.all();

      // Validações básicas
      if (data.nome_tipo_unidade !== undefined && data.nome_tipo_unidade.trim() === '') {
        return response.status(400).json({ error: 'Nome do tipo de unidade não pode ser vazio' });
      }

      // Sanitizar dados - converter strings vazias e "undefined" para null
      const sanitizedData = {};
      if (data.nome_tipo_unidade !== undefined) {
        sanitizedData.nome_tipo_unidade = data.nome_tipo_unidade;
      }
      if (data.id_eixo !== undefined) {
        sanitizedData.id_eixo = this.parseToIntOrNull(data.id_eixo);
      }

      const tipoUnidade = await this.tipoUnidadeRepository.updateTipoUnidade(id, sanitizedData);
      return response.status(200).json(tipoUnidade);
    } catch (error) {
      console.log(error);
      if (error.name === 'ModelNotFoundException') {
        return response.status(404).json({ error: 'Tipo de unidade não encontrado' });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async destroy({ params, response }) {
    try {
      const { id } = params;
      const result = await this.tipoUnidadeRepository.deleteTipoUnidade(id);
      return response.status(200).json(result);
    } catch (error) {
      console.log(error);
      if (error.name === 'ModelNotFoundException') {
        return response.status(404).json({ error: 'Tipo de unidade não encontrado' });
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

      const tiposUnidade = await this.tipoUnidadeRepository.searchTiposUnidade(q);
      return response.status(200).json(tiposUnidade);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getTiposUnidadeByEixo({ params, response }) {
    try {
      const { id_eixo } = params;
      
      if (!id_eixo) {
        return response.status(400).json({ error: 'ID do eixo é obrigatório' });
      }

      const tiposUnidade = await this.tipoUnidadeRepository.getTiposUnidadeByEixo(id_eixo);
      return response.status(200).json(tiposUnidade);
    } catch (error) {
      console.log('Erro em getTiposUnidadeByEixo:', error);
      return response.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error.message 
      });
    }
  }

  parseToIntOrNull(value) {
    if (!value || value === '' || value === 'undefined' || value === undefined || value === null) {
      return null;
    }
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? null : parsed;
  }
}

module.exports = TipoUnidadeController;

