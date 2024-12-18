/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { AuthContext } from "../contexts/AuthContext";
import { getAPIClient } from "../services/axios";
import api from "../services/api";
import Router from "next/router";
import MenuSuperior from "../components/head";
//import { useToasts } from "react-toast-notifications";
import dynamic from "next/dynamic";
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
} from "../styles/dashboard";
import { useForm } from "react-hook-form";

interface IUsuario {
  id_usuario: string;
  login: string;
  senha: string;
  nome: string;
  email: string;
  telefone: string;
  curriculo_lattes: string;
}

interface UsuarioProps {
  usuarios: IUsuario[];
}

export default function Postagens({ usuarios }: UsuarioProps) {
  const { register, handleSubmit, reset } = useForm();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalUpdateVisible, setModalUpdateVisible] = useState(false);
  const [isModalConfirm, setModalConfirm] = useState(false);
  const [imagem, setImagem] = useState<String | any>(null);
  //const { addToast } = useToasts();

  const [listaUsuarios, setUsuarios] = useState<IUsuario | any>(usuarios);

  useEffect(() => {
  
    
  });

  async function listUsuarios() {
    const resUsuario = await api.get("/getUsuarios");
    const usuarios = await resUsuario.data;
    return usuarios;
  }

  async function handleShowModal() {
    const id_imagem = "";
    if (id_imagem) {
      const file = await api({
        method: "GET",
        url: "getImagem",
        params: { id: id_imagem },
        responseType: "blob",
      });
      const img = URL.createObjectURL(file.data);
      setImagem(img);
    } else {
      setImagem(null);
    }
    setModalVisible(true);
  }

  async function handleShowUpdateModal() {
    const id_imagem = "";
    if (id_imagem) {
      const imagem = await api({
        method: "GET",
        url: "getFile",
        params: { id: id_imagem },
        responseType: "blob",
      }).then((response) => {
        return URL.createObjectURL(response.data);
      });
      setImagem(imagem);
    } else {
      setImagem(null);
    }

    setModalUpdateVisible(true);
  }

  function handleCloseModal() {
    Router.reload();
    setModalVisible(false);
  }

  function handleOpenConfirm() {
    setModalConfirm(true);
  }

  function handleCloseConfirm() {
    setModalConfirm(false);
  }

  async function handleRemoverUsuario({}) {
    const resDelete = await api.delete("deletePost", {});
  
    setModalConfirm(false);
    Router.push("/postagens");
  }

  function handleNewPost() {
    Router.push("/addPostagem");
  }

  function handleSubmitUsuario() {
    Router.push("/addPostagem");
  }

  function handleUpdateUsuario() {
    Router.push("/addPostagem");
  }

  const setOptions = {
    attributesWhitelist: {
      all: "data-id|data-type",
    },
    defaultTag: "p",
  };

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
          {usuarios?.map((usuario) => {
            return (
              <tbody key={usuario.id_usuario}>
                <tr>
                  <td>{usuario.nome}</td>
                  <td>{usuario.login}</td>
                  <td>
                    <BotaoRemover onClick={() => handleOpenConfirm()}>
                      Remover
                    </BotaoRemover>
                    <BotaoEditar onClick={() => handleShowUpdateModal()}>
                      Editar
                    </BotaoEditar>
                    <BotaoVisualizar onClick={() => handleShowModal()}>
                      Visualizar
                    </BotaoVisualizar>

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
                                onClick={() => handleRemoverUsuario({})}
                              >
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
                          <CloseModalButton onClick={handleCloseModal}>
                            Fechar
                          </CloseModalButton>
                          <FormModal
                            onSubmit={handleSubmit(handleUpdateUsuario)}
                          >
                            <ConteudoModal>
                              <TituloModal>
                                <ImagemModal>
                                  <img src={imagem} alt="TedPlan" />
                                </ImagemModal>
                                {}
                              </TituloModal>
                              <TextoModal></TextoModal>
                            </ConteudoModal>
                          </FormModal>
                        </Modal>
                      </ContainerModal>
                    )}

                    {isModalUpdateVisible && (
                      <ContainerModal>
                        <Modal>
                          <CloseModalButton onClick={handleCloseModal}>
                            Fechar
                          </CloseModalButton>
                          <FormModal
                            onSubmit={handleSubmit(handleUpdateUsuario)}
                          >
                            <ConteudoModal>
                              <TituloModal>
                                <input
                                  type="hidden"
                                  {...register("id_posts")}
                                  value={""}
                                  //onChange={handleOnChange}
                                  name="titulo"
                                />
                                <ImagemModal>
                                  <img src={imagem} alt="TedPlan" />
                                </ImagemModal>
                                <input
                                  {...register("titulo")}
                                  value={""}
                                  //onChange={handleOnChange}
                                  name="titulo"
                                />
                              </TituloModal>
                              <TextoModal></TextoModal>
                            </ConteudoModal>
                            <SubmitButton type="submit">Gravar</SubmitButton>
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
      <Footer>&copy; Todos os direitos reservados </Footer>
    </Container>
  );
}

/*
export const getServerSideProps: GetServerSideProps<UsuarioProps> =  async (ctx) => {
  const apiClient = getAPIClient(ctx)
  const {[ 'tedplan.token' ]: token} = parseCookies(ctx)

  
  if(!token){
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }  
  
  const resUsuario = await apiClient.get('/getUsuarios')
  const usuarios = await resUsuario.data

  
  return {
    props: {
      usuarios,     
    }
  }
  
}
*/
