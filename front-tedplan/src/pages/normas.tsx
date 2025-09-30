/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import React, { useEffect, useState, useContext } from "react";
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
  Logo_si,
  TextoLista,
  PaginationContainer,
  PaginationButton,
  PageInfo,
  LimparFiltro,
} from "../styles/views";
import { getAPIClient } from "../services/axios";
import { AuthContext } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import HeadPublico from "../components/headPublico";
import MenuPublicoLateral from "../components/MenuPublicoLateral";
import Router from "next/router";
import { toast } from "react-toastify";
import { BodyDashboard, DivMenuTitulo, MenuMunicipioItem } from "@/styles/dashboard";
import { MainContent } from "@/styles/esgoto-indicadores";
import styled from "styled-components";

const Titulo = styled.div`
  display: flex;
  box-sizing: border-box;
  width: auto;
  margin-top: -10px;
  padding: 15px;
  color: #fff;
  background-color: #0085bd;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  font-weight: bolder;
`;

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
};

interface IEscalas {
  id_escala: string;
  nome: string;
}

interface IEixos {
  id_eixo: string;
  nome: string;
}

interface ITipoNorma {
  id_tipo_norma: string;
  nome: string;
}

interface NormasProps {
  normas: INorma[];
  eixos: IEixos[];
  escala: IEscalas[];
  tipoNorma: ITipoNorma[];
}

