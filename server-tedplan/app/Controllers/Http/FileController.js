"use strict";

const File = use("App/Models/File");
const Imagem = use("App/Models/Imagem");
const Helpers = use("Helpers");
const CustomException = use("App/Exceptions/CustomException");
const Fs = use("fs");
class FileController {
  async showFile({ request, response }) {
    try {
      const { id } = request.all();
      console.log(id);
      if (id) {
        const file = await File.findOrFail(id);

        return response.download(Helpers.tmpPath(`uploads/${file.file}`));
      }
    } catch (error) {
      console.log(error);
      return new CustomException().handle(error, { response });
    }
  }

  async showImagem({ request, response }) {
    const { id } = request.all();

    try {
      if (id) {
        const imagem = await Imagem.findOrFail(id);
        return response.download(Helpers.tmpPath(`uploads/${imagem.file}`));
      }
    } catch (error) {
      return new CustomException().handle(error, { response });
    }
  }

  async show({ request, response }) {
    const { id, id_galeria } = request.all();

    try {
      if (id_galeria) {
        const imagens = await Imagem.query()
          .from("tedplan.imagens")
          .where("id_galeria", id_galeria)
          .fetch();
        /*
        const imagem = imagens.toJSON().map((value) => {
          return response.download(Helpers.tmpPath(`uploads/${value.file}`));
        });
        */
        return imagens.toJSON();
      }
    } catch (error) {
      return new CustomException().handle(error, { response });
    }
  }

  async store({ request, response, auth }) {
    try {
      const { id_usuario } = request.all();
      if (!request.file("file")) return;

      const upload = request.file("file", { size: "2mb" });
      const fileName = `${Date.now()}.${upload.subtype}`;
      await upload.move(Helpers.tmpPath("uploads"), {
        name: fileName,
      });

      if (!upload.moved()) {
        throw upload.error;
      }

      //this.destroy({ id_usuario })

      const file = await File.create({
        id_usuario: id_usuario,
        file: fileName,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype,
      });

      return file;
    } catch (error) {
      return new CustomException().handle(error, { response });
    }
  }

  async destroy({ request, response }) {
    try {
      const { id_arquivo } = request.all();

      const file = await File.findBy("id", id_arquivo);
      if (file) {
        Fs.unlinkSync(Helpers.tmpPath(`uploads/${file.file}`));
        file.delete();
      }
    } catch (error) {
      return new CustomException().handle(error, { response });
    }
  }

  async destroyImagem({ request, response }) {
    try {
      const { id_imagem } = request.all();

      const file = await Imagem.findBy("id", id_imagem);
      if (file) {
        Fs.unlinkSync(Helpers.tmpPath(`uploads/${file.file}`));
        file.delete();
      }
    } catch (error) {
      return new CustomException().handle(error, { response });
    }
  }

  async updateImagem({ request, response }) {}
}

module.exports = FileController;
