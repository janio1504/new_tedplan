/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Form,
  SubmitButton,
  Lista,
  Footer,
  DivCenter,
  MenuLateral,
  DivFormConteudo,
  DivInput,
  ImagemLista,
  TextoLista,
} from "../../styles/views";
import { getAPIClient } from "../../services/axios";
import HeadPublico from "../../components/headPublico";
import { toast } from 'react-toastify'
import MenuPublicoLateral from "../../components/MenuPublicoLateral";
import Image from "next/image";
import { useForm } from "react-hook-form";
import HeadIndicadores from "../../components/headIndicadores";
import { MenuMunicipio, MenuMunicipioItem, Municipio } from "../../styles/indicadores";
import  Router  from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import { parseCookies } from "nookies";
import ImgManuais from "../../img/manuais.png"
import MenuHorizontal from "../../components/MenuHorizontal";



interface IManuais{
  id_manual: string;
  nome: string;
  data_cadastro: string;
  arquivo: Buffer | any;
}
interface IMunicipio {
  id_municipio: string;
  municipio_nome: string;
}
interface ManualProps {  
  manuais: IManuais[];
  municipio: IMunicipio[]; 
}

export default function Manuais({
  manuais,
  municipio
}: ManualProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { usuario, signOut } = useContext(AuthContext);
  const [ dadosMunicipio, setDadosMunicipio ] = useState(null)
  const [ dadosManuais, setDadosManuais ] = useState(null)
  const [ listManuais, setListManuais ] = useState(null)
  useEffect(() => {
   setDadosMunicipio(municipio[0].municipio_nome)
   getManual(manuais)
  }, []);

  async function handlebuscaFiltrada({titulo}) {
    const apiClient = getAPIClient();

    const resBusca = await apiClient.get("/get-manuais", {
      params: { titulo },
    }).then((response)=>{
      getManual(response.data)
      return response.data
    }).catch((error)=>{
      console.log(error);
      toast.error("Nenhum resultado encontrado para a busca!", { position: "top-right", autoClose: 5000 })
    });  
  }

  async function getManual(manuais?: any) {
    const apiClient = getAPIClient();
    if (manuais) {
      const ms = await Promise.all(
        manuais.map(async (manual) => {        

          const arquivo = await apiClient({
            method: "GET",
            url: "getFile",
            params: { id: manual.id_arquivo },
            responseType: "blob",
          }).then((response) => {
            return URL.createObjectURL(response.data);
          });
          const m = {
            ...manual,
            arquivo: arquivo,
          };
                   
          return m;
        })
        
      );
    setListManuais(ms)
    }
  }

  function handleHome() {
    Router.push("/indicadores/home_indicadores");
  }
  function handleGestao() {
    Router.push("/indicadores/gestao");
  }
  function handleIndicadores() {
    Router.push("/indicadores/gestao");
  }
  function handleReporte() {
    Router.push("/indicadores/gestao");
  }
  async function handleSignOut() {
    signOut();
  }

  return (
    <Container>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuHorizontal
        municipio={dadosMunicipio || municipio[0]?.municipio_nome}
      ></MenuHorizontal>
      <DivCenter>     

        <DivFormConteudo>
          <h3>Manuais</h3>

          <Form onSubmit={handleSubmit(handlebuscaFiltrada)}>
            <DivInput>
              <label>Nome:</label>
              <input
                {...register("nome")}
                placeholder="Nome do manual"
              ></input>
            </DivInput>
            <DivInput>
              <SubmitButton>Filtrar</SubmitButton>
            </DivInput>
          </Form>

          {listManuais?.map((manual) => (
            <Lista key={manual.id_manual}>
              <ImagemLista>
                <Image src={ImgManuais} alt="TedPlan" />
              </ImagemLista>
              <TextoLista>
                
                <p>
                  <b>{manual.nome}</b>
                </p>
                <p>TedPlan/UNIFAP</p>
                <p>{manual.data_cadastro}</p>
                <p>
                  <a href={manual.arquivo} rel="noreferrer" target="_blank">
                    Leia o arquivo!
                  </a>
                </p>
              </TextoLista>
            </Lista>
          ))}
        </DivFormConteudo>
      </DivCenter>
      <Footer>&copy; Todos os direitos reservados</Footer>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<ManualProps> = async (
  ctx
) => {
  const apiClient = getAPIClient(ctx);
  const { ["tedplan.token"]: token } = parseCookies(ctx);
  const { ["tedplan.id_usuario"]: id_usuario } = parseCookies(ctx);
 
  if (!token) {
    return {
      redirect: {
        destination: "/login_indicadores",
        permanent: false,
      },
    };
  }

  const resUsuario = await apiClient.get("getUsuario", {
    params: { id_usuario: id_usuario },
  });
  const usuario = await resUsuario.data;

  const res = await apiClient.get("getMunicipio", {
    params: { id_municipio: usuario[0].id_municipio },
  });
  const municipio = await res.data;

  const resM = await apiClient.get("getManuais");
  const manuais = await resM.data;


  return {
    props: {
      manuais,
      municipio,
    },
  };
};
