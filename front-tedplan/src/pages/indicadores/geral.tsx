/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import {  
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
  DivTituloConteudo,
  InputGG,
  DivSeparadora,
  InputSNIS,
  InputXL,
  DivTituloFormResiduo,
  DivBorder,
  LabelCenter,
  DivChekbox,
  DivFormConteudo,
  CheckBox,
  DivTituloEixoDrenagem,
} from "../../styles/financeiro";
import { Sidebar } from "@/styles/indicadores";
import HeadIndicadores from "../../components/headIndicadores";
import dynamic from "next/dynamic";
import { LineSideBar } from "@/styles/drenagem-indicadores";
import "suneditor/dist/css/suneditor.min.css";
import Image from "next/image";
import MenuIndicadores from "../../components/MenuIndicadores";
import Editar from "../../img/editar.png";
import Excluir from "../../img/excluir.png";
import Router from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import { DivFormResiduo } from "../../styles/residuos-solidos";
import {
  Container,
  DivCenter,
  DivTituloForm,
  Tabela,
  ContainerModal,  
  DivForm,
  CloseModalButton,
  TabelaModal,
  ModalForm,
} from "../../styles/esgoto-indicadores";
import { Tooltip, TooltipText } from "@/styles/indicadores";
import { DivFormCadastro, MainContent, SidebarItem} from "@/styles/esgoto-indicadores";
import { BotaoAdicionar, BotaoEditar } from "../../styles/dashboard";
import { toast, ToastContainer } from 'react-nextjs-toast'
import api from "../../services/api";
import MenuHorizontal from "../../components/MenuHorizontal";
import { Actions } from "../../styles/residuo-solido-coleta-in";
import MenuIndicadoresCadastro from "../../components/MenuIndicadoresCadastro";
import { anosSelect } from "../../util/util";
import ajuda from "../../img/ajuda.png";

interface IMunicipio {
  id_municipio: string;
  municipio_codigo_ibge: string;
  municipio_nome: string;
}

interface MunicipioProps {
  municipio: IMunicipio[];
}

