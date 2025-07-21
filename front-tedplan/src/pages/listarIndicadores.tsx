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

interface IIndicador {
  id_indicador: string;
  codigo_indicador: string;
  nome_indicador: string;
  grupo_indicador: string;
  palavra_chave: string;
  unidade_indicador: string;
  formula_calculo_indicador: string;
  informacoes_indicador: string;
  indicador_correspondente_ou_similar_snis: string;
  id_menu_item: string;
  id_tipo_campo_indicador: string;
  created_at: string;
  updated_at: string;
  menuItem?: {
    id_menu_item: string;
    nome_menu_item: string;
    menu?: {
      titulo: string;
    };
  };
  tipoCampoIndicador?: {
    name_campo: string;
    type: string;
  };
}

interface IndicadorProps {
  indicadores: IIndicador[];
}

// Componente para badge de grupo
const GrupoBadge = ({ grupo }: { grupo: string }) => {
  const getGrupoColor = (grupo: string) => {
    const colors: { [key: string]: string } = {
      "Água": "#007bff",
      "Esgoto": "#28a745", 
      "Resíduos Sólidos": "#dc3545",
      "Drenagem": "#17a2b8",
      "Gestão": "#6f42c1",
      "Financeiro": "#fd7e14",
      "Qualidade": "#20c997",
      "Operacional": "#ffc107",
      "Ambiental": "#198754",
      "Social": "#e83e8c",
    };
    return colors[grupo] || "#6c757d";
  };

  return (
    <span
      style={{
        backgroundColor: getGrupoColor(grupo),
        color: "white",
        padding: "4px 8px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: "bold",
      }}
    >
      {grupo}
    </span>
  );
};

