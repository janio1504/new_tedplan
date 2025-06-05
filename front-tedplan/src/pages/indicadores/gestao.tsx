import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-nextjs-toast";
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
} from "../../styles/indicadores";

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
import { DivFormCadastro, MainContent, SidebarItem } from "@/styles/esgoto-indicadores";
import { DivTitulo } from "@/styles/drenagem-indicadores";


const InputMask = require("react-input-mask");

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
}
interface IPlanos {
  id_plano_municipal: string;
  titulo: string;
  ano: string;
  id_arquivo: string;
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
  const [conselho, setConselho] = useState(null);
  const [conselhoMunicipal, setConselhoMunicipal] = useState(null);
  const [isClient, setIsClient] = useState(null);
  const [updatePresidente, setUpdatePresidente] = useState(null); 
  
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm();

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
    formState: { errors: errorsConselho},
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
  const [listParticipacoes, setListParticipacoes] = useState(null);
  const [ShowModalPresidente, setShowModalPresidente] = useState(false);
  const [activeForm, setActiveForm] = useState("gestaoAssociada");
  const [content, setContent] = useState("");
  const [listPoliticas, setPoliticas] = useState(null);
  const [listPlanos, setPlanos] = useState(null);
  const [updateRepresentantes, setUpdateRepresentantes] = useState(null);
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
    const res = await api.get(`get-conselhos-municipais/${usuario?.id_municipio}`, {
      params: { id_municipio: usuario?.id_municipio },
    });
    const conselhos = res.data;
    if (conselhos) {
      const resConselhoMunicipal = await Promise.all(
        conselhos.map(async (p) => {
          const file = await api
            .get("getFile", {
              params: { id: p.id_arquivo },
              responseType: "blob",
            })
            .then((response) => URL.createObjectURL(response.data))
            .catch((error) => {
              console.log(error);
            });
          return { ...p, file };
        })
      );
      setConselhoMunicipal(resConselhoMunicipal);
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
      params: { id_municipio: usuario.id_municipio },
    });

    setGestao(resGestao.data[0]);
  }
  async function getPresidentesConselho() {
    if (!usuario?.id_municipio) return;
    try {
      const resPresidentes = await api.get(
        `get-all-presidencia-conselho-municipal/${usuario.id_municipio}`
      );
      setConselho(resPresidentes.data);
    } catch (error) {
      toast.notify("Erro ao buscar presidentes do conselho!", {
        title: "Erro!",
        duration: 7,
        type: "error",
      });
      setConselho([]);
    }
  }

