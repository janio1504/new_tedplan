/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import {
  Container,
  DivCenter,
  DivForm,
  DivTituloForm,
  DivInput,
  Form,
  InputP,
  InputM,
  InputG,
  SubmitButton,
  DivEixo,
  TextArea,
  DivTextArea,
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
} from "../../styles/financeiro";
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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  
  const [content, setContent] = useState("");
  const [dadosEsgoto, setDadosEsgoto] = useState(null);
  
 

  useEffect(() => {
    getDadosEsgoto()
  }, [municipio]);

  async function handleCadastro(data) {  
    
    data.id_esgoto = dadosEsgoto?.id_esgoto
    data.id_municipio = municipio[0].id_municipio
    data.ano = new Date().getFullYear()  
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
      getDadosEsgoto()
  }

  async function getDadosEsgoto() {  
    const id_municipio = municipio[0].id_municipio
    const ano = new Date().getFullYear()  
    const res = await api
      .post("get-esgoto", {id_municipio: id_municipio, ano: ano})
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

  return (
    <Container>
      <ToastContainer></ToastContainer>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuHorizontal municipio={municipio[0].municipio_nome}></MenuHorizontal>
      <MenuIndicadores></MenuIndicadores>
      <DivCenter>
        <Form onSubmit={handleSubmit(handleCadastro)}>
          <DivForm>
            <DivTituloForm>Esgoto</DivTituloForm>          
             
              <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>Ligações e economias</DivTituloConteudo>
                </DivTitulo>
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
                  <label>Ano: {new Date().getFullYear()}</label>
                  <input {...register("ES009")}
                  defaultValue={dadosEsgoto?.es009}
                  onChange={handleOnChange}
                  type="text"></input>
                  <input {...register("ES002")}
                  defaultValue={dadosEsgoto?.es002}
                  onChange={handleOnChange}
                  type="text"></input>
                  <input {...register("ES003")}
                  defaultValue={dadosEsgoto?.es003}
                  onChange={handleOnChange}
                  type="text"></input>
                  <input {...register("ES008")}
                  defaultValue={dadosEsgoto?.es008}
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
              </DivFormConteudo>
              
              <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>Volumes</DivTituloConteudo>
                </DivTitulo>
                <InputSNIS>
                  <label>Código SNIS</label>
                  <p>ES005</p>
                  <p>ES006</p>
                  <p>ES007</p>
                  <p>ES012</p>
                  <p>ES015</p>
                                  
                </InputSNIS>
                <InputGG>
                  <label>Descrição</label>
                  <p>Volume de esgoto coletado</p>
                  <p>Volume de esgoto tratado</p>
                  <p>Volume de esgoto faturado</p>
                  <p>Volume de esgoto bruto exportado</p>
                  <p>Volume de esgoto bruto tratado nas instalações do importador</p>
                 
                </InputGG>
             
                <InputP>
                  <label>Ano: {new Date().getFullYear()}</label>
                  <input {...register("ES005")}
                  defaultValue={dadosEsgoto?.es005}
                  onChange={handleOnChange}
                  type="text"></input>
                  <input {...register("ES006")}
                  defaultValue={dadosEsgoto?.es006}
                  onChange={handleOnChange}
                  type="text"></input>
                  <input {...register("ES007")}
                  defaultValue={dadosEsgoto?.es007}
                  onChange={handleOnChange}
                  type="text"></input>
                  <input {...register("ES012")}
                  defaultValue={dadosEsgoto?.es012}
                  onChange={handleOnChange}
                  type="text"></input>
                  <input {...register("ES015")}
                  defaultValue={dadosEsgoto?.es015}
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

              <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>
                    Extenção da rede
                  </DivTituloConteudo>
                </DivTitulo>
                <InputSNIS>
                  <label>Código SNIS</label>
                  <p>ES004</p>
                </InputSNIS>
                <InputGG>
                  <label>Descrição</label>
                  <p>Extenção da rede</p>
                </InputGG>          
                <InputP>
                  <label>Ano: {new Date().getFullYear()}</label>
                  <input {...register("ES004")}
                  defaultValue={dadosEsgoto?.es004}
                  onChange={handleOnChange}
                  type="text"></input>
                </InputP>
                <InputSNIS>
                  <label>.</label>
                  <p>KM</p>
                </InputSNIS>
              </DivFormConteudo>

              <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>
                    Consumo de energia elétrica
                  </DivTituloConteudo>
                </DivTitulo>
                <InputSNIS>
                  <label>Código SNIS</label>
                  <p>ES028</p>
                </InputSNIS>
                <InputGG>
                  <label>Descrição</label>
                  <p>Consumo total de energia elétrica nos sistemas de esgoto</p>
                </InputGG>
               
                <InputP>
                  <label>Ano: {new Date().getFullYear()}</label>
                  <input {...register("ES028")}
                  defaultValue={dadosEsgoto?.es028}
                  onChange={handleOnChange}
                  type="text"></input>
                </InputP>
                <InputSNIS>
                  <label>.</label>
                  <p>1.000kWh/ano</p>
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
                  <p>ES098</p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p>ES099</p>
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

                <InputG>
                  <label>Ano: {new Date().getFullYear()}</label>
                  <textarea {...register("ES098")}
                  defaultValue={dadosEsgoto?.es098}
                  onChange={handleOnChange}
                  />
                  <textarea {...register("ES099")}
                  defaultValue={dadosEsgoto?.es099}
                  onChange={handleOnChange}
                  ></textarea>
                </InputG>
              </DivFormConteudo>
          

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

