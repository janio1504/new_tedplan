'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NovoEmailSchema extends Schema {
  up () {
    this.create('novo_emails', (table) => {
      table.increments()
      table.string('email', 100).notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('novo_emails')
  }
}

module.exports = NovoEmailSchema
