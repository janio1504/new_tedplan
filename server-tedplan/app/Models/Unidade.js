'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Unidade extends Model {
  static get connection() {
    return 'tedplan_db';
  }

  static get table() {
    return 'tedplan.unidades';
  }

  static get primaryKey() {
    return 'id_unidade';
  }

  static get dates() {
    return super.dates.concat(['data_cadastro', 'created_at', 'updated_at']);
  }

  // Relacionamento com TipoUnidade (se existir)
  tipoUnidade() {
    return this.belongsTo('App/Models/TipoUnidade', 'id_tipo_unidade', 'id_tipo_unidade');
  }

  // Relacionamento com Eixo
  eixo() {
    return this.belongsTo('App/Models/Eixo', 'id_eixo', 'id_eixo');
  }

  // Relacionamento com Municipio
  municipio() {
    return this.belongsTo('App/Models/Municipio', 'id_municipio', 'id_municipio');
  }
}

module.exports = Unidade;

