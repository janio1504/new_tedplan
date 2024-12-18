import { GetServerSideProps } from 'next';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { parseCookies } from 'nookies';
import { AuthContext } from '../contexts/AuthContext';
import { toast, ToastContainer } from 'react-nextjs-toast';
import {
  Container,
     Form, SubmitButton,
     Footer, DivCenter, DivInstrucoes,
  } from '../styles/dashboard';
import { getAPIClient } from '../services/axios';
import { useForm } from 'react-hook-form';
import MenuSuperior from '../components/head';
import dynamic from "next/dynamic";
//import "suneditor/dist/css/suneditor.min.css";

interface INorma {
  id_norma: string;
  titulo: string;
  descricao: string;
  id_eixo: string;
  id_tipo_norma: string;
  id_escala: string;
  tipo_norma: string;
  imagem: File;
  arquivo: File;
}
interface IEixo{
  id_eixo: string;
  nome: string;
}

interface IEscala{
  id_escala: string;
  nome: string;
}

interface ITipoNorma{
  id_tipo_norma: string;
  nome: string;
}

interface NormaProps {  
  normas: INorma[];
  eixos: IEixo[];
  escalas: IEscala[];
  tipoNorma: ITipoNorma[];
}


export default function AddNorma({ eixos, normas, escalas, tipoNorma}: NormaProps ){
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [imagem, setImagem] = useState(null);
   
  async function handleAddNorma(data: INorma){
    
    const formData = new FormData();

    formData.append("imagem", data.imagem[0]);
    formData.append("arquivo", data.arquivo[0]);
    formData.append("titulo", data.titulo);
    formData.append("id_eixo", data.id_eixo);
    formData.append("id_tipo_norma", data.id_tipo_norma);
    formData.append("id_escala", data.id_escala);
      const apiClient =  getAPIClient()
      const response = await apiClient.post('addNorma', formData, {
        headers: {
          "Content-Type": `multipart/form-data=${formData}`,
          "Access-Control-Allow-Origin": "*",
          }
      }).then((response) =>{
        toast.notify('Dados gravados com sucesso!',{
          title: "Sucesso!",
          duration: 7,
          type: "success",
        })   
      }).catch((error) => {
        if(error){
          toast.notify('Erro ao gravar dados!',{
            title: "Erro!",
            duration: 7,
            type: "error",
          })   
          return error
        }        
         
      })     
     
        reset({
          imagem: '',
          arquivo: '',
          titulo: '',
          id_eixo: '',
          id_escala: '',
          id_tipo_norma: '',        
        })

  }



    return (
     <Container>
       
       <MenuSuperior usuarios={[]}></MenuSuperior>
       
       <DivCenter>
       <DivInstrucoes>
         <b>Cadastro de Norma:</b>
       </DivInstrucoes>
       <Form onSubmit={handleSubmit(handleAddNorma)}>
         <label>Titulo</label>
         <input 
         aria-invalid={errors.value ? "true" : "false"}
         {...register('titulo',  {required: true}) }
          type='text'
          placeholder='Titulo da Norma' 
          name='titulo'          
          />
          {errors.titulo && errors.titulo.type && <span>O campo Titulo é obrigatório!</span>}
         
        
          <select {...register('id_tipo_norma',  {required: true})}>
         aria-invalid={errors.value ? "true" : "false"}
         <option value="">Selecione um Tipo</option>
           {tipoNorma.map( tipo => (
             <option key={tipo.id_tipo_norma} value={tipo.id_tipo_norma} >{tipo.nome}</option>
           ))}     
           
         </select>
         {errors.id_tipo_norma && errors.id_tipo_norma.type && <span>Selecionar um Tipo de Norma é obrigatório!</span>}

          <select {...register('id_escala',  {required: true})}>
         aria-invalid={errors.value ? "true" : "false"}
         <option value="">Selecione uma escala</option>
           {escalas.map( escala => (
             <option key={escala.id_escala} value={escala.id_escala} >{escala.nome}</option>
           ))}     
           
         </select>
         {errors.id_escala && errors.id_escala.type && <span>Selecionar uma escala é obrigatório!</span>}
                     

         <select {...register('id_eixo',  {required: true})}>
         aria-invalid={errors.value ? "true" : "false"}
         <option value="">Selecione um eixo</option>
           {eixos.map( eixo => (
             <option key={eixo.id_eixo} value={eixo.id_eixo} >{eixo.nome}</option>
           ))}     
           
         </select>
         {errors.id_eixo && errors.id_eixo.type && <span>Selecionar um Eixo é obrigatório!</span>}
         
         
         <label>Imagem</label>
         <input 
         aria-invalid={errors.value ? "true" : "false"}
         {...register('imagem', {required: true})}
         type="file"
         accept="image/*"
         onChange={(event) => {
          const files = event.target.files;
          if (files) {
            setImagem(URL.createObjectURL(files[0]));
          }
        }}

          />
          {errors.arquivo && errors.arquivo.type && <span>Selecionar uma imagem é obrigatório!</span>}
       
        <label>Arquivo</label>
         <input
         aria-invalid={errors.value ? "true" : "false"}
         {...register('arquivo', {required: true})}
         accept='.pdf, .doc, .docx, .xls, .xlsx'
         type='file'  
         name='arquivo'
          />
          {errors.arquivo && errors.arquivo.type && <span>Selecionar um Arquivo é obrigatório!</span>}
         <SubmitButton type="submit">
                Gravar
              </SubmitButton>
       </Form>
      </DivCenter>
      <Footer>&copy; Todos os direitos reservados<ToastContainer></ToastContainer></Footer>
     </Container>
      )
}


export const getServerSideProps: GetServerSideProps<NormaProps> = async (ctx) => {
  const {[ 'tedplan.token' ]: token} = parseCookies(ctx)
  const apiClient = getAPIClient(ctx)
  
  if(!token){
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  } 
  
  const resNorma = await apiClient.get('/getNormas')
  const normas = await resNorma.data

  const resEixo = await apiClient.get('/getEixos')
  const eixos = await resEixo.data

  const resEscala = await apiClient.get('/getEscalas')
  const escalas = await resEscala.data

  const resTipoNorma = await apiClient.get('/listTipoNorma')
  const tipoNorma = await resTipoNorma.data 
  
  
  return {
    props: {
      eixos,
      normas,
      escalas,
      tipoNorma,
    }
  }
}