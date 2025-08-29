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

interface ITipoCampo {
  id_tipo_campo_indicador: string;
  name_campo: string;
  type: string;
  id_campo: string;
  enable: boolean;
  default_value: string;
}

interface TipoCampoProps {
  tipoCampo: ITipoCampo[];
}

export default function AddTipoCampoIndicador({ tipoCampo }: TipoCampoProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const [isEditing, setIsEditing] = useState(false);
  const [tipoCampoId, setTipoCampoId] = useState<string | null>(null);
  const router = useRouter();
  
  const watchType = watch("type");

  // Tipos de campo disponíveis
  const tiposCampo = [
    { value: "text", label: "Texto" },
    { value: "number", label: "Número" },
    { value: "email", label: "Email" },
    { value: "password", label: "Senha" },
    { value: "textarea", label: "Área de Texto" },
    { value: "select", label: "Lista Suspensa" },
    { value: "checkbox", label: "Caixa de Seleção" },
    { value: "radio", label: "Botão de Opção" },
    { value: "date", label: "Data" },
    { value: "datetime", label: "Data e Hora" },
    { value: "file", label: "Arquivo" },
    { value: "url", label: "URL" },
    { value: "tel", label: "Telefone" },
  ];

  useEffect(() => {
    const { ["tedplan.token"]: token } = parseCookies();
    if (!token) {
      Router.push("/login");
    }
    
    // Verificar se é edição
    if (router.query.id) {
      setIsEditing(true);
      setTipoCampoId(router.query.id as string);
      loadTipoCampoData(router.query.id as string);
    }
  }, [router.query]);

  async function loadTipoCampoData(id: string) {
    try {
      const apiClient = getAPIClient();
      const response = await apiClient.get(`/tipos-campo/${id}`);
      const tipoCampoData = response.data;
      
      // Preencher o formulário com os dados do tipo de campo
      reset({
        name_campo: tipoCampoData.name_campo,
        type: tipoCampoData.type,
        id_campo: tipoCampoData.id_campo,
        enable: tipoCampoData.enable,
        default_value: tipoCampoData.default_value,
      });
    } catch (error) {
      console.error("Erro ao carregar dados do tipo de campo:", error);
      toast.error("Erro ao carregar dados do tipo de campo!", { position: "top-right", autoClose: 5000 });
    }
  }

  async function handleAddTipoCampo(data) {
    try {
      const apiClient = getAPIClient();
      
      const tipoCampoData = {
        name_campo: data.name_campo,
        type: data.type,
        id_campo: data.id_campo,
        enable: data.enable || false,
        default_value: data.default_value || "",
      };

      if (isEditing && tipoCampoId) {
        // Atualizar tipo de campo existente
        await apiClient.put(`/tipos-campo/${tipoCampoId}`, tipoCampoData);
        toast.success("Tipo de campo atualizado com sucesso!", { position: "top-right", autoClose: 5000 });
      } else {
        // Criar novo tipo de campo
        await apiClient.post("/tipos-campo", tipoCampoData);
        toast.success("Tipo de campo cadastrado com sucesso!", { position: "top-right", autoClose: 5000 });
      }

      reset({
        name_campo: "",
        type: "",
        id_campo: "",
        enable: false,
        default_value: "",
      });

      setTimeout(() => {
        router.push("/listarTiposCampo");
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar tipo de campo:", error);
      toast.error("Erro ao salvar tipo de campo!", { position: "top-right", autoClose: 5000 });
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
          maxWidth: '600px',
          border: '1px solid #e0e0e0',
          marginTop: '100px'
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
              {isEditing ? "Editar Tipo de Campo" : "Cadastro de Tipo de Campo"}
            </h1>
            <p style={{
              color: '#666',
              fontSize: '16px',
              margin: '0'
            }}>
              {isEditing ? "Atualize as informações do tipo de campo" : "Preencha as informações para criar um novo tipo de campo"}
            </p>
          </div>

          <form onSubmit={handleSubmit(handleAddTipoCampo)} style={{
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
                Nome do Campo *
              </label>
              <input
                {...register("name_campo", { required: true })}
                type="text"
                placeholder="Nome que aparecerá no formulário"
                name="name_campo"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: errors.name_campo ? '2px solid #e74c3c' : '2px solid #e0e0e0',
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
                  (e.target as HTMLInputElement).style.borderColor = errors.name_campo ? '#e74c3c' : '#e0e0e0';
                  (e.target as HTMLInputElement).style.boxShadow = 'none';
                }}
              />
              {errors.name_campo && errors.name_campo.type === "required" && (
                <span style={{
                  color: '#e74c3c',
                  fontSize: '14px',
                  marginTop: '5px',
                  display: 'block'
                }}>
                  O campo Nome do Campo é obrigatório!
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
                Tipo de Campo *
              </label>
              <select
                {...register("type", { required: true })}
                name="type"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: errors.type ? '2px solid #e74c3c' : '2px solid #e0e0e0',
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
                  (e.target as HTMLSelectElement).style.borderColor = errors.type ? '#e74c3c' : '#e0e0e0';
                  (e.target as HTMLSelectElement).style.boxShadow = 'none';
                }}
              >
                <option value="">Selecione o tipo de campo</option>
                {tiposCampo.map((tipo, key) => (
                  <option key={key} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
              {errors.type && errors.type.type === "required" && (
                <span style={{
                  color: '#e74c3c',
                  fontSize: '14px',
                  marginTop: '5px',
                  display: 'block'
                }}>
                  Selecionar o tipo de campo é obrigatório!
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
                ID do Campo
              </label>
              <input
                {...register("id_campo")}
                type="text"
                placeholder="Identificador único do campo (opcional)"
                name="id_campo"
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
                Identificador único para o campo (opcional)
              </small>
            </div>

            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#333'
              }}>
                <input
                  {...register("enable")}
                  type="checkbox"
                  name="enable"
                  defaultChecked={true}
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: '#3498db'
                  }}
                />
                Campo ativo
              </label>
              <small style={{
                color: '#666',
                fontSize: '14px',
                marginTop: '8px',
                display: 'block',
                lineHeight: '1.4'
              }}>
                Marque esta opção para ativar o campo no formulário
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
                Valor Padrão
              </label>
              <input
                {...register("default_value")}
                type="text"
                placeholder="Valor inicial do campo (opcional)"
                name="default_value"
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
                Valor que será exibido por padrão no campo
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
                  {isEditing ? "Atualizando..." : "Salvando..."}
                </>
              ) : (
                isEditing ? "Atualizar Tipo de Campo" : "Cadastrar Tipo de Campo"
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
