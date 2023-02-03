import { createContext, useEffect, useState } from "react";
import { recoverUserInformation, signInRequest } from '../services/auth'
import { setCookie, parseCookies, destroyCookie,  } from 'nookies'
import  Router from 'next/router'
import api from "../services/api";


type SignInData = {
    login: string;
    senha: string;
    id_sistema: string;
}

type Usuario = {
    id_usuario: BigInteger;
    login: string;
    nome: string;
    ultimo_login: string;
    id_sistema: number;
    id_municipio: string;
}

type IndicadoresContextType = {
    isAuthenticated: boolean;
    usuario: Usuario;
    signIn: (data: SignInData) => Promise<void>
    signOut: () => Promise<void>;
}

export const IndicadoresContext = createContext({} as IndicadoresContextType)

export function AuthProvider({ children }){

    const [ usuario, setUser ] = useState<Usuario | null>(null)
    
    const isAuthenticated = !!usuario;
    
    useEffect(() => {      
        
        const { 'tedplan.token': token }  = parseCookies()

        const { 'tedplan.id_usuario': id_usuario}  = parseCookies()
        
        if(token && id_usuario){
            console.log(id_usuario);
            
           recoverUserInformation(id_usuario).then(response => {   
               setUser(response[0])
           })        
        }
    }, [])
   
    
    async function signIn({ login, senha, id_sistema }: SignInData) {

        console.log(login);
        
      
        const data = await signInRequest({
            login,
            senha,
            id_sistema,
        }).then((response)=>{
           
            if(response.token && response.id_usuario){
            setCookie(undefined, 'tedplan.token', response.token, {
                maxAge: 60 * 60 * 1, // 1 hora
            })
    
            setCookie(undefined, 'tedplan.id_usuario', response.id_usuario, {
                maxAge: 60 * 60 * 1, // 1 hora
            })
            
              
            api.defaults.headers['Authorization'] = `Bearer ${response.token}`;
    
                recoverUserInformation(response.id_usuario).then(value => {
                    setUser(value[0])
                })             
                
                Router.push('/indicadores/home_indicadores')
            }      
            return response
        })
        .catch((error) =>{
            if(error){
                Router.push('/indicadores/login_indicadores')
                return data
            }
            return error
        })      
     
    }

    async function signOut(){
        destroyCookie(undefined, 'tedplan.token', {})
        destroyCookie(undefined, 'tedplan.id_usuario', {})  
        
        Router.push('/')
        
    }

    return (
        <IndicadoresContext.Provider value= {{ usuario , isAuthenticated, signIn, signOut }}>
            {children}
        </IndicadoresContext.Provider>
    )
}