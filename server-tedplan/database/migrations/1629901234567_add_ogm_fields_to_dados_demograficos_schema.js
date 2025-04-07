'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddOgmFieldsToDadosDemograficosSchema extends Schema {
  up () {
    this.table('tedplan.dados_demograficos', (table) => {
      // Adicionando novos campos OGM
      table.integer('OGM4001').nullable().comment('Quantidade de estabelecimentos urbanos existente no município')
      table.integer('OGM4002').nullable().comment('Quantidade de estabelecimentos rurais existente no município')
      table.integer('OGM4003').nullable().comment('Quantidade de estabelecimentos totais existente no município')
      table.integer('OGM4004').nullable().comment('Quantidade de domicílios urbanos existente no município')
      table.integer('OGM4005').nullable().comment('Quantidade de domicílios rurais existente no município')
      table.integer('OGM4006').nullable().comment('Quantidade de domicílios totais existente no município')
      table.decimal('OGM4007', 10, 2).nullable().comment('Extensão total de vias públicas urbanas com pavimento')
      table.decimal('OGM4008', 10, 2).nullable().comment('Extensão total de vias públicas urbanas sem pavimento')
      table.decimal('OGM4009', 10, 2).nullable().comment('Extensão total de vias públicas urbanas (com e sem pavimento)')
    })
  }

  down () {
    this.table('tedplan.dados_demograficos', (table) => {
      // Removendo campos (para reverter a migration)
      table.dropColumn('OGM4001')
      table.dropColumn('OGM4002')
      table.dropColumn('OGM4003')
      table.dropColumn('OGM4004')
      table.dropColumn('OGM4005')
      table.dropColumn('OGM4006')
      table.dropColumn('OGM4007')
      table.dropColumn('OGM4008')
      table.dropColumn('OGM4009')
    })
  }
}

module.exports = AddOgmFieldsToDadosDemograficosSchema
