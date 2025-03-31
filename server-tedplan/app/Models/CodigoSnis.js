'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CodigoSnis extends Model {
  static get connection() {
    return 'tedplan_db';
  }

  static get table() {
    return 'tedplan.codigo_snis';
  }

  static get primaryKey() {
    return 'id_codigo_snis';
  }
}

module.exports = CodigoSnis;
