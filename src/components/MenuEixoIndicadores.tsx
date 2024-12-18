import { Menu, Logo, Logo_si, TextoHead } from "../styles/views";
import Image from "next/image";
import logo from "../img/logo_tedplan_login.png";
import logo_si from "../img/logo_si.png";
import {
  Container,
  DivMenu,
  DivBotao,
  BotaoMenu,
  DivBotaoMenu,
  NumeroMenu,
  BotaoMenuActive,
} from "../styles/indicadores";
import Router from "next/router";
import { useEffect, useState } from "react";

export default function MenuExios() {

  const [ rota, setRota ] = useState(null)
  function handleDadosMunicipio() {
    Router.push("/indicadores/dados_municipio");
  }

  function handleGestaoIndicadores() {
    Router.push("/indicadores/gestao");
  }
  function handleGestaoPrestacaoServicos() {
    Router.push("/indicadores/prestacao-servicos");
  }
  function handleMonitoramento() {
    Router.push("/indicadores/monitoramento-avaliacao");
  }

  useEffect(()=>{
    setRota(Router.pathname)
  },[])
  

  return (
    <DivMenu>
      <DivBotaoMenu>       
        <BotaoMenu onClick={handleDadosMunicipio}>Água e Esgoto</BotaoMenu>
      </DivBotaoMenu>   
      <DivBotaoMenu>        
        <BotaoMenu onClick={handleGestaoPrestacaoServicos}>Drenagem e Águas pluívais</BotaoMenu>
      </DivBotaoMenu>
      <DivBotaoMenu>      
        <BotaoMenu onClick={handleMonitoramento}>Resíduos Sólidos</BotaoMenu>
      </DivBotaoMenu>
    </DivMenu>
  );
}
