/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import React, { useEffect, useState, useContext } from "react";
import Router from "next/router";
import {
  Container,
  Form,
  Footer,
  DivFormConteudo,
  ContainerModal,
  ModalGaleria,
  CloseModalButton,
  ConteudoModal,
} from "../styles/views";
import { getAPIClient } from "../services/axios";
import { AuthContext } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import HeadPublico from "../components/headPublico";
import { toast } from "react-toastify";
import MenuPublicoLateral from "../components/MenuPublicoLateral";
import {
  BodyDashboard,
  DivMenuTitulo,
  ImagenAmpliada,
  MenuMunicipioItem,
  ModalImgAmpliada,
} from "../styles/dashboard";
import { MainContent } from "@/styles/esgoto-indicadores";
import styled from "styled-components";
import {
  FaSearch,
  FaImages,
  FaMapMarkerAlt,
  FaFilter,
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
  // background: linear-gradient(135deg, #0085bd 0%, #006a9e 100%);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  font-weight: 600;
  font-size: 18px;
  // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  padding: 12px 30px;
  background: linear-gradient(135deg, #0085bd 0%, #006a9e 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 25px auto;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 133, 189, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const GaleriasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
  margin-top: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const GaleriaCard = styled.div`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const GaleriaImagem = styled.div`
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

  ${GaleriaCard}:hover & img {
    transform: scale(1.05);
  }
`;

const GaleriaPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
`;

const GaleriaContent = styled.div`
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const GaleriaTitulo = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
  line-height: 1.4;
`;

const GaleriaInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
  flex: 1;
`;

const GaleriaMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;

  svg {
    color: #0085bd;
  }
`;

const GaleriaBotao = styled.button`
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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
  color: #666;
`;

const ContadorGalerias = styled.div`
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

type IGaleria = {
  id_galeria: string;
  titulo: string;
  id_eixo: string;
  id_municipio: string;
  eixo: string;
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

interface GaleriaProps {
  galerias: IGaleria[];
  eixos: IEixos[];
  municipios: IMunicipios[];
}

export default function Galerias({
  municipios,
  eixos,
  galerias,
}: GaleriaProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [isGaleria, setGaleria] = useState<IGaleria[]>([]);
  const [imagensGaleria, setImagensGaleria] = useState<any[]>([]);
  const [isModalGaleria, setModalGaleria] = useState(false);
  const [modalImagemAmpliada, setModalImagemAmpliada] = useState(false);
  const [imagemAmpliada, setImagemAmpliada] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tituloGaleriaAtual, setTituloGaleriaAtual] = useState<string>("");
  const { signOut } = useContext(AuthContext);

  useEffect(() => {
    if (galerias && Array.isArray(galerias) && galerias.length > 0) {
      getGalerias(galerias);
    } else {
      setGaleria([]);
    }
  }, [galerias]);

  async function handlebuscaFiltrada(data) {
    setIsLoading(true);
    try {
      const apiClient = getAPIClient();

      const resBusca = await apiClient.post("/getPorFiltroGaleria", {
        titulo: data.titulo,
        id_eixo: data.id_eixo,
        id_municipio: data.id_municipio,
      });
      const galerias = resBusca.data;
      if (galerias.length == 0) {
        toast.warning("Nenhum resultado encontrado para a busca!", {
          position: "top-right",
          autoClose: 5000,
        });
        setGaleria([]);
        setIsLoading(false);
        return;
      }
      await getGalerias(galerias);
    } catch (error) {
      console.error("Erro ao buscar galerias:", error);
      toast.error("Erro ao buscar galerias!", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function getGalerias(galerias?: any) {
    const apiClient = getAPIClient();
    if (galerias && Array.isArray(galerias)) {
      const galeria = await Promise.all(
        galerias.map(async (g) => {
          try {
            // Verificar se a galeria tem id_imagem
            if (!g.id_imagem) {
              return {
                ...g,
                imagem: null,
              };
            }

            const imagem = await apiClient({
              method: "GET",
              url: "getImagem",
              params: { id: g.id_imagem },
              responseType: "blob",
            })
              .then((response) => {
                return URL.createObjectURL(response.data);
              })
              .catch((error) => {
                console.error(
                  `Erro ao carregar imagem da galeria ${g.id_galeria}:`,
                  error
                );
                return null;
              });

            return {
              ...g,
              imagem: imagem,
            };
          } catch (error) {
            console.error(`Erro ao processar galeria ${g.id_galeria}:`, error);
            return {
              ...g,
              imagem: null,
            };
          }
        })
      );

      setGaleria(galeria);
    } else if (galerias) {
      // Se não for array, tratar como array único
      setGaleria([galerias]);
    }
  }

  async function handleModalGaleriaOpen({ id_galeria, titulo }) {
    setIsLoading(true);
    try {
      const apiClient = getAPIClient();
      setTituloGaleriaAtual(titulo || "Galeria");

      const resImagens = await apiClient.get("/getImagens", {
        params: { id_galeria: id_galeria },
      });

      if (!resImagens.data || !Array.isArray(resImagens.data)) {
        toast.warning("Nenhuma imagem encontrada para esta galeria!", {
          position: "top-right",
          autoClose: 5000,
        });
        setIsLoading(false);
        return;
      }

      const imagens = await Promise.all(
        resImagens.data.map(async (imagem) => {
          try {
            if (!imagem || !imagem.id) {
              return null;
            }

            const img = await apiClient({
              method: "GET",
              url: "getImagem",
              params: { id: imagem.id },
              responseType: "blob",
            })
              .then((response) => {
                return {
                  imagen: URL.createObjectURL(response.data),
                  id: imagem.id,
                };
              })
              .catch((error) => {
                console.error(`Erro ao carregar imagem ${imagem.id}:`, error);
                return null;
              });
            return img;
          } catch (error) {
            console.error(`Erro ao processar imagem:`, error);
            return null;
          }
        })
      );

      // Filtrar imagens nulas
      const imagensValidas = imagens.filter((img) => img !== null);

      if (imagensValidas.length === 0) {
        toast.warning("Nenhuma imagem válida encontrada para esta galeria!", {
          position: "top-right",
          autoClose: 5000,
        });
        setIsLoading(false);
        return;
      }

      setImagensGaleria(imagensValidas);
      setModalGaleria(true);
    } catch (error) {
      console.error("Erro ao abrir modal da galeria:", error);
      toast.error("Erro ao carregar imagens da galeria!", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleCloseModal() {
    setModalGaleria(false);
    setImagensGaleria([]);
  }

  function handleImagemAmpliada(imagem) {
    setImagemAmpliada(imagem);
    setModalImagemAmpliada(true);
  }
  function handleCloseModalImgAmpliada() {
    setModalImagemAmpliada(false);
    setImagemAmpliada(null);
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
        <span
          style={{
              fontSize: "20px",
              fontWeight: "bold",
            padding: "15px 20px",
            float: "left",
          }}
        >
          Portifolio de estatísticas, mapas, documentos e imagens
        </span>
    
      </DivMenuTitulo>

      <BodyDashboard>
        <MenuPublicoLateral
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      

      <DivCenter>
        <DivFormConteudo style={{ padding: "10px" }}>
          <Titulo>
            <FaImages style={{ marginRight: "10px" }} />
            Galerias
          </Titulo>

          <FiltrosContainer>
            <Form onSubmit={handleSubmit(handlebuscaFiltrada)}>
              <FiltrosGrid>
                <div>
                  <FiltroLabel>
                    <FaMapMarkerAlt
                      style={{ marginRight: "5px", display: "inline" }}
                    />
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
                    <FaFilter
                      style={{ marginRight: "5px", display: "inline" }}
                    />
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
                    <FaSearch
                      style={{ marginRight: "5px", display: "inline" }}
                    />
                    Título
                  </FiltroLabel>
                  <FiltroInput
                    {...register("titulo")}
                    placeholder="Buscar por título..."
                    name="titulo"
                  />
                </div>
              </FiltrosGrid>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "10px",
                }}
              >
                <BotaoFiltrar type="submit" disabled={isLoading}>
                  <FaSearch />
                  {isLoading ? "Buscando..." : "Filtrar"}
                </BotaoFiltrar>
              </div>
            </Form>
          </FiltrosContainer>

          {isLoading && (
            <LoadingContainer>
              <div>Carregando galerias...</div>
            </LoadingContainer>
          )}

          {!isLoading &&
            isGaleria &&
            Array.isArray(isGaleria) &&
            isGaleria.length > 0 && (
              <ContadorGalerias>
                <FaImages />
                {isGaleria.length}{" "}
                {isGaleria.length === 1
                  ? "galeria encontrada"
                  : "galerias encontradas"}
              </ContadorGalerias>
            )}

          {!isLoading &&
          isGaleria &&
          Array.isArray(isGaleria) &&
          isGaleria.length > 0 ? (
            <GaleriasGrid>
              {isGaleria.map((galeria) => (
                <GaleriaCard
                  key={galeria.id_galeria}
                  onClick={() =>
                    handleModalGaleriaOpen({
                      id_galeria: galeria.id_galeria,
                      titulo: galeria.titulo,
                    })
                  }
                >
                  <GaleriaImagem>
                    {galeria.imagem ? (
                      <img
                        src={galeria.imagem}
                        alt={galeria.titulo || "TedPlan"}
                      />
                    ) : (
                      <GaleriaPlaceholder>
                        <FaImages style={{ fontSize: "48px", opacity: 0.3 }} />
                      </GaleriaPlaceholder>
                    )}
                  </GaleriaImagem>
                  <GaleriaContent>
                    <GaleriaTitulo>
                      {galeria.titulo || "Sem título"}
                    </GaleriaTitulo>
                    <GaleriaInfo>
                      <GaleriaMeta>
                        <FaMapMarkerAlt />
                        <span>{galeria.municipio || "Não especificado"}</span>
                      </GaleriaMeta>
                      {galeria.eixo && (
                        <GaleriaMeta>
                          <FaFilter />
                          <span>{galeria.eixo}</span>
                        </GaleriaMeta>
                      )}
                    </GaleriaInfo>
                    <GaleriaBotao>
                      <FaImages />
                      Ver Galeria
                    </GaleriaBotao>
                  </GaleriaContent>
                </GaleriaCard>
              ))}
            </GaleriasGrid>
          ) : !isLoading ? (
            <EmptyState>
              <FaImages />
              <h3>Nenhuma galeria encontrada</h3>
              <p>
                Tente ajustar os filtros de busca para encontrar mais
                resultados.
              </p>
            </EmptyState>
          ) : null}
        </DivFormConteudo>
        {isModalGaleria && (
          <ContainerModal>
            <ModalGaleria>
              <CloseModalButton onClick={handleCloseModal}>
                <FaTimes />
              </CloseModalButton>

              <ConteudoModal>
                <div
                  style={{
                    marginBottom: "20px",
                    paddingBottom: "15px",
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      color: "#333",
                      fontSize: "24px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <FaImages />
                    {tituloGaleriaAtual}
                  </h2>
                  <p
                    style={{
                      margin: "5px 0 0 0",
                      color: "#666",
                      fontSize: "14px",
                    }}
                  >
                    {imagensGaleria.length}{" "}
                    {imagensGaleria.length === 1 ? "imagem" : "imagens"}
                  </p>
                </div>

                {isLoading ? (
                  <LoadingContainer>
                    <div>Carregando imagens...</div>
                  </LoadingContainer>
                ) : imagensGaleria &&
                  Array.isArray(imagensGaleria) &&
                  imagensGaleria.length > 0 ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(200px, 1fr))",
                      gap: "15px",
                    }}
                  >
                    {imagensGaleria.map((imagem, key) =>
                      imagem && imagem.imagen ? (
                        <div
                          key={key || imagem.id}
                          style={{
                            position: "relative",
                            overflow: "hidden",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "transform 0.3s ease",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                          onClick={() => handleImagemAmpliada(imagem.imagen)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        >
                          <img
                            src={imagem.imagen}
                            alt={`Imagem ${key + 1}`}
                            style={{
                              width: "100%",
                              height: "200px",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        </div>
                      ) : null
                    )}
                  </div>
                ) : (
                  <EmptyState>
                    <FaImages />
                    <h3>Nenhuma imagem encontrada</h3>
                    <p>Esta galeria não possui imagens disponíveis.</p>
                  </EmptyState>
                )}
              </ConteudoModal>
            </ModalGaleria>
          </ContainerModal>
        )}

        {modalImagemAmpliada && (
          <ContainerModal>
            <ModalImgAmpliada>
              <CloseModalButton onClick={handleCloseModalImgAmpliada}>
                <FaTimes />
              </CloseModalButton>
              <ConteudoModal>
                <ImagenAmpliada>
                  <img
                    src={`${imagemAmpliada}`}
                    alt="Imagem ampliada"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "80vh",
                      objectFit: "contain",
                      borderRadius: "8px",
                    }}
                  />
                </ImagenAmpliada>
              </ConteudoModal>
            </ModalImgAmpliada>
          </ContainerModal>
        )}
      </DivCenter>
      </BodyDashboard>
      <Footer>&copy; Todos os direitos reservados</Footer>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<GaleriaProps> = async (
  ctx
) => {
  const apiClient = getAPIClient(ctx);

  const resMunicipio = await apiClient.get("/getMunicipios");
  const municipios = await resMunicipio.data;

  const resEixo = await apiClient.get("/getEixos");
  const eixos = await resEixo.data;

  const resGalerias = await apiClient.get("/getGalerias");
  const galerias = await resGalerias.data;

  return {
    props: {
      municipios,
      eixos,
      galerias,
    },
  };
};
