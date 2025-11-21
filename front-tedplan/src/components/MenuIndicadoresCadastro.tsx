import {
  Container,
  DivMenuCadastro,
  DivBotao,
  BotaoMenuCadastro,
  DivBotaoMenuCadastro,
  NumeroMenuCadastro,
  BotaoMenuActiveCadastro,
} from "../styles/indicadores";
import { 
  FaAngleRight, 
  FaAngleLeft, 
  FaHome,
  } from "react-icons/fa";
import Router from "next/router";
import { useEffect, useState } from "react";

export default function HeadPublico() {

  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);  

    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth <= 855);
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

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

  const buttons = [

  <DivBotaoMenuCadastro key="01">
    <NumeroMenuCadastro>01</NumeroMenuCadastro>
    { rota == "/indicadores/dados_municipio" ? 
      <BotaoMenuActiveCadastro onClick={handleDadosMunicipio}>Cadastro</BotaoMenuActiveCadastro>:
      <BotaoMenuCadastro onClick={handleDadosMunicipio}>Cadastro</BotaoMenuCadastro>}
  </DivBotaoMenuCadastro>,

  <DivBotaoMenuCadastro key="02">
    <NumeroMenuCadastro>02</NumeroMenuCadastro>
      { rota == "/indicadores/gestao" ? 
      <BotaoMenuActiveCadastro onClick={handleGestaoIndicadores}>Gestão</BotaoMenuActiveCadastro>:
      <BotaoMenuCadastro onClick={handleGestaoIndicadores}>Gestão</BotaoMenuCadastro>}
  </DivBotaoMenuCadastro>,

  // <DivBotaoMenuCadastro key="03">
  //  <NumeroMenuCadastro>03</NumeroMenuCadastro>
  //       { rota == "/indicadores/prestacao-servicos-snis"
  //       || rota == "/indicadores/geral"
  //       || rota == "/indicadores/financeiro-municipio"
  //       || rota == "/indicadores/residuos-indicadores-unidade"
  //       || rota == "/indicadores/agua-indicadores"
  //       || rota == "/indicadores/esgoto-indicadores"
  //       || rota ==  "/indicadores/drenagem-indicadores"
  //       || rota ==  "/indicadores/balanco"
  //       || rota ==  "/indicadores/qualidade"
  //       || rota ==  "/indicadores/tarifa"
  //       ?<BotaoMenuActiveCadastro onClick={handleGestaoPrestacaoServicos}>Prestação de Serviços SNIS</BotaoMenuActiveCadastro> : 
  //       <BotaoMenuCadastro onClick={handleGestaoPrestacaoServicos}>Prestação de Serviços SNIS</BotaoMenuCadastro>}
  // </DivBotaoMenuCadastro>,

  <DivBotaoMenuCadastro key="03">
   <NumeroMenuCadastro>03</NumeroMenuCadastro>  
        { rota == "/indicadores/prestacao-servicos"
        || rota == "/indicadores/prestacao-servico-drenagem"
        || rota == "/indicadores/prestacao-servico-esgoto"
        || rota == "/indicadores/prestacao-servico-agua"
        || rota == "/indicadores/prestacao-servico-residuos"
        || rota == "/indicadores/prestacao-servico-institucional"
        ?<BotaoMenuActiveCadastro onClick={handlePrestacaoServicos}>Prestação de Serviços  </BotaoMenuActiveCadastro> : 
        <BotaoMenuCadastro onClick={handlePrestacaoServicos}>Prestação de Serviços </BotaoMenuCadastro>}
  </DivBotaoMenuCadastro>,

  <DivBotaoMenuCadastro key="04">
   <NumeroMenuCadastro>04</NumeroMenuCadastro>        
        { rota == "/indicadores/monitoramento-avaliacao" ? 
        <BotaoMenuActiveCadastro onClick={handleMonitoramento}>Monitoramento e Avaliação</BotaoMenuActiveCadastro>:
        <BotaoMenuCadastro onClick={handleMonitoramento}>Monitoramento e Avaliação</BotaoMenuCadastro>}
  </DivBotaoMenuCadastro>,
  ];

  const mobileButtons = [
  <DivBotaoMenuCadastro key="00">
    <NumeroMenuCadastro> <FaHome /> </NumeroMenuCadastro>
    { rota == "/indicadores/home_indicadores" ? 
    <BotaoMenuActiveCadastro onClick={() => Router.push("/indicadores/home_indicadores")}>Página Inicial</BotaoMenuActiveCadastro>:
    <BotaoMenuCadastro onClick={() => Router.push("/indicadores/home_indicadores")}>Página Inicial</BotaoMenuCadastro>}
  </DivBotaoMenuCadastro>,
  ...buttons.slice(0),


];

  const routes = [
  "/indicadores/home_indicadores",
  "/indicadores/dados_municipio",
  "/indicadores/gestao",
  "/indicadores/prestacao-servicos-snis",
  "/indicadores/prestacao-servicos",
  "/indicadores/monitoramento-avaliacao",

  //--Subrotas PRESTAÇÂO DE SERVIÇOS SNIS--//
  "/indicadores/geral",
  "/indicadores/financeiro-municipio",
  "/indicadores/residuos-indicadores-unidade",
  "/indicadores/agua-indicadores",
  "/indicadores/esgoto-indicadores",
  "/indicadores/drenagem-indicadores",
  "/indicadores/balanco",
  "/indicadores/qualidade",
  "/indicadores/tarifa",

  //--Subrotas PRESTAÇÂO DE SERVIÇOS--//
    "/indicadores/prestacao-servico-drenagem",
    "/indicadores/prestacao-servico-esgoto",
    "/indicadores/prestacao-servico-agua",
    "/indicadores/prestacao-servico-residuos",
    "/indicadores/prestacao-servico-institucional",

];

