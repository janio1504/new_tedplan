'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TimersSchema extends Schema {
  up () {
    this.table('timers', (table) => {
      table.timestamp('ultima_execussao')
    })
  }

  down () {
    this.table('timers', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TimersSchema
