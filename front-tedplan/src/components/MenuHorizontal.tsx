/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-undef */
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import {
  Container,
  DivConteudo,
  DivColRelatorios,
  MenuMunicipio,
  Municipio,
  MenuMunicipioItem,
  ContainerPs,
  Ps1,
  Ps2,
  Ps3,
  Ps4,
  Ps5,
  PsImage,
  PsImageEsquerda,
  PsImageDireita,
  Ps3ImageEsquerda,
  Ps3ImageDireita,
  HamburgerMenu
} from "../styles/indicadores";
import HeadIndicadores from "../components/headIndicadores";
import MenuIndicadores from "../components/MenuIndicadores";
import {FaAngleDown} from "react-icons/fa";
import Router from "next/router";
import { parseCookies } from "nookies";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";
import { GetServerSideProps } from "next";
import { getAPIClient } from "../services/axios";
import Geral from "../../img/geral.png"
import Financeiro from "../../img/financeiro.png"
import Agua from "../../img/agua.png"
import Drenagem from "../../img/drenagem.png"
import Esgoto from "../../img/esgoto.png"
import Residuos from "../../img/residuos.png"
import Qualidade from "../../img/qualidade.png"
import Balanco from "../../img/balanco.png"
import Tarifas from "../../img/tarifas.png"
import styled from "styled-components/dist/constructors/styled";

interface IMunicipio {
  id_municipio: string;
  municipio_codigo_ibge: string;
  municipio_nome: string;
  municipio_cnpj: string;
  municipio_nome_prefeitura: string;
  municipio_cep: string;
  municipio_endereco: string;
  municipio_numero: string;
  municipio_bairro: string;
  municipio_telefone: string;
  municipio_email: string;
  municipio_nome_prefeito: string; 
}

interface MunicipioProps {
  municipio: IMunicipio[];
}



export default function MenuHorizontal({municipio}) {
  const { signOut, permission } = useContext(AuthContext);
  async function handleSignOut() {
    signOut();
  }
  async function handleHome() {
    Router.push("/indicadores/home_indicadores");
  }
  async function handleDashboard() {
    Router.push("/dashboard");
  }
  async function handleGestao() {
    Router.push("/indicadores/gestao");
  }
  async function handleIndicadores() {
    Router.push("/estatisticas");
  }
  async function handleReporte() {
    Router.push("/indicadores/Relatorios");
  }


  async function handleBalanco() {
    Router.push("/indicadores/balanco");
  }
  async function handleQualidade() {
    Router.push("/indicadores/qualidade");
  }

  async function handleManuais() {
    Router.push("/indicadores/Manuais");
  }

  const [menuOpen, setMenuOpen] = useState(false)

  

  return (
    <Container>
   
      <MenuMunicipio>
        <Municipio 
        style={{
        display: "flex",
        flexDirection: "row", 
        justifyContent: "space-around"
        }}>
          Bem vindos Município de {municipio} 
        <HamburgerMenu onClick={() => setMenuOpen(!menuOpen)}>
          <span> <FaAngleDown /> </span>
        </HamburgerMenu>
        </Municipio>
        
        <MenuMunicipioItem $menuOpen={menuOpen}>
          <ul>
          <li onClick={handleDashboard}> {permission.adminGeral || permission.adminTedPlan ? "Dashboard" : ""}</li>
          <li onClick={handleHome}>Pagina Inicial</li>
            <li onClick={handleGestao}>Gestão</li>
            <li onClick={handleIndicadores}>Indicadores</li>
            <li onClick={handleManuais}>Manuais</li>
            <li onClick={handleReporte}>Relatórios</li>
            <li onClick={handleSignOut}>Sair</li>
          </ul>
        </MenuMunicipioItem>
        
      </MenuMunicipio>

     
    </Container>
  );
}