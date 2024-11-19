"use strict";

const { request } = require("gaxios");

const File = use("App/Models/File");
const Imagem = use("App/Models/Imagem");
const Helpers = use("Helpers");
const Normas = use("App/Models/Normas");
const Fs = use("fs");
const CustomException = use("App/Exceptions/CustomException");

class NormaController {
  async index({ request, response }) {
    const { page } = request.all()
    try {
      const normas = await Normas.query()
        .select(
          "n.titulo",
          "es.nome as escala",
          "e.nome as eixo",
          "n.id_norma",
          "n.id_imagem",
          "n.id_arquivo",
          "tn.nome as tipo_norma"
        )
        .from("tedplan.normas as n")
        .innerJoin("tedplan.escala as es", "n.id_escala", "es.id_escala")
        .innerJoin("tedplan.eixos as e", "n.id_eixo", "e.id_eixo")
        .innerJoin(
          "tedplan.tipo_norma as tn",
          "n.id_tipo_norma",
          "tn.id_tipo_norma"
        )
        .orderBy("n.id_norma", "desc")
        .paginate(page, 5)

      return normas;
    } catch (error) {
      return error;
    }
  }

  async getNorma({ request, response }) {
    try {
      const { id_norma } = request.all();
      const normas = await Normas.query()
        .select(
          "n.titulo",
          "es.nome as escala",
          "e.nome as eixo",
          "n.id_norma",
          "n.id_imagem",
          "n.id_arquivo",
          "tn.nome as tipo_norma"
        )
        .from("tedplan.normas as n")
        .innerJoin("tedplan.escala as es", "n.id_escala", "es.id_escala")
        .innerJoin("tedplan.eixos as e", "n.id_eixo", "e.id_eixo")
        .innerJoin(
          "tedplan.tipo_norma as tn",
          "n.id_tipo_norma",
          "tn.id_tipo_norma"
        )
        .where("id_norma", id_norma)
        .fetch();

      return normas;
    } catch (error) {
      return error;
    }
  }

  // async buscaPorFiltro({ request, response }) {
  //   const { titulo, id_eixo, id_escala, id_tipo_norma, page } = request.all();
  //   //console.log(id_escola);
  //   try {

  //     if (!id_escala && !id_eixo && !id_tipo_norma && !titulo) {
  //       const normas = await Normas.query()
  //         .select(
  //           "n.titulo",
  //           "es.nome as escala",
  //           "e.nome as eixo",
  //           "n.id_norma",
  //           "n.id_imagem",
  //           "n.id_arquivo",
  //           "tn.nome as tipo_norma"
  //         )
  //         .from("tedplan.normas as n")
  //         .innerJoin("tedplan.escala as es", "n.id_escala", "es.id_escala")
  //         .innerJoin("tedplan.eixos as e", "n.id_eixo", "e.id_eixo")
  //         .innerJoin(
  //           "tedplan.tipo_norma as tn",
  //           "n.id_tipo_norma",
  //           "tn.id_tipo_norma"
  //         )
  //         .orderBy("n.id_norma", "desc")
  //         .fetch();

  //       return normas;
  //     }

  //     if (id_escala && !id_eixo && !id_tipo_norma && !titulo) {
  //       const normas = await Normas.query()
  //         .select(
  //           "n.titulo",
  //           "es.nome as escala",
  //           "e.nome as eixo",
  //           "n.id_norma",
  //           "n.id_imagem",
  //           "n.id_arquivo",
  //           "tn.nome as tipo_norma"
  //         )
  //         .from("tedplan.normas as n")
  //         .innerJoin("tedplan.escala as es", "n.id_escala", "es.id_escala")
  //         .innerJoin("tedplan.eixos as e", "n.id_eixo", "e.id_eixo")
  //         .innerJoin(
  //           "tedplan.tipo_norma as tn",
  //           "n.id_tipo_norma",
  //           "tn.id_tipo_norma"
  //         )
  //         .orderBy("n.id_norma", "desc")
  //         .where("n.id_escala", id_escala)
  //         .fetch();

