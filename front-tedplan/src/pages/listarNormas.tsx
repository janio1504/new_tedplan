/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { parseCookies } from "nookies";
import { AuthContext } from "../contexts/AuthContext";
import { getAPIClient } from "../services/axios";
import api from "../services/api";
import Router from "next/router";
import MenuSuperior from "../components/head";
import {
  FaSearch,
  FaDatabase,
  FaHome,
  FaSignOutAlt,
  FaRegTimesCircle,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-nextjs-toast";
import "suneditor/dist/css/suneditor.min.css";
import { getData } from "./api/post";

import {
  Container,
  NewButton,
  ListPost,
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
} from "../styles/dashboard";
import { useForm } from "react-hook-form";

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
        toast.notify("Dados gravados com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
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
        toast.notify("Norma removida com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
        setModalConfirm(false);
        Router.push("/listarNormas");
      })
      .catch((error) => {
        toast.notify("Aconteceu um erro!", {
          title: "Erro!",
          duration: 7,
          type: "error",
        });
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
        toast.notify("Dados gravados com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
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

  const { usuario } = useContext(AuthContext);

  return (
    <Container>
      <MenuSuperior usuarios={[]}></MenuSuperior>
      <ToastContainer></ToastContainer>
      <DivCenter>
        <NewButton onClick={handleAddNorma}>Adicionar Norma</NewButton>
        <ListPost>
          <thead>
            <tr>
              <th>Titulo</th>
              <th>Tipo de norma</th>
              <th>Escala</th>
              <th>Eixo</th>
              <th>Ações</th>
            </tr>
          </thead>
          {normas.map((norma) => {
            return (
              <tbody key={norma.id_norma}>
                <tr>
                  <td>{norma.titulo}</td>
                  <td>{norma.tipo_norma}</td>
                  <td>{norma.escala}</td>
                  <td>{norma.eixo}</td>
                  <td>
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
                    <BotaoEditar
                      onClick={() =>
                        Router.push(`/addNorma?id=${norma.id_norma}`)
                      }

                      // onClick={() =>
                      //   handleShowUpdateModal(norma.id_arquivo, norma.id_norma)
                      // }
                    >
                      Editar
                    </BotaoEditar>
                    {/* <BotaoVisualizar
                      onClick={() =>
                        handleShowModal(norma.id_imagem, norma.id_norma)
                      }
                    >
                      Editar Imagem
                    </BotaoVisualizar> */}
                  </td>
                </tr>
              </tbody>
            );
          })}
        </ListPost>
      </DivCenter>
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
