"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Municipio extends Model {
  static get connection() {
    return "tedplan_db";
  }

  static get table() {
    return "tedplan.municipios";
  }

  static get primaryKey() {
    return "id_municipio";
  }
}

module.exports = Municipio;
