
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

export default function HeadPublico() {
  const [rota, setRota] = useState(null);
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

  useEffect(() => {
    setRota(Router.pathname);
  }, []);

  return (
    <DivMenu>
      <DivBotaoMenu>
        <NumeroMenu>01</NumeroMenu>
        {rota == "/indicadores/dados_municipio" ? (
          <BotaoMenuActive onClick={handleDadosMunicipio}>
            Cadastro
          </BotaoMenuActive>
        ) : (
          <BotaoMenu onClick={handleDadosMunicipio}>Cadastro</BotaoMenu>
        )}
      </DivBotaoMenu>
      <DivBotaoMenu>
        <NumeroMenu>02</NumeroMenu>
        {rota == "/indicadores/gestao" ? (
          <BotaoMenuActive onClick={handleGestaoIndicadores}>
            Gestão
          </BotaoMenuActive>
        ) : (
          <BotaoMenu onClick={handleGestaoIndicadores}>Gestão</BotaoMenu>
        )}
      </DivBotaoMenu>
      <DivBotaoMenu>
        <NumeroMenu>03</NumeroMenu>
        {rota == "/indicadores/prestacao-servicos" ? (
          <BotaoMenuActive onClick={handleGestaoPrestacaoServicos}>
            Prestação de Serviços
          </BotaoMenuActive>
        ) : (
          <BotaoMenu onClick={handleGestaoPrestacaoServicos}>
            Prestação de Serviços
          </BotaoMenu>
        )}
      </DivBotaoMenu>
      <DivBotaoMenu>
        <NumeroMenu>04</NumeroMenu>
        {rota == "/indicadores/monitoramento-avaliacao" ? (
          <BotaoMenuActive onClick={handleMonitoramento}>
            Monitoramento e Avaliação
          </BotaoMenuActive>
        ) : (
          <BotaoMenu onClick={handleMonitoramento}>
            Monitoramento e Avaliação
          </BotaoMenu>
        )}
      </DivBotaoMenu>
    </DivMenu>
  );
}
