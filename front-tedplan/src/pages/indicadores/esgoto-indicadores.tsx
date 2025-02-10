/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import {
  DivInput,
  MenuMunicipio,
  Municipio,
  MenuMunicipioItem,
  DivTitulo,
  DivFormEixo,
  DivTituloEixo,
  DivTituloConteudo,
  InputGG,
  InputP,
  InputM,
  DivSeparadora,
  InputSNIS,
  InputXL,
} from "../../styles/financeiro";

import {
  Container,
  DivCenter,
  DivForm,
  DivFormCadastro,
  DivTituloForm,
  Form,
  InputG,
  SubmitButton,
  DivEixo,
  TextArea,
  DivTextArea,
  StepButton,
  StepContent,
  StepLabel,
  StepperNavigation,
  StepperWrapper,
  StepperContainer,
  StepperButton,
} from "../../styles/esgoto-indicadores";



import HeadIndicadores from "../../components/headIndicadores";
import { toast, ToastContainer } from 'react-nextjs-toast';
import "suneditor/dist/css/suneditor.min.css";
import { getAPIClient } from "../../services/axios";
import MenuIndicadores from "../../components/MenuIndicadores";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../services/api";
import MenuHorizontal from "../../components/MenuHorizontal";
import MenuIndicadoresCadastro from "../../components/MenuIndicadoresCadastro";
import { 
  Sidebar, 
  SidebarItem } from "../../styles/residuo-solidos-in";
import { DivFormConteudo } from "../../styles/drenagem-indicadores";
import { MainContent } from "../../styles/indicadores";

interface IMunicipio {
  id_municipio: string;
  municipio_codigo_ibge: string;
  municipio_nome: string;
}

interface MunicipioProps {
  municipio: IMunicipio[];
}

