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
  Pagination,
  LimparFiltro,
  PaginationContainer,
  PaginationButton,
  PageInfo,
} from "../styles/views";
import { getAPIClient } from "../services/axios";
import { useForm } from "react-hook-form";
import HeadPublico from "../components/headPublico";
import { toast, ToastContainer } from "react-nextjs-toast";
import MenuPublicoLateral from "../components/MenuPublicoLateral";
import Image from "next/image";
import Router from "next/router";

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
  const [publicacoesList, setPublicacoesList] = useState(null);
  const [paginacao, setPaginacao] = useState(null);
  const [idEixo, setIdEixo] = useState(null);
  const [idMunicipio, setIdMunicipio] = useState(null);
  const [idTipo, setIdTipo] = useState(null);
  const [titulo, setTitulo] = useState(null);

  console.log("Publicacoes recebidas:", publicacoes);

  useEffect(() => {
    if (publicacoes) {
      const page = 1;
      pagination(publicacoes);
      getPublicacoes(publicacoes, page);
    }
  }, [publicacoes]);

  async function handlebuscaFiltrada(data) {
    setIdEixo(data.id_eixo);
    setIdMunicipio(data.id_municipio);
    setTitulo(data.titulo);
    setIdTipo(data.id_tipo_publicacao);
    const apiClient = getAPIClient();

    const resBusca = await apiClient.get("/getPorFiltroPublicacoes", {
      params: {
        titulo: data.titulo,
        id_eixo: data.id_eixo,
        id_tipo_publicacao: data.id_tipo_publicacao,
        id_municipio: data.id_municipio,
        page: data.page,
      },
    });

    const publicacoes = resBusca.data;

    if (publicacoes.length == 0) {
      toast.notify("Nenhum resultado encontrado para a busca!", {
        title: "Atenção",
        duration: 7,
        type: "error",
      });
      return;
    }

    getPublicacoes(publicacoes);
    pagination(publicacoes);
  }

  async function pagination(publicacoes) {
    const pages = {
      paginaAtual: publicacoes.page,

      ultimaPagina: publicacoes.lastPage,

      anterior: Math.max(publicacoes.page - 1, 1),

      proximo: Math.min(publicacoes.page + 1, publicacoes.lastPage),

      primeiraPagina: 1,

      totalItens: publicacoes.total || 0,
    };

    setPaginacao(pages);
  }

  async function handleLimparFiltro() {
    reset({
      id_municipio: "",
      id_eixo: "",
      id_tipo_publicacao: "",
      titulo: "",
    });
    setIdEixo("");
    setIdMunicipio("");
    setIdTipo("");
    setTitulo("");
    Router.push("/publicacoes");
    getPublicacoes(publicacoes);
  }

  async function handlegetPubPaginate(page?: number) {
    const apiClient = getAPIClient();

    try {
      const resBusca = await apiClient.get("/getPorFiltroPublicacoes", {
        params: {
          titulo: titulo || "",
          id_eixo: idEixo || "",
          id_tipo_publicacao: idTipo || "",
          id_municipio: idMunicipio || "",
          page: page || 1,
        },
      });

      const publicacoes = resBusca.data;

      if (publicacoes.data.length === 0) {
        toast.notify("Nenhum resultado encontrado para a busca!", {
          title: "Atenção",
          duration: 7,
          type: "error",
        });
        return;
      }

      getPublicacoes(publicacoes);
      pagination(publicacoes);
    } catch (error) {
      toast.notify("Erro ao buscar publicações", {
        title: "Erro",
        duration: 7,
        type: "error",
      });
      console.error(error);
    }
  }

  async function getPublicacoes(publicacoes?: any, page?) {
    const apiClient = getAPIClient();

    if (publicacoes.data) {
      const pub = await Promise.all(
        publicacoes.data.map(async (p: { id_imagem: any; id_arquivo: any }) => {
          let imagem = null;
          let arquivo = null;

          try {
            if (p.id_imagem) {
              const imagemResponse = await apiClient({
                method: "GET",
                url: "getImagem",
                params: { id: p.id_imagem },
                responseType: "blob",
              });
              imagem = URL.createObjectURL(imagemResponse.data);
            }
          } catch (error) {
            console.warn(
              `Imagem não encontrada para publicação ${p.id_publicacao}`
            );
          }

          try {
            if (p.id_arquivo) {
              const arquivoResponse = await apiClient({
                method: "GET",
                url: "getFile",
                params: { id: p.id_arquivo },
                responseType: "blob",
              });
              arquivo = URL.createObjectURL(arquivoResponse.data);
            }
          } catch (error) {
            console.warn(
              `Arquivo não encontrado para publicação ${p.id_publicacao}`
            );
          }

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
            <DivInput>
              <LimparFiltro onClick={() => handleLimparFiltro()}>
                Limpar filtro
              </LimparFiltro>
            </DivInput>
          </Form>

          {publicacoesList?.map((publicacao) => (
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
          {paginacao && (
            <PaginationContainer>
              <PaginationButton
                onClick={() => handlegetPubPaginate(paginacao.primeiraPagina)}
                disabled={paginacao.paginaAtual === paginacao.primeiraPagina}
              >
                Primeiro
              </PaginationButton>

              <PaginationButton
                onClick={() => handlegetPubPaginate(paginacao.anterior)}
                disabled={paginacao.paginaAtual === paginacao.primeiraPagina}
              >
                Anterior
              </PaginationButton>

              <PageInfo>
                Página {paginacao.paginaAtual} de {paginacao.ultimaPagina}
              </PageInfo>

              <PaginationButton
                onClick={() => handlegetPubPaginate(paginacao.proximo)}
                disabled={paginacao.paginaAtual === paginacao.ultimaPagina}
              >
                Próximo
              </PaginationButton>

              <PaginationButton
                onClick={() => handlegetPubPaginate(paginacao.ultimaPagina)}
                disabled={paginacao.paginaAtual === paginacao.ultimaPagina}
              >
                Último
              </PaginationButton>
            </PaginationContainer>
          )}
        </DivFormConteudo>
      </DivCenter>
      <Footer>
        &copy; Todos os direitos reservados<ToastContainer></ToastContainer>
      </Footer>
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
