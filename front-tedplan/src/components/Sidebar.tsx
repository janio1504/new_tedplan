import React, { useContext } from "react";
import styled from "styled-components";
import {
  FaAddressBook,
  FaFileAlt,
  FaSignInAlt,
  FaSignOutAlt,
  FaUsers,
} from "react-icons/fa";
import Router from "next/router";
import { AuthContext } from "../contexts/AuthContext";

// Container principal do menu
const SidebarContainer = styled.div`
  width: 280px;
  height: 100vh;
  background: linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%);
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  color: #2C3E50;
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
    color: #2C3E50;
  }

  &:hover {
    background-color: rgba(26, 35, 126, 0.08);
    color: #2C3E50;
    transform: translateX(4px);
  }

  &:active {
    background-color: rgba(26, 35, 126, 0.12);
    transform: scale(0.98);
  }
`;

const Sidebar = () => {
  const { signOut, usuario } = useContext(AuthContext);
  
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
      {usuario?.id_permissao == 1 ?<>
      <MenuItem onClick={handleUsuarios}>
        <FaUsers /> Lista de Usuários
      </MenuItem></>: ''}
      {usuario?.id_permissao == 2 || usuario?.id_permissao == 1 ?<>
      <MenuItem onClick={handlePublicacoes}>
        <FaAddressBook /> Publicações
      </MenuItem>
      <MenuItem onClick={handleNormas}>
        <FaFileAlt /> Normas
      </MenuItem>
      <MenuItem onClick={handleGalerias}>
        <FaFileAlt /> Galerias
      </MenuItem>
      </>: ''}
      {usuario?.id_permissao == 3 && usuario?.id_sistema == 1 ?
      <MenuItem onClick={handleSimisab}>
        <FaSignInAlt /> SIMISAB
      </MenuItem>: ''}
      <MenuItem onClick={handleSignOut}>
        <FaSignOutAlt /> Sair
      </MenuItem>
     
    </SidebarContainer>
  );
};

export default Sidebar;
