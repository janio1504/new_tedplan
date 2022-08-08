/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
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
  DivTituloFormResiduo,
  DivFormResiduo,
  DivBorder,
  LabelCenter,
  DivChekbox,
  CheckBox,
  DivTituloEixoDrenagem,
} from "../../styles/financeiro";
import HeadIndicadores from "../../components/headIndicadores";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";
import { getAPIClient } from "../../services/axios";
import MenuIndicadores from "../../components/MenuIndicadores";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import CurrencyInput from "react-currency-masked-input";
import {
  Tabela,
  ContainerModal,
 
  CloseModalButton,
 
  TabelaModal,
  ModalForm,
} from "../../styles/indicadores";
import { BotaoAdicionar, BotaoEditar } from "../../styles/dashboard";
import { toast, ToastContainer } from 'react-nextjs-toast'
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

export default function Geral({ municipio }: MunicipioProps) {
  const { usuario, signOut } = useContext(AuthContext);
  const [isMunicipio, setMunicipio] = useState<IMunicipio | any>(municipio);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [contentForEditor, setContentForEditor] = useState(null);
  const [content, setContent] = useState("");
  const [dadosGeral, setDadosGeral] = useState(null);
  const [dadosConcessionaria, setDadosConcessionaria] = useState(null);
  const [concessionarias, setConcessionarias] = useState(null);
  const [modalAddConssionaria, setModalAddConssionaria] = useState(false);
  const editor = useRef();
  const firstRender = useRef(true);
  const editorContent = useMemo(() => contentForEditor, [contentForEditor]);

  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

  useEffect(() => {
    getDadosGerais()
    getConcessionarias()
  }, []);

  const setOptions = {
    attributesWhitelist: {
      all: "data-id|data-type",
    },
    defaultTag: "p",
  };

 
  function handleCloseModalAddConcesionaria() {
    setModalAddConssionaria(false);
  }
  function handleModalAddConcesionaria() {
    setModalAddConssionaria(true);
  }
  function handleOnChange(content) {
    setContent(content);
  }

  async function getDadosGerais(){
    const id_municipio = municipio[0].id_municipio
    const ano = new Date().getFullYear()
    const resCad = await api
      .post("get-geral", { id_municipio: id_municipio, ano: ano })
      .then((response) => {
        setDadosGeral(response.data[0])
      })
      .catch((error) => {
        toast.notify('Aconteceu o seguinte erro: ',{
          title: "Erro",
          duration: 7,
          type: "error",
        })
        console.log(error);
      });
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
        toast.notify('Aconteceu o seguinte erro: ',{
          title: "Erro",
          duration: 7,
          type: "error",
        })
        console.log(error);
      });
  }

  async function handleCadastro(data) {
    data.id_geral_da_ae_dh = dadosGeral?.id_geral_da_ae_dh
    data.id_municipio = municipio[0].id_municipio
    data.ano = new Date().getFullYear()     
    const resCad = await api
      .post("create-geral", data)
      .then((response) => {
        toast.notify('Dados gravados com sucesso!',{
          title: "Sucesso!",
          duration: 7,
          type: "success",
        })
      })
      .catch((error) => {
        toast.notify('Aconteceu o seguinte erro: ',{
          title: "Erro",
          duration: 7,
          type: "error",
        })
        console.log(error);
      });
  }

  async function handleCadastroConcessionaria(data) {
    
    data.id_municipio = municipio[0].id_municipio
    data.ano = new Date().getFullYear()
    const resCad = await api
      .post("create-concessionaria", data)
      .then((response) => {
        toast.notify('Dados gravados com sucesso!',{
          title: "Sucesso!",
          duration: 7,
          type: "success",
        })
      })
      .catch((error) => {
        toast.notify('Aconteceu o seguinte erro: ',{
          title: "Erro",
          duration: 7,
          type: "error",
        })
        console.log(error);
      });
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
          <DivFormResiduo>
            <DivTituloForm>Geral</DivTituloForm>    
            <DivFormEixo>
              <DivTituloEixo>Água e Esgoto Sanitário</DivTituloEixo>
            
            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>Municípios atendidos</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>
                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano 2022</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><InputSNIS>GE05A</InputSNIS></td>
                    <td>Quantidade de Municípios atendidos com abastecimento de água </td>
                    <td><InputP><input {...register('GE05A')}
                    defaultValue={dadosGeral?.ge05a}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Municipios</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>GE05B</InputSNIS></td>
                    <td>Quantidade de Municípios atendidos com esgotamento sanitário </td>
                    <td><InputP><input {...register('GE05B')}
                    defaultValue={dadosGeral?.ge05b}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Municipios</td>
                  </tr>                
                </tbody>                
              </table>            
            </DivFormConteudo>

            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>Sedes e localidades atendidas</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>
                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano 2022</th>
                  </tr>
                </thead>
                <tbody>                 
                  <tr>
                    <td><InputSNIS>GE008</InputSNIS></td>
                    <td>Quantidade de sedes atendidas com abastecimento de água </td>
                    <td><InputP><input {...register('GE008AE')}
                    defaultValue={dadosGeral?.ge008ae}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Sede</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>GE009</InputSNIS></td>
                    <td>Quantidade de sedes atendidas com esgotamento sanitário</td>
                    <td><InputP><input {...register('GE009')}
                    defaultValue={dadosGeral?.ge009}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Sede</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>GE010</InputSNIS></td>
                    <td>Quantidade de localidades atendidas com abastecimneto de água</td>
                    <td><InputP><input {...register('GE010AE')}
                    defaultValue={dadosGeral?.ge010ae}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Localidades</td>
                  </tr> 
                  <tr>
                    <td><InputSNIS>GE011</InputSNIS></td>
                    <td>Quantidade de localidades atendidas com esgotamento sanitário</td>
                    <td><InputP><input {...register('GE011AE')}
                    defaultValue={dadosGeral?.ge011ae}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Localidades</td>
                  </tr>    
                  <tr>
                    <td><InputSNIS>GE019</InputSNIS></td>
                    <td>Onde atende com abastecimento de água</td>
                    <td><InputP><input {...register('GE019')}
                    defaultValue={dadosGeral?.ge019}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Localidades</td>
                  </tr>   
                  <tr>
                    <td><InputSNIS>GE020</InputSNIS></td>
                    <td>Onde atende com esgotamento sanitário</td>
                    <td><InputP><input {...register('GE020')}
                    defaultValue={dadosGeral?.ge020}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Localidades</td>
                  </tr>             
                </tbody>                
              </table>            
            </DivFormConteudo> 

            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>Populações atendidas</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>
                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano 2022</th>
                  </tr>
                </thead>
                <tbody>                 
                  <tr>
                    <td><InputSNIS>AG026</InputSNIS></td>
                    <td>População urbana atendida com abastecimento de água</td>
                    <td><InputP><input {...register('AG026')}
                    defaultValue={dadosGeral?.ag026}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Habitantes</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>AG001</InputSNIS></td>
                    <td>População total atendida com abastecimento de água</td>
                    <td><InputP><input {...register('AG001')}
                    defaultValue={dadosGeral?.ag001}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Habitantes</td>
                  </tr>  
                  <tr>
                    <td><InputSNIS>ES026</InputSNIS></td>
                    <td>População urbana atendida com esgotamento sanitário</td>
                    <td><InputP><input {...register('ES026')}
                    defaultValue={dadosGeral?.es026}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Habitantes</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>ES001</InputSNIS></td>
                    <td>População total atendida com esgotamento sanitário</td>
                    <td><InputP><input {...register('ES001')}
                     defaultValue={dadosGeral?.es001}
                     onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Habitantes</td>
                  </tr>                     
                </tbody>                
              </table>            
            </DivFormConteudo> 

            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>População existente</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>
                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano 2022</th>
                  </tr>
                </thead>
                <tbody>                 
                  <tr>
                    <td><InputSNIS>GD06A</InputSNIS></td>
                    <td>População urbana residente no(s) município(s) com abastecimento de água</td>
                    <td><InputP><input {...register('GD06A')}
                     defaultValue={dadosGeral?.gd06a}
                     onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Habitantes</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>GD06B</InputSNIS></td>
                    <td>População urbana residente no(s) município(s) com esgotamento sanitário</td>
                    <td><InputP><input {...register('GD06B')}
                     defaultValue={dadosGeral?.gd06b}
                     onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Habitantes</td>
                  </tr>  
                  <tr>
                    <td><InputSNIS>GD12A</InputSNIS></td>
                    <td>População total residente no(s) município(s) com abastecimento de água (Fonte: IBGE)</td>
                    <td><InputP><input {...register('GD12A')}
                     defaultValue={dadosGeral?.gd12a}
                     onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Habitantes</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>GD12B</InputSNIS></td>
                    <td>População total residente no(s) município(s) com esgotamento sanitário (Fonte: IBGE)</td>
                    <td><InputP><input {...register('GD12B')}
                     defaultValue={dadosGeral?.gd12a}
                     onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Habitantes</td>
                  </tr>                     
                </tbody>                
              </table>            
            </DivFormConteudo> 

            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>Empregados</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>
                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano 2022</th>
                  </tr>
                </thead>
                <tbody>                 
                  <tr>
                    <td><InputSNIS>FN026</InputSNIS></td>
                    <td>Quantidade de empregados próprios</td>
                    <td><InputP><input {...register('FN026')}
                     defaultValue={dadosGeral?.fn026}
                     onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Empregados</td>
                  </tr>                    
                </tbody>                
              </table>            
            </DivFormConteudo>          


            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>Observações, esclarecimentos ou sugestões</DivTituloConteudo>
              </DivTitulo>
           
              <InputSNIS>
                <p>GE099</p>
              </InputSNIS>
              <InputM>
                <p>Observações</p>
              </InputM>

              <InputGG>
                <textarea {...register("GE099")}
                defaultValue={dadosGeral?.ge099}
                onChange={handleOnChange}
                />
              </InputGG>
            </DivFormConteudo>       
            </DivFormEixo>
       
          <DivFormEixo>
           
            <DivTituloEixoDrenagem>Drenagem de Águas Pluviais</DivTituloEixoDrenagem>
            
            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>Geografia e urbanismo</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>
                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano 2022</th>
                  </tr>
                </thead>
                <tbody>                 
                  <tr>
                    <td><InputSNIS>GE001</InputSNIS></td>
                    <td>Área territorial total do município (Fonte IBGE) </td>
                    <td><InputP><input {...register('GE001')}
                    defaultValue={dadosGeral?.ge001}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>km²</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>GE002</InputSNIS></td>
                    <td>Área urbana total, incluido áreas urbanas isoladas </td>
                    <td><InputP><input {...register('GE002')}
                    defaultValue={dadosGeral?.ge002}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>km²</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>GE007</InputSNIS></td>
                    <td>Quantidade total de imóveis existentes na área urbana do município </td>
                    <td><InputP><input {...register('GE007')}
                    defaultValue={dadosGeral?.ge007}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Imóveis</td>
                  </tr>    
                  <tr>
                    <td><InputSNIS>GE008</InputSNIS></td>
                    <td>Quantidade total de domicilios urbanos existentes no município </td>
                    <td><InputP><input {...register('GE008DA')}
                    defaultValue={dadosGeral?.ge008da}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Domicílios</td>
                  </tr>    
                  <tr>
                    <td><InputSNIS>GE016</InputSNIS></td>
                    <td>Município Crítico (Fonte: CPRM) </td>
                    <td><InputP><select {...register('GE016')}
                    defaultValue={dadosGeral?.ge016}
                    onChange={handleOnChange} >
                                <option></option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                                </select></InputP></td>
                    <td></td>
                  </tr>         
                </tbody>                
              </table>            
            </DivFormConteudo>

            
            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>Dados hidrográficos</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>
                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano 2022</th>
                  </tr>
                </thead>
                <tbody>                 
                  <tr>
                    <td><InputSNIS>GE010</InputSNIS></td>
                    <td>Região Hidrográfica em que se encontra o município (Fonte:ANA)</td>
                    <td><InputP><input {...register('GE010')}
                    defaultValue={dadosGeral?.ge016}
                    onChange={handleOnChange}></input></InputP></td>
                    <td>Sede</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>GE011</InputSNIS></td>
                    <td>Nome da(s) bacia(s) hidrografica(s) a que pertence o município (Fonte: ANA) </td>
                    <td>
                    <input {...register('GE011_1')} type="text"
                        defaultValue={dadosGeral?.ge011_1}
                        onChange={handleOnChange} />
                    </td>                    
                  </tr>
                  <tr>
                    <td><InputSNIS>GE012</InputSNIS></td>
                    <td>Existe Comitê de Bacia ou Sob-bacia Hidrográfica organizada?</td>
                    <td><InputP><select {...register('GE012')}
                    defaultValue={dadosGeral?.ge012}
                    onChange={handleOnChange} >
                      <option></option>
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                      </select></InputP></td>
                    <td>Localidades</td>
                  </tr> 
                             
                </tbody>                
              </table>            
            </DivFormConteudo> 

            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>Empregados</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>
                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano 2022</th>
                  </tr>
                </thead>
                <tbody>                 
                  <tr>
                    <td><InputSNIS>AD001</InputSNIS></td>
                    <td>Quantidade de pessoal próprio alocado</td>
                    <td><InputP><input {...register('AD001')}
                    defaultValue={dadosGeral?.ad001}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Pessoas</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>AD002</InputSNIS></td>
                    <td>Quantidade de pessoal terceirizado alocado</td>
                    <td><InputP><input {...register('AD003')}
                    defaultValue={dadosGeral?.ad003}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Pessoas</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>AD004</InputSNIS></td>
                    <td>Quantidade total de pessoal alocado </td>
                    <td><InputP><input {...register('AD004')}
                    defaultValue={dadosGeral?.ad004}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Pessoas</td>
                  </tr>                
                </tbody>                
              </table>            
            </DivFormConteudo>

            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>Infraestrutura</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>
                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano 2022</th>
                  </tr>
                </thead>
                <tbody>                 
                  <tr>
                    <td><InputSNIS>IE001</InputSNIS></td>
                    <td>Existe Plano Diretor de Drenagem e Manejo das Água Pluviais Urbanas? </td>
                    <td><InputP><select {...register('IE001')}
                    defaultValue={dadosGeral?.ie001}
                    onChange={handleOnChange}
                    >
                                  <option value=""></option>
                                  <option value="1">Sim</option>
                                  <option value="0">Não</option>
                                </select></InputP></td>
                    
                  </tr>   
                  <tr>
                    <td><InputSNIS>IE012</InputSNIS></td>
                    <td>Existe cadastro técnico de obras lineares? </td>
                    <td><InputP><select {...register('IE012')}
                    defaultValue={dadosGeral?.ie012}
                    onChange={handleOnChange}
                    >
                                  <option value=""></option>
                                  <option value="1">Sim</option>
                                  <option value="0">Não</option>
                                </select></InputP></td>
                    
                  </tr>   
                  <tr>
                    <td><InputSNIS>IE013</InputSNIS></td>
                    <td>Existe projeto básico, executivo ou "as built" de unidades operacionais? </td>
                    <td><InputP><select {...register('IE013')}
                    defaultValue={dadosGeral?.ie013}
                    onChange={handleOnChange}
                    >
                                  <option value=""></option>  
                                  <option value="1">Sim</option>
                                  <option value="0">Não</option>
                                </select></InputP></td>
                   
                  </tr> 
                  <tr>
                    <td><InputSNIS>IE014</InputSNIS></td>
                    <td>Existe obras ou projetos em andamento?</td>
                    <td><InputP><select {...register('IE014')}
                    defaultValue={dadosGeral?.ie014}
                    onChange={handleOnChange}
                    >
                                  <option value=""></option>
                                  <option value="1">Sim</option>
                                  <option value="0">Não</option>
                                </select></InputP></td>                   
                  </tr>   
                  <tr>
                    <td><InputSNIS>IE016</InputSNIS></td>
                    <td>Qual o tipo de sistema de Drenagem Urbana? </td>
                    <td><InputP><select {...register('IE016')}
                    defaultValue={dadosGeral?.ie016}
                    onChange={handleOnChange}
                    >
                                  <option value="Unitário(misto com esgotamento sanitário)">Unitário(misto com esgotamento sanitário)</option>
                                  <option value="Exclusivo para drenagem">Exclusivo para drenagem</option>
                                  <option value="Não existe">Não existe</option>
                                  <option value="Outro">Outro</option>
                                </select></InputP></td>
                    
                  </tr>     
                  <tr>
                    <td><InputSNIS>IE016A</InputSNIS></td>
                    <td>Especifique qual é o outro tipo de sistema de drenagem Urbana</td>
                    <td colSpan={4}><input {...register('IE016A')}
                    defaultValue={dadosGeral?.ie016a}
                    onChange={handleOnChange}
                    type="text"></input></td>                    
                  </tr>                     
                </tbody>                
              </table>            
            </DivFormConteudo> 

            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>Operacional</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>
                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano 2022</th>
                  </tr>
                </thead>
                <tbody>                
                  <tr>
                    <td><InputSNIS>OP001</InputSNIS></td>
                    <td>Quais da seguintes intervenções ou manutenções foram realizadas?</td>
                    <td>
                      <DivChekbox>
                        <CheckBox>
                          <input {...register("OP001_1")}
                          type="checkbox"
                          defaultChecked={dadosGeral?.op001_1 == "false" || false ? false : true}
                          />
                          <span>Não houve intervenção ou manutenção</span></CheckBox>
                        <CheckBox><input {...register("OP001_2")}
                        defaultChecked={dadosGeral?.op001_2 == "false" || false ? false : true}
                        type="checkbox"/>
                        <span>Manutenção ou recuperação de sarjetas</span></CheckBox>
                        <CheckBox><input {...register("OP001_3")}
                        defaultChecked={dadosGeral?.op001_3 == "false" || false ? false : true}
                        type="checkbox"/>
                        <span>Manutenção ou recuperação estrutural</span></CheckBox>
                    </DivChekbox>
                    </td>
                    
                  </tr>
                  <tr>
                    <td><InputSNIS>OP001A</InputSNIS></td>
                    <td>Especifique qual é a outra intervenção ou manutenção</td>
                    <td colSpan={4}><input {...register('OP001A')}
                     defaultValue={dadosGeral?.op001a}
                     onChange={handleOnChange}
                    type="text"></input></td>                    
                  </tr>
                             
                </tbody>                
              </table>            
            </DivFormConteudo> 

            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>Gestão de risco</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>
                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano 2022</th>
                  </tr>
                </thead>
                <tbody>                
                  <tr>
                    <td><InputSNIS>RI001</InputSNIS></td>
                    <td>Indique quais das seguintes instituições existem</td>
                    <td>
                      <DivChekbox>
                        <CheckBox><input {...register('RI001_1')}
                         defaultChecked={dadosGeral?.ri001_1 == "false" || false ? false : true}
                        type="checkbox"/>
                          <span>Não há instituições relacionadas com à gestão de riscos ou respostas a desastres</span></CheckBox>
                        <CheckBox><input {...register('RI001_2')}
                          defaultChecked={dadosGeral?.ri001_2 == "false" || false ? false : true}
                        type="checkbox"/>
                        <span>Unidades de corpos de bombeiros</span></CheckBox>
                        <CheckBox><input {...register('RI001_3')}
                          defaultChecked={dadosGeral?.ri001_2 == "false" || false ? false : true}
                        type="checkbox"/>
                        <span>Coordenação Municipal de Defesa Civil (COMDEC)</span></CheckBox>
                    </DivChekbox>
                    </td>
                    
                  </tr>
                  <tr>
                    <td><InputSNIS>RI001A</InputSNIS></td>
                    <td>Especifique qual é a outra instituição que atua na prevenção</td>
                    <td colSpan={4}><input {...register('RI001A')}
                      defaultValue={dadosGeral?.ri001a}
                      onChange={handleOnChange}
                    type="text"></input></td>                    
                  </tr>

                  <tr>
                    <td><InputSNIS>RI002</InputSNIS></td>
                    <td>Quais da intervenções ou situações a seguir existem na área rural a montante das áreas urbanas?</td>
                    <td>
                      <DivChekbox>
                        <CheckBox><input {...register('RI002_1')}
                          defaultValue={dadosGeral?.ri002_1}
                          onChange={handleOnChange}
                        type="checkbox"/>
                          <span>Nenhuma intervenção ou situação</span></CheckBox>
                        <CheckBox><input {...register('RI002_2')}
                          defaultValue={dadosGeral?.ri002_2}
                          onChange={handleOnChange}
                        type="checkbox"/>
                        <span>Barragens</span></CheckBox>
                        <CheckBox><input {...register('RI002_3')}
                        defaultValue={dadosGeral?.ri002_3}
                        onChange={handleOnChange}
                        type="checkbox"/>
                        <span>Retificações de cursos de água naturais</span></CheckBox>
                    </DivChekbox>
                    </td>
                    
                  </tr>
                  <tr>
                    <td><InputSNIS>RI002A</InputSNIS></td>
                    <td>Especifique qual é a outra intervenção com potencial de risco</td>
                    <td colSpan={4}><input {...register('RI002A')}
                    defaultValue={dadosGeral?.ri002a}
                    onChange={handleOnChange}
                    type="text"></input></td>                    
                  </tr>

                  <tr>
                    <td><InputSNIS>RI003</InputSNIS></td>
                    <td>Instrumento de controle e monitoramento hidrlólicos existentes</td>
                    <td>
                      <DivChekbox>
                        <CheckBox><input {...register('RI003_1')}
                        defaultValue={dadosGeral?.ri003_1}
                        onChange={handleOnChange}
                        type="checkbox"/>
                          <span>Nenhum instrumento</span></CheckBox>
                        <CheckBox><input {...register('RI003_2')}
                        defaultValue={dadosGeral?.ri003_2}
                        onChange={handleOnChange}
                        type="checkbox"/>
                        <span>Pluviômetro</span></CheckBox>
                        <CheckBox><input {...register('RI003_3')}
                        defaultValue={dadosGeral?.ri003_3}
                        onChange={handleOnChange}
                        type="checkbox"/>
                        <span>Pluviógrafo</span></CheckBox>
                    </DivChekbox>
                    </td>                 
                  </tr>
                  <tr>
                    <td><InputSNIS>RI003A</InputSNIS></td>
                    <td>Especifique qual é o outro instrumento de controle de monitoramento</td>
                    <td colSpan={4}><input {...register('RI003A')}
                    defaultValue={dadosGeral?.ri003a}
                    onChange={handleOnChange}
                    type="text"></input></td>                    
                  </tr>

                  <tr>
                    <td><InputSNIS>RI004</InputSNIS></td>
                    <td>Dados hidrolólicos monitorados e metodologia de monitoramento</td>
                    <td>
                      <DivChekbox>
                        <CheckBox><input {...register('RI004_1')}
                        defaultValue={dadosGeral?.ri004_1}
                        onChange={handleOnChange}
                        type="checkbox"/>
                          <span>Quantidade chuva por registro auto..</span></CheckBox>
                        <CheckBox><input {...register('RI004_2')}
                        defaultValue={dadosGeral?.ri004_2}
                        onChange={handleOnChange}
                        type="checkbox"/>
                        <span>Quantidade chuva por frequência diária</span></CheckBox>
                        <CheckBox><input {...register('RI004_3')}
                        defaultValue={dadosGeral?.ri004_3}
                        onChange={handleOnChange}
                        type="checkbox"/>
                        <span>Quantidade chuva por frequência hora..</span></CheckBox>
                    </DivChekbox>
                    </td>                 
                  </tr>
                  <tr>
                    <td><InputSNIS>RI004A</InputSNIS></td>
                    <td>Especifique qual é o outro dado hidrológico monitorado</td>
                    <td colSpan={4}><input {...register('RI004A')}
                    defaultValue={dadosGeral?.ri004a}
                    onChange={handleOnChange}
                    type="text"></input></td>                    
                  </tr>

                  <tr>
                    <td><InputSNIS>RI005</InputSNIS></td>
                    <td>Existem sistemas de alerta de riscos hidrológicos(alagamentos, enxurradas, inundaçoẽs)? </td>
                    <td><InputP><select {...register('RI005')}
                    defaultValue={dadosGeral?.ri005}
                    onChange={handleOnChange}
                    >
                                  <option value=""></option>
                                  <option value="1">Sim</option>
                                  <option value="0">Não</option>
                                </select></InputP></td>
                    
                  </tr>   
                  <tr>
                    <td><InputSNIS>RI007</InputSNIS></td>
                    <td>Existe cadastro ou demarcação de marcas históricas de inundações? </td>
                    <td><InputP><select {...register('RI007')}
                    defaultValue={dadosGeral?.ri007}
                    onChange={handleOnChange}
                    >
                                  <option value=""></option>
                                  <option value="1">Sim</option>
                                  <option value="0">Não</option>
                                </select></InputP></td>
                    
                  </tr>   
                  <tr>
                    <td><InputSNIS>RI009</InputSNIS></td>
                    <td>Existe mapeamento de áreas de risco de inundações dos cursos de água urbana? </td>
                    <td><InputP><select {...register('RI009')}
                    defaultValue={dadosGeral?.ri009}
                    onChange={handleOnChange}
                    >
                                  <option value=""></option>  
                                  <option value="1">Sim</option>
                                  <option value="0">Não</option>
                                </select></InputP></td>
                   
                  </tr> 
                  <tr>
                    <td><InputSNIS>RI010</InputSNIS></td>
                    <td>O mapeamento é parcial ou integral?</td>
                    <td><InputP><select {...register('RI010')}
                    defaultValue={dadosGeral?.ri010}
                    onChange={handleOnChange}
                    >
                                  <option value=""></option>
                                  <option value="1">Sim</option>
                                  <option value="0">Não</option>
                                </select></InputP></td>                   
                  </tr>   
                  <tr>
                    <td><InputSNIS>RI011</InputSNIS></td>
                    <td>Qual percentual de área total do município está mapeada? </td>
                    <td><InputP><select {...register('RI011')}
                    defaultValue={dadosGeral?.ri011}
                    onChange={handleOnChange} >
                                  <option value=""></option>
                                  <option value="De 1% a 25%">De 1% a 25%</option>
                                  <option value="De 26% a 50%">De 26% a 50%</option>
                                  <option value="De 51% a 75%">De 51% a 75%</option>
                                  <option value="De 76% a 100%">De 76% a 100%</option>
                                </select></InputP></td>
                    
                  </tr>  
                  </tbody>                
              </table> 

              <table>   
              <tbody>                
                   
                  <tr>
                    <td><InputSNIS>RI012</InputSNIS></td>
                    <td>Tempo de recorrência(ou periodo de retorno) adotado para o mapeamento</td>
                    <td colSpan={4}><input {...register('RI012')}
                    defaultValue={dadosGeral?.ri012}
                    onChange={handleOnChange}
                    type="text"></input></td>    
                    <td>Anos</td>                
                  </tr>   
                  <tr>
                    <td><InputSNIS>RI013</InputSNIS></td>
                    <td>Quantidade docmicílios sujeitos a risco de inundação</td>
                    <td colSpan={4}><input {...register('RI013')}
                    defaultValue={dadosGeral?.ri013}
                    onChange={handleOnChange}
                    type="text"></input></td>
                    <td>Domicílios</td>                    
                  </tr>         
                             
                </tbody>                
              </table>            
            </DivFormConteudo>

            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>Observações</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>
                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano 2022</th>
                  </tr>
                </thead>
                <tbody>                 
                  <tr>
                    <td><InputSNIS>GE999</InputSNIS></td>
                    <td>Observações, esclarecimentos e sugestões</td>
                    <td colSpan={10}><textarea {...register('GE999DA')}
                    defaultValue={dadosGeral?.ge999da}
                    onChange={handleOnChange}
                    /></td>
                  </tr>                    
                </tbody>                
              </table>            
            </DivFormConteudo>      

                      
          </DivFormEixo>     


          <DivFormEixo>           
            <DivTituloEixo>Dados hidrográficos</DivTituloEixo>            
            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>Informações gerais</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>
                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano 2022</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><InputSNIS>GE201</InputSNIS></td>
                    <td>O oŕgão(Prestador) é também o prestador - direto ou indireto - de outros serviços de Saneamento?</td>
                    <td><InputP><select {...register('GE201')}
                    defaultValue={dadosGeral?.ge201}
                    onChange={handleOnChange}
                    >
                                  <option value=""></option>
                                  <option value="1">Sim</option>
                                  <option value="0">Não</option>
                      </select></InputP></td>
                    <td>Localidades</td>
                  </tr> 
                             
                </tbody>                
              </table>            
            </DivFormConteudo> 

            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>Concesionárias</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>
                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano 2022</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><InputSNIS>GE202</InputSNIS></td>
                    <td>Há empresa com contrato de DELEGAÇÂO (conceção ou contrato de programa) para algum ou todos os serviços de limpeza urbana?</td>
                    <td><InputP><select {...register('GE202')}
                    defaultValue={dadosGeral?.ge202}
                    onChange={handleOnChange}
                    >
                                  <option value=""></option>
                                  <option value="1">Sim</option>
                                  <option value="0">Não</option>
                      </select></InputP></td>
                    <td>Localidades</td>
                  </tr> 
                    <tr>
                      <td></td>
                      <td></td>
                      <td><BotaoAdicionar onClick={()=>handleModalAddConcesionaria()}>Adicionar concessionária</BotaoAdicionar></td>
                    </tr>         
                </tbody>                
              </table>   
              <Tabela>
                  <table cellSpacing={0}>
                  <thead>
                    <tr>
                      <th>Concessionária</th>   
                      <th>Ano de inicio</th> 
                      <th>Duração(em anos)</th> 
                      <th>Vigente?</th> 
                      <th>Ações</th>              
                    </tr>
                  </thead>
                  <tbody>
                      {
                        concessionarias?.map((conc, key)=>(
                          <tr key={key}>
                          <td>{conc.razao_social}</td>
                          <td>{conc.ano_inicio}</td>
                          <td>{conc.duracao}</td>
                          <td>{conc.vigente}</td>
                          <td></td>
                        </tr>
                        ))
                      }
                  </tbody>
                  </table>
                </Tabela>         
            </DivFormConteudo> 

            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>População atendida</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>
                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano 2022</th>
                  </tr>
                </thead>
                <tbody>                 
                  <tr>
                    <td><InputSNIS>CO164</InputSNIS></td>
                    <td>População total atendida no município</td>
                    <td><InputP><input {...register('CO164')}
                    defaultValue={dadosGeral?.co164}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Pessoas</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>CO050</InputSNIS></td>
                    <td>População urbana atendida no município, abrangendo sede e localidades</td>
                    <td><InputP><input {...register('CO050')}
                    defaultValue={dadosGeral?.co050}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Pessoas</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>CO165</InputSNIS></td>
                    <td>População urbana atendida pelo serviço de coleta domiciliar direta, ou seja, porta a porta </td>
                    <td><InputP><input {...register('CO165')}
                    defaultValue={dadosGeral?.co165}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Pessoas</td>
                  </tr>   
                  <tr>
                    <td><InputSNIS>CO147</InputSNIS></td>
                    <td>População rural atendida com serviço de coleta domiciliar</td>
                    <td><InputP><input {...register('CO147')}
                    defaultValue={dadosGeral?.co147}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Pessoas</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>CO134</InputSNIS></td>
                    <td>Percentual da população atendida com frequência diária</td>
                    <td><InputP><input {...register('CO134')}
                    defaultValue={dadosGeral?.co134}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Pessoas</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>CO135</InputSNIS></td>
                    <td>Percentual da população atendida com frequência de 2 a 3 vezes por semana </td>
                    <td><InputP><input {...register('CO135')}
                    defaultValue={dadosGeral?.co135}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Pessoas</td>
                  </tr>       
                  <tr>
                    <td><InputSNIS>CO136</InputSNIS></td>
                    <td>Percentual da população atendida com frequência de 1 veze por semana </td>
                    <td><InputP><input {...register('CO136')}
                    defaultValue={dadosGeral?.co136}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Pessoas</td>
                  </tr>  
                  <tr>
                    <td><InputSNIS>CS050</InputSNIS></td>
                    <td>Percentual da população atendida com a COLETA SELETIVA de porta a porta </td>
                    <td><InputP><input {...register('CS050')}
                    defaultValue={dadosGeral?.cs050}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>Pessoas</td>
                  </tr>                      
                </tbody>                
              </table>            
            </DivFormConteudo>

            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>Valor contratual</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>
                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano 2022</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><InputSNIS>CO162</InputSNIS></td>
                    <td>Valor contratual (Preço unitario) do serviço de aterramento de RDO e RDU</td>
                    <td><InputP><input {...register('CO162')}
                    defaultValue={dadosGeral?.co162}
                    onChange={handleOnChange}
                    type="text"></input></InputP></td>
                    <td>R$/Toneladas</td>
                  </tr>          
                  <tr>
                    <td><InputSNIS>CO178</InputSNIS></td>
                    <td>Valor contratual (Preço unitario) do serviço de coleta e transporte e destinação final de RDO e RPU</td>
                    <td><InputP><input {...register('CO178')}
                    defaultValue={dadosGeral?.co178}
                    onChange={handleOnChange}
                    ></input></InputP></td>
                    <td>R$/Toneladas</td>
                  </tr> 
                             
                </tbody>                
              </table>            
            </DivFormConteudo> 

            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>Observações</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>
                    <th>Código SNIS</th>
                    <th>Descrição</th>
                    <th>Ano 2022</th>
                  </tr>
                </thead>
                <tbody>                 
                  <tr>
                    <td><InputSNIS>GE999</InputSNIS></td>
                    <td>Observações, esclarecimentos e sugestões</td>
                    <td colSpan={10}><textarea {...register('GE999DH')}
                    defaultValue={dadosGeral?.ge999dh}
                    onChange={handleOnChange}
                    /></td>
                  </tr>                    
                </tbody>                
              </table>            
            </DivFormConteudo>   

                      
          </DivFormEixo>      
                        
  
          </DivFormResiduo>

          <SubmitButton type="submit">Gravar</SubmitButton>
        </Form>
      </DivCenter>

      {modalAddConssionaria && (
        <ContainerModal>
          <ModalForm>
          <DivFormResiduo>
          <DivTituloFormResiduo>Edição de cadastro de Concessionária</DivTituloFormResiduo> 
            <Form onSubmit={handleSubmit(handleCadastroConcessionaria)}>
            <CloseModalButton
                  onClick={() => {
                    handleCloseModalAddConcesionaria();
                  }}
                >
                  Fechar
                </CloseModalButton>
              <DivFormConteudo>
              <DivTituloConteudo>Dados cadastrais</DivTituloConteudo>
             <TabelaModal>
              <table>
                  <thead>
                    <tr>
                   
                    <th>Descrição</th>
                    <th>Ano 2022</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                    
                    <td><InputGG>CNPJ da Concessionária</InputGG></td>
                    <td><InputP><input {...register('cnpj')}
                    defaultValue={dadosConcessionaria?.cnpj}
                    onChange={handleOnChange}
                    ></input></InputP></td>                
                    </tr>
                    <tr>
                   
                    <td><InputGG>Razão Social Concessionária</InputGG></td>
                    <td><InputP><input {...register('razao_social')}
                    defaultValue={dadosConcessionaria?.razao_social}
                    onChange={handleOnChange}
                    ></input></InputP></td>                    
                    </tr>
                    <tr>                   
                    <td><InputGG>Ano de inicio</InputGG></td>
                    <td><InputP><input {...register('ano_inicio')}
                    defaultValue={dadosConcessionaria?.ano_inicio}
                    onChange={handleOnChange}
                    ></input></InputP></td>                    
                    </tr>
                    <tr>                   
                    <td><InputGG>Duração(em anos)</InputGG></td>
                    <td><InputP><input {...register('duracao')}
                    defaultValue={dadosConcessionaria?.duracao}
                    onChange={handleOnChange}
                    ></input></InputP></td>                    
                    </tr>
                    <tr>                   
                    <td><InputGG>Vigente?</InputGG></td>
                    <td><InputP><select {...register('vigente')}
                    defaultValue={dadosConcessionaria?.vigente}
                    onChange={handleOnChange}
                    >
                                  <option value=""></option>
                                  <option value="1">Sim</option>
                                  <option value="0">Não</option>
                      </select></InputP></td>                    
                    </tr>
                    <tr>
                    <td>Serviços concedidos</td>
                    <td>
                      <DivChekbox>
                        <CheckBox><input {...register('capina_e_rocada')}
                        defaultValue={dadosConcessionaria?.capina_rocada}
                        onChange={handleOnChange}
                        type="checkbox"/>
                          <span>Capina e roçada</span></CheckBox>
                        <CheckBox><input {...register('coleta_res_construcao_civil')}
                        defaultValue={dadosConcessionaria?.coleta_construcao_civil}
                        onChange={handleOnChange}
                        type="checkbox"/>
                        <span>Coleta de res. contrucão civil</span></CheckBox>
                        <CheckBox><input {...register('coteta_res_domiciliar')}
                        defaultValue={dadosConcessionaria?.coteta_domiciliares}
                        onChange={handleOnChange}
                        type="checkbox"/>
                        <span>Coleta de res. Domiciliar</span></CheckBox>
                        <CheckBox><input {...register('coleta_res_servicos_saude')}
                        defaultValue={dadosConcessionaria?.coleta_servicos_saude}
                        onChange={handleOnChange}
                        type="checkbox"/>
                        <span>Coleta de res. dos Serviços da Saúde</span></CheckBox>
                        <CheckBox><input {...register('coleta_res_publico')}
                        defaultValue={dadosConcessionaria?.coleta_publicos}
                        onChange={handleOnChange}
                        type="checkbox"/>
                        <span>Coleta de res. Público</span></CheckBox>
                        <CheckBox><input {...register('operacao_aterro_sanitario')}
                        defaultValue={dadosConcessionaria?.operacao_aterro_sanitario}
                        onChange={handleOnChange}
                        type="checkbox"/>
                        <span>Operação de aterro sanitário</span></CheckBox>
                        <CheckBox><input {...register('operacao_incinerador')}
                        defaultValue={dadosConcessionaria?.operacao_incinerador}
                        onChange={handleOnChange}
                        type="checkbox"/>
                        <span>Operação de incinerador</span></CheckBox>
                        <CheckBox><input {...register('operacao_outras_unidades_processamento')}
                        defaultValue={dadosConcessionaria?.operacao_outras_unidades_proc}
                        onChange={handleOnChange}
                        type="checkbox"/>
                        <span>Operação de outras unidades de processamento</span></CheckBox>
                        <CheckBox><input {...register('operacao_unidade_compostagem')}
                        defaultValue={dadosConcessionaria?.operacao_compostagem}
                        onChange={handleOnChange}
                        type="checkbox"/>
                        <span>Operação de unidade de compostagem</span></CheckBox>
                        <CheckBox><input {...register('operacao_triagem')}
                        defaultValue={dadosConcessionaria?.operacao_triagem}
                        onChange={handleOnChange}
                        type="checkbox"/>
                        <span>Operação de triagem</span></CheckBox>
                        <CheckBox><input {...register('outros')}
                        defaultValue={dadosConcessionaria?.outros}
                        onChange={handleOnChange}
                        type="checkbox"/>
                        <span>Outros</span></CheckBox>
                        <CheckBox><input {...register('tipo_desconhecido')}
                        defaultValue={dadosConcessionaria?.tipo_desconhecido}
                        onChange={handleOnChange}
                        type="checkbox"/>
                        <span>Tipo desconhecido</span></CheckBox>
                        <CheckBox><input {...register('varricao_logradouros_publicos')}
                        defaultValue={dadosConcessionaria?.varricao_logradouros_publicos}
                        onChange={handleOnChange}
                        type="checkbox"/>
                        <span>Varrição de logradouros públicos</span></CheckBox>
                    </DivChekbox>
                    </td>                 
                  </tr>
                  <tr>                   
                    <td><InputGG>Unidade relacionada</InputGG></td>
                    <td><InputP><select {...register('unidade_relacionada')}
                    defaultValue={dadosConcessionaria?.unidade_relacionada}
                    onChange={handleOnChange}>
                                  <option value=""></option>
                                  <option value="1">Sim</option>
                                  <option value="0">Não</option>
                      </select></InputP></td>                    
                    </tr>
                   
                  </tbody>
                </table>
                </TabelaModal>
              </DivFormConteudo>
              <SubmitButton type="submit">Gravar</SubmitButton>
            </Form>
            </DivFormResiduo>
          </ModalForm>
        </ContainerModal>
      )}
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

