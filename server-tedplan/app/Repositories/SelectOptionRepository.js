'use strict'

const SelectOption = use('App/Models/SelectOption');

class SelectOptionRepository {

  async getAllSelectOptions() {
    return await SelectOption.query()
      .with('tipoCampoIndicador')
      .orderBy('id_tipo_campo_indicador', 'asc')
      .orderBy('ordem_option', 'asc')
      .fetch();
  }

  async getSelectOptionById(id) {
    return await SelectOption.query()
      .where('id_select_option', id)
      .with('tipoCampoIndicador')
      .first();
  }

  async addSelectOption(data) {
    return await SelectOption.create({
      value: data.value,
      descricao: data.descricao,
      ordem_option: data.ordem_option || 1,
      id_tipo_campo_indicador: data.id_tipo_campo_indicador,
    });
  }

  async updateSelectOption(id, data) {
    const option = await SelectOption.findOrFail(id);

    option.merge({
      value: data.value,
      descricao: data.descricao,
      ordem_option: data.ordem_option,
      id_tipo_campo_indicador: data.id_tipo_campo_indicador,
    });

    await option.save();
    return option;
  }

  async deleteSelectOption(id) {
    const option = await SelectOption.findOrFail(id);
    await option.delete();
    return { message: 'Opção removida com sucesso!' };
  }

  async getOptionsByTipoCampo(tipoCampoId) {
    return await SelectOption.query()
      .where('id_tipo_campo_indicador', tipoCampoId)
      .orderBy('ordem_option', 'asc')
      .fetch();
  }

  async deleteOptionsByTipoCampo(tipoCampoId) {
    await SelectOption.query()
      .where('id_tipo_campo_indicador', tipoCampoId)
      .delete();
    return { message: 'Opções removidas com sucesso!' };
  }

  async searchSelectOptions(query) {
    return await SelectOption.query()
      .where('value', 'ILIKE', `%${query}%`)
      .orWhere('descricao', 'ILIKE', `%${query}%`)
      .with('tipoCampoIndicador')
      .orderBy('ordem_option', 'asc')
      .fetch();
  }
}

module.exports = SelectOptionRepository;
