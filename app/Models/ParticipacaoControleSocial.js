"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class GestaoAssociada extends Model {
  static get connection() {
    return "tedplan_db";
  }
  static get table() {
    return "tedplan.participacao_controle_social";
  }
  static get primaryKey() {
    return "id_participacao_controle_social";
  }
}

module.exports = GestaoAssociada;
