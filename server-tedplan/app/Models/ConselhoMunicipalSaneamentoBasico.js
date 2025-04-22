"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class ConselhoMunicipalSaneamentoBasico extends Model {
  static get connection() {
    return "tedplan_db";
  }
  static get table() {
    return "tedplan.conselho_municipal_saneamento_basico";
  }
  static get primaryKey() {
    return "id_conselho_municipal_saneamento_basico";
  }
}

module.exports = ConselhoMunicipalSaneamentoBasico;
