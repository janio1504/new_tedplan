import {
  Menu,
  ItensMenu,
  Logo,
  UsuarioLogado,
  UsuarioAvatar,
} from "../styles/dashboard";
import { AuthContext } from "../contexts/AuthContext";
import Image from "next/image";
import logo from "../img/logo_tedplan_login.png";
import avatar from "../img/icone_logon.png";
import { useContext, useEffect, useState } from "react";
import Router from "next/router";

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

export default function MenuSuperior(usuarios: UsuarioProps) {
  const { signOut, usuario } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [user, setUser] = useState<IUsuario | any>(usuarios);
  async function handleSignOut() {
    signOut();
  }

  useEffect(() => {
    if (usuario) {
      setUser(usuario);
      const nome = usuario.nome.split(" ");
      setName(nome[0] + " " + nome[1]);
    }
  }, [usuario]);

  function handlePostagens() {
    Router.push("/listarPostagens");
  }
  function handlePublicacoes() {
    Router.push("/listarPublicacoes");
  }

  function handleUsuarios() {
    Router.push("/listarUsuarios");
  }

  function handleGalerias() {
    Router.push("/listarGalerias");
  }

  function handleNormas() {
    Router.push("/listarNormas");
  }

  function handleDashboard() {
    Router.push("/dashboard");
  }

  function handleInfoIndicadores() {
    Router.push("/listarInfoIndicador");
  }

  return (
    <Menu>
      <Logo>
        <Image src={logo} alt="TedPlan" />
      </Logo>
      <UsuarioLogado>
        <p>Usuário Logado:</p>
        <p>{name}</p>
        <br />
        <p>Ultimo login:</p>
        <p>{user.ultimo_login}</p>
      </UsuarioLogado>
      <UsuarioAvatar>
        <Image src={avatar} alt="TedPlan" />
      </UsuarioAvatar>
      <ItensMenu>
        <ul>
          <li onClick={handleDashboard}>Dashboard</li>
          {/* <li onClick={handlePostagens} >Postagens</li> */}
          <li onClick={handlePublicacoes}>Publicações</li>
          <li onClick={handleGalerias}>Galerias</li>
          <li onClick={handleNormas}>Normas</li>
          <li onClick={handleUsuarios}>Usuários</li>
          <li onClick={handleInfoIndicadores}>Indicadores</li>
          <li onClick={handleSignOut}>Sair</li>
        </ul>
      </ItensMenu>
    </Menu>
  );
}
