import { Menu, Logo, Logo_si, TextoHead } from "../../../styles/views";
import Image from "next/image";
import logo from "../img/logo_tedplan_login.png";
import logo_si from "../img/logo_si.png";
import {
  Container,
  DivMenuCadastro,
  DivBotao,
  BotaoMenuCadastro,
  DivBotaoMenuCadastro,
  NumeroMenuCadastro,
  BotaoMenuActiveCadastro,
} from "../../../styles/indicadores";
import Router from "next/router";
import { useEffect, useState } from "react";

export default function HeadPublico() {

  const [ rota, setRota ] = useState(null)
  function handleDadosMunicipio() {
    Router.push("/indicadores/componentes/dados_municipio");
  }

  function handleGestaoIndicadores() {
    Router.push("/indicadores/gestao");
  }
  function handleGestaoPrestacaoServicos() {
    Router.push("/indicadores/prestacao-servicos");
  }
  function handlePrestacaoServicosSinisa() {
    Router.push("/indicadores/prestacao-servicos-sinisa");
  }
  function handleMonitoramento() {
    Router.push("/indicadores/monitoramento-avaliacao");
  }

  useEffect(()=>{
    setRota(Router.pathname)
  },[])
  

  return (
    <DivMenuCadastro>
      <DivBotaoMenuCadastro>
        <NumeroMenuCadastro>01</NumeroMenuCadastro>
        { rota == "/indicadores/dados_municipio" ? 
        <BotaoMenuActiveCadastro onClick={handleDadosMunicipio}>Cadastro</BotaoMenuActiveCadastro>:
        <BotaoMenuCadastro onClick={handleDadosMunicipio}>Cadastro</BotaoMenuCadastro>}
      </DivBotaoMenuCadastro>
      <DivBotaoMenuCadastro>
        <NumeroMenuCadastro>02</NumeroMenuCadastro>
        { rota == "/indicadores/gestao" ? 
        <BotaoMenuActiveCadastro onClick={handleGestaoIndicadores}>Gestão</BotaoMenuActiveCadastro>:
        <BotaoMenuCadastro onClick={handleGestaoIndicadores}>Gestão</BotaoMenuCadastro>}
      </DivBotaoMenuCadastro>
      <DivBotaoMenuCadastro>
        <NumeroMenuCadastro>03</NumeroMenuCadastro>
        { rota == "/indicadores/prestacao-servicos" 
        ?<BotaoMenuActiveCadastro onClick={handleGestaoPrestacaoServicos}>Prestação de Serviços</BotaoMenuActiveCadastro> : 
        <BotaoMenuCadastro onClick={handleGestaoPrestacaoServicos}>Prestação de Serviços</BotaoMenuCadastro>}
      </DivBotaoMenuCadastro>
      
      <DivBotaoMenuCadastro>
        <NumeroMenuCadastro>04</NumeroMenuCadastro>
        { rota == "/indicadores/prestacao-servicos-sinisa" 
        ?<BotaoMenuActiveCadastro onClick={handlePrestacaoServicosSinisa}>Prestação de Serviços SINISA</BotaoMenuActiveCadastro> : 
        <BotaoMenuCadastro onClick={handlePrestacaoServicosSinisa}>Prestação de Serviços SINISA</BotaoMenuCadastro>}
      </DivBotaoMenuCadastro>

      <DivBotaoMenuCadastro>
        <NumeroMenuCadastro>05</NumeroMenuCadastro>        
        { rota == "/indicadores/monitoramento-avaliacao" ? 
        <BotaoMenuActiveCadastro onClick={handleMonitoramento}>Monitoramento e Avaliação</BotaoMenuActiveCadastro>:
        <BotaoMenuCadastro onClick={handleMonitoramento}>Monitoramento e Avaliação</BotaoMenuCadastro>}
      </DivBotaoMenuCadastro>
    </DivMenuCadastro>
  );
}
