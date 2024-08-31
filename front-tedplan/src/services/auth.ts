
import { getAPIClient } from './axios'
type SignInRequestData = {
    login: string;
    senha: string;
    id_sistema: string;
}

 export async function signInRequest({ login, senha, id_sistema}: SignInRequestData) {
    const api = getAPIClient()
    const res = await api.post('/login', { login, senha, id_sistema})
    .then((response)=>{
        return response
    }).catch((error) => {                       
       return error
    })  
       
    return res.data

}

export async function recoverUserInformation(id) {
        
        const api = getAPIClient()
        const { data } = await api.get('/getUsuario', { params: {id_usuario: id} })
        
        return data
   
}