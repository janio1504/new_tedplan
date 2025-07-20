'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class MenuItem extends Model {
  static get connection() {
    return 'tedplan_db';
  }

  static get table() {
    return 'tedplan.menu_item';
  }

  static get primaryKey() {
    return 'id_menu_item';
  }

  static get dates() {
    return super.dates.concat(['created_at', 'updated_at']);
  }

  // Relacionamento com Menu
  menu() {
    return this.belongsTo('App/Models/Menu', 'id_menu', 'id_menu');
  }

  // Relacionamento com Indicadores
  indicadores() {
    return this.hasMany('App/Models/IndicadorNovo', 'id_menu_item', 'id_menu_item');
  }
}

module.exports = MenuItem;
