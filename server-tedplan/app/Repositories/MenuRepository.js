const Menu = use("App/Models/Menu");

class MenuRepository {

    async getAllMenus() {
        const menus = await Menu.query()
            .with('menuItems')
            .orderBy("id_menu", "desc")
            .fetch();
        return menus;
    }

    async getMenuById(id) {
        const menu = await Menu.query()
            .where('id_menu', id)
            .with('menuItems')
            .first();
        return menu;
    }

    async getMenusByModulo(id_modulo) {
        const menus = await Menu.query()
            .where('id_modulo', id_modulo)
            .with('menuItems')
            .orderBy("titulo", "asc")
            .fetch();
        return menus;
    }

    async getMenusByEixo(id_eixo) {
        const menus = await Menu.query()
            .where('id_eixo', id_eixo)
            .with('menuItems')
            .orderBy("titulo", "asc")
            .fetch();
        return menus;
    }
    
    async addMenu(data) {
        const menu = await Menu.create(data);
        return menu;
    }
    
    async updateMenu(id, data) {
        const menu = await Menu.findOrFail(id);
        menu.merge(data);
        await menu.save();
        return menu;
    }
    
    async deleteMenu(id) {
        const menu = await Menu.findOrFail(id);
        await menu.delete();
        return { message: 'Menu deletado com sucesso' };
    }

    async searchMenus(searchTerm) {
        const menus = await Menu.query()
            .where('titulo', 'ilike', `%${searchTerm}%`)
            .orWhere('descricao', 'ilike', `%${searchTerm}%`)
            .with('menuItems')
            .orderBy("titulo", "asc")
            .fetch();
        return menus;
    }
}

module.exports = MenuRepository;
