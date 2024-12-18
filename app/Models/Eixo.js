'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Eixo extends Model {

    static get connection() { return 'tedplan_db' }

}

module.exports = Eixo
