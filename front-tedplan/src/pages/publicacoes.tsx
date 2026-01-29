/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Footer,
  DivFormConteudo,
} from "../styles/views";
import { getAPIClient } from "../services/axios";
import { useForm } from "react-hook-form";
import HeadPublico from "../components/headPublico";
import { toast } from "react-toastify";
import MenuPublicoLateral from "../components/MenuPublicoLateral";
import Router from "next/router";
import { DivMenuTitulo, MenuMunicipioItem } from "@/styles/dashboard";
import { BodyDashboard } from "@/styles/dashboard-original";
import { AuthContext } from "@/contexts/AuthContext";
import { MainContent } from "@/styles/esgoto-indicadores";
import styled from "styled-components";
import {
  FaSearch,
  FaFileAlt,
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

const PublicacoesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
  margin-top: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const PublicacaoCard = styled.div`
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

const PublicacaoImagem = styled.div`
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

  ${PublicacaoCard}:hover & img {
    transform: scale(1.05);
  }
`;

const PublicacaoPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
`;

const PublicacaoContent = styled.div`
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const PublicacaoTitulo = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
  line-height: 1.4;
`;

const PublicacaoInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
  flex: 1;
`;

const PublicacaoMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;

  svg {
    color: #0085bd;
  }
`;

const PublicacaoBotao = styled.a`
  width: 92%;
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

const ContadorPublicacoes = styled.div`
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
  arquivo: string;
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
  const [publicacoesList, setPublicacoesList] = useState<IPublicacao[]>([]);
  const [paginacao, setPaginacao] = useState<any>(null);
  const [idEixo, setIdEixo] = useState<string | null>(null);
  const [idMunicipio, setIdMunicipio] = useState<string | null>(null);
  const [idTipo, setIdTipo] = useState<string | null>(null);
  const [titulo, setTitulo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {signOut} = useContext(AuthContext);
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
    if (publicacoes && (publicacoes as any).data) {
      const page = 1;
      pagination(publicacoes as any);
      getPublicacoes(publicacoes as any, page);
    }
  }, [publicacoes]);

  async function handlebuscaFiltrada(data) {
    setIsLoading(true);
    setIdEixo(data.id_eixo);
    setIdMunicipio(data.id_municipio);
    setTitulo(data.titulo);
    setIdTipo(data.id_tipo_publicacao);
    const apiClient = getAPIClient();

    try {
      const resBusca = await apiClient.get("/getPorFiltroPublicacoes", {
        params: {
          titulo: data.titulo,
          id_eixo: data.id_eixo,
          id_tipo_publicacao: data.id_tipo_publicacao,
          id_municipio: data.id_municipio,
          page: data.page || 1,
        },
      });

      const publicacoes = resBusca.data;

      if (!publicacoes.data || publicacoes.data.length == 0) {
        toast.warning("Nenhum resultado encontrado para a busca!", { position: "top-right", autoClose: 5000 });
        setPublicacoesList([]);
        setIsLoading(false);
        return;
      }

      await getPublicacoes(publicacoes);
      pagination(publicacoes);
    } catch (error) {
      console.error("Erro ao buscar publicações:", error);
      toast.error("Erro ao buscar publicações!", { position: "top-right", autoClose: 5000 });
    } finally {
      setIsLoading(false);
    }
  }

  async function pagination(publicacoes) {
    if (publicacoes && publicacoes.page) {
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
    if (publicacoes && (publicacoes as any).data) {
      getPublicacoes(publicacoes as any);
      pagination(publicacoes as any);
    }
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

      if (!publicacoes.data || publicacoes.data.length === 0) {
        toast.warning("Nenhum resultado encontrado!", { position: "top-right", autoClose: 5000 });
        return;
      }

      await getPublicacoes(publicacoes);
      pagination(publicacoes);
    } catch (error) {
      toast.error("Erro ao buscar publicações", { position: "top-right", autoClose: 5000 });
      console.error(error);
    }
  }

  async function getPublicacoes(publicacoes?: any, page?) {
    const apiClient = getAPIClient();

    if (publicacoes && publicacoes.data) {
      try {
        const pub = await Promise.all(
          publicacoes.data.map(async (p: IPublicacao) => {
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
              imagem: imagem,
              arquivo: arquivo,
            };
          })
        );

        setPublicacoesList(pub);
      } catch (error) {
        console.error("Erro ao processar publicações:", error);
      }
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
            <FaFileAlt style={{ marginRight: "10px" }} />
            Publicações
          </Titulo>

          <FiltrosContainer>
            <form onSubmit={handleSubmit(handlebuscaFiltrada)}>
              <FiltrosGrid>
                <div>
                  <FiltroLabel>
                    <FaMapMarkerAlt style={{ marginRight: "5px", display: "inline" }} />
                    Município
                  </FiltroLabel>
                  <FiltroSelect {...register("id_municipio")}>
                    <option value="">Todos os municípios</option>
                    {municipios.map((municipio, key) => (
                      <option key={key} value={municipio.id_municipio}>
                        {municipio.nome}
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
                    {eixos.map((eixo, key) => (
                      <option key={key} value={eixo.id_eixo}>
                        {eixo.nome}
                      </option>
                    ))}
                  </FiltroSelect>
                </div>

                <div>
                  <FiltroLabel>
                    <FaBook style={{ marginRight: "5px", display: "inline" }} />
                    Tipo
                  </FiltroLabel>
                  <FiltroSelect {...register("id_tipo_publicacao")}>
                    <option value="">Todos os tipos</option>
                    {tipoPublicacao.map((tipo, key) => (
                      <option key={key} value={tipo.id_tipo_publicacao}>
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
              <div>Carregando publicações...</div>
            </div>
          )}

          {!isLoading && publicacoesList && Array.isArray(publicacoesList) && publicacoesList.length > 0 && (
            <ContadorPublicacoes>
              <FaFileAlt />
              {publicacoesList.length}{" "}
              {publicacoesList.length === 1 ? "publicação encontrada" : "publicações encontradas"}
            </ContadorPublicacoes>
          )}

          {!isLoading && publicacoesList && Array.isArray(publicacoesList) && publicacoesList.length > 0 ? (
            <>
              <PublicacoesGrid>
                {publicacoesList.map((publicacao) => (
                  <PublicacaoCard key={publicacao.id_publicacao}>
                    <PublicacaoImagem>
                      {publicacao.imagem ? (
                        <img
                          src={publicacao.imagem}
                          alt={publicacao.titulo || "TedPlan"}
                        />
                      ) : (
                        <PublicacaoPlaceholder>
                          <FaFileAlt style={{ fontSize: "48px", opacity: 0.3 }} />
                        </PublicacaoPlaceholder>
                      )}
                    </PublicacaoImagem>
                    <PublicacaoContent>
                      <PublicacaoTitulo>
                        {publicacao.titulo || "Sem título"}
                      </PublicacaoTitulo>
                      <PublicacaoInfo>
                        {publicacao.tipo_publicacao && (
                          <PublicacaoMeta>
                            <FaBook />
                            <span>{publicacao.tipo_publicacao}</span>
                          </PublicacaoMeta>
                        )}
                        {publicacao.municipio && (
                          <PublicacaoMeta>
                            <FaMapMarkerAlt />
                            <span>{publicacao.municipio}</span>
                          </PublicacaoMeta>
                        )}
                        {publicacao.eixo && (
                          <PublicacaoMeta>
                            <FaFilter />
                            <span>{publicacao.eixo}</span>
                          </PublicacaoMeta>
                        )}
                      </PublicacaoInfo>
                      {publicacao.arquivo && (
                        <PublicacaoBotao
                          href={publicacao.arquivo}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <FaFileAlt />
                          Ler Publicação
                        </PublicacaoBotao>
                      )}
                    </PublicacaoContent>
                  </PublicacaoCard>
                ))}
              </PublicacoesGrid>

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
            </>
          ) : !isLoading ? (
            <EmptyState>
              <FaFileAlt />
              <h3>Nenhuma publicação encontrada</h3>
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
