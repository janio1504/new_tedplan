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
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";
//import suneditor from "suneditor";

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
  Form,
} from "../styles/dashboard";
import { useForm } from "react-hook-form";

interface IPost {
  id_posts: string;
  titulo: string;
  municipio: string;
  texto: string;
  id_imagem: string;
  post: string;
  imagem: string;
}

interface IImagem {
  imagem: ArrayBuffer | any;
}

interface PostProps {
  posts: IPost[];
}

export default function Postagens({ posts }: PostProps) {
  const { register, handleSubmit, reset } = useForm();
  const [isPost, setIsPost] = useState<IPost | any>(posts);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalUpdateVisible, setModalUpdateVisible] = useState(false);
  const [isModalConfirm, setModalConfirm] = useState(false);
  const [idImagem, setIdImagem] = useState(null);
  const [idPost, setIdPost] = useState(null);
  const [imagem, setImagem] = useState<ArrayBuffer | any>(null);

  const editor = useRef(null);
  let txtArea = useRef();
  const [contentForEditor, setContentForEditor] = useState(null);
  const [content, setContent] = useState("");

  const firstRender = useRef(true);
  const editorContent = useMemo(() => contentForEditor, [contentForEditor]);

  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

  function handleOnChange(content) {
    setContent(content);
  }

  async function handleShowModal({ id_posts }) {
    setIdPost(id_posts);

    setModalVisible(true);
  }

  async function handleShowUpdateModal({ id_posts }) {
    if (id_posts) {
      const p = await api.get("getPost", { params: { id_posts: id_posts } });
      const isp = p.data.map((r: IPost) => {
        return r;
      });

      setIsPost(isp[0]);
      setContentForEditor(isp[0].texto);
    }

    setModalUpdateVisible(true);
  }

  function handleCloseModal() {
    Router.reload();
    setModalVisible(false);
  }

  async function handleUpdatePost(data: IPost) {
    const texto = content;

    const post = await api.post("updatePost", {
      id_posts: data.id_posts,
      titulo: data.titulo,
      texto: texto,
    });
    Router.push("listarPostagens");
    setModalUpdateVisible(false);
  }

  function handleOpenConfirm({ id_posts, id_imagem }) {
    setIdPost(id_posts);
    setIdImagem(id_imagem);
    setModalConfirm(true);
  }

  function handleCloseConfirm() {
    setModalConfirm(false);
  }

  async function handleRemoverPost() {
    const resDelete = await api.delete("deletePost", {
      params: { id_posts: idPost, id_imagem: idImagem },
    });
    toast.notify("Post removido com sucesso!", {
      title: "Ação executada com sucesso!",
      duration: 7,
      type: "success",
    });
    setModalConfirm(false);
    Router.push("/listarPostagens");
  }

  function handleNewPost() {
    Router.push("/addPostagem");
  }

  async function handleUpdateImagem(data: IPost) {
    const apiClient = getAPIClient();
    const formData = new FormData();

    formData.append("imagem", data.imagem[0]);
    formData.append("id_posts", data.id_posts);
    formData.append("id_imagem", data.id_imagem);

    const res = await apiClient
      .post("updateImagemPost", formData, {
        headers: {
          "Content-Type": `multipart/form-data=${formData}`,
        },
      })
      .then((response) => {
        toast.notify("Imagem atualizada com sucesso!", {
          title: "Ação executada com sucesso!",
          duration: 7,
          type: "success",
        });
        return response;
      })
      .catch((error) => {
        return error;
      });
  }

  function handleImagemOnChange(files) {
    if (files) {
      let lista = [];
      for (let i = 0; i < files.length; i++) {
        let f = i;
        lista.push(URL.createObjectURL(files[f]));
      }
      setImagem(lista);
    }
  }

  const setOptions = {
    attributesWhitelist: {
      all: "data-id|data-type",
    },
    defaultTag: "p",
  };

  const { usuario } = useContext(AuthContext);

  return (
    <Container>
      <MenuSuperior usuarios={[]}></MenuSuperior>

      <DivCenter>
        <NewButton onClick={handleNewPost}>Adicionar Postagens</NewButton>
        <ListPost>
          <thead>
            <tr>
              <th>Titulo</th>
              <th>Municipio</th>
              <th>Ações</th>
            </tr>
          </thead>
          {posts.map((post) => {
            return (
              <tbody key={post.id_posts}>
                <tr>
                  <td>{post.titulo}</td>
                  <td>{post.municipio}</td>
                  <td>
                    <BotaoRemover
                      onClick={() =>
                        handleOpenConfirm({
                          id_posts: post.id_posts,
                          id_imagem: post.id_imagem,
                        })
                      }
                    >
                      Remover
                    </BotaoRemover>

                    <BotaoEditar
                      onClick={() =>
                        handleShowUpdateModal({
                          id_posts: post.id_posts,
                        })
                      }
                    >
                      Editar
                    </BotaoEditar>

                    <BotaoVisualizar
                      onClick={() =>
                        handleShowModal({
                          id_posts: post.id_posts,
                        })
                      }
                    >
                      Editar Imagem
                    </BotaoVisualizar>

                    {isModalVisible && (
                      <ContainerModal>
                        <Modal>
                          <FormModal
                            onSubmit={handleSubmit(handleUpdateImagem)}
                          >
                            <TextoModal>
                              <CloseModalButton onClick={handleCloseModal}>
                                Fechar
                              </CloseModalButton>
                              <SubmitButton type="submit">Gravar</SubmitButton>
                              <ConteudoModal>
                                <input
                                  type="hidden"
                                  {...register("id_posts")}
                                  defaultValue={idPost}
                                  onChange={handleOnChange}
                                  name="id_publicacao"
                                />
                                <input
                                  type="hidden"
                                  {...register("id_imagem")}
                                  defaultValue={idImagem}
                                  onChange={handleOnChange}
                                  name="id_imagem"
                                />
                                <label>
                                  Selecione uma imagem para substituir a atual!
                                </label>
                                <input
                                  {...register("imagem")}
                                  type="file"
                                  accept="image/*"
                                />
                              </ConteudoModal>
                            </TextoModal>
                          </FormModal>
                        </Modal>
                      </ContainerModal>
                    )}

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
                              <ConfirmButton
                                onClick={() => handleRemoverPost()}
                              >
                                <b>Confirmar</b>
                              </ConfirmButton>
                            </TextoModal>
                          </ConteudoModal>
                        </Modal>
                      </ContainerModal>
                    )}

                    {isModalUpdateVisible && (
                      <ContainerModal>
                        <Modal>
                          <FormModal onSubmit={handleSubmit(handleUpdatePost)}>
                            <TextoModal>
                              <CloseModalButton onClick={handleCloseModal}>
                                Fechar
                              </CloseModalButton>
                              <SubmitButton type="submit">Gravar</SubmitButton>
                              <ConteudoModal>
                                <TituloModal>
                                  <input
                                    type="hidden"
                                    {...register("id_posts")}
                                    value={isPost.id_posts}
                                    onChange={handleOnChange}
                                    name="id_posts"
                                  />

                                  <label>Titulo</label>
                                  <input
                                    {...register("titulo")}
                                    defaultValue={isPost.titulo}
                                    onChange={handleOnChange}
                                    name="titulo"
                                  />
                                </TituloModal>
                                <TextoModal>
                                  <textarea
                                    ref={txtArea}
                                    {...register("texto")}
                                    onChange={handleOnChange}
                                  ></textarea>
                                </TextoModal>
                              </ConteudoModal>
                            </TextoModal>
                          </FormModal>
                        </Modal>
                      </ContainerModal>
                    )}
                  </td>
                </tr>
              </tbody>
            );
          })}
        </ListPost>
      </DivCenter>
      <Footer>
        &copy; Todos os direitos reservados<ToastContainer></ToastContainer>
      </Footer>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<PostProps> = async (
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

  const res = await apiClient.get("/getPosts");
  const posts = await res.data;
  //const res = await apiClient.get('/getUsuario', { params: { id_usuario: 1 }})

  return {
    props: {
      posts,
    },
  };
};
