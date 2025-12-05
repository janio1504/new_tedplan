'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TipoUnidade extends Model {
  static get connection() {
    return 'tedplan_db';
  }

  static get table() {
    return 'tedplan.tipo_unidade';
  }

  static get primaryKey() {
    return 'id_tipo_unidade';
  }

  static get dates() {
    return super.dates.concat(['created_at', 'updated_at']);
  }

  // Relacionamento com Eixo
  eixo() {
    return this.belongsTo('App/Models/Eixo', 'id_eixo', 'id_eixo');
  }

  // Relacionamento com Unidades
  unidades() {
    return this.hasMany('App/Models/Unidade', 'id_tipo_unidade', 'id_tipo_unidade');
  }
}

module.exports = TipoUnidade;

