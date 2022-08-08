import axios from "axios";
import { parseCookies } from "nookies";

export function getAPIClient(ctx?: any) {
  
  const { "tedplan.token": token } = parseCookies(ctx);
  const api = axios.create({
    baseURL: "http://172.18.0.1/api",
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
