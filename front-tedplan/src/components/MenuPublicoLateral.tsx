import Link from "next/link";
import Router, { useRouter } from "next/router";
import { FaAngleRight, FaBars } from "react-icons/fa";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { FaMap, FaRegFileAlt, FaNewspaper, FaRegImages, FaPoll  } from "react-icons/fa";

interface MenuItemProps {
  $isActive?: boolean
}

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
  position: absolute;

  @media (max-width: 1000px) {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-radius: 0;
    z-index: 1000;
    margin-bottom: 16px;
  }
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
  position: absolute;
  margin: 10px ;
  z-index: 1000;

  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f3f4f6;  
  }

  @media (max-width: 768px) {
    width: 100%;
    position: absolute;
    border-radius: 0;
    margin: 0; 
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

export default function MenuPublicoLateral({isCollapsed, setIsCollapsed}) {
  const router = useRouter();
 

  useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth <= 1000) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  };
  handleResize();
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  }

  function handleNormas() {
    Router.push("/normas");
  }
  function handlePublicacoes() {
    Router.push("/publicacoes");
  }

  function handleGalerias() {
    Router.push("/galerias");
  }
  function handleEstatisticas() {
    Router.push("/estatisticas");
  }

  return (
    <>
     {isCollapsed ? (
            <ExpandButton onClick={toggleSidebar}>
              <FaBars /> 
            </ExpandButton>
          ) : (
      <SidebarContainer >
          <CollapseButton onClick={toggleSidebar}>
                <FaBars /> 
          </CollapseButton>

      <>
        <MenuItem>
          <FaMap /> Mapas
        </MenuItem>
        <MenuItem 
        onClick={handleNormas}
        $isActive={router.pathname === '/normas'}
        >
          <FaRegFileAlt /> Normas
        </MenuItem>
        <MenuItem 
        onClick={handlePublicacoes}
        $isActive={router.pathname === '/publicacoes'}
        >
          <FaNewspaper /> Publicações
        </MenuItem>
        <MenuItem 
        onClick={handleGalerias}
        $isActive={router.pathname === '/galerias'}
        >
          <FaRegImages /> Galerias de fotos
        </MenuItem>
        <MenuItem 
        onClick={handleEstatisticas}
        $isActive={router.pathname === '/estatisticas'}
        >
          <FaPoll /> Estatísticas
        </MenuItem>
      </>
      
      </SidebarContainer>
          )}
    </>
  );
}
