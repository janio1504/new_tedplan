'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LogTimerSchema extends Schema {
  up () {
    this.create('log_timers', (table) => {
      table.increments()
      table.integer('timer_id').unsigned().references('id').inTable('timers')
      table.text('log')
      table.timestamps()
    })
  }

  down () {
    this.drop('log_timers')
  }
}

module.exports = LogTimerSchema
