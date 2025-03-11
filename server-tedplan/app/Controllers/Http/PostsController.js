"use strict";

const Imagem = use("App/Models/Imagem");
const Helpers = use("Helpers");
const Posts = use("App/Models/Posts");
const Fs = use("fs");
const CustomException = use("App/Exceptions/CustomException");

class PostsController {
  async index({ request, response }) {
    try {
      const posts = await Posts.query()
        .select(
          "p.id_posts",
          "p.titulo",
          "p.texto",
          "p.id_imagem",
          "m.nome as municipio"
        )
        .from("tedplan.posts as p")
        .innerJoin(
          "tedplan.municipios as m",
          "p.id_municipio",
          "m.id_municipio"
        )
        .orderBy("id_posts", "desc")
        .fetch();
      return posts;
    } catch (error) {
      return error;
    }
  }

  async store({ request, response }) {
    try {
      const { titulo, texto, id_categoria, id_municipio } = request.all();

      if (!request.file("imagem")) return;

      const upload = request.file("imagem", { size: "2mb" });
      const fileName = `${Date.now()}.${upload.subtype}`;
      await upload.move(Helpers.tmpPath("uploads"), {
        name: fileName,
      });

      if (!upload.moved()) {
        throw upload.error;
      }

      const imagem = await Imagem.create({
        file: fileName,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype,
      });

      const post = await Posts.query()
        .returning("*")
        .from("tedplan.posts").insert({
          titulo: titulo,
          texto: texto,
          id_categoria: id_categoria,
          id_municipio: id_municipio,
          id_imagem: imagem.id,
        });

      return response.status(201).json({
        success: true,
        message: 'Postagem criada com sucesso',
        ...post[0]
      });
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async show({ request, params }) {
    try {
      const { id_posts } = request.all();

      const post = await Posts.query()
        .from("tedplan.posts as p")
        .where("p.id_posts", id_posts)
        .fetch();

      return post;
    } catch (error) { }
  }

  async update({ request, response }) {
    try {
      const { id_posts, titulo, texto } = request.all();
      const post = await Posts.query()
        .from("tedplan.posts as p")
        .where("p.id_posts", id_posts)
        .update({ titulo: titulo, texto: texto });

      return post;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async updateImagem({ request, response }) {
    try {
      const { id_posts, id_imagem } = request.all();

      if (!request.file("imagem")) {
        throw response.status(401).send({ error: "Acesso não autorizado!" });
      }

      if (id_imagem) {
        const file = await Imagem.findBy("id", id_imagem);
        if (file) {
          Fs.unlinkSync(Helpers.tmpPath(`uploads/${file.file}`));
          file.delete();
        }
      }

      const upload_imagem = request.file("imagem", { size: "10mb" });
      const imagemName = `${Date.now()}.${upload_imagem.subtype}`;
      await upload_imagem.move(Helpers.tmpPath("uploads"), {
        name: imagemName,
      });

      if (!upload_imagem.moved()) {
        throw upload_imagem.error;
      }

      const imagem = await Imagem.create({
        file: imagemName,
        name: upload_imagem.clientName,
        type: upload_imagem.type,
        subtype: upload_imagem.subtype,
      });

      const resPost = await Posts.query()
        .from("tedplan.posts")
        .where("id_posts", id_posts)
        .update({ id_imagem: imagem.id });

      return resPost;
    } catch (error) {
      console.log(error);
    }
  }

  async destroy({ request, response }) {
    try {
      const { id_posts, id_imagem } = request.all();

      const idDelete = await Posts.query()
        .table("tedplan.posts")
        .where("id_posts", id_posts)
        .delete();

      if (id_imagem) {
        const file = await Imagem.findBy("id", id_imagem);
        if (file) {
          Fs.unlinkSync(Helpers.tmpPath(`uploads/${file.file}`));
          file.delete();
        }
      }

      return idDelete;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

module.exports = PostsController;
