"use strict";

const Usuario = use("App/Models/Usuarios");

class UsuarioController {
  async store({ request }) {
    const { login, senha } = request.only(["login", "senha"]);

    const usuario = await Usuario.findBy({ login });
    return usuario;
  }
}

module.exports = UsuarioController;
