'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TimersSchema extends Schema {
  up () {
    this.create('timers', (table) => {
      table.increments()
      table.string('nome', 30).notNullable()
      table.string('descricao', 100).notNullable()
      table.string('expressao', 14).notNullable()      
      table.timestamps()
    })
  }

  down () {
    this.drop('timers')
  }
}

module.exports = TimersSchema
