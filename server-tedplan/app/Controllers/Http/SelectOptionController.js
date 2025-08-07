'use strict'

const SelectOptionRepository = use('App/Repositories/SelectOptionRepository');

class SelectOptionController {
  constructor() {
    this.selectOptionRepository = new SelectOptionRepository();
  }

  async index({ response }) {
    try {
      const options = await this.selectOptionRepository.getAllSelectOptions();
      return response.status(200).json(options);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async show({ params, response }) {
    try {
      const { id } = params;
      const option = await this.selectOptionRepository.getSelectOptionById(id);

      if (!option) {
        return response.status(404).json({ error: 'Opção não encontrada' });
      }

      return response.status(200).json(option);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async store({ request, response }) {
    try {
      const data = request.all();

      // Validações básicas
      if (!data.value) {
        return response.status(400).json({ error: 'Valor da opção é obrigatório' });
      }

      if (!data.descricao) {
        return response.status(400).json({ error: 'Descrição da opção é obrigatória' });
      }

      if (!data.id_tipo_campo_indicador) {
        return response.status(400).json({ error: 'ID do tipo de campo é obrigatório' });
      }

      const option = await this.selectOptionRepository.addSelectOption(data);
      return response.status(201).json(option);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async update({ params, request, response }) {
    try {
      const { id } = params;
      const data = request.all();

      const option = await this.selectOptionRepository.updateSelectOption(id, data);
      return response.status(200).json(option);
    } catch (error) {
      console.log(error);
      if (error.name === 'ModelNotFoundException') {
        return response.status(404).json({ error: 'Opção não encontrada' });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async destroy({ params, response }) {
    try {
      const { id } = params;
      const result = await this.selectOptionRepository.deleteSelectOption(id);
      return response.status(200).json(result);
    } catch (error) {
      console.log(error);
      if (error.name === 'ModelNotFoundException') {
        return response.status(404).json({ error: 'Opção não encontrada' });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getOptionsByTipoCampo({ params, response }) {
    try {
      const { tipoCampoId } = params;
      const options = await this.selectOptionRepository.getOptionsByTipoCampo(tipoCampoId);
      return response.status(200).json(options);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async deleteOptionsByTipoCampo({ params, response }) {
    try {
      const { tipoCampoId } = params;
      const result = await this.selectOptionRepository.deleteOptionsByTipoCampo(tipoCampoId);
      return response.status(200).json(result);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = SelectOptionController;
