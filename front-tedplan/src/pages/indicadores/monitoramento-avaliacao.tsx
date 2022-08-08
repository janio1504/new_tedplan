/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  DivConteudo,
  DivColRelatorios,
  MenuMunicipio,
  Municipio,
  MenuMunicipioItem,
  DivRelatorios,
  DivBotaoMenu,
  BaixarRelatorio,
  TituloRelatorios,
} from "../../styles/indicadores";
import Image from "next/image";
import HeadIndicadores from "../../components/headIndicadores";
import MenuIndicadores from "../../components/MenuIndicadores";
import Router from "next/router";
import { parseCookies } from "nookies";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../services/api";
import { GetServerSideProps } from "next";
import { getAPIClient } from "../../services/axios";
import { cadastroPDF } from "../../reports/Cadastro/cadastro"
import { prestacaoServicos } from "../../reports/PrestacaoServicos/prestacaoServicos"
import { DivCenter, DivForm, DivTituloForm } from "../../styles/financeiro";
import PrestacaoServicos from "../../img/icone_servicos.png"
import Gestao from "../../img/icone_gestao.png"
import Cadastro from "../../img/icone_cadastro.png"
import MenuHorizontal from "../../components/MenuHorizontal";

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


export default function Monitoramento({ municipio }: MunicipioProps) {
  const { usuario, signOut } = useContext(AuthContext);
  const [nomeMunicipio, setMunicipio] = useState("");
  const [dadosMunicipio, setDadosMunicipio] = useState(null);
  const [dadosGeral, setDadosGeral] = useState(null);
  const [concessionarias, setConcessionarias] = useState(null);
  const [financeiro, setFinanceiro] = useState(null);
  const [dadosAgua, setDadosAgua] = useState(null);
  useEffect(() => {
    setDadosMunicipio(municipio[0]);
    
     municipio.map((value) => {
      setMunicipio(value.municipio_nome);
    });
    getDadosGerais()
    getConcessionarias()
    getDadosFinanceiros()
    getDadosAgua()
  }, [municipio]);

  async function getDadosGerais(){
    const id_municipio = municipio[0].id_municipio
    const ano = new Date().getFullYear()
    const resCad = await api
      .post("get-geral", { id_municipio: id_municipio, ano: ano })
      .then((response) => {
        setDadosGeral(response.data[0])
      })
      .catch((error) => {      
        console.log(error);
      });
  }

  async function getDadosAgua() {  
    const id_municipio = municipio[0].id_municipio
    const ano = new Date().getFullYear()  
    const res = await api
      .post("get-agua", {id_municipio: id_municipio, ano: ano})
      .then((response) => {        
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });

      setDadosAgua(res[0])
  }
  async function getConcessionarias(){
    const id_municipio = municipio[0].id_municipio
    const ano = new Date().getFullYear()
    const resCad = await api
      .post("get-concessionarias", { id_municipio: id_municipio, ano: ano})
      .then((response) => {       
        setConcessionarias(response.data)
      })
      .catch((error) => {    
        console.log(error);
      });
  }

  async function getDadosFinanceiros(){
    const id_municipio = municipio[0].id_municipio
    const ano = new Date().getFullYear()
    const resCad = await api
      .post("getPsFinanceiro", { id_municipio: id_municipio, ano: ano})
      .then((response) => {         
        setFinanceiro(response.data[0])
      })
      .catch((error) => {    
        console.log(error);
      });
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
    Router.push("/indicadores/gestao"); 
  }

  

  return (
    <Container>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuHorizontal municipio={municipio[0].municipio_nome}></MenuHorizontal>
      <MenuIndicadores></MenuIndicadores>
      <DivCenter>
        <DivForm>
          <DivTituloForm>Relatórios Atuais</DivTituloForm>
            
        <DivRelatorios> 
      
        <DivColRelatorios>
          <TituloRelatorios>
            <p>Módulo de</p>
              CADASTRO
          </TituloRelatorios>
        <Image src={Cadastro} alt='Cadastro' />
        <BaixarRelatorio onClick={()=>cadastroPDF(dadosMunicipio)}>Baixar</BaixarRelatorio>
        </DivColRelatorios>
        <DivColRelatorios>
          <TituloRelatorios>
            <p>Módulo de</p>
              GESTÃO
          </TituloRelatorios> 
            <Image src={Gestao} alt='Gestão' />
            <BaixarRelatorio onClick={()=>cadastroPDF(dadosMunicipio)}>Baixar</BaixarRelatorio>
        </DivColRelatorios>
        <DivColRelatorios>
          <TituloRelatorios>
            <p>Módulo de</p>
              PRESTAÇÃO DE SERVIÇOS
          </TituloRelatorios>
          <Image src={PrestacaoServicos} alt='Prestação de Serviços' />
          <BaixarRelatorio onClick={()=>prestacaoServicos(dadosGeral,
             concessionarias, financeiro, dadosAgua)}>Baixar</BaixarRelatorio>
        </DivColRelatorios>
        
        </DivRelatorios>
      
        </DivForm>
      </DivCenter>
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
