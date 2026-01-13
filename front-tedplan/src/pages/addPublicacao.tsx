import { GetServerSideProps } from "next";
import React, { useEffect, useState, useContext } from "react";
import { parseCookies } from "nookies";
import { AuthContext } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import { DivCenter, DivMenuTitulo, Footer, MenuMunicipioItem } from "../styles/dashboard";
import { getAPIClient } from "../services/axios";
import Sidebar from "@/components/Sidebar";
import { useForm } from "react-hook-form";
import MenuSuperior from "../components/head";
import { useRouter } from "next/router";
import api from "@/services/api";
import Router from "next/router";
import HeadIndicadores from "@/components/headIndicadores";
import { BodyDashboard } from "@/styles/dashboard-original";

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

interface IMunicipios {
  id_municipio: string;
  nome: string;
}

interface IEixos {
  id_eixo: string;
  nome: string;
}

interface ICategorias {
  id_categoria: string;
  nome: string;
}

interface ITipoPublicacao {
  id_tipo_publicacao: string;
  nome: string;
}

interface MunicipiosProps {
  eixos: IEixos[];
  categorias: ICategorias[];
  municipios: IMunicipios[];
  tipoPublicacao: ITipoPublicacao[];
}

export default function AddPublicacao({
  municipios,
  tipoPublicacao,
  eixos,
  categorias,
}: MunicipiosProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [disabledTipoPublicacao, setDisabledTipoPublicacao] = useState(false);
  const [disabledMunicipio, setDisabledMunicipio] = useState(false);
  const router = useRouter();
  const { signOut } = useContext(AuthContext);
  const { id } = router.query;

  const [publicacao, setPublicacao] = useState(null);

  useEffect(() => {
    if (id) {
      api
        .get("getPublicacao", {
          params: { id_publicacao: id },
        })
        .then((response) => {
          const pub = response.data[0];
          
          const tipoPublicacaoId = tipoPublicacao.find(
            (tp) => tp.nome.trim() === pub.tipo_publicacao.trim()
          )?.id_tipo_publicacao;

          const eixoId = eixos.find(
            (e) => e.nome.trim() === pub.eixo.trim()
          )?.id_eixo;

          const municipioId = municipios.find(
            (m) => m.nome.trim() === pub.municipio.trim()
          )?.id_municipio;

          const categoriaId = categorias.find(
            (c) => c.nome.trim() === pub.categoria.trim()
          )?.id_categoria;

          setPublicacao({
            titulo: pub.titulo,
            id_tipo_publicacao: tipoPublicacaoId || "",
            id_eixo: eixoId || "",
            id_municipio: municipioId || "",
            id_categoria: categoriaId || "",
          });

          if (pub.tipo_publicacao.trim() === "Geral") {
            setDisabledTipoPublicacao(true);
            setDisabledMunicipio(true);
          }
        })
        .catch((error) => {
          console.error("Erro ao carregar publicação:", error);
          toast.error("Erro ao carregar publicação!", {
            position: "top-right",
            autoClose: 5000,
          });
        });
    }
  }, [id, tipoPublicacao, eixos, municipios, categorias]);

  async function handleAddPublicacao(data) {
    try {
      const formData = new FormData();

      formData.append("titulo", data.titulo);
      formData.append("id_tipo_publicacao", data.id_tipo_publicacao);
      formData.append("id_eixo", data.id_eixo);
      formData.append("id_categoria", data.id_categoria);
      formData.append("id_municipio", data.id_municipio);

      if (data.imagem && data.imagem[0]) {
        formData.append("imagem", data.imagem[0]);
      }

      if (data.arquivo && data.arquivo[0]) {
        formData.append("arquivo", data.arquivo[0]);
      }

      const apiClient = getAPIClient();
      const response = await apiClient.post("addPublicacao", formData);

      if (response.data.success) {
        toast.success("Publicação cadastrada com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
        reset();
        setTimeout(() => {
          router.push("/listarPublicacoes");
        }, 2000);
      } else {
        toast.error("Erro ao cadastrar publicação!", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Erro ao cadastrar publicação:", error);
      toast.error("Erro ao cadastrar publicação!", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }
  async function handleSignOut() {
    signOut();
  }

  function handleSimisab() {
    Router.push("/indicadores/home_indicadores");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <DivMenuTitulo>
        <text
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            padding: "15px 20px",
            float: "left",
          }}
        >
          Painel de Edição
        </text>
        <ul style={{}}>
          <MenuMunicipioItem
            style={{ marginRight: "18px" }}
            onClick={handleSignOut}
          >
            Sair
          </MenuMunicipioItem>
          <MenuMunicipioItem onClick={handleSimisab}>SIMISAB</MenuMunicipioItem>
        </ul>
      </DivMenuTitulo>

      <BodyDashboard>
        <Sidebar />
        <DivCenter> 
        <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              paddingBottom: "100px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                padding: "40px",
                marginTop: "50px",
                width: "60%",
              }}
            >
            <div
              style={{
                textAlign: "center",
                marginBottom: "30px",
              }}
            >
              <h1
                style={{
                  color: "#333",
                  fontSize: "28px",
                  fontWeight: "600",
                  margin: "0 0 10px 0",
                }}
              >
                {id ? "Editar Publicação" : "Cadastro de Publicação"}
              </h1>
              <p
                style={{
                  color: "#666",
                  fontSize: "16px",
                  margin: "0",
                }}
              >
                {id
                  ? "Atualize as informações da publicação"
                  : "Preencha as informações para criar uma nova publicação"}
              </p>
            </div>

            <form
              onSubmit={handleSubmit(handleAddPublicacao)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  Título *
                </label>
                <input
                  {...register("titulo", { required: true })}
                  type="text"
                  placeholder="Título da publicação"
                  name="titulo"
                  defaultValue={publicacao?.titulo || ""}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    fontSize: "16px",
                    border: errors.titulo
                      ? "2px solid #e74c3c"
                      : "2px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    transition: "all 0.3s ease",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    (e.target as HTMLInputElement).style.borderColor =
                      "#3498db";
                    (e.target as HTMLInputElement).style.boxShadow =
                      "0 0 0 3px rgba(52, 152, 219, 0.1)";
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLInputElement).style.borderColor =
                      errors.titulo ? "#e74c3c" : "#e0e0e0";
                    (e.target as HTMLInputElement).style.boxShadow = "none";
                  }}
                />
                {errors.titulo && errors.titulo.type === "required" && (
                  <span
                    style={{
                      color: "#e74c3c",
                      fontSize: "14px",
                      marginTop: "5px",
                      display: "block",
                    }}
                  >
                    O campo Título é obrigatório!
                  </span>
                )}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    Tipo de Publicação *
                  </label>
                  <select
                    {...register("id_tipo_publicacao", { required: true })}
                    name="id_tipo_publicacao"
                    defaultValue={publicacao?.id_tipo_publicacao || ""}
                    disabled={disabledTipoPublicacao}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      fontSize: "16px",
                      border: errors.id_tipo_publicacao
                        ? "2px solid #e74c3c"
                        : "2px solid #e0e0e0",
                      borderRadius: "8px",
                      backgroundColor: disabledTipoPublicacao
                        ? "#f5f5f5"
                        : "white",
                      transition: "all 0.3s ease",
                      outline: "none",
                      cursor: disabledTipoPublicacao
                        ? "not-allowed"
                        : "pointer",
                    }}
                    onFocus={(e) => {
                      if (!disabledTipoPublicacao) {
                        (e.target as HTMLSelectElement).style.borderColor =
                          "#3498db";
                        (e.target as HTMLSelectElement).style.boxShadow =
                          "0 0 0 3px rgba(52, 152, 219, 0.1)";
                      }
                    }}
                    onBlur={(e) => {
                      if (!disabledTipoPublicacao) {
                        (e.target as HTMLSelectElement).style.borderColor =
                          errors.id_tipo_publicacao ? "#e74c3c" : "#e0e0e0";
                        (e.target as HTMLSelectElement).style.boxShadow =
                          "none";
                      }
                    }}
                  >
                    <option value="">Selecione o tipo de publicação</option>
                    {tipoPublicacao?.map((tipo, key) => (
                      <option key={key} value={tipo.id_tipo_publicacao}>
                        {tipo.nome}
                      </option>
                    ))}
                  </select>
                  {errors.id_tipo_publicacao &&
                    errors.id_tipo_publicacao.type === "required" && (
                      <span
                        style={{
                          color: "#e74c3c",
                          fontSize: "14px",
                          marginTop: "5px",
                          display: "block",
                        }}
                      >
                        Selecionar o tipo de publicação é obrigatório!
                      </span>
                    )}
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    Eixo *
                  </label>
                  <select
                    {...register("id_eixo", { required: true })}
                    name="id_eixo"
                    defaultValue={publicacao?.id_eixo || ""}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      fontSize: "16px",
                      border: errors.id_eixo
                        ? "2px solid #e74c3c"
                        : "2px solid #e0e0e0",
                      borderRadius: "8px",
                      backgroundColor: "white",
                      transition: "all 0.3s ease",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      (e.target as HTMLSelectElement).style.borderColor =
                        "#3498db";
                      (e.target as HTMLSelectElement).style.boxShadow =
                        "0 0 0 3px rgba(52, 152, 219, 0.1)";
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLSelectElement).style.borderColor =
                        errors.id_eixo ? "#e74c3c" : "#e0e0e0";
                      (e.target as HTMLSelectElement).style.boxShadow = "none";
                    }}
                  >
                    <option value="">Selecione o eixo</option>
                    {eixos?.map((eixo, key) => (
                      <option key={key} value={eixo.id_eixo}>
                        {eixo.nome}
                      </option>
                    ))}
                  </select>
                  {errors.id_eixo && errors.id_eixo.type === "required" && (
                    <span
                      style={{
                        color: "#e74c3c",
                        fontSize: "14px",
                        marginTop: "5px",
                        display: "block",
                      }}
                    >
                      Selecionar o eixo é obrigatório!
                    </span>
                  )}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    Categoria *
                  </label>
                  <select
                    {...register("id_categoria", { required: true })}
                    name="id_categoria"
                    defaultValue={publicacao?.id_categoria || ""}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      fontSize: "16px",
                      border: errors.id_categoria
                        ? "2px solid #e74c3c"
                        : "2px solid #e0e0e0",
                      borderRadius: "8px",
                      backgroundColor: "white",
                      transition: "all 0.3s ease",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      (e.target as HTMLSelectElement).style.borderColor =
                        "#3498db";
                      (e.target as HTMLSelectElement).style.boxShadow =
                        "0 0 0 3px rgba(52, 152, 219, 0.1)";
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLSelectElement).style.borderColor =
                        errors.id_categoria ? "#e74c3c" : "#e0e0e0";
                      (e.target as HTMLSelectElement).style.boxShadow = "none";
                    }}
                  >
                    <option value="">Selecione a categoria</option>
                    {categorias?.map((categoria, key) => (
                      <option key={key} value={categoria.id_categoria}>
                        {categoria.nome}
                      </option>
                    ))}
                  </select>
                  {errors.id_categoria &&
                    errors.id_categoria.type === "required" && (
                      <span
                        style={{
                          color: "#e74c3c",
                          fontSize: "14px",
                          marginTop: "5px",
                          display: "block",
                        }}
                      >
                        Selecionar a categoria é obrigatório!
                      </span>
                    )}
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    Município *
                  </label>
                  <select
                    {...register("id_municipio", { required: true })}
                    name="id_municipio"
                    defaultValue={publicacao?.id_municipio || ""}
                    disabled={disabledMunicipio}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      fontSize: "16px",
                      border: errors.id_municipio
                        ? "2px solid #e74c3c"
                        : "2px solid #e0e0e0",
                      borderRadius: "8px",
                      backgroundColor: disabledMunicipio ? "#f5f5f5" : "white",
                      transition: "all 0.3s ease",
                      outline: "none",
                      cursor: disabledMunicipio ? "not-allowed" : "pointer",
                    }}
                    onFocus={(e) => {
                      if (!disabledMunicipio) {
                        (e.target as HTMLSelectElement).style.borderColor =
                          "#3498db";
                        (e.target as HTMLSelectElement).style.boxShadow =
                          "0 0 0 3px rgba(52, 152, 219, 0.1)";
                      }
                    }}
                    onBlur={(e) => {
                      if (!disabledMunicipio) {
                        (e.target as HTMLSelectElement).style.borderColor =
                          errors.id_municipio ? "#e74c3c" : "#e0e0e0";
                        (e.target as HTMLSelectElement).style.boxShadow =
                          "none";
                      }
                    }}
                  >
                    <option value="">Selecione o município</option>
                    {municipios?.map((municipio, key) => (
                      <option key={key} value={municipio.id_municipio}>
                        {municipio.nome}
                      </option>
                    ))}
                  </select>
                  {errors.id_municipio &&
                    errors.id_municipio.type === "required" && (
                      <span
                        style={{
                          color: "#e74c3c",
                          fontSize: "14px",
                          marginTop: "5px",
                          display: "block",
                        }}
                      >
                        Selecionar o município é obrigatório!
                      </span>
                    )}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    Imagem (Opcional)
                  </label>
                  <input
                    {...register("imagem")}
                    type="file"
                    name="imagem"
                    accept="image/*"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      fontSize: "16px",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      backgroundColor: "white",
                      transition: "all 0.3s ease",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      (e.target as HTMLInputElement).style.borderColor =
                        "#3498db";
                      (e.target as HTMLInputElement).style.boxShadow =
                        "0 0 0 3px rgba(52, 152, 219, 0.1)";
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLInputElement).style.borderColor =
                        "#e0e0e0";
                      (e.target as HTMLInputElement).style.boxShadow = "none";
                    }}
                  />
                  <small
                    style={{
                      color: "#666",
                      fontSize: "14px",
                      marginTop: "8px",
                      display: "block",
                      lineHeight: "1.4",
                    }}
                  >
                    Aceita apenas arquivos de imagem (JPG, PNG, GIF, etc.)
                  </small>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    Arquivo (Opcional)
                  </label>
                  <input
                    {...register("arquivo")}
                    type="file"
                    name="arquivo"
                    accept=".pdf,.doc,.docx"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      fontSize: "16px",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      backgroundColor: "white",
                      transition: "all 0.3s ease",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      (e.target as HTMLInputElement).style.borderColor =
                        "#3498db";
                      (e.target as HTMLInputElement).style.boxShadow =
                        "0 0 0 3px rgba(52, 152, 219, 0.1)";
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLInputElement).style.borderColor =
                        "#e0e0e0";
                      (e.target as HTMLInputElement).style.boxShadow = "none";
                    }}
                  />
                  <small
                    style={{
                      color: "#666",
                      fontSize: "14px",
                      marginTop: "8px",
                      display: "block",
                      lineHeight: "1.4",
                    }}
                  >
                    Aceita arquivos PDF, DOC e DOCX
                  </small>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: isSubmitting ? "#95a5a6" : "#3498db",
                  color: "white",
                  padding: "14px 24px",
                  fontSize: "16px",
                  fontWeight: "600",
                  border: "none",
                  borderRadius: "8px",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  marginTop: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    (e.target as HTMLButtonElement).style.backgroundColor =
                      "#2980b9";
                    (e.target as HTMLButtonElement).style.transform =
                      "translateY(-2px)";
                    (e.target as HTMLButtonElement).style.boxShadow =
                      "0 6px 20px rgba(52, 152, 219, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    (e.target as HTMLButtonElement).style.backgroundColor =
                      "#3498db";
                    (e.target as HTMLButtonElement).style.transform =
                      "translateY(0)";
                    (e.target as HTMLButtonElement).style.boxShadow = "none";
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        border: "2px solid #ffffff",
                        borderTop: "2px solid transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    ></div>
                    {id ? "Atualizando..." : "Cadastrando..."}
                  </>
                ) : id ? (
                  "Atualizar Publicação"
                ) : (
                  "Cadastrar Publicação"
                )}
              </button>
            </form>
          </div>
        </div>
        </DivCenter>
      </BodyDashboard>
      <Footer>&copy; Todos os direitos reservados</Footer>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .form-container {
            padding: 20px;
            margin: 10px;
          }

          .form-title {
            font-size: 24px;
          }

          .form-subtitle {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["tedplan.token"]: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const apiClient = getAPIClient(ctx);

    // Buscar eixos
    const eixosResponse = await apiClient.get("/getEixos");
    const eixos = eixosResponse.data;

    // Buscar categorias
    const categoriasResponse = await apiClient.get("/getCategorias");
    const categorias = categoriasResponse.data;

    // Buscar municípios
    const municipiosResponse = await apiClient.get("/getMunicipios");
    const municipiosData = municipiosResponse.data || [];
    // Transformar municipio_nome para nome para manter compatibilidade
    const municipios = Array.isArray(municipiosData) 
      ? municipiosData.map((m: any) => ({
          id_municipio: m.id_municipio,
          nome: m.municipio_nome || m.nome,
        }))
      : [];

    // Buscar tipos de publicação
    const tipoPublicacaoResponse = await apiClient.get("/listTipoPublicacao");
    const tipoPublicacao = tipoPublicacaoResponse.data || [];

    return {
      props: {
        eixos: Array.isArray(eixos) ? eixos : [],
        categorias: Array.isArray(categorias) ? categorias : [],
        municipios: municipios,
        tipoPublicacao: Array.isArray(tipoPublicacao) ? tipoPublicacao : [],
      },
    };
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    return {
      props: {
        eixos: [],
        categorias: [],
        municipios: [],
        tipoPublicacao: [],
      },
    };
  }
};
