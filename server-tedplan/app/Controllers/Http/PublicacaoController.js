"use strict";

const { request } = require("gaxios");

const File = use("App/Models/File");
const Imagem = use("App/Models/Imagem");
const Helpers = use("Helpers");
const Publicacoes = use("App/Models/Publicacoes");
const Fs = use("fs");
const CustomException = use("App/Exceptions/CustomException");

class PublicacaoController {
  async index({ request, response }) {
    const { page } = request.all()
    
    
    try {
      const publicacoes = await Publicacoes.query()
        .select(
          "p.id_publicacao",
          "p.titulo",
          "tp.nome as tipo_publicacao",
          "e.nome as eixo",
          "tp.nome as tipo",
          "p.id_imagem",
          "m.nome as municipio",
          "p.id_arquivo"
        )
        .from("tedplan.publicacoes as p")
        .innerJoin(
          "tedplan.municipios as m",
          "p.id_municipio",
          "m.id_municipio"
        )
        .innerJoin("tedplan.eixos as e", "p.id_eixo", "e.id_eixo")
        .innerJoin(
          "tedplan.tipo_publicacao as tp",
          "p.id_tipo_publicacao",
          "tp.id_tipo_publicacao"
        )
        .orderBy("p.id_publicacao", "desc")
        .paginate(page, 5)

      return publicacoes;
    } catch (error) {
      return error;
    }
  }

  async getPublicacao({ request }) {
    try {
      const { id_publicacao } = request.all();
      const publicacoes = await Publicacoes.query()
        .select(
          "p.id_publicacao",
          "p.titulo",
          "tp.nome as tipo_publicacao",
          "e.nome as eixo",
          "tp.nome as tipo",
          "p.id_imagem",
          "m.nome as municipio",
          "p.id_arquivo",
          "c.nome as categoria"
        )
        .from("tedplan.publicacoes as p")
        .innerJoin(
          "tedplan.municipios as m",
          "p.id_municipio",
          "m.id_municipio"
        )
        .innerJoin("tedplan.eixos as e", "p.id_eixo", "e.id_eixo")
        .innerJoin(
          "tedplan.tipo_publicacao as tp",
          "p.id_tipo_publicacao",
          "tp.id_tipo_publicacao"
        )
        .leftJoin(
          "tedplan.categorias as c",
          "p.id_categoria",
          "c.id_categoria"
        )
        .where("p.id_publicacao", id_publicacao)
        .fetch();

      return publicacoes;
    } catch (error) {
      return error;
    }
  }

