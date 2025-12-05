/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaBars, FaCaretDown, FaList, FaLink, FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import {
  Container,
  DivCenter,
  DivForm,
  DivFormCadastro,
  DivTituloForm,
  Form,
  InputG,
  SubmitButton,
  DivEixo,
  TextArea,
  DivTextArea,
} from "../../styles/esgoto-indicadores";
import {
  DivFormEixo,
} from "../../styles/financeiro";

import HeadIndicadores from "../../components/headIndicadores";
import { getAPIClient } from "../../services/axios";
import MenuIndicadores from "../../components/MenuIndicadores";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import Router, { useRouter } from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../services/api";
import MenuHorizontal from "../../components/MenuHorizontal";
import { toast } from "react-toastify";
import MenuIndicadoresCadastro from "../../components/MenuIndicadoresCadastro";
import {
  Sidebar,
  SidebarItem,
  MenuHeader,
  MenuItemsContainer,
} from "../../styles/residuo-solidos-in";
import { DivFormConteudo } from "../../styles/drenagem-indicadores";
import {
  BreadCrumbStyle,
  CollapseButton,
  ExpandButton,
  MainContent,
} from "../../styles/indicadores";
import Link from "next/link";
import { BodyDashboard } from "@/styles/dashboard-original";
import {
  ContainerModal,
  Modal,
  CloseModalButton,
  ConteudoModal,
  TituloModal,
  TextoModal,
  BotaoAdicionar,
  BotaoEditar,
  BotaoRemover,
} from "../../styles/dashboard";

interface IMunicipio {
  id_municipio: string;
  municipio_codigo_ibge: string;
  municipio_nome: string;
}

interface IEixo {
  id_eixo: number;
  nome_eixo: string;
}

interface ITipoUnidade {
  id_tipo_unidade: number;
  nome_tipo_unidade: string;
}

interface IUnidade {
  id_unidade: number;
  nome_unidade: string;
  id_tipo_unidade?: number;
  id_eixo?: number;
  id_municipio?: number;
  data_cadastro?: string;
  created_at?: string;
  updated_at?: string;
  tipoUnidade?: ITipoUnidade;
  eixo?: IEixo;
  municipio?: IMunicipio;
}

interface MunicipioProps {
  Imunicipio: IMunicipio[];
}

