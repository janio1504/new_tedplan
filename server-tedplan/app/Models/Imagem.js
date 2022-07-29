"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Imagem extends Model {
  static get connection() {
    return "tedplan_db";
  }
  static get table() {
    return "tedplan.imagens";
  }
}

module.exports = Imagem;
