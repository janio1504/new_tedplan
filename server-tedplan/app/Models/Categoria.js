'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Categoria extends Model {

    static get connection() { return 'tedplan_db' }

}

module.exports = Categoria
