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
import { toast, ToastContainer } from 'react-nextjs-toast'
import MenuPublicoLateral from "../../components/MenuPublicoLateral";
import Image from "next/image";
import { useForm } from "react-hook-form";
import HeadIndicadores from "../../components/headIndicadores";
import { MenuMunicipio, MenuMunicipioItem, Municipio } from "../../styles/indicadores";
import  Router  from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import { parseCookies } from "nookies";
import MenuHorizontal from "../../components/MenuHorizontal";



interface IMunicipios {
  id_municipio: string;
  municipio_nome: string;
}
interface MunicipioProps {  
  municipio: IMunicipios[];  
}

export default function Relatorios({
  municipio
}: MunicipioProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { usuario, signOut } = useContext(AuthContext);
  const [ dadosMunicipio, setDadosMunicipio ] = useState(null)
  const [ manuais, setManuais ] = useState(null)
  useEffect(() => {
   
  }, []);

  async function handlebuscaFiltrada({titulo}) {
    const apiClient = getAPIClient();

    const resBusca = await apiClient.get("/get-manuais", {
      params: { titulo },
    });
    const publicacoes = resBusca.data;
    if (!publicacoes[0]){
      toast.notify('Nenhum resultado encontrado para a busca!',{
        title: "Atenção",
        duration: 7,
        type: "error",
      })
      return
    }
   
  }

  async function getManual(manuais?: any) {
    const apiClient = getAPIClient();
    if (manuais) {
      const pub = await Promise.all(
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
      <MenuHorizontal municipio={municipio[0].municipio_nome}></MenuHorizontal>
      <DivCenter>     

        <DivFormConteudo>
          <h3>Relatórios</h3>

          <Form onSubmit={handleSubmit(handlebuscaFiltrada)}>
            <DivInput>
              <label>Titulo:</label>
              <input
                {...register("titulo")}
                placeholder="Titulo da publicação"
                name="titulo"
              ></input>
            </DivInput>
            <DivInput>
              <SubmitButton>Filtrar</SubmitButton>
            </DivInput>
          </Form>

          {manuais?.map((publicacao) => (
            <Lista key={publicacao.id_publicacao}>
              <ImagemLista>
                <img src={publicacao.imagem} alt="TedPlan" />
              </ImagemLista>
              <TextoLista>
                <p>{publicacao.tipo_publicacao}</p>
                <p>
                  <b>{publicacao.titulo}</b>
                </p>
                <p>TedPlan/UNIFAP</p>
                <p>{publicacao.eixo}</p>
                <p>
                  <a href={publicacao.arquivo} rel="noreferrer" target="_blank">
                    Leia o arquivo!
                  </a>
                </p>
              </TextoLista>
            </Lista>
          ))}
        </DivFormConteudo>
      </DivCenter>
      <Footer>&copy; Todos os direitos reservados<ToastContainer></ToastContainer></Footer>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<MunicipioProps> = async (
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

  return {
    props: {
      municipio,
    },
  };
};
