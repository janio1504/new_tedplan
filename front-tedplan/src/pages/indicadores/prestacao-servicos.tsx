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
} from "../../styles/indicadores";
import HeadIndicadores from "../../components/headIndicadores";
import MenuIndicadores from "../../components/MenuIndicadoresCadastro";
import Router from "next/router";
import { parseCookies } from "nookies";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../services/api";
import { GetServerSideProps } from "next";
import { getAPIClient } from "../../services/axios";
import Agua from "../../img/agua.png"
import Drenagem from "../../img/drenagem.png"
import Esgoto from "../../img/esgoto.png"
import Modelo from "../../img/modelo_home_prestacao_servicoes.png"
import Residuos from "../../img/residuos.png"
import Institucional from "../../img/user_mun.png"
import MenuHorizontal from "../../components/MenuHorizontal";
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

export default function PrestacaoServicos({ Imunicipio }: MunicipioProps) {
  const { usuario, signOut, isAuthenticated } = useContext(AuthContext);
  const [municipio, setMunicipio] = useState<IMunicipio>(null);
  const [isCollapsed, setIsCollapsed] = useState(false)
  
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
    Router.push("/indicadores/prestacao-servico-agua");
  }
  async function handleEsgoto() {
    Router.push("/indicadores/prestacao-servico-esgoto");
  }
  async function handleDrenagem() {
    Router.push("/indicadores/prestacao-servico-drenagem");
  }
  async function handleResiduosColeta() {
    Router.push("/indicadores/residuos-indicadores-coleta");
  }
  async function handleResiduosUnidade() {
    Router.push("/indicadores/prestacao-servico-residuos");
  }
  async function handleInstitucional() {
    Router.push("/indicadores/prestacao-servico-institucional");
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
  width: 100%;
  height: 350px;
  margin: 0 auto;
  top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media(max-width: 768px) {
    
  }
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
                    <span>Prestação de Serviços</span>
                  </li>
                </ol>
              </nav>
        </BreadCrumbStyle>
      

      <CircularContainer>

  <CenterIcon>
    <Image
      onClick={handleInstitucional}
      src={Institucional}
      width={120}
      onMouseOver={titleOnMouse}
      onMouseOut={() => setShow(false)} 
      height={120}
      alt="Institucional"/>
      {title === 'Institucional' && show && (<TitlePsOnMouse>
            {title} 
          </TitlePsOnMouse>)}
      
  </CenterIcon>

  <div style={{ position: "relative", width: 500, height: 500 }}>
  <Image 
  src={Modelo} 
  width={500} 
  height={500} 
  alt="Logo" 
  />
  
           
  <div
  style={{
    position: "absolute",
    left: 20,
    top: 20,
    width: 100,
    height: 100,
    cursor: "pointer",
    background: "rgba(0,0,0,0.0)"
  }}
  onClick={handleAgua}
  onMouseOver={() => { setTitle('Água'); setShow(true); }}
  onMouseOut={() => setShow(false)}
>
  {title === 'Água' && show && (
    <div style={{
      position: "absolute",
      top: -28,
      left: "50%",
      transform: "translateX(-50%)",
      background: "#f9f9f9",
      boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.2)",
      padding: "12px 16px",
      borderRadius: "5px",
      color: '#053d68',
      fontSize: '16px',
      textAlign: 'left',
      zIndex: 10
    }}>
      {title}
    </div>
  )}
  </div>



  <div
    style={{
      position: "absolute",
      left: 380,
      top: 380,
      width: 100,
      height: 100,
      cursor: "pointer",
      background: "rgba(0,0,0,0.0)"
    }}
    onClick={handleEsgoto}
    onMouseOver={() => { setTitle('Esgoto'), setShow(true); }}
    onMouseOut={() => setShow(false)}> 

      {title === 'Esgoto' && show && (
    <div style={{
      position: "absolute",
      top: -28,
      left: "50%",
      transform: "translateX(-50%)",
      background: "#f9f9f9",
      boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.2)",
      padding: "12px 16px",
      borderRadius: "5px",
      color: '#053d68',
      fontSize: '16px',
      textAlign: 'left',
      zIndex: 10
    }}>
      {title}
    </div>
  )}
  </div>
      

 
  <div
    style={{
      position: "absolute",
      left: 380,
      top: 20,
      width: 100,
      height: 100,
      cursor: "pointer",
      background: "rgba(0,0,0,0.0)"
    }}
    onClick={handleDrenagem}
    onMouseOver={() => { setTitle('Drenagem'); setShow(true); }}
    onMouseOut={() => setShow(false)} >
    {title === 'Drenagem' && show && (
    <div style={{
      position: "absolute",
      top: -28,
      left: "50%",
      transform: "translateX(-50%)",
      background: "#f9f9f9",
      boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.2)",
      padding: "12px 16px",
      borderRadius: "5px",
      color: '#053d68',
      fontSize: '16px',
      textAlign: 'left',
      zIndex: 10
    }}>
      {title}
    </div>
  )}
  </div>
  
  <div
    style={{
      position: "absolute",
      left: 20,
      top: 380,
      width: 100,
      height: 100,
      cursor: "pointer",
      background: "rgba(0,0,0,0.0)"
    }}
    onClick={handleResiduosUnidade}
    onMouseOver={() => { setTitle('Resíduos'); setShow(true); }}
    onMouseOut={() => setShow(false)} >

      {title === 'Resíduos' && show && (
    <div style={{
      position: "absolute",
      top: -28,
      left: "50%",
      transform: "translateX(-50%)",
      background: "#f9f9f9",
      boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.2)",
      padding: "12px 16px",
      borderRadius: "5px",
      color: '#053d68',
      fontSize: '16px',
      textAlign: 'left',
      zIndex: 10
    }}>
      {title}
    </div>
  )}
  </div>
</div>
      </CircularContainer>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = getAPIClient(ctx);
  const { ["tedplan.token"]: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  try {
    const response = await apiClient.get("getMunicipio", {
      params: { id_municipio: ctx.query.id_municipio },
    });

    return {
      props: {
        Imunicipio: response.data,
      },
    };
  } catch (error) {
    return {
      props: {
        Imunicipio: [],
      },
    };
  }
};
