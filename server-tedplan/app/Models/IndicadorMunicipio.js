'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class IndicadorMunicipio extends Model {
  static get connection() {
    return 'tedplan_db';
  }

  static get table() {
    return 'tedplan.indicador_municipio';
  }

  static get primaryKey() {
    return 'id_incicador_municipio';
  }

  static get dates() {
    return super.dates.concat(['created_at', 'updated_at']);
  }

  // Relacionamento com Indicador
  indicador() {
    return this.belongsTo('App/Models/Indicador', 'id_indicador', 'id_indicador');
  }

  // Relacionamento com Município
  municipio() {
    return this.belongsTo('App/Models/Municipio', 'id_municipio', 'id_municipio');
  }

  // Relacionamento com Eixo
  eixo() {
    return this.belongsTo('App/Models/Eixo', 'id_eixo', 'id_eixo');
  }
}

module.exports = IndicadorMunicipio;
