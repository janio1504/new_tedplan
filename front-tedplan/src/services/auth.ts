import { getAPIClient } from "./axios";
type SignInRequestData = {
  login: string;
  senha: string;
  id_sistema: string;
};

export async function signInRequest({
  login,
  senha,
  id_sistema,
}: SignInRequestData) {
  const api = getAPIClient();
  const res = await api
    .post("/login", { login, senha, id_sistema })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return res.data;

  if (res.data.error) {
    return res.data;
  }

  return res.data;
}

export async function recoverUserInformation(id) {
  const api = getAPIClient();
  const { data } = await api.get("/getUsuario", { params: { id_usuario: id } });

  return data;
}

export async function permissionByYear(id) {
  // Valida se o id é válido antes de fazer a requisição
  if (!id || id === 'undefined' || id === 'null') {
    return null;
  }
  
  const api = getAPIClient();
  try {
    const permissaoEdito = await api.get("/get-editor-simisab-por-ano/"+id);
    return permissaoEdito?.data?.[0] || null;
  } catch (error) {
    console.error('Erro ao buscar permissão por ano:', error);
    return null;
  }
}
