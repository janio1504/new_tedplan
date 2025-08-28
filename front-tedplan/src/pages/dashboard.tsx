import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { AuthContext } from "../contexts/AuthContext";
import { Container, Footer, BodyDashboard, Form,
DivMenuTitulo, MenuMunicipioItem, DivMenu, DivBotaoMenu
} from "../styles/dashboard";
import { SubmitButton } from "../styles/dashboard-original";
import { getAPIClient } from "../services/axios";
import { useForm } from "react-hook-form";
import HeadPublico from "../components/headPublico";
import Sidebar from "../components/Sidebar";
import styled from "styled-components";
import { MainContent } from "@/styles/indicadores";
import api from "../services/api";
import Router from "next/router";
import { Main } from "next/document";


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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signOut, setMunicipioUser, usuario, permission } = useContext(AuthContext);
  const [municipios, setMunicipios] = useState<any>(null);

  useEffect(() => {
    getMunicipios();
  }, []);


  async function handleSignOut() {
    signOut();
  }

  async function handleSetMunicipio(data) {
    setMunicipioUser(data.id_municipio)
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

  const DivMunicipios = styled.h2`
    height: 200px;
    display: flex;
    flex-direction: column;
    padding: 10px;
    margin: 30px;
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
        <MenuMunicipioItem onClick={handleSimisab}>SIMISAB</MenuMunicipioItem>
        </ul>
      </DivMenuTitulo>
      <BodyDashboard>
        <Sidebar />
        
        {/* {permission.adminGeral || permission.editorSimisab || permission.revisorTedPlan ?  DESCOMENTAR AO FINALIZAR*/} 
        <DivMunicipios>          
          <Form onSubmit={handleSubmit(handleSetMunicipio)}>
            <DivTituloForm>Municipios</DivTituloForm>
            <select {...register("id_municipio")} name="id_municipio"
              aria-invalid={errors.value ? "true" : "false"}
              >
              <option value="">Selecione um Municipio</option>
              {municipios?.map((municipio, key) => (
                <option key={key} value={municipio.id_municipio}>
                  {municipio.nome}
                </option>
              ))}
            </select>
            <SubmitButton type="submit">Acessar dados do Municipio</SubmitButton>
          </Form>
        </DivMunicipios>
        {/* : '' */}
        {/* } */}
        
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
