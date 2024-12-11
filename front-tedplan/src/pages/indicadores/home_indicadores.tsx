import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  DivMenu,
  DivBotao,
  BotaoMenu,
  DivCenter,
  DivConteudo,
  DivColRelatorios,
  MenuMunicipio,
  MunicipioDireita,
  Municipio,
  StatusMunicipio,
  MenuMunicipioItem,
} from "../../styles/indicadores";
import HeadIndicadores from "../../components/headIndicadores";
import MenuIndicadores from "../../components/MenuIndicadoresCadastro";
import Router from "next/router";
import { parseCookies } from "nookies";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../services/api";
import { GetServerSideProps } from "next";
import { getAPIClient } from "../../services/axios";
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

export default function HomeIndicadores() {
  const { usuario, signOut } = useContext(AuthContext)
  const [ nomeMunicipio, setNomeMunicipio] = useState<IMunicipio | undefined>()
  useEffect(()=>{
   getMunicipio()
  },[usuario])
  
  
   async function getMunicipio(){
    const res = await api.get("getMunicipio", {params: {id_municipio: usuario?.id_municipio}});
    const municipio = await res.data;
    if(municipio[0]){
      setNomeMunicipio(municipio[0].municipio_nome)
    }
    
   }
     
  return (
    <Container>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuHorizontal municipio={nomeMunicipio}></MenuHorizontal>
      <StatusMunicipio>
        Relatório SIMISAB correspondente ao ano {new Date().getFullYear()} - Estado PENDENTE
      </StatusMunicipio>
      <MenuIndicadores></MenuIndicadores>
      <DivConteudo>
        <DivColRelatorios>
    
        </DivColRelatorios>
        <DivColRelatorios>
          
        </DivColRelatorios>
        <DivColRelatorios>
          
        </DivColRelatorios>
      </DivConteudo>
    </Container>
  );
}




