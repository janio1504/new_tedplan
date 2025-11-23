import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { toast } from "react-toastify";
import Sidebar from "@/components/Sidebar";
import Router from "next/router";
import { AuthContext } from "@/contexts/AuthContext";
import { DivMenuTitulo, Footer, MenuMunicipioItem } from "../styles/dashboard";
import { getAPIClient } from "../services/axios";
import { useForm } from "react-hook-form";
import MenuSuperior from "../components/head";
import { useRouter } from "next/router";
import HeadIndicadores from "@/components/headIndicadores";
import { BodyDashboard, DivCenter } from "@/styles/dashboard-original";

interface IGaleria {
  id_galeria: string;
  titulo: string;
  descricao: string;
  mes: string;
  ano: string;
  imagem: File;
  id_municipio: string;
  id_eixo: string;
}

interface IMes {
  mes: string;
}

interface IAno {
  ano: string;
}

interface IMunicipios {
  id_municipio: string;
  nome: string;
}

interface IEixos {
  id_eixo: string;
  nome: string;
}

interface GaleriaProps {
  galeria: IGaleria[];
  mes: IMes[];
  ano: IAno[];
  municipios: IMunicipios[];
  eixos: IEixos[];
}

export default function AddGaleria({ municipios, eixos }: GaleriaProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [content, setContent] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [galeriaId, setGaleriaId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {signOut} = useContext(AuthContext);

  // Meses disponíveis
  const meses = [
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" }
  ];

  // Anos disponíveis (últimos 10 anos)
  const anos = Array.from({ length: 10 }, (_, i) => {
    const ano = new Date().getFullYear() - i;
    return { value: ano.toString(), label: ano.toString() };
  });

  // Carregar dados da galeria se estiver em modo de edição
  useEffect(() => {
    async function loadGaleria() {
      const { id } = router.query;
      if (id && typeof id === 'string') {
        setIsEditMode(true);
        setGaleriaId(id);
        setIsLoading(true);
        try {
          const apiClient = getAPIClient();
          const response = await apiClient.get(`/getGaleria/${id}`);
          
          if (response.data && response.data.success && response.data.data) {
            const galeria = response.data.data;
            reset({
              titulo: galeria.titulo || "",
              mes: galeria.mes || "",
              ano: galeria.ano || "",
              id_municipio: galeria.id_municipio || "",
              id_eixo: galeria.id_eixo || "",
            });
            setContent(galeria.descricao || "");
          } else {
            toast.error("Erro ao carregar dados da galeria!", { position: "top-right", autoClose: 5000 });
            router.push("/listarGalerias");
          }
        } catch (error) {
          console.error("Erro ao carregar galeria:", error);
          toast.error("Erro ao carregar dados da galeria!", { position: "top-right", autoClose: 5000 });
          router.push("/listarGalerias");
        } finally {
          setIsLoading(false);
        }
      }
    }
    loadGaleria();
  }, [router.query, reset]);

  async function handleAddGaleria({
    titulo,
    mes,
    ano,
    imagem,
    id_municipio,
    id_eixo,
  }) {
    try {
      const descricao = content.toString();
      const formData = new FormData();

      // Se estiver editando e uma nova imagem foi selecionada, adicionar ao formData
      if (imagem && imagem[0]) {
        formData.append("imagem", imagem[0]);
      }
      
      formData.append("titulo", titulo);
      formData.append("descricao", descricao);
      formData.append("mes", mes);
      formData.append("ano", ano);
      formData.append("id_municipio", id_municipio);
      formData.append("id_eixo", id_eixo);

      const apiClient = getAPIClient();
      let response;

      if (isEditMode && galeriaId) {
        // Modo de edição
        response = await apiClient.put(`/updateGaleria/${galeriaId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Modo de criação
        if (!imagem || !imagem[0]) {
          toast.error("Imagem é obrigatória para criar uma nova galeria!", { position: "top-right", autoClose: 5000 });
          return;
        }
        response = await apiClient.post("addGaleria", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.data && response.data.success) {
        const mensagem = isEditMode 
          ? (response.data.message || "Galeria atualizada com sucesso!")
          : (response.data.message || "Galeria cadastrada com sucesso!");
        toast.success(mensagem, { position: "top-right", autoClose: 5000 });
        
        if (!isEditMode) {
          reset({
            titulo: "",
            mes: "",
            ano: "",
            id_municipio: "",
            id_eixo: "",
          });
          setContent("");
        }
        
        setTimeout(() => {
          router.push("/listarGalerias");
        }, 2000);
      } else {
        const errorMsg = response.data?.message || response.data?.error || (isEditMode ? "Erro ao atualizar galeria" : "Erro ao cadastrar galeria");
        toast.error(errorMsg, { position: "top-right", autoClose: 5000 });
      }
    } catch (error: any) {
      console.error(`Erro ao ${isEditMode ? 'atualizar' : 'cadastrar'} galeria:`, error);
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.error || 
                          error?.message || 
                          (isEditMode ? "Erro ao atualizar galeria" : "Erro ao cadastrar galeria");
      toast.error(errorMessage, { position: "top-right", autoClose: 5000 });
    }
  }

   async function handleSignOut() {
        signOut();
      }
    
    function handleSimisab() {
            Router.push("/indicadores/home_indicadores");
      }
  

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
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
        <Sidebar/>
      <DivCenter>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: 'calc(100vh - 200px)',
        padding: '20px',
        marginLeft: '100px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          padding: '40px',
          width: '100%',
          maxWidth: '700px',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <h1 style={{
              color: '#333',
              fontSize: '28px',
              fontWeight: '600',
              margin: '0 0 10px 0'
            }}>
              {isEditMode ? 'Editar Galeria' : 'Cadastro de Galeria'}
            </h1>
            <p style={{
              color: '#666',
              fontSize: '16px',
              margin: '0'
            }}>
              {isEditMode ? 'Edite as informações da galeria' : 'Preencha as informações para criar uma nova galeria'}
            </p>
          </div>

          <form onSubmit={handleSubmit(handleAddGaleria)} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#333'
              }}>
                Título *
              </label>
              <input
                {...register("titulo", { required: true })}
                type="text"
                placeholder="Título da galeria"
                name="titulo"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: errors.titulo ? '2px solid #e74c3c' : '2px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = '#3498db';
                  (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = errors.titulo ? '#e74c3c' : '#e0e0e0';
                  (e.target as HTMLInputElement).style.boxShadow = 'none';
                }}
              />
              {errors.titulo && errors.titulo.type === "required" && (
                <span style={{
                  color: '#e74c3c',
                  fontSize: '14px',
                  marginTop: '5px',
                  display: 'block'
                }}>
                  O campo Título é obrigatório!
                </span>
              )}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Mês *
                </label>
                <select
                  {...register("mes", { required: true })}
                  name="mes"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '16px',
                    border: errors.mes ? '2px solid #e74c3c' : '2px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    (e.target as HTMLSelectElement).style.borderColor = '#3498db';
                    (e.target as HTMLSelectElement).style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLSelectElement).style.borderColor = errors.mes ? '#e74c3c' : '#e0e0e0';
                    (e.target as HTMLSelectElement).style.boxShadow = 'none';
                  }}
                >
                  <option value="">Selecione o mês</option>
                  {meses.map((mes, key) => (
                    <option key={key} value={mes.value}>
                      {mes.label}
                    </option>
                  ))}
                </select>
                {errors.mes && errors.mes.type === "required" && (
                  <span style={{
                    color: '#e74c3c',
                    fontSize: '14px',
                    marginTop: '5px',
                    display: 'block'
                  }}>
                    Selecionar o mês é obrigatório!
                  </span>
                )}
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Ano *
                </label>
                <select
                  {...register("ano", { required: true })}
                  name="ano"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '16px',
                    border: errors.ano ? '2px solid #e74c3c' : '2px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    (e.target as HTMLSelectElement).style.borderColor = '#3498db';
                    (e.target as HTMLSelectElement).style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLSelectElement).style.borderColor = errors.ano ? '#e74c3c' : '#e0e0e0';
                    (e.target as HTMLSelectElement).style.boxShadow = 'none';
                  }}
                >
                  <option value="">Selecione o ano</option>
                  {anos.map((ano, key) => (
                    <option key={key} value={ano.value}>
                      {ano.label}
                    </option>
                  ))}
                </select>
                {errors.ano && errors.ano.type === "required" && (
                  <span style={{
                    color: '#e74c3c',
                    fontSize: '14px',
                    marginTop: '5px',
                    display: 'block'
                  }}>
                    Selecionar o ano é obrigatório!
                  </span>
                )}
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Município *
                </label>
                <select
                  {...register("id_municipio", { required: true })}
                  name="id_municipio"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '16px',
                    border: errors.id_municipio ? '2px solid #e74c3c' : '2px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    (e.target as HTMLSelectElement).style.borderColor = '#3498db';
                    (e.target as HTMLSelectElement).style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLSelectElement).style.borderColor = errors.id_municipio ? '#e74c3c' : '#e0e0e0';
                    (e.target as HTMLSelectElement).style.boxShadow = 'none';
                  }}
                >
                  <option value="">Selecione um município</option>
                  {municipios?.map((municipio, key) => (
                    <option key={key} value={municipio.id_municipio}>
                      {municipio.nome}
                    </option>
                  ))}
                </select>
                {errors.id_municipio && errors.id_municipio.type === "required" && (
                  <span style={{
                    color: '#e74c3c',
                    fontSize: '14px',
                    marginTop: '5px',
                    display: 'block'
                  }}>
                    Selecionar um município é obrigatório!
                  </span>
                )}
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Eixo *
                </label>
                <select
                  {...register("id_eixo", { required: true })}
                  name="id_eixo"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '16px',
                    border: errors.id_eixo ? '2px solid #e74c3c' : '2px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    (e.target as HTMLSelectElement).style.borderColor = '#3498db';
                    (e.target as HTMLSelectElement).style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLSelectElement).style.borderColor = errors.id_eixo ? '#e74c3c' : '#e0e0e0';
                    (e.target as HTMLSelectElement).style.boxShadow = 'none';
                  }}
                >
                  <option value="">Selecione um eixo</option>
                  {eixos?.map((eixo, key) => (
                    <option key={key} value={eixo.id_eixo}>
                      {eixo.nome}
                    </option>
                  ))}
                </select>
                {errors.id_eixo && errors.id_eixo.type === "required" && (
                  <span style={{
                    color: '#e74c3c',
                    fontSize: '14px',
                    marginTop: '5px',
                    display: 'block'
                  }}>
                    Selecionar um eixo é obrigatório!
                  </span>
                )}
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#333'
              }}>
                Imagem {!isEditMode && '*'}
              </label>
              <input
                {...register("imagem", { required: !isEditMode })}
                type="file"
                name="imagem"
                accept="image/*"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: errors.imagem ? '2px solid #e74c3c' : '2px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = '#3498db';
                  (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = errors.imagem ? '#e74c3c' : '#e0e0e0';
                  (e.target as HTMLInputElement).style.boxShadow = 'none';
                }}
              />
              {errors.imagem && errors.imagem.type === "required" && (
                <span style={{
                  color: '#e74c3c',
                  fontSize: '14px',
                  marginTop: '5px',
                  display: 'block'
                }}>
                  Selecionar uma imagem é obrigatório!
                </span>
              )}
              <small style={{
                color: '#666',
                fontSize: '14px',
                marginTop: '8px',
                display: 'block',
                lineHeight: '1.4'
              }}>
                {isEditMode ? 'Deixe em branco para manter a imagem atual. Aceita apenas arquivos de imagem (JPG, PNG, GIF, etc.)' : 'Aceita apenas arquivos de imagem (JPG, PNG, GIF, etc.)'}
              </small>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#333'
              }}>
                Descrição
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Descrição da galeria (opcional)"
                name="descricao"
                rows={6}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  (e.target as HTMLTextAreaElement).style.borderColor = '#3498db';
                  (e.target as HTMLTextAreaElement).style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                }}
                onBlur={(e) => {
                  (e.target as HTMLTextAreaElement).style.borderColor = '#e0e0e0';
                  (e.target as HTMLTextAreaElement).style.boxShadow = 'none';
                }}
              />
              <small style={{
                color: '#666',
                fontSize: '14px',
                marginTop: '8px',
                display: 'block',
                lineHeight: '1.4'
              }}>
                Descrição detalhada da galeria (opcional)
              </small>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                backgroundColor: isSubmitting ? '#95a5a6' : '#3498db',
                color: 'white',
                padding: '14px 24px',
                fontSize: '16px',
                fontWeight: '600',
                border: 'none',
                borderRadius: '8px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#2980b9';
                  (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  (e.target as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(52, 152, 219, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#3498db';
                  (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                  (e.target as HTMLButtonElement).style.boxShadow = 'none';
                }
              }}
            >
              {isSubmitting ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Cadastrando...
                </>
              ) : (
                isEditMode ? "Atualizar Galeria" : "Cadastrar Galeria"
              )}
            </button>
          </form>
        </div>
      </div>
      </DivCenter>
      </BodyDashboard>        
      <Footer>
        &copy; Todos os direitos reservados
      </Footer>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
    
    // Buscar municípios
    const municipiosResponse = await apiClient.get("/getMunicipios");
    const municipios = municipiosResponse.data;

    // Buscar eixos
    const eixosResponse = await apiClient.get("/getEixos");
    const eixos = eixosResponse.data;

    return {
      props: {
        galeria: [],
        mes: [],
        ano: [],
        municipios: municipios || [],
        eixos: eixos || [],
      },
    };
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    return {
      props: {
        galeria: [],
        mes: [],
        ano: [],
        municipios: [],
        eixos: [],
      },
    };
  }
};
