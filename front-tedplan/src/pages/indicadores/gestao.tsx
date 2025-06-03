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
} from "../../styles/indicadores";
import Editar from "../../img/editar.png";
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
import { FormModal } from "../../styles/dashboard";
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
  const [presidentesConselho, setPresidentesConselho] = useState([]);
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
    }
  }, [usuario]);

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
      })
      .then((response) => {
        toast.notify(
          "Presidência do Conselho Municipal adicionada com sucesso",
          {
            title: "Sucesso!",
            duration: 7,
            type: "success",
          }
        );
        setShowModalPresidente(false);
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

  async function handleRemoverPresidente({ id }) {
    try {
      await api.delete(`delete-presidencia-conselho-municipal/${id}`);
      toast.notify("Presidente removido com sucesso!", {
        title: "Sucesso!",
        duration: 7,
        type: "success",
      });
      getPresidentesConselho(); // Atualiza a lista após remoção
    } catch (error) {
      toast.notify("Não foi possível remover o presidente!", {
        title: "Erro!",
        duration: 7,
        type: "error",
      });
    }
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

    // formData.append("conselho_ano", data.conselho_ano);
    // formData.append("conselho_arquivo", data.conselho_arquivo[0]);
    // formData.append("conselho_titulo", data.conselho_titulo);

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
        params: { id_municipio: dadosMunicipio?.id_municipio },
      }
    );
    const participacoes = await resParticipacao.data;
    setListParticipacoes(participacoes);
  }
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

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Sets the content of the component.
   *
   * @param {string} content The new content.
   */
  /*******  112199f0-4cb9-446e-8f0a-8ee030697671  *******/
  function handleOnChange(content) {
    setContent(content);
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
        toast.notify("Não foi possivel remover o plano municipal! ", {
          title: "Erro!",
          duration: 7,
          type: "error",
        });
      });
    getRepresentantes();
  }

  async function updateRepresentantesServicos(data) {
    if (!usuario.id_municipio || !data.id_representante_servicos_ga) {
      toast.notify("Dados insuficientes para atualizar!", {
        title: "Erro!",
        duration: 7,
        type: "error",
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
        toast.notify("Representante atualizado com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
        getRepresentantes(); // <-- Atualiza a lista após editar
        setShowModal(false);
        setUpdateRepresentantes(null);
      })
      .catch((error) => {
        toast.notify("Não foi possível atualizar o representante!", {
          title: "Erro!",
          duration: 7,
          type: "error",
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

  async function updatePresidenteConselho(data) {
    console.log("Dados do presidente:", data);
    if (
      !usuario.id_municipio ||
      !data.id_presidencia_conselho_municipal_saneamento_basico
    ) {
      toast.notify("Dados insuficientes para atualizar!", {
        title: "Erro!",
        duration: 7,
        type: "error",
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
        toast.notify("Presidente atualizado com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
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
        toast.notify("Não foi possível atualizar o presidente!", {
          title: "Erro!",
          duration: 7,
          type: "error",
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

  return (
    <Container>
      <ToastContainer></ToastContainer>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuHorizontal municipio={[]}></MenuHorizontal>
      <MenuIndicadores></MenuIndicadores>
      <Sidebar>
        <SidebarItem
          active={activeForm === "gestaoAssociada"}
          onClick={() => setActiveForm("gestaoAssociada")}
        >
          Gestão Associada
        </SidebarItem>
        <SidebarItem
          active={activeForm === "politicaSaneamento"}
          onClick={() => setActiveForm("politicaSaneamento")}
        >
          Política Municipal de Saneamento
        </SidebarItem>
        <SidebarItem
          active={activeForm === "planoSaneamento"}
          onClick={() => setActiveForm("planoSaneamento")}
        >
          Plano Municipal de Saneamento
        </SidebarItem>
        <SidebarItem
          active={activeForm === "conselhoSaneamento"}
          onClick={() => setActiveForm("conselhoSaneamento")}
        >
          Conselho Municipal de Saneamento Básico
        </SidebarItem>
        <SidebarItem
          active={activeForm === "participacaoSocial"}
          onClick={() => setActiveForm("participacaoSocial")}
        >
          Participação e controle social
        </SidebarItem>
        <SidebarItem
          active={activeForm === "saneamentoRural"}
          onClick={() => setActiveForm("saneamentoRural")}
        >
          Saneamento Rural
        </SidebarItem>
        <SidebarItem
          active={activeForm === "comunidadesTradicionais"}
          onClick={() => setActiveForm("comunidadesTradicionais")}
        >
          Comunidades Tradicionais
        </SidebarItem>
      </Sidebar>

      <MainContent>
        <DivCenter>
          <Form onSubmit={handleSubmit(handleCadastro)}>
            <DivFormCadastro active={activeForm === "gestaoAssociada"}>
              <DivTituloForm>Gestão Associada</DivTituloForm>

              <table>
                <tr>
                  <td>
                    <InputG>
                      <label>Nome da associação</label>
                      <input
                        {...register("nome_associacao")}
                        defaultValue={dadosGestao?.ga_nome}
                        onChange={handleOnChange}
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
                        {...register("norma_associacao")}
                        defaultValue={dadosGestao?.ga_norma}
                        onChange={handleOnChange}
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
                        <td style={{ justifyContent: "center" }}>
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
                    ))}
                  </tbody>
                </table>
              </Tabela>

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

            <DivFormCadastro active={activeForm === "politicaSaneamento"}>
              <DivTituloForm>
                Política Municipal de Saneamento Básico
              </DivTituloForm>
              <table>
                <tr>
                  <td>
                    <InputG>
                      <label>Título</label>
                      <input
                        {...register("politica_titulo")}
                        defaultValue={dadosGestao?.politica_titulo}
                        onChange={(e) => {
                          const value = capitalizeFrasal(e.target.value);
                          setValue("politica_titulo", value);
                        }}
                        type="text"
                        //aceita apenas letras e caracteres especiais
                        onKeyPress={onlyLettersAndCharacters}
                      ></input>
                    </InputG>
                  </td>
                  <td>
                    <InputP>
                      <label>Ano</label>
                      <input
                        {...register("politica_ano")}
                        defaultValue={dadosGestao?.politica_ano}
                        onChange={handleOnChange}
                        type="text"
                        //aceita apenas números
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      ></input>
                    </InputP>
                  </td>
                  <td>
                    <InputM>
                      <label>Arquivo</label>
                      <input
                        {...register("politica_arquivo")}
                        type="file"
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

            <DivFormCadastro active={activeForm === "planoSaneamento"}>
              <DivTituloForm>
                Plano Municipal de Saneamento Básico
              </DivTituloForm>
              <table>
                <tr>
                  <td>
                    <InputG>
                      <label>Título</label>
                      <input {...register("plano_titulo")} type="text"></input>
                    </InputG>
                  </td>
                  <td>
                    <InputP>
                      <label>Ano</label>
                      <input {...register("plano_ano")} type="text"></input>
                    </InputP>
                  </td>
                  <td>
                    <InputM>
                      <label>Arquivo</label>
                      <input {...register("plano_arquivo")} type="file"></input>
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
                            <a
                              href={plano.file}
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

            <DivFormCadastro active={activeForm === "conselhoSaneamento"}>
              <DivTituloForm>
                Conselho Municipal de Saneamento Básico
              </DivTituloForm>
              <table>
                <tr>
                  <td>
                    <InputG>
                      <label>Título</label>
                      <input
                        {...register("conselho_titulo")}
                        defaultValue={"Teste"}
                        // onChange={"conselho_titulo"}
                        type="text"
                      ></input>
                    </InputG>
                  </td>
                  <td>
                    <InputP>
                      <label>Ano</label>
                      <input
                        {...register("conselho_ano")}
                        defaultValue={"22"}
                        type="text"
                      ></input>
                    </InputP>
                  </td>
                  <td>
                    <InputM>
                      <label>Arquivo</label>
                      <input
                        {...register("conselho_arquivo")}
                        type="file"
                      ></input>
                    </InputM>
                  </td>
                </tr>
              </table>
              <DivEixo>
                Presidente{" "}
                <span
                  onClick={() => {
                    handleShowModalPresidente();
                  }}
                >
                  Adicionar
                </span>{" "}
              </DivEixo>

              <Tabela style={{ overflow: "scroll" }}>
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
                        <th>Município</th>
                        <th>Ações</th>
                      </tr>
                    )}

                    {conselho?.map((presidente, index) => (
                      <tr role="row" key={index}>
                        <td>
                          {
                            presidente.id_presidencia_conselho_municipal_saneamento_basico
                          }
                        </td>
                        <td>
                          <InputM>{presidente.nome_presidente}</InputM>
                        </td>

                        <td style={{ whiteSpace: "nowrap" }}>
                          {presidente.telefone_presidente}
                        </td>
                        <td>{presidente.email_presidente}</td>
                        <td>{presidente.setor_responsavel}</td>
                        <td
                          style={{
                            whiteSpace: "nowrap",
                          }}
                        >
                          {presidente.integrantes}
                        </td>
                        <td>{presidente.id_municipio}</td>
                        <td>
                          <Actions>
                            <Image
                              title="Editar"
                              onClick={() => handleEditarPresidente(presidente)}
                              src={Editar}
                              alt="Editar"
                              width={25}
                              height={25}
                            />

                            <Image
                              onClick={() =>
                                handleRemoverPresidente({
                                  id: presidente.id_presidencia_conselho_municipal_saneamento_basico,
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

            <DivFormCadastro active={activeForm === "participacaoSocial"}>
              <DivTituloForm>Participação e Controle Social</DivTituloForm>
              <table>
                <tr>
                  <td>
                    <InputG>
                      <label>Titulo</label>
                      <input
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
                  <td>
                    <InputP>
                      <label>Ano</label>
                      <input
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
                  <td>
                    <InputM>
                      <label>Arquivo</label>
                      <input {...register("pcs_arquivo")} type="file"></input>
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

            <DivFormCadastro active={activeForm === "saneamentoRural"}>
              <DivTituloForm>Saneamento Rural</DivTituloForm>
              <DivTextArea>
                <label>Breve Descrição</label>

                <textarea
                  ref={txtArea}
                  {...register("sr_descricao")}
                  defaultValue={
                    dadosGestao?.sr_descricao ? dadosGestao?.sr_descricao : ""
                  }
                  onChange={handleOnChange}
                ></textarea>
              </DivTextArea>

              <SubmitButtonContainer
                style={{
                  bottom: "-50px",
                  right: "-15px",
                }}
              >
                {usuario?.id_permissao !== 4 && (
                  <SubmitButton type="submit">Gravar</SubmitButton>
                )}
              </SubmitButtonContainer>
            </DivFormCadastro>

            <DivFormCadastro active={activeForm === "comunidadesTradicionais"}>
              <DivTituloForm>Comunidades Tradicionais</DivTituloForm>

              <DivTextArea>
                <label>Nome das Comunidades Beneficiadas</label>

                <textarea
                  ref={txtArea}
                  {...register("ct_nomes_comunidades")}
                  defaultValue={
                    dadosGestao?.nomes_comunidades_beneficiadas
                      ? dadosGestao?.nomes_comunidades_beneficiadas
                      : ""
                  }
                  onChange={handleOnChange}
                ></textarea>

                <label>Breve Descrição</label>

                <textarea
                  ref={txtArea}
                  {...register("ct_descricao")}
                  defaultValue={
                    dadosGestao?.ct_descricao ? dadosGestao?.ct_descricao : ""
                  }
                  onChange={handleOnChange}
                ></textarea>
              </DivTextArea>

              <SubmitButtonContainer
                style={{
                  bottom: "-50px",
                  right: "-15px",
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
        </DivCenter>
      </MainContent>
    </Container>
  );
}
