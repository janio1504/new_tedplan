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

interface IMenuItem {
  id_menu_item: string;
  nome_menu_item: string;
  id_menu: string;
  created_at: string;
  updated_at: string;
  menu?: {
    id_menu: string;
    titulo: string;
  };
}

interface MenuItemProps {
  menuItems: IMenuItem[];
}

export default function ListarMenuItems({ menuItems }: MenuItemProps) {
  const { permission } = useContext(AuthContext);

  const [isModalConfirm, setModalConfirm] = useState(false);
  const [menuItemSelecionado, setMenuItemSelecionado] = useState<IMenuItem | null>(null);
  const [menuItemsList, setMenuItemsList] = useState<IMenuItem[]>(menuItems || []);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const { ["tedplan.token"]: token } = parseCookies();
    if (!token) {
      Router.push("/login");
    }
    loadMenuItems();
  }, []);

  async function loadMenuItems() {
    try {
      const apiClient = getAPIClient();
      const response = await apiClient.get("/menu-items");
      setMenuItemsList(response.data);
    } catch (error) {
      console.error("Erro ao carregar itens de menu:", error);
      toast.notify("Erro ao carregar itens de menu!", {
        title: "Erro!",
        duration: 7,
        type: "error",
      });
    }
  }

  function handleAddMenuItem() {
    Router.push("/addMenuItem");
  }

  function handleEditMenuItem(menuItem: IMenuItem) {
    Router.push(`/addMenuItem?id=${menuItem.id_menu_item}`);
  }

  function handleOpenConfirm(menuItem: IMenuItem) {
    setMenuItemSelecionado(menuItem);
    setModalConfirm(true);
  }

  function handleCloseConfirm() {
    setModalConfirm(false);
    setMenuItemSelecionado(null);
  }

  async function handleRemoverMenuItem() {
    if (!menuItemSelecionado) return;

    try {
      const apiClient = getAPIClient();
      await apiClient.delete(`/menu-items/${menuItemSelecionado.id_menu_item}`);
      
      toast.notify("Item de menu removido com sucesso!", {
        title: "Sucesso!",
        duration: 7,
        type: "success",
      });
      
      setModalConfirm(false);
      setMenuItemSelecionado(null);
      loadMenuItems(); // Recarregar a lista
    } catch (error) {
      console.error("Erro ao remover item de menu:", error);
      toast.notify("Erro ao remover item de menu!", {
        title: "Erro!",
        duration: 7,
        type: "error",
      });
    }
  }

  // Filtrar itens de menu baseado no termo de busca
  const menuItemsFiltrados = menuItemsList.filter((menuItem) =>
    menuItem.nome_menu_item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (menuItem.menu?.titulo && menuItem.menu.titulo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Container>
      <MenuSuperior usuarios={[]} />

      <DivCenter>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2>Lista de Itens de Menu</h2>
          {(permission.adminGeral || permission.adminTedPlan) && (
            <BotaoAdicionar onClick={handleAddMenuItem}>
              + Novo Item de Menu
            </BotaoAdicionar>
          )}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Buscar por nome do item ou menu..."
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
          {menuItemsFiltrados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p>Nenhum item de menu encontrado.</p>
            </div>
          ) : (
            menuItemsFiltrados.map((menuItem) => (
              <div key={menuItem.id_menu_item} style={{ marginBottom: "15px" }}>
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
                        {menuItem.nome_menu_item}
                      </h3>
                      <div style={{ fontSize: "14px", color: "#666" }}>
                        <span><strong>Menu:</strong> {menuItem.menu?.titulo || `ID: ${menuItem.id_menu}`}</span>
                      </div>
                      <div style={{ fontSize: "14px", color: "#888", marginTop: "5px" }}>
                        <span>ID: {menuItem.id_menu_item}</span>
                      </div>
                    </div>

                    {(permission.adminGeral || permission.adminTedPlan) && (
                      <div style={{ display: "flex", gap: "10px", marginLeft: "20px" }}>
                        <BotaoEditar onClick={() => handleEditMenuItem(menuItem)}>
                          Editar
                        </BotaoEditar>
                        <BotaoRemover onClick={() => handleOpenConfirm(menuItem)}>
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
              Tem certeza que deseja remover o item de menu "{menuItemSelecionado?.nome_menu_item}"?
              <br />
              <strong>Esta ação não pode ser desfeita.</strong>
            </TextoModal>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <CancelButton onClick={handleCloseConfirm}>Cancelar</CancelButton>
              <ConfirmButton onClick={handleRemoverMenuItem}>Confirmar</ConfirmButton>
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
    const response = await apiClient.get("/menu-items");

    return {
      props: {
        menuItems: response.data || [],
      },
    };
  } catch (error) {
    console.error("Erro ao carregar itens de menu:", error);
    return {
      props: {
        menuItems: [],
      },
    };
  }
};
