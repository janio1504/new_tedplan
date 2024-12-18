"use strict";
const md5 = require("md5");
const Usuario = use("App/Models/Usuarios");

const CustomException = use("App/Exceptions/CustomException");

class SessionController {
  async store({ request, response, auth }) {
     
    const { login, senha, id_sistema } = request.all();
    try {
      const resUsuario = await Usuario.query()
        .from("tedplan.usuario")
        .where("login", login)
        .fetch();

      const usuario = resUsuario.toJSON();
      
      if (usuario.length == 0) {
        throw new CustomException("O login esta errado ou não existe!", 401);
      }

      if (usuario[0].senha !== md5(senha)) {
        throw new CustomException("Erro ao autenticar o usuário!", 401);
      }
       
      if (usuario[0].ativo === false) {
        throw new CustomException(
          "Usuário inativo, procure o administrador do sistema!",
          401
        );
      }

      if (usuario[0].id_permissao !== 1) {
        const resPermissao = await Usuario.query()
          .from("tedplan.permissao_sistema")
          .where("id_usuario", usuario[0].id_usuario)
          .fetch();

        const permissao = resPermissao.toJSON();

        if (permissao.length === 0) {
          throw new CustomException(
            "O usuário não tem permissão para acessar o sistema!",
            401
          );
        }
      }
     
      const usuario_autenticado = usuario[0]
      const { token } = await auth.generate(usuario_autenticado);
      
      const data = new Date().toLocaleString("pt-BR", {
        timeZone: "America/Belem",
      });

      
      await Usuario.query()
        .from("tedplan.usuario")
        .where("id_usuario", usuario_autenticado.id_usuario)
        .update({ ultimo_login: data });

      
      return response.json({ token, id_usuario:  usuario_autenticado.id_usuario});
    } catch (error) {
      console.log(error);
      //return new CustomException().handle(error, { response });
    }
  }
}

module.exports = SessionController;
