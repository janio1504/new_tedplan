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
      toast.notify("Erro ao carregar menus!", {
        title: "Erro!",
        duration: 7,
        type: "error",
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
      
      toast.notify("Menu removido com sucesso!", {
        title: "Sucesso!",
        duration: 7,
        type: "success",
      });
      
      setModalConfirm(false);
      setMenuSelecionado(null);
      loadMenus(); // Recarregar a lista
    } catch (error) {
      console.error("Erro ao remover menu:", error);
      toast.notify("Erro ao remover menu!", {
        title: "Erro!",
        duration: 7,
        type: "error",
      });
    }
  }

  // Filtrar menus baseado no termo de busca
  const menusFiltrados = menusList.filter((menu) =>
    menu.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (menu.descricao && menu.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Container>
      <MenuSuperior usuarios={[]} />

      <DivCenter>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2>Lista de Menus</h2>
          {(permission.adminGeral || permission.adminTedPlan) && (
            <BotaoAdicionar onClick={handleAddMenu}>
              + Novo Menu
            </BotaoAdicionar>
          )}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Buscar por título ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px",
            }}
          />
        </div>

        <ListPost>
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
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
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
                        {menu.id_modulo && <span> | Módulo: {menu.id_modulo}</span>}
                        {menu.id_eixo && <span> | Eixo: {menu.id_eixo}</span>}
                      </div>
                    </div>

                    {(permission.adminGeral || permission.adminTedPlan) && (
                      <div style={{ display: "flex", gap: "10px", marginLeft: "20px" }}>
                        <BotaoEditar onClick={() => handleEditMenu(menu)}>
                          Editar
                        </BotaoEditar>
                        <BotaoRemover onClick={() => handleOpenConfirm(menu)}>
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
              Tem certeza que deseja remover o menu "{menuSelecionado?.titulo}"?
              <br />
              <strong>Esta ação não pode ser desfeita.</strong>
            </TextoModal>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <CancelButton onClick={handleCloseConfirm}>Cancelar</CancelButton>
              <ConfirmButton onClick={handleRemoverMenu}>Confirmar</ConfirmButton>
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