import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { AuthContext } from "../../contexts/AuthContext";
import { getAPIClient } from "../../services/axios";
import Router from "next/router";
import { toast } from "react-toastify";
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Sidebar from "@/components/Sidebar";
import {
  Container,
  Footer,
  DivCenter,
  BotaoEditar,
  BotaoRemover,
  ContainerModal,
  Modal,
  CloseModalButton,
  ConteudoModal,
  TituloModal,
  TextoModal,
  ConfirmButton,
  CancelButton,
  BotaoAdicionar,
  DivMenuTitulo,
  MenuMunicipioItem,
} from "../../styles/dashboard";
import { BodyDashboard } from "@/styles/dashboard-original";
import HeadIndicadores from "@/components/headIndicadores";

interface ITipoUnidade {
  id_tipo_unidade: string;
  nome_tipo_unidade: string;
  id_eixo?: string;
  created_at: string;
  updated_at: string;
  eixo?: {
    id_eixo: string;
    nome: string;
  };
}

interface IEixo {
  id_eixo: string;
  nome: string;
}

interface TipoUnidadeProps {
  tiposUnidade: ITipoUnidade[];
  eixos: IEixo[];
}

export default function ListarTiposUnidade({ tiposUnidade, eixos }: TipoUnidadeProps) {
  const { permission, signOut } = useContext(AuthContext);
  const [isModalConfirm, setModalConfirm] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState<ITipoUnidade | null>(null);
  const [tiposUnidadeList, setTiposUnidadeList] = useState<ITipoUnidade[]>(tiposUnidade || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEixo, setFiltroEixo] = useState<string>("todos");

  useEffect(() => {
    const { ["tedplan.token"]: token } = parseCookies();
    if (!token) {
      Router.push("/login");
    }
  }, []);

  async function loadTiposUnidade() {
    try {
      const apiClient = getAPIClient();
      const response = await apiClient.get("/tipo-unidade");
      setTiposUnidadeList(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar tipos de unidade:", error);
      toast.error("Erro ao carregar tipos de unidade!", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }

  function handleAddTipoUnidade() {
    Router.push("/tipoUnidade/adicionar");
  }

  function handleEditTipoUnidade(tipo: ITipoUnidade) {
    Router.push(`/tipoUnidade/editar?id=${tipo.id_tipo_unidade}`);
  }

  function handleOpenConfirm(tipo: ITipoUnidade) {
    setTipoSelecionado(tipo);
    setModalConfirm(true);
  }

  function handleCloseConfirm() {
    setModalConfirm(false);
    setTipoSelecionado(null);
  }

  async function handleRemoverTipoUnidade() {
    if (!tipoSelecionado) return;

    try {
      const apiClient = getAPIClient();
      await apiClient.delete(`/tipo-unidade/${tipoSelecionado.id_tipo_unidade}`);

      toast.success("Tipo de unidade removido com sucesso!", {
        position: "top-right",
        autoClose: 5000,
      });

      setModalConfirm(false);
      setTipoSelecionado(null);
      loadTiposUnidade();
    } catch (error) {
      console.error("Erro ao remover tipo de unidade:", error);
      toast.error("Erro ao remover tipo de unidade!", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }

  // Filtrar tipos de unidade
  const tiposFiltrados = tiposUnidadeList
    .filter((tipo) => {
      const matchesSearch = tipo.nome_tipo_unidade
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesEixo =
        filtroEixo === "todos" ||
        (tipo.id_eixo && tipo.id_eixo.toString() === filtroEixo);

      return matchesSearch && matchesEixo;
    })
    .sort((a, b) => a.nome_tipo_unidade.localeCompare(b.nome_tipo_unidade));

  async function handleSignOut() {
    signOut();
  }

  function handleSimisab() {
    Router.push("/indicadores/home_indicadores");
  }

  return (
    <Container>
      <HeadIndicadores usuarios={[]} />
      <DivMenuTitulo>
        <span
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            padding: "15px 20px",
            float: "left",
          }}
        >
          Painel de Edição
        </span>
        <ul>
          <MenuMunicipioItem
            style={{ marginRight: "18px" }}
            onClick={handleSignOut}
          >
            Sair
          </MenuMunicipioItem>
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
            <h2>Tipos de Unidade</h2>
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
                placeholder="Buscar por nome..."
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
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              <select
                value={filtroEixo}
                onChange={(e) => setFiltroEixo(e.target.value)}
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "16px",
                  minWidth: "150px",
                }}
              >
                <option value="todos">Todos os eixos</option>
                {eixos?.map((eixo) => (
                  <option key={eixo.id_eixo} value={eixo.id_eixo}>
                    {eixo.nome}
                  </option>
                ))}
              </select>
            </div>
            <BotaoAdicionar
              onClick={handleAddTipoUnidade}
              style={{
                marginLeft: "10px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                justifyContent: "center",
              }}
            >
              <FaPlus /> Novo Tipo de Unidade
            </BotaoAdicionar>
          </div>

          <div
            style={{ marginBottom: "15px", fontSize: "14px", color: "#666" }}
          >
            Mostrando {tiposFiltrados.length} de {tiposUnidadeList.length}{" "}
            tipos de unidade
          </div>

          <div style={{ width: "100%" }}>
            {tiposFiltrados.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <p>
                  {tiposUnidadeList.length === 0
                    ? "Nenhum tipo de unidade cadastrado."
                    : "Nenhum tipo de unidade encontrado com os filtros aplicados."}
                </p>
                <button
                  onClick={handleAddTipoUnidade}
                  style={{
                    marginTop: "15px",
                    padding: "10px 20px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Cadastrar Primeiro Tipo de Unidade
                </button>
              </div>
            ) : (
              tiposFiltrados.map((tipo) => (
                <div
                  key={tipo.id_tipo_unidade}
                  style={{ marginBottom: "15px" }}
                >
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
                          {tipo.nome_tipo_unidade}
                        </h3>

                        {tipo.eixo && (
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#666",
                              marginBottom: "5px",
                            }}
                          >
                            <strong>Eixo:</strong> {tipo.eixo.nome}
                          </div>
                        )}

                        <div
                          style={{
                            fontSize: "14px",
                            color: "#888",
                            marginTop: "10px",
                          }}
                        >
                          <span>ID: {tipo.id_tipo_unidade}</span>
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
                          onClick={() => handleEditTipoUnidade(tipo)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <FaEdit /> Editar
                        </BotaoEditar>
                        <BotaoRemover
                          onClick={() => handleOpenConfirm(tipo)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <FaTrash /> Remover
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

      {isModalConfirm && (
        <ContainerModal>
          <Modal>
            <ConteudoModal>
              <TituloModal>Confirmar Remoção</TituloModal>
              <TextoModal>
                <div>
                  <p>Tem certeza que deseja remover este tipo de unidade?</p>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "red",
                    }}
                  >
                    {tipoSelecionado?.nome_tipo_unidade}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>
                      Observação:
                      <br />
                      Esta ação não pode ser revertida.
                    </strong>
                  </p>
                </div>
              </TextoModal>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                }}
              >
                <CancelButton onClick={handleCloseConfirm}>
                  Cancelar
                </CancelButton>
                <ConfirmButton onClick={handleRemoverTipoUnidade}>
                  Confirmar
                </ConfirmButton>
              </div>
            </ConteudoModal>
          </Modal>
        </ContainerModal>
      )}

      <Footer>&copy; Todos os direitos reservados</Footer>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["tedplan.token"]: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const apiClient = getAPIClient(ctx);
    
    // Carregar tipos de unidade
    const responseTipos = await apiClient.get("/tipo-unidade");
    const tiposUnidade = responseTipos.data || [];

    // Carregar eixos
    const responseEixos = await apiClient.get("/getEixos");
    const eixos = responseEixos.data || [];

    return {
      props: {
        tiposUnidade,
        eixos,
      },
    };
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    return {
      props: {
        tiposUnidade: [],
        eixos: [],
      },
    };
  }
};
