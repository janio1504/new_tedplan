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

type AuthContextType = {
    isAuthenticated: boolean;
    usuario: Usuario;
    signIn: (data: SignInData) => Promise<void>
    signOut: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }){

    const [ usuario, setUser ] = useState<Usuario | null>(null)
    
    const isAuthenticated = !!usuario;
    
    useEffect(() => {      
        
        const { 'tedplan.token': token }  = parseCookies()

        const { 'tedplan.id_usuario': id_usuario}  = parseCookies()
        
        if(token && id_usuario){
            
           recoverUserInformation(id_usuario).then(response => {   
               setUser(response[0])
           })        
        }
    }, [usuario])

    
    
    async function signIn({ login, senha, id_sistema }: SignInData) {
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
                
                //Router.push('/listarPublicacoes')
            }      
            return response
        })
        .catch((error) =>{
            if(error){
                Router.push('/')
                return 
            }
            return error
        })

        const resUsuarioLogado = await api.get('getUsuario', {params: {id_usuario: data.id_usuario}})
        const usuarioLogado = await resUsuarioLogado.data

        usuarioLogado.map((user)=>{
            if(user.id_tipo_usuario === 1){
                Router.push('/listarUsuarios')                
            }
            if(user.id_sistema === 2){
                Router.push('/indicadores/home_indicadores')                
            }
            
        })

    return usuarioLogado       

    }

    async function signOut(){
        destroyCookie(undefined, 'tedplan.token', {})
        destroyCookie(undefined, 'tedplan.id_usuario', {})  
        
        Router.push('/')
        
    }

    return (
        <AuthContext.Provider value= {{ usuario , isAuthenticated, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}