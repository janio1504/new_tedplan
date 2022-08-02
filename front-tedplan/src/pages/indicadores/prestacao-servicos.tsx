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
  //titular dos serviços municipais de saneamento
  id_titular_servicos_ms: string;
  ts_setor_responsavel: string;
  ts_telefone_comercial: string;
  ts_responsavel: string;
  ts_cargo: string;
  ts_telefone: string;
  ts_email: string;

  //prestador do serviço de seneamento basico
  //abastecimento de agua
  id_ps_abastecimento_agua: string;
  aa_abrangencia: string;
  aa_natureza_juridica: string;
  aa_cnpj: string;
  aa_telefone: string;
  aa_cep: string;
  aa_endereco: string;
  aa_numero: string;
  aa_bairro: string;
  aa_responsavel: string;
  aa_cargo: string;
  aa_email: string;
  aa_secretaria_setor_responsavel: string;

  //esgotamento sanitario
  id_ps_esgotamento_sanitario: string;
  es_secretaria_setor_responsavel: string;
  es_abrangencia: string;
  es_natureza_juridica: string;
  es_cnpj: string;
  es_telefone: string;
  es_cep: string;
  es_endereco: string;
  es_numero: string;
  es_bairro: string;
  es_responsavel: string;
  es_cargo: string;
  es_email: string;
  //drenagem e àguas pluvias
  id_ps_drenagem_aguas_pluviais: string;
  da_secretaria_setor_responsavel: string;
  da_abrangencia: string;
  da_natureza_juridica: string;
  da_cnpj: string;
  da_telefone: string;
  da_cep: string;
  da_endereco: string;
  da_numero: string;
  da_bairro: string;
  da_responsavel: string;
  da_cargo: string;
  da_email: string;
  //Resíduos Sólidos
  id_ps_residuo_solido: string;
  rs_secretaria_setor_responsavel: string;
  rs_abrangencia: string;
  rs_natureza_juridica: string;
  rs_cnpj: string;
  rs_telefone: string;
  rs_cep: string;
  rs_endereco: string;
  rs_numero: string;
  rs_bairro: string;
  rs_responsavel: string;
  rs_cargo: string;
  rs_email: string;

  //Regulador e Fiscalizador dos Serviços de Saneamento
  id_regulador_fiscalizador_ss: string;
  rf_setor_responsavel: string;
  rf_telefone_comercial: string;
  rf_responsavel: string;
  rf_cargo: string;
  rf_telefone: string;
  rf_email: string;
  rf_descricao: string;

  //Controle Social dos Serços Municipais de Saneamento
  id_controle_social_sms: string;
  setor_responsavel_cs_sms: string;
  telefone_cs_sms: string;
  email_cs_sms: string;

  //Responsável pelo SIMISAB
  id_responsavel_simisab: string;
  simisab_responsavel: string;
  simisab_telefone: string;
  simisab_email: string;

  //Dados demográficos
  id_dados_demograficos: string;
  dd_populacao_urbana: string;
  dd_populacao_rural: string;
  dd_populacao_total: string;
  dd_total_moradias: string;
}

interface MunicipioProps {
  municipio: IMunicipio[];
}

export default function HomeIndicadores({ municipio }: MunicipioProps) {
  const { usuario, signOut } = useContext(AuthContext);
  const [isMunicipio, setMunicipio] = useState("");
  useEffect(() => {
    municipio.map((value) => {
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
    Router.push("/indicadores/gestao");
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
  

  return (
    <Container>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuMunicipio>
        <Municipio>Bem vindos Municipio de {isMunicipio}</Municipio>
        <MenuMunicipioItem>
          <ul>
            <li onClick={handleGestao}>Gestão</li>
            <li onClick={handleIndicadores}>Indicadores</li>
            <li onClick={handleSignOut}>Manuais</li>
            <li onClick={handleReporte}>Relatorios</li>
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
