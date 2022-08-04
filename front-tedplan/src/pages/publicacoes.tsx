/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
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
} from "../styles/views";
import { getAPIClient } from "../services/axios";
import { useForm } from "react-hook-form";
import HeadPublico from "../components/headPublico";
import { toast, ToastContainer } from 'react-nextjs-toast'
import MenuPublicoLateral from "../components/MenuPublicoLateral";
import Image from "next/image";

type IPublicacao = {
  id_publicacao: string;
  titulo: string;
  id_eixo: string;
  id_tipo_publicacao: string;
  id_categoria: string;
  id_municipio: string;
  eixo: string;
  tipo_publicacao: string;
  municipio: string;
  id_arquivo: string;
  id_imagem: string;
  imagem: string;
};

interface IMunicipios {
  id_municipio: string;
  nome: string;
}

interface IEixos {
  id_eixo: string;
  nome: string;
}

interface ITipoPublicacao {
  id_tipo_publicacao: string;
  nome: string;
}

interface PublicacaoProps {
  publicacoes: IPublicacao[];
  eixos: IEixos[];
  municipios: IMunicipios[];
  tipoPublicacao: ITipoPublicacao[];
}

export default function ViewPublicacoes({
  municipios,
  tipoPublicacao,
  eixos,
  publicacoes,
}: PublicacaoProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [publicacoesList, setPublicacoesList] = useState<IPublicacao[] | any>(
    publicacoes
  );
  
  useEffect(() => {
    if (publicacoes) {
      getPublicacoes(publicacoes);
    }
  }, [publicacoes]);

  async function handlebuscaFiltrada({
    titulo,
    id_eixo,
    id_tipo_publicacao,
    id_municipio,
  }: IPublicacao) {
    const apiClient = getAPIClient();

    const resBusca = await apiClient.get("/getPorFiltroPublicacoes", {
      params: { titulo, id_eixo, id_tipo_publicacao, id_municipio },
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

    getPublicacoes(publicacoes);
    reset({
      titulo: "",
      id_municipio: "",
      id_tipo_publicacao: "",
      id_eixo: "",
    });
  }

  async function getPublicacoes(publicacoes?: any) {
    const apiClient = getAPIClient();
    if (publicacoes) {
      const pub = await Promise.all(
        publicacoes.map(async (p) => {
          const imagem = await apiClient({
            method: "GET",
            url: "getImagem",
            params: { id: p.id_imagem },
            responseType: "blob",
          }).then((response) => {
            return URL.createObjectURL(response.data);
          });

          const arquivo = await apiClient({
            method: "GET",
            url: "getFile",
            params: { id: p.id_arquivo },
            responseType: "blob",
          }).then((response) => {
            return URL.createObjectURL(response.data);
          });
          const publicacao = {
            ...p,
            imagem: imagem,
            arquivo: arquivo,
          };
          
          return publicacao;
        })
      );

      setPublicacoesList(pub);
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
          <h3>Publicações</h3>

          <Form onSubmit={handleSubmit(handlebuscaFiltrada)}>
            <DivInput>
              <label>Municipios:</label>
              <select {...register("id_municipio")}>
                <option value="">Todos</option>
                {municipios.map((municipio, key) => (
                  <option key={key} value={municipio.id_municipio}>
                    {municipio.nome}
                  </option>
                ))}
              </select>
            </DivInput>

            <DivInput>
              <label>Eixos:</label>
              <select {...register("id_eixo")}>
                <option value="">Todos</option>
                {eixos.map((eixo, key) => (
                  <option key={key} value={eixo.id_eixo}>
                    {eixo.nome}
                  </option>
                ))}
              </select>
            </DivInput>

            <DivInput>
              <label>Tipo:</label>
              <select {...register("id_tipo_publicacao")}>
                <option value="">Todos</option>
                {tipoPublicacao.map((tipo, key) => (
                  <option key={key} value={tipo.id_tipo_publicacao}>
                    {tipo.nome}
                  </option>
                ))}
              </select>
            </DivInput>
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

          {publicacoesList.map((publicacao) => (
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

export const getServerSideProps: GetServerSideProps<PublicacaoProps> = async (
  ctx
) => {
  const apiClient = getAPIClient(ctx);

  const resMunicipio = await apiClient.get("/getMunicipios");
  const municipios = await resMunicipio.data;

  const resTipoPublicacao = await apiClient.get("/listTipoPublicacao");
  const tipoPublicacao = await resTipoPublicacao.data;

  const resEixo = await apiClient.get("/getEixos");
  const eixos = await resEixo.data;

  const resPublicacoes = await apiClient.get("/getPublicacoes");
  const publicacoes = await resPublicacoes.data;

  return {
    props: {
      municipios,
      tipoPublicacao,
      eixos,
      publicacoes,
    },
  };
};
