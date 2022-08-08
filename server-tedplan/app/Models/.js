"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class RepresentanteServivos extends Model {
  static get connection() {
    return "tedplan_db";
  }
  static get table() {
    return "tedplan.representante_servicos_ga";
  }
  static get primaryKey() {
    return "id_representante_servicos_ga";
  }
}

module.exports = PlanoMunicipal;
