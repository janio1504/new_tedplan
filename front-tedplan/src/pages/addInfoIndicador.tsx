import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useInfoIndicador } from "../contexts/InfoIndicadorContext";
import MenuSuperior from "../components/head";
import Router from "next/router";
import Sidebar from "@/components/Sidebar";
import {
  Container,
  Form,
  Footer,
  DivCenter,
  DivInstrucoes,
  MenuMunicipioItem,
  DivMenuTitulo,
} from "../styles/dashboard";
import { BodyDashboard, SubmitButton } from "../styles/dashboard-original";
import HeadIndicadores from "@/components/headIndicadores";

const codigosIndicadores = [
  "IN002",
  "IN003",
  "IN004",
  "IN005",
  "IN006",
  "IN007",
  "IN008",
  "IN009",
  "IN010",
  "IN011",
  "IN012",
  "IN013",
  "IN014",
  "IN015",
  "IN016",
  "IN017",
  "IN018",
  "IN019",
  "IN020",
  "IN021",
  "IN022",
  "IN023",
  "IN024",
  "IN025",
  "IN026",
  "IN027",
  "IN028",
  "IN029",
  "IN030",
  "IN031",
  "IN032",
  "IN033",
  "IN034",
  "IN035",
  "IN036",
  "IN037",
  "IN038",
  "IN039",
  "IN040",
  "IN041",
  "IN042",
  "IN043",
  "IN044",
  "IN045",
  "IN046",
  "IN047",
  "IN048",
  "IN049",
  "IN050",
  "IN051",
  "IN052",
  "IN053",
  "IN054",
  "IN055",
  "IN056",
  "IN057",
  "IN058",
];

