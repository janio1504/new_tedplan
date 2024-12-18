"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Galeria extends Model {
  static get connection() {
    return "tedplan_db";
  }
  static get table() {
    return "tedplan.galeria";
  }
  static get primaryKey() {
    return "id_galeria";
  }
}

module.exports = Galeria;
