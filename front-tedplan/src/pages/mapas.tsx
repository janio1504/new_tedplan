/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Footer,
  DivFormConteudo,
} from "../styles/views";
import { getAPIClient } from "../services/axios";
import HeadPublico from "../components/headPublico";
import MenuPublicoLateral from "../components/MenuPublicoLateral";
import Router from "next/router";
import { DivMenuTitulo, MenuMunicipioItem, BodyDashboard } from "@/styles/dashboard";
import { AuthContext } from "@/contexts/AuthContext";
import styled from "styled-components";
import {
  FaMap,
  FaTools,
  FaInfoCircle,
} from "react-icons/fa";
import { DivCenter } from "@/styles/dashboard-original";

const Titulo = styled.div`
  display: flex;
  box-sizing: border-box;
  width: auto;
  margin-top: -10px;
  padding: 20px;
  color: #333;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  font-weight: 600;
  font-size: 18px;
`;

const DesenvolvimentoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  min-height: 400px;
`;

const IconeContainer = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0085bd 0%, #006a9e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  box-shadow: 0 8px 20px rgba(0, 133, 189, 0.3);

  svg {
    font-size: 60px;
    color: #fff;
  }
`;

const TituloDesenvolvimento = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
`;

const TextoDesenvolvimento = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  max-width: 600px;
  margin: 0;
`;

const InfoBox = styled.div`
  background: #e8f4f8;
  border-left: 4px solid #0085bd;
  padding: 20px;
  border-radius: 8px;
  margin-top: 30px;
  max-width: 600px;
  display: flex;
  align-items: flex-start;
  gap: 15px;

  svg {
    font-size: 24px;
    color: #0085bd;
    flex-shrink: 0;
    margin-top: 2px;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #555;
    line-height: 1.6;
  }
`;

export default function Mapas() {
  const {signOut} = useContext(AuthContext);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1000) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function handleSignOut() {
    signOut();
  }
  
  function handleSimisab() {
    Router.push("/indicadores/home_indicadores");
  }

  return (
    <Container>
      <HeadPublico></HeadPublico>
      <DivMenuTitulo> 
        <span style={{
          fontSize: "20px",
          fontWeight: "bold",
          padding: "15px 20px",
          float: "left",
        }}>
          Portifolio de estatísticas, mapas, documentos e imagens
        </span>
      </DivMenuTitulo>
      
      <BodyDashboard>
        <MenuPublicoLateral isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      

      <DivCenter>
        <DivFormConteudo style={{ padding: "10px" }}>
          <Titulo>
            <FaMap style={{ marginRight: "10px" }} />
            Mapas
          </Titulo>

          <DesenvolvimentoContainer>
            <IconeContainer>
              <FaTools />
            </IconeContainer>
            <TituloDesenvolvimento>Página em Desenvolvimento</TituloDesenvolvimento>
            <TextoDesenvolvimento>
              Estamos trabalhando para trazer uma experiência completa de visualização de mapas.
              Em breve você poderá explorar mapas interativos e informações geográficas detalhadas.
            </TextoDesenvolvimento>
            <InfoBox>
              <FaInfoCircle />
              <p>
                Esta funcionalidade estará disponível em breve. Fique atento às atualizações!
              </p>
            </InfoBox>
          </DesenvolvimentoContainer>
        </DivFormConteudo>
      </DivCenter>
      </BodyDashboard>
      <Footer>
        &copy; Todos os direitos reservados
      </Footer>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  };
};

