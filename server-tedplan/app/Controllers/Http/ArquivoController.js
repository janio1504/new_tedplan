'use strict'
const Arquivo = use('App/Models/Arquivo')

// const fs = use('fs')
class ArquivoController {
  async index ({ response, request }) {
    const { id_arquivo } = request.all()
    const file = await Arquivo.query()
      .where('id_arquivo', id_arquivo)
      .with('itens')
      .fetch()
    const conteudo = file.toJSON()
    return conteudo
  }
}

module.exports = ArquivoController