  //       return normas;
  //     }
  //     if (!id_escala && id_eixo && !id_tipo_norma && !titulo) {
  //       const normas = await Normas.query()
  //         .select(
  //           "n.titulo",
  //           "es.nome as escala",
  //           "e.nome as eixo",
  //           "n.id_norma",
  //           "n.id_imagem",
  //           "n.id_arquivo",
  //           "tn.nome as tipo_norma"
  //         )
  //         .from("tedplan.normas as n")
  //         .innerJoin("tedplan.escala as es", "n.id_escala", "es.id_escala")
  //         .innerJoin("tedplan.eixos as e", "n.id_eixo", "e.id_eixo")
  //         .innerJoin(
  //           "tedplan.tipo_norma as tn",
  //           "n.id_tipo_norma",
  //           "tn.id_tipo_norma"
  //         )
  //         .orderBy("n.id_norma", "desc")
  //         .where("e.id_eixo", id_eixo)
  //         .fetch();

  //       return normas;

  //     }
  //     if (!id_escala && !id_eixo && id_tipo_norma && !titulo) {
  //       const normas = await Normas.query()
  //         .select(
  //           "n.titulo",
  //           "es.nome as escala",
  //           "e.nome as eixo",
  //           "n.id_norma",
  //           "n.id_imagem",
  //           "n.id_arquivo",
  //           "tn.nome as tipo_norma"
  //         )
  //         .from("tedplan.normas as n")
  //         .innerJoin("tedplan.escala as es", "n.id_escala", "es.id_escala")
  //         .innerJoin("tedplan.eixos as e", "n.id_eixo", "e.id_eixo")
  //         .innerJoin(
  //           "tedplan.tipo_norma as tn",
  //           "n.id_tipo_norma",
  //           "tn.id_tipo_norma"
  //         )
  //         .orderBy("n.id_norma", "desc")
  //         .where("tn.id_tipo_norma", id_tipo_norma)
  //         .fetch();

  //       return normas;

  //     }
  //     if (!id_escala && !id_eixo && !id_tipo_norma && titulo) {
  //       const normas = await Normas.query()
  //         .select("n.titulo",
  //           "es.nome as escala",
  //           "e.nome as eixo",
  //           "n.id_norma",
  //           "n.id_imagem",
  //           "n.id_arquivo",
  //           "tn.nome as tipo_norma")
  //         .from("tedplan.normas as n")
  //         .innerJoin("tedplan.escala as es", "n.id_escala", "es.id_escala")
  //         .innerJoin("tedplan.eixos as e", "n.id_eixo", "e.id_eixo")
  //         .innerJoin(
  //           "tedplan.tipo_norma as tn",
  //           "n.id_tipo_norma",
  //           "tn.id_tipo_norma"
  //         )
  //         .orderBy("n.id_norma", "desc")
  //         .where("n.titulo", "ilike", "%" + titulo + "%")
  //         .fetch();

  //       return normas;
  //     }
  //     if (id_escala && id_eixo && !id_tipo_norma && !titulo) {
  //       const normas = await Normas.query()
  //         .select(
  //           "n.titulo",
  //           "es.nome as escala",
  //           "e.nome as eixo",
  //           "n.id_norma",
  //           "n.id_imagem",
  //           "n.id_arquivo",
  //           "tn.nome as tipo_norma"
  //         )
  //         .from("tedplan.normas as n")
  //         .innerJoin("tedplan.escala as es", "n.id_escala", "es.id_escala")
  //         .innerJoin("tedplan.eixos as e", "n.id_eixo", "e.id_eixo")
  //         .innerJoin(
  //           "tedplan.tipo_norma as tn",
  //           "n.id_tipo_norma",
  //           "tn.id_tipo_norma"
  //         )
  //         .orderBy("n.id_norma", "desc")
  //         .where("n.id_escala", id_escala)
  //         .where("e.id_eixo", id_eixo)
  //         .fetch();

