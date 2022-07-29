"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Usuarios extends Model {
  static get connection() {
    return "tedplan_db";
  }
}

module.exports = Usuarios;
