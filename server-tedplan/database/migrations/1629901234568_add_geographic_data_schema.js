'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddGeographicDataSchema extends Schema {
  up () {
    this.create('tedplan.dados_geograficos', (table) => {
      table.increments('id_dados_geograficos')
      table.integer('id_municipio').unsigned().references('id_municipio').inTable('tedplan.municipios')
      
      // Campos gerais
      table.string('OGM0001').nullable().comment('Nome da mesorregião geográfica')
      table.string('OGM0002').nullable().comment('Nome da microrregião geográfica')
      table.string('OGM0003').nullable().comment('Pertence à Região Metropolitana')
      table.string('OGM0004').nullable().comment('Nome oficial (RM, RIDE, etc)')
      table.decimal('OGM0005', 10, 2).nullable().comment('Área territorial total')
      table.decimal('OGM0006', 10, 2).nullable().comment('Total de áreas urbanizadas')
      table.integer('OGM0007').nullable().comment('Quantidade de distritos')
      table.integer('OGM0008').nullable().comment('Quantidade de localidades urbanas')
      table.integer('OGM0009').nullable().comment('Quantidade de aglomerados rurais')
      
      // Cotas topográficas
      table.decimal('OGM0010', 10, 2).nullable().comment('Cota altimétrica de referência')
      table.decimal('OGM0011', 10, 2).nullable().comment('Cota altimétrica mínima')
      table.decimal('OGM0012', 10, 2).nullable().comment('Cota altimétrica máxima')
      
      // Comunidades especiais
      table.string('OGM0101').nullable().comment('Existem Aldeias Indígenas')
      table.integer('OGM0102').nullable().comment('Quantidade de moradias nas Aldeias Indígenas')
      table.integer('OGM0103').nullable().comment('População nas Aldeias Indígenas')
      table.string('OGM0104').nullable().comment('Existem Comunidades Quilombolas')
      table.integer('OGM0105').nullable().comment('Quantidade de moradias nas Comunidades Quilombolas')
      table.integer('OGM0106').nullable().comment('População nas Comunidades Quilombolas')
      table.string('OGM0107').nullable().comment('Existem Comunidades Extrativistas')
      table.integer('OGM0108').nullable().comment('Quantidade de moradias nas Comunidades Extrativistas')
      table.integer('OGM0109').nullable().comment('População nas Comunidades Extrativistas')
      
      // Padrão AdonisJs
      table.timestamps()
    })
  }

  down () {
    this.drop('tedplan.dados_geograficos')
  }
}

module.exports = AddGeographicDataSchema