  //       return normas;

  //     }
  //     if (id_escala && !id_eixo && id_tipo_norma && !titulo) {
  //       const normas = await Normas.query()
  //         .select(
  //           "n.titulo",
  //           "es.nome as escala",
  //           "e.nome as eixo",
  //           "n.id_norma",
  //           "n.id_imagem",
  //           "n.id_arquivo",
  //           "tn.nome as tipo_norma"
  //         )
  //         .from("tedplan.normas as n")
  //         .innerJoin("tedplan.escala as es", "n.id_escala", "es.id_escala")
  //         .innerJoin("tedplan.eixos as e", "n.id_eixo", "e.id_eixo")
  //         .innerJoin(
  //           "tedplan.tipo_norma as tn",
  //           "n.id_tipo_norma",
  //           "tn.id_tipo_norma"
  //         )
  //         .orderBy("n.id_norma", "desc")
  //         .where("n.id_escala", id_escala)
  //         .where("tn.id_tipo_norma", id_tipo_norma)
  //         .fetch();

  //       return normas;

  //     }
  //     if (id_escala && !id_eixo && !id_tipo_norma && titulo) {
  //       const normas = await Normas.query()
  //         .select("n.titulo",
  //           "es.nome as escala",
  //           "e.nome as eixo",
  //           "n.id_norma",
  //           "n.id_imagem",
  //           "n.id_arquivo",
  //           "tn.nome as tipo_norma")
  //         .from("tedplan.normas as n")
  //         .innerJoin("tedplan.escala as es", "n.id_escala", "es.id_escala")
  //         .innerJoin("tedplan.eixos as e", "n.id_eixo", "e.id_eixo")
  //         .innerJoin(
  //           "tedplan.tipo_norma as tn",
  //           "n.id_tipo_norma",
  //           "tn.id_tipo_norma"
  //         )
  //         .orderBy("n.id_norma", "desc")
  //         .where("n.titulo", "ilike", "%" + titulo + "%")
  //         .where("es.id_escala", id_escala)
  //         .fetch();

  //       return normas;
  //     }
  //     if (!id_escala && id_eixo && id_tipo_norma && !titulo) {
  //       const normas = await Normas.query()
  //         .select(
  //           "n.titulo",
  //           "es.nome as escala",
  //           "e.nome as eixo",
  //           "n.id_norma",
  //           "n.id_imagem",
  //           "n.id_arquivo",
  //           "tn.nome as tipo_norma"
  //         )
  //         .from("tedplan.normas as n")
  //         .innerJoin("tedplan.escala as es", "n.id_escala", "es.id_escala")
  //         .innerJoin("tedplan.eixos as e", "n.id_eixo", "e.id_eixo")
  //         .innerJoin(
  //           "tedplan.tipo_norma as tn",
  //           "n.id_tipo_norma",
  //           "tn.id_tipo_norma"
  //         )
  //         .orderBy("n.id_norma", "desc")
  //         .where("e.id_eixo", id_eixo)
  //         .where("tn.id_tipo_norma", id_tipo_norma)
  //         .fetch();

  //       return normas;

  //     }
  //     if (!id_escala && id_eixo && !id_tipo_norma && titulo) {
  //       const normas = await Normas.query()
  //         .select("n.titulo",
  //           "es.nome as escala",
  //           "e.nome as eixo",
  //           "n.id_norma",
  //           "n.id_imagem",
  //           "n.id_arquivo",
  //           "tn.nome as tipo_norma")
  //         .from("tedplan.normas as n")
  //         .innerJoin("tedplan.escala as es", "n.id_escala", "es.id_escala")
  //         .innerJoin("tedplan.eixos as e", "n.id_eixo", "e.id_eixo")
  //         .innerJoin(
  //           "tedplan.tipo_norma as tn",
  //           "n.id_tipo_norma",
  //           "tn.id_tipo_norma"
  //         )
  //         .orderBy("n.id_norma", "desc")
  //         .where("n.titulo", "ilike", "%" + titulo + "%")
  //         .where("e.id_eixo", id_eixo)
  //         .fetch();

