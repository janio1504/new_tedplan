'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Usuario extends Model {
  static get connection() { return 'tedplan_db' }
  static get table() { return 'tedplan.usuario' }
  static get primaryKey() { return 'id_usuario' }
  static get visible() {
    return ['id_usuario', 'id_pessoa', 'login', 'senha']
  }
}

module.exports = Usuario
