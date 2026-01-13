/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-undef */
import React, { useContext, useState, useEffect } from "react";
import {
  Container,
  MenuMunicipio,
  Municipio,
  MenuMunicipioItem,
  HamburgerMenu
} from "../styles/indicadores";
import {FaAngleDown} from "react-icons/fa";
import Router from "next/router";
import { AuthContext } from "../contexts/AuthContext";

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



export default function MenuHorizontal({municipio}: {municipio: string | IMunicipio[]}) {
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Container>
        <MenuMunicipio>
          <Municipio 
            style={{
              display: "flex",
              flexDirection: "row", 
              justifyContent: "space-around"
            }}>
            Bem vindos Município de {Array.isArray(municipio) ? municipio[0]?.municipio_nome || '' : municipio}
          </Municipio>
        </MenuMunicipio>
      </Container>
    )
  }

  return (
    <Container>
   
      <MenuMunicipio>
        <Municipio 
        style={{
        display: "flex",
        flexDirection: "row", 
        justifyContent: "space-around"
        }}>
          Bem vindos Município de {Array.isArray(municipio) ? municipio[0]?.municipio_nome || '' : municipio} 
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