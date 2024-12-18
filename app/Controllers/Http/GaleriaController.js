"use strict";

const Galeria = use("App/Models/Galeria");
const Imagem = use("App/Models/Imagem");
const Helpers = use("Helpers");
const CustomException = use("App/Exceptions/CustomException");

class GaleriaController {
  async index() {
    const galeria = await Galeria.query().from("tedplan.galeria").fetch();

    return galeria;
  }

  async getGaleriaPorFiltro({ request }){
    const { id_municipio, id_eixo, titulo } = request.all()

    if(id_municipio && !id_eixo && !titulo){
      const res = await Galeria.query()
      .from("tedplan.galeria as g")
      .where("g.id_municipio", id_municipio)
      .fetch()
      return res
    }
    if(!id_municipio && id_eixo && !titulo){
      const res = await Galeria.query()
      .from("tedplan.galeria as g")
      .where("g.id_eixo", id_eixo)
      .fetch()
      return res
    }
    if(!id_municipio && !id_eixo && titulo){
      const res = await Galeria.query()
      .from("tedplan.galeria as g")
      .where("g.titulo","ilike","%" + titulo + "%")
      .fetch()
      return res
    }

    if(id_municipio && id_eixo && !titulo){
      const res = await Galeria.query()
      .from("tedplan.galeria as g")
      .where("g.id_municipio", id_municipio)
      .where("g.id_eixo", id_eixo)
      .fetch()
      return res
    }
    if(id_municipio && !id_eixo && titulo){
      const res = await Galeria.query()
      .from("tedplan.galeria as g")
      .where("g.id_municipio", id_municipio)
      .where("g.titulo","ilike","%" + titulo + "%")
      .fetch()
      return res
    }
    if(!id_municipio && id_eixo && titulo){
      const res = await Galeria.query()
      .from("tedplan.galeria as g")
      .where("g.titulo","ilike","%" + titulo + "%")
      .where("g.id_eixo", id_eixo)
      .fetch()
      return res
    }
  }

  async imagensGaleria({ request, response }) {
    const { id_galeria } = request.all();
    const imagens = await Galeria.query()
      .from("tedplan.imagens")
      .where("id_galeria", id_galeria)
      .fetch();

    return imagens;
  }

  async store({ request, response }) {
    try {
      const { titulo, descricao, mes, ano, id_municipio, id_eixo } =
        request.all();

      if (!request.file("imagem")) {
        throw response.status(401).send({ error: "Acesso não autorizado!" });
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

      const galeria = await Galeria.create({
        titulo: titulo,
        descricao: descricao,
        mes: mes,
        ano: ano,
        id_imagem: imagem.id,
        id_municipio: id_municipio,
        id_eixo: id_eixo,
      });
      console.log(galeria);
      return galeria;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async storeImagens({ request, response }) {
    try {
      const { id_galeria } = request.all();
      const imagens = request.files("imagem");

      if (Array.isArray(imagens.imagem)) {
        const resImagens = new Promise((resolve, reject) => {
          const resImgs = imagens.imagem.map(async (upload_imagem, index) => {
            const imagemName = `${Date.now()}.${upload_imagem.subtype}`;
            await upload_imagem.move(Helpers.tmpPath("uploads"), {
              name: imagemName,
            });

            if (upload_imagem.moved()) {
              const res = await Imagem.query().from("tedplan.imagens").insert({
                file: imagemName,
                name: upload_imagem.clientName,
                type: upload_imagem.type,
                subtype: upload_imagem.subtype,
                id_galeria: id_galeria,
              });

              resolve(res);
            } else {
              reject(upload_imagem.error);
            }
          });
          return resImgs;
        });
        return resImagens;
      } else {
        const upload_imagem = request.file("imagem", { size: "10mb" });
        const imagemName = `${Date.now()}.${upload_imagem.subtype}`;
        await upload_imagem.move(Helpers.tmpPath("uploads"), {
          name: imagemName,
        });

        if (!upload_imagem.moved()) {
          throw upload_imagem.error;
        }

        const imagem = await Imagem.query().from("tedplan.imagens").insert({
          file: imagemName,
          name: upload_imagem.clientName,
          type: upload_imagem.type,
          subtype: upload_imagem.subtype,
          id_galeria: id_galeria,
        });

        return imagem;
      }
    } catch (error) {
      console.log(error);
      return error; //response.status(401).send(error);
    }
  }

  async destroy({ request, response }) {
    try {
      const { id_galeria, id_imagem } = request.all();
      const idDelete = await Galeria.query()
        .table("tedplan.galeria")
        .where("id_galeria", id_galeria)
        .delete();

      if (id_imagem) {
        const file = await Imagem.findBy("id", id_imagem);
        if (file) {
          Fs.unlinkSync(Helpers.tmpPath(`uploads/${file.file}`));
          file.delete();
        }
      }
      return idDelete;
    } catch (error) {}
  }
}

module.exports = GaleriaController;
