'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddFuncaoTsmsToTitularServicosMsSchema extends Schema {
  up () {
    this.table('tedplan.titular_servicos_ms', (table) => {
      table.string('funcao_tsms', 255).nullable().comment('Função do titular dos serviços municipais de saneamento')
    })
  }

  down () {
    this.table('tedplan.titular_servicos_ms', (table) => {
      table.dropColumn('funcao_tsms')
    })
  }
}

module.exports = AddFuncaoTsmsToTitularServicosMsSchema

