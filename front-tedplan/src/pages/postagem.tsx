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




export default function ViewPostagem(){
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
       <Menu>
       <Logo>
         <Image         
          src={logo}
          alt="TedPlan"          
          />          
          </Logo>
          <ItensMenu>
            <ul>              
              <li>Posts</li>
              <li>Publicações</li>
              <li>Arquivos</li>
              <li>Usuários</li>              
              <li onClick={handleSignOut}>Sair</li>
            </ul>
          </ItensMenu>
       </Menu>
       <DivCenter>
       <Form onSubmit={handleSubmit(handleAddPost)}>
         <label>Titulo</label>
         <input 
         {...register('titulo') }
          type='text'
          placeholder='Titulo do post' 
          name='titulo'
          />
         <select {...register('id_municipio')} name="id_municipio">
           <option value="">Selecione um Municipio</option>
           <option value="1" >Laranjal do Jari</option>
         </select>
         <select {...register('id_categoria')} name="id_categoria">
           <option value="">Selecione uma Categoria</option>
           <option value="1" id='id_categoria'>Postagens</option>
         </select>
         <input 
         {...register('arquivo')}
         type='file'  
         name='arquivo'
          />

         <label>Texto</label>
         <textarea 
         {...register('texto')}
         name="texto"
         />
         <SubmitButton type="submit">
                Gravar
              </SubmitButton>
       </Form>
      </DivCenter>
       <Footer>&copy; Todos os direitos reservados</Footer>
     </Container>
      )
}




export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {[ 'tedplan.token' ]: token} = parseCookies(ctx)
  const posts = ''
  if(!token){
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }   

  //const res = await apiClient.post('/addPost')
  //const posts = await res.data
  //const res = await apiClient.get('/getUsuario', { params: { id_usuario: 1 }})
  
  return {
    props: {
      posts
    }
  }
}