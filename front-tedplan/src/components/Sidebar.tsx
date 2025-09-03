import Router, { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import {
  FaAddressBook,
  FaCamera,
  FaCaretDown,
  FaDatabase,
  FaEye,
  FaFileAlt,
  FaUsers,
  FaBars
} from "react-icons/fa";
import styled from "styled-components";
import { AuthContext } from "../contexts/AuthContext";

interface MenuItemProps {
  $isActive?: boolean
}

// Container principal do menu
const SidebarContainer = styled.div`
  width: 280px;
  height: 100vh;
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  color: #2c3e50;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease-in-out;
`;

// Título do menu
const MenuTitle = styled.h2`
  color: #424242;
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e0e0e0;
`;

// Estilos para cada item do menu
const MenuItem = styled.div <MenuItemProps>` 
  font-size: 16px;
  padding: 14px 16px;
  margin: 4px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  
  font-weight: 500;

  background: ${props => props.$isActive ? '#0085bd' : 'transparent'};
  border-left-color: ${props => props.$isActive ? '#00d4aa' : 'transparent'};
  color: ${props => props.$isActive ? '#ffffff' : 'black'};
  font-weight: ${props => props.$isActive ? 'bold' : 'normal'};
  transform: ${props => props.$isActive ? 'translateX(4px)' : 'normal'};

  svg {
    font-size: 20px;
    color: ${props => props.$isActive ? '#ffffff' : '#2c3e50'};
  }

  &:hover {
   
    color:'#2c3e50';
    transform: translateX(4px);
  }

  &:active {
    background-color: ${props => props.$isActive ? '#004c6d' : 'white'};
    transform: scale(0.98);
  }
`;

const MenuItemWithSubmenu = styled(MenuItem)`
  position: relative;
  justify-content: space-between;

  &::after {
    content: "";
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const SubmenuContainer = styled.div<{ isOpen: boolean }>`
  max-height: ${(props) => (props.isOpen ? "500px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
`;

const SubmenuItem = styled(MenuItem)`
  padding-left: 48px;
  font-size: 14px;
  border-left-color: ${props => props.$isActive ? '#00d4aa' : 'transparent'};
  color: ${props => props.$isActive ? '#ffffff' : 'black'};
  font-weight: ${props => props.$isActive ? 'bold' : 'normal'}; 
  transform: ${props => props.$isActive ? 'translateX(4px)' : 'normal'}; 
`;

const ExpandButton = styled.button`
  width: 50px;
  height: 50px;
  background: white;
  color: rgb(102, 102, 102);
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  postition: relative;
  margin: 20px 0 0 30px;
  z-index: 1000;

  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f3f4f6;  
  }

  
`;

const CollapseButton = styled.button`
  background: transparent;
  color: rgb(102, 102, 102);
  border: none;
  cursor: pointer;
  align-self: flex-end;
  margin-bottom: 16px;
`;



const Sidebar = () => {
  const { signOut, usuario, permission } = useContext(AuthContext);
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  }

    const safePermission = permission || {
    adminGeral: false,
    adminTedPlan: false,
    editorTedPlan: false,
    editorSimisab: false,
    revisorTedPlan: false,
    supervisorTedPlan: false,
  };

 const isCadastroSubmenuActive = () => {
    const cadastroRoutes = [
      "/listarMenus",
      "/listarMenuItems", 
      "/listarTiposCampo",
      "/listarIndicadores",
      "/listarInfoIndicador",
      "/addMenu",
      "/addMenuItem",
      "/addTipoCampoIndicador",
      "/addIndicador",
      "/addInfoIndicador",
    ];
    return cadastroRoutes.some(route => router.pathname === route);
  };


  const isMenusActive = () => {
    const menusRoutes = ["/listarMenus", "/addMenu"]; 
    return menusRoutes.some(route => router.pathname === route);
  };
  const isMenusItemsActive = () => {
    const menusRoutes = ["/listarMenuItems", "/addMenuItem"]; 
    return menusRoutes.some(route => router.pathname === route);
  };
  const isMenusCamposActive = () => {
    const menusRoutes = ["/listarTiposCampo", "/addTipoCampoIndicador"]; 
    return menusRoutes.some(route => router.pathname === route);
  };
  const isMenusIndicadores = () => {
    const menusRoutes = ["/listarIndicadores", "/addIndicador"]; 
    return menusRoutes.some(route => router.pathname === route);
  };
  const isMenusInfoIndicadores = () => {
    const menusRoutes = ["/listarInfoIndicador", "/addInfoIndicador"]; 
    return menusRoutes.some(route => router.pathname === route);
  };
  const isMenusUsuarios = () => {
    const menusRoutes = ["/listarUsuarios", "/addUsuario"]; 
    return menusRoutes.some(route => router.pathname === route);
  };
  const isMenusPublicacoes = () => {
    const menusRoutes = ["/listarPublicacoes", "/addPublicacao"]; 
    return menusRoutes.some(route => router.pathname === route);
  };
  const isMenusNormas = () => {
    const menusRoutes = ["/listarNormas", "/addNorma"]; 
    return menusRoutes.some(route => router.pathname === route);
  };
  const isMenusGalerias = () => {
    const menusRoutes = ["/listarGalerias", "/addGaleria"]; 
    return menusRoutes.some(route => router.pathname === route);
  };

  const [isCadastroOpen, setIsCadastroOpen] = useState(isCadastroSubmenuActive());

     useEffect(() => {
    if (isCadastroSubmenuActive()) {
      setIsCadastroOpen(true);
    }
  }, [router.pathname]);


  function handleAddIndicador() {
    Router.push("/listarInfoIndicador");
  }

  function handleMenus() {
    Router.push("/listarMenus");
  }

  function handleMenuItems() {
    Router.push("/listarMenuItems");
  }

  function handleTiposCampo() {
    Router.push("/listarTiposCampo");
  }

  function handleIndicadores() {
    Router.push("/listarIndicadores");
  }

  function handlePublicacoes() {
    Router.push("/listarPublicacoes");
  }

  function handleUsuarios() {
    Router.push("/listarUsuarios");
  }

  function handleNormas() {
    Router.push("/listarNormas");
  }

  function handleGalerias() {
    Router.push("/listarGalerias");
  }

  function handleSimisab() {
    Router.push("/indicadores/home_indicadores");
  }
  function handleDashboard() {
    Router.push("/dashboard");
  }


  async function handleSignOut() {
    signOut();
  }



  return (
    <>
    {isCollapsed ? (
        <ExpandButton onClick={toggleSidebar}>
          <FaBars /> {/* Ícone do botão */}
        </ExpandButton>
      ) : (
    <SidebarContainer>
      <CollapseButton onClick={toggleSidebar}>
            <FaBars /> {/* Ícone para recolher */}
          </CollapseButton>
      <MenuTitle>{usuario?.permissao_usuario}</MenuTitle>
      {safePermission.adminGeral || safePermission.adminTedPlan || safePermission.editorTedPlan ? (
       <>   
          <MenuItem
          onClick={handleDashboard}
          $isActive={router.pathname === "/dashboard"}
          >
            <FaEye /> Visualizar Município
          </MenuItem>
          <MenuItemWithSubmenu
            onClick={() => setIsCadastroOpen(!isCadastroOpen)}
            $isActive={isCadastroSubmenuActive()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaDatabase /> Cadastros
            </div>
            <FaCaretDown
              style={{
                transform: isCadastroOpen ? "rotate(180deg)" : "rotate(0)",
                transition: "transform 0.3s ease",
              }}
            />
          </MenuItemWithSubmenu>
          <SubmenuContainer isOpen={isCadastroOpen}>
            <SubmenuItem onClick={handleMenus}
             $isActive={isMenusActive()}
            >
              Menus
            </SubmenuItem>
            <SubmenuItem onClick={handleMenuItems}
            $isActive={isMenusItemsActive()}>
              Itens de Menu
            </SubmenuItem>
            <SubmenuItem onClick={handleTiposCampo}
            $isActive={isMenusCamposActive()}
            >
              Tipos de Campo
            </SubmenuItem>
            <SubmenuItem onClick={handleIndicadores}
            $isActive={isMenusIndicadores()}>
              Indicadores
            </SubmenuItem>
            <SubmenuItem onClick={handleAddIndicador}
            $isActive={isMenusInfoIndicadores()}>
              Informações de Indicador
            </SubmenuItem>
            
          </SubmenuContainer>       
        </>
       ) : (
        ""
      )} 
      {/* {safePermission.adminGeral ? (         */}
          <MenuItem 
          onClick={handleUsuarios}
          $isActive={isMenusUsuarios()}
          >
            <FaUsers /> Lista de Usuários
          </MenuItem>        
      {/* ) : (
        ""
      )}  */}
      {/* {safePermission.adminGeral || safePermission.adminTedPlan ? ( */}
        <>
          <MenuItem 
          onClick={handlePublicacoes}
          $isActive={isMenusPublicacoes()}
          >
            <FaAddressBook /> Publicações   
          </MenuItem>
          <MenuItem onClick={handleNormas}
          $isActive={isMenusNormas()}
          >
            <FaFileAlt /> Normas
          </MenuItem>
          <MenuItem onClick={handleGalerias}
          $isActive={isMenusGalerias()}>
            <FaCamera /> Galerias
          </MenuItem>
        </>
      {/* ) : (
        ""
      )}  */}
      {/* {permission.editorSimisab ? ( */}
        {/* <MenuItem onClick={handleSimisab}>
          <FaSignInAlt /> SIMISAB
        </MenuItem> */}
      {/* ) : (
        ""
      )} */}
      {/* <MenuItem onClick={handleSignOut}>
        <FaSignOutAlt /> Sair
      </MenuItem> */}
    </SidebarContainer>
      )}
    </>
  );
};

export default Sidebar;
