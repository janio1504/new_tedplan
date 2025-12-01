/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {FaBars, FaCaretDown, FaList, FaLink} from "react-icons/fa";
import {
  InputP,
  InputM,
  MenuMunicipio,
  Municipio,
  MenuMunicipioItem,
  DivTitulo,
  DivTituloConteudo,
  InputGG,
  InputSNIS,
  DivFormEixo,
} from "../../styles/financeiro";

import {
  Container,
  DivCenter,
  DivForm,
  DivFormCadastro,
  DivTituloForm,
  Form,
  InputG,
  SubmitButton,
  DivEixo,
  TextArea,
  DivTextArea,
  StepButton,
  StepContent,
  StepLabel,
  StepperNavigation,
  StepperWrapper,
  StepperContainer,
  StepperButton,
} from "../../styles/esgoto-indicadores";

import HeadIndicadores from "../../components/headIndicadores";
import { getAPIClient } from "../../services/axios";
import MenuIndicadores from "../../components/MenuIndicadores";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../services/api";
import MenuHorizontal from "../../components/MenuHorizontal";
import { toast } from "react-toastify";
import MenuIndicadoresCadastro from "../../components/MenuIndicadoresCadastro";
import { Sidebar, SidebarItem, MenuHeader, MenuItemsContainer } from "../../styles/residuo-solidos-in";
import { DivFormConteudo } from "../../styles/drenagem-indicadores";
import { BreadCrumbStyle, CollapseButton, ExpandButton, MainContent } from "../../styles/indicadores";
import { anosSelect } from "../../util/util";
import { bold } from "@uiw/react-md-editor/lib/commands";
import Link from "next/link";
import { BodyDashboard } from "@/styles/dashboard-original";

interface IMunicipio {
  id_municipio: string;
  municipio_codigo_ibge: string;
  municipio_nome: string;
}

interface ISelectOption {
  id_select_option: string;
  value: string;
  descricao: string;
  ordem_option: number;
}

interface ICheckBoxItem {
  id_item_check_box: string;
  descricao: string;
  valor: string;
}

interface ITipoCampoIndicador {
  id_tipo_campo_indicador: string;
  type: string;
  name_campo: string;
  enable: boolean;
  default_value: string;
  selectOptions?: ISelectOption[];
  checkBoxItems?: ICheckBoxItem[];
}

interface IIndicador {
  id_indicador: string;
  codigo_indicador: string;
  nome_indicador: string;
  grupo_indicador: string;
  unidade_indicador: string;
  tiposCampo?: ITipoCampoIndicador[];
  _hasError?: boolean;
}

interface MunicipioProps {
  Imunicipio: IMunicipio[];
}

