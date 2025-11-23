/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { parseCookies } from "nookies";
import { AuthContext } from "../contexts/AuthContext";
import { getAPIClient } from "../services/axios";
import api from "../services/api";
import Router from "next/router";
import HeadIndicadores from "../components/headIndicadores";
import MenuSuperior from "../components/head";
import {
  FaSearch,
  FaDatabase,
  FaHome,
  FaSignOutAlt,
  FaRegTimesCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "suneditor/dist/css/suneditor.min.css";
import Sidebar from "../components/Sidebar";
import { getData } from "./api/post";

import {
  Container,
  FormModal,
  ConfirmButton,
  CancelButton,
  Footer,
  DivCenter,
  BotaoVisualizar,
  BotaoEditar,
  BotaoRemover,
  ContainerModal,
  Modal,
  CloseModalButton,
  ConteudoModal,
  TituloModal,
  ImagemModal,
  TextoModal,
  SubmitButton,
  ConfirmModal,
  DivMenuTitulo,
  MenuMunicipioItem,
  BotaoAdicionar,
} from "../styles/dashboard";
import { useForm } from "react-hook-form";
import { BodyDashboard } from "@/styles/dashboard-original";

type INorma = {
  id_norma: string;
  titulo: string;
  id_eixo: string;
  id_tipo_norma: string;
  id_escala: string;
  escala: string;
  eixo: string;
  tipo_norma: string;
  id_arquivo: string;
  id_imagem: string;
  imagem: string;
  arquivo: string;
};

interface IEscalas {
  id_escala: string;
  nome: string;
}

interface IEixos {
  id_eixo: string;
  nome: string;
}

interface ITipoNorma {
  id_tipo_norma: string;
  nome: string;
}

interface NormasProps {
  normas: INorma[];
  eixos: IEixos[];
  escala: IEscalas[];
  tipoNorma: ITipoNorma[];
}

export default function Postagens({ normas }: NormasProps) {
  const { register, handleSubmit, reset } = useForm();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalUpdateVisible, setModalUpdateVisible] = useState(false);
  const [isModalConfirm, setModalConfirm] = useState(false);
  const [isNorma, setNorma] = useState<INorma | any>(normas);
  const [imagem, setImagem] = useState<String | ArrayBuffer>(null);
  const [arquivo, setArquivo] = useState<String | any>(null);
  const [idNorma, setIdNorma] = useState(null);
  const [idImagem, setIdImagem] = useState(null);
  const [idArquivo, setIdArquivo] = useState(null);
  const [normasList, setNormasList] = useState<INorma[]>(normas || []);
  const [searchTerm, setSearchTerm] = useState("");
  const { signOut} = useContext(AuthContext);

  useEffect(() => {}, [0]);

  async function handleShowModal(id_imagem, id_norma) {
    if (id_imagem) {
      await api({
        method: "GET",
        url: "getImagem",
        params: { id: id_imagem },
        responseType: "blob",
      })
        .then((response) => {
          setImagem(URL.createObjectURL(response.data));
        })
        .catch(() => {
          setImagem(null);
        });
    }

    setIdNorma(id_norma);
    setIdImagem(id_imagem);

    setModalVisible(true);
  }

  async function handleShowUpdateModal(id_arquivo, id_norma) {
    if (id_arquivo) {
      await api({
        method: "GET",
        url: "getFile",
        params: { id: id_arquivo },
        responseType: "blob",
      })
        .then((response) => {
          setArquivo(URL.createObjectURL(response.data));
        })
        .catch(() => {
          setArquivo(null);
        });
    }

    if (id_norma) {
      const n = await api.get("getNorma", { params: { id_norma: id_norma } });
      const norma = n.data.map((r: INorma) => {
        return r;
      });

      setNorma(norma[0]);
    }

    setModalUpdateVisible(true);
  }

  function handleCloseModal() {
    Router.reload();
    setModalVisible(false);
  }

  function handleOpenConfirm({ id_norma, id_imagem, id_arquivo }) {
    setIdNorma(id_norma);
    setIdImagem(id_imagem);
    setIdArquivo(id_arquivo);
    setModalConfirm(true);
  }

  function handleCloseConfirm() {
    setModalConfirm(false);
  }

  async function handleUpdateNorma(data: INorma) {
    const formData = new FormData();

    formData.append("arquivo", data.arquivo[0]);
    formData.append("titulo", data.titulo);
    formData.append("id_arquivo", data.id_arquivo);
    formData.append("id_norma", data.id_norma);
    const resNorma = await api
      .post("updateNorma", formData, {
        headers: {
          "Content-Type": `multipart/form-data`,
        },
      })
      .then((response) => {
        toast.success("Dados gravados com sucesso!", { position: "top-right", autoClose: 5000 });
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }

  async function handleRemoverNorma() {
    const resDelete = await api
      .delete("deleteNorma", {
        params: {
          id_norma: idNorma,
          id_imagem: idImagem,
          id_arquivo: idArquivo,
        },
      })
      .then((response) => {
        toast.success("Norma removida com sucesso!", { position: "top-right", autoClose: 5000 });
        setModalConfirm(false);
        Router.push("/listarNormas");
      })
      .catch((error) => {
        toast.error("Aconteceu um erro!", { position: "top-right", autoClose: 5000 });
        setModalConfirm(false);
        Router.push("/listarNormas");
      });
  }

  function handleAddNorma() {
    Router.push("/addNorma");
  }

  async function handleUpdateImagem(data: INorma) {
    const apiClient = getAPIClient();
    const formData = new FormData();

    formData.append("imagem", data.imagem[0]);
    formData.append("id_norma", data.id_norma);

    const res = await apiClient
      .post("updateImagemNorma", formData, {
        headers: {
          "Content-Type": `multipart/form-data=${formData}`,
        },
      })
      .then((response) => {
        toast.success("Dados gravados com sucesso!", { position: "top-right", autoClose: 5000 });
        return response;
      })
      .catch((error) => {
        return error;
      });
  }

  const setOptions = {
    attributesWhitelist: {
      all: "data-id|data-type",
    },
    defaultTag: "p",
  };
  function handleOnChange(content) {
    let texto = content;
  }

      async function handleSignOut() {
      signOut();
    }
  
    function handleSimisab() {
          Router.push("/indicadores/home_indicadores");
        }

  // Filtrar normas baseado no termo de busca
  const normasFiltradas = normasList.filter(
    (norma) =>
      norma.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (norma.tipo_norma && norma.tipo_norma.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (norma.escala && norma.escala.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (norma.eixo && norma.eixo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const { usuario } = useContext(AuthContext);

  return (
    <Container>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <DivMenuTitulo> 
                    <span style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      padding: '15px 20px',
                      float: 'left'
                      }}>
                       Painel de Edição 
                      </span>
                    <ul style={{}}>
                    <MenuMunicipioItem style={{marginRight: '18px'}}  onClick={handleSignOut}>Sair</MenuMunicipioItem>
                    <MenuMunicipioItem onClick={handleSimisab}>SIMISAB</MenuMunicipioItem>
                    </ul>
      </DivMenuTitulo>
      <BodyDashboard>
        <Sidebar />
      <DivCenter>
        <div
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid rgb(162, 160, 160)",
            textAlign: "center",
          }}
        >
          <h2>Lista de Normas</h2>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div style={{ position: "relative", width: "30%" }}>
            <input
              type="text"
              placeholder="Buscar por título, tipo, escala ou eixo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 40px 10px 10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            />
            <FaSearch
              style={{
                position: "absolute",
                right: "-35px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#666",
                fontSize: "18px",
                pointerEvents: "none",
              }}
            />
          </div>
          <BotaoAdicionar
            onClick={handleAddNorma}
            style={{ marginLeft: "10px" }}
          >
            + Nova Norma
          </BotaoAdicionar>
        </div>

        <div style={{ width: "100%" }}>
          {normasFiltradas.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p>Nenhuma norma encontrada.</p>
            </div>
          ) : (
            normasFiltradas.map((norma) => (
              <div key={norma.id_norma} style={{ marginBottom: "15px" }}>
                <div
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: "20px",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>
                        {norma.titulo}
                      </h3>
                      <div style={{ fontSize: "14px", color: "#888" }}>
                        {norma.tipo_norma && <span>Tipo: {norma.tipo_norma}</span>}
                        {norma.escala && (
                          <span style={{ marginLeft: "15px" }}>Escala: {norma.escala}</span>
                        )}
                        {norma.eixo && (
                          <span style={{ marginLeft: "15px" }}>Eixo: {norma.eixo}</span>
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginLeft: "20px",
                      }}
                    >
                      <BotaoEditar
                        onClick={() =>
                          Router.push(`/addNorma?id=${norma.id_norma}`)
                        }
                      >
                        Editar
                      </BotaoEditar>
                      <BotaoRemover
                        onClick={() =>
                          handleOpenConfirm({
                            id_imagem: norma.id_imagem,
                            id_norma: norma.id_norma,
                            id_arquivo: norma.id_arquivo,
                          })
                        }
                      >
                        Remover
                      </BotaoRemover>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DivCenter>
      </BodyDashboard>
      <Footer>&copy; Todos os direitos reservados </Footer>

      {isModalConfirm && (
        <ContainerModal>
          <Modal>
            <ConteudoModal>
              <TituloModal>
                <h3>
                  <b>Você confirma a exclusão!</b>
                </h3>
              </TituloModal>
              <TextoModal>
                <CancelButton onClick={handleCloseConfirm}>
                  <b>Cancelar</b>
                </CancelButton>
                <ConfirmButton onClick={() => handleRemoverNorma()}>
                  <b>Confirmar</b>
                </ConfirmButton>
              </TextoModal>
            </ConteudoModal>
          </Modal>
        </ContainerModal>
      )}

      {isModalVisible && (
        <ContainerModal>
          <Modal>
            <FormModal onSubmit={handleSubmit(handleUpdateImagem)}>
              <TextoModal>
                <CloseModalButton onClick={handleCloseModal}>
                  Fechar
                </CloseModalButton>
                <SubmitButton type="submit">Gravar</SubmitButton>
                <ConteudoModal>
                  <input
                    type="hidden"
                    {...register("id_norma")}
                    defaultValue={idNorma}
                    onChange={handleOnChange}
                    name="id_norma"
                  />
                  <input
                    type="hidden"
                    {...register("id_imagem")}
                    defaultValue={idImagem}
                    onChange={handleOnChange}
                    name="id_imagem"
                  />
                  <label>Selecione uma imagem para substituir a atual!</label>
                  <input
                    {...register("imagem")}
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const files = event.target.files;
                      if (files) {
                        setImagem(URL.createObjectURL(files[0]));
                      }
                    }}
                  />

                  <ImagemModal>
                    <img src={`${imagem}`} alt="TedPlan" />
                  </ImagemModal>
                </ConteudoModal>
              </TextoModal>
            </FormModal>
          </Modal>
        </ContainerModal>
      )}

      {isModalUpdateVisible && (
        <ContainerModal>
          <Modal>
            <FormModal onSubmit={handleSubmit(handleUpdateNorma)}>
              <TextoModal>
                <CloseModalButton onClick={handleCloseModal}>
                  Fechar
                </CloseModalButton>
                <SubmitButton type="submit">Gravar</SubmitButton>
                <ConteudoModal>
                  <TituloModal>
                    <input
                      type="hidden"
                      {...register("id_norma")}
                      value={isNorma.id_norma}
                    />
                    <input
                      type="hidden"
                      {...register("id_arquivo")}
                      value={isNorma.id_arquivo}
                    />
                    <ImagemModal></ImagemModal>
                    <label>Titulo</label>
                    <input
                      {...register("titulo")}
                      defaultValue={isNorma.titulo}
                      name="titulo"
                      onChange={handleOnChange}
                    />
                    <button>
                      <a href={arquivo} rel="noreferrer" target="_blank">
                        Clique aqui para ver o arquivo atual!
                      </a>
                    </button>
                    <label>Para trocar o arquivo, selecione outro!</label>
                    <input
                      {...register("arquivo")}
                      accept=".pdf, .doc, .docx, .xls, .xlsx"
                      type="file"
                      name="arquivo"
                    />
                  </TituloModal>
                </ConteudoModal>
              </TextoModal>
            </FormModal>
          </Modal>
        </ContainerModal>
      )}
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<NormasProps> = async (
  ctx
) => {
  const apiClient = getAPIClient(ctx);
  const { ["tedplan.token"]: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const resEscala = await apiClient.get("/getEscalas");
  const escala = await resEscala.data;

  const resTipoNorma = await apiClient.get("/listTipoNorma");
  const tipoNorma = await resTipoNorma.data;

  const resEixo = await apiClient.get("/getEixos");
  const eixos = await resEixo.data;

  const resNormas = await apiClient.get("/getNormas");
  const normas = await resNormas.data.data;

  return {
    props: {
      escala,
      tipoNorma,
      eixos,
      normas,
    },
  };
};
