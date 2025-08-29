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

  const [rota, setRota] = useState("")
  const [isClient, setIsClient] = useState(false)
  
  function handleDadosMunicipio() {
    Router.push("/indicadores/dados_municipio");
  }
  function handlePrestacaoServicos() {
      Router.push("/indicadores/prestacao-servicos");
  }
  function handleGestaoIndicadores() {
    Router.push("/indicadores/gestao");
  }
  function handleGestaoPrestacaoServicos() {
    Router.push("/indicadores/prestacao-servicos-snis");
  }
  function handleMonitoramento() {
    Router.push("/indicadores/monitoramento-avaliacao");
  }

  useEffect(() => {
    // Marca que estamos no cliente
    setIsClient(true);
    
    // Define a rota inicial
    setRota(Router.pathname);
    
    // Listener para mudanças de rota
    const handleRouteChange = (url) => {
      setRota(url);
    };

    Router.events.on('routeChangeComplete', handleRouteChange);

    // Cleanup do listener
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [])

  // Não renderiza até que a hidratação esteja completa
  if (!isClient) {
    return (
      <DivMenuCadastro>
        <DivBotaoMenuCadastro>
          <NumeroMenuCadastro>01</NumeroMenuCadastro>
          <BotaoMenuCadastro onClick={handleDadosMunicipio}>Cadastro</BotaoMenuCadastro>
        </DivBotaoMenuCadastro>
        <DivBotaoMenuCadastro>
          <NumeroMenuCadastro>02</NumeroMenuCadastro>
          <BotaoMenuCadastro onClick={handleGestaoIndicadores}>Gestão</BotaoMenuCadastro>
        </DivBotaoMenuCadastro>
        <DivBotaoMenuCadastro>
          <NumeroMenuCadastro>03</NumeroMenuCadastro>
          <BotaoMenuCadastro onClick={handleGestaoPrestacaoServicos}>Prestação de Serviços SNIS</BotaoMenuCadastro>
        </DivBotaoMenuCadastro>
        <DivBotaoMenuCadastro>
          <NumeroMenuCadastro>04</NumeroMenuCadastro> 
          <BotaoMenuCadastro onClick={handlePrestacaoServicos}>Prestação de Serviços</BotaoMenuCadastro>
        </DivBotaoMenuCadastro>
        <DivBotaoMenuCadastro>
          <NumeroMenuCadastro>05</NumeroMenuCadastro>        
          <BotaoMenuCadastro onClick={handleMonitoramento}>Monitoramento e Avaliação</BotaoMenuCadastro>
        </DivBotaoMenuCadastro>
      </DivMenuCadastro>
    );
  }
  

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
        { rota == "/indicadores/prestacao-servicos-snis" 
        ?<BotaoMenuActiveCadastro onClick={handleGestaoPrestacaoServicos}>Prestação de Serviços SNIS</BotaoMenuActiveCadastro> : 
        <BotaoMenuCadastro onClick={handleGestaoPrestacaoServicos}>Prestação de Serviços SNIS</BotaoMenuCadastro>}
      </DivBotaoMenuCadastro>
      <DivBotaoMenuCadastro>
        <NumeroMenuCadastro>04</NumeroMenuCadastro>
        { rota == "/indicadores/prestacao-servicos" 
        ?<BotaoMenuActiveCadastro onClick={handlePrestacaoServicos}>Prestação de Serviços  </BotaoMenuActiveCadastro> : 
        <BotaoMenuCadastro onClick={handlePrestacaoServicos}>Prestação de Serviços </BotaoMenuCadastro>}
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
