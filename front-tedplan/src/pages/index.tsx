import Router from "next/router";
import { destroyCookie } from "nookies";
import logo from "../img/logo_tedplan_login.png";
import sou_minicipio from "../img/user_mun.png";
import sou_tedplan from "../img/icone_logon.png";
import Image from "next/image";
import {
  Container,
  Logo,
  DivMenu,
  DivBotao,
  BotaoMenu,
  BotaoMenuTexto,
  Footer,
} from "../styles/index";
import { useEffect } from "react";

export default function Home() {
  function handleLogin() {
    Router.push("/login");
  }
  function handleLoginIndicadores() {
    Router.push("/login_indicadores");
  }

  useEffect(() => {
    destroyCookie(undefined, "tedplan.token", {});
    destroyCookie(undefined, "tedplan.id_usuario", {});
    
  }, []);
  return (
    <Container>
      <Logo>
        <Image src={logo} alt="Logo Tedplan" />
      </Logo>
      <DivMenu>
        <DivBotao>
          <BotaoMenu onClick={handleLogin}>
            <Image
              width="100px;"
              height="100px"
              src={sou_tedplan}
              alt="Logo Tedplan"
            />
          </BotaoMenu>
          <BotaoMenuTexto onClick={handleLogin}>
            <b>Sou TedPlan</b>
          </BotaoMenuTexto>
        </DivBotao>
        {/* <DivBotao>
          <BotaoMenu onClick={handleLoginIndicadores}>
            <Image
              width="100px;"
              height="100px"
              src={sou_minicipio}
              alt="Logo Tedplan"
            />
          </BotaoMenu>
          <BotaoMenuTexto onClick={handleLoginIndicadores}>
            <b>Sou Municipio</b>
          </BotaoMenuTexto>
        </DivBotao> */}
      </DivMenu>
      <Footer>&copy; Todos os direitos reservados </Footer>
    </Container>
  );
}
