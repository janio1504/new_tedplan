'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Indicador extends Model {
  static get connection() {
    return 'tedplan_db';
  }

  static get table() {
    return 'tedplan.descricao_indicador';
  }

  static get primaryKey() {
    return 'id_descricao_indicador';
  }
}

module.exports = Indicador;
