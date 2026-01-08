import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useState, useMemo } from "react";
import { parseCookies } from "nookies";
import { AuthContext } from "../contexts/AuthContext";
import { getAPIClient } from "../services/axios";
import Router from "next/router";
import MenuSuperior from "../components/head";
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
} from "../styles/dashboard";
import { BodyDashboard } from "@/styles/dashboard-original";
import HeadIndicadores from "@/components/headIndicadores";

interface ISelectOption {
  id_select_option: string;
  value: string;
  descricao: string;
  ordem_option: number;
}

interface ICheckBoxItem {
  id_item_check_box: string;
  descricao: string;
  valor: string;
}

interface ITipoCampoIndicador {
  id_tipo_campo_indicador: string;
  type: string;
  name_campo: string;
  enable: boolean;
  default_value: string;
  selectOptions?: ISelectOption[];
  checkBoxItems?: ICheckBoxItem[];
}

interface IIndicador {
  id_indicador: string;
  codigo_indicador: string;
  nome_indicador: string;
  grupo_indicador: string;
  unidade_indicador: string;
  formula_calculo_indicador: string;
  informacoes_indicador: string;
  indicador_correspondente_ou_similar_snis: string;
  id_menu_item: string;
  id_tipo_unidade?: string;
  created_at: string;
  updated_at: string;
  is_unidade?: boolean;
  menuItem?: {
    id_menu_item: string;
    nome_menu_item: string;
    menu?: {
      titulo: string;
    };
  };
  tipoUnidade?: {
    id_tipo_unidade: string;
    nome_tipo_unidade: string;
  };
  tiposCampo?: ITipoCampoIndicador[];
}

interface IndicadorProps {
  indicadores: IIndicador[];
}

