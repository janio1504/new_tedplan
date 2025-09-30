'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Menu extends Model {
  static get connection() {
    return 'tedplan_db';
  }

  static get table() {
    return 'tedplan.menu';
  }

  static get primaryKey() {
    return 'id_menu';
  }

  static get dates() {
    return super.dates.concat(['created_at', 'updated_at']);
  }

  // Relacionamento com MenuItems
  menuItems() {
    return this.hasMany('App/Models/MenuItem', 'id_menu', 'id_menu');
  }

  // Relacionamento com Módulo (se existir)
  modulo() {
    return this.belongsTo('App/Models/Modulo', 'id_modulo', 'id_modulo');
  }

  // Relacionamento com Eixo (se existir)
  eixo() {
    return this.belongsTo('App/Models/Eixo', 'id_eixo', 'id_eixo');
  }
}

module.exports = Menu;
