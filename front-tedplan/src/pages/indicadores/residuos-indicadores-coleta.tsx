/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from 'react-nextjs-toast'
import {
  Container,
  DivCenter,
  Form,
  InputP,
  InputM,
  InputG,
  SubmitButton,
  DivEixo,
  DivTitulo,
  DivFormConteudo,
  DivTituloConteudo,
  InputGG,
  DivSeparadora,
  InputSNIS,
  InputXL,
  DivTituloFormResiduo,
  DivFormResiduo,
  DivFormRe,
  DivBorder,
  LabelCenter,
  
} from "../../styles/residuo-solido-coleta";
import HeadIndicadores from "../../components/headIndicadores";
import "suneditor/dist/css/suneditor.min.css";
import { getAPIClient } from "../../services/axios";
import MenuIndicadores from "../../components/MenuIndicadoresCadastro";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import coleta_escuro from "../../img/Icono-coleta.png"
import Editar from "../../img/editar.png"
import Excluir from "../../img/excluir.png"
import unidade_claro from "../../img/Icono-unidadeDeProcessamento-claro.png"
import {
  Tabela,
  ContainerModal,
  Modal,
  CloseModalButton,
  ConteudoModal,
  FormModal,
  SubmitButtonModal,
  DivBotao,
  IconeColeta,
  TabelaModal,
  BotaoResiduos,
  Actions,
  ModalStepButton, ModalStepContent, ModalStepperContainer, ModalStepperNavigation,
  ModalStepLabel, ModalStepperWrapper, ModalStepperButton
} from "../../styles/residuo-solido-coleta-in";
import Image from "next/image";
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

