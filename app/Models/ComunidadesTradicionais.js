"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class ComunidadesTradicionais extends Model {
  static get connection() {
    return "tedplan_db";
  }
  static get table() {
    return "tedplan.comunidades_tradicionais";
  }
  static get primaryKey() {
    return "id_comunidades_tradicionais";
  }
}

module.exports = ComunidadesTradicionais;
