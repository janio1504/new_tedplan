'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TipoCampoIndicador extends Model {
  static get connection() {
    return 'tedplan_db';
  }

  static get table() {
    return 'tedplan.tipo_campo_indicador';
  }

  static get primaryKey() {
    return 'id_tipo_campo_indicador';
  }

  static get dates() {
    return super.dates.concat(['created_at', 'updated_at']);
  }

  // Relacionamento com Indicadores
  indicadores() {
    return this.hasMany('App/Models/IndicadorNovo', 'id_tipo_campo_indicador', 'id_tipo_campo_indicador');
  }
}

module.exports = TipoCampoIndicador;
