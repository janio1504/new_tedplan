'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Eixo extends Model {
  static get connection() {
    return 'tedplan_db';
  }

  static get table() {
    return 'tedplan.eixos';
  }

  static get primaryKey() {
    return 'id_eixo';
  }

  static get dates() {
    return super.dates.concat(['created_at', 'updated_at']);
  }
}

module.exports = Eixo
