/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaBars,
  FaCaretDown,
  FaList,
  FaLink,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaMapMarkerAlt,
} from "react-icons/fa";
import {
  InputM,
  DivTitulo,
  DivTituloConteudo,
  DivFormEixo,
} from "../../styles/financeiro";

import {
  Container,
  DivCenter,
  DivForm,
  DivTituloForm,
  Form,
  SubmitButton,
} from "../../styles/esgoto-indicadores";

import HeadIndicadores from "../../components/headIndicadores";
import { getAPIClient } from "../../services/axios";
import MenuIndicadores from "../../components/MenuIndicadores";
import MapPicker from "../../components/MapPicker";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../services/api";
import MenuHorizontal from "../../components/MenuHorizontal";
import { toast } from "react-toastify";
import MenuIndicadoresCadastro from "../../components/MenuIndicadoresCadastro";
import {
  Sidebar,
  SidebarItem,
  MenuHeader,
  MenuItemsContainer,
} from "../../styles/residuo-solidos-in";
import { DivFormConteudo } from "../../styles/drenagem-indicadores";
import {
  BreadCrumbStyle,
  CollapseButton,
  ExpandButton,
  MainContent,
} from "../../styles/indicadores";
import {
  ContainerModal,
  Modal,
  CloseModalButton,
  ConteudoModal,
  TituloModal,
  TextoModal,
  BotaoAdicionar,
  BotaoEditar,
  BotaoRemover,
} from "../../styles/dashboard";
import { anosSelect } from "../../util/util";
import { bold } from "@uiw/react-md-editor/lib/commands";
import Link from "next/link";
import { BodyDashboard } from "@/styles/dashboard-original";

interface IMunicipio {
  id_municipio: string;
  municipio_codigo_ibge: string;
  municipio_nome: string;
  aa_natureza_juridica?: string;
}

interface IPrestadorServico {
  id_ps_abastecimento_agua: string; // OGM1001
  ps_setor_responsavel: string; // OGM1002
  ps_abrangencia: string; // OGM1004
  ps_natureza_juridica: string; // OGM1003
  ps_cnpj: string; // OGM1005
  ps_telefone: string; // OGM1006
  ps_cep: string; // OGM1007
  ps_endereco: string; // OGM1008
  ps_numero: string; // OGM1009
  ps_bairro: string; // OGM1010
  ps_nome_responsavel: string; // OGM1011
  ps_cargo: string; // OGM1012
  ps_email: string; // OGM1013
  id_municipio: string; // OGM1014
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

interface IUnidade {
  id_unidade: number;
  nome_unidade: string;
  id_tipo_unidade?: number;
  id_eixo?: number;
  id_municipio?: number;
  data_cadastro?: string;
  created_at?: string;
  updated_at?: string;
  tipoUnidade?: {
    id_tipo_unidade: number;
    nome_tipo_unidade: string;
  };
  eixo?: {
    id_eixo: number;
    nome_eixo: string;
  };
  municipio?: {
    id_municipio: string;
    municipio_nome: string;
  };
}

interface IEixo {
  id_eixo: number;
  nome: string;
}

interface MunicipioProps {
  Imunicipio: IMunicipio[];
}

const CampoIndicador = ({
  indicador,
  register,
  anoSelected,
  campoEnabled,
  fieldStates,
  setFieldStates,
  setValue,
  dadosMunicipio,
  watch,
  prestadoresServicos,
  onOpenMapModal,
}: {
  indicador: IIndicador;
  register: any;
  anoSelected: string;
  campoEnabled?: boolean;
  fieldStates?: { [key: string]: any };
  setFieldStates?: (states: { [key: string]: any }) => void;
  setValue?: any;
  dadosMunicipio?: IMunicipio;
  watch?: any;
  prestadoresServicos?: IPrestadorServico[];
  onOpenMapModal?: (fieldName: string) => void;
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

  

  const tipoCampo =
    indicador.tiposCampo && indicador.tiposCampo.length > 0
      ? indicador.tiposCampo[0]
      : null;
  const fieldName = `${indicador.codigo_indicador}_${anoSelected}`;
  const { usuario } = useContext(AuthContext);

  // Função para verificar se um campo deve estar habilitado baseado nas condições
  const isFieldEnabled = (codigoIndicador: string) => {
    // Se não há fieldStates, usar valor padrão
    if (!fieldStates) {
      return true;
    }

    // Por padrão, campos estão habilitados
    return true;
  };

  const isDisabled = !isFieldEnabled(indicador.codigo_indicador);

  function onChangeEnabled(value: any, codigoIndicador: string) {
    if (setFieldStates && fieldStates) {
      const newStates = { ...fieldStates };
    }
  }
  
  // Campo não configurado ou com erro
  if (!tipoCampo) {
    const hasError = indicador._hasError;
    return (
      <input
        {...register(fieldName)}
        type="text"
        placeholder={
          hasError ? "Erro ao carregar configuração" : "Campo sem configuração"
        }
        title={
          hasError
            ? "Verifique a conectividade com o servidor"
            : "Este indicador não possui configuração de campo"
        }
        style={{
          backgroundColor: hasError ? "#fff3cd" : "#f8f9fa",
          border: hasError ? "1px solid #ffeaa7" : "1px solid #dee2e6",
          color: hasError ? "#856404" : "#6c757d",
        }}
      />
    );
  }

   // Configuração de somas automáticas
  // Estrutura: { campoDestino: [camposOrigem] }
  const configuracoesSoma: { [key: string]: string[] } = {
    "GFI2008": ["GFI2001", "GFI2002", "GFI2003", "GFI2004", "GFI2005", "GFI2006", "GFI2007"],
    "GFI2012": ["GFI2009", "GFI2010", "GFI2011"],
    "GFI2016": ["GFI2013", "GFI2014", "GFI2015"],
    "GFI2018": ["GFI2012", "GFI2016", "GFI2017"],
    "GFI2020": ["GFI2008", "GFI2009", "GFI2010", "GFI2016", "GFI2017", "GFI2019"],
    "GFI2024": ["GFI2021", "GFI2022", "GFI2023", "GFI2027","GFI2030", "GFI2031", "GFI2032"],
    "GFI2027": ["GFI2025", "GFI2026"],
    "GFI2030": ["GFI2028", "GFI2029"],
    "GFI2036": ["GFI2033", "GFI2034", "GFI2035", "GFI2039", "GFI2042", "GFI2043", "GFI2044"],
    "GFI2039": ["GFI2037", "GFI2038"],
    "GFI2042": ["GFI2040", "GFI2041"],
    "GFI2047": ["GFI2045", "GFI2046"],
    "DFE0001": ["DFE0002", "DF00030"],
    "GTA0019": ["GTA0001", "GTA0002"],
    "TEDGTA001": ["GTA0003", "GTA0005"],
    "GTA1014": ["GTA1001", "GTA1009"],
    "GTA1207": ["GTA1204", "GTA1205", "GTA1206"],
    "GTA1211": ["GTA1209", "GTA1210"],
    "GTA1214": ["GTA1212", "GTA1213"],
    "GTA1217": ["GTA1215", "GTA1216"],
    "GTA1218": ["GTA1211", "GTA1203", "GTA1207","GTA1217"],
    // Adicione mais configurações aqui conforme necessário
  };
  // Verificar se este campo precisa de soma automática
  const campoPrecisaSoma = configuracoesSoma[indicador.codigo_indicador];
  
  // Preparar nomes dos campos para observação
  const camposOrigem = React.useMemo(() => {
    if (!campoPrecisaSoma || !anoSelected) return [];
    return campoPrecisaSoma.map(codigo => `${codigo}_${anoSelected}`);
  }, [campoPrecisaSoma, anoSelected]);
  
  const campoDestino = React.useMemo(() => {
    return anoSelected ? `${indicador.codigo_indicador}_${anoSelected}` : null;
  }, [indicador.codigo_indicador, anoSelected]);

  // Observar cada campo individualmente (watch precisa ser chamado durante render para criar subscriptions)
  // Mas não usar os valores diretamente nas dependências do useEffect
  const valoresObservados = campoPrecisaSoma && watch && camposOrigem.length > 0
    ? camposOrigem.map(campo => watch(campo))
    : null;

  // Usar ref para rastrear o último valor calculado e evitar loops
  const ultimoValorRef = React.useRef<string>("");

  // Calcular e atualizar soma automática
  // Usar apenas os nomes dos campos como dependência, não os valores
  useEffect(() => {
    if (!campoPrecisaSoma || !setValue || !anoSelected || !campoDestino || !valoresObservados || camposOrigem.length === 0) {
      return;
    }

    // Calcular a soma de todos os valores observados
    const soma = valoresObservados.reduce((total: number, valor: any) => {
      return total + (parseFloat(String(valor)) || 0);
    }, 0);

    const novoValor = soma > 0 ? soma.toString() : "";

    // Só atualizar se o valor calculado for diferente do último valor calculado
    // Isso evita loops infinitos
    if (ultimoValorRef.current !== novoValor) {
      ultimoValorRef.current = novoValor;
      setValue(campoDestino, novoValor, { shouldValidate: false, shouldDirty: false });
    }
  }, [campoPrecisaSoma, setValue, anoSelected, campoDestino, camposOrigem.join(',')]);

  
  // Configuração de campos dependentes (campo dependente: campo de controle)
  // Campos que só são habilitados quando o campo de controle tem valor "Sim"
  const camposDependentes: { [key: string]: string } = {
    "GFI1109": "GFI1108",
    "GFI1013": "GFI1012",
    "GFI1013A": "GFI1013",
    "GFI1016": "GFI1015",
    "GFI1016A": "GFI1016",
    "GFI1020A": "GFI1019",
    "GFI1021A": "GFI1020",
    "GFI1022": "GFI1019",
    "GFI1023": "GFI1022",
    "GFI1024": "GFI1023",
    "GFI1025": "GFI1023",
    "GFI1026": "GFI1019",
    "GFI1027": "GFI1026",
    "GFI1028": "GFI1019",
    "GFI1029": "GFI1028",
    "GFI1030": "GFI1019",
    "GFI1031": "GFI1019",
    "GFI1032": "GFI1019",
    "GFI1033": "GFI1019",
    "GFI1034": "GFI1019",
    "GFI1035": "GFI1019",
    "GFI1035A": "GFI1035",
    "CAD2002A": "CAD2002",
    "CAD2004A": "CAD2004",
    "GFI1010": "GFI1009",
    "GFI1010A": "GFI1010",
    // Adicione mais campos dependentes aqui conforme necessário
    // Exemplo: "GFI1110": "GFI1108",
  };

  // Campos com condições personalizadas de habilitação
  // Mapeia campo dependente para o valor que deve ter no campo de controle
  const camposComCondicaoEspecial: { [key: string]: string } = {
    "CAD2002A": "Outra situação (especificar).",
    "CAD2004A": "Outro (especifique).",
    "GFI1010A": "Outro (especifique)",
    "GFI1013A": "Outro (especifique)",
    "GFI1016A": "Outro (especifique)",
  };

  // Verificar se este campo é dependente de outro campo
  const campoControle = camposDependentes[indicador.codigo_indicador];
  const nomeCampoControle = campoControle && anoSelected ? `${campoControle}_${anoSelected}` : null;
  
  // Observar o valor do campo de controle se existir
  const valorCampoControle = nomeCampoControle && watch ? watch(nomeCampoControle) : null;
  
  // Verificar se este campo tem uma condição especial de habilitação
  const valorEsperadoEspecial = camposComCondicaoEspecial[indicador.codigo_indicador];
  
  // Determinar se o campo deve estar habilitado
  // Se for um campo dependente, só habilita se o campo de controle tiver o valor esperado
  // Campos com condição especial: verifica se valorCampoControle é igual ao valorEsperadoEspecial
  // Campos normais: verifica se valorCampoControle é "Sim" ou "Outro"
  // Caso contrário, usa a configuração padrão do tipoCampo.enable
  const campoHabilitado = campoControle 
    ? valorEsperadoEspecial
      ? (valorCampoControle === valorEsperadoEspecial && tipoCampo.enable)
      : ((valorCampoControle === "Sim" || valorCampoControle === "Outro") && tipoCampo.enable)
    : tipoCampo.enable;


  // Se o campo não está habilitado (seja por configuração ou por dependência)
  if (!campoHabilitado) {
    // Campo especial GTA2204 com botão de mapa (mesmo quando desabilitado, permite seleção)
    if (indicador.codigo_indicador === "GTA2204" && onOpenMapModal) {
      const fieldValue = watch ? watch(fieldName) : null;
      const hasValue = fieldValue && fieldValue !== "";
      
      console.log("=== DEBUG CampoIndicador GTA2204 (campo desabilitado) ===");
      console.log("fieldName:", fieldName);
      console.log("fieldValue:", fieldValue);
      console.log("hasValue:", hasValue);
      console.log("register existe?", !!register);

      // Sempre renderizar o input (mesmo que escondido) para garantir que seja registrado
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "90%" }}>
          <input
            {...register(fieldName)}
            type="text"
            readOnly
            style={{
              backgroundColor: "#f8f9fa",
              flex: hasValue ? 1 : 0,
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "13px",
              cursor: "not-allowed",
              color: "#6c757d",
              display: hasValue ? "block" : "none",
              width: hasValue ? "auto" : "0",
              minWidth: hasValue ? "auto" : "0",
            }}
          />
          <button
            type="button"
            onClick={() => onOpenMapModal(fieldName)}
            style={{
              padding: hasValue ? "8px 16px" : "10px 20px",
              backgroundColor: hasValue ? "#ff9800" : "#1e88e5",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: hasValue ? "13px" : "14px",
              fontWeight: "500",
              width: hasValue ? "auto" : "90%",
              justifyContent: "center",
            }}
            title={hasValue ? "Alterar localização" : "Selecionar Localização no Mapa"}
          >
            <FaMapMarkerAlt />
            {hasValue ? "Alterar" : "Selecionar Localização no Mapa"}
          </button>
        </div>
      );
    }

