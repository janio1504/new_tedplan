import { useRouter } from "next/router";
import React, { useEffect, useState, useContext } from "react";
import { parseCookies } from "nookies";
import { AuthContext } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import Sidebar from "@/components/Sidebar";
import {
  Container,
  Form,
  Footer,
  DivCenter,
  DivMenuTitulo,
  MenuMunicipioItem,
} from "../../styles/dashboard";
import { BodyDashboard, SubmitButton } from "../../styles/dashboard-original";
import { getAPIClient } from "../../services/axios";
import { useForm } from "react-hook-form";
import Router from "next/router";
import HeadIndicadores from "@/components/headIndicadores";

interface IEixo {
  id_eixo: string;
  nome: string;
}

interface ITipoUnidade {
  id_tipo_unidade: string;
  nome_tipo_unidade: string;
  id_eixo?: string;
}

export default function EditarTipoUnidade() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [eixos, setEixos] = useState<IEixo[]>([]);
  const [tipoUnidadeId, setTipoUnidadeId] = useState<string | null>(null);
  const router = useRouter();
  const { signOut } = useContext(AuthContext);

  useEffect(() => {
    const { ["tedplan.token"]: token } = parseCookies();
    if (!token) {
      Router.push("/login");
    }
    getEixos();

    // Verificar se é edição
    if (router.query.id) {
      setTipoUnidadeId(router.query.id as string);
      loadTipoUnidadeData(router.query.id as string);
    }
  }, [router.query]);

  async function getEixos() {
    try {
      const apiClient = getAPIClient();
      const resEixo = await apiClient.get("/getEixos");
      setEixos(resEixo.data);
    } catch (error) {
      console.error("Erro ao carregar eixos:", error);
    }
  }

  async function loadTipoUnidadeData(id: string) {
    try {
      const apiClient = getAPIClient();
      const response = await apiClient.get(`/tipo-unidade/${id}`);
      const tipoUnidade = response.data;

      reset({
        nome_tipo_unidade: tipoUnidade.nome_tipo_unidade,
        id_eixo: tipoUnidade.id_eixo?.toString() || "",
      });
    } catch (error) {
      console.error("Erro ao carregar dados do tipo de unidade:", error);
      toast.error("Erro ao carregar dados do tipo de unidade!", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }

  async function handleUpdateTipoUnidade({ nome_tipo_unidade, id_eixo }) {
    if (!tipoUnidadeId) return;

    try {
      const apiClient = getAPIClient();

      const tipoUnidadeData = {
        nome_tipo_unidade,
        id_eixo: id_eixo ? parseInt(id_eixo) : null,
      };

      await apiClient.put(`/tipo-unidade/${tipoUnidadeId}`, tipoUnidadeData);

      toast.success("Tipo de unidade atualizado com sucesso!", {
        position: "top-right",
        autoClose: 5000,
      });

      setTimeout(() => {
        router.push("/tipoUnidade/listar");
      }, 2000);
    } catch (error) {
      console.error("Erro ao atualizar tipo de unidade:", error);
      toast.error("Erro ao atualizar tipo de unidade!", {
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

  function handleVoltar() {
    Router.push("/tipoUnidade/listar");
  }

  return (
    <div
      style={{
        maxHeight: "100vh",
        backgroundColor: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <HeadIndicadores usuarios={[]} />
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
        <ul>
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
                  Editar Tipo de Unidade
                </h1>
                <p
                  style={{
                    color: "#666",
                    fontSize: "16px",
                    margin: "0",
                  }}
                >
                  Atualize as informações do tipo de unidade
                </p>
              </div>

              <form
                onSubmit={handleSubmit(handleUpdateTipoUnidade)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                <div style={{ marginBottom: "0" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#333",
                      fontSize: "14px",
                    }}
                  >
                    Nome do Tipo de Unidade *
                  </label>
                  <input
                    aria-invalid={errors.nome_tipo_unidade ? "true" : "false"}
                    {...register("nome_tipo_unidade", { required: true })}
                    type="text"
                    placeholder="Nome do tipo de unidade (ex: ETA, ETE, Poço)"
                    name="nome_tipo_unidade"
                    style={{
                      width: "95%",
                      padding: "12px 16px",
                      border: `1px solid ${
                        errors.nome_tipo_unidade ? "#e74c3c" : "#e0e0e0"
                      }`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      transition: "all 0.3s ease",
                      backgroundColor: "white",
                    }}
                    onFocus={(e) => {
                      (e.target as HTMLInputElement).style.borderColor =
                        "#3498db";
                      (e.target as HTMLInputElement).style.boxShadow =
                        "0 0 0 3px rgba(52, 152, 219, 0.1)";
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLInputElement).style.borderColor =
                        errors.nome_tipo_unidade ? "#e74c3c" : "#e0e0e0";
                      (e.target as HTMLInputElement).style.boxShadow = "none";
                    }}
                  />
                  {errors.nome_tipo_unidade &&
                    errors.nome_tipo_unidade.type === "required" && (
                      <span
                        style={{
                          color: "#e74c3c",
                          fontSize: "12px",
                          marginTop: "4px",
                          display: "block",
                        }}
                      >
                        O campo Nome do Tipo de Unidade é obrigatório!
                      </span>
                    )}
                </div>

                <div style={{ marginBottom: "0" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#333",
                      fontSize: "14px",
                    }}
                  >
                    Eixo
                  </label>
                  <select
                    {...register("id_eixo")}
                    name="id_eixo"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      fontSize: "14px",
                      transition: "all 0.3s ease",
                      backgroundColor: "white",
                    }}
                    onFocus={(e) => {
                      (e.target as HTMLSelectElement).style.borderColor =
                        "#3498db";
                      (e.target as HTMLSelectElement).style.boxShadow =
                        "0 0 0 3px rgba(52, 152, 219, 0.1)";
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLSelectElement).style.borderColor =
                        "#e0e0e0";
                      (e.target as HTMLSelectElement).style.boxShadow = "none";
                    }}
                  >
                    <option value="">Selecione um eixo (opcional)</option>
                    {eixos?.map((eixo, key) => (
                      <option key={key} value={eixo.id_eixo}>
                        {eixo.nome}
                      </option>
                    ))}
                  </select>
                  <small
                    style={{
                      color: "#666",
                      fontSize: "12px",
                      marginTop: "8px",
                      display: "block",
                      lineHeight: "1.4",
                    }}
                  >
                    Associe este tipo de unidade a um eixo específico
                  </small>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    type="button"
                    onClick={handleVoltar}
                    style={{
                      backgroundColor: "#6c757d",
                      color: "white",
                      padding: "14px 24px",
                      fontSize: "16px",
                      fontWeight: "600",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLButtonElement).style.backgroundColor =
                        "#5a6268";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLButtonElement).style.backgroundColor =
                        "#6c757d";
                    }}
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: "#3498db",
                      color: "white",
                      padding: "14px 24px",
                      fontSize: "16px",
                      fontWeight: "600",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLButtonElement).style.backgroundColor =
                        "#2980b9";
                      (e.target as HTMLButtonElement).style.transform =
                        "translateY(-2px)";
                      (e.target as HTMLButtonElement).style.boxShadow =
                        "0 6px 20px rgba(52, 152, 219, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLButtonElement).style.backgroundColor =
                        "#3498db";
                      (e.target as HTMLButtonElement).style.transform =
                        "translateY(0)";
                      (e.target as HTMLButtonElement).style.boxShadow = "none";
                    }}
                  >
                    Atualizar Tipo de Unidade
                  </button>
                </div>
              </form>
            </div>
          </div>
        </DivCenter>
      </BodyDashboard>
      <Footer>&copy; Todos os direitos reservados</Footer>
    </div>
  );
}
