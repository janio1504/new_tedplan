import { Menu, ItensMenu, Logo, UsuarioLogado, UsuarioAvatar, DivCenterHead, Logo_si, TextoHead } from '../styles/views'
import { AuthContext } from '../contexts/AuthContext';
import Image from 'next/image'
import logo from '../img/logo_tedplan_login.png';
import avatar from '../img/icone_logon.png';
import { useContext, useEffect, useState } from 'react';
import logo_si from '../img/logo_si.png';
import Router from 'next/router';

interface IUsuario {
  id_usuario: string;
  nome: string;
  login: string;
  id_municipio: string;
  ativo: boolean;
  tipo_usuario: string;
  id_tipo_usuario: string;
  id_imagem: string;
  id_sistema: string;
} 

interface UsuarioProps {
  usuarios: IUsuario[];  
}

export default function MenuSuperior(usuarios: UsuarioProps){
    const { signOut, usuario } = useContext(AuthContext)
    const [ name, setName ] = useState('')
    const [ user, setUser] = useState<IUsuario | any>(usuarios)
    const [mounted, setMounted] = useState(false)
   

      useEffect(() => { 
        setMounted(true)
        if(usuario){
          setUser(usuario)
          if(usuario.nome){
            const nome = usuario.nome.split(" ")
            setName(nome[0]+" "+`${nome[1] ? nome[1] : ""}`)
          }
        }               
        
      }, [usuario])

      async function handleSignOut(){
        signOut()
      }
      async function handleHome(){
        Router.push('/indicadores/home_indicadores')
      }

    return (
      
        <Menu>
          <DivCenterHead suppressHydrationWarning>
            <Logo>
                <Image         
                src={logo}
                alt="TedPlan"          
                />          
           </Logo>
           <Logo_si>
                <Image         
                src={logo_si}
                alt="TedPlan"          
                />                      
           </Logo_si>
           <TextoHead suppressHydrationWarning>
            <h3>Sistema Municipal<br/>
                de Informações de Saneamento Básico</h3>
            </TextoHead>
           <UsuarioLogado suppressHydrationWarning>
                <p>Usuário Logado:</p>
                <p suppressHydrationWarning>{mounted ? name : ''}</p>
                <br />
                <p>Ultimo login:</p>
                <p suppressHydrationWarning>{mounted && user?.ultimo_login ? user.ultimo_login : ''}</p>
           </UsuarioLogado>
            <UsuarioAvatar>
                <Image         
                    src={avatar}
                    alt="TedPlan"          
                  />
                  
            </UsuarioAvatar>
         
           </DivCenterHead>
        </Menu>
    )
}