    // Se for um campo select dependente, renderizar como select desabilitado
    if (campoControle && tipoCampo.type?.toLowerCase() === "select") {
      const options = tipoCampo.selectOptions || [];
      return (
        <select
          {...register(fieldName)}
          disabled
          style={{
            width: "90%",
            padding: "8px 12px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "13px",
            transition: "all 0.2s ease",
            boxShadow: "none",
            backgroundColor: "#f8f9fa",
            color: "#6c757d",
            cursor: "not-allowed",
          }}
        >
          <option value="">Selecione...</option>
          {options
            .sort((a, b) => (a.ordem_option || 0) - (b.ordem_option || 0))
            .map((option, index) => (
              <option
                key={option.id_select_option || index}
                value={option.value}
              >
                {option.descricao || option.value}
              </option>
            ))}
        </select>
      );
    }
    
    // Para outros tipos de campo, renderizar como input desabilitado
    return (
      <input
        {...register(fieldName)}
        type={tipoCampo.type}
        disabled
        style={{
          backgroundColor: "#f8f9fa",
          width: "90%",
          padding: "8px 12px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          fontSize: "13px",
          transition: "all 0.2s ease",
          boxShadow: "none",
          textAlign: "right",
          color: "#6c757d",
          cursor: "not-allowed",
        }}
      />
    );
  }

  // Função para obter a mensagem de placeholder baseada na condição
  const getPlaceholderMessage = (codigoIndicador: string) => {
    if (isDisabled) {
      switch (codigoIndicador) {
        // case "CAD2002":
        //   return "Campo CAD2002 desabilitado";
        default:
          return "Campo desabilitado";
      }
    }
    return tipoCampo.default_value;
  };

  // Pegar o registro do react-hook-form
  const fieldRegistration = register(fieldName);

  // Criar onChange combinado que preserva o react-hook-form
  const combinedOnChange = (e: any) => {
    // Chamar primeiro o onChange do react-hook-form
    fieldRegistration.onChange(e);
    // Depois chamar nossa lógica personalizada
    onChangeEnabled(e.target.value, indicador.codigo_indicador);
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
      boxShadow: "none",
    },
  };

  // Renderizar conforme o tipo
  switch (tipoCampo.type?.toLowerCase()) {
    case "number":
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

    case "select":
      let options = tipoCampo.selectOptions || [];

      // Select personalizado para CAD2001
      if (indicador.codigo_indicador === "CAD2001" && prestadoresServicos && prestadoresServicos.length > 0) {
        const prestador = prestadoresServicos[0];
        const psAbrangencia = prestador?.ps_abrangencia?.trim(); // TEDP001
        const psNaturezaJuridica = prestador?.ps_natureza_juridica?.trim(); // OGM1003

        console.log("CAD2001 - psAbrangencia:", psAbrangencia, "psNaturezaJuridica:", psNaturezaJuridica);

        let opcoesPersonalizadas = null;

        // Condição 1: TEDP001 = "Local" E OGM1003 = "Município", "Autarquia", "Empresa pública", "Sociedade de economia mista"
        const condicao1_naturezaJuridicaValidas = [
          "Município",
          "Autarquia",
          "Empresa pública",
          "Sociedade de economia mista"
        ];
        const condicao1_atendida = psAbrangencia === "Local" && condicao1_naturezaJuridicaValidas.includes(psNaturezaJuridica);
        console.log("CAD2001 - Condição 1 atendida:", condicao1_atendida);
        if (condicao1_atendida) {
          opcoesPersonalizadas = [
            { value: "Sem Atendimento", descricao: "Sem Atendimento" },
            { value: "Sede e Localidades", descricao: "Sede e Localidades" },
            { value: "Somente Sede", descricao: "Somente Sede" },
            { value: "Somente Localidades", descricao: "Somente Localidades" }
          ];
          console.log("CAD2001 - Opções personalizadas definidas:", opcoesPersonalizadas);
        }

        // Condição 2: TEDP001 = "Regional" E OGM1003 = "Autarquia", "Empresa pública", "Sociedade de economia mista", "Empresa privada"
        const condicao2_naturezaJuridicaValidas = [
          "Autarquia",
          "Empresa pública",
          "Sociedade de economia mista",
          "Empresa privada"
        ];
        if (!opcoesPersonalizadas && psAbrangencia === "Regional" && condicao2_naturezaJuridicaValidas.includes(psNaturezaJuridica)) {
          opcoesPersonalizadas = [
            { value: "Sem delegação atendendo Sede e Localidades - SDSL", descricao: "Sem delegação atendendo Sede e Localidades - SDSL" },
            { value: "Sem delegação atendendo Sede - SDS", descricao: "Sem delegação atendendo Sede - SDS" },
            { value: "Sem delegação atendendo Localidades - SDL", descricao: "Sem delegação atendendo Localidades - SDL" },
            { value: "Com delegação sem atendimento - DSA", descricao: "Com delegação sem atendimento - DSA" },
            { value: "Com delegação atendendo Sede e Localidades - DSL", descricao: "Com delegação atendendo Sede e Localidades - DSL" },
            { value: "Com Delegação atendendo apenas Sede - DS", descricao: "Com Delegação atendendo apenas Sede - DS" },
            { value: "Com Delegação atendendo apenas localidades - DL", descricao: "Com Delegação atendendo apenas localidades - DL" }
          ];
        }

        // Condição 3: TEDP001 = "Local" OU "Regional" E OGM1003 = "Associação privada"
        if (!opcoesPersonalizadas && (psAbrangencia === "Local" || psAbrangencia === "Regional") && psNaturezaJuridica === "Associação privada") {
          opcoesPersonalizadas = [
            { value: "Sem Atendimento", descricao: "Sem Atendimento" },
            { value: "Sede e Localidades", descricao: "Sede e Localidades" },
            { value: "Somente Sede", descricao: "Somente Sede" },
            { value: "Somente Localidades", descricao: "Somente Localidades" }
          ];
        }

        // Se alguma condição foi atendida, renderizar select com opções personalizadas
        console.log("CAD2001 - opcoesPersonalizadas:", opcoesPersonalizadas);
        if (opcoesPersonalizadas) {
          console.log("CAD2001 - Renderizando select personalizado");
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
              {opcoesPersonalizadas.map((option, index) => (
                <option
                  key={index}
                  value={option.value}
                >
                  {option.descricao}
                </option>
              ))}
            </select>
          );
        } else {
          console.log("CAD2001 - Usando select padrão");
        }
      }

      // Select personalizado para CAD2002
      if (indicador.codigo_indicador === "CAD2002" && prestadoresServicos && prestadoresServicos.length > 0) {
        const prestador = prestadoresServicos[0];
        const psAbrangencia = prestador?.ps_abrangencia?.trim(); // TEDP001
        const psNaturezaJuridica = prestador?.ps_natureza_juridica?.trim(); // OGM1003

        let opcoesPersonalizadas = null;

        // Condição 1: TEDP001 = "Local" E OGM1003 = "Município"
        if (psAbrangencia === "Local" && psNaturezaJuridica === "Município") {
          opcoesPersonalizadas = [
            { value: "Prestação direta por órgão da administração pública direta.", descricao: "Prestação direta por órgão da administração pública direta." }
          ];
        }

        // Condição 2: TEDP001 = "Local" E OGM1003 = "Autarquia", "Empresa pública", "Sociedade de economia mista"
        if (!opcoesPersonalizadas && psAbrangencia === "Local") {
          const condicao2_naturezaJuridicaValidas = [
            "Autarquia",
            "Empresa pública",
            "Sociedade de economia mista"
          ];
          if (condicao2_naturezaJuridicaValidas.includes(psNaturezaJuridica)) {
            opcoesPersonalizadas = [
              { value: "Prestação direta por entidade da administração pública indireta.", descricao: "Prestação direta por entidade da administração pública indireta." }
            ];
          }
        }

        // Condição 3: TEDP001 = "Regional" E OGM1003 = "Autarquia", "Empresa pública", "Sociedade de economia mista"
        if (!opcoesPersonalizadas && psAbrangencia === "Regional") {
          const condicao3_naturezaJuridicaValidas = [
            "Autarquia",
            "Empresa pública",
            "Sociedade de economia mista"
          ];
          if (condicao3_naturezaJuridicaValidas.includes(psNaturezaJuridica)) {
            opcoesPersonalizadas = [
              { value: "Prestação indireta delegada mediante concessão para empresa privada ou estatal", descricao: "Prestação indireta delegada mediante concessão para empresa privada ou estatal" },
              { value: "Prestação indireta delegada mediante contrato de programa", descricao: "Prestação indireta delegada mediante contrato de programa" },
              { value: "Outra situação (especificar)", descricao: "Outra situação (especificar)" }
            ];
          }
        }

        // Condição 4: TEDP001 = "Local" OU "Regional" E OGM1003 = "Empresa privada"
        if (!opcoesPersonalizadas && (psAbrangencia === "Local" || psAbrangencia === "Regional") && psNaturezaJuridica === "Empresa privada") {
          opcoesPersonalizadas = [
            { value: "Prestação indireta delegada mediante concessão para empresa privada", descricao: "Prestação indireta delegada mediante concessão para empresa privada" },
            { value: "Prestação indireta delegada mediante concessão para empresa estatal", descricao: "Prestação indireta delegada mediante concessão para empresa estatal" },
            { value: "Outra situação (especificar)", descricao: "Outra situação (especificar)" }
          ];
        }

        // Condição 5: TEDP001 = "Local" OU "Regional" E OGM1003 = "Associação privada"
        if (!opcoesPersonalizadas && (psAbrangencia === "Local" || psAbrangencia === "Regional") && psNaturezaJuridica === "Associação privada") {
          opcoesPersonalizadas = [
            { value: "Prestação indireta delegada para associação civil", descricao: "Prestação indireta delegada para associação civil" },
            { value: "Prestação indireta delegada para associação comunitária", descricao: "Prestação indireta delegada para associação comunitária" },
            { value: "Outra situação (especificar)", descricao: "Outra situação (especificar)" }
          ];
        }

        // Se alguma condição foi atendida, renderizar select com opções personalizadas
        if (opcoesPersonalizadas) {
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
              {opcoesPersonalizadas.map((option, index) => (
                <option
                  key={index}
                  value={option.value}
                >
                  {option.descricao}
                </option>
              ))}
            </select>
          );
        }
      }

      // Select personalizado para CAD2004
      if (indicador.codigo_indicador === "CAD2004" && prestadoresServicos && prestadoresServicos.length > 0) {
        const prestador = prestadoresServicos[0];
        const psAbrangencia = prestador?.ps_abrangencia?.trim(); // TEDP001
        const psNaturezaJuridica = prestador?.ps_natureza_juridica?.trim(); // OGM1003

        let opcoesPersonalizadas = null;

        // Condição 1: TEDP001 = "Local" E OGM1003 = "Município", "Autarquia", "Empresa pública", "Sociedade de economia mista"
        if (psAbrangencia === "Local") {
          const condicao1_naturezaJuridicaValidas = [
            "Município",
            "Autarquia",
            "Empresa pública",
            "Sociedade de economia mista"
          ];
          if (condicao1_naturezaJuridicaValidas.includes(psNaturezaJuridica)) {
            opcoesPersonalizadas = [
              { value: "Inexistente", descricao: "Inexistente" }
            ];
          }
        }

        // Condição 2: TEDP001 = "Regional" E OGM1003 = "Autarquia", "Empresa pública", "Sociedade de economia mista"
        if (!opcoesPersonalizadas && psAbrangencia === "Regional") {
          const condicao2_naturezaJuridicaValidas = [
            "Autarquia",
            "Empresa pública",
            "Sociedade de economia mista"
          ];
          if (condicao2_naturezaJuridicaValidas.includes(psNaturezaJuridica)) {
            opcoesPersonalizadas = [
              { value: "Contrato de programa", descricao: "Contrato de programa" },
              { value: "Contrato de concessão", descricao: "Contrato de concessão" },
              { value: "Inexistente", descricao: "Inexistente" },
              { value: "Outro (especifique).", descricao: "Outro (especifique)." }
            ];
          }
        }

        // Condição 3: TEDP001 = "Local" OU "Regional" E OGM1003 = "Empresa privada"
        if (!opcoesPersonalizadas && (psAbrangencia === "Local" || psAbrangencia === "Regional") && psNaturezaJuridica === "Empresa privada") {
          opcoesPersonalizadas = [
            { value: "Contrato de concessão", descricao: "Contrato de concessão" },
            { value: "Inexistente", descricao: "Inexistente" },
            { value: "Outro (especifique).", descricao: "Outro (especifique)." }
          ];
        }

        // Condição 4: TEDP001 = "Local" OU "Regional" E OGM1003 = "Associação privada"
        if (!opcoesPersonalizadas && (psAbrangencia === "Local" || psAbrangencia === "Regional") && psNaturezaJuridica === "Associação privada") {
          opcoesPersonalizadas = [
            { value: "Convênio administrativo (para associações civis ou comunitárias)", descricao: "Convênio administrativo (para associações civis ou comunitárias)" },
            { value: "Inexistente", descricao: "Inexistente" },
            { value: "Outro (especifique).", descricao: "Outro (especifique)." }
          ];
        }

        // Se alguma condição foi atendida, renderizar select com opções personalizadas
        if (opcoesPersonalizadas) {
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
              {opcoesPersonalizadas.map((option, index) => (
                <option
                  key={index}
                  value={option.value}
                >
                  {option.descricao}
                </option>
              ))}
            </select>
          );
        }
      }

      // Select personalizado para GFI1010, GFI1013 e GFI1016
      const camposComOpcoesPadrao = ["GFI1010", "GFI1013", "GFI1016"];
      if (camposComOpcoesPadrao.includes(indicador.codigo_indicador) && campoHabilitado) {
        const opcoesPersonalizadas = [
          { value: "Até 5m³", descricao: "Até 5m³" },
          { value: "Até 10m³", descricao: "Até 10m³" },
          { value: "Até 15m³", descricao: "Até 15m³" },
          { value: "Outro (especifique)", descricao: "Outro (especifique)" }
        ];

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
            {opcoesPersonalizadas.map((option, index) => (
              <option
                key={index}
                value={option.value}
              >
                {option.descricao}
              </option>
            ))}
          </select>
        );
      }

      // Select padrão (comportamento normal)
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
              <option
                key={option.id_select_option || index}
                value={option.value}
              >
                {option.descricao || option.value}
              </option>
            ))}
        </select>
      );

    case "textarea":
      return (
        <textarea
          {...baseProps}
          rows={2}
          style={{
            ...baseProps.style,
            resize: "vertical",
            minHeight: "60px",
          }}
        />
      );

    case "date":
      return (
        <input {...baseProps} type="date" style={{ ...baseProps.style }} />
      );

    case "email":
      return (
        <input {...baseProps} type="email" style={{ ...baseProps.style }} />
      );

    case "checkbox":
      const checkBoxItems = tipoCampo.checkBoxItems || [];

      if (checkBoxItems.length === 0) {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "40px",
            }}
          >
            <input
              {...register(fieldName)}
              type="checkbox"
              style={{ transform: "scale(1.3)" }}
            />
          </div>
        );
      }

      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: isDisabled ? "#f8f9fa" : "white",
          }}
        >
          {checkBoxItems.map((item, index) => {
            const checkboxFieldName = `${fieldName}_${item.id_item_check_box}_${anoSelected}`;

            return (
              <label
                key={item.id_item_check_box}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "13px",
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  opacity: isDisabled ? 0.6 : 1,
                }}
              >
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

    case "text":
    default:
      // Campo especial GTA2204 com botão de mapa
      if (indicador.codigo_indicador === "GTA2204" && onOpenMapModal) {
        const fieldValue = watch ? watch(fieldName) : null;
        const hasValue = fieldValue && fieldValue !== "";
        
        console.log("=== DEBUG CampoIndicador GTA2204 (campo habilitado) ===");
        console.log("fieldName:", fieldName);
        console.log("fieldValue:", fieldValue);
        console.log("hasValue:", hasValue);
        console.log("baseProps existe?", !!baseProps);

        // Sempre renderizar o input (mesmo que escondido) para garantir que seja registrado
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "90%" }}>
            <input
              {...baseProps}
              type="text"
              readOnly
              style={{ 
                ...baseProps.style,
                flex: hasValue ? 1 : 0,
                cursor: "not-allowed",
                backgroundColor: "#f8f9fa",
                display: hasValue ? "block" : "none",
                width: hasValue ? "auto" : "0",
                minWidth: hasValue ? "auto" : "0",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#1e88e5";
                e.target.style.boxShadow = "0 0 0 2px rgba(30,136,229,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#ddd";
                e.target.style.boxShadow = "none";
              }}
            />
            <button
              type="button"
              onClick={() => onOpenMapModal(fieldName)}
              style={{
                padding: hasValue ? "8px 16px" : "10px 20px",
                backgroundColor: hasValue ? "#ff9800" : "#1e88e5",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: hasValue ? "13px" : "14px",
                fontWeight: "500",
                transition: "background-color 0.2s ease",
                width: hasValue ? "auto" : "90%",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = hasValue ? "#f57c00" : "#1565c0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = hasValue ? "#ff9800" : "#1e88e5";
              }}
              title={hasValue ? "Alterar localização" : "Selecionar Localização no Mapa"}
            >
              <FaMapMarkerAlt />
              {hasValue ? "Alterar" : "Selecionar Localização no Mapa"}
            </button>
          </div>
        );
      }

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