  //       return normas;
  //     }
  //     if (!id_escala && !id_eixo && id_tipo_norma && titulo) {
  //       const normas = await Normas.query()
  //         .select("n.titulo",
  //           "es.nome as escala",
  //           "e.nome as eixo",
  //           "n.id_norma",
  //           "n.id_imagem",
  //           "n.id_arquivo",
  //           "tn.nome as tipo_norma")
  //         .from("tedplan.normas as n")
  //         .innerJoin("tedplan.escala as es", "n.id_escala", "es.id_escala")
  //         .innerJoin("tedplan.eixos as e", "n.id_eixo", "e.id_eixo")
  //         .innerJoin(
  //           "tedplan.tipo_norma as tn",
  //           "n.id_tipo_norma",
  //           "tn.id_tipo_norma"
  //         )
  //         .orderBy("n.id_norma", "desc")
  //         .where("n.titulo", "ilike", "%" + titulo + "%")
  //         .where("tn.id_tipo_norma", id_tipo_norma)
  //         .fetch();

  //       return normas;
  //     }
  //     if (id_escala && id_eixo && id_tipo_norma && !titulo) {
  //       const normas = await Normas.query()
  //         .select(
  //           "n.titulo",
  //           "es.nome as escala",
  //           "e.nome as eixo",
  //           "n.id_norma",
  //           "n.id_imagem",
  //           "n.id_arquivo",
  //           "tn.nome as tipo_norma"
  //         )
  //         .from("tedplan.normas as n")
  //         .innerJoin("tedplan.escala as es", "n.id_escala", "es.id_escala")
  //         .innerJoin("tedplan.eixos as e", "n.id_eixo", "e.id_eixo")
  //         .innerJoin(
  //           "tedplan.tipo_norma as tn",
  //           "n.id_tipo_norma",
  //           "tn.id_tipo_norma"
  //         )
  //         .orderBy("n.id_norma", "desc")
  //         .where("es.id_escala", id_escala)
  //         .where("tn.id_tipo_norma", id_tipo_norma)
  //         .where("e.id_eixo", id_eixo)
  //         .fetch();

  //       return normas;

  //     }
  //     if (!id_escala && id_eixo && id_tipo_norma && titulo) {
  //       const normas = await Normas.query()
  //         .select("n.titulo",
  //           "es.nome as escala",
  //           "e.nome as eixo",
  //           "n.id_norma",
  //           "n.id_imagem",
  //           "n.id_arquivo",
  //           "tn.nome as tipo_norma")
  //         .from("tedplan.normas as n")
  //         .innerJoin("tedplan.escala as es", "n.id_escala", "es.id_escala")
  //         .innerJoin("tedplan.eixos as e", "n.id_eixo", "e.id_eixo")
  //         .innerJoin(
  //           "tedplan.tipo_norma as tn",
  //           "n.id_tipo_norma",
  //           "tn.id_tipo_norma"
  //         )
  //         .orderBy("n.id_norma", "desc")
  //         .where("p.titulo", "ilike", "%" + titulo + "%")
  //         .where("tn.id_tipo_norma", id_tipo_norma)
  //         .where("e.id_eixo", id_eixo)
  //         .fetch();

  //       return normas;
  //     }
  //     if (id_escala && !id_eixo && id_tipo_norma && titulo) {
  //       const normas = await Normas.query()
  //         .select("n.titulo",
  //           "es.nome as escala",
  //           "e.nome as eixo",
  //           "n.id_norma",
  //           "n.id_imagem",
  //           "n.id_arquivo",
  //           "tn.nome as tipo_norma")
  //         .from("tedplan.normas as n")
  //         .innerJoin("tedplan.escala as es", "n.id_escala", "es.id_escala")
  //         .innerJoin("tedplan.eixos as e", "n.id_eixo", "e.id_eixo")
  //         .innerJoin(
  //           "tedplan.tipo_norma as tn",
  //           "n.id_tipo_norma",
  //           "tn.id_tipo_norma"
  //         )
  //         .orderBy("n.id_norma", "desc")
  //         .where("p.titulo", "ilike", "%" + titulo + "%")
  //         .where("tn.id_tipo_norma", id_tipo_norma)
  //         .where("es.id_escala", id_escala)
  //         .fetch();

