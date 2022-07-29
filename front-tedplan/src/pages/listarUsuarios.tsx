import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { parseCookies } from "nookies";
import { AuthContext } from "../contexts/AuthContext";
import { getAPIClient } from "../services/axios";
import api from "../services/api";
import Router from "next/router";
import MenuSuperior from "../components/head";
import { toast, ToastContainer } from 'react-nextjs-toast'
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
  nome: string;
  login: string;
  id_municipio: string;
  ativo: boolean;
  tipo_usuario: string;
  id_tipo_usuario: string;
  id_imagem: string;
  id_sistema: string;
}

interface ITipoUsuario {
  id_tipo_usuario: string;
  nome: string;
}

interface ISistemas {
  id_sistema: string;
  nome: string;
}

interface UsuarioProps {
  usuarios: IUsuario[];
  tipoUsuario: ITipoUsuario[];
  sistemas: ISistemas[];
}

export default function Postagens({
  usuarios,
  tipoUsuario,
  sistemas,
}: UsuarioProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalUpdateVisible, setModalUpdateVisible] = useState(false);
  const [usuarioModal, setUsuarioModal] = useState(null);
  const [isModalConfirm, setModalConfirm] = useState(false);
  const [imagem, setImagem] = useState<String | ArrayBuffer>(null);


  const [contentForEditor, setContentForEditor] = useState(null);
  const [content, setContent] = useState("");
  const editor = useRef();
  const firstRender = useRef(true);
  const editorContent = useMemo(() => contentForEditor, [contentForEditor]);

  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

  function handleOnChange(content) {
    setContent(content);
  }

  useEffect(() => {}, []);

  async function handleShowModal(usuario: IUsuario) {
    setUsuarioModal(usuario);
    setModalVisible(true);
  }

  function handleCloseModal() {
    Router.reload();
    setModalVisible(false);
  }

  function handleOpenConfirm(usuario: IUsuario) {
    setUsuarioModal(usuario);
    setModalConfirm(true);
  }

  function handleCloseConfirm() {
    setModalConfirm(false);
  }

  async function handleRemoverUsuario(id_usuario: IUsuario) {
    const resDelete = await api
      .delete("removerUsuario", { params: { id_usuario: id_usuario } })
      .then((response) => {
    
      })
      .catch((error) => {
        toast.notify('Não foi possivel remover o usuário!',{
          title: "Aconteceu o seguinte erro",
          duration: 7,
          type: "error",
        })    
      });

    setModalConfirm(false);
    Router.push("/listarUsuarios");
  }

  function handleAddUsuario() {
    Router.push("/addUsuario");
  }

  async function handleUpdateUsuario(data: IUsuario) {
    const usuario = await api
      .post("updatePermissoes", {
        id_usuario: data.id_usuario,
        id_sistema: data.id_sistema,
        ativo: data.ativo,
        id_tipo_usuario: data.id_tipo_usuario,
      })
      .then((response) => {
     
      })
      .catch((error) => {
     
      });
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
      <ToastContainer align={"center"} position={"button"}  />
      <MenuSuperior usuarios={[]}></MenuSuperior>

      <DivCenter>
        <NewButton onClick={handleAddUsuario}>Adicionar Usuário</NewButton>
        <ListPost>
          <thead>
            <tr>
              <th>Login</th>
              <th>Tipo Usuário</th>
              <th>Ativo</th>
              <th>Ações</th>
            </tr>
          </thead>
          {usuarios.map((usuario) => {
            return (
              <tbody key={usuario.id_usuario}>
                <tr>
                  <td>{usuario.login}</td>
                  <td>{usuario.tipo_usuario}</td>
                  <td>{usuario.ativo ? "Sim" : "Não"}</td>
                  <td>
                    <BotaoRemover onClick={() => handleOpenConfirm(usuario)}>
                      Remover
                    </BotaoRemover>
                    <BotaoEditar onClick={() => handleShowModal(usuario)}>
                      Editar Permissões
                    </BotaoEditar>

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
                                onClick={() =>
                                  handleRemoverUsuario(usuarioModal.id_usuario)
                                }
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
                              <input
                                type="hidden"
                                {...register("id_usuario")}
                                value={usuarioModal.id_usuario}
                              />
                              <p>Nome: {usuarioModal.nome}</p>
                              <p>Login: {usuarioModal.login}</p>

                              <select {...register("ativo")} name="ativo">
                                <option value="">
                                  {usuarioModal.ativo ? "Ativo" : "Inativo"}
                                </option>
                                <option
                                  value={usuarioModal.ativo ? "false" : "true"}
                                >
                                  {usuarioModal.ativo ? "Inativar" : "Ativar"}
                                </option>
                              </select>

                              <select
                                {...register("id_tipo_usuario")}
                                name="id_tipo_usuario"
                              >
                                <option value="">
                                  {usuarioModal.tipo_usuario}
                                </option>
                                {tipoUsuario.map((tipo) => (
                                  <option
                                    key={tipo.id_tipo_usuario}
                                    value={tipo.id_tipo_usuario}
                                  >
                                    {tipo.nome}
                                  </option>
                                ))}
                              </select>

                              <select
                                {...register("id_sistema")}
                                name="id_sistema"
                              >
                                <option value="">Selecione um sistema</option>
                                {sistemas.map((sistema) => (
                                  <option
                                    key={sistema.id_sistema}
                                    value={sistema.id_sistema}
                                  >
                                    {sistema.nome}
                                  </option>
                                ))}
                              </select>
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

export const getServerSideProps: GetServerSideProps<UsuarioProps> = async (
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

  const resUsuarios = await apiClient.get("/getUsuarios");
  const usuarios = await resUsuarios.data;

  const resTipoUsuario = await apiClient.get("/getTipoUsuario");
  const tipoUsuario = resTipoUsuario.data;

  const resSistemas = await apiClient.get("/getSistemas");
  const sistemas = resSistemas.data;

  return {
    props: {
      usuarios,
      tipoUsuario,
      sistemas,
    },
  };
};
