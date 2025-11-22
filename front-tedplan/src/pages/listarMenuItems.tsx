import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useState, useMemo } from "react";
import { parseCookies } from "nookies";
import { AuthContext } from "../contexts/AuthContext";
import { getAPIClient } from "../services/axios";
import Router from "next/router";
import MenuSuperior from "../components/head";
import { toast } from "react-toastify";
import Sidebar from "@/components/Sidebar";
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
  DivMenuTitulo,
  MenuMunicipioItem,
} from "../styles/dashboard";
import { BodyDashboard } from "@/styles/dashboard-original";
import HeadIndicadores from "@/components/headIndicadores";

interface IMenuItem {
  id_menu_item: string;
  nome_menu_item: string;
  id_menu: string;
  ordem_item_menu?: number;
  created_at: string;
  updated_at: string;
  menu?: {
    id_menu: string;
    titulo: string;
    id_eixo?: string;
  };
}

interface IEixo {
  id_eixo: string;
  nome: string;
}

interface MenuItemProps {
  menuItems: IMenuItem[];
}

export default function ListarMenuItems({ menuItems }: MenuItemProps) {
  const { permission } = useContext(AuthContext);

  const [isModalConfirm, setModalConfirm] = useState(false);
  const [menuItemSelecionado, setMenuItemSelecionado] = useState<IMenuItem | null>(null);
  const [menuItemsList, setMenuItemsList] = useState<IMenuItem[]>(menuItems || []);
  const [eixos, setEixos] = useState<IEixo[]>([]);
  const [menusMap, setMenusMap] = useState<Map<string, any>>(new Map());
  const [searchTerm, setSearchTerm] = useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [eixosComItems, setEixosComItems] = useState<Array<{ id: string; nome: string; menus: Record<string, { id: string; titulo: string; items: IMenuItem[] }> }>>([]);
  const {signOut} = useContext(AuthContext)

  useEffect(() => {
    const { ["tedplan.token"]: token } = parseCookies();
    if (!token) {
      Router.push("/login");
      return;
    }
    // Carregar na ordem correta: primeiro eixos e menus, depois menu items
    const loadData = async () => {
      await loadEixos();
      await loadMenus();
      // Aguardar um pouco para garantir que os maps estão prontos
      setTimeout(() => {
        loadMenuItems();
      }, 300);
    };
    loadData();
  }, []);

  async function loadEixos() {
    try {
      const apiClient = getAPIClient();
      const response = await apiClient.get("/getEixos");
      setEixos(response.data || []);
      return response.data || [];
    } catch (error) {
      console.error("Erro ao carregar eixos:", error);
      return [];
    }
  }

  async function loadMenus() {
    try {
      const apiClient = getAPIClient();
      const response = await apiClient.get("/menus");
      const menus = response.data || [];
      // Criar um mapa de id_menu para dados do menu (incluindo id_eixo)
      const map = new Map();
      menus.forEach((menu: any) => {
        // Garantir que o id_menu seja string para o mapeamento
        const menuId = menu.id_menu ? menu.id_menu.toString() : null;
        if (menuId) {
          map.set(menuId, menu);
          // Também adicionar como número para garantir compatibilidade
          if (!isNaN(Number(menuId))) {
            map.set(Number(menuId).toString(), menu);
          }
        }
      });
      setMenusMap(map);
      return map;
    } catch (error) {
      console.error("Erro ao carregar menus:", error);
      return new Map();
    }
  }

  async function loadMenuItems() {
    try {
      const apiClient = getAPIClient();
      const response = await apiClient.get("/menu-items");
      
      // Obter o mapa atual
      let mapAtualizado = new Map(menusMap);
      
      // Se o mapa ainda está vazio, carregar menus novamente
      if (mapAtualizado.size === 0) {
        mapAtualizado = await loadMenus();
      }
      
      // Buscar todos os menus únicos dos menu items para garantir que temos os dados completos
      const menuIds = Array.from(new Set(response.data.map((item: IMenuItem) => item.id_menu)));
      
      // Para cada menu único, buscar se não estiver no mapa
      await Promise.all(
        menuIds.map(async (menuId: string | number) => {
          const menuIdStr = menuId.toString();
          
          // Verificar se já está no mapa
          if (!mapAtualizado.has(menuIdStr)) {
            try {
              const menuResponse = await apiClient.get(`/menus/${menuId}`);
              const menuData = menuResponse.data;
              mapAtualizado.set(menuIdStr, menuData);
              // Também adicionar como número
              if (!isNaN(Number(menuIdStr))) {
                mapAtualizado.set(Number(menuIdStr).toString(), menuData);
              }
            } catch (error) {
              console.error(`Erro ao buscar menu ${menuId}:`, error);
            }
          }
        })
      );
      
      // Atualizar o mapa de menus
      setMenusMap(mapAtualizado);
      
      // Ordenar por ordem_item_menu ascendente, itens sem ordem vão para o final
      const menuItemsOrdenados = response.data.sort((a: IMenuItem, b: IMenuItem) => {
        // Se ambos têm ordem_item_menu, ordenar por ela
        if (a.ordem_item_menu !== null && a.ordem_item_menu !== undefined && 
            b.ordem_item_menu !== null && b.ordem_item_menu !== undefined) {
          return a.ordem_item_menu - b.ordem_item_menu;
        }
        // Se apenas A tem ordem, A vem primeiro
        if (a.ordem_item_menu !== null && a.ordem_item_menu !== undefined) {
          return -1;
        }
        // Se apenas B tem ordem, B vem primeiro
        if (b.ordem_item_menu !== null && b.ordem_item_menu !== undefined) {
          return 1;
        }
        // Se nenhum tem ordem, manter ordem alfabética por nome
        return a.nome_menu_item.localeCompare(b.nome_menu_item);
      });
      
      setMenuItemsList(menuItemsOrdenados);
      setIsDataLoaded(true);
      
      // Agrupar os itens por eixo após carregar tudo
      setTimeout(() => {
        agruparItensPorEixo(menuItemsOrdenados, mapAtualizado, eixos);
      }, 100);
    } catch (error) {
      console.error("Erro ao carregar itens de menu:", error);
      toast.error("Erro ao carregar itens de menu!", { position: "top-right", autoClose: 5000 });
      setIsDataLoaded(true); // Marcar como carregado mesmo com erro
    }
  }

  // Função para agrupar itens por eixo
  function agruparItensPorEixo(items: IMenuItem[], mapMenus: Map<string, any>, eixosList: IEixo[]) {
    // Função auxiliar para obter eixo usando o mapa passado
    const getEixoInfoLocal = (menuItem: IMenuItem): { id: string; nome: string } | null => {
      if (!menuItem || !menuItem.id_menu || mapMenus.size === 0 || eixosList.length === 0) {
        return null;
      }
      
      const menuId = menuItem.id_menu.toString();
      let menu = mapMenus.get(menuId);
      
      if (!menu && !isNaN(Number(menuId))) {
        menu = mapMenus.get(Number(menuId).toString());
      }
      
      if (!menu) {
        Array.from(mapMenus.entries()).forEach(([key, value]) => {
          if (!menu) {
            const valueId = value.id_menu ? value.id_menu.toString() : null;
            if (valueId === menuId || key === menuId) {
              menu = value;
            }
          }
        });
      }
      
      if (!menu || (menu.id_eixo === null || menu.id_eixo === undefined)) {
        return null;
      }
      
      const eixoId = menu.id_eixo.toString();
      const eixo = eixosList.find(e => {
        const eId = e.id_eixo ? e.id_eixo.toString() : null;
        return eId === eixoId || e.id_eixo === eixoId;
      });
      
      if (!eixo) {
        return null;
      }
      
      return { id: eixo.id_eixo.toString(), nome: eixo.nome };
    };

    // Filtrar itens baseado no termo de busca
    const filtrados = items.filter((menuItem) => {
      const eixoInfo = getEixoInfoLocal(menuItem);
      const eixoNome = eixoInfo ? eixoInfo.nome : "";
      return (
        menuItem.nome_menu_item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (menuItem.menu?.titulo && menuItem.menu.titulo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (menuItem.ordem_item_menu && menuItem.ordem_item_menu.toString().includes(searchTerm)) ||
        (eixoNome && eixoNome.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });

    // Agrupar itens por eixo e depois por menu
    const itemsPorEixo = filtrados.reduce((acc, menuItem) => {
      const eixoInfo = getEixoInfoLocal(menuItem);
      const eixoKey = eixoInfo ? eixoInfo.id : "sem-eixo";
      const eixoNome = eixoInfo ? eixoInfo.nome : "Sem Eixo";
      const menuKey = menuItem.id_menu ? menuItem.id_menu.toString() : "sem-menu";
      const menuTitulo = menuItem.menu?.titulo || `Menu ${menuItem.id_menu}`;

      if (!acc[eixoKey]) {
        acc[eixoKey] = {
          id: eixoKey,
          nome: eixoNome,
          menus: {}
        };
      }

      if (!acc[eixoKey].menus[menuKey]) {
        acc[eixoKey].menus[menuKey] = {
          id: menuKey,
          titulo: menuTitulo,
          items: []
        };
      }

      acc[eixoKey].menus[menuKey].items.push(menuItem);
      return acc;
    }, {} as Record<string, { id: string; nome: string; menus: Record<string, { id: string; titulo: string; items: IMenuItem[] }> }>);

    // Converter para array e ordenar
    const eixosOrdenados = Object.values(itemsPorEixo).sort((a, b) => {
      if (a.id === "sem-eixo") return 1;
      if (b.id === "sem-eixo") return -1;
      return a.nome.localeCompare(b.nome);
    });

    setEixosComItems(eixosOrdenados);
  }

  // Reagrupar quando searchTerm, menuItemsList ou dados mudarem
  useEffect(() => {
    if (isDataLoaded && menusMap.size > 0 && eixos.length > 0 && menuItemsList.length > 0) {
      agruparItensPorEixo(menuItemsList, menusMap, eixos);
    }
  }, [searchTerm, menuItemsList, isDataLoaded, menusMap, eixos]);

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
      
      toast.success("Item de menu removido com sucesso!", { position: "top-right", autoClose: 5000 });
      
      setModalConfirm(false);
      setMenuItemSelecionado(null);
      loadMenuItems(); // Recarregar a lista
    } catch (error) {
      console.error("Erro ao remover item de menu:", error);
      toast.error("Erro ao remover item de menu!", { position: "top-right", autoClose: 5000 });
    }
  }

  // Função para obter o eixo de um menu item
  const getEixoInfo = (menuItem: IMenuItem): { id: string; nome: string } | null => {
    if (!menuItem || !menuItem.id_menu || menusMap.size === 0 || eixos.length === 0) {
      return null;
    }
    
    // Normalizar o id_menu para string
    const menuId = menuItem.id_menu.toString();
    
    // Tentar buscar o menu no mapa
    let menu = menusMap.get(menuId);
    
    // Se não encontrou, tentar como número
    if (!menu && !isNaN(Number(menuId))) {
      menu = menusMap.get(Number(menuId).toString());
    }
    
    // Se ainda não encontrou, percorrer o mapa
    if (!menu) {
      Array.from(menusMap.entries()).forEach(([key, value]) => {
        if (!menu) {
          const valueId = value.id_menu ? value.id_menu.toString() : null;
          if (valueId === menuId || key === menuId) {
            menu = value;
          }
        }
      });
    }
    
    if (!menu || (menu.id_eixo === null || menu.id_eixo === undefined)) {
      return null;
    }
    
    // Normalizar o id_eixo para string
    const eixoId = menu.id_eixo.toString();
    
    // Buscar o eixo
    const eixo = eixos.find(e => {
      const eId = e.id_eixo ? e.id_eixo.toString() : null;
      return eId === eixoId || e.id_eixo === eixoId;
    });
    
    if (!eixo) {
      return null;
    }
    
    return { id: eixo.id_eixo.toString(), nome: eixo.nome };
  };

  // Função para obter o nome do eixo (para filtro)
  const getEixoNome = (menuItem: IMenuItem): string => {
    const eixoInfo = getEixoInfo(menuItem);
    return eixoInfo ? eixoInfo.nome : "";
  };


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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2>Lista de Itens de Menu</h2>
          {/* {(permission.adminGeral || permission.adminTedPlan) && ( */}
            <BotaoAdicionar onClick={handleAddMenuItem} style={{marginLeft: '15px'}}>
              + Novo Item de Menu
            </BotaoAdicionar>
          {/* )} */}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Buscar por nome do item, menu, eixo ou ordem..."
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

        {!isDataLoaded ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Carregando dados...</p>
          </div>
        ) : eixosComItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Nenhum item de menu encontrado.</p>
          </div>
        ) : (
          <div style={{ marginTop: "20px" }}>
            {eixosComItems.map((eixo) => (
              <div
                key={eixo.id}
                style={{
                  marginBottom: "40px"
                }}
              >
                <h3 style={{
                  margin: "0 0 20px 0",
                  paddingBottom: "15px",
                  borderBottom: "3px solid #3498db",
                  color: "#333",
                  fontSize: "22px",
                  fontWeight: "600"
                }}>
                  {eixo.nome}
                </h3>
                
                <div style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))`,
                  gap: "20px"
                }}>
                  {Object.values(eixo.menus).map((menu) => (
                    <div
                      key={menu.id}
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        border: "2px solid #e0e0e0",
                        padding: "20px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        minHeight: "200px"
                      }}
                    >
                      <h4 style={{
                        margin: "0 0 15px 0",
                        color: "#555",
                        fontSize: "18px",
                        fontWeight: "600",
                        paddingBottom: "10px",
                        borderBottom: "2px solid #3498db"
                      }}>
                        {menu.titulo}
                      </h4>
                      
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {menu.items.length === 0 ? (
                          <div style={{ 
                            textAlign: "center", 
                            padding: "20px", 
                            color: "#999",
                            fontSize: "14px"
                          }}>
                            Nenhum item neste menu
                          </div>
                        ) : (
                          menu.items.map((menuItem) => (
                            <div
                              key={menuItem.id_menu_item}
                              style={{
                                backgroundColor: "#f8f9fa",
                                padding: "12px 15px",
                                borderRadius: "6px",
                                border: "1px solid #e9ecef",
                                transition: "all 0.2s ease"
                              }}
                              onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.backgroundColor = "#e9ecef";
                                (e.currentTarget as HTMLElement).style.transform = "translateX(5px)";
                                (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.backgroundColor = "#f8f9fa";
                                (e.currentTarget as HTMLElement).style.transform = "translateX(0)";
                                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                              }}
                            >
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ flex: 1 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px", flexWrap: "wrap" }}>
                                    <span style={{ color: "#333", fontWeight: "500", fontSize: "14px" }}>
                                      {menuItem.nome_menu_item}
                                    </span>
                                    {menuItem.ordem_item_menu && (
                                      <span style={{
                                        backgroundColor: "#1e88e5",
                                        color: "white",
                                        fontSize: "11px",
                                        fontWeight: "bold",
                                        padding: "2px 6px",
                                        borderRadius: "3px"
                                      }}>
                                        #{menuItem.ordem_item_menu}
                                      </span>
                                    )}
                                  </div>
                                  <div style={{ fontSize: "12px", color: "#888" }}>
                                    ID: {menuItem.id_menu_item}
                                  </div>
                                </div>
                                
                                {(permission.adminGeral || permission.adminTedPlan) && (
                                  <div style={{ display: "flex", gap: "5px", marginLeft: "10px", flexShrink: 0 }}>
                                    <button
                                      onClick={() => handleEditMenuItem(menuItem)}
                                      style={{
                                        backgroundColor: "#3498db",
                                        color: "white",
                                        border: "none",
                                        padding: "6px 12px",
                                        borderRadius: "4px",
                                        fontSize: "12px",
                                        cursor: "pointer",
                                        fontWeight: "500",
                                        transition: "background-color 0.2s",
                                        whiteSpace: "nowrap"
                                      }}
                                      onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#2980b9";
                                      }}
                                      onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#3498db";
                                      }}
                                    >
                                      Editar
                                    </button>
                                    <button
                                      onClick={() => handleOpenConfirm(menuItem)}
                                      style={{
                                        backgroundColor: "#e74c3c",
                                        color: "white",
                                        border: "none",
                                        padding: "6px 12px",
                                        borderRadius: "4px",
                                        fontSize: "12px",
                                        cursor: "pointer",
                                        fontWeight: "500",
                                        transition: "background-color 0.2s",
                                        whiteSpace: "nowrap"
                                      }}
                                      onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#c0392b";
                                      }}
                                      onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#e74c3c";
                                      }}
                                    >
                                      Remover
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </DivCenter>
      </BodyDashboard>

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

    // Ordenar por ordem_item_menu ascendente
    const menuItemsOrdenados = (response.data || []).sort((a: IMenuItem, b: IMenuItem) => {
      // Se ambos têm ordem_item_menu, ordenar por ela
      if (a.ordem_item_menu !== null && a.ordem_item_menu !== undefined && 
          b.ordem_item_menu !== null && b.ordem_item_menu !== undefined) {
        return a.ordem_item_menu - b.ordem_item_menu;
      }
      // Se apenas A tem ordem, A vem primeiro
      if (a.ordem_item_menu !== null && a.ordem_item_menu !== undefined) {
        return -1;
      }
      // Se apenas B tem ordem, B vem primeiro
      if (b.ordem_item_menu !== null && b.ordem_item_menu !== undefined) {
        return 1;
      }
      // Se nenhum tem ordem, manter ordem alfabética por nome
      return a.nome_menu_item.localeCompare(b.nome_menu_item);
    });

    return {
      props: {
        menuItems: menuItemsOrdenados,
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