export default function PrestacaoServicoAgua() {
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
    watch,
    formState: { errors },
  } = useForm();

  const [content, setContent] = useState(null);
  const [activeForm, setActiveForm] = useState("");
  const [indicadores, setIndicadores] = useState<IIndicador[]>([]);
  const [grupo, setGrupo] = useState(null);
  const [loadingIndicadores, setLoadingIndicadores] = useState(false);
  const [fieldStates, setFieldStates] = useState<{ [key: string]: any }>({
    hasColeta: false,
    cad1002Value: null,
    cad2001Value: null,
  });
  const [prestadoresServicos, setPrestadoresServicos] = useState([]);
  const [dadosCarregados, setDadosCarregados] = useState([]);
  const [loadingDados, setLoadingDados] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [showUnidades, setShowUnidades] = useState(false);
  const [unidades, setUnidades] = useState<IUnidade[]>([]);
  const [loadingUnidades, setLoadingUnidades] = useState(false);
  const [isModalUnidadeVisible, setModalUnidadeVisible] = useState(false);
  const [isModalMapVisible, setIsModalMapVisible] = useState(false);
  const [mapFieldName, setMapFieldName] = useState<string | null>(null);
  const [isEditingUnidade, setIsEditingUnidade] = useState(false);
  const [unidadeEditando, setUnidadeEditando] = useState<IUnidade | null>(null);
  const [searchTermUnidades, setSearchTermUnidades] = useState("");
  const [eixos, setEixos] = useState<IEixo[]>([]);
  const [municipios, setMunicipios] = useState<IMunicipio[]>([]);
  const [tiposUnidade, setTiposUnidade] = useState<
    Array<{ id_tipo_unidade: number; nome_tipo_unidade: string }>
  >([]);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<IUnidade | null>(
    null
  );
  const [indicadoresUnidade, setIndicadoresUnidade] = useState<IIndicador[]>(
    []
  );
  const [loadingIndicadoresUnidade, setLoadingIndicadoresUnidade] =
    useState(false);

  const {
    register: registerUnidade,
    handleSubmit: handleSubmitUnidade,
    reset: resetUnidade,
    setValue: setValueUnidade,
    watch: watchUnidade,
    formState: { errors: errorsUnidade },
  } = useForm();

  const eixoValue = watchUnidade("id_eixo");
  const municipioValue = watchUnidade("id_municipio");
  const tipoUnidadeValue = watchUnidade("id_tipo_unidade"); 

  // Função para abrir o modal do mapa
  const handleOpenMapModal = (fieldName: string) => {
    console.log("=== DEBUG handleOpenMapModal ===");
    console.log("fieldName recebido:", fieldName);
    setMapFieldName(fieldName);
    setIsModalMapVisible(true);
    console.log("Modal aberto, mapFieldName state será:", fieldName);
  };

  // Função para fechar o modal do mapa
  const handleCloseMapModal = () => {
    setIsModalMapVisible(false);
    setMapFieldName(null);
  };

  // Função para quando o usuário seleciona uma localização no mapa
  const handleLocationSelect = (lat: number, lng: number) => {
    console.log("=== DEBUG handleLocationSelect ===");
    console.log("lat:", lat, "lng:", lng);
    console.log("mapFieldName:", mapFieldName);
    console.log("anoSelected:", anoSelected);
    console.log("setValue existe?", !!setValue);
    
    if (mapFieldName && setValue && anoSelected) {
      try {
        const latValue = lat.toFixed(7);
        const lngValue = lng.toFixed(7);
        
        console.log("Valores formatados - latValue:", latValue, "lngValue:", lngValue);
        
        // Preencher GTA2204 (latitude)
        console.log("Preenchendo campo:", mapFieldName, "com valor:", latValue);
        setValue(mapFieldName, latValue, { shouldValidate: true, shouldDirty: true });
        
        // Preencher GTA2205 (longitude) - substituir GTA2204 por GTA2205 no nome do campo
        const longitudeFieldName = mapFieldName.replace("GTA2204", "GTA2205");
        console.log("Preenchendo campo:", longitudeFieldName, "com valor:", lngValue);
        setValue(longitudeFieldName, lngValue, { shouldValidate: true, shouldDirty: true });
        
        // Verificar valores após setValue
        setTimeout(() => {
          const latAfterSet = watch ? watch(mapFieldName) : null;
          const lngAfterSet = watch ? watch(longitudeFieldName) : null;
          console.log("Valores após setValue:");
          console.log("  Latitude campo:", mapFieldName, "valor:", latAfterSet);
          console.log("  Longitude campo:", longitudeFieldName, "valor:", lngAfterSet);
        }, 100);
        
        // Fechar o modal
        handleCloseMapModal();
        
        toast.success("Localização selecionada com sucesso!", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        console.error("Erro ao preencher campos:", error);
        toast.error("Erro ao preencher campos. Tente novamente.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } else {
      console.log("Condições não atendidas:");
      console.log("  mapFieldName existe?", !!mapFieldName);
      console.log("  setValue existe?", !!setValue);
      console.log("  anoSelected existe?", !!anoSelected);
    }
  };

  useEffect(() => {
    loadEixos();
    loadMunicipios();
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

  // Definir valores padrão quando o modal abrir ou quando o usuário estiver disponível
  useEffect(() => {
    if (isModalUnidadeVisible && !isEditingUnidade) {
      // Garantir que os municípios estejam carregados
      if (municipios.length === 0) {
        loadMunicipios();
      }

      // Carregar tipos de unidade do eixo 1
      loadTiposUnidade(1);

      // Se o usuário já estiver disponível, definir os valores imediatamente
      if (usuario?.id_municipio) {
        const municipioUsuario = usuario.id_municipio.toString();
        setValueUnidade("id_eixo", "1");
        setValueUnidade("id_municipio", municipioUsuario);
      } else {
        // Caso contrário, aguardar um pouco para o usuário estar disponível
        const timer = setTimeout(() => {
          if (usuario?.id_municipio) {
            const municipioUsuario = usuario.id_municipio.toString();
            setValueUnidade("id_eixo", "1");
            setValueUnidade("id_municipio", municipioUsuario);
          }
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [
    isModalUnidadeVisible,
    isEditingUnidade,
    usuario?.id_municipio,
    municipios.length,
    setValueUnidade,
  ]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    getMenus();
    if (anoEditorSimisab) {
      setAnoSelected(anoEditorSimisab);
    }
  }, [anoEditorSimisab]);

  useEffect(() => {
    if (usuario?.id_municipio) {
      getMunicipio();
    }
  }, [usuario?.id_municipio]);

  async function getMunicipio() {
    if (!usuario?.id_municipio) {
      return;
    }

    try {
      const res = await api
        .get("/getMunicipio", {
          params: { id_municipio: usuario.id_municipio },
        })
        .then((response) => {
          setDadosMunicipio(response.data);
        });
    } catch (error) {
      console.error("Erro ao carregar município:", error);
    }
  }

  
  async function getPrestadoresServicos() {
    const res = await api.get("/prestadores-servicos", {
      params: { id_municipio: usuario.id_municipio, eixo: "agua" },
    }).then((response) => {
      setPrestadoresServicos(response.data);
    });
  }

  async function getMenus() {
    const res = await api.get("menus/eixo/" + 1).then((response) => {
      setMenus(response.data);
    });
  }

  useEffect(() => {
    getPrestadoresServicos();
  }, []);

  async function loadUnidades() {
    setLoadingUnidades(true);
    try {
      const apiClient = getAPIClient();
      const response = await apiClient.get("/unidades/eixo/1");
      const unidadesData = response.data || [];
      setUnidades(unidadesData);
    } catch (error) {
      console.error("Erro ao carregar unidades:", error);
      toast.error("Erro ao carregar unidades!", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoadingUnidades(false);
    }
  }

  async function loadEixos() {
    try {
      const response = await api.get("/getEixos");
      setEixos(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar eixos:", error);
    }
  }

  async function loadMunicipios() {
    try {
      const response = await api.get("/getMunicipios");
      setMunicipios(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar municípios:", error);
    }
  }

  async function loadTiposUnidade(idEixo: number = 1) {
    try {
      const apiClient = getAPIClient();
      const response = await apiClient.get(`/tipo-unidade/eixo/${idEixo}`);
      setTiposUnidade(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar tipos de unidade:", error);
    }
  }

  async function loadIndicadoresUnidade(idEixo: number, idTipoUnidade?: number) {
    setLoadingIndicadoresUnidade(true);
    try {
      const apiClient = getAPIClient();
      const params: any = {};
      if (idTipoUnidade) {
        params.id_tipo_unidade = idTipoUnidade;
      }
      const response = await apiClient.get(
        `/indicadores-novo/eixo-unidade/${idEixo}`,
        { params }
      );
      const indicadoresData = response.data || [];

      if (indicadoresData.length === 0) {
        setIndicadoresUnidade([]);
        setLoadingIndicadoresUnidade(false);
        return;
      }

      // Carregar tipos de campo para cada indicador
      const indicadoresComTipos = [];

      for (let i = 0; i < indicadoresData.length; i++) {
        const indicador = indicadoresData[i];

        try {
          const tiposResponse = await api.get(
            `tipos-campo/indicador/${indicador.id_indicador}`
          );
          const tiposCampo = tiposResponse.data || [];

          // Processar opções para campos select e checkbox
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

      setIndicadoresUnidade(indicadoresComTipos);
    } catch (error: any) {
      console.error("Erro ao carregar indicadores da unidade:", error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "Erro ao carregar indicadores!";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
      setIndicadoresUnidade([]);
    } finally {
      setLoadingIndicadoresUnidade(false);
    }
  }

  async function handleSelectUnidade(unidade: IUnidade) {
    setUnidadeSelecionada(unidade);
    if (unidade.id_eixo) {
      await loadIndicadoresUnidade(unidade.id_eixo, unidade.id_tipo_unidade);
      // Carregar dados existentes após carregar os indicadores
      if (usuario?.id_municipio) {
        await carregarDadosExistentesUnidade(unidade.id_unidade);
      }
    }
  }

  async function carregarDadosExistentesUnidade(idUnidade: number) {
    if (!usuario?.id_municipio || !idUnidade) return;

    setLoadingDados(true);

    try {
      const apiClient = getAPIClient();

      // Carregar dados dos indicadores da unidade
      const response = await apiClient.get(
        `/indicadores-municipio/municipio/${usuario.id_municipio}?ano=2025&id_unidade=${idUnidade}`
      );
      const dados = response.data || [];
      setDadosCarregados(dados);

      // Preencher o formulário com os dados carregados
      preencherFormularioUnidade(dados);

      if (dados.length > 0) {
        toast.info(`Carregados ${dados.length} registro(s) para esta unidade`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Erro ao carregar dados existentes da unidade:", error);
      // Não mostrar erro se não houver dados (é normal)
    } finally {
      setLoadingDados(false);
    }
  }

  function preencherFormularioUnidade(dados: any[]) {
    const valoresFormulario = {};
    const dadosAgrupados = new Map();

    dados.forEach((dado) => {
      const codigoIndicador = dado.codigo_indicador;
      const ano = dado.ano;
      const valor = dado.valor_indicador;

      if (!dadosAgrupados.has(codigoIndicador)) {
        dadosAgrupados.set(codigoIndicador, []);
      }
      dadosAgrupados.get(codigoIndicador).push({ ano, valor });
    });

    dadosAgrupados.forEach((valores, codigoIndicador) => {
      const indicador = indicadoresUnidade.find(
        (ind) => ind.codigo_indicador === codigoIndicador
      );

      if (indicador) {
        const tipoCheckbox = indicador.tiposCampo?.find(
          (tipo) => tipo.type === "checkbox"
        );

        if (tipoCheckbox && tipoCheckbox.checkBoxItems) {
          valores.forEach(({ ano, valor }) => {
            try {
              if (
                typeof valor === "string" &&
                (valor.startsWith("[") || valor.startsWith("{"))
              ) {
                try {
                  const jsonParsed = JSON.parse(valor);
                  if (Array.isArray(jsonParsed)) {
                    jsonParsed.forEach((descricao) => {
                      const checkBoxItem = tipoCheckbox.checkBoxItems.find(
                        (item) => item.descricao === descricao
                      );

                      if (checkBoxItem) {
                        const fieldName = `${codigoIndicador}_${checkBoxItem.valor}_${ano}`;
                        valoresFormulario[fieldName] = true;
                      }
                    });
                  }
                } catch (jsonError) {
                  const checkBoxItem = tipoCheckbox.checkBoxItems.find(
                    (item) => item.descricao === valor
                  );

                  if (checkBoxItem) {
                    const fieldName = `${codigoIndicador}_${checkBoxItem.valor}_${ano}`;
                    valoresFormulario[fieldName] = true;
                  }
                }
              } else {
                const checkBoxItem = tipoCheckbox.checkBoxItems.find(
                  (item) => item.descricao === valor || item.valor === valor
                );

                if (checkBoxItem) {
                  const fieldName = `${codigoIndicador}_${checkBoxItem.valor}_${ano}`;
                  valoresFormulario[fieldName] = true;
                }
              }
            } catch (error) {
              console.error(
                "Erro ao processar valor do checkbox:",
                valor,
                error
              );
            }
          });
        } else {
          const { ano, valor } = valores[0];
          const fieldName = `${codigoIndicador}_${ano}`;
          valoresFormulario[fieldName] = valor;
        }
      } else {
        const { ano, valor } = valores[0];
        const fieldName = `${codigoIndicador}_${ano}`;
        valoresFormulario[fieldName] = valor;
      }
    });

    // Preencher o formulário
    reset(valoresFormulario);
  }

  function handleDeselectUnidade() {
    setUnidadeSelecionada(null);
    setIndicadoresUnidade([]);
  }

  async function handleCadastroIndicadoresUnidade(data) {
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

      // Verificar se há uma unidade selecionada
      if (!unidadeSelecionada || !unidadeSelecionada.id_unidade) {
        toast.error("Erro: Nenhuma unidade selecionada!", {
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

      Object.keys(data).forEach((key) => {
        const valor = data[key];

        // Verificar se é um campo checkbox
        const isCheckboxField = key.includes("_") && key.split("_").length > 2;

        if (isCheckboxField) {
          const parts = key.split("_");
          const codigoIndicador = parts[0];
          const idItemCheckBox = parts[2];

          if (
            valor === true ||
            valor === "true" ||
            (typeof valor === "string" && valor.length > 0 && valor !== "false")
          ) {
            // Encontrar a descrição do checkbox selecionado
            const indicador = indicadoresUnidade.find(
              (ind) => ind.codigo_indicador === codigoIndicador
            );

            if (indicador) {
              const tipoCheckbox = indicador.tiposCampo?.find(
                (tipo) => tipo.type === "checkbox"
              );

              if (tipoCheckbox && tipoCheckbox.checkBoxItems) {
                let checkBoxItem = tipoCheckbox.checkBoxItems.find(
                  (item) => item.id_item_check_box === idItemCheckBox
                );

                if (!checkBoxItem) {
                  const checkBoxItemAlt = tipoCheckbox.checkBoxItems.find(
                    (item) =>
                      item.id_item_check_box.toString() ===
                        idItemCheckBox.toString() ||
                      item.descricao
                        .toLowerCase()
                        .includes(idItemCheckBox.toLowerCase())
                  );

                  if (checkBoxItemAlt) {
                    checkBoxItem = checkBoxItemAlt;
                  }
                }

                if (checkBoxItem) {
                  if (!checkBoxAgrupados.has(codigoIndicador)) {
                    checkBoxAgrupados.set(codigoIndicador, []);
                  }
                  checkBoxAgrupados
                    .get(codigoIndicador)
                    .push(checkBoxItem.descricao);

                  const checkBoxData = {
                    id_item_check_box: checkBoxItem.id_item_check_box,
                    descricao: checkBoxItem.descricao,
                    valor: true,
                    id_indicador: indicador.id_indicador,
                  };

                  checkBoxSelecionados.push(checkBoxData);
                }
              }
            }
          }
        } else {
          // Campo normal (não checkbox) - formato: "CODIGO_ANO"
          if (valor !== null && valor !== undefined && valor !== "") {
            const parts = key.split("_");
            const codigoIndicador = parts[0];

            valoresIndicadores.push({
              codigo_indicador: codigoIndicador,
              ano: 2025, // Ano fixo para indicadores de unidade
              valor_indicador: valor,
              id_municipio: usuario.id_municipio,
              id_unidade: unidadeSelecionada.id_unidade, // Incluir id_unidade
            });
          }
        }
      });

      // Processar checkboxes agrupados
      checkBoxAgrupados.forEach((descricoes, codigoIndicador) => {
        const indicador = indicadoresUnidade.find(
          (ind) => ind.codigo_indicador === codigoIndicador
        );
        if (indicador) {
          valoresIndicadores.push({
            codigo_indicador: codigoIndicador,
            ano: 2025,
            valor_indicador: JSON.stringify(descricoes),
            id_municipio: usuario.id_municipio,
            id_unidade: unidadeSelecionada.id_unidade, // Incluir id_unidade
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
        // Buscar dados existentes para o município, ano e unidade
        const existingDataResponse = await apiClient.get(
          `/indicadores-municipio/municipio/${usuario.id_municipio}?ano=2025&id_unidade=${unidadeSelecionada.id_unidade}`
        );

        const existingData = existingDataResponse.data || [];

        if (existingData.length > 0) {
          // Criar um mapa dos dados existentes
          const existingDataMap = new Map();
          existingData.forEach((record) => {
            const key = `${record.codigo_indicador}_${record.ano}_${
              record.id_unidade || "null"
            }`;
            existingDataMap.set(key, record);
          });

          // Processar cada valor para salvar/atualizar
          for (const valorIndicador of valoresIndicadores) {
            const key = `${valorIndicador.codigo_indicador}_${valorIndicador.ano}_${valorIndicador.id_unidade}`;
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
              console.error(
                "Erro ao salvar/atualizar valor:",
                valorIndicador,
                saveError
              );
              throw saveError;
            }
          }

          // Salvar dados na tabela item_check_box
          try {
            const todosCheckBoxes = [];
            indicadoresUnidade.forEach((indicador) => {
              const tipoCheckbox = indicador.tiposCampo?.find(
                (tipo) => tipo.type === "checkbox"
              );
              if (tipoCheckbox && tipoCheckbox.checkBoxItems) {
                tipoCheckbox.checkBoxItems.forEach((item) => {
                  todosCheckBoxes.push({
                    id_item_check_box: item.id_item_check_box,
                    descricao: item.descricao,
                    id_indicador: indicador.id_indicador,
                  });
                });
              }
            });

            await salvarItemCheckBox(checkBoxSelecionados, todosCheckBoxes);
          } catch (error) {
            console.error("Erro ao salvar na tabela item_check_box:", error);
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
            const todosCheckBoxes = [];
            indicadoresUnidade.forEach((indicador) => {
              const tipoCheckbox = indicador.tiposCampo?.find(
                (tipo) => tipo.type === "checkbox"
              );
              if (tipoCheckbox && tipoCheckbox.checkBoxItems) {
                tipoCheckbox.checkBoxItems.forEach((item) => {
                  todosCheckBoxes.push({
                    id_item_check_box: item.id_item_check_box,
                    descricao: item.descricao,
                    id_indicador: indicador.id_indicador,
                  });
                });
              }
            });

            await salvarItemCheckBox(checkBoxSelecionados, todosCheckBoxes);
          } catch (error) {
            console.error("Erro ao salvar na tabela item_check_box:", error);
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
          const todosCheckBoxes = [];
          indicadoresUnidade.forEach((indicador) => {
            const tipoCheckbox = indicador.tiposCampo?.find(
              (tipo) => tipo.type === "checkbox"
            );
            if (tipoCheckbox && tipoCheckbox.checkBoxItems) {
              tipoCheckbox.checkBoxItems.forEach((item) => {
                todosCheckBoxes.push({
                  id_item_check_box: item.id_item_check_box,
                  descricao: item.descricao,
                  id_indicador: indicador.id_indicador,
                });
              });
            }
          });

          await salvarItemCheckBox(checkBoxSelecionados, todosCheckBoxes);
        } catch (error) {
          console.error("Erro ao salvar na tabela item_check_box:", error);
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

  function handleOpenModalUnidade() {
    setIsEditingUnidade(false);
    setUnidadeEditando(null);

    // Garantir que os municípios estejam carregados
    if (municipios.length === 0) {
      loadMunicipios();
    }

    // Carregar tipos de unidade do eixo 1
    loadTiposUnidade(1);

    const municipioUsuario = usuario?.id_municipio?.toString() || "";
    resetUnidade({
      nome_unidade: "",
      id_tipo_unidade: "",
      id_eixo: "1",
      id_municipio: municipioUsuario,
    });
    setModalUnidadeVisible(true);
  }

  function handleCloseModalUnidade() {
    setModalUnidadeVisible(false);
    setIsEditingUnidade(false);
    setUnidadeEditando(null);
    resetUnidade();
  }

  function handleEditUnidade(unidade: IUnidade) {
    setIsEditingUnidade(true);
    setUnidadeEditando(unidade);

    // Carregar tipos de unidade do eixo da unidade
    const eixoId = unidade.id_eixo || 1;
    loadTiposUnidade(eixoId);

    setValueUnidade("nome_unidade", unidade.nome_unidade || "");
    setValueUnidade(
      "id_tipo_unidade",
      unidade.id_tipo_unidade?.toString() || ""
    );
    setValueUnidade("id_eixo", unidade.id_eixo?.toString() || "1");
    setValueUnidade("id_municipio", unidade.id_municipio?.toString() || "");
    setModalUnidadeVisible(true);
  }

  async function handleSaveUnidade(data: any) {
    try {
      const apiClient = getAPIClient();

      // Função auxiliar para converter string para número ou null
      const parseToIntOrNull = (value: any): number | null => {
        if (
          !value ||
          value === "" ||
          value === "undefined" ||
          value === undefined
        ) {
          return null;
        }
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? null : parsed;
      };

      const unidadeData = {
        nome_unidade: data.nome_unidade,
        id_tipo_unidade: parseToIntOrNull(data.id_tipo_unidade),
        id_eixo: parseToIntOrNull(data.id_eixo) || 1, // Se for null, usar 1 como padrão
        id_municipio: parseToIntOrNull(data.id_municipio),
      };

      if (isEditingUnidade && unidadeEditando) {
        await apiClient.put(
          `/unidades/${unidadeEditando.id_unidade}`,
          unidadeData
        );
        toast.success("Unidade atualizada com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        await apiClient.post("/unidades", unidadeData);
        toast.success("Unidade cadastrada com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
      }

      handleCloseModalUnidade();
      loadUnidades();
    } catch (error) {
      console.error("Erro ao salvar unidade:", error);
      toast.error("Erro ao salvar unidade!", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }

  async function handleDeleteUnidade(id: number) {
    if (!confirm("Tem certeza que deseja excluir esta unidade?")) {
      return;
    }

    try {
      const apiClient = getAPIClient();
      await apiClient.delete(`/unidades/${id}`);
      toast.success("Unidade excluída com sucesso!", {
        position: "top-right",
        autoClose: 5000,
      });
      loadUnidades();
    } catch (error) {
      console.error("Erro ao excluir unidade:", error);
      toast.error("Erro ao excluir unidade!", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }

  useEffect(() => {
    if (showUnidades) {
      loadEixos();
      loadMunicipios();
    }
  }, [showUnidades]);

  async function getIndicadores(menu_item: {
    id_menu_item: number;
    nome_menu_item: string;
  }) {
    setGrupo(menu_item.nome_menu_item);
    setLoadingIndicadores(true);

    try {
      // Buscar indicadores do menu item
      const resIndicadores = await api.get(
        `indicadores-novo/menu-item/${menu_item?.id_menu_item}`
      );
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
          const tiposResponse = await api.get(
            `tipos-campo/indicador/${indicador.id_indicador}`
          );
          const tiposCampo = tiposResponse.data || [];

          // Processar opções para campos select
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
          // Em caso de erro, pelo menos adicionar o indicador sem tipos
          indicadoresComTipos.push({
            ...indicador,
            tiposCampo: [],
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
        const resIndicadores = await api.get(
          `indicadores-novo/menu-item/${menu_item?.id_menu_item}`
        );
        const indicadoresBasicos = resIndicadores.data || [];
        setIndicadores(
          indicadoresBasicos.map((ind) => ({
            ...ind,
            tiposCampo: [],
            _hasError: true,
          }))
        );

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
        checkBoxSelecionados.forEach((checkBox) => {
          checkBoxSelecionadosMap.set(checkBox.id_item_check_box, checkBox);
        });
      }

      // Para cada checkbox disponível, atualizar o registro na tabela item_check_box
      for (const checkBox of todosCheckBoxes) {
        try {
          // Validar se o checkbox tem os campos necessários
          if (
            !checkBox.id_item_check_box ||
            !checkBox.descricao ||
            !checkBox.id_indicador
          ) {
            continue;
          }

          // Verificar se o checkbox está selecionado
          const isSelected = checkBoxSelecionadosMap.has(
            checkBox.id_item_check_box
          );

          // Atualizar o campo valor para boolean (true se selecionado, false se não selecionado)
          await apiClient.put(`/item-check-box/${checkBox.id_item_check_box}`, {
            valor: isSelected, // boolean true se selecionado, false se não selecionado
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

      Object.keys(data).forEach((key) => {
        const valor = data[key];

        // Verificar se é um campo checkbox
        const isCheckboxField = key.includes("_") && key.split("_").length > 2;

        if (isCheckboxField) {
          const parts = key.split("_");
          const codigoIndicador = parts[0];
          const idItemCheckBox = parts[2]; // O id_item_check_box está na posição 2 (GFI1008_2025_8_2025)

          if (
            valor === true ||
            valor === "true" ||
            (typeof valor === "string" && valor.length > 0 && valor !== "false")
          ) {
            // Encontrar a descrição do checkbox selecionado
            const indicador = indicadores.find(
              (ind) => ind.codigo_indicador === codigoIndicador
            );

            if (indicador) {
              const tipoCheckbox = indicador.tiposCampo?.find(
                (tipo) => tipo.type === "checkbox"
              );

              if (tipoCheckbox && tipoCheckbox.checkBoxItems) {
                // Tentar encontrar por id_item_check_box
                let checkBoxItem = tipoCheckbox.checkBoxItems.find(
                  (item) => item.id_item_check_box === idItemCheckBox
                );

                if (!checkBoxItem) {
                  // Se não encontrou, tentar encontrar por qualquer correspondência
                  const checkBoxItemAlt = tipoCheckbox.checkBoxItems.find(
                    (item) =>
                      item.id_item_check_box.toString() ===
                        idItemCheckBox.toString() ||
                      item.descricao
                        .toLowerCase()
                        .includes(idItemCheckBox.toLowerCase()) ||
                      (typeof valor === "string" &&
                        valor
                          .toLowerCase()
                          .includes(item.descricao.toLowerCase()))
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
                  checkBoxAgrupados
                    .get(codigoIndicador)
                    .push(checkBoxItem.descricao);

                  // Salvar para tabela item_check_box
                  const checkBoxData = {
                    id_item_check_box: checkBoxItem.id_item_check_box,
                    descricao: checkBoxItem.descricao,
                    valor: true, // boolean true para item selecionado
                    id_indicador: indicador.id_indicador,
                  };

                  checkBoxSelecionados.push(checkBoxData);
                }
              }
            }
          }
        } else {
          // Campo normal (não checkbox) - formato: "CODIGO_ANO"
          if (valor !== null && valor !== undefined && valor !== "") {
            const parts = key.split("_");
            const codigoIndicador = parts[0]; // Extrair apenas o código, sem o ano

            valoresIndicadores.push({
              codigo_indicador: codigoIndicador,
              ano: parseInt(anoSelected),
              valor_indicador: valor,
              id_municipio: usuario.id_municipio,
            });
          }
        }
      });

      // Processar checkboxes agrupados para salvar na tabela indicadores-municipio
      checkBoxAgrupados.forEach((descricoes, codigoIndicador) => {
        const indicador = indicadores.find(
          (ind) => ind.codigo_indicador === codigoIndicador
        );
        if (indicador) {
          // Salvar array JSON com descrições na tabela indicadores-municipio
          valoresIndicadores.push({
            codigo_indicador: codigoIndicador,
            ano: parseInt(anoSelected),
            valor_indicador: JSON.stringify(descricoes), // Array JSON
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
          existingData.forEach((record) => {
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
                await apiClient.put(
                  `/indicadores-municipio/${existingRecord.id_incicador_municipio}`,
                  valorIndicador
                );
              } else {
                // Criar novo registro
                await apiClient.post("/indicadores-municipio", valorIndicador);
              }
            } catch (saveError) {
              console.error(
                "Erro ao salvar/atualizar valor:",
                valorIndicador,
                saveError
              );
              throw saveError;
            }
          }

          // Salvar dados na tabela item_check_box
          try {
            // Coletar todos os checkboxes disponíveis para o indicador
            const todosCheckBoxes = [];
            indicadores.forEach((indicador) => {
              const tipoCheckbox = indicador.tiposCampo?.find(
                (tipo) => tipo.type === "checkbox"
              );
              if (tipoCheckbox && tipoCheckbox.checkBoxItems) {
                tipoCheckbox.checkBoxItems.forEach((item) => {
                  todosCheckBoxes.push({
                    id_item_check_box: item.id_item_check_box,
                    descricao: item.descricao,
                    id_indicador: indicador.id_indicador,
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
            indicadores.forEach((indicador) => {
              const tipoCheckbox = indicador.tiposCampo?.find(
                (tipo) => tipo.type === "checkbox"
              );
              if (tipoCheckbox && tipoCheckbox.checkBoxItems) {
                tipoCheckbox.checkBoxItems.forEach((item) => {
                  todosCheckBoxes.push({
                    id_item_check_box: item.id_item_check_box,
                    descricao: item.descricao,
                    id_indicador: indicador.id_indicador,
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
          indicadores.forEach((indicador) => {
            const tipoCheckbox = indicador.tiposCampo?.find(
              (tipo) => tipo.type === "checkbox"
            );
            if (tipoCheckbox && tipoCheckbox.checkBoxItems) {
              tipoCheckbox.checkBoxItems.forEach((item) => {
                todosCheckBoxes.push({
                  id_item_check_box: item.id_item_check_box,
                  descricao: item.descricao,
                  id_indicador: indicador.id_indicador,
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

    dados.forEach((dado) => {
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
      const indicador = indicadores.find(
        (ind) => ind.codigo_indicador === codigoIndicador
      );

      if (indicador) {
        const tipoCheckbox = indicador.tiposCampo?.find(
          (tipo) => tipo.type === "checkbox"
        );

        if (tipoCheckbox && tipoCheckbox.checkBoxItems) {
          // É um checkbox, verificar quais itens estão salvos
          valores.forEach(({ ano, valor }) => {
            try {
              // Se o valor é uma string que parece JSON, tentar fazer parse
              if (
                typeof valor === "string" &&
                (valor.startsWith("[") || valor.startsWith("{"))
              ) {
                try {
                  const jsonParsed = JSON.parse(valor);
                  if (Array.isArray(jsonParsed)) {
                    // Para cada descrição no array JSON, encontrar o checkbox correspondente
                    jsonParsed.forEach((descricao) => {
                      const checkBoxItem = tipoCheckbox.checkBoxItems.find(
                        (item) => item.descricao === descricao
                      );

                      if (checkBoxItem) {
                        const fieldName = `${codigoIndicador}_${checkBoxItem.valor}_${ano}`;
                        valoresFormulario[fieldName] = true;
                      }
                    });
                  }
                } catch (jsonError) {
                  // Fallback: tratar como valor único
                  const checkBoxItem = tipoCheckbox.checkBoxItems.find(
                    (item) => item.descricao === valor
                  );

                  if (checkBoxItem) {
                    const fieldName = `${codigoIndicador}_${checkBoxItem.valor}_${ano}`;
                    valoresFormulario[fieldName] = true;
                  }
                }
              } else {
                // Valor único (não JSON)
                const checkBoxItem = tipoCheckbox.checkBoxItems.find(
                  (item) => item.descricao === valor || item.valor === valor
                );

                if (checkBoxItem) {
                  const fieldName = `${codigoIndicador}_${checkBoxItem.valor}_${ano}`;
                  valoresFormulario[fieldName] = true;
                }
              }
            } catch (error) {
              console.error(
                "Erro ao processar valor do checkbox:",
                valor,
                error
              );
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
          <Sidebar $isCollapsed={isCollapsed}>
            <CollapseButton onClick={toggleSidebar}>
              <FaBars />
            </CollapseButton>
            {menus?.map((menu) => {
              if (menu.titulo === "Unidades") {
                return;
              }
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
                          setShowUnidades(false);
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
            <MenuHeader
              $isOpen={false}
              onClick={() => {
                setActiveForm("Unidades");
                setGrupo(null);
                setShowUnidades(true);
                loadUnidades();
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
                Unidades
              </div>
            </MenuHeader>
          </Sidebar>
        )}

        <DivCenter>
          {/* Formulário de Indicadores - só aparece quando não está mostrando unidades */}
          {!showUnidades && (
            <Form onSubmit={handleSubmit(handleCadastroIndicadores)}>
              <BreadCrumbStyle $isCollapsed={isCollapsed}>
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
                      <span>Água</span>
                    </li>
                  </ol>
                </nav>
              </BreadCrumbStyle>
              <DivForm style={{ borderColor: "#12B2D5" }}>
                <DivTituloForm>Água</DivTituloForm>

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
                      {indicadores.some((ind) => ind._hasError) && (
                        <span style={{ color: "#dc3545", marginLeft: "10px" }}>
                          | ⚠️ Alguns campos com erro
                        </span>
                      )}
                      {dadosCarregados.length > 0 && (
                        <span style={{ color: "#28a745", marginLeft: "10px" }}>
                          | ✅ {dadosCarregados.length} dado
                          {dadosCarregados.length !== 1 ? "s" : ""} carregado
                          {dadosCarregados.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    {grupo &&
                      !loadingIndicadores &&
                      indicadores.some((ind) => ind._hasError) && (
                        <button
                          type="button"
                          onClick={() => {
                            const currentMenu = menus.find((menu) =>
                              menu.menu_item?.some(
                                (item) => item.nome_menu_item === grupo
                              )
                            );
                            const menuItem = currentMenu?.menu_item?.find(
                              (item) => item.nome_menu_item === grupo
                            );
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
                            marginLeft: "10px",
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
                        <p style={{ fontSize: "12px", color: "#666" }}>
                          Grupo: {grupo} | Loading:{" "}
                          {loadingIndicadores ? "true" : "false"}
                        </p>
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
                                          dadosMunicipio={dadosMunicipio}
                                          watch={watch}
                                          prestadoresServicos={prestadoresServicos}
                                          onOpenMapModal={handleOpenMapModal}
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

                                  {anoSelected ? (
                                    <CampoIndicador
                                      indicador={indicador}
                                      register={register}
                                      anoSelected={anoSelected}
                                      campoEnabled={campoEnabled}
                                      fieldStates={fieldStates}
                                      setFieldStates={setFieldStates}
                                      setValue={setValue}
                                      dadosMunicipio={dadosMunicipio}
                                      watch={watch}
                                      prestadoresServicos={prestadoresServicos}
                                      onOpenMapModal={handleOpenMapModal}
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
                  {isEditor && indicadores.length > 0 && anoSelected && (
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
                          e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#28a745";
                          e.currentTarget.style.boxShadow =
                            "0 2px 4px rgba(40,167,69,0.2)";
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
          )}

          {/* Componente de Unidades */}
          {showUnidades && (
            <Form onSubmit={handleSubmit(handleCadastroIndicadoresUnidade)}>
              <BreadCrumbStyle $isCollapsed={isCollapsed}>
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
                      <span>Unidades</span>
                    </li>
                  </ol>
                </nav>
              </BreadCrumbStyle>
              <DivForm style={{ borderColor: "#12B2D5" }}>
                <DivTituloForm>Gestão de Unidades</DivTituloForm>

                <div
                  style={{ padding: "20px", borderBottom: "1px solid #eee" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "20px",
                      flexWrap: "wrap",
                    }}
                  >
                    {!unidadeSelecionada && (
                      <>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            flex: 1,
                            minWidth: "250px",
                          }}
                        >
                          <FaSearch style={{ color: "#666" }} />
                          <input
                            type="text"
                            placeholder="Buscar unidades..."
                            value={searchTermUnidades}
                            onChange={(e) =>
                              setSearchTermUnidades(e.target.value)
                            }
                            style={{
                              flex: 1,
                              padding: "8px 12px",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              fontSize: "14px",
                            }}
                          />
                        </div>
                        <BotaoAdicionar onClick={handleOpenModalUnidade}>
                          <FaPlus style={{ marginRight: "8px" }} />
                          Adicionar Unidade
                        </BotaoAdicionar>
                      </>
                    )}
                  </div>
                </div>

                <DivFormEixo>
                  <DivFormConteudo
                    active={true}
                    style={{
                      display: "block",
                      visibility: "visible",
                      opacity: 1,
                    }}
                  >
                    {!unidadeSelecionada && (
                      <>
                        {loadingUnidades ? (
                          <div style={{ textAlign: "center", padding: "40px" }}>
                            <p>Carregando unidades...</p>
                          </div>
                        ) : unidades.filter((unidade) =>
                            unidade.nome_unidade
                              ?.toLowerCase()
                              .includes(searchTermUnidades.toLowerCase())
                          ).length === 0 ? (
                          <div style={{ textAlign: "center", padding: "40px" }}>
                            <p>
                              {searchTermUnidades
                                ? "Nenhuma unidade encontrada com o termo buscado."
                                : "Nenhuma unidade cadastrada."}
                            </p>
                          </div>
                        ) : (
                          <div
                            style={{
                              backgroundColor: "#fff",
                              borderRadius: "8px",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              overflow: "hidden",
                              //marginTop: "20px",
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
                                      ? "1fr 150px 150px 150px 120px"
                                      : "1fr",
                                  gap:
                                    window.innerWidth > 768 ? "15px" : "10px",
                                  alignItems: "center",
                                  padding: "0 15px",
                                }}
                              >
                                {window.innerWidth > 768 ? (
                                  <>
                                    <div>NOME DA UNIDADE</div>
                                    <div>TIPO</div>
                                    <div>EIXO</div>
                                    <div>MUNICÍPIO</div>
                                    <div style={{ textAlign: "center" }}>
                                      AÇÕES
                                    </div>
                                  </>
                                ) : (
                                  <div>UNIDADES</div>
                                )}
                              </div>
                            </div>

                            {/* Linhas da Tabela */}
                            {unidades
                              .filter((unidade) =>
                                unidade.nome_unidade
                                  ?.toLowerCase()
                                  .includes(searchTermUnidades.toLowerCase())
                              )
                              .map((unidade, index) => {
                                const isEven = index % 2 === 0;

                                return (
                                  <div
                                    key={unidade.id_unidade}
                                    style={{
                                      backgroundColor:
                                        unidadeSelecionada?.id_unidade ===
                                        unidade.id_unidade
                                          ? "#d1ecf1"
                                          : isEven
                                          ? "#f8f9fa"
                                          : "#ffffff",
                                      borderBottom:
                                        index < unidades.length - 1
                                          ? "1px solid #dee2e6"
                                          : "none",
                                      padding: "15px 0",
                                      transition: "background-color 0.2s ease",
                                      cursor: "pointer",
                                      borderLeft:
                                        unidadeSelecionada?.id_unidade ===
                                        unidade.id_unidade
                                          ? "4px solid #1e88e5"
                                          : "none",
                                    }}
                                    onClick={() => handleSelectUnidade(unidade)}
                                    onMouseEnter={(e) => {
                                      if (
                                        unidadeSelecionada?.id_unidade !==
                                        unidade.id_unidade
                                      ) {
                                        e.currentTarget.style.backgroundColor =
                                          "#e8f4fd";
                                        e.currentTarget.style.borderLeft =
                                          "3px solid #1e88e5";
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (
                                        unidadeSelecionada?.id_unidade !==
                                        unidade.id_unidade
                                      ) {
                                        e.currentTarget.style.backgroundColor =
                                          isEven ? "#f8f9fa" : "#ffffff";
                                        e.currentTarget.style.borderLeft =
                                          "none";
                                      }
                                    }}
                                  >
                                    {window.innerWidth > 768 ? (
                                      <div
                                        style={{
                                          display: "grid",
                                          gridTemplateColumns:
                                            "1fr 150px 150px 150px 120px",
                                          gap: "15px",
                                          alignItems: "center",
                                          padding: "0 15px",
                                          pointerEvents: "none",
                                        }}
                                      >
                                        {/* Nome */}
                                        <div
                                          style={{
                                            fontSize: "14px",
                                            color: "#495057",
                                            fontWeight: "500",
                                          }}
                                        >
                                          {unidade.nome_unidade}
                                        </div>

                                        {/* Tipo */}
                                        <div
                                          style={{
                                            fontSize: "12px",
                                            color: "#6c757d",
                                          }}
                                        >
                                          {unidade.tipoUnidade
                                            ?.nome_tipo_unidade || "-"}
                                        </div>

                                        {/* Eixo */}
                                        <div
                                          style={{
                                            fontSize: "12px",
                                            color: "#6c757d",
                                          }}
                                        >
                                          {unidade.eixo?.nome_eixo || "-"}
                                        </div>

                                        {/* Município */}
                                        <div
                                          style={{
                                            fontSize: "12px",
                                            color: "#6c757d",
                                          }}
                                        >
                                          {unidade.municipio?.municipio_nome ||
                                            "-"}
                                        </div>

                                        {/* Ações */}
                                        <div
                                          style={{
                                            display: "flex",
                                            gap: "8px",
                                            justifyContent: "center",
                                            pointerEvents: "auto",
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <BotaoEditar
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              e.preventDefault();
                                              handleEditUnidade(unidade);
                                            }}
                                            title="Editar"
                                          >
                                            <FaEdit />
                                          </BotaoEditar>
                                          <BotaoRemover
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              e.preventDefault();
                                              handleDeleteUnidade(
                                                unidade.id_unidade
                                              );
                                            }}
                                            title="Excluir"
                                          >
                                            <FaTrash />
                                          </BotaoRemover>
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
                                          pointerEvents: "none",
                                        }}
                                      >
                                        <div
                                          style={{
                                            fontSize: "16px",
                                            fontWeight: "bold",
                                            color: "#1e88e5",
                                          }}
                                        >
                                          {unidade.nome_unidade}
                                        </div>
                                        <div
                                          style={{
                                            fontSize: "12px",
                                            color: "#6c757d",
                                          }}
                                        >
                                          Tipo:{" "}
                                          {unidade.tipoUnidade
                                            ?.nome_tipo_unidade || "-"}
                                        </div>
                                        <div
                                          style={{
                                            fontSize: "12px",
                                            color: "#6c757d",
                                          }}
                                        >
                                          Eixo: {unidade.eixo?.nome_eixo || "-"}
                                        </div>
                                        <div
                                          style={{
                                            fontSize: "12px",
                                            color: "#6c757d",
                                          }}
                                        >
                                          Município:{" "}
                                          {unidade.municipio?.municipio_nome ||
                                            "-"}
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            gap: "8px",
                                            marginTop: "10px",
                                            pointerEvents: "auto",
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <BotaoEditar
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              e.preventDefault();
                                              handleEditUnidade(unidade);
                                            }}
                                            title="Editar"
                                          >
                                            <FaEdit /> Editar
                                          </BotaoEditar>
                                          <BotaoRemover
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              e.preventDefault();
                                              handleDeleteUnidade(
                                                unidade.id_unidade
                                              );
                                            }}
                                            title="Excluir"
                                          >
                                            <FaTrash /> Excluir
                                          </BotaoRemover>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                          </div>
                        )}
                      </>
                    )}

                    {/* Indicadores da Unidade Selecionada */}
                    {unidadeSelecionada && (
                      <div
                        style={{
                          marginTop: "30px",
                          padding: "20px",
                          borderTop: "2px solid #1e88e5",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "20px",
                          }}
                        >
                          <h3 style={{ margin: 0, color: "#333" }}>
                            Unidade: {unidadeSelecionada.nome_unidade}
                          </h3>
                          <button
                            type="button"
                            onClick={handleDeselectUnidade}
                            style={{
                              padding: "8px 16px",
                              backgroundColor: "#6c757d",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "14px",
                            }}
                          >
                            Fechar
                          </button>
                        </div>

                        {loadingIndicadoresUnidade ? (
                          <div style={{ textAlign: "center", padding: "40px" }}>
                            <p>Carregando indicadores...</p>
                          </div>
                        ) : indicadoresUnidade.length === 0 ? (
                          <div style={{ textAlign: "center", padding: "40px" }}>
                            <p>
                              Nenhum indicador encontrado para esta unidade.
                            </p>
                          </div>
                        ) : (
                          <div
                            style={{
                              backgroundColor: "#fff",
                              borderRadius: "8px",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              overflow: "hidden",
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
                                  gap:
                                    window.innerWidth > 768 ? "15px" : "10px",
                                  alignItems: "center",
                                  padding: "0 15px",
                                }}
                              >
                                {window.innerWidth > 768 ? (
                                  <>
                                    <div>CÓDIGO</div>
                                    <div>DESCRIÇÃO DO INDICADOR</div>
                                    <div style={{ textAlign: "center" }}>
                                      VALOR
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                      UNIDADE
                                    </div>
                                  </>
                                ) : (
                                  <div>INDICADORES</div>
                                )}
                              </div>
                            </div>

                            {/* Linhas da Tabela */}
                            {indicadoresUnidade.map((indicador, index) => {
                              const tipoCampo =
                                indicador.tiposCampo &&
                                indicador.tiposCampo.length > 0
                                  ? indicador.tiposCampo[0]
                                  : null;
                              const isEven = index % 2 === 0;

                              return (
                                <div
                                  key={indicador.id_indicador}
                                  style={{
                                    backgroundColor: isEven
                                      ? "#f8f9fa"
                                      : "#ffffff",
                                    borderBottom:
                                      index < indicadoresUnidade.length - 1
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
                                    e.currentTarget.style.backgroundColor =
                                      isEven ? "#f8f9fa" : "#ffffff";
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
                                        <div style={{ width: "260px" }}>
                                          <CampoIndicador
                                            indicador={indicador}
                                            register={register}
                                            anoSelected="2025"
                                            campoEnabled={campoEnabled}
                                            fieldStates={fieldStates}
                                            setFieldStates={setFieldStates}
                                            setValue={setValue}
                                            dadosMunicipio={dadosMunicipio}
                                            watch={watch}
                                            prestadoresServicos={prestadoresServicos}
                                            onOpenMapModal={handleOpenMapModal}
                                          />
                                        </div>
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

                                      <CampoIndicador
                                        indicador={indicador}
                                        register={register}
                                        anoSelected="2025"
                                        campoEnabled={campoEnabled}
                                        fieldStates={fieldStates}
                                        setFieldStates={setFieldStates}
                                        setValue={setValue}
                                        dadosMunicipio={dadosMunicipio}
                                        watch={watch}
                                        prestadoresServicos={prestadoresServicos}
                                        onOpenMapModal={handleOpenMapModal}
                                      />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Botão de Salvar */}
                        {isEditor && indicadoresUnidade.length > 0 && (
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
                                e.currentTarget.style.backgroundColor =
                                  "#218838";
                                e.currentTarget.style.boxShadow =
                                  "0 4px 8px rgba(40,167,69,0.3)";
                                e.currentTarget.style.transform =
                                  "translateY(-1px)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#28a745";
                                e.currentTarget.style.boxShadow =
                                  "0 2px 4px rgba(40,167,69,0.2)";
                                e.currentTarget.style.transform =
                                  "translateY(0)";
                              }}
                            >
                              💾 Salvar Dados dos Indicadores da Unidade
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </DivFormConteudo>
                </DivFormEixo>
              </DivForm>
            </Form>
          )}
        </DivCenter>
      </BodyDashboard>

      {/* Modal para Adicionar/Editar Unidade */}
      {isModalUnidadeVisible && (
        <ContainerModal>
          <Modal style={{ maxWidth: "600px", width: "90%" }}>
            <CloseModalButton
              onClick={handleCloseModalUnidade}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "transparent",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#666",
                zIndex: 10,
                padding: "5px 10px",
                borderRadius: "4px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f0f0f0";
                e.currentTarget.style.color = "#333";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#666";
              }}
            >
              ×
            </CloseModalButton>
            <div>
              <h2
                style={{
                  marginBottom: "25px",
                  fontSize: "22px",
                  fontWeight: "600",
                  color: "#333",
                  borderBottom: "2px solid #12B2D5",
                  paddingBottom: "15px",
                }}
              >
                {isEditingUnidade ? "Editar Unidade" : "Adicionar Nova Unidade"}
              </h2>
              <div>
                <Form
                  onSubmit={handleSubmitUnidade(handleSaveUnidade)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      padding: "10px",
                    }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#333",
                      }}
                    >
                      Nome da Unidade
                      <span style={{ color: "#dc3545" }}> *</span>
                    </label>
                    <input
                      {...registerUnidade("nome_unidade", {
                        required: "O nome da unidade é obrigatório",
                      })}
                      type="text"
                      placeholder="Digite o nome da unidade"
                      style={{
                        margin: "0 auto",
                        width: "90%",
                        padding: "12px 15px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "14px",
                        transition: "all 0.2s",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#12B2D5";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(18, 178, 213, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#ddd";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    {errorsUnidade.nome_unidade && (
                      <span
                        style={{
                          color: "#dc3545",
                          fontSize: "12px",
                          marginTop: "5px",
                          display: "block",
                        }}
                      >
                        {errorsUnidade.nome_unidade.message as string}
                      </span>
                    )}

                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#333",
                      }}
                    >
                      Eixo
                    </label>
                    <input
                      {...registerUnidade("id_eixo", { value: "1" })}
                      type="text"
                      disabled
                      value={
                        eixos.find((e) => e.id_eixo === 1)?.nome || "Eixo 1"
                      }
                      style={{
                        margin: "0 auto",
                        width: "90%",
                        padding: "12px 15px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "14px",
                        transition: "all 0.2s",
                        backgroundColor: "#f5f5f5",
                      }}
                    />

                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#333",
                      }}
                    >
                      Municipio
                    </label>
                    <select
                      {...registerUnidade("id_municipio", {
                        value: usuario?.id_municipio?.toString() || "",
                      })}
                      value={
                        municipioValue ||
                        usuario?.id_municipio?.toString() ||
                        ""
                      }
                      onChange={(e) => {
                        setValueUnidade("id_municipio", e.target.value);
                      }}
                      style={{
                        margin: "0 auto",
                        width: "95%",
                        padding: "12px 15px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "14px",
                        transition: "all 0.2s",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#12B2D5";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(18, 178, 213, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#ddd";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      <option value="">Selecione um município</option>
                      {municipios.map((municipio) => (
                        <option
                          key={municipio.id_municipio}
                          value={municipio.id_municipio}
                        >
                          {municipio.municipio_nome}
                        </option>
                      ))}
                    </select>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#333",
                      }}
                    >
                      Tipo de Unidade
                    </label>
                    <select
                      {...registerUnidade("id_tipo_unidade")}
                      value={tipoUnidadeValue || ""}
                      onChange={(e) => {
                        setValueUnidade("id_tipo_unidade", e.target.value);
                      }}
                      style={{
                        margin: "0 auto",
                        width: "95%",
                        padding: "12px 15px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "14px",
                        transition: "all 0.2s",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#12B2D5";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(18, 178, 213, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#ddd";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      <option value="">Selecione um tipo de unidade</option>
                      {tiposUnidade.map((tipo) => (
                        <option
                          key={tipo.id_tipo_unidade}
                          value={tipo.id_tipo_unidade}
                        >
                          {tipo.nome_tipo_unidade}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      justifyContent: "flex-end",
                      marginTop: "10px",
                      paddingTop: "20px",
                      borderTop: "1px solid #eee",
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleCloseModalUnidade}
                      style={{
                        padding: "12px 24px",
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "500",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#5a6268";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#6c757d";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      Cancelar
                    </button>
                    <SubmitButton
                      type="submit"
                      style={{
                        padding: "12px 24px",
                        fontSize: "14px",
                        fontWeight: "500",
                        borderRadius: "6px",
                        transition: "all 0.2s",
                      }}
                    >
                      {isEditingUnidade ? "Atualizar" : "Salvar"}
                    </SubmitButton>
                  </div>
                </Form>
              </div>
            </div>
          </Modal>
        </ContainerModal>
      )}

      {/* Modal do Mapa para seleção de coordenadas */}
      {isModalMapVisible && (
        <ContainerModal>
          <Modal style={{ maxWidth: "900px", width: "90%" }}>
            <CloseModalButton onClick={handleCloseMapModal}>×</CloseModalButton>
            <TituloModal>Selecionar Localização no Mapa</TituloModal>
            <ConteudoModal>
              <TextoModal style={{ marginBottom: "15px", color: "#666" }}>
                Clique no mapa para selecionar a localização. As coordenadas (latitude e longitude) serão preenchidas automaticamente.
              </TextoModal>
              <div style={{ position: "relative", width: "100%" }}>
                <MapPicker onLocationSelect={handleLocationSelect} />
              </div>
            </ConteudoModal>
          </Modal>
        </ContainerModal>
      )}
    </Container>
  );
}
