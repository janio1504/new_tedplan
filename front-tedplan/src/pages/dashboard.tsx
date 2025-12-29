import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { AuthContext } from "../contexts/AuthContext";
import { Container, Footer, BodyDashboard, Form,
DivMenuTitulo, MenuMunicipioItem, DivMenu, DivBotaoMenu
} from "../styles/dashboard";
import { DivCenter, SubmitButton } from "../styles/dashboard-original";
import { getAPIClient } from "../services/axios";
import HeadPublico from "../components/headPublico";
import Sidebar from "../components/Sidebar";
import styled from "styled-components";
import { MainContent } from "@/styles/indicadores";
import api from "../services/api";
import Router from "next/router";


interface IPost {
  id_posts: string;
  titulo: string;
  texto: string;
  id_categoria: string;
  id_municipio: string;
  arquivo: File;
}

interface PostProps {
  posts: IPost[];
}

export default function DashboardIndicadores() {
  const { signOut, setMunicipioUser, usuario, permission } = useContext(AuthContext);
  const [municipios, setMunicipios] = useState<any>(null);

  useEffect(() => {
    getMunicipios();
  }, []);


  async function handleSignOut() {
    signOut();
  }

  async function handleSetMunicipio(id_municipio: string) {
    setMunicipioUser(BigInt(Number(id_municipio)))
    Router.push('/indicadores/home_indicadores')
  }

  async function getMunicipios() {
    const resMunicipio = await api.get("/getMunicipios").then((response) => {
      return response.data;
    });
    setMunicipios(resMunicipio);
  }

  async function handleAddPost({
    titulo,
    texto,
    id_categoria,
    id_municipio,
    arquivo,
  }: IPost) {
    const formData = new FormData();

    formData.append("file", arquivo[0]);
    formData.append("titulo", titulo);
    formData.append("texto", texto);
    formData.append("id_categoria", id_categoria);
    formData.append("id_municipio", id_municipio);
    const apiClient = getAPIClient();
    return await apiClient.post("addPost", formData, {
      headers: {
        "Content-Type": `multipart/form-data=${formData}`,
      },
    });
  }

   function handleSimisab() {
      Router.push("/indicadores/home_indicadores");
    }

  const DivMunicipios = styled.div`
    width: 100%;
    max-width: 1200px;
    margin: 30px auto;
    padding: 0 20px;
  `;

  const TituloSecao = styled.h2`
    font-size: 28px;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 8px;
    padding: 0 20px;
  `;

  const SubtituloSecao = styled.p`
    font-size: 14px;
    color: #7f8c8d;
    margin-bottom: 30px;
    padding: 0 20px;
  `;

  const ListaMunicipios = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
    padding: 20px;
    width: 100%;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 16px;
      padding: 10px;
    }
  `;

  const CardMunicipio = styled.div`
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border: 1px solid #e1e8ed;
    border-radius: 16px;
    padding: 24px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #0085bd 0%, #1caecc 100%);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s ease;
    }

    &:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 12px 24px rgba(0, 133, 189, 0.2);
      border-color: #0085bd;
      background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);

      &::before {
        transform: scaleX(1);
      }

      .municipio-nome {
        color: #0085bd;
      }

      .municipio-icon {
        transform: translateX(8px) scale(1.1);
        color: #0085bd;
      }
    }

    &:active {
      transform: translateY(-4px) scale(1.01);
    }
  `;

  const MunicipioNome = styled.div`
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 8px;
    transition: color 0.3s ease;
    display: flex;
    align-items: center;
    gap: 12px;
  `;

  const MunicipioIcon = styled.div`
    font-size: 24px;
    color: #95a5a6;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: #f0f0f0;
    border-radius: 10px;
    flex-shrink: 0;
  `;

  const MunicipioContent = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  `;

  const MunicipioText = styled.div`
    flex: 1;
    min-width: 0;
  `;

  const ArrowIcon = styled.div`
    font-size: 20px;
    color: #bdc3c7;
    transition: all 0.3s ease;
    opacity: 0.6;
    
    ${CardMunicipio}:hover & {
      color: #0085bd;
      opacity: 1;
      transform: translateX(4px);
    }
  `;

  const LoadingContainer = styled.div`
    grid-column: 1 / -1;
    padding: 60px 20px;
    text-align: center;
    color: #7f8c8d;
    font-size: 16px;
  `;

  const DivTituloForm = styled.div`
    width: 95%;
    padding: 15px 10px;
    color: #fff;
    margin: -11px -10px 0 -11px;
    background-color: #0085bd;
    border-top-right-radius: 12px;
    border-top-left-radius: 12px;
    font-weight: bolder;
    
  
    width: calc(100% + 3.8rem);
      padding: 0.95rem 1.9rem;
      background-color: #0085bd;
      color: white;
      font-weight: bold;
      font-size: 1.19rem;
      margin: 0 -1.9rem 1.9rem;
      border-radius: 7.6px 7.6px 0 0;
      box-sizing: border-box;
  `;

  
  return (
    <Container>
      <HeadPublico></HeadPublico>
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
        {permission.editorSimisab? 
        <MenuMunicipioItem onClick={handleSimisab}>SIMISAB</MenuMunicipioItem>
        : "" }
        </ul>
      </DivMenuTitulo>

      
      <BodyDashboard>
        <Sidebar />
        <DivCenter>
        
        {permission.adminGeral || permission.editorSimisab || permission.revisorTedPlan ?
        <DivMunicipios>
          <TituloSecao>Selecione um Município</TituloSecao>
          <SubtituloSecao>Clique no município para acessar o preenchimento de dados</SubtituloSecao>
          <ListaMunicipios>
            {municipios && municipios.length > 0 ? (
              municipios.map((municipio, key) => (
                <CardMunicipio 
                  key={key} 
                  onClick={() => handleSetMunicipio(municipio.id_municipio)}
                >
                  <MunicipioContent>
                    <MunicipioText>
                      <MunicipioNome className="municipio-nome">
                        <MunicipioIcon className="municipio-icon">🏛️</MunicipioIcon>
                        {municipio.municipio_nome}
                      </MunicipioNome>
                    </MunicipioText>
                    <ArrowIcon>→</ArrowIcon>
                  </MunicipioContent>
                </CardMunicipio>
              ))
            ) : (
              <LoadingContainer>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                Carregando municípios...
              </LoadingContainer>
            )}
          </ListaMunicipios>
        </DivMunicipios>
           : '' 
         } 
        </DivCenter>
      </BodyDashboard>
     
      <Footer>&copy; Todos os direitos reservados</Footer>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const posts = "";

  //const res = await apiClient.post('/addPost')
  //const posts = await res.data
  //const res = await apiClient.get('/getUsuario', { params: { id_usuario: 1 }})

  return {
    props: {
      posts,
    },
  };
};
