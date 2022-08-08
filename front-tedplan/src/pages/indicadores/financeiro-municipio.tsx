import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import {
  Container,
  DivCenter,
  DivForm,
  DivTituloForm, 
  Form,
  InputP,
  InputM,
  SubmitButton,
  MenuMunicipio,
  Municipio,
  MenuMunicipioItem,
  DivTitulo,
  DivFormEixo,
  DivTituloEixo,
  DivFormConteudo,
  DivTituloConteudo,
  InputGG,
  DivSeparadora,
  InputSNIS,
  InputXL,
  InputAno,
} from "../../styles/financeiro";
import HeadIndicadores from "../../components/headIndicadores";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";
import { getAPIClient } from "../../services/axios";
import MenuIndicadores from "../../components/MenuIndicadores";
import { toast, ToastContainer } from 'react-nextjs-toast'
import { GetServerSideProps } from "next";
import Router from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import CurrencyInput from 'react-currency-masked-input'
import { parseCookies } from "nookies";
import api from "../../services/api";
import MenuHorizontal from "../../components/MenuHorizontal";

interface IMunicipio {
  id_municipio: string;
  municipio_codigo_ibge: string;
  municipio_nome: string;
}

interface MunicipioProps {
  municipio: IMunicipio[];
}

export default function Financeiro({ municipio }: MunicipioProps) {
  const { usuario, signOut } = useContext(AuthContext);
  const [isMunicipio, setMunicipio] = useState<IMunicipio | any>(municipio);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [content, setContent] = useState("");
  const [contentForEditor, setContentForEditor] = useState(null);
  const [contentSR, setContentSR] = useState("");
  const [dadosMunicipio, setDadosMunicipio] = useState<IMunicipio | any>(municipio);
  const [dadosFinanceiros, setDadosFinanceiros] = useState(null);

  useEffect(() => {   
    
      setDadosMunicipio(municipio[0])
      getFinaceiroMunicipio()
  }, [municipio]);
 

  function handleOnChange(content) {
    setContent(content);
  }
 

  async function handleCadastro(data) {

    // CALCULO DA FORMULAS DO SNIS
    // AGUA E ESGOTO
    data.AES_FN005 = (data.AES_FN003 ? parseFloat((data.AES_FN003).replace('.','').replace(',','.')) : dadosFinanceiros?.aes_fn003 ? parseFloat(dadosFinanceiros?.aes_fn003) : 0)
    + (data.FN002 ? parseFloat((data.FN002).replace('.','').replace(',','.')) : dadosFinanceiros?.fn002 ?  parseFloat(dadosFinanceiros?.fn002) : 0 )
   + (data.FN007 ? parseFloat((data.FN007).replace('.','').replace(',','.')) : dadosFinanceiros?.fn007 ?  parseFloat(dadosFinanceiros?.fn007) : 0 )
   + (data.FN038 ? parseFloat((data.FN038).replace('.','').replace(',','.')) : dadosFinanceiros?.fn038 ?  parseFloat(dadosFinanceiros?.fn038) : 0 )
   + (data.AES_FN004 ? parseFloat((data.AES_FN004).replace('.','').replace(',','.')) : dadosFinanceiros?.aes_fn004 ?  parseFloat(dadosFinanceiros?.aes_fn004) : 0 )
    console.log(data.AES_FN005);
       
    
    data.AES_FN001 = (data.FN002 ? parseFloat((data.FN002).replace('.','').replace(',','.')) : dadosFinanceiros?.aes_fn002 ?  parseFloat(dadosFinanceiros?.aes_fn002) : 0)
    + (data.AES_FN003 ? parseFloat((data.AES_FN003).replace('.','').replace(',','.')) : dadosFinanceiros?.aes_fn003 ?  parseFloat(dadosFinanceiros?.aes_fn003) : 0 )
    + (data.FN007 ? parseFloat((data.FN007).replace('.','').replace(',','.')) : dadosFinanceiros?.fn007 ?  parseFloat(dadosFinanceiros?.fn007) : 0 )
    + (data.FN038 ? parseFloat((data.FN038).replace('.','').replace(',','.')) : dadosFinanceiros?.fn038 ?  parseFloat(dadosFinanceiros?.fn038) : 0 )
     
    data.AES_FN015 = (data.FN010 ? parseFloat((data.FN010).replace('.','').replace(',','.')) : dadosFinanceiros?.fn010 ?  parseFloat(dadosFinanceiros?.fn010) : 0)
    + (data.FN011 ? parseFloat((data.FN011).replace('.','').replace(',','.')) : dadosFinanceiros?.fn011 ?  parseFloat(dadosFinanceiros?.fn011) : 0 )
    + (data.FN013 ? parseFloat((data.FN013).replace('.','').replace(',','.')) : dadosFinanceiros?.fn013 ?  parseFloat(dadosFinanceiros?.fn013) : 0 )
    + (data.FN014 ? parseFloat((data.FN014).replace('.','').replace(',','.')) : dadosFinanceiros?.fn014 ?  parseFloat(dadosFinanceiros?.fn014) : 0 )
    + (data.AES_FN020 ? parseFloat((data.AES_FN020).replace('.','').replace(',','.')) : dadosFinanceiros?.aes_fn020 ?  parseFloat(dadosFinanceiros?.aes_fn020) : 0 )
    + (data.FN039 ? parseFloat((data.FN039).replace('.','').replace(',','.')) : dadosFinanceiros?.fn039 ?  parseFloat(dadosFinanceiros?.fn039) : 0 )
    + (data.AES_FN021 ? parseFloat((data.AES_FN021).replace('.','').replace(',','.')) : dadosFinanceiros?.aes_fn021 ?  parseFloat(dadosFinanceiros?.aes_fn021) : 0 )
    + (data.FN027 ? parseFloat((data.FN027).replace('.','').replace(',','.')) : dadosFinanceiros?.fn027 ?  parseFloat(dadosFinanceiros?.fn027) : 0 )
    //console.log(data.AES_FN015);    

    data.FN017 = (data.AES_FN015 ? data.AES_FN015 : dadosFinanceiros?.aes_fn015 ?  parseFloat(dadosFinanceiros?.aes_fn015) : 0)
    + (data.FN035 ? parseFloat((data.FN035).replace('.','').replace(',','.')) : dadosFinanceiros?.fn035 ?  parseFloat(dadosFinanceiros?.fn035) : 0 )
    + (data.FN036 ? parseFloat((data.FN036).replace('.','').replace(',','.')) : dadosFinanceiros?.fn036 ?  parseFloat(dadosFinanceiros?.fn036) : 0 )
    + (data.FN019 ? parseFloat((data.FN019).replace('.','').replace(',','.')) : dadosFinanceiros?.fn019 ?  parseFloat(dadosFinanceiros?.fn019) : 0 )
    + (data.AES_FN022 ? parseFloat((data.AES_FN022).replace('.','').replace(',','.')) : dadosFinanceiros?.aes_fn022 ?  parseFloat(dadosFinanceiros?.aes_fn022) : 0 )
    + (data.FN028 ? parseFloat((data.FN028).replace('.','').replace(',','.')) : dadosFinanceiros?.fn028 ?  parseFloat(dadosFinanceiros?.fn028) : 0 )
   
    data.FN016 = (data.FN035 ? parseFloat((data.FN035).replace('.','').replace(',','.')) : dadosFinanceiros?.fn035 ?  parseFloat(dadosFinanceiros?.fn035) : 0)
    + (data.FN036 ? parseFloat((data.FN036).replace('.','').replace(',','.')) : dadosFinanceiros?.fn036 ?  parseFloat(dadosFinanceiros?.fn036) : 0 )
  
    data.FN037 = (data.FN017 ? data.FN017 : dadosFinanceiros?.fn017 ?  parseFloat(dadosFinanceiros?.fn017) : 0)
    + (data.FN034 ? parseFloat((data.FN034).replace('.','').replace(',','.')) : dadosFinanceiros?.fn034 ?  parseFloat(dadosFinanceiros?.fn034) : 0 )

    data.FN033 = (data.FN030 ? parseFloat((data.FN030).replace('.','').replace(',','.')) : dadosFinanceiros?.fn030 ?  parseFloat(dadosFinanceiros?.fn030) : 0)
    + (data.FN031 ? parseFloat((data.FN031).replace('.','').replace(',','.')) : dadosFinanceiros?.fn031 ?  parseFloat(dadosFinanceiros?.fn011) : 0 )
    + (data.FN032 ? parseFloat((data.FN032).replace('.','').replace(',','.')) : dadosFinanceiros?.fn032 ?  parseFloat(dadosFinanceiros?.fn032) : 0 )
    + (data.FN018 ? parseFloat((data.FN018).replace('.','').replace(',','.')) : dadosFinanceiros?.fn018 ?  parseFloat(dadosFinanceiros?.fn018) : 0 )
    + (data.AES_FN023 ? parseFloat((data.AES_FN023).replace('.','').replace(',','.')) : dadosFinanceiros?.aes_fn023 ?  parseFloat(dadosFinanceiros?.aes_fn023) : 0 )
    + (data.AES_FN024 ? parseFloat((data.AES_FN024).replace('.','').replace(',','.')) : dadosFinanceiros?.aes_fn024 ?  parseFloat(dadosFinanceiros?.aes_fn024) : 0 )
    + (data.FN025 ? parseFloat((data.FN025).replace('.','').replace(',','.')) : dadosFinanceiros?.fn025 ?  parseFloat(dadosFinanceiros?.fn025) : 0 )
   

    data.FN048 = (data.FN041 ? parseFloat((data.FN041).replace('.','').replace(',','.')) : dadosFinanceiros?.fn041 ?  parseFloat(dadosFinanceiros?.fn041) : 0)
    + (data.FN042 ? parseFloat((data.FN042).replace('.','').replace(',','.')) : dadosFinanceiros?.fn042 ?  parseFloat(dadosFinanceiros?.fn042) : 0 )
    + (data.FN043 ? parseFloat((data.FN043).replace('.','').replace(',','.')) : dadosFinanceiros?.fn043 ?  parseFloat(dadosFinanceiros?.fn043) : 0 )
    + (data.FN044 ? parseFloat((data.FN044).replace('.','').replace(',','.')) : dadosFinanceiros?.fn044 ?  parseFloat(dadosFinanceiros?.fn044) : 0 )
    + (data.FN045 ? parseFloat((data.FN045).replace('.','').replace(',','.')) : dadosFinanceiros?.fn045 ?  parseFloat(dadosFinanceiros?.fn045) : 0 )
    + (data.FN046 ? parseFloat((data.FN046).replace('.','').replace(',','.')) : dadosFinanceiros?.fn046 ?  parseFloat(dadosFinanceiros?.fn046) : 0 )
    + (data.FN047 ? parseFloat((data.FN047).replace('.','').replace(',','.')) : dadosFinanceiros?.fn047 ?  parseFloat(dadosFinanceiros?.fn047) : 0 )


    data.FN058 = (data.FN051 ? parseFloat((data.FN051).replace('.','').replace(',','.')) : dadosFinanceiros?.fn041 ?  parseFloat(dadosFinanceiros?.fn041) : 0)
    + (data.FN052 ? parseFloat((data.FN052).replace('.','').replace(',','.')) : dadosFinanceiros?.fn052 ?  parseFloat(dadosFinanceiros?.fn052) : 0 )
    + (data.FN053 ? parseFloat((data.FN053).replace('.','').replace(',','.')) : dadosFinanceiros?.fn053 ?  parseFloat(dadosFinanceiros?.fn053) : 0 )
    + (data.FN054 ? parseFloat((data.FN054).replace('.','').replace(',','.')) : dadosFinanceiros?.fn054 ?  parseFloat(dadosFinanceiros?.fn054) : 0 )
    + (data.FN055 ? parseFloat((data.FN055).replace('.','').replace(',','.')) : dadosFinanceiros?.fn055 ?  parseFloat(dadosFinanceiros?.fn055) : 0 )
    + (data.FN056 ? parseFloat((data.FN056).replace('.','').replace(',','.')) : dadosFinanceiros?.fn056 ?  parseFloat(dadosFinanceiros?.fn056) : 0 )
    + (data.FN057 ? parseFloat((data.FN057).replace('.','').replace(',','.')) : dadosFinanceiros?.fn057 ?  parseFloat(dadosFinanceiros?.fn057) : 0 )
   

    // DRENAGEM

    data.FN009 = (data.FN005 ? parseFloat((data.FN005).replace('.','').replace(',','.')) : dadosFinanceiros?.fn005 ?  parseFloat(dadosFinanceiros?.fn005) : 0)
    + (data.FN008 ? parseFloat((data.FN008).replace('.','').replace(',','.')) : dadosFinanceiros?.fn008 ?  parseFloat(dadosFinanceiros?.fn008) : 0 )


    data.FN016 = (data.FN013 ? parseFloat((data.FN013).replace('.','').replace(',','.')) : dadosFinanceiros?.fn013 ?  parseFloat(dadosFinanceiros?.fn013) : 0)
    + (data.FN015 ? parseFloat((data.FN015).replace('.','').replace(',','.')) : dadosFinanceiros?.fn015 ?  parseFloat(dadosFinanceiros?.fn015) : 0 )


    data.FN022 = (data.FN024 ? parseFloat((data.FN024).replace('.','').replace(',','.')) : dadosFinanceiros?.fn024 ?  parseFloat(dadosFinanceiros?.fn024) : 0)
    + (data.FN018 ? parseFloat((data.FN018).replace('.','').replace(',','.')) : dadosFinanceiros?.fn018 ?  parseFloat(dadosFinanceiros?.fn018) : 0 )
    + (data.FN020 ? parseFloat((data.FN020).replace('.','').replace(',','.')) : dadosFinanceiros?.fn020 ?  parseFloat(dadosFinanceiros?.fn020) : 0 )

    data.FN023 = (data.FN017 ? data.FN017 : dadosFinanceiros?.fn017 ?  parseFloat(dadosFinanceiros?.fn017) : 0)
    + (data.FN019 ? parseFloat((data.FN019).replace('.','').replace(',','.')) : dadosFinanceiros?.fn019 ?  parseFloat(dadosFinanceiros?.fn019) : 0 )
    + (data.FN021 ? parseFloat((data.FN021).replace('.','').replace(',','.')) : dadosFinanceiros?.fn021 ?  parseFloat(dadosFinanceiros?.fn021) : 0 )


    //RESIDUOS SÓLIDOS

    data.FN208 = (data.FN206 ? parseFloat((data.FN206).replace('.','').replace(',','.')) : dadosFinanceiros?.fn206 ?  parseFloat(dadosFinanceiros?.fn206) : 0)
    + (data.FN207 ? parseFloat((data.FN207).replace('.','').replace(',','.')) : dadosFinanceiros?.fn207 ?  parseFloat(dadosFinanceiros?.fn207) : 0 )
   
    data.FN0211 = (data.FN209 ? parseFloat((data.FN209).replace('.','').replace(',','.')) : dadosFinanceiros?.fn209 ?  parseFloat(dadosFinanceiros?.fn209) : 0)
    + (data.FN210 ? parseFloat((data.FN210).replace('.','').replace(',','.')) : dadosFinanceiros?.fn210 ?  parseFloat(dadosFinanceiros?.fn210) : 0 )

    data.FN0214 = (data.FN212 ? parseFloat((data.FN213).replace('.','').replace(',','.')) : dadosFinanceiros?.fn212 ?  parseFloat(dadosFinanceiros?.fn212) : 0)
    + (data.FN213 ? parseFloat((data.FN213).replace('.','').replace(',','.')) : dadosFinanceiros?.fn213 ?  parseFloat(dadosFinanceiros?.fn213) : 0 )
     
    data.FN0217 = (data.FN216 ? parseFloat((data.FN216).replace('.','').replace(',','.')) : dadosFinanceiros?.fn216 ?  parseFloat(dadosFinanceiros?.fn216) : 0)
    + (data.FN215 ? parseFloat((data.FN215).replace('.','').replace(',','.')) : dadosFinanceiros?.fn215 ?  parseFloat(dadosFinanceiros?.fn215) : 0 )
     
    data.FN0218 = (data.FN208 ? data.FN208 : dadosFinanceiros?.fn208 ?  parseFloat(dadosFinanceiros?.fn208) : 0)
    + (data.FN211 ? parseFloat((data.FN211).replace('.','').replace(',','.')) : dadosFinanceiros?.fn211 ?  parseFloat(dadosFinanceiros?.fn211) : 0 )
    + (data.FN214 ? parseFloat((data.FN214).replace('.','').replace(',','.')) : dadosFinanceiros?.fn214 ?  parseFloat(dadosFinanceiros?.fn214) : 0 )
    + (data.FN217 ? parseFloat((data.FN217).replace('.','').replace(',','.')) : dadosFinanceiros?.fn217 ?  parseFloat(dadosFinanceiros?.fn217) : 0 )
     
    data.FN0219 = (data.FN206 ? parseFloat((data.FN206).replace('.','').replace(',','.')) : dadosFinanceiros?.fn206 ?  parseFloat(dadosFinanceiros?.fn206) : 0)
    + (data.FN209 ? parseFloat((data.FN209).replace('.','').replace(',','.')) : dadosFinanceiros?.fn209 ?  parseFloat(dadosFinanceiros?.fn209) : 0 )
    + (data.FN212 ? parseFloat((data.FN212).replace('.','').replace(',','.')) : dadosFinanceiros?.fn212 ?  parseFloat(dadosFinanceiros?.fn212) : 0 )
    + (data.FN216 ? parseFloat((data.FN216).replace('.','').replace(',','.')) : dadosFinanceiros?.fn216 ?  parseFloat(dadosFinanceiros?.fn216) : 0 )
     
    data.FN0220 = (data.FN207 ? parseFloat((data.FN207).replace('.','').replace(',','.')) : dadosFinanceiros?.fn207 ?  parseFloat(dadosFinanceiros?.fn207) : 0)
    + (data.FN210 ? parseFloat((data.FN210).replace('.','').replace(',','.')) : dadosFinanceiros?.fn210 ?  parseFloat(dadosFinanceiros?.fn210) : 0 )
    + (data.FN213 ? parseFloat((data.FN213).replace('.','').replace(',','.')) : dadosFinanceiros?.fn213 ?  parseFloat(dadosFinanceiros?.fn213) : 0 )
    + (data.FN215 ? parseFloat((data.FN215).replace('.','').replace(',','.')) : dadosFinanceiros?.fn215 ?  parseFloat(dadosFinanceiros?.fn215) : 0 )
     
    
    //const dados = Object.entries(data)     
      data.id_municipio = dadosMunicipio.id_municipio
      data.id_fn_residuos_solidos = dadosFinanceiros?.id_fn_residuos_solidos ? dadosFinanceiros.id_fn_residuos_solidos : null
      data.id_fn_drenagem_aguas_pluviais = dadosFinanceiros?.id_fn_drenagem_aguas_pluviais ? dadosFinanceiros.id_fn_drenagem_aguas_pluviais : null
      data.id_fn_agua_esgoto_sanitario = dadosFinanceiros?.id_fn_agua_esgoto_sanitario ? dadosFinanceiros.id_fn_agua_esgoto_sanitario : null
            
    
    const resCad = await api
      .post("addPsFinanceiro", data
      )
      .then((response) => {
        toast.notify('Dados gravados com sucesso!',{
          title: "Sucesso!",
          duration: 7,
          type: "success",
        })
        //console.log(response);
        return response;
      })
      .catch((error) => {
        console.log(error);
        return error
      });
      return resCad
  }

  async function handleSignOut() {
    signOut();
  }
  function handleHome() {
    Router.push("/indicadores/home_indicadores");
  }
  function handleGestao() {
    Router.push("/indicadores/gestao");
  }
  function handleIndicadores() {
    Router.push("/indicadores/gestao");
  }
  function handleReporte() {
    Router.push("/indicadores/gestao");
  }
  async function getFinaceiroMunicipio(){
    const ano = new Date().getFullYear()
    
    await api.post('getPsFinanceiro',     
    {id_municipio: dadosMunicipio[0]?.id_municipio, ano: ano})
    .then(response=>{      
      setDadosFinanceiros(response.data[0])
      
    })
    .catch((error)=>{
      console.log(error);      
    })
    
    
  }

  return (
    <Container>
      <ToastContainer></ToastContainer>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuHorizontal municipio={municipio[0].municipio_nome}></MenuHorizontal>
      <MenuIndicadores></MenuIndicadores>
      <DivCenter>
      
        <Form onSubmit={handleSubmit(handleCadastro)}>
       
          <DivForm>
            <DivTituloForm>Informações Financeiras</DivTituloForm>
            <DivFormEixo>
              <DivTituloEixo>Água e Esgoto Sanitário</DivTituloEixo>
             
              
              <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>Receitas</DivTituloConteudo>
                </DivTitulo>  
                
                <InputSNIS>
                  <label>Código SNIS</label>
                  <p>FN002</p>
                  <p>FN003</p>
                  <p>FN007</p>
                  <p>FN038</p>
                  <p>FN001</p>
                  <p>FN004</p>
                  <p>FN005</p>
                </InputSNIS>
                <InputGG>
                  <label>Descrição</label>
                  <p>Receita operacional direta de Água</p>
                  <p>Receita operacional direta de Esgoto</p>
                  <p>
                    Receita operacional direta de Água exportada (Bruta ou
                    Tratada)
                  </p>
                  <p>Receita operacional direta - Esgoto bruto importado</p>
                  <p>Receita operacional direta de Total</p>
                  <p>Receita operacional indireta</p>
                  <p>Receita operacional Total (Direta + Indireta)</p>
                </InputGG>
           
                <InputP>
                  <label>Ano: {new Date().getFullYear()}</label>
                  
                  <input {...register("FN002")} type="text"
                  defaultValue={dadosFinanceiros?.fn002}
                  onChange={handleOnChange}
                  ></input>                  
                  <input {...register("AES_FN003")} 
                  defaultValue={dadosFinanceiros?.aes_fn003 }
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN007")} type="text"
                  defaultValue={dadosFinanceiros?.fn007}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN038")} type="text"
                  defaultValue={dadosFinanceiros?.fn038}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN001")}
                  disabled={true} type="text"
                  defaultValue={dadosFinanceiros?.fn001}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("AES_FN004")}
                  type="text"
                  defaultValue={dadosFinanceiros?.aes_fn004}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("AES_FN005")}
                  disabled={true} type="text"
                  defaultValue={dadosFinanceiros?.aes_fn005}
                  onChange={handleOnChange}
                  ></input>
                  
                </InputP>
                <InputSNIS>
                  <label>.</label>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                </InputSNIS>
              </DivFormConteudo>

              <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>
                    Arrecadação e crédito a receber
                  </DivTituloConteudo>
                </DivTitulo>
                <InputSNIS>
                  <label>Código SNIS</label>
                  <p>FN006</p>
                  <p>FN008</p>
                </InputSNIS>
                <InputGG>
                  <label>Descrição</label>
                  <p>Arrecadação total operacional indireta</p>
                  <p>Créditos de contas a receber</p>
                </InputGG>
       
                <InputP>
                  <label>Ano: 2022</label>
                  <input {...register("FN006")} type="text"
                  defaultValue={dadosFinanceiros?.fn006}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("AES_FN008")} type="text"
                  defaultValue={dadosFinanceiros?.aes_fn008}
                  onChange={handleOnChange}
                  ></input>
                </InputP>
                <InputSNIS>
                  <label>.</label>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                </InputSNIS>
              </DivFormConteudo>

              <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>Despesas</DivTituloConteudo>
                </DivTitulo>
                <InputSNIS>
                  <label>Código SNIS</label>
                  <p>FN010</p>
                  <p>FN011</p>
                  <p>FN013</p>
                  <p>FN014</p>
                  <p>FN020</p>
                  <p>FN039</p>
                  <p>FN021</p>
                  <p>FN027</p>
                  <p>FN015</p>
                  <p>FN035</p>
                  <p>FN036</p>
                  <p>FN016</p>
                  <p>FN019</p>
                  <p>FN022</p>
                  <p>FN028</p>
                  <p>FN017</p>
                  <p>FN034</p>
                  <p>FN037</p>
                </InputSNIS>
                <InputGG>
                  <label>Descrição</label>
                  <p>Despesa com pessoal próprio</p>
                  <p>Despesa com produtos químicos</p>
                  <p>Despesa com energia elétrica</p>
                  <p>Despesa com serviços de terceiros</p>
                  <p>Despesa com água importada (Bruta ou tratada)</p>
                  <p>Despesa com esgoto exportado</p>
                  <p>Despesas fiscais ou tributarias computadas na dex</p>
                  <p>Outras despesas de exploração</p>
                  <p>Despesas de exploração (DEX)</p>
                  <p>Despesas com juros e encargos do serviço da divida</p>
                  <p>
                    Despesas com variações monetárias e cambiais das dividas
                  </p>
                  <p>Despesas com juros e encargos do serviço da divida</p>
                  <p>Despesas com depreciação, amortização do ativo deferido</p>
                  <p>Despesas fiscais ou tributarias não computadas na dex</p>
                  <p>Outras depesas com os servicos</p>
                  <p>Despesas totais com os serviços (DTS)</p>
                  <p>Despesa com amortização do serviço da dívida</p>
                  <p>Despesas totais com o serviço da dívida</p>
                </InputGG>
          
                <InputP>
                  <label>Ano: 2022</label>
                  <input {...register("FN010")} type="text"
                  defaultValue={dadosFinanceiros?.fn010}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN011")} type="text"
                  defaultValue={dadosFinanceiros?.fn011}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("AES_FN013")} type="text"
                  defaultValue={dadosFinanceiros?.aes_fn013}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN014")} type="text"
                  defaultValue={dadosFinanceiros?.fn014}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("AES_FN020")} type="text"
                  defaultValue={dadosFinanceiros?.aes_fn020}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN039")} type="text"
                  defaultValue={dadosFinanceiros?.fn039}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("AES_FN021")} type="text"
                  defaultValue={dadosFinanceiros?.aes_fn021}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN027")} type="text"
                  defaultValue={dadosFinanceiros?.fn027}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("AES_FN015")} 
                  disabled={true} type="text"
                  defaultValue={dadosFinanceiros?.aes_fn015}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN035")} type="text"
                  defaultValue={dadosFinanceiros?.fn035}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN036")} type="text"
                  defaultValue={dadosFinanceiros?.fn036}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN016")} type="text"
                  disabled={true}
                  defaultValue={dadosFinanceiros?.fn016}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("AES_FN019")} type="text"
                  defaultValue={dadosFinanceiros?.aes_fn019}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("AES_FN022")} type="text"
                  defaultValue={dadosFinanceiros?.aes_fn022}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN028")} type="text"
                  defaultValue={dadosFinanceiros?.fn028}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("AES_FN017")} type="text"
                  disabled={true}
                  defaultValue={dadosFinanceiros?.aes_fn017}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN034")} type="text"
                  defaultValue={dadosFinanceiros?.fn034}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN037")} type="text"
                  disabled={true}
                  defaultValue={dadosFinanceiros?.fn037}
                  onChange={handleOnChange}
                  ></input>
                </InputP>
                <InputSNIS>
                  <label>.</label>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                </InputSNIS>
              </DivFormConteudo>

              <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>
                    Investimentos realizados pelo prestador de serviços
                  </DivTituloConteudo>
                </DivTitulo>
                <InputSNIS>
                  <label>Código SNIS</label>
                  <p>FN018</p>
                  <p>FN023</p>
                  <p>FN024</p>
                  <p>FN025</p>
                  <p>FN030</p>
                  <p>FN031</p>
                  <p>FN032</p>
                  <p>FN033</p>
                </InputSNIS>
                <InputGG>
                  <label>Descrição</label>
                  <p>
                    Despesas capitalizáveis realizadas pelo prestador de
                    serviços
                  </p>
                  <p>
                    Investimentos realizados em abastecimento de água pelo
                    prestador de serviços
                  </p>
                  <p>Despesa com água importada (Bruta ou Tratada)</p>
                  <p>
                    Outros investimentos realizados pelo prestador de serviços
                  </p>
                  <p>
                    Investimento com recursos próprios realizado pelo prestador
                    de serviços
                  </p>
                  <p>
                    Investimento com recursos onerosos realizado pelo prestador
                    de serviços
                  </p>
                  <p>
                    Investimento com recursos não onerosos realizado pelo
                    prestador de serviços
                  </p>
                  <p>
                    Investimentos totais realizados pelo prestador de serviços
                  </p>
                </InputGG>
             
                <InputP>
                  <label>Ano: 2022</label>
                  <input {...register("AES_FN018")} type="text"
                  defaultValue={dadosFinanceiros?.aes_fn018}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("AES_FN023")} type="text"
                  defaultValue={dadosFinanceiros?.aes_fn023}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("AES_FN024")} type="text"
                  defaultValue={dadosFinanceiros?.aes_fn024}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN025")} type="text"
                  defaultValue={dadosFinanceiros?.fn025}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN030")} type="text"
                  defaultValue={dadosFinanceiros?.fn030}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN031")} type="text"
                  defaultValue={dadosFinanceiros?.fn031}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN032")} type="text"
                  defaultValue={dadosFinanceiros?.fn032}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN033")} type="text"
                  disabled={true}
                  defaultValue={dadosFinanceiros?.fn033}
                  onChange={handleOnChange}
                  ></input>
                </InputP>
                <InputSNIS>
                  <label>.</label>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                </InputSNIS>
              </DivFormConteudo>

              <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>
                    Investimentos realizados pelo município
                  </DivTituloConteudo>
                </DivTitulo>
                <InputSNIS>
                  <label>Código SNIS</label>
                  <p>FN041</p>
                  <p>FN042</p>
                  <p>FN043</p>
                  <p>FN044</p>
                  <p>FN045</p>
                  <p>FN046</p>
                  <p>FN047</p>
                  <p>FN048</p>
                </InputSNIS>
                <InputGG>
                  <label>Descrição</label>
                  <p>Despesas capitalizáveis realizadas pelo munícipio</p>
                  <p>
                    Investimentos realizados em abastecimento de água pelo
                    munícipio
                  </p>
                  <p>
                    Investimentos realizados em esgotamento sanitário pelo
                    munícipio
                  </p>
                  <p>Outros investimentos realizados pelo munícipio</p>
                  <p>
                    Investimento com recursos próprios realizado pelo munícipio
                  </p>
                  <p>
                    Investimento com recursos onerosos realizado pelo munícipio
                  </p>
                  <p>
                    Investimento com recursos não onerosos realizado pelo
                    munícipio
                  </p>
                  <p>Investimentos totais realizados pelo munícipio</p>
                </InputGG>
              
                <InputP>
                  <label>Ano: 2022</label>
                  <input {...register("FN041")} type="text"
                  defaultValue={dadosFinanceiros?.fn041}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN042")} type="text"
                  defaultValue={dadosFinanceiros?.fn042}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN043")} type="text"
                  defaultValue={dadosFinanceiros?.fn043}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN044")} type="text"
                  defaultValue={dadosFinanceiros?.fn044}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN045")} type="text"
                  defaultValue={dadosFinanceiros?.fn045}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN046")} type="text"
                  defaultValue={dadosFinanceiros?.fn046}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN047")} type="text"
                  defaultValue={dadosFinanceiros?.fn047}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN048")} type="text"
                  disabled={true}
                  defaultValue={dadosFinanceiros?.fn048}
                  onChange={handleOnChange}
                  ></input>
                </InputP>
                <InputSNIS>
                  <label>.</label>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                </InputSNIS>
              </DivFormConteudo>

              <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>
                    Investimentos realizados pelo estado
                  </DivTituloConteudo>
                </DivTitulo>
                <InputSNIS>
                  <label>Código SNIS</label>
                  <p>FN051</p>
                  <p>FN052</p>
                  <p>FN053</p>
                  <p>FN054</p>
                  <p>FN055</p>
                  <p>FN056</p>
                  <p>FN057</p>
                  <p>FN058</p>
                </InputSNIS>
                <InputGG>
                  <label>Descrição</label>
                  <p>Despesas capitalizáveis realizadas pelo estado</p>
                  <p>
                    Investimentos realizados em abastecimento de água pelo
                    estado
                  </p>
                  <p>
                    Investimentos realizados em esgotamento sanitário pelo
                    estado
                  </p>
                  <p>Outros investimentos realizados pelo estado</p>
                  <p>
                    Investimento com recursos próprios realizado pelo estado
                  </p>
                  <p>
                    Investimento com recursos onerosos realizado pelo estado
                  </p>
                  <p>
                    Investimento com recursos não onerosos realizado pelo estado
                  </p>
                  <p>Investimentos totais realizados pelo estado</p>
                </InputGG>
            
                <InputP>
                  <label>Ano: 2022</label>
                  <input {...register("FN051")} type="text"
                  defaultValue={dadosFinanceiros?.fn051}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN052")} type="text"
                  defaultValue={dadosFinanceiros?.fn052}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN053")} type="text"
                  defaultValue={dadosFinanceiros?.fn053}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN054")} type="text"
                  defaultValue={dadosFinanceiros?.fn054}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN055")} type="text"
                  defaultValue={dadosFinanceiros?.fn055}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN056")} type="text"
                  defaultValue={dadosFinanceiros?.fn056}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN057")} type="text"
                  defaultValue={dadosFinanceiros?.fn057}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN058")} type="text"
                  disabled={true}
                  defaultValue={dadosFinanceiros?.fn058}
                  onChange={handleOnChange}
                  ></input>
                </InputP>
                <InputSNIS>
                  <label>.</label>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                </InputSNIS>
              </DivFormConteudo>

              <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>
                    Observações, esclarecimentos ou sugestões
                  </DivTituloConteudo>
                </DivTitulo>
                <InputSNIS>
                  <label>Código SNIS</label>
                  <p>FN098</p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p>FN099</p>
                </InputSNIS>
                <InputM>
                  <label>Descrição</label>
                  <p>Campo de justificativa</p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p>Observações</p>
                </InputM>

                <InputGG>
                  <label>Ano: 2022</label>
                  <textarea {...register("FN098")} 
                  defaultValue={dadosFinanceiros?.fn098}
                  onChange={handleOnChange}
                  />
                  <textarea {...register("FN099")}
                  defaultValue={dadosFinanceiros?.fn099}
                  onChange={handleOnChange}
                  ></textarea>
                </InputGG>
              </DivFormConteudo>
            </DivFormEixo>

            <DivFormEixo>
              <DivTituloEixo>Drenagem e Águas Pluviais</DivTituloEixo>
              <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>
                    Cobrança
                  </DivTituloConteudo>
                </DivTitulo>
                <InputSNIS>
                  <label>Código SNIS</label>
                  <p>CB001</p>
                  <p>CB002</p>
                  <p>CB002A</p>
                  <p>CB003</p>
                  <p>CB004</p>
                </InputSNIS>
                <InputGG>
                  <label>Descrição</label>
                  <p>Existe alguma forma de cobrança pelos serviços de drenagem e manejo das APU</p>
                  <p>Qual é a forma de cobrança adotada?</p>
                  <p>Especifique qual é a forma de cobrança adotada</p>
                  <p>Quantidade total de imóveis urbanos tributados pelos serviços de drenagem das APU</p>
                  <p>Valor cobrado pelos serviços de Drenagem e Manejo das APU por ímovel urbano</p>
                </InputGG>
            
                <InputP>
                  <label>Ano: 2022</label>
                  <select
                    {...register("CB001")}
                    defaultValue={dadosFinanceiros?.cb001}
                    onChange={handleOnChange}
                    >
                    <option value="Sim">
                      Sim
                    </option>
                    <option value="Não">
                      Não
                    </option>
                  </select>
                  <select
                    {...register("CB002")}
                    defaultValue={dadosFinanceiros?.cb002}
                    onChange={handleOnChange}
                    >
                    <option>
                      Selecione
                    </option>
                    <option value="Cobrança de taxa específica">Cobrança de taxa específica</option>
                    <option value="Cobrança de tarifa">Cobrança de tarifa</option>
                    <option value="Outra">Outra</option>
                  </select>
                  <input {...register("CB002A")} type="text"
                  defaultValue={dadosFinanceiros?.cb002a}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("CB003")} type="text"
                  defaultValue={dadosFinanceiros?.cb003}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("CB004")} type="text"
                  defaultValue={dadosFinanceiros?.cb004}
                  onChange={handleOnChange}
                  ></input>
                </InputP>
                <InputP>
                  <label>.</label>
                  <p>.</p>
                  <p>.</p>
                  <p>.</p>
                  <p>Imóveis</p>
                  <p>R$/unid./mês</p>
                </InputP>
                <DivSeparadora></DivSeparadora>
                <InputSNIS>                 
                  <p>CB999</p>
                </InputSNIS>
                <InputM>            
                  <p>Observações, esclarecimentos ou sugestões</p>
                </InputM>
            
                <InputGG>              
                  <textarea {...register("CB999")} 
                  defaultValue={dadosFinanceiros?.cb999}
                  onChange={handleOnChange}
                  />
                </InputGG>
              </DivFormConteudo>

              <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>
                    Receitas
                  </DivTituloConteudo>
                </DivTitulo>
                <InputSNIS>
                  <label>Código SNIS</label>
                  <p>FN003</p>
                  <p>FN004</p>
                  <p>FN004A</p>
                  <p>FN005</p>
                  <p>FN008</p>
                  <p>FN009</p>
                </InputSNIS>
                <InputGG>
                  <label>Descrição</label>
                  <p>Receita total (Saúde, Educação, Pagamento de pessoal, etc...)</p>
                  <p>Fontes de recursos para custeio dos serviços de drenagem e manejo de APU</p>
                  <p>Especifique qual é a outra fonte de recursos para custeio dos serviços</p>
                  <p>Receita operacional total dos serviços de drenagem e manejo de APU</p>
                  <p>Receita não operacional total dos serviços de drenagem e manejo de APU</p>
                  <p>Receita total serviços de drenagem e manejo de APU</p>
                </InputGG>
            
                <InputP>
                  <label>Ano: 2022</label>
                  <input {...register("FN003")} type="text"
                  defaultValue={dadosFinanceiros?.fn003}
                  onChange={handleOnChange}
                  ></input>
                  <select
                    {...register("FN004")}>
                    <option>
                      Selecione
                    </option>
                    <option value="Não existe forma de custeio">Não existe forma de custeio</option>
                    <option value="Receitas de taxas">Receitas de taxas</option>
                    <option value="Receitas de contribuição de melhoria">Receitas de contribuição de melhoria</option>
                    <option value="Recursos do orçamento geral do município">Recursos do orçamento geral do município</option>
                    <option value="Outra">Outra</option>
                  </select>
                  <input {...register("FN004A")} type="text"
                  defaultValue={dadosFinanceiros?.fn004a}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN005")} type="text"
                  defaultValue={dadosFinanceiros?.fn005}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN008")} type="text"
                  defaultValue={dadosFinanceiros?.fn008}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN009")} type="text"
                  disabled={true}
                  defaultValue={dadosFinanceiros?.fn009}
                  onChange={handleOnChange}
                  ></input>
                </InputP>
                <InputP>
                  <label>.</label>
                  <p>R$/ano</p>
                  <p>.</p>
                  <p>.</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                </InputP>
               
              </DivFormConteudo>

              <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>
                    Despesas
                  </DivTituloConteudo>
                </DivTitulo>
                <InputSNIS>
                  <label>Código SNIS</label>
                  <p>FN012</p>                
                  <p>FN013</p>
                  <p>FN015</p>
                  <p>FN016</p>
                </InputSNIS>
                <InputGG>
                  <label>Descrição</label>
                  <p>Despesa total do município (Saúde, Educação, pagamento de pessoal, etc...)</p>
                  <p>Despesas de Exploração(DEX) diretas ou de custeio total dos serviços de Drenagem e Manejo de APU</p>
                  <p>Despesa total com serviço da dívida para os serviços de drenagem e Manejo de APU</p>
                  <p>Despesa total com serviços de Drenagem e Manejo de APU</p>
                
                </InputGG>
            
                <InputP>
                  <label>Ano: 2022</label>            
                  <input {...register("FN012")} type="text"
                  defaultValue={dadosFinanceiros?.fn012}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN013")} type="text"
                  defaultValue={dadosFinanceiros?.fn013}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN015")} type="text"
                  defaultValue={dadosFinanceiros?.fn015}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN016")} type="text"
                  disabled={true}
                  defaultValue={dadosFinanceiros?.fn016}
                  onChange={handleOnChange}
                  ></input>
                </InputP>
                <InputP>
                  <label>.</label>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
             
                </InputP>
               
              </DivFormConteudo>

              <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>
                    Investimentos e desembolsos
                  </DivTituloConteudo>
                </DivTitulo>
                <table>
                  <thead>
                    <tr>
                      <th>Código SNIS</th>
                      <th>Descrição</th>
                      <th>Ano: 2022</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>FN024</td>
                      <td>Investimento com recursos próprios em Drenagem e Manejo das APU contratados pelo município no ano de referência</td>
                      <td><InputP><input {...register("FN024")} type="text"
                      defaultValue={dadosFinanceiros?.fn024}
                      onChange={handleOnChange}
                      ></input></InputP></td>
                      <td>R$/ano</td>
                    </tr>
                    <tr>
                      <td>FN018</td>
                      <td>Investimento com recursos onerosos em Drenagem e Manejo das APU contratados pelo município no ano de referência</td>
                      <td><InputP><input {...register("FN018")} type="text"
                      defaultValue={dadosFinanceiros?.fn018}
                      onChange={handleOnChange}
                      ></input></InputP></td>
                      <td>R$/ano</td>
                    </tr>
                    <tr>
                      <td>FN020</td>
                      <td>Investimento com recursos não onerosos em Drenagem e Manejo das APU contratados pelo município no ano de referência</td>
                      <td><InputP><input {...register("FN020")} type="text"
                      defaultValue={dadosFinanceiros?.fn020}
                      onChange={handleOnChange}
                      ></input></InputP></td>
                      <td>R$/ano</td>
                    </tr>
                    <tr>
                      <td>FN022</td>
                      <td>Investimento total em Drenagem das APU contratado pelo município no ano de referência</td>
                      <td><InputP><input {...register("FN022")} type="text"
                      defaultValue={dadosFinanceiros?.fn022}
                      onChange={handleOnChange}
                      ></input></InputP></td>
                      <td>R$/ano</td>
                    </tr>
                    <tr>
                      <td>FN017</td>
                      <td>Desembolsos de investimentos com recursos próprios em Drenagem e Manejo das APU realizados pelo Município no ano de referência</td>
                      <td><InputP><input {...register("FN017")} type="text"
                      defaultValue={dadosFinanceiros?.fn017}
                      onChange={handleOnChange}
                      ></input></InputP></td>
                      <td>R$/ano</td>
                    </tr>
                    <tr>
                      <td>FN019</td>
                      <td>Desembolsos de investimentos com recursos onerosos em Drenagem e Manejo das APU realizados pelo Município no ano de referência</td>
                      <td><InputP><input {...register("FN019")} type="text"
                      defaultValue={dadosFinanceiros?.fn019}
                      onChange={handleOnChange}
                      ></input></InputP></td>
                      <td>R$/ano</td>
                    </tr>
                    <tr>
                      <td>FN021</td>
                      <td>Desembolsos de investimentos com recursos não onerosos em Drenagem e Manejo das APU realizados pelo Município no ano de referência</td>
                      <td><InputP><input {...register("FN021")} type="text"
                      defaultValue={dadosFinanceiros?.fn021}
                      onChange={handleOnChange}
                      ></input></InputP></td>
                      <td>R$/ano</td>
                    </tr>
                    <tr>
                      <td>FN023</td>
                      <td>Desembolsos total de investimentos em Drenagem e Manejo das APU realizados pelo Município no ano de referência</td>
                      <td><InputP><input {...register("FN023")} type="text"
                      defaultValue={dadosFinanceiros?.fn023}
                      onChange={handleOnChange}
                      ></input></InputP></td>
                      <td>R$/ano</td>
                    </tr>
                  </tbody>
                </table>               
               
              </DivFormConteudo>

              <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>
                    Observações, esclarecimentos ou sugestões
                  </DivTituloConteudo>
                </DivTitulo>
                <InputSNIS>
                  <label>Código SNIS</label>
                  <p>FN999</p>
                
                </InputSNIS>
                <InputM>
                  <label>Descrição</label>
                  <p>Observações, esclarecimentos ou sugestões</p>
              
                </InputM>

                <InputGG>
                  <label>Ano: 2022</label>
                  <textarea {...register("DRENAGEM_FN999")} 
                  defaultValue={dadosFinanceiros?.drenagem_fn999}
                  onChange={handleOnChange}
                  />
                  
                </InputGG>
              </DivFormConteudo>
            </DivFormEixo>


            <DivFormEixo>
              <DivTituloEixo>Resíduos Sólidos</DivTituloEixo>

              <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>
                    Cobrança
                  </DivTituloConteudo>
                </DivTitulo>
                <InputSNIS>
                  <label>Código SNIS</label>
                  <p>FN201</p>
                  <p>FN202</p>
                  <p>FN203</p>
                  <p>FN204</p>
                  <p>FN205</p>
                </InputSNIS>
                <InputGG>
                  <label>Descrição</label>
                  <p>A prefeitura (prestadora) cobra pelos serviços de coleta regular, transporte e destinação final de RSU?</p>
                  <p>Principal forma adotada</p>
                  <p>Descrição da outra forma adotada</p>
                  <p>Unidade adotada para a cobrança (No caso de tarifa)</p>
                  <p>A prefeitura cobra pela prestação de serviços especiais ou eventuais de manejo de RSU?</p>
                </InputGG>
            
                <InputP>
                  <label>Ano: 2022</label>
                
                  <select
                    {...register("FN201")}>
                      <option 
                       defaultValue={dadosFinanceiros?.fn201}
                       onChange={handleOnChange}
                      ></option>
                    <option>
                      Sim
                    </option>
                    <option>
                      Não
                    </option>
                  </select>
                  <select {...register("FN202")}>
                    <option 
                    defaultValue={dadosFinanceiros?.fn202}
                    onChange={handleOnChange}
                    ></option>
                    <option value="Taxa específica no boleto do IPTU">Taxa específica no boleto do IPTU</option>
                    <option value="Taxa em boleto exclusivo">Taxa em boleto exclusivo</option>
                    <option value="Tarifa">Tarifa</option>
                    <option value="Taxa específica no boleto de água">Taxa específica no boleto de água</option>
                    <option value="outra forma.">outra forma.</option>
                  </select>
                  <input {...register("FN203")} type="text"
                  defaultValue={dadosFinanceiros?.fn203}
                  onChange={handleOnChange}
                  ></input>
                  <select {...register("FN204")}>
                    <option  
                    defaultValue={dadosFinanceiros?.fn204}
                    onChange={handleOnChange}></option>
                    <option value="Peso">Peso</option>
                    <option value="Volume">Volume</option>
                  </select>
                  <select
                    {...register("FN205")}
                    defaultValue={dadosFinanceiros?.fn205}
                    onChange={handleOnChange}
                    >
                    <option value="Sim">
                      Sim
                    </option>
                    <option value="Não">
                      Não
                    </option>
                  </select>
                </InputP>
                <InputP>
                  <label>.</label>
                  <p>.</p>
                  <p>.</p>
                  <p>.</p>
                  <p>Imóveis</p>
                  <p>R$/unid./mês</p>
                </InputP>
                
              </DivFormConteudo>
              <DivFormConteudo>
                
                <DivTitulo>
                  <DivTituloConteudo>Despesas</DivTituloConteudo>
                </DivTitulo>
                <InputSNIS>
                  <label>Código SNIS</label>
                  <p>FN206</p>
                  <p>FN207</p>
                  <p>FN208</p>
                  <p>FN209</p>
                  <p>FN210</p>
                  <p>FN211</p>
                  <p>FN212</p>
                  <p>FN213</p>
                  <p>FN214</p>
                  <p>FN215</p>
                  <p>FN216</p>
                  <p>FN217</p>
                  <p>FN218</p>
                  <p>FN219</p>
                  <p>FN220</p>
                  <p>FN223</p>
                </InputSNIS>
                <InputXL>
                  <label>Descrição</label>
                  <p>Despesa dos agentes públicos com o serviço de coleta de RDO e RPU</p>
                  <p>Despesa com agentes privados para execução do serviço de coleta de RDO e RPU</p>
                  <p>Despesa com o serviço de coleta de RDO e RPU</p>
                  <p>Despesa com agentes públicos com a coleta RSS</p>
                  <p>Despesa com empresas contratadas para coleta RSS</p>
                  <p>Despesa total com a coleta RSS</p>
                  <p>Despesa dos agentes públicos com o serviço de varrição</p>
                  <p>Despesa com empresas contratadas para o serviço de varrição</p>
                  <p>Despesa total com serviço de varrição</p>
                  <p>Despesas com agentes públicos executores dos demais serviços quando não especificado sem campo próprio</p>
                  <p>
                  Despesas com agentes privados executores dos demais serviços quando não especificado sem campo próprio
                  </p>
                  <p>Despesas total com todos os agentes executores dos demais serviços quando não especificado sem campo próprio</p>
                  <p>Despesa dos agentes públicos executores de serviços de manejo de RSU</p>
                  <p>Despesa dos agentes privados executores de serviços de manejo de RSU</p>                  
                  <p>Despesa  total com os serviços de manejo de RSU</p>
                  <p>Despesa corrente da prefeitura durante o ano com todos os serviços do município (Saúde, educação, pagamento de pessoal, etc...)</p>
                </InputXL>                
                <InputP>
                  <label>Ano: 2022</label>
                  <input {...register("FN206")} type="text"
                  defaultValue={dadosFinanceiros?.fn206}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN207")} type="text"
                  defaultValue={dadosFinanceiros?.fn207}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN208")} type="text"
                  defaultValue={dadosFinanceiros?.fn208}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN209")} type="text"
                  defaultValue={dadosFinanceiros?.fn209}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN210")} type="text"
                  defaultValue={dadosFinanceiros?.fn210}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN211")} type="text"
                  defaultValue={dadosFinanceiros?.fn211}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN212")} type="text"
                  defaultValue={dadosFinanceiros?.fn212}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN213")} type="text"
                  defaultValue={dadosFinanceiros?.fn213}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN214")} type="text"
                  defaultValue={dadosFinanceiros?.fn214}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN215")} type="text"
                  defaultValue={dadosFinanceiros?.fn215}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN216")} type="text"
                  defaultValue={dadosFinanceiros?.fn216}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN217")} type="text"
                  defaultValue={dadosFinanceiros?.fn217}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN218")} type="text"
                  defaultValue={dadosFinanceiros?.fn218}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN219")} type="text"
                  defaultValue={dadosFinanceiros?.fn219}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN220")} type="text"
                  defaultValue={dadosFinanceiros?.fn220}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN223")} type="text"
                  defaultValue={dadosFinanceiros?.fn223}
                  onChange={handleOnChange}
                  ></input>
                </InputP>
                <InputSNIS>
                  <label>.</label>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                </InputSNIS>
              </DivFormConteudo>

              <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>
                    Receitas
                  </DivTituloConteudo>
                </DivTitulo>
                <InputSNIS>
                  <label>Código SNIS</label>
                  <p>FN221</p>
                  <p>FN222</p>
              
                </InputSNIS>
                <InputGG>
                  <label>Descrição</label>
                  <p>Receita orçada com a cobrança de taxas e tarifas referentes á getão e manejo de RSU</p>
                  <p>Receita arrecadada com taxas e tarifas referentes á gestão e manejo de RSU  </p>
               
                </InputGG>
            
                <InputP>
                  <label>Ano: 2022</label>              
                  <input {...register("FN221")} type="text"
                  defaultValue={dadosFinanceiros?.fn221}
                  onChange={handleOnChange}
                  ></input>
                  <input {...register("FN222")} type="text"
                  defaultValue={dadosFinanceiros?.fn222}
                  onChange={handleOnChange}
                  ></input>
                </InputP>
                <InputP>
                  <label>.</label>             
                  <p>R$/ano</p>
                  <p>R$/ano</p>
                </InputP>
               
              </DivFormConteudo>


              <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>
                    Investimentos da União
                  </DivTituloConteudo>
                </DivTitulo>

                <table>
                  <thead>                  
                    <tr>
                      <th>Código SNIS</th>
                      <th>Descrição</th>
                      <th>Ano: 2022</th>
                      <th></th>
                    </tr>                  
                  </thead>
                  <tbody>
                    <tr>
                      <td>FN224</td>
                      <td>A prefeitura recebeu algum recurso federal para aplicação no setor de manejo de RSU?</td>
                      <td><InputP> <select {...register("FN224")}
                      defaultValue={dadosFinanceiros?.fn224}
                      onChange={handleOnChange}
                      >
                                         <option ></option>
                                         <option value="Sim">Sim</option>
                                         <option value="Não">Não</option>
                                    </select></InputP></td>
                    </tr>                  
                    <tr>
                      <td>FN225</td>
                      <td>Valor repassado</td>
                      <td><InputP><input {...register("FN225")} type="text"
                      defaultValue={dadosFinanceiros?.fn225}
                      onChange={handleOnChange}
                      ></input></InputP></td>
                      <td>R$</td>
                    </tr>
                    <tr>
                      <td>FN226</td>
                      <td>Tipo de recurso</td>
                      <td><InputP><select {...register("FN226")}>
                        <option
                        defaultValue={dadosFinanceiros?.fn226}
                        onChange={handleOnChange}
                        ></option>
                        <option value="Oneroso">Oneroso</option>
                        <option value="Não oneroso">Não oneroso</option>
                        </select></InputP></td>
                    </tr>
                    <tr>
                      <td>FN227</td>
                      <td>Em que foi aplicado o recurso?</td>
                      <td colSpan={4}><textarea {...register("FN227")}  
                      defaultValue={dadosFinanceiros?.fn227}
                      onChange={handleOnChange}
                      /></td>
                    </tr>
                  </tbody>
                </table>
               
             
              </DivFormConteudo>

              <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>
                  Observações, esclarecimentos ou sugestões
                  </DivTituloConteudo>
                </DivTitulo>

                <table>
                  <thead>                  
                    <tr>
                      <th>Código SNIS</th>
                      <th>Descrição</th>
                      <th>Ano: 2022</th>
                      <th></th>
                    </tr>                  
                  </thead>
                  <tbody>
              
                    <tr>
                      <td>FN999</td>
                      <td>Observações, esclarecimentos ou sugestões</td>
                      <td colSpan={4}><textarea {...register("RESIDUOS_FN999")} 
                      defaultValue={dadosFinanceiros?.fn999}
                      onChange={handleOnChange}
                      /></td>
                     
                    </tr>
                  </tbody>
                </table>
               
                <table>
                
                </table>
             
              </DivFormConteudo>

            

            </DivFormEixo>
          </DivForm>

          <SubmitButton type="submit">Gravar</SubmitButton>
        </Form>
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

