'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class IndicadorNovo extends Model {
  static get connection() {
    return 'tedplan_db';
  }

  static get table() {
    return 'tedplan.indicador';
  }

  static get primaryKey() {
    return 'id_indicador';
  }

  static get dates() {
    return super.dates.concat(['created_at', 'updated_at']);
  }

  // Relacionamento com MenuItem
  menuItem() {
    return this.belongsTo('App/Models/MenuItem', 'id_menu_item', 'id_menu_item');
  }

  // Relacionamento com TipoCampoIndicador
  tipoCampoIndicador() {
    return this.belongsTo('App/Models/TipoCampoIndicador', 'id_tipo_campo_indicador', 'id_tipo_campo_indicador');
  }

  // Relacionamento com IndicadorMunicipio
  indicadoresMunicipio() {
    return this.hasMany('App/Models/IndicadorMunicipio', 'id_indicador', 'id_indicador');
  }
}

module.exports = IndicadorNovo;
