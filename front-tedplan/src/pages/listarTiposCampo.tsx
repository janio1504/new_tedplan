import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { AuthContext } from "../contexts/AuthContext";
import { getAPIClient } from "../services/axios";
import Router from "next/router";
import MenuSuperior from "../components/head";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import Sidebar from "@/components/Sidebar";
import {
  Container,
  Footer,
  DivCenter,
  BotaoEditar,
  BotaoRemover,
  Modal,
  CloseModalButton,
  ConteudoModal,
  TituloModal,
  TextoModal,
  ConfirmButton,
  CancelButton,
  BotaoAdicionar,
  MenuMunicipioItem,
  DivMenuTitulo,
} from "../styles/dashboard";
import { BodyDashboard } from "@/styles/dashboard-original";
import HeadIndicadores from "@/components/headIndicadores";


interface ITipoCampo {
  id_tipo_campo_indicador: string;
  name_campo: string;
  type: string;
  id_campo: string;
  enable: boolean;
  default_value: string;
  created_at: string;
  updated_at: string;
}

interface TipoCampoProps {
  tiposCampo: ITipoCampo[];
}

// Componente para badge de tipo
const TypeBadge = ({ type }: { type: string }) => {
  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      text: "#007bff",
      number: "#28a745",
      email: "#17a2b8",
      password: "#dc3545",
      textarea: "#6f42c1",
      select: "#fd7e14",
      checkbox: "#20c997",
      radio: "#e83e8c",
      date: "#ffc107",
      datetime: "#6c757d",
      file: "#343a40",
      url: "#007bff",
      tel: "#17a2b8",
    };
    return colors[type] || "#6c757d";
  };

  return (
    <span
      style={{
        backgroundColor: getTypeColor(type),
        color: "white",
        padding: "4px 8px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: "bold",
      }}
    >
      {type}
    </span>
  );
};

