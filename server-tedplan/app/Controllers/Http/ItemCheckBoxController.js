const ItemCheckBoxRepository = use('App/Repositories/ItemCheckBoxRepository')

class ItemCheckBoxController {
  async index({ response }) {
    try {
      const repository = new ItemCheckBoxRepository();
      const itemCheckBoxes = await repository.getAllItemCheckBoxes();
      return response.json(itemCheckBoxes);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao buscar itens de checkbox' });
    }
  }

  async show({ params, response }) {
    try {
      const repository = new ItemCheckBoxRepository();
      const itemCheckBox = await repository.getItemCheckBoxById(params.id);
      if (!itemCheckBox) {
        return response.status(404).json({ error: 'Item de checkbox não encontrado' });
      }
      return response.json(itemCheckBox);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao buscar item de checkbox' });
    }
  }

  async store({ request, response }) {
    try {
      const repository = new ItemCheckBoxRepository();
      const data = request.only(['descricao', 'valor', 'id_indicador']);
      const itemCheckBox = await repository.addItemCheckBox(data);
      return response.status(201).json(itemCheckBox);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao criar item de checkbox' });
    }
  }

  async update({ params, request, response }) {
    try {
      const repository = new ItemCheckBoxRepository();
      const data = request.only(['descricao', 'valor']);
      const itemCheckBox = await repository.updateItemCheckBox(params.id, data);
      return response.json(itemCheckBox);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao atualizar item de checkbox' });
    }
  }

  async destroy({ params, response }) {
    try {
      const repository = new ItemCheckBoxRepository();
      await repository.deleteItemCheckBox(params.id);
      return response.json({ message: 'Item de checkbox removido com sucesso' });
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao remover item de checkbox' });
    }
  }

  // Buscar itens de checkbox por indicador
  async getItemsByIndicador({ params, response }) {
    try {
      const repository = new ItemCheckBoxRepository();
      const items = await repository.getItemsByIndicador(params.indicadorId);
      return response.json(items);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao buscar itens de checkbox do indicador' });
    }
  }

  // Deletar todos os itens de checkbox de um indicador
  async deleteItemsByIndicador({ params, response }) {
    try {
      const repository = new ItemCheckBoxRepository();
      await repository.deleteItemsByIndicador(params.indicadorId);
      return response.json({ message: 'Itens de checkbox removidos com sucesso' });
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao remover itens de checkbox do indicador' });
    }
  }
}

module.exports = ItemCheckBoxController;
