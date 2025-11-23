"use strict";

const Galeria = use("App/Models/Galeria");
const Imagem = use("App/Models/Imagem");
const Helpers = use("Helpers");
const CustomException = use("App/Exceptions/CustomException");

class GaleriaController {
  async index() {
    const galeria = await Galeria.query().from("tedplan.galeria").fetch();

    // Converter a coleção do Lucid para array JSON
    return galeria.toJSON();
  }

  async getGaleriaPorFiltro({ request }){
    const { id_municipio, id_eixo, titulo } = request.all()

    if(id_municipio && !id_eixo && !titulo){
      const res = await Galeria.query()
      .from("tedplan.galeria as g")
      .where("g.id_municipio", id_municipio)
      .fetch()
      return res.toJSON()
    }
    if(!id_municipio && id_eixo && !titulo){
      const res = await Galeria.query()
      .from("tedplan.galeria as g")
      .where("g.id_eixo", id_eixo)
      .fetch()
      return res.toJSON()
    }
    if(!id_municipio && !id_eixo && titulo){
      const res = await Galeria.query()
      .from("tedplan.galeria as g")
      .where("g.titulo","ilike","%" + titulo + "%")
      .fetch()
      return res.toJSON()
    }

    if(id_municipio && id_eixo && !titulo){
      const res = await Galeria.query()
      .from("tedplan.galeria as g")
      .where("g.id_municipio", id_municipio)
      .where("g.id_eixo", id_eixo)
      .fetch()
      return res.toJSON()
    }
    if(id_municipio && !id_eixo && titulo){
      const res = await Galeria.query()
      .from("tedplan.galeria as g")
      .where("g.id_municipio", id_municipio)
      .where("g.titulo","ilike","%" + titulo + "%")
      .fetch()
      return res.toJSON()
    }
    if(!id_municipio && id_eixo && titulo){
      const res = await Galeria.query()
      .from("tedplan.galeria as g")
      .where("g.titulo","ilike","%" + titulo + "%")
      .where("g.id_eixo", id_eixo)
      .fetch()
      return res.toJSON()
    }

    // Caso todos os filtros estejam preenchidos
    if(id_municipio && id_eixo && titulo){
      const res = await Galeria.query()
      .from("tedplan.galeria as g")
      .where("g.id_municipio", id_municipio)
      .where("g.id_eixo", id_eixo)
      .where("g.titulo","ilike","%" + titulo + "%")
      .fetch()
      return res.toJSON()
    }

    // Caso nenhum filtro esteja preenchido, retornar todas as galerias
    const res = await Galeria.query().from("tedplan.galeria").fetch()
    return res.toJSON()
  }

  async imagensGaleria({ request, response }) {
    const { id_galeria } = request.all();
    const imagens = await Imagem.query()
      .from("tedplan.imagens")
      .where("id_galeria", id_galeria)
      .fetch();

    return imagens.toJSON();
  }

