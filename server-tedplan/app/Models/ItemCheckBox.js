'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ItemCheckBox extends Model {
  static get connection() {
    return 'tedplan_db';
  }

  static get table() {
    return 'tedplan.item_check_box';
  }

  static get primaryKey() {
    return 'id_item_check_box';
  }

  static get dates() {
    return super.dates.concat(['created_at', 'updated_at']);
  }

  // Relacionamento com IndicadorNovo
  indicador() {
    return this.belongsTo('App/Models/IndicadorNovo', 'id_indicador', 'id_indicador');
  }
}

module.exports = ItemCheckBox;
