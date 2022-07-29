import {
  Menu,
  ItensMenu,
  Logo,
  UsuarioLogado,
  UsuarioAvatar,
  TextoHead,
  DivCenterHead,
} from "../styles/views";
import { AuthContext } from "../contexts/AuthContext";
import Image from "next/image";
import logo from "../img/logo_tedplan_login.png";
import avatar from "../img/icone_logon.png";
import wp from "../img/wp.png";
import { useContext, useEffect, useState } from "react";
import Router from "next/router";
import { Logo_si } from "../styles/views";
import Link from "next/link";

export default function MenuSuperior() {
  const { signOut, usuario } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [user, setUser] = useState<any>("");
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

  function handleAddArquivo() {
    Router.push("/addArquivo");
  }

  return (
    <Menu>
      <DivCenterHead>
        <Logo>
            <Link href={"listarPublicacoes"} >
            <a><Image src={logo} alt="TedPlan" /></a>
            </Link>
        </Logo>
        <Logo_si>
          <Image src={wp} alt="TedPlan" />
        </Logo_si>
        <TextoHead>
          <h3>
            Explorador de Arquivos
            <br />
            do trabalho interno
          </h3>
        </TextoHead>
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
            <li onClick={handleAddArquivo}>Cadastrar Arquivo</li>
            <li onClick={handleSignOut}>Sair</li>
          </ul>
        </ItensMenu>
      </DivCenterHead>
    </Menu>
  );
}
