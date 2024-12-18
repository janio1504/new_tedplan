"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Financeiro extends Model {
  static get connection() {
    return "tedplan_db";
  }
  static get table() {
    return "tedplan.financeiro";
  }
  static get primaryKey() {
    return "id_financeiro";
  }
}

module.exports = Financeiro;
