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
  width: 250px;
  height: 100vh;
  background-color: #f8f8ff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  color: #696969;
  border-right: 1px solid #ccc;
`;

// Título do menu
const MenuTitle = styled.h2`
  color: #696969;
  font-size: 24px;
  margin-bottom: 20px;
`;

// Estilos para cada item do menu
const MenuItem = styled.div`
  font-size: 18px;
  padding: 10px 10px;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 4px;
  &:hover {
    background-color: #d3d3d3;
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
      </MenuItem>
      <MenuItem onClick={handlePublicacoes}>
        <FaAddressBook /> Publicações
      </MenuItem>
      <MenuItem onClick={handleNormas}>
        <FaFileAlt /> Normas
      </MenuItem></>: ''}
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
