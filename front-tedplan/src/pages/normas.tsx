/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Footer,
  DivFormConteudo,
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
import {
  FaSearch,
  FaGavel,
  FaMapMarkerAlt,
  FaFilter,
  FaBook,
  FaTimes,
} from "react-icons/fa";
import { DivCenter } from "@/styles/dashboard-original";

const Titulo = styled.div`
  display: flex;
  box-sizing: border-box;
  width: auto;
  margin-top: -10px;
  padding: 20px;
  color: #333;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  font-weight: 600;
  font-size: 18px;
`;

const FiltrosContainer = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const FiltrosGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: flex-end;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  > div {
    flex: 1;
    min-width: 180px;
  }
`;

const FiltroLabel = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
`;

const FiltroInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #0085bd;
    box-shadow: 0 0 0 3px rgba(0, 133, 189, 0.1);
  }
`;

const FiltroSelect = styled.select`
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #0085bd;
    box-shadow: 0 0 0 3px rgba(0, 133, 189, 0.1);
  }
`;

const BotaoFiltrar = styled.button`
  padding: 10px 20px;
  background: linear-gradient(135deg, #0085bd 0%, #006a9e 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  margin-left: auto;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 133, 189, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const BotaoLimpar = styled.button`
  padding: 10px 20px;
  background: #6c757d;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;

  &:hover {
    background: #5a6268;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const NormasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
  margin-top: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const NormaCard = styled.div`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const NormaImagem = styled.div`
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: #f0f0f0;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  ${NormaCard}:hover & img {
    transform: scale(1.05);
  }
`;

const NormaPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
`;

const NormaContent = styled.div`
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const NormaTitulo = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
  line-height: 1.4;
`;

const NormaInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
  flex: 1;
`;

const NormaMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;

  svg {
    color: #0085bd;
  }
`;

const NormaBotao = styled.a`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #0085bd 0%, #006a9e 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: auto;
  text-decoration: none;
  text-align: center;

  &:hover {
    background: linear-gradient(135deg, #006a9e 0%, #005080 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 133, 189, 0.3);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;

  svg {
    font-size: 64px;
    color: #ccc;
    margin-bottom: 20px;
  }

  h3 {
    font-size: 20px;
    margin-bottom: 10px;
    color: #333;
  }

  p {
    font-size: 14px;
    color: #999;
  }
`;

const ContadorNormas = styled.div`
  background: #e8f4f8;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #0085bd;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
  flex-wrap: wrap;
`;

const PaginationButton = styled.button`
  padding: 8px 16px;
  background: #fff;
  border: 2px solid #0085bd;
  color: #0085bd;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #0085bd;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 133, 189, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 1000px) {
    &:first-child,
    &:last-child {
      display: none;
    }
  }
`;

const PageInfo = styled.div`
  padding: 8px 16px;
  font-size: 14px;
  color: #666;
  font-weight: 500;
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
  escala: string;
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
  const [normasList, setNormasList] = useState<INorma[]>([]);
  const [paginacao, setPaginacao] = useState<any>(null);
  const [titulo, setTitulo] = useState<string | null>(null);
  const [idEixo, setIdEixo] = useState<string | null>(null);
  const [idTipoNorma, setIdTipoNorma] = useState<string | null>(null);
  const {signOut} = useContext(AuthContext);
  const [idEscala, setIdEscala] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    if (normas && (normas as any).data) {
      const page = 1;
      pagination(normas);
      getNormas(normas, page);
    }
  }, [normas]);

  async function handlebuscaFiltrada(data) {
    setIsLoading(true);
    setTitulo(data.titulo);
    setIdEixo(data.id_eixo);
    setIdTipoNorma(data.id_tipo_norma);
    setIdEscala(data.id_escala);
    const apiClient = getAPIClient();

    try {
      const resBusca = await apiClient.get("/getPorFiltroNormas", {
        params: {
          titulo: data.titulo,
          id_eixo: data.id_eixo,
          id_tipo_norma: data.id_tipo_norma,
          id_escala: data.id_escala,
          page: data.page || 1,
        },
      });
      const normas = resBusca.data;
      
      if (!normas.data || normas.data.length == 0) {
        toast.warning("Nenhum resultado encontrado para a busca!", { position: "top-right", autoClose: 5000 });
        setNormasList([]);
        setIsLoading(false);
        return;
      }

      await getNormas(normas);
      pagination(normas);
    } catch (error) {
      console.error("Erro ao buscar normas:", error);
      toast.error("Erro ao buscar normas!", { position: "top-right", autoClose: 5000 });
    } finally {
      setIsLoading(false);
    }
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
        toast.warning("Nenhum resultado encontrado!", { position: "top-right", autoClose: 5000 });
        return;
      }

      await getNormas(normas);
      pagination(normas);
    } catch (error) {
      toast.error("Erro ao buscar normas", { position: "top-right", autoClose: 5000 });
      console.error(error);
    }
  }

  async function getNormas(normas?: any, page?) {
    const apiClient = getAPIClient();

    if (normas && normas.data && normas.data.length > 0) {
      try {
        const norma = await Promise.all(
          normas.data.map(async (p: INorma) => {
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
              // Imagem não encontrada
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
              // Arquivo não encontrado
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
    }
  }

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
    }
  }

  async function handleLimparFiltro() {
    reset({
      id_eixo: "",
      id_tipo_norma: "",
      id_escala: "",
      titulo: "",
    });
    setTitulo("");
    setIdEixo("");
    setIdTipoNorma("");
    setIdEscala("");

    Router.push("/normas");
    if (normas && (normas as any).data) {
      getNormas(normas);
      pagination(normas);
    }
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
        <span style={{
          fontSize: "20px",
          fontWeight: "bold",
          padding: "15px 20px",
          float: "left",
        }}>
          Portifolio de estatísticas, mapas, documentos e imagens
        </span>
      </DivMenuTitulo>
      
      <BodyDashboard>
        <MenuPublicoLateral isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      

      <DivCenter>
        <DivFormConteudo style={{ padding: "10px" }}>
          <Titulo>
            <FaGavel style={{ marginRight: "10px" }} />
            Normas
          </Titulo>

          <FiltrosContainer>
            <form onSubmit={handleSubmit(handlebuscaFiltrada)}>
              <FiltrosGrid>
                <div>
                  <FiltroLabel>
                    <FaBook style={{ marginRight: "5px", display: "inline" }} />
                    Escala
                  </FiltroLabel>
                  <FiltroSelect {...register("id_escala")}>
                    <option value="">Todas as escalas</option>
                    {escala?.map((escala, key) => (
                      <option key={key} value={escala.id_escala}>
                        {escala.nome}
                      </option>
                    ))}
                  </FiltroSelect>
                </div>

                <div>
                  <FiltroLabel>
                    <FaFilter style={{ marginRight: "5px", display: "inline" }} />
                    Eixo
                  </FiltroLabel>
                  <FiltroSelect {...register("id_eixo")}>
                    <option value="">Todos os eixos</option>
                    {eixos?.map((eixo, key) => (
                      <option key={key} value={eixo.id_eixo}>
                        {eixo.nome}
                      </option>
                    ))}
                  </FiltroSelect>
                </div>

                <div>
                  <FiltroLabel>
                    <FaGavel style={{ marginRight: "5px", display: "inline" }} />
                    Tipo
                  </FiltroLabel>
                  <FiltroSelect {...register("id_tipo_norma")}>
                    <option value="">Todos os tipos</option>
                    {tipoNorma?.map((tipo, key) => (
                      <option key={key} value={tipo.id_tipo_norma}>
                        {tipo.nome}
                      </option>
                    ))}
                  </FiltroSelect>
                </div>

                <div>
                  <FiltroLabel>
                    <FaSearch style={{ marginRight: "5px", display: "inline" }} />
                    Título
                  </FiltroLabel>
                  <FiltroInput
                    {...register("titulo")}
                    placeholder="Buscar por título..."
                    name="titulo"
                  />
                </div>
              </FiltrosGrid>

              <div style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "10px",
              }}>
                <BotaoLimpar type="button" onClick={handleLimparFiltro}>
                  <FaTimes />
                  Limpar
                </BotaoLimpar>
                <BotaoFiltrar type="submit" disabled={isLoading}>
                  <FaSearch />
                  {isLoading ? "Buscando..." : "Filtrar"}
                </BotaoFiltrar>
              </div>
            </form>
          </FiltrosContainer>

          {isLoading && (
            <div style={{ textAlign: "center", padding: "60px", color: "#666" }}>
              <div>Carregando normas...</div>
            </div>
          )}

          {!isLoading && normasList && Array.isArray(normasList) && normasList.length > 0 && (
            <ContadorNormas>
              <FaGavel />
              {normasList.length}{" "}
              {normasList.length === 1 ? "norma encontrada" : "normas encontradas"}
            </ContadorNormas>
          )}

          {!isLoading && normasList && Array.isArray(normasList) && normasList.length > 0 ? (
            <>
              <NormasGrid>
                {normasList.map((norma) => (
                  <NormaCard key={norma.id_norma}>
                    <NormaImagem>
                      {norma.imagem ? (
                        <img
                          src={norma.imagem}
                          alt={norma.titulo || "TedPlan"}
                        />
                      ) : (
                        <NormaPlaceholder>
                          <FaGavel style={{ fontSize: "48px", opacity: 0.3 }} />
                        </NormaPlaceholder>
                      )}
                    </NormaImagem>
                    <NormaContent>
                      <NormaTitulo>
                        {norma.titulo || "Sem título"}
                      </NormaTitulo>
                      <NormaInfo>
                        {norma.tipo_norma && (
                          <NormaMeta>
                            <FaGavel />
                            <span>{norma.tipo_norma}</span>
                          </NormaMeta>
                        )}
                        {norma.escala && (
                          <NormaMeta>
                            <FaBook />
                            <span>Escala: {norma.escala}</span>
                          </NormaMeta>
                        )}
                        {norma.eixo && (
                          <NormaMeta>
                            <FaFilter />
                            <span>{norma.eixo}</span>
                          </NormaMeta>
                        )}
                      </NormaInfo>
                      {norma.arquivo && (
                        <NormaBotao
                          href={norma.arquivo}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <FaGavel />
                          Ler Norma
                        </NormaBotao>
                      )}
                    </NormaContent>
                  </NormaCard>
                ))}
              </NormasGrid>

              {paginacao && (
                <PaginationContainer>
                  <PaginationButton
                    onClick={() => handlegetNormPaginate(paginacao.primeiraPagina)}
                    disabled={paginacao.paginaAtual === paginacao.primeiraPagina}
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
                  >
                    Último
                  </PaginationButton>
                </PaginationContainer>
              )}
            </>
          ) : !isLoading ? (
            <EmptyState>
              <FaGavel />
              <h3>Nenhuma norma encontrada</h3>
              <p>
                Tente ajustar os filtros de busca para encontrar mais resultados.
              </p>
            </EmptyState>
          ) : null}
        </DivFormConteudo>
      </DivCenter>
      </BodyDashboard>
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
