"use strict";
const md5 = require("md5");
const Usuario = use("App/Models/Usuarios");
const Pessoa = use("App/Models/Pessoas");

// Helper function para sanitizar valores integer
function sanitizeInteger(value) {
  // Se for undefined, null, string vazia ou string "undefined"/"null", retorna null
  if (value === undefined || value === null || value === '' || 
      (typeof value === 'string' && (value.toLowerCase() === 'undefined' || value.toLowerCase() === 'null'))) {
    return null;
  }
  // Se já for um número válido, retorna ele mesmo
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  // Tenta converter para integer
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
}

// Helper function para sanitizar valores boolean
function sanitizeBoolean(value) {
  if (value === undefined || value === null || value === '' || 
      (typeof value === 'string' && (value.toLowerCase() === 'undefined' || value.toLowerCase() === 'null'))) {
    return null;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  return Boolean(value);
}

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
      return response.status(500).json({ error: 'Erro ao buscar usuários' });
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

  async getUsuario({ request, response }) {
    const { id_usuario } = request.all();

    try {
      const sanitizedIdUsuario = sanitizeInteger(id_usuario);

      if (!sanitizedIdUsuario) {
        return response.status(400).json({
          error: 'ID do usuário é obrigatório e deve ser um número válido'
        });
      }

      const users = await Usuario.query()
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
        .where("u.id_usuario", sanitizedIdUsuario)
        .fetch();

      const usersArray = users.toJSON();
      
      // Se não houver resultados, retorna erro
      if (usersArray.length === 0) {
        return response.status(404).json({
          error: 'Usuário não encontrado'
        });
      }

      // Retorna o array completo (pode ter múltiplas permissões)
      // O frontend já está preparado para receber um array e usar [0]
      return usersArray;
    } catch (error) {
      return response.status(500).json({
        error: 'Erro ao buscar usuário',
        details: error.message
      });
    }
  }

  async getResponsaveisSimisab({ params, response }) {
    try {
      const sanitizedIdMunicipio = sanitizeInteger(params.id);
      const sanitizedIdPermissao = sanitizeInteger(3); // Permissão 3 é fixa

      // Se não houver id_municipio válido, retorna array vazio (usuário pode não ter município associado)
      if (!sanitizedIdMunicipio) {
        return response.status(200).json([]);
      }

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
        .where("u.id_municipio", sanitizedIdMunicipio)
        .where("pss.id_permissao", sanitizedIdPermissao)
        .fetch();

      return user.toJSON();
    } catch (error) {
      return response.status(500).json({
        error: 'Erro ao buscar responsáveis SIMISAB',
        details: error.message
      });
    }
  }

  async getEditorSimisabPorAno({ params, response }) {
    try {
      const sanitizedIdUsuario = sanitizeInteger(params.id);
      const sanitizedAtivo = sanitizeBoolean(true); // Ativo é fixo como true

      // Se não houver id_usuario válido, retorna array vazio (usuário pode não ter permissão de editor)
      if (!sanitizedIdUsuario) {
        return response.status(200).json([]);
      }

      const editor = await Usuario.query()
        .select("*")
        .from("tedplan.editor_simisab_por_ano as e")
        .where("e.id_usuario", sanitizedIdUsuario)
        .whereNotNull("e.ano")
        .where("e.ativo", sanitizedAtivo)
        .fetch();
      return editor.toJSON();
    } catch (error) {
      return response.status(500).json({
        error: 'Erro ao buscar editor SIMISAB por ano',
        details: error.message
      });
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
          .orderBy("id_editor_simisab", "desc")
          .limit(1)
          .fetch();

        if (editorSimisab.toJSON().length > 0) { 
          await Usuario.query()
            .from("tedplan.editor_simisab_por_ano")
            .where("id_editor_simisab", id_editor_simisab)
            .update({ ativo: ativo, ano: ano });

          return response.status(200).send({
            message: "Editor atualizado com sucesso!",
          });
        }
      }else{
          const editor = await Usuario.query()
            .returning("id_editor_simisab")
            .table("tedplan.editor_simisab_por_ano")
            .insert({
              id_usuario: id_usuario,
              ano: ano,
              ativo: ativo,
            });

            return response.status(200).send({
            message: "Editor cadastrado com sucesso!",
          });
        }

    } catch (error) {
      return response.status(500).json({ error: 'Erro ao processar requisição' });
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

      const sanitizedIdUsuario = sanitizeInteger(id_usuario);
      if (!sanitizedIdUsuario) {
        return response.status(400).json({
          error: 'ID do usuário é obrigatório e deve ser um número válido'
        });
      }

      if (ativo) {
        const sanitizedAtivo = sanitizeBoolean(ativo);
        await Usuario.query()
          .from("tedplan.usuario")
          .where("id_usuario", sanitizedIdUsuario)
          .update({ ativo: sanitizedAtivo });
      }

      if (id_municipio) {
        const sanitizedIdMunicipio = sanitizeInteger(id_municipio);
        if (sanitizedIdMunicipio) {
          await Usuario.query()
            .from("tedplan.usuario")
            .where("id_usuario", sanitizedIdUsuario)
            .update({ id_municipio: sanitizedIdMunicipio });
        }
      }

      if (id_permissao) {
        const sanitizedIdPermissao = sanitizeInteger(id_permissao);
        const sanitizedIdSistema = sanitizeInteger(id_sistema);
        if (sanitizedIdPermissao && sanitizedIdSistema) {
          await Usuario.query()
            .from("tedplan.permissao_sistema")
            .where("id_usuario", sanitizedIdUsuario)
            .update({ id_permissao: sanitizedIdPermissao, id_sistema: sanitizedIdSistema });
        }
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
          .where("id_usuario", sanitizedIdUsuario)
          .update({ senha: md5(senha) });
      }

      return response()
        .status(200)
        .send("As permissões do usuário foram atualizadas!");
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao atualizar permissões' });
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

  async getPermissaoSistema({ request, response }) {
    const { id_usuario, id_sistema } = request.all();
    
    const sanitizedIdUsuario = sanitizeInteger(id_usuario);
    const sanitizedIdSistema = sanitizeInteger(id_sistema);

    if (!sanitizedIdUsuario || !sanitizedIdSistema) {
      return response.status(400).json({
        error: 'ID do usuário e ID do sistema são obrigatórios e devem ser números válidos'
      });
    }

    const sistema = await Usuario.query()
      .from("tedplan.permissao_sistema")
      .where("id_usuario", sanitizedIdUsuario)
      .where("id_sistema", sanitizedIdSistema)
      .fetch();
    return sistema;
  }

  async destroyUsuario({ request, response }) {
    try {
      const { id_usuario } = request.all();
      
      const sanitizedIdUsuario = sanitizeInteger(id_usuario);
      if (!sanitizedIdUsuario) {
        return response.status(400).json({
          error: 'ID do usuário é obrigatório e deve ser um número válido'
        });
      }

      const usuario = await Usuario.query()
        .table("tedplan.usuario")
        .where("id_usuario", sanitizedIdUsuario)
        .delete();

      const permissaoSistema = await Usuario.query()
        .table("tedplan.permissao_sistema")
        .where("id_usuario", sanitizedIdUsuario)
        .delete();

      return response
        .status(200)
        .send({ message: "Usuário removido com sucesso!" });
    } catch (error) {
      return response.status(500).json({
        error: 'Erro ao remover usuário',
        details: error.message
      });
    }
  }
}

module.exports = UsuariosController;