export default function AddIndicador() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { id } = router.query;
  const {signOut} = useContext(AuthContext);

  const {
    createInfoIndicador,
    updateInfoIndicador,
    currentInfoIndicador,
    loadInfoIndicadores,
  } = useInfoIndicador();

  useEffect(() => {
    const loadIndicador = async () => {
      if (id) {
        try {
          const numericId = Number(id);
          const response = await currentInfoIndicador(numericId);

          const indicador = response[0];

          if (indicador) {
            setValue("nome_indicador", indicador.nome_indicador || "");
            setValue("codigo", indicador.codigo || "");
            setValue("eixo", indicador.eixo || "");
            setValue("descricao", indicador.descricao || "");
            setValue("finalidade", indicador.finalidade || "");
            setValue("limitacoes", indicador.limitacoes || "");

            if (indicador.metodo_calculo) {
              setPreviewImage(indicador.metodo_calculo);
            }
          }
        } catch (error) {
          console.error("Error loading indicator:", error);
          toast.error("Erro ao carregar dados do indicador!", { position: "top-right", autoClose: 5000 });
        }
      }
    };

    loadIndicador();
  }, [id, setValue, currentInfoIndicador]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    if (data?.metodo_calculo[0]) {
      formData.append("imagem", data?.metodo_calculo[0]);
    }
    formData.append("nome_indicador", data.nome_indicador);
    formData.append("codigo", data.codigo);
    formData.append("eixo", data.eixo);
    formData.append("descricao", data.descricao);
    formData.append("finalidade", data.finalidade);
    formData.append("limitacoes", data.limitacoes);

    try {
      if (id) {
        formData.append("id_descricao_indicador", id as string);
        await updateInfoIndicador(formData);
        toast.success("Indicador atualizado com sucesso!", { position: "top-right", autoClose: 5000 });

        loadInfoIndicadores();
      } else {
        await createInfoIndicador(formData);
        toast.success("Indicador cadastrado com sucesso!", { position: "top-right", autoClose: 5000 });
      }

      reset();
      setPreviewImage(null);
      setTimeout(() => {
        router.push("/listarInfoIndicador");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error(`Erro ao ${id ? "atualizar" : "cadastrar"} indicador!`, {
        position: "top-right",
        autoClose: 7000,
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
          <Sidebar />
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: 'calc(100vh - 200px)',
        padding: '20px',
        marginLeft: '100px',
        marginTop: '-80px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          padding: '50px',
          width: '100%',
          maxWidth: '800px',
          border: '1px solid #e0e0e0',
          marginTop: '100px',
          boxSizing: 'border-box'
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
              {id ? "Editar" : "Adicionar"} Informações de Indicador
            </h1>
            <p style={{
              color: '#666',
              fontSize: '16px',
              margin: '0'
            }}>
              {id ? "Atualize as informações do indicador" : "Preencha as informações para criar um novo indicador"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
          <div style={{ marginBottom: '0' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              Nome *
            </label>
            <input
              {...register("nome_indicador", {
                required: "O campo Nome é obrigatório!",
              })}
              type="text"
              placeholder="Nome do indicador"
              style={{
                width: '95%',
                padding: '12px 16px',
                border: `1px solid ${errors.nome ? '#e74c3c' : '#e0e0e0'}`,
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                backgroundColor: 'white'
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
            {errors.nome && (
              <span style={{
                color: '#e74c3c',
                fontSize: '12px',
                marginTop: '4px',
                display: 'block'
              }}>
                {errors.nome.message}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '0' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              Código *
            </label>
            <select
              {...register("codigo", {
                required: "O código do indicador é obrigatório!",
              })}
              style={{
                width: '95%',
                padding: '12px 16px',
                border: `1px solid ${errors.codigo ? '#e74c3c' : '#e0e0e0'}`,
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                backgroundColor: 'white'
              }}
              onFocus={(e) => {
                (e.target as HTMLSelectElement).style.borderColor = '#3498db';
                (e.target as HTMLSelectElement).style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
              }}
              onBlur={(e) => {
                (e.target as HTMLSelectElement).style.borderColor = errors.codigo ? '#e74c3c' : '#e0e0e0';
                (e.target as HTMLSelectElement).style.boxShadow = 'none';
              }}
            >
              <option value="">Selecione o código</option>
              {codigosIndicadores.map((codigo) => (
                <option key={codigo} value={codigo}>
                  {codigo}
                </option>
              ))}
            </select>
            {errors.codigo && (
              <span style={{
                color: '#e74c3c',
                fontSize: '12px',
                marginTop: '4px',
                display: 'block'
              }}>
                {errors.codigo.message}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '0' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              Eixo *
            </label>
            <select 
              {...register("eixo", { required: "O eixo é obrigatório!" })}
              style={{
                width: '95%',
                padding: '12px 16px',
                border: `1px solid ${errors.eixo ? '#e74c3c' : '#e0e0e0'}`,
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                backgroundColor: 'white'
              }}
              onFocus={(e) => {
                (e.target as HTMLSelectElement).style.borderColor = '#3498db';
                (e.target as HTMLSelectElement).style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
              }}
              onBlur={(e) => {
                (e.target as HTMLSelectElement).style.borderColor = errors.eixo ? '#e74c3c' : '#e0e0e0';
                (e.target as HTMLSelectElement).style.boxShadow = 'none';
              }}
            >
              <option value="">Selecione o eixo</option>
              <option value="agua">Água</option>
              <option value="esgoto">Esgoto</option>
              <option value="drenagem">Drenagem</option>
              <option value="residuos">Resíduos</option>
            </select>
            {errors.eixo && (
              <span style={{
                color: '#e74c3c',
                fontSize: '12px',
                marginTop: '4px',
                display: 'block'
              }}>
                {errors.eixo.message}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '0' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              Método de Cálculo (Imagem) {!id && '*'}
            </label>
            <input
              type="file"
              {...register("metodo_calculo", { required: !id })}
              accept="image/*"
              onChange={handleImageChange}
              style={{
                width: '95%',
                padding: '12px 16px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                backgroundColor: 'white',
                cursor: 'pointer'
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
            {previewImage && (
              <div style={{ marginTop: '15px', textAlign: 'center' }}>
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </div>
            )}
            {errors.metodo_calculo && (
              <span style={{
                color: '#e74c3c',
                fontSize: '12px',
                marginTop: '4px',
                display: 'block'
              }}>
                A imagem do método de cálculo é obrigatória!
              </span>
            )}
          </div>

          <div style={{ marginBottom: '0' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              Descrição *
            </label>
            <textarea
              {...register("descricao", { required: true })}
              placeholder="Descrição detalhada do indicador"
              name="descricao"
              rows={4}
              style={{
                width: '95%',
                padding: '12px 16px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                backgroundColor: 'white',
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
            {errors.descricao && (
              <span style={{
                color: '#e74c3c',
                fontSize: '12px',
                marginTop: '4px',
                display: 'block'
              }}>
                A descrição é obrigatória!
              </span>
            )}
          </div>
          <div style={{ marginBottom: '0' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              Finalidade *
            </label>
            <textarea
              {...register("finalidade", { required: true })}
              placeholder="Finalidade do indicador"
              name="finalidade"
              rows={4}
              style={{
                width: '95%',
                padding: '12px 16px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                backgroundColor: 'white',
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
            {errors.finalidade && (
              <span style={{
                color: '#e74c3c',
                fontSize: '12px',
                marginTop: '4px',
                display: 'block'
              }}>
                A finalidade é obrigatória!
              </span>
            )}
          </div>
          <div style={{ marginBottom: '0' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              Limitações *
            </label>
            <textarea
              {...register("limitacoes", { required: true })}
              placeholder="Limitações do indicador"
              name="limitacoes"
              rows={4}
              style={{
                width: '95%',
                padding: '12px 16px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                backgroundColor: 'white',
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
            {errors.limitacoes && (
              <span style={{
                color: '#e74c3c',
                fontSize: '12px',
                marginTop: '4px',
                display: 'block'
              }}>
                As limitações são obrigatórias!
              </span>
            )}
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#3498db',
              color: 'white',
              padding: '14px 24px',
              fontSize: '16px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#2980b9';
              (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
              (e.target as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(52, 152, 219, 0.3)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#3498db';
              (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
              (e.target as HTMLButtonElement).style.boxShadow = 'none';
            }}
          >
            {id ? "Atualizar Informações" : "Cadastrar Informações"}
          </button>
        </form>
      </div>
    </div>
    </BodyDashboard>      
    <Footer>
      &copy; Todos os direitos reservados
    </Footer>
  </div>
  );
}
