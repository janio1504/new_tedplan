import { GetServerSideProps } from 'next';
import React, { useContext, useState } from 'react';
import { parseCookies } from 'nookies';
import { AuthContext } from '../contexts/AuthContext';
import { useToasts } from 'react-toast-notifications'

import {
  Container,
     Form, SubmitButton,
     Footer, DivCenter, DivInstrucoes,
  } from '../styles/dashboard';
import { getAPIClient } from '../services/axios';
import { useForm } from 'react-hook-form';
import MenuSuperior from '../components/head';

interface IPublicacao {
  id_posts: string;
  titulo: string;
  id_eixo: string;
  id_tipo_publicacao: string;
  id_categoria: string;
  id_municipio: string;
  arquivo: File;
  imagem: File;
} 

interface IMunicipios{
  id_municipio: string;
  nome: string;
}

interface IEixos{
  id_eixo: string;
  nome: string;
}

interface ICategorias{
  id_categoria: string;
  nome: string;
}

interface ITipoPublicacao{
  id_tipo_publicacao: string;
  nome: string;
}

interface MunicipiosProps {
  eixos: IEixos[];
  categorias: ICategorias[];
  municipios: IMunicipios[];
  tipoPublicacao: ITipoPublicacao[];
}

export default function AddPublicacao({ municipios, tipoPublicacao, eixos, categorias }: MunicipiosProps ){
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const { addToast } = useToasts()

  const [ disabledTipoPublicacao, setdisabledTipoPublicacao ] = useState(false)
  const [ disabledMunicipio, setdisabledMunicipio ] = useState(false)

  async function handleAddPublicacao({ titulo, id_eixo, id_categoria, id_tipo_publicacao, id_municipio, arquivo, imagem }: IPublicacao){
    
    const formData = new FormData();

    formData.append("imagem", imagem[0]);
    formData.append("file", arquivo[0]);
    formData.append("titulo", titulo);
    formData.append("id_eixo", id_eixo);
    formData.append("id_tipo_publicacao", id_tipo_publicacao);
    formData.append("id_categoria", id_categoria);
    formData.append("id_municipio", id_municipio);
      const apiClient =  getAPIClient()
      const response = await apiClient.post('addPublicacao', formData, {
        headers: {
          "Content-Type": `multipart/form-data=${formData}`,
          }
      }).catch((error) => {
        if(error){
          addToast('Todos os campos são obrigatórios!', {        
            appearance: 'error',
            autoDismiss: true,
          })
          return error
        }        
         
      })     
     
        reset({
          imagem: '',
          arquivo: '',
          titulo: '',
          eixo: '',
          id_categoria: '',
          id_municipio: '',        
        })
        
        addToast('Publicação Adicionada com sucesso!', {        
          appearance: 'success',
          autoDismiss: true,
        })          

  }

  function handleDisabledTp(id){
    console.log(id);
    
    if(id === 1){
      setdisabledTipoPublicacao(true)
    }
  }
    return (
      
     <Container>
       
       <MenuSuperior usuarios={[]}></MenuSuperior>
       
       <DivCenter>
       <DivInstrucoes>
         <b>Cadastro de Publicações:</b>
       </DivInstrucoes>
       <Form onSubmit={handleSubmit(handleAddPublicacao)}>
         <label>Titulo</label>
         <input 
         aria-invalid={errors.name ? "true" : "false"}
         {...register('titulo', {required: true}) }
          type='text'
          placeholder='Titulo da Publicacao' 
          name='titulo'          
          />
          {errors.titulo && errors.titulo.type && <span>O campo Titulo é obrigatório!</span>}

          <input
            {...register("id_categoria")}
            type="hidden"
            defaultValue={2}
          />
        
         <select 
          aria-invalid={errors.value ? "true" : "false"}
         {...register('id_tipo_publicacao', {required: true, disabled: disabledTipoPublicacao})} name="id_tipo_publicacao">
            <option value="">Selecione um Tipo de Publicação</option>
              {tipoPublicacao.map( tipo => (
                <option key={tipo.id_tipo_publicacao} value={tipo.id_tipo_publicacao} >{tipo.nome}</option>
              ))}             
         </select>
         {errors.id_tipo_publicacao && errors.id_tipo_publicacao.type && <span>Selecionar um Tipo de Publicação é obrigatório!</span>}
        
         <select
         aria-invalid={errors.value ? "true" : "false"}
         {...register('id_municipio', {required: true, disabled: disabledMunicipio})} name="id_municipio">
            <option value="">Selecione um Municipio</option>
              {municipios.map( municipio => (
                <option key={municipio.id_municipio} value={municipio.id_municipio} >{municipio.nome}</option>
              ))}        
         </select>
         {errors.id_municipio && errors.id_municipio.type && <span>Selecionar um Municipio é obrigatório!</span>}
  
         <select
         aria-invalid={errors.value ? "true" : "false"}
         {...register('id_eixo', {required: true})} name="id_eixo">
           <option value="">Selecione o eixo</option>
           {eixos.map( (eixo, key) => (
                <option key={key} value={eixo.id_eixo} >{eixo.nome}</option>
              ))}
         </select>
         {errors.id_eixo && errors.id_eixo.type && <span>Selecionar um Eixo é obrigatório!</span>}

         <label>Arquivo da Publicação</label>
         <input
         aria-invalid={errors.value ? "true" : "false"}
         {...register('arquivo', {required: true})}
         accept='.pdf, .doc, .docx, .xls, .xlsx'
         type='file'  
         name='arquivo'
          />
          {errors.arquivo && errors.arquivo.type && <span>Selecionar um Arquivo é obrigatório!</span>}

         <label>Imagem de Rótulo Publicação</label>
         <input 
         aria-invalid={errors.value ? "true" : "false"}
         {...register('imagem', {required: true})}
         type='file'  
         name='imagem'
         accept='image/*'
          />
          {errors.imagem && errors.imagem.type && <span>Selecionar uma imagem é obrigatório!</span>}

         <SubmitButton type="submit">
                Gravar
              </SubmitButton>
       </Form>
      </DivCenter>
       <Footer>&copy; Todos os direitos reservados</Footer>
     </Container>
      )
}




export const getServerSideProps: GetServerSideProps<MunicipiosProps> = async (ctx) => {
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

  const resMunicipio = await apiClient.get('/getMunicipios')
  const municipios = await resMunicipio.data

  const resTipoPublicacao = await apiClient.get('/listTipoPublicacao')
  const tipoPublicacao = await resTipoPublicacao.data

  const resEixo = await apiClient.get('/getEixos')
  const eixos = await resEixo.data

  const resCategorias = await apiClient.get('/getCategorias')
  const categorias = await resCategorias.data

  return {
    props: {
      municipios,
      tipoPublicacao,
      eixos,
      categorias
    }
  }
}