export default function ListarIndicadores({ indicadores }: IndicadorProps) {
  const { permission } = useContext(AuthContext);

  const [isModalConfirm, setModalConfirm] = useState(false);
  const [indicadorSelecionado, setIndicadorSelecionado] = useState<IIndicador | null>(null);
  const [indicadoresList, setIndicadoresList] = useState<IIndicador[]>(indicadores || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroGrupo, setFiltroGrupo] = useState<string>("todos");

  // Grupos únicos dos indicadores
  const gruposUnicos = Array.from(new Set(indicadoresList
    .filter(ind => ind.grupo_indicador)
    .map(ind => ind.grupo_indicador)
  )).sort();

  useEffect(() => {
    const { ["tedplan.token"]: token } = parseCookies();
    if (!token) {
      Router.push("/login");
    }
    loadIndicadores();
  }, []);

  async function loadIndicadores() {
    try {
      const apiClient = getAPIClient();
      const response = await apiClient.get("/indicadores-novo");
      setIndicadoresList(response.data);
    } catch (error) {
      console.error("Erro ao carregar indicadores:", error);
      toast.notify("Erro ao carregar indicadores!", {
        title: "Erro!",
        duration: 7,
        type: "error",
      });
    }
  }

  function handleAddIndicador() {
    Router.push("/addIndicador");
  }

  function handleEditIndicador(indicador: IIndicador) {
    Router.push(`/addIndicador?id=${indicador.id_indicador}`);
  }

  function handleOpenConfirm(indicador: IIndicador) {
    setIndicadorSelecionado(indicador);
    setModalConfirm(true);
  }

  function handleCloseConfirm() {
    setModalConfirm(false);
    setIndicadorSelecionado(null);
  }

  async function handleRemoverIndicador() {
    if (!indicadorSelecionado) return;

    try {
      const apiClient = getAPIClient();
      await apiClient.delete(`/indicadores-novo/${indicadorSelecionado.id_indicador}`);
      
      toast.notify("Indicador removido com sucesso!", {
        title: "Sucesso!",
        duration: 7,
        type: "success",
      });
      
      setModalConfirm(false);
      setIndicadorSelecionado(null);
      loadIndicadores(); // Recarregar a lista
    } catch (error) {
      console.error("Erro ao remover indicador:", error);
      toast.notify("Erro ao remover indicador!", {
        title: "Erro!",
        duration: 7,
        type: "error",
      });
    }
  }

  // Filtrar indicadores baseado no termo de busca e grupo
  const indicadoresFiltrados = indicadoresList.filter((indicador) => {
    const matchesSearch = 
      indicador.nome_indicador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      indicador.codigo_indicador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (indicador.palavra_chave && indicador.palavra_chave.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (indicador.unidade_indicador && indicador.unidade_indicador.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesGrupo = 
      filtroGrupo === "todos" ||
      indicador.grupo_indicador === filtroGrupo;

    return matchesSearch && matchesGrupo;
  });

  return (
    <Container>
      <MenuSuperior usuarios={[]} />

      <DivCenter>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2>Lista de Indicadores</h2>
          {(permission.adminGeral || permission.adminTedPlan) && (
            <BotaoAdicionar onClick={handleAddIndicador}>
              + Novo Indicador
            </BotaoAdicionar>
          )}
        </div>

        <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Buscar por nome, código, palavra-chave ou unidade..."
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
            value={filtroGrupo}
            onChange={(e) => setFiltroGrupo(e.target.value)}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px",
              minWidth: "150px",
            }}
          >
            <option value="todos">Todos os grupos</option>
            {gruposUnicos.map((grupo) => (
              <option key={grupo} value={grupo}>
                {grupo}
              </option>
            ))}
          </select>
        </div>

        <ListPost>
          {indicadoresFiltrados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p>Nenhum indicador encontrado.</p>
            </div>
          ) : (
            indicadoresFiltrados.map((indicador) => (
              <div key={indicador.id_indicador} style={{ marginBottom: "15px" }}>
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
                          {indicador.nome_indicador}
                        </h3>
                        {indicador.grupo_indicador && (
                          <GrupoBadge grupo={indicador.grupo_indicador} />
                        )}
                      </div>
                      
                      <div style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
                        <strong>Código:</strong> {indicador.codigo_indicador}
                      </div>
                      
                      {indicador.unidade_indicador && (
                        <div style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
                          <strong>Unidade:</strong> {indicador.unidade_indicador}
                        </div>
                      )}

                      {indicador.menuItem && (
                        <div style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
                          <strong>Menu:</strong> {indicador.menuItem.menu?.titulo} - {indicador.menuItem.nome_menu_item}
                        </div>
                      )}

                      {indicador.tipoCampoIndicador && (
                        <div style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
                          <strong>Tipo de Campo:</strong> {indicador.tipoCampoIndicador.name_campo} ({indicador.tipoCampoIndicador.type})
                        </div>
                      )}

                      {indicador.palavra_chave && (
                        <div style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
                          <strong>Palavras-chave:</strong> {indicador.palavra_chave}
                        </div>
                      )}

                      {indicador.indicador_correspondente_ou_similar_snis && (
                        <div style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
                          <strong>SNIS:</strong> {indicador.indicador_correspondente_ou_similar_snis}
                        </div>
                      )}

                      {indicador.informacoes_indicador && (
                        <div style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
                          <strong>Informações:</strong> 
                          <div style={{ marginTop: "5px", fontStyle: "italic" }}>
                            {indicador.informacoes_indicador.length > 200
                              ? `${indicador.informacoes_indicador.substring(0, 200)}...`
                              : indicador.informacoes_indicador
                            }
                          </div>
                        </div>
                      )}
                      
                      <div style={{ fontSize: "14px", color: "#888", marginTop: "10px" }}>
                        <span>ID: {indicador.id_indicador}</span>
                      </div>
                    </div>

                    {(permission.adminGeral || permission.adminTedPlan) && (
                      <div style={{ display: "flex", gap: "10px", marginLeft: "20px" }}>
                        <BotaoEditar onClick={() => handleEditIndicador(indicador)}>
                          Editar
                        </BotaoEditar>
                        <BotaoRemover onClick={() => handleOpenConfirm(indicador)}>
                          Remover
                        </BotaoRemover>
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
              Tem certeza que deseja remover o indicador "{indicadorSelecionado?.nome_indicador}" ({indicadorSelecionado?.codigo_indicador})?
              <br />
              <strong>Esta ação não pode ser desfeita.</strong>
            </TextoModal>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <CancelButton onClick={handleCloseConfirm}>Cancelar</CancelButton>
              <ConfirmButton onClick={handleRemoverIndicador}>Confirmar</ConfirmButton>
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
    const response = await apiClient.get("/indicadores-novo");

    return {
      props: {
        indicadores: response.data || [],
      },
    };
  } catch (error) {
    console.error("Erro ao carregar indicadores:", error);
    return {
      props: {
        indicadores: [],
      },
    };
  }
};
