import api from "../api";

export const getPsResiduosColeta = async (
  id_municipio: string,
  ano: number
) => {
  try {
    const response = await api.post("get-ps-residuos-coleta-por-ano", {
      id_municipio,
      ano,
    });
    return response.data[0];
  } catch (error) {
    console.error("Erro ao buscar dados de resíduos:", error);
    throw error;
  }
};

export const getUnidadesRss = async (id_municipio: string, ano: number) => {
  try {
    const response = await api.post("list-unidades-rss", {
      id_municipio,
      ano,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar unidades de resíduos sólidos:", error);
    throw error;
  }
};

export const removerUnidadeRss = async (id: string) => {
  try {
    const response = await api.delete("remover-unidade-rss", {
      params: { id },
    });
    if (response.data.success) {
      return { success: true, message: response.data.message };
    } else {
      return {
        success: false,
        message: response.data.message || "Erro ao remover unidade",
      };
    }
  } catch (error) {
    console.error("Erro ao remover unidade RSS:", error);
    return { success: false, message: "Erro ao comunicar com o servidor" };
  }
};

export const createUnidadeRss = async (data) => {
  try {
    const response = await api.post("create-unidade-rss", data);

    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar unidade RSS:", error);
    throw error;
  }
};

// =============================================================================
export const createUnidadeRsc = async (data) => {
  try {
    const response = await api.post("create-unidade-rsc", data);

    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar unidade RSC:", error);
    throw error;
  }
};

export const getUnidadesRsc = async (id_municipio: string, ano: number) => {
  try {
    const response = await api.post("list-unidades-rsc", {
      id_municipio,
      ano,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar unidades de resíduos coleta:", error);
    throw error;
  }
};

export const removerUnidadeRsc = async (id: string) => {
  try {
    const response = await api.delete("remover-unidade-rsc", {
      params: { id },
    });
    if (response.data.success) {
      return { success: true, message: response.data.message };
    } else {
      return {
        success: false,
        message: response.data.message || "Erro ao remover unidade",
      };
    }
  } catch (error) {
    console.error("Erro ao remover unidade RSC:", error);
    return { success: false, message: "Erro ao comunicar com o servidor" };
  }
};

// ============================================================================
export const getCooperativasCatadores = async (
  id_municipio: string,
  ano: number
) => {
  try {
    const response = await api.post("list-cooperativas-catadores", {
      id_municipio,
      ano,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar cooperativas catadores:", error);
    throw error;
  }
};

export const createCoopCat = async (data) => {
  try {
    const response = await api.post("create-cooperativa-catadores", data);

    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar unidade RSC:", error);
    throw error;
  }
};

export const removerCoopCat = async (id: string) => {
  try {
    const response = await api.delete("delete-cooperativa-catadores", {
      params: { id },
    });
    if (response.data.success) {
      return { success: true, message: response.data.message };
    } else {
      return {
        success: false,
        message:
          response.data.message || "Erro ao remover cooperativa catadores",
      };
    }
  } catch (error) {
    console.error("Erro ao remover cooperativa catadores:", error);
    return { success: false, message: "Erro ao comunicar com o servidor" };
  }
};
