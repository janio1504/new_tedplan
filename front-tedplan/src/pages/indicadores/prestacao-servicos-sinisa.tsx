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
  TitlePsOnMouse,
  BreadCrumbStyle
} from "../../styles/indicadores";
import HeadIndicadores from "../../components/headIndicadores";
import MenuIndicadores from "../../components/MenuIndicadoresCadastro";
import Router from "next/router";
import { parseCookies } from "nookies";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../services/api";
import { GetServerSideProps } from "next";
import { getAPIClient } from "../../services/axios";
import Institucional from "../../img/user_mun.png"
import Agua from "../../img/agua.png"
import Drenagem from "../../img/drenagem.png"
import Modelo from "../../img/modelo_home_prestacao_servicoes.png"
import Esgoto from "../../img/esgoto.png"
import Residuos from "../../img/residuos.png"
import MenuHorizontal from "../../components/MenuHorizontal";
import { set } from "react-hook-form";
import Link from "next/link";
import { styled } from "styled-components";

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
  Imunicipio: IMunicipio[];
}

export default function HomeIndicadores({ Imunicipio }: MunicipioProps) {
  const { usuario, signOut, isAuthenticated } = useContext(AuthContext);
  const [municipio, setMunicipio] = useState<IMunicipio>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
 useEffect(() => {
    if (usuario?.id_municipio) {
      getMunicipio();
    }
  }, [usuario]);

  async function getMunicipio(){
    const res = await api.get("getMunicipio", {
      params: { id_municipio: usuario.id_municipio },
    }).then(response =>{
      setMunicipio(response.data)
      return response.data;
    })
 
  }

  async function handleSignOut() {
    signOut();
  }
  async function handleGestao() {
    Router.push("/indicadores/gestao");
  }
  async function handleIndicadores() {
    Router.push("/indicadores/gestao");
  }
  async function handleReporte() {
    Router.push("/indicadores/Relatorios");
  }
  async function handleFinaceiro() {
    Router.push("/indicadores/financeiro-municipio");
  }
  async function handleAgua() {
    Router.push("/indicadores/sinisa-agua");
  }
  async function handleEsgoto() {
    Router.push("/indicadores/sinisa-esgoto");
  }
  async function handleDrenagem() {
    Router.push("/indicadores/sinisa-drenagem");
  }
  async function handleResiduosUnidade() {
    Router.push("/indicadores/sinisa-residuos");
  }
  async function handleInstitucional() {
    Router.push("/indicadores/sinisa-institucional");
  }
  async function handleManuais() {
    Router.push("/indicadores/Manuais");
  }

  const [title, setTitle] = useState("");
  const [show, setShow] = useState(false);

  const titleOnMouse = (e) => {
    setTitle(e.target.alt);
    setShow(true);    
  };
  
  const CircularContainer = styled.div`
  position: relative;
  width: 600px;
  height: 350px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CenterIcon = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  cursor: pointer;
  transition: transform 0.3s ease;

  
`;


const ServiceIcon = styled.div<{ rotation: number }>`
  position: absolute; 
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transform: rotate(${props => props.rotation}deg) translateX(250px) rotate(-${props => props.rotation}deg);
  transition: transform 0.3s ease;

  
`;

  return (
    <Container>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuHorizontal municipio={municipio?.municipio_nome}></MenuHorizontal>
      <MenuIndicadores></MenuIndicadores>
      <BreadCrumbStyle isCollapsed={isCollapsed}>
              <nav>
                <ol>
                  <li>
                    <Link href="/indicadores/home_indicadores">Home</Link>
                    <span> / </span>
                  </li>
                  <li>
                    <span>Prestação de Serviços SINISA</span>
                  </li>
                </ol>
              </nav>
        </BreadCrumbStyle>
      <div style={{marginTop:"150px"}}>
      </div>

      <CircularContainer>

        
          <CenterIcon onClick={handleInstitucional}>
          
          <Image 
            src={Institucional} 
            onMouseOver={titleOnMouse} 
            onMouseOut={() => setShow(false)} 
            width={150}
            height={150}
            alt="Institucional" />
            {title === 'Institucional' && show && (<TitlePsOnMouse>
            {title} 
          </TitlePsOnMouse>)}

          </CenterIcon>

          <ServiceIcon onClick={handleEsgoto}
          rotation={0}>
            <Image 
              src={Esgoto} 
              onMouseOver={titleOnMouse} 
              onMouseOut={() => setShow(false)} 
              width={100}
              height={100}
              alt="Esgoto"
              />
            {title === 'Esgoto' && show && (<TitlePsOnMouse>
            {title} 
            </TitlePsOnMouse>)}
          </ServiceIcon>

          <ServiceIcon onClick={handleResiduosUnidade}
          rotation={90}>
            <Image 
              src={Residuos} 
              onMouseOver={titleOnMouse} 
              onMouseOut={() => setShow(false)} 
              width={100}
              height={100}
              alt="Residuos"
              />
            {title === 'Residuos' && show && (<TitlePsOnMouse>
            {title} 
            </TitlePsOnMouse>)}
          </ServiceIcon>

          <ServiceIcon onClick={handleAgua}
          rotation={180}>
            <Image 
              src={Agua} 
              onMouseOver={titleOnMouse} 
              onMouseOut={() => setShow(false)} 
              width={100}
              height={100}
              alt="Água"
              />
            {title === 'Água' && show && (<TitlePsOnMouse>
            {title} 
            </TitlePsOnMouse>)}
          </ServiceIcon>

          <ServiceIcon rotation={270} onClick={handleDrenagem} >
            <Image 
              src={Drenagem} 
              onMouseOver={titleOnMouse} 
              onMouseOut={() => setShow(false)} 
              width={100}
              height={100}
              alt="Drenagem"
              />
            {title === 'Drenagem' && show && (<TitlePsOnMouse>
            {title} 
            </TitlePsOnMouse>)}
          </ServiceIcon>
      </CircularContainer>
              
              <Image 
              src={Modelo} 
              onMouseOver={titleOnMouse} 
              onMouseOut={() => setShow(false)} 
              width={100}
              height={100}
              alt="Modelo"
              />
    </Container>
  );
}

