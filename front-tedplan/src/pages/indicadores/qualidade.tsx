/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import {

  DivInput,
  InputP,
  InputM,
  MenuMunicipio,
  Municipio,
  MenuMunicipioItem,
  DivTitulo,
  DivFormEixo,
  DivTituloEixo,
  DivTituloConteudo,
  InputGG,
  DivSeparadora,
  InputSNIS,
  InputXL,
  DivTituloFormResiduo,
  DivFormResiduo,
  DivBorder,
  LabelCenter,
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
import MenuIndicadoresCadastro from "../../components/MenuIndicadoresCadastro";
import { AuthContext } from "../../contexts/AuthContext";
import CurrencyInput from "react-currency-masked-input";
import {
  Tabela,
  ContainerModal,
  Modal,
  CloseModalButton,
  ConteudoModal,
  FormModal,
  SubmitButtonModal,
  DivBotaoAdicionar,
} from "../../styles/indicadores";
import api from "../../services/api";
import { DivFormConteudo } from "../../styles/drenagem-indicadores";

import { MainContent } from "../../styles/indicadores";
import { 
  Sidebar, 
  SidebarItem } from "../../styles/residuo-solidos-in"; 
import MenuHorizontal from "../../components/MenuHorizontal";

interface IMunicipio {
  id_municipio: string;
  municipio_codigo_ibge: string;
  municipio_nome: string;
}

interface MunicipioProps {
  municipio: IMunicipio[];
}

export default function ResiduosUnidades({ municipio }: MunicipioProps) {
  const { usuario, signOut } = useContext(AuthContext);
  const [isMunicipio, setMunicipio] = useState<IMunicipio | any>(municipio);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [modalCO020, setModalCO020] = useState(null)
  const [dadosQualidade, setDadosQualidade] = useState(null);
  const [content, setContent] = useState("");
  const [activeForm, setActiveForm] = useState("agua");

  useEffect(() => {
    getDadosQualidade()
  }, [municipio]);

  const setOptions = {
    attributesWhitelist: {
      all: "data-id|data-type",
    },
    defaultTag: "p",
  };

  function handleOnChange(content) {
    setContent(content);
  }

  function handleCloseModalCO020(){}
  

  async function handleCadastro(data) {  
    
    data.id_qualidade = dadosQualidade?.id_qualidade
    data.id_municipio = municipio[0].id_municipio
    data.ano = new Date().getFullYear()  
    const resCad = await api
      .post("create-qualidade", data)
      .then((response) => {     
        toast.notify('Dados gravados com sucesso!',{
          title: "Sucesso!",
          duration: 7,
          type: "success",
        })   
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
      getDadosQualidade()
  }

  async function getDadosQualidade() {  
    const id_municipio = municipio[0].id_municipio
    const ano = new Date().getFullYear()  
    const res = await api
      .post("get-qualidade", {id_municipio: id_municipio, ano: ano})
      .then((response) => {        
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });

      setDadosQualidade(res[0])
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
      <MenuIndicadoresCadastro></MenuIndicadoresCadastro>
      <Sidebar>
        <SidebarItem
          active={activeForm === "agua"}
          onClick={() => setActiveForm("agua")}
        >
          Paralisações no sistema de distribuição de água
        </SidebarItem>
        <SidebarItem
          active={activeForm === "interrupcoes"}
          onClick={() => setActiveForm("interrupcoes")}
        >
          Interrupções sistemáticas no sistema de distribuição de água
        </SidebarItem>
        <SidebarItem
          active={activeForm === "extravasamento"}
          onClick={() => setActiveForm("extravasamento")}
        >
          Extravasamento de esgoto
        </SidebarItem>
        <SidebarItem
          active={activeForm === "tipoatendimento"}
          onClick={() => setActiveForm("tipoatendimento")}
        >
          Tipo de atendimento
        </SidebarItem>
        <SidebarItem
          active={activeForm === "amostra"}
          onClick={() => setActiveForm("amostra")}
        >
          Amostras
        </SidebarItem>
      
        <SidebarItem
          active={activeForm === "reclamacoes"}
          onClick={() => setActiveForm("reclamacoes")}
        >
          Reclamações sobre a qualidade da água
        </SidebarItem>
        <SidebarItem
          active={activeForm === "observacoes"}
          onClick={() => setActiveForm("observacoes")}
        >
          Observações
        </SidebarItem>
      </Sidebar>
      <MainContent>
      <DivCenter>
        <Form onSubmit={handleSubmit(handleCadastro)}>
          <DivFormResiduo>
            <DivTituloFormResiduo>Qualidade</DivTituloFormResiduo>    
            <DivFormEixo>
              <DivTituloEixo>Água e Esgoto Sanitário</DivTituloEixo>
            
            <DivFormConteudo active={activeForm === "agua"}>
              <DivTitulo>
                <DivTituloConteudo>Paralisações no sistema de distribuição de água</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>

                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano {new Date().getFullYear()}</th>

                  </tr>
                </thead>
                <tbody>                 
                  <tr>
                    <td><InputSNIS>QD002</InputSNIS></td>
                    <td>Quantidade de paralisações </td>
                    <td><InputP><input {...register('QD002')}
                    defaultValue={dadosQualidade?.qd002}
                    onChange={handleOnChange}
                    type="text" ></input></InputP></td>
                    <td>Paralisações</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>QD003</InputSNIS></td>
                    <td>Duração das paralisações </td>
                    <td><InputP><input {...register('QD003')}
                    defaultValue={dadosQualidade?.qd003}
                    onChange={handleOnChange} type="text"></input></InputP></td>
                    <td>horas</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>QD004</InputSNIS></td>
                    <td>Quantidade de economias ativas atingidas.</td>
                    <td><InputP><input {...register('QD004')}
                    defaultValue={dadosQualidade?.qd004}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Economias</td>
                  </tr>                
                </tbody>                
              </table>            
            </DivFormConteudo>

            <DivFormConteudo active={activeForm === "interrupcoes"}>
              <DivTitulo>
                <DivTituloConteudo>Interrupções sistemáticas no sistema de distribuição de água</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>

                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano {new Date().getFullYear()}</th>

                  </tr>
                </thead>
                <tbody>                 
                  <tr>
                    <td><InputSNIS>QD021</InputSNIS></td>
                    <td>Qualidade de interrupções sistemáticas </td>
                    <td><InputP><input {...register('QD021')}
                    defaultValue={dadosQualidade?.qd021}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Interrupções</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>QD022</InputSNIS></td>
                    <td>Duração das interrupções sistemáticas</td>
                    <td><InputP><input {...register('QD022')}
                    defaultValue={dadosQualidade?.qd022}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Hora</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>QD015</InputSNIS></td>
                    <td>Quantidade de economias ativas atingidas</td>
                    <td><InputP><input {...register('QD015')}
                    defaultValue={dadosQualidade?.qd015}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Economia</td>
                  </tr>                
                </tbody>                
              </table>            
            </DivFormConteudo> 

            <DivFormConteudo active={activeForm === "extravasamento"}>
              <DivTitulo>
                <DivTituloConteudo>Extravasamento de esgoto</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>

                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano {new Date().getFullYear()}</th>

                  </tr>
                </thead>
                <tbody>                 
                  <tr>
                    <td><InputSNIS>QD011</InputSNIS></td>
                    <td>Quantidade de extravasamento registrados</td>
                    <td><InputP><input {...register('QD011')}
                    defaultValue={dadosQualidade?.qd011}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Extravasamento</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>QD012</InputSNIS></td>
                    <td>Duração dos extravasamentos registrados</td>
                    <td><InputP><input {...register('QD012')}
                    defaultValue={dadosQualidade?.qd012}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Hora</td>
                  </tr>                
                </tbody>                
              </table>            
            </DivFormConteudo> 

            <DivFormConteudo active={activeForm === "tipoatendimento"}>
              <DivTitulo>
                <DivTituloConteudo>Tipo de atendimento</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>

                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano {new Date().getFullYear()}</th>

                  </tr>
                </thead>
                <tbody>                 
                  <tr>
                    <td><InputSNIS>QD001</InputSNIS></td>
                    <td>Tipo de atendimento da portaria sobre qualidade da água</td>
                    <td><InputP><input {...register('QD001')}
                    defaultValue={dadosQualidade?.qd001}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>1000 R$/ano</td>
                  </tr>                    
                </tbody>                
              </table>            
            </DivFormConteudo> 

            <DivFormConteudo active={activeForm === "amostra"}>
              <DivTitulo>
                <DivTituloConteudo>Amostra, na(s) saída(s) Unidade(s) de Tratamento e na rede, para determinação do cloro residual</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>

                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano {new Date().getFullYear()}</th>

                  </tr>
                </thead>
                <tbody>                 
                  <tr>
                    <td><InputSNIS>QD020</InputSNIS></td>
                    <td>Quantidade mínima de amostras obrigatórias para aferição de cloro residual livre </td>
                    <td><InputP><input {...register('QD020')}
                    defaultValue={dadosQualidade?.qd020}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Amostra</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>QD006</InputSNIS></td>
                    <td>Quantidade de amostras analisadas para aferição de cloro residual livre </td>
                    <td><InputP><input {...register('QD006')}
                    defaultValue={dadosQualidade?.qd006}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Amostra</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>QD007</InputSNIS></td>
                    <td>Quantidade de amostras analisadas para aferição de cloro residual livre com resultados fora do padrão </td>
                    <td><InputP><input {...register('QD007')}
                    defaultValue={dadosQualidade?.qd007}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Amostra</td>
                  </tr>                
                </tbody>                
              </table>            
            </DivFormConteudo>

            <DivFormConteudo active={activeForm === "amostra"}>
              <DivTitulo>
                <DivTituloConteudo>Amostra, na(s) saída(s) Unidade(s) de Tratamento e na rede, para determinação de turbidez</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>

                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano {new Date().getFullYear()}</th>

                  </tr>
                </thead>
                <tbody>                 
                  <tr>
                    <td><InputSNIS>QD019</InputSNIS></td>
                    <td>Quantidade mínima de amostras obrigatórias para aferição de turbidez </td>
                    <td><InputP><input {...register('QD019')}
                    defaultValue={dadosQualidade?.qd019}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Amostra</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>QD008</InputSNIS></td>
                    <td>Quantidade de amostras analisadas para aferição de turbidez </td>
                    <td><InputP><input {...register('QD008')}
                    defaultValue={dadosQualidade?.qd008}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Amostra</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>QD009</InputSNIS></td>
                    <td>Quantidade de amostras analisadas para aferição de turbidez com resultados fora do padrão </td>
                    <td><InputP><input {...register('QD009')}
                    defaultValue={dadosQualidade?.qd009}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Amostra</td>
                  </tr>                
                </tbody>                
              </table>            
            </DivFormConteudo>
            <DivFormConteudo active={activeForm === "amostra"}>
              <DivTitulo>
                <DivTituloConteudo>Amostra, na(s) saída(s) Unidade(s) de Tratamento e na rede, para determinação de coliformes fecais</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>

                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano {new Date().getFullYear()}</th>

                  </tr>
                </thead>
                <tbody>                 
                  <tr>
                    <td><InputSNIS>QD018</InputSNIS></td>
                    <td>Quantidade mínima de amostras obrigatórias para aferição de coliformes fecais</td>
                    <td><InputP><input {...register('QD018')}
                    defaultValue={dadosQualidade?.qd018}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Amostra</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>QD016</InputSNIS></td>
                    <td>Quantidade de amostras analisadas para aferição de coliformes fecais</td>
                    <td><InputP><input {...register('QD016')}
                    defaultValue={dadosQualidade?.qd016}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Amostra</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>QD017</InputSNIS></td>
                    <td>Quantidade de amostras analisadas para aferição de coliformes fecais com resultados fora do padrão</td>
                    <td><InputP><input {...register('QD017')}
                    defaultValue={dadosQualidade?.qd017}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Amostra</td>
                  </tr>                
                </tbody>                
              </table>            
            </DivFormConteudo>

            <DivFormConteudo active={activeForm === "amostra"}>
              <DivTitulo>
                <DivTituloConteudo>Amostra, na(s) saída(s) Unidade(s) de Tratamento e na rede, para determinação de coliformes totais</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>

                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano {new Date().getFullYear()}</th>

                  </tr>
                </thead>
                <tbody>                 
                  <tr>
                    <td><InputSNIS>QD028</InputSNIS></td>
                    <td>Quantidade mínima de amostras obrigatórias para aferição de coliformes totais</td>
                    <td><InputP><input {...register('QD028')}
                    defaultValue={dadosQualidade?.qd028}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Amostra</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>QD026</InputSNIS></td>
                    <td>Quantidade de amostras analisadas para aferição de coliformes totais</td>
                    <td><InputP><input {...register('QD026')}
                    defaultValue={dadosQualidade?.qd026}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Amostra</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>QD027</InputSNIS></td>
                    <td>Quantidade de amostras analisadas para aferição de coliformes totais com resultados fora do padrão </td>
                    <td><InputP><input {...register('QD027')}
                    defaultValue={dadosQualidade?.qd027}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Amostra</td>
                  </tr>                
                </tbody>                
              </table>            
            </DivFormConteudo> 

            <DivFormConteudo active={activeForm === "reclamacoes"}>
              <DivTitulo>
                <DivTituloConteudo>Reclamações ou solicitações de serviços</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>

                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano {new Date().getFullYear()}</th>

                  </tr>
                </thead>
                <tbody>                 
                  <tr>
                    <td><InputSNIS>QD023</InputSNIS></td>
                    <td>Quantidade de reclamações ou solicitações de serviços</td>
                    <td><InputP><input {...register('QD023')}
                    defaultValue={dadosQualidade?.qd023}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Reclamações</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>QD024</InputSNIS></td>
                    <td>Quantidade de serviços executados relativa às reclamações ou solicitações feitas</td>
                    <td><InputP><input {...register('QD024')}
                    defaultValue={dadosQualidade?.qd024}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Serviços</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>QD025</InputSNIS></td>
                    <td>Tempo total de execução dos serviços </td>
                    <td><InputP><input {...register('QD025')}
                    defaultValue={dadosQualidade?.qd025}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Horas</td>
                  </tr>                
                </tbody>                
              </table>            
            </DivFormConteudo>   


            <DivFormConteudo active={activeForm === "observacoes"}>
              <DivTitulo>
                <DivTituloConteudo>Observações</DivTituloConteudo>
              </DivTitulo>
           
              <InputSNIS>
                <p>QD099</p>
              </InputSNIS>
              <InputM>
                <p>Observações, esclarecimentos ou sugestões</p>
              </InputM>

              <InputGG>
                <textarea {...register("QD099")}
                defaultValue={dadosQualidade?.qd099}
                onChange={handleOnChange}
                />
              </InputGG>
            </DivFormConteudo>       
            </DivFormEixo>
          </DivFormResiduo>

          <SubmitButton type="submit">Gravar</SubmitButton>
        </Form>
      </DivCenter>
      </MainContent>

     
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

