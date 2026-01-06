import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { parseCookies } from "nookies";
import { AuthContext } from "../contexts/AuthContext";
import { getAPIClient } from "../services/axios";
import api from "../services/api";
import Router from "next/router";
import MenuSuperior from "../components/head";
import HeadIndicadores from "../components/headIndicadores";
import { toast } from "react-toastify";
import { FaSearch, FaEdit, FaTrash, FaPlus, FaUserShield } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import {
  Container,
  FormModal,
  ConfirmButton,
  CancelButton,
  Footer,
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
  BotaoAdicionar,
  BotaoPermissao,
  DivMenuTitulo,
  MenuMunicipioItem,
} from "../styles/dashboard";
import { set, useForm } from "react-hook-form";
import { InputP } from "../styles/financeiro";
import { anosSelect } from "@/util/util";
import { permissionByYear } from "@/services/auth";
import { BodyDashboard, DivCenter } from "@/styles/dashboard-original";

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
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const { permission } = useContext(AuthContext);

  const [isModalEditorVisible, setModalEditorVisible] = useState(false);
  const { signOut} = useContext(AuthContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [usuarioModal, setUsuarioModal] = useState(null);
  const [isModalConfirm, setModalConfirm] = useState(false);
  const [permissoes, setPermissoes] = useState<any>(null);
  const [usuariosList, setUsuariosList] = useState<IUsuario[]>(usuarios || []);
  const [searchTerm, setSearchTerm] = useState("");

  const editor = useRef();
  const [municipios, setMunicipios] = useState<any>(null);

  const watchPermissao = watch("id_permissao");

  const permissao = Number(watchPermissao);
  const visibleMunicipiosSistemas = useMemo(() => {
    return permissao === 2 || permissao === 3;
  }, [watchPermissao]);

  useEffect(() => {
    getPermissoes();
    getMunicipios();
  }, []);

  async function handleShowModal(usuario: IUsuario) {
    setUsuarioModal(usuario);

    setValue("id_usuario", usuario.id_usuario);
    setValue("ativo", usuario.ativo ? "true" : "false");
    setValue("id_permissao", usuario.id_permissao);
    setValue("id_sistema", usuario.id_sistema);
    setValue("id_municipio", usuario.id_municipio);

    setModalVisible(true);
  }

  async function handleEditorSimisabShowModal(usuario: IUsuario) {  

    if(Number(usuario.id_permissao) !== 4) {
      toast.error("O usuário deve ser revisor!", { position: "top-right", autoClose: 5000 });
      return;
    }
    setUsuarioModal(usuario);

    const editorSimisabPorAno = await permissionByYear(usuario.id_usuario);

    setValue("editor_ativo", editorSimisabPorAno?.ativo ? "true" : "false");

    setValue("id_editor_simisab", editorSimisabPorAno?.id_editor_simisab || "");

    setValue("ano_editor_simisab", editorSimisabPorAno?.ano || "");

    setValue("id_usuario", usuario.id_usuario);

    setModalEditorVisible(true);
  }

  function handleCloseModal() {
    Router.reload();
    setModalVisible(false);
  }

  function handleEditorSimisabCloseModal() {
    Router.reload();
    setModalEditorVisible(false);
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
    const resMunicipio = await api.get("/getMunicipios").then((response) => {
      return response.data;
    });
    setMunicipios(resMunicipio);
  }

  async function handleRemoverUsuario(id_usuario: IUsuario) {
    const resDelete = await api
      .delete("removerUsuario", { params: { id_usuario: id_usuario } })
      .then((response) => {})
      .catch((error) => {
        toast.error("Não foi possivel remover o usuário!", { position: "top-right", autoClose: 5000 });
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
        toast.success("Dados atualizados com sucesso!", { position: "top-right", autoClose: 5000 });
      })
      .catch((error) => {
        console.log(error);
      });

    setTimeout(() => {
      setModalVisible(false);
      Router.push("/listarUsuarios");
    }, 2000);
  }

  async function handleEditorSimisabPorAno(data: any) {    
        
    if (!data.ano_editor_simisab) {
      toast.warning("Selecione um ano para editar!", { position: "top-right", autoClose: 5000 });
      return;
    }
    await api.post("create-editor-simisab-por-ano", {
        id_editor_simisab: data.id_editor_simisab,
        id_usuario: data.id_usuario,
        ano: data.ano_editor_simisab,
        ativo: data.editor_ativo,
      })
      .then((response) => {
        toast.success("Permissão atualizada com sucesso!", { position: "top-right", autoClose: 5000 });
      })
      .catch((error) => {
        console.log(error);
      });
    setTimeout(() => {
      setModalEditorVisible(false);
      Router.push("/listarUsuarios");
    }, 2000);
  }

    async function handleSignOut() {
    signOut();
  }

  function handleSimisab() {
        Router.push("/indicadores/home_indicadores");
      }

  // Filtrar usuários baseado no termo de busca
  const usuariosFiltrados = usuariosList.filter(
    (usuario) =>
      usuario.login.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (usuario.nome && usuario.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (usuario.permissao_usuario && usuario.permissao_usuario.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Container>
      {/* <MenuSuperior usuarios={[]}></MenuSuperior> */}
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
                  <h2>Lista de Usuários</h2>
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
                      placeholder="Buscar por login, nome ou permissão..."
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
                    onClick={handleAddUsuario}
                    style={{ marginLeft: "10px", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}
                  >
                    <FaPlus /> Novo Usuário
                  </BotaoAdicionar>
                </div>

                <div style={{ width: "100%" }}>
                  {usuariosFiltrados.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px" }}>
                      <p>Nenhum usuário encontrado.</p>
                    </div>
                  ) : (
                    usuariosFiltrados.map((usuario) => {
                      return (
                        <div key={usuario.id_usuario} style={{ marginBottom: "15px" }}>
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
                                  {usuario.nome || usuario.login}
                                </h3>
                                {usuario.login && (
                                  <p style={{ margin: "0 0 10px 0", color: "#666" }}>
                                    Login: {usuario.login}
                                  </p>
                                )}
                                <div style={{ fontSize: "14px", color: "#888" }}>
                                  <span>Permissão: {usuario.permissao_usuario}</span>
                                  <span style={{ marginLeft: "15px" }}>
                                    Status: {usuario.ativo ? "Ativo" : "Inativo"}
                                  </span>
                                </div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "10px",
                                  marginLeft: "20px",
                                }}
                              >
                                <BotaoEditar onClick={() => handleShowModal(usuario)} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                  <FaEdit /> Editar Permissões
                                </BotaoEditar>
                                <BotaoPermissao
                                  onClick={() => handleEditorSimisabShowModal(usuario)}
                                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                                >
                                  <FaUserShield /> Permissão de edição por ano
                                </BotaoPermissao>
                                <BotaoRemover onClick={() => handleOpenConfirm(usuario)} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                  <FaTrash /> Remover
                                </BotaoRemover>

                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </DivCenter>
            </BodyDashboard>

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
                                          <option value="true">Ativo</option>
                                          <option value="false">Inativo</option>
                                        </select>

                                        <label>Permissões</label>
                                        <select
                                          {...register("id_permissao")}
                                          name="id_permissao"
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
                                              <option value="">
                                                Selecione um Sistema
                                              </option>
                                              <option value="1">Sou Tedplan</option>
                                              <option value="2">Sou Municipio</option>
                                            </select>
                                            {errors.id_sistema && (
                                              <span>
                                                Selecionar um Sistema é obrigatório!
                                              </span>
                                            )}
                                            <label>Municipios</label>
                                            <select
                                              {...register("id_municipio")}
                                              name="id_municipio"
                                            >
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
                                          />
                                        </InputP>
                                      </ConteudoModal>
                                    </TextoModal>
                                  </FormModal>
                                </Modal>
                              </ContainerModal>
                            )}

            {isModalEditorVisible && (
              <ContainerModal>
                <Modal>
                  <FormModal
                    onSubmit={handleSubmit(handleEditorSimisabPorAno)}
                  >
                    <TextoModal>
                      <CloseModalButton
                        onClick={handleEditorSimisabCloseModal}
                      >
                        Fechar
                      </CloseModalButton>
                      <SubmitButton type="submit">Gravar</SubmitButton>

                      <ConteudoModal>
                        <input
                          type="hidden"
                          {...register("id_usuario")}
                          value={usuarioModal.id_usuario}
                        />
                          <input
                          type="hidden"
                          {...register("id_editor_simisab")}
                          name="id_editor_simisab"
                        />
                        <p>Nome: {usuarioModal.nome}</p>
                        <p>Login: {usuarioModal.login}</p>

                        <label>Status Permissão</label>
                        <select {...register("editor_ativo")} name="editor_ativo">
                          <option value="true">Ativo</option>
                          <option value="false">Inativo</option>
                        </select>

                        <label>Selecione o ano que será editado.</label>
                        <select
                          {...register("ano_editor_simisab")}
                          name="ano_editor_simisab"
                        >
                          <option value="">Selecione um ano</option>
                          {anosSelect().map((ano) => (
                            <option value={ano}>{ano}</option>
                          ))}
                        </select>
                      </ConteudoModal>
                    </TextoModal>
                  </FormModal>
                </Modal>
              </ContainerModal>
            )}
                    <Footer>
                      &copy; Todos os direitos reservados{" "}
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
