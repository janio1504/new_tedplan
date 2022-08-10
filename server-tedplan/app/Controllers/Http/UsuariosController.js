"use strict";
const md5 = require("md5");
const Usuario = use("App/Models/Usuarios");
const Pessoa = use("App/Models/Pessoas");

class UsuariosController {
  async index() {
    try {
      const usuarios = await Usuario.query()
        .select(
          "u.id_usuario",
          "u.login",
          "u.ativo",
          "p.nome",
          "tu.nome as tipo_usuario"
        )
        .from("tedplan.usuario as u")
        .innerJoin("tedplan.pessoa as p", "u.id_pessoa", "p.id_pessoa")
        .leftJoin(
          "tedplan.tipo_usuario as tu",
          "u.id_tipo_usuario",
          "tu.id_tipo_usuario"
        )
        .fetch();

      return usuarios;
    } catch (error) {
      console.log(error);
    }
  }

  async store({ request }) {
    try {
      const { nome, email, telefone, login, senha, id_sistema, id_municipio } =
        request.all();

      const idPessoa = await Pessoa.query()
        .returning("id_pessoa")
        .table("tedplan.pessoa")
        .insert({ nome: nome, email: email, telefone: telefone });

      const idUsuario = await Usuario.query()
        .returning("id_usuario")
        .table("tedplan.usuario")
        .insert({
          login: login,
          senha: md5(senha),
          id_pessoa: idPessoa[0],
          id_municipio: id_municipio,
        });

      const idPermissao = await Usuario.query()
        .returning("id_permissao_sistema")
        .table("tedplan.permissao_sistema")
        .insert({ id_sistema: id_sistema, id_usuario: idUsuario[0] });

      return idUsuario[0];
    } catch (error) {
      return error;
    }
  }

  async getUsuario({ request }) {
    const { id_usuario } = request.all();

    const user = await Usuario.query()
      .select(
        "u.id_usuario",
        "u.id_pessoa",
        "u.login",
        "u.ultimo_login",
        "p.nome",
        "u.id_municipio",
        "ps.id_sistema",
        "tu.id_tipo_usuario",
        "tu.nome as tipo_usuario"
      )
      .from("tedplan.usuario as u")
      .innerJoin("tedplan.pessoa as p", "u.id_pessoa", "p.id_pessoa")
      .innerJoin(
        "tedplan.tipo_usuario as tu",
        "u.id_tipo_usuario",
        "tu.id_tipo_usuario"
      )
      .leftJoin(
        "tedplan.permissao_sistema as ps",
        "u.id_usuario",
        "ps.id_usuario"
      )
      .where("u.id_usuario", id_usuario)
      .fetch();

    return user.toJSON();
  }

  async updatePermissoesUsuario({ request, response }) {
    try {
      const { id_usuario, id_sistema, ativo, id_tipo_usuario, senha } = request.all();

      if (ativo) {
        const usuarioAtivo = await Usuario.query()
          .from("tedplan.usuario")
          .where("id_usuario", id_usuario)
          .update({ ativo: ativo });
      }
      if (id_tipo_usuario) {
        const tipoUsuario = await Usuario.query()
          .from("tedplan.usuario")
          .where("id_usuario", id_usuario)
          .update({ id_tipo_usuario: id_tipo_usuario });
      }

      const sistema = await Usuario.query()
        .from("tedplan.permissao_sistema")
        .where("id_usuario", id_usuario)
        .where("id_sistema", id_sistema)
        .fetch();

      if (sistema.toJSON().length === 0) {
        const usuario = await Usuario.query()
          .from("tedplan.permissao_sistema")
          .insert({ id_usuario: id_usuario, id_sistema: id_sistema });
      }

      if (senha) {
        const usuarioAtivo = await Usuario.query()
          .from("tedplan.usuario")
          .where("id_usuario", id_usuario)
          .update({ senha: md5(senha) });
      }

      return sistema;
    } catch (error) {
      return error;
    }
  }

  async getTipoUsuario() {
    try {
      const tipoUsuario = await Usuario.query()
        .from("tedplan.tipo_usuario")
        .fetch();

      return tipoUsuario;
    } catch (error) {
      return error;
    }
  }

  async getSistemas() {
    try {
      const sistemas = await Usuario.query().from("tedplan.sistema").fetch();
      return sistemas;
    } catch (error) {
      return error;
    }
  }

  async getPermissaoSistema({ request }) {
    const { id_usuario, id_sistema } = request.all();
    const sistema = await Usuario.query()
      .from("tedplan.permissao_sistema")
      .where("id_usuario", id_usuario)
      .where("id_sistema", id_sistema)
      .fetch();
    return sistema;
  }

  async destroyUsuario({ request, response }) {
    try {
      const { id_usuario } = request.all();
      const usuario = await Usuario.query()
        .table("tedplan.usuario")
        .where("id_usuario", id_usuario)
        .delete();

      const permissaoSistema = await Usuario.query()
        .table("tedplan.permissao_sistema")
        .where("id_usuario", id_usuario)
        .delete();

      return response
        .status(200)
        .send({ message: "Usuário removido com sucesso!" });
    } catch (error) {
      return error;
    }
  }
}

module.exports = UsuariosController;
