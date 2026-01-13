import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { BreadCrumbStyle } from "../../styles/indicadores";
import {
  Container,
  DivCenter,
  DivForm,
  Sidebar,
  DivTituloForm,
  DivInput,
  Form,
  InputP,
  InputM,
  InputG,
  SubmitButton,
  SubmitButtonContainer,
  DivEixo,
  TextArea,
  DivTextArea,
  MenuMunicipio,
  Municipio,
  MenuMunicipioItem,
  ContainerModal,
  Modal,
  ConteudoModal,
  CloseModalButton,
  SubmitButtonModal,
  Tabela,
  Actions,
  ButtonAdicionarPresidente,
  Tooltip,
  TooltipText,
  ExpandButton,
  CollapseButton,
} from "../../styles/indicadores";
import { FaBars, FaList, FaCaretDown } from "react-icons/fa";
import Link from "next/link";
import Editar from "../../img/editar.png";
import ajuda from "../../img/ajuda.png";
import HeadIndicadores from "../../components/headIndicadores";
import Image from "next/image";
import "suneditor/dist/css/suneditor.min.css";
import { getAPIClient } from "../../services/axios";
import MenuIndicadores from "../../components/MenuIndicadoresCadastro";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import RepresentanteGestaoAssociada from "../../components/RepresentanteGestaoAssociada";
// import { FormModal } from "../../styles/dashboard";
import Excluir from "../../img/excluir.png";
import Pdf from "../../img/pdf.png";
import {
  faPlus,
  faCoffee,
  faRadiation,
} from "@fortawesome/free-solid-svg-icons";
import api from "../../services/api";
import MenuHorizontal from "../../components/MenuHorizontal";
import { FaFilePdf } from "react-icons/fa";
import styled from "styled-components";
import {
  capitalizeFrasal,
  onlyLettersAndCharacters,
  toTitleCase,
} from "@/util/util";
import {
  DivFormCadastro,
  MainContent,
  SidebarItem,
} from "@/styles/esgoto-indicadores";
import { DivTitulo } from "@/styles/drenagem-indicadores";

const InputMask = require("react-input-mask");

// Styled component para container de tabelas lado a lado
const TablesContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  width: 98%;

  @media (max-width: 1200px) {
    flex-direction: column;
    gap: 20px;
  }

  > div {
    flex: 1;
    min-width: 0;
  }