export default function Normas({
  normas,
  tipoNorma,
  eixos,
  escala,
}: NormasProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [normasList, setNormasList] = useState(null);
  const [paginacao, setPaginacao] = useState(null);
  const [titulo, setTitulo] = useState(null);
  const [idEixo, setIdEixo] = useState(null);
  const [idTipoNorma, setIdTipoNorma] = useState(null);
  const {signOut} = useContext(AuthContext);
  const [idEscala, setIdEscala] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth <= 1000) {
            setIsCollapsed(true);
          } else {
            setIsCollapsed(false);
          }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);

  useEffect(() => {
    if (normas) {
      const page = 1;
      pagination(normas);
      getNormas(normas, page);
    }
  }, [normas]);

  async function handlebuscaFiltrada(data) {
    setTitulo(data.titulo);
    setIdEixo(data.id_eixo);
    setIdTipoNorma(data.id_tipo_norma);
    setIdEscala(data.id_escala);
    const apiClient = getAPIClient();

    const resBusca = await apiClient.get("/getPorFiltroNormas", {
      params: {
        titulo: data.titulo,
        id_eixo: data.id_eixo,
        id_tipo_norma: data.id_tipo_norma,
        id_escala: data.id_escala,
      },
    });
    const normas = resBusca.data;
    if (normas.length == 0) {
      toast.error("Nenhum resultado encontrado para a busca!", { position: "top-right", autoClose: 5000 });

      return;
    }

    getNormas(normas);
    pagination(normas);
  }

  async function handlegetNormPaginate(page?: number) {
    const apiClient = getAPIClient();

    try {
      const resBusca = await apiClient.get("/getPorFiltroNormas", {
        params: {
          titulo: titulo || "",
          id_eixo: idEixo || "",
          id_tipo_norma: idTipoNorma || "",
          id_escala: idEscala || "",
          page: page || 1,
        },
      });

      const normas = resBusca.data;

      if (!normas.data || normas.data.length === 0) {
        toast.error("Nenhum resultado encontrado para a busca!", { position: "top-right", autoClose: 5000 });
        return;
      }

      getNormas(normas);
      pagination(normas);
    } catch (error) {
      toast.error("Erro ao buscar normas", { position: "top-right", autoClose: 5000 });
      console.error(error);
    }
  }

  // async function getNormas(normas?: any, page?) {
  //   const apiClient = getAPIClient();

  //   if (normas) {
  //     const norma = await Promise.all(
  //       normas?.map(async (p) => {
  //         const imagem = await apiClient({
  //           method: "GET",
  //           url: "getImagem",
  //           params: { id: p.id_imagem },
  //           responseType: "blob",
  //         }).then((response) => {
  //           return URL.createObjectURL(response.data);
  //         });

  //         const arquivo = await apiClient({
  //           method: "GET",
  //           url: "getFile",
  //           params: { id: p.id_arquivo },
  //           responseType: "blob",
  //         }).then((response) => {
  //           return URL.createObjectURL(response.data);
  //         });
  //         const n = {
  //           id_norma: p.id_norma,
  //           titulo: p.titulo,
  //           id_eixo: p.id_eixo,
  //           id_tipo_norma: p.id_tipo_norma,
  //           id_escala: p.id_escala,
  //           eixo: p.eixo,
  //           tipo_norma: p.tipo_norma,
  //           id_arquivo: p.id_arquivo,
  //           id_imagem: p.id_imagem,
  //           imagem: imagem,
  //           arquivo: arquivo,
  //         };

  //         return n;
  //       })
  //     );

  //     setNormasList(norma);
  //   }
  // }

  // async function getNormas(normas?: any, page?) {
  //   const apiClient = getAPIClient();

  //   if (normas?.data) {
  //     const norma = await Promise.all(
  //       normas.data.map(async (p) => {
  //         let imagem = null;
  //         let arquivo = null;

  //         try {
  //           if (p.id_imagem) {
  //             const imagemResponse = await apiClient({
  //               method: "GET",
  //               url: "getImagem",
  //               params: { id: p.id_imagem },
  //               responseType: "blob",
  //             });
  //             imagem = URL.createObjectURL(imagemResponse.data);
  //           }
  //         } catch (error) {
  //           console.warn(`Imagem não encontrada para norma ${p.id_norma}`);
  //         }

  //         try {
  //           if (p.id_arquivo) {
  //             const arquivoResponse = await apiClient({
  //               method: "GET",
  //               url: "getFile",
  //               params: { id: p.id_arquivo },
  //               responseType: "blob",
  //             });
  //             arquivo = URL.createObjectURL(arquivoResponse.data);
  //           }
  //         } catch (error) {
  //           console.warn(`Arquivo não encontrado para norma ${p.id_norma}`);
  //         }

  //         return {
  //           ...p,
  //           imagem,
  //           arquivo,
  //         };
  //       })
  //     );

  //     setNormasList(norma);
  //   }
  // }

  async function getNormas(normas?: any, page?) {
    const apiClient = getAPIClient();

    if (normas && normas.data && normas.data.length > 0) {
      try {
        const norma = await Promise.all(
          normas.data.map(async (p) => {
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
              console.warn(`Imagem não encontrada para norma ${p.id_norma}`);
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
              console.warn(`Arquivo não encontrado para norma ${p.id_norma}`);
            }

            return {
              ...p,
              imagem,
              arquivo,
            };
          })
        );

        setNormasList(norma);
      } catch (error) {
        console.error("Erro ao processar normas:", error);
      }
    } else {
      console.log("Nenhuma norma para processar");
    }
  }

  // async function pagination(normas) {
  //   const pages = {
  //     paginaAtual: normas.page,

  //     ultimaPagina: normas.lastPage,

  //     anterior: Math.max(normas.page - 1, 1),

  //     proximo: Math.min(normas.page + 1, normas.lastPage),

  //     primeiraPagina: 1,

  //     totalItens: normas.total || 0,
  //   };

  //   setPaginacao(pages);
  // }

  async function pagination(normas) {
    if (normas && normas.page) {
      const pages = {
        paginaAtual: normas.page,
        ultimaPagina: normas.lastPage,
        anterior: Math.max(normas.page - 1, 1),
        proximo: Math.min(normas.page + 1, normas.lastPage),
        primeiraPagina: 1,
        totalItens: normas.total || 0,
      };

      setPaginacao(pages);
    } else {
      console.log("Dados insuficientes para calcular paginação");
    }
  }

  async function handleLimparFiltro() {
    reset({
      id_municipio: "",
      id_eixo: "",
      id_tipo_publicacao: "",
      titulo: "",
    });
    setTitulo("");
    setIdEixo("");
    setIdTipoNorma("");
    setIdEscala("");

    Router.push("/normas");
    getNormas(normas);
  }

  async function handleSignOut() {
      signOut();
    }
  
  function handleSimisab() {
          Router.push("/indicadores/home_indicadores");
    }

  return (
    <Container>
      <HeadPublico></HeadPublico>
      <DivMenuTitulo> 
                                <text style={{
                                  fontSize: '20px',
                                  fontWeight: 'bold',
                                  padding: '15px 20px',
                                  float: 'left',
                                  
                                  }}>
                                    Painel de Edição 
                                  </text>
                                <ul style={{}}>
                                <MenuMunicipioItem style={{marginRight: '18px'}}  onClick={handleSignOut}>Sair</MenuMunicipioItem>
                                <MenuMunicipioItem onClick={handleSimisab}>SIMISAB</MenuMunicipioItem>
                                </ul>
      </DivMenuTitulo>
      
      <BodyDashboard>
      <MenuPublicoLateral isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}  />
      </BodyDashboard>


      <MainContent isCollapsed={isCollapsed}>
      
        <DivFormConteudo>
          <Titulo>Normas</Titulo>

          <Form onSubmit={handleSubmit(handlebuscaFiltrada)}>
            <DivInput>
              <label>Escala:</label>
              <select {...register("id_escala")}>
                <option value="">Todos</option>
                {escala?.map((escala, key) => (
                  <option key={key} value={escala.id_escala}>
                    {escala.nome}
                  </option>
                ))}
              </select>
            </DivInput>

            <DivInput>
              <label>Eixos:</label>
              <select {...register("id_eixo")}>
                <option value="">Todos</option>
                {eixos?.map((eixo, key) => (
                  <option key={key} value={eixo.id_eixo}>
                    {eixo.nome}
                  </option>
                ))}
              </select>
            </DivInput>

            <DivInput>
              <label>Tipo:</label>
              <select {...register("id_tipo_norma")}>
                <option value="">Todos</option>
                {tipoNorma?.map((tipo, key) => (
                  <option key={key} value={tipo.id_tipo_norma}>
                    {tipo.nome}
                  </option>
                ))}
              </select>
            </DivInput>
            <DivInput>
              <label>Titulo:</label>
              <input
                {...register("titulo")}
                placeholder="Titulo da Norma"
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

          {normasList?.map((norma) => (
            <Lista key={norma.id_norma}>
              <ImagemLista>
                <img src={norma.imagem} alt="TedPlan" />
              </ImagemLista>
              <TextoLista>
                <p>{norma.tipo_norma}</p>
                <p>
                  <b>{norma.titulo}</b>
                </p>
                <p>TedPlan/UNIFAP</p>
                <p>{norma.eixo}</p>
                <p>
                  <a href={norma.arquivo} rel="noreferrer" target="_blank">
                    Leia o arquivo!
                  </a>
                </p>
              </TextoLista>
            </Lista>
          ))}
          {paginacao && (
            <PaginationContainer>
              <PaginationButton
                onClick={() => handlegetNormPaginate(paginacao.primeiraPagina)}
                disabled={paginacao.paginaAtual === paginacao.primeiraPagina}
                 style={{
                 display: innerWidth < 1000 ? 'none' : 'inline-block'
                }}
              >
                Primeiro
              </PaginationButton>

              <PaginationButton
                onClick={() => handlegetNormPaginate(paginacao.anterior)}
                disabled={paginacao.paginaAtual === paginacao.primeiraPagina}
              >
                Anterior
              </PaginationButton>

              <PageInfo>
                Página {paginacao.paginaAtual} de {paginacao.ultimaPagina}
              </PageInfo>

              <PaginationButton
                onClick={() => handlegetNormPaginate(paginacao.proximo)}
                disabled={paginacao.paginaAtual === paginacao.ultimaPagina}
              >
                Próximo
              </PaginationButton>

              <PaginationButton
                onClick={() => handlegetNormPaginate(paginacao.ultimaPagina)}
                disabled={paginacao.paginaAtual === paginacao.ultimaPagina}
                 style={{
                 display: innerWidth < 1000 ? 'none' : 'inline-block'
                }}
              >
                Último
              </PaginationButton>
            </PaginationContainer>
          )}
        </DivFormConteudo>
     
      </MainContent>
      <Footer>
        &copy; Todos os direitos reservados
      </Footer>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<NormasProps> = async (
  ctx
) => {
  const apiClient = getAPIClient(ctx);

  const resEscala = await apiClient.get("/getEscalas");
  const escala = await resEscala.data;

  const resTipoNorma = await apiClient.get("/listTipoNorma");
  const tipoNorma = await resTipoNorma.data;

  const resEixo = await apiClient.get("/getEixos");
  const eixos = await resEixo.data;

  const resNormas = await apiClient.get("/getNormas");
  const normas = await resNormas.data;

  return {
    props: {
      escala,
      tipoNorma,
      eixos,
      normas,
    },
  };
};
