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
  BreadCrumbStyle,
  DivCenter
} from "../../styles/indicadores";
import HeadIndicadores from "../../components/headIndicadores";
import MenuIndicadores from "../../components/MenuIndicadoresCadastro";
import Router from "next/router";
import { parseCookies } from "nookies";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../services/api";
import { GetServerSideProps } from "next";
import { getAPIClient } from "../../services/axios";
import Geral from "../../img/geral.png"
import Financeiro from "../../img/financeiro.png"
import Agua from "../../img/agua.png"
import Drenagem from "../../img/drenagem.png"
import Esgoto from "../../img/esgoto.png"
import Residuos from "../../img/residuos.png"
import Qualidade from "../../img/qualidade.png"
import Balanco from "../../img/balanco.png"
import Tarifas from "../../img/tarifas.png"
import MenuHorizontal from "../../components/MenuHorizontal";
import { set } from "react-hook-form";
import Link from "next/link";

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
    getMunicipio()     
  }, [municipio]);

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
    Router.push("/indicadores/agua-indicadores");
  }
  async function handleEsgoto() {
    Router.push("/indicadores/esgoto-indicadores");
  }
  async function handleDrenagem() {
    Router.push("/indicadores/drenagem-indicadores");
  }
  async function handleResiduosColeta() {
    Router.push("/indicadores/residuos-indicadores-coleta");
  }
  async function handleResiduosUnidade() {
    Router.push("/indicadores/residuos-indicadores-unidade");
  }
  async function handleBalanco() {
    Router.push("/indicadores/balanco");
  }
  async function handleQualidade() {
    Router.push("/indicadores/qualidade");
  }
  async function handleGeral() {
    Router.push("/indicadores/geral");
  }
  async function handleTarifa() {
    Router.push("/indicadores/tarifa");
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
  

  return (
    <Container>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuHorizontal
        municipio={municipio?.municipio_nome}
      ></MenuHorizontal>
      <MenuIndicadores></MenuIndicadores>

      <BreadCrumbStyle $isCollapsed={isCollapsed}>
              <nav>
                <ol>
                  <li>
                    <Link href="/indicadores/home_indicadores">Home</Link>
                    <span> / </span>
                  </li>
                  <li>
                    <span>Prestação de Serviços SNIS</span>
                  </li>
                </ol>
              </nav>
      </BreadCrumbStyle>

      <div style={{marginTop:"150px"}}>
      </div>

      
      <ContainerPs>
        <Ps1>
          <PsImage>
          <Image src={Geral} onClick={handleGeral} onMouseOver={titleOnMouse} onMouseOut={() => setShow(false)} alt="Geral" />
          {title === 'Geral' && show && (<TitlePsOnMouse>
          {title}
          </TitlePsOnMouse>)}
          </PsImage>
        </Ps1>
        <Ps2>
          <Ps5>
          <PsImage>
          <Image src={Financeiro} onClick={handleFinaceiro} onMouseOver={titleOnMouse} onMouseOut={() => setShow(false)}  alt="Financeiro" />
          {title === 'Financeiro' && show && (<TitlePsOnMouse>
          {title}
          </TitlePsOnMouse>)}
          </PsImage>
          </Ps5>
          <PsImageEsquerda>
            <Image src={Agua} onClick={handleAgua} onMouseOver={titleOnMouse} onMouseOut={() => setShow(false)} alt="Água" />
            {title === 'Água' && show && (<TitlePsOnMouse>
          {title}
          </TitlePsOnMouse>)}
          </PsImageEsquerda>
          <PsImageDireita>
          <Image src={Residuos} onClick={handleResiduosUnidade} onMouseOver={titleOnMouse} onMouseOut={() => setShow(false)} alt="Residuos" />
          {title === 'Residuos' && show && (<TitlePsOnMouse>
          {title}
          </TitlePsOnMouse>)}            
          </PsImageDireita>
          <Ps3>  
            <Ps3ImageEsquerda>
            <Image src={Esgoto} onClick={handleEsgoto} onMouseOver={titleOnMouse} onMouseOut={() => setShow(false)} alt="Esgoto" />
            {title === 'Esgoto' && show && (<TitlePsOnMouse>
          {title}
          </TitlePsOnMouse>)}               
            </Ps3ImageEsquerda>
            <Ps3ImageDireita>
            <Image src={Drenagem} onClick={handleDrenagem} onMouseOver={titleOnMouse} onMouseOut={() => setShow(false)} alt="Drenagem" />
            {title === 'Drenagem' && show && (<TitlePsOnMouse>
          {title}
          </TitlePsOnMouse>)} 
            </Ps3ImageDireita>    
          </Ps3>          
        </Ps2>
        <Ps1></Ps1>
        <Ps4>
        <Ps3ImageEsquerda>
              <Image src={Qualidade} onClick={handleQualidade} onMouseOver={titleOnMouse} onMouseOut={() => setShow(false)} alt="Qualidade" />
              {title === 'Qualidade' && show && (<TitlePsOnMouse>
          {title}
          </TitlePsOnMouse>)} 
            </Ps3ImageEsquerda>
            <Ps3ImageDireita>
              <Image src={Balanco} onClick={handleBalanco} onMouseOver={titleOnMouse} onMouseOut={() => setShow(false)} alt="Balanco" />
              {title === 'Balanco' && show && (<TitlePsOnMouse>
          {title}
          </TitlePsOnMouse>)} 
            </Ps3ImageDireita>
        </Ps4>
        <Ps1>
          <PsImage>
            <Image src={Tarifas} onClick={handleTarifa} onMouseOver={titleOnMouse} onMouseOut={() => setShow(false)} alt="Tarifas" />
            {title === 'Tarifas' && show && (<TitlePsOnMouse>
          {title}
          </TitlePsOnMouse>)} 
            </PsImage>
          </Ps1>
      </ContainerPs>
      
  
    </Container>
  );
}