  async store({ request, response }) {
    try {
      const { titulo, descricao, mes, ano, id_municipio, id_eixo } =
        request.all();

      if (!request.file("imagem")) {
        return response.status(400).send({
          success: false,
          message: "Imagem é obrigatória",
        });
      }

      const upload_imagem = request.file("imagem", { size: "10mb" });
      const imagemName = `${Date.now()}.${upload_imagem.subtype}`;
      await upload_imagem.move(Helpers.tmpPath("uploads"), {
        name: imagemName,
      });

      if (!upload_imagem.moved()) {
        const errorMsg = upload_imagem.error();
        return response.status(400).send({
          success: false,
          message: errorMsg ? (errorMsg.message || errorMsg) : "Erro ao fazer upload da imagem",
        });
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

      return response.status(200).send({
        success: true,
        message: "Galeria cadastrada com sucesso",
        data: galeria,
      });
    } catch (error) {
      console.error("Erro ao cadastrar galeria:", error);
      return response.status(500).send({
        success: false,
        message: "Erro ao cadastrar galeria",
        error: error.message || error.toString() || "Erro desconhecido",
      });
    }
  }

  async storeImagens({ request, response }) {
    try {
      const { id_galeria } = request.all();

      if (!id_galeria) {
        return response.status(400).send({
          success: false,
          message: "ID da galeria é obrigatório",
        });
      }

      const imagens = request.files("imagem");

      // Validar se há imagens
      if (!imagens) {
        return response.status(400).send({
          success: false,
          message: "Nenhuma imagem foi enviada",
        });
      }

      // No AdonisJS, request.files("imagem") pode retornar diferentes estruturas:
      // 1. Um array de arquivos (quando múltiplos arquivos)
      // 2. Um objeto com propriedade 'imagem' contendo um array ou arquivo único
      // 3. Um único arquivo
      let imagensArray = [];

      if (Array.isArray(imagens)) {
        // Caso 1: Já é um array direto
        imagensArray = imagens;
      } else if (imagens && imagens.imagem) {
        // Caso 2: Objeto com propriedade 'imagem'
        if (Array.isArray(imagens.imagem)) {
          imagensArray = imagens.imagem;
        } else {
          // Pode ser um único arquivo ou um objeto com mais arquivos
          // Verificar se imagens.imagem tem o método move (é um arquivo)
          if (typeof imagens.imagem.move === 'function') {
            imagensArray = [imagens.imagem];
          } else {
            // Pode ser um objeto com mais propriedades
            const subKeys = Object.keys(imagens.imagem);
            imagensArray = subKeys.map(key => imagens.imagem[key]).filter(item => item && typeof item.move === 'function');
          }
        }
      } else if (imagens) {
        // Caso 3: Verificar se é um arquivo único ou objeto com arquivos
        if (typeof imagens.move === 'function') {
          // É um arquivo único
          imagensArray = [imagens];
        } else {
          // Tentar iterar sobre as propriedades do objeto
          const keys = Object.keys(imagens);
          imagensArray = keys
            .map(key => imagens[key])
            .filter(item => item && typeof item.move === 'function');
        }
      }

      // Filtrar apenas imagens não-null (a validação real será feita ao tentar mover)
      const imagensValidas = imagensArray.filter((img) => {
        return img && typeof img.move === 'function';
      });

      if (imagensValidas.length === 0) {
        return response.status(400).send({
          success: false,
          message: "Nenhuma imagem válida foi enviada. Verifique se os arquivos são imagens válidas.",
        });
      }

      // Validar limite de 10 imagens
      if (imagensValidas.length > 10) {
        return response.status(400).send({
          success: false,
          message: "Máximo de 10 imagens permitidas",
        });
      }

      // Processar todas as imagens usando Promise.allSettled para não parar em caso de erro
      const resultados = await Promise.allSettled(
        imagensValidas.map(async (upload_imagem, index) => {
          try {
            // Validar se o arquivo existe
            if (!upload_imagem) {
              throw new Error(`Imagem ${index + 1} não encontrada ou inválida`);
            }

            // Obter subtype/extname (pode estar em diferentes propriedades)
            const subtype = upload_imagem.subtype ||
                           upload_imagem.extname ||
                           (upload_imagem.clientName ? upload_imagem.clientName.split('.').pop() : null) ||
                           (upload_imagem.name ? upload_imagem.name.split('.').pop() : null) ||
                           'jpg'; // fallback

            if (!subtype) {
              throw new Error(`Imagem ${index + 1} não possui tipo válido`);
            }

            // Gerar nome único para cada imagem usando timestamp + índice + random
            const timestamp = Date.now();
            const randomSuffix = Math.floor(Math.random() * 10000);
            const imagemName = `${timestamp}_${index}_${randomSuffix}.${subtype}`;

            // Mover arquivo para o diretório de uploads
            await upload_imagem.move(Helpers.tmpPath("uploads"), {
              name: imagemName,
            });

            if (!upload_imagem.moved()) {
              const errorMsg = upload_imagem.error();
              const errorDetails = errorMsg ? (errorMsg.message || errorMsg.toString() || JSON.stringify(errorMsg)) : "Erro desconhecido ao mover arquivo";
              throw new Error(`Erro ao mover arquivo: ${errorDetails}`);
            }

            // Obter nome do arquivo original
            const fileName = upload_imagem.clientName || upload_imagem.name || imagemName;

            // Inserir no banco de dados
            const res = await Imagem.query().from("tedplan.imagens").insert({
              file: imagemName,
              name: fileName,
              type: upload_imagem.type || "image",
              subtype: subtype,
              id_galeria: id_galeria,
            });

            return { success: true, data: res, index: index + 1 };
          } catch (error) {
            console.error(`Erro ao processar imagem ${index + 1}:`, error);
            return {
              success: false,
              index: index + 1,
              error: error.message || error.toString() || "Erro desconhecido",
            };
          }
        })
      );

      // Separar sucessos e erros
      const sucessos = resultados.filter(r => r.status === "fulfilled" && r.value && r.value.success);
      const erros = resultados.filter(r => r.status === "rejected" || (r.status === "fulfilled" && (!r.value || !r.value.success)));

      // Se nenhuma imagem foi processada com sucesso
      if (sucessos.length === 0) {
        const errorDetails = erros.map((e, idx) => {
          if (e.status === "rejected") {
            return {
              imagem: idx + 1,
              erro: e.reason?.message || e.reason?.toString() || JSON.stringify(e.reason) || "Erro desconhecido",
            };
          } else {
            return {
              imagem: e.value?.index || idx + 1,
              erro: e.value?.error || "Erro desconhecido",
            };
          }
        });

        return response.status(400).send({
          success: false,
          message: "Nenhuma imagem foi processada com sucesso",
          errors: errorDetails,
          totalEnviadas: imagensValidas.length,
        });
      }

      // Retornar resultado
      const mensagem = sucessos.length === imagensValidas.length
        ? `${sucessos.length} ${sucessos.length === 1 ? "imagem adicionada" : "imagens adicionadas"} com sucesso`
        : `${sucessos.length} de ${imagensValidas.length} ${imagensValidas.length === 1 ? "imagem adicionada" : "imagens adicionadas"} com sucesso`;

      return response.status(200).send({
        success: true,
        message: mensagem,
        data: sucessos.map(s => s.value.data),
        warnings: erros.length > 0 ? `${erros.length} ${erros.length === 1 ? "imagem falhou" : "imagens falharam"}` : null,
      });
    } catch (error) {
      console.error("Erro ao adicionar imagens:", error);
      return response.status(500).send({
        success: false,
        message: "Erro ao adicionar imagens",
        error: error.message || error.toString() || "Erro desconhecido",
      });
    }
  }

  async show({ params, response }) {
    try {
      const { id } = params;
      const galeria = await Galeria.query()
        .from("tedplan.galeria")
        .where("id_galeria", id)
        .first();

      if (!galeria) {
        return response.status(404).send({
          success: false,
          message: "Galeria não encontrada",
        });
      }

      return response.status(200).send({
        success: true,
        data: galeria.toJSON ? galeria.toJSON() : galeria,
      });
    } catch (error) {
      console.error("Erro ao buscar galeria:", error);
      return response.status(500).send({
        success: false,
        message: "Erro ao buscar galeria",
        error: error.message || error.toString() || "Erro desconhecido",
      });
    }
  }

  async update({ params, request, response }) {
    try {
      const { id } = params;
      const { titulo, descricao, mes, ano, id_municipio, id_eixo } = request.all();

      const galeria = await Galeria.findBy("id_galeria", id);

      if (!galeria) {
        return response.status(404).send({
          success: false,
          message: "Galeria não encontrada",
        });
      }

      // Se uma nova imagem foi enviada
      if (request.file("imagem")) {
        const upload_imagem = request.file("imagem", { size: "10mb" });
        const imagemName = `${Date.now()}.${upload_imagem.subtype}`;

        await upload_imagem.move(Helpers.tmpPath("uploads"), {
          name: imagemName,
        });

        if (!upload_imagem.moved()) {
          const errorMsg = upload_imagem.error();
          return response.status(400).send({
            success: false,
            message: errorMsg ? (errorMsg.message || errorMsg) : "Erro ao fazer upload da imagem",
          });
        }

        // Deletar imagem antiga se existir
        if (galeria.id_imagem) {
          try {
            const imagemAntiga = await Imagem.findBy("id", galeria.id_imagem);
            if (imagemAntiga) {
              const filePath = Helpers.tmpPath(`uploads/${imagemAntiga.file}`);
              if (Fs.existsSync(filePath)) {
                Fs.unlinkSync(filePath);
              }
              await imagemAntiga.delete();
            }
          } catch (error) {
            console.error("Erro ao deletar imagem antiga:", error);
          }
        }

        // Criar nova imagem
        const novaImagem = await Imagem.create({
          file: imagemName,
          name: upload_imagem.clientName,
          type: upload_imagem.type,
          subtype: upload_imagem.subtype,
        });

        galeria.id_imagem = novaImagem.id;
      }

      // Atualizar dados da galeria
      galeria.titulo = titulo || galeria.titulo;
      galeria.descricao = descricao !== undefined ? descricao : galeria.descricao;
      galeria.mes = mes || galeria.mes;
      galeria.ano = ano || galeria.ano;
      galeria.id_municipio = id_municipio || galeria.id_municipio;
      galeria.id_eixo = id_eixo || galeria.id_eixo;

      await galeria.save();

      return response.status(200).send({
        success: true,
        message: "Galeria atualizada com sucesso",
        data: galeria,
      });
    } catch (error) {
      console.error("Erro ao atualizar galeria:", error);
      return response.status(500).send({
        success: false,
        message: "Erro ao atualizar galeria",
        error: error.message || error.toString() || "Erro desconhecido",
      });
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
          const filePath = Helpers.tmpPath(`uploads/${file.file}`);
          if (Fs.existsSync(filePath)) {
            Fs.unlinkSync(filePath);
          }
          await file.delete();
        }
      }
      return response.status(200).send({
        success: true,
        message: "Galeria removida com sucesso",
      });
    } catch (error) {
      console.error("Erro ao remover galeria:", error);
      return response.status(500).send({
        success: false,
        message: "Erro ao remover galeria",
        error: error.message || error.toString() || "Erro desconhecido",
      });
    }
  }
}

module.exports = GaleriaController;