  //       return normas;
  //     }
  //     if (id_escala && id_eixo && !id_tipo_norma && titulo) {
  //       const normas = await Normas.query()
  //         .select("n.titulo",
  //           "es.nome as escala",
  //           "e.nome as eixo",
  //           "n.id_norma",
  //           "n.id_imagem",
  //           "n.id_arquivo",
  //           "tn.nome as tipo_norma")
  //         .from("tedplan.normas as n")
  //         .innerJoin("tedplan.escala as es", "n.id_escala", "es.id_escala")
  //         .innerJoin("tedplan.eixos as e", "n.id_eixo", "e.id_eixo")
  //         .innerJoin(
  //           "tedplan.tipo_norma as tn",
  //           "n.id_tipo_norma",
  //           "tn.id_tipo_norma"
  //         )
  //         .orderBy("n.id_norma", "desc")
  //         .where("p.titulo", "ilike", "%" + titulo + "%")
  //         .where("e.id_eixo", id_eixo)
  //         .where("es.id_escala", id_escala)
  //         .fetch();

  //       return normas;
  //     }
  //     if (id_escala && id_eixo && id_tipo_norma && titulo) {
  //       const normas = await Normas.query()
  //         .select("n.titulo",
  //           "es.nome as escala",
  //           "e.nome as eixo",
  //           "n.id_norma",
  //           "n.id_imagem",
  //           "n.id_arquivo",
  //           "tn.nome as tipo_norma")
  //         .from("tedplan.normas as n")
  //         .innerJoin("tedplan.escala as es", "n.id_escala", "es.id_escala")
  //         .innerJoin("tedplan.eixos as e", "n.id_eixo", "e.id_eixo")
  //         .innerJoin(
  //           "tedplan.tipo_norma as tn",
  //           "n.id_tipo_norma",
  //           "tn.id_tipo_norma"
  //         )
  //         .orderBy("n.id_norma", "desc")
  //         .where("p.titulo", "ilike", "%" + titulo + "%")
  //         .where("e.id_eixo", id_eixo)
  //         .where("tn.id_tipo_norma", id_tipo_norma)
  //         .where("es.id_escala", id_escala)
  //         .fetch();

  //       return normas;
  //     }

  //     const normas = await Normas.query()
  //       .select("n.titulo",
  //         "es.nome as escala",
  //         "e.nome as eixo",
  //         "n.id_norma",
  //         "n.id_imagem",
  //         "n.id_arquivo",
  //         "tn.nome as tipo_norma")
  //       .from("tedplan.normas as n")
  //       .innerJoin("tedplan.escala as es", "n.id_escala", "es.id_escala")
  //       .innerJoin("tedplan.eixos as e", "n.id_eixo", "e.id_eixo")
  //       .innerJoin(
  //         "tedplan.tipo_norma as tn",
  //         "n.id_tipo_norma",
  //         "tn.id_tipo_norma"
  //       )
  //       .where(where)
  //       .fetch();

