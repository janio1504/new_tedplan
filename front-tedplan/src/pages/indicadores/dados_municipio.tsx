import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  submenuFields,
  getSubmenuName,
  getAllSubmenuFields,
  getRequiredFields,
} from "../../utils/submenuFields";
import {
  stepToSubmenuMap,
  getStepSubmenuName,
  validateStepIndex,
} from "../../utils/prestadoresSteps";
import { FaBars, FaList, FaCaretDown, FaLink } from "react-icons/fa";
import {
  Container,
  Sidebar,
  SidebarItem,
  MainContent,
  DivCenter,
  DivTituloForm,
  Form,
  InputP,
  InputM,
  InputG,
  SubmitButton,
  SubmitButtonContainer,
  DivEixo,
  TextArea,
  DivTextArea,
  StepContent,
  StepLabel,
  StepperNavigation,
  StepperWrapper,
  StepperContainer,
  StepperButton,
  DivFormCadastro,
  StepButton,
  BreadCrumbStyle,
  ExpandButton,
  CollapseButton,
} from "../../styles/indicadores";
import HeadIndicadores from "../../components/headIndicadores";
import MenuIndicadores from "../../components/MenuIndicadoresCadastro";

import "suneditor/dist/css/suneditor.min.css";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import MenuHorizontal from "../../components/MenuHorizontal";
import { Municipio } from "../../types";
import { useMunicipio } from "../../contexts/MunicipioContext";
const InputMask = require("react-input-mask");
import { onlyLettersAndCharacters, toTitleCase, anosSelect } from "@/util/util";
import api from "@/services/api";
import { Loading } from "@/components/Loading";
import styled from "styled-components";
import Link from "next/link";
import { DivFormConteudo } from "../../styles/drenagem-indicadores";
import { DivTitulo, DivTituloConteudo, DivFormEixo } from "../../styles/financeiro";
import { DivForm, DivTituloForm as DivTituloFormIndicadores } from "../../styles/esgoto-indicadores";
import { getAPIClient } from "../../services/axios";

interface MunicipioProps {
  municipio: Municipio;
}

