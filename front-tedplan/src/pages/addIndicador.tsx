import {} from "next";
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
  DivInstrucoes,
  MenuMunicipioItem,
  DivMenuTitulo,
} from "../styles/dashboard";

import { BodyDashboard, SubmitButton } from "../styles/dashboard-original";

import { getAPIClient } from "../services/axios";
import { useForm } from "react-hook-form";
import MenuSuperior from "../components/head";
import Router from "next/router";
import api from "@/services/api";
import HeadIndicadores from "@/components/headIndicadores";

interface IIndicador {
  id_indicador: string;
  codigo_indicador: string;
  nome_indicador: string;
  grupo_indicador: string;
  palavra_chave: string;
  unidade_indicador: string;
  formula_calculo_indicador: string;
  informacoes_indicador: string;
  indicador_correspondente_ou_similar_snis: string;
  id_menu_item: string;
}

interface IMenuItem {
  id_menu_item: string;
  nome_menu_item: string;
  menu: {
    titulo: string;
  };
}

interface ITipoCampoIndicador {
  id_tipo_campo_indicador?: string;
  type: string;
  name_campo: string;
  id_indicador?: string;
  enable: boolean;
  default_value: string;
}

interface ISelectOption {
  id_select_option?: string;
  value: string;
  descricao: string;
  ordem_option: number;
  id_tipo_campo_indicador?: string;
  tempId?: string; // Para gerenciar opções antes de salvar
}

interface ICheckBoxItem {
  id_item_check_box?: string;
  descricao: string;
  valor: boolean; // Mudando de string para boolean
  id_indicador?: string;
  tempId?: string; // Para gerenciar itens antes de salvar
}

interface IndicadorProps {
  indicador: IIndicador[];
  menuItems: IMenuItem[];
}