useEffect(() => {


  const idx = routes.indexOf(rota);
  if (idx !== -1) setActiveIndex(idx);
}, [rota]);



  // Não renderiza até que a hidratação esteja completa
  if (!isClient) {
    return (
      <DivMenuCadastro>
       {isMobile ? (
       
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <button
          onClick={
            () => {
              if (activeIndex > 0) {
                const prev = activeIndex - 1;
                setActiveIndex(prev);
                Router.push(routes[prev]);
        }
      }
          }
          disabled={activeIndex === 0}
          style={{ 
            display: activeIndex >0 ? "flex" : "none",
            fontSize: 24, background: "none", border: "none", cursor: "pointer", color: '#ffffff', position: 'relative', left: '5%'}}
        >
          <FaAngleLeft />
        </button>
        <div style={{ flex: 1 }}>
           {mobileButtons[activeIndex]}
        </div>
        <button
          onClick={
            () => {
              if (activeIndex < mobileButtons.length - 1) {
                const next = activeIndex + 1;
                setActiveIndex(next);
                Router.push(routes[next]);
        }
      }
          }
          disabled={activeIndex === mobileButtons.length - 1}
          style={{ 
            display: activeIndex < mobileButtons.length - 1 ? "flex" : "none",
            fontSize: 24, background: "none", border: "none", cursor: "pointer", color: '#ffffff', position: 'relative', right: '5%' }}
        >
          <FaAngleRight />
        </button>
      </div>
   
    ) : (
      buttons
    )}
    </DivMenuCadastro>
    );
  }
  

  return (
    <DivMenuCadastro>
       {isMobile ? (
       
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <button
          onClick={
            () => {
              if (activeIndex > 0) {
                const prev = activeIndex - 1;
                setActiveIndex(prev);
                Router.push(routes[prev]);
        }
      }
          }
          disabled={activeIndex === 0}
          style={{ 
            display: activeIndex >0 ? "flex" : "none",
            fontSize: 24, background: "none", border: "none", cursor: "pointer", color: '#ffffff', position: 'relative', left: '5%'}}
        >
          <FaAngleLeft />
        </button>
        <div style={{ flex: 1 }}>
           {mobileButtons[activeIndex]}
        </div>
        <button
          onClick={
            () => {
              if (activeIndex < mobileButtons.length - 1) {
                const next = activeIndex + 1;
                setActiveIndex(next);
                Router.push(routes[next]);
        }
      }
          }
          disabled={activeIndex === mobileButtons.length - 1}
          style={{ 
            display: activeIndex < mobileButtons.length - 1 ? "flex" : "none",
            fontSize: 24, background: "none", border: "none", cursor: "pointer", color: '#ffffff', position: 'relative', right: '5%' }}
        >
          <FaAngleRight />
        </button>
      </div>
   
    ) : (
      buttons
    )}
    </DivMenuCadastro>
  );
}
