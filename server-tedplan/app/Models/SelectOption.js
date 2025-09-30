'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SelectOption extends Model {
  static get connection() {
    return 'tedplan_db';
  }

  static get table() {
    return 'tedplan.select_options';
  }

  static get primaryKey() {
    return 'id_select_option';
  }

  static get dates() {
    return super.dates.concat(['created_at', 'updated_at']);
  }

  // Relacionamento com TipoCampoIndicador
  tipoCampoIndicador() {
    return this.belongsTo('App/Models/TipoCampoIndicador', 'id_tipo_campo_indicador', 'id_tipo_campo_indicador');
  }
}

module.exports = SelectOption;
