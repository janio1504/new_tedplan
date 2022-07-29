"use strict";

const Categoria = use("App/Models/Categoria");

class CategoriaController {
  async index() {
    const categorias = await Categoria.query()
      .from("tedplan.categorias")
      .fetch();

    return categorias;
  }

  async store() {}
}

module.exports = CategoriaController;
