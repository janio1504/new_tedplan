const MenuItem = use("App/Models/MenuItem");

class MenuItemRepository {

    async getAllMenuItems() {
        const menuItems = await MenuItem.query()
            .with('menu')
            .orderBy("id_menu_item", "desc")
            .fetch();
        return menuItems.toJSON();
    }

    async getMenuItemById(id) {
        const menuItem = await MenuItem.query()
            .where('id_menu_item', id)
            .with('menu')
            .orderBy("ordem_item_menu", "asc")
            .fetch();
        return menuItem ? menuItem.toJSON() : null;
    }

    async getMenuItemsByMenu(id_menu) {
        const menuItems = await MenuItem.query()
            .where('id_menu', id_menu)
            .with('menu')
            .orderBy("ordem_item_menu", "asc")
            .fetch();
        return menuItems.toJSON();
    }

    async addMenuItem(data) {
        const menuItem = await MenuItem.create(data);
        // Recarregar com relacionamentos
        const menuItemWithRelations = await MenuItem.query()
            .where('id_menu_item', menuItem.id_menu_item)
            .with('menu')
            .first();
        return menuItemWithRelations ? menuItemWithRelations.toJSON() : menuItem.toJSON();
    }

    async updateMenuItem(id, data) {
        const menuItem = await MenuItem.findOrFail(id);
        menuItem.merge(data);
        await menuItem.save();
        return menuItem;
    }

    async deleteMenuItem(id) {
        const menuItem = await MenuItem.findOrFail(id);
        await menuItem.delete();
        return { message: 'Item de menu deletado com sucesso' };
    }

    async searchMenuItems(searchTerm) {
        const menuItems = await MenuItem.query()
            .where('nome_menu_item', 'ilike', `%${searchTerm}%`)
            .with('menu')
            .orderBy("nome_menu_item", "asc")
            .fetch();
        return menuItems;
    }
}

module.exports = MenuItemRepository;
