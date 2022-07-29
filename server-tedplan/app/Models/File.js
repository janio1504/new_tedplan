"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class File extends Model {
  static get connection() {
    return "tedplan_db";
  }
  static get table() {
    return "tedplan.arquivos";
  }
  static get primaryKey() {
    return "id";
  }
}

module.exports = File;