`;

const ModalSubmitButton = styled.button`
  background: #008080;
  color: #fff;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  margin-top: 20px;
  display: block;
  margin-left: auto;
  margin-right: 0;

  &:hover {
    background: #008899;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;
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
interface IGestao {
  id_gestao_associada: string;
  nome_associacao: string;
  norma_associacao: string;

  plano_ano: string;
  plano_titulo: string;

  politica_ano: string;
  politica_titulo: string;

  sr_descricao: string;

  ct_nomes_comunidades: string;
  ct_descricao: string;
  string: string;
}
interface IRepresentantes {
  id_representante_servicos_ga: string;
  cargo: string;
  email: string;
  telefone: string;
  nome: string;
}
interface IConselho {
  id_conselho_municipal_saneamento_basico: number;
  titulo: string;
  ano: string;
  id_arquivo: string;
  id_municipio: Number;
}
interface IPresidencia {
  id_presidencia_conselho_municipal_saneamento_basico: string;
  nome_presidente: string;
  telefone_presidente: string;
  email_presidente: string;
  setor_responsavel: string;
  integrantes: string;
  id_municipio: string;
}
interface IPoliticas {
  id_politica_municipal: string;
  titulo: string;
  ano: string;
  id_arquivo: string;
  file?: string;
  situacao: string;
}
interface IPlanos {
  id_plano_municipal: string;
  titulo: string;
  ano: string;
  id_arquivo: string;
  file?: string;
  situacao?: string;
}
interface IParticipacao {
  id_participacao_controle_social: string;
  titulo: string;
  ano: string;
  id_arquivo: string;
}
interface MunicipioProps {
  municipio: IMunicipio[];
  gestao: IGestao[];
}

export default function GestaoIndicadores({
  municipio,
  gestao,
}: MunicipioProps) {
  const { usuario, signOut } = useContext(AuthContext);
  const [dadosMunicipio, setDadosMunicipio] = useState(null);
  const [dadosGestao, setGestao] = useState<IGestao | any>(gestao);
  const [representantes, setRepresentantes] = useState(null);
  const [conselho, setConselho] = useState([]);
  const [conselhoMunicipal, setConselhoMunicipal] = useState([]);
  const [isClient, setIsClient] = useState(null);
  const [updatePresidente, setUpdatePresidente] = useState(null);
  const [updatePolitica, setUpdatePolitica] = useState<IPoliticas | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [innerWidth, setInnerWidth] = useState(0);

  useEffect(() => {
    // Inicializa innerWidth apenas no cliente
    if (typeof window !== "undefined") {
      setInnerWidth(window.innerWidth);
    }

    const handleResize = () => {
      if (typeof window !== "undefined") {
        const width = window.innerWidth;
        setInnerWidth(width);
        if (width <= 1000) {
          setIsCollapsed(true);
        } else {
          setIsCollapsed(false);
        }
      }
    };
    
    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const [showModalPlano, setShowModalPlano] = useState(false);
  const [updatePlano, setUpdatePlano] = useState<IPlanos | null>(null);

  const {
    register: registerGestao,
    handleSubmit: handleSubmitGestao,
    reset: resetGestao,
    setValue: setValueGestao,
    formState: { errors: errorsGestao },
    control: controlGestao,
  } = useForm();

  const {
    register: registerPolitica,
    handleSubmit: handleSubmitPolitica,
    reset: resetPolitica,
    setValue: setValuePolitica,
    formState: { errors: errorsPolitica },
    control: controlPolitica,
  } = useForm();

  const {
    register: registerPlano,
    handleSubmit: handleSubmitPlano,
    reset: resetPlano,
    setValue: setValuePlano,
    formState: { errors: errorsPlano },
    control: controlPlano,
  } = useForm();

  const {
    register: registerConselho,
    handleSubmit: handleSubmitConselho,
    reset: resetConselho,
    setValue: setValueConselho,
    formState: { errors: errorsConselho },
    control: controlConselho,
  } = useForm();

  const {
    register: registerParticipacao,
    handleSubmit: handleSubmitParticipacao,
    reset: resetParticipacao,
    setValue: setValueParticipacao,
    formState: { errors: errorsParticipacao },
    control: controlParticipacao,
  } = useForm();

  const {
    register: registerSR,
    handleSubmit: handleSubmitSR,
    reset: resetSR,
    setValue: setValueSR,
    formState: { errors: errorsSR },
    control: controlSR,
  } = useForm();

  const {
    register: registerCT,
    handleSubmit: handleSubmitCT,
    reset: resetCT,
    setValue: setValueCT,
    formState: { errors: errorsCT },
    control: controlCT,
  } = useForm();

  const [showModal, setShowModal] = useState(false);
  const [showModalPolitica, setShowModalPolitica] = useState(false);
  const [listParticipacoes, setListParticipacoes] = useState(null);
  const [ShowModalPresidente, setShowModalPresidente] = useState(false);
  const [activeForm, setActiveForm] = useState("gestaoAssociada");
  const [content, setContent] = useState("");
  const [listPoliticas, setPoliticas] = useState<IPoliticas[] | null>(null);
  const [listPlanos, setPlanos] = useState(null);
  const [updateRepresentantes, setUpdateRepresentantes] = useState(null);
  const [politicaSituacao, setPoliticaSituacao] = useState("aprovado"); // Valor padrão
  const [planoSituacao, setPlanoSituacao] = useState("aprovado"); // Valor padrão
  const [conselhoSituacao, setConselhoSituacao] = useState("operante");
  const [showModalParticipacao, setShowModalParticipacao] = useState(false);
  const [updateParticipacao, setUpdateParticipacao] =
    useState<IParticipacao | null>(null);

  const editor = useRef(null);
  let txtArea = useRef();

  useEffect(() => {
    if (usuario?.id_municipio) {
      getMunicipio();
      getPresidentesConselho();
      setIsClient(true);
      getPoliticas();
      getPlanos();
      getParticipacoes();
      getRepresentantes();
      getGestao();
      getConselhoMunicipal();
    }
  }, [usuario]);

  useEffect(() => {
    if (
      listPoliticas &&
      listPoliticas.length > 0 &&
      listPoliticas[0]?.situacao
    ) {
      setPoliticaSituacao(listPoliticas[0].situacao);
    }
  }, [listPoliticas]);

  useEffect(() => {
    if (listPlanos && listPlanos.length > 0 && listPlanos[0]?.situacao) {
      setPlanoSituacao(listPlanos[0].situacao);
    }
  }, [listPlanos]);

  useEffect(() => {
    if (conselho && conselho.length > 0 && conselho[0]?.situacao) {
      setConselhoSituacao(conselho[0].situacao);
    }
  }, [conselho]);

  function handlePoliticaSituacaoChange(situacao) {
    setPoliticaSituacao(situacao);

    if (situacao === "nao_tem") {
      setValue("politica_titulo", "");
      setValue("politica_ano", "");
    }
  }
  function handlePlanoSituacaoChange(situacao) {
    setPlanoSituacao(situacao);

    if (situacao === "nao_tem") {
      setValue("plano_titulo", "");
      setValue("plano_ano", "");
    }
  }

  function handleConselhoSituacaoChange(situacao) {
    setConselhoSituacao(situacao);

    if (situacao === "nao_tem") {
      setValue("conselho_titulo", "");
      setValue("conselho_ano", "");
      setValue("conselho_arquivo", null);
    }
  }

  // ------------- Funções GET -------------

  async function getMunicipio() {
    const res = await api
      .get("getMunicipio", {
        params: { id_municipio: usuario.id_municipio },
      })
      .then((response) => {
        setDadosMunicipio(response.data[0]);
      });
  }
  async function getPoliticas() {
    const resPoliticas = await api.get("getPoliticas", {
      params: { id_municipio: usuario?.id_municipio },
    });
    const politicas = await resPoliticas.data;
    if (politicas) {
      const resPoliticas = await Promise.all(
        politicas.map(async (p) => {
          const file = await api
            .get("getFile", {
              params: { id: p.id_arquivo },
              responseType: "blob",
            })
            .then((response) => {
              return URL.createObjectURL(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
          const pf = {
            ...p,
            file,
          };
          return pf;
        })
      );
      setPoliticas(resPoliticas);
    }
  }
  async function getConselhoMunicipal() {
    try {
      const res = await api.get(
        `get-conselhos-municipais/${usuario?.id_municipio}`,
        {
          params: { id_municipio: usuario?.id_municipio },
        }
      );
      const conselhos = res.data;
      if (conselhos && Array.isArray(conselhos) && conselhos.length > 0) {
        const resConselhoMunicipal = await Promise.all(
          conselhos.map(async (p) => {
            let file = null;
            if (p.id_arquivo) {
              try {
                const fileResponse = await api.get("getFile", {
                  params: { id: p.id_arquivo },
                  responseType: "blob",
                });
                file = URL.createObjectURL(fileResponse.data);
              } catch (error) {
                console.log("Erro ao buscar arquivo:", error);
              }
            }
            return { ...p, file };
          })
        );
        setConselhoMunicipal(resConselhoMunicipal);
      } else {
        setConselhoMunicipal([]);
      }
    } catch (error) {
      console.log("Erro ao buscar conselhos municipais:", error);
      setConselhoMunicipal([]);
    }
  }
  async function getPlanos() {
    const resPlanos = await api.get("getPlanos", {
      params: { id_municipio: usuario?.id_municipio },
    });
    const planos = await resPlanos.data;
    if (planos) {
      const resPlanos = await Promise.all(
        planos.map(async (p) => {
          const file = await api
            .get("getFile", {
              params: { id: p.id_arquivo },
              responseType: "blob",
            })
            .then((response) => {
              return URL.createObjectURL(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
          const pf = {
            ...p,
            file,
          };
          return pf;
        })
      );
      setPlanos(resPlanos);
    }
  }
  async function getParticipacoes() {
    const resParticipacao = await api.get("getParticipacaoControleSocial", {
      params: { id_municipio: usuario?.id_municipio },
    });
    const participacoes = await resParticipacao.data;
    if (participacoes) {
      const resParticipacoes = await Promise.all(
        participacoes.map(async (p) => {
          const file = await api
            .get("/getFile", {
              params: { id: p.id_arquivo },
              responseType: "blob",
            })
            .then((response) => {
              return URL.createObjectURL(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
          const pf = {
            ...p,
            file,
          };
          return pf;
        })
      );
      setListParticipacoes(resParticipacoes);
    }
  }
  async function getRepresentantes() {
    const resRepresentantes = await api.get("getRepresentantesServicos", {
      params: { id_municipio: usuario?.id_municipio },
    });
    const representantes = await resRepresentantes.data;

    setRepresentantes(representantes);
  }
  async function getGestao() {
    const resGestao = await api.get("/getGestao", {
      params: { id_municipio: usuario?.id_municipio },
    });

    setGestao(resGestao.data[0]);
  }
  async function getPresidentesConselho() {
    if (!usuario?.id_municipio) {
      setConselho([]);
      return;
    }
    try {
      const resPresidentes = await api.get(
        `get-all-presidencia-conselho-municipal/${usuario.id_municipio}`
      );
      const presidentes = resPresidentes.data;
      if (presidentes && Array.isArray(presidentes) && presidentes.length > 0) {
        setConselho(presidentes);
      } else {
        setConselho([]);
      }
    } catch (error) {
      console.log("Erro ao buscar presidentes do conselho:", error);
      toast.error("Erro ao buscar presidentes do conselho!", {
        position: "top-right",
        autoClose: 5000,
      });
      setConselho([]);
    }
  }

  // ------------- Funções ADD -------------

  async function handleAddPresidente(data) {
    if (!usuario.id_municipio) {
      toast.error("Não existe Município, entre novamente no sistema! ", {
        position: "top-right",
        autoClose: 5000,
      });
      signOut();
    }

    const id = await api
      .post("create-presidencia-conselho-municipal", {
        nome_presidente: data.nome_presidente,
        setor_responsavel: data.setor_responsavel,
        telefone_presidente: data.telefone_presidente,
        email_presidente: data.email_presidente,
        integrantes: data.integrantes,
        id_municipio: usuario.id_municipio,
        id_conselho_municipal_saneamento_basico:
          data.id_conselho_municipal_saneamento_basico || null,
      })
      .then((response) => {
        toast.success(
          "Presidência do Conselho Municipal adicionada com sucesso",
          {
            position: "top-right",
            autoClose: 7000,
          }
        );
        setShowModalPresidente(false);
        reset();
        return response;
      })
      .catch((error) => {
        toast.error("Erro ao adicionar a Presidência do Conselho Municipal", {
          position: "top-right",
          autoClose: 5000,
        });
      });
    getPresidentesConselho();
  }
  async function handleAddGestaoAssociada(data) {
    if (usuario?.id_permissao === 4) return;

    const formData = new FormData();
    formData.append("id_municipio", usuario.id_municipio);
    formData.append("nome_associacao", data.nome_associacao || "");
    formData.append("norma_associacao", data.norma_associacao || "");

    await api
      .post("addGestaoIndicadores", formData)
      .then(() => {
        toast.success("Gestão Associada cadastrada com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
        resetGestao();
        getGestao();
        getRepresentantes();
      })
      .catch(() => {
        toast.error("Erro ao cadastrar Gestão Associada!", {
          position: "top-right",
          autoClose: 5000,
        });
      });

    console.log("Dados enviados:", data);
  }
  async function handleAddConselhoMunicipal(data) {
    if (!usuario.id_municipio) {
      toast.error("Não existe Município, entre novamente no sistema!", {
        position: "top-right",
        autoClose: 5000,
      });
      signOut();
      return;
    }

    const formData = new FormData();
    formData.append("titulo", data.titulo || "");
    formData.append("ano", data.ano || "");
    formData.append("id_municipio", usuario.id_municipio);
    formData.append("situacao", conselhoSituacao || "operante");
    if (data.arquivo && data.arquivo.length > 0 && data.arquivo[0]) {
      formData.append("arquivo", data.arquivo[0]);
    }

    await api
      .post("create-conselho-municipal", formData)
      .then(() => {
        toast.success("Conselho Municipal cadastrado com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
        getConselhoMunicipal();
        // Reset dos campos do conselho
        setValue("conselho_titulo", "");
        setValue("conselho_ano", "");
        setValue("conselho_arquivo", null);
        if (resetConselho) {
          resetConselho();
        }
      })
      .catch((error) => {
        console.error("Erro ao cadastrar conselho:", error);
        const errorMessage = error.response?.data?.message || "Erro ao cadastrar o Conselho Municipal!";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
        });
      });
  }
  async function handleAddPolitica(data) {
    if (usuario?.id_permissao === 4) return;

    const formData = new FormData();
    formData.append("id_municipio", usuario.id_municipio);
    formData.append("politica_titulo", data.politica_titulo || "");
    formData.append("politica_ano", data.politica_ano || "");
    formData.append("politica_arquivo", data.politica_arquivo[0] || "");

    await api
      .post("addGestaoIndicadores", formData)
      .then(() => {
        toast.success(
          "Política Municipal de Saneamento cadastrada com sucesso!",
          {
            position: "top-right",
            autoClose: 7000,
          }
        );
        resetPolitica();
        getPoliticas();
      })
      .catch(() => {
        toast.error("Erro ao cadastrar Política Municipal de Saneamento!", {
          position: "top-right",
          autoClose: 5000,
        });
      });

    console.log("Dados enviados:", data);
  }
  async function handleAddRepresentante(data) {
    if (!usuario.id_municipio) {
      toast.error("Não existe Município, entre novamente no sistema! ", {
        position: "top-right",
        autoClose: 5000,
      });
      signOut();
    }

    const id = await api
      .post("addRepresentanteServicos", {
        ga_cargo: data.ga_cargo,
        ga_email: data.ga_email,
        ga_nome_representante: data.ga_nome_representante,
        ga_telefone: data.ga_telefone,
        id_municipio: usuario.id_municipio,
      })
      .then((response) => {
        toast.success("Representante cadastrado com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
        setShowModal(false);
        return response;
      })
      .catch((error) => {
        toast.error("Não foi possivel cadastrar o representante! ", {
          position: "top-right",
          autoClose: 5000,
        });
      });
    getRepresentantes();
  }
  async function handleAddPlano(data) {
    if (usuario?.id_permissao === 4) return;

    const formData = new FormData();
    formData.append("id_municipio", usuario.id_municipio);
    formData.append("plano_titulo", data.plano_titulo || "");
    formData.append("plano_ano", data.plano_ano || "");
    formData.append("plano_arquivo", data.plano_arquivo[0] || "");

    await api
      .post("addGestaoIndicadores", formData)
      .then(() => {
        toast.success("Plano Municipal de Saneamento cadastrada com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
        resetPlano();
        getPlanos();
      })
      .catch(() => {
        toast.error("Erro ao cadastrar Plano Municipal de Saneamento!", {
          position: "top-right",
          autoClose: 5000,
        });
      });

    console.log("Dados enviados:", data);
  }
  async function handleAddParticipacao(data) {
    if (usuario?.id_permissao === 4) return;

    const formData = new FormData();
    formData.append("id_municipio", usuario.id_municipio);
    formData.append("pcs_titulo", data.pcs_titulo || "");
    formData.append("pcs_ano", data.pcs_ano || "");
    formData.append("pcs_arquivo", data.pcs_arquivo[0] || "");

    await api
      .post("addGestaoIndicadores", formData)
      .then(() => {
        toast.success(
          "Participação e Controle Social de Saneamento cadastrado com sucesso!",
          {
            position: "top-right",
            autoClose: 7000,
          }
        );
        resetParticipacao();
        getParticipacoes();
      })
      .catch(() => {
        toast.error("Erro ao cadastrar Participação e Controle Social!", {
          position: "top-right",
          autoClose: 5000,
        });
      });

    console.log("Dados enviados:", data);
  }
  async function handleAddSaneamentoRural(data) {
    if (usuario?.id_permissao === 4) return;

    const formData = new FormData();

    formData.append("sr_descricao", data.sr_descricao || "");
    formData.append("id_municipio", usuario.id_municipio);

    await api
      .post("addGestaoIndicadores", formData)
      .then(() => {
        toast.success("Descrição Saneamento Rural cadastrada com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
        resetSR();
        // getSR();
      })
      .catch(() => {
        toast.error("Erro ao cadastrar Descrição Saneamento Rural!", {
          position: "top-right",
          autoClose: 5000,
        });
      });

    console.log("Dados enviados:", data);
  }
  async function handleAddComunidadesTradicionais(data) {
    if (usuario?.id_permissao === 4) return;

    const formData = new FormData();

    formData.append("ct_nomes_comunidades", data.ct_nomes_comunidades || "");
    formData.append("ct_descricao", data.ct_descricao || "");
    formData.append("id_municipio", usuario.id_municipio);

    await api
      .post("addGestaoIndicadores", formData)
      .then(() => {
        toast.success("Comunidades Tradicionais cadastrada com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
        resetCT();
        // getCT();
      })
      .catch(() => {
        toast.error("Erro ao cadastrar Comunidades Tradicionais!", {
          position: "top-right",
          autoClose: 5000,
        });
      });

    console.log("Dados enviados:", data);
  }

  // ------------- Funções DELETE -------------

  async function handleRemoverPresidente({ id }) {
    try {
      await api.delete(`delete-presidencia-conselho-municipal/${id}`);
      toast.success("Presidente removido com sucesso!", {
        position: "top-right",
        autoClose: 5000,
      });
      getPresidentesConselho();
    } catch (error) {
      toast.error("Não foi possível remover o presidente!", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }
  async function handleRemoverParticipacao({ id, id_arquivo }) {
    await api
      .delete("remover-participacao", {
        params: { id: id, id_arquivo: id_arquivo },
      })
      .then((response) => {
        toast.success("Participacão removido com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
      })
      .catch((error) => {
        toast.error("Não foi possivel remover a participação! ", {
          position: "top-right",
          autoClose: 5000,
        });
      });
    getParticipacoes();
  }
  async function handleRemoverPolitica({ id, id_arquivo }) {
    await api
      .delete("remover-politica", {
        params: { id: id, id_arquivo: id_arquivo },
      })
      .then((response) => {
        toast.success("Política removida com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
      })
      .catch((error) => {
        toast.error("Não foi possivel remover a politica municipal! ", {
          position: "top-right",
          autoClose: 5000,
        });
      });
    getPoliticas();
  }
  async function handleRemoverPlano({ id, id_arquivo }) {
    await api
      .delete("remover-plano", {
        params: { id: id, id_arquivo: id_arquivo },
      })
      .then((response) => {
        toast.success("Plano removido com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
      })
      .catch((error) => {
        toast.error("Não foi possivel remover o plano municipal! ", {
          position: "top-right",
          autoClose: 5000,
        });
      });
    getPlanos();
  }
  async function handleRemoverRepresentante({ id }) {
    await api
      .delete("remover-representante", {
        params: { id: id },
      })
      .then((response) => {
        toast.success("Representante removido com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
      })
      .catch((error) => {
        toast.error("Não foi possivel remover o representante!", {
          position: "top-right",
          autoClose: 5000,
        });
      });
    getRepresentantes();
  }
  async function handleRemoverConselho({ id }) {
    await api
      .delete(`delete-conselho-municipal/${id}`)
      .then((response) => {
        toast.success("Conselho Municipal removido com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
      })
      .catch((error) => {
        toast.error("Não foi possivel remover o conselho municipal! ", {
          position: "top-right",
          autoClose: 5000,
        });
      });
    getConselhoMunicipal();
  }

  // ------------- Funções UPDATE -------------

  // ------------------------------------------

  async function handleSignOut() {
    signOut();
  }

  function handleShowModalPresidente() {
    setShowModalPresidente(true);
  }
  function handleCloseModalPresidente() {
    setShowModalPresidente(false);
    reset();
  }
  function handleOnChange(content) {
    setContent(content);
  }
  async function handleCadastro(data) {
    if (usuario?.id_permissao === 4) {
      return;
    }

    // Se estiver no formulário de conselho e houver dados para salvar, chama handleAddConselhoMunicipal
    if (activeForm === "conselhoSaneamento" && conselhoSituacao !== "nao_tem") {
      if (data.conselho_titulo && data.conselho_ano) {
        // Prepara os dados no formato esperado por handleAddConselhoMunicipal
        const conselhoData = {
          titulo: data.conselho_titulo,
          ano: data.conselho_ano,
          arquivo: data.conselho_arquivo && data.conselho_arquivo.length > 0 ? data.conselho_arquivo : [],
        };
        await handleAddConselhoMunicipal(conselhoData);
        return; // Retorna para não executar o resto da função
      }
    }

    const formData = new FormData();

    formData.append("id_municipio", usuario.id_municipio);
    formData.append(
      "id_gestao_associada",
      dadosGestao?.id_gestao_associada ? dadosGestao?.id_gestao_associada : ""
    );
    formData.append(
      "id_saneamento_rural",
      dadosGestao?.id_saneamento_rural ? dadosGestao?.id_saneamento_rural : ""
    );
    formData.append(
      "id_comunidades_tradicionais",
      dadosGestao?.id_comunidades_tradicionais
        ? dadosGestao?.id_comunidades_tradicionais
        : ""
    );

    if (listPoliticas && listPoliticas.length > 0) {
      formData.append(
        "id_politica_municipal",
        listPoliticas[0].id_politica_municipal
      );
    }

    if (listPlanos && listPlanos.length > 0) {
      formData.append("id_plano_municipal", listPlanos[0].id_plano_municipal);
    }

    formData.append(
      "nome_associacao",
      data.nome_associacao ? data.nome_associacao : dadosGestao?.ga_nome
    );
    formData.append(
      "norma_associacao",
      data.norma_associacao ? data.norma_associacao : dadosGestao?.ga_norma
    );

    formData.append("pcs_ano", data.pcs_ano);
    formData.append("pcs_arquivo", data.pcs_arquivo[0]);
    formData.append("pcs_titulo", data.pcs_titulo);

    if (planoSituacao !== "nao_tem") {
      formData.append("plano_ano", data.plano_ano);
      if (data.plano_arquivo && data.plano_arquivo[0]) {
        formData.append("plano_arquivo", data.plano_arquivo[0]);
      }
      formData.append("plano_titulo", data.plano_titulo);
    }

    formData.append("plano_situacao", planoSituacao);
    formData.append("plano_ano", data.plano_ano);
    formData.append("plano_arquivo", data.plano_arquivo[0]);
    formData.append("plano_titulo", data.plano_titulo);

    if (politicaSituacao !== "nao_tem") {
      formData.append("politica_ano", data.politica_ano);
      if (data.politica_arquivo && data.politica_arquivo[0]) {
        formData.append("politica_arquivo", data.politica_arquivo[0]);
      }
      formData.append("politica_titulo", data.politica_titulo);
    }

    formData.append("politica_situacao", politicaSituacao);
    if (conselhoSituacao !== "nao_tem") {
      formData.append("conselho_titulo", data.conselho_titulo);
      formData.append("conselho_ano", data.conselho_ano);
      if (data.conselho_arquivo && data.conselho_arquivo[0]) {
        formData.append("conselho_arquivo", data.conselho_arquivo[0]);
      }
    }
    formData.append("conselho_situacao", conselhoSituacao);

    formData.append("politica_ano", data.politica_ano);
    formData.append("politica_arquivo", data.politica_arquivo[0]);
    formData.append("politica_titulo", data.politica_titulo);

    formData.append(
      "sr_descricao",
      data.sr_descricao ? data.sr_descricao : dadosGestao?.sr_descricao
    );
    formData.append(
      "ct_nomes_comunidades",
      data.ct_nomes_comunidades
        ? data.ct_nomes_comunidades
        : dadosGestao?.nomes_comunidades_beneficiadas
    );
    formData.append(
      "ct_descricao",
      data.ct_descricao ? data.ct_descricao : dadosGestao?.ct_descricao
    );

    const apiClient = getAPIClient();
    const resCad = await apiClient
      .post("addGestaoIndicadores", formData, {
        headers: {
          "Content-Type": `multipart/form-data=${formData}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 7000,
          });
          getPoliticas();
          getPlanos();
          getParticipacoes();
          getRepresentantes();
          reset({
            pcs_ano: "",
            pcs_titulo: "",
            pcs_arquivo: "",
            plano_ano: "",
            plano_titulo: "",
            plano_arquivo: "",
            politica_ano: "",
            politica_titulo: "",
            politica_arquivo: "",
            ga_nome: "",
            ga_norma: "",
          });
        } else {
          toast.error(response.data.message, {
            position: "top-right",
            autoClose: 7000,
          });
        }
      })
      .catch((error) => {
        toast.error("Não foi possivel cadastrar o representante! ", {
          position: "top-right",
          autoClose: 5000,
        });
        console.log(error);
      });

    const resParticipacao = await apiClient.get(
      "getParticipacaoControleSocial",
      {
        params: { id_municipio: usuario?.id_municipio },
      }
    );
    const participacoes = await resParticipacao.data;
    setListParticipacoes(participacoes);
  }

  function handleShowModal() {
    setShowModal(true);
  }
  function handleCloseModal() {
    setShowModal(false);
    setShowModalPolitica(false);
  }

  async function updateRepresentantesServicos(data) {
    if (!usuario.id_municipio || !data.id_representante_servicos_ga) {
      toast.error("Dados insuficientes para atualizar!", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    await api
      .put("updateRepresentanteServicos", {
        id_representante_servicos_ga: data.id_representante_servicos_ga,
        ga_nome_representante: data.ga_nome_representante,
        ga_cargo: data.ga_cargo,
        ga_telefone: data.ga_telefone,
        ga_email: data.ga_email,
        id_municipio: usuario.id_municipio,
      })
      .then((response) => {
        toast.success("Representante atualizado com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
        getRepresentantes();
        setShowModal(false);
        setUpdateRepresentantes(null);
      })
      .catch((error) => {
        toast.error("Não foi possível atualizar o representante!", {
          position: "top-right",
          autoClose: 5000,
        });
        console.log(error);
      });
  }

  async function updatePoliticaMunicipal(data: IPoliticas) {
    console.log("Antes de atualizar politicas", data);

    if (!usuario.id_municipio || !data.id_politica_municipal) {
      toast.error("Dados insuficientes para atualizar!", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    await api
      .put("updatePoliticaMunicipal", {
        id_politica_municipal: data.id_politica_municipal,
        politica_titulo: data?.titulo,
        politica_ano: data?.ano,
        id_municipio: usuario.id_municipio,
      })
      .then((response) => {
        toast.success("Politica Municipal atualizada com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
        getPoliticas();
        setShowModalPolitica(false);
        setUpdatePolitica(null);
      })
      .catch((error) => {
        toast.error("Não foi possível atualizar a política municipal!", {
          position: "top-right",
          autoClose: 5000,
        });
      });
  }

  async function handleEditarRepresentante(representante) {
    setUpdateRepresentantes(representante);
    setShowModal(true);

    // Preenche os campos do formulário com os dados do representante
    setValue(
      "id_representante_servicos_ga",
      representante.id_representante_servicos_ga
    );
    setValue("ga_nome_representante", representante.nome);
    setValue("ga_cargo", representante.cargo);
    setValue("ga_telefone", representante.telefone);
    setValue("ga_email", representante.email);
  }

  async function handleEditarPolitica(politica: IPoliticas): Promise<void> {
    setUpdatePolitica(politica);
    setShowModalPolitica(true);

    // Preenche os campos do formulário com os dados do representante
    setValue("id_politica_municipal", politica.id_politica_municipal);
    setValue("politica_titulo", politica.titulo);
    setValue("politica_ano", politica.ano);
  }

  async function handleEditarParticipacao(
    participacao: IParticipacao
  ): Promise<void> {
    setUpdateParticipacao(participacao);
    setShowModalParticipacao(true);

    // Preenche os campos do formulário com os dados da participação
    setValue(
      "id_participacao_controle_social",
      participacao.id_participacao_controle_social
    );
    setValue("pcs_titulo", participacao.titulo);
    setValue("pcs_ano", participacao.ano);
  }

  async function updateParticipacaoControleSocial(data: IParticipacao) {
    if (!usuario.id_municipio || !data.id_participacao_controle_social) {
      toast.error("Dados insuficientes para atualizar!", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    await api
      .put("updateParticipacaoControleSocial", {
        id_participacao_controle_social: data.id_participacao_controle_social,
        pcs_titulo: data?.titulo,
        pcs_ano: data?.ano,
        id_municipio: usuario.id_municipio,
      })
      .then((response) => {
        toast.success(
          "Participação e Controle Social atualizado com sucesso!",
          { position: "top-right", autoClose: 5000 }
        );
        getParticipacoes();
        setShowModalParticipacao(false);
        setUpdateParticipacao(null);
      })
      .catch((error) => {
        toast.error("Não foi possível atualizar a participação!", {
          position: "top-right",
          autoClose: 5000,
        });
      });
  }

  async function updatePresidenteConselho(data) {
    console.log("Dados do presidente:", data);
    if (
      !usuario.id_municipio ||
      !data.id_presidencia_conselho_municipal_saneamento_basico
    ) {
      toast.error("Dados insuficientes para atualizar!", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    await api
      .put("update-presidencia-conselho-municipal", {
        id_presidencia_conselho_municipal_saneamento_basico:
          data.id_presidencia_conselho_municipal_saneamento_basico,
        nome_presidente: data.nome_presidente,
        telefone_presidente: data.telefone_presidente,
        email_presidente: data.email_presidente,
        setor_responsavel: data.setor_responsavel,
        integrantes: data.integrantes,
        id_municipio: usuario.id_municipio,
      })
      .then((response) => {
        toast.success("Presidente atualizado com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
        getPresidentesConselho(); // Atualiza a lista
        setShowModalPresidente(false);
        setUpdatePresidente(null);
      })
      .catch((error) => {
        console.log(
          "Erro ao atualizar presidente:",
          error.response?.data || error
        );
        toast.error("Não foi possível atualizar o presidente!", {
          position: "top-right",
          autoClose: 5000,
        });
      });
  }

  async function handleEditarPresidente(presidente) {
    setUpdatePresidente(presidente);
    setShowModalPresidente(true);

    setValue(
      "id_presidencia_conselho_municipal_saneamento_basico",
      presidente.id_presidencia_conselho_municipal_saneamento_basico
    );
    setValue("nome_presidente", presidente.nome_presidente);
    setValue("telefone_presidente", presidente.telefone_presidente);
    setValue("email_presidente", presidente.email_presidente);
    setValue("setor_responsavel", presidente.setor_responsavel);
    setValue("integrantes", presidente.integrantes);
  }

  if (!usuario?.id_municipio) {
    return null;
  }

  async function handleEditarPlano(plano: IPlanos): Promise<void> {
    setUpdatePlano(plano);
    setShowModalPlano(true);

    setValue("id_plano_municipal", plano.id_plano_municipal);
    setValue("plano_titulo", plano.titulo);
    setValue("plano_ano", plano.ano);
  }

  async function updatePlanoMunicipal(data: IPlanos) {
    console.log("Antes de atualizar plano", data);

    if (!usuario.id_municipio || !data.id_plano_municipal) {
      toast.error("Dados insuficientes para atualizar!", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    await api
      .put("updatePlanoMunicipal", {
        id_plano_municipal: data.id_plano_municipal,
        plano_titulo: data?.titulo,
        plano_ano: data?.ano,
        id_municipio: usuario.id_municipio,
        situacao: planoSituacao,
      })
      .then((response) => {
        toast.success("Plano Municipal atualizado com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
        getPlanos();
        setShowModalPlano(false);
        setUpdatePlano(null);
      })
      .catch((error) => {
        toast.error("Não foi possível atualizar o plano municipal!", {
          position: "top-right",
          autoClose: 5000,
        });
      });
  }

  // useEffect(() => {
  //   const handleResize = () => {
  //     if (window.innerWidth <= 768) {
  //       setIsCollapsed(true);
  //     } else {
  //       setIsCollapsed(false);
  //     }
  //   };
  //   handleResize();
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  // Styled components para menu
  const StaticMenuHeader = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== '$isActive',
  })<{ $isActive?: boolean }>`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    font-weight: bold;
    color: ${props => props.$isActive ? "#0085bd" : "#000"};
    transition: color 0.3s ease;
    user-select: none;

    &:hover {
      color: #0085bd;
    }

    > div:first-child {
      display: flex;
      align-items: center;
      gap: 8px;
      
      svg {
        color: ${props => props.$isActive ? "#0085bd" : "#666"};
        transition: color 0.3s ease;
        font-size: 14px;
      }
    }

    &:hover > div:first-child svg {
      color: #0085bd;
    }
  `;

  return (
    <Container>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuHorizontal
        municipio={dadosMunicipio?.municipio_nome}
      ></MenuHorizontal>
      <MenuIndicadores></MenuIndicadores>

      {isCollapsed ? (
        <ExpandButton onClick={toggleSidebar}>
          <FaBars />
        </ExpandButton>
      ) : (
        <Sidebar $isCollapsed={isCollapsed}>
          <CollapseButton onClick={toggleSidebar}>
            <FaBars />
          </CollapseButton>
          <StaticMenuHeader
            $isActive={activeForm === "gestaoAssociada"}
            onClick={() => setActiveForm("gestaoAssociada")}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaList style={{ fontSize: "14px" }} />
              Gestão Associada
            </div>
          </StaticMenuHeader>
          <StaticMenuHeader
            $isActive={activeForm === "politicaSaneamento"}
            onClick={() => setActiveForm("politicaSaneamento")}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaList style={{ fontSize: "14px" }} />
              Política Municipal de Saneamento
            </div>
          </StaticMenuHeader>
          <StaticMenuHeader
            $isActive={activeForm === "planoSaneamento"}
            onClick={() => setActiveForm("planoSaneamento")}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaList style={{ fontSize: "14px" }} />
              Plano Municipal de Saneamento
            </div>
          </StaticMenuHeader>
          <StaticMenuHeader
            $isActive={activeForm === "conselhoSaneamento"}
            onClick={() => setActiveForm("conselhoSaneamento")}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaList style={{ fontSize: "14px" }} />
              Conselho Municipal de Saneamento Básico
            </div>
          </StaticMenuHeader>
          <StaticMenuHeader
            $isActive={activeForm === "participacaoSocial"}
            onClick={() => setActiveForm("participacaoSocial")}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaList style={{ fontSize: "14px" }} />
              Participação e controle social
            </div>
          </StaticMenuHeader>
          <StaticMenuHeader
            $isActive={activeForm === "saneamentoRural"}
            onClick={() => setActiveForm("saneamentoRural")}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaList style={{ fontSize: "14px" }} />
              Saneamento Rural
            </div>
          </StaticMenuHeader>
          <StaticMenuHeader
            $isActive={activeForm === "comunidadesTradicionais"}
            onClick={() => setActiveForm("comunidadesTradicionais")}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaList style={{ fontSize: "14px" }} />
              Comunidades Tradicionais
            </div>
          </StaticMenuHeader>
        </Sidebar>
      )}
      <MainContent isCollapsed={isCollapsed}>
        <DivCenter>
          <Form onSubmit={handleSubmit(handleCadastro)}>
            <BreadCrumbStyle $isCollapsed={isCollapsed}>
              <nav>
                <ol>
                  <li>
                    <Link href="/indicadores/home_indicadores">Home</Link>
                    <span> / </span>
                  </li>
                  <li>
                    <span>Gestão</span>
                  </li>
                </ol>
              </nav>
            </BreadCrumbStyle>
            <DivFormCadastro active={activeForm === "gestaoAssociada"}>
              <DivTituloForm>Gestão Associada</DivTituloForm>
              <table
                style={{
                  width: "97%",
                  borderRadius: "10px",
                  border: "1px solid #eee",
                  boxShadow: "0 3.8px 5.7px rgba(0, 0, 0, 0.1)",
                  margin: "0 0 20px 20px",
                  padding: "15px",
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ width: "50%", padding: "10px" }}>
                      <InputG>
                        <label>Nome da associação</label>
                        <input
                          style={{ width: "100%" }}
                          {...register("nome_associacao")}
                          defaultValue={dadosGestao?.ga_nome}
                          onChange={handleOnChange}
                          type="text"
                        ></input>
                      </InputG>
                    </td>
                    <td style={{ width: "50%", padding: "10px" }}>
                      <InputG>
                        <label>
                          Norma da associação<span> *</span>
                        </label>
                        <input
                          style={{ width: "100%" }}
                          {...register("norma_associacao")}
                          defaultValue={dadosGestao?.ga_norma}
                          onChange={handleOnChange}
                          type="text"
                        ></input>
                      </InputG>
                    </td>
                    <td>
                    {usuario?.id_permissao !== 4 && (
                  <button
                    type="submit"
                    style={{
                      padding: "12px 24px",
                      fontSize: "14px",
                      fontWeight: "500",
                      borderRadius: "6px",
                      transition: "all 0.2s",
                      backgroundColor: "#0085bd",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Gravar
                  </button>
                )}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div
                style={{
                  marginBottom: "20px",
                  marginLeft: "20px",
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "97%",
                  position: "relative",
                }}
              >
               
              </div>

              <DivEixo
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                Representantes
                <ButtonAdicionarPresidente
                  onClick={() => {
                    handleShowModal();
                  }}
                >
                  Adicionar
                </ButtonAdicionarPresidente>
              </DivEixo>

              <table
                cellSpacing={0}
                style={{
                  width: "98%",
                  borderRadius: "10px",
                  boxShadow: "0 3.8px 5.7px rgba(0, 0, 0, 0.1)",
                  margin: "0 0 20px 20px",
                  borderCollapse: "separate",
                  borderSpacing: 0,
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        background: "#0085bd",
                        color: "#fff",
                        padding: "10px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                        borderTopLeftRadius: "10px",
                      }}
                    >
                      ID
                    </th>
                    <th
                      style={{
                        background: "#0085bd",
                        color: "#fff",
                        padding: "10px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      Nome
                    </th>
                    <th
                      style={{
                        background: "#0085bd",
                        color: "#fff",
                        padding: "10px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      Cargo
                    </th>
                    <th
                      style={{
                        background: "#0085bd",
                        color: "#fff",
                        padding: "10px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      Telefone
                    </th>
                    <th
                      style={{
                        background: "#0085bd",
                        color: "#fff",
                        padding: "10px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      Email
                    </th>
                    <th
                      style={{
                        background: "#0085bd",
                        color: "#fff",
                        padding: "10px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                        borderTopRightRadius: "10px",
                      }}
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {representantes && representantes.length > 0 ? (
                    representantes.map((representante, index) => (
                      <tr role="row" key={index}>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#4a5568",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "15px",
                          }}
                        >
                          {representante.id_representante_servicos_ga}
                        </td>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#4a5568",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "15px",
                          }}
                        >
                          <InputM>{representante.nome}</InputM>
                        </td>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#4a5568",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "15px",
                          }}
                        >
                          {representante.cargo}
                        </td>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#4a5568",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "15px",
                          }}
                        >
                          {representante.telefone}
                        </td>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#4a5568",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "15px",
                          }}
                        >
                          {representante.email}
                        </td>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#4a5568",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "15px",
                          }}
                        >
                          <Actions>
                            <Image
                              title="Editar"
                              onClick={() =>
                                handleEditarRepresentante(representante)
                              }
                              src={Editar}
                              alt="Editar"
                              width={25}
                              height={25}
                            />

                            <Image
                              onClick={() =>
                                handleRemoverRepresentante({
                                  id: representante.id_representante_servicos_ga,
                                })
                              }
                              src={Excluir}
                              alt="Excluir"
                              width={25}
                              height={25}
                            />
                          </Actions>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          padding: "20px",
                          textAlign: "center",
                          color: "#999",
                        }}
                      >
                        Nenhum representante cadastrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </DivFormCadastro>

            <DivFormCadastro active={activeForm === "politicaSaneamento"}>
              <DivTituloForm>
                Política Municipal de Saneamento Básico
              </DivTituloForm>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "10px",
                    fontWeight: "bold",
                  }}
                >
                  Situação da Política Municipal:
                </label>
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    flexDirection: innerWidth > 0 && innerWidth <= 768 ? "column" : "row",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="politica_situacao"
                      checked={politicaSituacao === "aprovado"}
                      onChange={() => handlePoliticaSituacaoChange("aprovado")}
                    />
                    Aprovado
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="politica_situacao"
                      checked={politicaSituacao === "elaborado"}
                      onChange={() => handlePoliticaSituacaoChange("elaborado")}
                    />
                    Elaborado
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="politica_situacao"
                      checked={politicaSituacao === "em_construcao"}
                      onChange={() =>
                        handlePoliticaSituacaoChange("em_construcao")
                      }
                    />
                    Em construção
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="politica_situacao"
                      checked={politicaSituacao === "nao_tem"}
                      onChange={() => handlePoliticaSituacaoChange("nao_tem")}
                    />
                    Não tem
                  </label>
                </div>
              </div>

              <table
                style={{
                  width: "97%",
                  borderRadius: "10px",
                  border: "1px solid #eee",
                  boxShadow: "0 3.8px 5.7px rgba(0, 0, 0, 0.1)",
                  margin: "0 0 20px 20px",
                  padding: "15px",
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ width: "50%", padding: "10px" }}>
                      <InputG>
                        <label>Título</label>
                        <input
                          style={{ width: "100%" }}
                          {...register("politica_titulo")}
                          defaultValue={dadosGestao?.politica_titulo}
                          onChange={(e) => {
                            const value = capitalizeFrasal(e.target.value);
                            setValue("politica_titulo", value);
                          }}
                          type="text"
                          onKeyPress={onlyLettersAndCharacters}
                          disabled={politicaSituacao === "nao_tem"}
                        ></input>
                      </InputG>
                    </td>
                    <td style={{ width: "15%", padding: "10px" }}>
                      <InputP>
                        <label>Ano</label>
                        <input
                          style={{ width: "100%" }}
                          {...register("politica_ano")}
                          defaultValue={dadosGestao?.politica_ano}
                          onChange={handleOnChange}
                          type="text"
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          disabled={politicaSituacao === "nao_tem"}
                        ></input>
                      </InputP>
                    </td>
                    <td style={{ padding: "10px" }}>
                      <InputM>
                        <label>Arquivo</label>
                        <input
                          {...register("politica_arquivo")}
                          type="file"
                          disabled={politicaSituacao === "nao_tem"}
                        ></input>
                      </InputM>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div
                style={{
                  marginBottom: "20px",
                  marginLeft: "20px",
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "97%",
                  position: "relative",
                }}
              >
                {usuario?.id_permissao !== 4 && (
                  <SubmitButton
                    type="submit"
                    disabled={politicaSituacao === "nao_tem"}
                    style={{
                      padding: "12px 24px",
                      fontSize: "14px",
                      fontWeight: "500",
                      borderRadius: "6px",
                      transition: "all 0.2s",
                      opacity: politicaSituacao === "nao_tem" ? 0.5 : 1,
                    }}
                  >
                    Gravar
                  </SubmitButton>
                )}
              </div>

              <DivEixo>Atualizações</DivEixo>

              <table
                cellSpacing={0}
                style={{
                  width: "98%",
                  borderRadius: "10px",
                  boxShadow: "0 3.8px 5.7px rgba(0, 0, 0, 0.1)",
                  margin: "0 0 20px 20px",
                  borderCollapse: "separate",
                  borderSpacing: 0,
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        background: "#0085bd",
                        color: "#fff",
                        padding: "10px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                        borderTopLeftRadius: "10px",
                      }}
                    >
                      ID
                    </th>
                    <th
                      style={{
                        background: "#0085bd",
                        color: "#fff",
                        padding: "10px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      Título
                    </th>
                    <th
                      style={{
                        background: "#0085bd",
                        color: "#fff",
                        padding: "10px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      Ano
                    </th>
                    <th
                      style={{
                        background: "#0085bd",
                        color: "#fff",
                        padding: "10px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                        borderTopRightRadius: "10px",
                      }}
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {listPoliticas && listPoliticas.length > 0 ? (
                    listPoliticas.map((politica, index) => (
                      <tr key={index}>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#4a5568",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "15px",
                          }}
                        >
                          {politica.id_politica_municipal}
                        </td>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#4a5568",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "15px",
                          }}
                        >
                          <InputG>{politica.titulo}</InputG>
                        </td>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#4a5568",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "15px",
                          }}
                        >
                          {politica.ano}
                        </td>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#4a5568",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "15px",
                          }}
                        >
                          <Actions>
                            <Image
                              title="Editar"
                              onClick={() => handleEditarPolitica(politica)}
                              src={Editar}
                              alt="Editar"
                              width={25}
                              height={25}
                              style={{
                                cursor:
                                  politicaSituacao === "nao_tem"
                                    ? "not-allowed"
                                    : "pointer",
                                opacity:
                                  politicaSituacao === "nao_tem" ? 0.5 : 1,
                              }}
                              {...(politicaSituacao === "nao_tem"
                                ? { onClick: (e) => e.preventDefault() }
                                : {})}
                            />
                            <a
                              href={politica.file}
                              rel="noreferrer"
                              target="_blank"
                              style={{
                                pointerEvents:
                                  politicaSituacao === "nao_tem"
                                    ? "none"
                                    : "auto",
                                opacity:
                                  politicaSituacao === "nao_tem" ? 0.5 : 1,
                              }}
                            >
                              <FaFilePdf></FaFilePdf>
                            </a>
                            <Image
                              src={Excluir}
                              alt="Excluir"
                              width={25}
                              height={25}
                              onClick={() => {
                                if (politicaSituacao !== "nao_tem") {
                                  handleRemoverPolitica({
                                    id: politica.id_politica_municipal,
                                    id_arquivo: politica.id_arquivo,
                                  });
                                }
                              }}
                              style={{
                                cursor:
                                  politicaSituacao === "nao_tem"
                                    ? "not-allowed"
                                    : "pointer",
                                opacity:
                                  politicaSituacao === "nao_tem" ? 0.5 : 1,
                              }}
                            />
                          </Actions>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        style={{
                          padding: "20px",
                          textAlign: "center",
                          color: "#999",
                        }}
                      >
                        Nenhuma política cadastrada
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </DivFormCadastro>

            <DivFormCadastro active={activeForm === "planoSaneamento"}>
              <DivTituloForm>
                Plano Municipal de Saneamento Básico
              </DivTituloForm>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "10px",
                    fontWeight: "bold",
                  }}
                >
                  Situação do Plano Municipal:
                </label>
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    flexDirection: innerWidth > 0 && innerWidth <= 768 ? "column" : "row",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="plano_situacao"
                      checked={planoSituacao === "aprovado"}
                      onChange={() => handlePlanoSituacaoChange("aprovado")}
                    />
                    Aprovado
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="plano_situacao"
                      checked={planoSituacao === "elaborado"}
                      onChange={() => handlePlanoSituacaoChange("elaborado")}
                    />
                    Elaborado
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="plano_situacao"
                      checked={planoSituacao === "em_construcao"}
                      onChange={() =>
                        handlePlanoSituacaoChange("em_construcao")
                      }
                    />
                    Em construção
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="plano_situacao"
                      checked={planoSituacao === "nao_tem"}
                      onChange={() => handlePlanoSituacaoChange("nao_tem")}
                    />
                    Não tem
                  </label>
                </div>
              </div>
              <table
                style={{
                  width: "97%",
                  borderRadius: "10px",
                  border: "1px solid #eee",
                  boxShadow: "0 3.8px 5.7px rgba(0, 0, 0, 0.1)",
                  margin: "0 0 20px 20px",
                  padding: "15px",
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ width: "50%", padding: "10px" }}>
                      <InputG>
                        <label>Título</label>
                        <input
                          style={{ width: "100%" }}
                          {...register("plano_titulo")}
                          type="text"
                          onChange={(e) => {
                            const value = capitalizeFrasal(e.target.value);
                            setValue("plano_titulo", value);
                          }}
                          onKeyPress={onlyLettersAndCharacters}
                          disabled={planoSituacao === "nao_tem"}
                        />
                      </InputG>
                    </td>
                    <td style={{ width: "15%", padding: "10px" }}>
                      <InputP>
                        <label>Ano</label>
                        <input
                          style={{ width: "100%" }}
                          {...register("plano_ano")}
                          type="text"
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          disabled={planoSituacao === "nao_tem"}
                        />
                      </InputP>
                    </td>
                    <td style={{ padding: "10px" }}>
                      <InputM>
                        <label>Arquivo</label>
                        <input
                          {...register("plano_arquivo")}
                          type="file"
                          disabled={planoSituacao === "nao_tem"}
                        />
                      </InputM>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div
                style={{
                  marginBottom: "20px",
                  marginLeft: "20px",
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "97%",
                  position: "relative",
                }}
              >
                {usuario?.id_permissao !== 4 && (
                  <SubmitButton
                    type="submit"
                    disabled={planoSituacao === "nao_tem"}
                    style={{
                      padding: "12px 24px",
                      fontSize: "14px",
                      fontWeight: "500",
                      borderRadius: "6px",
                      transition: "all 0.2s",
                      opacity: planoSituacao === "nao_tem" ? 0.5 : 1,
                    }}
                  >
                    Gravar
                  </SubmitButton>
                )}
              </div>

              <DivEixo>Atualizações</DivEixo>
              <table
                cellSpacing={0}
                style={{
                  width: "98%",
                  borderRadius: "10px",
                  boxShadow: "0 3.8px 5.7px rgba(0, 0, 0, 0.1)",
                  margin: "0 0 20px 20px",
                  borderCollapse: "separate",
                  borderSpacing: 0,
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        background: "#0085bd",
                        color: "#fff",
                        padding: "10px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                        borderTopLeftRadius: "10px",
                      }}
                    >
                      ID
                    </th>
                    <th
                      style={{
                        background: "#0085bd",
                        color: "#fff",
                        padding: "10px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      Título
                    </th>
                    <th
                      style={{
                        background: "#0085bd",
                        color: "#fff",
                        padding: "10px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      Ano
                    </th>
                    <th
                      style={{
                        background: "#0085bd",
                        color: "#fff",
                        padding: "10px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                        borderTopRightRadius: "10px",
                      }}
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {listPlanos && listPlanos.length > 0 ? (
                    listPlanos.map((plano, index) => (
                      <tr key={index}>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#4a5568",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "15px",
                          }}
                        >
                          {plano.id_plano_municipal}
                        </td>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#4a5568",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "15px",
                          }}
                        >
                          <InputG>{plano.titulo}</InputG>
                        </td>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#4a5568",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "15px",
                          }}
                        >
                          {plano.ano}
                        </td>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#4a5568",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "15px",
                          }}
                        >
                          <Actions>
                            <Image
                              title="Editar"
                              onClick={() => handleEditarPlano(plano)}
                              src={Editar}
                              alt="Editar"
                              width={25}
                              height={25}
                              style={{
                                cursor:
                                  planoSituacao === "nao_tem"
                                    ? "not-allowed"
                                    : "pointer",
                                opacity: planoSituacao === "nao_tem" ? 0.5 : 1,
                              }}
                              {...(planoSituacao === "nao_tem"
                                ? { onClick: (e) => e.preventDefault() }
                                : {})}
                            />
                            <a
                              href={plano.file}
                              rel="noreferrer"
                              target="_blank"
                              style={{
                                pointerEvents:
                                  planoSituacao === "nao_tem" ? "none" : "auto",
                                opacity: planoSituacao === "nao_tem" ? 0.5 : 1,
                              }}
                            >
                              <FaFilePdf></FaFilePdf>
                            </a>
                            <Image
                              src={Excluir}
                              alt="Excluir"
                              width={25}
                              height={25}
                              onClick={() => {
                                if (planoSituacao !== "nao_tem") {
                                  handleRemoverPlano({
                                    id: plano.id_plano_municipal,
                                    id_arquivo: plano.id_arquivo,
                                  });
                                }
                              }}
                              style={{
                                cursor:
                                  planoSituacao === "nao_tem"
                                    ? "not-allowed"
                                    : "pointer",
                                opacity: planoSituacao === "nao_tem" ? 0.5 : 1,
                              }}
                            />
                          </Actions>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        style={{
                          padding: "20px",
                          textAlign: "center",
                          color: "#999",
                        }}
                      >
                        Nenhum plano cadastrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </DivFormCadastro>

            <DivFormCadastro active={activeForm === "conselhoSaneamento"}>
              <DivTituloForm>
                Conselho Municipal de Saneamento Básico
              </DivTituloForm>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "10px",
                    fontWeight: "bold",
                  }}
                >
                  Situação do Conselho Municipal:
                </label>
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    flexDirection: innerWidth > 0 && innerWidth <= 768 ? "column" : "row",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="conselho_situacao"
                      checked={conselhoSituacao === "operante"}
                      onChange={() => handleConselhoSituacaoChange("operante")}
                    />
                    Operante
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="conselho_situacao"
                      checked={conselhoSituacao === "nao_operante"}
                      onChange={() =>
                        handleConselhoSituacaoChange("nao_operante")
                      }
                    />
                    Não operante
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="conselho_situacao"
                      checked={conselhoSituacao === "nao_tem"}
                      onChange={() => handleConselhoSituacaoChange("nao_tem")}
                    />
                    Não tem
                  </label>
                </div>
              </div>
              <table
                style={{
                  width: "97%",
                  borderRadius: "10px",
                  border: "1px solid #eee",
                  boxShadow: "0 3.8px 5.7px rgba(0, 0, 0, 0.1)",
                  margin: "0 0 20px 20px",
                  padding: "15px",
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ width: "50%", padding: "10px" }}>
                      <InputG>
                        <label>Título</label>
                        <input
                          style={{ width: "100%" }}
                          type="text"
                          {...register("conselho_titulo")}
                          defaultValue={dadosGestao?.conselho_titulo}
                          onChange={(e) => {
                            const value = capitalizeFrasal(e.target.value);
                            setValue("conselho_titulo", value);
                          }}
                          onKeyPress={onlyLettersAndCharacters}
                          disabled={conselhoSituacao === "nao_tem"}
                        />
                      </InputG>
                    </td>
                    <td style={{ width: "15%", padding: "10px" }}>
                      <InputP>
                        <label>Ano</label>
                        <input
                          style={{ width: "100%" }}
                          {...register("conselho_ano")}
                          defaultValue={dadosGestao?.conselho_ano}
                          onChange={handleOnChange}
                          type="text"
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          disabled={conselhoSituacao === "nao_tem"}
                        />
                      </InputP>
                    </td>
                    <td style={{ padding: "10px" }}>
                      <InputM>
                        <label>Arquivo</label>
                        <input
                          {...register("conselho_arquivo")}
                          type="file"
                          disabled={conselhoSituacao === "nao_tem"}
                        ></input>
                      </InputM>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div
                style={{
                  marginBottom: "20px",
                  marginLeft: "20px",
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "97%",
                  position: "relative",
                }}
              >
                {usuario?.id_permissao !== 4 && (
                  <SubmitButton
                    type="submit"
                    disabled={conselhoSituacao === "nao_tem"}
                    style={{
                      padding: "12px 24px",
                      fontSize: "14px",
                      fontWeight: "500",
                      borderRadius: "6px",
                      transition: "all 0.2s",
                      opacity: conselhoSituacao === "nao_tem" ? 0.5 : 1,
                    }}
                  >
                    Gravar
                  </SubmitButton>
                )}
              </div>

              <TablesContainer>
                <div>
                  <DivEixo
                    style={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    Presidentes
                    <ButtonAdicionarPresidente
                      onClick={handleShowModalPresidente}
                      disabled={!conselhoMunicipal || conselhoMunicipal.length === 0}
                    >
                      Adicionar Presidente
                    </ButtonAdicionarPresidente>
                  </DivEixo>
                  <table
                    cellSpacing={0}
                    style={{
                      width: "98%",
                      borderRadius: "10px",
                      boxShadow: "0 3.8px 5.7px rgba(0, 0, 0, 0.1)",
                      margin: "0 0 20px 20px",
                      borderCollapse: "separate",
                      borderSpacing: 0,
                    }}
                  >
                    <thead>
                      <tr>
                        <th
                          style={{
                            background: "#0085bd",
                            color: "#fff",
                            padding: "10px 20px",
                            textAlign: "left",
                            fontWeight: 600,
                            fontSize: "14px",
                            borderTopLeftRadius: "10px",
                          }}
                        >
                          Presidente
                        </th>
                        <th
                          style={{
                            background: "#0085bd",
                            color: "#fff",
                            padding: "10px 20px",
                            textAlign: "left",
                            fontWeight: 600,
                            fontSize: "14px",
                          }}
                        >
                          Setor Responsável
                        </th>
                        <th
                          style={{
                            background: "#0085bd",
                            color: "#fff",
                            padding: "10px 20px",
                            textAlign: "left",
                            fontWeight: 600,
                            fontSize: "14px",
                            borderTopRightRadius: "10px",
                          }}
                        >
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {conselho && conselho.length > 0 ? (
                        conselho.map((presidente, index) => (
                        <tr role="row" key={index}>
                          <td
                            style={{
                              padding: "16px 20px",
                              color: "#4a5568",
                              borderBottom: "1px solid #e2e8f0",
                              fontSize: "15px",
                            }}
                          >
                            <InputM>{presidente.nome_presidente}</InputM>
                          </td>
                          <td
                            style={{
                              padding: "16px 20px",
                              color: "#4a5568",
                              borderBottom: "1px solid #e2e8f0",
                              fontSize: "15px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {presidente.setor_responsavel}
                          </td>
                          <td
                            style={{
                              padding: "16px 20px",
                              color: "#4a5568",
                              borderBottom: "1px solid #e2e8f0",
                              fontSize: "15px",
                            }}
                          >
                            <Actions>
                              <Image
                                title="Editar"
                                onClick={() =>
                                  handleEditarPresidente(presidente)
                                }
                                src={Editar}
                                alt="Editar"
                                width={25}
                                height={25}
                                style={{
                                  cursor:
                                    conselhoSituacao === "nao_tem"
                                      ? "not-allowed"
                                      : "pointer",
                                  opacity:
                                    conselhoSituacao === "nao_tem" ? 0.5 : 1,
                                }}
                                {...(conselhoSituacao === "nao_tem"
                                  ? { onClick: (e) => e.preventDefault() }
                                  : {})}
                              />
                              <Image
                                onClick={() => {
                                  if (conselhoSituacao !== "nao_tem") {
                                    handleRemoverPresidente({
                                      id: presidente.id_presidencia_conselho_municipal_saneamento_basico,
                                    });
                                  }
                                }}
                                src={Excluir}
                                alt="Excluir"
                                width={25}
                                height={25}
                                style={{
                                  cursor:
                                    conselhoSituacao === "nao_tem"
                                      ? "not-allowed"
                                      : "pointer",
                                  opacity:
                                    conselhoSituacao === "nao_tem" ? 0.5 : 1,
                                }}
                              />
                            </Actions>
                          </td>
                        </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            style={{
                              padding: "20px",
                              textAlign: "center",
                              color: "#999",
                            }}
                          >
                            Nenhum presidente cadastrado
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: "16px" }}>
                  <DivEixo>Atualizações</DivEixo>
                  <table
                    cellSpacing={0}
                    style={{
                      width: "98%",
                      borderRadius: "10px",
                      boxShadow: "0 3.8px 5.7px rgba(0, 0, 0, 0.1)",
                      margin: "0 0 20px 20px",
                      borderCollapse: "separate",
                      borderSpacing: 0,
                    }}
                  >
                    <thead>
                      <tr>
                        <th
                          style={{
                            background: "#0085bd",
                            color: "#fff",
                            padding: "10px 20px",
                            textAlign: "left",
                            fontWeight: 600,
                            fontSize: "14px",
                            borderTopLeftRadius: "10px",
                          }}
                        >
                          Título
                        </th>
                        <th
                          style={{
                            background: "#0085bd",
                            color: "#fff",
                            padding: "10px 20px",
                            textAlign: "left",
                            fontWeight: 600,
                            fontSize: "14px",
                          }}
                        >
                          Ano
                        </th>
                        <th
                          style={{
                            background: "#0085bd",
                            color: "#fff",
                            padding: "10px 20px",
                            textAlign: "left",
                            fontWeight: 600,
                            fontSize: "14px",
                            borderTopRightRadius: "10px",
                          }}
                        >
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {conselhoMunicipal && conselhoMunicipal.length > 0 ? (
                        conselhoMunicipal.map((conselho, index) => (
                          <tr key={index}>
                            <td
                              style={{
                                padding: "16px 20px",
                                color: "#4a5568",
                                borderBottom: "1px solid #e2e8f0",
                                fontSize: "15px",
                              }}
                            >
                              <InputG>{conselho.titulo}</InputG>
                            </td>
                            <td
                              style={{
                                padding: "16px 20px",
                                color: "#4a5568",
                                borderBottom: "1px solid #e2e8f0",
                                fontSize: "15px",
                              }}
                            >
                              {conselho.ano}
                            </td>
                            <td
                              style={{
                                padding: "16px 20px",
                                color: "#4a5568",
                                borderBottom: "1px solid #e2e8f0",
                                fontSize: "15px",
                              }}
                            >
                              <Actions>
                                {conselho.file && (
                                  <a
                                    href={conselho.file}
                                    rel="noreferrer"
                                    target="_blank"
                                  >
                                    <FaFilePdf></FaFilePdf>
                                  </a>
                                )}
                                <Image
                                  src={Excluir}
                                  alt="Excluir"
                                  width={25}
                                  height={25}
                                  onClick={() => {
                                    handleRemoverConselho({
                                      id: conselho.id_conselho_municipal_saneamento_basico,
                                    });
                                  }}
                                />
                              </Actions>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            style={{
                              padding: "20px",
                              textAlign: "center",
                              color: "#999",
                            }}
                          >
                            Nenhum conselho cadastrado
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TablesContainer>
            </DivFormCadastro>

            <DivFormCadastro active={activeForm === "participacaoSocial"}>
              <DivTituloForm>Participação e Controle Social</DivTituloForm>
              <table
                style={{
                  width: "97%",
                  borderRadius: "10px",
                  border: "1px solid #eee",
                  boxShadow: "0 3.8px 5.7px rgba(0, 0, 0, 0.1)",
                  margin: "0 0 20px 20px",
                  padding: "15px",
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ width: "50%", padding: "10px" }}>
                      <InputG>
                        <label>Titulo</label>
                        <input
                          style={{ width: "100%" }}
                          {...register("pcs_titulo")}
                          onChange={(e) => {
                            const value = capitalizeFrasal(e.target.value);
                            setValue("pcs_titulo", value);
                          }}
                          type="text"
                          onKeyPress={onlyLettersAndCharacters}
                        ></input>
                      </InputG>
                    </td>
                    <td style={{ width: "15%", padding: "10px" }}>
                      <InputP>
                        <label>Ano</label>
                        <input
                          style={{ width: "100%" }}
                          {...register("pcs_ano")}
                          type="text"
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        ></input>
                      </InputP>
                    </td>
                    <td style={{ padding: "10px" }}>
                      <InputM>
                        <label>Arquivo</label>
                        <input {...register("pcs_arquivo")} type="file"></input>
                      </InputM>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div
                style={{
                  marginBottom: "20px",
                  marginLeft: "20px",
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "97%",
                  position: "relative",
                }}
              >
                {usuario?.id_permissao !== 4 && (
                  <SubmitButton
                    type="submit"
                    style={{
                      padding: "12px 24px",
                      fontSize: "14px",
                      fontWeight: "500",
                      borderRadius: "6px",
                      transition: "all 0.2s",
                    }}
                  >
                    Gravar
                  </SubmitButton>
                )}
              </div>

              <DivEixo>Atualizações</DivEixo>

              <table
                cellSpacing={0}
                style={{
                  width: "98%",
                  borderRadius: "10px",
                  boxShadow: "0 3.8px 5.7px rgba(0, 0, 0, 0.1)",
                  margin: "0 0 20px 20px",
                  borderCollapse: "separate",
                  borderSpacing: 0,
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        background: "#0085bd",
                        color: "#fff",
                        padding: "10px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                        borderTopLeftRadius: "10px",
                      }}
                    >
                      ID
                    </th>
                    <th
                      style={{
                        background: "#0085bd",
                        color: "#fff",
                        padding: "10px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      Título
                    </th>
                    <th
                      style={{
                        background: "#0085bd",
                        color: "#fff",
                        padding: "10px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      Ano
                    </th>
                    <th
                      style={{
                        background: "#0085bd",
                        color: "#fff",
                        padding: "10px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                        borderTopRightRadius: "10px",
                      }}
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {listParticipacoes && listParticipacoes.length > 0 ? (
                    listParticipacoes.map((participacao, index) => (
                      <tr key={index}>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#4a5568",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "15px",
                          }}
                        >
                          {participacao.id_participacao_controle_social}
                        </td>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#4a5568",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "15px",
                          }}
                        >
                          <InputG>{participacao.titulo}</InputG>
                        </td>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#4a5568",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "15px",
                          }}
                        >
                          {participacao.ano}
                        </td>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#4a5568",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "15px",
                          }}
                        >
                          <Actions>
                            <Image
                              title="Editar"
                              onClick={() =>
                                handleEditarParticipacao(participacao)
                              }
                              src={Editar}
                              alt="Editar"
                              width={25}
                              height={25}
                            />
                            <a
                              href={participacao.file}
                              rel="noreferrer"
                              target="_blank"
                            >
                              <FaFilePdf></FaFilePdf>
                            </a>
                            <Image
                              src={Excluir}
                              alt="Excluir"
                              width={25}
                              height={25}
                              onClick={() =>
                                handleRemoverParticipacao({
                                  id: participacao.id_participacao_controle_social,
                                  id_arquivo: participacao.id_arquivo,
                                })
                              }
                            />
                          </Actions>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        style={{
                          padding: "20px",
                          textAlign: "center",
                          color: "#999",
                        }}
                      >
                        Nenhuma participação cadastrada
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </DivFormCadastro>

            <DivFormCadastro
              active={activeForm === "saneamentoRural"}
              style={{
                minWidth: innerWidth > 0 && innerWidth <= 1000 ? "95%" : "1045px",
                minHeight: "380px",
              }}
            >
              <DivTituloForm
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                Saneamento Rural
                <Actions>
                  <Tooltip>
                    <Image
                      src={ajuda}
                      alt="Ajuda"
                      width={20}
                      height={20}
                      style={{ cursor: "pointer" }}
                    />
                    <TooltipText>
                      Insira informações sobre o saneamento rural, como por
                      exemplo: informações sobre população rural, situação atual
                      dos serviços de saneamento, aspectos ambientais, etc.
                    </TooltipText>
                  </Tooltip>
                </Actions>
              </DivTituloForm>
              <DivTextArea>
                <label>Breve Descrição</label>
                <textarea
                  ref={txtArea}
                  {...register("sr_descricao")}
                  onChange={handleOnChange}
                  // required
                ></textarea>
              </DivTextArea>

              <SubmitButtonContainer
                style={{
                  bottom: "-50px",
                  right: "-10px",
                }}
              >
                {usuario?.id_permissao !== 4 && (
                  <SubmitButton type="submit">Gravar</SubmitButton>
                )}
              </SubmitButtonContainer>
            </DivFormCadastro>

            <DivFormCadastro
              active={activeForm === "comunidadesTradicionais"}
              style={{
                minWidth: innerWidth > 0 && innerWidth <= 1000 ? "95%" : "1045px",
                height: "658px",
              }}
            >
              <DivTituloForm
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                Comunidades Tradicionais
                <Actions>
                  <Tooltip>
                    <Image
                      src={ajuda}
                      alt="Ajuda"
                      width={20}
                      height={20}
                      style={{ cursor: "pointer" }}
                    />
                    <TooltipText>
                      Insira informações sobre as comunidades tradicionais, como
                      por exemplo: condições da infraestrutura e serviços de
                      saneamento nessas comunidades.
                    </TooltipText>
                  </Tooltip>
                </Actions>
              </DivTituloForm>

              <DivTextArea>
                <label>Nome das Comunidades Beneficiadas</label>

                <textarea
                  ref={txtArea}
                  {...register("ct_nomes_comunidades")}
                  // required
                ></textarea>

                <label>Breve Descrição</label>

                <textarea
                  ref={txtArea}
                  {...register("ct_descricao")}
                  // required
                ></textarea>
              </DivTextArea>

              <SubmitButtonContainer
                style={{
                  bottom: "-50px",
                  right: "-10px",
                }}
              >
                {usuario?.id_permissao !== 4 && (
                  <SubmitButton type="submit">Gravar</SubmitButton>
                )}
              </SubmitButtonContainer>
            </DivFormCadastro>
          </Form>

          {ShowModalPresidente && (
            <ContainerModal>
              <Modal>
                <Form
                  onSubmit={handleSubmit(
                    updatePresidente
                      ? updatePresidenteConselho
                      : handleAddPresidente
                  )}
                >
                  <CloseModalButton
                    onClick={() => {
                      handleCloseModalPresidente();
                    }}
                  >
                    X
                  </CloseModalButton>
                  <ConteudoModal>
                    <InputG>
                      <label>
                        Nome<span> *</span>
                      </label>
                      <input
                        {...register("nome_presidente", {
                          required: "O nome é obrigatório",
                        })}
                        onKeyPress={onlyLettersAndCharacters}
                        style={{ textTransform: "capitalize" }}
                        onChange={(e) => {
                          const value = toTitleCase(e.target.value);
                          setValue("nome_presidente", value);
                        }}
                        type="text"
                      ></input>
                    </InputG>
                    {errors.nome_presidente && (
                      <span>{errors.nome_presidente.message}</span>
                    )}
                    <InputP>
                      <label>
                        Telefone<span> *</span>
                      </label>
                      <Controller
                        name="telefone_presidente"
                        control={control}
                        rules={{ required: "O telefone é obrigatório" }}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <>
                            <InputMask
                              mask="(99) 99999-9999"
                              maskChar={null}
                              value={value}
                              onChange={(e) => onChange(e.target.value)}
                            >
                              {(inputProps) => (
                                <input {...inputProps} type="text" />
                              )}
                            </InputMask>
                            {error && <span>{error.message}</span>}
                          </>
                        )}
                      />
                    </InputP>
                    {errors.telefone_presidente && (
                      <span>{errors.telefone_presidente.message}</span>
                    )}
                    <InputP>
                      <label>
                        Email<span> *</span>
                      </label>
                      <input
                        {...register("email_presidente", {
                          required: "O email é obrigatório",
                        })}
                        // defaultValue={dadosGestao?.ga_telefone}
                        onChange={handleOnChange}
                        type="text"
                      ></input>
                    </InputP>
                    {errors.email_presidente && (
                      <span>{errors.email_presidente.message}</span>
                    )}
                    <InputM>
                      <label>
                        Setor Responsável<span> *</span>
                      </label>
                      <input
                        {...register("setor_responsavel", {
                          required: "O setor é obrigatório",
                        })}
                        onKeyPress={onlyLettersAndCharacters}
                        style={{ textTransform: "capitalize" }}
                        onChange={(e) => {
                          const value = toTitleCase(e.target.value);
                          setValue("setor_responsavel", value);
                        }}
                        type="text"
                      ></input>
                    </InputM>
                    {errors.setor_responsavel && (
                      <span>{errors.setor_responsavel.message}</span>
                    )}
                    <InputG>
                      <label>
                        Integrantes<span> *</span>
                      </label>
                      <input
                        {...register("integrantes", {
                          required: "Os integrantes são obrigatórios",
                        })}
                        style={{ textTransform: "capitalize" }}
                        onChange={(e) => {
                          const value = toTitleCase(e.target.value);
                          setValue("integrantes", value);
                        }}
                        type="text"
                      ></input>
                    </InputG>
                    {errors.integrantes && (
                      <span>{errors.integrantes.message}</span>
                    )}
                    <ModalSubmitButton type="submit">Gravar</ModalSubmitButton>
                  </ConteudoModal>
                </Form>
              </Modal>
            </ContainerModal>
          )}

          {showModalPolitica && (
            <ContainerModal>
              <Modal>
                <Form
                  onSubmit={handleSubmit(
                    updatePolitica
                      ? updatePoliticaMunicipal
                      : handleAddRepresentante
                  )}
                >
                  <CloseModalButton
                    onClick={() => {
                      handleCloseModal();
                    }}
                  >
                    X
                  </CloseModalButton>

                  <ConteudoModal>
                    <InputG>
                      <label>
                        Título<span> *</span>
                      </label>
                      <input
                        {...register("politica_titulo", {
                          required: "O título é obrigatório",
                        })}
                        onKeyPress={onlyLettersAndCharacters}
                        type="text"
                        onChange={(e) => {
                          const value = capitalizeFrasal(e.target.value);
                          setValue("politica_titulo", value);
                        }}
                        disabled={politicaSituacao === "nao_tem"}
                      ></input>
                    </InputG>
                    {errors.politica_titulo && (
                      <span>{errors.politica_titulo.message}</span>
                    )}
                    <InputP>
                      <label>
                        Ano<span> *</span>
                      </label>
                      <input
                        {...register("politica_ano", {
                          required: "O ano é obrigatório",
                          pattern: {
                            value: /^[0-9]{4}$/,
                            message: "Digite um ano válido com 4 dígitos",
                          },
                        })}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        type="text"
                        maxLength={4}
                        onChange={(e) => {
                          // Remove qualquer caractere que não seja número
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          setValue("politica_ano", value);
                        }}
                        disabled={politicaSituacao === "nao_tem"}
                      ></input>
                    </InputP>
                    {errors.politica_ano && (
                      <span>{errors.politica_ano.message}</span>
                    )}

                    <ModalSubmitButton
                      type="submit"
                      disabled={politicaSituacao === "nao_tem"}
                      style={{
                        opacity: politicaSituacao === "nao_tem" ? 0.5 : 1,
                      }}
                    >
                      Gravar
                    </ModalSubmitButton>
                  </ConteudoModal>
                </Form>
              </Modal>
            </ContainerModal>
          )}
          {showModal && (
            <ContainerModal>
              <Modal>
                <Form
                  onSubmit={handleSubmit(
                    updateRepresentantes
                      ? updateRepresentantesServicos
                      : handleAddRepresentante
                  )}
                >
                  <CloseModalButton
                    onClick={() => {
                      handleCloseModal();
                    }}
                  >
                    X
                  </CloseModalButton>
                  <ConteudoModal>
                    <InputG>
                      <label>
                        Nome<span> *</span>
                      </label>
                      <input
                        {...register("ga_nome_representante", {
                          required: "O nome é obrigatório",
                        })}
                        onKeyPress={onlyLettersAndCharacters}
                        type="text"
                        onChange={(e) => {
                          const value = capitalizeFrasal(e.target.value);
                          setValue("ga_nome_representante", value);
                        }}
                      ></input>
                    </InputG>
                    {errors.ga_nome_representante && (
                      <span>{errors.ga_nome_representante.message}</span>
                    )}
                    <InputP>
                      <label>
                        Cargo<span> *</span>
                      </label>
                      <input
                        {...register("ga_cargo", {
                          required: "O cargo é obrigatório",
                        })}
                        onKeyPress={onlyLettersAndCharacters}
                        type="text"
                        onChange={(e) => {
                          const value = capitalizeFrasal(e.target.value);
                          setValue("ga_cargo", value);
                        }}
                      ></input>
                    </InputP>
                    {errors.ga_cargo && <span>{errors.ga_cargo.message}</span>}
                    <InputP>
                      <label>
                        Telefone<span> *</span>
                      </label>
                      <Controller
                        name="ga_telefone"
                        control={control}
                        rules={{ required: "O telefone é obrigatório" }}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <>
                            <InputMask
                              mask="(99) 99999-9999"
                              maskChar={null}
                              value={value}
                              onChange={(e) => {
                                const justNumbers = e.target.value.replace(
                                  /\D/g,
                                  ""
                                );
                                if (justNumbers.length <= 11) {
                                  onChange(justNumbers);
                                }
                              }}
                            >
                              {(inputProps) => (
                                <input {...inputProps} type="text" />
                              )}
                            </InputMask>
                            {error && <span>{error.message}</span>}
                          </>
                        )}
                      />
                    </InputP>
                    <InputM>
                      <label>
                        Email<span> *</span>
                      </label>
                      <input
                        {...register("ga_email")}
                        defaultValue={dadosGestao?.ga_email}
                        onChange={handleOnChange}
                        type="text"
                      ></input>
                    </InputM>
                    <ModalSubmitButton type="submit">Gravar</ModalSubmitButton>
                  </ConteudoModal>
                </Form>
              </Modal>
            </ContainerModal>
          )}
          {showModalPlano && (
            <ContainerModal>
              <Modal>
                <Form
                  onSubmit={handleSubmit(
                    updatePlano ? handleCadastro : handleAddPlano
                  )}
                >
                  <CloseModalButton
                    onClick={() => {
                      setShowModalPlano(false);
                    }}
                  >
                    X
                  </CloseModalButton>

                  <ConteudoModal>
                    <InputG>
                      <label>
                        Título<span> *</span>
                      </label>
                      <input
                        {...register("plano_titulo", {
                          required: "O título é obrigatório",
                        })}
                        onKeyPress={onlyLettersAndCharacters}
                        type="text"
                        onChange={(e) => {
                          const value = capitalizeFrasal(e.target.value);
                          setValue("plano_titulo", value);
                        }}
                        disabled={planoSituacao === "nao_tem"}
                      ></input>
                    </InputG>
                    {errors.plano_titulo && (
                      <span>{errors.plano_titulo.message}</span>
                    )}
                    <InputP>
                      <label>
                        Ano<span> *</span>
                      </label>
                      <input
                        {...register("plano_ano", {
                          required: "O ano é obrigatório",
                          pattern: {
                            value: /^[0-9]{4}$/,
                            message: "Digite um ano válido com 4 dígitos",
                          },
                        })}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        type="text"
                        maxLength={4}
                        onChange={(e) => {
                          // Remove qualquer caractere que não seja número
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          setValue("plano_ano", value);
                        }}
                        disabled={planoSituacao === "nao_tem"}
                      ></input>
                    </InputP>
                    {errors.plano_ano && (
                      <span>{errors.plano_ano.message}</span>
                    )}

                    <ModalSubmitButton
                      type="submit"
                      disabled={planoSituacao === "nao_tem"}
                      style={{
                        opacity: planoSituacao === "nao_tem" ? 0.5 : 1,
                      }}
                    >
                      Gravar
                    </ModalSubmitButton>
                  </ConteudoModal>
                </Form>
              </Modal>
            </ContainerModal>
          )}
          {showModalParticipacao && (
            <ContainerModal>
              <Modal>
                <Form
                  onSubmit={handleSubmit(
                    updateParticipacao
                      ? updateParticipacaoControleSocial
                      : handleAddParticipacao
                  )}
                >
                  <CloseModalButton
                    onClick={() => {
                      setShowModalParticipacao(false);
                    }}
                  >
                    X
                  </CloseModalButton>

                  <ConteudoModal>
                    <InputG>
                      <label>
                        Título<span> *</span>
                      </label>
                      <input
                        {...register("pcs_titulo", {
                          required: "O título é obrigatório",
                        })}
                        onKeyPress={onlyLettersAndCharacters}
                        type="text"
                        onChange={(e) => {
                          const value = capitalizeFrasal(e.target.value);
                          setValue("pcs_titulo", value);
                        }}
                      ></input>
                    </InputG>
                    {errors.pcs_titulo && (
                      <span>{errors.pcs_titulo.message}</span>
                    )}
                    <InputP>
                      <label>
                        Ano<span> *</span>
                      </label>
                      <input
                        {...register("pcs_ano", {
                          required: "O ano é obrigatório",
                          pattern: {
                            value: /^[0-9]{4}$/,
                            message: "Digite um ano válido com 4 dígitos",
                          },
                        })}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        type="text"
                        maxLength={4}
                        onChange={(e) => {
                          // Remove qualquer caractere que não seja número
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          setValue("pcs_ano", value);
                        }}
                      ></input>
                    </InputP>
                    {errors.pcs_ano && <span>{errors.pcs_ano.message}</span>}

                    <ModalSubmitButton type="submit">Gravar</ModalSubmitButton>
                  </ConteudoModal>
                </Form>
              </Modal>
            </ContainerModal>
          )}
        </DivCenter>
      </MainContent>
    </Container>
  );
}
