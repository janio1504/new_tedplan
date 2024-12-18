import { GetServerSideProps } from 'next';
import React, { useContext } from 'react';
import { parseCookies } from 'nookies';
import { AuthContext } from '../contexts/AuthContext';
import Image from 'next/image'
import logo from '../img/logo_tedplan_login.png';
import {
  Container,
     Logo, Form, SubmitButton,
     Menu, ItensMenu, Footer, DivCenter,
  } from '../styles/dashboard';
import { getAPIClient } from '../services/axios';
import { useForm } from 'react-hook-form';
import HeadPublico from '../components/headPublico';
import MenuExios from '../components/MenuEixoIndicadores';

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




export default function DashboardIndicadores(){
  const { register, handleSubmit } = useForm()
  const { signOut } = useContext(AuthContext)

  async function handleSignOut(){
    signOut()
  }

  async function handleAddPost({ titulo, texto, id_categoria, id_municipio, arquivo}: IPost){
      
    const formData = new FormData();

    formData.append("file", arquivo[0]);
    formData.append("titulo", titulo);
    formData.append("texto", texto);
    formData.append("id_categoria", id_categoria);
    formData.append("id_municipio", id_municipio);
      const apiClient =  getAPIClient()
      return await apiClient.post('addPost', formData, {
        headers: {
          "Content-Type": `multipart/form-data=${formData}`,
          }
      })
      
  }
    return (
     <Container>
       <HeadPublico></HeadPublico>
       <DivCenter>
          <MenuExios></MenuExios>
      </DivCenter>
       <Footer>&copy; Todos os direitos reservados</Footer>
     </Container>
      )
}




export const getServerSideProps: GetServerSideProps = async (ctx) => {
  
  const posts = ''


  //const res = await apiClient.post('/addPost')
  //const posts = await res.data
  //const res = await apiClient.get('/getUsuario', { params: { id_usuario: 1 }})
  
  return {
    props: {
      posts
    }
  }
}