'use strict'

const MenuRepository = use('App/Repositories/MenuRepository');

class MenuController {
  constructor() {
    this.menuRepository = new MenuRepository();
  }

  async index({ request, response }) {
    try {
      const { id } = request.get();

      if (id) {
        const menus = await this.menuRepository.getMenusByModulo(id);
        return response.status(200).json(menus);
      } else {
        const menus = await this.menuRepository.getAllMenus();
        return response.status(200).json(menus);
      }
    } catch (error) {
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async show({ params, response }) {

    try {
      const { id } = params;
      const menu = await this.menuRepository.getMenuById(id);

      if (!menu) {
        return response.status(404).json({ error: 'Menu não encontrado' });
      }

      return response.status(200).json(menu);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async store({ request, response }) {
    try {
      const data = request.all();

      // Validações básicas
      if (!data.titulo) {
        return response.status(400).json({ error: 'Título é obrigatório' });
      }

      const menu = await this.menuRepository.addMenu(data);
      return response.status(201).json(menu);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async update({ params, request, response }) {
    try {
      const { id } = params;
      const data = request.all();

      const menu = await this.menuRepository.updateMenu(id, data);
      return response.status(200).json(menu);
    } catch (error) {
      console.log(error);
      if (error.name === 'ModelNotFoundException') {
        return response.status(404).json({ error: 'Menu não encontrado' });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async destroy({ params, response }) {
    try {
      const { id } = params;
      const result = await this.menuRepository.deleteMenu(id);
      return response.status(200).json(result);
    } catch (error) {
      console.log(error);
      if (error.name === 'ModelNotFoundException') {
        return response.status(404).json({ error: 'Menu não encontrado' });
      }
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getMenusByModulo({ params, response }) {
    try {
      const { id_modulo } = params;
      const menus = await this.menuRepository.getMenusByModulo(id_modulo);
      return response.status(200).json(menus);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getMenusByEixo({ params, response }) {
    try {
      const { id_eixo } = params;
      const menus = await this.menuRepository.getMenusByEixo(id_eixo);
      return response.status(200).json(menus);
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

      const menus = await this.menuRepository.searchMenus(q);
      return response.status(200).json(menus);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = MenuController;
