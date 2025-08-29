import {} from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { toast } from "react-toastify";

import { Footer } from "../styles/dashboard";
import { getAPIClient } from "../services/axios";
import { useForm } from "react-hook-form";
import MenuSuperior from "../components/head";
import Router from "next/router";
import api from "../services/api";

interface IUsuario {
  id_usuario: string;
  login: string;
  senha: string;
  nome: string;
  email: string;
  telefone: string;
  curriculo_lattes: string;
}

interface IMunicipio {
  id_municipio: string;
  nome: string;
}

interface UsuarioProps {
  usuario: IUsuario[];
  municipio: IMunicipio[];
}

export default function AddUsuario({ usuario, municipio }: UsuarioProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [municipios, setMunicipios] = useState<any>(municipio);
  const [permissoes, setPermissoes] = useState<any>(null);
  const [visibleMunicipiosSistemas, setVisibleMunicipiosSistemas] =
    useState(false);
  const router = useRouter();

  useEffect(() => {
    const { ["tedplan.token"]: token } = parseCookies();
    if (!token) {
      Router.push("/login");
    }
    getMunicipios();
    getPermissoes();
  }, [municipio]);

  async function getMunicipios() {
    const apiClient = getAPIClient();
    const res = new Promise(async (resolve) => {});
    const resMunicipio = await apiClient
      .get("/getMunicipios")
      .then((response) => {
        return response.data;
      });
    setMunicipios(resMunicipio);
  }

  async function getPermissoes() {
    const permissoes = await api.get("/get-permissoes").then((response) => {
      return response.data;
    });
    setPermissoes(permissoes);
  }

  async function handleAddUsuario({
    nome,
    login,
    senha,
    email,
    curriculo_lattes,
    id_sistema,
    id_municipio,
  }) {
    try {
      const formData = new FormData();

      const apiClient = getAPIClient();
      const response = await apiClient
        .post("addUsuario", {
          nome,
          login,
          senha,
          email,
          curriculo_lattes,
          id_sistema,
          id_municipio,
        })
        .then((response) => {
          return response.data;
        });

      if (response.success) {
        toast.success("Usuário cadastrado com sucesso!", { position: "top-right", autoClose: 5000 });
        reset({
          nome: "",
          login: "",
          senha: "",
          email: "",
          curriculo_lattes: "",
          id_sistema: "",
          id_municipio: "",
        });
        setTimeout(() => {
          router.push("/listarUsuarios");
        }, 2000);
      } else {
        toast.error("Erro ao cadastrar usuário!", { position: "top-right", autoClose: 5000 });
      }
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      toast.error("Erro ao cadastrar usuário!", { position: "top-right", autoClose: 5000 });
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
        alignItems: 'center',
        minHeight: 'calc(100vh - 200px)',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          padding: '40px',
          width: '100%',
          maxWidth: '500px',
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
              Cadastro de Usuário
            </h1>
            <p style={{
              color: '#666',
              fontSize: '16px',
              margin: '0'
            }}>
              Preencha as informações para criar um novo usuário
            </p>
          </div>

          <form onSubmit={handleSubmit(handleAddUsuario)} style={{
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
                Nome *
              </label>
              <input
                {...register("nome", { required: true })}
                type="text"
                placeholder="Nome completo do usuário"
                name="nome"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: errors.nome ? '2px solid #e74c3c' : '2px solid #e0e0e0',
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
                  (e.target as HTMLInputElement).style.borderColor = errors.nome ? '#e74c3c' : '#e0e0e0';
                  (e.target as HTMLInputElement).style.boxShadow = 'none';
                }}
              />
              {errors.nome && errors.nome.type === "required" && (
                <span style={{
                  color: '#e74c3c',
                  fontSize: '14px',
                  marginTop: '5px',
                  display: 'block'
                }}>
                  O campo Nome é obrigatório!
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
                Login *
              </label>
              <input
                {...register("login", { required: true })}
                type="text"
                placeholder="Nome de usuário para login"
                name="login"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: errors.login ? '2px solid #e74c3c' : '2px solid #e0e0e0',
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
                  (e.target as HTMLInputElement).style.borderColor = errors.login ? '#e74c3c' : '#e0e0e0';
                  (e.target as HTMLInputElement).style.boxShadow = 'none';
                }}
              />
              {errors.login && errors.login.type === "required" && (
                <span style={{
                  color: '#e74c3c',
                  fontSize: '14px',
                  marginTop: '5px',
                  display: 'block'
                }}>
                  O campo Login é obrigatório!
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
                Senha *
              </label>
              <input
                {...register("senha", { required: true })}
                type="password"
                placeholder="Senha do usuário"
                name="senha"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: errors.senha ? '2px solid #e74c3c' : '2px solid #e0e0e0',
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
                  (e.target as HTMLInputElement).style.borderColor = errors.senha ? '#e74c3c' : '#e0e0e0';
                  (e.target as HTMLInputElement).style.boxShadow = 'none';
                }}
              />
              {errors.senha && errors.senha.type === "required" && (
                <span style={{
                  color: '#e74c3c',
                  fontSize: '14px',
                  marginTop: '5px',
                  display: 'block'
                }}>
                  O campo Senha é obrigatório!
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
                Email *
              </label>
              <input
                {...register("email", { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
                type="email"
                placeholder="email@exemplo.com"
                name="email"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: errors.email ? '2px solid #e74c3c' : '2px solid #e0e0e0',
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
                  (e.target as HTMLInputElement).style.borderColor = errors.email ? '#e74c3c' : '#e0e0e0';
                  (e.target as HTMLInputElement).style.boxShadow = 'none';
                }}
              />
              {errors.email && errors.email.type === "required" && (
                <span style={{
                  color: '#e74c3c',
                  fontSize: '14px',
                  marginTop: '5px',
                  display: 'block'
                }}>
                  O campo Email é obrigatório!
                </span>
              )}
              {errors.email && errors.email.type === "pattern" && (
                <span style={{
                  color: '#e74c3c',
                  fontSize: '14px',
                  marginTop: '5px',
                  display: 'block'
                }}>
                  Digite um email válido!
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
                Currículo Lattes
              </label>
              <input
                {...register("curriculo_lattes")}
                type="url"
                placeholder="URL do currículo Lattes (opcional)"
                name="curriculo_lattes"
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
                Link para o currículo Lattes (opcional)
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
                Sistema *
              </label>
              <select
                {...register("id_sistema", { required: true })}
                name="id_sistema"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: errors.id_sistema ? '2px solid #e74c3c' : '2px solid #e0e0e0',
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
                  (e.target as HTMLSelectElement).style.borderColor = errors.id_sistema ? '#e74c3c' : '#e0e0e0';
                  (e.target as HTMLSelectElement).style.boxShadow = 'none';
                }}
              >
                <option value="">Selecione um sistema</option>
                <option value="1">Sistema 1</option>
                <option value="2">Sistema 2</option>
              </select>
              {errors.id_sistema && errors.id_sistema.type === "required" && (
                <span style={{
                  color: '#e74c3c',
                  fontSize: '14px',
                  marginTop: '5px',
                  display: 'block'
                }}>
                  Selecionar um sistema é obrigatório!
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
                "Cadastrar Usuário"
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