export default function ResiduosColeta({ municipio }: MunicipioProps) {
  const { usuario, signOut } = useContext(AuthContext);
  const [isMunicipio, setMunicipio] = useState<IMunicipio | any>(municipio);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [activeStep, setActiveStep] = useState(0);
  const [contentForEditor, setContentForEditor] = useState(null);
  const [content, setContent] = useState("");
  const [modalCO020, setModalCO020] = useState(false);
  const [modalRS031, setModalRS031] = useState(false);
  const [modalAssCatadores, setModalAssCatadores] = useState(false);
  const [dadosMunicipio, setDadosMunicipio] = useState<IMunicipio | any>(municipio);
  const [unidadesRsc, setUnidadesRsc] = useState(null);
  const [unidadesRss, setUnidadesRss] = useState(null);
  const [cooperativas, setCooperativas] = useState(null);
  const [dadosResiduos, setDadosResiduos] = useState(null);
  const editor = useRef();
  const firstRender = useRef(true);
  const [currentStep, setCurrentStep] = useState(0);
  const editorContent = useMemo(() => contentForEditor, [contentForEditor]);

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 11));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };



  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };



  
  useEffect(() => {    
    getRsc()  
    getUnidadesRsc()
    getUnidadesRss()
    getCooterativasCatadores()
  }, []);

 
  function handleCloseModalCO020() {
    setModalCO020(false);
  }
  function handleModalCO020() {
    setModalCO020(true);
  }

  function handleCloseModalRS031() {
    setModalRS031(false);
  }
  function handleModalRS031() {
    setModalRS031(true);
  }

  function handleCloseAssCatadores() {
    setModalAssCatadores(false);
  }
  function handleModalAssCatadores() {
    setModalAssCatadores(true);
  }

  

  async function handleCadastroCAC(data) {
    data.id_municipio = municipio[0]?.id_municipio
    data.ano = new Date().getFullYear()
    await api.post('create-cooperativa-catadores', data)
    .then(response=>{
      toast.notify('Dados gravados com sucesso!',{
        title: "Sucesso!",
        duration: 7,
        type: "success",
      })
    }).catch(error=>{
      console.log(error);      
    })
    getCooterativasCatadores()
  }

  async function getCooterativasCatadores(){
    await api.post('list-cooperativas-catadores',     
    {id_municipio: municipio[0]?.id_municipio, ano: new Date().getFullYear()})
    .then(response=>{
      setCooperativas(response.data)             
    })
    .catch((error)=>{
      console.log(error);      
    })
  }

  async function deleteCooperativa(id){    
    
    await api.delete('delete-cooperativa-catadores',{ params: { id: id }})
    .then(response=>{
      toast.notify('Dados deletados com sucesso!',{
        title: "Sucesso!",
        duration: 7,
        type: "success",
      })  
      getCooterativasCatadores()           
    })
    .catch((error)=>{
      console.log(error);      
    })
  }


  function handleCadastro(data) {

    data.TB013 = (data.TB001 ? parseFloat((data.TB001).replace('.','').replace(',','.')) : dadosResiduos?.tb001 ?  parseFloat(dadosResiduos?.tb001) : 0)
    + (data.TB003 ? parseFloat((data.TB003).replace('.','').replace(',','.')) : dadosResiduos?.tb003 ? parseFloat(dadosResiduos?.tb003) : 0 )
    + (data.TB005 ? parseFloat((data.TB005).replace('.','').replace(',','.')) : dadosResiduos?.tb005 ? parseFloat(dadosResiduos?.tb005) : 0 )
    + (data.TB007 ? parseFloat((data.TB007).replace('.','').replace(',','.')) : dadosResiduos?.tb007 ? parseFloat(dadosResiduos?.tb007) : 0 )
    + (data.TB009 ? parseFloat((data.TB009).replace('.','').replace(',','.')) : dadosResiduos?.tb009 ? parseFloat(dadosResiduos?.tb009) : 0 )
    + (data.TB011 ? parseFloat((data.TB011).replace('.','').replace(',','.')) : dadosResiduos?.tb011 ? parseFloat(dadosResiduos?.tb011) : 0 )
    
    data.TB014 = (data.TB002 ? parseFloat((data.TB002).replace('.','').replace(',','.')) : dadosResiduos?.tb002 ? parseFloat(dadosResiduos?.tb002) : 0)
    + (data.TB004 ? parseFloat((data.TB004).replace('.','').replace(',','.')) : dadosResiduos?.tb004 ? parseFloat(dadosResiduos?.tb003) : 0 )
    + (data.TB006 ? parseFloat((data.TB006).replace('.','').replace(',','.')) : dadosResiduos?.tb006 ? parseFloat(dadosResiduos?.tb006) : 0 )
    + (data.TB008 ? parseFloat((data.TB008).replace('.','').replace(',','.')) : dadosResiduos?.tb008 ? parseFloat(dadosResiduos?.tb008) : 0 )
    + (data.TB010 ? parseFloat((data.TB010).replace('.','').replace(',','.')) : dadosResiduos?.tb010 ? parseFloat(dadosResiduos?.tb010) : 0 )
    + (data.TB012 ? parseFloat((data.TB012).replace('.','').replace(',','.')) : dadosResiduos?.tb012 ? parseFloat(dadosResiduos?.tb012) : 0 )

    data.TB015 = (data.TB013 ? data.TB013 : dadosResiduos?.tb013 ? parseFloat(dadosResiduos?.tb013) : 0)
    + (data.TB014 ? data.TB014 : dadosResiduos?.tb014 ? parseFloat(dadosResiduos?.tb014) : 0 )
    
    data.CS026 = (data.CS023 ? parseFloat((data.CS023).replace('.','').replace(',','.')) : dadosResiduos?.cs023 ? parseFloat(dadosResiduos?.cs023) : 0)
    + (data.CS024 ? parseFloat((data.CS024).replace('.','').replace(',','.')) : dadosResiduos?.cs024 ? parseFloat(dadosResiduos?.cs024) : 0 )
    + (data.CS048 ? parseFloat((data.CS048).replace('.','').replace(',','.')) : dadosResiduos?.cs048 ? parseFloat(dadosResiduos?.cs048) : 0 )
    + (data.CS025 ? parseFloat((data.CS025).replace('.','').replace(',','.')) : dadosResiduos?.cs025 ? parseFloat(dadosResiduos?.cs025) : 0 )

    data.CS009 = (data.CS010 ? parseFloat((data.CS010).replace('.','').replace(',','.')) : dadosResiduos?.cs010 ? parseFloat(dadosResiduos?.cs010) : 0)
    + (data.CS014 ? parseFloat((data.CS014).replace('.','').replace(',','.')) : dadosResiduos?.cs014 ? parseFloat(dadosResiduos?.cs014) : 0 )
    
    data.RS044 = (data.RS028 ? parseFloat((data.RS028).replace('.','').replace(',','.')) : dadosResiduos?.rs028 ? parseFloat(dadosResiduos?.rs028) : 0)
    + (data.RS008 ? parseFloat((data.RS008).replace('.','').replace(',','.')) : dadosResiduos?.rs008 ? parseFloat(dadosResiduos?.rs008) : 0 )
    
    data.VA039 = (data.VA010 ? parseFloat((data.VA010).replace('.','').replace(',','.')) : dadosResiduos?.va010 ? parseFloat(dadosResiduos?.va010) : 0)
    + (data.VA011 ? parseFloat((data.VA011).replace('.','').replace(',','.')) : dadosResiduos?.va011 ? parseFloat(dadosResiduos?.va011) : 0 )
    
    data.CO116 = (data.CO108 ? parseFloat((data.CO108).replace('.','').replace(',','.')) : dadosResiduos?.co108 ? parseFloat(dadosResiduos?.co108) : 0)
    + (data.CO112 ? parseFloat((data.CO112).replace('.','').replace(',','.')) : dadosResiduos?.co112? parseFloat(dadosResiduos?.co112) : 0)
    
    data.CO117 = (data.CO109 ? parseFloat((data.CO109).replace('.','').replace(',','.')) : dadosResiduos?.co109 ? parseFloat(dadosResiduos?.co109) : 0)
    + (data.CO113 ? parseFloat((data.CO113).replace('.','').replace(',','.')) : dadosResiduos?.co113 ? parseFloat(dadosResiduos?.co113) : 0)
    
    data.CS048A = (data.CS048 ? (data.CS048).replace('.','').replace(',','.') : dadosResiduos?.cs048 ? parseFloat(dadosResiduos?.cs048) : 0)
    
    data.CO142 = (data.CO140 ? parseFloat((data.CO140).replace('.','').replace(',','.')) : dadosResiduos?.co140 ? parseFloat(dadosResiduos?.co140) : 0)
    + (data.CO141 ? parseFloat((data.CO141).replace('.','').replace(',','.')) : dadosResiduos?.co141 ? parseFloat(dadosResiduos?.co141) : 0)

    data.CO111 = (data.CO108 ? parseFloat((data.CO108).replace('.','').replace(',','.')) : dadosResiduos?.co108 ? parseFloat(dadosResiduos?.co108) : 0)
    + (data.CO109 ? parseFloat((data.CO109).replace('.','').replace(',','.')) : dadosResiduos?.co109 ? parseFloat(dadosResiduos?.co109) : 0)
    + (data.CS048 ? parseFloat((data.CS048).replace('.','').replace(',','.')) : dadosResiduos?.cs048 ? parseFloat(dadosResiduos?.cs048) : 0)
    + (data.CO140 ? parseFloat((data.CO140).replace('.','').replace(',','.')) : dadosResiduos?.co140 ? parseFloat(dadosResiduos?.co140) : 0)

    data.CO115 = (data.CO112 ? parseFloat((data.CO112).replace('.','').replace(',','.')) : dadosResiduos?.co112? parseFloat(dadosResiduos?.co112) : 0)
    + (data.CO113 ? parseFloat((data.CO113).replace('.','').replace(',','.')) : dadosResiduos?.co113 ? parseFloat(dadosResiduos?.co113) : 0)
    + (data.CO141 ? parseFloat((data.CO141).replace('.','').replace(',','.')) : dadosResiduos?.co141 ? parseFloat(dadosResiduos?.co141) : 0)

    data.CC015 = (data.CC014 ? parseFloat((data.CC014).replace('.','').replace(',','.')) : dadosResiduos?.cc014? parseFloat(dadosResiduos?.cc014) : 0)
    + (data.CC013 ? parseFloat((data.CC013).replace('.','').replace(',','.')) : dadosResiduos?.cc013 ? parseFloat(dadosResiduos?.cc013) : 0)

    data.CO119 = (parseFloat(data.CO116) + parseFloat(data.CO117) + parseFloat(data.CS048A)
     + parseFloat(data.CO142) + parseFloat(data.CO111) + parseFloat(data.CO115))


    data.id_residuos_solidos_coleta = dadosResiduos?.id_residuos_solidos_coleta
    data.id_municipio = municipio[0]?.id_municipio
    data.ano = new Date().getFullYear()
    const apiClient = getAPIClient();
    const resCad = apiClient
      .post("addPsResiduosColeta", data)
      .then((response) => {
        toast.notify('Dados gravados com sucesso!',{
          title: "Sucesso!",
          duration: 7,
          type: "success",
        })
        getRsc()
        return response;
      })
      .catch((error) => {
        toast.notify('Ocorreu um erro ao gravar os dados!',{
          title: "Erro!",
          duration: 7,
          type: "error",
        })
        console.log(error);
      });
  }

  async function getUnidadesRsc(){
    await api.post('list-unidades-rsc',     
    {id_municipio: municipio[0]?.id_municipio, ano: new Date().getFullYear()})
    .then(response=>{
      console.log(response.data);
      
      setUnidadesRsc(response.data)             
    })
    .catch((error)=>{
      console.log(error);      
    })
  }

  async function handleCadastroUnidade(data){
    data.id_residuos_solidos_coleta = dadosResiduos?.id_residuos_solidos_coleta
    data.id_municipio = municipio[0]?.id_municipio
    data.ano = new Date().getFullYear()
    const apiClient = getAPIClient();
    const resCad = apiClient
      .post("create-unidade-rsc", data)
      .then((response) => {
        toast.notify('Dados gravados com sucesso!',{
          title: "Sucesso!",
          duration: 7,
          type: "success",
        })
        getUnidadesRsc()
        return response;
      })
      .catch((error) => {
        toast.notify('Ocorreu um erro ao gravar os dados!',{
          title: "Erro!",
          duration: 7,
          type: "error",
        })
        console.log(error);
      });

  }

  async function getUnidadesRss(){
    await api.post('list-unidades-rss',     
    {id_municipio: municipio[0]?.id_municipio, ano: new Date().getFullYear()})
    .then(response=>{
      setUnidadesRss(response.data)             
    })
    .catch((error)=>{
      console.log(error);      
    })
  }

  async function removerUnidadeRss(id){
    await api.delete('remover-unidade-rss',{ params: { id: id }})
    .then(response=>{
      toast.notify('Dados deletados com sucesso!',{
        title: "Sucesso!",
        duration: 7,
        type: "success",
      })  
      getUnidadesRss()           
    })
    .catch((error)=>{
      console.log(error);      
    })

  }


  async function getRsc(){
    
    await api.post('getPsResiduosColeta',     
    {id_municipio: municipio[0]?.id_municipio, ano: new Date().getFullYear()})
    .then(response=>{
      setDadosResiduos(response.data[0])            
    })
    .catch((error)=>{
      console.log(error);      
    })
  }

  async function removerUnidadeRsc(id){
    await api.delete('remover-unidade-rsc',{ params: { id: id }})
    .then(response=>{
      toast.notify('Dados deletados com sucesso!',{
        title: "Sucesso!",
        duration: 7,
        type: "success",
      })  
      getUnidadesRsc()           
    })
    .catch((error)=>{
      console.log(error);      
    })

  }

  async function handleCadastroUnidadeRss(data){
    data.id_residuos_solidos_coleta = dadosResiduos?.id_residuos_solidos_coleta
    data.id_municipio = municipio[0]?.id_municipio
    data.ano = new Date().getFullYear()
    const apiClient = getAPIClient();
    const resCad = apiClient
      .post("create-unidade-rss", data)
      .then((response) => {
        toast.notify('Dados gravados com sucesso!',{
          title: "Sucesso!",
          duration: 7,
          type: "success",
        })
        getUnidadesRss()
        return response;
      })
      .catch((error) => {
        toast.notify('Ocorreu um erro ao gravar os dados!',{
          title: "Erro!",
          duration: 7,
          type: "error",
        })
        console.log(error);
      });

  }

 

  function handleOnChange(content) {
    setContent(content);
  }

  async function handleSignOut() {
    signOut();
  }
   

  function unidadeProcessamento() {
    Router.push("/indicadores/residuos-indicadores-unidade");
  }

  return (
    <Container>
      <ToastContainer></ToastContainer>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuHorizontal municipio={municipio[0].municipio_nome}></MenuHorizontal>
      <MenuIndicadores></MenuIndicadores>
      
        <DivCenter>
     
   
    
        <Form onSubmit={handleSubmit(handleCadastro)}>
        <ModalStepperContainer>
        
          <DivFormResiduo>
            <DivTituloFormResiduo>Resíduos Sólidos</DivTituloFormResiduo>
            <DivCenter>
        <DivBotao>
            <IconeColeta> <Image src={coleta_escuro} alt="Simisab" />
            <BotaoResiduos>Coleta</BotaoResiduos>
            </IconeColeta>      
            <IconeColeta> <Image onClick={()=>unidadeProcessamento()} src={unidade_claro} alt="Simisab" />
            <BotaoResiduos onClick={()=>unidadeProcessamento()}>Processamento</BotaoResiduos>
            </IconeColeta>
        </DivBotao>
        </DivCenter>
        <ModalStepperWrapper>
                  <div>
                    <ModalStepButton active={currentStep === 0} completed={currentStep > 0}>
                      1
                    </ModalStepButton>
                    <ModalStepLabel active={currentStep === 0}>
                    </ModalStepLabel>
                  </div>
                  
                  <div>
                    <ModalStepButton active={currentStep === 1} completed={currentStep > 1}>
                      2
                    </ModalStepButton>
                    <ModalStepLabel active={currentStep === 1}>
                      
                    </ModalStepLabel>
                  </div>

                  <div>
                    <ModalStepButton active={currentStep === 2} completed={currentStep > 2}>
                      3
                    </ModalStepButton>
                    <ModalStepLabel active={currentStep === 2}>
                      
                    </ModalStepLabel>
                  </div>

                  <div>
                    <ModalStepButton active={currentStep === 3} completed={currentStep > 3}>
                      4
                    </ModalStepButton>
                    <ModalStepLabel active={currentStep === 3}>
                    </ModalStepLabel>
                  </div>
                  <div>
                    <ModalStepButton active={currentStep === 4} completed={currentStep > 4}>
                      5
                    </ModalStepButton>
                    <ModalStepLabel active={currentStep === 4}>
                      
                    </ModalStepLabel>
                  </div>

                  <div>
                    <ModalStepButton active={currentStep === 5} completed={currentStep > 5}>
                      6
                    </ModalStepButton>
                    <ModalStepLabel active={currentStep === 5}>
                      
                    </ModalStepLabel>
                  </div>
                  <div>
                    <ModalStepButton active={currentStep === 6} completed={currentStep > 6}>
                      7
                    </ModalStepButton>
                    <ModalStepLabel active={currentStep === 6}>
                      
                    </ModalStepLabel>
                  </div>
                  <div>
                    <ModalStepButton active={currentStep === 7} completed={currentStep > 7}>
                      8
                    </ModalStepButton>
                    <ModalStepLabel active={currentStep === 7}>
                      
                    </ModalStepLabel>
                  </div>
                  <div>
                    <ModalStepButton active={currentStep === 8} completed={currentStep > 8}>
                      9
                    </ModalStepButton>
                    <ModalStepLabel active={currentStep === 8}>
                      
                    </ModalStepLabel>
                  </div>
                  <div>
                    <ModalStepButton active={currentStep === 9} completed={currentStep > 9}>
                      10
                    </ModalStepButton>
                    <ModalStepLabel active={currentStep === 9}>
                      
                    </ModalStepLabel>
                  </div>
                  <div>
                    <ModalStepButton active={currentStep === 10} completed={currentStep > 10}>
                      11
                    </ModalStepButton>
                    <ModalStepLabel active={currentStep === 10}>
                      
                    </ModalStepLabel>
                  </div>
                  <div>
                    <ModalStepButton active={currentStep === 11} completed={currentStep > 11}>
                      12
                    </ModalStepButton>
                    <ModalStepLabel active={currentStep === 11}>
                      
                    </ModalStepLabel>
                  </div>
                 


                </ModalStepperWrapper>
        <ModalStepContent active={currentStep === 0} >
            <DivFormConteudo>
          
              <DivTitulo>
                <DivTituloConteudo>Trabalhadores remunerados</DivTituloConteudo>
              </DivTitulo>
              <InputSNIS>
                <label><b>Código SNIS</b></label>
                <p>TB001</p>
                <p>TB003</p>
                <p>TB005</p>
                <p>TB007</p>
                <p>TB009</p>
                <p>TB011</p>
                <p>TB013</p>
                <p>TB002</p>
                <p>TB004</p>
                <p>TB006</p>
                <p>TB008</p>
                <p>TB010</p>
                <p>TB012</p>
                <p>TB014</p>
                <p>TB015</p>
              </InputSNIS>
              <InputXL>
                <label><b>Descrição</b></label>
                <p>
                  Coletores e Motoristas de agentes PÚBLICOS, alocados na coleta
                </p>
                <p>Agentes PÚBLICOS envolvidos na varrição</p>
                <p>Agentes PÚBLICOS envolvidos com a capina e roçada</p>
                <p>
                  Agentes PÚBLICOS alocados nas unidades de manejo, tratamento
                  ou disposição final
                </p>
                <p>
                  Agentes PÚBLICOS envolvidos nos demais serviços quando não
                  especificados acima
                </p>
                <p>
                  Agentes PÚBLICOS alocados na Gerencia ou
                  Administração (Planejamento ou Fiscalização)
                </p>
                <p>Total de Agentes PÚBLICOS envolvidos</p>
                <p>
                  Coletores e Motoristas de agentes PRIVADOS, alocados na coleta
                </p>
                <p>Agentes PRIVADOS envolvidos na varrição</p>
                <p>Agentes PRIVADOS envolvidos com a capina e roçada</p>
                <p>
                  Agentes PRIVADOS alocados nas unidades de manejo, tratamento
                  ou disposição final
                </p>
                <p>
                  Agentes PRIVADOS envolvidos nos demais serviços quando não
                  especificados acima
                </p>
                <p>
                  Agentes PRIVADOS alocados na Gerencia ou
                  Administração (Planejamento ou Fiscalização)
                </p>
                <p>Total de Agentes PRIVADOS envolvidos</p>
                <p>
                  Total de trabalhadores envolvidos nos servicos de Manejo de
                  RSU
                </p>
              </InputXL>
              <InputP>
                <label><b>Ano:</b> {dadosResiduos?.ano}</label>
              
                <input {...register("TB001")} type="text"
                defaultValue={dadosResiduos?.tb001}
                onChange={handleOnChange}
                ></input>
                <input {...register("TB003")} type="text"
                defaultValue={dadosResiduos?.tb003}
                onChange={handleOnChange}
                ></input>
                <input {...register("TB005")} type="text"
                defaultValue={dadosResiduos?.tb005}
                onChange={handleOnChange}
                ></input>
                <input {...register("TB007")} type="text"
                defaultValue={dadosResiduos?.tb007}
                onChange={handleOnChange}
                ></input>
                <input {...register("TB009")} type="text"
                defaultValue={dadosResiduos?.tb009}
                onChange={handleOnChange}
                ></input>
                <input {...register("TB011")} type="text"
                defaultValue={dadosResiduos?.tb011}
                onChange={handleOnChange}
                ></input>
                <input {...register("TB013")} disabled={true} type="text"
                defaultValue={dadosResiduos?.tb013}
                onChange={handleOnChange}
                ></input>
                <input {...register("TB002")} type="text"
                defaultValue={dadosResiduos?.tb002}
                onChange={handleOnChange}
                ></input>
                <input {...register("TB004")} type="text"
                defaultValue={dadosResiduos?.tb004}
                onChange={handleOnChange}
                ></input>
                <input {...register("TB006")} type="text"
                defaultValue={dadosResiduos?.tb006}
                onChange={handleOnChange}
                ></input>
                <input {...register("TB008")} type="text"
                defaultValue={dadosResiduos?.tb008}
                onChange={handleOnChange}
                ></input>
                <input {...register("TB010")} type="text"
                defaultValue={dadosResiduos?.tb010}
                onChange={handleOnChange}
                ></input>
                <input {...register("TB012")} type="text"
                defaultValue={dadosResiduos?.tb012}
                onChange={handleOnChange}
                ></input>
                <input {...register("TB014")} disabled={true} type="text"
                defaultValue={dadosResiduos?.tb014}
                onChange={handleOnChange}
                ></input>
                <input {...register("TB015")} disabled={true} type="text"
                defaultValue={dadosResiduos?.tb015}
                onChange={handleOnChange}
                ></input>
              </InputP>
              <InputSNIS>
                <label>.</label>
                <p>Empregados</p>
                <p>Empregados</p>
                <p>Empregados</p>
                <p>Empregados</p>
                <p>Empregados</p>
                <p>Empregados</p>
                <p>Empregados</p>
                <p>Empregados</p>
                <p>Empregados</p>
                <p>Empregados</p>
                <p>Empregados</p>
                <p>Empregados</p>
                <p>Empregados</p>
                <p>Empregados</p>
                <p>Empregados</p>
              </InputSNIS>
              <DivEixo>
                Trabalhadores de frentes de trabalho temporárias
              </DivEixo>

              <InputSNIS>
                <p>TB016</p>
                <p>TB017</p>
                <p>TB020</p>
                <p>TB023</p>
                <p>TB026</p>
                <p>TB018</p>
                <p>TB021</p>
                <p>TB024</p>
                <p>TB027</p>
                <p>TB019</p>
                <p>TB022</p>
                <p>TB025</p>
                <p>TB028</p>
              </InputSNIS>
              <InputXL>
                <p>Existem frentes de trabalho temporário?</p>
                <p>Quantidades de trabalhadores Frente !</p>
                <p>Duração de frente 1</p>
                <p>Atuam em mais de um tipo de serviço, Frente 1?</p>
                <p>Tipo de serviço predominate de Frente 1</p>
                <p>Quantidade de trabalhadores Frente 2</p>
                <p>Duração de Frente 2</p>
                <p>Atuam em mais de um tipo de serviço, Frente 2?</p>
                <p>Tipo de serviço predominante da Frente 2</p>
                <p>Quantidade de trabalhadores Frente 3</p>
                <p>Duração de Frente 3</p>
                <p>Atuam em mais de um tipo de serviços, Frente 3?</p>
                <p>Tipo de serviços predominante da Frente 3</p>
              </InputXL>
              <InputP>
                <select {...register("TB016")} >
                  <option>{dadosResiduos?.tb016}</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
                <input {...register("TB017")} type="text"
                defaultValue={dadosResiduos?.tb017}
                onChange={handleOnChange}
                ></input>
                <input {...register("TB020")} type="text"
                defaultValue={dadosResiduos?.tb020}
                onChange={handleOnChange}
                ></input>
                <select {...register("TB023")} >
                  <option>{dadosResiduos?.tb023}</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
                <select {...register("TB026")} >
                  <option>{dadosResiduos?.tb026}</option>
                  <option value="Limpeza pública">Limpeza pública</option>
                  <option value="Coleta de resíduos domiciliares">Coleta de resíduos domiciliares</option>
                  <option value="Coleta seletiva domiciliares">Coleta seletiva domiciliares</option>
                  <option value="Tratamento e disposição de RSU ">Tratamento e disposição de RSU </option>
                </select>
                <input {...register("TB018")} type="text"
                defaultValue={dadosResiduos?.tb018}
                onChange={handleOnChange}
                ></input>
                <input {...register("TB021")} type="text"
                defaultValue={dadosResiduos?.tb021}
                onChange={handleOnChange}
                ></input>
                 <select {...register("TB024")} >
                  <option>{dadosResiduos?.tb024}</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
                <select {...register("TB027")} >
                  <option>{dadosResiduos?.tb027}</option>
                  <option value="Limpeza pública">Limpeza pública</option>
                  <option value="Coleta de resíduos domiciliares">Coleta de resíduos domiciliares</option>
                  <option value="Coleta seletiva domiciliares">Coleta seletiva domiciliares</option>
                  <option value="Tratamento e disposição de RSU ">Tratamento e disposição de RSU </option>
                </select>
                <input {...register("TB019")} type="text"
                defaultValue={dadosResiduos?.tb019}
                onChange={handleOnChange}
                ></input>
                <input {...register("TB022")} type="text"
                defaultValue={dadosResiduos?.tb022}
                onChange={handleOnChange}
                ></input>
               <select {...register("TB025")} >
                  <option>{dadosResiduos?.tb025}</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
                <select {...register("TB028")} >
                  <option>{dadosResiduos?.tb028}</option>
                  <option value="Limpeza pública">Limpeza pública</option>
                  <option value="Coleta de resíduos domiciliares">Coleta de resíduos domiciliares</option>
                  <option value="Coleta seletiva domiciliares">Coleta seletiva domiciliares</option>
                  <option value="Tratamento e disposição de RSU ">Tratamento e disposição de RSU </option>
                </select>
              </InputP>
              <InputSNIS>
                <p>.</p>
                <p>Empregados</p>
                <p>Meses</p>
                <p>Empregados</p>
                <p>.</p>
                <p>Empregados</p>
                <p>Meses</p>
                <p>.</p>
                <p>.</p>
                <p>Empregados</p>
                <p>Meses</p>
                <p>.</p>
                <p>.</p>
              </InputSNIS>
            </DivFormConteudo>
            </ModalStepContent>

            <ModalStepContent active={currentStep === 1} >
            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>
                  Frota de coleta domiciliar e pública
                </DivTituloConteudo>
              </DivTitulo>

              <InputM>
                <label>
                  <b>Tipo de veículo (Quantidade)</b>
                </label>
                <label>.</label>
                <label>.</label>
                <p>Caminhão compactador</p>
                <label>.</label>
                <p>Caminhão basculante, baú ou carroceria</p>
                <label>.</label>
                <p>Caminhão poliguindastes (brook)</p>
                <label>.</label>
                <p>Trator agrícola com reboque</p>
                <label>.</label>
                <p>Tração animal</p>
                <label>.</label>
                <p>Veículos aquáticos (embarcações)</p>
                <label>.</label>
                <p>Outros veículos</p>
              </InputM>
              <InputP>
                <label>.</label>
                <label><b>0 a 5 anos</b></label>
                <label>CO054</label>
                <input {...register("CO054")} type="text"
                defaultValue={dadosResiduos?.co054}
                onChange={handleOnChange}
                ></input>
                <label>CO063</label>
                <input {...register("CO063")} type="text"
                 defaultValue={dadosResiduos?.co063}
                 onChange={handleOnChange}
                ></input>
                <label>CO072</label>
                <input {...register("CO072")} type="text"
                 defaultValue={dadosResiduos?.co072}
                 onChange={handleOnChange}
                ></input>
                <label>CO071</label>
                <input {...register("CO071")} type="text"
                 defaultValue={dadosResiduos?.co071}
                 onChange={handleOnChange}
                ></input>
                <label>CO090</label>
                <input {...register("CO090")} type="text"
                 defaultValue={dadosResiduos?.co090}
                 onChange={handleOnChange}
                ></input>
                <label>CO155</label>
                <input {...register("CO155")} type="text"
                 defaultValue={dadosResiduos?.co155}
                 onChange={handleOnChange}
                ></input>
              </InputP>
              <InputP>
                <label>
                <b>Prefeitura ou SLU</b>
                </label>
                <label><b>5 a 10 anos</b></label>
                <label>CO055</label>
                <input {...register("CO055")} type="text"
                 defaultValue={dadosResiduos?.co055}
                 onChange={handleOnChange}
                ></input>
                <label>CO064</label>
                <input {...register("CO064")} type="text"
                 defaultValue={dadosResiduos?.co064}
                 onChange={handleOnChange}
                ></input>
                <label>CO073</label>
                <input {...register("CO073")} type="text"
                 defaultValue={dadosResiduos?.co073}
                 onChange={handleOnChange}
                ></input>
                <label>CO082</label>
                <input {...register("CO082")} type="text"
                 defaultValue={dadosResiduos?.co082}
                 onChange={handleOnChange}
                ></input>
                <label>CO091</label>
                <input {...register("CO091")} type="text"
                 defaultValue={dadosResiduos?.co091}
                 onChange={handleOnChange}
                ></input>
                <label>CO156</label>
                <input {...register("CO156")} type="text"
                 defaultValue={dadosResiduos?.co156}
                 onChange={handleOnChange}
                ></input>
              </InputP>
              <InputP>
                <label>.</label>
                <label><b>Maior que 10 anos</b></label>
                <label>CO056</label>
                <input {...register("CO056")} type="text"
                 defaultValue={dadosResiduos?.co056}
                 onChange={handleOnChange}
                ></input>
                <label>CO065</label>
                <input {...register("CO065")} type="text"
                 defaultValue={dadosResiduos?.co065}
                 onChange={handleOnChange}
                ></input>
                <label>CO074</label>
                <input {...register("CO074")} type="text"
                 defaultValue={dadosResiduos?.co074}
                 onChange={handleOnChange}
                ></input>
                <label>CO083</label>
                <input {...register("CO083")} type="text"
                 defaultValue={dadosResiduos?.co083}
                 onChange={handleOnChange}
                ></input>
                <label>CO092</label>
                <input {...register("CO092")} type="text"
                 defaultValue={dadosResiduos?.co092}
                 onChange={handleOnChange}
                ></input>
                <label>CO157</label>
                <input {...register("CO157")} type="text"
                 defaultValue={dadosResiduos?.co157}
                 onChange={handleOnChange}
                ></input>
              </InputP>
              <DivBorder></DivBorder>
              <InputP>
                <label> .</label>
                <label> <b>0 a 5 anos</b> </label>
                <label>CO057</label>
                <input {...register("CO057")} type="text"
                 defaultValue={dadosResiduos?.co057}
                 onChange={handleOnChange}
                ></input>
                <label>CO066</label>
                <input {...register("CO066")} type="text"
                 defaultValue={dadosResiduos?.co066}
                 onChange={handleOnChange}
                ></input>
                <label>CO075</label>
                <input {...register("CO075")} type="text"
                 defaultValue={dadosResiduos?.co075}
                 onChange={handleOnChange}
                ></input>
                <label>CO084</label>
                <input {...register("CO084")} type="text"
                 defaultValue={dadosResiduos?.co084}
                 onChange={handleOnChange}
                ></input>
                <label>CO093</label>
                <input {...register("CO093")} type="text"
                 defaultValue={dadosResiduos?.co093}
                 onChange={handleOnChange}
                ></input>
                <label>CO158</label>
                <input {...register("CO158")} type="text"
                 defaultValue={dadosResiduos?.co158}
                 onChange={handleOnChange}
                ></input>
              </InputP>
              <InputP>
                <label>
                  <b>Empr. Contratada</b> 
                </label>
                <label> <b>5 a 10 anos</b> </label>
                <label>CO058</label>
                <input {...register("CO058")} type="text"
                 defaultValue={dadosResiduos?.co058}
                 onChange={handleOnChange}
                ></input>
                <label>CO067</label>
                <input {...register("CO067")} type="text"
                 defaultValue={dadosResiduos?.co067}
                 onChange={handleOnChange}
                ></input>
                <label>CO076</label>
                <input {...register("CO076")} type="text"
                 defaultValue={dadosResiduos?.co076}
                 onChange={handleOnChange}
                ></input>
                <label>CO085</label>
                <input {...register("CO085")} type="text"
                 defaultValue={dadosResiduos?.co085}
                 onChange={handleOnChange}
                ></input>
                <label>CO094</label>
                <input {...register("CO094")} type="text"
                 defaultValue={dadosResiduos?.co094}
                 onChange={handleOnChange}
                ></input>
                <label>CO159</label>
                <input {...register("CO159")} type="text"
                 defaultValue={dadosResiduos?.co159}
                 onChange={handleOnChange}
                ></input>
              </InputP>
              <InputP>
                <label>.</label>
                <label> <b>Maior que 10 anos</b> </label>
                <label>CO059</label>
                <input {...register("CO059")} type="text"
                 defaultValue={dadosResiduos?.co059}
                 onChange={handleOnChange}
                ></input>
                <label>CO068</label>
                <input {...register("CO068")} type="text"
                 defaultValue={dadosResiduos?.co068}
                 onChange={handleOnChange}
                ></input>
                <label>CO077</label>
                <input {...register("CO077")} type="text"
                 defaultValue={dadosResiduos?.co077}
                 onChange={handleOnChange}
                ></input>
                <label>CO086</label>
                <input {...register("CO086")} type="text"
                 defaultValue={dadosResiduos?.co086}
                 onChange={handleOnChange}
                ></input>
                <label>CO095</label>
                <input {...register("CO095")} type="text"
                 defaultValue={dadosResiduos?.co095}
                 onChange={handleOnChange}
                ></input>
                <label>CO160</label>
                <input {...register("CO160")} type="text"
                 defaultValue={dadosResiduos?.co160}
                 onChange={handleOnChange}
                ></input>
              </InputP>
              <InputGG>
                <label>CO163</label>
                <textarea {...register("CO163")}
                 defaultValue={dadosResiduos?.co163}
                 onChange={handleOnChange}
                />
              </InputGG>
            </DivFormConteudo>
            </ModalStepContent>

            <ModalStepContent active={currentStep === 2}>
            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>
                  Residuos sólidos domiciliares e públicos coletados
                </DivTituloConteudo>
              </DivTitulo>
              <InputSNIS>
                <label><b>Código SNIS</b></label>
                <p>CO154</p>
                <p>CO012</p>
                <p>CO146</p>
                <p>CO148</p>
                <p>CO149</p>
                <p>CO150</p>
                <p>CO151</p>
                <p>CO152</p>
              </InputSNIS>
              <InputXL>
                <label><b>Descrição</b></label>
                <p>
                  Os residuos provenientes da varrição ou limpeza de logradouros
                  públicos são recolhidos junto com os residuos domiciliares?
                </p>
                <p>
                  Valor contratado (preço unitário) do serviço de RDO e RPU
                  diurna
                </p>
                <p>
                  Valor contratual (preço unitário) do serviço de transporte de
                  RDO e RPU até a unidade de destinação final
                </p>
                <p>
                  No preço acima está incluido o transporte de RDO e RPU
                  coletados até a destinação final?
                </p>
                <p>
                  A distancia média do centro de massa à unidade de destinação
                  final é superior a 15 km?
                </p>
                <p>
                  Especifique a distancia do centro de massa à unidade de
                  destinação final superior a 15km
                </p>
                <p>
                  A distancia média de transporte à unidade de destinação final
                  é superior a 15km?
                </p>
                <p>
                  Especifique a distancia de transporte à unidade de destinação
                  final superior a 15km
                </p>
              </InputXL>

              <InputP>

                <label>Ano: {new Date().getFullYear()}</label>

                <select {...register("CO154")} >
                  <option>{dadosResiduos?.co154}</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
                <input {...register("CO012")} type="text"
                 defaultValue={dadosResiduos?.co012}
                 onChange={handleOnChange}
                ></input>
                <input {...register("CO146")} type="text"
                 defaultValue={dadosResiduos?.co146}
                 onChange={handleOnChange}
                ></input>
                <select {...register("CO148")} >
                  <option>{dadosResiduos?.co148}</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
                <select {...register("CO149")} >
                  <option>{dadosResiduos?.co149}</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
                <input {...register("CO150")} type="text"
                defaultValue={dadosResiduos?.co150}
                onChange={handleOnChange}
                ></input>
                <select {...register("CO151")} >
                  <option>{dadosResiduos?.co151}</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
                <input {...register("CO152")} type="text"
                defaultValue={dadosResiduos?.co152}
                onChange={handleOnChange}
                ></input>
              </InputP>
              <InputSNIS>
                <label>.</label>
                <p>.</p>
                <p>R$/tonelada</p>
                <p>R$/tonelada</p>
                <p>.</p>
                <p>.</p>
                <p>Km</p>
                <p>.</p>
                <p>Km</p>
              </InputSNIS>

              <table>
                <thead>
                  <tr>
                    <th>
                      <span>Tipo de resíduos (Quantidade em toneladas)</span>
                    </th>
                    <th>
                      <span>Prefeitura ou SLU</span>
                    </th>
                    <th>
                      <span>Empresas ou autônomos contratados</span>
                    </th>
                    <th>
                      <span>
                        Assoc. ou Coop. de Catadores c/ coleta seletiva
                      </span>
                    </th>
                    <th>
                      <span>
                        Outros (inclusive proprios gerad. exceto catadores)
                      </span>
                    </th>
                    <th>
                      <span>Total</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                <tr>
                    <td></td>
                    <td>
                      <LabelCenter>
                        <InputP>CO108</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>CO109</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>CS048</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>CO140</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>CO111</InputP>
                      </LabelCenter>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>Domiciliar e Comercial</p>
                    </td>
                    <td>
                    <InputP><input {...register("CO108")} type="text"
                    defaultValue={dadosResiduos?.co108}
                    onChange={handleOnChange}
                    ></input></InputP>
                    </td>
                    <td>
                    <InputP><input {...register("CO109")} type="text"
                    defaultValue={dadosResiduos?.co109}
                    onChange={handleOnChange}
                    ></input></InputP>
                    </td>
                    <td>
                    <InputP><input {...register("CS048")} type="text"
                    defaultValue={dadosResiduos?.cs048}
                    onChange={handleOnChange}
                    ></input></InputP>
                    </td>
                    <td>
                    <InputP><input {...register("CO140")} type="text"
                    defaultValue={dadosResiduos?.co140}
                    onChange={handleOnChange}
                    ></input></InputP>
                    </td>
                    <td>
                    <InputP><input {...register("CO111")} type="text"
                    defaultValue={dadosResiduos?.co111}
                    onChange={handleOnChange}
                    disabled={true}
                    ></input></InputP>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <LabelCenter>
                        <InputP>CO112</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>CO113</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                    
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>CO141</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>CO115</InputP>
                      </LabelCenter>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>Público (Limpeza de logradouros)</p>
                    </td>
                    <td>
                    <InputP><input {...register("CO112")} type="text"
                    defaultValue={dadosResiduos?.co112}
                    onChange={handleOnChange}
                    ></input></InputP>
                    </td>
                    <td>
                    <InputP><input {...register("CO113")} type="text"
                    defaultValue={dadosResiduos?.co113}
                    onChange={handleOnChange}
                    ></input></InputP>
                    </td>
                    <td></td>
                    <td>
                    <InputP><input {...register("CO141")} type="text"
                    defaultValue={dadosResiduos?.co141}
                    onChange={handleOnChange}
                    ></input></InputP>
                    </td>
                    <td>
                    <InputP><input {...register("CO115")} type="text"
                    defaultValue={dadosResiduos?.co115}
                    onChange={handleOnChange}
                    disabled={true}
                    ></input></InputP>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <LabelCenter>
                        <InputP>CO116</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>CO117</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>CS048</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>CO142</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>CO119</InputP>
                      </LabelCenter>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>Total</p>
                    </td>
                    <td>
                    <InputP><input {...register("CO116")}
                     type="text" disabled={true}
                    defaultValue={dadosResiduos?.co116}
                    onChange={handleOnChange}
                    ></input></InputP>
                    </td>
                    <td>
                    <InputP><input {...register("CO117")} type="text"
                    defaultValue={dadosResiduos?.co117}
                    onChange={handleOnChange}
                    disabled={true}
                    ></input></InputP>
                    </td>
                    <td>
                    <InputP><input {...register("CS048A")} disabled={true} type="text"
                    defaultValue={dadosResiduos?.cs048a}
                    onChange={handleOnChange}
                    ></input></InputP>
                    </td>
                    <td>
                    <InputP><input {...register("CO142")} type="text"
                    defaultValue={dadosResiduos?.co142}
                    onChange={handleOnChange}
                    disabled={true}
                    ></input></InputP>
                    </td>
                    <td>
                    <InputP><input {...register("CO119")} type="text"
                    defaultValue={dadosResiduos?.co119}
                    onChange={handleOnChange}
                    disabled={true}
                    ></input></InputP>
                    </td>
                  </tr>
                </tbody>
              </table>
            </DivFormConteudo>
            </ModalStepContent>

            <ModalStepContent active={currentStep === 3}>
            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>
                  Fluxo dos Resíduos Domiciliares Coletados
                </DivTituloConteudo>
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
                    <td>CO021</td>
                    <td>
                      <InputGG>
                        {" "}
                        É utilizada balança para pesagem rotineira dos residuos
                        sólidos coletados?
                      </InputGG>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("CO021")} 
                        defaultValue={dadosResiduos?.co021}
                        onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value="Sim">Sim</option>
                          <option value="Nao">Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>
                  <tr>
                    <td>CO019</td>
                    <td>Os resíduos sólidos DOMICILIARES coletados são enviados para outro município?</td>
                    <td>
                      <InputP>
                        <select {...register("CO019")}
                         defaultValue={dadosResiduos?.co019}
                         onChange={handleOnChange}
                        >
                          <option >Selecionar</option>
                          <option value="Sim">Sim</option>
                          <option value="Nao">Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>
                  <tr>
                    <td>CO020</td>
                    <td>Município(s) de destino de RDO e RPU exportado</td>
                    <th>
                      <p
                        onClick={() => {
                          handleModalCO020();
                        }}
                      >
                        Adicionar
                      </p>
                    </th>
                  </tr>
                </tbody>
              </table>

              <Tabela>
                <table cellSpacing={0}>
                  <thead>
                    <tr>
                      <th>Município</th>
                      <th>Unidade</th>
                      <th>Tipo de unidade</th>
                      <th>Operador da unidade</th>
                      <th>CNPJ da unidade</th>
                      <th>Quant. resíduos exportados</th>
                      <th>Ações</th>
                    </tr>                   
                  </thead>
                  <tbody>
                    {
                      unidadesRsc?.map((unidade, key)=>(
                        <>
                        <tr key={key}>
                            <td>{unidade.municipio}</td>
                            <td>{unidade.nome_unidade}</td>
                            <td>{unidade.tipo_unidade}</td>
                            <td>{unidade.operador_unidade}</td>
                            <td>{unidade.cnpj_unidade}</td>
                            <td>{unidade.quant_residuos_exportados}</td>
                            <td>
                            <Actions>
                                
                                <span><Image onClick={()=>removerUnidadeRsc(unidade.id_unidade_residuo_solido)}
                                  title="Excluir" width={30} height={30} src={Excluir} alt="" />
                                </span>
                                </Actions>
                            </td>
                         </tr>
                         </>
                      ))
                    }
                    
                  </tbody>
                </table>
              </Tabela>
            </DivFormConteudo>
            </ModalStepContent>

            <ModalStepContent active={currentStep === 4}>
            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>
                  Serviços de coleta noturna com uso de contêiner
                </DivTituloConteudo>
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
                    <td>CO008</td>
                    <td>
                      <InputG>
                        Há serviços de coleta noturna no município?
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("CO008")}
                        defaultValue={dadosResiduos?.co008}
                        onChange={handleOnChange}
                        >
                          <option >Selecionar</option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>
                  <tr>
                    <td>CO131</td>
                    <td>
                      <InputG>
                        Há execução de coleta com elevação de contêineres por
                        caminhão compactador, mesmo implantada em caráter de
                        experiência?{" "}
                      </InputG>
                    </td>

                    <td>
                      <InputP>
                        
                        <select {...register("CO131")}
                        defaultValue={dadosResiduos?.co131}
                        onChange={handleOnChange}
                        >
                          <option >Selecionar</option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>
                  <tr>
                    <td>CO999</td>
                    <td>Obsevações</td>
                    <th>
                      <div>
                        <textarea {...register("CO999")}
                        defaultValue={dadosResiduos?.co999}
                        onChange={handleOnChange}
                        ></textarea>
                      </div>
                    </th>
                  </tr>
                </tbody>
              </table>
            </DivFormConteudo>
            </ModalStepContent>

            <ModalStepContent active={currentStep === 5}>
            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>
                  Características das unidades registradas como ATERROS ou LIXÕES
                </DivTituloConteudo>
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
                    <td>CS001</td>
                    <td>
                      <InputXL>Existe coleta seletiva?</InputXL>
                    </td>
                    <td>
                      <InputP>
                        
                        <select {...register("CS001")}
                        defaultValue={dadosResiduos?.cs001}
                        onChange={handleOnChange}
                        >
                          <option >Selecionar</option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>
                  <tr>
                    <td>CS053</td>
                    <td>
                      <InputXL>
                        Há empresas contratadas para prestação do serviço de
                        coleta seletiva porta a porta?
                      </InputXL>
                    </td>
                    <td>
                      <InputP>
                       
                        <select {...register("CS053")}
                        defaultValue={dadosResiduos?.cs053}
                        onChange={handleOnChange}
                        >
                          <option >Selecionar</option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>
                  <tr>
                    <td>CS054</td>
                    <td>
                      <InputXL>
                        Valor contratual (preço unitário) do serviço de coleta
                        seletiva porta a porta contratado às empresas (PREENCHER
                        VALOR MÉDIO SE HOUVER MAIS DE UM)
                      </InputXL>
                    </td>
                    <td>
                      <InputP>
                        <input {...register("CS054")} type="text"
                        defaultValue={dadosResiduos?.cs054}
                        onChange={handleOnChange}
                        ></input>
                      </InputP>
                    </td>
                    <td>R$/tonelada</td>
                  </tr>
                  <tr>
                    <td>CS055</td>
                    <td>
                      <InputXL>
                        No preço acima está incluido o serviço de triagem dos
                        materiais recicláveis?
                      </InputXL>
                    </td>
                    <td>
                      <InputP>
                       
                        <select {...register("CS055")}
                        defaultValue={dadosResiduos?.cs055}
                        onChange={handleOnChange}
                        >
                          <option >Selecionar</option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>
                  <tr>
                    <td>CS061</td>
                    <td>
                      <InputXL>
                        Há empresas contratadas para prestação do serviço de
                        triagem de materias recicláveis secos?
                      </InputXL>
                    </td>
                    <td>
                      <InputP>
                        
                        <select {...register("CS061")}
                        defaultValue={dadosResiduos?.cs061}
                        onChange={handleOnChange}
                        >
                          <option >Selecionar</option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>
                  <tr>
                    <td>CS056</td>
                    <td>
                      <InputXL>
                        Valor contratual (preço unitário) do serviço de triagem
                        de materias reciclaveis contratado às empresas (PREENCHER
                        VALOR MÉDIO SE HOUVER MAIS DE UM)
                      </InputXL>
                    </td>
                    <td>
                      <InputP>
                        <input {...register("CS056")} type="text"
                        defaultValue={dadosResiduos?.cs056}
                        onChange={handleOnChange}
                        ></input>
                      </InputP>
                    </td>
                    <td>R$/tonelada</td>
                  </tr>
                  <tr>
                    <td>CS057</td>
                    <td>
                      <InputXL>
                        Há associações ou cooperativas de catadores contratadas
                        para a prestação do serviço de coleta seletiva porta a
                        porta
                      </InputXL>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("CS057")} 
                        defaultValue={dadosResiduos?.cs057}
                        onChange={handleOnChange}
                        >
                            <option >Selecionar</option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>
                  <tr>
                    <td>CS058</td>
                    <td>
                      <InputXL>
                        Valor contratual (preço unitário) do serviço de coleta
                        seletiva porta a porta contratado às
                        associações/cooperativas (PREENCHER VALOR MÉDIO SE HOUVER
                        MAIS DE UM)
                      </InputXL>
                    </td>
                    <td>
                      <InputP>
                        <input {...register("CS058")} type="text"
                        defaultValue={dadosResiduos?.cs058}
                        onChange={handleOnChange}
                        ></input>
                      </InputP>
                    </td>
                    <td>R$/tonelada</td>
                  </tr>
                  <tr>
                    <td>CS059</td>
                    <td>
                      <InputXL>
                        No preço acima está incluido o serviço de triagem dos
                        materiais recicláveis?
                      </InputXL>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("CS059")}
                        defaultValue={dadosResiduos?.cs059}
                        onChange={handleOnChange}
                        >
                            <option >Selecionar</option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>
                  <tr>
                    <td>CS062</td>
                    <td>
                      <InputXL>
                        Há associações/cooperativas de catadores contratadas
                        para a prestação do serviço de triagem de recicláveis
                        secos?
                      </InputXL>
                    </td>
                    <td>
                      <InputP>                        
                        <select {...register("CS062")}
                        defaultValue={dadosResiduos?.cs059}
                        onChange={handleOnChange}
                        >  <option >Selecionar</option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>
                  <tr>
                    <td>CS057</td>
                    <td>
                      <InputXL>
                        Valor contratual (preço unitário) do serviço de materiais
                        recicláveis secos contratado às associações de
                        catadores (PREENCHER VALOR MÉDIO SE HOUVER MAIS DE UM)
                      </InputXL>
                    </td>
                    <td>
                      <InputP>
                        <input {...register("CS057A")} type="text"
                          defaultValue={dadosResiduos?.cs057a}
                          onChange={handleOnChange}
                        ></input>
                      </InputP>
                    </td>
                    <td>R$/tonelada</td>
                  </tr>
                </tbody>
              </table>
              <table>
                <thead>
                  <tr>
                    <th>
                      <span>Executor</span>
                    </th>
                    <th></th>
                    <th>
                      <InputP>
                        <span>Forma adotada</span>
                      </InputP>
                    </th>
                    <th></th>
                  </tr>
                  <tr>
                    <th></th>
                    <th>
                      <LabelCenter>
                        <InputP>Porta a porta em dias especifícos</InputP>
                      </LabelCenter>
                    </th>
                    <th>
                      <LabelCenter>
                        <InputP>Postos de entrega voluntárias</InputP>
                      </LabelCenter>
                    </th>
                    <th>
                      <LabelCenter>
                        <InputP>Outros sistemas</InputP>
                      </LabelCenter>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
                    <td>
                      <LabelCenter>
                        <InputP>CS027</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>CS031</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>CS035</InputP>
                      </LabelCenter>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <InputG>
                        Prefeitura Municipipal ou empresa contratada
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("CS027")} 
                          defaultValue={dadosResiduos?.cs027}
                          onChange={handleOnChange}
                        >
                           <option >Selecionar</option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("CS031")}
                          defaultValue={dadosResiduos?.cs031}
                          onChange={handleOnChange}
                        >
                          <option >Selecionar</option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("CS035")} 
                          defaultValue={dadosResiduos?.cs035}
                          onChange={handleOnChange}
                        >
                          <option >Selecionar</option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <LabelCenter>
                        <InputP>CS028</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>CS032</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>CS036</InputP>
                      </LabelCenter>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <InputG>
                        Empresa(s) privada(s) do ramo sucateiros, aparista, ferro velho
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("CS028")}
                         defaultValue={dadosResiduos?.cs028}
                         onChange={handleOnChange}
                        >
                          <option >Selecionar</option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("CS032")}
                         defaultValue={dadosResiduos?.cs032}
                         onChange={handleOnChange}
                        >
                        <option >Selecionar</option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("CS036")}
                         defaultValue={dadosResiduos?.cs036}
                         onChange={handleOnChange}
                        >
                        <option >Selecionar</option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <LabelCenter>
                        <InputP>CS042</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>CS043</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>CS044</InputP>
                      </LabelCenter>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <InputG>
                        Associação ou Cooperativa COM parceria/ da prefeitura
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("CS042")}
                         defaultValue={dadosResiduos?.cs042}
                         onChange={handleOnChange}
                        >
                        <option >Selecionar</option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("CS043")}
                         defaultValue={dadosResiduos?.cs043}
                         onChange={handleOnChange}
                        >
                          <option >Selecionar</option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("CS044")}
                         defaultValue={dadosResiduos?.cs044}
                         onChange={handleOnChange}
                        >
                          <option >Selecionar</option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <LabelCenter>
                        <InputP>CS045</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>CS046</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>CS047</InputP>
                      </LabelCenter>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <InputG>
                      Associação ou Cooperativa SEM parceria/ da prefeitura
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("CS045")}
                         defaultValue={dadosResiduos?.cs045}
                         onChange={handleOnChange}
                        >
                          <option >Selecionar</option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("CS046")}
                         defaultValue={dadosResiduos?.cs059}
                         onChange={handleOnChange}
                        >
                        <option >Selecionar</option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("CS047")}
                         defaultValue={dadosResiduos?.cs047}
                         onChange={handleOnChange}
                        >
                          <option >Selecionar</option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <LabelCenter>
                        <InputP>CS030</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>CS034</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>CS038</InputP>
                      </LabelCenter>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <InputG>
                        Outros desde que com parceria da prefeitura
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("CS030")}
                         defaultValue={dadosResiduos?.cs030}
                         onChange={handleOnChange}
                        >
                        <option >Selecionar</option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("CS034")}
                         defaultValue={dadosResiduos?.cs034}
                         onChange={handleOnChange}
                        >
                        <option >Selecionar</option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("CS038")} 
                         defaultValue={dadosResiduos?.cs038}
                         onChange={handleOnChange}
                        >
                        <option >Selecionar</option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>
                </tbody>
              </table>


              <DivEixo>Recolhido por Agente Executor</DivEixo>
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
                    <td>CS023</td>
                    <td>
                      <InputGG>
                        Quantidade recolhida na coleta seletiva executada pela Prefeitura ou SLU
                      </InputGG>
                    </td>
                    <td>
                      <InputP>
                        <input {...register("CS023")}
                         defaultValue={dadosResiduos?.cs023}
                         onChange={handleOnChange}
                        type="text"></input>
                      </InputP>
                    </td>
                    <td>Toneladas</td>
                  </tr>
                  <tr>
                    <td>CS024</td>
                    <td>
                      <InputGG>
                        Qtd. recolhida executada por empresa(s) contratada(s) pela Prefeitura ou SLU
                      </InputGG>
                    </td>

                    <td>
                      <InputP>
                        <input {...register("CS024")}
                         defaultValue={dadosResiduos?.cs024}
                         onChange={handleOnChange}
                        type="text"></input>
                      </InputP>
                    </td>
                    <td>Toneladas</td>
                  </tr>
                  <tr>
                    <td>CS048</td>
                    <td>
                      <InputGG>
                      Qtd. recolhida executada por associação ou cooperativa de catadores COM parceria/apoio da prefeitura
                      </InputGG>
                    </td>
                    <td>
                      <InputP>
                        <input {...register("CS048B")}
                         defaultValue={dadosResiduos?.cs048b}
                         onChange={handleOnChange}
                        type="text"></input>
                      </InputP>
                    </td>
                    <td>Toneladas</td>
                  </tr>
                  <tr>
                    <td>CS025</td>
                    <td>
                      <InputGG>
                      Qtd. recolhida por outros agentes que detenham parceria COM a Prefeitura
                      </InputGG>
                    </td>

                    <td>
                      <InputP>
                        <input {...register("CS025")}
                         defaultValue={dadosResiduos?.cs025}
                         onChange={handleOnChange}
                        type="text"></input>
                      </InputP>
                    </td>
                    <td>Toneladas</td>
                  </tr>
                  <tr>
                    <td>CS026</td>
                    <td>
                      <InputGG>
                      Qtd. total recolhida pelos 4 agentes executores acima mencionados
                      </InputGG>
                    </td>
                    <td>
                      <InputP>
                        <input {...register("CS026")} disabled={true}
                         defaultValue={dadosResiduos?.cs026}
                         onChange={handleOnChange}
                        type="text"></input>
                      </InputP>
                    </td>
                    <td>Toneladas</td>
                  </tr>  
              
                </tbody>           
              </table>
              <table>
                  <tbody>
                  <tr>
                    <td><InputSNIS>CS049</InputSNIS></td>
                    <td><InputG>Mencione os outros agentes que detenham parceria COM a Prefeitura</InputG></td>
                    <th>
                      <InputG>
                        <textarea {...register("CS049")}
                         defaultValue={dadosResiduos?.cs049}
                         onChange={handleOnChange}
                        ></textarea>
                      </InputG>
                    </th>
                  </tr>
                  </tbody>
                </table>


              <DivEixo>Materiais recicláveis recuperados</DivEixo>
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
                    <td>CS051</td>
                    <td>
                      <InputGG>
                        Houve RECUPERAÇÃO de materiais reciclaveis executada em unidades de triagem? NÃO CONSIDERAR LIXÕES
                      </InputGG>
                    </td>
                    <td>
                      <InputP>
                      <select {...register("CS051")}
                         defaultValue={dadosResiduos?.cs051}
                         onChange={handleOnChange}
                      >
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                      </select>
                      
                      </InputP>
                    </td>
                  </tr>
                  <tr>
                    <td>CS010</td>
                    <td>
                      <InputGG>
                        Quantidade de Papel e papelão recicláveis recuperados 
                      </InputGG>
                    </td>

                    <td>
                      <InputP>
                        <input {...register("CS010")} type="text"
                         defaultValue={dadosResiduos?.cs010}
                         onChange={handleOnChange}
                        ></input>
                      </InputP>
                    </td>
                    <td>Toneladas</td>
                  </tr>
                  <tr>
                    <td>CS011</td>
                    <td>
                      <InputGG>
                        Quantidade de Plásticos recicláveis recuperados 
                      </InputGG>
                    </td>
                    <td>
                      <InputP>
                        <input {...register("CS011")} type="text"
                         defaultValue={dadosResiduos?.cs011}
                         onChange={handleOnChange}
                        ></input>
                      </InputP>
                    </td>
                    <td>Toneladas</td>
                  </tr>
                  <tr>
                    <td>CS012</td>
                    <td>
                      <InputGG>
                       Quantidade de Metais recicláveis recuperados
                      </InputGG>
                    </td>

                    <td>
                      <InputP>
                        <input {...register("CS012")} type="text"
                         defaultValue={dadosResiduos?.cs012}
                         onChange={handleOnChange}
                        ></input>
                      </InputP>
                    </td>
                    <td>Toneladas</td>
                  </tr>
                  <tr>
                    <td>CS013</td>
                    <td>
                      <InputGG>
                        Quantidade de Vidros recicláveis recuperados
                      </InputGG>
                    </td>
                    <td>
                      <InputP>
                        <input {...register("CS013")} type="text"
                         defaultValue={dadosResiduos?.cs013}
                         onChange={handleOnChange}
                        ></input>
                      </InputP>
                    </td>
                    <td>Toneladas</td>
                  </tr>
                  <tr>
                    <td>CS014</td>
                    <td>
                      <InputGG>
                        Quantidade de Outros materiais recicláveis recuperados
                      </InputGG>
                    </td>

                    <td>
                      <InputP>
                        <input {...register("CS014")} type="text"
                         defaultValue={dadosResiduos?.cs014}
                         onChange={handleOnChange}
                        ></input>
                      </InputP>
                    </td>
                    <td>Toneladas</td>
                  </tr>
                  <tr>
                    <td>CS009</td>
                    <td>
                      <InputGG>
                        Quantidade total de materiais recicláveis recuperados
                      </InputGG>
                    </td>
                    <td>
                      <InputP>
                        <input {...register("CS009")} type="text"
                         defaultValue={dadosResiduos?.cs009}
                         disabled
                         onChange={handleOnChange}
                        ></input>
                      </InputP>
                    </td>  
                    <td>Toneladas</td>                  
                  </tr>               
                </tbody>
              </table>


            </DivFormConteudo>
            </ModalStepContent>

            <ModalStepContent active={currentStep === 6}>
            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>Resíduos sólidos dos serviços da saúde (RSS)</DivTituloConteudo>
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
                    <td>RS020</td>
                    <td>
                      <InputGG>
                        Existe no município coleta diferenciada de resíduos sólidos da saúde?
                      </InputGG>
                    </td>
                    <td>
                      <InputP>
                      <select {...register("RS020")}
                       defaultValue={dadosResiduos?.rs020}
                       onChange={handleOnChange}
                      >
                        <option >Selecionar</option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                      </select>
                      
                      </InputP>
                    </td>
                  </tr>
                  <tr>
                    <td>RS004</td>
                    <td>
                      <InputGG>
                        A coleta diferenciada realizada pela prefeitura é cobrada separadamente? 
                      </InputGG>
                    </td>
                    <td>
                      <InputP>
                      <select {...register("RS004")}
                       defaultValue={dadosResiduos?.rs004}
                       onChange={handleOnChange}
                      >
                        <option >Selecionar</option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                      </select>
                      
                      </InputP>
                    </td>
                  </tr>
                  <tr>
                    <td>RS045</td>
                    <td>
                      <InputGG>
                        Executada pela Prefeitura ou SLU?
                      </InputGG>
                    </td>
                    <td>
                      <InputP>
                      <select {...register("RS045")}
                       defaultValue={dadosResiduos?.rs045}
                       onChange={handleOnChange}
                      ><option >Selecionar</option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                      </select>
                      
                      </InputP>
                    </td>
                  </tr>
                  <tr>
                    <td>RS046</td>
                    <td>
                      <InputGG>
                        Empresa contratada pela Prefeitura ou SLU?
                      </InputGG>
                    </td>
                    <td>
                      <InputP>
                      <select {...register("RS046")}
                      defaultValue={dadosResiduos?.rs046}
                      onChange={handleOnChange}
                      ><option >Selecionar</option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                      </select>
                      
                      </InputP>
                    </td>
                  </tr>
                  <tr>
                    <td>RS003</td>
                    <td>
                      <InputGG>
                        Executada pelo próprio gerador ou empresa contratada por ele?
                      </InputGG>
                    </td>
                    <td>
                      <InputP>
                      <select {...register("RS003")}
                        defaultValue={dadosResiduos?.rs003}
                        onChange={handleOnChange}
                      >
                        <option>Selecionar</option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                      </select>
                      
                      </InputP>
                    </td>
                  </tr>
                  <tr>
                    <td>RS028</td>
                    <td>
                      <InputGG>
                        Quantidade de RSS coletados pela Prefeitura ou empresa contratada por ela
                      </InputGG>
                    </td>

                    <td>
                      <InputP>
                        <input {...register("RS028")} type="text"
                          defaultValue={dadosResiduos?.rs028}
                          onChange={handleOnChange}
                        ></input>
                      </InputP>
                    </td>
                    <td>Toneladas</td>
                  </tr>
                  <tr>
                    <td>RS008</td>
                    <td>
                      <InputGG>
                      Quantidade de RSS coletados pela próprio gerador ou empresa contratada por ele
                      </InputGG>
                    </td>
                    <td>
                      <InputP>
                        <input {...register("RS008")} type="text"
                          defaultValue={dadosResiduos?.rs008}
                          onChange={handleOnChange}
                        ></input>
                      </InputP>
                    </td>
                    <td>Toneladas</td>
                  </tr>
                  <tr>
                    <td>RS044</td>
                    <td>
                      <InputGG>
                       Quantidade total de RSS coletados pelos executores
                      </InputGG>
                    </td>

                    <td>
                      <InputP>
                        <input {...register("RS044")} type="text"
                          defaultValue={dadosResiduos?.rs044}
                          onChange={handleOnChange}
                          disabled
                        ></input>
                      </InputP>
                    </td>
                    <td>Toneladas</td>
                  </tr>
                  <tr>
                    <td>RS026</td>
                    <td>
                      <InputGG>
                        A prefeitura exerce algum tipo de controle sobre os executores(externos)?
                      </InputGG>
                    </td>
                    <td>
                      <InputP>
                      <select {...register("RS026")}
                        defaultValue={dadosResiduos?.rs026}
                        onChange={handleOnChange}
                      > <option >Selecionar</option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                      </select>
                      
                      </InputP>
                    </td>
                  </tr>
                </tbody>
                  </table>
                  <table>
                    <tbody>
                      <tr>
                        <td><InputSNIS>RS027</InputSNIS></td>
                        <td>
                          <InputG>
                            Especifique, sucintamente, qual tipo de controle
                          </InputG>
                        </td>
                        <td>
                          <InputG>
                            <input {...register("RS027")} type="text"></input>
                          </InputG>
                        </td>
                      </tr>
                  </tbody>
                  </table>
                  <table>
                    <tbody>
                      <tr>
                        <td><InputSNIS>RS036</InputSNIS></td>
                        <td>
                          <InputGG>
                            Os RSS são transportados em veículo destinado à coleta domiciliar, porém em viagem exclusiva?
                          </InputGG>
                        </td>

                        <td>
                          <InputP>
                          <select {...register("RS036")}
                             defaultValue={dadosResiduos?.rs036}
                             onChange={handleOnChange}
                          > <option>Selecionar</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                          </select>
                          </InputP>
                        </td>
                        
                      </tr>
                      <tr>
                        <td><InputSNIS>RS038</InputSNIS></td>
                        <td>
                          <InputGG>
                            Os RSS são transportados em veiculo exclusivo?
                          </InputGG>
                        </td>

                        <td>
                          <InputP>
                          <select {...register("RS038")}
                           defaultValue={dadosResiduos?.rs038}
                           onChange={handleOnChange}
                          >
                            <option>Selecionar</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                          </select>
                          </InputP>
                        </td>
                       
                      </tr>
                      <tr>
                        <td><InputSNIS>RS040</InputSNIS></td>
                        <td>
                          <InputGG>
                            O serviço de coleta diferenciada dos RSS é executado por empresa(s) contratada(s)?
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                          <select {...register("RS040")}
                             defaultValue={dadosResiduos?.rs040}
                             onChange={handleOnChange}
                          >
                          <option>Selecionar</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                          </select>
                          </InputP>
                        </td>  
                                        
                      </tr>   
                      <tr>
                        <td>RS041</td>
                        <td>
                          <InputGG>
                          Valor contratual (Preço unitário) do serviço de coleta diferenciada do RSS
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                            <input {...register("RS041")} type="text"
                               defaultValue={dadosResiduos?.rs041}
                               onChange={handleOnChange}
                            ></input>
                          </InputP>
                        </td>
                        <td>Toneladas</td>
                      </tr>      
                      <tr>
                        <td><InputSNIS>RS042</InputSNIS></td>
                        <td>
                          <InputGG>
                            No preço acima está incluso algun tipo de tratamento para os RSS coletados?
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                          <select {...register("RS042")}
                           defaultValue={dadosResiduos?.rs042}
                           onChange={handleOnChange}
                          >
                          <option>Selecionar</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                          </select>
                          </InputP>
                        </td>  
                                        
                      </tr>  
                      <tr>
                        <td>RS043</td>
                        <td>
                          <InputGG>
                          Valor contratual (preço unitário) do serviço de tratamento dos RSS
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                            <input {...register("RS043")} type="text"
                             defaultValue={dadosResiduos?.rs043}
                             onChange={handleOnChange}
                            ></input>
                          </InputP>
                        </td>
                        <td>Toneladas</td>
                      </tr>     
                      <tr>
                        <td><InputSNIS>RS030</InputSNIS></td>
                        <td>
                          <InputGG>
                            O município envia RSS coletados para outro município ?
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                          <select {...register("RS030")}
                          defaultValue={dadosResiduos?.rs030}
                          onChange={handleOnChange}
                          >
                          <option>Selecionar</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                          </select>
                          </InputP>
                        </td>  
                                         
                      </tr>  
                      <tr>
                          <td>RS031</td>
                          <td>Município(s) para onde são remitidos os RSS </td>
                          <th>
                            <p
                              onClick={() => {
                                handleModalRS031();
                              }}
                            >
                              Adicionar
                            </p>
                          </th>
                        </tr>

                  </tbody>
              </table>
              <Tabela>
              <table cellSpacing={0}>
                  <thead>
                    <tr>
                      <th>Município</th>
                      <th>Unidade</th>
                      <th>Tipo de unidade</th>
                      <th>Operador da unidade</th>
                      <th>CNPJ da unidade</th>
                      <th>Quant. resíduos exportados</th>
                      <th>Ações</th>
                    </tr>                   
                  </thead>
                  <tbody>
                    {
                      unidadesRss?.map((unidade, key)=>(
                        <>
                        <tr key={key}>
                            <td>{unidade.municipio}</td>
                            <td>{unidade.nome_unidade}</td>
                            <td>{unidade.tipo_unidade}</td>
                            <td>{unidade.operador_unidade}</td>
                            <td>{unidade.cnpj_unidade}</td>
                            <td>{unidade.quant_residuos_exportados}</td>
                            <td>
                            <Actions>
                                
                                <span><Image onClick={()=>removerUnidadeRss(unidade.id_unidade_residuo_solido_rss)}
                                  title="Excluir" width={30} height={30} src={Excluir} alt="" />
                                </span>
                                </Actions>
                            </td>
                         </tr>
                         </>
                      ))
                    }
                    
                  </tbody>
                </table>
              </Tabela>
            </DivFormConteudo>
            </ModalStepContent>

            <ModalStepContent active={currentStep === 7}>
            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>Resíduos sólidos da Construção Civil (RCC)</DivTituloConteudo>
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
                    <td>CC019</td>
                    <td><InputGG>A Prefeitura ou SLU executa usualmente a coleta diferenciada de RCC no Município? </InputGG></td>
                    <td><InputP><select {...register('CC019')}
                      defaultValue={dadosResiduos?.cc019}
                      onChange={handleOnChange}
                    >
                      <option >Selecionar</option>
                      <option value="Sim">Sim</option>
                      <option value="Nao">Não</option>
                      </select></InputP></td>
                  </tr>
                  <tr>
                    <td><InputSNIS>CC010</InputSNIS></td>
                    <td><InputGG>O serviço prestado pela Prefeitura é cobrado do usuário? </InputGG></td>
                    <td><InputP><select {...register('CC010')} 
                     defaultValue={dadosResiduos?.cc010}
                     onChange={handleOnChange}
                    >
                    <option >Selecionar</option>
                      <option value="Sim">Sim</option>
                      <option value="Nao">Não</option>
                      </select></InputP></td>
                  </tr>
                  <tr>
                    <td><InputSNIS>CC020</InputSNIS></td>
                    <td><InputGG>Há empresas especializadas (caçambeiros) que prestam serviço de coleta de RCC? </InputGG></td>
                    <td><InputP><select {...register('CC020')} 
                     defaultValue={dadosResiduos?.cc020}
                     onChange={handleOnChange}
                    >
                      <option >Selecionar</option>
                      <option value="Sim">Sim</option>
                      <option value="Nao">Não</option>
                      </select></InputP></td>
                  </tr>              
                  <tr>
                    <td><InputSNIS>CC017</InputSNIS></td>
                    <td><InputGG>Há agentes autônomos que prestam serviço de coleta de RCC utilizando-se de caminhões
                      do tipo basculante ou carroceria?</InputGG>
                    </td>
                    <td><InputP><select {...register('CC017')} 
                     defaultValue={dadosResiduos?.cc017}
                     onChange={handleOnChange}
                    >
                      <option >Selecionar</option>
                      <option value="Sim">Sim</option>
                      <option value="Nao">Não</option>
                      </select></InputP></td>
                  </tr>
                  <tr>
                    <td><InputSNIS>CC018</InputSNIS></td>
                    <td><InputGG>Há agentes autônomos que prestam serviço de coleta de RCC utilizando-se da carroça com,
                      tração animal ou outro tipo de veículo com pequena capacidade volumétrica? </InputGG></td>
                    <td><InputP><select {...register('CC018')}
                     defaultValue={dadosResiduos?.cc018}
                     onChange={handleOnChange}
                    >
                    <option >Selecionar</option>
                      <option value="Sim">Sim</option>
                      <option value="Nao">Não</option>
                      </select></InputP></td>
                  </tr>
                  <tr>
                    <td><InputSNIS>CC013</InputSNIS></td>
                    <td><InputGG>Quantidade de RCC coletados pela Prefeitura ou empresa contratada por ela </InputGG></td>
                    <td><InputP><input {...register('CC013')} type="text"
                    defaultValue={dadosResiduos?.cc013}
                    onChange={handleOnChange}
                    ></input></InputP></td>
                    <td>Toneladas</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>CC014</InputSNIS></td>
                    <td><InputGG>Quantidade de RCC coletados por empresas especializadas (caçambeiros) ou autônomos contratados pelo gerados </InputGG></td>
                    <td><InputP><input {...register('CC014')} type="text"
                    defaultValue={dadosResiduos?.cc014}
                    onChange={handleOnChange}
                    ></input></InputP></td>
                    <td>Toneladas</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>CC015</InputSNIS></td>
                    <td><InputGG>Quantidade total de RCC coletados pelo próprio gerados </InputGG></td>
                    <td><InputP><input {...register('CC015')} type="text"
                    defaultValue={dadosResiduos?.cc015}
                    onChange={handleOnChange}
                    disabled
                    ></input></InputP></td>
                    <td>Toneladas</td>
                  </tr>
                </tbody>
                
              </table>
             
            
              <DivSeparadora></DivSeparadora>
              <InputSNIS>
                <p>CC099</p>
              </InputSNIS>
              <InputM>
                <p>Observações</p>
              </InputM>

              <InputGG>
                <textarea {...register("CC099")}
                defaultValue={dadosResiduos?.cc099}
                onChange={handleOnChange}
                />
              </InputGG>
            </DivFormConteudo>
            </ModalStepContent>

            <ModalStepContent active={currentStep === 8}>
            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>Serviço de Varrição</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>
                    <th><b>Código SNIS</b></th>
                    <th><b>Descrição</b></th>
                    <th>Ano {dadosResiduos?.ano}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><InputSNIS>VA010</InputSNIS></td>
                    <td>Extensão de sarjetas varridas pela Prefeitura</td>
                    <td><InputP><input {...register('VA010')} type="text"
                    defaultValue={dadosResiduos?.va010}
                    onChange={handleOnChange}
                    ></input></InputP></td>
                    <td>Km</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>VA011</InputSNIS></td>
                    <td>Extensão de sarjetas varridas por empresas contratadas</td>
                    <td><InputP><input {...register('VA011')} type="text"
                    defaultValue={dadosResiduos?.va011}
                    onChange={handleOnChange}
                    ></input></InputP></td>
                    <td>Km</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>VA039</InputSNIS></td>
                    <td>Extensão total de sarjetas varridas pelos executores</td>
                    <td><InputP><input {...register('VA039')} disabled={true} type="text"
                    defaultValue={dadosResiduos?.va039}
                    onChange={handleOnChange}
                    ></input></InputP></td>
                    <td>Km</td>
                  </tr>                
                  <tr>
                    <td><InputSNIS>VA016</InputSNIS></td>
                    <td>Há algum tipo de varrição mecanizada no município? </td>
                    <td><InputP><select {...register('VA016')} 
                    defaultValue={dadosResiduos?.va016}
                    onChange={handleOnChange}
                    >
                      <option>Selecionar</option>
                      <option value="Sim">Sim</option>
                      <option value="Nao">Não</option>
                      </select></InputP></td>
                  </tr>
                  <tr>
                    <td><InputSNIS>VA020</InputSNIS></td>
                    <td>Valor contratual (preço unitário) do serviço de varrição manual.</td>
                    <td><InputP><input {...register('VA020')} type="text"
                     defaultValue={dadosResiduos?.va020}
                     onChange={handleOnChange}
                    ></input></InputP></td>
                    <td>R$/Km</td>
                  </tr>
                </tbody>
              </table>
            
            </DivFormConteudo>
            </ModalStepContent>

            <ModalStepContent active={currentStep === 9}>
            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>Serviços de capina e roçada</DivTituloConteudo>
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
                    <td>CP001</td>
                    <td>Existe o serviço de capina e roçada? </td>
                    <td><InputP><select {...register('CP001')}
                     defaultValue={dadosResiduos?.cp001}
                     onChange={handleOnChange}
                    >
                          <option>Selecionar</option>
                      <option value="Sim">Sim</option>
                      <option value="Nao">Não</option>
                      </select></InputP></td>
                  </tr>
                  <tr>
                    <td><InputSNIS>CP002</InputSNIS></td>
                    <td>Capina manual</td>
                    <td><InputP><select {...register('CP002')}
                     defaultValue={dadosResiduos?.cp002}
                     onChange={handleOnChange}
                    >
                          <option>Selecionar</option>
                      <option value="Sim">Sim</option>
                      <option value="Nao">Não</option>
                      </select></InputP></td>
                  </tr>
                  <tr>
                    <td><InputSNIS>CP003</InputSNIS></td>
                    <td>Capina mecanizada </td>
                    <td><InputP><select {...register('CP003')}
                     defaultValue={dadosResiduos?.cp003}
                     onChange={handleOnChange}
                    >
                          <option>Selecionar</option>
                      <option value="Sim">Sim</option>
                      <option value="Nao">Não</option>
                      </select></InputP></td>
                  </tr>
                  <tr>
                    <td><InputSNIS>CP004</InputSNIS></td>
                    <td>Capina química </td>
                    <td><InputP><select {...register('CP004')}
                     defaultValue={dadosResiduos?.cp004}
                     onChange={handleOnChange}
                    >
                          <option>Selecionar</option>
                      <option value="Sim">Sim</option>
                      <option value="Nao">Não</option>
                      </select></InputP></td>
                  </tr>                
                </tbody>
                
              </table>     
            
              <DivSeparadora></DivSeparadora>
              <InputSNIS>
                <p>CP099</p>
              </InputSNIS>
              <InputM>
                <p>Observações, esclarecimentos ou sugestões</p>
              </InputM>

              <InputGG>
                <textarea {...register("CP099")}
                     defaultValue={dadosResiduos?.cp099}
                     onChange={handleOnChange}
                />
              </InputGG>


              
            </DivFormConteudo>
            </ModalStepContent>


            <ModalStepContent active={currentStep === 10} >
            <DivFormConteudo>
            <DivTitulo>
                <DivTituloConteudo>Outros serviços</DivTituloConteudo>
              </DivTitulo>
            <table>
                <thead>
                  <tr>
                    <th>
                      <span><b>Descrição</b></span>
                    </th>
                    <th></th>
                    <th>
                      <InputP>
                        <span>Executor do serviço (Ano {dadosResiduos?.ano})</span>
                      </InputP>
                    </th>
                    <th></th>
                  </tr>
                  <tr>
                    <th></th>
                    <th>
                      <LabelCenter>
                        <InputP>Prefeitura ou SLU</InputP>
                      </LabelCenter>
                    </th>
                    <th>
                      <LabelCenter>
                        <InputP>Empresas contratadas</InputP>
                      </LabelCenter>
                    </th>
                    <th>
                      <LabelCenter>
                        <InputP>Outros executores</InputP>
                      </LabelCenter>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
                    <td>
                      <LabelCenter>
                        <InputP>OS001</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>OS012</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>OS023</InputP>
                      </LabelCenter>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <InputG>
                        Execução de lavação de vias e praças
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS001")}
                             defaultValue={dadosResiduos?.os001}
                             onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS012")}
                         defaultValue={dadosResiduos?.os012}
                         onChange={handleOnChange}
                        >
                        <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS023")}
                            defaultValue={dadosResiduos?.os023}
                            onChange={handleOnChange}
                        >
                        <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <LabelCenter>
                        <InputP>OS003</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>OS014</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>OS025</InputP>
                      </LabelCenter>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <InputG>
                        Execução de limpeza feiras livres ou mercados
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS003")} 
                          defaultValue={dadosResiduos?.os003}
                          onChange={handleOnChange}
                        >
                        <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS014")}
                         defaultValue={dadosResiduos?.os014}
                         onChange={handleOnChange}
                        >
                        <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS025")}
                           defaultValue={dadosResiduos?.os025}
                           onChange={handleOnChange}
                        >
                        <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <LabelCenter>
                        <InputP>OS004</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>OS015</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>OS026</InputP>
                      </LabelCenter>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <InputG>
                       Execução de limpeza de praias
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS004")}
                           defaultValue={dadosResiduos?.os004}
                           onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS015")}
                         defaultValue={dadosResiduos?.os015}
                         onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS026")}
                          defaultValue={dadosResiduos?.os026}
                          onChange={handleOnChange}
                        >
                          <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <LabelCenter>
                        <InputP>OS005</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>OS016</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>OS027</InputP>
                      </LabelCenter>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <InputG>
                      Execução de limpeza de bocas-de-lobo
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS005")}
                          defaultValue={dadosResiduos?.os005}
                          onChange={handleOnChange}
                        >  <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS016")}
                          defaultValue={dadosResiduos?.os016}
                          onChange={handleOnChange}
                        >
                        <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS027")}
                          defaultValue={dadosResiduos?.os027}
                          onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <LabelCenter>
                        <InputP>OS006</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>OS017</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>OS028</InputP>
                      </LabelCenter>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <InputG>
                        Execução de pintura de meios-fios
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS006")}
                          defaultValue={dadosResiduos?.os006}
                          onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS017")}
                        defaultValue={dadosResiduos?.os017}
                        onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS028")}
                         defaultValue={dadosResiduos?.os028}
                         onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td>
                      <LabelCenter>
                        <InputP>OS007</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>OS018</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>OS029</InputP>
                      </LabelCenter>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <InputG>
                        Execução de limpeza de lotes vagos
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS007")}
                         defaultValue={dadosResiduos?.os007}
                         onChange={handleOnChange}
                        >
                          <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS018")}
                         defaultValue={dadosResiduos?.os018}
                         onChange={handleOnChange}
                        >
                        <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS029")}
                               defaultValue={dadosResiduos?.os029}
                               onChange={handleOnChange}
                        >
                          <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>


                  <tr>
                    <td></td>
                    <td>
                      <LabelCenter>
                        <InputP>OS008</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>OS019</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>OS030</InputP>
                      </LabelCenter>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <InputG>
                        Execução de remoção de animais mortos de vias públicas
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS008")}
                         defaultValue={dadosResiduos?.os008}
                         onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS019")}
                         defaultValue={dadosResiduos?.os019}
                         onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS030")}
                         defaultValue={dadosResiduos?.os030}
                         onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>


                  <tr>
                    <td></td>
                    <td>
                      <LabelCenter>
                        <InputP>OS009</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>OS020</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>OS031</InputP>
                      </LabelCenter>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <InputG>
                        Execução de coleta diferenciada de pneus velhos
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS009")} 
                         defaultValue={dadosResiduos?.os009}
                         onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS020")}
                         defaultValue={dadosResiduos?.os020}
                         onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS031")}
                         defaultValue={dadosResiduos?.os031}
                         onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td>
                      <LabelCenter>
                        <InputP>OS010</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>OS021</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>OS032</InputP>
                      </LabelCenter>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <InputG>
                        Execução de coleta diferenciada de pilhas e baterias
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS010")}
                         defaultValue={dadosResiduos?.os010}
                         onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS021")}
                         defaultValue={dadosResiduos?.os021}
                         onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS032")}
                         defaultValue={dadosResiduos?.os032}
                         onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td>
                      <LabelCenter>
                        <InputP>OS011</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>OS022</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>OS033</InputP>
                      </LabelCenter>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <InputG>
                        Execução de coleta de resíduos volumosos inservíveis
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS011")}
                         defaultValue={dadosResiduos?.os011}
                         onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS022")}
                         defaultValue={dadosResiduos?.os022}
                         onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS033")}
                         defaultValue={dadosResiduos?.os033}
                         onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td>
                      <LabelCenter>
                        <InputP>OS040</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>OS041</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>OS042</InputP>
                      </LabelCenter>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <InputG>
                        Execução de poda de árvores
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS040")}
                         defaultValue={dadosResiduos?.os040}
                         onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS041")}
                         defaultValue={dadosResiduos?.os041}
                         onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS042")}
                         defaultValue={dadosResiduos?.os042}
                         onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td>
                      <LabelCenter>
                        <InputP>OS043</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>OS044</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>OS045</InputP>
                      </LabelCenter>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <InputG>
                        Execução de outros serviços diferentes dos citados acima
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS043")}
                         defaultValue={dadosResiduos?.os043}
                         onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS044")}
                         defaultValue={dadosResiduos?.os044}
                         onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS045")} 
                        defaultValue={dadosResiduos?.os045}
                         onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td>
                      <LabelCenter>
                        <InputP>OS047</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>OS048</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>OS049</InputP>
                      </LabelCenter>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <InputG>
                        Execução de coleta diferenciada de lâmpadas fluorecentes
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS047")}
                         defaultValue={dadosResiduos?.os47}
                         onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS048")}
                         defaultValue={dadosResiduos?.os048}
                         onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS049")}
                         defaultValue={dadosResiduos?.os030}
                         onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>


                  <tr>
                    <td></td>
                    <td>
                      <LabelCenter>
                        <InputP>OS050</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>OS051</InputP>
                      </LabelCenter>
                    </td>
                    <td>
                      <LabelCenter>
                        <InputP>OS052</InputP>
                      </LabelCenter>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <InputG>
                        Execução de coleta diferenciada de resíduos eletrônicos
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS050")}
                         defaultValue={dadosResiduos?.os050}
                         onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS051")}
                         defaultValue={dadosResiduos?.os051}
                         onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select {...register("OS052")}
                         defaultValue={dadosResiduos?.os052}
                         onChange={handleOnChange}
                        > <option >Selecionar</option>
                          <option value={"Sim"}>Sim</option>
                          <option value={"Não"}>Não</option>
                        </select>
                      </InputP>
                    </td>
                  </tr>


                </tbody>
              </table>
            </DivFormConteudo>
            </ModalStepContent>

            <ModalStepContent active={currentStep === 11} >
            <DivFormConteudo>
              <DivTitulo>
                <DivTituloConteudo>Catadores</DivTituloConteudo>
              </DivTitulo>
              <table>
                <thead>
                  <tr>
                    <th><b>Código SNIS</b></th>
                    <th><b>Descrição</b></th>
                    <th>Ano {dadosResiduos?.ano}</th>
                  </tr>
                </thead>
                <tbody>
                 
                  <tr>
                    <td><InputSNIS>CA004</InputSNIS></td>
                    <td><InputG>Existem catadores de materiais recicláveis que trabalham dispersos na cidade? </InputG></td>
                    <td><InputP><select {...register('CA004')}
                     defaultValue={dadosResiduos?.ca004}
                     onChange={handleOnChange}
                    > <option >Selecionar</option>
                      <option value={"Sim"}>Sim</option>
                      <option value={"Não"}>Não</option>
                    </select></InputP></td>
                  </tr>
                  <tr>
                    <td><InputSNIS>CA008</InputSNIS></td>
                    <td>Existem algum trabalho social por parte da Prefeitura direcionado aos catadores? </td>
                    <td><InputP><select {...register('CA008')}
                    
                    > <option
                    defaultValue={dadosResiduos?.ca008}
                    onChange={handleOnChange}>Selecionar</option>
                      <option value={"Sim"}>Sim</option>
                      <option value={"Não"}>Não</option>
                    </select></InputP></td>
                  </tr>  
              </tbody>    
              </table> 
              <table>
                <tbody>
                  <tr>
                    <td>
                    <InputSNIS>CA009</InputSNIS>
                    </td>
                    <td><InputG>
                    <b>Descrição</b> sucinta dos trabalhos (por exemplo: bolsa-escola para filhos, programa de alfabetização, etc...)
                    </InputG></td>
                    <td>
                      <textarea {...register('CA009')}
                      defaultValue={dadosResiduos?.ca009}
                      onChange={handleOnChange}
                      ></textarea>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table>
                <tbody>       
                  <tr>
                    <td><InputSNIS>CA006</InputSNIS></td>
                    <td><InputG>Quantidade de entidades associativas(cooperativas ou associações) </InputG></td>
                    <td><InputP><input {...register('CA006')} type="text"
                    defaultValue={dadosResiduos?.ca006}
                    onChange={handleOnChange}
                    ></input></InputP></td>
                    <td>Entidades</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>CA007</InputSNIS></td>
                    <td>Quantidade de associados às entidades Associativas
                    </td>
                    <td><InputP><input {...register('CA007')} type="text"
                    defaultValue={dadosResiduos?.ca007}
                    onChange={handleOnChange}
                    ></input></InputP></td>
                    <td>Catador</td>
                  </tr>
                  <tr>
                    <td><InputSNIS>CA005</InputSNIS></td>
                    <td>Os catadores estão organizadaos em cooperativa ou associação?</td>
                    <td><InputP><select {...register('CA005')}
                     defaultValue={dadosResiduos?.ca005}
                     onChange={handleOnChange}
                    > <option >Selecionar</option>
                      <option value={"Sim"}>Sim</option>
                      <option value={"Não"}>Não</option>
                    </select></InputP></td>
                  </tr>             
                </tbody>
                
              </table>
             
            
              <table>
                   <tbody>
                        <tr>
                          <td><InputM></InputM></td>
                          <td><InputG>Adicionar nome e silga conhecida da Cooperativa ou Associação</InputG></td>
                          <th>
                            <p
                              onClick={() => {
                                handleModalAssCatadores();
                              }}
                            >
                              Adicionar
                            </p>
                          </th>
                        </tr>
                   </tbody>
              </table>
              <Tabela>
                <table cellSpacing={0}>
                  <thead>
                    <tr>
                      <th>Nome da Cooperativa ou Associação</th>
                      <th>numero de associados</th>
                      <th>Ações</th>
                    </tr>
                    
                  </thead>
                  <tbody>
                      {
                        cooperativas?.map((coop, key)=>(
                          <>
                            <tr key={key}>
                              <td>{coop.nome_associacao}</td>
                              <td>{coop.numero_associados}</td>
                              <td>
                                <Actions>
                                <span><Image 
                                  title="Editar" width={30} height={30} src={Editar} alt="" />
                                </span>
                                <span><Image onClick={()=>deleteCooperativa(coop.id_cooperativa_associacao_catadores)}
                                  title="Excluir" width={30} height={30} src={Excluir} alt="" />
                                </span>
                                </Actions>
                              </td>
                            </tr>
                          </>
                        ))
                      }
                  </tbody>
                </table>
              </Tabela>
            </DivFormConteudo>          
            </ModalStepContent>

            

          </DivFormResiduo>
          

         
           <ModalStepperNavigation>
                  <ModalStepperButton 
                    secondary
                    onClick={handlePrevStep}
                    disabled={currentStep === 0}
                  >
                    Voltar
                  </ModalStepperButton>

                  {currentStep === 11 ? (
                    <h1></h1>
                  ) : (
                    <ModalStepperButton onClick={handleNextStep}>
                      Proximo
                    </ModalStepperButton>
                    
                  )}
                <SubmitButton type="submit">Gravar</SubmitButton>
                </ModalStepperNavigation>
                
          </ModalStepperContainer>
        </Form>
      </DivCenter>

      {modalCO020 && (
        <ContainerModal>
          <Modal>
            <FormModal onSubmit={handleSubmit(handleCadastroUnidade)}>
              <ConteudoModal>
                <CloseModalButton
                  onClick={() => {
                    handleCloseModalCO020();
                  }}
                >
                  <span></span>
                </CloseModalButton>
                <SubmitButtonModal type="submit">Gravar</SubmitButtonModal>
                <table>
                  <thead>
                    <tr>
                      <th>Município</th>
                      <th>Tipo de unidade</th>
                      <th>Nome da unidade</th>
                      <th>Operador da unidade</th>
                      <th>CNPJ da unidade</th>
                      <th>Quant. resíduos exportados</th>
                    </tr>
                  </thead>
                  <tbody>                  
                    <tr>
                      <td>
                      <input {...register("municipio")} type="text"></input>
                      </td>
                      <td>
                       <InputP><input {...register("tipo_unidade")} type="text"></input></InputP> 
                      </td>
                      <td>
                        <input {...register("nome_unidade")} type="text"></input>
                      </td>
                      <td>
                        <input {...register("operador_unidade")} type="text"></input>
                      </td>
                      <td>
                        <input {...register("cnpj_unidade")} type="text"></input>
                      </td>
                      <td>
                        <input {...register("quant_residuos_exportados")} type="text"></input>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </ConteudoModal>
            </FormModal>
          </Modal>
        </ContainerModal>
      )}

  
{modalRS031 && (
        <ContainerModal>
          <Modal>
            <FormModal onSubmit={handleSubmit(handleCadastroUnidadeRss)}>
              <ConteudoModal>
                <CloseModalButton
                  onClick={() => {
                    handleCloseModalRS031();
                  }}
                >
                  <span></span>
                </CloseModalButton>
                <SubmitButtonModal type="submit">Gravar</SubmitButtonModal>
                <table>
                  <thead>
                    <tr>
                      <th>Município</th>
                      <th>Tipo de unidade</th>
                      <th>Nome da unidade</th>
                      <th>Operador da unidade</th>
                      <th>CNPJ da unidade</th>
                      <th>Quant. resíduos exportados</th>
                    </tr>
                  </thead>
                  <tbody>                  
                    <tr>
                      <td>
                      <input {...register("municipio")} type="text"></input>
                      </td>
                      <td>
                       <InputP><input {...register("tipo_unidade")} type="text"></input></InputP> 
                      </td>
                      <td>
                        <input {...register("nome_unidade")} type="text"></input>
                      </td>
                      <td>
                        <input {...register("operador_unidade")} type="text"></input>
                      </td>
                      <td>
                        <input {...register("cnpj_unidade")} type="text"></input>
                      </td>
                      <td>
                        <input {...register("quant_residuos_exportados")} type="text"></input>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </ConteudoModal>
            </FormModal>
          </Modal>
        </ContainerModal>
      )}

{modalAssCatadores && (
        <ContainerModal>
          <Modal>
            <FormModal onSubmit={handleSubmit(handleCadastroCAC)}>
              <ConteudoModal>
                <CloseModalButton
                  onClick={() => {
                    handleCloseAssCatadores();
                  }}
                >
                  <span></span>
                </CloseModalButton>
                <SubmitButtonModal type="submit">Gravar</SubmitButtonModal>
                <TabelaModal>
                <table>
               
                  <tbody>
                    <tr>
                      <td>Nome e sigla conhecida da Cooperativa ou Associação</td>
                      <td>Numero de catadores</td>
                    </tr>
                    <tr> 
                                     
                      <td>
                        <InputG><input {...register("nome_associacao")} type="text"></input></InputG>
                      </td>
                      <td>
                        <InputP><input {...register("numero_associados")} type="text"></input></InputP>
                      </td>                   
                    </tr>
                  </tbody>
                </table>
                </TabelaModal>
              </ConteudoModal>
            </FormModal>
          </Modal>
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