export default function Geral({ municipio }: MunicipioProps) {
  const { usuario, isEditor, anoEditorSimisab } = useContext(AuthContext);
  const [isMunicipio, setMunicipio] = useState<IMunicipio | any>(municipio);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [dadosMunicipio, setDadosMunicipio] = useState(null)
  const [content, setContent] = useState("");
  const [check, setCheck] = useState(false);
  const [dadosGeral, setDadosGeral] = useState(null);
  const [dadosConcessionaria, setDadosConcessionaria] = useState(null);
  const [concessionarias, setConcessionarias] = useState(null);
  const [modalAddConssionaria, setModalAddConssionaria] = useState(false);
  const [anoSelected, setAnoSelected] = useState(null);
  const [activeForm, setActiveForm] = useState("municipiosAtendidos");
  




  useEffect(() => {
    if (usuario?.id_municipio){
    getMunicipio()
  }
  if (anoEditorSimisab) {
      getDadosGerais(anoEditorSimisab);
      setAnoSelected(anoEditorSimisab);
    }
  }, [usuario, anoEditorSimisab]);

  async function getMunicipio() {
    const res = await api
      .get("getMunicipio", {
        params: { id_municipio: usuario.id_municipio },
      })
      .then((response) => {
        setDadosMunicipio(response.data);
      });
  }

  
  function handleCloseModalAddConcesionaria() {
    setModalAddConssionaria(false);
  }
  function handleModalAddConcesionaria() {
    setDadosConcessionaria(null)
    setModalAddConssionaria(true);
  }

 
  function handleOnChange(content) {
    setContent(content);
  }
  function checkOnChange(e) {
    setCheck(e);
    console.log(e);

  }


  async function getDadosGerais(ano: any) {
    const id_municipio = usuario.id_municipio

    const resCad = await api
      .post("get-geral-por-ano", { id_municipio: id_municipio, ano: ano })
      .then((response) => {
        setDadosGeral(response.data[0])
      })
      .catch((error) => {
        toast.notify('Aconteceu o seguinte erro: ', {
          title: "Erro",
          duration: 7,
          type: "error",
        })
        console.log(error);
      });
  }

  async function getConcessionarias(ano) {
    const id_municipio = usuario.id_municipio
    const resCad = await api
      .post("get-concessionarias", { id_municipio: id_municipio, ano: ano })
      .then((response) => {
        setConcessionarias(response.data)
      })
      .catch((error) => {
        toast.notify('Aconteceu o seguinte erro: ', {
          title: "Erro",
          duration: 7,
          type: "error",
        })
        console.log(error);
      });
  }

  async function getConcessionaria(id) {
    
    const resCad = await api
      .get("get-concessionaria/"+id)
      .then((response) => {
        const res = response.data                
        setDadosConcessionaria(res[0])
      })
      .catch((error) => {
        toast.notify('Aconteceu o seguinte erro: ', {
          title: "Erro",
          duration: 7,
          type: "error",
        })
        console.log(error);
      });
  }
  
  async function handleModalEditConcesionaria(id) {
    getConcessionaria(id)
    setModalAddConssionaria(true);
  }

  async function handleCadastro(data) {

    if(!isEditor){
       toast.notify("Você não tem permissão para editar!", {
               title: "Atenção!",
               duration: 7,
               type: "error",
             });
      return
    }

    data.id_geral_da_ae_dh = dadosGeral?.id_geral_da_ae_dh
    data.id_municipio = usuario.id_municipio
    data.ano = anoSelected

    data.OP001_1 = data.OP001_1 ? data.OP001_1 : dadosGeral?.op001_1
    data.OP001_2 = data.OP001_2 ? data.OP001_2 : dadosGeral?.op001_2
    data.OP001_3 = data.OP001_3 ? data.OP001_3 : dadosGeral?.op001_3

    data.RI001_1 = data.RI001_1 ? data.RI001_1 : dadosGeral?.ri001_1
    data.RI001_2 = data.RI001_2 ? data.RI001_2 : dadosGeral?.ri001_2
    data.RI001_3 = data.RI001_3 ? data.RI001_3 : dadosGeral?.ri001_3

    data.RI002_1 = data.RI002_1 ? data.RI002_1 : dadosGeral?.ri002_1
    data.RI002_2 = data.RI002_2 ? data.RI002_2 : dadosGeral?.ri002_2
    data.RI002_3 = data.RI002_3 ? data.RI002_3 : dadosGeral?.ri002_3

    data.RI003_1 = data.RI003_1 ? data.RI003_1 : dadosGeral?.ri003_1
    data.RI003_2 = data.RI003_2 ? data.RI003_2 : dadosGeral?.ri003_2
    data.RI003_3 = data.RI003_3 ? data.RI003_3 : dadosGeral?.ri003_3

    data.RI004_1 = data.RI004_1 ? data.RI004_1 : dadosGeral?.ri004_1
    data.RI004_2 = data.RI004_2 ? data.RI004_2 : dadosGeral?.ri004_2
    data.RI004_3 = data.RI004_3 ? data.RI004_3 : dadosGeral?.ri004_3


    const resCad = await api
      .post("create-geral", data)
      .then((response) => {
        toast.notify('Dados gravados com sucesso!', {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        })
      })
      .catch((error) => {
        toast.notify('Aconteceu o seguinte erro: ', {
          title: "Erro",
          duration: 7,
          type: "error",
        })
        console.log(error);
      });
  }

  async function handleCadastroConcessionaria(data) {

    data.id_municipio = usuario.id_municipio
    data.ano = anoSelected
    const resCad = await api
      .post("create-concessionaria", data)
      .then((response) => {
        toast.notify('Dados gravados com sucesso!', {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        })
        getConcessionarias(anoSelected)
      })
      .catch((error) => {
        toast.notify('Aconteceu o seguinte erro: ', {
          title: "Erro",
          duration: 7,
          type: "error",
        })
        console.log(error);
      });
  }


  function seletcAno(ano: any) {
    setDadosGeral(null);
    setAnoSelected(ano)
    getConcessionarias(ano)
    getDadosGerais(ano)
    getConcessionarias(ano)
    
  }

  const onlyAllowNumber = (e) =>{
    if (!/[0-9]/.test(e.key)){
      e.preventDefault();
    };
  }

  return (
    <Container>
      <ToastContainer></ToastContainer>
       <HeadIndicadores usuarios={[]}></HeadIndicadores>
       <MenuHorizontal municipio={dadosMunicipio?.municipio_nome}></MenuHorizontal>
      <MenuIndicadoresCadastro></MenuIndicadoresCadastro>
      <Sidebar>
        <LineSideBar style={{'textAlign': 'start'}}>
          Água e esgoto sanitário
        </LineSideBar>
        <SidebarItem
        active={activeForm === "municipiosAtendidos"}
        onClick = {() => setActiveForm("municipiosAtendidos")}>
          Municípios Atendidos
        </SidebarItem>
        <SidebarItem
        active={activeForm === "sedesAtendidas"}
        onClick = {() => setActiveForm("sedesAtendidas")}>
          Sedes e localidades Atendidas
        </SidebarItem>
        <SidebarItem
        active={activeForm === "populacoesAtendidas"}
        onClick = {() => setActiveForm("populacoesAtendidas")}>
          Populações Atendidas
        </SidebarItem>
        <SidebarItem
        active={activeForm === "populacaoExistente"}
        onClick = {() => setActiveForm("populacaoExistente")}>
          População Existente
        </SidebarItem>
        <SidebarItem
        active={activeForm === "empregados"}
        onClick = {() => setActiveForm("empregados")}>
          Empregados
        </SidebarItem>
        <SidebarItem
        active={activeForm === "observacoes"}
        onClick = {() => setActiveForm("observacoes")}>
          Observações, Esclarecimentos ou Sugestões
        </SidebarItem>

        <LineSideBar style={{'textAlign': 'start'}}>
          Drenagem e Águas Pluviais
        </LineSideBar>
        <SidebarItem
        active={activeForm === "geografiaUrbanismo"}
        onClick = {() => setActiveForm("geografiaUrbanismo")}>
          Geografia e Urbanismo
        </SidebarItem>
        <SidebarItem
        active={activeForm === "dadosHidrograficos"}
        onClick = {() => setActiveForm("dadosHidrograficos")}>
          Dados Hidrográficos
        </SidebarItem>
        <SidebarItem
        active={activeForm === "empregados1"}
        onClick = {() => setActiveForm("empregados1")}>
          Empregados
        </SidebarItem>
        <SidebarItem
        active={activeForm === "infraestrutura"}
        onClick = {() => setActiveForm("infraestrutura")}>
          Infraestrutura
        </SidebarItem>
        <SidebarItem
        active={activeForm === "operacional"}
        onClick = {() => setActiveForm("operacional")}>
          Operacional
        </SidebarItem>
        <SidebarItem
        active={activeForm === "gestaoDeRisco"}
        onClick = {() => setActiveForm("gestaoDeRisco")}>
          Gestão de Risco
        </SidebarItem>
        <SidebarItem
        active={activeForm === "observacoes1"}
        onClick = {() => setActiveForm("observacoes1")}>
          Observações, Esclarecimentos ou Sugestões
        </SidebarItem>
        <LineSideBar style={{'textAlign': 'start'}}>
          Resíduos Sólidos
        </LineSideBar>
        <SidebarItem
        active={activeForm === "infoGerais"}
        onClick = {() => setActiveForm("infoGerais")}>
          Informações Gerais
        </SidebarItem>
        <SidebarItem
        active={activeForm === "concessionarias"}
        onClick = {() => setActiveForm("concessionarias")}>
          Concessionárias
        </SidebarItem>
        <SidebarItem
        active={activeForm === "populacaoAtendida1"}
        onClick = {() => setActiveForm("populacaoAtendida1")}>
          População Atendida
        </SidebarItem>
        <SidebarItem
        active={activeForm === "valorContratual"}
        onClick = {() => setActiveForm("valorContratual")}>
          Valor Contratual
        </SidebarItem>
        <SidebarItem
        active={activeForm === "Observacoes3"}
        onClick = {() => setActiveForm("observacoes3")}>
          Observações, Esclarecimentos ou Sugestões
        </SidebarItem>

        
        
      </Sidebar>
      <MainContent>
      <DivCenter>
        <Form onSubmit={handleSubmit(handleCadastro)}>
          <DivForm>
            <DivTituloForm>Geral</DivTituloForm>
            <DivFormEixo>
              <DivFormConteudo active={activeForm === 'municipiosAtendidos'
                || activeForm === 'sedesAtendidas' || activeForm === 'populacoesAtendidas'
                || activeForm === 'populacaoExistente' || activeForm === 'empregados' 
                || activeForm === 'observacoes' || activeForm === 'geografiaUrbanismo'
                || activeForm === 'dadosHidrograficos' || activeForm === 'empregados1'
                || activeForm === 'infraestrutura' || activeForm === 'operacional'   
                || activeForm === 'gestaoDeRisco' || activeForm === 'observacoes1'
                || activeForm === 'infoGerais' || activeForm === 'concessionarias'
                || activeForm === 'populacaoAtendida1' || activeForm === 'valorContratual'
                || activeForm === 'observacoes3'}>
                <DivTitulo>
                  <DivTituloConteudo>Ano</DivTituloConteudo>
                </DivTitulo>
                {anoEditorSimisab ? (
                    <div
                      style={{
                        marginLeft: 40,
                        fontSize: 18,
                        fontWeight: "bolder",
                      }}
                    >
                      {anoEditorSimisab}
                    </div>
                  ) : (
                    ""
                  )}
                {!anoEditorSimisab && (
                                    <>
                                      <label>Selecione o ano desejado:</label>
                                      <select
                                        name="ano"
                                        id="ano"
                                        onChange={(e) => seletcAno(e.target.value)}
                                      >
                                        <option>Selecionar</option>
                                        {anosSelect().map((ano) => (
                                          <option value={ano}>{ano}</option>
                                        ))}
                                      </select>
                                    </>
                                  )}
              </DivFormConteudo>
            </DivFormEixo>

            <DivFormEixo>

              <DivFormConteudo active={activeForm === 'municipiosAtendidos'}>
                <DivTitulo>
                  <DivTituloConteudo>Municípios atendidos</DivTituloConteudo>
                </DivTitulo>
                <table>
                <tbody>
                    <tr>

                      <th>Código SNIS</th>
                      <th>Descrição</th>
                      <th>Ano {anoSelected}</th>

                    </tr>
                  
                 
                    <tr>
                      <td><InputSNIS>GE05A</InputSNIS></td>
                      <td>Quantidade de Municípios atendidos com abastecimento de água </td>
                      <td><InputP><input {...register('GE05A')}
                        defaultValue={dadosGeral?.ge05a}
                        onChange={handleOnChange}
                        type="text"
                        onKeyPress={onlyAllowNumber}
                        ></input></InputP></td>
                      <td>municípios</td>
                    </tr>
                    <tr>
                      <td><InputSNIS>GE05B</InputSNIS></td>
                      <td>Quantidade de Municípios atendidos com esgotamento sanitário </td>
                      <td><InputP><input {...register('GE05B')}
                        defaultValue={dadosGeral?.ge05b}
                        onChange={handleOnChange}
                        type="text"
                         onKeyPress={onlyAllowNumber}
                         ></input></InputP></td>
                      <td>municípios</td>
                    </tr>
                  </tbody>
                </table>
              </DivFormConteudo>

              <DivFormConteudo active={activeForm === 'sedesAtendidas'}>
                <DivTitulo>
                  <DivTituloConteudo>Sedes e localidades atendidas</DivTituloConteudo>
                </DivTitulo>
                <table>
                <tbody>
                    <tr>

                      <th>Código SNIS</th>
                      <th>Descrição</th>
                      <th>Ano {anoSelected}</th>

                    </tr>
              
                 
                    <tr>
                      <td><InputSNIS>GE008</InputSNIS></td>
                      <td>Quantidade de sedes atendidas com abastecimento de água </td>
                      <td><InputP><input {...register('GE008AE')}
                        defaultValue={dadosGeral?.ge008ae}
                        onChange={handleOnChange}
                        type="text"
                        onKeyPress={onlyAllowNumber}
                        ></input></InputP></td>
                      <td>Sede</td>
                    </tr>
                    <tr>
                      <td><InputSNIS>GE009</InputSNIS></td>
                      <td>Quantidade de sedes atendidas com esgotamento sanitário</td>
                      <td><InputP><input {...register('GE009')}
                        defaultValue={dadosGeral?.ge009}
                        onChange={handleOnChange}
                        type="text"
                        onKeyPress={onlyAllowNumber}
                        ></input></InputP></td>
                      <td>Sede</td>
                    </tr>
                    <tr>
                      <td><InputSNIS>GE010</InputSNIS></td>
                      <td>Quantidade de localidades atendidas com abastecimneto de água</td>
                      <td><InputP><input {...register('GE010AE')}
                        defaultValue={dadosGeral?.ge010ae}
                        onChange={handleOnChange}
                        type="text"
                        onKeyPress={onlyAllowNumber}
                        ></input></InputP></td>
                      <td>Localidades</td>
                    </tr>
                    <tr>
                      <td><InputSNIS>GE011</InputSNIS></td>
                      <td>Quantidade de localidades atendidas com esgotamento sanitário</td>
                      <td><InputP><input {...register('GE011AE')}
                        defaultValue={dadosGeral?.ge011ae}
                        onChange={handleOnChange}
                        type="text"
                        onKeyPress={onlyAllowNumber}
                        ></input></InputP></td>
                      <td>Localidades</td>
                    </tr>
                    <tr>


                      <td><InputSNIS>GE019</InputSNIS></td>
                      <td>Onde atende com abastecimento de água</td>
                      <td>
                        <InputP>
                          <select {...register('GE019')}>
                            <option value=""> {dadosGeral?.ge019 ? dadosGeral?.ge019 : 'Opções'} </option>
                            <option value="Sede Municipal"> Sede Municipal  </option>
                            <option value="Localidades"> Localidades  </option>
                            <option value="Ambos"> Ambos</option>
                          </select>
                        </InputP>
                      </td>
                      <td>Localidades</td>

                    </tr>
                    <tr>

                      <td><InputSNIS>GE020</InputSNIS></td>
                      <td>Onde atende com esgotamento sanitário</td>
                      <td>
                        <InputP>

                          <select {...register('GE020')}>
                            <option value="" > {dadosGeral?.ge020 ? dadosGeral?.ge020 : 'Opções'} </option>
                            <option value="Sede Municipal"> Sede Municipal  </option>
                            <option value="Localidades"> Localidades  </option>
                            <option value="Ambos"> Ambos</option>
                          </select>

                        </InputP></td>
                      <td>Localidades</td>

                    </tr>
                  </tbody>
                </table>
              </DivFormConteudo>

              <DivFormConteudo active={activeForm === 'populacoesAtendidas'}>
                <DivTitulo>
                  <DivTituloConteudo>Populações atendidas</DivTituloConteudo>
                </DivTitulo>
                <table>
                <tbody>
                    <tr>

                      <th>Código SNIS</th>
                      <th>Descrição</th>
                      <th>Ano {anoSelected}</th>

                    </tr>
                                    
                    <tr>
                      <td><InputSNIS>AG026</InputSNIS></td>
                      <td>População urbana atendida com abastecimento de água</td>
                      <td><InputP><input {...register('AG026')}
                        defaultValue={dadosGeral?.ag026}
                        onChange={handleOnChange}
                        type="text"
                        onKeyPress={onlyAllowNumber}
                        ></input></InputP></td>
                      <td>Habitantes</td>
                    </tr>
                    <tr>
                      <td><InputSNIS>AG001</InputSNIS></td>
                      <td>População total atendida com abastecimento de água</td>
                      <td><InputP><input {...register('AG001')}
                        defaultValue={dadosGeral?.ag001}
                        onChange={handleOnChange}
                        type="text"
                        onKeyPress={onlyAllowNumber}
                        ></input></InputP></td>
                      <td>Habitantes</td>
                    </tr>
                    <tr>
                      <td><InputSNIS>ES026</InputSNIS></td>
                      <td>População urbana atendida com esgotamento sanitário</td>
                      <td><InputP><input {...register('ES026')}
                        defaultValue={dadosGeral?.es026}
                        onChange={handleOnChange}
                        type="text"
                        onKeyPress={onlyAllowNumber}
                        ></input></InputP></td>
                      <td>Habitantes</td>
                    </tr>
                    <tr>
                      <td><InputSNIS>ES001</InputSNIS></td>
                      <td>População total atendida com esgotamento sanitário</td>
                      <td><InputP><input {...register('ES001')}
                        defaultValue={dadosGeral?.es001}
                        onChange={handleOnChange}
                        type="text"
                        onKeyPress={onlyAllowNumber}
                        ></input></InputP></td>
                      <td>Habitantes</td>
                    </tr>
                  </tbody>
                </table>
              </DivFormConteudo>

              <DivFormConteudo active={activeForm === 'populacaoExistente'}>
                <DivTitulo>
                  <DivTituloConteudo>População existente</DivTituloConteudo>
                </DivTitulo>
                <table>
                <tbody>
                    <tr>

                      <th>Código SNIS</th>
                      <th>Descrição</th>
                      <th>Ano {anoSelected}</th>

                    </tr>
                                   
                    <tr>
                      <td><InputSNIS>GD06A</InputSNIS></td>
                      <td>População urbana residente no(s) município(s) com abastecimento de água</td>
                      <td><InputP><input {...register('GD06A')}
                        defaultValue={dadosGeral?.gd06a}
                        onChange={handleOnChange}
                        type="text"
                        onKeyPress={onlyAllowNumber}
                        ></input></InputP></td>
                      <td>Habitantes</td>
                    </tr>
                    <tr>
                      <td><InputSNIS>GD06B</InputSNIS></td>
                      <td>População urbana residente no(s) município(s) com esgotamento sanitário</td>
                      <td><InputP><input {...register('GD06B')}
                        defaultValue={dadosGeral?.gd06b}
                        onChange={handleOnChange}
                        type="text"
                        onKeyPress={onlyAllowNumber}
                        ></input></InputP></td>
                      <td>Habitantes</td>
                    </tr>
                    <tr>
                      <td><InputSNIS>GD12A</InputSNIS></td>
                      <td>População total residente no(s) município(s) com abastecimento de água (Fonte: IBGE)</td>
                      <td><InputP><input {...register('GD12A')}
                        defaultValue={dadosGeral?.gd12a}
                        onChange={handleOnChange}
                        type="text"
                        onKeyPress={onlyAllowNumber}
                        ></input></InputP></td>
                      <td>Habitantes</td>
                    </tr>
                    <tr>
                      <td><InputSNIS>GD12B</InputSNIS></td>
                      <td>População total residente no(s) município(s) com esgotamento sanitário (Fonte: IBGE)</td>
                      <td><InputP><input {...register('GD12B')}
                        defaultValue={dadosGeral?.gd12a}
                        onChange={handleOnChange}
                        type="text"
                        onKeyPress={onlyAllowNumber}
                        ></input></InputP></td>
                      <td>Habitantes</td>
                    </tr>
                  </tbody>
                </table>
              </DivFormConteudo>

              <DivFormConteudo active={activeForm === 'empregados'}>
                <DivTitulo>
                  <DivTituloConteudo>Empregados</DivTituloConteudo>
                </DivTitulo>
                <table>
                <tbody>
                    <tr>

                      <th>Código SNIS</th>
                      <th>Descrição</th>
                      <th>Ano {anoSelected}</th>

                    </tr>               
                  
                    <tr>
                      <td><InputSNIS>FN026</InputSNIS></td>
                      <td>
                        Quantidade de empregados próprios
                        <Actions style={{ marginLeft: '2px', verticalAlign: 'middle', width: '30px', height: '30px',
                          display: 'inline-flex', alignItems: 'center',
                          justifyContent: 'center' }}>
                          <Tooltip>
                            <Image
                              src={ajuda}
                              alt="Ajuda"
                              width={15}
                              height={15}
                              style={{ cursor: "pointer" }}
                            />
                            <TooltipText>
                              Insira informações sobre as comunidades tradicionais, como por exemplo:
                              condições da infraestrutura e serviços de saneamento nessas comunidades.
                            </TooltipText>
                          </Tooltip>
                        </Actions>
                      </td>
                      <td><InputP><input {...register('FN026')}
                        defaultValue={dadosGeral?.fn026}
                        onChange={handleOnChange}
                        type="text"
                        onKeyPress={onlyAllowNumber}
                        ></input></InputP></td>
                      <td>Empregados</td>
                    </tr>
                  </tbody>
                </table>
              </DivFormConteudo>


              <DivFormConteudo active={activeForm === 'observacoes'}>
                <DivTitulo>
                  <DivTituloConteudo>Observações, esclarecimentos ou sugestões</DivTituloConteudo>
                </DivTitulo>
                <table>
                  <tbody>
                   <tr>
                      <th>Código SNIS</th>
                      <th>Descrição</th>
                      <th>Ano {anoSelected}</th>
                      <td></td>
                    </tr>    
                    <tr>
                      <td>GE099</td>
                      <td>Observações</td>
                      <td>
                      <textarea {...register("GE099")}
                          defaultValue={dadosGeral?.ge099}
                          onChange={handleOnChange}
                        />
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
            
              </DivFormConteudo>

              <DivFormConteudo active={activeForm === 'geografiaUrbanismo'}>
                <DivTitulo>
                  <DivTituloConteudo>Geografia e urbanismo</DivTituloConteudo>
                </DivTitulo>
                <table>
                <tbody>
                    <tr>

                      <th>Código SNIS</th>
                      <th>Descrição</th>
                      <th>Ano {anoSelected}</th>

                    </tr>                  
                    <tr>
                      <td><InputSNIS>GE001</InputSNIS></td>
                      <td>Área territorial total do município (Fonte: IBGE) </td>
                      <td><InputP><input {...register('GE001')}
                        defaultValue={dadosGeral?.ge001}
                        onChange={handleOnChange}
                        type="text"
                        onKeyPress={onlyAllowNumber}
                        ></input></InputP></td>
                      <td>km²</td>
                    </tr>
                    <tr>
                      <td><InputSNIS>GE002</InputSNIS></td>
                      <td>Área urbana total, incluido áreas urbanas isoladas </td>
                      <td><InputP><input {...register('GE002')}
                        defaultValue={dadosGeral?.ge002}
                        onChange={handleOnChange}
                        type="text"
                        onKeyPress={onlyAllowNumber}
                        ></input></InputP></td>
                      <td>km²</td>
                    </tr>
                    <tr>
                      <td><InputSNIS>GE007</InputSNIS></td>
                      <td>Quantidade total de imóveis existentes na área urbana do município </td>
                      <td><InputP><input {...register('GE007')}
                        defaultValue={dadosGeral?.ge007}
                        onChange={handleOnChange}
                        type="text"
                        onKeyPress={onlyAllowNumber}
                        ></input></InputP></td>
                      <td>Imóveis</td>
                    </tr>
                    <tr>
                      <td><InputSNIS>GE008</InputSNIS></td>
                      <td>Quantidade total de domicílios urbanos existentes no município </td>
                      <td><InputP><input {...register('GE008DA')}
                        defaultValue={dadosGeral?.ge008da}
                        onChange={handleOnChange}
                        type="text"
                        onKeyPress={onlyAllowNumber}
                        ></input></InputP></td>
                      <td>Domicílios</td>
                    </tr>
                    <tr>
                      <td><InputSNIS>GE016</InputSNIS></td>
                      <td>Município crítico em sanemento básico (Fonte: CPRM) </td>
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


              <DivFormConteudo active={activeForm === 'dadosHidrograficos'}>
                <DivTitulo>
                  <DivTituloConteudo>Dados hidrográficos</DivTituloConteudo>
                </DivTitulo>
                <table>
                <tbody>
                    <tr>
                      <th>Código SNIS</th>
                      <th>Descrição</th>
                      <th>Ano {anoSelected}</th>
                      <th></th>
                    </tr>
                    <tr>
                      <td><InputSNIS>GE010</InputSNIS></td>
                      <td>Região hidrográfica em que se encontra o município (Fonte: ANA)</td>
                      <td><InputP><input {...register('GE010')}
                        defaultValue={dadosGeral?.ge010}
                        onChange={handleOnChange}></input></InputP></td>
                    </tr>
                    <tr>
                      <td><InputSNIS>GE011</InputSNIS></td>
                      <td>Nome da(s) bacia(s) hidrográfica(s) a que pertence o município (Fonte: ANA) </td>
                      <td>
                        <input {...register('GE011')} type="text"
                          defaultValue={dadosGeral?.ge011}
                          onChange={handleOnChange} />
                      </td>
                    </tr>
                    <tr>
                      <td><InputSNIS>GE012</InputSNIS></td>
                      <td>Existe comitê de bacia ou sub-bacia hidrográfica organizada?</td>
                      <td><InputP><select {...register('GE012')} >
                        <option value="">{dadosGeral?.ge012 ? dadosGeral?.ge012 : 'Opções'}</option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                      </select></InputP></td>
                    </tr>

                  </tbody>
                </table>
              </DivFormConteudo>

              <DivFormConteudo active={activeForm === 'empregados1'}>
                <DivTitulo>
                  <DivTituloConteudo>Empregados</DivTituloConteudo>
                </DivTitulo>
                <table>
                <tbody>
                    <tr>

                      <th>Código SNIS</th>
                      <th>Descrição</th>
                      <th>Ano {anoSelected}</th>
                      <th></th>
                    </tr>
                 
                  
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
                      <td><InputP><input {...register('AD002')}
                        defaultValue={dadosGeral?.ad002}
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

              <DivFormConteudo active={activeForm === 'infraestrutura'}>
                <DivTitulo>
                  <DivTituloConteudo>Infraestrutura</DivTituloConteudo>
                </DivTitulo>
                <table>
                <tbody>
                    <tr>

                      <th>Código SNIS</th>
                      <th>Descrição</th>
                      <th>Ano {anoSelected}</th>
                      <th></th>
                    </tr>
                    <tr>
                      <td><InputSNIS>IE001</InputSNIS></td>
                      <td>Existe Plano Diretor de Drenagem e Manejo das Água Pluviais Urbanas? </td>
                      <td><InputP><select {...register('IE001')}>
                        <option >{dadosGeral?.ie001}</option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                      </select></InputP></td>

                    </tr>
                    <tr>
                      <td><InputSNIS>IE012</InputSNIS></td>
                      <td>Existe cadastro técnico de obras lineares? </td>
                      <td><InputP><select {...register('IE012')}
                        defaultValue={dadosGeral?.ie012}
                        onChange={handleOnChange}
                      >
                        <option ></option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                      </select></InputP></td>

                    </tr>
                    <tr>
                      <td><InputSNIS>IE013</InputSNIS></td>
                      <td>Existe projeto básico, executivo ou "as built" de unidades operacionais? </td>
                      <td><InputP><select {...register('IE013')}
                        defaultValue={dadosGeral?.ie013}
                        onChange={handleOnChange}
                      >
                        <option ></option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                      </select></InputP></td>

                    </tr>
                    <tr>
                      <td><InputSNIS>IE014</InputSNIS></td>
                      <td>Existe obras ou projetos em andamento?</td>
                      <td><InputP><select {...register('IE014')}
                        defaultValue={dadosGeral?.ie014}
                        onChange={handleOnChange}
                      >
                        <option ></option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                      </select></InputP></td>
                    </tr>
                    <tr>
                      <td><InputSNIS>IE016</InputSNIS></td>
                      <td>Qual o tipo de sistema de Drenagem Urbana? </td>
                      <td><InputP><select {...register('IE016')}
                        defaultValue={dadosGeral?.ie016}
                        onChange={handleOnChange}
                      >
                        <option value="Unitário(misto com esgotamento sanitário)">Unitário (misto com esgotamento sanitário)</option>
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

              <DivFormConteudo active={activeForm === 'operacional'}>
                <DivTitulo>
                  <DivTituloConteudo>Operacional</DivTituloConteudo>
                </DivTitulo>
                <table>
                  <tbody>
                    <tr>

                      <th>Código SNIS</th>
                      <th>Descrição</th>
                      <th>Ano {anoSelected}</th>
                      <th></th>
                    </tr>
                 
                 
                    <tr>
                      <td><InputSNIS>OP001</InputSNIS></td>
                      <td>Quais da seguintes intervenções ou manutenções foram realizadas?</td>
                      <td>
                        <DivChekbox>
                          <CheckBox>
                            <input {...register("OP001_1")}
                              type="checkbox"
                              defaultChecked={dadosGeral?.op001_1}
                            />
                            <span>Não houve intervenção ou manutenção</span></CheckBox>
                          <CheckBox><input {...register("OP001_2")}
                            defaultChecked={dadosGeral?.op001_2}
                            type="checkbox" />
                            <span>Manutenção ou recuperação de sarjetas</span></CheckBox>
                          <CheckBox><input {...register("OP001_3")}
                            defaultChecked={dadosGeral?.op001_3}
                            type="checkbox" />
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

              <DivFormConteudo active={activeForm === 'gestaoDeRisco'}>
                <DivTitulo>
                  <DivTituloConteudo>Gestão de risco</DivTituloConteudo>
                </DivTitulo>
                <table>
                  <tbody>
                    <tr>

                      <th>Código SNIS</th>
                      <th>Descrição</th>
                      <th>Ano {anoSelected}</th>

                    </tr>
                 
                    <tr>
                      <td><InputSNIS>RI001</InputSNIS></td>
                      <td>Indique quais das seguintes instituições existem</td>
                      <td>
                        <DivChekbox>
                          <CheckBox><input {...register('RI001_1')}
                            defaultChecked={dadosGeral?.ri001_1}
                            type="checkbox"
                            name="RI001_1" />
                            <span>Não há instituições relacionadas com a gestão de riscos ou respostas a desastres</span></CheckBox>
                          <CheckBox><input {...register('RI001_2')}
                            defaultChecked={dadosGeral?.ri001_2}
                            type="checkbox" />
                            <span>Unidades de corpos de bombeiros</span></CheckBox>
                          <CheckBox><input {...register('RI001_3')}
                            defaultChecked={dadosGeral?.ri001_3}
                            type="checkbox" />
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
                            defaultChecked={dadosGeral?.ri002_1}
                            type="checkbox" />
                            <span>Nenhuma intervenção ou situação</span></CheckBox>
                          <CheckBox><input {...register('RI002_2')}
                            defaultChecked={dadosGeral?.ri002_3}
                            type="checkbox" />
                            <span>Barragens</span></CheckBox>
                          <CheckBox><input {...register('RI002_3')}
                            defaultChecked={dadosGeral?.ri002_3}
                            type="checkbox" />
                            <span>Retificações de cursos d'água naturais</span></CheckBox>
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
                      <td>Instrumento de controle e monitoramento hidrológicos existentes</td>
                      <td>
                        <DivChekbox>
                          <CheckBox><input {...register('RI003_1')}
                            defaultChecked={dadosGeral?.ri003_1}
                            type="checkbox" />
                            <span>Nenhum instrumento</span></CheckBox>
                          <CheckBox><input {...register('RI003_2')}
                            defaultChecked={dadosGeral?.ri003_2}
                            type="checkbox" />
                            <span>Pluviômetro</span></CheckBox>
                          <CheckBox><input {...register('RI003_3')}
                            defaultChecked={dadosGeral?.ri003_3}
                            type="checkbox" />
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
                      <td>Dados hidrológicos monitorados e metodologia de monitoramento</td>
                      <td>
                        <DivChekbox>
                          <CheckBox><input {...register('RI004_1')}
                            defaultChecked={dadosGeral?.ri004_1}
                            type="checkbox" />
                            <span>Quantidade de chuva por registro auto..</span></CheckBox>
                          <CheckBox><input {...register('RI004_2')}
                            defaultChecked={dadosGeral?.ri004_2}
                            type="checkbox" />
                            <span>Quantidade de chuva por frequência diária</span></CheckBox>
                          <CheckBox><input {...register('RI004_3')}
                            defaultChecked={dadosGeral?.ri004_3}
                            type="checkbox" />
                            <span>Quantidade de chuva por frequência hora..</span></CheckBox>
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
                      <td>Existem sistemas de alerta de riscos hidrológicos (alagamentos, enxurradas, inundaçoẽs)? </td>
                      <td><InputP><select {...register('RI005')}
                        defaultValue={dadosGeral?.ri005}
                        onChange={handleOnChange}
                      >
                        <option ></option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                      </select></InputP></td>

                    </tr>
                    <tr>
                      <td><InputSNIS>RI007</InputSNIS></td>
                      <td>Existe cadastro ou demarcação de marcas históricas de inundações? </td>
                      <td><InputP><select {...register('RI007')}
                        defaultValue={dadosGeral?.ri007}
                        onChange={handleOnChange}
                      >
                        <option ></option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                      </select></InputP></td>

                    </tr>
                    <tr>
                      <td><InputSNIS>RI009</InputSNIS></td>
                      <td>Existe mapeamento de áreas de risco de inundações dos cursos d'água urbana? </td>
                      <td><InputP><select {...register('RI009')}
                        defaultValue={dadosGeral?.ri009}
                        onChange={handleOnChange}
                      >
                        <option ></option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                      </select></InputP></td>

                    </tr>
                    <tr>
                      <td><InputSNIS>RI010</InputSNIS></td>
                      <td>O mapeamento é parcial ou integral?</td>
                      <td><InputP><select {...register('RI010')}
                        onChange={handleOnChange}
                      >
                        <option > {(dadosGeral?.ri010 == 1) ? "Integral" : "Parcial"}  </option>
                        <option value="1">Integral </option>
                        {/* <option value="0">Parcial</option> */}
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
                      <td>Tempo de recorrência (ou periodo de retorno) adotado para o mapeamento</td>

                      <td colSpan={4}>
                        <input
                          {...register('RI012')}
                          defaultValue={dadosGeral?.ri012}
                          onChange={handleOnChange}
                          type="text"
                          onKeyPress={onlyAllowNumber}
                          >
                        </input>
                      </td>

                      <td>Anos</td>
                    </tr>
                    <tr>
                      <td><InputSNIS>RI013</InputSNIS></td>
                      <td>Quantidade docmicílios sujeitos a risco de inundação</td>
                      <td colSpan={4}><input {...register('RI013')}
                        defaultValue={dadosGeral?.ri013}
                        onChange={handleOnChange}
                        type="text"
                        onKeyPress={onlyAllowNumber}
                        ></input></td>
                      <td>Domicílios</td>
                    </tr>

                  </tbody>
                </table>
              </DivFormConteudo>

              <DivFormConteudo active={activeForm === 'observacoes1'}>
                <DivTitulo>
                  <DivTituloConteudo>Observações</DivTituloConteudo>
                </DivTitulo>
                <table>
                <tbody>
                    <tr>

                      <th>Código SNIS</th>
                      <th>Descrição</th>
                      <th>Ano {anoSelected}</th>

                    </tr>
                                  
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

              <DivFormConteudo active={activeForm === 'infoGerais'}>
                <DivTitulo>
                  <DivTituloConteudo>Informações gerais</DivTituloConteudo>
                </DivTitulo>
                <table>
                <tbody>
                    <tr>

                      <th>Código SNIS</th>
                      <th>Descrição</th>
                      <th>Ano {anoSelected}</th>

                    </tr>
                    <tr>
                      <td><InputSNIS>GE201</InputSNIS></td>
                      <td>O oŕgão (Prestador) é também o prestador - direto ou indireto - de outros serviços de Saneamento?</td>
                      <td><InputP><select {...register('GE201')}
                        defaultValue={dadosGeral?.ge201}
                        onChange={handleOnChange}
                      >
                        <option value=""> {dadosGeral?.ge201} </option>
                        <option value="Não">Não</option>
                        <option value="Abastecimento de água potável">Abastecimento de água potável</option>
                        <option value="Esgotamento Sanitário">Esgotamento Sanitário</option>
                        <option value="Abastecimento de água potável e Esgotamento Sanitário">Abastecimento de água potável e Esgotamento Sanitário</option>
                        <option value="Drenagem e manejo de águas pluviais">Drenagem e manejo de águas pluviais</option>
                        <option value="Abast. água potável e Drenagem e manejo de águas pluviais">Abast. água potável e Drenagem e manejo de águas pluviais</option>
                        <option value="Esgot. Sanitário e Drenagem e manejo de águas pluviais">Esgot. Sanitário e Drenagem e manejo de águas pluviais</option>
                        <option value="Abast. água potável, Esgot. Sanitário e Drenagem e manejo de águas pluviais">Abast. água potável, Esgot. Sanitário e Drenagem e manejo de águas pluviais</option>

                      </select></InputP></td>
                    </tr>

                  </tbody>
                </table>
              </DivFormConteudo>

              <DivFormConteudo active={activeForm === "concessionarias"}>
                <DivTitulo>
                  <DivTituloConteudo>Concesionárias</DivTituloConteudo>
                </DivTitulo>
                <table>
                  <tbody>
                    <tr>

                      <th>Código SNIS</th>
                      <th>Descrição</th>
                      <th>Ano {anoSelected}</th>
                      <th></th>
                    </tr>
                    <tr>
                      <td><InputSNIS>GE202</InputSNIS></td>
                      <td>Há empresa com contrato de DELEGAÇÂO (conceção ou contrato de programa) para algum ou todos os serviços de limpeza urbana?</td>
                      <td>
                        <InputP>
                          <select {...register('GE202')}
                            defaultValue={dadosGeral?.ge202}
                            onChange={handleOnChange}
                          >
                            <option value=""></option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                          </select>
                        </InputP>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td><BotaoAdicionar onClick={() => handleModalAddConcesionaria()}>Adicionar concessionária</BotaoAdicionar></td>
                    </tr>
                  </tbody>
                </table>
                
                <Tabela>
                  <table cellSpacing={0} >
                  <tbody >
                      <tr>
                        <th>Concessionária</th>
                        <th>Ano de inicio</th>
                        <th>Duração(em anos)</th>
                        <th>Vigente?</th>
                        <th>Ações</th>
                      </tr>                    
                   
                      {
                        concessionarias?.map((conc, key) => (
                          <tr key={key}>
                            <td>{conc.razao_social}</td>
                            <td>{conc.ano_inicio}</td>
                            <td>{conc.duracao}</td>
                            <td>{conc.vigente}</td>
                            <td>
                            <Actions>
                                  <span>
                                    <Image style={{ cursor: 'pointer' }}
                                      onClick={() => handleModalEditConcesionaria(conc.id_concessionaria)}
                                      title="Editar"
                                      width={30}
                                      height={30}
                                      src={Editar}
                                      alt=""
                                    />
                                  </span>
                                  <span>
                                    <Image style={{ cursor: 'pointer' }}
                                      onClick={() =>('')}
                                      title="Excluir"
                                      width={30}
                                      height={30}
                                      src={Excluir}
                                      alt=""
                                    />
                                  </span>
                                </Actions>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                  </Tabela>
                  
              </DivFormConteudo>

              <DivFormConteudo active={activeForm === 'populacaoAtendida1'}>
                <DivTitulo>
                  <DivTituloConteudo>População atendida</DivTituloConteudo>
                </DivTitulo>
                <table>
                <tbody>
                    <tr>

                      <th>Código SNIS</th>
                      <th>Descrição</th>
                      <th>Ano {anoSelected}</th>

                    </tr>
                  
                    <tr>
                      <td><InputSNIS>CO164</InputSNIS></td>
                      <td>População total atendida no município</td>
                      <td><InputP><input {...register('CO164')}
                        defaultValue={dadosGeral?.co164}
                        onChange={handleOnChange}
                        type="text"
                        onKeyPress={onlyAllowNumber}></input></InputP></td>
                      <td>Habitantes</td>
                    </tr>
                    <tr>
                      <td><InputSNIS>CO050</InputSNIS></td>
                      <td>População urbana atendida no município, abrangendo sede e localidades</td>
                      <td><InputP><input {...register('CO050')}
                        defaultValue={dadosGeral?.co050}
                        onChange={handleOnChange}
                        type="text"
                        onKeyPress={onlyAllowNumber}></input></InputP></td>
                      <td>Habitantes</td>
                    </tr>
                    <tr>
                      <td><InputSNIS>CO165</InputSNIS></td>
                      <td>População urbana atendida pelo serviço de coleta domiciliar direta, ou seja, porta a porta </td>
                      <td><InputP><input {...register('CO165')}
                        defaultValue={dadosGeral?.co165}
                        onChange={handleOnChange}
                        type="text"
                        onKeyPress={onlyAllowNumber}></input></InputP></td>
                      <td>Habitantes</td>
                    </tr>
                    <tr>
                      <td><InputSNIS>CO147</InputSNIS></td>
                      <td>População rural atendida com serviço de coleta domiciliar</td>
                      <td><InputP><input {...register('CO147')}
                        defaultValue={dadosGeral?.co147}
                        onChange={handleOnChange}
                        type="text"
                        onKeyPress={onlyAllowNumber}></input></InputP></td>
                      <td>Habitantes</td>
                    </tr>
                    <tr>
                      <td><InputSNIS>CO134</InputSNIS></td>
                      <td>Percentual da população atendida com frequência diária</td>
                      <td><InputP><input {...register('CO134')}
                        defaultValue={dadosGeral?.co134}
                        onChange={handleOnChange}
                        type="text"
                        onKeyPress={onlyAllowNumber}></input></InputP></td>
                      <td>%</td>
                    </tr>
                    <tr>
                      <td><InputSNIS>CO135</InputSNIS></td>
                      <td>Percentual da população atendida com frequência de 2 a 3 vezes por semana </td>
                      <td><InputP><input {...register('CO135')}
                        defaultValue={dadosGeral?.co135}
                        onChange={handleOnChange}
                        type="text"
                        onKeyPress={onlyAllowNumber}></input></InputP></td>
                      <td>%</td>
                    </tr>
                    <tr>
                      <td><InputSNIS>CO136</InputSNIS></td>
                      <td>Percentual da população atendida com frequência de 1 vezes por semana </td>
                      <td><InputP><input {...register('CO136')}
                        defaultValue={dadosGeral?.co136}
                        onChange={handleOnChange}
                        type="text"
                        onKeyPress={onlyAllowNumber}></input></InputP></td>
                      <td>%</td>
                    </tr>
                    <tr>
                      <td><InputSNIS>CS050</InputSNIS></td>
                      <td>Percentual da população atendida com a COLETA SELETIVA de porta a porta </td>
                      <td><InputP><input {...register('CS050')}
                        defaultValue={dadosGeral?.cs050}
                        onChange={handleOnChange}
                        type="text"
                        onKeyPress={onlyAllowNumber}></input></InputP></td>
                      <td>%</td>
                    </tr>
                  </tbody>
                </table>
              </DivFormConteudo>

              <DivFormConteudo active={activeForm === 'valorContratual'}>
                <DivTitulo>
                  <DivTituloConteudo>Valor contratual</DivTituloConteudo>
                </DivTitulo>
                <table>
                <tbody>
                    <tr>

                      <th>Código SNIS</th>
                      <th>Descrição</th>
                      <th>Ano {anoSelected}</th>

                    </tr>
                  
                  
                    <tr>
                      <td><InputSNIS>CO162</InputSNIS></td>
                      <td>Valor contratual (Preço unitário) do serviço de aterramento de RDO e RDU</td>
                      <td><InputP><input {...register('CO162')}
                        defaultValue={dadosGeral?.co162}
                        onChange={handleOnChange}
                        type="text"
                        onKeyPress={onlyAllowNumber}></input></InputP></td>
                      <td>R$/Toneladas</td>
                    </tr>
                    <tr>
                      <td><InputSNIS>CO178</InputSNIS></td>
                      <td>Valor contratual (Preço unitário) do serviço de coleta e transporte e destinação final de RDO e RPU</td>
                      <td><InputP><input {...register('CO178')}
                        defaultValue={dadosGeral?.co178}
                        onChange={handleOnChange}
                        onKeyPress={onlyAllowNumber}
                      ></input></InputP></td>
                      <td>R$/Toneladas</td>
                    </tr>

                  </tbody>
                </table>
              </DivFormConteudo>

              <DivFormConteudo active={activeForm === 'observacoes3'}>
                <DivTitulo>
                  <DivTituloConteudo>Observações</DivTituloConteudo>
                </DivTitulo>
                <table>
                <tbody>
                    <tr>

                      <th>Código SNIS</th>
                      <th>Descrição</th>
                      <th>Ano {anoSelected}</th>

                    </tr>                 
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
              {isEditor &&  <SubmitButton type="submit">Gravar</SubmitButton>}
              </DivFormEixo>
          </DivForm>

          
        </Form>
      </DivCenter>

      {modalAddConssionaria && (
        <ContainerModal>
          <ModalForm>
            <DivFormResiduo>
              <DivTituloFormResiduo>Edição de cadastro de Concessionária</DivTituloFormResiduo>
              <Form onSubmit={handleSubmit(handleCadastroConcessionaria)}>
                <CloseModalButton style={{'top': '11px'}}
                  onClick={() => {
                    handleCloseModalAddConcesionaria();
                  }}
                >
                  X
                </CloseModalButton>
                <DivFormConteudo style={{'marginLeft': '-20px' }} active={activeForm === "concessionarias"}>
                  <DivTituloConteudo>Dados cadastrais</DivTituloConteudo>
                  <TabelaModal>
                    <table>
                      <thead>
                        <tr>


                          <th>Descrição</th>
                          <th>Ano {anoSelected}</th>

                        </tr>
                      </thead>
                      <tbody> 
                        <input type="hidden" {...register('id_concessionaria')} defaultValue={dadosConcessionaria?.id_concessionaria}></input>
                        <tr>

                          <td><InputGG>CNPJ da Concessionária</InputGG></td>
                          <td><InputP><input 
                            {...register('cnpj')}
                            defaultValue={dadosConcessionaria?.cnpj}
                            type="text"
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
                            <option >Opções</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                          </select></InputP></td>
                        </tr>
                        <tr>
                          <td>Serviços concedidos</td>
                          <td>
                            <DivChekbox>
                              <CheckBox><input {...register('capina_e_rocada')}
                                defaultChecked={dadosConcessionaria?.capina_e_rocada}
                                onChange={handleOnChange}
                                type="checkbox" />
                                <span>Capina e roçada</span></CheckBox>
                              <CheckBox><input {...register('coleta_res_construcao_civil')}
                                defaultChecked={dadosConcessionaria?.coleta_res_construcao_civil}
                                onChange={handleOnChange}
                                type="checkbox" />
                                <span>Coleta de res. contrucão civil</span></CheckBox>
                              <CheckBox><input {...register('coteta_res_domiciliar')}
                                defaultChecked={dadosConcessionaria?.coteta_res_domiciliar}
                                onChange={handleOnChange}
                                type="checkbox" />
                                <span>Coleta de res. Domiciliar</span></CheckBox>
                              <CheckBox><input {...register('coleta_res_servicos_saude')}
                                defaultChecked={dadosConcessionaria?.coleta_res_servicos_saude}
                                onChange={handleOnChange}
                                type="checkbox" />
                                <span>Coleta de res. dos Serviços da Saúde</span></CheckBox>
                              <CheckBox><input {...register('coleta_res_publico')}
                                defaultChecked={dadosConcessionaria?.coleta_res_publico}
                                onChange={handleOnChange}
                                type="checkbox" />
                                <span>Coleta de res. Público</span></CheckBox>
                              <CheckBox><input {...register('operacao_aterro_sanitario')}
                                defaultChecked={dadosConcessionaria?.operacao_aterro_sanitario}
                                onChange={handleOnChange}
                                type="checkbox" />
                                <span>Operação de aterro sanitário</span></CheckBox>
                              <CheckBox><input {...register('operacao_incinerador')}
                                defaultChecked={dadosConcessionaria?.operacao_incinerador}
                                onChange={handleOnChange}
                                type="checkbox" />
                                <span>Operação de incinerador</span></CheckBox>
                              <CheckBox><input {...register('operacao_outras_unidades_processamento')}
                                defaultChecked={dadosConcessionaria?.operacao_outras_unidades_processamento}
                                onChange={handleOnChange}
                                type="checkbox" />
                                <span>Operação de outras unidades de processamento</span></CheckBox>
                              <CheckBox><input {...register('operacao_unidade_compostagem')}
                                defaultChecked={dadosConcessionaria?.operacao_unidade_compostagem}
                                onChange={handleOnChange}
                                type="checkbox" />
                                <span>Operação de unidade de compostagem</span></CheckBox>
                              <CheckBox><input {...register('operacao_triagem')}
                                defaultChecked={dadosConcessionaria?.operacao_triagem}
                                onChange={handleOnChange}
                                type="checkbox" />
                                <span>Operação de triagem</span></CheckBox>
                              <CheckBox><input {...register('outros')}
                                defaultChecked={dadosConcessionaria?.outros}
                                onChange={handleOnChange}
                                type="checkbox" />
                                <span>Outros</span></CheckBox>
                              <CheckBox><input {...register('tipo_desconhecido')}
                                defaultChecked={dadosConcessionaria?.tipo_desconhecido}
                                onChange={handleOnChange}
                                type="checkbox" />
                                <span>Tipo desconhecido</span></CheckBox>
                              <CheckBox><input {...register('varricao_logradouros_publicos')}
                                defaultChecked={dadosConcessionaria?.varricao_logradouros_publicos}
                                onChange={handleOnChange}
                                type="checkbox" />
                                <span>Varrição de logradouros públicos</span></CheckBox>
                            </DivChekbox>
                          </td>
                        </tr>
                        <tr>
                          <td><InputGG>Unidade relacionada</InputGG></td>
                          <td><InputP><select {...register('unidade_relacionada')}
                            defaultValue={dadosConcessionaria?.unidade_relacionada}
                            onChange={handleOnChange}>
                            <option >Opcões</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                          </select></InputP></td>
                        </tr>

                      </tbody>
                    </table>
                  </TabelaModal>
                
                </DivFormConteudo>
                <SubmitButton
                style={{'position' : 'relative', 'left': '-35px','top': '35px'}}
                type="submit">Gravar</SubmitButton>
              </Form>
            </DivFormResiduo>
          </ModalForm>
       
        </ContainerModal>
        
      )}
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

