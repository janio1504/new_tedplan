'use strict'
const Manual = use('App/Models/Concessionaria')
const File = use("App/Models/File");
const Helpers = use("Helpers");

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
}

module.exports = ManualController
