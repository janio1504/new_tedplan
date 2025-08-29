import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { toast } from "react-toastify";
import { Footer } from "../styles/dashboard";
import { getAPIClient } from "../services/axios";
import { useForm } from "react-hook-form";
import MenuSuperior from "../components/head";
import { useRouter } from "next/router";

interface INorma {
  id_norma: string;
  titulo: string;
  descricao: string;
  id_eixo: string;
  id_tipo_norma: string;
  id_escala: string;
  tipo_norma: string;
  imagem: File;
  arquivo: File;
}

interface IEixo {
  id_eixo: string;
  nome: string;
}

interface IEscala {
  id_escala: string;
  nome: string;
}

interface ITipoNorma {
  id_tipo_norma: string;
  nome: string;
}

interface NormaProps {
  normas: {
    total: string;
    perPage: number;
    page: number;
    lastPage: number;
    data: Array<{
      id_norma: number;
      titulo: string;
      escala: string;
      eixo: string;
      tipo_norma: string;
      id_imagem: number;
      id_arquivo: number;
    }>;
  };
  eixos: IEixo[];
  escalas: IEscala[];
  tipoNorma: ITipoNorma[];
}

export default function AddNorma({
  eixos,
  normas,
  escalas,
  tipoNorma,
}: NormaProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      titulo: "",
      id_tipo_norma: "",
      id_eixo: "",
      id_escala: "",
      imagem: null,
      arquivo: null,
    },
  });

  const [imagem, setImagem] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const normaSelecionada = normas.data.find(
        (norma) => norma.id_norma === parseInt(id as string)
      );

      if (normaSelecionada) {
        setValue("titulo", normaSelecionada.titulo);
        setValue("id_tipo_norma", normaSelecionada.tipo_norma);
        setValue("id_eixo", normaSelecionada.eixo);
        setValue("id_escala", normaSelecionada.escala);
      }
    }
  }, [id, normas.data, setValue]);

  async function handleAddNorma(data) {
    try {
      const formData = new FormData();

      formData.append("titulo", data.titulo);
      formData.append("id_tipo_norma", data.id_tipo_norma);
      formData.append("id_eixo", data.id_eixo);
      formData.append("id_escala", data.id_escala);

      if (data.imagem && data.imagem[0]) {
        formData.append("imagem", data.imagem[0]);
      }

      if (data.arquivo && data.arquivo[0]) {
        formData.append("arquivo", data.arquivo[0]);
      }

      const apiClient = getAPIClient();
      const response = await apiClient.post("addNorma", formData);

      if (response.data.success) {
        toast.success("Norma cadastrada com sucesso!", { position: "top-right", autoClose: 5000 });
        reset();
        setTimeout(() => {
          router.push("/listarNormas");
        }, 2000);
      } else {
        toast.error("Erro ao cadastrar norma!", { position: "top-right", autoClose: 5000 });
      }
    } catch (error) {
      console.error("Erro ao cadastrar norma:", error);
      toast.error("Erro ao cadastrar norma!", { position: "top-right", autoClose: 5000 });
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <MenuSuperior usuarios={[]}></MenuSuperior>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: 'calc(100vh - 200px)',
        padding: '20px'
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
              {id ? "Editar Norma" : "Cadastro de Norma"}
            </h1>
            <p style={{
              color: '#666',
              fontSize: '16px',
              margin: '0'
            }}>
              {id ? "Atualize as informações da norma" : "Preencha as informações para criar uma nova norma"}
            </p>
          </div>

          <form onSubmit={handleSubmit(handleAddNorma)} style={{
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
                placeholder="Título da norma"
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
                  Tipo de Norma *
                </label>
                <select
                  {...register("id_tipo_norma", { required: true })}
                  name="id_tipo_norma"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '16px',
                    border: errors.id_tipo_norma ? '2px solid #e74c3c' : '2px solid #e0e0e0',
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
                    (e.target as HTMLSelectElement).style.borderColor = errors.id_tipo_norma ? '#e74c3c' : '#e0e0e0';
                    (e.target as HTMLSelectElement).style.boxShadow = 'none';
                  }}
                >
                  <option value="">Selecione o tipo de norma</option>
                  {tipoNorma?.map((tipo, key) => (
                    <option key={key} value={tipo.id_tipo_norma}>
                      {tipo.nome}
                    </option>
                  ))}
                </select>
                {errors.id_tipo_norma && errors.id_tipo_norma.type === "required" && (
                  <span style={{
                    color: '#e74c3c',
                    fontSize: '14px',
                    marginTop: '5px',
                    display: 'block'
                  }}>
                    Selecionar o tipo de norma é obrigatório!
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
                  <option value="">Selecione o eixo</option>
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
                    Selecionar o eixo é obrigatório!
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
                Escala *
              </label>
              <select
                {...register("id_escala", { required: true })}
                name="id_escala"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: errors.id_escala ? '2px solid #e74c3c' : '2px solid #e0e0e0',
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
                  (e.target as HTMLSelectElement).style.borderColor = errors.id_escala ? '#e74c3c' : '#e0e0e0';
                  (e.target as HTMLSelectElement).style.boxShadow = 'none';
                }}
              >
                <option value="">Selecione a escala</option>
                {escalas?.map((escala, key) => (
                  <option key={key} value={escala.id_escala}>
                    {escala.nome}
                  </option>
                ))}
              </select>
              {errors.id_escala && errors.id_escala.type === "required" && (
                <span style={{
                  color: '#e74c3c',
                  fontSize: '14px',
                  marginTop: '5px',
                  display: 'block'
                }}>
                  Selecionar a escala é obrigatório!
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
                  Imagem (Opcional)
                </label>
                <input
                  {...register("imagem")}
                  type="file"
                  name="imagem"
                  accept="image/*"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '16px',
                    border: '2px solid #e0e0e0',
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
                    (e.target as HTMLInputElement).style.borderColor = '#e0e0e0';
                    (e.target as HTMLInputElement).style.boxShadow = 'none';
                  }}
                />
                <small style={{
                  color: '#666',
                  fontSize: '14px',
                  marginTop: '8px',
                  display: 'block',
                  lineHeight: '1.4'
                }}>
                  Aceita apenas arquivos de imagem (JPG, PNG, GIF, etc.)
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
                  Arquivo (Opcional)
                </label>
                <input
                  {...register("arquivo")}
                  type="file"
                  name="arquivo"
                  accept=".pdf,.doc,.docx"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '16px',
                    border: '2px solid #e0e0e0',
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
                    (e.target as HTMLInputElement).style.borderColor = '#e0e0e0';
                    (e.target as HTMLInputElement).style.boxShadow = 'none';
                  }}
                />
                <small style={{
                  color: '#666',
                  fontSize: '14px',
                  marginTop: '8px',
                  display: 'block',
                  lineHeight: '1.4'
                }}>
                  Aceita arquivos PDF, DOC e DOCX
                </small>
              </div>
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
                  {id ? "Atualizando..." : "Cadastrando..."}
                </>
              ) : (
                id ? "Atualizar Norma" : "Cadastrar Norma"
              )}
            </button>
          </form>
        </div>
      </div>

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
    
    // Buscar normas
    const normasResponse = await apiClient.get("/getNormas");
    const normas = normasResponse.data;

    // Buscar eixos
    const eixosResponse = await apiClient.get("/getEixos");
    const eixos = eixosResponse.data;

    // Buscar escalas
    const escalasResponse = await apiClient.get("/getEscalas");
    const escalas = escalasResponse.data;

    // Buscar tipos de norma
    const tipoNormaResponse = await apiClient.get("/getTipoNorma");
    const tipoNorma = tipoNormaResponse.data;

    return {
      props: {
        normas: normas || { total: "0", perPage: 10, page: 1, lastPage: 1, data: [] },
        eixos: eixos || [],
        escalas: escalas || [],
        tipoNorma: tipoNorma || [],
      },
    };
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    return {
      props: {
        normas: { total: "0", perPage: 10, page: 1, lastPage: 1, data: [] },
        eixos: [],
        escalas: [],
        tipoNorma: [],
      },
    };
  }
};