export default function AddIndicador({ indicador, menuItems }: IndicadorProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const [menuItemsData, setMenuItemsData] = useState<any>(menuItems);
  const [isEditing, setIsEditing] = useState(false);
  const [indicadorId, setIndicadorId] = useState<string | null>(null);
  const [tipoCampoIndicador, setTipoCampoIndicador] = useState<ITipoCampoIndicador | null>(null);
  const [selectOptions, setSelectOptions] = useState<ISelectOption[]>([]);
  const [newOption, setNewOption] = useState<ISelectOption>({
    value: "",
    descricao: "",
    ordem_option: 1
  });
  const [checkBoxItems, setCheckBoxItems] = useState<ICheckBoxItem[]>([]);
  const [newCheckBoxItem, setNewCheckBoxItem] = useState<ICheckBoxItem>({
    descricao: "",
    valor: false
  });
  const router = useRouter();
  const {signOut} = useContext(AuthContext);
  // Observar o campo tipo para mostrar/ocultar opções de select
  const tipoCampoSelecionado = watch("tipo_campo");

  // Tipos de campo disponíveis
  const tiposCampo = [
    { value: "text", label: "Texto" },
    { value: "number", label: "Número" },
    { value: "email", label: "Email" },
    { value: "password", label: "Senha" },
    { value: "textarea", label: "Área de Texto" },
    { value: "select", label: "Seleção (Dropdown)" },
    { value: "checkbox", label: "Caixa de Seleção" },
    { value: "radio", label: "Botões de Opção" },
    { value: "date", label: "Data" },
    { value: "file", label: "Arquivo" },
  ];

  // Grupos de indicadores predefinidos
  const gruposIndicador = [
    "Água",
    "Esgoto",
    "Resíduos Sólidos",
    "Drenagem",
    "Gestão",
    "Financeiro",
    "Qualidade",
    "Operacional",
    "Ambiental",
    "Social",
  ];

  useEffect(() => {
    const { ["tedplan.token"]: token } = parseCookies();
    if (!token) {
      Router.push("/login");
    }
    getMenuItems();
    
    // Verificar se é edição
    if (router.query.id) {
      setIsEditing(true);
      setIndicadorId(router.query.id as string);
      loadIndicadorData(router.query.id as string);
    }
  }, [router.query]);

  async function getMenuItems() {
    try {
      const apiClient = getAPIClient();
      const resMenuItems = await apiClient.get("/menu-items");
      setMenuItemsData(resMenuItems.data);
    } catch (error) {
      console.error("Erro ao carregar itens de menu:", error);
    }
  }

  async function loadIndicadorData(id: string) {
    try {
      const apiClient = getAPIClient();
      const response = await apiClient.get(`/indicadores-novo/${id}`);
      const indicador = response.data;

      // Preencher o formulário com os dados do indicador
      reset({
        codigo_indicador: indicador.codigo_indicador,
        nome_indicador: indicador.nome_indicador,
        grupo_indicador: indicador.grupo_indicador,
        palavra_chave: indicador.palavra_chave,
        unidade_indicador: indicador.unidade_indicador,
        formula_calculo_indicador: indicador.formula_calculo_indicador,
        informacoes_indicador: indicador.informacoes_indicador,
        indicador_correspondente_ou_similar_snis: indicador.indicador_correspondente_ou_similar_snis,
        id_menu_item: indicador.id_menu_item?.toString(),
      });

      setIndicadorId(id);
      setIsEditing(true);

      // Carregar tipo de campo e suas opções
      await loadTipoCampoIndicador(id);
      await loadCheckBoxItems(id);
    } catch (error) {
      console.error("Erro ao carregar dados do indicador:", error);
      toast.error("Erro ao carregar dados do indicador!", { position: "top-right", autoClose: 5000 });
    }
  }

  async function loadTipoCampoIndicador(indicadorId: string) {
    try {
      const apiClient = getAPIClient();
      const response = await apiClient.get(`/tipos-campo/indicador/${indicadorId}`);
      const tiposCampo = response.data || [];
      
      if (tiposCampo.length > 0) {
        const tipoCampo = tiposCampo[0]; // Pegar apenas o primeiro (único campo)
        setTipoCampoIndicador(tipoCampo);
        
        // Preencher os campos do formulário com dados do tipo de campo
        reset(prevData => ({
          ...prevData,
          tipo_campo: tipoCampo.type,
          nome_campo: tipoCampo.name_campo,
          campo_ativo: tipoCampo.enable,
          valor_padrao: tipoCampo.default_value,
        }));

        // Se for tipo select, carregar suas opções
        if (tipoCampo.type === "select") {
          await loadSelectOptions(tipoCampo.id_tipo_campo_indicador);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar tipo de campo do indicador:", error);
    }
  }

  async function loadSelectOptions(tipoCampoId: string) {
    try {
      const apiClient = getAPIClient();
      const response = await apiClient.get(`/select-options/tipo-campo/${tipoCampoId}`);
      setSelectOptions(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar opções do select:", error);
    }
  }

  function addSelectOption() {
    if (!newOption.value.trim() || !newOption.descricao.trim()) {
      toast.warning("Preencha valor e descrição da opção!", { position: "top-right", autoClose: 5000 });
      return;
    }

    const option: ISelectOption = {
      ...newOption,
      ordem_option: selectOptions.length + 1,
      tempId: Date.now().toString(), // ID temporário
    };

    setSelectOptions([...selectOptions, option]);
    setNewOption({ value: "", descricao: "", ordem_option: 1 });
  }

  function removeSelectOption(index: number) {
    const updatedOptions = selectOptions.filter((_, i) => i !== index);
    // Reordenar as opções
    const reorderedOptions = updatedOptions.map((option, i) => ({
      ...option,
      ordem_option: i + 1
    }));
    setSelectOptions(reorderedOptions);
  }

  function moveOptionUp(index: number) {
    if (index === 0) return;
    const newOptions = [...selectOptions];
    [newOptions[index], newOptions[index - 1]] = [newOptions[index - 1], newOptions[index]];
    // Atualizar ordem
    newOptions.forEach((option, i) => {
      option.ordem_option = i + 1;
    });
    setSelectOptions(newOptions);
  }

  function moveOptionDown(index: number) {
    if (index === selectOptions.length - 1) return;
    const newOptions = [...selectOptions];
    [newOptions[index], newOptions[index + 1]] = [newOptions[index + 1], newOptions[index]];
    // Atualizar ordem
    newOptions.forEach((option, i) => {
      option.ordem_option = i + 1;
    });
    setSelectOptions(newOptions);
  }

  function addCheckBoxItem() {
    if (!newCheckBoxItem.descricao.trim()) {
      toast.warning("Preencha descrição do item!", { position: "top-right", autoClose: 5000 });
      return;
    }

    const item: ICheckBoxItem = {
      ...newCheckBoxItem,
      valor: false, // Para checkbox, o valor será false quando marcado
      tempId: Date.now().toString(), // ID temporário
    };

    setCheckBoxItems([...checkBoxItems, item]);
    setNewCheckBoxItem({ descricao: "", valor: false });
  }

  function removeCheckBoxItem(index: number) {
    const updatedItems = checkBoxItems.filter((_, i) => i !== index);
    setCheckBoxItems(updatedItems);
  }

  function moveCheckBoxItemUp(index: number) {
    if (index === 0) return;
    const newItems = [...checkBoxItems];
    [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
    setCheckBoxItems(newItems);
  }

  function moveCheckBoxItemDown(index: number) {
    if (index === checkBoxItems.length - 1) return;
    const newItems = [...checkBoxItems];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    setCheckBoxItems(newItems);
  }

  async function handleAddIndicador({
    codigo_indicador,
    nome_indicador,
    grupo_indicador,
    palavra_chave,
    unidade_indicador,
    formula_calculo_indicador,
    informacoes_indicador,
    indicador_correspondente_ou_similar_snis,
    id_menu_item,
    tipo_campo,
    nome_campo,
    campo_ativo,
    valor_padrao,
  }) {
    
    try {
      const apiClient = getAPIClient();
      
      const indicadorData = {
        codigo_indicador,
        nome_indicador,
        grupo_indicador: grupo_indicador || null,
        palavra_chave: palavra_chave || null,
        unidade_indicador: unidade_indicador || null,
        formula_calculo_indicador: formula_calculo_indicador || null,
        informacoes_indicador: informacoes_indicador || null,
        indicador_correspondente_ou_similar_snis: indicador_correspondente_ou_similar_snis || null,
        id_menu_item: id_menu_item ? parseInt(id_menu_item) : null,
      };

      let indicadorResponse;

      if (isEditing && indicadorId) {
        // Atualizar indicador existente
        indicadorResponse = await apiClient.put(`/indicadores-novo/${indicadorId}`, indicadorData);
        
        // Remover tipo de campo existente
        await apiClient.delete(`/tipos-campo/indicador/${indicadorId}`);
        
        // Remover itens de checkbox existentes
        try {
          await apiClient.delete(`/item-check-box/indicador/${indicadorId}`);
        } catch (error) {
          console.error("Erro ao deletar itens de checkbox:", error);
          console.error("Detalhes do erro:", error.response?.data);
          // Não vamos falhar o processo por causa deste erro
        }
        
        toast.success("Indicador atualizado com sucesso!", { position: "top-right", autoClose: 5000 });
      } else {
        // Criar novo indicador
        indicadorResponse = await apiClient.post("/indicadores-novo", indicadorData);
        toast.success("Indicador cadastrado com sucesso!", { position: "top-right", autoClose: 5000 });
      }

      const indicadorIdToUse = isEditing ? indicadorId : indicadorResponse.data.id_indicador;
      
      // Salvar tipo de campo e suas opções
      if (tipo_campo && nome_campo) {
        await saveTipoCampoIndicador(indicadorIdToUse, {
          type: tipo_campo,
          name_campo: nome_campo,
          enable: campo_ativo || false,
          default_value: valor_padrao || "",
        });
      }

      reset({
        codigo_indicador: "",
        nome_indicador: "",
        grupo_indicador: "",
        palavra_chave: "",
        unidade_indicador: "",
        formula_calculo_indicador: "",
        informacoes_indicador: "",
        indicador_correspondente_ou_similar_snis: "",
        id_menu_item: "",
        tipo_campo: "",
        nome_campo: "",
        campo_ativo: true,
        valor_padrao: "",
      });

      setSelectOptions([]);
      setTipoCampoIndicador(null);

      setTimeout(() => {
        router.push("/listarIndicadores");
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar indicador:", error);
      toast.error("Erro ao salvar indicador!", { position: "top-right", autoClose: 5000 });
    }
  }

  async function saveTipoCampoIndicador(indicadorId: string, tipoCampoData: any) {
    try {
      const apiClient = getAPIClient();

      // Salvar tipo de campo
      const tipoCampoCompleto = {
        ...tipoCampoData,
        id_indicador: indicadorId,
      };

      const tipoCampoResponse = await apiClient.post("/tipos-campo", tipoCampoCompleto);
      const tipoCampoId = tipoCampoResponse.data.id_tipo_campo_indicador;
      // Se for tipo select, salvar suas opções
      if (tipoCampoData.type === "select" && selectOptions.length > 0) {
        for (const option of selectOptions) {
          await apiClient.post("/select-options", {
            value: option.value,
            descricao: option.descricao,
            ordem_option: option.ordem_option,
            id_tipo_campo_indicador: tipoCampoId,
          });
        }
      }

      // Se for tipo checkbox, salvar seus itens
      if (tipoCampoData.type === "checkbox" && checkBoxItems.length > 0) {
        for (const item of checkBoxItems) {
          console.log("item", item);
          console.log("checkBoxItems", checkBoxItems);
          try {
            const response = await apiClient.post("/item-check-box", {
              descricao: item.descricao,
              valor: item.valor,
              id_indicador: indicadorId,
            });
          } catch (itemError) {
            console.error("Erro ao salvar item específico:", itemError);
            console.error("Detalhes do erro:", itemError.response?.data);
            throw itemError;
          }
        }
      }
    } catch (error) {
      console.error("Erro ao salvar tipo de campo:", error);
      toast.error("Erro ao salvar tipo de campo!", { position: "top-right", autoClose: 5000 });
    }
  }

  // Limpar opções quando mudar o tipo de campo
  useEffect(() => {
    if (tipoCampoSelecionado !== "select") {
      setSelectOptions([]);
    }
    if (tipoCampoSelecionado !== "checkbox") {
      setCheckBoxItems([]);
    }
  }, [tipoCampoSelecionado]);

  async function loadCheckBoxItems(indicadorId: string) {
    try {
      const apiClient = getAPIClient();
      const response = await apiClient.get(`/item-check-box/indicador/${indicadorId}`);
      setCheckBoxItems(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar itens de checkbox:", error);
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
      maxHeight: '100vh',
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
        height: 'calc(100vh - 200px)',
        marginLeft: '100px',
        padding: '20px',
        marginTop: '-70px'
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
              {isEditing ? "Editar Indicador" : "Cadastro de Indicador"}
            </h1>
            <p style={{
              color: '#666',
              fontSize: '16px',
              margin: '0'
            }}>
              {isEditing ? "Atualize as informações do indicador" : "Preencha as informações para criar um novo indicador"}
            </p>
          </div>

          <form onSubmit={handleSubmit(handleAddIndicador)} style={{
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
              Código do Indicador *
            </label>
            <input
              aria-invalid={errors.codigo_indicador ? "true" : "false"}
              {...register("codigo_indicador", { required: true })}
              type="text"
              placeholder="Código único do indicador (ex: AG001, ES002)"
              name="codigo_indicador"
              style={{
                width: '95%',
                padding: '12px 16px',
                border: `1px solid ${errors.codigo_indicador ? '#e74c3c' : '#e0e0e0'}`,
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
                (e.target as HTMLInputElement).style.borderColor = errors.codigo_indicador ? '#e74c3c' : '#e0e0e0';
                (e.target as HTMLInputElement).style.boxShadow = 'none';
              }}
            />
            {errors.codigo_indicador && errors.codigo_indicador.type === "required" && (
              <span style={{
                color: '#e74c3c',
                fontSize: '12px',
                marginTop: '4px',
                display: 'block'
              }}>
                O campo Código do Indicador é obrigatório!
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
              Nome do Indicador *
            </label>
            <input
              aria-invalid={errors.nome_indicador ? "true" : "false"}
              {...register("nome_indicador", { required: true })}
              type="text"
              placeholder="Nome completo do indicador"
              name="nome_indicador"
              style={{
                width: '95%',
                padding: '12px 16px',
                border: `1px solid ${errors.nome_indicador ? '#e74c3c' : '#e0e0e0'}`,
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
                (e.target as HTMLInputElement).style.borderColor = errors.nome_indicador ? '#e74c3c' : '#e0e0e0';
                (e.target as HTMLInputElement).style.boxShadow = 'none';
              }}
            />
            {errors.nome_indicador && errors.nome_indicador.type === "required" && (
              <span style={{
                color: '#e74c3c',
                fontSize: '12px',
                marginTop: '4px',
                display: 'block'
              }}>
                O campo Nome do Indicador é obrigatório!
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
              Grupo do Indicador
            </label>
            <select
              {...register("grupo_indicador")}
              name="grupo_indicador"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e0e0e0',
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
                (e.target as HTMLSelectElement).style.borderColor = '#e0e0e0';
                (e.target as HTMLSelectElement).style.boxShadow = 'none';
              }}
            >
              <option value="">Selecione um grupo (opcional)</option>
              {gruposIndicador.map((grupo, key) => (
                <option key={key} value={grupo}>
                  {grupo}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '0' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              Item de Menu
            </label>
            <select
              {...register("id_menu_item")}
              name="id_menu_item"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e0e0e0',
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
                (e.target as HTMLSelectElement).style.borderColor = '#e0e0e0';
                (e.target as HTMLSelectElement).style.boxShadow = 'none';
              }}
            >
              <option value="">Selecione um item de menu (opcional)</option>
              {menuItemsData?.map((menuItem, key) => (
                <option key={key} value={menuItem.id_menu_item}>
                  {menuItem.menu?.titulo} - {menuItem.nome_menu_item}
                </option>
              ))}
            </select>
          </div>

          {/* Seção para configuração do campo de entrada */}
          <div style={{ 
            border: "1px solid #e0e0e0", 
            padding: "24px", 
            margin: "20px 0", 
            borderRadius: "12px",
            backgroundColor: "#f8f9fa",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
          }}>
            <h3 style={{ 
              marginTop: 0, 
              marginBottom: '20px',
              color: '#333',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Configuração do Campo de Entrada
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#333',
                fontSize: '14px'
              }}>
                Tipo de Campo *
              </label>
              <select
                {...register("tipo_campo", { required: true })}
                name="tipo_campo"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `1px solid ${errors.tipo_campo ? '#e74c3c' : '#e0e0e0'}`,
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
                  (e.target as HTMLSelectElement).style.borderColor = errors.tipo_campo ? '#e74c3c' : '#e0e0e0';
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
              {errors.tipo_campo && errors.tipo_campo.type === "required" && (
                <span style={{
                  color: '#e74c3c',
                  fontSize: '12px',
                  marginTop: '4px',
                  display: 'block'
                }}>
                  O campo Tipo de Campo é obrigatório!
                </span>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#333',
                fontSize: '14px'
              }}>
                Nome do Campo *
              </label>
              <input
                {...register("nome_campo", { required: true })}
                type="text"
                placeholder="Nome que aparecerá no formulário (ex: 'Volume de Água Tratada')"
                name="nome_campo"
                style={{
                  width: '95%',
                  padding: '12px 16px',
                  border: `1px solid ${errors.nome_campo ? '#e74c3c' : '#e0e0e0'}`,
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
                  (e.target as HTMLInputElement).style.borderColor = errors.nome_campo ? '#e74c3c' : '#e0e0e0';
                  (e.target as HTMLInputElement).style.boxShadow = 'none';
                }}
              />
              {errors.nome_campo && errors.nome_campo.type === "required" && (
                <span style={{
                  color: '#e74c3c',
                  fontSize: '12px',
                  marginTop: '4px',
                  display: 'block'
                }}>
                  O campo Nome do Campo é obrigatório!
                </span>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#333'
              }}>
                <input
                  {...register("campo_ativo")}
                  type="checkbox"
                  name="campo_ativo"
                  defaultChecked={true}
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: '#3498db'
                  }}
                />
                <span style={{ fontWeight: '500' }}>Campo ativo</span>
              </label>
            </div>

            <div style={{ marginBottom: '0' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#333',
                fontSize: '14px'
              }}>
                Valor Padrão
              </label>
              <input
                {...register("valor_padrao")}
                type="text"
                placeholder="Valor inicial do campo (opcional)"
                name="valor_padrao"
                style={{
                  width: '95%',
                  padding: '12px 16px',
                  border: '1px solid #e0e0e0',
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
                  (e.target as HTMLInputElement).style.borderColor = '#e0e0e0';
                  (e.target as HTMLInputElement).style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Seção para configurar opções do select */}
            {tipoCampoSelecionado === "select" && (
              <div style={{ 
                marginTop: "20px", 
                padding: "15px", 
                border: "1px solid #ccc", 
                borderRadius: "5px",
                backgroundColor: "#fff"
              }}>
                <h4>Opções do Select</h4>
                
                <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                  <input
                    type="text"
                    placeholder="Valor"
                    value={newOption.value}
                    onChange={(e) => setNewOption({...newOption, value: e.target.value})}
                    style={{ flex: 1 }}
                  />
                  <input
                    type="text"
                    placeholder="Descrição"
                    value={newOption.descricao}
                    onChange={(e) => setNewOption({...newOption, descricao: e.target.value})}
                    style={{ flex: 2 }}
                  />
                  <button
                    type="button"
                    onClick={addSelectOption}
                    style={{
                      padding: "8px 15px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer"
                    }}
                  >
                    Adicionar
                  </button>
                </div>

                {selectOptions.length > 0 && (
                  <div style={{ marginTop: "15px" }}>
                    <h5>Opções Cadastradas:</h5>
                    {selectOptions.map((option, index) => (
                      <div key={option.tempId || option.id_select_option} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px",
                        border: "1px solid #eee",
                        borderRadius: "3px",
                        marginBottom: "5px"
                      }}>
                        <span style={{ minWidth: "30px" }}>{option.ordem_option}.</span>
                        <span style={{ flex: 1, fontWeight: "bold" }}>{option.value}</span>
                        <span style={{ flex: 2 }}>{option.descricao}</span>
                        <button
                          type="button"
                          onClick={() => moveOptionUp(index)}
                          disabled={index === 0}
                          style={{
                            padding: "4px 8px",
                            fontSize: "12px",
                            backgroundColor: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "3px",
                            cursor: index === 0 ? "not-allowed" : "pointer"
                          }}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveOptionDown(index)}
                          disabled={index === selectOptions.length - 1}
                          style={{
                            padding: "4px 8px",
                            fontSize: "12px",
                            backgroundColor: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "3px",
                            cursor: index === selectOptions.length - 1 ? "not-allowed" : "pointer"
                          }}
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSelectOption(index)}
                          style={{
                            padding: "4px 8px",
                            fontSize: "12px",
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "3px",
                            cursor: "pointer"
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Seção para configurar itens de checkbox */}
            {tipoCampoSelecionado === "checkbox" && (
              <div style={{ 
                marginTop: "20px", 
                padding: "15px", 
                border: "1px solid #ddd", 
                borderRadius: "5px",
                backgroundColor: "#fff"
              }}>
                <h4 style={{ marginTop: 0, color: "#333" }}>Itens do Checkbox</h4>
                <p style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
                  Adicione os itens que aparecerão como opções de checkbox no formulário.
                </p>

                <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                  <div style={{ flex: 2 }}>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                      Descrição *
                    </label>
                    <input
                      type="text"
                      value={newCheckBoxItem.descricao}
                      onChange={(e) => setNewCheckBoxItem({...newCheckBoxItem, descricao: e.target.value})}
                      placeholder="Descrição que aparecerá (ex: 'Sim')"
                      style={{
                        width: "95%",
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "3px"
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "end" }}>
                    <button
                      type="button"
                      onClick={addCheckBoxItem}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer"
                      }}
                    >
                      Adicionar
                    </button>
                  </div>
                </div>

                {checkBoxItems.length > 0 && (
                  <div style={{ marginTop: "15px" }}>
                    <h5>Itens Cadastrados:</h5>
                    {checkBoxItems.map((item, index) => (
                      <div key={item.tempId || item.id_item_check_box} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px",
                        border: "1px solid #eee",
                        borderRadius: "3px",
                        marginBottom: "5px"
                      }}>
                        <span style={{ minWidth: "30px" }}>{index + 1}.</span>
                        <span style={{ flex: 1, fontWeight: "bold" }}>{item.descricao}</span>
                        <button
                          type="button"
                          onClick={() => moveCheckBoxItemUp(index)}
                          disabled={index === 0}
                          style={{
                            padding: "4px 8px",
                            fontSize: "12px",
                            backgroundColor: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "3px",
                            cursor: index === 0 ? "not-allowed" : "pointer"
                          }}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveCheckBoxItemDown(index)}
                          disabled={index === checkBoxItems.length - 1}
                          style={{
                            padding: "4px 8px",
                            fontSize: "12px",
                            backgroundColor: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "3px",
                            cursor: index === checkBoxItems.length - 1 ? "not-allowed" : "pointer"
                          }}
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => removeCheckBoxItem(index)}
                          style={{
                            padding: "4px 8px",
                            fontSize: "12px",
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "3px",
                            cursor: "pointer"
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
              Unidade do Indicador
            </label>
            <input
              {...register("unidade_indicador")}
              type="text"
              placeholder="Unidade de medida (ex: %, L/s, R$, etc.)"
              name="unidade_indicador"
              style={{
                width: '95%',
                padding: '12px 16px',
                border: '1px solid #e0e0e0',
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
                (e.target as HTMLInputElement).style.borderColor = '#e0e0e0';
                (e.target as HTMLInputElement).style.boxShadow = 'none';
              }}
            />
          </div>

          {/* <div style={{ marginBottom: '0' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              Palavra-chave
            </label>
            <input
              {...register("palavra_chave")}
              type="text"
              placeholder="Palavras-chave para busca (separadas por vírgula)"
              name="palavra_chave"
              style={{
                width: '95%',
                padding: '12px 16px',
                border: '1px solid #e0e0e0',
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
                (e.target as HTMLInputElement).style.borderColor = '#e0e0e0';
                (e.target as HTMLInputElement).style.boxShadow = 'none';
              }}
            />
          </div> */}

          {/* <div style={{ marginBottom: '0' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              Fórmula de Cálculo
            </label>
            <textarea
              {...register("formula_calculo_indicador")}
              placeholder="Fórmula matemática para cálculo do indicador"
              name="formula_calculo_indicador"
              rows={3}
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
          </div> */}

          {/* <div style={{ marginBottom: '0' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              Informações do Indicador
            </label>
            <textarea
              {...register("informacoes_indicador")}
              placeholder="Descrição detalhada, metodologia, fontes de dados, etc."
              name="informacoes_indicador"
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
          </div> */}

          {/* <div style={{ marginBottom: '0' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              Indicador Correspondente SNIS
            </label>
            <input
              {...register("indicador_correspondente_ou_similar_snis")}
              type="text"
              placeholder="Código do indicador correspondente no SNIS (se aplicável)"
              name="indicador_correspondente_ou_similar_snis"
              style={{
                width: '95%',
                padding: '12px 16px',
                border: '1px solid #e0e0e0',
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
                (e.target as HTMLInputElement).style.borderColor = '#e0e0e0';
                (e.target as HTMLInputElement).style.boxShadow = 'none';
              }}
            />
          </div> */}

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
            {isEditing ? "Atualizar Indicador" : "Cadastrar Indicador"}
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
