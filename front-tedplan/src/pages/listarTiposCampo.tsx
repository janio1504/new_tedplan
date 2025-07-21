import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { AuthContext } from "../contexts/AuthContext";
import { getAPIClient } from "../services/axios";
import Router from "next/router";
import MenuSuperior from "../components/head";
import { toast, ToastContainer } from "react-nextjs-toast";
import {
  Container,
  NewButton,
  ListPost,
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
} from "../styles/dashboard";

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
      toast.notify("Erro ao carregar tipos de campo!", {
        title: "Erro!",
        duration: 7,
        type: "error",
      });
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
      
      toast.notify("Tipo de campo removido com sucesso!", {
        title: "Sucesso!",
        duration: 7,
        type: "success",
      });
      
      setModalConfirm(false);
      setTipoCampoSelecionado(null);
      loadTiposCampo(); // Recarregar a lista
    } catch (error) {
      console.error("Erro ao remover tipo de campo:", error);
      toast.notify("Erro ao remover tipo de campo!", {
        title: "Erro!",
        duration: 7,
        type: "error",
      });
    }
  }

  async function handleToggleStatus(tipoCampo: ITipoCampo) {
    try {
      const apiClient = getAPIClient();
      await apiClient.patch(`/tipos-campo/${tipoCampo.id_tipo_campo_indicador}/toggle-status`);
      
      toast.notify("Status alterado com sucesso!", {
        title: "Sucesso!",
        duration: 5,
        type: "success",
      });
      
      loadTiposCampo(); // Recarregar a lista
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      toast.notify("Erro ao alterar status!", {
        title: "Erro!",
        duration: 7,
        type: "error",
      });
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

  return (
    <Container>
      <MenuSuperior usuarios={[]} />

      <DivCenter>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2>Lista de Tipos de Campo</h2>
          {(permission.adminGeral || permission.adminTedPlan) && (
            <BotaoAdicionar onClick={handleAddTipoCampo}>
              + Novo Tipo de Campo
            </BotaoAdicionar>
          )}
        </div>

        <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Buscar por nome, tipo ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px",
            }}
          />
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value as "todos" | "ativos" | "inativos")}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px",
              minWidth: "120px",
            }}
          >
            <option value="todos">Todos</option>
            <option value="ativos">Ativos</option>
            <option value="inativos">Inativos</option>
          </select>
        </div>

        <ListPost>
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
        </ListPost>
      </DivCenter>

      {isModalConfirm && (
        <Modal>
          <ConteudoModal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <TituloModal>Confirmar Exclusão</TituloModal>
              <CloseModalButton onClick={handleCloseConfirm}>×</CloseModalButton>
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

      <Footer>
        &copy; Todos os direitos reservados
        <ToastContainer />
      </Footer>
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