export default function ListarTiposCampo({ tiposCampo }: TipoCampoProps) {
  const { permission } = useContext(AuthContext);

  const [isModalConfirm, setModalConfirm] = useState(false);
  const [tipoCampoSelecionado, setTipoCampoSelecionado] = useState<ITipoCampo | null>(null);
  const [tiposCampoList, setTiposCampoList] = useState<ITipoCampo[]>(tiposCampo || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<"todos" | "ativos" | "inativos">("todos");
  const {signOut} = useContext(AuthContext);

  useEffect(() => {
    const { ["tedplan.token"]: token } = parseCookies();
    if (!token) {
      Router.push("/login");
    }
    loadTiposCampo();
  }, []);

  async function loadTiposCampo() {
    try {
      const apiClient = getAPIClient();
      const response = await apiClient.get("/tipos-campo");
      setTiposCampoList(response.data);
    } catch (error) {
      console.error("Erro ao carregar tipos de campo:", error);
      toast.error("Erro ao carregar tipos de campo!", { position: "top-right", autoClose: 5000 });
    }
  }

  function handleAddTipoCampo() {
    Router.push("/addTipoCampoIndicador");
  }

  function handleEditTipoCampo(tipoCampo: ITipoCampo) {
    Router.push(`/addTipoCampoIndicador?id=${tipoCampo.id_tipo_campo_indicador}`);
  }

  function handleOpenConfirm(tipoCampo: ITipoCampo) {
    setTipoCampoSelecionado(tipoCampo);
    setModalConfirm(true);
  }

  function handleCloseConfirm() {
    setModalConfirm(false);
    setTipoCampoSelecionado(null);
  }

  async function handleRemoverTipoCampo() {
    if (!tipoCampoSelecionado) return;

    try {
      const apiClient = getAPIClient();
      await apiClient.delete(`/tipos-campo/${tipoCampoSelecionado.id_tipo_campo_indicador}`);
      
      toast.success("Tipo de campo removido com sucesso!", { position: "top-right", autoClose: 5000 });
      
      setModalConfirm(false);
      setTipoCampoSelecionado(null);
      loadTiposCampo(); // Recarregar a lista
    } catch (error) {
      console.error("Erro ao remover tipo de campo:", error);
      toast.error("Erro ao remover tipo de campo!", { position: "top-right", autoClose: 5000 });
    }
  }

  async function handleToggleStatus(tipoCampo: ITipoCampo) {
    try {
      const apiClient = getAPIClient();
      await apiClient.patch(`/tipos-campo/${tipoCampo.id_tipo_campo_indicador}/toggle-status`);
      
      toast.success("Status alterado com sucesso!", { position: "top-right", autoClose: 5000 });
      
      loadTiposCampo(); // Recarregar a lista
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      toast.error("Erro ao alterar status!", { position: "top-right", autoClose: 5000 });
    }
  }

  // Filtrar tipos de campo baseado no termo de busca e status
  const tiposCampoFiltrados = tiposCampoList.filter((tipoCampo) => {
    const matchesSearch = 
      tipoCampo.name_campo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tipoCampo.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tipoCampo.id_campo && tipoCampo.id_campo.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = 
      filtroStatus === "todos" ||
      (filtroStatus === "ativos" && tipoCampo.enable) ||
      (filtroStatus === "inativos" && !tipoCampo.enable);

    return matchesSearch && matchesStatus;
  });

  async function handleSignOut() {
      signOut();
    }
  
    function handleSimisab() {
          Router.push("/indicadores/home_indicadores");
        }

  return (
    <Container>
      {/* <MenuSuperior usuarios={[]} /> */}
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
          <h2>Lista de Tipos de Campo</h2>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div style={{ position: "relative", width: "30%" }}>  <input
              type="text"
              placeholder="Buscar por nome, tipo ou ID..."
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
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value as "todos" | "ativos" | "inativos")}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "16px",
              width: "20%",
              minWidth: "120px",
            }}
          >
            <option value="todos">Todos</option>
            <option value="ativos">Ativos</option>
            <option value="inativos">Inativos</option>
          </select>
          {/* {(permission.adminGeral || permission.adminTedPlan) && ( */}
          <BotaoAdicionar onClick={handleAddTipoCampo} style={{ marginLeft: "10px" }}>
            + Novo Tipo de Campo
          </BotaoAdicionar>
          {/* )} */}
        </div>

        <div style={{ width: "100%" }}>
          {tiposCampoFiltrados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p>Nenhum tipo de campo encontrado.</p>
            </div>
          ) : (
            tiposCampoFiltrados.map((tipoCampo) => (
              <div key={tipoCampo.id_tipo_campo_indicador} style={{ marginBottom: "15px" }}>
                <div
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: "20px",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                        <h3 style={{ margin: "0", color: "#333" }}>
                          {tipoCampo.name_campo}
                        </h3>
                        <TypeBadge type={tipoCampo.type} />
                        <span
                          style={{
                            backgroundColor: tipoCampo.enable ? "#28a745" : "#dc3545",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          {tipoCampo.enable ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                      
                      <div style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
                        {tipoCampo.id_campo && (
                          <span><strong>ID Campo:</strong> {tipoCampo.id_campo}</span>
                        )}
                      </div>
                      
                      {tipoCampo.default_value && (
                        <div style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
                          <strong>Valor Padrão:</strong> {tipoCampo.default_value}
                        </div>
                      )}
                      
                      <div style={{ fontSize: "14px", color: "#888" }}>
                        <span>ID: {tipoCampo.id_tipo_campo_indicador}</span>
                      </div>
                    </div>

                    {(permission.adminGeral || permission.adminTedPlan) && (
                      <div style={{ display: "flex", gap: "10px", marginLeft: "20px", flexDirection: "column" }}>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <BotaoEditar onClick={() => handleEditTipoCampo(tipoCampo)}>
                            Editar
                          </BotaoEditar>
                          <BotaoRemover onClick={() => handleOpenConfirm(tipoCampo)}>
                            Remover
                          </BotaoRemover>
                        </div>
                        <button
                          onClick={() => handleToggleStatus(tipoCampo)}
                          style={{
                            padding: "8px 12px",
                            borderRadius: "4px",
                            border: "none",
                            backgroundColor: tipoCampo.enable ? "#ffc107" : "#28a745",
                            color: "white",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          {tipoCampo.enable ? "Desativar" : "Ativar"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DivCenter>
      </BodyDashboard>

      {isModalConfirm && (
        <Modal>
          <ConteudoModal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <TituloModal>Confirmar Exclusão</TituloModal>
              <CloseModalButton onClick={handleCloseConfirm}>
                &times;
              </CloseModalButton>
            </div>
            <TextoModal>
              Tem certeza que deseja remover o tipo de campo "{tipoCampoSelecionado?.name_campo}"?
              <br />
              <strong>Esta ação não pode ser desfeita.</strong>
            </TextoModal>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <CancelButton onClick={handleCloseConfirm}>Cancelar</CancelButton>
              <ConfirmButton onClick={handleRemoverTipoCampo}>Confirmar</ConfirmButton>
            </div>
          </ConteudoModal>
        </Modal>
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
    const response = await apiClient.get("/tipos-campo");

    return {
      props: {
        tiposCampo: response.data || [],
      },
    };
  } catch (error) {
    console.error("Erro ao carregar tipos de campo:", error);
    return {
      props: {
        tiposCampo: [],
      },
    };
  }
};
