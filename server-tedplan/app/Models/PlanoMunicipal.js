"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class PlanoMunicipal extends Model {
  static get connection() {
    return "tedplan_db";
  }
  static get table() {
    return "tedplan.plano_municipal";
  }
  static get primaryKey() {
    return "id_plano_municipal";
  }
}

module.exports = PlanoMunicipal;
