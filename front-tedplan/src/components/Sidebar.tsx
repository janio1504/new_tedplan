import React, { useContext, useState } from "react";
import styled from "styled-components";
import {
  FaAddressBook,
  FaFileAlt,
  FaSignInAlt,
  FaSignOutAlt,
  FaUsers,
  FaCaretDown,
  FaDatabase,
} from "react-icons/fa";
import Router from "next/router";
import { AuthContext } from "../contexts/AuthContext";

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
const MenuItem = styled.div`
  font-size: 16px;
  padding: 14px 16px;
  margin: 4px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #424242;
  font-weight: 500;

  svg {
    font-size: 20px;
    color: #2c3e50;
  }

  &:hover {
    background-color: rgba(26, 35, 126, 0.08);
    color: #2c3e50;
    transform: translateX(4px);
  }

  &:active {
    background-color: rgba(26, 35, 126, 0.12);
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
  background: rgba(0, 0, 0, 0.02);
`;

const Sidebar = () => {
  const { signOut, usuario, permission } = useContext(AuthContext);
  const [isCadastroOpen, setIsCadastroOpen] = useState(false);

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

  async function handleSignOut() {
    signOut();
  }

  return (
    <SidebarContainer>
      <MenuTitle>{usuario?.permissao_usuario}</MenuTitle>
      {permission.adminGeral || permission.adminTedPlan || permission.editorTedPlan ? (
        <>
          <MenuItemWithSubmenu
            onClick={() => setIsCadastroOpen(!isCadastroOpen)}
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
            <SubmenuItem onClick={handleMenus}>
              Menus
            </SubmenuItem>
            <SubmenuItem onClick={handleMenuItems}>
              Itens de Menu
            </SubmenuItem>
            <SubmenuItem onClick={handleTiposCampo}>
              Tipos de Campo
            </SubmenuItem>
            <SubmenuItem onClick={handleIndicadores}>
              Indicadores
            </SubmenuItem>
            <SubmenuItem onClick={handleAddIndicador}>
              Informações de Indicador
            </SubmenuItem>
          </SubmenuContainer>       
        </>
      ) : (
        ""
      )}
      {permission.adminGeral ? (        
          <MenuItem onClick={handleUsuarios}>
            <FaUsers /> Lista de Usuários
          </MenuItem>        
      ) : (
        ""
      )}
      {permission.adminGeral || permission.adminTedPlan ? (
        <>
          <MenuItem onClick={handlePublicacoes}>
            <FaAddressBook /> Publicações
          </MenuItem>
          <MenuItem onClick={handleNormas}>
            <FaFileAlt /> Normas
          </MenuItem>
          <MenuItem onClick={handleGalerias}>
            <FaFileAlt /> Galerias
          </MenuItem>
        </>
      ) : (
        ""
      )}
      {permission.editorSimisab ? (
        <MenuItem onClick={handleSimisab}>
          <FaSignInAlt /> SIMISAB
        </MenuItem>
      ) : (
        ""
      )}
      <MenuItem onClick={handleSignOut}>
        <FaSignOutAlt /> Sair
      </MenuItem>
    </SidebarContainer>
  );
};

export default Sidebar;
