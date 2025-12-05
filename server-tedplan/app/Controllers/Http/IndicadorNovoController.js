'use strict'

const IndicadorNovoRepository = use('App/Repositories/IndicadorNovoRepository');

class IndicadorNovoController {
  constructor() {
    this.indicadorRepository = new IndicadorNovoRepository();
  }

  async index({ response }) {
    try {
      const indicadores = await this.indicadorRepository.getAllIndicadores();
      return response.status(200).json(indicadores);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async show({ params, response }) {
    try {
      const { id } = params;
      const indicador = await this.indicadorRepository.getIndicadorById(id);
      
      if (!indicador) {
        return response.status(404).json({ error: 'Indicador não encontrado' });
      }
      
      return response.status(200).json(indicador);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async store({ request, response }) {
    try {
      const data = request.all();
      
      // Validações básicas
      if (!data.nome_indicador) {
        return response.status(400).json({ error: 'Nome do indicador é obrigatório' });
      }
      
      if (!data.codigo_indicador) {
        return response.status(400).json({ error: 'Código do indicador é obrigatório' });
      }

      const indicador = await this.indicadorRepository.addIndicador(data);
      return response.status(201).json(indicador);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async update({ params, request, response }) {
    try {
      const { id } = params;
      const data = request.all();
      
      const indicador = await this.indicadorRepository.updateIndicador(id, data);
      return response.status(200).json(indicador);
    } catch (error) {
      console.log(error);
      if (error.name === 'ModelNotFoundException') {
        return response.status(404).json({ error: 'Indicador não encontrado' });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async destroy({ params, response }) {
    try {
      const { id } = params;
      const result = await this.indicadorRepository.deleteIndicador(id);
      return response.status(200).json(result);
    } catch (error) {
      console.log(error);
      if (error.name === 'ModelNotFoundException') {
        return response.status(404).json({ error: 'Indicador não encontrado' });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getIndicadoresByMenuItem({ params, response }) {
    try {
      const { id_menu_item } = params;
      const indicadores = await this.indicadorRepository.getIndicadoresByMenuItem(id_menu_item);
      return response.status(200).json(indicadores);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getIndicadoresByGrupo({ params, response }) {
    try {
      const { grupo } = params;
      const indicadores = await this.indicadorRepository.getIndicadoresByGrupo(grupo);
      return response.status(200).json(indicadores);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getIndicadorByCodigo({ params, response }) {
    try {
      const { codigo } = params;
      const indicador = await this.indicadorRepository.getIndicadoresByCodigo(codigo);
      
      if (!indicador) {
        return response.status(404).json({ error: 'Indicador não encontrado' });
      }
      
      return response.status(200).json(indicador);
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

      const indicadores = await this.indicadorRepository.searchIndicadores(q);
      return response.status(200).json(indicadores);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getIndicadoresByEixoAndUnidade({ params, response }) {
    try {
      const { id_eixo } = params;
      
      if (!id_eixo) {
        return response.status(400).json({ error: 'ID do eixo é obrigatório' });
      }

      const indicadores = await this.indicadorRepository.getIndicadoresByEixoAndUnidade(id_eixo);
      return response.status(200).json(indicadores);
    } catch (error) {
      console.log('Erro no IndicadorNovoController.getIndicadoresByEixoAndUnidade:', error);
      console.log('Stack:', error.stack);
      return response.status(500).json({ 
        error: 'Erro interno do servidor ao buscar indicadores por eixo e unidade',
        details: error.message 
      });
    }
  }
}

module.exports = IndicadorNovoController;
