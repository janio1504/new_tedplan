import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { parseCookies } from "nookies";
import { AuthContext } from "../contexts/AuthContext";
import { getAPIClient } from "../services/axios";
import api from "../services/api";
import Router from "next/router";
import MenuSuperior from "../components/head";
import { toast, ToastContainer } from "react-nextjs-toast";
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
import { InputP } from "../styles/financeiro";

interface IUsuario {
  id_usuario: string;
  nome: string;
  login: string;
  id_municipio: string;
  ativo: boolean;
  permissao_usuario: string;
  id_permissao: string;
  id_imagem: string;
  id_sistema: string;
  senha: string;
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
  const [usuarioModal, setUsuarioModal] = useState(null);
  const [isModalConfirm, setModalConfirm] = useState(false);
  const [permissoes, setPermissoes] = useState<any>(null);
  const [visibleMunicipiosSistemas, setVisibleMunicipiosSistemas] =
    useState(false);
  const editor = useRef();
  const [municipios, setMunicipios] = useState<any>(null);

 
  useEffect(() => {
    getPermissoes();
    getMunicipios();
  }, []);
  
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

  async function getPermissoes() {
    const permissoes = await api.get("/get-permissoes").then((response) => {
      return response.data;
    });
    setPermissoes(permissoes);
  }

  async function getMunicipios() {
    
    const resMunicipio = await api
      .get("/getMunicipios")
      .then((response) => {
        return response.data;
      });
    setMunicipios(resMunicipio);
  }

  async function handleRemoverUsuario(id_usuario: IUsuario) {
    const resDelete = await api
      .delete("removerUsuario", { params: { id_usuario: id_usuario } })
      .then((response) => {})
      .catch((error) => {
        toast.notify("Não foi possivel remover o usuário!", {
          title: "Aconteceu o seguinte erro",
          duration: 7,
          type: "error",
        });
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
        id_municipio: data.id_municipio,
        ativo: data.ativo,
        id_permissao: data.id_permissao,
        senha: data.senha,
      })
      .then((response) => {
        toast.notify("Dados gravados com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
        setTimeout(() => {
          setModalVisible(false);
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const setOptions = {
    attributesWhitelist: {
      all: "data-id|data-type",
    },
    defaultTag: "p",
  };

  const { usuario } = useContext(AuthContext);

  function onChange(e) { 
    e.target.value == 2 || e.target.value == 3
      ? setVisibleMunicipiosSistemas(true)
      : setVisibleMunicipiosSistemas(false);
  }

  return (
    <Container>
      <MenuSuperior usuarios={[]}></MenuSuperior>

      <DivCenter>
        <NewButton onClick={handleAddUsuario}>Adicionar Usuário</NewButton>
        <ListPost>
          <thead>
            <tr>
              <th>Login</th>
              <th>Permissão Usuário</th>
              <th>Ativo</th>
              <th>Ações</th>
            </tr>
          </thead>
          {usuarios.map((usuario) => {
            return (
              <tbody key={usuario.id_usuario}>
                <tr>
                  <td>{usuario.login}</td>
                  <td>{usuario.permissao_usuario}</td>
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
                          <FormModal
                            onSubmit={handleSubmit(handleUpdateUsuario)}
                          >
                            <TextoModal>
                              <CloseModalButton onClick={handleCloseModal}>
                                Fechar
                              </CloseModalButton>
                              <SubmitButton type="submit">Gravar</SubmitButton>

                              <ConteudoModal>
                                <input
                                  type="hidden"
                                  {...register("id_usuario")}
                                  value={usuarioModal.id_usuario}
                                />
                                <p>Nome: {usuarioModal.nome}</p>
                                <p>Login: {usuarioModal.login}</p>
                                <label>Status Usuário</label>
                                <select {...register("ativo")} name="ativo">
                                  <option value="">
                                    {usuarioModal.ativo ? "Ativo" : "Inativo"}
                                  </option>
                                  <option
                                    value={
                                      usuarioModal.ativo ? "false" : "true"
                                    }
                                  >
                                    {usuarioModal.ativo ? "Inativar" : "Ativar"}
                                  </option>
                                </select>
                               
                                <label>Permissões</label>
                                <select
                                  {...register("id_permissao")}
                                  name="id_permissao"
                                  onChange={(e) => onChange(e)}
                                >
                                  <option value="">
                                    Selecione uma permissão
                                  </option>
                                  {permissoes?.map((permissao, key) => (
                                    <option
                                      key={key}
                                      value={permissao.id_permissao}
                                    >
                                      {permissao.nome}
                                    </option>
                                  ))}
                                </select>
                                {visibleMunicipiosSistemas && (
                                  <>
                                    <label>Sistemas</label>
                                    <select
                                      {...register("id_sistema", {
                                        required: true,
                                      })}
                                      name="id_sistema"
                                    >
                                      aria-invalid=
                                      {errors.value ? "true" : "false"}
                                      <option value="">
                                        Selecione um Sistema
                                      </option>
                                      <option value="1">Sou Tedplan</option>
                                      <option value="2">Sou Municipio</option>
                                    </select>
                                    {errors.id_sistema &&
                                      errors.id_sistema.type && (
                                        <span>
                                          Selecionar um Sistema é obrigatório!
                                        </span>
                                      )}
                                    <label>Municipios</label>
                                    <select
                                      {...register("id_municipio")}
                                      name="id_municipio"
                                    >
                                      aria-invalid=
                                      {errors.value ? "true" : "false"}
                                      <option value="">
                                        Selecione um Municipio
                                      </option>
                                      {municipios?.map((municipio, key) => (
                                        <option
                                          key={key}
                                          value={municipio.id_municipio}
                                        >
                                          {municipio.nome}
                                        </option>
                                      ))}
                                    </select>
                                  </>
                                )}
                                <label>Senha</label>
                                <InputP>
                                  <input
                                    {...register("senha")}
                                    type="password"
                                  ></input>
                                </InputP>
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
        &copy; Todos os direitos reservados{" "}
        <ToastContainer align={"center"} position={"button"} />
      </Footer>
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
