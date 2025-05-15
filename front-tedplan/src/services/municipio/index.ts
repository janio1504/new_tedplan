// services/municipioService.ts
import api from "../api";
import { Municipio } from "../../types";

export const getMunicipio = async (
  id_municipio: string
): Promise<Municipio> => {
  const response = await api.get("getMunicipio", {
    params: { id_municipio },
  });
  return response.data;
};

export const updateMunicipio = async (
  data: Partial<Municipio>
): Promise<Municipio> => {
  const response = await api.post("addMunicipio", data);
  console.log("reposta do serviço", response);

  return response.data[0]; // Assumindo que o backend retorna os dados atualizados
};
