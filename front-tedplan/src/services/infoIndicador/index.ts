import api from "../api";
import { InfoIndicador } from "../../types";

export const createInfoIndicador = async (
  data: FormData
): Promise<InfoIndicador> => {
  try {
    const response = await api.post("/create-descricao-indicador", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating indicador:", error);
    throw error;
  }
};

export const getInfoIndicadorById = async (
  id: string | number
): Promise<InfoIndicador> => {
  const response = await api.get(`get-indicador/${id}`);
  return response.data;
};

export const getAllInfoIndicadores = async (): Promise<InfoIndicador[]> => {
  const response = await api.get("get-indicadores");
  return response.data;
};

export const updateInfoIndicador = async (
  data: FormData
): Promise<InfoIndicador> => {
  const response = await api.put("update-descricao-indicador", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteInfoIndicador = async (
  id: string | number,
  id_imagem?: number
): Promise<void> => {
  try {
    await api.delete(`delete-descricao-indicador/${id}`, {
      data: { id_imagem },
    });
  } catch (error) {
    console.error("Error deleting indicador:", error);
    throw error;
  }
};
