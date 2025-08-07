const ItemCheckBox = use('App/Models/ItemCheckBox')

class ItemCheckBoxRepository {
  async getAllItemCheckBoxes() {
    return await ItemCheckBox.query()
      .with('indicador')
      .orderBy('id_item_check_box', 'asc')
      .fetch();
  }

  async getItemCheckBoxById(id) {
    return await ItemCheckBox.query()
      .where('id_item_check_box', id)
      .with('indicador')
      .first();
  }

  async addItemCheckBox(data) {
    const itemCheckBox = new ItemCheckBox();
    itemCheckBox.descricao = data.descricao;
    itemCheckBox.valor = data.valor;
    itemCheckBox.id_indicador = data.id_indicador;
    await itemCheckBox.save();
    return itemCheckBox;
  }

  async updateItemCheckBox(id, data) {
    const itemCheckBox = await ItemCheckBox.findOrFail(id);
    itemCheckBox.merge(data);
    await itemCheckBox.save();
    return itemCheckBox;
  }

  async deleteItemCheckBox(id) {
    const itemCheckBox = await ItemCheckBox.findOrFail(id);
    await itemCheckBox.delete();
    return true;
  }

  // Buscar itens de checkbox por indicador
  async getItemsByIndicador(indicadorId) {
    return await ItemCheckBox.query()
      .where('id_indicador', indicadorId)
      .with('indicador')
      .orderBy('id_item_check_box', 'asc')
      .fetch();
  }

  // Deletar todos os itens de checkbox de um indicador
  async deleteItemsByIndicador(indicadorId) {
    try {
      const result = await ItemCheckBox.query()
        .where('id_indicador', indicadorId)
        .delete();
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ItemCheckBoxRepository;
