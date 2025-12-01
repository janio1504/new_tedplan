import { useState, useEffect, useContext } from "react";
import { parseCookies } from "nookies";
import Router from "next/router";
import MenuSuperior from "../components/head";
import { toast } from "react-toastify";
import { useInfoIndicador } from "../contexts/InfoIndicadorContext";
import { AuthContext } from "@/contexts/AuthContext";
import Sidebar from "@/components/Sidebar";
import {
  Container,
  ConfirmButton,
  CancelButton,
  Footer,
  DivCenter,
  BotaoEditar,
  BotaoRemover,
  Modal,
  CloseModalButton,
  ConteudoModal,
  TituloModal,
  TextoModal,
  DivMenuTitulo,
  MenuMunicipioItem,
  BotaoAdicionar,
} from "../styles/dashboard";
import { InfoIndicador } from "../types/InfoIndicador";
import HeadIndicadores from "@/components/headIndicadores";
import { BodyDashboard } from "@/styles/dashboard-original";
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export default function ListarIndicadores() {
  const {
    indicadores,
    loadInfoIndicadores,
    deleteInfoIndicador,
    error,
    clearError,
  } = useInfoIndicador();

  const [isModalConfirm, setModalConfirm] = useState(false);
  const [indicadorSelecionado, setIndicadorSelecionado] = useState<InfoIndicador | null>(null);
  const [idImagem, setIdImagem] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEixo, setFiltroEixo] = useState<string>("todos");
  const {signOut} = useContext(AuthContext);

  useEffect(() => {
    const { ["tedplan.token"]: token } = parseCookies();
    if (!token) {
      Router.push("/login");
      return;
    }

    loadInfoIndicadores();
  }, [loadInfoIndicadores]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 7000,
      });
      clearError();
    }
  }, [error, clearError]);

  function handleAddIndicador() {
    Router.push("/addInfoIndicador");
  }

  function handleOpenConfirm(indicador: InfoIndicador) {
    setIndicadorSelecionado(indicador);
    setIdImagem(indicador.id_imagem || null);
    setModalConfirm(true);
  }

  function handleCloseConfirm() {
    setModalConfirm(false);
    setIndicadorSelecionado(null);
    setIdImagem(null);
  }

  async function handleRemoverIndicador() {
    if (!indicadorSelecionado) return;

    try {
      await deleteInfoIndicador(
        indicadorSelecionado.id_descricao_indicador!,
        idImagem || undefined
      );
      toast.success("Indicador removido com sucesso!", { position: "top-right", autoClose: 5000 });
      setModalConfirm(false);
      setIndicadorSelecionado(null);
      setIdImagem(null);
      loadInfoIndicadores();
    } catch (error) {
      toast.error("Erro ao remover indicador!", { position: "top-right", autoClose: 5000 });
    }
  }

  // Eixos únicos dos indicadores
  const eixosUnicos = Array.from(new Set(indicadores
    .filter(ind => ind.eixo)
    .map(ind => ind.eixo)
  )).sort();

  // Filtrar indicadores baseado no termo de busca e eixo
  const indicadoresFiltrados = indicadores
    .filter((indicador) => {
      const matchesSearch = 
        indicador.nome_indicador.toLowerCase().includes(searchTerm.toLowerCase()) ||
        indicador.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (indicador.descricao && indicador.descricao.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (indicador.finalidade && indicador.finalidade.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesEixo = 
        filtroEixo === "todos" ||
        indicador.eixo === filtroEixo;

      return matchesSearch && matchesEixo;
    })
    .sort((a, b) => {
      // Ordenar por id_descricao_indicador decrescente (mais recentes primeiro)
      return (b.id_descricao_indicador || 0) - (a.id_descricao_indicador || 0);
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
                          <text style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            padding: '15px 20px',
                            float: 'left'
                            }}>
                             Painel de Edição 
                            </text>
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
          <h2>Lista de Informações de Indicadores</h2>
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
              placeholder="Buscar por nome, código, descrição ou finalidade..."
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
              {eixosUnicos.map((eixo) => (
                <option key={eixo} value={eixo}>
                  {eixo}
                </option>
              ))}
            </select>
          </div>
          <BotaoAdicionar onClick={handleAddIndicador} style={{ marginLeft: "10px", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
            <FaPlus /> Novo Indicador
          </BotaoAdicionar>
        </div>

        <div style={{ marginBottom: "15px", fontSize: "14px", color: "#666" }}>
          Mostrando {indicadoresFiltrados.length} de {indicadores.length} indicadores
        </div>

        <div style={{ width: "100%" }}>
          {indicadoresFiltrados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p>
                {indicadores.length === 0 
                  ? "Nenhum indicador cadastrado." 
                  : "Nenhum indicador encontrado com os filtros aplicados."
                }
              </p>
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
            </div>
          ) : (
            indicadoresFiltrados.map((indicador) => (
              <div key={indicador.id_descricao_indicador} style={{ marginBottom: "15px" }}>
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
                        <span
                          style={{
                            backgroundColor: "#007bff",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          {indicador.eixo}
                        </span>
                      </div>
                      
                      <div style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
                        <strong>Código:</strong> {indicador.codigo}
                      </div>
                      
                      {indicador.unidade && (
                        <div style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
                          <strong>Unidade:</strong> {indicador.unidade}
                        </div>
                      )}

                      {indicador.descricao && (
                        <div style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
                          <strong>Descrição:</strong> 
                          <div style={{ marginTop: "5px", fontStyle: "italic" }}>
                            {indicador.descricao.length > 200
                              ? `${indicador.descricao.substring(0, 200)}...`
                              : indicador.descricao
                            }
                          </div>
                        </div>
                      )}

                      {indicador.finalidade && (
                        <div style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
                          <strong>Finalidade:</strong> 
                          <div style={{ marginTop: "5px" }}>
                            {indicador.finalidade.length > 200
                              ? `${indicador.finalidade.substring(0, 200)}...`
                              : indicador.finalidade
                            }
                          </div>
                        </div>
                      )}

                      {indicador.limitacoes && (
                        <div style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
                          <strong>Limitações:</strong> 
                          <div style={{ marginTop: "5px" }}>
                            {indicador.limitacoes.length > 200
                              ? `${indicador.limitacoes.substring(0, 200)}...`
                              : indicador.limitacoes
                            }
                          </div>
                        </div>
                      )}
                      
                      <div style={{ fontSize: "14px", color: "#888", marginTop: "10px" }}>
                        <span>ID: {indicador.id_descricao_indicador}</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "10px", marginLeft: "20px" }}>
                      <BotaoEditar
                        onClick={() =>
                          Router.push(
                            `/addInfoIndicador?id=${indicador.id_descricao_indicador}`
                          )
                        }
                        style={{ display: "flex", alignItems: "center", gap: "6px" }}
                      >
                        <FaEdit /> Editar
                      </BotaoEditar>
                      <BotaoRemover
                        onClick={() => handleOpenConfirm(indicador)}
                        style={{ display: "flex", alignItems: "center", gap: "6px" }}
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

        {isModalConfirm && indicadorSelecionado && (
          <Modal>
            <ConteudoModal>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <TituloModal>Confirmar Exclusão</TituloModal>
                <CloseModalButton onClick={handleCloseConfirm}>
                  &times;
                </CloseModalButton>
              </div>
              <TextoModal>
                Tem certeza que deseja remover o indicador "{indicadorSelecionado.nome_indicador}" ({indicadorSelecionado.codigo})?
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
      </DivCenter>
      </BodyDashboard>
      <Footer>
        &copy; Todos os direitos reservados
        
      </Footer>
    </Container>
  );
}
