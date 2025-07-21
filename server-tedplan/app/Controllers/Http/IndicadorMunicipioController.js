'use strict'

const IndicadorMunicipioRepository = use('App/Repositories/IndicadorMunicipioRepository');

class IndicadorMunicipioController {
  constructor() {
    this.indicadorMunicipioRepository = new IndicadorMunicipioRepository();
  }

  async index({ response }) {
    try {
      const indicadores = await this.indicadorMunicipioRepository.getAllIndicadoresMunicipio();
      return response.status(200).json(indicadores);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async show({ params, response }) {
    try {
      const { id } = params;
      const indicador = await this.indicadorMunicipioRepository.getIndicadorMunicipioById(id);
      
      if (!indicador) {
        return response.status(404).json({ error: 'Indicador de município não encontrado' });
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
      if (!data.id_indicador) {
        return response.status(400).json({ error: 'ID do indicador é obrigatório' });
      }
      
      if (!data.id_municipio) {
        return response.status(400).json({ error: 'ID do município é obrigatório' });
      }

      if (!data.ano) {
        return response.status(400).json({ error: 'Ano é obrigatório' });
      }

      const indicador = await this.indicadorMunicipioRepository.addIndicadorMunicipio(data);
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
      
      const indicador = await this.indicadorMunicipioRepository.updateIndicadorMunicipio(id, data);
      return response.status(200).json(indicador);
    } catch (error) {
      console.log(error);
      if (error.name === 'ModelNotFoundException') {
        return response.status(404).json({ error: 'Indicador de município não encontrado' });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async destroy({ params, response }) {
    try {
      const { id } = params;
      const result = await this.indicadorMunicipioRepository.deleteIndicadorMunicipio(id);
      return response.status(200).json(result);
    } catch (error) {
      console.log(error);
      if (error.name === 'ModelNotFoundException') {
        return response.status(404).json({ error: 'Indicador de município não encontrado' });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getIndicadoresByMunicipio({ params, request, response }) {
    try {
      const { id_municipio } = params;
      const { ano } = request.get();
      
      const indicadores = await this.indicadorMunicipioRepository.getIndicadoresByMunicipio(id_municipio, ano);
      return response.status(200).json(indicadores);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getIndicadoresByIndicador({ params, request, response }) {
    try {
      const { id_indicador } = params;
      const { ano } = request.get();
      
      const indicadores = await this.indicadorMunicipioRepository.getIndicadoresByIndicador(id_indicador, ano);
      return response.status(200).json(indicadores);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getIndicadoresByAno({ params, response }) {
    try {
      const { ano } = params;
      const indicadores = await this.indicadorMunicipioRepository.getIndicadoresByAno(ano);
      return response.status(200).json(indicadores);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getIndicadorByCodigoMunicipioAno({ request, response }) {
    try {
      const { codigo_indicador, id_municipio, ano } = request.get();
      
      if (!codigo_indicador || !id_municipio || !ano) {
        return response.status(400).json({ 
          error: 'Código do indicador, ID do município e ano são obrigatórios' 
        });
      }

      const indicador = await this.indicadorMunicipioRepository.getIndicadorByCodigoMunicipioAno(
        codigo_indicador, id_municipio, ano
      );
      
      if (!indicador) {
        return response.status(404).json({ error: 'Indicador não encontrado' });
      }
      
      return response.status(200).json(indicador);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async bulkInsert({ request, response }) {
    try {
      const { indicadores } = request.all();
      
      if (!indicadores || !Array.isArray(indicadores) || indicadores.length === 0) {
        return response.status(400).json({ error: 'Lista de indicadores é obrigatória' });
      }

      const result = await this.indicadorMunicipioRepository.bulkInsertIndicadores(indicadores);
      return response.status(201).json(result);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async bulkUpdate({ request, response }) {
    try {
      const { id_municipio, ano, indicadores } = request.all();
      
      if (!id_municipio || !ano || !indicadores || !Array.isArray(indicadores)) {
        return response.status(400).json({ 
          error: 'ID do município, ano e lista de indicadores são obrigatórios' 
        });
      }

      const result = await this.indicadorMunicipioRepository.bulkUpdateIndicadores(
        id_municipio, ano, indicadores
      );
      return response.status(200).json(result);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = IndicadorMunicipioController;