// Componente para renderizar campo dinâmico baseado no tipo
const CampoIndicador = ({ 
  indicador, 
  register, 
  anoSelected,
  campoEnabled,
  fieldStates,
  setFieldStates,
  setValue
}: { 
  indicador: IIndicador, 
  register: any, 
  anoSelected: string,
  campoEnabled?: boolean,
  fieldStates?: {[key: string]: any},
  setFieldStates?: (states: {[key: string]: any}) => void,
  setValue?: any
}) => {
  // Verificações de segurança
  if (!indicador || !anoSelected) {
    return (
      <input
        type="text"
        placeholder="Dados inválidos"
        disabled
        style={{ backgroundColor: "#fff3cd", border: "1px solid #ffeaa7" }}
      />
    );
  }

  const tipoCampo = indicador.tiposCampo && indicador.tiposCampo.length > 0 ? indicador.tiposCampo[0] : null;
  const fieldName = `${indicador.codigo_indicador}_${anoSelected}`;
  
    // Função para verificar se um campo deve estar habilitado baseado nas condições
  const isFieldEnabled = (codigoIndicador: string) => {
    switch (codigoIndicador) {
      case "CAD2002":
        // CAD2002 só é habilitado quando algum campo tem valor "coleta"
        return fieldStates?.hasColeta === true;

      default:
        return true; // Por padrão, campos estão habilitados
    }
  };
  
  const isDisabled = !isFieldEnabled(indicador.codigo_indicador);
  
  function onChangeEnabled(value: any) {
    if (setFieldStates && fieldStates) {
      const newStates = { ...fieldStates };
      
      // Atualizar estado baseado no valor selecionado
      if (value === "coleta") {
        newStates.hasColeta = true;
      } else {
        newStates.hasColeta = false;
      }
      
      setFieldStates(newStates);
    }
  }
  
  // Campo não configurado ou com erro
  if (!tipoCampo) {
    const hasError = indicador._hasError;
    return (
      <input
        {...register(fieldName)}
        type="text"
        placeholder={hasError ? "Erro ao carregar configuração" : "Campo sem configuração"}
        title={hasError ? "Verifique a conectividade com o servidor" : "Este indicador não possui configuração de campo"}
        style={{ 
          backgroundColor: hasError ? "#fff3cd" : "#f8f9fa", 
          border: hasError ? "1px solid #ffeaa7" : "1px solid #dee2e6",
          color: hasError ? "#856404" : "#6c757d"
        }}
      />
    );
  }

  if (!tipoCampo.enable) {
    return (
      <input
        {...register(fieldName)}
        type="text"
        placeholder="Campo desabilitado"
        disabled
        style={{ backgroundColor: "#f5f5f5", color: "#999" }}
      />
    );
  }

  // Função para obter a mensagem de placeholder baseada na condição
  const getPlaceholderMessage = (codigoIndicador: string) => {
    if (isDisabled) {
      switch (codigoIndicador) {
        case "CAD2002":
          return "Campo CAD2002 desabilitado";
        default:
          return "Campo desabilitado";
      }
    }
    return tipoCampo.default_value ;
  };

  // Pegar o registro do react-hook-form
  const fieldRegistration = register(fieldName);
  
  // Criar onChange combinado que preserva o react-hook-form
  const combinedOnChange = (e: any) => {
    // Chamar primeiro o onChange do react-hook-form
    fieldRegistration.onChange(e);
    // Depois chamar nossa lógica personalizada
    onChangeEnabled(e.target.value);
  };

  // Propriedades base do campo
  const baseProps = {
    ...fieldRegistration,
    onChange: combinedOnChange, // Usar o onChange combinado
    placeholder: getPlaceholderMessage(indicador.codigo_indicador),
    defaultValue: tipoCampo.default_value || "",
    disabled: isDisabled,
    style: { 
      width: "90%", 
      padding: "8px 12px", 
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "13px",
      transition: "all 0.2s ease",
      backgroundColor: isDisabled ? "#f8f9fa" : "white",
      color: isDisabled ? "#6c757d" : "#333",
      boxShadow: "none"
    }
  };

  // Renderizar conforme o tipo
  switch (tipoCampo.type?.toLowerCase()) {
    case 'number':
      return (
        <input
          {...baseProps}
          type="number"
          step="any"
          style={{ ...baseProps.style, textAlign: "right" }}
          onFocus={(e) => {
            e.target.style.borderColor = "#1e88e5";
            e.target.style.boxShadow = "0 0 0 2px rgba(30,136,229,0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#ddd";
            e.target.style.boxShadow = "none";
          }}
        />
      );

    case 'select':
      const options = tipoCampo.selectOptions || [];
      return (
        <select 
          {...baseProps}
          style={{ ...baseProps.style }}
          onFocus={(e) => {
            e.target.style.borderColor = "#1e88e5";
            e.target.style.boxShadow = "0 0 0 2px rgba(30,136,229,0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#ddd";
            e.target.style.boxShadow = "none";
          }}
        >
          <option value="">Selecione...</option>
          {options
            .sort((a, b) => (a.ordem_option || 0) - (b.ordem_option || 0))
            .map((option, index) => (
              <option key={option.id_select_option || index} value={option.value}>
                {option.descricao || option.value}
              </option>
            ))
          }
        </select>
      );

    case 'textarea':
      return (
        <textarea
          {...baseProps}
          rows={2}
          style={{ 
            ...baseProps.style, 
            resize: "vertical", 
            minHeight: "60px" 
          }}
        />
      );

    case 'date':
      return (
        <input
          {...baseProps}
          type="date"
          style={{ ...baseProps.style }}
        />
      );

    case 'email':
      return (
        <input
          {...baseProps}
          type="email"
          style={{ ...baseProps.style }}
        />
      );

    case 'checkbox':
      const checkBoxItems = tipoCampo.checkBoxItems || [];

      
      if (checkBoxItems.length === 0) {
        return (
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            height: "40px"
          }}>
            <input
              {...register(fieldName)}
              type="checkbox"
              style={{ transform: "scale(1.3)" }}
            />
          </div>
        );
      }
      
      return (
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "8px",
          padding: "8px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          backgroundColor: isDisabled ? "#f8f9fa" : "white"
        }}>
          {checkBoxItems.map((item, index) => {
            const checkboxFieldName = `${fieldName}_${item.id_item_check_box}_${anoSelected}`;

            
            return (
              <label key={item.id_item_check_box} style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                cursor: isDisabled ? "not-allowed" : "pointer",
                opacity: isDisabled ? 0.6 : 1
              }}>
                <input
                  type="checkbox"
                  defaultChecked={Boolean(item.valor)}
                  disabled={isDisabled}
                  style={{ transform: "scale(1.1)" }}
                  onChange={(e) => {
                    // Forçar o React Hook Form a registrar corretamente usando setValue
                    if (e.target.checked) {
                      setValue(checkboxFieldName, true);
                    } else {
                      setValue(checkboxFieldName, false);
                    }
                  }}
                />
                <span>{item.descricao}</span>
              </label>
            );
          })}
        </div>
      );

    case 'text':
    default:
      return (
        <input
          {...baseProps}
          type="text"
          style={{ ...baseProps.style }}
          onFocus={(e) => {
            e.target.style.borderColor = "#1e88e5";
            e.target.style.boxShadow = "0 0 0 2px rgba(30,136,229,0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#ddd";
            e.target.style.boxShadow = "none";
          }}
        />
      );
  }
};