// ------------- Funções ADD -------------
 
  async function handleAddPresidente(data) {
    if (!usuario.id_municipio) {
      toast.notify("Não existe Município, entre novamente no sistema! ", {
        title: "Erro!",
        duration: 7,
        type: "error",
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
        id_conselho_municipal_saneamento_basico: data.id_conselho_municipal_saneamento_basico || null,
      })
      .then((response) => {
          toast.notify("Presidência do Conselho Municipal adicionada com sucesso", {
            title: "Sucesso!",
          duration: 7,
          type: "success",
        });
        setShowModalPresidente(false);
        reset();
        return response;
      })
      .catch((error) => {
        toast.notify("Erro ao adicionar a Presidência do Conselho Municipal", {
          title: "Erro!",
          duration: 7,
          type: "error",
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

    await api.post("addGestaoIndicadores", formData)
      .then(() => {
        toast.notify("Gestão Associada cadastrada com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
        resetGestao();
        getGestao();
        getRepresentantes();
      })
      .catch(() => {
        toast.notify("Erro ao cadastrar Gestão Associada!", {
          title: "Erro!",
          duration: 7,
          type: "error",
        });
      });

      console.log("Dados enviados:", data);
  }
  async function handleAddConselhoMunicipal(data){
    if (!usuario.id_municipio) {
    toast.notify("Não existe Município, entre novamente no sistema!", {
      title: "Erro!",
      duration: 7,
      type: "error",
    });
    signOut();
    return;
  }

    const formData = new FormData();
    formData.append("titulo", data.titulo || "");
    formData.append("ano", data.ano || "");
    formData.append("id_municipio", usuario.id_municipio);
    formData.append("arquivo", data.arquivo[0]);
  

  await api.post("create-conselho-municipal", formData)
    .then(() => {
      toast.notify("Conselho Municipal cadastrado com sucesso!", {
        title: "Sucesso!",
        duration: 7,
        type: "success",
      });
      getConselhoMunicipal(); 
      resetConselho();
    })
    .catch(() => {
      toast.notify("Erro ao cadastrar o Conselho Municipal!", {
        title: "Erro!",
        duration: 7,
        type: "error",
      });
      console.log(data)
    });
   
  }
  async function handleAddPolitica(data){
  if (usuario?.id_permissao === 4) return;

    const formData = new FormData();
    formData.append("id_municipio", usuario.id_municipio);
    formData.append("politica_titulo", data.politica_titulo || "");
    formData.append("politica_ano", data.politica_ano || "");
    formData.append("politica_arquivo", data.politica_arquivo[0] || "");

    await api.post("addGestaoIndicadores", formData)
      .then(() => {
        toast.notify("Política Municipal de Saneamento cadastrada com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
        resetPolitica();
        getPoliticas();
      })
      .catch(() => {
        toast.notify("Erro ao cadastrar Política Municipal de Saneamento!", {
          title: "Erro!",
          duration: 7,
          type: "error",
        });
      });

      console.log("Dados enviados:", data);
  }
  async function handleAddRepresentante(data) {
    if (!usuario.id_municipio) {
      toast.notify("Não existe Município, entre novamente no sistema! ", {
        title: "Erro!",
        duration: 7,
        type: "error",
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
        toast.notify("Representante cadastrado com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
        setShowModal(false);
        return response;
      })
      .catch((error) => {
        toast.notify("Não foi possivel cadastrar o representante! ", {
          title: "Erro!",
          duration: 7,
          type: "error",
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

    await api.post("addGestaoIndicadores", formData)
      .then(() => {
        toast.notify("Plano Municipal de Saneamento cadastrada com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
        resetPlano();
        getPlanos();
      })
      .catch(() => {
        toast.notify("Erro ao cadastrar Plano Municipal de Saneamento!", {
          title: "Erro!",
          duration: 7,
          type: "error",
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

    await api.post("addGestaoIndicadores", formData)
      .then(() => {
        toast.notify("Participação e Controle Social de Saneamento cadastrado com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
        resetParticipacao();
        getParticipacoes();
      })
      .catch(() => {
        toast.notify("Erro ao cadastrar Participação e Controle Social!", {
          title: "Erro!",
          duration: 7,
          type: "error",
        });
      });

      console.log("Dados enviados:", data);
  }
  async function handleAddSaneamentoRural(data) {
  if (usuario?.id_permissao === 4) return;

    const formData = new FormData();

    formData.append("sr_descricao", data.sr_descricao || "");
    formData.append("id_municipio", usuario.id_municipio);

    await api.post("addGestaoIndicadores", formData)
      .then(() => {
        toast.notify("Descrição Saneamento Rural cadastrada com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
        resetSR();
        // getSR();
      })
      .catch(() => {
        toast.notify("Erro ao cadastrar Descrição Saneamento Rural!", {
          title: "Erro!",
          duration: 7,
          type: "error",
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

    await api.post("addGestaoIndicadores", formData)
      .then(() => {
        toast.notify("Comunidades Tradicionais cadastrada com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
        resetCT();
        // getCT();
      })
      .catch(() => {
        toast.notify("Erro ao cadastrar Comunidades Tradicionais!", {
          title: "Erro!",
          duration: 7,
          type: "error",
        });
      });

      console.log("Dados enviados:", data);
  }

// ------------- Funções DELETE -------------

  async function handleRemoverPresidente({id}) {
    try {
      await api.delete(`delete-presidencia-conselho-municipal/${id}`);
      toast.notify("Presidente removido com sucesso!", {
        title: "Sucesso!",
        duration: 7,
        type: "success",
      });
      getPresidentesConselho();
    } catch (error) {
      toast.notify("Não foi possível remover o presidente!", {
        title: "Erro!",
        duration: 7,
        type: "error",
      });
    }
  }
  async function handleRemoverParticipacao({ id, id_arquivo }) {
    await api
      .delete("remover-participacao", {
        params: { id: id, id_arquivo: id_arquivo },
      })
      .then((response) => {
        toast.notify("Participacão removido com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
      })
      .catch((error) => {
        toast.notify("Não foi possivel remover a participação! ", {
          title: "Erro!",
          duration: 7,
          type: "error",
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
        toast.notify("Política removida com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
      })
      .catch((error) => {
        toast.notify("Não foi possivel remover a politica municipal! ", {
          title: "Erro!",
          duration: 7,
          type: "error",
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
        toast.notify("Plano removido com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
      })
      .catch((error) => {
        toast.notify("Não foi possivel remover o plano municipal! ", {
          title: "Erro!",
          duration: 7,
          type: "error",
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
        toast.notify("Representante removido com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
      })
      .catch((error) => {
        toast.notify("Não foi possivel remover o representante!", {
          title: "Erro!",
          duration: 7,
          type: "error",
        });
      });
    getRepresentantes();
  }
  async function handleRemoverConselho({id}){
    await api
      .delete(`delete-conselho-municipal/${id}`, )
      .then((response) => {
        toast.notify("Conselho Municipal removido com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
      })
      .catch((error) => {
        toast.notify("Não foi possivel remover o conselho municipal! ", {
          title: "Erro!",
          duration: 7,
          type: "error",
        });
      });
    getConselhoMunicipal();
  }

// ------------- Funções UPDATE -------------


// ------------------------------------------
  

async function handleSignOut() {
    signOut();
  }
  function handleShowModal() {
    setShowModal(true);
  }
   function handleCloseModal() {
    setShowModal(false);
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

    formData.append("plano_ano", data.plano_ano);
    formData.append("plano_arquivo", data.plano_arquivo[0]);
    formData.append("plano_titulo", data.plano_titulo);

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
        toast.notify("Representante cadastrado com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
        console.log(data);
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
        });
      })
      .catch((error) => {
        toast.notify("Não foi possivel cadastrar o representante! ", {
          title: "Erro!",
          duration: 7,
          type: "error",
        });
      });

    const resParticipacao = await apiClient.get(
      "getParticipacaoControleSocial",
      {
        params: {id_municipio: usuario.id_municipio },
      }
    );
    const participacoes = await resParticipacao.data;
    setListParticipacoes(participacoes);

  }




    if (!usuario?.id_municipio) {
    return null;
  }

  return (
    <Container>
      <ToastContainer></ToastContainer>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuHorizontal
        municipio={[]}
      ></MenuHorizontal>
      <MenuIndicadores></MenuIndicadores>
      <Sidebar>
        <SidebarItem active={activeForm === "gestaoAssociada"}
        onClick={() => setActiveForm("gestaoAssociada")}
        >
          Gestão Associada
        </SidebarItem>
        <SidebarItem active={activeForm === "politicaSaneamento"}
        onClick={() => setActiveForm("politicaSaneamento")}
        >
          Política Municipal de Saneamento
        </SidebarItem>
        <SidebarItem active={activeForm === "planoSaneamento"}
        onClick={() => setActiveForm("planoSaneamento")}
        >
          Plano Municipal de Saneamento
        </SidebarItem>
        <SidebarItem active={activeForm === "conselhoSaneamento"}
        onClick={() => setActiveForm("conselhoSaneamento")}
        >
          Conselho Municipal de Saneamento Básico
        </SidebarItem>
        <SidebarItem active={activeForm === "participacaoSocial"}
        onClick={() => setActiveForm("participacaoSocial")}
        >
          Participação e controle social
        </SidebarItem>
        <SidebarItem active={activeForm === "saneamentoRural"}
        onClick={() => setActiveForm("saneamentoRural")}
        >
          Saneamento Rural
        </SidebarItem>
        <SidebarItem active={activeForm === "comunidadesTradicionais"}
        onClick={() => setActiveForm("comunidadesTradicionais")}
        >
          Comunidades Tradicionais
        </SidebarItem>
      </Sidebar>
    <MainContent>
      <DivCenter>
        {activeForm === "gestaoAssociada" && (
          <Form onSubmit={handleSubmitGestao(handleAddGestaoAssociada)}>
          <DivFormCadastro active>
            <DivTituloForm>Gestão Associada</DivTituloForm>
            
            <table>
              <tr>
                <td>
                  <InputG>
                    <label>Nome da associação</label>
                    <input
                      {...registerGestao("nome_associacao")}
                      required
                      defaultValue={dadosGestao?.ga_nome}
                      type="text"
                    ></input>
                  </InputG>
                </td>
                <td>
                  <InputG>
                    <label>
                      Norma da associação<span> *</span>
                    </label>
                    <input
                      {...registerGestao("norma_associacao")}
                      defaultValue={dadosGestao?.ga_norma}
                      required
                      type="text"
                    ></input>
                  </InputG>
                </td>
              </tr>
            </table>
            <DivEixo>
              Representantes{" "}
              <span
                onClick={() => {
                  handleShowModal();
                }}
              >
                Adicionar
              </span>{" "}
            </DivEixo>

            <Tabela>
              <table cellSpacing={0}>
                <tbody>
                  {representantes && (
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Cargo</th>
                      <th>Telefone</th>
                      <th>email</th>
                      <th>Ações</th>
                    </tr>
                  )}

                  {representantes?.map((representante, index) => (
                    <tr role="row" key={index}>
                      <td>{representante.id_representante_servicos_ga}</td>
                      <td>
                        <InputM>{representante.nome}</InputM>
                      </td>
                      <td>{representante.cargo}</td>
                      <td>{representante.telefone}</td>
                      <td>{representante.email}</td>
                      <td  style={{ justifyContent: "center"}}>
                        <Actions>

                          {/* <Image
                            title="Editar"
                            // onClick={() =>
                            //  updat
                            // }

                            src={Editar}
                            alt="Editar"
                            width={25}
                            height={25}
                          />
                         */}
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
                  ))}
                </tbody>
              </table>
            </Tabela>


            <SubmitButtonContainer style={{
              bottom: "-50px",
              right: "-10px"
            }}>
              <SubmitButton type="submit">Gravar</SubmitButton>
            </SubmitButtonContainer>

          </DivFormCadastro>
        </Form>  
        )}

        {activeForm === "politicaSaneamento" && (
        <Form onSubmit={handleSubmitPolitica(handleAddPolitica)}>
          <DivFormCadastro active>
            <DivTituloForm>
              Política Municipal de Saneamento Básico
            </DivTituloForm>
            <table>
              <tr>
                <td>
                  <InputG>
                    <label>Título</label>
                    <input
                      {...registerPolitica("politica_titulo")}
                      defaultValue={dadosGestao?.politica_titulo}
                      onChange={(e) => {
                        const value = capitalizeFrasal(e.target.value);
                        setValue("politica_titulo", value);
                      }}
                      type="text"
                      //aceita apenas letras e caracteres especiais
                      onKeyPress={onlyLettersAndCharacters}
                      required
                      style={{ textTransform: "capitalize" }}
                    ></input>
                  </InputG>
                </td>
                <td>
                  <InputP>
                    <label>Ano</label>
                    <input
                      {...registerPolitica("politica_ano")}
                      defaultValue={dadosGestao?.politica_ano}
                      onChange={handleOnChange}
                      type="text"
                      //aceita apenas números
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      required
                    ></input>
                  </InputP>
                </td>
                <td>
                  <InputM>
                    <label>Arquivo</label>
                    <input
                      {...registerPolitica("politica_arquivo")}
                      type="file"
                      required
                    ></input>
                  </InputM>
                </td>
              </tr>
            </table>

            <DivEixo>Atualizações</DivEixo>

            <Tabela>
              <table cellSpacing={0}>
                <tbody>
                  {listPoliticas && (
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Ano</th>
                      <th>Ações</th>
                    </tr>
                  )}
                  {listPoliticas?.map((politica, index) => (
                    <tr key={index}>
                      <td>{politica.id_politica_municipal}</td>
                      <td>
                        <InputG>{politica.titulo}</InputG>
                      </td>
                      <td>{politica.ano}</td>
                      <td>
                        <Actions>
                          <a
                            href={politica.file}
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
                            onClick={() => {
                              handleRemoverPolitica({
                                id: politica.id_politica_municipal,
                                id_arquivo: politica.id_arquivo,
                              });
                            }}
                          />
                        </Actions>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Tabela>

          

            <SubmitButtonContainer style={{
              bottom: "-50px",
              right: "-10px"
            }}>
              {usuario?.id_permissao !== 4 && <SubmitButton type="submit">Gravar</SubmitButton>}
            </SubmitButtonContainer>

          </DivFormCadastro>
        </Form>
        )}

        {activeForm === "planoSaneamento" &&(
        <Form onSubmit={handleSubmitPlano(handleAddPlano)}>
          <DivFormCadastro active>
            <DivTituloForm>Plano Municipal de Saneamento Básico</DivTituloForm>
            <table>
              <tr>
                <td>
                  <InputG>
                    <label>Título</label>
                    <input {...registerPlano("plano_titulo")} type="text"
                    required
                    style={{textTransform: "capitalize"}}
                    ></input>
                  </InputG>
                </td>
                <td>
                  <InputP>
                    <label>Ano</label>
                    <input {...registerPlano("plano_ano")} type="text"
                    onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      required
                    ></input>
                  </InputP>
                </td>
                <td>
                  <InputM>
                    <label>Arquivo</label>
                    <input {...registerPlano("plano_arquivo")} type="file"
                    required></input>
                  </InputM>
                </td>
              </tr>
            </table>

            <DivEixo>Atualizações</DivEixo>
            <Tabela>
              <table cellSpacing={0}>
                <tbody>
                  {listPlanos && (
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Ano</th>
                      <th>Ações</th>
                    </tr>
                  )}

                  {listPlanos?.map((plano, index) => (
                    <tr key={index}>
                      <td>{plano.id_plano_municipal}</td>
                      <td>
                        <InputG>{plano.titulo}</InputG>
                      </td>
                      <td>{plano.ano}</td>
                      <td>
                        <Actions>
                          <a href={plano.file} rel="noreferrer" target="_blank">
                            <FaFilePdf></FaFilePdf>
                          </a>
                          <Image
                            src={Excluir}
                            alt="Excluir"
                            width={25}
                            height={25}
                            onClick={() => {
                              handleRemoverPlano({
                                id: plano.id_plano_municipal,
                                id_arquivo: plano.id_arquivo,
                              });
                            }}
                          />
                        </Actions>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Tabela>
            <SubmitButtonContainer style={{
              bottom: "-50px",
              right: "-10px"
            }}>
              {usuario?.id_permissao !== 4 && <SubmitButton type="submit">Gravar</SubmitButton>}
            </SubmitButtonContainer>
          </DivFormCadastro>
        </Form>
        )}

        {activeForm === "conselhoSaneamento" && (
        <Form onSubmit={handleSubmitConselho(handleAddConselhoMunicipal)}>  
          <DivFormCadastro active
          // style={{maxWidth: "1045px"}}
          > 
            <DivTituloForm>
              Conselho Municipal de Saneamento Básico
            </DivTituloForm>
            
            <table style={{width: '100%', display: 'flex', justifyContent: "center"}}>
              <tr>
                <td>
                  <InputG>
                    <label>Título</label>
                    <input 
                    {...registerConselho("titulo")} type="text"
                    required  
                    style={{textTransform: "capitalize"}}
                    ></input>
                  </InputG>
                </td>
                <td>
                    <InputP>
                      <label>Ano</label>
                      <input 
                      {...registerConselho("ano")} type="text"
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      required
                      ></input>
                    </InputP>
                </td>
                <td>
                  <InputM>
                    <label>Arquivo</label>
                    <input
                    {...registerConselho("arquivo")}
                     type="file"
                    required
                    ></input>
                  </InputM>
                </td>
              </tr>
            </table>

            <DivEixo style={{justifyContent: "space-between", alignItems: "center"}}>
              Presidente{" "}
               <ButtonAdicionarPresidente
               onClick={handleShowModalPresidente}
               disabled={!conselhoMunicipal || conselhoMunicipal.length === 0}
               >
                Adicionar Presidente
              </ButtonAdicionarPresidente>
            </DivEixo>

            <Tabela style={{overflow: 'auto'}}>
              <table cellSpacing={0}>
                <tbody>
                  {conselho && (
                    <tr>
                      <th>ID</th>
                      <th>Presidente</th>
                      <th>Telefone</th>
                      <th>email</th>
                      <th>Setor Responsável</th>
                      <th>Integrantes</th>
                      {/* <th>Município</th> */}
                      <th>Ações</th>
                    </tr>
                  )}

                  {conselho?.map((presidente, index) => (
                    <tr role="row" key={index}>
                      <td>{presidente.id_presidencia_conselho_municipal_saneamento_basico}</td>
                      <td>
                        <InputM>{presidente.nome_presidente}</InputM>
                      </td>
                        
                      <td style={{whiteSpace: 'nowrap'}} >
                        {presidente.telefone_presidente}</td>
                      <td>{presidente.email_presidente}</td>
                      <td>{presidente.setor_responsavel}</td>
                      <td
                      style={{
                            whiteSpace: 'nowrap'}}>
                      {presidente.integrantes}</td>
                      {/* <td>{presidente.id_municipio}</td> */}
                      <td>
                        <Actions>
                          {/* <Image
                            title="Editar"
                            onClick={() => editPresidente(presidente)}
                            src={Editar}
                            alt="Editar"
                            width={25}
                            height={25}
                          /> */}
                          
                          <Image
                            onClick={() =>
                              handleRemoverPresidente(
                                {id:presidente.id_presidencia_conselho_municipal_saneamento_basico,}
                              )
                            }
                            src={Excluir}
                            alt="Excluir"
                            width={25}
                            height={25}
                          />
                        </Actions>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Tabela>

            <DivEixo style={{justifyContent: "space-between", alignItems: "center"}}>
              Atualizações
            </DivEixo>
            <Tabela>
            <table cellSpacing={0}>
                <tbody>
                  {conselhoMunicipal && (
                    <tr>
                      <th>ID</th>
                      <th>Título</th>
                      <th>Ano</th>
                      <th>Ações</th>
                    </tr>
                  )}

                  {conselhoMunicipal?.map((conselho, index) => (
                    <tr key={index}>
                      <td>{conselho.id_conselho_municipal_saneamento_basico}</td>
                      <td>
                        <InputG>{conselho.titulo}</InputG>
                      </td>
                      <td>{conselho.ano}</td>
                      <td>
                        <Actions>
                          <a href={conselho.file} rel="noreferrer" target="_blank">
                            <FaFilePdf></FaFilePdf>
                          </a>
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
                  ))}
                </tbody>
              </table>
             </Tabela>


            
          

            <SubmitButtonContainer style={{
              bottom: "-50px",
              right: "-10px"
            }}>
              {usuario?.id_permissao !== 4 && <SubmitButton type="submit">Gravar</SubmitButton>}
            </SubmitButtonContainer>
            
          </DivFormCadastro>
        </Form>
        )}

        {activeForm === "participacaoSocial" && (
        <Form onSubmit={handleSubmitParticipacao(handleAddParticipacao)}>
          <DivFormCadastro active>
            <DivTituloForm>Participação e Controle Social</DivTituloForm>
            <table>
              <tr>
                <td>
                  <InputG>
                    <label>Titulo</label>
                    <input
                      {...registerParticipacao("pcs_titulo")}
                      onChange={(e) => {
                        const value = capitalizeFrasal(e.target.value);
                        setValue("pcs_titulo", value);
                      }}
                      type="text"
                      onKeyPress={onlyLettersAndCharacters}
                      style={{ textTransform: "capitalize" }}
                      required
                    ></input>
                  </InputG>
                </td>
                <td>
                  <InputP>
                    <label>Ano</label>
                    <input
                      {...registerParticipacao("pcs_ano")}
                      type="text"
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      required
                    ></input>
                  </InputP>
                </td>
                <td>
                  <InputM>
                    <label>Arquivo</label>
                    <input {...registerParticipacao("pcs_arquivo")}
                    required
                    type="file"></input>
                  </InputM>
                </td>
              </tr>
            </table>

            <DivEixo>Atualizações</DivEixo>

            <Tabela>
              <table cellSpacing={0}>
                <tbody>
                  {listParticipacoes && (
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Ano</th>
                      <th>Ações</th>
                    </tr>
                  )}

                  {listParticipacoes?.map((participacao, index) => (
                    <tr key={index}>
                      <td>{participacao.id_participacao_controle_social}</td>
                      <td>
                        <InputG>{participacao.titulo}</InputG>
                      </td>
                      <td>{participacao.ano}</td>
                      <td>
                        <Actions>
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
                  ))}
                </tbody>
              </table>
            </Tabela>

          {/* </DivFormCadastro>
          <DivForm> */}
            <SubmitButtonContainer style={{
              bottom: "-50px",
              right: "-10px"
            }}>
              {usuario?.id_permissao !== 4 && <SubmitButton type="submit">Gravar</SubmitButton>}
            </SubmitButtonContainer>
          </DivFormCadastro>
         </Form> 
        )}

        {activeForm === "saneamentoRural" && (
       <Form onSubmit={handleSubmitSR(handleAddSaneamentoRural)}>
          <DivFormCadastro
          style={{minWidth: "1045px", minHeight: "380px"}}
          active>
          
            <DivTituloForm style={{display: "flex",alignItems: "center", gap: "10px"}}>
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
                    Insira informações sobre o saneamento rural, como por exemplo:
                    informações sobre população rural, situação atual dos serviços de saneamento,
                    aspectos ambientais, etc.
                  </TooltipText>
                </Tooltip>
              </Actions>
              </DivTituloForm>
            <DivTextArea>
              <label>Breve Descrição</label>
              <textarea
                ref={txtArea}
                {...registerSR("sr_descricao")}
                onChange={handleOnChange}
                required
              ></textarea>
            </DivTextArea>

            <SubmitButtonContainer style={{
              bottom: "-50px",
              right: "-10px"
            }}>
              {usuario?.id_permissao !== 4 && <SubmitButton type="submit">Gravar</SubmitButton>}
            </SubmitButtonContainer>
          </DivFormCadastro>
        </Form>
        )}

        {activeForm === "comunidadesTradicionais" && (
        <Form onSubmit={handleSubmitCT(handleAddComunidadesTradicionais)}>
          <DivFormCadastro 
          style={{minWidth: "1045px", height: "658px"}}
          active={activeForm === "comunidadesTradicionais"}>
          <DivTituloForm style={{display: "flex", alignItems: "center", gap: "10px"}}>Comunidades Tradicionais
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
                    Insira informações sobre as comunidades tradicionais, como por exemplo:
                    condições da infraestrutura e serviços de saneamento nessas comunidades.
                  </TooltipText>
                </Tooltip>
              </Actions>

          </DivTituloForm>

            <DivTextArea>
              <label>Nome das Comunidades Beneficiadas</label>

              <textarea
                ref={txtArea}
                {...registerCT("ct_nomes_comunidades")}
                required
              ></textarea>

              <label>Breve Descrição</label>

              <textarea
                ref={txtArea}
                {...registerCT("ct_descricao")}
                required
              ></textarea>
            </DivTextArea>

        
          

            <SubmitButtonContainer style={{
              bottom: "-50px",
              right: "-10px"
            }}>
              {usuario?.id_permissao !== 4 && <SubmitButton type="submit">Gravar</SubmitButton>}
            </SubmitButtonContainer>

          </DivFormCadastro>
        </Form>  
        )}

        {ShowModalPresidente && (
          <ContainerModal>
            <Modal>
              <Form onSubmit={handleSubmit(handleAddPresidente)}>
                <CloseModalButton
                  onClick={() => {
                    handleCloseModalPresidente();
                  }}
                >
                  X
                </CloseModalButton>
                <ConteudoModal>

                  <DivTituloForm
                  style={{marginTop: "-25px", width: "1370px", marginLeft: "-25px"}}>Adicionar presidente do conselho
                  </DivTituloForm>

                  {conselhoMunicipal && conselhoMunicipal.length === 1 && (
                    <input
                      type="hidden"
                      {...register("id_conselho_municipal_saneamento_basico")}
                      value={conselhoMunicipal[0].id_conselho_municipal_saneamento_basico}
                      readOnly
                    />
                  )}

                  <InputP>
                  <input
                      type="hidden"
                      {...register("id_presidencia_conselho_municipal_saneamento_basico")}
                    />
                  </InputP>
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
                   {errors.nome_presidente && <span>{errors.nome_presidente.message}</span>}
                  <InputP>
                    <label>
                      Telefone<span> *</span>
                    </label>
                    <Controller
                      name="telefone_presidente"
                      control={control}
                      rules={{ required: "O telefone é obrigatório" }}
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <>
                          <InputMask
                            mask="(99) 99999-9999"
                            maskChar={null}
                            value={value}
                            onChange={e => onChange(e.target.value)}
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
                  {errors.telefone_presidente && <span>{errors.telefone_presidente.message}</span>}
                  <InputP>
                    <label>
                     Email<span> *</span>
                    </label>
                    <input
                      {...register("email_presidente", {required: "O email é obrigatório"})}
                      // defaultValue={dadosGestao?.ga_telefone}
                      onChange={handleOnChange}
                      type="text"
                    ></input>
                  </InputP>
                  {errors.email_presidente && <span>{errors.email_presidente.message}</span>}
                  <InputM>
                    <label>
                      Setor Responsável<span> *</span>
                    </label>
                    <input
                      {...register("setor_responsavel", {required: "O setor é obrigatório"})}
                      onKeyPress={onlyLettersAndCharacters}
                      style={{ textTransform: "capitalize" }}
                      onChange={(e) => {
                        const value = toTitleCase(e.target.value);
                        setValue("setor_responsavel", value)}}
                      type="text"
                    ></input>
                  </InputM>
                  {errors.setor_responsavel && <span>{errors.setor_responsavel.message}</span>}
                  
                  
                  <InputG>
                    <label>
                     Integrantes<span> *</span>
                    </label>
                    <input
                      {...register("integrantes", {required: "Os integrantes são obrigatórios"})}
                      style={{ textTransform: "capitalize" }}
                      onChange={(e) => {
                        const value = toTitleCase(e.target.value);
                        setValue("integrantes", value);}}
                      type="text"
                    ></input>
                  </InputG>
                  {errors.integrantes && <span>{errors.integrantes.message}</span>}
                  

                  <ModalSubmitButton type="submit">Gravar</ModalSubmitButton>
                </ConteudoModal>
              </Form>
            </Modal>
          </ContainerModal>
        )}
        
        {showModal && (
          <ContainerModal>
            <Modal>
              <Form onSubmit={handleSubmit(handleAddRepresentante)}>
                <CloseModalButton
                  onClick={() => {
                    handleCloseModal();
                  }}
                >
                  X
                </CloseModalButton>

                <ConteudoModal>
                  <DivTituloForm
                  style={{marginTop: "-25px", width: "1370px", marginLeft: "-25px"}}>Adicionar representante
                  </DivTituloForm>
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
                      style={{ textTransform: "capitalize" }}
                      onChange={(e) => {
                        const value = toTitleCase(e.target.value);
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
                        const value = toTitleCase(e.target.value);
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
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <>
                          <InputMask
                            mask="(99) 99999-9999"
                            maskChar={null}
                            value={value}
                            onChange={e => onChange(e.target.value)}
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
      </DivCenter>
      </MainContent>
    </Container>
  );
}