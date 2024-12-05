


import {
  Container,
  DivMenuCadastro,
  DivBotao,
  BotaoMenuCadastro,
  DivBotaoMenuCadastro,
  NumeroMenuCadastro,
  BotaoMenuActiveCadastro,
} from "../styles/indicadores";
import Router from "next/router";
import { useEffect, useState } from "react";

export default function HeadPublico() {

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
        { rota == "/indicadores/monitoramento-avaliacao" ? 
        <BotaoMenuActiveCadastro onClick={handleMonitoramento}>Monitoramento e Avaliação</BotaoMenuActiveCadastro>:
        <BotaoMenuCadastro onClick={handleMonitoramento}>Monitoramento e Avaliação</BotaoMenuCadastro>}
      </DivBotaoMenuCadastro>
    </DivMenuCadastro>
  );
}