// Componente para badge de grupo
const GrupoBadge = ({ grupo }: { grupo: string }) => {
  const getGrupoColor = (grupo: string) => {
    const colors: { [key: string]: string } = {
      Água: "#007bff",
      Esgoto: "#28a745",
      "Resíduos Sólidos": "#dc3545",
      Drenagem: "#17a2b8",
      Gestão: "#6f42c1",
      Financeiro: "#fd7e14",
      Qualidade: "#20c997",
      Operacional: "#ffc107",
      Ambiental: "#198754",
      Social: "#e83e8c",
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

// Componente para exibir tipo de campo
const TipoCampoInfo = ({ tipoCampo }: { tipoCampo: ITipoCampoIndicador }) => {
  const getTipoLabel = (type: string) => {
    const tipos: { [key: string]: string } = {
      text: "Texto",
      number: "Número",
      email: "Email",
      password: "Senha",
      textarea: "Área de Texto",
      select: "Seleção (Dropdown)",
      checkbox: "Caixa de Seleção",
      radio: "Botões de Opção",
      date: "Data",
      file: "Arquivo",
    };
    return tipos[type] || type;
  };

  return (
    <div
      style={{
        backgroundColor: "#f0f7ff",
        padding: "12px",
        borderRadius: "6px",
        marginTop: "10px",
        border: "1px solid #d1ecf1",
      }}
    >
      <div style={{ fontSize: "14px", marginBottom: "8px", color: "#495057" }}>
        <strong>Campo de Entrada:</strong> {tipoCampo.name_campo}
      </div>
      <div style={{ fontSize: "14px", marginBottom: "5px", color: "#495057" }}>
        <strong>Tipo:</strong> {getTipoLabel(tipoCampo.type)}
      </div>
      {tipoCampo.default_value && (
        <div
          style={{ fontSize: "14px", marginBottom: "5px", color: "#495057" }}
        >
          <strong>Valor Padrão:</strong> {tipoCampo.default_value}
        </div>
      )}
      <div style={{ fontSize: "14px", marginBottom: "5px" }}>
        <span
          style={{
            color: tipoCampo.enable ? "#28a745" : "#dc3545",
            fontWeight: "bold",
          }}
        >
          {tipoCampo.enable ? "✓ Ativo" : "✗ Inativo"}
        </span>
      </div>

      {/* Mostrar opções de select se houver */}
      {tipoCampo.type === "select" &&
        tipoCampo.selectOptions &&
        tipoCampo.selectOptions.length > 0 && (
          <div style={{ marginTop: "10px" }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "5px",
                color: "#6c757d",
              }}
            >
              Opções disponíveis:
            </div>
            <div style={{ fontSize: "13px" }}>
              {tipoCampo.selectOptions
                .sort((a, b) => a.ordem_option - b.ordem_option)
                .map((option, index) => (
                  <span key={option.id_select_option}>
                    <code
                      style={{
                        backgroundColor: "#e9ecef",
                        padding: "2px 5px",
                        borderRadius: "3px",
                        marginRight: "5px",
                      }}
                    >
                      {option.value}
                    </code>
                    <span style={{ color: "#6c757d" }}>
                      ({option.descricao})
                    </span>
                    {index < tipoCampo.selectOptions!.length - 1 && ", "}
                  </span>
                ))}
            </div>
          </div>
        )}

      {/* Mostrar itens de checkbox se houver */}
      {tipoCampo.type === "checkbox" &&
        tipoCampo.checkBoxItems &&
        tipoCampo.checkBoxItems.length > 0 && (
          <div style={{ marginTop: "10px" }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "5px",
                color: "#6c757d",
              }}
            >
              Itens disponíveis:
            </div>
            <div style={{ fontSize: "13px" }}>
              {tipoCampo.checkBoxItems.map((item, index) => (
                <span key={item.id_item_check_box}>
                  <code
                    style={{
                      backgroundColor: "#0356fc",
                      padding: "2px 5px",
                      borderRadius: "3px",
                      marginRight: "5px",
                    }}
                  >
                    {item.descricao}
                  </code>
                  {index < tipoCampo.checkBoxItems!.length - 1 && ", "}
                </span>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default function ListarIndicadores({ indicadores }: IndicadorProps) {
  const { permission } = useContext(AuthContext);
  const { signOut } = useContext(AuthContext);
  const [isModalConfirm, setModalConfirm] = useState(false);
  const [indicadorSelecionado, setIndicadorSelecionado] =
    useState<IIndicador | null>(null);
  // Usar indicadores como vêm do banco, sem ordenação adicional
  const [indicadoresList, setIndicadoresList] = useState<IIndicador[]>(
    indicadores || []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroGrupo, setFiltroGrupo] = useState<string>("todos");
  const [filtroTipoCampo, setFiltroTipoCampo] = useState<string>("todos");
  const [loadingTipos, setLoadingTipos] = useState(false);
  const [viewMode, setViewMode] = useState<"normal" | "porTipoUnidade">("normal");

  // Grupos únicos dos indicadores
  const gruposUnicos = Array.from(
    new Set(
      indicadoresList
        .filter((ind) => ind.grupo_indicador)
        .map((ind) => ind.grupo_indicador)
    )
  ).sort();

  // Tipos de campo únicos
  const tiposCampoUnicos = Array.from(
    new Set(
      indicadoresList
        .filter((ind) => ind.tiposCampo && ind.tiposCampo.length > 0)
        .map((ind) => ind.tiposCampo![0].type)
    )
  ).sort();

  useEffect(() => {
    const { ["tedplan.token"]: token } = parseCookies();
    if (!token) {
      Router.push("/login");
    }

    // Só carregar os tipos se não vieram do SSR
    // Usar os indicadores como vêm do banco
    if (indicadores && indicadores.length > 0) {
      loadTiposCampoForIndicadores(indicadores);
    }
  }, []);

  async function loadTiposCampoForIndicadores(
    indicadoresParaProcessar?: IIndicador[]
  ) {
    setLoadingTipos(true);
    try {
      const apiClient = getAPIClient();

      // Usar os indicadores passados como parâmetro ou o estado atual
      // Manter a ordem como vem do banco
      const indicadoresAtuais = indicadoresParaProcessar || [
        ...indicadoresList,
      ];

      // Carregar tipos de campo para cada indicador de forma mais robusta
      // Promise.allSettled mantém a ordem dos resultados
      const indicadoresComTipos = await Promise.allSettled(
        indicadoresAtuais.map(async (indicador) => {
          try {
            // Buscar tipos de campo do indicador
            const tiposResponse = await apiClient.get(
              `/tipos-campo/indicador/${indicador.id_indicador}`
            );
            const tiposCampo = tiposResponse.data || [];

            // Para tipos select, buscar opções
            const tiposComOpcoes = await Promise.allSettled(
              tiposCampo.map(async (tipo: ITipoCampoIndicador) => {
                if (tipo.type === "select") {
                  try {
                    const opcoesResponse = await apiClient.get(
                      `/select-options/tipo-campo/${tipo.id_tipo_campo_indicador}`
                    );
                    return {
                      ...tipo,
                      selectOptions: opcoesResponse.data || [],
                    };
                  } catch (error) {
                    console.error(
                      `Erro ao carregar opções para tipo ${tipo.id_tipo_campo_indicador}:`,
                      error
                    );
                    return tipo;
                  }
                }
                if (tipo.type === "checkbox") {
                  try {
                    const checkBoxResponse = await apiClient.get(
                      `/item-check-box/indicador/${indicador.id_indicador}`
                    );
                    return {
                      ...tipo,
                      checkBoxItems: checkBoxResponse.data || [],
                    };
                  } catch (error) {
                    console.error(
                      `Erro ao carregar itens de checkbox para tipo ${tipo.id_tipo_campo_indicador}:`,
                      error
                    );
                    return tipo;
                  }
                }
                return tipo;
              })
            );

            const tiposCompletos = tiposComOpcoes
              .filter((result) => result.status === "fulfilled")
              .map((result) =>
                result.status === "fulfilled" ? result.value : null
              )
              .filter(Boolean);

            return {
              ...indicador,
              tiposCampo: tiposCompletos,
            };
          } catch (error) {
            console.error(
              `Erro ao carregar tipos para indicador ${indicador.id_indicador}:`,
              error
            );
            return indicador;
          }
        })
      );

      // Processar apenas os resultados bem-sucedidos
      // Promise.allSettled mantém a ordem dos resultados
      const resultados: IIndicador[] = indicadoresComTipos
        .map((result, index) => {
          if (result.status === "fulfilled" && result.value) {
            return result.value;
          }
          // Se falhou, manter o indicador original
          return indicadoresAtuais[index];
        })
        .filter((ind): ind is IIndicador => ind !== undefined && ind !== null);

      // Manter a ordem como vem do banco, sem ordenação adicional

      setIndicadoresList(resultados);
    } catch (error) {
      console.error("Erro ao carregar tipos de campo:", error);
      toast.error("Erro ao carregar detalhes dos indicadores!", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoadingTipos(false);
    }
  }

  async function loadIndicadores() {
    try {
      const apiClient = getAPIClient();
      const response = await apiClient.get("/indicadores-novo");
      const indicadores = response.data || [];

      setIndicadoresList(indicadores);

      // Recarregar tipos de campo com os indicadores já ordenados
      if (indicadores.length > 0) {
        loadTiposCampoForIndicadores(indicadores);
      }
    } catch (error) {
      console.error("Erro ao carregar indicadores:", error);
      toast.error("Erro ao carregar indicadores!", {
        position: "top-right",
        autoClose: 5000,
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

      // Tentar remover tipos de campo e opções do indicador primeiro
      try {
        await apiClient.delete(
          `/tipos-campo/indicador/${indicadorSelecionado.id_indicador}`
        );
      } catch (error) {
        console.log(
          "Aviso: Erro ao remover tipos de campo (pode não existir):",
          error
        );
      }

      // Tentar remover itens de checkbox do indicador
      try {
        await apiClient.delete(
          `/item-check-box/indicador/${indicadorSelecionado.id_indicador}`
        );
      } catch (error) {
        console.log(
          "Aviso: Erro ao remover itens de checkbox (pode não existir):",
          error
        );
      }

      // Remover o indicador
      await apiClient.delete(
        `/indicadores-novo/${indicadorSelecionado.id_indicador}`
      );

      toast.success("Indicador removido com sucesso!", {
        position: "top-right",
        autoClose: 5000,
      });

      setModalConfirm(false);
      setIndicadorSelecionado(null);
      loadIndicadores(); // Recarregar a lista
    } catch (error) {
      console.error("Erro ao remover indicador:", error);
      toast.error("Erro ao remover indicador!", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }

  // Filtrar indicadores baseado no termo de busca, grupo e tipo de campo
  const indicadoresFiltrados = indicadoresList
    .filter((indicador) => {
      const matchesSearch =
        indicador.nome_indicador
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        indicador.codigo_indicador
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (indicador.unidade_indicador &&
          indicador.unidade_indicador
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (indicador.tiposCampo &&
          indicador.tiposCampo.length > 0 &&
          indicador.tiposCampo[0].name_campo
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      const matchesGrupo =
        filtroGrupo === "todos" || indicador.grupo_indicador === filtroGrupo;

      const matchesTipoCampo =
        filtroTipoCampo === "todos" ||
        (indicador.tiposCampo &&
          indicador.tiposCampo.length > 0 &&
          indicador.tiposCampo[0].type === filtroTipoCampo);

      return matchesSearch && matchesGrupo && matchesTipoCampo;
    })
    .sort((a, b) => {
      // Garantir ordenação descendente por id_indicador mesmo após filtros
      const idA = parseInt(String(a.id_indicador), 10) || 0;
      const idB = parseInt(String(b.id_indicador), 10) || 0;
      return idB - idA; // Ordem descendente: maior para menor
    });

  const getTipoLabel = (type: string) => {
    const tipos: { [key: string]: string } = {
      text: "Texto",
      number: "Número",
      email: "Email",
      password: "Senha",
      textarea: "Área de Texto",
      select: "Seleção",
      checkbox: "Checkbox",
      radio: "Radio",
      date: "Data",
      file: "Arquivo",
    };
    return tipos[type] || type;
  };

  // Agrupar indicadores de unidade por tipo_unidade
  const indicadoresPorTipoUnidade = useMemo(() => {
    const indicadoresUnidade = indicadoresFiltrados.filter(
      (ind) => ind.is_unidade && ind.tipoUnidade
    );

    const agrupados: {
      [key: string]: {
        tipoUnidade: { id_tipo_unidade: string; nome_tipo_unidade: string };
        indicadores: IIndicador[];
      };
    } = {};

    indicadoresUnidade.forEach((indicador) => {
      const tipoUnidadeId = indicador.tipoUnidade!.id_tipo_unidade;
      if (!agrupados[tipoUnidadeId]) {
        agrupados[tipoUnidadeId] = {
          tipoUnidade: indicador.tipoUnidade!,
          indicadores: [],
        };
      }
      agrupados[tipoUnidadeId].indicadores.push(indicador);
    });

    // Ordenar por nome do tipo de unidade
    return Object.values(agrupados).sort((a, b) =>
      a.tipoUnidade.nome_tipo_unidade.localeCompare(
        b.tipoUnidade.nome_tipo_unidade
      )
    );
  }, [indicadoresFiltrados]);

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
        <ul style={{}}>
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
            <h2>Lista de Indicadores</h2>
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
                placeholder="Buscar por nome, código, palavra-chave, unidade ou campo..."
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
                value={filtroGrupo}
                onChange={(e) => setFiltroGrupo(e.target.value)}
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
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
              <select
                value={filtroTipoCampo}
                onChange={(e) => setFiltroTipoCampo(e.target.value)}
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "16px",
                  minWidth: "150px",
                }}
              >
                <option value="todos">Todos os tipos</option>
                {tiposCampoUnicos.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {getTipoLabel(tipo)}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() =>
                setViewMode(
                  viewMode === "normal" ? "porTipoUnidade" : "normal"
                )
              }
              style={{
                padding: "10px 20px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px",
                backgroundColor: viewMode === "porTipoUnidade" ? "#007bff" : "white",
                color: viewMode === "porTipoUnidade" ? "white" : "#333",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {viewMode === "normal"
                ? "📋 Ver por Tipo de Unidade"
                : "📋 Ver Lista Normal"}
            </button>
            {/* {(permission?.adminGeral || permission?.adminTedPlan) && ( */}
            <BotaoAdicionar
              onClick={handleAddIndicador}
              style={{
                marginLeft: "10px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                justifyContent: "center",
              }}
            >
              <FaPlus /> Novo Indicador
            </BotaoAdicionar>
            {/* )} */}
          </div>

          <div
            style={{ marginBottom: "15px", fontSize: "14px", color: "#666" }}
          >
            {viewMode === "porTipoUnidade" ? (
              <>
                Mostrando {indicadoresPorTipoUnidade.length}{" "}
                {indicadoresPorTipoUnidade.length === 1
                  ? "tipo de unidade"
                  : "tipos de unidade"}{" "}
                com{" "}
                {indicadoresPorTipoUnidade.reduce(
                  (acc, grupo) => acc + grupo.indicadores.length,
                  0
                )}{" "}
                indicadores
              </>
            ) : (
              <>
                Mostrando {indicadoresFiltrados.length} de{" "}
                {indicadoresList.length} indicadores
              </>
            )}
            {loadingTipos && (
              <span style={{ marginLeft: "10px", color: "#007bff" }}>
                (Carregando detalhes dos campos...)
              </span>
            )}
          </div>

          <div style={{ width: "100%" }}>
            {viewMode === "porTipoUnidade" ? (
              // Visualização agrupada por tipo de unidade
              indicadoresPorTipoUnidade.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <p>Nenhum indicador de unidade encontrado.</p>
                </div>
              ) : (
                indicadoresPorTipoUnidade.map((grupo) => (
                  <div
                    key={grupo.tipoUnidade.id_tipo_unidade}
                    style={{ marginBottom: "30px" }}
                  >
                    <div
                      style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        padding: "15px 20px",
                        borderRadius: "8px 8px 0 0",
                        marginBottom: "0",
                      }}
                    >
                      <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>
                        {grupo.tipoUnidade.nome_tipo_unidade}
                      </h3>
                      <p style={{ margin: "5px 0 0 0", fontSize: "14px", opacity: 0.9 }}>
                        {grupo.indicadores.length}{" "}
                        {grupo.indicadores.length === 1
                          ? "indicador"
                          : "indicadores"}
                      </p>
                    </div>
                    <div
                      style={{
                        border: "1px solid #e0e0e0",
                        borderTop: "none",
                        borderRadius: "0 0 8px 8px",
                        padding: "15px",
                        backgroundColor: "#f8f9fa",
                      }}
                    >
                      {grupo.indicadores.map((indicador) => (
                        <div
                          key={indicador.id_indicador}
                          style={{
                            marginBottom: "15px",
                            padding: "15px",
                            backgroundColor: "white",
                            borderRadius: "6px",
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
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                <h4 style={{ margin: 0, color: "#333" }}>
                                  {indicador.nome_indicador}
                                </h4>
                                {indicador.grupo_indicador && (
                                  <GrupoBadge grupo={indicador.grupo_indicador} />
                                )}
                              </div>

                              <div
                                style={{
                                  fontSize: "14px",
                                  color: "#666",
                                  marginBottom: "5px",
                                }}
                              >
                                <strong>Código:</strong> {indicador.codigo_indicador}
                              </div>

                              {indicador.unidade_indicador && (
                                <div
                                  style={{
                                    fontSize: "14px",
                                    color: "#666",
                                    marginBottom: "5px",
                                  }}
                                >
                                  <strong>Unidade:</strong>{" "}
                                  {indicador.unidade_indicador}
                                </div>
                              )}

                              {indicador.menuItem && (
                                <div
                                  style={{
                                    fontSize: "14px",
                                    color: "#666",
                                    marginBottom: "5px",
                                  }}
                                >
                                  <strong>Menu:</strong>{" "}
                                  {indicador.menuItem.menu?.titulo} -{" "}
                                  {indicador.menuItem.nome_menu_item}
                                </div>
                              )}

                              {indicador.tiposCampo &&
                              indicador.tiposCampo.length > 0 ? (
                                <TipoCampoInfo
                                  tipoCampo={indicador.tiposCampo[0]}
                                />
                              ) : (
                                <div
                                  style={{
                                    backgroundColor: "#fff3cd",
                                    padding: "10px",
                                    borderRadius: "4px",
                                    marginTop: "10px",
                                    border: "1px solid #ffeaa7",
                                    fontSize: "14px",
                                    color: "#856404",
                                  }}
                                >
                                  <strong>⚠️ Campo de entrada não configurado</strong>
                                </div>
                              )}

                              <div
                                style={{
                                  fontSize: "14px",
                                  color: "#888",
                                  marginTop: "10px",
                                }}
                              >
                                <span>ID: {indicador.id_indicador}</span>
                              </div>
                            </div>

                            {(permission?.adminGeral ||
                              permission?.adminTedPlan) && (
                              <div
                                style={{
                                  display: "flex",
                                  gap: "10px",
                                  marginLeft: "20px",
                                }}
                              >
                                <BotaoEditar
                                  onClick={() => handleEditIndicador(indicador)}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                  }}
                                >
                                  <FaEdit /> Editar
                                </BotaoEditar>
                                <BotaoRemover
                                  onClick={() => handleOpenConfirm(indicador)}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                  }}
                                >
                                  <FaTrash /> Remover
                                </BotaoRemover>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )
            ) : indicadoresFiltrados.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <p>
                  {indicadoresList.length === 0
                    ? "Nenhum indicador cadastrado."
                    : "Nenhum indicador encontrado com os filtros aplicados."}
                </p>
                {(permission.adminGeral || permission.adminTedPlan) && (
                  <button
                    onClick={handleAddIndicador}
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
                    Cadastrar Primeiro Indicador
                  </button>
                )}
              </div>
            ) : (
              indicadoresFiltrados.map((indicador) => (
                <div
                  key={indicador.id_indicador}
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
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "10px",
                          }}
                        >
                          <h3 style={{ margin: "0", color: "#333" }}>
                            {indicador.nome_indicador}
                          </h3>
                          {indicador.grupo_indicador && (
                            <GrupoBadge grupo={indicador.grupo_indicador} />
                          )}
                        </div>

                        <div
                          style={{
                            fontSize: "14px",
                            color: "#666",
                            marginBottom: "5px",
                          }}
                        >
                          <strong>Código:</strong> {indicador.codigo_indicador}
                        </div>

                        <div
                          style={{
                            fontSize: "14px",
                            marginBottom: "5px",
                          }}
                        >
                          <span
                            style={{
                              color: indicador.is_unidade ? "#28a745" : "#6c757d",
                              fontWeight: "bold",
                            }}
                          >
                            {indicador.is_unidade ? "✓ Campo de unidade" : "✗ Campo de unidade"}
                          </span>
                        </div>

                        {indicador.is_unidade && indicador.tipoUnidade && (
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#666",
                              marginBottom: "5px",
                            }}
                          >
                            <strong>Tipo de Unidade:</strong>{" "}
                            {indicador.tipoUnidade.nome_tipo_unidade}
                          </div>
                        )}

                        {indicador.unidade_indicador && (
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#666",
                              marginBottom: "5px",
                            }}
                          >
                            <strong>Unidade:</strong>{" "}
                            {indicador.unidade_indicador}
                          </div>
                        )}

                        {indicador.menuItem && (
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#666",
                              marginBottom: "5px",
                            }}
                          >
                            <strong>Menu:</strong>{" "}
                            {indicador.menuItem.menu?.titulo} -{" "}
                            {indicador.menuItem.nome_menu_item}
                          </div>
                        )}

                        {indicador.indicador_correspondente_ou_similar_snis && (
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#666",
                              marginBottom: "5px",
                            }}
                          >
                            <strong>SNIS:</strong>{" "}
                            {indicador.indicador_correspondente_ou_similar_snis}
                          </div>
                        )}

                        {indicador.formula_calculo_indicador && (
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#666",
                              marginBottom: "5px",
                            }}
                          >
                            <strong>Fórmula:</strong>{" "}
                            {indicador.formula_calculo_indicador}
                          </div>
                        )}

                        {indicador.informacoes_indicador && (
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#666",
                              marginTop: "10px",
                            }}
                          >
                            <strong>Informações:</strong>
                            <div
                              style={{ marginTop: "5px", fontStyle: "italic" }}
                            >
                              {indicador.informacoes_indicador.length > 200
                                ? `${indicador.informacoes_indicador.substring(
                                    0,
                                    200
                                  )}...`
                                : indicador.informacoes_indicador}
                            </div>
                          </div>
                        )}

                        {/* Exibir informações do tipo de campo */}
                        {indicador.tiposCampo &&
                        indicador.tiposCampo.length > 0 ? (
                          <TipoCampoInfo tipoCampo={indicador.tiposCampo[0]} />
                        ) : (
                          <div
                            style={{
                              backgroundColor: "#fff3cd",
                              padding: "10px",
                              borderRadius: "4px",
                              marginTop: "10px",
                              border: "1px solid #ffeaa7",
                              fontSize: "14px",
                              color: "#856404",
                            }}
                          >
                            <strong>⚠️ Campo de entrada não configurado</strong>
                            <div style={{ marginTop: "5px", fontSize: "13px" }}>
                              Este indicador ainda não possui um campo de
                              entrada definido.
                              <span
                                style={{
                                  cursor: "pointer",
                                  color: "#007bff",
                                  textDecoration: "underline",
                                }}
                                onClick={() => handleEditIndicador(indicador)}
                              >
                                Clique aqui para configurar
                              </span>
                              .
                            </div>
                          </div>
                        )}

                        <div
                          style={{
                            fontSize: "14px",
                            color: "#888",
                            marginTop: "10px",
                          }}
                        >
                          <span>ID: {indicador.id_indicador}</span>
                        </div>
                      </div>

                      {(permission?.adminGeral || permission?.adminTedPlan) && (
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            marginLeft: "20px",
                          }}
                        >
                          <BotaoEditar
                            onClick={() => handleEditIndicador(indicador)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <FaEdit /> Editar
                          </BotaoEditar>
                          <BotaoRemover
                            onClick={() => handleOpenConfirm(indicador)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <FaTrash /> Remover
                          </BotaoRemover>
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
        <ContainerModal>
          <Modal>
            <ConteudoModal>
              <TituloModal>Confirmar Remoção</TituloModal>
              <TextoModal>
                <div>
                  <p>Tem certeza que deseja remover o item do formulário?</p>
                  <p style={{ fontSize: "16px", fontWeight: "bold", color: "red" }}>
                     {indicadorSelecionado?.codigo_indicador} - {indicadorSelecionado?.nome_indicador}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>
                      Observação:<br />
                      Esta ação removerá também o tipo de campo e suas opções.
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
                <ConfirmButton onClick={handleRemoverIndicador}>
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
    const response = await apiClient.get("/indicadores-novo");
    const indicadores = response.data || [];

    // Ordenar por id_indicador em ordem descendente
    const indicadoresOrdenados = indicadores.sort(
      (a: IIndicador, b: IIndicador) => {
        const idA = parseInt(String(a.id_indicador), 10) || 0;
        const idB = parseInt(String(b.id_indicador), 10) || 0;
        return idB - idA; // Ordem descendente: maior para menor
      }
    );

    return {
      props: {
        indicadores: indicadoresOrdenados,
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
