"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class GestaoAssociada extends Model {
  static get connection() {
    return "tedplan_db";
  }
  static get table() {
    return "tedplan.gestao_associada";
  }
  static get primaryKey() {
    return "id";
  }
}

module.exports = GestaoAssociada;
