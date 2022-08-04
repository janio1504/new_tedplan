/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import {
  Container,
     Form, SubmitButton, Lista,
     Footer, DivCenter, MenuLateral, DivFormConteudo, DivInput, ImagemLista, Logo_si, TextoLista,
  } from '../styles/views';
import { getAPIClient } from '../services/axios';
import { useForm } from 'react-hook-form';
import HeadPublico from '../components/headPublico';
import MenuPublicoLateral from '../components/MenuPublicoLateral';
import { toast, ToastContainer } from 'react-nextjs-toast'

type INorma = {
  id_norma: string;
  titulo: string;
  id_eixo: string;
  id_tipo_norma: string;
  id_escala: string;
  eixo: string;
  tipo_norma: string;
  id_arquivo: string;
  id_imagem: string;
  imagem: string;
  arquivo: string;
} 

interface IEscalas{
  id_escala: string;
  nome: string;
}

interface IEixos{
  id_eixo: string;
  nome: string;
}

interface ITipoNorma{
  id_tipo_norma: string;
  nome: string;
}

interface NormasProps {
  normas: INorma[];
  eixos: IEixos[];
  escala: IEscalas[];
  tipoNorma: ITipoNorma[];
}

export default function Normas({ normas, tipoNorma, eixos, escala}: NormasProps ){
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [ normasList, setNormasList ] = useState<INorma[] | any>(normas)  

  useEffect(() =>{
    if(normas){      
     getNormas(normas)
    }
     
  }, [normas])
    
  async function handlebuscaFiltrada({ titulo, id_eixo, id_tipo_norma, id_escala}: INorma){

    const apiClient = getAPIClient()
    
    const resBusca = await apiClient.get('/getPorFiltroNormas', {params: {titulo, id_eixo, id_tipo_norma, id_escala}})
    const normas = resBusca.data
    if(!normas[0]){
      toast.notify('Nenhum resultado encontrado para a busca!',{
        title: "Atenção",
        duration: 7,
        type: "error",
      })
      
      return
    }
   
    getNormas(normas)
    reset({
      titulo: '',
      id_municipio: '',
      id_tipo_publicacao: '',
      id_eixo: ''
    })
  } 

  async function getNormas(normas?: any) {
    
    const apiClient = getAPIClient()
    if(normas){           
    const norma = await Promise.all(
      normas?.map( async (p) =>{
        const imagem = await apiClient({
          method: 'GET',
          url: 'getImagem',
          params: {id: p.id_imagem},
          responseType: 'blob'
        }).then((response) =>{
          return URL.createObjectURL(response.data)
        })     
      
        const arquivo = await apiClient({
          method: 'GET',
          url: 'getFile',
          params: {id: p.id_arquivo},
          responseType: 'blob'
        }).then((response) => {
          return URL.createObjectURL(response.data);
        })      
            p =  {
            id_norma: p.id_norma,
            titulo: p.titulo,
            id_eixo: p.id_eixo,
            id_tipo_norma: p.id_tipo_norma,
            id_escala: p.id_escala,
            eixo: p.eixo,
            tipo_norma: p.tipo_norma,
            id_arquivo: p.id_arquivo,
            id_imagem: p.id_imagem,
            imagem: imagem,
            arquivo: arquivo,
          }   
     
      return p
    }))   
    
    setNormasList(norma)
  }
  }


     return (
      
     <Container>     
      
       <HeadPublico></HeadPublico>       
       <DivCenter>
         <MenuLateral>
           <MenuPublicoLateral></MenuPublicoLateral>
         </MenuLateral>

         <DivFormConteudo>
           <h3>Normas</h3>

           <Form onSubmit={handleSubmit(handlebuscaFiltrada)}>
             <DivInput>
             <label>Escala:</label>
             <select
             {...register('id_escala')}
             >
               <option value=''>Todos</option>
               {escala?.map((escala, key) => (
                 <option key={key} value={escala.id_escala}>{escala.nome}</option>
               ))}
             </select>
             </DivInput>

             <DivInput>
             <label>Eixos:</label>
             <select
             {...register('id_eixo')}
             >
               <option value=''>Todos</option>
               {eixos?.map((eixo, key) => (
                 <option key={key} value={eixo.id_eixo}>{eixo.nome}</option>
               ))}
             </select>
             </DivInput>

             <DivInput>
             <label>Tipo:</label>
             <select
             {...register('id_tipo_norma')}
             >
               <option value=''>Todos</option>
               {tipoNorma?.map((tipo, key) =>(
                 <option key={key} value={tipo.id_tipo_norma}>{tipo.nome}</option>
               ))}
             </select>
             </DivInput>
             <DivInput>
             <label>Titulo:</label>
             <input
             {...register('titulo')}
              placeholder='Titulo da Norma'
              name='titulo'
             ></input>
             </DivInput>
             <DivInput>
             <SubmitButton>
               Filtrar
             </SubmitButton>
             </DivInput>
           </Form>
           
           {normasList?.map(norma => (
            <Lista key={norma.id_norma}>
              <ImagemLista >                                    
                <img src={norma.imagem} alt="TedPlan" />
              </ImagemLista> 
                <TextoLista>
                  <p>{norma.tipo_norma}</p>
                  <p><b>{norma.titulo}</b></p>
                  <p>TedPlan/UNIFAP</p>
                  <p>{norma.eixo}</p>
                  <p><a href={norma.arquivo} rel="noreferrer" target="_blank" >Leia o arquivo!</a></p>
                 
                </TextoLista> 
            </Lista>           
           ))}         
         </DivFormConteudo>         
       
      </DivCenter>
       <Footer>&copy; Todos os direitos reservados<ToastContainer></ToastContainer></Footer>
     </Container>
      )
}


export const getServerSideProps: GetServerSideProps<NormasProps> = async (ctx) => {
  
  const apiClient = getAPIClient(ctx)

  const resEscala = await apiClient.get('/getEscalas')
  const escala = await resEscala.data

  const resTipoNorma = await apiClient.get('/listTipoNorma')
  const tipoNorma = await resTipoNorma.data

  const resEixo = await apiClient.get('/getEixos')
  const eixos = await resEixo.data

  const resNormas = await apiClient.get('/getNormas')
  const normas = await resNormas.data  
        
  return {
    props: {
      escala,
      tipoNorma,
      eixos,
      normas,
    }
  }
}