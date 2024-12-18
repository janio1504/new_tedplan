"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class SaneamentoRural extends Model {
  static get connection() {
    return "tedplan_db";
  }
  static get table() {
    return "tedplan.saneamento_rural";
  }
  static get primaryKey() {
    return "id_saneamento_rural";
  }
}

module.exports = SaneamentoRural;
