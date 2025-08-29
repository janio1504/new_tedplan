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

interface IMenu {
  id_menu: string;
  titulo: string;
  descricao: string;
  id_modulo: string;
  id_eixo: string;
}

interface IEixo {
  id_eixo: string;
  nome: string;
}

interface IModulo {
  id_modulo: string;
  nome: string;
}

interface MenuProps {
  menu: IMenu[];
  eixos: IEixo[];
  modulos: IModulo[];
}

export default function AddMenu({ menu, eixos, modulos }: MenuProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [eixosData, setEixosData] = useState<any>(eixos);
  const [modulosData, setModulosData] = useState<any>(modulos);
  const [isEditing, setIsEditing] = useState(false);
  const [menuId, setMenuId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const { ["tedplan.token"]: token } = parseCookies();
    if (!token) {
      Router.push("/login");
    }
    getEixos();
    getModulos();
    
    // Verificar se é edição
    if (router.query.id) {
      setIsEditing(true);
      setMenuId(router.query.id as string);
      loadMenuData(router.query.id as string);
    }
  }, [router.query]);

  async function getEixos() {
    try {
      const apiClient = getAPIClient();
      const resEixo = await apiClient.get("/getEixos");
      setEixosData(resEixo.data);
    } catch (error) {
      console.error("Erro ao carregar eixos:", error);
    }
  }

  async function getModulos() {
    try {
      const apiClient = getAPIClient();
      // Assumindo que existe uma rota para módulos, caso contrário podemos usar dados estáticos
      // const resModulo = await apiClient.get("/getModulos");
      // setModulosData(resModulo.data);
      
      // Dados estáticos temporários até criar a API de módulos
      setModulosData([
        { id_modulo: 1, nome: "Gestão" },
        { id_modulo: 2, nome: "Indicadores" },
        { id_modulo: 3, nome: "Cadastros" },
        { id_modulo: 4, nome: "Relatórios" },
      ]);
    } catch (error) {
      console.error("Erro ao carregar módulos:", error);
    }
  }

  async function loadMenuData(id: string) {
    try {
      const apiClient = getAPIClient();
      const response = await apiClient.get(`/menus/${id}`);
      const menuData = response.data;
      
      // Preencher o formulário com os dados do menu
      reset({
        titulo: menuData.titulo,
        descricao: menuData.descricao,
        id_modulo: menuData.id_modulo,
        id_eixo: menuData.id_eixo,
      });
    } catch (error) {
      console.error("Erro ao carregar dados do menu:", error);
      toast.error("Erro ao carregar dados do menu!", { position: "top-right", autoClose: 5000 });
    }
  }

  async function handleAddMenu({
    titulo,
    descricao,
    id_modulo,
    id_eixo,
  }) {
    try {
      const apiClient = getAPIClient();
      
      const menuData = {
        titulo,
        descricao,
        id_modulo: parseInt(id_modulo),
        id_eixo: parseInt(id_eixo),
      };

      if (isEditing && menuId) {
        // Atualizar menu existente
        await apiClient.put(`/menus/${menuId}`, menuData);
        toast.success("Menu atualizado com sucesso!", { position: "top-right", autoClose: 5000 });
      } else {
        // Criar novo menu
        await apiClient.post("/menus", menuData);
        toast.success("Menu cadastrado com sucesso!", { position: "top-right", autoClose: 5000 });
      }

      reset({
        titulo: "",
        descricao: "",
        id_modulo: "",
        id_eixo: "",
      });

      setTimeout(() => {
        router.push("/listarMenus");
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar menu:", error);
      toast.error("Erro ao salvar menu!", { position: "top-right", autoClose: 5000 });
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
              {isEditing ? "Editar Menu" : "Cadastro de Menu"}
            </h1>
            <p style={{
              color: '#666',
              fontSize: '16px',
              margin: '0'
            }}>
              {isEditing ? "Atualize as informações do menu" : "Preencha as informações para criar um novo menu"}
            </p>
          </div>

          <form onSubmit={handleSubmit(handleAddMenu)} style={{
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
                placeholder="Título do menu"
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

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#333'
              }}>
                Descrição *
              </label>
              <textarea
                {...register("descricao", { required: true })}
                placeholder="Descrição do menu"
                name="descricao"
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: errors.descricao ? '2px solid #e74c3c' : '2px solid #e0e0e0',
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
                  (e.target as HTMLTextAreaElement).style.borderColor = errors.descricao ? '#e74c3c' : '#e0e0e0';
                  (e.target as HTMLTextAreaElement).style.boxShadow = 'none';
                }}
              />
              {errors.descricao && errors.descricao.type === "required" && (
                <span style={{
                  color: '#e74c3c',
                  fontSize: '14px',
                  marginTop: '5px',
                  display: 'block'
                }}>
                  O campo Descrição é obrigatório!
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
                Módulo *
              </label>
              <select
                {...register("id_modulo", { required: true })}
                name="id_modulo"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: errors.id_modulo ? '2px solid #e74c3c' : '2px solid #e0e0e0',
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
                  (e.target as HTMLSelectElement).style.borderColor = errors.id_modulo ? '#e74c3c' : '#e0e0e0';
                  (e.target as HTMLSelectElement).style.boxShadow = 'none';
                }}
              >
                <option value="">Selecione um módulo</option>
                {modulosData?.map((modulo, key) => (
                  <option key={key} value={modulo.id_modulo}>
                    {modulo.nome}
                  </option>
                ))}
              </select>
              {errors.id_modulo && errors.id_modulo.type === "required" && (
                <span style={{
                  color: '#e74c3c',
                  fontSize: '14px',
                  marginTop: '5px',
                  display: 'block'
                }}>
                  Selecionar um módulo é obrigatório!
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
                {eixosData?.map((eixo, key) => (
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
                isEditing ? "Atualizar Menu" : "Cadastrar Menu"
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