export default function PrestacaoServicoDrenagem() {
  const { usuario, signOut, anoEditorSimisab, permission, isEditor } =
    useContext(AuthContext);
  const [dadosMunicipio, setDadosMunicipio] = useState<IMunicipio>(null);
  const [menus, setMenus] = useState([]);
  const [anoSelected, setAnoSelected] = useState(null);
  const [campoEnabled, setCampoEnabled] = useState(true);
  const {
  register,
  handleSubmit,
  reset,
  setValue,
  formState: { errors },
} = useForm();

  const [content, setContent] = useState(null);
  const [activeForm, setActiveForm] = useState("");
  const [indicadores, setIndicadores] = useState<IIndicador[]>([]);
  const [grupo, setGrupo] = useState(null);
  const [loadingIndicadores, setLoadingIndicadores] = useState(false);
  const [fieldStates, setFieldStates] = useState<{[key: string]: any}>({
    hasColeta: false
  });

  const [dadosCarregados, setDadosCarregados] = useState([]);
  const [loadingDados, setLoadingDados] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth <= 1000) {
          setIsCollapsed(true);
        } else {
          setIsCollapsed(false);
        }
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    getMenus();
    getMunicipio();
    if (anoEditorSimisab) {
      setAnoSelected(anoEditorSimisab);
    }
  }, [anoEditorSimisab]);

  async function getMunicipio() {
    const res = await api
      .get("getMunicipio", {
        params: { id_municipio: usuario.id_municipio },
      })
      .then((response) => {
        setDadosMunicipio(response.data);
      });
  }

  async function getMenus() {
    const res = await api
      .get("menus/eixo/"+2)
      .then((response) => {
        setMenus(response.data);
      });
  }

  async function getIndicadores(menu_item: { id_menu_item: number; nome_menu_item: string; }) {
    setGrupo(menu_item.nome_menu_item);
    setLoadingIndicadores(true);
    
    try {
      // Buscar indicadores do menu item
      const resIndicadores = await api.get(`indicadores-novo/menu-item/${menu_item?.id_menu_item}`);
      const indicadoresData = resIndicadores.data || [];
      
      if (indicadoresData.length === 0) {
        setIndicadores([]);
        return;
      }
      
      // Primeiro, mostrar os indicadores básicos
      setIndicadores(indicadoresData);
      
      // Depois, carregar tipos de campo gradualmente
      const indicadoresComTipos = [];
      
      for (let i = 0; i < indicadoresData.length; i++) {
        const indicador = indicadoresData[i];
        
        try {
          // Usar a instância de API configurada com autenticação
          const tiposResponse = await api.get(`tipos-campo/indicador/${indicador.id_indicador}`);
          const tiposCampo = tiposResponse.data || [];
          
          // Processar opções para campos select
          const tiposComOpcoes = [];
          for (const tipo of tiposCampo) {
            if (tipo.type === "select") {
              try {
                const opcoesResponse = await api.get(`select-options/tipo-campo/${tipo.id_tipo_campo_indicador}`);
                const opcoes = opcoesResponse.data || [];
                tiposComOpcoes.push({
                  ...tipo,
                  selectOptions: opcoes
                });
              } catch (error) {
                tiposComOpcoes.push(tipo);
              }
            } else if (tipo.type === "checkbox") {
              try {
                const checkBoxResponse = await api.get(`item-check-box/indicador/${indicador.id_indicador}`);
                const checkBoxItems = checkBoxResponse.data || [];
                tiposComOpcoes.push({
                  ...tipo,
                  checkBoxItems: checkBoxItems
                });
              } catch (error) {
                  tiposComOpcoes.push(tipo);
                }
              } else {
                tiposComOpcoes.push(tipo);
              }
            }
            
            indicadoresComTipos.push({
              ...indicador,
              tiposCampo: tiposComOpcoes
            });
            
          } catch (error) {
            // Em caso de erro, pelo menos adicionar o indicador sem tipos
            indicadoresComTipos.push({
              ...indicador,
              tiposCampo: []
            });
          }
        }
        
        setIndicadores(indicadoresComTipos);
        
        // Se há um ano selecionado, carregar dados existentes
        if (anoSelected && usuario?.id_municipio) {
          await carregarDadosExistentes(anoSelected);
        }
      
    } catch (error) {
      let errorMessage = "Erro desconhecido";
      if (error.response?.status === 401) {
        errorMessage = "Erro de autenticação - Faça login novamente";
      } else if (error.response?.status === 404) {
        errorMessage = "Dados não encontrados";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(`Erro ao carregar indicadores: ${errorMessage}`, {
        position: "top-right",
        autoClose: 7000,
      });
      
      // Em caso de erro, pelo menos tentar mostrar os dados básicos
      try {
        const resIndicadores = await api.get(`indicadores-novo/menu-item/${menu_item?.id_menu_item}`);
        const indicadoresBasicos = resIndicadores.data || [];
        setIndicadores(indicadoresBasicos.map(ind => ({ 
          ...ind, 
          tiposCampo: [],
          _hasError: true 
        })));
        
        // Se há um ano selecionado, carregar dados existentes mesmo com erro
        if (anoSelected && usuario?.id_municipio) {
          await carregarDadosExistentes(anoSelected);
        }
      } catch (basicError) {
        setIndicadores([]);
      }
    } finally {
      setLoadingIndicadores(false);
    }
  }



  // Função para salvar dados na tabela item_check_box
  async function salvarItemCheckBox(checkBoxSelecionados, todosCheckBoxes) {
    if (!todosCheckBoxes || todosCheckBoxes.length === 0) {
      return;
    }
    
    try {
      const apiClient = getAPIClient();
      
      // Criar um mapa dos checkboxes selecionados para facilitar a busca
      const checkBoxSelecionadosMap = new Map();
      if (checkBoxSelecionados && checkBoxSelecionados.length > 0) {
        checkBoxSelecionados.forEach(checkBox => {
          checkBoxSelecionadosMap.set(checkBox.id_item_check_box, checkBox);
        });
      }
      
      // Para cada checkbox disponível, atualizar o registro na tabela item_check_box
      for (const checkBox of todosCheckBoxes) {
        try {
          // Validar se o checkbox tem os campos necessários
          if (!checkBox.id_item_check_box || !checkBox.descricao || !checkBox.id_indicador) {
            continue;
          }
          
          // Verificar se o checkbox está selecionado
          const isSelected = checkBoxSelecionadosMap.has(checkBox.id_item_check_box);
          
          // Atualizar o campo valor para boolean (true se selecionado, false se não selecionado)
          await apiClient.put(`/item-check-box/${checkBox.id_item_check_box}`, {
            valor: isSelected // boolean true se selecionado, false se não selecionado
          });
        } catch (error) {
          console.error("Erro ao atualizar item checkbox:", checkBox, error);
          console.error("Detalhes do erro:", error.response?.data);
        }
      }
    } catch (error) {
      console.error("Erro ao salvar dados na tabela item_check_box:", error);
    }
  }

  async function handleCadastroIndicadores(data) {
    
    try {
      if (!isEditor) {
        toast.error("Você não tem permissão para editar!", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }

      // Verificar se o usuário está disponível
      if (!usuario || !usuario.id_municipio) {
        console.error("Usuário não disponível:", usuario);
        toast.error("Erro: Dados do usuário não disponíveis!", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }

      // Verificar se o ano está selecionado
      if (!anoSelected) {
        toast.error("Erro: Ano não selecionado!", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }

      // Processar os dados para salvar valores dos indicadores
      const valoresIndicadores = [];
      const checkBoxSelecionados = [];
      
      // Agrupar checkboxes por código do indicador
      const checkBoxAgrupados = new Map();
      
      Object.keys(data).forEach(key => {
        const valor = data[key];
        
                  // Verificar se é um campo checkbox
          const isCheckboxField = key.includes('_') && key.split('_').length > 2;
        
                  if (isCheckboxField) {
            const parts = key.split('_');
            const codigoIndicador = parts[0];
            const idItemCheckBox = parts[2]; // O id_item_check_box está na posição 2 (GFI1008_2025_8_2025)
          
                     
            
                        if (valor === true || valor === "true" || (typeof valor === 'string' && valor.length > 0 && valor !== "false")) {
            
            // Encontrar a descrição do checkbox selecionado
            const indicador = indicadores.find(ind => ind.codigo_indicador === codigoIndicador);
            
                          if (indicador) {              
                const tipoCheckbox = indicador.tiposCampo?.find(tipo => tipo.type === 'checkbox');
                
                if (tipoCheckbox && tipoCheckbox.checkBoxItems) {
                
                // Tentar encontrar por id_item_check_box
                let checkBoxItem = tipoCheckbox.checkBoxItems.find(item => 
                  item.id_item_check_box === idItemCheckBox
                );
                
                if (!checkBoxItem) {
                  // Se não encontrou, tentar encontrar por qualquer correspondência
                  const checkBoxItemAlt = tipoCheckbox.checkBoxItems.find(item => 
                    item.id_item_check_box.toString() === idItemCheckBox.toString() ||
                    item.descricao.toLowerCase().includes(idItemCheckBox.toLowerCase()) ||
                    (typeof valor === 'string' && valor.toLowerCase().includes(item.descricao.toLowerCase()))
                  );
                  
                  // Usar o resultado da busca alternativa se encontrou
                  if (checkBoxItemAlt) {
                    checkBoxItem = checkBoxItemAlt;
                  }
                }
                
                if (checkBoxItem) {
                  // Agrupar checkboxes por indicador
                  if (!checkBoxAgrupados.has(codigoIndicador)) {
                    checkBoxAgrupados.set(codigoIndicador, []);
                  }
                  checkBoxAgrupados.get(codigoIndicador).push(checkBoxItem.descricao);
                  
                  // Salvar para tabela item_check_box
                  const checkBoxData = {
                    id_item_check_box: checkBoxItem.id_item_check_box,
                    descricao: checkBoxItem.descricao,
                    valor: true, // boolean true para item selecionado
                    id_indicador: indicador.id_indicador
                  };
                  
                                    checkBoxSelecionados.push(checkBoxData);
                }
              }
            }
          }
        } else {
          // Campo normal (não checkbox) - formato: "CODIGO_ANO"
          if (valor !== null && valor !== undefined && valor !== '') {
            const parts = key.split('_');
            const codigoIndicador = parts[0]; // Extrair apenas o código, sem o ano
            
            valoresIndicadores.push({
              codigo_indicador: codigoIndicador,
              ano: parseInt(anoSelected),
              valor_indicador: valor,
              id_municipio: usuario.id_municipio
            });
          }
        }
                      });
        

        

        
        // Processar checkboxes agrupados para salvar na tabela indicadores-municipio
      checkBoxAgrupados.forEach((descricoes, codigoIndicador) => {
        const indicador = indicadores.find(ind => ind.codigo_indicador === codigoIndicador);
        if (indicador) {
          // Salvar array JSON com descrições na tabela indicadores-municipio
          valoresIndicadores.push({
            codigo_indicador: codigoIndicador,
            ano: parseInt(anoSelected),
            valor_indicador: JSON.stringify(descricoes), // Array JSON
            id_municipio: usuario.id_municipio
          });
        }
              });

      if (valoresIndicadores.length === 0) {
        toast.warning("Nenhum valor foi preenchido!", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }



              // Verificar se já existem dados para este município e ano
      const apiClient = getAPIClient();
      
      try {
        // Buscar dados existentes para o município e ano
        const existingDataResponse = await apiClient.get(
          `/indicadores-municipio/municipio/${usuario.id_municipio}?ano=${anoSelected}`
        );
        
        const existingData = existingDataResponse.data || [];
        
                  if (existingData.length > 0) {
            // Se existem dados, atualizar apenas os que foram alterados
          
          // Criar um mapa dos dados existentes para facilitar a busca
          const existingDataMap = new Map();
          existingData.forEach(record => {
            const key = `${record.codigo_indicador}_${record.ano}`;
            existingDataMap.set(key, record);
          });
          
          // Processar cada valor para salvar/atualizar
          for (const valorIndicador of valoresIndicadores) {
            const key = `${valorIndicador.codigo_indicador}_${valorIndicador.ano}`;
            const existingRecord = existingDataMap.get(key);
            
            try {
                              if (existingRecord) {
                  // Atualizar registro existente
                  await apiClient.put(`/indicadores-municipio/${existingRecord.id_incicador_municipio}`, valorIndicador);
                } else {
                  // Criar novo registro
                  await apiClient.post("/indicadores-municipio", valorIndicador);
                }
            } catch (saveError) {
              console.error("Erro ao salvar/atualizar valor:", valorIndicador, saveError);
              throw saveError;
            }
          }
          
          // Salvar dados na tabela item_check_box
          try {
            // Coletar todos os checkboxes disponíveis para o indicador
            const todosCheckBoxes = [];
            indicadores.forEach(indicador => {
              const tipoCheckbox = indicador.tiposCampo?.find(tipo => tipo.type === 'checkbox');
              if (tipoCheckbox && tipoCheckbox.checkBoxItems) {
                tipoCheckbox.checkBoxItems.forEach(item => {
                  todosCheckBoxes.push({
                    id_item_check_box: item.id_item_check_box,
                    descricao: item.descricao,
                    id_indicador: indicador.id_indicador
                  });
                });
              }
            });
            
            await salvarItemCheckBox(checkBoxSelecionados, todosCheckBoxes);
          } catch (error) {
            console.error("Erro ao salvar na tabela item_check_box:", error);
            // Não interromper o processo principal
          }
            
            toast.success("Dados atualizados com sucesso!", {
              position: "top-right",
              autoClose: 5000,
            });

        } else {
                      // Se não existem dados, criar novos registros
            for (const valorIndicador of valoresIndicadores) {
              await apiClient.post("/indicadores-municipio", valorIndicador);
            }
          
          // Salvar dados na tabela item_check_box
          try {
            // Coletar todos os checkboxes disponíveis para o indicador
            const todosCheckBoxes = [];
            indicadores.forEach(indicador => {
              const tipoCheckbox = indicador.tiposCampo?.find(tipo => tipo.type === 'checkbox');
              if (tipoCheckbox && tipoCheckbox.checkBoxItems) {
                tipoCheckbox.checkBoxItems.forEach(item => {
                  todosCheckBoxes.push({
                    id_item_check_box: item.id_item_check_box,
                    descricao: item.descricao,
                    id_indicador: indicador.id_indicador
                  });
                });
              }
            });
            
            await salvarItemCheckBox(checkBoxSelecionados, todosCheckBoxes);
          } catch (error) {
            console.error("Erro ao salvar na tabela item_check_box:", error);
            // Não interromper o processo principal
          }
          
          toast.success("Dados salvos com sucesso!", {
            position: "top-right",
            autoClose: 5000,
          });
        }
      } catch (error) {
        console.error("Erro ao verificar dados existentes:", error);
        
        // Se não conseguir verificar dados existentes, tentar salvar normalmente
                  for (const valorIndicador of valoresIndicadores) {
            try {
              await apiClient.post("/indicadores-municipio", valorIndicador);
            } catch (saveError) {
            console.error("Erro ao salvar valor:", valorIndicador, saveError);
            throw saveError;
          }
        }
        
        // Salvar dados na tabela item_check_box
        try {
          // Coletar todos os checkboxes disponíveis para o indicador
          const todosCheckBoxes = [];
          indicadores.forEach(indicador => {
            const tipoCheckbox = indicador.tiposCampo?.find(tipo => tipo.type === 'checkbox');
            if (tipoCheckbox && tipoCheckbox.checkBoxItems) {
              tipoCheckbox.checkBoxItems.forEach(item => {
                todosCheckBoxes.push({
                  id_item_check_box: item.id_item_check_box,
                  descricao: item.descricao,
                  id_indicador: indicador.id_indicador
                });
              });
            }
          });
          
          await salvarItemCheckBox(checkBoxSelecionados, todosCheckBoxes);
        } catch (error) {
          console.error("Erro ao salvar na tabela item_check_box:", error);
          // Não interromper o processo principal
        }
        
        toast.success("Dados salvos com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
      }

    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      console.error("Stack trace:", error.stack);
      toast.error("Erro ao salvar dados!", {
        position: "top-right",
        autoClose: 7000,
      });
    }
  }



  function handleOnChange(content) {
    setContent(content);
  }

  async function handleCadastro(data) {
    if (!isEditor) {
      toast.error("Você não tem permissão para editar!", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }
  }

  async function selectAno(ano: string) {
    setAnoSelected(ano);
    
    if (ano && usuario?.id_municipio) {
      await carregarDadosExistentes(ano);
    } else {
      // Limpar dados quando não há ano selecionado
      setDadosCarregados([]);
      reset(); // Limpar formulário
    }
  }

  async function carregarDadosExistentes(ano: string) {
    if (!usuario?.id_municipio || !ano) return;
    
    setLoadingDados(true);
    
    try {
      const apiClient = getAPIClient();
      
      // Carregar dados dos indicadores (mantém funcionalidade atual)
      const response = await apiClient.get(
        `/indicadores-municipio/municipio/${usuario.id_municipio}?ano=${ano}`
      );
             const dados = response.data || [];
      setDadosCarregados(dados);
      
      // Preencher o formulário com os dados carregados
      preencherFormulario(dados);
      
      if (dados.length > 0) {
        toast.info(`Carregados ${dados.length} registro(s) para o ano ${ano}`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.info(`Nenhum dado encontrado para o ano ${ano}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Erro ao carregar dados existentes:", error);
      toast.error("Erro ao carregar dados existentes!", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoadingDados(false);
    }
  }

      function preencherFormulario(dados: any[]) {
      // Criar objeto com os valores para preencher o formulário
    const valoresFormulario = {};
    
    // Agrupar dados por código do indicador para processar checkboxes
    const dadosAgrupados = new Map();
    
    dados.forEach(dado => {
      const codigoIndicador = dado.codigo_indicador;
      const ano = dado.ano;
      const valor = dado.valor_indicador;
      
      if (!dadosAgrupados.has(codigoIndicador)) {
        dadosAgrupados.set(codigoIndicador, []);
      }
      dadosAgrupados.get(codigoIndicador).push({ ano, valor });
    });
    
    // Processar cada grupo de dados de indicadores
    dadosAgrupados.forEach((valores, codigoIndicador) => {
      const indicador = indicadores.find(ind => ind.codigo_indicador === codigoIndicador);
      
      if (indicador) {
        const tipoCheckbox = indicador.tiposCampo?.find(tipo => tipo.type === 'checkbox');
        
        if (tipoCheckbox && tipoCheckbox.checkBoxItems) {
          // É um checkbox, verificar quais itens estão salvos
                     valores.forEach(({ ano, valor }) => {
             try {
               // Se o valor é uma string que parece JSON, tentar fazer parse
               if (typeof valor === 'string' && (valor.startsWith('[') || valor.startsWith('{'))) {
                 try {
                   const jsonParsed = JSON.parse(valor);
                   if (Array.isArray(jsonParsed)) {
                     // Para cada descrição no array JSON, encontrar o checkbox correspondente
                     jsonParsed.forEach(descricao => {
                       const checkBoxItem = tipoCheckbox.checkBoxItems.find(item => 
                         item.descricao === descricao
                       );
                       
                       if (checkBoxItem) {
                         const fieldName = `${codigoIndicador}_${checkBoxItem.valor}_${ano}`;
                         valoresFormulario[fieldName] = true;
                       }
                     });
                   }
                 } catch (jsonError) {
                   // Fallback: tratar como valor único
                   const checkBoxItem = tipoCheckbox.checkBoxItems.find(item => 
                     item.descricao === valor
                   );
                   
                   if (checkBoxItem) {
                     const fieldName = `${codigoIndicador}_${checkBoxItem.valor}_${ano}`;
                     valoresFormulario[fieldName] = true;
                   }
                 }
               } else {
                 // Valor único (não JSON)
                 const checkBoxItem = tipoCheckbox.checkBoxItems.find(item => 
                   item.descricao === valor || item.valor === valor
                 );
                 
                 if (checkBoxItem) {
                   const fieldName = `${codigoIndicador}_${checkBoxItem.valor}_${ano}`;
                   valoresFormulario[fieldName] = true;
                 }
               }
             } catch (error) {
               console.error('Erro ao processar valor do checkbox:', valor, error);
             }
           });
        } else {
          // Campo normal - pegar apenas o primeiro valor (não deve ter múltiplos)
          const { ano, valor } = valores[0];
          const fieldName = `${codigoIndicador}_${ano}`;
          valoresFormulario[fieldName] = valor;
        }
      } else {
        // Fallback para campo normal
        const { ano, valor } = valores[0];
        const fieldName = `${codigoIndicador}_${ano}`;
        valoresFormulario[fieldName] = valor;
      }
    });
    

    
         // Preencher o formulário
     reset(valoresFormulario);
  }

  return (
    <Container>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuHorizontal
        municipio={dadosMunicipio?.municipio_nome}
      ></MenuHorizontal>
      <MenuIndicadoresCadastro></MenuIndicadoresCadastro>
      <BodyDashboard>
      {isCollapsed ? (
                    <ExpandButton onClick={toggleSidebar}>
                      <FaBars /> 
                    </ExpandButton>
                ) : (
      <Sidebar isCollapsed={isCollapsed}>
                    <CollapseButton onClick={toggleSidebar}>
                                <FaBars /> 
                    </CollapseButton>
        {menus?.map((menu) => {
          const isOpen = openMenuId === menu.id_menu;
          return (
            <div key={menu.id_menu}>
              <MenuHeader
                isOpen={isOpen}
                onClick={() => {
                  // Se o menu já está aberto, fecha. Caso contrário, abre e fecha os outros
                  setOpenMenuId(isOpen ? null : menu.id_menu);
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FaList style={{ fontSize: "14px" }} />
                  {menu.titulo}
                </div>
                <FaCaretDown />
              </MenuHeader>
              <MenuItemsContainer isOpen={isOpen}>
                {menu.menuItems?.map((menuItem) => (
                  <SidebarItem
                    key={menuItem.id_menu_item}
                    active={activeForm === menuItem.nome_menu_item}
                    onClick={() => {
                      setActiveForm(menuItem.nome_menu_item);
                      getIndicadores(menuItem);
                    }}
                  >
                    <FaLink style={{ marginRight: "8px", fontSize: "14px" }} />
                    {menuItem.nome_menu_item}
                  </SidebarItem>
                ))}
              </MenuItemsContainer>
            </div>
          );
        })}
      </Sidebar>
                )}

      
        <DivCenter>
          <Form onSubmit={handleSubmit(handleCadastroIndicadores)}>
            <BreadCrumbStyle isCollapsed={isCollapsed}>
          <nav>
            <ol>
              <li>
                <Link href="/indicadores/home_indicadores">Home</Link>
                <span> / </span>
              </li>
              <li>
                                    <Link href="/indicadores/prestacao-servicos">
                  Prestação de Serviços
                </Link>
                <span> / </span>
              </li>
              <li>
                <span>Drenagem</span>
              </li>
            </ol>
          </nav>
        </BreadCrumbStyle>
            <DivForm style={{ borderColor: "#12B2D5" }}>
              <DivTituloForm>Drenagem</DivTituloForm>

              <div style={{ padding: "20px", borderBottom: "1px solid #eee" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
                  <div>
                    <label>Selecionar Ano:</label>
                    <select 
                      value={anoSelected || ""} 
                      onChange={(e) => selectAno(e.target.value)}
                      disabled={loadingDados}
                      style={{ marginLeft: "10px", padding: "5px" }}
                    >
                      <option value="">Selecione o ano</option>
                      {anosSelect().map(ano => (
                        <option key={ano} value={ano}>{ano}</option>
                      ))}
                    </select>
                    {loadingDados && (
                      <span style={{ marginLeft: "10px", color: "#12B2D5" }}>
                        Carregando dados...
                      </span>
                    )}
                  </div>
                  
                  <div style={{ fontSize: "14px", color: "#666" }}>
                    <strong>{indicadores.length}</strong> indicador{indicadores.length !== 1 ? 'es' : ''} encontrado{indicadores.length !== 1 ? 's' : ''}
                    {indicadores.some(ind => ind._hasError) && (
                      <span style={{ color: "#dc3545", marginLeft: "10px" }}>
                        | ⚠️ Alguns campos com erro
                      </span>
                    )}
                    {dadosCarregados.length > 0 && (
                      <span style={{ color: "#28a745", marginLeft: "10px" }}>
                        | ✅ {dadosCarregados.length} dado{dadosCarregados.length !== 1 ? 's' : ''} carregado{dadosCarregados.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  
                  {grupo && !loadingIndicadores && indicadores.some(ind => ind._hasError) && (
                    <button 
                      type="button"
                      onClick={() => {
                        const currentMenu = menus.find(menu => 
                          menu.menu_item?.some(item => item.nome_menu_item === grupo)
                        );
                        const menuItem = currentMenu?.menu_item?.find(item => item.nome_menu_item === grupo);
                        if (menuItem) {
                          getIndicadores(menuItem);
                        }
                      }}
                      style={{ 
                        padding: "6px 12px", 
                        fontSize: "12px", 
                        backgroundColor: "#dc3545", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginLeft: "10px"
                      }}
                    >
                      🔄 Tentar Novamente
                    </button>
                  )}
                </div>
              </div>

              <DivFormEixo>
                <DivFormConteudo 
                  active={!!grupo}
                  style={{ 
                    display: grupo ? "block" : "none",
                    visibility: grupo ? "visible" : "hidden",
                    opacity: grupo ? 1 : 0
                  }}
                >
                  <DivTitulo>
                    <DivTituloConteudo>{grupo}</DivTituloConteudo>
                  </DivTitulo>
                  

                  
                  {!grupo ? (
                    <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#f8f9fa" }}>
                      <p>👈 Selecione um item do menu lateral para começar</p>
                    </div>
                  ) : loadingIndicadores ? (
                    <div style={{ textAlign: "center", padding: "40px" }}>
                      <p>Carregando indicadores...</p>
                    </div>
                  ) : indicadores.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px" }}>
                      <p>Nenhum indicador encontrado para este grupo.</p>
                      <p style={{ fontSize: "12px", color: "#666" }}>
                        Grupo: {grupo} | Loading: {loadingIndicadores ? "true" : "false"}
                      </p>
                    </div>
                  ) : (
                    <div style={{ 
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      overflow: "hidden",
                      marginTop: "20px"
                    }}>
                      {/* Cabeçalho da Tabela */}
                      <div style={{
                        backgroundColor: "#1e88e5",
                        color: "white",
                        padding: "15px 0",
                        fontWeight: "600",
                        fontSize: "13px",
                        letterSpacing: "0.5px"
                      }}>
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: window.innerWidth > 768 
                            ? "180px 1fr 280px 100px" 
                            : "1fr",
                          gap: window.innerWidth > 768 ? "15px" : "10px",
                          alignItems: "center",
                          padding: "0 15px"
                        }}>
                          {window.innerWidth > 768 ? (
                            <>
                              <div>CÓDIGO</div>
                              <div>DESCRIÇÃO DO INDICADOR</div>
                              <div style={{ textAlign: "center" }}>VALOR - ANO: {anoSelected || "____"}</div>
                              <div style={{ textAlign: "center" }}>UNIDADE</div>
                            </>
                          ) : (
                            <div>INDICADORES - ANO: {anoSelected || "____"}</div>
                          )}
                        </div>
                      </div>

                      {/* Linhas da Tabela */}
                      {indicadores.map((indicador, index) => {
                        const tipoCampo = indicador.tiposCampo && indicador.tiposCampo.length > 0 ? indicador.tiposCampo[0] : null;
                        const isEven = index % 2 === 0;
                        
                        return (
                          <div 
                            key={indicador.id_indicador}
                            style={{
                              backgroundColor: isEven ? "#f8f9fa" : "#ffffff",
                              borderBottom: index < indicadores.length - 1 ? "1px solid #dee2e6" : "none",
                              padding: "15px 0",
                              transition: "background-color 0.2s ease"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#e8f4fd";
                              e.currentTarget.style.borderLeft = "3px solid #1e88e5";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = isEven ? "#f8f9fa" : "#ffffff";
                              e.currentTarget.style.borderLeft = "none";
                            }}
                          >
          {window.innerWidth > 768 ? (
                              <div style={{
                                display: "grid",
                                gridTemplateColumns: "180px 1fr 280px 100px",
                                gap: "15px",
                                alignItems: "center",
                                padding: "0 15px"
                              }}>
                                {/* Código */}
                                <div>
                                  <div style={{ 
                                    fontSize: "15px",
                                    fontWeight: "bold",
                                    color: "#1e88e5"
                                  }}>
                                    {indicador.codigo_indicador}
                                  </div>                                
                                </div>

                                {/* Descrição */}
                                <div style={{ 
                                  fontSize: "14px",
                                  color: "#495057",
                                  lineHeight: "1.3"
                                }}>
                                  {indicador.nome_indicador}
                                </div>

                                {/* Campo de Input */}
                                <div style={{ 
                                  display: "flex", 
                                  justifyContent: "center"
                                }}>
                                  {anoSelected ? (
                                    <div style={{ width: "260px" }}>
                                      <CampoIndicador 
                                        indicador={indicador}
                                        register={register}
                                        anoSelected={anoSelected}
                                        campoEnabled={campoEnabled}
                                        fieldStates={fieldStates}
                                        setFieldStates={setFieldStates}
                                        setValue={setValue}
                                      />
                                    </div>
                                  ) : (
                                    <input 
                                      type="text" 
                                      placeholder="Selecione um ano"
                                      disabled
                                      style={{ 
                                        width: "260px",
                                        backgroundColor: "#f8f9fa",
                                        border: "1px solid #dee2e6",
                                        borderRadius: "4px",
                                        padding: "8px 12px",
                                        color: "#6c757d",
                                        textAlign: "center",
                                        fontSize: "12px"
                                      }}
                                    />
                                  )}
                                </div>

                                {/* Unidade */}
                                <div style={{ 
                                  textAlign: "center",
                                  fontSize: "12px",
                                  color: "#495057"
                                }}>
                                  <div style={{ 
                                    fontWeight: "500",
                                    padding: "5px 6px",
                                    backgroundColor: "#e9ecef",
                                    borderRadius: "3px",
                                    fontSize: "11px"
                                  }}>
                                    {indicador.unidade_indicador || "-"}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              /* Layout Mobile */
                              <div style={{ 
                                padding: "0 15px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px"
                              }}>
                                <div style={{ 
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center"
                                }}>
                                  <div>
                                    <div style={{ 
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                      color: "#1e88e5"
                                    }}>
                                      {indicador.codigo_indicador}
                                    </div>
                                    <div style={{ 
                                      fontSize: "11px", 
                                      color: "#6c757d"
                                    }}>
                                      {indicador.unidade_indicador || "-"}
                                    </div>
                                  </div>
                                  {tipoCampo && (
                                    <div style={{ 
                                      fontSize: "10px", 
                                      color: "#6c757d",
                                      backgroundColor: "#f8f9fa",
                                      padding: "3px 6px",
                                      borderRadius: "3px"
                                    }}>
                                      {tipoCampo.type}
                                    </div>
                                  )}
                                </div>
                                
                                <div style={{ 
                                  fontSize: "13px",
                                  color: "#495057",
                                  lineHeight: "1.3",
                                  marginBottom: "8px"
                                }}>
                                  {indicador.nome_indicador}
                                </div>

                                {anoSelected ? (
                                  <CampoIndicador 
                                    indicador={indicador}
                                    register={register}
                                    anoSelected={anoSelected}
                                    campoEnabled={campoEnabled}
                                    fieldStates={fieldStates}
                                    setFieldStates={setFieldStates}
                                    setValue={setValue}
                                  />
                                ) : (
                                  <input 
                                    type="text" 
                                    placeholder="Selecione um ano primeiro"
                                    disabled
                                    style={{ 
                                      backgroundColor: "#f8f9fa",
                                      border: "1px solid #dee2e6",
                                      borderRadius: "4px",
                                      padding: "8px 12px",
                                      color: "#6c757d",
                                      textAlign: "center"
                                    }}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </DivFormConteudo>
                {isEditor && indicadores.length > 0 && anoSelected && (
                  <div style={{ 
                    marginTop: "30px", 
                    padding: "20px", 
                    textAlign: "center",
                    borderTop: "1px solid #e1e5e9"
                  }}>
                    <button 
                      type="submit"
                      style={{
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        padding: "12px 40px",
                        fontSize: "16px",
                        fontWeight: "500",
                        cursor: "pointer",
                        boxShadow: "0 2px 4px rgba(40,167,69,0.2)",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#218838";
                        e.currentTarget.style.boxShadow = "0 4px 8px rgba(40,167,69,0.3)";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#28a745";
                        e.currentTarget.style.boxShadow = "0 2px 4px rgba(40,167,69,0.2)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      💾 Salvar Dados dos Indicadores
                    </button>
                  </div>
                )}
              </DivFormEixo>
            </DivForm>
          </Form>
        </DivCenter>
      </BodyDashboard>
    </Container>
  );
}
