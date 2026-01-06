'use strict'

const UnidadeRepository = use('App/Repositories/UnidadeRepository');

class UnidadeController {
  constructor() {
    this.unidadeRepository = new UnidadeRepository();
  }

  async index({ request, response }) {
    try {
      const filters = request.get();

      // Se houver filtros específicos, usar busca por filtros
      if (filters.id_tipo_unidade || filters.id_eixo || filters.id_municipio || filters.nome_unidade) {
        const unidades = await this.unidadeRepository.getUnidadesByFilters(filters);
        return response.status(200).json(unidades);
      }

      // Caso contrário, retornar todas as unidades
      const unidades = await this.unidadeRepository.getAllUnidades();
      return response.status(200).json(unidades);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async show({ params, response }) {
    try {
      const { id } = params;
      const unidade = await this.unidadeRepository.getUnidadeById(id);

      if (!unidade) {
        return response.status(404).json({ error: 'Unidade não encontrada' });
      }

      return response.status(200).json(unidade);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async store({ request, response }) {
    try {
      const data = request.all();

      // Validações básicas
      if (!data.nome_unidade) {
        return response.status(400).json({ error: 'Nome da unidade é obrigatório' });
      }

      // Sanitizar dados - converter strings vazias e "undefined" para null
      const sanitizedData = {
        nome_unidade: data.nome_unidade,
        id_tipo_unidade: this.parseToIntOrNull(data.id_tipo_unidade),
        id_eixo: this.parseToIntOrNull(data.id_eixo) || null,
        id_municipio: this.parseToIntOrNull(data.id_municipio),
      };

      const unidade = await this.unidadeRepository.addUnidade(sanitizedData);
      return response.status(201).json(unidade);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  parseToIntOrNull(value) {
    if (!value || value === '' || value === 'undefined' || value === undefined || value === null) {
      return null;
    }
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? null : parsed;
  }

  async update({ params, request, response }) {
    try {
      const { id } = params;
      const data = request.all();

      // Sanitizar dados - converter strings vazias e "undefined" para null
      const sanitizedData = {
        nome_unidade: data.nome_unidade,
        id_tipo_unidade: this.parseToIntOrNull(data.id_tipo_unidade),
        id_eixo: this.parseToIntOrNull(data.id_eixo) || null,
        id_municipio: this.parseToIntOrNull(data.id_municipio),
      };

      const unidade = await this.unidadeRepository.updateUnidade(id, sanitizedData);
      return response.status(200).json(unidade);
    } catch (error) {
      console.log(error);
      if (error.name === 'ModelNotFoundException') {
        return response.status(404).json({ error: 'Unidade não encontrada' });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async destroy({ params, response }) {
    try {
      const { id } = params;
      const result = await this.unidadeRepository.deleteUnidade(id);
      return response.status(200).json(result);
    } catch (error) {
      console.log(error);
      if (error.name === 'ModelNotFoundException') {
        return response.status(404).json({ error: 'Unidade não encontrada' });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getUnidadesByTipo({ params, response }) {
    try {
      const { id_tipo_unidade } = params;
      const unidades = await this.unidadeRepository.getUnidadesByTipo(id_tipo_unidade);
      return response.status(200).json(unidades);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getUnidadesByEixo({ params, response }) {
    try {
      const { id_eixo } = params;
      
      if (!id_eixo) {
        return response.status(400).json({ error: 'ID do eixo é obrigatório' });
      }

      const unidades = await this.unidadeRepository.getUnidadesByEixo(id_eixo);
      return response.status(200).json(unidades);
    } catch (error) {
      console.log('Erro em getUnidadesByEixo controller:', error);
      console.log('Stack:', error.stack);
      return response.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error.message 
      });
    }
  }

  async getUnidadesByMunicipio({ params, response }) {
    try {
      const { id_municipio } = params;
      const unidades = await this.unidadeRepository.getUnidadesByMunicipio(id_municipio);
      return response.status(200).json(unidades);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async search({ request, response }) {
    try {
      const { q } = request.get();

      if (!q) {
        return response.status(400).json({ error: 'Parâmetro de busca é obrigatório' });
      }

      const unidades = await this.unidadeRepository.searchUnidades(q);
      return response.status(200).json(unidades);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = UnidadeController;

