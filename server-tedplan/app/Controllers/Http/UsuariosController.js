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
          "u.id_pessoa",
          "u.login",
          "u.ultimo_login",
          "u.ativo",
          "p.nome",
          "u.id_municipio",
          "ps.id_permissao",
          "ps.id_sistema",
          "pss.nome as permissao_usuario"
        )
        .from("tedplan.usuario as u")
        .innerJoin("tedplan.pessoa as p", "u.id_pessoa", "p.id_pessoa")
        .leftJoin(
          "tedplan.permissao_sistema as ps",
          "u.id_usuario",
          "ps.id_usuario"
        )
        .leftJoin(
          "tedplan.permissoes as pss",
          "ps.id_permissao",
          "pss.id_permissao"
        )
        .fetch();

      return usuarios;
    } catch (error) {
      console.log(error);
    }
  }

  async store({ request }) {
    try {
      const {
        nome,
        email,
        telefone,
        login,
        senha,
        id_sistema,
        id_municipio,
        id_permissao,
      } = request.all();

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

      await Usuario.query()
        .table("tedplan.permissao_sistema")
        .insert({
          id_sistema: id_sistema,
          id_usuario: idUsuario[0],
          id_permissao: id_permissao,
        });

      return idUsuario[0];
    } catch (error) {
      return error;
    }
  }

  async getUsuario({ request }) {
    const { id_usuario } = request.all();

    try {
      const user = await Usuario.query()
        .select(
          "u.id_usuario",
          "u.id_pessoa",
          "u.login",
          "u.ultimo_login",
          "p.nome",
          "u.id_municipio",
          "ps.id_permissao",
          "ps.id_sistema",
          "pss.nome as permissao_usuario"
        )
        .from("tedplan.usuario as u")
        .innerJoin("tedplan.pessoa as p", "u.id_pessoa", "p.id_pessoa")
        .leftJoin(
          "tedplan.permissao_sistema as ps",
          "u.id_usuario",
          "ps.id_usuario"
        )
        .leftJoin(
          "tedplan.permissoes as pss",
          "ps.id_permissao",
          "pss.id_permissao"
        )
        .where("u.id_usuario", id_usuario)
        .fetch();

      return user.toJSON();
    } catch (error) {
      console.log(error);
    }
  }

  async getResponsaveisSimisab({ params }) {
    try {
      const user = await Usuario.query()
        .select(
          "u.id_usuario",
          "u.id_pessoa",
          "p.nome",
          "p.telefone",
          "p.email"
        )
        .from("tedplan.usuario as u")
        .innerJoin("tedplan.pessoa as p", "u.id_pessoa", "p.id_pessoa")
        .innerJoin(
          "tedplan.permissao_sistema as ps",
          "u.id_usuario",
          "ps.id_usuario"
        )
        .innerJoin(
          "tedplan.permissoes as pss",
          "ps.id_permissao",
          "pss.id_permissao"
        )
        .where("u.id_municipio", params.id)
        .where("pss.id_permissao", 3)
        .fetch();

      return user.toJSON();
    } catch (error) {
      console.log(error);
    }
  }

  async getEditorSimisabPorAno({ params }) {
    try {
      const editor = await Usuario.query()
        .select("*")
        .from("tedplan.editor_simisab_por_ano as e")
        .where("e.id_usuario", params.id)
        .whereNotNull("e.ano")
        .where("e.ativo", true)
        .fetch();
      return editor.toJSON();
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async createEditorSimisabPorAno({ request, response }) {
    const { id_usuario, ano, ativo, id_editor_simisab } = request.all();
    try {
      if (id_editor_simisab) {
        const editorSimisab = await Usuario.query()
          .select("*")
          .from("tedplan.editor_simisab_por_ano as e")
          .where("id_editor_simisab", id_editor_simisab)
          .where("ano", ano)
          .fetch();

        if (editorSimisab.toJSON().length > 0) { 
          await Usuario.query()
            .from("tedplan.editor_simisab_por_ano")
            .where("id_editor_simisab", id_editor_simisab)
            .update({ ativo: ativo });

          return response.status(200).send({
            message: "Editor atualizado com sucesso!",
          });
        }
      }

      const editor = await Usuario.query()
        .returning("id_editor_simisab")
        .table("tedplan.editor_simisab_por_ano")
        .insert({
          id_usuario: id_usuario,
          ano: ano,
          ativo: ativo,
        });
      return editor;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async updatePermissoesUsuario({ request, response }) {
    try {
      const {
        id_usuario,
        id_sistema,
        ativo,
        id_permissao,
        id_municipio,
        senha,
      } = request.all();

      if (ativo) {
        await Usuario.query()
          .from("tedplan.usuario")
          .where("id_usuario", id_usuario)
          .update({ ativo: ativo });
      }

      if (id_municipio) {
        await Usuario.query()
          .from("tedplan.usuario")
          .where("id_usuario", id_usuario)
          .update({ id_municipio: id_municipio });
      }

      if (id_permissao) {
        await Usuario.query()
          .from("tedplan.permissao_sistema")
          .where("id_usuario", id_usuario)
          .update({ id_permissao: id_permissao, id_sistema: id_sistema });
      }

      // const sistema = await Usuario.query()
      //   .from("tedplan.permissao_sistema")
      //   .where("id_usuario", id_usuario)
      //   .where("id_sistema", id_sistema)
      //   .fetch();

      // if (sistema.toJSON().length === 0) {
      //   await Usuario.query().from("tedplan.permissao_sistema")
      //     .insert({ id_usuario: id_usuario, id_sistema: id_sistema });
      // }

      if (senha) {
        await Usuario.query()
          .from("tedplan.usuario")
          .where("id_usuario", id_usuario)
          .update({ senha: md5(senha) });
      }

      return response()
        .status(200)
        .send("As permissões do usuário foram atualizadas!");
    } catch (error) {
      console.log(error);

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

  async getPermissoes() {
    const sistema = await Usuario.query().from("tedplan.permissoes").fetch();
    return sistema;
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
