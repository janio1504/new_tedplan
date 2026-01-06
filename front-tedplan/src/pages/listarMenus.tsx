import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { AuthContext } from "../contexts/AuthContext";
import { getAPIClient } from "../services/axios";
import Router from "next/router";
import MenuSuperior from "../components/head";
import Sidebar from "@/components/Sidebar";
import { toast } from "react-toastify";
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import {
  Container,
  NewButton,
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
import HeadIndicadores from "@/components/headIndicadores";
import { BodyDashboard } from "@/styles/dashboard-original";

interface IMenu {
  id_menu: string;
  titulo: string;
  descricao: string;
  id_modulo: string;
  id_eixo: string;
  created_at: string;
  updated_at: string;
}

interface MenuProps {
  menus: IMenu[];
}

export default function ListarMenus({ menus }: MenuProps) {
  const { permission } = useContext(AuthContext);

  const [isModalConfirm, setModalConfirm] = useState(false);
  const [menuSelecionado, setMenuSelecionado] = useState<IMenu | null>(null);
  const [menusList, setMenusList] = useState<IMenu[]>(menus || []);
  const [searchTerm, setSearchTerm] = useState("");
  const { signOut } = useContext(AuthContext);

  useEffect(() => {
    const { ["tedplan.token"]: token } = parseCookies();
    if (!token) {
      Router.push("/login");
    }
    loadMenus();
  }, []);

  async function loadMenus() {
    try {
      const apiClient = getAPIClient();
      const response = await apiClient.get("/menus");
      setMenusList(response.data);
    } catch (error) {
      console.error("Erro ao carregar menus:", error);
      toast.error("Erro ao carregar menus!", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }

  function handleAddMenu() {
    Router.push("/addMenu");
  }

  function handleEditMenu(menu: IMenu) {
    Router.push(`/addMenu?id=${menu.id_menu}`);
  }

  function handleOpenConfirm(menu: IMenu) {
    setMenuSelecionado(menu);
    setModalConfirm(true);
  }

  function handleCloseConfirm() {
    setModalConfirm(false);
    setMenuSelecionado(null);
  }

  async function handleRemoverMenu() {
    if (!menuSelecionado) return;

    try {
      const apiClient = getAPIClient();
      await apiClient.delete(`/menus/${menuSelecionado.id_menu}`);

      toast.success("Menu removido com sucesso!", {
        position: "top-right",
        autoClose: 5000,
      });

      setModalConfirm(false);
      setMenuSelecionado(null);
      loadMenus(); // Recarregar a lista
    } catch (error) {
      console.error("Erro ao remover menu:", error);
      toast.error("Erro ao remover menu!", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }

  async function handleSignOut() {
    signOut();
  }

  function handleSimisab() {
    Router.push("/indicadores/home_indicadores");
  }

  // Filtrar menus baseado no termo de busca
  const menusFiltrados = menusList.filter(
    (menu) =>
      menu.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (menu.descricao &&
        menu.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
            <h2>Lista de Menus</h2>
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
                placeholder="Buscar por título ou descrição..."
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
            {/* {(permission.adminGeral || permission.adminTedPlan) && ( */}

            <BotaoAdicionar
              onClick={handleAddMenu}
              style={{ marginLeft: "10px", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}
            >
              <FaPlus /> Novo Menu
            </BotaoAdicionar>
            {/* )} */}
          </div>

          <div style={{ width: "100%" }}>
            {menusFiltrados.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <p>Nenhum menu encontrado.</p>
              </div>
            ) : (
              menusFiltrados.map((menu) => (
                <div key={menu.id_menu} style={{ marginBottom: "15px" }}>
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
                          {menu.titulo}
                        </h3>
                        {menu.descricao && (
                          <p style={{ margin: "0 0 10px 0", color: "#666" }}>
                            {menu.descricao}
                          </p>
                        )}
                        <div style={{ fontSize: "14px", color: "#888" }}>
                          <span>ID: {menu.id_menu}</span>
                          {menu.id_modulo && (
                            <span> | Módulo: {menu.id_modulo}</span>
                          )}
                          {menu.id_eixo && <span> | Eixo: {menu.id_eixo}</span>}
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
                          <BotaoEditar onClick={() => handleEditMenu(menu)} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <FaEdit /> Editar
                          </BotaoEditar>
                          <BotaoRemover onClick={() => handleOpenConfirm(menu)} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
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
        <Modal>
          <ConteudoModal>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TituloModal>Confirmar Exclusão</TituloModal>
              <CloseModalButton onClick={handleCloseConfirm}>
                &times;
              </CloseModalButton>
            </div>
            <TextoModal>
              Tem certeza que deseja remover o menu "{menuSelecionado?.titulo}"?
              <br />
              <strong>Esta ação não pode ser desfeita.</strong>
            </TextoModal>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <CancelButton onClick={handleCloseConfirm}>Cancelar</CancelButton>
              <ConfirmButton onClick={handleRemoverMenu}>
                Confirmar
              </ConfirmButton>
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
    const response = await apiClient.get("/menus");

    return {
      props: {
        menus: response.data || [],
      },
    };
  } catch (error) {
    console.error("Erro ao carregar menus:", error);
    return {
      props: {
        menus: [],
      },
    };
  }
};
