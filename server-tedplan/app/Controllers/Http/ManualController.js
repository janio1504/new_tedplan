'use strict'
const Manual = use('App/Models/Concessionaria')
const File = use("App/Models/File");
const Helpers = use("Helpers");
const Fs = use("fs");
const Imagem = use("App/Models/Imagem");

class ManualController {
  async index ({ response, request }) {
    const { id_manual } = request.all()
   try {
    const manuais = await Manual.query()
    .from('tedplan.manuais')
    .fetch()

      return manuais
   } catch (error) {
    console.log(error);
   }
  }


  async getManual ({ request }) {
    const { id_manual } = request.all()
   try {
    const manuais = await Manual.query()
    .from('tedplan.manuais')
    .where('id_manual', id_manual)
    .fetch()

      return manuais
   } catch (error) {
    console.log(error);
   }
  }


  async store({request}){
      try {

    const { nome, data_cadastro } = request.all()
    if (!request.file("file")) {
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
    const res = await Manual.query()
    .from('tedplan.manuais')
    .insert({
      nome: nome,
      data_cadastro: data_cadastro,
      id_arquivo: file.id
    })
      } catch (error) {
        console.log(error);
      }
  }

  async update({ request, response }) {
    try {
      const { id_manual, id_arquivo, titulo } = request.all();
      if (request.file("arquivo")) {
        const upload = request.file("arquivo", { size: "10mb" });
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

        await Manual.query()
          .from("tedplan.manuais as m")
          .where("m.id_manual", id_manual)
          .update({ id_arquivo: file.id });
      }
      const manual = await Manual.query()
        .from("tedplan.manuais as m")
        .where("m.id_manual", id_manual)
        .update({ nome: titulo });

      return manual;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async updateImagem({ request, response }) {
    try {
      const { id_manual, id_imagem } = request.all();

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

      const rs = await Manual.query()
        .from("tedplan.manuais")
        .where("id_manual", id_manual)
        .update({ id_imagem: imagem.id });

      return rs;
    } catch (error) {
      console.log(error);
    }
  }

  async destroy({ request }) {
    
    try {
      const { id_manual, id_arquivo } = request.all();
      
      const idDelete = await Manual.query()
        .table("tedplan.manuais")
        .where("id_manual", id_manual)
        .delete();

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
}



module.exports = ManualController