export default function Cadastro({ municipio }: MunicipioProps) {
  const { dadosMunicipio, loadMunicipio, loading, updateMunicipio } =
    useMunicipio();
  // Formulário principal para os formulários estáticos (dadosMunicipio, titularServicos, etc.)
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<Municipio>({});
  
  // Formulário separado para os indicadores dinâmicos
  const {
    register: registerIndicadores,
    handleSubmit: handleSubmitIndicadores,
    reset: resetIndicadores,
    formState: { errors: errorsIndicadores },
  } = useForm<any>({});
  
  const [activeForm, setActiveForm] = useState("dadosMunicipio");
  const { usuario, signOut } = useAuth();
  const [content, setContent] = useState("");
  const [responsaveisSimisab, setResponsaveisSimisab] = useState<any[]>([]);
  const [copiaParaEsgoto, setCopiaParaEsgoto] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [menus, setMenus] = useState([]);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [indicadores, setIndicadores] = useState<any[]>([]);
  const [anoSelected, setAnoSelected] = useState<string | null>(null);
  const [grupo, setGrupo] = useState<string | null>(null);
  const [loadingIndicadores, setLoadingIndicadores] = useState(false);
  const [dadosCarregados, setDadosCarregados] = useState<any[]>([]);
  const [loadingDados, setLoadingDados] = useState(false);
  const [fieldStates, setFieldStates] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    getMenus();
  }, []);

  async function getMenus() {
    try {
      // Buscar menus do módulo Cadastros (id_modulo = 3)
      const res = await api.get(`menus/modulo/3`);
      // Filtrar apenas menus sem eixo (id_eixo é null, undefined ou 0)
      const menusData = Array.isArray(res.data) ? res.data : [];
      const menusSemEixo = menusData.filter(
        (menu) => !menu.id_eixo || menu.id_eixo === null || menu.id_eixo === undefined
      );
      setMenus(menusSemEixo);
    } catch (error) {
      console.error("Erro ao carregar menus:", error);
      setMenus([]);
    }
  }
  
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

  const popUrbana = watch("dd_populacao_urbana");
  const popRural = watch("dd_populacao_rural");

  const estabUrbano = watch("OGM4001");
  const estabRural = watch("OGM4002");

  const domiUrbano = watch("OGM4004");
  const domiRural = watch("OGM4005");

  const viaPublicaPavimento = watch("OGM4007");
  const viaPublicaSemPavimento = watch("OGM4008");

  useEffect(() => {
    try {
      const urban = parseInt(popUrbana || "0");
      const rural = parseInt(popRural || "0");
      const total = urban + rural;

      if (!isNaN(total) && total > 0) {
        setValue("dd_populacao_total", total.toString(), {
          shouldValidate: false,
          shouldDirty: false,
        });
      } else if (urban === 0 && rural === 0) {
        setValue("dd_populacao_total", "", {
          shouldValidate: false,
          shouldDirty: false,
        });
      }
    } catch (error) {
      console.error("Error calculating total population:", error);
    }
  }, [popUrbana, popRural, setValue]);

  useEffect(() => {
    try {
      const urban = parseInt(estabUrbano || "0");
      const rural = parseInt(estabRural || "0");
      const total = urban + rural;

      if (!isNaN(total) && total > 0) {
        setValue("OGM4003", total.toString(), {
          shouldValidate: false,
          shouldDirty: false,
        });
      } else if (urban === 0 && rural === 0) {
        setValue("OGM4003", "", { shouldValidate: false, shouldDirty: false });
      }
    } catch (error) {
      console.error("Error calculating total establishments:", error);
    }
  }, [estabUrbano, estabRural, setValue]);

  useEffect(() => {
    try {
      const urban = parseInt(domiUrbano || "0");
      const rural = parseInt(domiRural || "0");
      const total = urban + rural;

      if (!isNaN(total) && total > 0) {
        setValue("OGM4006", total.toString(), {
          shouldValidate: false,
          shouldDirty: false,
        });
      } else if (urban === 0 && rural === 0) {
        setValue("OGM4006", "", { shouldValidate: false, shouldDirty: false });
      }
    } catch (error) {
      console.error("Error calculating total domiciles:", error);
    }
  }, [domiUrbano, domiRural, setValue]);

  useEffect(() => {
    try {
      const pavimento = parseFloat(viaPublicaPavimento || "0");
      const semPavimento = parseFloat(viaPublicaSemPavimento || "0");
      const total = pavimento + semPavimento;

      if (!isNaN(total) && total > 0) {
        setValue("OGM4009", total.toFixed(2), {
          shouldValidate: false,
          shouldDirty: false,
        });
      } else if (pavimento === 0 && semPavimento === 0) {
        setValue("OGM4009", "", { shouldValidate: false, shouldDirty: false });
      }
    } catch (error) {
      console.error("Error calculating total public roads:", error);
    }
  }, [viaPublicaPavimento, viaPublicaSemPavimento, setValue]);

  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    "Abastecimento de Água",
    "Esgotamento Sanitário",
    "Drenagem e Águas Pluviais",
    "Limpeza Pública e Resíduos Sólidos",
  ];

  useEffect(() => {
    if (usuario) {
      loadMunicipio();
    }
  }, [usuario]);

  useEffect(() => {
    if (dadosMunicipio) {
      Object.entries(dadosMunicipio).forEach(([key, value]) => {
        // Normalizar campos com máscara ao carregar do banco
        if (value && typeof value === "string") {
          // Campos CNPJ: remover máscara (manter apenas números)
          if (key.includes("_cnpj")) {
            const normalizedValue = value.replace(/\D/g, "");
            setValue(key as keyof Municipio, normalizedValue as any, {
              shouldValidate: false,
              shouldDirty: false,
            });
            return;
          }
          // Campos telefone: remover máscara (manter apenas números)
          if (key.includes("_telefone")) {
            const normalizedValue = value.replace(/\D/g, "");
            setValue(key as keyof Municipio, normalizedValue as any, {
              shouldValidate: false,
              shouldDirty: false,
            });
            return;
          }
          // Campos CEP: remover máscara (manter apenas números)
          if (key.includes("_cep") && !key.includes("_endereco")) {
            const normalizedValue = value.replace(/\D/g, "");
            setValue(key as keyof Municipio, normalizedValue as any, {
              shouldValidate: false,
              shouldDirty: false,
            });
            return;
          }
        }
        const isCalculatedField = [
          "dd_populacao_total",
          "OGM4003",
          "OGM4006",
          "OGM4009",
        ].includes(key);
        if (!isCalculatedField) {
          setValue(key as keyof Municipio, value, {
            shouldValidate: false,
            shouldDirty: false,
          });
        }
      });
    }
    getResponsaveisSimisab();
  }, [dadosMunicipio, setValue]);

  useEffect(() => {
    if (copiaParaEsgoto && activeStep === 0) {
      const fieldsToWatch = [
        "aa_secretaria_setor_responsavel",
        "aa_abrangencia",
        "aa_natureza_juridica",
        "aa_cnpj",
        "aa_telefone",
        "aa_cep",
        "aa_endereco",
        "aa_numero",
        "aa_bairro",
        "aa_responsavel",
        "aa_cargo",
        "aa_email",
      ];

      const subscription = watch((value, { name }) => {
        if (fieldsToWatch.includes(name)) {
          const sanitaryField = name.replace("aa_", "es_") as keyof Municipio;
          setValue(sanitaryField, value[name]);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [copiaParaEsgoto, activeStep, watch, setValue]);

  const handleNext = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    // Prevenir comportamento padrão do botão
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      // Salvar o step atual antes de avançar
      // Criar uma Promise que resolve apenas se o salvamento for bem-sucedido
      const saveSuccess = await new Promise<boolean>(async (resolve) => {
        const stepIndex = activeStep;
        const submenuName = getStepSubmenuName(stepIndex);

        if (!submenuName) {
          resolve(false);
          return;
        }

        // Verificar permissão
        if (usuario?.id_permissao === 4) {
          toast.warning("Você não tem permissão para salvar dados", {
            position: "top-right",
            autoClose: 3000,
          });
          resolve(false);
          return;
        }

        // Validar apenas campos do submenu
        const isValid = await validateSubmenu(submenuName);
        if (!isValid) {
          const submenuDisplayName = getSubmenuName(submenuName);
          toast.error(
            `Por favor, preencha todos os campos obrigatórios de ${submenuDisplayName}`,
            {
              position: "top-right",
              autoClose: 5000,
            }
          );
          resolve(false);
          return;
        }

        // Se chegou aqui, a validação passou, então salvar
        try {
          const submenuData = getSubmenuData(submenuName);
          const dataKeys = Object.keys(submenuData).filter(
            (key) => key !== "id_municipio"
          );

          if (dataKeys.length === 0) {
            toast.warning("Nenhum dado para salvar", {
              position: "top-right",
              autoClose: 3000,
            });
            resolve(false);
            return;
          }

          const loadingToast = toast.loading("Salvando dados...", {
            position: "top-right",
          });

          await updateMunicipio(submenuData);
          await loadMunicipio();

          toast.dismiss(loadingToast);
          const submenuDisplayName = getSubmenuName(submenuName);
          toast.success(`${submenuDisplayName} salvos com sucesso!`, {
            position: "top-right",
            autoClose: 3000,
          });

          resolve(true);
        } catch (error) {
          console.error("Erro ao salvar submenu:", error);
          const submenuDisplayName = getSubmenuName(submenuName);
          toast.error(
            `Erro ao salvar ${submenuDisplayName}. Tente novamente.`,
            {
              position: "top-right",
              autoClose: 5000,
            }
          );
          resolve(false);
        }
      });

      // Se o salvamento foi bem-sucedido e estamos no step 0 com checkbox marcado
      if (saveSuccess && activeStep === 0 && copiaParaEsgoto) {
        // Também salvar os dados de Esgotamento Sanitário (clonados de Abastecimento de Água)
        try {
          const loadingToastEsgoto = toast.loading(
            "Salvando Esgotamento Sanitário...",
            {
              position: "top-right",
            }
          );

          // Obter dados de Abastecimento de Água
          const allData = getValues();

          // Criar objeto com dados clonados de aa_* para es_*
          const esgotoData: any = {
            id_municipio: usuario?.id_municipio,
          };

          // Mapear campos de aa_* para es_*
          const fieldMapping = [
            {
              from: "aa_secretaria_setor_responsavel",
              to: "es_secretaria_setor_responsavel",
            },
            { from: "aa_abrangencia", to: "es_abrangencia" },
            { from: "aa_natureza_juridica", to: "es_natureza_juridica" },
            { from: "aa_cnpj", to: "es_cnpj" },
            { from: "aa_telefone", to: "es_telefone" },
            { from: "aa_cep", to: "es_cep" },
            { from: "aa_endereco", to: "es_endereco" },
            { from: "aa_numero", to: "es_numero" },
            { from: "aa_bairro", to: "es_bairro" },
            { from: "aa_responsavel", to: "es_responsavel" },
            { from: "aa_cargo", to: "es_cargo" },
            { from: "aa_email", to: "es_email" },
          ];

          // Clonar apenas campos que têm valor
          fieldMapping.forEach(({ from, to }) => {
            if (
              allData[from] !== undefined &&
              allData[from] !== null &&
              allData[from] !== ""
            ) {
              esgotoData[to] = allData[from];
            }
          });

          // Incluir id_ps_esgotamento_sanitario se existir
          if (allData.id_ps_esgotamento_sanitario !== undefined) {
            esgotoData.id_ps_esgotamento_sanitario =
              allData.id_ps_esgotamento_sanitario || null;
          }

          // Verificar se há dados para salvar
          const dataKeys = Object.keys(esgotoData).filter(
            (key) =>
              key !== "id_municipio" && key !== "id_ps_esgotamento_sanitario"
          );

          if (dataKeys.length > 0) {
            // Salvar dados de Esgotamento Sanitário
            await updateMunicipio(esgotoData);
            await loadMunicipio();

            toast.dismiss(loadingToastEsgoto);
            toast.success("Esgotamento Sanitário salvo com sucesso!", {
              position: "top-right",
              autoClose: 3000,
            });
          } else {
            toast.dismiss(loadingToastEsgoto);
          }

          // Pular para o step 2 (Drenagem e Águas Pluviais)
          setActiveStep(2);
        } catch (error) {
          console.error("Erro ao salvar Esgotamento Sanitário:", error);
          toast.error(
            "Erro ao salvar Esgotamento Sanitário. Tente novamente.",
            {
              position: "top-right",
              autoClose: 5000,
            }
          );
          // Mesmo com erro, pular para o próximo step
          setActiveStep(2);
        }
      } else if (saveSuccess && activeStep < steps.length - 1) {
        // Avançar normalmente para o próximo step
        setActiveStep((prevStep) => prevStep + 1);
      }
    } catch (error) {
      console.error("Erro em handleNext:", error);
      toast.error("Erro ao processar. Tente novamente.", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleStepClick = (step: number) => {
    setActiveStep(step);
  };

  /**
   * Valida apenas os campos do submenu especificado
   * Fase 2: Função de Validação por Submenu
   */
  const validateSubmenu = async (submenuName: string): Promise<boolean> => {
    try {
      // Obter todos os dados do formulário para verificar condições
      const formData = getValues();

      // Obter campos obrigatórios (incluindo condicionais) apenas do submenu específico
      const requiredFields = getRequiredFields(submenuName, formData);

      if (requiredFields.length === 0) {
        return true;
      }

      // Normalizar valores de campos com máscara antes de validar
      // Apenas normalizar campos que pertencem ao submenu sendo validado
      const allSubmenuFields = getAllSubmenuFields(submenuName);
      const fieldsToNormalize = [
        // Prestadores de Serviços
        "aa_cnpj",
        "es_cnpj",
        "da_cnpj",
        "rs_cnpj",
        "aa_telefone",
        "es_telefone",
        "da_telefone",
        "rs_telefone",
        "aa_cep",
        "es_cep",
        "da_cep",
        "rs_cep",
        // Controle Social e Responsável SIMISAB
        "cs_telefone",
        "simisab_telefone",
        // Outros
        "municipio_telefone",
        "ts_telefone",
        "ts_telefone_comercial",
        "rf_telefone",
      ];

      // Normalizar apenas campos que pertencem ao submenu sendo validado
      fieldsToNormalize.forEach((field) => {
        if (
          allSubmenuFields.includes(field) &&
          formData[field] &&
          typeof formData[field] === "string"
        ) {
          const normalizedValue = formData[field].replace(/\D/g, "");
          if (normalizedValue !== formData[field]) {
            setValue(field as any, normalizedValue, { shouldValidate: false });
          }
        }
      });

      // Validar apenas os campos obrigatórios do submenu específico
      // O trigger do react-hook-form valida APENAS os campos passados no array
      // Usar shouldFocus: false para não focar em campos de outras abas
      const validationResult = await trigger(requiredFields as any, {
        shouldFocus: false,
      });

      // Se o trigger retornou true, todos os campos do submenu são válidos
      if (validationResult) {
        return true;
      }

      // Se o trigger retornou false, verificar quais campos do submenu falharam
      // Aguardar um momento para que os erros sejam atualizados no estado do react-hook-form
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verificar se há erros APENAS nos campos do submenu sendo validado
      // Ignorar erros de campos de outras abas
      const failedFields: string[] = [];
      requiredFields.forEach((field) => {
        const fieldError = errors[field as keyof typeof errors];
        if (fieldError !== undefined) {
          failedFields.push(field);
        }
      });

      // Se há erros nos campos do submenu, retornar false
      if (failedFields.length > 0) {
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Erro ao validar submenu ${submenuName}:`, error);
      return false;
    }
  };

  /**
   * Filtra e retorna apenas os dados do submenu especificado
   * Fase 2: Função de Filtragem de Dados
   */
  const getSubmenuData = (submenuName: string): any => {
    try {
      const allData = getValues();
      const submenuFieldsList = getAllSubmenuFields(submenuName);

      const submenuData: any = {
        id_municipio: usuario?.id_municipio,
      };

      submenuFieldsList.forEach((field) => {
        const isOptionalId = field.startsWith("id_");
        if (isOptionalId) {
          submenuData[field] = allData[field] || null;
        } else {
          const isCalculatedField = [
            "dd_populacao_total",
            "OGM4003",
            "OGM4006",
            "OGM4009",
          ].includes(field);
          if (isCalculatedField) {
            if (
              allData[field] !== undefined &&
              allData[field] !== null &&
              allData[field] !== ""
            ) {
              submenuData[field] = allData[field];
            }
          } else if (
            allData[field] !== undefined &&
            allData[field] !== null &&
            allData[field] !== ""
          ) {
            submenuData[field] = allData[field];
          }
        }
      });

      const config = submenuFields[submenuName];
      if (config?.conditional) {
        config.conditional.forEach((conditional) => {
          if (conditional.condition(allData)) {
            if (
              allData[conditional.field] !== undefined &&
              allData[conditional.field] !== null &&
              allData[conditional.field] !== ""
            ) {
              submenuData[conditional.field] = allData[conditional.field];
            }
          }
        });
      }

      return submenuData;
    } catch (error) {
      console.error(`Erro ao obter dados do submenu ${submenuName}:`, error);
      return { id_municipio: usuario?.id_municipio };
    }
  };

  /**
   * Salva apenas os dados do submenu especificado
   * Fase 3: Função de Salvamento Individual
   */
  const handleSaveSubmenu = async (submenuName: string) => {
    try {
      // Verificar permissão
      if (usuario?.id_permissao === 4) {
        toast.warning("Você não tem permissão para salvar dados", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      // Validar apenas campos do submenu
      const isValid = await validateSubmenu(submenuName);
      if (!isValid) {
        const submenuDisplayName = getSubmenuName(submenuName);
        toast.error(
          `Por favor, preencha todos os campos obrigatórios de ${submenuDisplayName}`,
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
        return;
      }

      // Obter dados filtrados do submenu
      const submenuData = getSubmenuData(submenuName);

      // Verificar se há dados para salvar
      const dataKeys = Object.keys(submenuData).filter(
        (key) => key !== "id_municipio"
      );
      if (dataKeys.length === 0) {
        toast.warning("Nenhum dado para salvar", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      // Mostrar toast de carregamento
      const loadingToast = toast.loading("Salvando dados...", {
        position: "top-right",
      });

      // Salvar no backend
      await updateMunicipio(submenuData);

      // Recarregar dados do município
      await loadMunicipio();

      // Fechar toast de carregamento e mostrar sucesso
      toast.dismiss(loadingToast);
      const submenuDisplayName = getSubmenuName(submenuName);
      toast.success(`${submenuDisplayName} salvos com sucesso!`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Erro ao salvar submenu:", error);
      const submenuDisplayName = getSubmenuName(submenuName);
      toast.error(`Erro ao salvar ${submenuDisplayName}. Tente novamente.`, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  /**
   * Salva apenas os dados do step ativo do Stepper de Prestadores de Serviços
   * Fase 2: Função de Salvamento por Step
   */
  const handleSaveStep = async (stepIndex: number) => {
    // Validar stepIndex usando função auxiliar
    if (!validateStepIndex(stepIndex)) {
      console.error(`Step index ${stepIndex} não possui submenu mapeado`);
      toast.error("Erro: Step inválido", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Obter nome do submenu usando função auxiliar
    const submenuName = getStepSubmenuName(stepIndex);

    if (!submenuName) {
      console.error(`Step index ${stepIndex} não possui submenu mapeado`);
      toast.error("Erro: Step inválido", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Usar a função handleSaveSubmenu existente
    await handleSaveSubmenu(submenuName);
  };

  /**
   * Função original mantida para compatibilidade (pode ser removida após Fase 4)
   */
  async function handleCadastro(data: any) {
    try {
      if (usuario?.id_permissao === 4) {
        return;
      }

      const submitData = {
        ...data,
        id_municipio: usuario?.id_municipio,
      };

      await updateMunicipio(submitData);

      await loadMunicipio();

      toast.success("Dados gravados com sucesso!", {});
    } catch (error) {
      console.error("Erro ao gravar dados:", error);
      toast.error("Erro ao gravar dados", {});
    }
  }

  async function getResponsaveisSimisab() {
    try {
      const response = await api.get(
        "get-responsaveis-simisab/" + usuario?.id_municipio
      );
      if (Array.isArray(response.data)) {
        setResponsaveisSimisab(response.data);
      } else {
        console.error("Expected array but got:", typeof response.data);
        setResponsaveisSimisab([]);
      }
    } catch (error) {
      console.error("Error fetching responsaveis simisab:", error);
      setResponsaveisSimisab([]);
    }
  }

  function handleOnChange(content) {
    setContent(content);
  }

  async function getResSimisab(id) {
    if (id) {
      let resSimisab = responsaveisSimisab.find((res) => res.id_usuario == id);
      if (resSimisab) {
        setValue("simisab_responsavel", resSimisab.nome);
        setValue("simisab_telefone", resSimisab.telefone);
        setValue("simisab_email", resSimisab.email);
      }
    }
  }

  const [activeTab, setActiveTab] = useState("controleSocial");

  const TabContainer = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  `;

  const TabButton = styled.button<{ active: boolean }>`
    padding: 10px 20px;
    border: none;
    background: ${(props) => (props.active ? "#007bff" : "#e9ecef")};
    color: ${(props) => (props.active ? "white" : "black")};
    cursor: pointer;
    border-radius: 4px;
  `;

  const TableContainer = styled.div`
    margin-bottom: 50px;
    background-color: #fff;
    border-radius: 8px;

    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    margin-top: 20px;

    table {
      width: 100%;
      border-collapse: collapse;

      td {
        padding: 12px 16px;
        vertical-align: middle;
        border-bottom: 1px solid #eee;

        &:first-child {
          width: 20px;
        }

        &:nth-child(2) {
          width: 80%;
        }

        &:nth-child(3) {
          width: 10%;
        }
        &:nth-child(4) {
          width: 150px;
        }

        input,
        select {
          width: 150px;
          height: 36px;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background-color: #fff;
          font-size: 14px;
          margin: 0;

          &:disabled {
            background-color: #f5f5f5;
            cursor: not-allowed;
          }

          &:focus {
            border-color: #0085bd;
            outline: none;
            box-shadow: 0 0 0 2px rgba(0, 133, 189, 0.2);
          }
        }

        span {
          color: #ff0000;
          margin-left: 4px;
        }
      }

      tr {
        &:hover {
          background-color: #f9f9f9;
        }
      }
    }
  `;

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Styled components para menu expansível
  const MenuHeader = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== '$isOpen',
  })<{ $isOpen: boolean }>`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    font-weight: bold;
    color: ${props => props.$isOpen ? "#0085bd" : "#000"};
    transition: color 0.3s ease;
    user-select: none;

    &:hover {
      color: #0085bd;
    }

    > div:first-child {
      display: flex;
      align-items: center;
      gap: 8px;
      
      svg {
        color: ${props => props.$isOpen ? "#0085bd" : "#666"};
        transition: color 0.3s ease;
        font-size: 14px;
      }
    }

    > svg:last-child {
      transition: transform 0.3s ease;
      transform: ${props => props.$isOpen ? "rotate(180deg)" : "rotate(0deg)"};
      font-size: 14px;
      color: ${props => props.$isOpen ? "#0085bd" : "#666"};
    }

    &:hover > svg:last-child,
    &:hover > div:first-child svg {
      color: #0085bd;
    }
  `;

  const MenuItemsContainer = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== '$isOpen',
  })<{ $isOpen: boolean }>`
    max-height: ${props => props.$isOpen ? "1000px" : "0"};
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;
    opacity: ${props => props.$isOpen ? "1" : "0"};
    transition: max-height 0.3s ease-in-out, opacity 0.2s ease-in-out;
    padding-left: 16px;
    padding-top: 4px;
    margin-top: 0;
    margin-bottom: 0;
  `;

  const StaticMenuHeader = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== '$isActive',
  })<{ $isActive?: boolean }>`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    font-weight: bold;
    color: ${props => props.$isActive ? "#0085bd" : "#000"};
    transition: color 0.3s ease;
    user-select: none;

    &:hover {
      color: #0085bd;
    }

    > div:first-child {
      display: flex;
      align-items: center;
      gap: 8px;
      
      svg {
        color: ${props => props.$isActive ? "#0085bd" : "#666"};
        transition: color 0.3s ease;
        font-size: 14px;
      }
    }

    &:hover > div:first-child svg {
      color: #0085bd;
    }
  `;

  // Funções para gerenciar indicadores (similar a prestacao-servico-agua.tsx)
  async function getIndicadores(menu_item: {
    id_menu_item: number;
    nome_menu_item: string;
  }) {
    setGrupo(menu_item.nome_menu_item);
    setLoadingIndicadores(true);

    try {
      const resIndicadores = await api.get(
        `indicadores-novo/menu-item/${menu_item?.id_menu_item}`
      );
      const indicadoresData = resIndicadores.data || [];

      if (indicadoresData.length === 0) {
        setIndicadores([]);
        return;
      }

      setIndicadores(indicadoresData);

      const indicadoresComTipos = [];

      for (let i = 0; i < indicadoresData.length; i++) {
        const indicador = indicadoresData[i];

        try {
          const tiposResponse = await api.get(
            `tipos-campo/indicador/${indicador.id_indicador}`
          );
          const tiposCampo = tiposResponse.data || [];

          const tiposComOpcoes = [];
          for (const tipo of tiposCampo) {
            if (tipo.type === "select") {
              try {
                const opcoesResponse = await api.get(
                  `select-options/tipo-campo/${tipo.id_tipo_campo_indicador}`
                );
                const opcoes = opcoesResponse.data || [];
                tiposComOpcoes.push({
                  ...tipo,
                  selectOptions: opcoes,
                });
              } catch (error) {
                tiposComOpcoes.push(tipo);
              }
            } else if (tipo.type === "checkbox") {
              try {
                const checkBoxResponse = await api.get(
                  `item-check-box/indicador/${indicador.id_indicador}`
                );
                const checkBoxItems = checkBoxResponse.data || [];
                tiposComOpcoes.push({
                  ...tipo,
                  checkBoxItems: checkBoxItems,
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
            tiposCampo: tiposComOpcoes,
          });
        } catch (error) {
          indicadoresComTipos.push({
            ...indicador,
            tiposCampo: [],
          });
        }
      }

      setIndicadores(indicadoresComTipos);

      if (anoSelected && usuario?.id_municipio) {
        await carregarDadosExistentes(anoSelected);
      }
    } catch (error) {
      console.error("Erro ao carregar indicadores:", error);
      toast.error("Erro ao carregar indicadores", {
        position: "top-right",
        autoClose: 7000,
      });
      setIndicadores([]);
    } finally {
      setLoadingIndicadores(false);
    }
  }

  async function selectAno(ano: string) {
    setAnoSelected(ano);

    if (ano && usuario?.id_municipio) {
      await carregarDadosExistentes(ano);
    } else {
      setDadosCarregados([]);
      resetIndicadores();
    }
  }

  async function carregarDadosExistentes(ano: string) {
    if (!usuario?.id_municipio || !ano) return;

    setLoadingDados(true);

    try {
      const apiClient = getAPIClient();

      const response = await apiClient.get(
        `/indicadores-municipio/municipio/${usuario.id_municipio}?ano=${ano}`
      );
      const dados = response.data || [];
      setDadosCarregados(dados);

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
    const valoresFormulario = {};

    dados.forEach((dado) => {
      const codigoIndicador = dado.codigo_indicador;
      const ano = dado.ano;
      const valor = dado.valor_indicador;

      const fieldName = `${codigoIndicador}_${ano}`;
      valoresFormulario[fieldName] = valor;
    });

    resetIndicadores(valoresFormulario);
  }

  async function handleCadastroIndicadores(data: any) {
    try {
      if (usuario?.id_permissao === 4) {
        toast.error("Você não tem permissão para editar!", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }

      if (!usuario || !usuario.id_municipio) {
        toast.error("Erro: Dados do usuário não disponíveis!", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }

      if (!anoSelected) {
        toast.error("Erro: Ano não selecionado!", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }

      const valoresIndicadores = [];

      Object.keys(data).forEach((key) => {
        const valor = data[key];

        if (valor !== null && valor !== undefined && valor !== "") {
          const parts = key.split("_");
          const codigoIndicador = parts[0];

          valoresIndicadores.push({
            codigo_indicador: codigoIndicador,
            ano: parseInt(anoSelected),
            valor_indicador: valor,
            id_municipio: usuario.id_municipio,
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

      const apiClient = getAPIClient();

      try {
        const existingDataResponse = await apiClient.get(
          `/indicadores-municipio/municipio/${usuario.id_municipio}?ano=${anoSelected}`
        );

        const existingData = existingDataResponse.data || [];

        if (existingData.length > 0) {
          const existingDataMap = new Map();
          existingData.forEach((record) => {
            const key = `${record.codigo_indicador}_${record.ano}`;
            existingDataMap.set(key, record);
          });

          for (const valorIndicador of valoresIndicadores) {
            const key = `${valorIndicador.codigo_indicador}_${valorIndicador.ano}`;
            const existingRecord = existingDataMap.get(key);

            try {
              if (existingRecord) {
                await apiClient.put(
                  `/indicadores-municipio/${existingRecord.id_incicador_municipio}`,
                  valorIndicador
                );
              } else {
                await apiClient.post("/indicadores-municipio", valorIndicador);
              }
            } catch (saveError) {
              console.error("Erro ao salvar/atualizar valor:", valorIndicador, saveError);
              throw saveError;
            }
          }

          toast.success("Dados atualizados com sucesso!", {
            position: "top-right",
            autoClose: 5000,
          });
        } else {
          for (const valorIndicador of valoresIndicadores) {
            await apiClient.post("/indicadores-municipio", valorIndicador);
          }

          toast.success("Dados salvos com sucesso!", {
            position: "top-right",
            autoClose: 5000,
          });
        }
      } catch (error) {
        console.error("Erro ao verificar dados existentes:", error);

        for (const valorIndicador of valoresIndicadores) {
          try {
            await apiClient.post("/indicadores-municipio", valorIndicador);
          } catch (saveError) {
            console.error("Erro ao salvar valor:", valorIndicador, saveError);
            throw saveError;
          }
        }

        toast.success("Dados salvos com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      toast.error("Erro ao salvar dados!", {
        position: "top-right",
        autoClose: 7000,
      });
    }
  }

  // Verificar se um menu item dinâmico está ativo (não é um dos formulários estáticos)
  const isDynamicMenuItemActive = grupo && !["dadosMunicipio", "titularServicos", "prestadoresServicos", "reguladorFiscalizador", "controleSocial", "dadosGeograficos", "dadosDemograficos"].includes(activeForm);

  return (
    <Container>
      {loading && <Loading />}

      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuHorizontal
        municipio={dadosMunicipio?.municipio_nome}
      ></MenuHorizontal>
      <MenuIndicadores></MenuIndicadores>

      {isCollapsed ? (
        <ExpandButton onClick={toggleSidebar}>
          <FaBars />
        </ExpandButton>
      ) : (
        <Sidebar $isCollapsed={isCollapsed}>
          <CollapseButton onClick={toggleSidebar}>
            <FaBars />
          </CollapseButton>
          <StaticMenuHeader
            $isActive={activeForm === "dadosMunicipio"}
            onClick={() => setActiveForm("dadosMunicipio")}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaList style={{ fontSize: "14px" }} />
              Dados do Município
            </div>
          </StaticMenuHeader>
          <StaticMenuHeader
            $isActive={activeForm === "titularServicos"}
            onClick={() => setActiveForm("titularServicos")}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaList style={{ fontSize: "14px" }} />
              Titular dos Serviços
            </div>
          </StaticMenuHeader>
          <StaticMenuHeader
            $isActive={activeForm === "prestadoresServicos"}
            onClick={() => setActiveForm("prestadoresServicos")}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaList style={{ fontSize: "14px" }} />
              Prestadores de Serviços
            </div>
          </StaticMenuHeader>
          <StaticMenuHeader
            $isActive={activeForm === "reguladorFiscalizador"}
            onClick={() => setActiveForm("reguladorFiscalizador")}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaList style={{ fontSize: "14px" }} />
              Regulador e Fiscalizador
            </div>
          </StaticMenuHeader>
          <StaticMenuHeader
            $isActive={activeForm === "controleSocial"}
            onClick={() => setActiveForm("controleSocial")}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaList style={{ fontSize: "14px" }} />
              Controle Social & Responsavel pelo SIMISAB
            </div>
          </StaticMenuHeader>
          {/* <SidebarItem
            active={activeForm === "dadosGeograficos"}
            onClick={() => setActiveForm("dadosGeograficos")}
          >
            Dados Geográficos
          </SidebarItem>
          <SidebarItem
            active={activeForm === "dadosDemograficos"}
            onClick={() => setActiveForm("dadosDemograficos")}
          >
            Dados Demográficos
          </SidebarItem> */}
          {menus?.map((menu) => {
            const isOpen = openMenuId === menu.id_menu;
            return (
              <div key={menu.id_menu}>
                <MenuHeader
                  $isOpen={isOpen}
                  onClick={() => {
                    // Se o menu já está aberto, fecha. Caso contrário, abre e fecha os outros
                    setOpenMenuId(isOpen ? null : menu.id_menu);
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <FaList style={{ fontSize: "14px" }} />
                    {menu.titulo}
                  </div>
                  <FaCaretDown />
                </MenuHeader>
                <MenuItemsContainer $isOpen={isOpen}>
                  {menu.menuItems?.map((menuItem) => (
                    <SidebarItem
                      key={menuItem.id_menu_item}
                      active={activeForm === menuItem.nome_menu_item}
                      onClick={() => {
                        setActiveForm(menuItem.nome_menu_item);
                        getIndicadores(menuItem);
                      }}
                    >
                      <FaLink
                        style={{ marginRight: "8px", fontSize: "14px" }}
                      />
                      {menuItem.nome_menu_item}
                    </SidebarItem>
                  ))}
                </MenuItemsContainer>
              </div>
            );
          })}
        </Sidebar>
      )}
      <MainContent isCollapsed={isCollapsed}>
        <DivCenter>
          <Form onSubmit={handleSubmit(handleCadastro)}>
            {!isDynamicMenuItemActive && (
              <BreadCrumbStyle $isCollapsed={isCollapsed}>
                <nav>
                  <ol>
                    <li>
                      <Link href="/indicadores/home_indicadores">Home</Link>
                      <span> / </span>
                    </li>
                    <li>
                      <span>Cadastro</span>
                    </li>
                  </ol>
                </nav>
              </BreadCrumbStyle>
            )}
            <DivFormCadastro active={activeForm === "dadosMunicipio"}>
              <DivTituloForm>Dados do Município</DivTituloForm>

              <input {...register("id_municipio")} type="hidden"></input>
              <table>
                <thead></thead>
                <tbody>
                  <tr>
                    <td>
                      <InputP>
                        <label>Código do IBGE</label>
                        <input
                          {...register("municipio_codigo_ibge")}
                          disabled={true}
                          type="text"
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        ></input>
                      </InputP>
                    </td>
                    <td>
                      <InputM>
                        <label>Município</label>
                        <input
                          {...register("municipio_nome")}
                          disabled={true}
                          type="text"
                          onKeyPress={onlyLettersAndCharacters}
                        ></input>
                      </InputM>
                    </td>
                    <td>
                      <InputM>
                        <label>CNPJ</label>
                        <input
                          {...register("municipio_cnpj")}
                          disabled={true}
                          placeholder={""}
                          type="text"
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        ></input>
                      </InputM>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <InputG>
                        <label>
                          Prefeitura<span> *</span>
                        </label>
                        <input
                          {...register("municipio_nome_prefeitura", {
                            required: "Este campo é obrigatório",
                          })}
                          type="text"
                          style={{ textTransform: "capitalize" }}
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("municipio_nome_prefeitura", value);
                          }}
                          onKeyPress={onlyLettersAndCharacters}
                        />
                        {errors.municipio_nome_prefeitura && (
                          <span>
                            {errors.municipio_nome_prefeitura.message}
                          </span>
                        )}
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <label>
                          CEP<span> *</span>
                        </label>
                        <Controller
                          name="municipio_cep"
                          control={control}
                          rules={{ required: "O CEP é obrigatório" }}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => (
                            <>
                              <InputMask
                                mask="99999-999"
                                maskChar={null}
                                value={value}
                                onChange={(e) => {
                                  const justNumbers = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );
                                  onChange(justNumbers);
                                }}
                              >
                                {(inputProps) => (
                                  <input
                                    {...inputProps}
                                    type="text"
                                    style={{ borderColor: error ? "red" : "" }}
                                  />
                                )}
                              </InputMask>
                              {error && <span>{error.message}</span>}
                            </>
                          )}
                        />
                      </InputP>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <InputG>
                        <label>
                          Endereço<span> *</span>
                        </label>
                        <input
                          {...register("municipio_endereco", {
                            required: "Este campo é obrigatório",
                          })}
                          type="text"
                          style={{ textTransform: "capitalize" }}
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("municipio_endereco", value);
                          }}
                          onKeyPress={onlyLettersAndCharacters}
                        />
                        {errors.municipio_endereco && (
                          <span>{errors.municipio_endereco.message}</span>
                        )}
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <label>
                          Número<span> *</span>
                        </label>
                        <input
                          {...register("municipio_numero", {
                            required: "Este campo é obrigatório",
                          })}
                          type="text"
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                        {errors.municipio_numero && (
                          <span>{errors.municipio_numero.message}</span>
                        )}
                      </InputP>
                    </td>
                    <td>
                      <InputM>
                        <label>
                          Bairro<span> *</span>
                        </label>
                        <input
                          {...register("municipio_bairro", {
                            required: "Este campo é obrigatório",
                          })}
                          type="text"
                          onKeyPress={onlyLettersAndCharacters}
                          style={{ textTransform: "capitalize" }}
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("municipio_bairro", value);
                          }}
                        />
                        {errors.municipio_bairro && (
                          <span>{errors.municipio_bairro.message}</span>
                        )}
                      </InputM>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <InputP>
                        <label>
                          Telefone<span> *</span>
                        </label>
                        <Controller
                          name="municipio_telefone"
                          control={control}
                          rules={{ required: "O telefone é obrigatório" }}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => (
                            <>
                              <InputMask
                                mask="(99) 99999-9999"
                                maskChar={null}
                                value={value}
                                onChange={(e) => {
                                  const justNumbers = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );
                                  if (justNumbers.length <= 11) {
                                    onChange(justNumbers);
                                  }
                                }}
                              >
                                {(inputProps) => (
                                  <input {...inputProps} type="text" />
                                )}
                              </InputMask>
                              {error && <span>{error.message}</span>}
                            </>
                          )}
                        />
                      </InputP>
                    </td>
                    <td>
                      <InputM>
                        <label>
                          E-mail<span> *</span>
                        </label>
                        <input
                          {...register("municipio_email", {
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Endereço de email inválido",
                            },
                          })}
                          type="text"
                        />
                        {errors.municipio_email &&
                          errors.municipio_email.type && (
                            <span>O campo é obrigatório!</span>
                          )}
                      </InputM>
                    </td>
                    <td>
                      <InputG>
                        <label>
                          Nome do Prefeito<span> *</span>
                        </label>
                        <input
                          {...register("municipio_prefeito", {
                            required: "Este campo é obrigatório",
                          })}
                          type="text"
                          style={{ textTransform: "capitalize" }}
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("municipio_prefeito", value);
                          }}
                          onKeyPress={onlyLettersAndCharacters}
                        />
                        {errors.municipio_prefeito && (
                          <span>{errors.municipio_prefeito.message}</span>
                        )}
                      </InputG>
                    </td>
                  </tr>
                </tbody>
              </table>

              <SubmitButtonContainer>
                {usuario?.id_permissao !== 4 && (
                  <SubmitButton
                    type="button"
                    onClick={() => handleSaveSubmenu("dadosMunicipio")}
                  >
                    Gravar
                  </SubmitButton>
                )}
              </SubmitButtonContainer>
            </DivFormCadastro>

            <DivFormCadastro active={activeForm === "titularServicos"}>
              <DivTituloForm>
                Titulares dos Serviços Municipais de Saneamento Básico
              </DivTituloForm>
              <input {...register("id_titular_servicos_ms")} type="hidden" />
              <table>
                <tbody>
                  <tr>
                    <td>
                      <InputG>
                        <label>
                          Setor Responsável<span> *</span>
                        </label>
                        <input
                          {...register("ts_setor_responsavel", {
                            required: "Este campo é obrigatório",
                          })}
                          type="text"
                          style={{ textTransform: "capitalize" }}
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("ts_setor_responsavel", value);
                          }}
                          onKeyPress={onlyLettersAndCharacters}
                        ></input>
                      </InputG>
                      {errors.ts_setor_responsavel && (
                        <span>{errors.ts_setor_responsavel.message}</span>
                      )}
                    </td>
                    <td>
                      <InputP>
                        <label>
                          Telefone Comercial<span> *</span>
                        </label>

                        <Controller
                          name="ts_telefone_comercial"
                          control={control}
                          rules={{ required: "O telefone é obrigatório" }}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => (
                            <>
                              <InputMask
                                mask="(99) 99999-9999"
                                maskChar={null}
                                value={value}
                                onChange={(e) => {
                                  const justNumbers = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );
                                  if (justNumbers.length <= 11) {
                                    onChange(justNumbers);
                                  }
                                }}
                              >
                                {(inputProps) => (
                                  <input {...inputProps} type="text" />
                                )}
                              </InputMask>
                              {error && <span>{error.message}</span>}
                            </>
                          )}
                        />
                      </InputP>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <InputM>
                        <label>
                          Nome do Responsável<span> *</span>
                        </label>
                        <input
                          {...register("ts_responsavel", {
                            required: "Este campo é obrigatório",
                          })}
                          type="text"
                          style={{ textTransform: "capitalize" }}
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("ts_responsavel", value);
                          }}
                          onKeyPress={onlyLettersAndCharacters}
                        ></input>
                      </InputM>
                      {errors.ts_responsavel && (
                        <span>{errors.ts_responsavel.message}</span>
                      )}
                    </td>
                    <td>
                      <InputM>
                        <label>
                          Cargo<span> *</span>
                        </label>
                        <input
                          {...register("ts_cargo", {
                            required: "Este campo é obrigatório",
                          })}
                          type="text"
                          style={{ textTransform: "capitalize" }}
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("ts_cargo", value);
                          }}
                          onKeyPress={onlyLettersAndCharacters}
                        ></input>
                      </InputM>
                      {errors.ts_cargo && (
                        <span>{errors.ts_cargo.message}</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              <table>
                <tbody>
                  <tr>
                    <td>
                      <InputG>
                        <label>
                          Função<span> *</span>
                        </label>
                        <select {...register("ts_funcao")}>
                          <option
                            value={dadosMunicipio?.ts_funcao || "Selecione..."}
                          >
                            {dadosMunicipio?.ts_funcao || "Selecione..."}
                          </option>
                          {dadosMunicipio?.ts_funcao !== "Encargo Direto" && (
                            <option value="Encargo Direto">
                              Encargo Direto
                            </option>
                          )}
                          {dadosMunicipio?.ts_funcao !== "Concursado" && (
                            <option value="Concursado">Concursado</option>
                          )}
                          {dadosMunicipio?.ts_funcao !== "Outro" && (
                            <option value="Outro">Outro</option>
                          )}
                        </select>
                      </InputG>
                    </td>
                    <td>
                      <InputM>
                        <label>
                          Telefone<span> *</span>
                        </label>

                        <Controller
                          name="ts_telefone"
                          control={control}
                          rules={{ required: "O telefone é obrigatório" }}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => (
                            <>
                              <InputMask
                                mask="(99) 99999-9999"
                                maskChar={null}
                                value={value}
                                onChange={(e) => {
                                  const justNumbers = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );
                                  if (justNumbers.length <= 11) {
                                    onChange(justNumbers);
                                  }
                                }}
                              >
                                {(inputProps) => (
                                  <input {...inputProps} type="text" />
                                )}
                              </InputMask>
                              {error && <span>{error.message}</span>}
                            </>
                          )}
                        />
                      </InputM>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table>
                <tbody>
                  <tr>
                    <td>
                      <InputG>
                        <label>
                          Email<span> *</span>
                        </label>
                        <input
                          {...register("ts_email", {
                            required: "Este campo é obrigatório",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Endereço de email inválido",
                            },
                          })}
                          type="text"
                        />
                        {errors.ts_email && (
                          <span>{errors.ts_email.message}</span>
                        )}
                      </InputG>
                    </td>
                  </tr>
                </tbody>
              </table>
              <SubmitButtonContainer>
                {usuario?.id_permissao !== 4 && (
                  <SubmitButton
                    type="button"
                    onClick={() => handleSaveSubmenu("titularServicos")}
                  >
                    Gravar
                  </SubmitButton>
                )}
              </SubmitButtonContainer>
            </DivFormCadastro>

            <DivFormCadastro active={activeForm === "prestadoresServicos"}>
              <DivTituloForm>
                Prestadores dos Serviços Municipais de Saneamento Básico
              </DivTituloForm>
              <div className="form-content">
                <StepperContainer>
                  <StepperWrapper>
                    {steps.map((label, index) => (
                      <div key={label} style={{ position: "relative" }}>
                        <StepButton
                          active={activeStep === index}
                          completed={activeStep > index}
                          onClick={() => handleStepClick(index)}
                        >
                          {index + 1}
                        </StepButton>
                        <StepLabel active={activeStep === index}>
                          {label}
                        </StepLabel>
                      </div>
                    ))}
                  </StepperWrapper>

                  <StepContent active={activeStep === 0}>
                    <DivEixo style={{ color: "#000", marginTop: "60px" }}>
                      <div style={{ marginBottom: "20px" }}>
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={copiaParaEsgoto}
                            onChange={(e) => {
                              setCopiaParaEsgoto(e.target.checked);
                              if (e.target.checked) {
                                setValue(
                                  "es_secretaria_setor_responsavel",
                                  watch("aa_secretaria_setor_responsavel")
                                );
                                setValue(
                                  "es_abrangencia",
                                  watch("aa_abrangencia")
                                );
                                setValue(
                                  "es_natureza_juridica",
                                  watch("aa_natureza_juridica")
                                );
                                setValue("es_cnpj", watch("aa_cnpj"));
                                setValue("es_telefone", watch("aa_telefone"));
                                setValue("es_cep", watch("aa_cep"));
                                setValue("es_endereco", watch("aa_endereco"));
                                setValue("es_numero", watch("aa_numero"));
                                setValue("es_bairro", watch("aa_bairro"));
                                setValue(
                                  "es_responsavel",
                                  watch("aa_responsavel")
                                );
                                setValue("es_cargo", watch("aa_cargo"));
                                setValue("es_email", watch("aa_email"));
                              }
                            }}
                            style={{ marginRight: "8px" }}
                          />
                          Esgotamento Sanitário
                        </label>
                      </div>
                    </DivEixo>
                    <input
                      {...register("id_ps_abastecimento_agua")}
                      type="hidden"
                    />
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputG>
                              <label>
                                Secretaria ou Setor Responsável<span> *</span>
                              </label>
                              <input
                                {...register(
                                  "aa_secretaria_setor_responsavel",
                                  {
                                    required: "Este campo é obrigatório",
                                  }
                                )}
                                type="text"
                                onKeyPress={onlyLettersAndCharacters}
                              ></input>
                              {errors.aa_secretaria_setor_responsavel && (
                                <span>
                                  {
                                    errors.aa_secretaria_setor_responsavel
                                      .message
                                  }
                                </span>
                              )}
                            </InputG>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Abrangência<span> *</span>
                              </label>
                              <select {...register("aa_abrangencia")}>
                                <option value={dadosMunicipio?.aa_abrangencia}>
                                  {dadosMunicipio?.aa_abrangencia}
                                </option>
                                <option value="Regional">Regional</option>
                                <option value="Microregional">
                                  Microregional
                                </option>
                                <option value="Local">Local</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputG>
                              <label>
                                Natureza jurídica<span> *</span>
                              </label>
                              <select {...register("aa_natureza_juridica")}>
                                <option value="Empresa Privada">
                                  Empresa Privada
                                </option>
                                <option value="Administração Pública Direta">
                                  Administração Pública Direta
                                </option>
                                <option value="Autarquia">Autarquia</option>
                                <option value="Empresa pública">
                                  Empresa pública
                                </option>
                                <option value="Sociedade de economia mista com administração privada">
                                  Sociedade de economia mista com administração
                                  privada
                                </option>
                                <option value="Sociedade de economia mista com administração pública">
                                  Sociedade de economia mista com administração
                                  pública
                                </option>
                                <option value="Organização Social">
                                  Organização Social
                                </option>
                              </select>
                            </InputG>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                CNPJ<span> *</span>
                              </label>
                              <Controller
                                name="aa_cnpj"
                                control={control}
                                rules={{
                                  required: "Campo obrigatório",
                                  minLength: 14,
                                  maxLength: 14,
                                  pattern: /^\d{14}$/,
                                }}
                                render={({
                                  field: { onChange, value },
                                  fieldState: { error },
                                }) => (
                                  <>
                                    <InputMask
                                      mask="99.999.999/9999-99"
                                      maskChar={null}
                                      value={value}
                                      onChange={(e) => {
                                        const justNumbers =
                                          e.target.value.replace(/\D/g, "");
                                        if (justNumbers.length <= 14) {
                                          onChange(justNumbers);
                                          const formattedValue = e.target.value;
                                          e.target.value = formattedValue;
                                        }
                                      }}
                                    >
                                      {(inputProps) => (
                                        <input
                                          {...inputProps}
                                          type="text"
                                          placeholder="00.000.000/0000-00"
                                        />
                                      )}
                                    </InputMask>
                                    {error && <span>{error.message}</span>}
                                  </>
                                )}
                              />
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Telefone<span> *</span>
                              </label>

                              <Controller
                                name="aa_telefone"
                                control={control}
                                rules={{
                                  required: "Campo obrigatório",
                                }}
                                render={({
                                  field: { onChange, value },
                                  fieldState: { error },
                                }) => (
                                  <>
                                    <InputMask
                                      mask="(99) 99999-9999"
                                      maskChar={null}
                                      value={value}
                                      onChange={(e) => {
                                        const justNumbers =
                                          e.target.value.replace(/\D/g, "");
                                        if (justNumbers.length <= 11) {
                                          onChange(justNumbers);
                                        }
                                      }}
                                    >
                                      {(inputProps) => (
                                        <input {...inputProps} type="text" />
                                      )}
                                    </InputMask>
                                    {error && <span>{error.message}</span>}
                                  </>
                                )}
                              />
                            </InputP>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputP>
                              <label>
                                CEP<span> *</span>
                              </label>

                              <Controller
                                name="aa_cep"
                                control={control}
                                rules={{
                                  required: "Campo obrigatório",
                                }}
                                render={({
                                  field: { onChange, value },
                                  fieldState: { error },
                                }) => (
                                  <>
                                    <InputMask
                                      mask="99999-999"
                                      maskChar={null}
                                      value={value}
                                      onChange={(e) => {
                                        const justNumbers =
                                          e.target.value.replace(/\D/g, "");
                                        onChange(justNumbers);
                                      }}
                                    >
                                      {(inputProps) => (
                                        <input {...inputProps} type="text" />
                                      )}
                                    </InputMask>
                                    {error && <span>{error.message}</span>}
                                  </>
                                )}
                              />
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Endereço<span> *</span>
                              </label>
                              <input
                                {...register("aa_endereco", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                                onKeyPress={onlyLettersAndCharacters}
                              ></input>
                              {errors.aa_endereco && (
                                <span>{errors.aa_endereco.message}</span>
                              )}
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Número<span> *</span>
                              </label>
                              <input
                                {...register("aa_numero", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                                onKeyPress={(e) => {
                                  if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                              ></input>
                              {errors.aa_numero && (
                                <span>{errors.aa_numero.message}</span>
                              )}
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Bairro<span> *</span>
                              </label>
                              <input
                                {...register("aa_bairro", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                                onKeyPress={onlyLettersAndCharacters}
                              ></input>
                              {errors.aa_bairro && (
                                <span>{errors.aa_bairro.message}</span>
                              )}
                            </InputM>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputG>
                              <label>
                                Nome do Responsável<span> *</span>
                              </label>
                              <input
                                {...register("aa_responsavel", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                                onKeyPress={onlyLettersAndCharacters}
                              ></input>
                              {errors.aa_responsavel && (
                                <span>{errors.aa_responsavel.message}</span>
                              )}
                            </InputG>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Cargo<span> *</span>
                              </label>
                              <input
                                {...register("aa_cargo", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                                onKeyPress={onlyLettersAndCharacters}
                              ></input>
                              {errors.aa_cargo && (
                                <span>{errors.aa_cargo.message}</span>
                              )}
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Email<span> *</span>
                              </label>

                              <input
                                {...register("aa_email", {
                                  required: "Este campo é obrigatório",
                                  pattern: {
                                    value:
                                      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Endereço de email inválido",
                                  },
                                })}
                                type="text"
                              />
                              {errors.aa_email && errors.aa_email.type && (
                                <span>O campo é obrigatório!</span>
                              )}
                            </InputM>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </StepContent>

                  <StepContent active={activeStep === 1}>
                    <DivEixo
                      style={{ color: "#000", marginTop: "60px" }}
                    ></DivEixo>
                    <input
                      {...register("id_ps_esgotamento_sanitario")}
                      type="hidden"
                    />
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputG>
                              <label>
                                Secretaria ou Setor Responsável<span> *</span>
                              </label>
                              <input
                                {...register(
                                  "es_secretaria_setor_responsavel",
                                  {
                                    required: "Este campo é obrigatório",
                                  }
                                )}
                                type="text"
                                onKeyPress={onlyLettersAndCharacters}
                              ></input>
                              {errors.es_secretaria_setor_responsavel && (
                                <span>
                                  {
                                    errors.es_secretaria_setor_responsavel
                                      .message
                                  }
                                </span>
                              )}
                            </InputG>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Abrangência<span> *</span>
                              </label>
                              <select {...register("es_abrangencia")}>
                                <option value={dadosMunicipio?.es_abrangencia}>
                                  {dadosMunicipio?.es_abrangencia}
                                </option>
                                <option value="Regional">Regional</option>
                                <option value="Microregional">
                                  Microregional
                                </option>
                                <option value="Local">Local</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputG>
                              <label>
                                Natureza jurídica<span> *</span>
                              </label>
                              <select {...register("es_natureza_juridica")}>
                                <option
                                  value={dadosMunicipio?.es_natureza_juridica}
                                >
                                  {dadosMunicipio?.es_natureza_juridica}
                                </option>
                                <option value="Administração Pública Direta">
                                  Administração Pública Direta
                                </option>
                                <option value="Autarquia">Autarquia</option>
                                <option value="Empresa pública">
                                  Empresa pública
                                </option>
                                <option value="Sociedade de economia mista com administração privada">
                                  Sociedade de economia mista com administração
                                  privada
                                </option>
                                <option value="Sociedade de economia mista com administração pública">
                                  Sociedade de economia mista com administração
                                  pública
                                </option>
                              </select>
                            </InputG>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                CNPJ<span> *</span>
                              </label>

                              <Controller
                                name="es_cnpj"
                                control={control}
                                rules={{
                                  required: "Campo obrigatório",
                                  minLength: 14,
                                  maxLength: 14,
                                  pattern: /^\d{14}$/,
                                }}
                                render={({
                                  field: { onChange, value },
                                  fieldState: { error },
                                }) => (
                                  <>
                                    <InputMask
                                      mask="99.999.999/9999-99"
                                      maskChar={null}
                                      value={value}
                                      onChange={(e) => {
                                        const justNumbers =
                                          e.target.value.replace(/\D/g, "");
                                        if (justNumbers.length <= 14) {
                                          onChange(justNumbers);
                                          const formattedValue = e.target.value;
                                          e.target.value = formattedValue;
                                        }
                                      }}
                                    >
                                      {(inputProps) => (
                                        <input
                                          {...inputProps}
                                          type="text"
                                          placeholder="00.000.000/0000-00"
                                        />
                                      )}
                                    </InputMask>
                                    {error && <span>{error.message}</span>}
                                  </>
                                )}
                              />
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Telefone<span> *</span>
                              </label>

                              <Controller
                                name="es_telefone"
                                control={control}
                                rules={{
                                  required: "Campo obrigatório",
                                }}
                                render={({
                                  field: { onChange, value },
                                  fieldState: { error },
                                }) => (
                                  <>
                                    <InputMask
                                      mask="(99) 99999-9999"
                                      maskChar={null}
                                      value={value}
                                      onChange={(e) => {
                                        const justNumbers =
                                          e.target.value.replace(/\D/g, "");
                                        if (justNumbers.length <= 11) {
                                          onChange(justNumbers);
                                        }
                                      }}
                                    >
                                      {(inputProps) => (
                                        <input {...inputProps} type="text" />
                                      )}
                                    </InputMask>
                                    {error && <span>{error.message}</span>}
                                  </>
                                )}
                              />
                            </InputP>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputP>
                              <label>
                                CEP<span> *</span>
                              </label>

                              <Controller
                                name="es_cep"
                                control={control}
                                rules={{
                                  required: "Campo obrigatório",
                                }}
                                render={({
                                  field: { onChange, value },
                                  fieldState: { error },
                                }) => (
                                  <>
                                    <InputMask
                                      mask="99999-999"
                                      maskChar={null}
                                      value={value}
                                      onChange={(e) => {
                                        const justNumbers =
                                          e.target.value.replace(/\D/g, "");
                                        onChange(justNumbers);
                                      }}
                                    >
                                      {(inputProps) => (
                                        <input {...inputProps} type="text" />
                                      )}
                                    </InputMask>
                                    {error && <span>{error.message}</span>}
                                  </>
                                )}
                              />
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Endereço<span> *</span>
                              </label>
                              <input
                                {...register("es_endereco", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.es_endereco && (
                                <span>{errors.es_endereco.message}</span>
                              )}
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Número<span> *</span>
                              </label>
                              <input
                                {...register("es_numero", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.es_numero && (
                                <span>{errors.es_numero.message}</span>
                              )}
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Bairro<span> *</span>
                              </label>
                              <input
                                {...register("es_bairro", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.es_bairro && (
                                <span>{errors.es_bairro.message}</span>
                              )}
                            </InputM>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputG>
                              <label>
                                Nome do Responsável<span> *</span>
                              </label>
                              <input
                                {...register("es_responsavel", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.es_responsavel && (
                                <span>{errors.es_responsavel.message}</span>
                              )}
                            </InputG>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Cargo<span> *</span>
                              </label>
                              <input
                                {...register("es_cargo", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.es_cargo && (
                                <span>{errors.es_cargo.message}</span>
                              )}
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Email<span> *</span>
                              </label>

                              <input
                                {...register("es_email", {
                                  required: "Campo obrigatório",
                                  pattern: {
                                    value:
                                      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Endereço de email inválido",
                                  },
                                })}
                                type="text"
                              />
                              {errors.es_email && errors.es_email.type && (
                                <span>O campo é obrigatório!</span>
                              )}
                            </InputM>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </StepContent>

                  <StepContent active={activeStep === 2}>
                    <DivEixo
                      style={{ color: "#000", marginTop: "60px" }}
                    ></DivEixo>
                    <input
                      {...register("id_ps_drenagem_aguas_pluviais")}
                      type="hidden"
                    />
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputG>
                              <label>
                                Secretaria ou Setor Responsável<span> *</span>
                              </label>
                              <input
                                {...register(
                                  "da_secretaria_setor_responsavel",
                                  {
                                    required: "Campo obrigatório",
                                  }
                                )}
                                type="text"
                              ></input>
                              {errors.da_secretaria_setor_responsavel && (
                                <span>
                                  {
                                    errors.da_secretaria_setor_responsavel
                                      .message
                                  }
                                </span>
                              )}
                            </InputG>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Abrangência<span> *</span>
                              </label>
                              <select {...register("da_abrangencia")}>
                                <option value={dadosMunicipio?.da_abrangencia}>
                                  {dadosMunicipio?.da_abrangencia}
                                </option>
                                <option value="Regional">Regional</option>
                                <option value="Microregional">
                                  Microregional
                                </option>
                                <option value="Local">Local</option>
                              </select>
                            </InputP>
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>

                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputG>
                              <label>
                                Natureza jurídica<span> *</span>
                              </label>
                              <select {...register("da_natureza_juridica")}>
                                <option
                                  value={dadosMunicipio?.da_natureza_juridica}
                                >
                                  {" "}
                                  {dadosMunicipio?.da_natureza_juridica}{" "}
                                </option>
                                <option value="Administração Pública Direta">
                                  Administração Pública Direta
                                </option>
                                <option value="Autarquia">Autarquia</option>
                                <option value="Empresa pública">
                                  Empresa pública
                                </option>
                                <option value="Sociedade de economia mista com administração privada">
                                  Sociedade de economia mista com administração
                                  privada
                                </option>
                                <option value="Sociedade de economia mista com administração pública">
                                  Sociedade de economia mista com administração
                                  pública
                                </option>
                              </select>
                            </InputG>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                CNPJ<span> *</span>
                              </label>

                              <Controller
                                name="da_cnpj"
                                control={control}
                                rules={{
                                  required: "Campo obrigatório",
                                  minLength: 14,
                                  maxLength: 14,
                                  pattern: /^\d{14}$/,
                                }}
                                render={({
                                  field: { onChange, value },
                                  fieldState: { error },
                                }) => (
                                  <>
                                    <InputMask
                                      mask="99.999.999/9999-99"
                                      maskChar={null}
                                      value={value}
                                      onChange={(e) => {
                                        const justNumbers =
                                          e.target.value.replace(/\D/g, "");
                                        if (justNumbers.length <= 14) {
                                          onChange(justNumbers);

                                          const formattedValue = e.target.value;
                                          e.target.value = formattedValue;
                                        }
                                      }}
                                    >
                                      {(inputProps) => (
                                        <input
                                          {...inputProps}
                                          type="text"
                                          placeholder="00.000.000/0000-00"
                                        />
                                      )}
                                    </InputMask>
                                    {error && <span>{error.message}</span>}
                                  </>
                                )}
                              />
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Telefone<span> *</span>
                              </label>

                              <Controller
                                name="da_telefone"
                                control={control}
                                rules={{
                                  required: "Campo obrigatório",
                                }}
                                render={({
                                  field: { onChange, value },
                                  fieldState: { error },
                                }) => (
                                  <>
                                    <InputMask
                                      mask="(99) 99999-9999"
                                      maskChar={null}
                                      value={value}
                                      onChange={(e) => {
                                        const justNumbers =
                                          e.target.value.replace(/\D/g, "");
                                        if (justNumbers.length <= 11) {
                                          onChange(justNumbers);
                                        }
                                      }}
                                    >
                                      {(inputProps) => (
                                        <input {...inputProps} type="text" />
                                      )}
                                    </InputMask>
                                    {error && <span>{error.message}</span>}
                                  </>
                                )}
                              />
                            </InputP>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputP>
                              <label>
                                CEP<span> *</span>
                              </label>

                              <Controller
                                name="da_cep"
                                control={control}
                                rules={{
                                  required: "Campo obrigatório",
                                }}
                                render={({
                                  field: { onChange, value },
                                  fieldState: { error },
                                }) => (
                                  <>
                                    <InputMask
                                      mask="99999-999"
                                      maskChar={null}
                                      value={value}
                                      onChange={(e) => {
                                        const justNumbers =
                                          e.target.value.replace(/\D/g, "");
                                        onChange(justNumbers);
                                      }}
                                    >
                                      {(inputProps) => (
                                        <input {...inputProps} type="text" />
                                      )}
                                    </InputMask>
                                    {error && <span>{error.message}</span>}
                                  </>
                                )}
                              />
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Endereço<span> *</span>
                              </label>
                              <input
                                {...register("da_endereco", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.da_endereco && (
                                <span>{errors.da_endereco.message}</span>
                              )}
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Número<span> *</span>
                              </label>
                              <input
                                {...register("da_numero", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.da_numero && (
                                <span>{errors.da_numero.message}</span>
                              )}
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Bairro<span> *</span>
                              </label>
                              <input
                                {...register("da_bairro", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.da_bairro && (
                                <span>{errors.da_bairro.message}</span>
                              )}
                            </InputM>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputG>
                              <label>
                                Nome do Responsável<span> *</span>
                              </label>
                              <input
                                {...register("da_responsavel", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.da_responsavel && (
                                <span>{errors.da_responsavel.message}</span>
                              )}
                            </InputG>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Cargo<span> *</span>
                              </label>
                              <input
                                {...register("da_cargo", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.da_cargo && (
                                <span>{errors.da_cargo.message}</span>
                              )}
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Email<span> *</span>
                              </label>

                              <input
                                {...register("da_email", {
                                  pattern: {
                                    value:
                                      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Endereço de email inválido",
                                  },
                                })}
                                type="text"
                              />
                              {errors.da_email && errors.da_email.type && (
                                <span>O campo é obrigatório!</span>
                              )}
                            </InputM>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </StepContent>

                  <StepContent active={activeStep === 3}>
                    <DivEixo
                      style={{ color: "#000", marginTop: "60px" }}
                    ></DivEixo>
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputG>
                              <label>
                                Secretaria ou Setor Responsável<span> *</span>
                              </label>
                              <input
                                {...register(
                                  "rs_secretaria_setor_responsavel",
                                  {
                                    required: "Campo obrigatório",
                                  }
                                )}
                                type="text"
                              ></input>
                              {errors.rs_secretaria_setor_responsavel && (
                                <span>
                                  {
                                    errors.rs_secretaria_setor_responsavel
                                      .message
                                  }
                                </span>
                              )}
                            </InputG>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Abrangência<span> *</span>
                              </label>
                              <select {...register("rs_abrangencia")}>
                                <option value={dadosMunicipio?.rs_abrangencia}>
                                  {dadosMunicipio?.rs_abrangencia}
                                </option>
                                <option value="Regional">Regional</option>
                                <option value="Microregional">
                                  Microregional
                                </option>
                                <option value="Local">Local</option>
                              </select>
                            </InputP>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <input
                      {...register("id_ps_residuo_solido")}
                      type="hidden"
                    />

                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputG>
                              <label>
                                Natureza jurídica<span> *</span>
                              </label>
                              <select {...register("rs_natureza_juridica")}>
                                <option
                                  value={dadosMunicipio?.rs_natureza_juridica}
                                >
                                  {" "}
                                  {dadosMunicipio?.rs_natureza_juridica}{" "}
                                </option>
                                <option value="Administração Pública Direta">
                                  Administração Pública Direta
                                </option>
                                <option value="Autarquia">Autarquia</option>
                                <option value="Empresa pública">
                                  Empresa pública
                                </option>
                                <option value="Sociedade de economia mista com administração privada">
                                  Sociedade de economia mista com administração
                                  privada
                                </option>
                                <option value="Sociedade de economia mista com administração pública">
                                  Sociedade de economia mista com administração
                                  pública
                                </option>
                              </select>
                            </InputG>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                CNPJ<span> *</span>
                              </label>

                              <Controller
                                name="rs_cnpj"
                                control={control}
                                rules={{
                                  required: "Campo obrigatório",
                                  minLength: 14,
                                  maxLength: 14,
                                  pattern: /^\d{14}$/,
                                }}
                                render={({
                                  field: { onChange, value },
                                  fieldState: { error },
                                }) => (
                                  <>
                                    <InputMask
                                      mask="99.999.999/9999-99"
                                      maskChar={null}
                                      value={value}
                                      onChange={(e) => {
                                        const justNumbers =
                                          e.target.value.replace(/\D/g, "");
                                        if (justNumbers.length <= 14) {
                                          onChange(justNumbers);

                                          const formattedValue = e.target.value;
                                          e.target.value = formattedValue;
                                        }
                                      }}
                                    >
                                      {(inputProps) => (
                                        <input
                                          {...inputProps}
                                          type="text"
                                          placeholder="00.000.000/0000-00"
                                        />
                                      )}
                                    </InputMask>
                                    {error && <span>{error.message}</span>}
                                  </>
                                )}
                              />
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Telefone<span> *</span>
                              </label>

                              <Controller
                                name="rs_telefone"
                                control={control}
                                rules={{
                                  required: "Campo obrigatório",
                                }}
                                render={({
                                  field: { onChange, value },
                                  fieldState: { error },
                                }) => (
                                  <>
                                    <InputMask
                                      mask="(99) 99999-9999"
                                      maskChar={null}
                                      value={value}
                                      onChange={(e) => {
                                        const justNumbers =
                                          e.target.value.replace(/\D/g, "");
                                        if (justNumbers.length <= 11) {
                                          onChange(justNumbers);
                                        }
                                      }}
                                    >
                                      {(inputProps) => (
                                        <input {...inputProps} type="text" />
                                      )}
                                    </InputMask>
                                    {error && <span>{error.message}</span>}
                                  </>
                                )}
                              />
                            </InputP>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputP>
                              <label>
                                CEP<span> *</span>
                              </label>

                              <Controller
                                name="rs_cep"
                                control={control}
                                rules={{
                                  required: "Campo obrigatório",
                                }}
                                render={({
                                  field: { onChange, value },
                                  fieldState: { error },
                                }) => (
                                  <>
                                    <InputMask
                                      mask="99999-999"
                                      maskChar={null}
                                      value={value}
                                      onChange={(e) => {
                                        const justNumbers =
                                          e.target.value.replace(/\D/g, "");
                                        onChange(justNumbers);
                                      }}
                                    >
                                      {(inputProps) => (
                                        <input {...inputProps} type="text" />
                                      )}
                                    </InputMask>
                                    {error && <span>{error.message}</span>}
                                  </>
                                )}
                              />
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Endereço<span> *</span>
                              </label>
                              <input
                                {...register("rs_endereco", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.rs_endereco && (
                                <span>{errors.rs_endereco.message}</span>
                              )}
                            </InputM>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Número<span> *</span>
                              </label>
                              <input
                                {...register("rs_numero", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.rs_numero && (
                                <span>{errors.rs_numero.message}</span>
                              )}
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Bairro<span> *</span>
                              </label>
                              <input
                                {...register("rs_bairro", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.rs_bairro && (
                                <span>{errors.rs_bairro.message}</span>
                              )}
                            </InputM>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <InputG>
                              <label>
                                Nome do Responsável<span> *</span>
                              </label>
                              <input
                                {...register("rs_responsavel", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.rs_responsavel && (
                                <span>{errors.rs_responsavel.message}</span>
                              )}
                            </InputG>
                          </td>
                          <td>
                            <InputP>
                              <label>
                                Cargo<span> *</span>
                              </label>
                              <input
                                {...register("rs_cargo", {
                                  required: "Campo obrigatório",
                                })}
                                type="text"
                              ></input>
                              {errors.rs_cargo && (
                                <span>{errors.rs_cargo.message}</span>
                              )}
                            </InputP>
                          </td>
                          <td>
                            <InputM>
                              <label>
                                Email<span> *</span>
                              </label>

                              <input
                                {...register("rs_email", {
                                  pattern: {
                                    value:
                                      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Endereço de email inválido",
                                  },
                                })}
                                type="text"
                              />
                              {errors.rs_email && errors.rs_email.type && (
                                <span>O campo é obrigatório!</span>
                              )}
                            </InputM>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </StepContent>

                  <StepperNavigation>
                    <StepperButton
                      type="button"
                      secondary
                      onClick={handleBack}
                      disabled={activeStep === 0}
                    >
                      Voltar
                    </StepperButton>
                    <StepperButton
                      type="button"
                      onClick={handleNext}
                      disabled={usuario?.id_permissao === 4}
                    >
                      {activeStep === steps.length - 1
                        ? "Salvar e Finalizar"
                        : "Salvar e Próximo"}
                    </StepperButton>
                  </StepperNavigation>
                </StepperContainer>
              </div>
            </DivFormCadastro>

            <DivFormCadastro active={activeForm === "reguladorFiscalizador"}>
              <DivTituloForm>
                Regulador e Fiscalizador dos Serviços Municipais de Saneamento
                Básico
              </DivTituloForm>
              <input
                {...register("id_regulador_fiscalizador_ss")}
                type="hidden"
              />
              <table>
                <tbody>
                  <tr>
                    <td>
                      <InputG>
                        <label>
                          Setor Responsável<span> *</span>
                        </label>
                        <input
                          {...register("rf_setor_responsavel", {
                            required: "Campo obrigatório",
                          })}
                          type="text"
                          style={{ textTransform: "capitalize" }}
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("rf_setor_responsavel", value);
                          }}
                        ></input>
                        {errors.rf_setor_responsavel && (
                          <span>{errors.rf_setor_responsavel.message}</span>
                        )}
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <label>
                          Telefone Comercial<span> *</span>
                        </label>

                        <Controller
                          name="rf_telefone_comercial"
                          control={control}
                          rules={{ required: "O telefone é obrigatório" }}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => (
                            <>
                              <InputMask
                                mask="(99) 99999-9999"
                                maskChar={null}
                                value={value}
                                onChange={(e) => {
                                  const justNumbers = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );
                                  if (justNumbers.length <= 11) {
                                    onChange(justNumbers);
                                  }
                                }}
                              >
                                {(inputProps) => (
                                  <input {...inputProps} type="text" />
                                )}
                              </InputMask>
                              {error && <span>{error.message}</span>}
                            </>
                          )}
                        />
                      </InputP>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table>
                <tbody>
                  <tr>
                    <td>
                      <InputG>
                        <label>
                          Nome do Responsável<span> *</span>
                        </label>
                        <input
                          {...register("rf_responsavel", {
                            required: "Campo obrigatório",
                          })}
                          type="text"
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("rf_responsavel", value);
                          }}
                        ></input>
                        {errors.rf_responsavel && (
                          <span>{errors.rf_responsavel.message}</span>
                        )}
                      </InputG>
                    </td>
                    <td>
                      <InputM>
                        <label>
                          Cargo<span> *</span>
                        </label>
                        <input
                          {...register("rf_cargo", {
                            required: "Campo obrigatório",
                          })}
                          type="text"
                          onChange={(e) => {
                            const value = toTitleCase(e.target.value);
                            setValue("rf_cargo", value);
                          }}
                        ></input>
                        {errors.rf_cargo && (
                          <span>{errors.rf_cargo.message}</span>
                        )}
                      </InputM>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table>
                <tbody>
                  <tr>
                    <td>
                      <InputG>
                        <label>
                          Função<span> *</span>
                        </label>
                        <Controller
                          name="rf_funcao"
                          control={control}
                          rules={{ required: "A função é obrigatória" }}
                          render={({ field: { onChange, value } }) => {
                            const currentValue =
                              value || dadosMunicipio?.rf_funcao || "";
                            return (
                              <select value={currentValue} onChange={onChange}>
                                <option value="">Selecione...</option>
                                <option value="Encargo Direto">
                                  Encargo Direto
                                </option>
                                <option value="Concursado">Concursado</option>
                                <option value="Outro">Outro</option>
                              </select>
                            );
                          }}
                        />
                      </InputG>
                    </td>
                    <td>
                      <InputP>
                        <label>
                          Telefone<span> *</span>
                        </label>

                        <Controller
                          name="rf_telefone"
                          control={control}
                          rules={{ required: "O telefone é obrigatório" }}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => (
                            <>
                              <InputMask
                                mask="(99) 99999-9999"
                                maskChar={null}
                                value={value}
                                onChange={(e) => {
                                  const justNumbers = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );
                                  if (justNumbers.length <= 11) {
                                    onChange(justNumbers);
                                  }
                                }}
                              >
                                {(inputProps) => (
                                  <input {...inputProps} type="text" />
                                )}
                              </InputMask>
                              {error && <span>{error.message}</span>}
                            </>
                          )}
                        />
                      </InputP>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table>
                <tbody>
                  <tr>
                    <td>
                      <InputG>
                        <label>
                          Email<span> *</span>
                        </label>

                        <input
                          {...register("rf_email", {
                            required: "Campo obrigatório",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Endereço de email inválido",
                            },
                          })}
                          type="text"
                        />
                        {errors.rf_email && (
                          <span>{errors.rf_email.message}</span>
                        )}
                      </InputG>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table>
                <tbody>
                  <tr>
                    <td>
                      <DivTextArea>
                        <label>
                          <b>Descrição</b> detalhada das funções e
                          responsabilidades<span> *</span>
                        </label>
                        <TextArea>
                          <textarea
                            {...register("rf_descricao", {
                              required: "Campo obrigatório",
                            })}
                            name="rf_descricao"
                          />
                        </TextArea>
                        {errors.rf_descricao && (
                          <span>{errors.rf_descricao.message}</span>
                        )}
                      </DivTextArea>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style={{ color: "#fff" }}>;</div>
              <SubmitButtonContainer>
                {usuario?.id_permissao !== 4 && (
                  <SubmitButton
                    type="button"
                    onClick={() => handleSaveSubmenu("reguladorFiscalizador")}
                  >
                    Gravar
                  </SubmitButton>
                )}
              </SubmitButtonContainer>
            </DivFormCadastro>
            <DivFormCadastro active={activeForm === "controleSocial"}>
              <DivTituloForm>
                Controle Social & Responsável pelo SIMISAB
              </DivTituloForm>

              <TabContainer>
                <TabButton
                  active={activeTab === "controleSocial"}
                  onClick={() => setActiveTab("controleSocial")}
                >
                  Controle Social
                </TabButton>
                <TabButton
                  active={activeTab === "responsaveisSimisab"}
                  onClick={() => setActiveTab("responsaveisSimisab")}
                >
                  Responsável SIMISAB
                </TabButton>
                <TabButton
                  active={activeTab === "conselhoMunicipal"}
                  onClick={() => setActiveTab("conselhoMunicipal")}
                >
                  Conselho Municipal
                </TabButton>
              </TabContainer>

              <div
                style={{
                  display: activeTab === "controleSocial" ? "block" : "none",
                }}
              >
                <input {...register("id_controle_social_sms")} type="hidden" />
                <InputG>
                  <label>
                    Setor Responsável<span> *</span>
                  </label>
                  <input
                    {...register("cs_setor_responsavel", {
                      required: "Campo obrigatório",
                    })}
                    style={{ textTransform: "capitalize" }}
                    onChange={(e) => {
                      const value = toTitleCase(e.target.value);
                      setValue("cs_setor_responsavel", value);
                    }}
                    onKeyPress={onlyLettersAndCharacters}
                    type="text"
                  ></input>
                  {errors.cs_setor_responsavel && (
                    <span>{errors.cs_setor_responsavel.message}</span>
                  )}
                </InputG>

                <InputP>
                  <label>
                    Telefone<span> *</span>
                  </label>

                  <Controller
                    name="cs_telefone"
                    control={control}
                    rules={{ required: "O telefone é obrigatório" }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <>
                        <InputMask
                          mask="(99) 99999-9999"
                          maskChar={null}
                          value={value}
                          onChange={(e) => {
                            const justNumbers = e.target.value.replace(
                              /\D/g,
                              ""
                            );
                            if (justNumbers.length <= 11) {
                              onChange(justNumbers);
                            }
                          }}
                        >
                          {(inputProps) => (
                            <input {...inputProps} type="text" />
                          )}
                        </InputMask>
                        {error && <span>{error.message}</span>}
                      </>
                    )}
                  />
                </InputP>
                <InputG>
                  <label>
                    Email<span> *</span>
                  </label>

                  <input
                    {...register("cs_email", {
                      required: "Campo obrigatório",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Endereço de email inválido",
                      },
                    })}
                    type="text"
                  />
                  {errors.cs_email && errors.cs_email.type && (
                    <span>{errors.cs_email.message}</span>
                  )}
                </InputG>

                <SubmitButtonContainer>
                  {usuario?.id_permissao !== 4 && (
                    <SubmitButton
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSaveSubmenu("controleSocial");
                      }}
                    >
                      Gravar
                    </SubmitButton>
                  )}
                </SubmitButtonContainer>
              </div>

              <div
                style={{
                  display:
                    activeTab === "responsaveisSimisab" ? "block" : "none",
                }}
              >
                <input {...register("id_responsavel_simisab")} type="hidden" />

                <InputG>
                  <label>Usuarios Simisab</label>
                  <select onChange={(e) => getResSimisab(e.target.value)}>
                    <option value="">
                      Selecione um usuário para ser o responsavel Simisab
                    </option>
                    {Array.isArray(responsaveisSimisab) &&
                      responsaveisSimisab.map((resp) => (
                        <option key={resp.id_usuario} value={resp.id_usuario}>
                          {resp.nome}
                        </option>
                      ))}
                  </select>
                </InputG>
                <InputG>
                  <label>
                    Nome<span> *</span>
                  </label>
                  <input
                    {...register("simisab_responsavel", {
                      required: "Campo obrigatório",
                    })}
                    onKeyPress={onlyLettersAndCharacters}
                    style={{ textTransform: "capitalize" }}
                    onChange={(e) => {
                      const value = toTitleCase(e.target.value);
                      setValue("simisab_responsavel", value);
                    }}
                    type="text"
                  ></input>
                  {errors.simisab_responsavel && (
                    <span>{errors.simisab_responsavel.message}</span>
                  )}
                </InputG>

                <InputP>
                  <label>
                    Telefone<span> *</span>
                  </label>

                  <Controller
                    name="simisab_telefone"
                    control={control}
                    rules={{ required: "O telefone é obrigatório" }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <>
                        <InputMask
                          mask="(99) 99999-9999"
                          maskChar={null}
                          value={value}
                          onChange={(e) => {
                            const justNumbers = e.target.value.replace(
                              /\D/g,
                              ""
                            );
                            if (justNumbers.length <= 11) {
                              onChange(justNumbers);
                            }
                          }}
                        >
                          {(inputProps) => (
                            <input {...inputProps} type="text" />
                          )}
                        </InputMask>
                        {error && <span>{error.message}</span>}
                      </>
                    )}
                  />
                </InputP>
                <InputG>
                  <label>
                    Email<span> *</span>
                  </label>

                  <input
                    {...register("simisab_email", {
                      required: "Campo obrigatório",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Endereço de email inválido",
                      },
                    })}
                    type="text"
                  />
                  {errors.simisab_email && (
                    <span>{errors.simisab_email.message}</span>
                  )}
                </InputG>

                <SubmitButtonContainer>
                  {usuario?.id_permissao !== 4 && (
                    <SubmitButton
                      type="button"
                      onClick={() => handleSaveSubmenu("responsavelSimisab")}
                    >
                      Gravar
                    </SubmitButton>
                  )}
                </SubmitButtonContainer>
              </div>

              <div
                style={{
                  display: activeTab === "conselhoMunicipal" ? "block" : "none",
                }}
              >
                <input {...register("id_conselho_municipal")} type="hidden" />
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "flex", marginBottom: "10px" }}>
                    Conselho Municipal de Saneamento Básico?
                    <span style={{ color: "red" }}> *</span>
                  </label>
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      alignItems: "center",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <input
                        type="radio"
                        {...register("possui_conselho", {
                          required: "É necessário selecionar uma opção",
                        })}
                        value="sim"
                      />
                      Sim
                    </label>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <input
                        type="radio"
                        {...register("possui_conselho", {
                          required: "É necessário selecionar uma opção",
                        })}
                        value="nao"
                      />
                      Não
                    </label>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <input
                        type="radio"
                        {...register("possui_conselho", {
                          required: "É necessário selecionar uma opção",
                        })}
                        value="outros"
                      />
                      Outros
                    </label>
                  </div>
                  {errors.possui_conselho && (
                    <span
                      style={{
                        color: "red",
                        fontSize: "14px",
                        marginTop: "5px",
                      }}
                    >
                      {errors.possui_conselho.message}
                    </span>
                  )}
                </div>
                {watch("possui_conselho") === "outros" && (
                  <textarea
                    style={{ width: "500px" }}
                    {...register("descricao_outros", {
                      required: "Campo obrigatório",
                    })}
                    placeholder="Por favor, explique..."
                    rows={4}
                  />
                )}
                {errors.descricao_outros && (
                  <span>{errors.descricao_outros.message}</span>
                )}

                <SubmitButtonContainer>
                  {usuario?.id_permissao !== 4 && (
                    <SubmitButton
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSaveSubmenu("conselhoMunicipal");
                      }}
                    >
                      Gravar
                    </SubmitButton>
                  )}
                </SubmitButtonContainer>
              </div>
            </DivFormCadastro>

            <DivFormCadastro active={activeForm === "dadosGeograficos"}>
              <DivTituloForm>Dados Geográficos</DivTituloForm>
              <input
                {...register("id_dados_geograficos")}
                type="hidden"
                name="id_dados_geograficos"
              />
              <TableContainer>
                <table>
                  <tbody>
                    <tr>
                      <td
                        colSpan={4}
                        style={{
                          fontWeight: "bold",
                          textAlign: "center",
                          color: "#fff",
                          fontSize: "16px",
                          backgroundColor: "#0085bd",
                          padding: "15px",
                          width: "100%",
                        }}
                      >
                        Gerais
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>Nome da mesorregião geográfica</td>
                      <td>
                        <input
                          {...register("OGM0001", {
                            required: "Campo obrigatório",
                          })}
                          type="text"
                          name="OGM0001"
                        />
                        {errors.OGM0001 && (
                          <span>{errors.OGM0001.message}</span>
                        )}
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>Nome da microrregião geográfica</td>
                      <td>
                        <input
                          {...register("OGM0002", {
                            required: "Campo obrigatório",
                          })}
                          type="text"
                          name="OGM0002"
                        />
                        {errors.OGM0002 && (
                          <span>{errors.OGM0002.message}</span>
                        )}
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        O município pertence a uma Região Metropolitana (RM),
                        Região Integrada de Desenvolvimento (RIDE), Aglomeração
                        Urbana ou Microrregião legalmente instituída?
                      </td>
                      <td>
                        <Controller
                          name="OGM0003"
                          control={control}
                          rules={{ required: "Campo obrigatório" }}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => (
                            <>
                              <select
                                onChange={onChange}
                                value={value || ""}
                                name="OGM0003"
                              >
                                <option value="">Selecione</option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                              {error && <span>{error.message}</span>}
                            </>
                          )}
                        />
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        Nome oficial (RM, RIDE, Aglomeração Urbana ou
                        Microrregião)
                      </td>
                      <td>
                        <input
                          {...register("OGM0004", {
                            required:
                              watch("OGM0003") === "Sim"
                                ? "Campo obrigatório"
                                : false,
                          })}
                          disabled={watch("OGM0003") !== "Sim"}
                          type="text"
                          name="OGM0004"
                        />
                        {errors.OGM0004 && (
                          <span>{errors.OGM0004.message}</span>
                        )}
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>Área territorial total</td>
                      <td style={{ paddingTop: "0px", width: "150px" }}>
                        <input
                          {...register("OGM0005", {
                            required: "Campo obrigatório",
                          })}
                          type="text"
                          name="OGM0005"
                          onKeyPress={(e) => {
                            if (!/[0-9.]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                        {errors.OGM0005 && (
                          <span>{errors.OGM0005.message}</span>
                        )}
                      </td>
                      <td>km²</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>Total de áreas urbanizadas</td>
                      <td>
                        <input
                          style={{ margin: "0px", width: "150px" }}
                          {...register("OGM0006", {
                            required: "Campo obrigatório",
                          })}
                          type="text"
                          name="OGM0006"
                          onKeyPress={(e) => {
                            if (!/[0-9.]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                        {errors.OGM0006 && (
                          <span>{errors.OGM0006.message}</span>
                        )}
                      </td>
                      <td>km²</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        Quantidade de distritos em que se divide o município
                        (previsão de coleta: a partir de 2025)
                      </td>
                      <td>
                        <input
                          {...register("OGM0007", {
                            required: "Campo obrigatório",
                          })}
                          type="text"
                          name="OGM0007"
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                        {errors.OGM0007 && (
                          <span>{errors.OGM0007.message}</span>
                        )}
                      </td>
                      <td>unidades</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        Quantidade de localidades urbanas existentes, inclusive
                        à sede (previsão de coleta: a partir de 2025)
                      </td>
                      <td>
                        <input
                          {...register("OGM0008", {
                            required: "Campo obrigatório",
                          })}
                          type="text"
                          name="OGM0008"
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                        {errors.OGM0008 && (
                          <span>{errors.OGM0008.message}</span>
                        )}
                      </td>
                      <td>unidades</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        Quantidade de aglomerados rurais de características
                        urbanas existentes (previsão de coleta: a partir de
                        2025)
                      </td>
                      <td>
                        <input
                          {...register("OGM0009", {
                            required: "Campo obrigatório",
                          })}
                          type="text"
                          name="OGM0009"
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                        {errors.OGM0009 && (
                          <span>{errors.OGM0009.message}</span>
                        )}
                      </td>
                      <td>unidades</td>
                    </tr>

                    <tr>
                      <td
                        colSpan={4}
                        style={{
                          fontWeight: "bold",
                          textAlign: "center",
                          color: "#fff",
                          backgroundColor: "#0085bd",
                          fontSize: "16px",
                          borderRadius: "10px 10px 0 0",
                          padding: "15px",
                          width: "100%",
                        }}
                      >
                        Cotas topográficas, bacias hidrográficas e cursos d'água
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>Cota altimétrica de referência</td>
                      <td>
                        <input
                          {...register("OGM0010", {
                            required: "Campo obrigatório",
                          })}
                          type="text"
                          name="OGM0010"
                          onKeyPress={(e) => {
                            if (!/[0-9.]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                        {errors.OGM0010 && (
                          <span>{errors.OGM0010.message}</span>
                        )}
                      </td>
                      <td>m</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>Cota altimétrica mínima</td>
                      <td>
                        <input
                          {...register("OGM0011", {
                            required: "Campo obrigatório",
                          })}
                          type="text"
                          name="OGM0011"
                          onKeyPress={(e) => {
                            if (!/[0-9.]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                        {errors.OGM0011 && (
                          <span>{errors.OGM0011.message}</span>
                        )}
                      </td>
                      <td>m</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>Cota altimétrica máxima</td>
                      <td>
                        <input
                          {...register("OGM0012", {
                            required: "Campo obrigatório",
                          })}
                          type="text"
                          name="OGM0012"
                          onKeyPress={(e) => {
                            if (!/[0-9.]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                        {errors.OGM0012 && (
                          <span>{errors.OGM0012.message}</span>
                        )}
                      </td>
                      <td style={{ paddingTop: "15px" }}>m</td>
                    </tr>

                    <tr>
                      <td
                        colSpan={4}
                        style={{
                          fontWeight: "bold",
                          textAlign: "center",
                          backgroundColor: "#0085bd",
                          fontSize: "16px",
                          borderRadius: "10px 10px 0 0",
                          padding: "15px",
                          color: "#ffffff",
                          position: "relative",
                          width: "100%",
                        }}
                      >
                        Comunidades especiais existentes no município
                      </td>
                    </tr>

                    <tr>
                      <td></td>
                      <td>Existem Aldeias Indígenas no município?</td>
                      <td>
                        <Controller
                          name="OGM0101"
                          control={control}
                          rules={{ required: "Campo obrigatório" }}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => (
                            <>
                              <select
                                onChange={onChange}
                                value={value || ""}
                                name="OGM0101"
                              >
                                <option value="">Selecione</option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                              {error && <span>{error.message}</span>}
                            </>
                          )}
                        />
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        Quantidade de moradias/habitações existente nas Aldeias
                        Indígenas (previsão de coleta: a partir de 2025)
                      </td>
                      <td>
                        <input
                          {...register("OGM0102", {
                            required:
                              watch("OGM0101") === "Sim"
                                ? "Campo obrigatório"
                                : false,
                          })}
                          disabled={watch("OGM0101") !== "Sim"}
                          type="text"
                          name="OGM0102"
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                        {errors.OGM0102 && (
                          <span>{errors.OGM0102.message}</span>
                        )}
                      </td>
                      <td>moradias</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        População permanente estimada nas Aldeias Indígenas
                        (previsão de coleta: a partir de 2025)
                      </td>
                      <td>
                        <input
                          {...register("OGM0103", {
                            required:
                              watch("OGM0101") === "Sim"
                                ? "Campo obrigatório"
                                : false,
                          })}
                          disabled={watch("OGM0101") !== "Sim"}
                          type="text"
                          name="OGM0103"
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                        {errors.OGM0103 && (
                          <span>{errors.OGM0103.message}</span>
                        )}
                      </td>
                      <td>habitantes</td>
                    </tr>

                    <tr>
                      <td></td>
                      <td>Existem Comunidades Quilombolas no município?</td>
                      <td>
                        <Controller
                          name="OGM0104"
                          control={control}
                          rules={{ required: "Campo obrigatório" }}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => (
                            <>
                              <select
                                onChange={onChange}
                                value={value || ""}
                                name="OGM0104"
                              >
                                <option value="">Selecione</option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                              {error && <span>{error.message}</span>}
                            </>
                          )}
                        />
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        Quantidade de moradias/habitações existente nas
                        Comunidades Quilombolas (previsão de coleta: a partir de
                        2025)
                      </td>
                      <td>
                        <input
                          {...register("OGM0105", {
                            required:
                              watch("OGM0104") === "Sim"
                                ? "Campo obrigatório"
                                : false,
                          })}
                          disabled={watch("OGM0104") !== "Sim"}
                          type="text"
                          name="OGM0105"
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                        {errors.OGM0105 && (
                          <span>{errors.OGM0105.message}</span>
                        )}
                      </td>
                      <td>moradias</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        População permanente estimada nas Comunidades
                        Quilombolas (previsão de coleta: a partir de 2025)
                      </td>
                      <td>
                        <input
                          {...register("OGM0106", {
                            required:
                              watch("OGM0104") === "Sim"
                                ? "Campo obrigatório"
                                : false,
                          })}
                          disabled={watch("OGM0104") !== "Sim"}
                          type="text"
                          name="OGM0106"
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                        {errors.OGM0106 && (
                          <span>{errors.OGM0106.message}</span>
                        )}
                      </td>
                      <td style={{ paddingTop: "15px" }}>habitantes</td>
                    </tr>

                    <tr>
                      <td></td>
                      <td>Existem Comunidades Extrativistas no município?</td>
                      <td>
                        <Controller
                          name="OGM0107"
                          control={control}
                          rules={{ required: "Campo obrigatório" }}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => (
                            <>
                              <select
                                onChange={onChange}
                                value={value || ""}
                                name="OGM0107"
                              >
                                <option value="">Selecione</option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                              </select>
                              {error && <span>{error.message}</span>}
                            </>
                          )}
                        />
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        Quantidade de moradias/habitações existente nas
                        Comunidades Extrativistas (previsão de coleta: a partir
                        de 2025)
                      </td>
                      <td>
                        <input
                          {...register("OGM0108", {
                            required:
                              watch("OGM0107") === "Sim"
                                ? "Campo obrigatório"
                                : false,
                          })}
                          disabled={watch("OGM0107") !== "Sim"}
                          type="text"
                          name="OGM0108"
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                        {errors.OGM0108 && (
                          <span>{errors.OGM0108.message}</span>
                        )}
                      </td>
                      <td>moradias</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        População permanente estimada nas Comunidades
                        Extrativistas (previsão de coleta: a partir de 2025)
                      </td>
                      <td>
                        <input
                          {...register("OGM0109", {
                            required:
                              watch("OGM0107") === "Sim"
                                ? "Campo obrigatório"
                                : false,
                          })}
                          disabled={watch("OGM0107") !== "Sim"}
                          type="text"
                          name="OGM0109"
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                        {errors.OGM0109 && (
                          <span>{errors.OGM0109.message}</span>
                        )}
                      </td>
                      <td style={{ paddingTop: "15px" }}>habitantes</td>
                    </tr>
                  </tbody>
                </table>
              </TableContainer>

              <SubmitButtonContainer>
                {usuario?.id_permissao !== 4 && (
                  <SubmitButton
                    type="button"
                    onClick={() => handleSaveSubmenu("dadosGeograficos")}
                  >
                    Gravar
                  </SubmitButton>
                )}
              </SubmitButtonContainer>
            </DivFormCadastro>

            <DivFormCadastro active={activeForm === "dadosDemograficos"}>
              <DivTituloForm>Dados Demográficos</DivTituloForm>
              <input
                {...register("id_dados_demograficos")}
                type="hidden"
                name="id_dados_demograficos"
              />
              <TableContainer>
                <table>
                  <tbody>
                    <tr>
                      <td></td>
                      <td>
                        População Urbana<span> *</span>
                      </td>
                      <td>
                        <input
                          {...register("dd_populacao_urbana", {
                            required: "Campo obrigatório",
                          })}
                          type="text"
                          name="dd_populacao_urbana"
                          onKeyDown={(e) => {
                            // Permitir teclas de controle (Backspace, Delete, Tab, etc.)
                            if (
                              e.key === "Backspace" ||
                              e.key === "Delete" ||
                              e.key === "Tab" ||
                              e.key === "ArrowLeft" ||
                              e.key === "ArrowRight" ||
                              e.key === "ArrowUp" ||
                              e.key === "ArrowDown" ||
                              e.key === "Home" ||
                              e.key === "End" ||
                              (e.ctrlKey &&
                                (e.key === "a" ||
                                  e.key === "c" ||
                                  e.key === "v" ||
                                  e.key === "x"))
                            ) {
                              return;
                            }
                            // Permitir apenas números
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        ></input>
                        {errors.dd_populacao_urbana && (
                          <span>{errors.dd_populacao_urbana.message}</span>
                        )}
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        {" "}
                        População Rural<span> *</span>
                      </td>
                      <td>
                        <input
                          {...register("dd_populacao_rural", {
                            required: "Campo obrigatório",
                          })}
                          type="text"
                          name="dd_populacao_rural"
                          onKeyDown={(e) => {
                            // Permitir teclas de controle (Backspace, Delete, Tab, etc.)
                            if (
                              e.key === "Backspace" ||
                              e.key === "Delete" ||
                              e.key === "Tab" ||
                              e.key === "ArrowLeft" ||
                              e.key === "ArrowRight" ||
                              e.key === "ArrowUp" ||
                              e.key === "ArrowDown" ||
                              e.key === "Home" ||
                              e.key === "End" ||
                              (e.ctrlKey &&
                                (e.key === "a" ||
                                  e.key === "c" ||
                                  e.key === "v" ||
                                  e.key === "x"))
                            ) {
                              return;
                            }
                            // Permitir apenas números
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        ></input>
                        {errors.dd_populacao_rural && (
                          <span>{errors.dd_populacao_rural.message}</span>
                        )}
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        {" "}
                        População Total<span> *</span>
                      </td>
                      <td>
                        <input
                          {...register("dd_populacao_total")}
                          type="text"
                          disabled={true}
                          readOnly
                        ></input>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        Total de Moradias<span> *</span>
                      </td>
                      <td>
                        <input
                          {...register("dd_total_moradias", {
                            required: "Campo obrigatório",
                          })}
                          type="text"
                          name="dd_total_moradias"
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        ></input>
                        {errors.dd_total_moradias && (
                          <span>{errors.dd_total_moradias.message}</span>
                        )}
                      </td>
                      <td></td>
                    </tr>

                    <tr>
                      <td></td>
                      <td>
                        {" "}
                        Quantidade de estabelecimentos urbanos existente no
                        município (previsão de coleta: a partir de 2025)
                      </td>
                      <td>
                        <input
                          {...register("OGM4001", {
                            required: "Campo obrigatório",
                          })}
                          type="text"
                          name="OGM4001"
                          onKeyDown={(e) => {
                            // Permitir teclas de controle (Backspace, Delete, Tab, etc.)
                            if (
                              e.key === "Backspace" ||
                              e.key === "Delete" ||
                              e.key === "Tab" ||
                              e.key === "ArrowLeft" ||
                              e.key === "ArrowRight" ||
                              e.key === "ArrowUp" ||
                              e.key === "ArrowDown" ||
                              e.key === "Home" ||
                              e.key === "End" ||
                              (e.ctrlKey &&
                                (e.key === "a" ||
                                  e.key === "c" ||
                                  e.key === "v" ||
                                  e.key === "x"))
                            ) {
                              return;
                            }
                            // Permitir apenas números
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        ></input>
                        {errors.OGM4001 && (
                          <span>{errors.OGM4001.message}</span>
                        )}
                      </td>
                      <td>Unidades</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        {" "}
                        Quantidade de estabelecimentos rurais existente no
                        município (previsão de coleta: a partir de 2025)
                      </td>
                      <td>
                        <input
                          {...register("OGM4002", {
                            required: "Campo obrigatório",
                          })}
                          type="text"
                          name="OGM4002"
                          onKeyDown={(e) => {
                            // Permitir teclas de controle (Backspace, Delete, Tab, etc.)
                            if (
                              e.key === "Backspace" ||
                              e.key === "Delete" ||
                              e.key === "Tab" ||
                              e.key === "ArrowLeft" ||
                              e.key === "ArrowRight" ||
                              e.key === "ArrowUp" ||
                              e.key === "ArrowDown" ||
                              e.key === "Home" ||
                              e.key === "End" ||
                              (e.ctrlKey &&
                                (e.key === "a" ||
                                  e.key === "c" ||
                                  e.key === "v" ||
                                  e.key === "x"))
                            ) {
                              return;
                            }
                            // Permitir apenas números
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        ></input>
                        {errors.OGM4002 && (
                          <span>{errors.OGM4002.message}</span>
                        )}
                      </td>
                      <td>Unidades</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        {" "}
                        Quantidade de estabelecimentos totais existente no
                        município (previsão de coleta: a partir de 2025).
                      </td>
                      <td>
                        <input
                          {...register("OGM4003")}
                          type="text"
                          name="OGM4003"
                          disabled={true}
                        ></input>
                      </td>
                      <td>Unidades</td>
                    </tr>

                    <tr>
                      <td></td>
                      <td>
                        Quantidade de domicílios urbanos existente no município.
                      </td>
                      <td>
                        <input
                          {...register("OGM4004", {
                            required: "Campo obrigatório",
                          })}
                          type="text"
                          name="OGM4004"
                          onKeyDown={(e) => {
                            // Permitir teclas de controle (Backspace, Delete, Tab, etc.)
                            if (
                              e.key === "Backspace" ||
                              e.key === "Delete" ||
                              e.key === "Tab" ||
                              e.key === "ArrowLeft" ||
                              e.key === "ArrowRight" ||
                              e.key === "ArrowUp" ||
                              e.key === "ArrowDown" ||
                              e.key === "Home" ||
                              e.key === "End" ||
                              (e.ctrlKey &&
                                (e.key === "a" ||
                                  e.key === "c" ||
                                  e.key === "v" ||
                                  e.key === "x"))
                            ) {
                              return;
                            }
                            // Permitir apenas números
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        ></input>
                        {errors.OGM4004 && (
                          <span>{errors.OGM4004.message}</span>
                        )}
                      </td>
                      <td>Domicílios</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        Quantidade de domicílios rurais existente no município.
                      </td>
                      <td>
                        <input
                          {...register("OGM4005", {
                            required: "Campo obrigatório",
                          })}
                          type="text"
                          name="OGM4005"
                          onKeyDown={(e) => {
                            // Permitir teclas de controle (Backspace, Delete, Tab, etc.)
                            if (
                              e.key === "Backspace" ||
                              e.key === "Delete" ||
                              e.key === "Tab" ||
                              e.key === "ArrowLeft" ||
                              e.key === "ArrowRight" ||
                              e.key === "ArrowUp" ||
                              e.key === "ArrowDown" ||
                              e.key === "Home" ||
                              e.key === "End" ||
                              (e.ctrlKey &&
                                (e.key === "a" ||
                                  e.key === "c" ||
                                  e.key === "v" ||
                                  e.key === "x"))
                            ) {
                              return;
                            }
                            // Permitir apenas números
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        ></input>
                        {errors.OGM4005 && (
                          <span>{errors.OGM4005.message}</span>
                        )}
                      </td>
                      <td>Domicílios</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        Quantidade de domicílios totais existente no município.
                      </td>
                      <td>
                        <input
                          {...register("OGM4006")}
                          type="text"
                          name="OGM4006"
                          disabled={true}
                        ></input>
                      </td>
                      <td>Domicílios</td>
                    </tr>

                    <tr>
                      <td></td>
                      <td>
                        Extensão total de vias públicas urbanas com pavimento.
                      </td>
                      <td>
                        <input
                          {...register("OGM4007", {
                            required: "Campo obrigatório",
                          })}
                          type="text"
                          name="OGM4007"
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        ></input>
                        {errors.OGM4007 && (
                          <span>{errors.OGM4007.message}</span>
                        )}
                      </td>
                      <td>Km</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        {" "}
                        Extensão total de vias públicas urbanas sem pavimento.
                      </td>
                      <td>
                        <input
                          {...register("OGM4008", {
                            required: "Campo obrigatório",
                          })}
                          type="text"
                          name="OGM4008"
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        ></input>
                        {errors.OGM4008 && (
                          <span>{errors.OGM4008.message}</span>
                        )}
                      </td>
                      <td>Km</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        Extensão total de vias públicas urbanas (com e sem
                        pavimento).
                      </td>
                      <td>
                        <input
                          {...register("OGM4009")}
                          type="text"
                          name="OGM4009"
                          disabled={true}
                        ></input>
                      </td>
                      <td>Km</td>
                    </tr>
                  </tbody>
                </table>
              </TableContainer>

              <SubmitButtonContainer>
                {usuario?.id_permissao !== 4 && (
                  <SubmitButton
                    type="button"
                    onClick={() => handleSaveSubmenu("dadosDemograficos")}
                  >
                    Gravar
                  </SubmitButton>
                )}
              </SubmitButtonContainer>
            </DivFormCadastro>

          </Form>
          
          {/* Renderização de Indicadores para Menu Items Dinâmicos - FORA do formulário principal */}
          {isDynamicMenuItemActive && (
            <Form onSubmit={handleSubmitIndicadores(handleCadastroIndicadores)}>
              <BreadCrumbStyle $isCollapsed={isCollapsed}>
                <nav>
                  <ol>
                    <li>
                      <Link href="/indicadores/home_indicadores">Home</Link>
                      <span> / </span>
                    </li>
                    <li>
                      <span>Cadastro</span>
                      {grupo && (
                        <>
                          <span> / </span>
                        </>
                      )}
                    </li>
                    {grupo && (
                      <li>
                        <span>{grupo}</span>
                      </li>
                    )}
                  </ol>
                </nav>
              </BreadCrumbStyle>
              <DivForm style={{ borderColor: "" }}>
                <DivTituloFormIndicadores>{grupo}</DivTituloFormIndicadores>

                  <div
                    style={{ padding: "20px", borderBottom: "1px solid #eee" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <label>Selecionar Ano:</label>
                        <select
                          value={anoSelected || ""}
                          onChange={(e) => selectAno(e.target.value)}
                          disabled={loadingDados}
                          style={{ marginLeft: "10px", padding: "5px" }}
                        >
                          <option value="">Selecione o ano</option>
                          {anosSelect().map((ano) => (
                            <option key={ano} value={ano}>
                              {ano}
                            </option>
                          ))}
                        </select>
                        {loadingDados && (
                          <span style={{ marginLeft: "10px", color: "#12B2D5" }}>
                            Carregando dados...
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: "14px", color: "#666" }}>
                        <strong>{indicadores.length}</strong> indicador
                        {indicadores.length !== 1 ? "es" : ""} encontrado
                        {indicadores.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>

                  <DivFormEixo>
                    <DivFormConteudo
                      active={!!grupo}
                      style={{
                        display: grupo ? "block" : "none",
                        visibility: grupo ? "visible" : "hidden",
                        opacity: grupo ? 1 : 0,
                      }}
                    >
                      <DivTitulo>
                        <DivTituloConteudo>{grupo}</DivTituloConteudo>
                      </DivTitulo>

                      {!grupo ? (
                        <div
                          style={{
                            textAlign: "center",
                            padding: "40px",
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          <p>👈 Selecione um item do menu lateral para começar</p>
                        </div>
                      ) : loadingIndicadores ? (
                        <div style={{ textAlign: "center", padding: "40px" }}>
                          <p>Carregando indicadores...</p>
                        </div>
                      ) : indicadores.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px" }}>
                          <p>Nenhum indicador encontrado para este grupo.</p>
                        </div>
                      ) : (
                        <div
                          style={{
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            overflow: "hidden",
                            marginTop: "20px",
                          }}
                        >
                          {/* Cabeçalho da Tabela */}
                          <div
                            style={{
                              backgroundColor: "#1e88e5",
                              color: "white",
                              padding: "15px 0",
                              fontWeight: "600",
                              fontSize: "13px",
                              letterSpacing: "0.5px",
                            }}
                          >
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns:
                                  window.innerWidth > 768
                                    ? "180px 1fr 280px 100px"
                                    : "1fr",
                                gap: window.innerWidth > 768 ? "15px" : "10px",
                                alignItems: "center",
                                padding: "0 15px",
                              }}
                            >
                              {window.innerWidth > 768 ? (
                                <>
                                  <div>CÓDIGO</div>
                                  <div>DESCRIÇÃO DO INDICADOR</div>
                                  <div style={{ textAlign: "center" }}>
                                    VALOR - ANO: {anoSelected || "____"}
                                  </div>
                                  <div style={{ textAlign: "center" }}>
                                    UNIDADE
                                  </div>
                                </>
                              ) : (
                                <div>
                                  INDICADORES - ANO: {anoSelected || "____"}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Linhas da Tabela */}
                          {indicadores.map((indicador, index) => {
                            const tipoCampo =
                              indicador.tiposCampo &&
                              indicador.tiposCampo.length > 0
                                ? indicador.tiposCampo[0]
                                : null;
                            const isEven = index % 2 === 0;
                            const fieldName = anoSelected
                              ? `${indicador.codigo_indicador}_${anoSelected}`
                              : null;

                            return (
                              <div
                                key={indicador.id_indicador}
                                style={{
                                  backgroundColor: isEven ? "#f8f9fa" : "#ffffff",
                                  borderBottom:
                                    index < indicadores.length - 1
                                      ? "1px solid #dee2e6"
                                      : "none",
                                  padding: "15px 0",
                                  transition: "background-color 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#e8f4fd";
                                  e.currentTarget.style.borderLeft =
                                    "3px solid #1e88e5";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = isEven
                                    ? "#f8f9fa"
                                    : "#ffffff";
                                  e.currentTarget.style.borderLeft = "none";
                                }}
                              >
                                {window.innerWidth > 768 ? (
                                  <div
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns:
                                        "180px 1fr 280px 100px",
                                      gap: "15px",
                                      alignItems: "center",
                                      padding: "0 15px",
                                    }}
                                  >
                                    {/* Código */}
                                    <div>
                                      <div
                                        style={{
                                          fontSize: "15px",
                                          fontWeight: "bold",
                                          color: "#1e88e5",
                                        }}
                                      >
                                        {indicador.codigo_indicador}
                                      </div>
                                    </div>

                                    {/* Descrição */}
                                    <div
                                      style={{
                                        fontSize: "14px",
                                        color: "#495057",
                                        lineHeight: "1.3",
                                      }}
                                    >
                                      {indicador.nome_indicador}
                                    </div>

                                    {/* Campo de Input */}
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                      }}
                                    >
                                      {anoSelected && fieldName ? (
                                        <div style={{ width: "260px" }}>
                                          {tipoCampo?.type === "number" ? (
                                            <input
                                              {...registerIndicadores(fieldName as any)}
                                              type="number"
                                              step="any"
                                              style={{
                                                width: "100%",
                                                padding: "8px 12px",
                                                border: "1px solid #dee2e6",
                                                borderRadius: "4px",
                                              }}
                                            />
                                          ) : tipoCampo?.type === "select" ? (
                                            <select
                                              {...registerIndicadores(fieldName as any)}
                                              style={{
                                                width: "100%",
                                                padding: "8px 12px",
                                                border: "1px solid #dee2e6",
                                                borderRadius: "4px",
                                              }}
                                            >
                                              <option value="">Selecione...</option>
                                              {tipoCampo.selectOptions
                                                ?.sort(
                                                  (a, b) =>
                                                    (a.ordem_option || 0) -
                                                    (b.ordem_option || 0)
                                                )
                                                .map((option) => (
                                                  <option
                                                    key={option.id_select_option}
                                                    value={option.value}
                                                  >
                                                    {option.descricao || option.value}
                                                  </option>
                                                ))}
                                            </select>
                                          ) : (
                                            <input
                                              {...registerIndicadores(fieldName as any)}
                                              type="text"
                                              style={{
                                                width: "100%",
                                                padding: "8px 12px",
                                                border: "1px solid #dee2e6",
                                                borderRadius: "4px",
                                              }}
                                            />
                                          )}
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
                                            fontSize: "12px",
                                          }}
                                        />
                                      )}
                                    </div>

                                    {/* Unidade */}
                                    <div
                                      style={{
                                        textAlign: "center",
                                        fontSize: "12px",
                                        color: "#495057",
                                      }}
                                    >
                                      <div
                                        style={{
                                          fontWeight: "500",
                                          padding: "5px 6px",
                                          backgroundColor: "#e9ecef",
                                          borderRadius: "3px",
                                          fontSize: "11px",
                                        }}
                                      >
                                        {indicador.unidade_indicador || "-"}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  /* Layout Mobile */
                                  <div
                                    style={{
                                      padding: "0 15px",
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: "10px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div>
                                        <div
                                          style={{
                                            fontSize: "16px",
                                            fontWeight: "bold",
                                            color: "#1e88e5",
                                          }}
                                        >
                                          {indicador.codigo_indicador}
                                        </div>
                                        <div
                                          style={{
                                            fontSize: "11px",
                                            color: "#6c757d",
                                          }}
                                        >
                                          {indicador.unidade_indicador || "-"}
                                        </div>
                                      </div>
                                      {tipoCampo && (
                                        <div
                                          style={{
                                            fontSize: "10px",
                                            color: "#6c757d",
                                            backgroundColor: "#f8f9fa",
                                            padding: "3px 6px",
                                            borderRadius: "3px",
                                          }}
                                        >
                                          {tipoCampo.type}
                                        </div>
                                      )}
                                    </div>

                                    <div
                                      style={{
                                        fontSize: "13px",
                                        color: "#495057",
                                        lineHeight: "1.3",
                                        marginBottom: "8px",
                                      }}
                                    >
                                      {indicador.nome_indicador}
                                    </div>

                                    {anoSelected && fieldName ? (
                                      tipoCampo?.type === "number" ? (
                                        <input
                                          {...registerIndicadores(fieldName as any)}
                                          type="number"
                                          step="any"
                                          style={{
                                            width: "100%",
                                            padding: "8px 12px",
                                            border: "1px solid #dee2e6",
                                            borderRadius: "4px",
                                          }}
                                        />
                                      ) : tipoCampo?.type === "select" ? (
                                        <select
                                          {...registerIndicadores(fieldName as any)}
                                          style={{
                                            width: "100%",
                                            padding: "8px 12px",
                                            border: "1px solid #dee2e6",
                                            borderRadius: "4px",
                                          }}
                                        >
                                          <option value="">Selecione...</option>
                                          {tipoCampo.selectOptions
                                            ?.sort(
                                              (a, b) =>
                                                (a.ordem_option || 0) -
                                                (b.ordem_option || 0)
                                            )
                                            .map((option) => (
                                              <option
                                                key={option.id_select_option}
                                                value={option.value}
                                              >
                                                {option.descricao || option.value}
                                              </option>
                                            ))}
                                        </select>
                                      ) : (
                                        <input
                                          {...registerIndicadores(fieldName as any)}
                                          type="text"
                                          style={{
                                            width: "100%",
                                            padding: "8px 12px",
                                            border: "1px solid #dee2e6",
                                            borderRadius: "4px",
                                          }}
                                        />
                                      )
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
                                          textAlign: "center",
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
                    {usuario?.id_permissao !== 4 &&
                      indicadores.length > 0 &&
                      anoSelected && (
                        <div
                          style={{
                            marginTop: "30px",
                            padding: "20px",
                            textAlign: "center",
                            borderTop: "1px solid #e1e5e9",
                          }}
                        >
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
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#218838";
                              e.currentTarget.style.boxShadow =
                                "0 4px 8px rgba(40,167,69,0.3)";
                              e.currentTarget.style.transform =
                                "translateY(-1px)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "#28a745";
                              e.currentTarget.style.boxShadow =
                                "0 2px 4px rgba(40,167,69,0.2)";
                              e.currentTarget.style.transform =
                                "translateY(0)";
                            }}
                          >
                            💾 Salvar Dados dos Indicadores
                          </button>
                        </div>
                      )}
                  </DivFormEixo>
                </DivForm>
              </Form>
            )}
        </DivCenter>
      </MainContent>
    </Container>
  );
}