export default function Unidades() {
  const router = useRouter();
  const { eixo } = router.query;
  const { usuario, signOut } = useContext(AuthContext);
  const [dadosMunicipio, setDadosMunicipio] = useState<IMunicipio>(null);
  const [menus, setMenus] = useState([]);
  const [unidades, setUnidades] = useState<IUnidade[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [unidadeEditando, setUnidadeEditando] = useState<IUnidade | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [eixos, setEixos] = useState<IEixo[]>([]);
  const [tiposUnidade, setTiposUnidade] = useState<ITipoUnidade[]>([]);
  const [municipios, setMunicipios] = useState<IMunicipio[]>([]);
  const [eixoFiltro, setEixoFiltro] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [activeForm, setActiveForm] = useState("");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1000) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    // Ler o parâmetro eixo da query string
    if (eixo) {
      const eixoId = parseInt(eixo as string, 10);
      if (!isNaN(eixoId)) {
        setEixoFiltro(eixoId);
      }
    }
  }, [eixo]);

  useEffect(() => {
    getMenus();
    getMunicipio();
    loadUnidades();
    loadEixos();
    loadTiposUnidade();
    loadMunicipios();
  }, [eixoFiltro]);

  async function getMunicipio() {
    try {
      const res = await api.get("getMunicipio", {
        params: { id_municipio: usuario?.id_municipio },
      });
      setDadosMunicipio(res.data);
    } catch (error) {
      console.error("Erro ao carregar município:", error);
    }
  }

  async function getMenus() {
    try {
      const res = await api.get("menus/eixo/" + 1);
      setMenus(res.data);
    } catch (error) {
      console.error("Erro ao carregar menus:", error);
    }
  }

  async function loadUnidades() {
    setLoading(true);
    try {
      const apiClient = getAPIClient();
      let response;
      
      // Se há filtro de eixo, usar o endpoint específico
      if (eixoFiltro) {
        response = await apiClient.get(`/unidades/eixo/${eixoFiltro}`);
      } else {
        response = await apiClient.get("/unidades");
      }
      
      const unidadesData = response.data || [];
      setUnidades(unidadesData);
    } catch (error) {
      console.error("Erro ao carregar unidades:", error);
      toast.error("Erro ao carregar unidades!", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadEixos() {
    try {
      const response = await api.get("/getEixos");
      setEixos(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar eixos:", error);
    }
  }

  async function loadTiposUnidade() {
    try {
      // Se houver endpoint para tipos de unidade, usar aqui
      // Por enquanto, deixar vazio ou criar um endpoint
      // const response = await api.get("/tipos-unidade");
      // setTiposUnidade(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar tipos de unidade:", error);
    }
  }

  async function loadMunicipios() {
    try {
      const response = await api.get("/getMunicipios");
      setMunicipios(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar municípios:", error);
    }
  }

  function handleOpenModal() {
    setIsEditing(false);
    setUnidadeEditando(null);
    reset({
      nome_unidade: "",
      id_tipo_unidade: "",
      // Se há filtro de eixo, pré-selecionar o eixo
      id_eixo: eixoFiltro ? eixoFiltro.toString() : "",
      id_municipio: "",
    });
    setModalVisible(true);
  }

  function handleCloseModal() {
    setModalVisible(false);
    setIsEditing(false);
    setUnidadeEditando(null);
    reset();
  }

  function handleEditUnidade(unidade: IUnidade) {
    setIsEditing(true);
    setUnidadeEditando(unidade);
    setValue("nome_unidade", unidade.nome_unidade || "");
    setValue("id_tipo_unidade", unidade.id_tipo_unidade?.toString() || "");
    setValue("id_eixo", unidade.id_eixo?.toString() || "");
    setValue("id_municipio", unidade.id_municipio?.toString() || "");
    setModalVisible(true);
  }

  async function handleSaveUnidade(data: any) {
    try {
      const apiClient = getAPIClient();

      const unidadeData = {
        nome_unidade: data.nome_unidade,
        id_tipo_unidade: data.id_tipo_unidade ? parseInt(data.id_tipo_unidade) : null,
        // Se há filtro de eixo e não foi selecionado um eixo, usar o eixo do filtro
        id_eixo: data.id_eixo ? parseInt(data.id_eixo) : (eixoFiltro || null),
        id_municipio: data.id_municipio ? parseInt(data.id_municipio) : null,
      };

      if (isEditing && unidadeEditando) {
        await apiClient.put(`/unidades/${unidadeEditando.id_unidade}`, unidadeData);
        toast.success("Unidade atualizada com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        await apiClient.post("/unidades", unidadeData);
        toast.success("Unidade cadastrada com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
      }

      handleCloseModal();
      loadUnidades();
    } catch (error) {
      console.error("Erro ao salvar unidade:", error);
      toast.error("Erro ao salvar unidade!", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }

  async function handleDeleteUnidade(id: number) {
    if (!confirm("Tem certeza que deseja excluir esta unidade?")) {
      return;
    }

    try {
      const apiClient = getAPIClient();
      await apiClient.delete(`/unidades/${id}`);
      toast.success("Unidade excluída com sucesso!", {
        position: "top-right",
        autoClose: 5000,
      });
      loadUnidades();
    } catch (error) {
      console.error("Erro ao excluir unidade:", error);
      toast.error("Erro ao excluir unidade!", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }

  const unidadesFiltradas = unidades.filter((unidade) =>
    unidade.nome_unidade?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuHorizontal municipio={dadosMunicipio?.municipio_nome}></MenuHorizontal>
      <MenuIndicadoresCadastro></MenuIndicadoresCadastro>
      <BodyDashboard>
        {isCollapsed ? (
          <ExpandButton onClick={toggleSidebar}>
            <FaBars />
          </ExpandButton>
        ) : (
          <Sidebar $isCollapsed={isCollapsed}>
            <CollapseButton onClick={toggleSidebar}>
              <FaBars />
            </CollapseButton>
            {menus?.map((menu) => {
              const isOpen = openMenuId === menu.id_menu;
              return (
                <div key={menu.id_menu}>
                  <MenuHeader
                    $isOpen={isOpen}
                    onClick={() => {
                      setOpenMenuId(isOpen ? null : menu.id_menu);
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <FaList style={{ fontSize: "14px" }} />
                      {menu.titulo}
                    </div>
                    <FaCaretDown />
                  </MenuHeader>
                  <MenuItemsContainer $isOpen={isOpen}>
                    {menu.menuItems?.map((menuItem) => (
                      <SidebarItem
                        key={menuItem.id_menu_item}
                        active={activeForm === menuItem.nome_menu_item}
                        onClick={() => {
                          setActiveForm(menuItem.nome_menu_item);
                        }}
                      >
                        <FaLink
                          style={{ marginRight: "8px", fontSize: "14px" }}
                        />
                        {menuItem.nome_menu_item}
                      </SidebarItem>
                    ))}
                  </MenuItemsContainer>
                </div>
              );
            })}
            <MenuHeader $isOpen={false}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaList style={{ fontSize: "14px" }} />
                Unidades
              </div>
            </MenuHeader>
          </Sidebar>
        )}

        <DivCenter>
          <Form>
            <BreadCrumbStyle $isCollapsed={isCollapsed}>
              <nav>
                <ol>
                  <li>
                    <Link href="/indicadores/home_indicadores">Home</Link>
                    <span> / </span>
                  </li>
                  <li>
                    <span>Unidades</span>
                  </li>
                </ol>
              </nav>
            </BreadCrumbStyle>
            <DivForm style={{ borderColor: "#12B2D5" }}>
              <DivTituloForm>
                Gestão de Unidades
                {eixoFiltro && (
                  <span style={{ fontSize: "14px", fontWeight: "normal", marginLeft: "10px", color: "#666" }}>
                    (Eixo: {eixos.find(e => e.id_eixo === eixoFiltro)?.nome_eixo || eixoFiltro})
                  </span>
                )}
              </DivTituloForm>

              <div style={{ padding: "20px", borderBottom: "1px solid #eee" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      flex: 1,
                      minWidth: "250px",
                    }}
                  >
                    <FaSearch style={{ color: "#666" }} />
                    <input
                      type="text"
                      placeholder="Buscar unidades..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                  <BotaoAdicionar onClick={handleOpenModal}>
                    <FaPlus style={{ marginRight: "8px" }} />
                    Adicionar Unidade
                  </BotaoAdicionar>
                </div>
              </div>

              <DivFormEixo>
                <DivFormConteudo
                  active={true}
                  style={{
                    display: "block",
                    visibility: "visible",
                    opacity: 1,
                  }}
                >
                  {loading ? (
                    <div style={{ textAlign: "center", padding: "40px" }}>
                      <p>Carregando unidades...</p>
                    </div>
                  ) : unidadesFiltradas.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px" }}>
                      <p>
                        {searchTerm
                          ? "Nenhuma unidade encontrada com o termo buscado."
                          : "Nenhuma unidade cadastrada."}
                      </p>
                    </div>
                  ) : (
                    <div
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        overflow: "hidden",
                        marginTop: "20px",
                      }}
                    >
                      {/* Cabeçalho da Tabela */}
                      <div
                        style={{
                          backgroundColor: "#1e88e5",
                          color: "white",
                          padding: "15px 0",
                          fontWeight: "600",
                          fontSize: "13px",
                          letterSpacing: "0.5px",
                        }}
                      >
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              window.innerWidth > 768
                                ? "1fr 150px 150px 150px 120px"
                                : "1fr",
                            gap: window.innerWidth > 768 ? "15px" : "10px",
                            alignItems: "center",
                            padding: "0 15px",
                          }}
                        >
                          {window.innerWidth > 768 ? (
                            <>
                              <div>NOME DA UNIDADE</div>
                              <div>TIPO</div>
                              <div>EIXO</div>
                              <div>MUNICÍPIO</div>
                              <div style={{ textAlign: "center" }}>AÇÕES</div>
                            </>
                          ) : (
                            <div>UNIDADES</div>
                          )}
                        </div>
                      </div>

                      {/* Linhas da Tabela */}
                      {unidadesFiltradas.map((unidade, index) => {
                        const isEven = index % 2 === 0;

                        return (
                          <div
                            key={unidade.id_unidade}
                            style={{
                              backgroundColor: isEven ? "#f8f9fa" : "#ffffff",
                              borderBottom:
                                index < unidadesFiltradas.length - 1
                                  ? "1px solid #dee2e6"
                                  : "none",
                              padding: "15px 0",
                              transition: "background-color 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#e8f4fd";
                              e.currentTarget.style.borderLeft =
                                "3px solid #1e88e5";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = isEven
                                ? "#f8f9fa"
                                : "#ffffff";
                              e.currentTarget.style.borderLeft = "none";
                            }}
                          >
                            {window.innerWidth > 768 ? (
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns:
                                    "1fr 150px 150px 150px 120px",
                                  gap: "15px",
                                  alignItems: "center",
                                  padding: "0 15px",
                                }}
                              >
                                {/* Nome */}
                                <div
                                  style={{
                                    fontSize: "14px",
                                    color: "#495057",
                                    fontWeight: "500",
                                  }}
                                >
                                  {unidade.nome_unidade}
                                </div>

                                {/* Tipo */}
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "#6c757d",
                                  }}
                                >
                                  {unidade.tipoUnidade?.nome_tipo_unidade || "-"}
                                </div>

                                {/* Eixo */}
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "#6c757d",
                                  }}
                                >
                                  {unidade.eixo?.nome_eixo || "-"}
                                </div>

                                {/* Município */}
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "#6c757d",
                                  }}
                                >
                                  {unidade.municipio?.municipio_nome || "-"}
                                </div>

                                {/* Ações */}
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "8px",
                                    justifyContent: "center",
                                  }}
                                >
                                  <BotaoEditar
                                    onClick={() => handleEditUnidade(unidade)}
                                    title="Editar"
                                  >
                                    <FaEdit />
                                  </BotaoEditar>
                                  <BotaoRemover
                                    onClick={() =>
                                      handleDeleteUnidade(unidade.id_unidade)
                                    }
                                    title="Excluir"
                                  >
                                    <FaTrash />
                                  </BotaoRemover>
                                </div>
                              </div>
                            ) : (
                              /* Layout Mobile */
                              <div
                                style={{
                                  padding: "0 15px",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "10px",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    color: "#1e88e5",
                                  }}
                                >
                                  {unidade.nome_unidade}
                                </div>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "#6c757d",
                                  }}
                                >
                                  Tipo: {unidade.tipoUnidade?.nome_tipo_unidade || "-"}
                                </div>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "#6c757d",
                                  }}
                                >
                                  Eixo: {unidade.eixo?.nome_eixo || "-"}
                                </div>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "#6c757d",
                                  }}
                                >
                                  Município: {unidade.municipio?.municipio_nome || "-"}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "8px",
                                    marginTop: "10px",
                                  }}
                                >
                                  <BotaoEditar
                                    onClick={() => handleEditUnidade(unidade)}
                                    title="Editar"
                                  >
                                    <FaEdit /> Editar
                                  </BotaoEditar>
                                  <BotaoRemover
                                    onClick={() =>
                                      handleDeleteUnidade(unidade.id_unidade)
                                    }
                                    title="Excluir"
                                  >
                                    <FaTrash /> Excluir
                                  </BotaoRemover>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </DivFormConteudo>
              </DivFormEixo>
            </DivForm>
          </Form>
        </DivCenter>
      </BodyDashboard>

      {/* Modal para Adicionar/Editar Unidade */}
      {isModalVisible && (
        <ContainerModal>
          <Modal>
            <CloseModalButton onClick={handleCloseModal}>X</CloseModalButton>
            <ConteudoModal>
              <TituloModal>
                {isEditing ? "Editar Unidade" : "Adicionar Nova Unidade"}
              </TituloModal>
              <TextoModal>
                <Form onSubmit={handleSubmit(handleSaveUnidade)}>
                  <InputG>
                    <label>
                      Nome da Unidade<span> *</span>
                    </label>
                    <input
                      {...register("nome_unidade", {
                        required: "O nome da unidade é obrigatório",
                      })}
                      type="text"
                      placeholder="Digite o nome da unidade"
                    />
                    {errors.nome_unidade && (
                      <span style={{ color: "#dc3545", fontSize: "12px" }}>
                        {errors.nome_unidade.message as string}
                      </span>
                    )}
                  </InputG>

                  <InputG>
                    <label>Tipo de Unidade</label>
                    <select {...register("id_tipo_unidade")}>
                      <option value="">Selecione um tipo</option>
                      {tiposUnidade.map((tipo) => (
                        <option
                          key={tipo.id_tipo_unidade}
                          value={tipo.id_tipo_unidade}
                        >
                          {tipo.nome_tipo_unidade}
                        </option>
                      ))}
                    </select>
                  </InputG>

                  <InputG>
                    <label>Eixo</label>
                    <select {...register("id_eixo")}>
                      <option value="">Selecione um eixo</option>
                      {eixos.map((eixo) => (
                        <option key={eixo.id_eixo} value={eixo.id_eixo}>
                          {eixo.nome_eixo}
                        </option>
                      ))}
                    </select>
                  </InputG>

                  <InputG>
                    <label>Município</label>
                    <select {...register("id_municipio")}>
                      <option value="">Selecione um município</option>
                      {municipios.map((municipio) => (
                        <option
                          key={municipio.id_municipio}
                          value={municipio.id_municipio}
                        >
                          {municipio.municipio_nome}
                        </option>
                      ))}
                    </select>
                  </InputG>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "flex-end",
                      marginTop: "20px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Cancelar
                    </button>
                    <SubmitButton type="submit">
                      {isEditing ? "Atualizar" : "Salvar"}
                    </SubmitButton>
                  </div>
                </Form>
              </TextoModal>
            </ConteudoModal>
          </Modal>
        </ContainerModal>
      )}
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { "tedplan.token": token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/login_indicadores",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

