'use strict'

const MenuItemRepository = use('App/Repositories/MenuItemRepository');

class MenuItemController {
  constructor() {
    this.menuItemRepository = new MenuItemRepository();
  }

  async index({ response }) {
    try {
      const menuItems = await this.menuItemRepository.getAllMenuItems();
      return response.status(200).json(menuItems);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async show({ params, response }) {
    try {
      const { id } = params;
      const menuItem = await this.menuItemRepository.getMenuItemById(id);
      
      if (!menuItem) {
        return response.status(404).json({ error: 'Item de menu não encontrado' });
      }
      
      return response.status(200).json(menuItem);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async store({ request, response }) {
    try {
      const data = request.all();
      
      // Validações básicas
      if (!data.nome_menu_item) {
        return response.status(400).json({ error: 'Nome do item de menu é obrigatório' });
      }
      
      if (!data.id_menu) {
        return response.status(400).json({ error: 'ID do menu é obrigatório' });
      }

      const menuItem = await this.menuItemRepository.addMenuItem(data);
      return response.status(201).json(menuItem);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async update({ params, request, response }) {
    try {
      const { id } = params;
      const data = request.all();
      
      const menuItem = await this.menuItemRepository.updateMenuItem(id, data);
      return response.status(200).json(menuItem);
    } catch (error) {
      console.log(error);
      if (error.name === 'ModelNotFoundException') {
        return response.status(404).json({ error: 'Item de menu não encontrado' });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async destroy({ params, response }) {
    try {
      const { id } = params;
      const result = await this.menuItemRepository.deleteMenuItem(id);
      return response.status(200).json(result);
    } catch (error) {
      console.log(error);
      if (error.name === 'ModelNotFoundException') {
        return response.status(404).json({ error: 'Item de menu não encontrado' });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getMenuItemsByMenu({ params, response }) {
    try {
      const { id_menu } = params;
      const menuItems = await this.menuItemRepository.getMenuItemsByMenu(id_menu);
      return response.status(200).json(menuItems);
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

      const menuItems = await this.menuItemRepository.searchMenuItems(q);
      return response.status(200).json(menuItems);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = MenuItemController;