  //     return normas;
  //   } catch (error) {
  //     console.log(error);
  //     return error;
  //   }
  // }
  async buscaPorFiltro({ request, response }) {
    const { titulo, id_eixo, id_escala, id_tipo_norma, page } = request.all();

    try {
      let query = Normas.query()
        .select(
          "n.titulo",
          "es.nome as escala",
          "e.nome as eixo",
          "n.id_norma",
          "n.id_imagem",
          "n.id_arquivo",
          "tn.nome as tipo_norma"
        )
        .from("tedplan.normas as n")
        .innerJoin("tedplan.escala as es", "n.id_escala", "es.id_escala")
        .innerJoin("tedplan.eixos as e", "n.id_eixo", "e.id_eixo")
        .innerJoin(
          "tedplan.tipo_norma as tn",
          "n.id_tipo_norma",
          "tn.id_tipo_norma"
        )
        .orderBy("n.id_norma", "desc");

      // Aplicar filtros condicionalmente
      if (id_escala) {
        query = query.where("n.id_escala", id_escala);
      }
      if (id_eixo) {
        query = query.where("e.id_eixo", id_eixo);
      }
      if (id_tipo_norma) {
        query = query.where("tn.id_tipo_norma", id_tipo_norma);
      }
      if (titulo) {
        query = query.where("n.titulo", "ilike", `%${titulo}%`);
      }

      // Executar a query com paginação
      const normas = await query.paginate(page, 5); // Assumindo 10 itens por página

      return normas;

    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async store({ request, response }) {
    try {
      const { titulo, id_eixo, id_escala, id_tipo_norma } = request.all();

      if (!request.file("arquivo") || !request.file("imagem")) {
        throw response
          .status(401)
          .send({ error: "Os arquivos são obrigatórios!" });
      }

      const upload_file = request.file("arquivo", { size: "100mb" });
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

      const norma = await Normas.query().from("tedplan.normas").insert({
        titulo: titulo,
        id_eixo: id_eixo,
        id_tipo_norma: id_tipo_norma,
        id_escala: id_escala,
        id_arquivo: file.id,
        id_imagem: imagem.id,
      });

      return norma;
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
    } catch (error) { }
  }

  async update({ request, response }) {
    try {
      const { id_norma, id_arquivo, titulo } = request.all();
      if (request.file("arquivo")) {
        const upload = request.file("arquivo", { size: "2mb" });
        const fileName = `${Date.now()}.${upload.subtype}`;
        await upload.move(Helpers.tmpPath("uploads"), {
          name: fileName,
        });

        if (!upload.moved()) {
          throw upload.error;
        }

        const file = await File.create({
          file: fileName,
          name: upload.clientName,
          type: upload.type,
          subtype: upload.subtype,
        });

        const arquivoAnterior = await File.findBy("id", id_arquivo);
        if (arquivoAnterior) {
          Fs.unlinkSync(Helpers.tmpPath(`uploads/${arquivoAnterior.file}`));
          arquivoAnterior.delete();
        }

        const norm = await Normas.query()
          .from("tedplan.normas as n")
          .where("n.id_norma", id_norma)
          .update({ id_arquivo: file.id });
      }
      const norma = await Normas.query()
        .from("tedplan.normas as n")
        .where("n.id_norma", id_norma)
        .update({ titulo: titulo });

      return norma;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async updateImagem({ request, response }) {
    try {
      const { id_norma, id_imagem } = request.all();

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

      const resNorma = await Normas.query()
        .from("tedplan.normas")
        .where("id_norma", id_norma)
        .update({ id_imagem: imagem.id });

      return resNorma;
    } catch (error) {
      console.log(error);
    }
  }

  async destroy({ request, response }) {
    try {
      const { id_norma, id_imagem, id_arquivo } = request.all();

      const idDelete = await Normas.query()
        .table("tedplan.normas")
        .where("id_norma", id_norma)
        .delete();

      if (id_imagem) {
        const imagem = await Imagem.findBy("id", id_imagem);
        if (imagem) {
          Fs.unlinkSync(Helpers.tmpPath(`uploads/${imagem.file}`));
          imagem.delete();
        }
      }

      if (id_arquivo) {
        const file = await File.findBy("id", id_arquivo);
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

  async listTipoNormas({ response }) {
    try {
      const normas = await Normas.query().from("tedplan.tipo_norma").fetch();

      return normas;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = NormaController;
