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
} from "../../styles/indicadores";
import HeadIndicadores from "../../components/headIndicadores";
import MenuIndicadores from "../../components/MenuIndicadores";
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



export default function HomeIndicadores({ municipio }: MunicipioProps) {
  const { usuario, signOut } = useContext(AuthContext);
  const [isMunicipio, setMunicipio] = useState("");
  
  useEffect(() => {
    municipio?.map((value) => {
      setMunicipio(value.municipio_nome);
    });
    
  }, [municipio]);

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

  return (
    <Container>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuMunicipio>
        <Municipio>Bem vindos Municipio de {isMunicipio}</Municipio>
        <MenuMunicipioItem>
          <ul>
            <li onClick={handleGestao}>Gestão</li>
            <li onClick={handleIndicadores}>Indicadores</li>
            <li onClick={handleManuais}>Manuais</li>
            <li onClick={handleReporte}>Relatórios</li>
            <li onClick={handleSignOut}>Sair</li>
          </ul>
        </MenuMunicipioItem>
      </MenuMunicipio>

      <MenuIndicadores></MenuIndicadores>
      <ContainerPs>
        <Ps1>
          <PsImage>
          <Image src={Geral} onClick={handleGeral} alt="Geral" />
          </PsImage>
        </Ps1>
        <Ps2>
         
          <Ps5>
          <PsImage>
          <Image src={Financeiro} onClick={handleFinaceiro} alt="Financeiro" />
          </PsImage>
          </Ps5>
          <PsImageEsquerda>
            <Image src={Agua} onClick={handleAgua} alt="Agua" />
          </PsImageEsquerda>
          <PsImageDireita>
          <Image src={Residuos} onClick={handleResiduosColeta} alt="Residuos" />            
          </PsImageDireita>
          <Ps3>  
            <Ps3ImageEsquerda>
            <Image src={Esgoto} onClick={handleEsgoto} alt="Esgoto" />              
            </Ps3ImageEsquerda>
            <Ps3ImageDireita>
            <Image src={Drenagem} onClick={handleDrenagem} alt="Drenagem" />
            </Ps3ImageDireita>    
          </Ps3>          
        </Ps2>
        <Ps1></Ps1>
        <Ps4>
        <Ps3ImageEsquerda>
              <Image src={Qualidade} onClick={handleQualidade} alt="Qualidade" />
            </Ps3ImageEsquerda>
            <Ps3ImageDireita>
              <Image src={Balanco} onClick={handleBalanco} alt="Balanco" />
            </Ps3ImageDireita>
        </Ps4>
        <Ps1>
          <PsImage>
            <Image src={Tarifas} onClick={handleTarifa} alt="Tarifas" />
            </PsImage>
          </Ps1>
      </ContainerPs>
     
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<MunicipioProps> = async (
  ctx
) => {
  const apiClient = getAPIClient(ctx);
  const { ["tedplan.token"]: token } = parseCookies(ctx);
  const { ["tedplan.id_usuario"]: id_usuario } = parseCookies(ctx);
  if (!token) {
    return {
      redirect: {
        destination: "/login_indicadores",
        permanent: false,
      },
    };
  }

  const resUsuario = await apiClient.get("getUsuario", {
    params: { id_usuario: id_usuario },
  });
  const usuario = await resUsuario.data;

  const res = await apiClient.get("getMunicipio", {
    params: { id_municipio: usuario[0].id_municipio },
  });
  const municipio = await res.data;

  return {
    props: {
      municipio,
    },
  };
};