export default function Esgoto({ municipio }: MunicipioProps) {
  const { usuario, signOut } = useContext(AuthContext);
  const [isMunicipio, setMunicipio] = useState<IMunicipio | any>(municipio);
  const [anoSelected, setAnoSelected] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  
  const [content, setContent] = useState("");
  const [dadosEsgoto, setDadosEsgoto] = useState(null);
  const [activeForm, setActiveForm] = useState("ligacoes");
 

  useEffect(() => {
    //getDadosEsgoto()
  }, [municipio]);

  async function handleCadastro(data) {  
    
    data.id_esgoto = dadosEsgoto?.id_esgoto
    data.id_municipio = usuario.id_municipio
    data.ano = anoSelected  
    const resCad = await api
      .post("create-esgoto", data)
      .then((response) => {     
        toast.notify('Dados gravados com sucesso!',{
          title: "Sucesso!",
          duration: 7,
          type: "success",
        })   
        return response.data;
      })
      .catch((error) => {
        toast.notify('Erro ao gravar os dados!',{
          title: "Erro!",
          duration: 7,
          type: "error",
        })
        console.log(error);
      });
      getDadosEsgoto(anoSelected)
  }

  async function getDadosEsgoto(ano: any) {  
    const id_municipio = usuario.id_municipio
     
    const res = await api
      .post("get-esgoto-por-ano", {id_municipio: id_municipio, ano: ano})
      .then((response) => {        
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });

      setDadosEsgoto(res[0])
  }

  const setOptions = {
    attributesWhitelist: {
      all: "data-id|data-type",
    },
    defaultTag: "p",
  };

  function handleOnChange(content) {
    setContent(content);
  }
 

  function seletcAno(ano: any) {

    setAnoSelected(ano)

    getDadosEsgoto(ano)
  }

  return (
    <Container>
      <ToastContainer></ToastContainer>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuHorizontal municipio={''}></MenuHorizontal>
      <MenuIndicadoresCadastro></MenuIndicadoresCadastro>
      <Sidebar>
        <SidebarItem
          active={activeForm === "ligacoes"}
          onClick={() => setActiveForm("ligacoes")}
        >
          Ligações e economias
        </SidebarItem>
        <SidebarItem
          active={activeForm === "volumes"}
          onClick={() => setActiveForm("volumes")}
        >
          Volumes
        </SidebarItem>
        <SidebarItem
          active={activeForm === "extencao"}
          onClick={() => setActiveForm("extencao")}
        >
          Extenção da rede
        </SidebarItem>
        <SidebarItem
          active={activeForm === "consumo"}
          onClick={() => setActiveForm("consumo")}
        >
          Consumo de energia elétrica
        </SidebarItem>
        <SidebarItem
          active={activeForm === "observacoes"}
          onClick={() => setActiveForm("observacoes")}
        >
          Observações, esclarecimentos ou sugestões
        </SidebarItem>
      </Sidebar>
      <MainContent>
      <DivCenter>
        <Form onSubmit={handleSubmit(handleCadastro)}>
          <DivForm>            
            <DivTituloForm style={{borderColor: "#0085bd"}}>Esgoto</DivTituloForm> 

            <DivFormConteudo active={activeForm === "ligacoes" || activeForm === "volumes" || activeForm === "extencao" || activeForm === "consumo" || activeForm === "observacoes"}>
                <DivTitulo>
                  <DivTituloConteudo>Ano</DivTituloConteudo>
                </DivTitulo>
                <label>Selecione o ano desejado:</label>
                <select name="ano" id="ano" onChange={(e) => seletcAno(e.target.value)}>
                  <option style={{color: "#000000"}} >Selecionar</option>
                  <option style={{color: "#000000"}} value="2022">2022</option>
                  <option style={{color: "#000000"}} value="2023">2023</option>
                  <option style={{color: "#000000"}} value="2024">2024</option>
                </select>
              </DivFormConteudo>         
             
              <DivFormConteudo active={activeForm === "ligacoes"}>

                <DivTitulo>
                  <DivTituloConteudo>Ligações e economias</DivTituloConteudo>
                </DivTitulo>
                
                <div className="input-row">
                  <InputSNIS>
                    <label>Código SNIS</label>
                    <p>ES009</p>
                    <p>ES002</p>
                    <p>ES003</p>
                    <p>ES008</p>
                  </InputSNIS>
                  
                  <InputGG>
                    <label>Descrição</label>
                    <p>Quantidade de ligações totais de esgoto</p>
                    <p>Quantidade de ligações ativas de esgoto</p>
                    <p>Quantidade de economias ativas de esgoto</p>
                    <p>Quantidade de economias residenciais ativas de esgoto</p>
                  </InputGG>

                  <InputP>
                    <label>Ano: {anoSelected}</label>
                    <input {...register("ES009")}
                    defaultValue={dadosEsgoto?.ES009}
                    onChange={handleOnChange}
                    type="text"></input>
                    <input {...register("ES002")}
                    defaultValue={dadosEsgoto?.ES002}
                    onChange={handleOnChange}
                    type="text"></input>
                    <input {...register("ES003")}
                    defaultValue={dadosEsgoto?.ES003}
                    onChange={handleOnChange}
                    type="text"></input>
                    <input {...register("ES008")}
                    defaultValue={dadosEsgoto?.ES008}
                    onChange={handleOnChange}
                    type="text"></input>
                  </InputP>
                  <InputSNIS>
                    <label>.</label>
                    <p>ligação</p>
                    <p>ligação</p>
                    <p>economia</p>
                    <p>economia</p>
                  </InputSNIS>
                </div>
              </DivFormConteudo>
              
              <DivFormConteudo active={activeForm === "volumes"}>
                <DivTitulo>
                  <DivTituloConteudo>Volumes</DivTituloConteudo>
                </DivTitulo>
                <InputSNIS>
                  <label><b>Código SNIS</b></label>
                  <p>ES005</p>
                  <p>ES006</p>
                  <p>ES007</p>
                  <p>ES012</p>
                  <p>ES015</p>
                                  
                </InputSNIS>
                <InputGG>
                  <label><b>Descrição</b></label>
                  <p>Volume de esgoto coletado</p>
                  <p>Volume de esgoto tratado</p>
                  <p>Volume de esgoto faturado</p>
                  <p>Volume de esgoto bruto exportado</p>
                  <p>Volume de esgoto bruto tratado nas instalações do importador</p>
                 
                </InputGG>
             
                <InputP>

                  <label>Ano: {anoSelected}</label>

                  <input {...register("ES005")}
                  defaultValue={dadosEsgoto?.ES005}
                  onChange={handleOnChange}
                  type="text"></input>
                  <input {...register("ES006")}
                  defaultValue={dadosEsgoto?.ES006}
                  onChange={handleOnChange}
                  type="text"></input>
                  <input {...register("ES007")}
                  defaultValue={dadosEsgoto?.ES007}
                  onChange={handleOnChange}
                  type="text"></input>
                  <input {...register("ES012")}
                  defaultValue={dadosEsgoto?.ES012}
                  onChange={handleOnChange}
                  type="text"></input>
                  <input {...register("ES015")}
                  defaultValue={dadosEsgoto?.ES015}
                  onChange={handleOnChange}
                  type="text"></input>
               
                 
                </InputP>
                <InputSNIS>
                  <label>.</label>
                  <p>1.000m³/ano</p>
                  <p>1.000m³/ano</p>
                  <p>1.000m³/ano</p>
                  <p>1.000m³/ano</p>
                  <p>1.000m³/ano</p>
              
                
                </InputSNIS>
              </DivFormConteudo>

              <DivFormConteudo active={activeForm === "extencao"}>
                <DivTitulo>
                  <DivTituloConteudo>
                    Extenção da rede
                  </DivTituloConteudo>
                </DivTitulo>
                <InputSNIS>
                  <label><b>Código SNIS</b></label>
                  <p>ES004</p>
                </InputSNIS>
                <InputGG>
                  <label><b>Descrição</b></label>
                  <p>Extenção da rede</p>
                </InputGG>          
                <InputP>

                  <label>Ano: {anoSelected}</label>

                  <input {...register("ES004")}
                  defaultValue={dadosEsgoto?.ES004}
                  onChange={handleOnChange}
                  type="text"></input>
                </InputP>
                <InputSNIS>
                  <label>.</label>
                  <p>KM</p>
                </InputSNIS>
              </DivFormConteudo>

              <DivFormConteudo active={activeForm === "consumo"}>
                <DivTitulo>
                  <DivTituloConteudo>
                    Consumo de energia elétrica
                  </DivTituloConteudo>
                </DivTitulo>
                <InputSNIS>
                  <label><b>Código SNIS</b></label>
                  <p>ES028</p>
                </InputSNIS>
                <InputGG>
                  <label><b>Descrição</b></label>
                  <p>Consumo total de energia elétrica nos sistemas de esgoto</p>
                </InputGG>
               
                <InputP>

                  <label>Ano: {anoSelected}</label>

                  <input {...register("ES028")}
                  defaultValue={dadosEsgoto?.ES028}
                  onChange={handleOnChange}
                  type="text"></input>
                </InputP>
                <InputSNIS>
                  <label>.</label>
                  <p>1.000kWh/ano</p>
                </InputSNIS>
              </DivFormConteudo>

             

             <DivFormConteudo active={activeForm === "observacoes"}>
                <DivTitulo>
                  <DivTituloConteudo>
                    Observações, esclarecimentos ou sugestões
                  </DivTituloConteudo>
                </DivTitulo>
                <InputSNIS>
                  <label><b>Código SNIS</b></label>
                  <p>ES098</p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p>ES099</p>
                </InputSNIS>
                <InputM>
                  <label><b>Descrição</b></label>
                  <p>Campo de justificativa</p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p>Observações</p>
                </InputM>

                <InputG>

                  <label>Ano: {anoSelected}</label>

                  <textarea {...register("ES098")}
                  defaultValue={dadosEsgoto?.ES098}
                  onChange={handleOnChange}
                  />
                  <textarea {...register("ES099")}
                  defaultValue={dadosEsgoto?.ES099}
                  onChange={handleOnChange}
                  ></textarea>
                </InputG>
              </DivFormConteudo>
          

          </DivForm>

          <SubmitButton type="submit">Gravar</SubmitButton>
        </Form>
      </DivCenter>
      </MainContent>
    </Container>
  );
}

// export const getServerSideProps: GetServerSideProps<MunicipioProps> = async (
//   ctx
// ) => {
//   const apiClient = getAPIClient(ctx);
//   const { ["tedplan.token"]: token } = parseCookies(ctx);
//   const { ["tedplan.id_usuario"]: id_usuario } = parseCookies(ctx);
 
//   if (!token) {
//     return {
//       redirect: {
//         destination: "/login_indicadores",
//         permanent: false,
//       },
//     };
//   }

//   const resUsuario = await apiClient.get("getUsuario", {
//     params: { id_usuario: id_usuario },
//   });
//   const usuario = await resUsuario.data;

//   const res = await apiClient.get("getMunicipio", {
//     params: { id_municipio: usuario[0].id_municipio },
//   });
//   const municipio = await res.data;

//   return {
//     props: {
//       municipio,
//     },
//   };
// };


