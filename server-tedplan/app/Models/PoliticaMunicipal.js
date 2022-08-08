"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class PoliticaMunicipal extends Model {
  static get connection() {
    return "tedplan_db";
  }
  static get table() {
    return "tedplan.politica_municipal";
  }
  static get primaryKey() {
    return "id_politica_municipal";
  }
}

module.exports = PoliticaMunicipal;