  async buscaPorFiltro({ request, response }) {
    const { titulo, id_eixo, id_tipo_publicacao, id_municipio, page } = request.all();
    
    try {

      if (!id_municipio && !id_eixo && !id_tipo_publicacao && !titulo) {
        const publicacoes = await Publicacoes.query()
        .select(
          "p.id_publicacao",
          "p.titulo",
          "tp.nome as tipo_publicacao",
          "e.nome as eixo",
          "tp.nome as tipo",
          "p.id_imagem",
          "m.nome as municipio",
          "p.id_arquivo"
        )
        .from("tedplan.publicacoes as p")
        .innerJoin(
          "tedplan.municipios as m",
          "p.id_municipio",
          "m.id_municipio"
        )
        .innerJoin("tedplan.eixos as e", "p.id_eixo", "e.id_eixo")
        .innerJoin(
          "tedplan.tipo_publicacao as tp",
          "p.id_tipo_publicacao",
          "tp.id_tipo_publicacao"
        )
        .orderBy("p.id_publicacao", "desc")
        .paginate(page, 5)

        return publicacoes;
      }
      
      if (id_municipio && !id_eixo && !id_tipo_publicacao && !titulo) {
        const publicacoes = await Publicacoes.query()
        .select(
          "p.id_publicacao",
          "p.titulo",
          "tp.nome as tipo_publicacao",
          "e.nome as eixo",
          "tp.nome as tipo",
          "p.id_imagem",
          "m.nome as municipio",
          "p.id_arquivo"
        )
        .from("tedplan.publicacoes as p")
        .innerJoin(
          "tedplan.municipios as m",
          "p.id_municipio",
          "m.id_municipio"
        )
        .innerJoin("tedplan.eixos as e", "p.id_eixo", "e.id_eixo")
        .innerJoin(
          "tedplan.tipo_publicacao as tp",
          "p.id_tipo_publicacao",
          "tp.id_tipo_publicacao"
        )
        .orderBy("p.id_publicacao", "desc")
        .where("m.id_municipio", id_municipio)
        .paginate(page, 5)

        return publicacoes;
      }
      if (id_eixo && !id_municipio && !id_tipo_publicacao && !titulo) {
        const publicacoes = await Publicacoes.query()
        .select(
          "p.id_publicacao",
          "p.titulo",
          "tp.nome as tipo_publicacao",
          "e.nome as eixo",
          "tp.nome as tipo",
          "p.id_imagem",
          "m.nome as municipio",
          "p.id_arquivo"
        )
        .from("tedplan.publicacoes as p")
        .innerJoin(
          "tedplan.municipios as m",
          "p.id_municipio",
          "m.id_municipio"
        )
        .innerJoin("tedplan.eixos as e", "p.id_eixo", "e.id_eixo")
        .innerJoin(
          "tedplan.tipo_publicacao as tp",
          "p.id_tipo_publicacao",
          "tp.id_tipo_publicacao"
        )
        .orderBy("p.id_publicacao", "desc")
        .where("e.id_eixo", id_eixo)
        .paginate(page, 5)

        return publicacoes;
        
      }
      if (id_tipo_publicacao && !id_municipio && !id_eixo && !titulo) {
        const publicacoes = await Publicacoes.query()
        .select(
          "p.id_publicacao",
          "p.titulo",
          "tp.nome as tipo_publicacao",
          "e.nome as eixo",
          "tp.nome as tipo",
          "p.id_imagem",
          "m.nome as municipio",
          "p.id_arquivo"
        )
        .from("tedplan.publicacoes as p")
        .innerJoin(
          "tedplan.municipios as m",
          "p.id_municipio",
          "m.id_municipio"
        )
        .innerJoin("tedplan.eixos as e", "p.id_eixo", "e.id_eixo")
        .innerJoin(
          "tedplan.tipo_publicacao as tp",
          "p.id_tipo_publicacao",
          "tp.id_tipo_publicacao"
        )
        .orderBy("p.id_publicacao", "desc")
        .where("tp.id_tipo_publicacao", id_tipo_publicacao)
        .paginate(page, 5)

        return publicacoes;
      }
      if (titulo && !id_tipo_publicacao && !id_municipio && !id_eixo) {
        console.log(page);
        const publicacoes = await Publicacoes.query()
          .select(
            "p.id_publicacao",
            "p.titulo",
            "tp.nome as tipo_publicacao",
            "e.nome as eixo",
            "tp.nome as tipo",
            "p.id_imagem",
            "m.nome as municipio",
            "p.id_arquivo"
          )
          .from("tedplan.publicacoes as p")
          .innerJoin(
            "tedplan.municipios as m",
            "p.id_municipio",
            "m.id_municipio"
          )
          .innerJoin("tedplan.eixos as e", "p.id_eixo", "e.id_eixo")
          .innerJoin(
            "tedplan.tipo_publicacao as tp",
            "p.id_tipo_publicacao",
            "tp.id_tipo_publicacao"
          )
          .orderBy("p.id_publicacao", "desc")
          .where("p.titulo", "ilike", "%" + titulo + "%")
          .paginate(page, 5)

        return publicacoes;
      }
      if (id_municipio && id_eixo && !id_tipo_publicacao && !titulo) {
        where = { "m.id_municipio": id_municipio, "e.id_eixo": id_eixo };
      }
      if (id_municipio && !id_eixo && id_tipo_publicacao && !titulo) {
        where = {
          "m.id_municipio": id_municipio,
          "tp.id_tipo_publicacao": id_tipo_publicacao,
        };
      }
      if (id_municipio && !id_eixo && !id_tipo_publicacao && titulo) {
        const publicacoes = await Publicacoes.query()
          .select(
            "p.id_publicacao",
            "p.titulo",
            "tp.nome as tipo_publicacao",
            "e.nome as eixo",
            "tp.nome as tipo",
            "p.id_imagem",
            "m.nome as municipio",
            "p.id_arquivo"
          )
          .from("tedplan.publicacoes as p")
          .innerJoin(
            "tedplan.municipios as m",
            "p.id_municipio",
            "m.id_municipio"
          )
          .innerJoin("tedplan.eixos as e", "p.id_eixo", "e.id_eixo")
          .innerJoin(
            "tedplan.tipo_publicacao as tp",
            "p.id_tipo_publicacao",
            "tp.id_tipo_publicacao"
          )
          .orderBy("p.id_publicacao", "desc")
          .where("p.titulo", "ilike", "%" + titulo + "%")
          .where("m.id_municipio", id_municipio)
          .paginate(page, 5)

        return publicacoes;
      }
      if (!id_municipio && id_eixo && id_tipo_publicacao && !titulo) {
        where = {
          "tp.id_tipo_publicacao": id_tipo_publicacao,
          "e.id_eixo": id_eixo,
        };
      }
      if (!id_municipio && id_eixo && !id_tipo_publicacao && titulo) {
        const publicacoes = await Publicacoes.query()
          .select(
            "p.id_publicacao",
            "p.titulo",
            "tp.nome as tipo_publicacao",
            "e.nome as eixo",
            "tp.nome as tipo",
            "p.id_imagem",
            "m.nome as municipio",
            "p.id_arquivo"
          )
          .from("tedplan.publicacoes as p")
          .innerJoin(
            "tedplan.municipios as m",
            "p.id_municipio",
            "m.id_municipio"
          )
          .innerJoin("tedplan.eixos as e", "p.id_eixo", "e.id_eixo")
          .innerJoin(
            "tedplan.tipo_publicacao as tp",
            "p.id_tipo_publicacao",
            "tp.id_tipo_publicacao"
          )
          .orderBy("p.id_publicacao", "desc")
          .where("p.titulo", "ilike", "%" + titulo + "%")
          .where("e.id_eixo", id_eixo)
          .paginate(page, 5)

        return publicacoes;
      }
      if (!id_municipio && !id_eixo && id_tipo_publicacao && titulo) {
        const publicacoes = await Publicacoes.query()
          .select(
            "p.id_publicacao",
            "p.titulo",
            "tp.nome as tipo_publicacao",
            "e.nome as eixo",
            "tp.nome as tipo",
            "p.id_imagem",
            "m.nome as municipio",
            "p.id_arquivo"
          )
          .from("tedplan.publicacoes as p")
          .innerJoin(
            "tedplan.municipios as m",
            "p.id_municipio",
            "m.id_municipio"
          )
          .innerJoin("tedplan.eixos as e", "p.id_eixo", "e.id_eixo")
          .innerJoin(
            "tedplan.tipo_publicacao as tp",
            "p.id_tipo_publicacao",
            "tp.id_tipo_publicacao"
          )
          .orderBy("p.id_publicacao", "desc")
          .where("p.titulo", "ilike", "%" + titulo + "%")
          .where("tp.id_tipo_publicacao", id_tipo_publicacao)
          .paginate(page, 5)

        return publicacoes;
      }
      if (id_municipio && id_eixo && id_tipo_publicacao && !titulo) {
        where = {
          "m.id_municipio": id_municipio,
          "e.id_eixo": id_eixo,
          "tp.id_tipo_publicacao": id_tipo_publicacao,
        };
      }
      if (!id_municipio && id_eixo && id_tipo_publicacao && titulo) {
        const publicacoes = await Publicacoes.query()
          .select(
            "p.id_publicacao",
            "p.titulo",
            "tp.nome as tipo_publicacao",
            "e.nome as eixo",
            "tp.nome as tipo",
            "p.id_imagem",
            "m.nome as municipio",
            "p.id_arquivo"
          )
          .from("tedplan.publicacoes as p")
          .innerJoin(
            "tedplan.municipios as m",
            "p.id_municipio",
            "m.id_municipio"
          )
          .innerJoin("tedplan.eixos as e", "p.id_eixo", "e.id_eixo")
          .innerJoin(
            "tedplan.tipo_publicacao as tp",
            "p.id_tipo_publicacao",
            "tp.id_tipo_publicacao"
          )
          .orderBy("p.id_publicacao", "desc")
          .where("p.titulo", "ilike", "%" + titulo + "%")
          .where("tp.id_tipo_publicacao", id_tipo_publicacao)
          .where("e.id_eixo", id_eixo)
          .paginate(page, 5)

        return publicacoes;
      }
      if (id_municipio && !id_eixo && id_tipo_publicacao && titulo) {
        const publicacoes = await Publicacoes.query()
          .select(
            "p.id_publicacao",
            "p.titulo",
            "tp.nome as tipo_publicacao",
            "e.nome as eixo",
            "tp.nome as tipo",
            "p.id_imagem",
            "m.nome as municipio",
            "p.id_arquivo"
          )
          .from("tedplan.publicacoes as p")
          .innerJoin(
            "tedplan.municipios as m",
            "p.id_municipio",
            "m.id_municipio"
          )
          .innerJoin("tedplan.eixos as e", "p.id_eixo", "e.id_eixo")
          .innerJoin(
            "tedplan.tipo_publicacao as tp",
            "p.id_tipo_publicacao",
            "tp.id_tipo_publicacao"
          )
          .orderBy("p.id_publicacao", "desc")
          .where("p.titulo", "ilike", "%" + titulo + "%")
          .where("tp.id_tipo_publicacao", id_tipo_publicacao)
          .where("m.id_municipio", id_municipio)
          .paginate(page, 5)

        return publicacoes;
      }
      if (id_municipio && id_eixo && !id_tipo_publicacao && titulo) {
        const publicacoes = await Publicacoes.query()
          .select(
            "p.id_publicacao",
            "p.titulo",
            "tp.nome as tipo_publicacao",
            "e.nome as eixo",
            "tp.nome as tipo",
            "p.id_imagem",
            "m.nome as municipio",
            "p.id_arquivo"
          )
          .from("tedplan.publicacoes as p")
          .innerJoin(
            "tedplan.municipios as m",
            "p.id_municipio",
            "m.id_municipio"
          )
          .innerJoin("tedplan.eixos as e", "p.id_eixo", "e.id_eixo")
          .innerJoin(
            "tedplan.tipo_publicacao as tp",
            "p.id_tipo_publicacao",
            "tp.id_tipo_publicacao"
          )
          .orderBy("p.id_publicacao", "desc")
          .where("p.titulo", "ilike", "%" + titulo + "%")
          .where("e.id_eixo", id_eixo)
          .where("m.id_municipio", id_municipio)
          .paginate(page, 5)

        return publicacoes;
      }
      if (id_municipio && id_eixo && id_tipo_publicacao && titulo) {
        const publicacoes = await Publicacoes.query()
          .select(
            "p.id_publicacao",
            "p.titulo",
            "tp.nome as tipo_publicacao",
            "e.nome as eixo",
            "tp.nome as tipo",
            "p.id_imagem",
            "m.nome as municipio",
            "p.id_arquivo"
          )
          .from("tedplan.publicacoes as p")
          .innerJoin(
            "tedplan.municipios as m",
            "p.id_municipio",
            "m.id_municipio"
          )
          .innerJoin("tedplan.eixos as e", "p.id_eixo", "e.id_eixo")
          .innerJoin(
            "tedplan.tipo_publicacao as tp",
            "p.id_tipo_publicacao",
            "tp.id_tipo_publicacao"
          )
          .orderBy("p.id_publicacao", "desc")
          .where("p.titulo", "ilike", "%" + titulo + "%")
          .where("e.id_eixo", id_eixo)
          .where("tp.id_tipo_publicacao", id_tipo_publicacao)
          .where("m.id_municipio", id_municipio)
          .paginate(page, 5)

        return publicacoes;
      }

      const publicacoes = await Publicacoes.query()
        .select(
          "p.id_publicacao",
          "p.titulo",
          "tp.nome as tipo_publicacao",
          "e.nome as eixo",
          "tp.nome as tipo",
          "p.id_imagem",
          "m.nome as municipio",
          "p.id_arquivo"
        )
        .from("tedplan.publicacoes as p")
        .innerJoin(
          "tedplan.municipios as m",
          "p.id_municipio",
          "m.id_municipio"
        )
        .innerJoin("tedplan.eixos as e", "p.id_eixo", "e.id_eixo")
        .innerJoin(
          "tedplan.tipo_publicacao as tp",
          "p.id_tipo_publicacao",
          "tp.id_tipo_publicacao"
        )
        .orderBy("p.id_publicacao", "desc")
        .where(where)
        .paginate(page, 5)

      return publicacoes;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async store({ request, response }) {
    try {
      const {
        titulo,
        id_eixo,
        id_categoria,
        id_municipio,
        id_tipo_publicacao,
      } = request.all();

      if (!request.file("file") || !request.file("imagem")) {
        throw response.status(401).send({ error: "Acesso não autorizado!" });
      }

      const upload_file = request.file("file", { size: "100mb" });
      const fileName = `${Date.now()}.${upload_file.subtype}`;
      await upload_file.move(Helpers.tmpPath("uploads"), {
        name: fileName,
      });

      if (!upload_file.moved()) {
        throw upload_file.error;
      }

      const file = await File.create({
        file: fileName,
        name: upload_file.clientName,
        type: upload_file.type,
        subtype: upload_file.subtype,
      });

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

      const post = await Publicacoes.query()
        .from("tedplan.publicacoes")
        .insert({
          titulo: titulo,
          id_eixo: id_eixo,
          id_tipo_publicacao: id_tipo_publicacao,
          id_categoria: id_categoria,
          id_municipio: id_municipio,
          id_arquivo: file.id,
          id_imagem: imagem.id,
        });

      return post;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async show({ request, params }) {
    try {
      const { id } = request.all();

      const post = await Posts.query()
        .from("tedplan.posts as p")
        .innerJoin("tedplan.arquivos as a", "p.id_imagem", "a.id")
        .where("p.id_posts", id)
        .fetch();

      return post;
    } catch (error) {}
  }

  async update({ request, response }) {
    try {
      const {
        titulo,
        id_publicacao,
        id_categoria,
        id_eixo,
        id_tipo_publicacao,
        id_municipio,
      } = request.all();
      if (titulo) {
        const resPub = await Publicacoes.query()
          .from("tedplan.publicacoes")
          .where("id_publicacao", id_publicacao)
          .update({ titulo: titulo });
      }
      if (id_municipio) {
        const resPub = await Publicacoes.query()
          .from("tedplan.publicacoes")
          .where("id_publicacao", id_publicacao)
          .update({ id_municipio: id_municipio });
      }
      if (id_categoria) {
        const resPub = await Publicacoes.query()
          .from("tedplan.publicacoes")
          .where("id_publicacao", id_publicacao)
          .update({ id_categoria: id_categoria });
      }
      if (id_eixo) {
        const resPub = await Publicacoes.query()
          .from("tedplan.publicacoes")
          .where("id_publicacao", id_publicacao)
          .update({ id_eixo: id_eixo });
      }
      if (id_tipo_publicacao) {
        const resPub = await Publicacoes.query()
          .from("tedplan.publicacoes")
          .where("id_publicacao", id_publicacao)
          .update({ id_tipo_publicacao: id_tipo_publicacao });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateImagem({ request, response }) {
    try {
      const { id_publicacao, id_imagem } = request.all();

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

      const resPub = await Publicacoes.query()
        .from("tedplan.publicacoes")
        .where("id_publicacao", id_publicacao)
        .update({ id_imagem: imagem.id });

      return resPub;
    } catch (error) {
      console.log(error);
    }
  }

  async destroy({ request, response }) {
    try {
      const { id_publicacao, id_imagem, id_arquivo } = request.all();

      const idDelete = await Publicacoes.query()
        .table("tedplan.publicacoes")
        .where("id_publicacao", id_publicacao)
        .delete();

      if (id_imagem) {
        const imagem = await Imagem.findBy("id", id_imagem);
        
        if (!imagem) {
          Fs.unlinkSync(Helpers.tmpPath(`uploads/${imagem.file}`));
          imagem.delete();
        }
      }
      
      if (id_arquivo) {
        const file = await File.findBy("id", id_arquivo);
        if (!file) {
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

  async listTipoPublicacao({ response }) {
    try {
      const publicacao = await Publicacoes.query()
        .from("tedplan.tipo_publicacao")
        .fetch();

      return publicacao;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = PublicacaoController;
