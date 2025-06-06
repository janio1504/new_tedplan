/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { set, useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-nextjs-toast";
import { anosSelect } from "../../util/util";
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
import coleta_escuro from "../../img/Icono-coleta.png";
import Editar from "../../img/editar.png";
import Excluir from "../../img/excluir.png";
import unidade_claro from "../../img/Icono-unidadeDeProcessamento-claro.png";
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
  ModalStepButton,
  ModalStepContent,
  ModalStepperContainer,
  ModalStepperNavigation,
  ModalStepLabel,
  ModalStepperWrapper,
  ModalStepperButton,
} from "../../styles/residuo-solido-coleta-in";
import Image from "next/image";
import api from "../../services/api";
import MenuHorizontal from "../../components/MenuHorizontal";
import { useResiduos } from "../../contexts/ResiduosContext";
import { useMunicipio } from "../../contexts/MunicipioContext";
import { FormCadastro } from "../../styles/residuo-solidos-in";

interface IMunicipio {
  id_municipio: string;
  municipio_codigo_ibge: string;
  municipio_nome: string;
}

interface MunicipioProps {
  municipio: IMunicipio[];
}

export default function ResiduosColeta({ municipio }: MunicipioProps) {
  const { usuario, isEditor, anoEditorSimisab } = useContext(AuthContext);
  const [isMunicipio, setMunicipio] = useState<IMunicipio | any>(municipio);
  const {
    register: registerExternal,
    handleSubmit: handleSubmitExternal,
    reset: resetExternal,
    formState: { errors },
  } = useForm();

  const {
    register: registerRsc,
    handleSubmit: handleSubmitRsc,
    reset: resetRsc,
  } = useForm();

  const {
    register: registerRss,
    handleSubmit: handleSubmitRss,
    reset: resetRss,
  } = useForm();

  const [rsExportado, setRsExportado] = useState(true);
  const [contentForEditor, setContentForEditor] = useState(null);
  const [content, setContent] = useState("");
  const [modalCO020, setModalCO020] = useState(false);
  const [modalRS031, setModalRS031] = useState(false);
  const [modalAssCatadores, setModalAssCatadores] = useState(false);
  const [anoSelected, setAnoSelected] = useState(null);
  const editor = useRef();
  const firstRender = useRef(true);
  const [currentStep, setCurrentStep] = useState(0);
  const editorContent = useMemo(() => contentForEditor, [contentForEditor]);
  const {
    loadDadosResiduos,
    dadosResiduos,
    loading,
    loadDadosUnidadesRss,
    loadDadosCooperativasCatadores,
    cooperativas,
    unidadesRss,
    removeUnidadeRss,
    removeUnidadeRsc,
    createDataUnidadeRss,
    createDataUnidadeRsc,
    loadDadosUnidadesRsc,
    unidadesRsc,
    createDataCoopCat,
    removeCoopCat,
  } = useResiduos();
  const { dadosMunicipio, loadMunicipio } = useMunicipio();
  const [municipios, setMunicipios] = useState(null);
  const [unidadesProcessamento, setUnidadesProcessamento] = useState(null);
  const [unidadeP, setUnidadeP] = useState(null);
  const [municipioUnidade, setMunicipioUnidade] = useState(null);

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
    if (usuario) {
      loadMunicipio();
      getMunicipios();
    }
  }, [usuario]);

  async function getMunicipios() {
    await api.get("getMunicipios").then((response) => {
      setMunicipios(response.data);
    });
  }

  function handleCloseModalCO020() {
    setModalCO020(false);
  }
  function handleModalCO020() {
    setModalCO020(true);
  }

  function handleCloseModalRS031() {
    resetRss();
    setUnidadesProcessamento(null);
    setMunicipioUnidade(null);
    setUnidadeP(null);
    setModalRS031(false);
  }
  function handleModalRS031() {
    resetRss();
    setUnidadesProcessamento(null);
    setMunicipioUnidade(null);
    setUnidadeP(null);
    setModalRS031(true);
  }

  function handleCloseAssCatadores() {
    setModalAssCatadores(false);
  }
  function handleModalAssCatadores() {
    setModalAssCatadores(true);
  }

  function handleSetStep(step) {
    alert(
      "Atenção! Você está saindo do passo atual, os dados não salvos serão perdidos."
    );
    setCurrentStep(step);
  }

  async function handleCadastroCAC(data) {
    if (usuario?.id_permissao === 4) {
      return;
    }
    try {
      const result = await createDataCoopCat({
        nome_associacao: data.nome_associacao,
        id_municipio: usuario?.id_municipio,
        numero_associados: data.numero_associados,
        ano: anoSelected,
      }).then((response) => {
        toast.notify("Cooperativa cadastrada com sucesso", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
        loadDadosCooperativasCatadores({
          ano: anoSelected,
          id: usuario?.id_municipio,
        });
      });
    } catch (error) {
      toast.notify(error.message || "Erro ao cadastrar cooperativa catadores", {
        title: "Erro!",
        duration: 7,
        type: "error",
      });
    } finally {
      handleCloseAssCatadores();
    }
  }

  async function handleDeleteCoopCat(id) {
    if (confirm("Deseja realmente excluir a cooperativa?")) {
      const result = await removeCoopCat(id)
        .then((response) => {
          toast.notify("Cooperativa removida com sucesso!", {
            title: "Sucesso!",
            duration: 7,
            type: "success",
          });
        })
        .catch((error) => {
          toast.notify(
            error.message || "Erro ao remover cooperativa catadores",
            {
              title: "Erro!",
              duration: 7,
              type: "error",
            }
          );
        });
    }
    loadDadosCooperativasCatadores({
      ano: anoSelected,
      id: usuario?.id_municipio,
    });
  }

  function handleCadastro(data) {
    if (usuario?.id_permissao === 4) {
      return;
    }
    if (anoSelected === null || anoSelected === "Selecionar") {
      toast.notify("Selecione um ano!", {
        title: "Erro",
        duration: 7,
        type: "error",
      });
      return;
    }
    data.TB013 =
      (data.TB001
        ? parseFloat(data.TB001.replace(".", "").replace(",", "."))
        : dadosResiduos?.tb001
        ? parseFloat(dadosResiduos?.tb001)
        : 0) +
      (data.TB003
        ? parseFloat(data.TB003.replace(".", "").replace(",", "."))
        : dadosResiduos?.tb003
        ? parseFloat(dadosResiduos?.tb003)
        : 0) +
      (data.TB005
        ? parseFloat(data.TB005.replace(".", "").replace(",", "."))
        : dadosResiduos?.tb005
        ? parseFloat(dadosResiduos?.tb005)
        : 0) +
      (data.TB007
        ? parseFloat(data.TB007.replace(".", "").replace(",", "."))
        : dadosResiduos?.tb007
        ? parseFloat(dadosResiduos?.tb007)
        : 0) +
      (data.TB009
        ? parseFloat(data.TB009.replace(".", "").replace(",", "."))
        : dadosResiduos?.tb009
        ? parseFloat(dadosResiduos?.tb009)
        : 0) +
      (data.TB011
        ? parseFloat(data.TB011.replace(".", "").replace(",", "."))
        : dadosResiduos?.tb011
        ? parseFloat(dadosResiduos?.tb011)
        : 0);

    data.TB014 =
      (data.TB002
        ? parseFloat(data.TB002.replace(".", "").replace(",", "."))
        : dadosResiduos?.tb002
        ? parseFloat(dadosResiduos?.tb002)
        : 0) +
      (data.TB004
        ? parseFloat(data.TB004.replace(".", "").replace(",", "."))
        : dadosResiduos?.tb004
        ? parseFloat(dadosResiduos?.tb003)
        : 0) +
      (data.TB006
        ? parseFloat(data.TB006.replace(".", "").replace(",", "."))
        : dadosResiduos?.tb006
        ? parseFloat(dadosResiduos?.tb006)
        : 0) +
      (data.TB008
        ? parseFloat(data.TB008.replace(".", "").replace(",", "."))
        : dadosResiduos?.tb008
        ? parseFloat(dadosResiduos?.tb008)
        : 0) +
      (data.TB010
        ? parseFloat(data.TB010.replace(".", "").replace(",", "."))
        : dadosResiduos?.tb010
        ? parseFloat(dadosResiduos?.tb010)
        : 0) +
      (data.TB012
        ? parseFloat(data.TB012.replace(".", "").replace(",", "."))
        : dadosResiduos?.tb012
        ? parseFloat(dadosResiduos?.tb012)
        : 0);

    data.TB015 =
      (data.TB013
        ? data.TB013
        : dadosResiduos?.tb013
        ? parseFloat(dadosResiduos?.tb013)
        : 0) +
      (data.TB014
        ? data.TB014
        : dadosResiduos?.tb014
        ? parseFloat(dadosResiduos?.tb014)
        : 0);

    data.CS026 =
      (data.CS023
        ? parseFloat(data.CS023.replace(".", "").replace(",", "."))
        : dadosResiduos?.cs023
        ? parseFloat(dadosResiduos?.cs023)
        : 0) +
      (data.CS024
        ? parseFloat(data.CS024.replace(".", "").replace(",", "."))
        : dadosResiduos?.cs024
        ? parseFloat(dadosResiduos?.cs024)
        : 0) +
      (data.CS048
        ? parseFloat(data.CS048.replace(".", "").replace(",", "."))
        : dadosResiduos?.cs048
        ? parseFloat(dadosResiduos?.cs048)
        : 0) +
      (data.CS025
        ? parseFloat(data.CS025.replace(".", "").replace(",", "."))
        : dadosResiduos?.cs025
        ? parseFloat(dadosResiduos?.cs025)
        : 0);

    data.CS009 =
      (data.CS010
        ? parseFloat(data.CS010.replace(".", "").replace(",", "."))
        : dadosResiduos?.cs010
        ? parseFloat(dadosResiduos?.cs010)
        : 0) +
      (data.CS014
        ? parseFloat(data.CS014.replace(".", "").replace(",", "."))
        : dadosResiduos?.cs014
        ? parseFloat(dadosResiduos?.cs014)
        : 0);

    data.RS044 =
      (data.RS028
        ? parseFloat(data.RS028.replace(".", "").replace(",", "."))
        : dadosResiduos?.rs028
        ? parseFloat(dadosResiduos?.rs028)
        : 0) +
      (data.RS008
        ? parseFloat(data.RS008.replace(".", "").replace(",", "."))
        : dadosResiduos?.rs008
        ? parseFloat(dadosResiduos?.rs008)
        : 0);

    data.VA039 =
      (data.VA010
        ? parseFloat(data.VA010.replace(".", "").replace(",", "."))
        : dadosResiduos?.va010
        ? parseFloat(dadosResiduos?.va010)
        : 0) +
      (data.VA011
        ? parseFloat(data.VA011.replace(".", "").replace(",", "."))
        : dadosResiduos?.va011
        ? parseFloat(dadosResiduos?.va011)
        : 0);

    data.CO116 =
      (data.CO108
        ? parseFloat(data.CO108.replace(".", "").replace(",", "."))
        : dadosResiduos?.co108
        ? parseFloat(dadosResiduos?.co108)
        : 0) +
      (data.CO112
        ? parseFloat(data.CO112.replace(".", "").replace(",", "."))
        : dadosResiduos?.co112
        ? parseFloat(dadosResiduos?.co112)
        : 0);

    data.CO117 =
      (data.CO109
        ? parseFloat(data.CO109.replace(".", "").replace(",", "."))
        : dadosResiduos?.co109
        ? parseFloat(dadosResiduos?.co109)
        : 0) +
      (data.CO113
        ? parseFloat(data.CO113.replace(".", "").replace(",", "."))
        : dadosResiduos?.co113
        ? parseFloat(dadosResiduos?.co113)
        : 0);

    data.CS048A = data.CS048
      ? data.CS048.replace(".", "").replace(",", ".")
      : dadosResiduos?.cs048
      ? parseFloat(dadosResiduos?.cs048)
      : 0;

    data.CO142 =
      (data.CO140
        ? parseFloat(data.CO140.replace(".", "").replace(",", "."))
        : dadosResiduos?.co140
        ? parseFloat(dadosResiduos?.co140)
        : 0) +
      (data.CO141
        ? parseFloat(data.CO141.replace(".", "").replace(",", "."))
        : dadosResiduos?.co141
        ? parseFloat(dadosResiduos?.co141)
        : 0);

    data.CO111 =
      (data.CO108
        ? parseFloat(data.CO108.replace(".", "").replace(",", "."))
        : dadosResiduos?.co108
        ? parseFloat(dadosResiduos?.co108)
        : 0) +
      (data.CO109
        ? parseFloat(data.CO109.replace(".", "").replace(",", "."))
        : dadosResiduos?.co109
        ? parseFloat(dadosResiduos?.co109)
        : 0) +
      (data.CS048
        ? parseFloat(data.CS048.replace(".", "").replace(",", "."))
        : dadosResiduos?.cs048
        ? parseFloat(dadosResiduos?.cs048)
        : 0) +
      (data.CO140
        ? parseFloat(data.CO140.replace(".", "").replace(",", "."))
        : dadosResiduos?.co140
        ? parseFloat(dadosResiduos?.co140)
        : 0);

    data.CO115 =
      (data.CO112
        ? parseFloat(data.CO112.replace(".", "").replace(",", "."))
        : dadosResiduos?.co112
        ? parseFloat(dadosResiduos?.co112)
        : 0) +
      (data.CO113
        ? parseFloat(data.CO113.replace(".", "").replace(",", "."))
        : dadosResiduos?.co113
        ? parseFloat(dadosResiduos?.co113)
        : 0) +
      (data.CO141
        ? parseFloat(data.CO141.replace(".", "").replace(",", "."))
        : dadosResiduos?.co141
        ? parseFloat(dadosResiduos?.co141)
        : 0);

    data.CC015 =
      (data.CC014
        ? parseFloat(data.CC014.replace(".", "").replace(",", "."))
        : dadosResiduos?.cc014
        ? parseFloat(dadosResiduos?.cc014)
        : 0) +
      (data.CC013
        ? parseFloat(data.CC013.replace(".", "").replace(",", "."))
        : dadosResiduos?.cc013
        ? parseFloat(dadosResiduos?.cc013)
        : 0);

    data.CO119 =
      parseFloat(data.CO116) +
      parseFloat(data.CO117) +
      parseFloat(data.CS048A) +
      parseFloat(data.CO142) +
      parseFloat(data.CO111) +
      parseFloat(data.CO115);

    data.id_residuos_solidos_coleta = dadosResiduos?.id_residuos_solidos_coleta;

    data.id_municipio = usuario?.id_municipio;
    data.ano = anoSelected;
    const apiClient = getAPIClient();
    const resCad = apiClient
      .post("addPsResiduosColeta", data)
      .then((response) => {
        toast.notify("Dados gravados com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
        loadDadosResiduos({ ano: anoSelected, id: usuario?.id_municipio });
        return response;
      })
      .catch((error) => {
        toast.notify("Ocorreu um erro ao gravar os dados!", {
          title: "Erro!",
          duration: 7,
          type: "error",
        });
        console.log(error);
      });
  }

  async function handleCadastroUnidadeRsc(data) {
    if (usuario?.id_permissao === 4) {
      return;
    }
    try {
      const result = await createDataUnidadeRsc({
        id_municipio: usuario?.id_municipio,
        codigo: "CO020",
        id_unidade_processamento: unidadeP?.id_unidade_processamento,
        ano: anoSelected,
        quant_residuos_exportados: data.quant_residuos_exportados,
      }).then((response) => {
        toast.notify(response.message, {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
        loadDadosUnidadesRsc({
          ano: anoSelected,
          id: usuario?.id_municipio,
        });
      });
    } catch (error) {
      toast.notify(error.message || "Erro ao cadastrar unidade RSC", {
        title: "Erro!",
        duration: 7,
        type: "error",
      });
    } finally {
      handleCloseModalCO020();
    }
  }

  const handleRemoveUnidadeRss = async (id: string) => {
    if (confirm("Deseja realmente excluir a unidade?")) {
      const result = await removeUnidadeRss(id).then((response) => {
        toast.notify("Unidade removida com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
        loadDadosUnidadesRss({
          ano: anoSelected,
          id: usuario?.id_municipio,
        });
      });
    }
  };

  const handleRemoveUnidadeRsc = async (id: string) => {
    if (confirm("Deseja realmente excluir a unidade?")) {
      const result = await removeUnidadeRsc(id).then((response) => {
        toast.notify("Unidade removida com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
        loadDadosUnidadesRsc({
          ano: anoSelected,
          id: usuario?.id_municipio,
        });
      });
    }
  };

  async function handleCadastroUnidadeRss(data) {
    if (usuario?.id_permissao === 4) {
      return;
    }
    try {
      const result = await createDataUnidadeRss({
        id_municipio: usuario?.id_municipio,
        codigo: "RS031",
        id_unidade_processamento: unidadeP?.id_unidade_processamento,
        ano: anoSelected,
        quant_residuos_exportados: data.quant_residuos_exportados,
      }).then((response) => {
        toast.notify(response.message, {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
      });
      loadDadosUnidadesRss({
        ano: anoSelected,
        id: usuario?.id_municipio,
      });
    } catch (error) {
      toast.notify(error.message || "Erro ao cadastrar unidade RSS", {
        title: "Erro!",
        duration: 7,
        type: "error",
      });
    } finally {
      handleCloseModalRS031();
    }
  }

  function handleOnChange(content) {
    setContent(content);
  }
  function rsExportadoChange(e) {
    e.target.value == "Sim" ? setRsExportado(false) : setRsExportado(true);
  }


  function unidadeProcessamento() {
    Router.push("/indicadores/residuos-indicadores-unidade");
  }

  function seletcAno(ano: any) {
    setAnoSelected(ano);
    //resetExternal()
    loadDadosResiduos({ ano: ano, id: usuario?.id_municipio });
    loadDadosUnidadesRss({ ano: ano, id: usuario?.id_municipio });
    loadDadosUnidadesRsc({ ano: ano, id: usuario?.id_municipio });
    loadDadosCooperativasCatadores({
      ano: ano,
      id: usuario?.id_municipio,
    });
  }

  async function getUnidadesProcessamento(tipo) {
    const res = await api
      .post("list-unidades-processamento-por-tipo", {
        id_municipio: municipioUnidade,
        tipo_unidade: tipo,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    setUnidadesProcessamento(res);
  }

  function getUP(id) {
    let up = unidadesProcessamento?.filter(
      (obj) => obj.id_unidade_processamento == id
    );

    setUnidadeP(up[0]);
  }

  return (
    <Container>
      <ToastContainer></ToastContainer>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuHorizontal
        municipio={dadosMunicipio?.municipio_nome}
      ></MenuHorizontal>
      <MenuIndicadores></MenuIndicadores>

      <DivCenter>
        <Form onSubmit={handleSubmitExternal(handleCadastro)}>
          <ModalStepperContainer>
            <DivFormResiduo>
              <DivTituloFormResiduo>Resíduos Sólidos</DivTituloFormResiduo>
              <DivCenter>
                <DivBotao>
                  <IconeColeta>
                    {" "}
                    <Image
                      onClick={() => unidadeProcessamento()}
                      src={unidade_claro}
                      alt="Simisab"
                    />
                    <BotaoResiduos onClick={() => unidadeProcessamento()}>
                      Processamento
                    </BotaoResiduos>
                  </IconeColeta>
                  <IconeColeta>
                    {" "}
                    <Image src={coleta_escuro} alt="Simisab" />
                    <BotaoResiduos>Coleta</BotaoResiduos>
                  </IconeColeta>
                </DivBotao>
              </DivCenter>
              <ModalStepperWrapper>
                <div>
                  <ModalStepButton
                    active={currentStep === 0}
                    completed={currentStep > 0}
                    onClick={() => setCurrentStep(0)}
                  >
                    1
                  </ModalStepButton>
                  <ModalStepLabel active={currentStep === 0}></ModalStepLabel>
                </div>

                <div>
                  <ModalStepButton
                    active={currentStep === 1}
                    completed={currentStep > 1}
                    onClick={() => setCurrentStep(1)}
                  >
                    2
                  </ModalStepButton>
                  <ModalStepLabel active={currentStep === 1}></ModalStepLabel>
                </div>

                <div>
                  <ModalStepButton
                    active={currentStep === 2}
                    completed={currentStep > 2}
                    onClick={() => setCurrentStep(2)}
                  >
                    3
                  </ModalStepButton>
                  <ModalStepLabel active={currentStep === 2}></ModalStepLabel>
                </div>

                <div>
                  <ModalStepButton
                    active={currentStep === 3}
                    completed={currentStep > 3}
                    onClick={() => setCurrentStep(3)}
                  >
                    4
                  </ModalStepButton>
                  <ModalStepLabel active={currentStep === 3}></ModalStepLabel>
                </div>
                <div>
                  <ModalStepButton
                    active={currentStep === 4}
                    completed={currentStep > 4}
                    onClick={() => setCurrentStep(4)}
                  >
                    5
                  </ModalStepButton>
                  <ModalStepLabel active={currentStep === 4}></ModalStepLabel>
                </div>

                <div>
                  <ModalStepButton
                    active={currentStep === 5}
                    completed={currentStep > 5}
                    onClick={() => setCurrentStep(5)}
                  >
                    6
                  </ModalStepButton>
                  <ModalStepLabel active={currentStep === 5}></ModalStepLabel>
                </div>
                <div>
                  <ModalStepButton
                    active={currentStep === 6}
                    completed={currentStep > 6}
                    onClick={() => setCurrentStep(6)}
                  >
                    7
                  </ModalStepButton>
                  <ModalStepLabel active={currentStep === 6}></ModalStepLabel>
                </div>
                <div>
                  <ModalStepButton
                    active={currentStep === 7}
                    completed={currentStep > 7}
                    onClick={() => setCurrentStep(7)}
                  >
                    8
                  </ModalStepButton>
                  <ModalStepLabel active={currentStep === 7}></ModalStepLabel>
                </div>
                <div>
                  <ModalStepButton
                    active={currentStep === 8}
                    completed={currentStep > 8}
                    onClick={() => setCurrentStep(8)}
                  >
                    9
                  </ModalStepButton>
                  <ModalStepLabel active={currentStep === 8}></ModalStepLabel>
                </div>
                <div>
                  <ModalStepButton
                    active={currentStep === 9}
                    completed={currentStep > 9}
                    onClick={() => setCurrentStep(9)}
                  >
                    10
                  </ModalStepButton>
                  <ModalStepLabel active={currentStep === 9}></ModalStepLabel>
                </div>
                <div>
                  <ModalStepButton
                    active={currentStep === 10}
                    completed={currentStep > 10}
                    onClick={() => setCurrentStep(10)}
                  >
                    11
                  </ModalStepButton>
                  <ModalStepLabel active={currentStep === 10}></ModalStepLabel>
                </div>
                <div>
                  <ModalStepButton
                    active={currentStep === 11}
                    completed={currentStep > 11}
                    onClick={() => setCurrentStep(11)}
                  >
                    12
                  </ModalStepButton>
                  <ModalStepLabel active={currentStep === 11}></ModalStepLabel>
                </div>
              </ModalStepperWrapper>
              <DivFormConteudo>
                <DivTitulo>
                  <DivTituloConteudo>
                    Selecione um ano para visualização dos dados.
                  </DivTituloConteudo>
                </DivTitulo>
                <InputP>
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
                </InputP>
              </DivFormConteudo>
              <ModalStepContent active={currentStep === 0}>
                <DivFormConteudo>
                  <DivTitulo>
                    <DivTituloConteudo>
                      Trabalhadores remunerados
                    </DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <tr>
                      <td style={{ width: "10%" }}>
                        <b>Código SNIS</b>
                      </td>
                      <td style={{ width: "63%" }}>
                        <b>Descrição</b>
                      </td>
                      <td style={{ width: "5%" }}>
                        <b>
                          <label>Ano: {anoSelected}</label>
                        </b>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>
                        <InputSNIS>TB001</InputSNIS>
                      </td>
                      <td>
                        Coletores e Motoristas de agentes PÚBLICOS, alocados na
                        coleta
                      </td>
                      <td>
                        <InputP>
                          <input
                            {...registerExternal("TB001")}
                            type="text"
                            defaultValue={dadosResiduos?.tb001}
                            onChange={handleOnChange}
                          ></input>
                        </InputP>
                      </td>
                      <td>Empregados</td>
                    </tr>
                    <tr>
                      <td>
                        <InputSNIS>TB003</InputSNIS>
                      </td>
                      <td>Agentes PÚBLICOS envolvidos na varrição</td>
                      <td>
                        <InputP>
                          <input
                            {...registerExternal("TB003")}
                            type="text"
                            defaultValue={dadosResiduos?.tb003}
                            onChange={handleOnChange}
                          ></input>
                        </InputP>
                      </td>
                      <td>Empregados</td>
                    </tr>
                    <tr>
                      <td>
                        <InputSNIS>TB005</InputSNIS>
                      </td>
                      <td>Agentes PÚBLICOS envolvidos com a capina e roçada</td>
                      <td>
                        <InputP>
                          <input
                            {...registerExternal("TB005")}
                            type="text"
                            defaultValue={dadosResiduos?.tb005}
                            onChange={handleOnChange}
                          ></input>
                        </InputP>
                      </td>
                      <td>Empregados</td>
                    </tr>
                    <tr>
                      <td>
                        <InputSNIS>TB007</InputSNIS>
                      </td>
                      <td>
                        Agentes PÚBLICOS alocados nas unidades de manejo,
                        tratamento ou disposição final
                      </td>
                      <td>
                        <InputP>
                          <input
                            {...registerExternal("TB007")}
                            type="text"
                            defaultValue={dadosResiduos?.tb007}
                            onChange={handleOnChange}
                          ></input>
                        </InputP>
                      </td>
                      <td>Empregados</td>
                    </tr>
                    <tr>
                      <td>
                        <InputSNIS>TB009</InputSNIS>
                      </td>
                      <td>
                        Agentes PÚBLICOS envolvidos nos demais serviços quando
                        não especificados acima
                      </td>
                      <td>
                        <InputP>
                          <input
                            {...registerExternal("TB009")}
                            type="text"
                            defaultValue={dadosResiduos?.tb009}
                            onChange={handleOnChange}
                          ></input>
                        </InputP>
                      </td>
                      <td>Empregados</td>
                    </tr>
                    <tr>
                      <td>
                        <InputSNIS>TB011</InputSNIS>
                      </td>
                      <td>
                        Agentes PÚBLICOS alocados na Gerencia ou Administração
                        (Planejamento ou Fiscalização)
                      </td>
                      <td>
                        <InputP>
                          <input
                            {...registerExternal("TB011")}
                            type="text"
                            defaultValue={dadosResiduos?.tb011}
                            onChange={handleOnChange}
                          ></input>
                        </InputP>
                      </td>
                      <td>Empregados</td>
                    </tr>
                    <tr>
                      <td>
                        <InputSNIS>TB013</InputSNIS>
                      </td>
                      <td>Total de Agentes PÚBLICOS envolvidos</td>
                      <td>
                        <InputP>
                          <input
                            disabled={true}
                            {...registerExternal("TB013")}
                            type="text"
                            defaultValue={dadosResiduos?.tb013}
                            onChange={handleOnChange}
                          ></input>
                        </InputP>
                      </td>
                      <td>Empregados</td>
                    </tr>
                    <tr>
                      <td>
                        <InputSNIS>TB002</InputSNIS>
                      </td>
                      <td>
                        Coletores e Motoristas de agentes PRIVADOS, alocados na
                        coleta
                      </td>
                      <td>
                        <InputP>
                          <input
                            {...registerExternal("TB002")}
                            type="text"
                            defaultValue={dadosResiduos?.tb002}
                            onChange={handleOnChange}
                          ></input>
                        </InputP>
                      </td>
                      <td>Empregados</td>
                    </tr>
                    <tr>
                      <td>
                        <InputSNIS>TB004</InputSNIS>
                      </td>
                      <td>Agentes PRIVADOS envolvidos na varrição</td>
                      <td>
                        <InputP>
                          <input
                            {...registerExternal("TB004")}
                            type="text"
                            defaultValue={dadosResiduos?.tb004}
                            onChange={handleOnChange}
                          ></input>
                        </InputP>
                      </td>
                      <td>Empregados</td>
                    </tr>
                    <tr>
                      <td>
                        <InputSNIS>TB006</InputSNIS>
                      </td>
                      <td>Agentes PRIVADOS envolvidos com a capina e roçada</td>
                      <td>
                        <InputP>
                          <input
                            {...registerExternal("TB006")}
                            type="text"
                            defaultValue={dadosResiduos?.tb006}
                            onChange={handleOnChange}
                          ></input>
                        </InputP>
                      </td>
                      <td>Empregados</td>
                    </tr>
                    <tr>
                      <td>
                        <InputSNIS>TB008</InputSNIS>
                      </td>
                      <td>
                        Agentes PRIVADOS alocados nas unidades de manejo,
                        tratamento ou disposição final
                      </td>
                      <td>
                        <InputP>
                          <input
                            {...registerExternal("TB008")}
                            type="text"
                            defaultValue={dadosResiduos?.tb008}
                            onChange={handleOnChange}
                          ></input>
                        </InputP>
                      </td>
                      <td>Empregados</td>
                    </tr>
                    <tr>
                      <td>
                        <InputSNIS>TB010</InputSNIS>
                      </td>
                      <td>
                        Agentes PRIVADOS envolvidos nos demais serviços quando
                        não especificados acima
                      </td>
                      <td>
                        <InputP>
                          <input
                            {...registerExternal("TB010")}
                            type="text"
                            defaultValue={dadosResiduos?.tb010}
                            onChange={handleOnChange}
                          ></input>
                        </InputP>
                      </td>
                      <td>Empregados</td>
                    </tr>
                    <tr>
                      <td>
                        <InputSNIS>TB012</InputSNIS>
                      </td>
                      <td>
                        Agentes PRIVADOS alocados na Gerencia ou Administração
                        (Planejamento ou Fiscalização)
                      </td>
                      <td>
                        <InputP>
                          <input
                            {...registerExternal("TB012")}
                            type="text"
                            defaultValue={dadosResiduos?.tb012}
                            onChange={handleOnChange}
                          ></input>
                        </InputP>
                      </td>
                      <td>Empregados</td>
                    </tr>
                    <tr>
                      <td>
                        <InputSNIS>TB014</InputSNIS>
                      </td>
                      <td>Total de Agentes PRIVADOS envolvidos</td>
                      <td>
                        <InputP>
                          <input
                            disabled={true}
                            {...registerExternal("TB014")}
                            type="text"
                            defaultValue={dadosResiduos?.tb014}
                            onChange={handleOnChange}
                          ></input>
                        </InputP>
                      </td>
                      <td>Empregados</td>
                    </tr>
                    <tr>
                      <td>
                        <InputSNIS>TB015</InputSNIS>
                      </td>
                      <td>
                        Total de trabalhadores envolvidos nos servicos de Manejo
                        de RSU
                      </td>
                      <td>
                        <InputP>
                          <input
                            disabled={true}
                            {...registerExternal("TB015")}
                            type="text"
                            defaultValue={dadosResiduos?.tb015}
                            onChange={handleOnChange}
                          ></input>
                        </InputP>
                      </td>
                      <td>Empregados</td>
                    </tr>
                  </table>

                  <DivEixo>
                    Trabalhadores de frentes de trabalho temporárias
                  </DivEixo>
                  <table>
                    <tr>
                      <td style={{ width: "10%" }}>
                        <b>Código SNIS</b>
                      </td>
                      <td style={{ width: "63%" }}>
                        <b>Descrição</b>
                      </td>
                      <td style={{ width: "5%" }}>
                        <b>
                          <label>Ano: {anoSelected}</label>
                        </b>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>TB016</td>
                      <td>Existem frentes de trabalho temporário?</td>
                      <td>
                        <InputP>
                          <select {...registerExternal("TB016")}>
                            <option>{dadosResiduos?.tb016}</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                          </select>
                        </InputP>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>TB017</td>
                      <td>Quantidades de trabalhadores Frente!</td>
                      <td>
                        <InputP>
                          <input
                            {...registerExternal("TB017")}
                            type="text"
                            defaultValue={dadosResiduos?.tb017}
                            onChange={handleOnChange}
                          ></input>
                        </InputP>
                      </td>
                      <td>Empregados</td>
                    </tr>
                    <tr>
                      <td>TB020</td>
                      <td>Duração de frente 1</td>
                      <td>
                        <InputP>
                          <input
                            {...registerExternal("TB020")}
                            type="text"
                            defaultValue={dadosResiduos?.tb020}
                            onChange={handleOnChange}
                          ></input>
                        </InputP>
                      </td>
                      <td>Meses</td>
                    </tr>
                    <tr>
                      <td>TB023</td>
                      <td>Atuam em mais de um tipo de serviço, Frente 1?</td>
                      <td>
                        <InputP>
                          <select {...registerExternal("TB023")}>
                            <option>{dadosResiduos?.tb023}</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                          </select>
                        </InputP>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>TB026</td>
                      <td>Tipo de serviço predominate de Frente 1</td>
                      <td>
                        <InputP>
                          <select {...registerExternal("TB026")}>
                            <option>{dadosResiduos?.tb026}</option>
                            <option value="Limpeza pública">
                              Limpeza pública
                            </option>
                            <option value="Coleta de resíduos domiciliares">
                              Coleta de resíduos domiciliares
                            </option>
                            <option value="Coleta seletiva domiciliares">
                              Coleta seletiva domiciliares
                            </option>
                            <option value="Tratamento e disposição de RSU ">
                              Tratamento e disposição de RSU{" "}
                            </option>
                          </select>
                        </InputP>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>TB018</td>
                      <td>Quantidade de trabalhadores Frente 2</td>
                      <td>
                        <InputP>
                          <input
                            {...registerExternal("TB018")}
                            type="text"
                            defaultValue={dadosResiduos?.tb018}
                            onChange={handleOnChange}
                          ></input>
                        </InputP>
                      </td>
                      <td>Empregados</td>
                    </tr>
                    <tr>
                      <td>TB021</td>
                      <td>Duração de Frente 2</td>
                      <td>
                        <InputP>
                          <input
                            {...registerExternal("TB021")}
                            type="text"
                            defaultValue={dadosResiduos?.tb021}
                            onChange={handleOnChange}
                          ></input>
                        </InputP>
                      </td>
                      <td>Meses</td>
                    </tr>
                    <tr>
                      <td>TB024</td>
                      <td>Atuam em mais de um tipo de serviço, Frente 2?</td>
                      <td>
                        <InputP>
                          <select {...registerExternal("TB024")}>
                            <option>{dadosResiduos?.tb024}</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                          </select>
                        </InputP>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>TB027</td>
                      <td>Tipo de serviço predominante da Frente 2</td>
                      <td>
                        <InputP>
                          <select {...registerExternal("TB027")}>
                            <option>{dadosResiduos?.tb027}</option>
                            <option value="Limpeza pública">
                              Limpeza pública
                            </option>
                            <option value="Coleta de resíduos domiciliares">
                              Coleta de resíduos domiciliares
                            </option>
                            <option value="Coleta seletiva domiciliares">
                              Coleta seletiva domiciliares
                            </option>
                            <option value="Tratamento e disposição de RSU ">
                              Tratamento e disposição de RSU{" "}
                            </option>
                          </select>
                        </InputP>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>TB019</td>
                      <td>Quantidade de trabalhadores Frente 3</td>
                      <td>
                        <InputP>
                          <input
                            {...registerExternal("TB019")}
                            type="text"
                            defaultValue={dadosResiduos?.tb019}
                            onChange={handleOnChange}
                          ></input>
                        </InputP>
                      </td>
                      <td>Empregados</td>
                    </tr>
                    <tr>
                      <td>TB022</td>
                      <td>Duração de Frente 3</td>
                      <td>
                        <InputP>
                          <input
                            {...registerExternal("TB022")}
                            type="text"
                            defaultValue={dadosResiduos?.tb022}
                            onChange={handleOnChange}
                          ></input>
                        </InputP>
                      </td>
                      <td>Meses</td>
                    </tr>
                    <tr>
                      <td>TB025</td>
                      <td>Atuam em mais de um tipo de serviços, Frente 3?</td>
                      <td>
                        <InputP>
                          <select {...registerExternal("TB025")}>
                            <option>{dadosResiduos?.tb025}</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                          </select>
                        </InputP>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>TB028</td>
                      <td>Tipo de serviços predominante da Frente 3</td>
                      <td>
                        <InputP>
                          <select {...registerExternal("TB028")}>
                            <option>{dadosResiduos?.tb028}</option>
                            <option value="Limpeza pública">
                              Limpeza pública
                            </option>
                            <option value="Coleta de resíduos domiciliares">
                              Coleta de resíduos domiciliares
                            </option>
                            <option value="Coleta seletiva domiciliares">
                              Coleta seletiva domiciliares
                            </option>
                            <option value="Tratamento e disposição de RSU ">
                              Tratamento e disposição de RSU{" "}
                            </option>
                          </select>
                        </InputP>
                      </td>
                      <td></td>
                    </tr>
                  </table>
                </DivFormConteudo>
              </ModalStepContent>

              <ModalStepContent active={currentStep === 1}>
                <DivFormConteudo>
                  <DivTitulo>
                    <DivTituloConteudo>
                      Frota de coleta domiciliar e pública
                    </DivTituloConteudo>
                  </DivTitulo>

                  <table>
                    <tr>
                      <td>
                        <tr>
                          <th></th>
                          <th colSpan={3} style={{ textAlign: "center" }}>
                            Prefeitura ou SLU
                          </th>
                        </tr>
                        <tr>
                          <th>Tipo de veículo (Quantidade)</th>
                          <th style={{ textAlign: "center" }}>0 a 5 anos</th>
                          <th style={{ textAlign: "center" }}>5 a 10 anos</th>
                          <th style={{ textAlign: "center" }}>
                            Maior que 10 anos
                          </th>
                        </tr>
                        <tr>
                          <td></td>
                          <td style={{ textAlign: "center" }}>CO054</td>
                          <td style={{ textAlign: "center" }}>CO055</td>
                          <td style={{ textAlign: "center" }}>CO056</td>
                        </tr>
                        <tr>
                          <td>
                            <InputM>Caminhão compactador</InputM>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO054")}
                                type="text"
                                defaultValue={dadosResiduos?.co054}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO055")}
                                type="text"
                                defaultValue={dadosResiduos?.co055}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO056")}
                                type="text"
                                defaultValue={dadosResiduos?.co056}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                        </tr>
                      </td>

                      <td>
                        <tr>
                          <th colSpan={2} style={{ textAlign: "center" }}>
                            Empr. Contratada
                          </th>
                        </tr>
                        <tr>
                          <th style={{ textAlign: "center" }}>0 a 5 anos</th>
                          <th style={{ textAlign: "center" }}>5 a 10 anos</th>
                          <th style={{ textAlign: "center" }}>
                            Maior que 10 anos
                          </th>
                        </tr>
                        <tr>
                          <td style={{ textAlign: "center" }}>CO057</td>
                          <td style={{ textAlign: "center" }}>CO058</td>
                          <td style={{ textAlign: "center" }}>CO059</td>
                        </tr>
                        <tr>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO057")}
                                type="text"
                                defaultValue={dadosResiduos?.co057}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO058")}
                                type="text"
                                defaultValue={dadosResiduos?.co058}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO059")}
                                type="text"
                                defaultValue={dadosResiduos?.co059}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                        </tr>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <tr>
                          <td></td>
                          <td style={{ textAlign: "center" }}>CO063</td>
                          <td style={{ textAlign: "center" }}>CO064</td>
                          <td style={{ textAlign: "center" }}>CO065</td>
                        </tr>
                        <tr>
                          <td>
                            <InputM>
                              Caminhão basculante, baú ou carroceria
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO063")}
                                type="text"
                                defaultValue={dadosResiduos?.co063}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO064")}
                                type="text"
                                defaultValue={dadosResiduos?.co064}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO065")}
                                type="text"
                                defaultValue={dadosResiduos?.co065}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                        </tr>
                      </td>

                      <td>
                        <tr>
                          <td style={{ textAlign: "center" }}>CO066</td>
                          <td style={{ textAlign: "center" }}>CO067</td>
                          <td style={{ textAlign: "center" }}>CO068</td>
                        </tr>
                        <tr>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO066")}
                                type="text"
                                defaultValue={dadosResiduos?.co066}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO067")}
                                type="text"
                                defaultValue={dadosResiduos?.co067}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO068")}
                                type="text"
                                defaultValue={dadosResiduos?.co068}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                        </tr>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <tr>
                          <td></td>
                          <td style={{ textAlign: "center" }}>CO072</td>
                          <td style={{ textAlign: "center" }}>CO073</td>
                          <td style={{ textAlign: "center" }}>CO074</td>
                        </tr>
                        <tr>
                          <td>
                            <InputM>Caminhão poliguindastes (brook)</InputM>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO072")}
                                type="text"
                                defaultValue={dadosResiduos?.co072}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO073")}
                                type="text"
                                defaultValue={dadosResiduos?.co073}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO074")}
                                type="text"
                                defaultValue={dadosResiduos?.co074}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                        </tr>
                      </td>

                      <td>
                        <tr>
                          <td style={{ textAlign: "center" }}>CO075</td>
                          <td style={{ textAlign: "center" }}>CO076</td>
                          <td style={{ textAlign: "center" }}>CO077</td>
                        </tr>
                        <tr>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO075")}
                                type="text"
                                defaultValue={dadosResiduos?.co075}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO076")}
                                type="text"
                                defaultValue={dadosResiduos?.co076}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO077")}
                                type="text"
                                defaultValue={dadosResiduos?.co077}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                        </tr>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <tr>
                          <td></td>
                          <td style={{ textAlign: "center" }}>CO071</td>
                          <td style={{ textAlign: "center" }}>CO082</td>
                          <td style={{ textAlign: "center" }}>CO083</td>
                        </tr>
                        <tr>
                          <td>
                            <InputM>Trator agrícola com reboque</InputM>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO071")}
                                type="text"
                                defaultValue={dadosResiduos?.co071}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO082")}
                                type="text"
                                defaultValue={dadosResiduos?.co082}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO083")}
                                type="text"
                                defaultValue={dadosResiduos?.co083}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                        </tr>
                      </td>
                      <td>
                        <tr>
                          <td style={{ textAlign: "center" }}>CO084</td>
                          <td style={{ textAlign: "center" }}>CO085</td>
                          <td style={{ textAlign: "center" }}>CO086</td>
                        </tr>
                        <tr>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO084")}
                                type="text"
                                defaultValue={dadosResiduos?.co084}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO085")}
                                type="text"
                                defaultValue={dadosResiduos?.co085}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO086")}
                                type="text"
                                defaultValue={dadosResiduos?.co086}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                        </tr>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <tr>
                          <td></td>
                          <td style={{ textAlign: "center" }}>CO090</td>
                          <td style={{ textAlign: "center" }}>CO091</td>
                          <td style={{ textAlign: "center" }}>CO092</td>
                        </tr>
                        <tr>
                          <td>
                            <InputM>Tração animal</InputM>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO090")}
                                type="text"
                                defaultValue={dadosResiduos?.co090}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO091")}
                                type="text"
                                defaultValue={dadosResiduos?.co091}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO092")}
                                type="text"
                                defaultValue={dadosResiduos?.co092}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                        </tr>
                      </td>
                      <td>
                        <tr>
                          <td style={{ textAlign: "center" }}>CO093</td>
                          <td style={{ textAlign: "center" }}>CO094</td>
                          <td style={{ textAlign: "center" }}>CO095</td>
                        </tr>
                        <tr>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO093")}
                                type="text"
                                defaultValue={dadosResiduos?.co093}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO094")}
                                type="text"
                                defaultValue={dadosResiduos?.co094}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO095")}
                                type="text"
                                defaultValue={dadosResiduos?.co095}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                        </tr>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <tr>
                          <td></td>
                          <td style={{ textAlign: "center" }}>CO155</td>
                          <td style={{ textAlign: "center" }}>CO156</td>
                          <td style={{ textAlign: "center" }}>CO157</td>
                        </tr>
                        <tr>
                          <td>
                            <InputM>Veículos aquáticos (embarcações)</InputM>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO155")}
                                type="text"
                                defaultValue={dadosResiduos?.co155}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO156")}
                                type="text"
                                defaultValue={dadosResiduos?.co156}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO157")}
                                type="text"
                                defaultValue={dadosResiduos?.co157}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                        </tr>
                      </td>
                      <td>
                        <tr>
                          <td style={{ textAlign: "center" }}>CO158</td>
                          <td style={{ textAlign: "center" }}>CO159</td>
                          <td style={{ textAlign: "center" }}>CO160</td>
                        </tr>
                        <tr>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO158")}
                                type="text"
                                defaultValue={dadosResiduos?.co158}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO159")}
                                type="text"
                                defaultValue={dadosResiduos?.co159}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                          <td>
                            <InputP>
                              <input
                                {...registerExternal("CO160")}
                                type="text"
                                defaultValue={dadosResiduos?.co160}
                                onChange={handleOnChange}
                              />
                            </InputP>
                          </td>
                        </tr>
                      </td>
                    </tr>
                  </table>

                  <table>
                    <tr aria-rowspan={4}>
                      <td>
                        <InputM>Outros veículos</InputM>
                      </td>
                      <td colSpan={3}>
                        <InputGG>
                          <label>CO163</label>
                          <textarea
                            {...registerExternal("CO163")}
                            defaultValue={dadosResiduos?.co163}
                            onChange={handleOnChange}
                          />
                        </InputGG>
                      </td>
                    </tr>
                  </table>
                </DivFormConteudo>
              </ModalStepContent>

              <ModalStepContent active={currentStep === 2}>
                <DivFormConteudo>
                  <DivTitulo>
                    <DivTituloConteudo>
                      Residuos sólidos domiciliares e públicos coletados
                    </DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <tr>
                      <th>Código SNIS</th>
                      <th>Descrição</th>
                      <th>Ano: {anoSelected}</th>
                      <th></th>
                    </tr>
                    <tr>
                      <td>CO154</td>
                      <td>
                        {" "}
                        Os residuos provenientes da varrição ou limpeza de
                        logradouros públicos são recolhidos junto com os
                        residuos domiciliares?
                      </td>
                      <td>
                        <select {...registerExternal("CO154")}>
                          <option value="">
                            {dadosResiduos?.co154
                              ? dadosResiduos?.co154
                              : "Opções"}
                          </option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>CO012</td>
                      <td>
                        {" "}
                        Valor contratado (preço unitário) do serviço de RDO e
                        RPU diurna
                      </td>
                      <td>
                        <InputP>
                          <input
                            {...registerExternal("CO012")}
                            type="text"
                            defaultValue={dadosResiduos?.co012}
                            onChange={handleOnChange}
                          ></input>
                        </InputP>
                      </td>
                      <td>R$/tonelada</td>
                    </tr>
                    <tr>
                      <td>CO146</td>
                      <td>
                        {" "}
                        Valor contratual (preço unitário) do serviço de
                        transporte de RDO e RPU até a unidade de destinação
                        final
                      </td>
                      <td>
                        <InputP>
                          <input
                            {...registerExternal("CO146")}
                            type="text"
                            defaultValue={dadosResiduos?.co146}
                            onChange={handleOnChange}
                          ></input>
                        </InputP>
                      </td>
                      <td>R$/tonelada</td>
                    </tr>
                    <tr>
                      <td>CO148</td>
                      <td>
                        No preço acima está incluido o transporte de RDO e RPU
                        coletados até a destinação final?
                      </td>
                      <td>
                        <select {...registerExternal("CO148")}>
                          <option value="">
                            {dadosResiduos?.co148
                              ? dadosResiduos?.co148
                              : "Opções"}
                          </option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>CO149</td>
                      <td>
                        {" "}
                        A distancia média do centro de massa à unidade de
                        destinação final é superior a 15 km?
                      </td>
                      <td>
                        <select {...registerExternal("CO149")}>
                          <option value="">
                            {dadosResiduos?.co149
                              ? dadosResiduos?.co149
                              : "Opções"}
                          </option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>CO150</td>
                      <td>
                        Especifique a distancia do centro de massa à unidade de
                        destinação final superior a 15km
                      </td>
                      <td>
                        <InputP>
                          <input
                            {...registerExternal("CO150")}
                            type="text"
                            defaultValue={dadosResiduos?.co150}
                            onChange={handleOnChange}
                          ></input>
                        </InputP>
                      </td>
                      <td>Km</td>
                    </tr>
                    <tr>
                      <td>CO151</td>
                      <td>
                        {" "}
                        A distancia média de transporte à unidade de destinação
                        final é superior a 15km?
                      </td>
                      <td>
                        <select {...registerExternal("CO151")}>
                          <option value="">
                            {dadosResiduos?.co151
                              ? dadosResiduos?.co151
                              : "Opções"}
                          </option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>CO152</td>
                      <td>
                        {" "}
                        Especifique a distancia de transporte à unidade de
                        destinação final superior a 15km
                      </td>
                      <td>
                        <InputP>
                          <input
                            {...registerExternal("CO152")}
                            type="text"
                            defaultValue={dadosResiduos?.co152}
                            onChange={handleOnChange}
                          ></input>
                        </InputP>
                      </td>
                      <td>Km</td>
                    </tr>
                  </table>

                  <table>
                    <tbody>
                      <tr>
                        <th>
                          <span>
                            Tipo de resíduos (Quantidade em toneladas)
                          </span>
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
                          <InputP>
                            <input
                              {...registerExternal("CO108")}
                              type="text"
                              defaultValue={dadosResiduos?.co108}
                              onChange={handleOnChange}
                            ></input>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("CO109")}
                              type="text"
                              defaultValue={dadosResiduos?.co109}
                              onChange={handleOnChange}
                            ></input>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("CS048")}
                              type="text"
                              defaultValue={dadosResiduos?.cs048}
                              onChange={handleOnChange}
                            ></input>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("CO140")}
                              type="text"
                              defaultValue={dadosResiduos?.co140}
                              onChange={handleOnChange}
                            ></input>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("CO111")}
                              type="text"
                              defaultValue={dadosResiduos?.co111}
                              onChange={handleOnChange}
                              disabled={true}
                            ></input>
                          </InputP>
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
                        <td></td>
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
                          <InputP>
                            <input
                              {...registerExternal("CO112")}
                              type="text"
                              defaultValue={dadosResiduos?.co112}
                              onChange={handleOnChange}
                            ></input>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("CO113")}
                              type="text"
                              defaultValue={dadosResiduos?.co113}
                              onChange={handleOnChange}
                            ></input>
                          </InputP>
                        </td>
                        <td></td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("CO141")}
                              type="text"
                              defaultValue={dadosResiduos?.co141}
                              onChange={handleOnChange}
                            ></input>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("CO115")}
                              type="text"
                              defaultValue={dadosResiduos?.co115}
                              onChange={handleOnChange}
                              disabled={true}
                            ></input>
                          </InputP>
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
                          <InputP>
                            <input
                              {...registerExternal("CO116")}
                              type="text"
                              disabled={true}
                              defaultValue={dadosResiduos?.co116}
                              onChange={handleOnChange}
                            ></input>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("CO117")}
                              type="text"
                              defaultValue={dadosResiduos?.co117}
                              onChange={handleOnChange}
                              disabled={true}
                            ></input>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("CS048A")}
                              disabled={true}
                              type="text"
                              defaultValue={dadosResiduos?.cs048a}
                              onChange={handleOnChange}
                            ></input>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("CO142")}
                              type="text"
                              defaultValue={dadosResiduos?.co142}
                              onChange={handleOnChange}
                              disabled={true}
                            ></input>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("CO119")}
                              type="text"
                              defaultValue={dadosResiduos?.co119}
                              onChange={handleOnChange}
                              disabled={true}
                            ></input>
                          </InputP>
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
                        <th>Ano {anoSelected}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>CO021</td>
                        <td>
                          <InputGG>
                            {" "}
                            É utilizada balança para pesagem rotineira dos
                            residuos sólidos coletados?
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CO021")}
                              defaultValue={dadosResiduos?.co021}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.co021}</option>
                              <option value="Sim">Sim</option>
                              <option value="Nao">Não</option>
                            </select>
                          </InputP>
                        </td>
                      </tr>
                      <tr>
                        <td>CO019</td>
                        <td>
                          Os resíduos sólidos DOMICILIARES coletados são
                          enviados para outro município?
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CO019")}
                              defaultValue={dadosResiduos?.co019}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.co019}</option>
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
                        {unidadesRsc?.map((unidade, key) => (
                          <>
                            <tr key={key}>
                              <td>{unidade.nome_municipio}</td>
                              <td>{unidade.nome_unidade_processamento}</td>
                              <td>{unidade.tipo_unidade}</td>
                              <td>{unidade.operador_unidade}</td>
                              <td>{unidade.cnpj}</td>
                              <td>{unidade.quant_residuos_exportados}</td>
                              <td>
                                <Actions>
                                  <span>
                                    <Image
                                      onClick={() =>
                                        handleRemoveUnidadeRsc(
                                          unidade.id_unidade_residuo_solido
                                        )
                                      }
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
                          </>
                        ))}
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
                        <th>Ano {anoSelected}</th>
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
                            <select
                              {...registerExternal("CO008")}
                              defaultValue={dadosResiduos?.co008}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.co008}</option>
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
                            Há execução de coleta com elevação de contêineres
                            por caminhão compactador, mesmo implantada em
                            caráter de experiência?{" "}
                          </InputG>
                        </td>

                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CO131")}
                              defaultValue={dadosResiduos?.co131}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.co131}</option>
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
                            <textarea
                              {...registerExternal("CO999")}
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
                      Características das unidades registradas como ATERROS ou
                      LIXÕES
                    </DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <thead>
                      <tr>
                        <th>Código SNIS</th>
                        <th>Descrição</th>
                        <th>Ano {anoSelected}</th>
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
                            <select
                              {...registerExternal("CS001")}
                              defaultValue={dadosResiduos?.cs001}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cs001}</option>
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
                            <select
                              {...registerExternal("CS053")}
                              defaultValue={dadosResiduos?.cs053}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cs053}</option>
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
                            Valor contratual (preço unitário) do serviço de
                            coleta seletiva porta a porta contratado às empresas
                            (PREENCHER VALOR MÉDIO SE HOUVER MAIS DE UM)
                          </InputXL>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("CS054")}
                              type="text"
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
                            No preço acima está incluido o serviço de triagem
                            dos materiais recicláveis?
                          </InputXL>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CS055")}
                              defaultValue={dadosResiduos?.cs055}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cs055}</option>
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
                            <select
                              {...registerExternal("CS061")}
                              defaultValue={dadosResiduos?.cs061}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cs061}</option>
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
                            Valor contratual (preço unitário) do serviço de
                            triagem de materias reciclaveis contratado às
                            empresas (PREENCHER VALOR MÉDIO SE HOUVER MAIS DE
                            UM)
                          </InputXL>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("CS056")}
                              type="text"
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
                            Há associações ou cooperativas de catadores
                            contratadas para a prestação do serviço de coleta
                            seletiva porta a porta
                          </InputXL>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CS057")}
                              defaultValue={dadosResiduos?.cs057}
                              onChange={handleOnChange}
                            >
                              <option>
                                {dadosResiduos?.cs057
                                  ? dadosResiduos?.cs057
                                  : "Selecionar"}
                              </option>
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
                            Valor contratual (preço unitário) do serviço de
                            coleta seletiva porta a porta contratado às
                            associações/cooperativas (PREENCHER VALOR MÉDIO SE
                            HOUVER MAIS DE UM)
                          </InputXL>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("CS058")}
                              type="text"
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
                            No preço acima está incluido o serviço de triagem
                            dos materiais recicláveis?
                          </InputXL>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CS059")}
                              defaultValue={dadosResiduos?.cs059}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cs059}</option>
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
                            para a prestação do serviço de triagem de
                            recicláveis secos?
                          </InputXL>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CS062")}
                              defaultValue={dadosResiduos?.cs059}
                              onChange={handleOnChange}
                            >
                              {" "}
                              <option>{dadosResiduos?.cs059}</option>
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
                            Valor contratual (preço unitário) do serviço de
                            materiais recicláveis secos contratado às
                            associações de catadores (PREENCHER VALOR MÉDIO SE
                            HOUVER MAIS DE UM)
                          </InputXL>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("CS057A")}
                              type="text"
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
                            <select
                              {...registerExternal("CS027")}
                              defaultValue={dadosResiduos?.cs027}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cs027}</option>
                              <option value="Sim">Sim</option>
                              <option value="Não">Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CS031")}
                              defaultValue={dadosResiduos?.cs031}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cs031}</option>
                              <option value="Sim">Sim</option>
                              <option value="Não">Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CS035")}
                              defaultValue={dadosResiduos?.cs035}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cs035}</option>
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
                            Empresa(s) privada(s) do ramo sucateiros, aparista,
                            ferro velho
                          </InputG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CS028")}
                              defaultValue={dadosResiduos?.cs028}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cs028}</option>
                              <option value="Sim">Sim</option>
                              <option value="Não">Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CS032")}
                              defaultValue={dadosResiduos?.cs032}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cs032}</option>
                              <option value="Sim">Sim</option>
                              <option value="Não">Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CS036")}
                              defaultValue={dadosResiduos?.cs036}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cs036}</option>
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
                            Associação ou Cooperativa COM parceria/ da
                            prefeitura
                          </InputG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CS042")}
                              defaultValue={dadosResiduos?.cs042}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cs042}</option>
                              <option value="Sim">Sim</option>
                              <option value="Não">Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CS043")}
                              defaultValue={dadosResiduos?.cs043}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cs043}</option>
                              <option value="Sim">Sim</option>
                              <option value="Não">Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CS044")}
                              defaultValue={dadosResiduos?.cs044}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cs044}</option>
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
                            Associação ou Cooperativa SEM parceria/ da
                            prefeitura
                          </InputG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CS045")}
                              defaultValue={dadosResiduos?.cs045}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cs045}</option>
                              <option value="Sim">Sim</option>
                              <option value="Não">Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CS046")}
                              defaultValue={dadosResiduos?.cs059}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cs059}</option>
                              <option value="Sim">Sim</option>
                              <option value="Não">Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CS047")}
                              defaultValue={dadosResiduos?.cs047}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cs047}</option>
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
                            <select
                              {...registerExternal("CS030")}
                              defaultValue={dadosResiduos?.cs030}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cs030}</option>
                              <option value="Sim">Sim</option>
                              <option value="Não">Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CS034")}
                              defaultValue={dadosResiduos?.cs034}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cs034}</option>
                              <option value="Sim">Sim</option>
                              <option value="Não">Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CS038")}
                              defaultValue={dadosResiduos?.cs038}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cs038}</option>
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
                        <th>Ano {anoSelected}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>CS023</td>
                        <td>
                          <InputGG>
                            Quantidade recolhida na coleta seletiva executada
                            pela Prefeitura ou SLU
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("CS023")}
                              defaultValue={dadosResiduos?.cs023}
                              onChange={handleOnChange}
                              type="text"
                            ></input>
                          </InputP>
                        </td>
                        <td>Toneladas</td>
                      </tr>
                      <tr>
                        <td>CS024</td>
                        <td>
                          <InputGG>
                            Qtd. recolhida executada por empresa(s)
                            contratada(s) pela Prefeitura ou SLU
                          </InputGG>
                        </td>

                        <td>
                          <InputP>
                            <input
                              {...registerExternal("CS024")}
                              defaultValue={dadosResiduos?.cs024}
                              onChange={handleOnChange}
                              type="text"
                            ></input>
                          </InputP>
                        </td>
                        <td>Toneladas</td>
                      </tr>
                      <tr>
                        <td>CS048</td>
                        <td>
                          <InputGG>
                            Qtd. recolhida executada por associação ou
                            cooperativa de catadores COM parceria/apoio da
                            prefeitura
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("CS048B")}
                              defaultValue={dadosResiduos?.cs048b}
                              onChange={handleOnChange}
                              type="text"
                            ></input>
                          </InputP>
                        </td>
                        <td>Toneladas</td>
                      </tr>
                      <tr>
                        <td>CS025</td>
                        <td>
                          <InputGG>
                            Qtd. recolhida por outros agentes que detenham
                            parceria COM a Prefeitura
                          </InputGG>
                        </td>

                        <td>
                          <InputP>
                            <input
                              {...registerExternal("CS025")}
                              defaultValue={dadosResiduos?.cs025}
                              onChange={handleOnChange}
                              type="text"
                            ></input>
                          </InputP>
                        </td>
                        <td>Toneladas</td>
                      </tr>
                      <tr>
                        <td>CS026</td>
                        <td>
                          <InputGG>
                            Qtd. total recolhida pelos 4 agentes executores
                            acima mencionados
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("CS026")}
                              disabled={true}
                              defaultValue={dadosResiduos?.cs026}
                              onChange={handleOnChange}
                              type="text"
                            ></input>
                          </InputP>
                        </td>
                        <td>Toneladas</td>
                      </tr>
                    </tbody>
                  </table>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <InputSNIS>CS049</InputSNIS>
                        </td>
                        <td>
                          <InputG>
                            Mencione os outros agentes que detenham parceria COM
                            a Prefeitura
                          </InputG>
                        </td>
                        <th>
                          <InputG>
                            <textarea
                              {...registerExternal("CS049")}
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
                        <th>Ano {anoSelected}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>CS051</td>
                        <td>
                          <InputGG>
                            Houve RECUPERAÇÃO de materiais reciclaveis executada
                            em unidades de triagem? NÃO CONSIDERAR LIXÕES
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CS051")}
                              defaultValue={dadosResiduos?.cs051}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cs051}</option>
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
                            Quantidade de Papel e papelão recicláveis
                            recuperados
                          </InputGG>
                        </td>

                        <td>
                          <InputP>
                            <input
                              {...registerExternal("CS010")}
                              type="text"
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
                            <input
                              {...registerExternal("CS011")}
                              type="text"
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
                            <input
                              {...registerExternal("CS012")}
                              type="text"
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
                            <input
                              {...registerExternal("CS013")}
                              type="text"
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
                            Quantidade de Outros materiais recicláveis
                            recuperados
                          </InputGG>
                        </td>

                        <td>
                          <InputP>
                            <input
                              {...registerExternal("CS014")}
                              type="text"
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
                            Quantidade total de materiais recicláveis
                            recuperados
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("CS009")}
                              type="text"
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
                    <DivTituloConteudo>
                      Resíduos sólidos dos serviços da saúde (RSS)
                    </DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <thead>
                      <tr>
                        <th>Código SNIS</th>
                        <th>Descrição</th>
                        <th>Ano {anoSelected}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>RS020</td>
                        <td>
                          <InputGG>
                            Existe no município coleta diferenciada de resíduos
                            sólidos da saúde?
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("RS020")}
                              defaultValue={dadosResiduos?.rs020}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.rs020}</option>
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
                            A coleta diferenciada realizada pela prefeitura é
                            cobrada separadamente?
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("RS004")}
                              defaultValue={dadosResiduos?.rs004}
                              onChange={handleOnChange}
                            >
                              <option>
                                {dadosResiduos?.rs004
                                  ? dadosResiduos?.rs004
                                  : "Selecionar"}
                              </option>
                              <option value="Sim">Sim</option>
                              <option value="Não">Não</option>
                            </select>
                          </InputP>
                        </td>
                      </tr>
                      <tr>
                        <td>RS045</td>
                        <td>
                          <InputGG>Executada pela Prefeitura ou SLU?</InputGG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("RS045")}
                              defaultValue={dadosResiduos?.rs045}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.rs045}</option>
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
                            <select
                              {...registerExternal("RS046")}
                              defaultValue={dadosResiduos?.rs046}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.rs046}</option>
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
                            Executada pelo próprio gerador ou empresa contratada
                            por ele?
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("RS003")}
                              defaultValue={dadosResiduos?.rs003}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.rs003}</option>
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
                            Quantidade de RSS coletados pela Prefeitura ou
                            empresa contratada por ela
                          </InputGG>
                        </td>

                        <td>
                          <InputP>
                            <input
                              {...registerExternal("RS028")}
                              type="text"
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
                            Quantidade de RSS coletados pela próprio gerador ou
                            empresa contratada por ele
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("RS008")}
                              type="text"
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
                            <input
                              {...registerExternal("RS044")}
                              type="text"
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
                            A prefeitura exerce algum tipo de controle sobre os
                            executores(externos)?
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("RS026")}
                              defaultValue={dadosResiduos?.rs026}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.rs026}</option>
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
                        <td>
                          <InputSNIS>RS027</InputSNIS>
                        </td>
                        <td>
                          <InputG>
                            Especifique, sucintamente, qual tipo de controle
                          </InputG>
                        </td>
                        <td>
                          <InputG>
                            <input
                              {...registerExternal("RS027")}
                              type="text"
                            ></input>
                          </InputG>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <InputSNIS>RS036</InputSNIS>
                        </td>
                        <td>
                          <InputGG>
                            Os RSS são transportados em veículo destinado à
                            coleta domiciliar, porém em viagem exclusiva?
                          </InputGG>
                        </td>

                        <td>
                          <InputP>
                            <select
                              {...registerExternal("RS036")}
                              defaultValue={dadosResiduos?.rs036}
                              onChange={handleOnChange}
                            >
                              {" "}
                              <option>{dadosResiduos?.rs036}</option>
                              <option value="Sim">Sim</option>
                              <option value="Não">Não</option>
                            </select>
                          </InputP>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>RS038</InputSNIS>
                        </td>
                        <td>
                          <InputGG>
                            Os RSS são transportados em veiculo exclusivo?
                          </InputGG>
                        </td>

                        <td>
                          <InputP>
                            <select
                              {...registerExternal("RS038")}
                              defaultValue={dadosResiduos?.rs038}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.rs038}</option>
                              <option value="Sim">Sim</option>
                              <option value="Não">Não</option>
                            </select>
                          </InputP>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>RS040</InputSNIS>
                        </td>
                        <td>
                          <InputGG>
                            O serviço de coleta diferenciada dos RSS é executado
                            por empresa(s) contratada(s)?
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("RS040")}
                              defaultValue={dadosResiduos?.rs040}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.rs040}</option>
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
                            Valor contratual (Preço unitário) do serviço de
                            coleta diferenciada do RSS
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("RS041")}
                              type="text"
                              defaultValue={dadosResiduos?.rs041}
                              onChange={handleOnChange}
                            ></input>
                          </InputP>
                        </td>
                        <td>Toneladas</td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>RS042</InputSNIS>
                        </td>
                        <td>
                          <InputGG>
                            No preço acima está incluso algun tipo de tratamento
                            para os RSS coletados?
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("RS042")}
                              defaultValue={dadosResiduos?.rs042}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.rs042}</option>
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
                            Valor contratual (preço unitário) do serviço de
                            tratamento dos RSS
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("RS043")}
                              type="text"
                              defaultValue={dadosResiduos?.rs043}
                              onChange={handleOnChange}
                            ></input>
                          </InputP>
                        </td>
                        <td>Toneladas</td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>RS030</InputSNIS>
                        </td>
                        <td>
                          <InputGG>
                            O município envia RSS coletados para outro município
                            ?
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              defaultValue={dadosResiduos?.rs030}
                              onChange={rsExportadoChange}
                            >
                              <option>{dadosResiduos?.rs030}</option>
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
                        {unidadesRss?.map((unidade, key) => (
                          <>
                            <tr key={key}>
                              <td>{unidade.nome_municipio}</td>
                              <td>{unidade.nome_unidade_processamento}</td>
                              <td>{unidade.tipo_unidade}</td>
                              <td>{unidade.operador_unidade}</td>
                              <td>{unidade.cnpj}</td>
                              <td>{unidade.quant_residuos_exportados}</td>
                              <td>
                                <Actions>
                                  <span>
                                    <Image
                                      onClick={() =>
                                        handleRemoveUnidadeRss(
                                          unidade.id_unidade_residuo_solido_rss
                                        )
                                      }
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
                          </>
                        ))}
                      </tbody>
                    </table>
                  </Tabela>
                </DivFormConteudo>
              </ModalStepContent>

              <ModalStepContent active={currentStep === 7}>
                <DivFormConteudo>
                  <DivTitulo>
                    <DivTituloConteudo>
                      Resíduos sólidos da Construção Civil (RCC)
                    </DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <thead>
                      <tr>
                        <th>Código SNIS</th>
                        <th>Descrição</th>
                        <th>Ano {anoSelected}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>CC019</td>
                        <td>
                          <InputGG>
                            A Prefeitura ou SLU executa usualmente a coleta
                            diferenciada de RCC no Município?{" "}
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CC019")}
                              defaultValue={dadosResiduos?.cc019}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cc019}</option>
                              <option value="Sim">Sim</option>
                              <option value="Nao">Não</option>
                            </select>
                          </InputP>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>CC010</InputSNIS>
                        </td>
                        <td>
                          <InputGG>
                            O serviço prestado pela Prefeitura é cobrado do
                            usuário?{" "}
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CC010")}
                              defaultValue={dadosResiduos?.cc010}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cc010}</option>
                              <option value="Sim">Sim</option>
                              <option value="Nao">Não</option>
                            </select>
                          </InputP>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>CC020</InputSNIS>
                        </td>
                        <td>
                          <InputGG>
                            Há empresas especializadas (caçambeiros) que prestam
                            serviço de coleta de RCC?{" "}
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CC020")}
                              defaultValue={dadosResiduos?.cc020}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cc020}</option>
                              <option value="Sim">Sim</option>
                              <option value="Nao">Não</option>
                            </select>
                          </InputP>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>CC017</InputSNIS>
                        </td>
                        <td>
                          <InputGG>
                            Há agentes autônomos que prestam serviço de coleta
                            de RCC utilizando-se de caminhões do tipo basculante
                            ou carroceria?
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CC017")}
                              defaultValue={dadosResiduos?.cc017}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cc017}</option>
                              <option value="Sim">Sim</option>
                              <option value="Nao">Não</option>
                            </select>
                          </InputP>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>CC018</InputSNIS>
                        </td>
                        <td>
                          <InputGG>
                            Há agentes autônomos que prestam serviço de coleta
                            de RCC utilizando-se da carroça com, tração animal
                            ou outro tipo de veículo com pequena capacidade
                            volumétrica?{" "}
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CC018")}
                              defaultValue={dadosResiduos?.cc018}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cc018}</option>
                              <option value="Sim">Sim</option>
                              <option value="Nao">Não</option>
                            </select>
                          </InputP>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>CC013</InputSNIS>
                        </td>
                        <td>
                          <InputGG>
                            Quantidade de RCC coletados pela Prefeitura ou
                            empresa contratada por ela{" "}
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("CC013")}
                              type="text"
                              defaultValue={dadosResiduos?.cc013}
                              onChange={handleOnChange}
                            ></input>
                          </InputP>
                        </td>
                        <td>Toneladas</td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>CC014</InputSNIS>
                        </td>
                        <td>
                          <InputGG>
                            Quantidade de RCC coletados por empresas
                            especializadas (caçambeiros) ou autônomos
                            contratados pelo gerados{" "}
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("CC014")}
                              type="text"
                              defaultValue={dadosResiduos?.cc014}
                              onChange={handleOnChange}
                            ></input>
                          </InputP>
                        </td>
                        <td>Toneladas</td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>CC015</InputSNIS>
                        </td>
                        <td>
                          <InputGG>
                            Quantidade total de RCC coletados pelo próprio
                            gerados{" "}
                          </InputGG>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("CC015")}
                              type="text"
                              defaultValue={dadosResiduos?.cc015}
                              onChange={handleOnChange}
                              disabled
                            ></input>
                          </InputP>
                        </td>
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
                    <textarea
                      {...registerExternal("CC099")}
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
                        <th>
                          <b>Código SNIS</b>
                        </th>
                        <th>
                          <b>Descrição</b>
                        </th>
                        <th>Ano {dadosResiduos?.ano}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <InputSNIS>VA010</InputSNIS>
                        </td>
                        <td>Extensão de sarjetas varridas pela Prefeitura</td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("VA010")}
                              type="text"
                              defaultValue={dadosResiduos?.va010}
                              onChange={handleOnChange}
                            ></input>
                          </InputP>
                        </td>
                        <td>Km</td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>VA011</InputSNIS>
                        </td>
                        <td>
                          Extensão de sarjetas varridas por empresas contratadas
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("VA011")}
                              type="text"
                              defaultValue={dadosResiduos?.va011}
                              onChange={handleOnChange}
                            ></input>
                          </InputP>
                        </td>
                        <td>Km</td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>VA039</InputSNIS>
                        </td>
                        <td>
                          Extensão total de sarjetas varridas pelos executores
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("VA039")}
                              disabled={true}
                              type="text"
                              defaultValue={dadosResiduos?.va039}
                              onChange={handleOnChange}
                            ></input>
                          </InputP>
                        </td>
                        <td>Km</td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>VA016</InputSNIS>
                        </td>
                        <td>
                          Há algum tipo de varrição mecanizada no município?{" "}
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("VA016")}
                              defaultValue={dadosResiduos?.va016}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.va016}</option>
                              <option value="Sim">Sim</option>
                              <option value="Nao">Não</option>
                            </select>
                          </InputP>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>VA020</InputSNIS>
                        </td>
                        <td>
                          Valor contratual (preço unitário) do serviço de
                          varrição manual.
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("VA020")}
                              type="text"
                              defaultValue={dadosResiduos?.va020}
                              onChange={handleOnChange}
                            ></input>
                          </InputP>
                        </td>
                        <td>R$/Km</td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>
              </ModalStepContent>

              <ModalStepContent active={currentStep === 9}>
                <DivFormConteudo>
                  <DivTitulo>
                    <DivTituloConteudo>
                      Serviços de capina e roçada
                    </DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <thead>
                      <tr>
                        <th>Código SNIS</th>
                        <th>Descrição</th>
                        <th>Ano {anoSelected}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>CP001</td>
                        <td>Existe o serviço de capina e roçada? </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CP001")}
                              defaultValue={dadosResiduos?.cp001}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cp001}</option>
                              <option value="Sim">Sim</option>
                              <option value="Nao">Não</option>
                            </select>
                          </InputP>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>CP002</InputSNIS>
                        </td>
                        <td>Capina manual</td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CP002")}
                              defaultValue={dadosResiduos?.cp002}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cp002}</option>
                              <option value="Sim">Sim</option>
                              <option value="Nao">Não</option>
                            </select>
                          </InputP>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>CP003</InputSNIS>
                        </td>
                        <td>Capina mecanizada </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CP003")}
                              defaultValue={dadosResiduos?.cp003}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cp003}</option>
                              <option value="Sim">Sim</option>
                              <option value="Nao">Não</option>
                            </select>
                          </InputP>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>CP004</InputSNIS>
                        </td>
                        <td>Capina química </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CP004")}
                              defaultValue={dadosResiduos?.cp004}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.cp004}</option>
                              <option value="Sim">Sim</option>
                              <option value="Nao">Não</option>
                            </select>
                          </InputP>
                        </td>
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
                    <textarea
                      {...registerExternal("CP099")}
                      defaultValue={dadosResiduos?.cp099}
                      onChange={handleOnChange}
                    />
                  </InputGG>
                </DivFormConteudo>
              </ModalStepContent>

              <ModalStepContent active={currentStep === 10}>
                <DivFormConteudo>
                  <DivTitulo>
                    <DivTituloConteudo>Outros serviços</DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <thead>
                      <tr>
                        <th>
                          <span>
                            <b>Descrição</b>
                          </span>
                        </th>
                        <th></th>
                        <th>
                          <InputP>
                            <span>
                              Executor do serviço (Ano {dadosResiduos?.ano})
                            </span>
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
                          <InputG>Execução de lavação de vias e praças</InputG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS001")}
                              defaultValue={dadosResiduos?.os001}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os001}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS012")}
                              defaultValue={dadosResiduos?.os012}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os012}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS023")}
                              defaultValue={dadosResiduos?.os023}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os023}</option>
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
                            <select
                              {...registerExternal("OS003")}
                              defaultValue={dadosResiduos?.os003}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os003}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS014")}
                              defaultValue={dadosResiduos?.os014}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os014}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS025")}
                              defaultValue={dadosResiduos?.os025}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os025}</option>
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
                          <InputG>Execução de limpeza de praias</InputG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS004")}
                              defaultValue={dadosResiduos?.os004}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os004}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS015")}
                              defaultValue={dadosResiduos?.os015}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os015}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS026")}
                              defaultValue={dadosResiduos?.os026}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os026}</option>
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
                          <InputG>Execução de limpeza de bocas-de-lobo</InputG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS005")}
                              defaultValue={dadosResiduos?.os005}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os005}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS016")}
                              defaultValue={dadosResiduos?.os016}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os016}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS027")}
                              defaultValue={dadosResiduos?.os027}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os027}</option>
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
                          <InputG>Execução de pintura de meios-fios</InputG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS006")}
                              defaultValue={dadosResiduos?.os006}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os006}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS017")}
                              defaultValue={dadosResiduos?.os017}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os017}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS028")}
                              defaultValue={dadosResiduos?.os028}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os028}</option>
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
                          <InputG>Execução de limpeza de lotes vagos</InputG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS007")}
                              defaultValue={dadosResiduos?.os007}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os007}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS018")}
                              defaultValue={dadosResiduos?.os018}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os018}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS029")}
                              defaultValue={dadosResiduos?.os029}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os029}</option>
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
                            Execução de remoção de animais mortos de vias
                            públicas
                          </InputG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS008")}
                              defaultValue={dadosResiduos?.os008}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os008}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS019")}
                              defaultValue={dadosResiduos?.os019}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os019}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS030")}
                              defaultValue={dadosResiduos?.os030}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os030}</option>
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
                            <select
                              {...registerExternal("OS009")}
                              defaultValue={dadosResiduos?.os009}
                              onChange={handleOnChange}
                            >
                              {" "}
                              <option>{dadosResiduos?.os009}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS020")}
                              defaultValue={dadosResiduos?.os020}
                              onChange={handleOnChange}
                            >
                              {" "}
                              <option>{dadosResiduos?.os020}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS031")}
                              defaultValue={dadosResiduos?.os031}
                              onChange={handleOnChange}
                            >
                              {" "}
                              <option>{dadosResiduos?.os031}</option>
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
                            <select
                              {...registerExternal("OS010")}
                              defaultValue={dadosResiduos?.os010}
                              onChange={handleOnChange}
                            >
                              {" "}
                              <option>{dadosResiduos?.os010}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS021")}
                              defaultValue={dadosResiduos?.os021}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os021}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS032")}
                              defaultValue={dadosResiduos?.os032}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os032}</option>
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
                            <select
                              {...registerExternal("OS011")}
                              defaultValue={dadosResiduos?.os011}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os011}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS022")}
                              defaultValue={dadosResiduos?.os022}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os022}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS033")}
                              defaultValue={dadosResiduos?.os033}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os033}</option>
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
                          <InputG>Execução de poda de árvores</InputG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS040")}
                              defaultValue={dadosResiduos?.os040}
                              onChange={handleOnChange}
                            >
                              {" "}
                              <option>{dadosResiduos?.os040}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS041")}
                              defaultValue={dadosResiduos?.os041}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os041}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS042")}
                              defaultValue={dadosResiduos?.os042}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os042}</option>
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
                            Execução de outros serviços diferentes dos citados
                            acima
                          </InputG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS043")}
                              defaultValue={dadosResiduos?.os043}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os043}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS044")}
                              defaultValue={dadosResiduos?.os044}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os044}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS045")}
                              defaultValue={dadosResiduos?.os045}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os045}</option>
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
                            Execução de coleta diferenciada de lâmpadas
                            fluorecentes
                          </InputG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS047")}
                              defaultValue={dadosResiduos?.os047}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os047}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS048")}
                              defaultValue={dadosResiduos?.os048}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os048}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS049")}
                              defaultValue={dadosResiduos?.os030}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os030}</option>
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
                            Execução de coleta diferenciada de resíduos
                            eletrônicos
                          </InputG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS050")}
                              defaultValue={dadosResiduos?.os050}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os050}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS051")}
                              defaultValue={dadosResiduos?.os051}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os051}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("OS052")}
                              defaultValue={dadosResiduos?.os052}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.os052}</option>
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

              <ModalStepContent active={currentStep === 11}>
                <DivFormConteudo>
                  <DivTitulo>
                    <DivTituloConteudo>Catadores</DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <thead>
                      <tr>
                        <th>
                          <b>Código SNIS</b>
                        </th>
                        <th>
                          <b>Descrição</b>
                        </th>
                        <th>Ano {dadosResiduos?.ano}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <InputSNIS>CA004</InputSNIS>
                        </td>
                        <td>
                          <InputG>
                            Existem catadores de materiais recicláveis que
                            trabalham dispersos na cidade?{" "}
                          </InputG>
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CA004")}
                              defaultValue={dadosResiduos?.ca004}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.ca004}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>CA008</InputSNIS>
                        </td>
                        <td>
                          Existem algum trabalho social por parte da Prefeitura
                          direcionado aos catadores?{" "}
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CA008")}
                              defaultValue={dadosResiduos?.ca008}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.ca008}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <InputSNIS>CA009</InputSNIS>
                        </td>
                        <td>
                          <InputG>
                            <b>Descrição</b> sucinta dos trabalhos (por exemplo:
                            bolsa-escola para filhos, programa de alfabetização,
                            etc...)
                          </InputG>
                        </td>
                        <td>
                          <textarea
                            {...registerExternal("CA009")}
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
                        <td>
                          <InputSNIS>CA006</InputSNIS>
                        </td>
                        <td>
                          <InputG>
                            Quantidade de entidades associativas(cooperativas ou
                            associações){" "}
                          </InputG>
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("CA006")}
                              type="text"
                              defaultValue={dadosResiduos?.ca006}
                              onChange={handleOnChange}
                            ></input>
                          </InputP>
                        </td>
                        <td>Entidades</td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>CA007</InputSNIS>
                        </td>
                        <td>
                          Quantidade de associados às entidades Associativas
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...registerExternal("CA007")}
                              type="text"
                              defaultValue={dadosResiduos?.ca007}
                              onChange={handleOnChange}
                            ></input>
                          </InputP>
                        </td>
                        <td>Catador</td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>CA005</InputSNIS>
                        </td>
                        <td>
                          Os catadores estão organizadaos em cooperativa ou
                          associação?
                        </td>
                        <td>
                          <InputP>
                            <select
                              {...registerExternal("CA005")}
                              defaultValue={dadosResiduos?.ca005}
                              onChange={handleOnChange}
                            >
                              <option>{dadosResiduos?.ca005}</option>
                              <option value={"Sim"}>Sim</option>
                              <option value={"Não"}>Não</option>
                            </select>
                          </InputP>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <InputM></InputM>
                        </td>
                        <td>
                          <InputG>
                            Adicionar nome e silga conhecida da Cooperativa ou
                            Associação
                          </InputG>
                        </td>
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
                          <th style={{ textAlign: "center" }}>
                            numero de associados
                          </th>
                          <th style={{ textAlign: "center" }}>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cooperativas?.map((coop, key) => (
                          <>
                            <tr key={key}>
                              <td>{coop.nome_associacao}</td>
                              <td style={{ textAlign: "center" }}>
                                {coop.numero_associados}
                              </td>
                              <td>
                                <Actions>
                                  <span>
                                    <Image
                                      title="Editar"
                                      width={30}
                                      height={30}
                                      src={Editar}
                                      alt=""
                                    />
                                  </span>
                                  <span>
                                    <Image
                                      onClick={() =>
                                        handleDeleteCoopCat(
                                          coop.id_cooperativa_associacao_catadores
                                        )
                                      }
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
                          </>
                        ))}
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
              {currentStep === 11 && isEditor && (
                <SubmitButton type="submit">Gravar</SubmitButton>
              )}
            </ModalStepperNavigation>
          </ModalStepperContainer>
        </Form>
      </DivCenter>

      {modalCO020 && (
        <ContainerModal>
          <Modal>
            <FormModal onSubmit={handleSubmitRsc(handleCadastroUnidadeRsc)}>
              <ConteudoModal>
                <CloseModalButton
                  onClick={() => {
                    handleCloseModalCO020();
                  }}
                >
                  <span></span>
                </CloseModalButton>
                {isEditor && (
                  <SubmitButtonModal type="submit">Gravar</SubmitButtonModal>
                )}
                <table>
                  <tr>
                    <th>Município</th>
                    <th>Tipo de unidade</th>
                    <th>Nome da unidade</th>
                    <th>Operador da unidade</th>
                    <th>CNPJ da unidade</th>
                    <th>Quant. resíduos exportados</th>
                  </tr>
                  <tr>
                    <td>
                      <InputP>
                        <select
                          style={{
                            padding: 10,
                            borderRadius: 5,
                            border: "1px solid #ccc",
                          }}
                          onChange={(e) => setMunicipioUnidade(e.target.value)}
                        >
                          <option value={null}>Selecionar</option>
                          {municipios?.map((municipio, key) => (
                            <option value={municipio?.id_municipio}>
                              {municipio?.nome}
                            </option>
                          ))}
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select
                          style={{
                            padding: 15,
                            borderRadius: 5,
                            border: "1px solid #ccc",
                          }}
                          disabled={municipioUnidade ? false : true}
                          {...registerRsc("tipo_unidade")}
                          onChange={(e) =>
                            getUnidadesProcessamento(e.target.value)
                          }
                        >
                          <option value="">Selecione</option>
                          <option>Lixão</option>
                          <option>Queima em forno de qualquer tipo</option>
                          <option>
                            Unidade de manejo de galhadas e podas{" "}
                          </option>
                          <option>Unidade de transbordo </option>
                          <option>
                            Área de reciclagem de RCC (unidade de reciclagem de
                            entulho){" "}
                          </option>
                          <option>
                            Aterro de resíduos da construção civil (inertes)
                          </option>
                          <option>
                            Área de transbordo e triagem de RCC e volumosos
                            (ATT)
                          </option>
                          <option>Aterro controlado </option>
                          <option>Aterro sanitário </option>
                          <option>Vala específica de RSS</option>
                          <option>Unidade de triagem (galpão ou usina)</option>
                          <option>
                            Unidade de compostagem (pátio ou usina){" "}
                          </option>
                          <option>Unidade de tratamento por incineração</option>
                          <option>
                            Unidade de tratamento por microondas ou autoclave{" "}
                          </option>
                          <option>Outra</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select
                          style={{
                            padding: 15,
                            borderRadius: 5,
                            border: "1px solid #ccc",
                          }}
                          disabled={unidadesProcessamento ? false : true}
                          {...registerRsc("nome_unidade")}
                          onChange={(e) => getUP(e.target.value)}
                        >
                          <option>Selecionar</option>
                          {unidadesProcessamento?.map((unidade) => (
                            <option value={unidade.id_unidade_processamento}>
                              {unidade.nome_unidade_processamento}
                            </option>
                          ))}
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <input
                          disabled={true}
                          {...registerRsc("UP004")}
                          type="text"
                          defaultValue={unidadeP?.up004}
                        ></input>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <input
                          disabled={true}
                          {...registerRsc("cnpj_unidade")}
                          type="text"
                          defaultValue={unidadeP?.cnpj}
                        ></input>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <input
                          disabled={unidadesProcessamento ? false : true}
                          {...registerRsc("quant_residuos_exportados")}
                          type="text"
                        ></input>
                      </InputP>
                    </td>
                  </tr>
                </table>
              </ConteudoModal>
            </FormModal>
          </Modal>
        </ContainerModal>
      )}

      {modalRS031 && (
        <ContainerModal>
          <Modal>
            <FormModal onSubmit={handleSubmitRss(handleCadastroUnidadeRss)}>
              <ConteudoModal>
                <CloseModalButton
                  onClick={() => {
                    handleCloseModalRS031();
                  }}
                >
                  <span></span>
                </CloseModalButton>
                {isEditor && (
                  <SubmitButtonModal type="submit">Gravar</SubmitButtonModal>
                )}
                <table>
                  <tr>
                    <th>Município</th>
                    <th>Tipo de unidade</th>
                    <th>Nome da unidade</th>
                    <th>Operador da unidade</th>
                    <th>CNPJ da unidade</th>
                    <th>Quant. resíduos exportados</th>
                  </tr>
                  <tr>
                    <td>
                      <InputP>
                        <select
                          style={{
                            padding: 15,
                            borderRadius: 5,
                            border: "1px solid #ccc",
                          }}
                          onChange={(e) => setMunicipioUnidade(e.target.value)}
                        >
                          <option value={null}>Selecionar</option>
                          {municipios?.map((municipio, key) => (
                            <option value={municipio?.id_municipio}>
                              {municipio?.nome}
                            </option>
                          ))}
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select
                          style={{
                            padding: 15,
                            borderRadius: 5,
                            border: "1px solid #ccc",
                          }}
                          disabled={municipioUnidade ? false : true}
                          {...registerRss("tipo_unidade")}
                          onChange={(e) =>
                            getUnidadesProcessamento(e.target.value)
                          }
                        >
                          <option value="">Selecione</option>
                          <option>Lixão</option>
                          <option>Queima em forno de qualquer tipo</option>
                          <option>
                            Unidade de manejo de galhadas e podas{" "}
                          </option>
                          <option>Unidade de transbordo </option>
                          <option>
                            Área de reciclagem de RCC (unidade de reciclagem de
                            entulho){" "}
                          </option>
                          <option>
                            Aterro de resíduos da construção civil (inertes)
                          </option>
                          <option>
                            Área de transbordo e triagem de RCC e volumosos
                            (ATT)
                          </option>
                          <option>Aterro controlado </option>
                          <option>Aterro sanitário </option>
                          <option>Vala específica de RSS</option>
                          <option>Unidade de triagem (galpão ou usina)</option>
                          <option>
                            Unidade de compostagem (pátio ou usina){" "}
                          </option>
                          <option>Unidade de tratamento por incineração</option>
                          <option>
                            Unidade de tratamento por microondas ou autoclave{" "}
                          </option>
                          <option>Outra</option>
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <select
                          style={{
                            padding: 15,
                            borderRadius: 5,
                            border: "1px solid #ccc",
                          }}
                          disabled={unidadesProcessamento ? false : true}
                          {...registerRss("nome_unidade")}
                          onChange={(e) => getUP(e.target.value)}
                        >
                          <option>Selecionar</option>
                          {unidadesProcessamento?.map((unidade) => (
                            <option value={unidade.id_unidade_processamento}>
                              {unidade.nome_unidade_processamento}
                            </option>
                          ))}
                        </select>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <input
                          disabled={true}
                          {...registerRss("UP004")}
                          type="text"
                          defaultValue={unidadeP?.up004}
                        ></input>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <input
                          disabled={true}
                          {...registerRss("cnpj_unidade")}
                          type="text"
                          defaultValue={unidadeP?.cnpj}
                        ></input>
                      </InputP>
                    </td>
                    <td>
                      <InputP>
                        <input
                          disabled={unidadesProcessamento ? false : true}
                          {...registerRss("quant_residuos_exportados")}
                          type="text"
                        ></input>
                      </InputP>
                    </td>
                  </tr>
                </table>
              </ConteudoModal>
            </FormModal>
          </Modal>
        </ContainerModal>
      )}

      {modalAssCatadores && (
        <ContainerModal>
          <Modal>
            <FormModal onSubmit={handleSubmitRss(handleCadastroCAC)}>
              <ConteudoModal>
                <CloseModalButton
                  onClick={() => {
                    handleCloseAssCatadores();
                  }}
                >
                  <span></span>
                </CloseModalButton>
                {isEditor && (
                  <SubmitButtonModal type="submit">Gravar</SubmitButtonModal>
                )}
                <TabelaModal>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          Nome e sigla conhecida da Cooperativa ou Associação
                        </td>
                        <td>Numero de catadores</td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            style={{
                              padding: 10,
                              borderRadius: 5,
                              border: "1px solid #ccc",
                              fontSize: 16,
                            }}
                            {...registerRss("nome_associacao")}
                            type="text"
                          ></input>
                        </td>
                        <td>
                          <InputP>
                            <input
                              style={{
                                padding: 10,
                                borderRadius: 5,
                                border: "1px solid #ccc",
                              }}
                              {...registerRss("numero_associados")}
                              type="text"
                            ></input>
                          </InputP>
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
