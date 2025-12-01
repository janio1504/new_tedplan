import {} from "next";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { toast } from "react-toastify";
import { AuthContext } from "@/contexts/AuthContext";
import { DivMenuTitulo, Footer, MenuMunicipioItem } from "../styles/dashboard";
import { getAPIClient } from "../services/axios";
import { useForm } from "react-hook-form";
import MenuSuperior from "../components/head";
import Router from "next/router";
import api from "../services/api";
import Sidebar from "@/components/Sidebar";
import HeadIndicadores from "@/components/headIndicadores";
import { BodyDashboard, DivCenter } from "@/styles/dashboard-original";

interface IMenuItem {
  id_menu_item: string;
  nome_menu_item: string;
  id_menu: string;
  ordem_item_menu?: number;
}

interface IMenu {
  id_menu: string;
  titulo: string;
  descricao: string;
  id_eixo?: string;
}

interface IEixo {
  id_eixo: string;
  nome: string;
}

interface MenuItemProps {
  menuItem: IMenuItem[];
  menus: IMenu[];
}

export default function AddMenuItem({ menuItem, menus }: MenuItemProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const [menusData, setMenusData] = useState<any>(menus);
  const [allMenus, setAllMenus] = useState<any>(menus);
  const [eixos, setEixos] = useState<IEixo[]>([]);
  const [selectedEixo, setSelectedEixo] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [menuItemId, setMenuItemId] = useState<string | null>(null);
  const { signOut } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const { ["tedplan.token"]: token } = parseCookies();
    if (!token) {
      Router.push("/login");
    }
    getEixos();
    getMenus();

    // Verificar se é edição
    if (router.query.id) {
      setIsEditing(true);
      setMenuItemId(router.query.id as string);
      loadMenuItemData(router.query.id as string);
    }
  }, [router.query]);

  // Filtrar menus quando o eixo mudar
  useEffect(() => {
    if (selectedEixo) {
      getMenusByEixo(selectedEixo);
      // Resetar a seleção do menu quando o eixo mudar
      setValue("id_menu", "");
    } else {
      // Se nenhum eixo estiver selecionado, mostrar todos os menus
      setMenusData(allMenus);
    }
  }, [selectedEixo]);

  async function getEixos() {
    try {
      const apiClient = getAPIClient();
      const resEixo = await apiClient.get("/getEixos");
      setEixos(resEixo.data);
    } catch (error) {
      console.error("Erro ao carregar eixos:", error);
    }
  }

  async function getMenus() {
    try {
      const apiClient = getAPIClient();
      const resMenus = await apiClient.get("/menus");
      setAllMenus(resMenus.data);
      setMenusData(resMenus.data);
    } catch (error) {
      console.error("Erro ao carregar menus:", error);
    }
  }

  async function getMenusByEixo(idEixo: string) {
    try {
      const apiClient = getAPIClient();
      const resMenus = await apiClient.get(`/menus/eixo/${idEixo}`);
      setMenusData(resMenus.data);
    } catch (error) {
      console.error("Erro ao carregar menus por eixo:", error);
      toast.error("Erro ao carregar menus do eixo selecionado!", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }

  async function loadMenuItemData(id: string) {
    try {
      const apiClient = getAPIClient();
      const response = await apiClient.get(`/menu-items/${id}`);
      const menuItemData = response.data;

      // Buscar o menu para pegar o id_eixo
      const menuResponse = await apiClient.get(
        `/menus/${menuItemData.id_menu}`
      );
      const menuData = menuResponse.data;

      // Se o menu tiver um eixo, definir o eixo selecionado primeiro
      if (menuData.id_eixo) {
        setSelectedEixo(menuData.id_eixo.toString());
        // Aguardar um pouco para que o filtro de menus seja aplicado
        setTimeout(() => {
          reset({
            nome_menu_item: menuItemData.nome_menu_item,
            id_menu: menuItemData.id_menu,
            ordem_item_menu: menuItemData.ordem_item_menu,
          });
        }, 300);
      } else {
        // Preencher o formulário com os dados do item de menu
        reset({
          nome_menu_item: menuItemData.nome_menu_item,
          id_menu: menuItemData.id_menu,
          ordem_item_menu: menuItemData.ordem_item_menu,
        });
      }
    } catch (error) {
      console.error("Erro ao carregar dados do item de menu:", error);
      toast.error("Erro ao carregar dados do item de menu!", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }

  async function handleAddMenuItem({
    nome_menu_item,
    id_menu,
    ordem_item_menu,
  }) {
    try {
      const apiClient = getAPIClient();

      const menuItemData = {
        nome_menu_item,
        id_menu: parseInt(id_menu),
        ordem_item_menu: ordem_item_menu ? parseInt(ordem_item_menu) : null,
      };

      if (isEditing && menuItemId) {
        // Atualizar item de menu existente
        await apiClient.put(`/menu-items/${menuItemId}`, menuItemData);
        toast.success("Item de menu atualizado com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        // Criar novo item de menu
        await apiClient.post("/menu-items", menuItemData);
        toast.success("Item de menu cadastrado com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
      }

      reset({
        nome_menu_item: "",
        id_menu: "",
        ordem_item_menu: "",
      });
      setSelectedEixo("");

      setTimeout(() => {
        router.push("/listarMenuItems");
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar item de menu:", error);
      toast.error("Erro ao salvar item de menu!", {
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

  return (
    <div
      style={{
        height: "0vh",
        backgroundColor: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* <MenuSuperior usuarios={[]}></MenuSuperior> */}
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
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%", 
            paddingBottom: "100px",           
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              padding: "40px",
              marginTop: "50px",
              width: "60%",  
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: "30px",
              }}
            >
              <h1
                style={{
                  color: "#333",
                  fontSize: "28px",
                  fontWeight: "600",
                  margin: "0 0 10px 0",
                }}
              >
                {isEditing ? "Editar Item de Menu" : "Cadastro de Item de Menu"}
              </h1>
              <p
                style={{
                  color: "#666",
                  fontSize: "16px",
                  margin: "0",
                }}
              >
                {isEditing
                  ? "Atualize as informações do item de menu"
                  : "Preencha as informações para criar um novo item de menu"}
              </p>
            </div>

            <form
              onSubmit={handleSubmit(handleAddMenuItem)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  Eixo
                </label>
                <select
                  value={selectedEixo}
                  onChange={(e) => setSelectedEixo(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    fontSize: "16px",
                    border: "2px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    transition: "all 0.3s ease",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    (e.target as HTMLSelectElement).style.borderColor =
                      "#3498db";
                    (e.target as HTMLSelectElement).style.boxShadow =
                      "0 0 0 3px rgba(52, 152, 219, 0.1)";
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLSelectElement).style.borderColor =
                      "#e0e0e0";
                    (e.target as HTMLSelectElement).style.boxShadow = "none";
                  }}
                >
                  <option value="">Selecione um eixo (opcional)</option>
                  {eixos?.map((eixo, key) => (
                    <option key={key} value={eixo.id_eixo}>
                      {eixo.nome}
                    </option>
                  ))}
                </select>
                <small
                  style={{
                    color: "#666",
                    fontSize: "14px",
                    marginTop: "8px",
                    display: "block",
                    lineHeight: "1.4",
                  }}
                >
                  Selecione um eixo para filtrar os menus disponíveis
                </small>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  Menu *
                </label>
                <select
                  {...register("id_menu", { required: true })}
                  name="id_menu"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    fontSize: "16px",
                    border: errors.id_menu
                      ? "2px solid #e74c3c"
                      : "2px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    transition: "all 0.3s ease",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    (e.target as HTMLSelectElement).style.borderColor =
                      "#3498db";
                    (e.target as HTMLSelectElement).style.boxShadow =
                      "0 0 0 3px rgba(52, 152, 219, 0.1)";
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLSelectElement).style.borderColor =
                      errors.id_menu ? "#e74c3c" : "#e0e0e0";
                    (e.target as HTMLSelectElement).style.boxShadow = "none";
                  }}
                >
                  <option value="">Selecione um menu</option>
                  {menusData?.map((menu, key) => (
                    <option key={key} value={menu.id_menu}>
                      {menu.titulo}
                    </option>
                  ))}
                </select>
                {errors.id_menu && errors.id_menu.type === "required" && (
                  <span
                    style={{
                      color: "#e74c3c",
                      fontSize: "14px",
                      marginTop: "5px",
                      display: "block",
                    }}
                  >
                    Selecionar um menu é obrigatório!
                  </span>
                )}
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  Nome do Item *
                </label>
                <input
                  {...register("nome_menu_item", { required: true })}
                  type="text"
                  placeholder="Nome do item de menu"
                  name="nome_menu_item"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    fontSize: "16px",
                    border: errors.nome_menu_item
                      ? "2px solid #e74c3c"
                      : "2px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    transition: "all 0.3s ease",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    (e.target as HTMLInputElement).style.borderColor =
                      "#3498db";
                    (e.target as HTMLInputElement).style.boxShadow =
                      "0 0 0 3px rgba(52, 152, 219, 0.1)";
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLInputElement).style.borderColor =
                      errors.nome_menu_item ? "#e74c3c" : "#e0e0e0";
                    (e.target as HTMLInputElement).style.boxShadow = "none";
                  }}
                />
                {errors.nome_menu_item &&
                  errors.nome_menu_item.type === "required" && (
                    <span
                      style={{
                        color: "#e74c3c",
                        fontSize: "14px",
                        marginTop: "5px",
                        display: "block",
                      }}
                    >
                      O campo Nome do Item é obrigatório!
                    </span>
                  )}
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  Ordem do Item
                </label>
                <input
                  {...register("ordem_item_menu")}
                  type="number"
                  placeholder="Ex: 1, 2, 3..."
                  name="ordem_item_menu"
                  min="1"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    fontSize: "16px",
                    border: "2px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    transition: "all 0.3s ease",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    (e.target as HTMLInputElement).style.borderColor =
                      "#3498db";
                    (e.target as HTMLInputElement).style.boxShadow =
                      "0 0 0 3px rgba(52, 152, 219, 0.1)";
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLInputElement).style.borderColor =
                      "#e0e0e0";
                    (e.target as HTMLInputElement).style.boxShadow = "none";
                  }}
                />
                <small
                  style={{
                    color: "#666",
                    fontSize: "14px",
                    marginTop: "8px",
                    display: "block",
                    lineHeight: "1.4",
                  }}
                >
                  Defina a ordem de exibição dos itens no menu (opcional)
                </small>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: isSubmitting ? "#95a5a6" : "#3498db",
                  color: "white",
                  padding: "14px 24px",
                  fontSize: "16px",
                  fontWeight: "600",
                  border: "none",
                  borderRadius: "8px",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  marginTop: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    (e.target as HTMLButtonElement).style.backgroundColor =
                      "#2980b9";
                    (e.target as HTMLButtonElement).style.transform =
                      "translateY(-2px)";
                    (e.target as HTMLButtonElement).style.boxShadow =
                      "0 6px 20px rgba(52, 152, 219, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    (e.target as HTMLButtonElement).style.backgroundColor =
                      "#3498db";
                    (e.target as HTMLButtonElement).style.transform =
                      "translateY(0)";
                    (e.target as HTMLButtonElement).style.boxShadow = "none";
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        border: "2px solid #ffffff",
                        borderTop: "2px solid transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    ></div>
                    {isEditing ? "Atualizando..." : "Salvando..."}
                  </>
                ) : isEditing ? (
                  "Atualizar Item"
                ) : (
                  "Cadastrar Item"
                )}
              </button>
            </form>
          </div>
        </div>
        </DivCenter>
      </BodyDashboard>
      <Footer>&copy; Todos os direitos reservados</Footer>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .form-container {
            padding: 20px;
            margin: 10px;
          }

          .form-title {
            font-size: 24px;
          }

          .form-subtitle {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
