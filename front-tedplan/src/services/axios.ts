import axios from "axios";
import { parseCookies } from "nookies";

export function getAPIClient(ctx?: any) {
  
  const { "tedplan.token": token } = parseCookies(ctx);
  const api = axios.create({
    baseURL: "http://localhost:3333",
    //baseURL: "http://simisab.saneamento.unifap.br/api",
    
  });

  if (token) {
    api.defaults.headers["Authorization"] = `Bearer ${token}`;
  }
  /*api.interceptors.request.use(config => {
        console.log(config);
        return config
    })*/
  return api;
}
