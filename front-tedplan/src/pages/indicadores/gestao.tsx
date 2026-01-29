import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { BreadCrumbStyle } from "../../styles/indicadores";
import {
  Container,
  DivCenter,
  DivForm,
  Sidebar,
  DivTituloForm,
  DivInput,
  Form,
  InputP,
  InputM,
  InputG,
  SubmitButton,
  SubmitButtonContainer,
  DivEixo,
  TextArea,
  DivTextArea,
  MenuMunicipio,
  Municipio,
  MenuMunicipioItem,
  ContainerModal,
  Modal,
  ConteudoModal,
  CloseModalButton,
  SubmitButtonModal,
  Tabela,
  Actions,
  ButtonAdicionarPresidente,
  Tooltip,
  TooltipText,
  ExpandButton,
  CollapseButton,
} from "../../styles/indicadores";
import { FaBars, FaList, FaCaretDown, FaLink, FaUser, FaEnvelope, FaPhone, FaBriefcase, FaTimes } from "react-icons/fa";
import Link from "next/link";
import Editar from "../../img/editar.png";
import ajuda from "../../img/ajuda.png";
import HeadIndicadores from "../../components/headIndicadores";
import Image from "next/image";
import "suneditor/dist/css/suneditor.min.css";
import { getAPIClient } from "../../services/axios";
import MenuIndicadores from "../../components/MenuIndicadoresCadastro";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import RepresentanteGestaoAssociada from "../../components/RepresentanteGestaoAssociada";
// import { FormModal } from "../../styles/dashboard";
import Excluir from "../../img/excluir.png";
import Pdf from "../../img/pdf.png";
import {
  faPlus,
  faCoffee,
  faRadiation,
} from "@fortawesome/free-solid-svg-icons";
import api from "../../services/api";
import MenuHorizontal from "../../components/MenuHorizontal";
import { FaFilePdf } from "react-icons/fa";
import styled from "styled-components";
import {
  capitalizeFrasal,
  onlyLettersAndCharacters,
  toTitleCase,
} from "@/util/util";
import {
  DivFormCadastro,
  DivTituloForm as DivTituloFormIndicadores,
  MainContent,
  SidebarItem,
} from "@/styles/esgoto-indicadores";
import { DivFormConteudo, DivTitulo } from "@/styles/drenagem-indicadores";
import { DivFormEixo, DivTituloConteudo } from "@/styles/financeiro";
import { MenuHeader, MenuItemsContainer } from "@/styles/residuo-solidos-in";

const InputMask = require("react-input-mask");

// Styled component para container de tabelas lado a lado
const TablesContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  width: 98%;

  @media (max-width: 1200px) {
    flex-direction: column;
    gap: 20px;
  }

  > div {
    flex: 1;
    min-width: 0;
  }
`;

const PhoneInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #2d3748;
  transition: all 0.2s ease;
  background: #fff;

  &:focus {
    border-color: #0085bd;
    box-shadow: 0 0 0 3px rgba(0, 133, 189, 0.1);
    outline: none;
  }

  &:hover:not(:focus) {
    border-color: #cbd5e0;
  }
`;

const ModalSubmitButton = styled.button`
  background: #008080;
  color: #fff;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  margin-top: 20px;
  display: block;
  margin-left: auto;
  margin-right: 0;

  &:hover {
    background: #008899;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;
interface IMunicipio {
  id_municipio: string;
  municipio_codigo_ibge: string;
  municipio_nome: string;
  municipio_cnpj: string;
  municipio_nome_prefeitura: string;
  municipio_cep: string;
  municipio_endereco: string;
  municipio_numero: string;
  municipio_bairro: string;
  municipio_telefone: string;
  municipio_email: string;
  municipio_nome_prefeito: string;
}
interface IGestao {
  id_gestao_associada: string;
  nome_associacao: string;
  norma_associacao: string;

  plano_ano: string;
  plano_titulo: string;

  politica_ano: string;
  politica_titulo: string;

  sr_descricao: string;

  ct_nomes_comunidades: string;
  ct_descricao: string;
  string: string;
}
interface IRepresentantes {
  id_representante_servicos_ga: string;
  cargo: string;
  email: string;
  telefone: string;
  nome: string;
}
interface IConselho {
  id_conselho_municipal_saneamento_basico: number;
  titulo: string;
  ano: string;
  id_arquivo: string;
  id_municipio: Number;
}
interface IPresidencia {
  id_presidencia_conselho_municipal_saneamento_basico: string;
  nome_presidente: string;
  telefone_presidente: string;
  email_presidente: string;
  setor_responsavel: string;
  integrantes: string;
  id_municipio: string;
}
interface IPoliticas {
  id_politica_municipal: string;
  titulo: string;
  ano: string;
  id_arquivo: string;
  file?: string;
  situacao: string;
}
interface IPlanos {
  id_plano_municipal: string;
  titulo: string;
  ano: string;
  id_arquivo: string;
  file?: string;
  situacao?: string;
}
interface IParticipacao {
  id_participacao_controle_social: string;
  titulo: string;
  ano: string;
  id_arquivo: string;
}
interface MunicipioProps {
  municipio: IMunicipio[];
  gestao: IGestao[];
}

// Interfaces para o componente CampoIndicadorPolitica
interface ISelectOption {
  id_select_option: string;
  value: string;
  descricao: string;
  ordem_option?: number;
}

interface ICheckBoxItem {
  id_item_check_box: string;
  descricao: string;
  valor: string;
}

interface ITipoCampoIndicadorPolitica {
  id_tipo_campo_indicador: string;
  type: string;
  name_campo: string;
  enable: boolean;
  default_value: string;
  selectOptions?: ISelectOption[];
  checkBoxItems?: ICheckBoxItem[];
}

interface IIndicadorPolitica {
  id_indicador: string;
  codigo_indicador: string;
  nome_indicador: string;
  grupo_indicador: string;
  unidade_indicador: string;
  tiposCampo?: ITipoCampoIndicadorPolitica[];
  _hasError?: boolean;
}

// Componente CampoIndicadorPolitica baseado no CampoIndicador do prestacao-servico-agua.tsx
const CampoIndicadorPolitica = ({
  indicador,
  register,
  anoSelected,
  setValue,
  watch,
}: {
  indicador: IIndicadorPolitica;
  register: any;
  anoSelected: string;
  setValue?: any;
  watch?: any;
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
          width: "100%",
          padding: "8px 12px",
          borderRadius: "4px",
        }}
      />
    );
  }

  // Pegar o registro do react-hook-form
  const fieldRegistration = register(fieldName);

  // Propriedades base do campo
  const baseProps = {
    ...fieldRegistration,
    placeholder: tipoCampo.default_value || "",
    defaultValue: tipoCampo.default_value || "",
    disabled: !tipoCampo.enable,
    style: {
      width: "100%",
      padding: "8px 12px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "13px",
      transition: "all 0.2s ease",
      backgroundColor: !tipoCampo.enable ? "#f8f9fa" : "white",
      color: !tipoCampo.enable ? "#6c757d" : "#333",
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
          rows={3}
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
          suppressHydrationWarning
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: !tipoCampo.enable ? "#f8f9fa" : "white",
          }}
        >
          {checkBoxItems.map((item, index) => {
            const checkboxFieldName = `${fieldName}_${item.id_item_check_box}_${anoSelected}`;

            return (
              <label
                key={item.id_item_check_box}
                suppressHydrationWarning
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "13px",
                  cursor: !tipoCampo.enable ? "not-allowed" : "pointer",
                  opacity: !tipoCampo.enable ? 0.6 : 1,
                }}
              >
                <input
                  type="checkbox"
                  defaultChecked={Boolean(item.valor)}
                  disabled={!tipoCampo.enable}
                  style={{ transform: "scale(1.1)" }}
                  onChange={(e) => {
                    // Forçar o React Hook Form a registrar corretamente usando setValue
                    if (setValue) {
                      if (e.target.checked) {
                        setValue(checkboxFieldName, true);
                      } else {
                        setValue(checkboxFieldName, false);
                      }
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

// Componente CampoIndicadorPlano baseado no CampoIndicadorPolitica
const CampoIndicadorPlano = ({
  indicador,
  register,
  anoSelected,
  setValue,
  watch,
}: {
  indicador: IIndicadorPolitica;
  register: any;
  anoSelected: string;
  setValue?: any;
  watch?: any;
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
          width: "100%",
          padding: "8px 12px",
          borderRadius: "4px",
        }}
      />
    );
  }

  // Pegar o registro do react-hook-form
  const fieldRegistration = register(fieldName);

  // Propriedades base do campo
  const baseProps = {
    ...fieldRegistration,
    placeholder: tipoCampo.default_value || "",
    defaultValue: tipoCampo.default_value || "",
    disabled: !tipoCampo.enable,
    style: {
      width: "100%",
      padding: "8px 12px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "13px",
      transition: "all 0.2s ease",
      backgroundColor: !tipoCampo.enable ? "#f8f9fa" : "white",
      color: !tipoCampo.enable ? "#6c757d" : "#333",
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
          rows={3}
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
          suppressHydrationWarning
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: !tipoCampo.enable ? "#f8f9fa" : "white",
          }}
        >
          {checkBoxItems.map((item, index) => {
            const checkboxFieldName = `${fieldName}_${item.id_item_check_box}_${anoSelected}`;

            return (
              <label
                key={item.id_item_check_box}
                suppressHydrationWarning
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "13px",
                  cursor: !tipoCampo.enable ? "not-allowed" : "pointer",
                  opacity: !tipoCampo.enable ? 0.6 : 1,
                }}
              >
                <input
                  type="checkbox"
                  defaultChecked={Boolean(item.valor)}
                  disabled={!tipoCampo.enable}
                  style={{ transform: "scale(1.1)" }}
                  onChange={(e) => {
                    // Forçar o React Hook Form a registrar corretamente usando setValue
                    if (setValue) {
                      if (e.target.checked) {
                        setValue(checkboxFieldName, true);
                      } else {
                        setValue(checkboxFieldName, false);
                      }
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

// Componente CampoIndicadorConselho baseado no CampoIndicadorPolitica
const CampoIndicadorConselho = ({
  indicador,
  register,
  anoSelected,
  setValue,
  watch,
}: {
  indicador: IIndicadorPolitica;
  register: any;
  anoSelected: string;
  setValue?: any;
  watch?: any;
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
          width: "100%",
          padding: "8px 12px",
          borderRadius: "4px",
        }}
      />
    );
  }

  // Pegar o registro do react-hook-form
  const fieldRegistration = register(fieldName);

  // Propriedades base do campo
  const baseProps = {
    ...fieldRegistration,
    placeholder: tipoCampo.default_value || "",
    defaultValue: tipoCampo.default_value || "",
    disabled: !tipoCampo.enable,
    style: {
      width: "100%",
      padding: "8px 12px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "13px",
      transition: "all 0.2s ease",
      backgroundColor: !tipoCampo.enable ? "#f8f9fa" : "white",
      color: !tipoCampo.enable ? "#6c757d" : "#333",
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
          rows={3}
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
          suppressHydrationWarning
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: !tipoCampo.enable ? "#f8f9fa" : "white",
          }}
        >
          {checkBoxItems.map((item, index) => {
            const checkboxFieldName = `${fieldName}_${item.id_item_check_box}_${anoSelected}`;

            return (
              <label
                key={item.id_item_check_box}
                suppressHydrationWarning
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "13px",
                  cursor: !tipoCampo.enable ? "not-allowed" : "pointer",
                  opacity: !tipoCampo.enable ? 0.6 : 1,
                }}
              >
                <input
                  type="checkbox"
                  defaultChecked={Boolean(item.valor)}
                  disabled={!tipoCampo.enable}
                  style={{ transform: "scale(1.1)" }}
                  onChange={(e) => {
                    // Forçar o React Hook Form a registrar corretamente usando setValue
                    if (setValue) {
                      if (e.target.checked) {
                        setValue(checkboxFieldName, true);
                      } else {
                        setValue(checkboxFieldName, false);
                      }
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

// Styled Components movidos para fora do componente para evitar criação dinâmica
const TabContainer = styled.div`
    display: flex;
    gap: 10px;
  margin-bottom: 0px;
  `;

const TabButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== '$active',
}) <{ $active?: boolean }>`
    padding: 10px 20px;
    border: none;
  background: ${(props) => (props.$active ? "#007bff" : "#e9ecef")};
  color: ${(props) => (props.$active ? "white" : "black")};
    cursor: pointer;
  border-radius: 5px 5px 0px 0px;
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

const StaticMenuHeader = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$isActive',
}) <{ $isActive?: boolean }>`
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

export default function GestaoIndicadores({
  municipio,
  gestao,
}: MunicipioProps) {
  const { usuario, signOut } = useContext(AuthContext);
  const [dadosMunicipio, setDadosMunicipio] = useState(null);
  const [dadosGestao, setGestao] = useState<IGestao | any>(gestao);
  const [representantes, setRepresentantes] = useState(null);
  const [conselho, setConselho] = useState([]);
  const [conselhoMunicipal, setConselhoMunicipal] = useState([]);
  const [isClient, setIsClient] = useState(null);
  const [updatePresidente, setUpdatePresidente] = useState(null);
  const [updatePolitica, setUpdatePolitica] = useState<IPoliticas | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [innerWidth, setInnerWidth] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTabPolitica, setActiveTabPolitica] = useState("politicaMunicipal");
  const [activeTabPlano, setActiveTabPlano] = useState("planoMunicipal");
  const [activeTabConselho, setActiveTabConselho] = useState("conselhoMunicipal");
  const [menus, setMenus] = useState([]);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  useEffect(() => {
    // Marca como montado apenas no cliente
    setIsMounted(true);

    // Inicializa innerWidth apenas no cliente
    if (typeof window !== "undefined") {
      setInnerWidth(window.innerWidth);
    }

    const handleResize = () => {
      if (typeof window !== "undefined") {
        const width = window.innerWidth;
        setInnerWidth(width);
        if (width <= 1000) {
          setIsCollapsed(true);
        } else {
          setIsCollapsed(false);
        }
      }
    };

    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const [showModalPlano, setShowModalPlano] = useState(false);
  const [updatePlano, setUpdatePlano] = useState<IPlanos | null>(null);

  const {
    register: registerGestao,
    handleSubmit: handleSubmitGestao,
    reset: resetGestao,
    setValue: setValueGestao,
    watch: watchGestao,
    formState: { errors: errorsGestao },
    control: controlGestao,
  } = useForm();

  const {
    register: registerPolitica,
    handleSubmit: handleSubmitPolitica,
    reset: resetPolitica,
    setValue: setValuePolitica,
    formState: { errors: errorsPolitica },
    control: controlPolitica,
  } = useForm();

  const {
    register: registerPlano,
    handleSubmit: handleSubmitPlano,
    reset: resetPlano,
    setValue: setValuePlano,
    formState: { errors: errorsPlano },
    control: controlPlano,
  } = useForm();

  const {
    register: registerConselho,
    handleSubmit: handleSubmitConselho,
    reset: resetConselho,
    setValue: setValueConselho,
    formState: { errors: errorsConselho },
    control: controlConselho,
  } = useForm();

  const {
    register: registerParticipacao,
    handleSubmit: handleSubmitParticipacao,
    reset: resetParticipacao,
    setValue: setValueParticipacao,
    formState: { errors: errorsParticipacao },
    control: controlParticipacao,
  } = useForm();

  const {
    register: registerSR,
    handleSubmit: handleSubmitSR,
    reset: resetSR,
    setValue: setValueSR,
    formState: { errors: errorsSR },
    control: controlSR,
  } = useForm();

  const {
    register: registerCT,
    handleSubmit: handleSubmitCT,
    reset: resetCT,
    setValue: setValueCT,
    formState: { errors: errorsCT },
    control: controlCT,
  } = useForm();

  // Formulário separado para os indicadores de Política
  const {
    register: registerIndicadoresPolitica,
    handleSubmit: handleSubmitIndicadoresPolitica,
    reset: resetIndicadoresPolitica,
    setValue: setValueIndicadoresPolitica,
    watch: watchIndicadoresPolitica,
    formState: { errors: errorsIndicadoresPolitica },
  } = useForm<any>({});

  // Formulário separado para os indicadores de Plano Municipal
  const {
    register: registerIndicadoresPlano,
    handleSubmit: handleSubmitIndicadoresPlano,
    reset: resetIndicadoresPlano,
    setValue: setValueIndicadoresPlano,
    watch: watchIndicadoresPlano,
    formState: { errors: errorsIndicadoresPlano },
  } = useForm<any>({});

  // Formulário separado para os indicadores de Conselho Municipal
  const {
    register: registerIndicadoresConselho,
    handleSubmit: handleSubmitIndicadoresConselho,
    reset: resetIndicadoresConselho,
    setValue: setValueIndicadoresConselho,
    watch: watchIndicadoresConselho,
    formState: { errors: errorsIndicadoresConselho },
  } = useForm<any>({});

  const {
    register: registerIndicadores,
    handleSubmit: handleSubmitIndicadores,
    reset: resetIndicadores,
    formState: { errors: errorsIndicadores },
  } = useForm<any>({});

  const [showModal, setShowModal] = useState(false);
  const [showModalPolitica, setShowModalPolitica] = useState(false);
  const [listParticipacoes, setListParticipacoes] = useState(null);
  const [ShowModalPresidente, setShowModalPresidente] = useState(false);
  const [activeForm, setActiveForm] = useState("gestaoAssociada");
  const [content, setContent] = useState("");
  const [listPoliticas, setPoliticas] = useState<IPoliticas[] | null>(null);
  const [listPlanos, setPlanos] = useState(null);
  const [updateRepresentantes, setUpdateRepresentantes] = useState(null);
  const [politicaSituacao, setPoliticaSituacao] = useState("aprovado"); // Valor padrão
  const [planoSituacao, setPlanoSituacao] = useState("aprovado"); // Valor padrão
  const [conselhoSituacao, setConselhoSituacao] = useState("operante");
  const [showModalParticipacao, setShowModalParticipacao] = useState(false);
  const [updateParticipacao, setUpdateParticipacao] =
    useState<IParticipacao | null>(null);

  // Estados para listagem de indicadores de Política
  const [indicadoresPolitica, setIndicadoresPolitica] = useState<any[]>([]);
  const [menuItemsPolitica, setMenuItemsPolitica] = useState<any[]>([]);
  const [grupoPolitica, setGrupoPolitica] = useState<string>("");
  const [anoSelectedPolitica, setAnoSelectedPolitica] = useState<string>("");
  const [loadingIndicadoresPolitica, setLoadingIndicadoresPolitica] = useState(false);
  const [dadosCarregadosPolitica, setDadosCarregadosPolitica] = useState<any[]>([]);
  const [loadingDadosPolitica, setLoadingDadosPolitica] = useState(false);

  // Estados para listagem de indicadores de Plano Municipal
  const [indicadoresPlano, setIndicadoresPlano] = useState<any[]>([]);
  const [menuItemsPlano, setMenuItemsPlano] = useState<any[]>([]);
  const [grupoPlano, setGrupoPlano] = useState<string>("");
  const [anoSelectedPlano, setAnoSelectedPlano] = useState<string>("");
  const [loadingIndicadoresPlano, setLoadingIndicadoresPlano] = useState(false);
  const [dadosCarregadosPlano, setDadosCarregadosPlano] = useState<any[]>([]);
  const [loadingDadosPlano, setLoadingDadosPlano] = useState(false);

  // Estados para listagem de indicadores de Conselho Municipal
  const [indicadoresConselho, setIndicadoresConselho] = useState<any[]>([]);
  const [menuItemsConselho, setMenuItemsConselho] = useState<any[]>([]);
  const [grupoConselho, setGrupoConselho] = useState<string>("");
  const [anoSelectedConselho, setAnoSelectedConselho] = useState<string>("");
  const [loadingIndicadoresConselho, setLoadingIndicadoresConselho] = useState(false);
  const [dadosCarregadosConselho, setDadosCarregadosConselho] = useState<any[]>([]);
  const [loadingDadosConselho, setLoadingDadosConselho] = useState(false);

  const [grupo, setGrupo] = useState<string | null>(null);

  const [loadingIndicadores, setLoadingIndicadores] = useState(false);
  const [dadosCarregados, setDadosCarregados] = useState<any[]>([]);
  const [loadingDados, setLoadingDados] = useState(false);
  const [indicadores, setIndicadores] = useState<any[]>([]);
  const [anoSelected, setAnoSelected] = useState<string | null>(null);

  const editor = useRef(null);
  let txtArea = useRef();

  useEffect(() => {
    if (usuario?.id_municipio) {
      getMunicipio();
      getPresidentesConselho();
      setIsClient(true);
      getPoliticas();
      getPlanos();
      getParticipacoes();
      getRepresentantes();
      getGestao();
      getConselhoMunicipal();
    }
  }, [usuario]);

  useEffect(() => {
    if (
      listPoliticas &&
      listPoliticas.length > 0 &&
      listPoliticas[0]?.situacao
    ) {
      setPoliticaSituacao(listPoliticas[0].situacao);
    }
  }, [listPoliticas]);

  useEffect(() => {
    if (listPlanos && listPlanos.length > 0 && listPlanos[0]?.situacao) {
      setPlanoSituacao(listPlanos[0].situacao);
    }
  }, [listPlanos]);

  useEffect(() => {
    if (conselho && conselho.length > 0 && conselho[0]?.situacao) {
      setConselhoSituacao(conselho[0].situacao);
    }
  }, [conselho]);

  useEffect(() => {
    if (activeTabPolitica === "dadosComplementaresPolitica" && usuario?.id_municipio) {
      getMenuItemsPolitica();
    } else if (activeTabPolitica !== "dadosComplementaresPolitica") {
      // Limpar dados quando sair da tab
      setIndicadoresPolitica([]);
      setGrupoPolitica("");
      setAnoSelectedPolitica("");
    }
  }, [activeTabPolitica, usuario]);

  useEffect(() => {
    if (activeTabPlano === "dadosComplementaresPlano" && usuario?.id_municipio) {
      getMenuItemsPlano();
    } else if (activeTabPlano !== "dadosComplementaresPlano") {
      // Limpar dados quando sair da tab
      setIndicadoresPlano([]);
      setGrupoPlano("");
      setAnoSelectedPlano("");
    }
  }, [activeTabPlano, usuario]);

  useEffect(() => {
    if (activeTabConselho === "dadosComplementaresConselho" && usuario?.id_municipio) {
      getMenuItemsConselho();
    } else if (activeTabConselho !== "dadosComplementaresConselho") {
      // Limpar dados quando sair da tab
      setIndicadoresConselho([]);
      setGrupoConselho("");
      setAnoSelectedConselho("");
    }
  }, [activeTabConselho, usuario]);

  const prevDadosGestaoRef = useRef<any>(null);

  useEffect(() => {
    if (dadosGestao) {
      // Verifica se os dados realmente mudaram para evitar loops
      const dadosMudaram =
        prevDadosGestaoRef.current?.ga_nome !== dadosGestao.ga_nome ||
        prevDadosGestaoRef.current?.ga_norma !== dadosGestao.ga_norma;

      if (dadosMudaram) {
        const nomeAssociacao = dadosGestao.ga_nome !== null && dadosGestao.ga_nome !== undefined
          ? dadosGestao.ga_nome
          : "";
        const normaAssociacao = dadosGestao.ga_norma !== null && dadosGestao.ga_norma !== undefined
          ? dadosGestao.ga_norma
          : "";

        setValueGestao("nome_associacao", nomeAssociacao, { shouldDirty: false });
        setValueGestao("norma_associacao", normaAssociacao, { shouldDirty: false });

        // Atualiza a referência
        prevDadosGestaoRef.current = {
          ga_nome: dadosGestao.ga_nome,
          ga_norma: dadosGestao.ga_norma,
        };
      }
    }
  }, [dadosGestao, setValueGestao]);

  function handlePoliticaSituacaoChange(situacao) {
    setPoliticaSituacao(situacao);

    if (situacao === "nao_tem") {
      setValuePolitica("politica_titulo", "");
      setValuePolitica("politica_ano", "");
    }
  }
  function handlePlanoSituacaoChange(situacao) {
    setPlanoSituacao(situacao);

    if (situacao === "nao_tem") {
      setValuePlano("plano_titulo", "");
      setValuePlano("plano_ano", "");
    }
  }

  function handleConselhoSituacaoChange(situacao) {
    setConselhoSituacao(situacao);

    if (situacao === "nao_tem") {
      setValueConselho("conselho_titulo", "");
      setValueConselho("conselho_ano", "");
      setValueConselho("conselho_arquivo", null);
    }
  }

  // ------------- Funções GET -------------

  async function getMunicipio() {
    const res = await api
      .get("getMunicipio", {
        params: { id_municipio: usuario.id_municipio },
      })
      .then((response) => {
        setDadosMunicipio(response.data);
      });
  }
  async function getPoliticas() {
    if (!usuario?.id_municipio) {
      return;
    }

    try {
      const resPoliticas = await api.get("getPoliticas", {
        params: { id_municipio: usuario.id_municipio },
      });
      const politicas = resPoliticas.data;

      if (politicas && Array.isArray(politicas) && politicas.length > 0) {
        const politicasComArquivo = await Promise.all(
          politicas.map(async (p) => {
            let file = null;
            if (p.id_arquivo) {
              try {
                const fileResponse = await api.get("getFile", {
                  params: { id: p.id_arquivo },
                  responseType: "blob",
                });
                file = URL.createObjectURL(fileResponse.data);
              } catch (error) {
                console.log("Erro ao buscar arquivo:", error);
              }
            }
            return {
              ...p,
              file,
            };
          })
        );
        setPoliticas(politicasComArquivo);
      } else {
        setPoliticas([]);
      }
    } catch (error) {
      console.error("Erro ao buscar políticas:", error);
      toast.error("Erro ao buscar políticas!", {
        position: "top-right",
        autoClose: 5000,
      });
      setPoliticas([]);
    }
  }
  async function getConselhoMunicipal() {
    try {
      const res = await api.get(
        `get-conselhos-municipais/${usuario?.id_municipio}`,
        {
          params: { id_municipio: usuario?.id_municipio },
        }
      );
      const conselhos = res.data;
      if (conselhos && Array.isArray(conselhos) && conselhos.length > 0) {
        const resConselhoMunicipal = await Promise.all(
          conselhos.map(async (p) => {
            let file = null;
            if (p.id_arquivo) {
              try {
                const fileResponse = await api.get("getFile", {
                  params: { id: p.id_arquivo },
                  responseType: "blob",
                });
                file = URL.createObjectURL(fileResponse.data);
              } catch (error) {
                console.log("Erro ao buscar arquivo:", error);
              }
            }
            return { ...p, file };
          })
        );
        setConselhoMunicipal(resConselhoMunicipal);
      } else {
        setConselhoMunicipal([]);
      }
    } catch (error) {
      console.log("Erro ao buscar conselhos municipais:", error);
      setConselhoMunicipal([]);
    }
  }
  async function getPlanos() {
    const resPlanos = await api.get("getPlanos", {
      params: { id_municipio: usuario?.id_municipio },
    });
    const planos = await resPlanos.data;
    if (planos) {
      const resPlanos = await Promise.all(
        planos.map(async (p) => {
          const file = await api
            .get("getFile", {
              params: { id: p.id_arquivo },
              responseType: "blob",
            })
            .then((response) => {
              return URL.createObjectURL(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
          const pf = {
            ...p,
            file,
          };
          return pf;
        })
      );
      setPlanos(resPlanos);
    }
  }
  async function getParticipacoes() {
    const resParticipacao = await api.get("getParticipacaoControleSocial", {
      params: { id_municipio: usuario?.id_municipio },
    });
    const participacoes = await resParticipacao.data;
    if (participacoes) {
      const resParticipacoes = await Promise.all(
        participacoes.map(async (p) => {
          const file = await api
            .get("/getFile", {
              params: { id: p.id_arquivo },
              responseType: "blob",
            })
            .then((response) => {
              return URL.createObjectURL(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
          const pf = {
            ...p,
            file,
          };
          return pf;
        })
      );
      setListParticipacoes(resParticipacoes);
    }
  }
  async function getRepresentantes() {
    const resRepresentantes = await api.get("getRepresentantesServicos", {
      params: { id_municipio: usuario?.id_municipio },
    });
    const representantes = await resRepresentantes.data;

    setRepresentantes(representantes);
  }
  async function getGestao() {
    try {
      const resGestao = await api.get("/getGestao", {
        params: { id_municipio: usuario?.id_municipio },
      });

      if (resGestao.data && resGestao.data.length > 0) {
        const gestaoData = resGestao.data[0];

        // Garantir que valores null sejam tratados como strings vazias
        if (gestaoData.ga_nome === null || gestaoData.ga_nome === undefined) gestaoData.ga_nome = "";
        if (gestaoData.ga_norma === null || gestaoData.ga_norma === undefined) gestaoData.ga_norma = "";
        if (gestaoData.sr_descricao === null || gestaoData.sr_descricao === undefined || gestaoData.sr_descricao === "null" || gestaoData.sr_descricao === "undefined") gestaoData.sr_descricao = "";
        if (gestaoData.nomes_comunidades_beneficiadas === null || gestaoData.nomes_comunidades_beneficiadas === undefined || gestaoData.nomes_comunidades_beneficiadas === "null" || gestaoData.nomes_comunidades_beneficiadas === "undefined") gestaoData.nomes_comunidades_beneficiadas = "";
        if (gestaoData.ct_descricao === null || gestaoData.ct_descricao === undefined || gestaoData.ct_descricao === "null" || gestaoData.ct_descricao === "undefined") gestaoData.ct_descricao = "";

        setGestao(gestaoData);
      } else {
        setGestao(null);
      }
    } catch (error) {
      console.error("Erro ao buscar gestão:", error);
      setGestao(null);
    }
  }
  async function getPresidentesConselho() {
    if (!usuario?.id_municipio) {
      setConselho([]);
      return;
    }
    try {
      const resPresidentes = await api.get(
        `get-all-presidencia-conselho-municipal/${usuario.id_municipio}`
      );
      const presidentes = resPresidentes.data;
      if (presidentes && Array.isArray(presidentes) && presidentes.length > 0) {
        setConselho(presidentes);
      } else {
        setConselho([]);
      }
    } catch (error) {
      console.log("Erro ao buscar presidentes do conselho:", error);
      toast.error("Erro ao buscar presidentes do conselho!", {
        position: "top-right",
        autoClose: 5000,
      });
      setConselho([]);
    }
  }

  // Funções para buscar indicadores de Política
  async function getMenuItemsPolitica() {
    try {
      setLoadingIndicadoresPolitica(true);

      // Buscar menus do módulo 1 (Gestão) - o retorno já vem com menuItems incluídos
      const resModulo = await api.get(`menus/modulo/1`);
      const menusModulo = Array.isArray(resModulo.data) ? resModulo.data : [];

      // Procurar o menu "Politica Municipal" (sem acento, como está no banco)
      // Mas também aceitar com acento para compatibilidade
      const menuPolitica = menusModulo.find(
        (menu) => {
          const tituloLower = menu.titulo?.toLowerCase() || "";
          return (
            tituloLower === "politica municipal" ||
            tituloLower.includes("politica municipal") ||
            tituloLower.includes("política municipal")
          );
        }
      );

      if (!menuPolitica) {
        setMenuItemsPolitica([]);
        setIndicadoresPolitica([]);
        setGrupoPolitica("");
        return;
      }


      // Verificar se o menu já tem menuItems incluídos (como no retorno que você mostrou)
      let itensPolitica = [];

      if (menuPolitica.menuItems && Array.isArray(menuPolitica.menuItems) && menuPolitica.menuItems.length > 0) {
        // Usar todos os menuItems que já vêm no retorno
        itensPolitica = menuPolitica.menuItems;
      } else if (menuPolitica.id_menu) {
        // Se não tem menuItems no retorno, buscar separadamente (fallback)
        try {
          const resMenuItems = await api.get(`menu-items/menu/${menuPolitica.id_menu}`);
          itensPolitica = Array.isArray(resMenuItems.data) ? resMenuItems.data : [];
        } catch (e) {
          console.error("Erro ao buscar menuItems:", e);
        }
      }

      setMenuItemsPolitica(itensPolitica);

      // Se houver itens, carregar os indicadores do primeiro item
      if (itensPolitica.length > 0) {
        await getIndicadoresPolitica(itensPolitica[0]);
      } else {
        setIndicadoresPolitica([]);
        setGrupoPolitica("");
      }
    } catch (error) {
      console.error("Erro ao carregar menu items de Política:", error);
      toast.error("Erro ao carregar indicadores de Política", {
        position: "top-right",
        autoClose: 5000,
      });
      setMenuItemsPolitica([]);
      setIndicadoresPolitica([]);
      setGrupoPolitica("");
    } finally {
      setLoadingIndicadoresPolitica(false);
    }
  }

  async function getIndicadoresPolitica(menu_item: {
    id_menu_item: number;
    nome_menu_item: string;
  }) {
    setGrupoPolitica(menu_item.nome_menu_item);
    setLoadingIndicadoresPolitica(true);

    try {
      const resIndicadores = await api.get(
        `indicadores-novo/menu-item/${menu_item?.id_menu_item}`
      );
      const indicadoresData = resIndicadores.data || [];

      if (indicadoresData.length === 0) {
        setIndicadoresPolitica([]);
        setLoadingIndicadoresPolitica(false);
        return;
      }

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

      setIndicadoresPolitica(indicadoresComTipos);

      if (anoSelectedPolitica && usuario?.id_municipio) {
        await carregarDadosExistentesPolitica(anoSelectedPolitica);
      }
    } catch (error) {
      console.error("Erro ao carregar indicadores:", error);
      toast.error("Erro ao carregar indicadores", {
        position: "top-right",
        autoClose: 7000,
      });
      setIndicadoresPolitica([]);
    } finally {
      setLoadingIndicadoresPolitica(false);
    }
  }

  async function carregarDadosExistentesPolitica(ano: string) {
    if (!usuario?.id_municipio || !ano) return;

    setLoadingDadosPolitica(true);

    try {
      const apiClient = getAPIClient();

      const response = await apiClient.get(
        `/indicadores-municipio/municipio/${usuario.id_municipio}?ano=${ano}`
      );
      const dados = response.data || [];
      setDadosCarregadosPolitica(dados);

      // Preencher formulário com valores existentes
      preencherFormularioPolitica(dados);

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
      setLoadingDadosPolitica(false);
    }
  }

  function preencherFormularioPolitica(dados: any[]) {
    // Resetar todos os valores dos checkboxes antes de preencher
    indicadoresPolitica.forEach((indicador) => {
      const tipoCheckbox = indicador.tiposCampo?.find(
        (tipo) => tipo.type === "checkbox"
      );
      if (tipoCheckbox && tipoCheckbox.checkBoxItems) {
        tipoCheckbox.checkBoxItems.forEach((item) => {
          item.valor = false;
        });
      }
    });

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
      const indicador = indicadoresPolitica.find(
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
                        const fieldName = `${codigoIndicador}_${checkBoxItem.id_item_check_box}_${ano}`;
                        valoresFormulario[fieldName] = true;
                        // Preencher item.valor para defaultChecked funcionar
                        checkBoxItem.valor = true;
                      }
                    });
                  }
                } catch (jsonError) {
                  // Fallback: tratar como valor único
                  const checkBoxItem = tipoCheckbox.checkBoxItems.find(
                    (item) => item.descricao === valor
                  );

                  if (checkBoxItem) {
                    const fieldName = `${codigoIndicador}_${checkBoxItem.id_item_check_box}_${ano}`;
                    valoresFormulario[fieldName] = true;
                    // Preencher item.valor para defaultChecked funcionar
                    checkBoxItem.valor = true;
                  }
                }
              } else {
                // Valor único (não JSON)
                const checkBoxItem = tipoCheckbox.checkBoxItems.find(
                  (item) => item.descricao === valor || item.valor === valor
                );

                if (checkBoxItem) {
                  const fieldName = `${codigoIndicador}_${checkBoxItem.id_item_check_box}_${ano}`;
                  valoresFormulario[fieldName] = true;
                  // Preencher item.valor para defaultChecked funcionar
                  checkBoxItem.valor = true;
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

          // Garantir que itens não selecionados tenham valor false
          tipoCheckbox.checkBoxItems.forEach((item) => {
            if (item.valor === undefined) {
              item.valor = false;
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
    resetIndicadoresPolitica(valoresFormulario);
  }

  function anosSelect() {
    const anoAtual = new Date().getFullYear();
    const anos = [];
    for (let i = anoAtual; i >= 2000; i--) {
      anos.push(i.toString());
    }
    return anos;
  }

  async function selectAnoPolitica(ano: string) {
    setAnoSelectedPolitica(ano);

    if (ano && usuario?.id_municipio) {
      await carregarDadosExistentesPolitica(ano);
    } else {
      setDadosCarregadosPolitica([]);
    }
  }

  async function handleCadastroIndicadoresPolitica(data: any) {
    if (!usuario?.id_municipio) {
      toast.error("Não existe Município, entre novamente no sistema!", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    if (!anoSelectedPolitica) {
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
        const idItemCheckBox = parts[2]; // O id_item_check_box está na posição 2

        if (
          valor === true ||
          valor === "true" ||
          (typeof valor === "string" && valor.length > 0 && valor !== "false")
        ) {
          // Encontrar a descrição do checkbox selecionado
          const indicador = indicadoresPolitica.find(
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
                      .includes(idItemCheckBox.toLowerCase())
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
            ano: parseInt(anoSelectedPolitica),
            valor_indicador: valor,
            id_municipio: usuario.id_municipio,
          });
        }
      }
    });

    // Processar checkboxes agrupados para salvar na tabela indicadores-municipio
    checkBoxAgrupados.forEach((descricoes, codigoIndicador) => {
      const indicador = indicadoresPolitica.find(
        (ind) => ind.codigo_indicador === codigoIndicador
      );
      if (indicador) {
        // Salvar array JSON com descrições na tabela indicadores-municipio
        valoresIndicadores.push({
          codigo_indicador: codigoIndicador,
          ano: parseInt(anoSelectedPolitica),
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

    const apiClient = getAPIClient();

    try {
      const existingDataResponse = await apiClient.get(
        `/indicadores-municipio/municipio/${usuario.id_municipio}?ano=${anoSelectedPolitica}`
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

      // Recarregar dados após salvar
      await carregarDadosExistentesPolitica(anoSelectedPolitica);
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

      // Recarregar dados após salvar
      await carregarDadosExistentesPolitica(anoSelectedPolitica);
    }
  }

  // Funções para buscar indicadores de Plano Municipal
  async function getMenuItemsPlano() {
    try {
      setLoadingIndicadoresPlano(true);

      // Buscar menus do módulo 1 (Gestão) - o retorno já vem com menuItems incluídos
      const resModulo = await api.get(`menus/modulo/1`);
      const menusModulo = Array.isArray(resModulo.data) ? resModulo.data : [];

      // Procurar o menu "Plano Municipal" 
      const menuPlano = menusModulo.find(
        (menu) => {
          const tituloLower = menu.titulo?.toLowerCase() || "";
          return (
            tituloLower.includes("plano municipal") ||
            tituloLower.includes("plano de saneamento")
          );
        }
      );

      if (!menuPlano) {
        setMenuItemsPlano([]);
        setIndicadoresPlano([]);
        setGrupoPlano("");
        return;
      }

      // Verificar se o menu já tem menuItems incluídos
      let itensPlano = [];

      if (menuPlano.menuItems && Array.isArray(menuPlano.menuItems) && menuPlano.menuItems.length > 0) {
        // Usar todos os menuItems que já vêm no retorno
        itensPlano = menuPlano.menuItems;
      } else if (menuPlano.id_menu) {
        // Se não tem menuItems no retorno, buscar separadamente (fallback)
        try {
          const resMenuItems = await api.get(`menu-items/menu/${menuPlano.id_menu}`);
          itensPlano = Array.isArray(resMenuItems.data) ? resMenuItems.data : [];
        } catch (e) {
          console.error("Erro ao buscar menuItems:", e);
        }
      }

      setMenuItemsPlano(itensPlano);

      // Se houver itens, carregar os indicadores do primeiro item
      if (itensPlano.length > 0) {
        await getIndicadoresPlano(itensPlano[0]);
      } else {
        setIndicadoresPlano([]);
        setGrupoPlano("");
      }
    } catch (error) {
      console.error("Erro ao carregar menu items de Plano:", error);
      toast.error("Erro ao carregar indicadores de Plano", {
        position: "top-right",
        autoClose: 5000,
      });
      setMenuItemsPlano([]);
      setIndicadoresPlano([]);
      setGrupoPlano("");
    } finally {
      setLoadingIndicadoresPlano(false);
    }
  }

  async function getIndicadoresPlano(menu_item: {
    id_menu_item: number;
    nome_menu_item: string;
  }) {
    setGrupoPlano(menu_item.nome_menu_item);
    setLoadingIndicadoresPlano(true);

    try {
      const resIndicadores = await api.get(
        `indicadores-novo/menu-item/${menu_item?.id_menu_item}`
      );
      const indicadoresData = resIndicadores.data || [];

      if (indicadoresData.length === 0) {
        setIndicadoresPlano([]);
        setLoadingIndicadoresPlano(false);
        return;
      }

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

      setIndicadoresPlano(indicadoresComTipos);

      if (anoSelectedPlano && usuario?.id_municipio) {
        await carregarDadosExistentesPlano(anoSelectedPlano);
      }
    } catch (error) {
      console.error("Erro ao carregar indicadores:", error);
      toast.error("Erro ao carregar indicadores", {
        position: "top-right",
        autoClose: 7000,
      });
      setIndicadoresPlano([]);
    } finally {
      setLoadingIndicadoresPlano(false);
    }
  }

  async function carregarDadosExistentesPlano(ano: string) {
    if (!usuario?.id_municipio || !ano) return;

    setLoadingDadosPlano(true);

    try {
      const apiClient = getAPIClient();

      const response = await apiClient.get(
        `/indicadores-municipio/municipio/${usuario.id_municipio}?ano=${ano}`
      );
      const dados = response.data || [];
      setDadosCarregadosPlano(dados);

      // Preencher formulário com valores existentes
      preencherFormularioPlano(dados);

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
      setLoadingDadosPlano(false);
    }
  }

  function preencherFormularioPlano(dados: any[]) {
    // Resetar todos os valores dos checkboxes antes de preencher
    indicadoresPlano.forEach((indicador) => {
      const tipoCheckbox = indicador.tiposCampo?.find(
        (tipo) => tipo.type === "checkbox"
      );
      if (tipoCheckbox && tipoCheckbox.checkBoxItems) {
        tipoCheckbox.checkBoxItems.forEach((item) => {
          item.valor = false;
        });
      }
    });

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
      const indicador = indicadoresPlano.find(
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
                        const fieldName = `${codigoIndicador}_${checkBoxItem.id_item_check_box}_${ano}`;
                        valoresFormulario[fieldName] = true;
                        // Preencher item.valor para defaultChecked funcionar
                        checkBoxItem.valor = true;
                      }
                    });
                  }
                } catch (jsonError) {
                  // Fallback: tratar como valor único
                  const checkBoxItem = tipoCheckbox.checkBoxItems.find(
                    (item) => item.descricao === valor
                  );

                  if (checkBoxItem) {
                    const fieldName = `${codigoIndicador}_${checkBoxItem.id_item_check_box}_${ano}`;
                    valoresFormulario[fieldName] = true;
                    // Preencher item.valor para defaultChecked funcionar
                    checkBoxItem.valor = true;
                  }
                }
              } else {
                // Valor único (não JSON)
                const checkBoxItem = tipoCheckbox.checkBoxItems.find(
                  (item) => item.descricao === valor || item.valor === valor
                );

                if (checkBoxItem) {
                  const fieldName = `${codigoIndicador}_${checkBoxItem.id_item_check_box}_${ano}`;
                  valoresFormulario[fieldName] = true;
                  // Preencher item.valor para defaultChecked funcionar
                  checkBoxItem.valor = true;
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

          // Garantir que itens não selecionados tenham valor false
          tipoCheckbox.checkBoxItems.forEach((item) => {
            if (item.valor === undefined) {
              item.valor = false;
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
    resetIndicadoresPlano(valoresFormulario);
  }

  async function selectAnoPlano(ano: string) {
    setAnoSelectedPlano(ano);

    if (ano && usuario?.id_municipio) {
      await carregarDadosExistentesPlano(ano);
    } else {
      setDadosCarregadosPlano([]);
    }
  }

  async function handleCadastroIndicadoresPlano(data: any) {
    if (!usuario?.id_municipio) {
      toast.error("Não existe Município, entre novamente no sistema!", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    if (!anoSelectedPlano) {
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
        const idItemCheckBox = parts[2]; // O id_item_check_box está na posição 2

        if (
          valor === true ||
          valor === "true" ||
          (typeof valor === "string" && valor.length > 0 && valor !== "false")
        ) {
          // Encontrar a descrição do checkbox selecionado
          const indicador = indicadoresPlano.find(
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
                      .includes(idItemCheckBox.toLowerCase())
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
            ano: parseInt(anoSelectedPlano),
            valor_indicador: valor,
            id_municipio: usuario.id_municipio,
          });
        }
      }
    });

    // Processar checkboxes agrupados para salvar na tabela indicadores-municipio
    checkBoxAgrupados.forEach((descricoes, codigoIndicador) => {
      const indicador = indicadoresPlano.find(
        (ind) => ind.codigo_indicador === codigoIndicador
      );
      if (indicador) {
        // Salvar array JSON com descrições na tabela indicadores-municipio
        valoresIndicadores.push({
          codigo_indicador: codigoIndicador,
          ano: parseInt(anoSelectedPlano),
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

    const apiClient = getAPIClient();

    try {
      const existingDataResponse = await apiClient.get(
        `/indicadores-municipio/municipio/${usuario.id_municipio}?ano=${anoSelectedPlano}`
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
      } else {
        for (const valorIndicador of valoresIndicadores) {
          try {
            await apiClient.post("/indicadores-municipio", valorIndicador);
          } catch (saveError) {
            console.error("Erro ao salvar valor:", valorIndicador, saveError);
            throw saveError;
          }
        }
      }

      toast.success("Dados salvos com sucesso!", {
        position: "top-right",
        autoClose: 5000,
      });

      // Recarregar dados após salvar
      await carregarDadosExistentesPlano(anoSelectedPlano);
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      toast.error("Erro ao salvar dados!", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }

  // Funções para buscar indicadores de Conselho Municipal
  async function getMenuItemsConselho() {
    try {
      setLoadingIndicadoresConselho(true);

      // Buscar menus do módulo 1 (Gestão) - o retorno já vem com menuItems incluídos
      const resModulo = await api.get(`menus/modulo/1`);
      const menusModulo = Array.isArray(resModulo.data) ? resModulo.data : [];

      // Procurar o menu "Conselho Municipal" 
      const menuConselho = menusModulo.find(
        (menu) => {
          const tituloLower = menu.titulo?.toLowerCase() || "";
          return (
            tituloLower.includes("conselho municipal") ||
            tituloLower.includes("conselho de saneamento")
          );
        }
      );

      if (!menuConselho) {
        setMenuItemsConselho([]);
        setIndicadoresConselho([]);
        setGrupoConselho("");
        return;
      }

      // Verificar se o menu já tem menuItems incluídos
      let itensConselho = [];

      if (menuConselho.menuItems && Array.isArray(menuConselho.menuItems) && menuConselho.menuItems.length > 0) {
        // Usar todos os menuItems que já vêm no retorno
        itensConselho = menuConselho.menuItems;
      } else if (menuConselho.id_menu) {
        // Se não tem menuItems no retorno, buscar separadamente (fallback)
        try {
          const resMenuItems = await api.get(`menu-items/menu/${menuConselho.id_menu}`);
          itensConselho = Array.isArray(resMenuItems.data) ? resMenuItems.data : [];
        } catch (e) {
          console.error("Erro ao buscar menuItems:", e);
        }
      }

      setMenuItemsConselho(itensConselho);

      // Se houver itens, carregar os indicadores do primeiro item
      if (itensConselho.length > 0) {
        await getIndicadoresConselho(itensConselho[0]);
      } else {
        setIndicadoresConselho([]);
        setGrupoConselho("");
      }
    } catch (error) {
      console.error("Erro ao carregar menu items de Conselho:", error);
      toast.error("Erro ao carregar indicadores de Conselho", {
        position: "top-right",
        autoClose: 5000,
      });
      setMenuItemsConselho([]);
      setIndicadoresConselho([]);
      setGrupoConselho("");
    } finally {
      setLoadingIndicadoresConselho(false);
    }
  }

  async function getIndicadoresConselho(menu_item: {
    id_menu_item: number;
    nome_menu_item: string;
  }) {
    setGrupoConselho(menu_item.nome_menu_item);
    setLoadingIndicadoresConselho(true);

    try {
      const resIndicadores = await api.get(
        `indicadores-novo/menu-item/${menu_item?.id_menu_item}`
      );
      const indicadoresData = resIndicadores.data || [];

      if (indicadoresData.length === 0) {
        setIndicadoresConselho([]);
        setLoadingIndicadoresConselho(false);
        return;
      }

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

      setIndicadoresConselho(indicadoresComTipos);

      if (anoSelectedConselho && usuario?.id_municipio) {
        await carregarDadosExistentesConselho(anoSelectedConselho);
      }
    } catch (error) {
      console.error("Erro ao carregar indicadores:", error);
      toast.error("Erro ao carregar indicadores", {
        position: "top-right",
        autoClose: 7000,
      });
      setIndicadoresConselho([]);
    } finally {
      setLoadingIndicadoresConselho(false);
    }
  }

  async function carregarDadosExistentesConselho(ano: string) {
    if (!usuario?.id_municipio || !ano) return;

    setLoadingDadosConselho(true);

    try {
      const apiClient = getAPIClient();

      const response = await apiClient.get(
        `/indicadores-municipio/municipio/${usuario.id_municipio}?ano=${ano}`
      );
      const dados = response.data || [];
      setDadosCarregadosConselho(dados);

      // Preencher formulário com valores existentes
      preencherFormularioConselho(dados);

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
      setLoadingDadosConselho(false);
    }
  }

  function preencherFormularioConselho(dados: any[]) {
    // Resetar todos os valores dos checkboxes antes de preencher
    indicadoresConselho.forEach((indicador) => {
      const tipoCheckbox = indicador.tiposCampo?.find(
        (tipo) => tipo.type === "checkbox"
      );
      if (tipoCheckbox && tipoCheckbox.checkBoxItems) {
        tipoCheckbox.checkBoxItems.forEach((item) => {
          item.valor = false;
        });
      }
    });

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
      const indicador = indicadoresConselho.find(
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
                        const fieldName = `${codigoIndicador}_${checkBoxItem.id_item_check_box}_${ano}`;
                        valoresFormulario[fieldName] = true;
                        // Preencher item.valor para defaultChecked funcionar
                        checkBoxItem.valor = true;
                      }
                    });
                  }
                } catch (jsonError) {
                  // Fallback: tratar como valor único
                  const checkBoxItem = tipoCheckbox.checkBoxItems.find(
                    (item) => item.descricao === valor
                  );

                  if (checkBoxItem) {
                    const fieldName = `${codigoIndicador}_${checkBoxItem.id_item_check_box}_${ano}`;
                    valoresFormulario[fieldName] = true;
                    // Preencher item.valor para defaultChecked funcionar
                    checkBoxItem.valor = true;
                  }
                }
              } else {
                // Valor único (não JSON)
                const checkBoxItem = tipoCheckbox.checkBoxItems.find(
                  (item) => item.descricao === valor || item.valor === valor
                );

                if (checkBoxItem) {
                  const fieldName = `${codigoIndicador}_${checkBoxItem.id_item_check_box}_${ano}`;
                  valoresFormulario[fieldName] = true;
                  // Preencher item.valor para defaultChecked funcionar
                  checkBoxItem.valor = true;
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

          // Garantir que itens não selecionados tenham valor false
          tipoCheckbox.checkBoxItems.forEach((item) => {
            if (item.valor === undefined) {
              item.valor = false;
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
    resetIndicadoresConselho(valoresFormulario);
  }

  async function selectAnoConselho(ano: string) {
    setAnoSelectedConselho(ano);

    if (ano && usuario?.id_municipio) {
      await carregarDadosExistentesConselho(ano);
    } else {
      setDadosCarregadosConselho([]);
    }
  }

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
                        const fieldName = `${codigoIndicador}_${checkBoxItem.id_item_check_box}_${ano}`;
                        valoresFormulario[fieldName] = true;
                        // Preencher item.valor para defaultChecked funcionar
                        checkBoxItem.valor = true;
                      }
                    });
                  }
                } catch (jsonError) {
                  // Fallback: tratar como valor único
                  const checkBoxItem = tipoCheckbox.checkBoxItems.find(
                    (item) => item.descricao === valor
                  );

                  if (checkBoxItem) {
                    const fieldName = `${codigoIndicador}_${checkBoxItem.id_item_check_box}_${ano}`;
                    valoresFormulario[fieldName] = true;
                    // Preencher item.valor para defaultChecked funcionar
                    checkBoxItem.valor = true;
                  }
                }
              } else {
                // Valor único (não JSON)
                const checkBoxItem = tipoCheckbox.checkBoxItems.find(
                  (item) => item.descricao === valor || item.valor === valor
                );

                if (checkBoxItem) {
                  const fieldName = `${codigoIndicador}_${checkBoxItem.id_item_check_box}_${ano}`;
                  valoresFormulario[fieldName] = true;
                  // Preencher item.valor para defaultChecked funcionar
                  checkBoxItem.valor = true;
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

          // Garantir que itens não selecionados tenham valor false
          tipoCheckbox.checkBoxItems.forEach((item) => {
            if (item.valor === undefined) {
              item.valor = false;
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
    resetIndicadores(valoresFormulario);
  }

  async function handleCadastroIndicadores(data: any) {
    if (!usuario?.id_municipio) {
      toast.error("Não existe Município, entre novamente no sistema!", {
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
    const valoresIndicadores: { codigo_indicador: string; ano: number; valor_indicador: string; id_municipio: number }[] = [];
    const checkBoxAgrupados = new Map<string, string[]>();

    Object.keys(data).forEach((key) => {
      const valor = data[key];
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
          const indicador = indicadores.find(
            (ind) => ind.codigo_indicador === codigoIndicador
          );
          if (indicador) {
            const tipoCheckbox = indicador.tiposCampo?.find(
              (tipo) => tipo.type === "checkbox"
            );
            if (tipoCheckbox?.checkBoxItems) {
              let checkBoxItem = tipoCheckbox.checkBoxItems.find(
                (item) => item.id_item_check_box === idItemCheckBox
              );
              if (!checkBoxItem) {
                checkBoxItem = tipoCheckbox.checkBoxItems.find(
                  (item) =>
                    String(item.id_item_check_box) === String(idItemCheckBox) ||
                    item.descricao?.toLowerCase().includes(String(idItemCheckBox).toLowerCase())
                );
              }
              if (checkBoxItem) {
                if (!checkBoxAgrupados.has(codigoIndicador)) {
                  checkBoxAgrupados.set(codigoIndicador, []);
                }
                checkBoxAgrupados.get(codigoIndicador)!.push(checkBoxItem.descricao);
              }
            }
          }
        }
      } else {
        if (valor !== null && valor !== undefined && valor !== "") {
          const parts = key.split("_");
          const codigoIndicador = parts[0];
          valoresIndicadores.push({
            codigo_indicador: codigoIndicador,
            ano: parseInt(anoSelected),
            valor_indicador: String(valor),
            id_municipio: Number(usuario.id_municipio),
          });
        }
      }
    });

    checkBoxAgrupados.forEach((descricoes, codigoIndicador) => {
      const indicador = indicadores.find(
        (ind) => ind.codigo_indicador === codigoIndicador
      );
      if (indicador) {
        valoresIndicadores.push({
          codigo_indicador: codigoIndicador,
          ano: parseInt(anoSelected),
          valor_indicador: JSON.stringify(descricoes),
          id_municipio: Number(usuario.id_municipio) as number,
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
        const existingDataMap = new Map<string, { id_incicador_municipio: number }>();
        existingData.forEach((record: any) => {
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
      await carregarDadosExistentes(anoSelected);
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
      await carregarDadosExistentes(anoSelected);
    }
  }

  async function handleCadastroIndicadoresConselho(data: any) {
    if (!usuario?.id_municipio) {
      toast.error("Não existe Município, entre novamente no sistema!", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    if (!anoSelectedConselho) {
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
        const idItemCheckBox = parts[2]; // O id_item_check_box está na posição 2

        if (
          valor === true ||
          valor === "true" ||
          (typeof valor === "string" && valor.length > 0 && valor !== "false")
        ) {
          // Encontrar a descrição do checkbox selecionado
          const indicador = indicadoresConselho.find(
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
                      .includes(idItemCheckBox.toLowerCase())
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
            ano: parseInt(anoSelectedConselho),
            valor_indicador: valor,
            id_municipio: usuario.id_municipio,
          });
        }
      }
    });

    // Processar checkboxes agrupados para salvar na tabela indicadores-municipio
    checkBoxAgrupados.forEach((descricoes, codigoIndicador) => {
      const indicador = indicadoresConselho.find(
        (ind) => ind.codigo_indicador === codigoIndicador
      );
      if (indicador) {
        // Salvar array JSON com descrições na tabela indicadores-municipio
        valoresIndicadores.push({
          codigo_indicador: codigoIndicador,
          ano: parseInt(anoSelectedConselho),
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

    const apiClient = getAPIClient();

    try {
      const existingDataResponse = await apiClient.get(
        `/indicadores-municipio/municipio/${usuario.id_municipio}?ano=${anoSelectedConselho}`
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
      } else {
        for (const valorIndicador of valoresIndicadores) {
          try {
            await apiClient.post("/indicadores-municipio", valorIndicador);
          } catch (saveError) {
            console.error("Erro ao salvar valor:", valorIndicador, saveError);
            throw saveError;
          }
        }
      }

      toast.success("Dados salvos com sucesso!", {
        position: "top-right",
        autoClose: 5000,
      });

      // Recarregar dados após salvar
      await carregarDadosExistentesConselho(anoSelectedConselho);
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      toast.error("Erro ao salvar dados!", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }

  // ------------- Funcoes ADD -------------

  async function handleAddPresidente(data) {
    if (!usuario.id_municipio) {
      toast.error("Não existe Município, entre novamente no sistema! ", {
        position: "top-right",
        autoClose: 5000,
      });
      signOut();
    }

    const id = await api
      .post("create-presidencia-conselho-municipal", {
        nome_presidente: data.nome_presidente,
        setor_responsavel: data.setor_responsavel,
        telefone_presidente: data.telefone_presidente,
        email_presidente: data.email_presidente,
        integrantes: data.integrantes,
        id_municipio: usuario.id_municipio,
        id_conselho_municipal_saneamento_basico:
          data.id_conselho_municipal_saneamento_basico || null,
      })
      .then((response) => {
        toast.success(
          "Presidência do Conselho Municipal adicionada com sucesso",
          {
            position: "top-right",
            autoClose: 7000,
          }
        );
        setShowModalPresidente(false);
        reset();
        return response;
      })
      .catch((error) => {
        toast.error("Erro ao adicionar a Presidência do Conselho Municipal", {
          position: "top-right",
          autoClose: 5000,
        });
      });
    getPresidentesConselho();
  }
  async function handleAddGestaoAssociada(data) {
    if (usuario?.id_permissao === 4) return;

    const formData = new FormData();
    formData.append("id_municipio", usuario.id_municipio);
    formData.append("nome_associacao", data.nome_associacao || "");
    formData.append("norma_associacao", data.norma_associacao || "");

    await api
      .post("addGestaoIndicadores", formData)
      .then(() => {
        toast.success("Gestão Associada cadastrada com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
        resetGestao();
        getGestao();
        getRepresentantes();
      })
      .catch(() => {
        toast.error("Erro ao cadastrar Gestão Associada!", {
          position: "top-right",
          autoClose: 5000,
        });
      });
  }
  async function handleAddConselhoMunicipal(data) {
    if (!usuario.id_municipio) {
      toast.error("Não existe Município, entre novamente no sistema!", {
        position: "top-right",
        autoClose: 5000,
      });
      signOut();
      return;
    }

    const formData = new FormData();
    formData.append("titulo", data.conselho_titulo || "");
    formData.append("ano", data.conselho_ano || "");
    formData.append("id_municipio", usuario.id_municipio);
    formData.append("situacao", conselhoSituacao || "operante");
    if (data.conselho_arquivo && data.conselho_arquivo.length > 0 && data.conselho_arquivo[0]) {
      formData.append("arquivo", data.conselho_arquivo[0]);
    }

    await api
      .post("create-conselho-municipal", formData)
      .then(() => {
        toast.success("Conselho Municipal cadastrado com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
        getConselhoMunicipal();
        // Reset dos campos do conselho
        setValueConselho("conselho_titulo", "");
        setValueConselho("conselho_ano", "");
        setValueConselho("conselho_arquivo", null);
        if (resetConselho) {
          resetConselho();
        }
      })
      .catch((error) => {
        console.error("Erro ao cadastrar conselho:", error);
        const errorMessage = error.response?.data?.message || "Erro ao cadastrar o Conselho Municipal!";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
        });
      });
  }
  async function handleAddPolitica(data) {
    if (usuario?.id_permissao === 4) return;

    const formData = new FormData();
    formData.append("id_municipio", usuario.id_municipio);
    formData.append("politica_titulo", data.politica_titulo || "");
    formData.append("politica_ano", data.politica_ano || "");
    if (data.politica_arquivo && data.politica_arquivo.length > 0 && data.politica_arquivo[0]) {
      formData.append("politica_arquivo", data.politica_arquivo[0]);
    }

    const apiClient = getAPIClient();
    try {
      const response = await apiClient.post("addGestaoIndicadores", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.success) {
        toast.success(
          response.data.message || "Política Municipal de Saneamento cadastrada com sucesso!",
          {
            position: "top-right",
            autoClose: 7000,
          }
        );
        resetPolitica();
        setTimeout(() => {
          getPoliticas();
        }, 500);
      } else {
        toast.success("Política Municipal de Saneamento cadastrada com sucesso!", {
          position: "top-right",
          autoClose: 7000,
        });
        resetPolitica();
        setTimeout(() => {
          getPoliticas();
        }, 500);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Erro ao cadastrar Política Municipal de Saneamento!";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }

  async function handleAddRepresentante(data) {
    if (!usuario.id_municipio) {
      toast.error("Não existe Município, entre novamente no sistema! ", {
        position: "top-right",
        autoClose: 5000,
      });
      signOut();
    }

    const id = await api
      .post("addRepresentanteServicos", {
        ga_cargo: data.ga_cargo,
        ga_email: data.ga_email,
        ga_nome_representante: data.ga_nome_representante,
        ga_telefone: data.ga_telefone,
        id_municipio: usuario.id_municipio,
      })
      .then((response) => {
        toast.success("Representante cadastrado com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
        setShowModal(false);
        return response;
      })
      .catch((error) => {
        toast.error("Não foi possivel cadastrar o representante! ", {
          position: "top-right",
          autoClose: 5000,
        });
      });
    getRepresentantes();
  }
  async function handleAddPlano(data) {
    if (usuario?.id_permissao === 4) return;

    const formData = new FormData();
    formData.append("id_municipio", usuario.id_municipio);
    formData.append("plano_titulo", data.plano_titulo || "");
    formData.append("plano_ano", data.plano_ano || "");
    if (data.plano_arquivo && data.plano_arquivo.length > 0 && data.plano_arquivo[0]) {
      formData.append("plano_arquivo", data.plano_arquivo[0]);
    }

    await api
      .post("addGestaoIndicadores", formData)
      .then(() => {
        toast.success("Plano Municipal de Saneamento cadastrada com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
        resetPlano();
        getPlanos();
      })
      .catch(() => {
        toast.error("Erro ao cadastrar Plano Municipal de Saneamento!", {
          position: "top-right",
          autoClose: 5000,
        });
      });
  }
  async function handleAddParticipacao(data) {
    if (usuario?.id_permissao === 4) return;

    const formData = new FormData();
    formData.append("id_municipio", usuario.id_municipio);
    formData.append("pcs_titulo", data.pcs_titulo || "");
    formData.append("pcs_ano", data.pcs_ano || "");
    if (data.pcs_arquivo && data.pcs_arquivo.length > 0 && data.pcs_arquivo[0]) {
      formData.append("pcs_arquivo", data.pcs_arquivo[0]);
    }

    await api
      .post("addGestaoIndicadores", formData)
      .then(() => {
        toast.success(
          "Participação e Controle Social de Saneamento cadastrado com sucesso!",
          {
            position: "top-right",
            autoClose: 7000,
          }
        );
        resetParticipacao();
        getParticipacoes();
      })
      .catch(() => {
        toast.error("Erro ao cadastrar Participação e Controle Social!", {
          position: "top-right",
          autoClose: 5000,
        });
      });
  }
  async function handleAddSaneamentoRural(data) {
    if (usuario?.id_permissao === 4) return;

    const formData = new FormData();

    formData.append("sr_descricao", data.sr_descricao || "");
    formData.append("id_municipio", usuario.id_municipio);

    await api
      .post("addGestaoIndicadores", formData)
      .then(() => {
        toast.success("Descrição Saneamento Rural cadastrada com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
        resetSR();
        // getSR();
      })
      .catch(() => {
        toast.error("Erro ao cadastrar Descrição Saneamento Rural!", {
          position: "top-right",
          autoClose: 5000,
        });
      });
  }
  async function handleAddComunidadesTradicionais(data) {
    if (usuario?.id_permissao === 4) return;

    const formData = new FormData();

    formData.append("ct_nomes_comunidades", data.ct_nomes_comunidades || "");
    formData.append("ct_descricao", data.ct_descricao || "");
    formData.append("id_municipio", usuario.id_municipio);

    await api
      .post("addGestaoIndicadores", formData)
      .then(() => {
        toast.success("Comunidades Tradicionais cadastrada com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
        resetCT();
        // getCT();
      })
      .catch(() => {
        toast.error("Erro ao cadastrar Comunidades Tradicionais!", {
          position: "top-right",
          autoClose: 5000,
        });
      });
  }

  // ------------- Funções DELETE -------------

  async function handleRemoverPresidente({ id }) {
    try {
      await api.delete(`delete-presidencia-conselho-municipal/${id}`);
      toast.success("Presidente removido com sucesso!", {
        position: "top-right",
        autoClose: 5000,
      });
      getPresidentesConselho();
    } catch (error) {
      toast.error("Não foi possível remover o presidente!", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }
  async function handleRemoverParticipacao({ id, id_arquivo }) {
    await api
      .delete("remover-participacao", {
        params: { id: id, id_arquivo: id_arquivo },
      })
      .then((response) => {
        toast.success("Participacão removido com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
      })
      .catch((error) => {
        toast.error("Não foi possivel remover a participação! ", {
          position: "top-right",
          autoClose: 5000,
        });
      });
    getParticipacoes();
  }
  async function handleRemoverPolitica({ id, id_arquivo }) {
    await api
      .delete("remover-politica", {
        params: { id: id, id_arquivo: id_arquivo },
      })
      .then((response) => {
        toast.success("Política removida com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
      })
      .catch((error) => {
        toast.error("Não foi possivel remover a politica municipal! ", {
          position: "top-right",
          autoClose: 5000,
        });
      });
    getPoliticas();
  }
  async function handleRemoverPlano({ id, id_arquivo }) {
    await api
      .delete("remover-plano", {
        params: { id: id, id_arquivo: id_arquivo },
      })
      .then((response) => {
        toast.success("Plano removido com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
      })
      .catch((error) => {
        toast.error("Não foi possivel remover o plano municipal! ", {
          position: "top-right",
          autoClose: 5000,
        });
      });
    getPlanos();
  }
  async function handleRemoverRepresentante({ id }) {
    await api
      .delete("remover-representante", {
        params: { id: id },
      })
      .then((response) => {
        toast.success("Representante removido com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
      })
      .catch((error) => {
        toast.error("Não foi possivel remover o representante!", {
          position: "top-right",
          autoClose: 5000,
        });
      });
    getRepresentantes();
  }
  async function handleRemoverConselho({ id }) {
    await api
      .delete(`delete-conselho-municipal/${id}`)
      .then((response) => {
        toast.success("Conselho Municipal removido com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
      })
      .catch((error) => {
        toast.error("Não foi possivel remover o conselho municipal! ", {
          position: "top-right",
          autoClose: 5000,
        });
      });
    getConselhoMunicipal();
  }

  // ------------- Funções UPDATE -------------

  // ------------------------------------------

  async function handleSignOut() {
    signOut();
  }

  function handleShowModalPresidente() {
    setShowModalPresidente(true);
  }
  function handleCloseModalPresidente() {
    setShowModalPresidente(false);
    reset();
  }
  function handleOnChange(content) {
    setContent(content);
  }
  async function handleCadastro(data) {
    if (usuario?.id_permissao === 4) {
      return;
    }

    // Se estiver no formulário de conselho e houver dados para salvar, chama handleAddConselhoMunicipal
    if (activeForm === "conselhoSaneamento" && conselhoSituacao !== "nao_tem") {
      if (data.conselho_titulo && data.conselho_ano) {
        // Prepara os dados no formato esperado por handleAddConselhoMunicipal
        const conselhoData = {
          titulo: data.conselho_titulo,
          ano: data.conselho_ano,
          arquivo: data.conselho_arquivo && data.conselho_arquivo.length > 0 ? data.conselho_arquivo : [],
        };
        await handleAddConselhoMunicipal(conselhoData);
        return; // Retorna para não executar o resto da função
      }
    }

    const formData = new FormData();

    formData.append("id_municipio", usuario.id_municipio);
    formData.append(
      "id_gestao_associada",
      dadosGestao?.id_gestao_associada ? dadosGestao?.id_gestao_associada : ""
    );
    formData.append(
      "id_saneamento_rural",
      dadosGestao?.id_saneamento_rural ? dadosGestao?.id_saneamento_rural : ""
    );
    formData.append(
      "id_comunidades_tradicionais",
      dadosGestao?.id_comunidades_tradicionais
        ? dadosGestao?.id_comunidades_tradicionais
        : ""
    );

    if (listPoliticas && listPoliticas.length > 0) {
      formData.append(
        "id_politica_municipal",
        listPoliticas[0].id_politica_municipal
      );
    }

    if (listPlanos && listPlanos.length > 0) {
      formData.append("id_plano_municipal", listPlanos[0].id_plano_municipal);
    }

    formData.append(
      "nome_associacao",
      data.nome_associacao ? data.nome_associacao : dadosGestao?.ga_nome
    );
    formData.append(
      "norma_associacao",
      data.norma_associacao ? data.norma_associacao : dadosGestao?.ga_norma
    );

    formData.append("pcs_ano", data.pcs_ano || "");
    if (data.pcs_arquivo && data.pcs_arquivo.length > 0 && data.pcs_arquivo[0]) {
      formData.append("pcs_arquivo", data.pcs_arquivo[0]);
    }
    formData.append("pcs_titulo", data.pcs_titulo || "");

    if (planoSituacao !== "nao_tem") {
      formData.append("plano_ano", data.plano_ano || "");
      if (data.plano_arquivo && data.plano_arquivo.length > 0 && data.plano_arquivo[0]) {
        formData.append("plano_arquivo", data.plano_arquivo[0]);
      }
      formData.append("plano_titulo", data.plano_titulo || "");
    }

    formData.append("plano_situacao", planoSituacao);
    formData.append("plano_ano", data.plano_ano || "");
    if (data.plano_arquivo && data.plano_arquivo.length > 0 && data.plano_arquivo[0]) {
      formData.append("plano_arquivo", data.plano_arquivo[0]);
    }
    formData.append("plano_titulo", data.plano_titulo || "");

    if (politicaSituacao !== "nao_tem") {
      formData.append("politica_ano", data.politica_ano || "");
      if (data.politica_arquivo && data.politica_arquivo.length > 0 && data.politica_arquivo[0]) {
        formData.append("politica_arquivo", data.politica_arquivo[0]);
      }
      formData.append("politica_titulo", data.politica_titulo || "");
    }

    formData.append("politica_situacao", politicaSituacao);
    if (conselhoSituacao !== "nao_tem") {
      formData.append("conselho_titulo", data.conselho_titulo || "");
      formData.append("conselho_ano", data.conselho_ano || "");
      if (data.conselho_arquivo && data.conselho_arquivo.length > 0 && data.conselho_arquivo[0]) {
        formData.append("conselho_arquivo", data.conselho_arquivo[0]);
      }
    }
    formData.append("conselho_situacao", conselhoSituacao);

    formData.append("politica_ano", data.politica_ano);
    if (data.politica_arquivo && data.politica_arquivo.length > 0 && data.politica_arquivo[0]) {
      formData.append("politica_arquivo", data.politica_arquivo[0]);
    }
    formData.append("politica_titulo", data.politica_titulo);

    formData.append(
      "sr_descricao",
      data.sr_descricao ? data.sr_descricao : dadosGestao?.sr_descricao
    );
    formData.append(
      "ct_nomes_comunidades",
      data.ct_nomes_comunidades
        ? data.ct_nomes_comunidades
        : dadosGestao?.nomes_comunidades_beneficiadas
    );
    formData.append(
      "ct_descricao",
      data.ct_descricao ? data.ct_descricao : dadosGestao?.ct_descricao
    );

    const apiClient = getAPIClient();
    try {
      const resCad = await apiClient.post("addGestaoIndicadores", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (resCad.data && resCad.data.success) {
        toast.success(resCad.data.message || "Dados salvos com sucesso!", {
          position: "top-right",
          autoClose: 7000,
        });
        await getGestao();
        getPoliticas();
        getPlanos();
        getParticipacoes();
        getRepresentantes();
      } else {
        toast.success("Dados salvos com sucesso!", {
          position: "top-right",
          autoClose: 7000,
        });
        await getGestao();
        getPoliticas();
        getPlanos();
        getParticipacoes();
        getRepresentantes();
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Não foi possível salvar os dados! ", {
        position: "top-right",
        autoClose: 5000,
      });
    }

    const resParticipacao = await apiClient.get(
      "getParticipacaoControleSocial",
      {
        params: { id_municipio: usuario?.id_municipio },
      }
    );
    const participacoes = await resParticipacao.data;
    setListParticipacoes(participacoes);
  }

  function handleShowModal() {
    setShowModal(true);
  }
  function handleCloseModal() {
    setShowModal(false);
    setShowModalPolitica(false);
  }

  async function updateRepresentantesServicos(data) {
    if (!usuario.id_municipio || !data.id_representante_servicos_ga) {
      toast.error("Dados insuficientes para atualizar!", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    await api
      .put("updateRepresentanteServicos", {
        id_representante_servicos_ga: data.id_representante_servicos_ga,
        ga_nome_representante: data.ga_nome_representante,
        ga_cargo: data.ga_cargo,
        ga_telefone: data.ga_telefone,
        ga_email: data.ga_email,
        id_municipio: usuario.id_municipio,
      })
      .then((response) => {
        toast.success("Representante atualizado com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
        getRepresentantes();
        setShowModal(false);
        setUpdateRepresentantes(null);
      })
      .catch((error) => {
        toast.error("Não foi possível atualizar o representante!", {
          position: "top-right",
          autoClose: 5000,
        });
        console.log(error);
      });
  }

  async function updatePoliticaMunicipal(data: IPoliticas) {

    if (!usuario.id_municipio || !data.id_politica_municipal) {
      toast.error("Dados insuficientes para atualizar!", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    await api
      .put("updatePoliticaMunicipal", {
        id_politica_municipal: data.id_politica_municipal,
        politica_titulo: data?.titulo,
        politica_ano: data?.ano,
        id_municipio: usuario.id_municipio,
      })
      .then((response) => {
        toast.success("Politica Municipal atualizada com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
        getPoliticas();
        setShowModalPolitica(false);
        setUpdatePolitica(null);
      })
      .catch((error) => {
        toast.error("Não foi possível atualizar a política municipal!", {
          position: "top-right",
          autoClose: 5000,
        });
      });
  }

  async function handleEditarRepresentante(representante) {
    setUpdateRepresentantes(representante);
    setShowModal(true);

    // Preenche os campos do formulário com os dados do representante
    setValue(
      "id_representante_servicos_ga",
      representante.id_representante_servicos_ga
    );
    setValue("ga_nome_representante", representante.nome);
    setValue("ga_cargo", representante.cargo);
    setValue("ga_telefone", representante.telefone);
    setValue("ga_email", representante.email);
  }

  async function handleEditarPolitica(politica: IPoliticas): Promise<void> {
    setUpdatePolitica(politica);
    setShowModalPolitica(true);

    // Preenche os campos do formulário com os dados do representante
    setValue("id_politica_municipal", politica.id_politica_municipal);
    setValue("politica_titulo", politica.titulo);
    setValue("politica_ano", politica.ano);
  }

  async function handleEditarParticipacao(
    participacao: IParticipacao
  ): Promise<void> {
    setUpdateParticipacao(participacao);
    setShowModalParticipacao(true);

    // Preenche os campos do formulário com os dados da participação
    setValue(
      "id_participacao_controle_social",
      participacao.id_participacao_controle_social
    );
    setValue("pcs_titulo", participacao.titulo);
    setValue("pcs_ano", participacao.ano);
  }

  async function updateParticipacaoControleSocial(data: IParticipacao) {
    if (!usuario.id_municipio || !data.id_participacao_controle_social) {
      toast.error("Dados insuficientes para atualizar!", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    await api
      .put("updateParticipacaoControleSocial", {
        id_participacao_controle_social: data.id_participacao_controle_social,
        pcs_titulo: data?.titulo,
        pcs_ano: data?.ano,
        id_municipio: usuario.id_municipio,
      })
      .then((response) => {
        toast.success(
          "Participação e Controle Social atualizado com sucesso!",
          { position: "top-right", autoClose: 5000 }
        );
        getParticipacoes();
        setShowModalParticipacao(false);
        setUpdateParticipacao(null);
      })
      .catch((error) => {
        toast.error("Não foi possível atualizar a participação!", {
          position: "top-right",
          autoClose: 5000,
        });
      });
  }

  async function updatePresidenteConselho(data) {
    console.log("Dados do presidente:", data);
    if (
      !usuario.id_municipio ||
      !data.id_presidencia_conselho_municipal_saneamento_basico
    ) {
      toast.error("Dados insuficientes para atualizar!", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    await api
      .put("update-presidencia-conselho-municipal", {
        id_presidencia_conselho_municipal_saneamento_basico:
          data.id_presidencia_conselho_municipal_saneamento_basico,
        nome_presidente: data.nome_presidente,
        telefone_presidente: data.telefone_presidente,
        email_presidente: data.email_presidente,
        setor_responsavel: data.setor_responsavel,
        integrantes: data.integrantes,
        id_municipio: usuario.id_municipio,
      })
      .then((response) => {
        toast.success("Presidente atualizado com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
        getPresidentesConselho(); // Atualiza a lista
        setShowModalPresidente(false);
        setUpdatePresidente(null);
      })
      .catch((error) => {
        console.log(
          "Erro ao atualizar presidente:",
          error.response?.data || error
        );
        toast.error("Não foi possível atualizar o presidente!", {
          position: "top-right",
          autoClose: 5000,
        });
      });
  }

  async function handleEditarPresidente(presidente) {
    setUpdatePresidente(presidente);
    setShowModalPresidente(true);

    setValue(
      "id_presidencia_conselho_municipal_saneamento_basico",
      presidente.id_presidencia_conselho_municipal_saneamento_basico
    );
    setValue("nome_presidente", presidente.nome_presidente);
    setValue("telefone_presidente", presidente.telefone_presidente);
    setValue("email_presidente", presidente.email_presidente);
    setValue("setor_responsavel", presidente.setor_responsavel);
    setValue("integrantes", presidente.integrantes);
  }

  if (!usuario?.id_municipio) {
    return null;
  }

  async function handleEditarPlano(plano: IPlanos): Promise<void> {
    setUpdatePlano(plano);
    setShowModalPlano(true);

    setValue("id_plano_municipal", plano.id_plano_municipal);
    setValue("plano_titulo", plano.titulo);
    setValue("plano_ano", plano.ano);
  }

  async function updatePlanoMunicipal(data: IPlanos) {
    if (!usuario.id_municipio || !data.id_plano_municipal) {
      toast.error("Dados insuficientes para atualizar!", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    await api
      .put("updatePlanoMunicipal", {
        id_plano_municipal: data.id_plano_municipal,
        plano_titulo: data?.titulo,
        plano_ano: data?.ano,
        id_municipio: usuario.id_municipio,
        situacao: planoSituacao,
      })
      .then((response) => {
        toast.success("Plano Municipal atualizado com sucesso!", {
          position: "top-right",
          autoClose: 5000,
        });
        getPlanos();
        setShowModalPlano(false);
        setUpdatePlano(null);
      })
      .catch((error) => {
        toast.error("Não foi possível atualizar o plano municipal!", {
          position: "top-right",
          autoClose: 5000,
        });
      });
  }

  async function getMenus() {
    try {
      // Buscar menus do módulo Cadastros (id_modulo = 3)
      const res = await api.get(`menus/modulo/1`);
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
    getMenus();
  }, []);

  // Formulário dinâmico: exibir quando um item do menu lateral (Política/Plano/Conselho) foi selecionado
  const isDynamicMenuItemActive = !!grupo;

  return (
    <Container suppressHydrationWarning>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuHorizontal
        municipio={dadosMunicipio?.municipio_nome}
      ></MenuHorizontal>
      <MenuIndicadores></MenuIndicadores>

      <div suppressHydrationWarning>
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
              $isActive={activeForm === "gestaoAssociada"}
              onClick={() => setActiveForm("gestaoAssociada")}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaList style={{ fontSize: "14px" }} />
                Gestão Associada
              </div>
            </StaticMenuHeader>
            <StaticMenuHeader
              $isActive={activeForm === "politicaSaneamento"}
              onClick={() => setActiveForm("politicaSaneamento")}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaList style={{ fontSize: "14px" }} />
                Política Municipal de Saneamento
              </div>
            </StaticMenuHeader>
            <StaticMenuHeader
              $isActive={activeForm === "planoSaneamento"}
              onClick={() => setActiveForm("planoSaneamento")}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaList style={{ fontSize: "14px" }} />
                Plano Municipal de Saneamento
              </div>
            </StaticMenuHeader>
            <StaticMenuHeader
              $isActive={activeForm === "conselhoSaneamento"}
              onClick={() => setActiveForm("conselhoSaneamento")}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaList style={{ fontSize: "14px" }} />
                Conselho Municipal de Saneamento Básico
              </div>
            </StaticMenuHeader>
            <StaticMenuHeader
              $isActive={activeForm === "participacaoSocial"}
              onClick={() => setActiveForm("participacaoSocial")}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaList style={{ fontSize: "14px" }} />
                Participação e controle social
              </div>
            </StaticMenuHeader>
            <StaticMenuHeader
              $isActive={activeForm === "saneamentoRural"}
              onClick={() => setActiveForm("saneamentoRural")}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaList style={{ fontSize: "14px" }} />
                Saneamento Rural
              </div>
            </StaticMenuHeader>
            <StaticMenuHeader
              $isActive={activeForm === "comunidadesTradicionais"}
              onClick={() => setActiveForm("comunidadesTradicionais")}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaList style={{ fontSize: "14px" }} />
                Comunidades Tradicionais
              </div>
            </StaticMenuHeader>

            <div suppressHydrationWarning>
              {menus?.filter((menu) => {
                return menu.titulo !== "Plano Municipal" && menu.titulo !== "Politica Municipal" && menu.titulo !== "Conselho Municipal";
              }).map((menu) => {
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
                        <SidebarItem style={{ marginTop: "10px" }}
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
            </div>
          </Sidebar>
        )}
      </div>
      <MainContent isCollapsed={isCollapsed} suppressHydrationWarning>
        <DivCenter suppressHydrationWarning>
          <BreadCrumbStyle $isCollapsed={isCollapsed}>
            <nav>
              <ol>
                <li>
                  <Link href="/indicadores/home_indicadores">Home</Link>
                  <span> / </span>
                </li>
                <li>
                  <span>Gestão</span>
                </li>
              </ol>
            </nav>
          </BreadCrumbStyle>
          <Form onSubmit={handleSubmitGestao(handleCadastro)}>
            <DivFormCadastro active={activeForm === "gestaoAssociada"} suppressHydrationWarning>
              <DivTituloForm>Gestão Associada</DivTituloForm>
              <table
                style={{
                  width: "97%",
                  borderRadius: "10px",
                  border: "1px solid #eee",
                  boxShadow: "0 3.8px 5.7px rgba(0, 0, 0, 0.1)",
                  margin: "0 0 20px 20px",
                  padding: "15px",
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ width: "40%", padding: "10px" }}>

                      <label>Nome da associação</label>
                      <input
                        style={{ width: "100%" }}
                        {...registerGestao("nome_associacao")}
                        defaultValue={dadosGestao?.ga_nome || ""}
                        onChange={(e) => {
                          setValueGestao("nome_associacao", e.target.value);
                        }}
                        type="text"
                      ></input>

                    </td>
                    <td style={{ width: "40%", padding: "10px" }}>
                      <label>
                        Norma da associação<span> *</span>
                      </label>
                      <input
                        style={{ width: "100%" }}
                        {...registerGestao("norma_associacao")}
                        defaultValue={dadosGestao?.ga_norma || ""}
                        onChange={(e) => {
                          setValueGestao("norma_associacao", e.target.value);
                        }}
                        type="text"
                      ></input>
                    </td>
                    <td style={{ textAlign: "right", width: "10%" }}>
                      {usuario?.id_permissao !== 4 && (
                        <button
                          type="submit"
                          style={{
                            padding: "12px 24px",
                            fontSize: "14px",
                            fontWeight: "500",
                            borderRadius: "6px",
                            transition: "all 0.2s",
                            backgroundColor: "#0085bd",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Gravar
                        </button>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>


              <DivEixo
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                Representantes
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleShowModal();
                  }}
                  style={{
                    padding: "12px 24px",
                    fontSize: "14px",
                    fontWeight: "500",
                    borderRadius: "6px",
                    transition: "all 0.2s",
                    backgroundColor: "#0085bd",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    marginRight: "20px",
                  }}
                >
                  Adicionar
                </button>
              </DivEixo>

              <table
                cellSpacing={0}
                style={{
                  width: "97%",
                  borderRadius: "10px",
                  boxShadow: "0 3.8px 5.7px rgba(0, 0, 0, 0.1)",
                  margin: "0 0 20px 20px",
                  borderCollapse: "separate",
                  borderSpacing: 0,
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        background: "#0085bd",
                        color: "#fff",
                        padding: "10px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                        borderTopLeftRadius: "10px",
                      }}
                    >
                      ID
                    </th>
                    <th
                      style={{
                        background: "#0085bd",
                        color: "#fff",
                        padding: "10px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      Nome
                    </th>
                    <th
                      style={{
                        background: "#0085bd",
                        color: "#fff",
                        padding: "10px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      Cargo
                    </th>
                    <th
                      style={{
                        background: "#0085bd",
                        color: "#fff",
                        padding: "10px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      Telefone
                    </th>
                    <th
                      style={{
                        background: "#0085bd",
                        color: "#fff",
                        padding: "10px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      Email
                    </th>
                    <th
                      style={{
                        background: "#0085bd",
                        color: "#fff",
                        padding: "10px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                        borderTopRightRadius: "10px",
                      }}
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {representantes && representantes.length > 0 ? (
                    representantes.map((representante, index) => (
                      <tr role="row" key={index}>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#4a5568",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "15px",
                          }}
                        >
                          {representante.id_representante_servicos_ga}
                        </td>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#4a5568",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "15px",
                          }}
                        >
                          <InputM>{representante.nome}</InputM>
                        </td>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#4a5568",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "15px",
                          }}
                        >
                          {representante.cargo}
                        </td>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#4a5568",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "15px",
                          }}
                        >
                          {representante.telefone}
                        </td>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#4a5568",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "15px",
                          }}
                        >
                          {representante.email}
                        </td>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#4a5568",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "15px",
                          }}
                        >
                          <Actions>
                            <Image
                              title="Editar"
                              onClick={() =>
                                handleEditarRepresentante(representante)
                              }
                              src={Editar}
                              alt="Editar"
                              width={25}
                              height={25}
                            />

                            <Image
                              onClick={() =>
                                handleRemoverRepresentante({
                                  id: representante.id_representante_servicos_ga,
                                })
                              }
                              src={Excluir}
                              alt="Excluir"
                              width={25}
                              height={25}
                            />
                          </Actions>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          padding: "20px",
                          textAlign: "center",
                          color: "#999",
                        }}
                      >
                        Nenhum representante cadastrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </DivFormCadastro>
          </Form>

          <DivFormCadastro active={activeForm === "politicaSaneamento"} suppressHydrationWarning>
            <DivTituloForm>
              Política Municipal de Saneamento Básico
            </DivTituloForm>
            <div style={{ borderBottom: "1px solid #eee", marginLeft: "20px" }}>
              <TabContainer>
                <TabButton
                  $active={activeTabPolitica === "politicaMunicipal"}
                  onClick={() => setActiveTabPolitica("politicaMunicipal")}
                >
                  Política Municipal
                </TabButton>
                <TabButton
                  $active={activeTabPolitica === "dadosComplementaresPolitica"}
                  onClick={() => setActiveTabPolitica("dadosComplementaresPolitica")}
                >
                  Dados Complementares
                </TabButton>
              </TabContainer>
            </div>
            <Form onSubmit={handleSubmitPolitica(handleAddPolitica)}>
              <div style={{ width: "100%", padding: "20px", borderRadius: "10px", display: activeTabPolitica === "politicaMunicipal" ? "block" : "none" }} suppressHydrationWarning>

                <label
                  style={{
                    display: "block",
                    marginBottom: "10px",
                    fontWeight: "bold",
                    marginLeft: "20px",
                  }}
                >
                  Situação da Política Municipal:
                </label>
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    marginLeft: "20px",
                    flexDirection: innerWidth <= 768 ? "column" : "row",
                  }}
                  suppressHydrationWarning
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="politica_situacao"
                      checked={politicaSituacao === "aprovado"}
                      onChange={() => handlePoliticaSituacaoChange("aprovado")}
                    />
                    Aprovado
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="politica_situacao"
                      checked={politicaSituacao === "elaborado"}
                      onChange={() => handlePoliticaSituacaoChange("elaborado")}
                    />
                    Elaborado
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="politica_situacao"
                      checked={politicaSituacao === "em_construcao"}
                      onChange={() =>
                        handlePoliticaSituacaoChange("em_construcao")
                      }
                    />
                    Em construção
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="politica_situacao"
                      checked={politicaSituacao === "nao_tem"}
                      onChange={() => handlePoliticaSituacaoChange("nao_tem")}
                    />
                    Não tem
                  </label>
                </div>


                <table
                  style={{
                    width: "97%",
                    borderRadius: "10px",
                    border: "1px solid #eee",
                    boxShadow: "0 3.8px 5.7px rgba(0, 0, 0, 0.1)",
                    margin: "0 0 20px 20px",
                    padding: "15px",
                  }}
                >
                  <tbody>
                    <tr>
                      <td style={{ width: "40%", padding: "10px" }}>

                        <label>Título</label>
                        <input
                          style={{ width: "100%" }}
                          {...registerPolitica("politica_titulo")}
                          defaultValue={dadosGestao?.politica_titulo}
                          onChange={(e) => {
                            const value = capitalizeFrasal(e.target.value);
                            setValuePolitica("politica_titulo", value);
                          }}
                          type="text"
                          onKeyPress={onlyLettersAndCharacters}
                          disabled={politicaSituacao === "nao_tem"}
                        ></input>

                      </td>
                      <td style={{ width: "10%", padding: "10px" }}>

                        <label>Ano</label>
                        <input
                          style={{ width: "100%" }}
                          {...registerPolitica("politica_ano")}
                          defaultValue={dadosGestao?.politica_ano}
                          onChange={(e) => {
                            setValuePolitica("politica_ano", e.target.value);
                          }}
                          type="text"
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          disabled={politicaSituacao === "nao_tem"}
                        ></input>

                      </td>
                      <td style={{ width: "30%", padding: "10px" }}>

                        <label>Arquivo</label>
                        <input
                          style={{ width: "100%" }}
                          {...registerPolitica("politica_arquivo")}
                          type="file"
                          disabled={politicaSituacao === "nao_tem"}
                        ></input>

                      </td>
                      <td style={{ width: "10%", textAlign: "right" }}>
                        {usuario?.id_permissao !== 4 && (
                          <button
                            type="submit"
                            disabled={politicaSituacao === "nao_tem"}
                            style={{
                              padding: "12px 24px",
                              fontSize: "14px",
                              fontWeight: "500",
                              borderRadius: "6px",
                              transition: "all 0.2s",
                              backgroundColor: "#0085bd",
                              color: "#fff",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            Gravar
                          </button>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>



                <DivEixo>Atualizações</DivEixo>

                <table
                  cellSpacing={0}
                  style={{
                    width: "97%",
                    borderRadius: "10px",
                    boxShadow: "0 3.8px 5.7px rgba(0, 0, 0, 0.1)",
                    margin: "0 0 20px 20px",
                    borderCollapse: "separate",
                    borderSpacing: 0,
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          background: "#0085bd",
                          color: "#fff",
                          padding: "10px 20px",
                          textAlign: "left",
                          fontWeight: 600,
                          fontSize: "14px",
                          borderTopLeftRadius: "10px",
                        }}
                      >
                        ID
                      </th>
                      <th
                        style={{
                          background: "#0085bd",
                          color: "#fff",
                          padding: "10px 20px",
                          textAlign: "left",
                          fontWeight: 600,
                          fontSize: "14px",
                        }}
                      >
                        Título
                      </th>
                      <th
                        style={{
                          background: "#0085bd",
                          color: "#fff",
                          padding: "10px 20px",
                          textAlign: "left",
                          fontWeight: 600,
                          fontSize: "14px",
                        }}
                      >
                        Ano
                      </th>
                      <th
                        style={{
                          background: "#0085bd",
                          color: "#fff",
                          padding: "10px 20px",
                          textAlign: "left",
                          fontWeight: 600,
                          fontSize: "14px",
                          borderTopRightRadius: "10px",
                        }}
                      >
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listPoliticas && listPoliticas.length > 0 ? (
                      listPoliticas.map((politica, index) => (
                        <tr key={index}>
                          <td
                            style={{
                              padding: "16px 20px",
                              color: "#4a5568",
                              borderBottom: "1px solid #e2e8f0",
                              fontSize: "15px",
                            }}
                          >
                            {politica.id_politica_municipal}
                          </td>
                          <td
                            style={{
                              padding: "16px 20px",
                              color: "#4a5568",
                              borderBottom: "1px solid #e2e8f0",
                              fontSize: "15px",
                            }}
                          >
                            <InputG>{politica.titulo}</InputG>
                          </td>
                          <td
                            style={{
                              padding: "16px 20px",
                              color: "#4a5568",
                              borderBottom: "1px solid #e2e8f0",
                              fontSize: "15px",
                            }}
                          >
                            {politica.ano}
                          </td>
                          <td
                            style={{
                              padding: "16px 20px",
                              color: "#4a5568",
                              borderBottom: "1px solid #e2e8f0",
                              fontSize: "15px",
                            }}
                          >
                            <Actions>
                              <Image
                                title="Editar"
                                onClick={() => handleEditarPolitica(politica)}
                                src={Editar}
                                alt="Editar"
                                width={25}
                                height={25}
                                style={{
                                  cursor:
                                    politicaSituacao === "nao_tem"
                                      ? "not-allowed"
                                      : "pointer",
                                  opacity:
                                    politicaSituacao === "nao_tem" ? 0.5 : 1,
                                }}
                                {...(politicaSituacao === "nao_tem"
                                  ? { onClick: (e) => e.preventDefault() }
                                  : {})}
                              />
                              <a
                                href={politica.file}
                                rel="noreferrer"
                                target="_blank"
                                style={{
                                  pointerEvents:
                                    politicaSituacao === "nao_tem"
                                      ? "none"
                                      : "auto",
                                  opacity:
                                    politicaSituacao === "nao_tem" ? 0.5 : 1,
                                }}
                              >
                                <FaFilePdf></FaFilePdf>
                              </a>
                              <Image
                                src={Excluir}
                                alt="Excluir"
                                width={25}
                                height={25}
                                onClick={() => {
                                  if (politicaSituacao !== "nao_tem") {
                                    handleRemoverPolitica({
                                      id: politica.id_politica_municipal,
                                      id_arquivo: politica.id_arquivo,
                                    });
                                  }
                                }}
                                style={{
                                  cursor:
                                    politicaSituacao === "nao_tem"
                                      ? "not-allowed"
                                      : "pointer",
                                  opacity:
                                    politicaSituacao === "nao_tem" ? 0.5 : 1,
                                }}
                              />
                            </Actions>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          style={{
                            padding: "20px",
                            textAlign: "center",
                            color: "#999",
                          }}
                        >
                          Nenhuma política cadastrada
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Form>


            <div style={{ display: activeTabPolitica === "dadosComplementaresPolitica" ? "block" : "none" }} suppressHydrationWarning>
              <Form style={{ backgroundColor: "white" }} onSubmit={handleSubmitIndicadoresPolitica(handleCadastroIndicadoresPolitica)}>

                <div
                  style={{ width: "97%", padding: "20px", borderBottom: "1px solid #eee" }}
                  suppressHydrationWarning
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <label style={{ width: "250px", marginRight: "10px" }}>Selecionar Ano:</label>
                      <select
                        value={anoSelectedPolitica || ""}
                        onChange={(e) => selectAnoPolitica(e.target.value)}
                        disabled={loadingDadosPolitica}
                        style={{ padding: "5px" }}
                      >
                        <option value="">Selecione o ano</option>
                        {anosSelect().map((ano) => (
                          <option key={ano} value={ano}>
                            {ano}
                          </option>
                        ))}
                      </select>
                      {loadingDadosPolitica && (
                        <span style={{ marginLeft: "10px", color: "#12B2D5", whiteSpace: "nowrap" }}>
                          Carregando dados...
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: "14px", color: "#666" }}>
                      <strong>{indicadoresPolitica.length}</strong> indicador
                      {indicadoresPolitica.length !== 1 ? "es" : ""} encontrado
                      {indicadoresPolitica.length !== 1 ? "s" : ""}
                      {indicadoresPolitica.some((ind) => ind._hasError) && (
                        <span style={{ color: "#dc3545", marginLeft: "10px" }}>
                          | ⚠️ Alguns campos com erro
                        </span>
                      )}
                      {dadosCarregadosPolitica.length > 0 && (
                        <span style={{ color: "#28a745", marginLeft: "10px" }}>
                          | ✅ {dadosCarregadosPolitica.length} dado
                          {dadosCarregadosPolitica.length !== 1 ? "s" : ""} carregado
                          {dadosCarregadosPolitica.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    {grupoPolitica &&
                      !loadingIndicadoresPolitica &&
                      indicadoresPolitica.some((ind) => ind._hasError) && (
                        <button
                          type="button"
                          onClick={() => {
                            const menuItem = menuItemsPolitica.find(
                              (item) => item.nome_menu_item === grupoPolitica
                            );
                            if (menuItem) {
                              getIndicadoresPolitica(menuItem);
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

                {!grupoPolitica ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <p>Carregando indicadores...</p>
                  </div>
                ) : loadingIndicadoresPolitica ? (
                  <div style={{ textAlign: "center", padding: "40px" }}>
                    <p>Carregando indicadores...</p>
                  </div>
                ) : indicadoresPolitica.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px" }}>
                    <p>Nenhum indicador encontrado para este grupo.</p>
                  </div>
                ) : (
                  <div
                    suppressHydrationWarning
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      overflow: "hidden",
                      marginTop: "20px",
                      width: "97%",
                    }}
                  >
                    {/* Cabeçalho da Tabela */}
                    <div
                      suppressHydrationWarning
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
                            isMounted && innerWidth > 768
                              ? "180px 1fr 280px 100px"
                              : "1fr",
                          gap: isMounted && innerWidth > 768 ? "15px" : "10px",
                          alignItems: "center",
                          padding: "0 15px",
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: "14px",
                        }}
                        suppressHydrationWarning
                      >
                        {isMounted && innerWidth > 768 ? (
                          <>
                            <div suppressHydrationWarning>CÓDIGO</div>
                            <div suppressHydrationWarning>DESCRIÇÃO DO INDICADOR</div>
                            <div suppressHydrationWarning style={{ textAlign: "center" }}>
                              VALOR - ANO: {anoSelectedPolitica || "____"}
                            </div>
                            <div suppressHydrationWarning style={{ textAlign: "center" }}>
                              UNIDADE
                            </div>
                          </>
                        ) : (
                          <div suppressHydrationWarning>
                            INDICADORES - ANO: {anoSelectedPolitica || "____"}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Linhas da Tabela */}
                    {indicadoresPolitica.map((indicador, index) => {
                      const tipoCampo =
                        indicador.tiposCampo &&
                          indicador.tiposCampo.length > 0
                          ? indicador.tiposCampo[0]
                          : null;
                      const isEven = index % 2 === 0;

                      return (
                        <div
                          key={indicador.id_indicador}
                          suppressHydrationWarning
                          style={{
                            backgroundColor: isEven ? "#f8f9fa" : "#ffffff",
                            borderBottom:
                              index < indicadoresPolitica.length - 1
                                ? "1px solid #dee2e6"
                                : "none",
                            padding: "15px 0",
                            transition: "background-color 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#e8f4fd";
                            e.currentTarget.style.borderLeft = "3px solid #1e88e5";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isEven
                              ? "#f8f9fa"
                              : "#ffffff";
                            e.currentTarget.style.borderLeft = "none";
                          }}
                        >
                          {isMounted && innerWidth > 768 ? (
                            <div
                              suppressHydrationWarning
                              style={{
                                display: "grid",
                                gridTemplateColumns: "180px 1fr 280px 100px",
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
                                {anoSelectedPolitica ? (
                                  <div style={{ width: "260px" }}>
                                    <CampoIndicadorPolitica
                                      indicador={indicador}
                                      register={registerIndicadoresPolitica}
                                      anoSelected={anoSelectedPolitica}
                                      setValue={setValueIndicadoresPolitica}
                                      watch={watchIndicadoresPolitica}
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
                              suppressHydrationWarning
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

                              {anoSelectedPolitica ? (
                                <CampoIndicadorPolitica
                                  indicador={indicador}
                                  register={registerIndicadoresPolitica}
                                  anoSelected={anoSelectedPolitica}
                                  setValue={setValueIndicadoresPolitica}
                                  watch={watchIndicadoresPolitica}
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

                {indicadoresPolitica.length > 0 && anoSelectedPolitica && (
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

              </Form>
            </div>
          </DivFormCadastro>

          <DivFormCadastro active={activeForm === "planoSaneamento"} suppressHydrationWarning>
            <DivTituloForm>
              Plano Municipal de Saneamento Básico
            </DivTituloForm>
            <div style={{ borderBottom: "1px solid #eee", marginLeft: "20px" }}>
              <TabContainer>
                <TabButton
                  $active={activeTabPlano === "planoMunicipal"}
                  onClick={() => setActiveTabPlano("planoMunicipal")}
                >
                  Plano Municipal
                </TabButton>
                <TabButton
                  $active={activeTabPlano === "dadosComplementaresPlano"}
                  onClick={() => setActiveTabPlano("dadosComplementaresPlano")}
                >
                  Dados Complementares
                </TabButton>
              </TabContainer>
            </div>
            <Form onSubmit={handleSubmitPlano(handleAddPlano)}>
              <div style={{ width: "100%", padding: "20px", borderRadius: "10px", display: activeTabPlano === "planoMunicipal" ? "block" : "none" }} suppressHydrationWarning>

                <label
                  style={{
                    display: "block",
                    marginBottom: "10px",
                    fontWeight: "bold",
                    marginLeft: "20px",
                  }}
                >
                  Situação do Plano Municipal:
                </label>
                <div
                  style={{
                    display: "flex",
                    marginLeft: "20px",
                    gap: "20px",
                    flexDirection: innerWidth <= 768 ? "column" : "row",
                  }}
                  suppressHydrationWarning
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="plano_situacao"
                      checked={planoSituacao === "aprovado"}
                      onChange={() => handlePlanoSituacaoChange("aprovado")}
                    />
                    Aprovado
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="plano_situacao"
                      checked={planoSituacao === "elaborado"}
                      onChange={() => handlePlanoSituacaoChange("elaborado")}
                    />
                    Elaborado
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="plano_situacao"
                      checked={planoSituacao === "em_construcao"}
                      onChange={() =>
                        handlePlanoSituacaoChange("em_construcao")
                      }
                    />
                    Em construção
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="plano_situacao"
                      checked={planoSituacao === "nao_tem"}
                      onChange={() => handlePlanoSituacaoChange("nao_tem")}
                    />
                    Não tem
                  </label>
                </div>

                <table
                  style={{
                    width: "97%",
                    borderRadius: "10px",
                    border: "1px solid #eee",
                    boxShadow: "0 3.8px 5.7px rgba(0, 0, 0, 0.1)",
                    margin: "0 0 20px 20px",
                    padding: "15px",
                  }}
                >
                  <tbody>
                    <tr>
                      <td style={{ width: "40%", padding: "10px" }}>

                        <label>Título</label>
                        <input
                          style={{ width: "100%" }}
                          {...registerPlano("plano_titulo")}
                          type="text"
                          onChange={(e) => {
                            const value = capitalizeFrasal(e.target.value);
                            setValuePlano("plano_titulo", value);
                          }}
                          onKeyPress={onlyLettersAndCharacters}
                          disabled={planoSituacao === "nao_tem"}
                        />
                      </td>
                      <td style={{ width: "10%", padding: "10px" }}>

                        <label>Ano</label>
                        <input
                          style={{ width: "100%" }}
                          {...registerPlano("plano_ano")}
                          type="text"
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          onChange={(e) => {
                            setValuePlano("plano_ano", e.target.value);
                          }}
                          disabled={planoSituacao === "nao_tem"}
                        />
                      </td>
                      <td style={{ width: "30%", padding: "10px" }}>

                        <label>Arquivo</label>
                        <input
                          style={{ width: "100%" }}
                          {...registerPlano("plano_arquivo")}
                          type="file"
                          disabled={planoSituacao === "nao_tem"}
                        />

                      </td>
                      <td style={{ textAlign: "right", width: "10%" }}>
                        {usuario?.id_permissao !== 4 && (
                          <button
                            type="submit"
                            disabled={planoSituacao === "nao_tem"}
                            style={{
                              padding: "12px 24px",
                              fontSize: "14px",
                              fontWeight: "500",
                              borderRadius: "6px",
                              transition: "all 0.2s",
                              backgroundColor: "#0085bd",
                              color: "#fff",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            Gravar
                          </button>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>


                <DivEixo>Atualizações</DivEixo>
                <table
                  cellSpacing={0}
                  style={{
                    width: "97%",
                    borderRadius: "10px",
                    boxShadow: "0 3.8px 5.7px rgba(0, 0, 0, 0.1)",
                    margin: "0 0 20px 20px",
                    borderCollapse: "separate",
                    borderSpacing: 0,
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          background: "#0085bd",
                          color: "#fff",
                          padding: "10px 20px",
                          textAlign: "left",
                          fontWeight: 600,
                          fontSize: "14px",
                          borderTopLeftRadius: "10px",
                        }}
                      >
                        ID
                      </th>
                      <th
                        style={{
                          background: "#0085bd",
                          color: "#fff",
                          padding: "10px 20px",
                          textAlign: "left",
                          fontWeight: 600,
                          fontSize: "14px",
                        }}
                      >
                        Título
                      </th>
                      <th
                        style={{
                          background: "#0085bd",
                          color: "#fff",
                          padding: "10px 20px",
                          textAlign: "left",
                          fontWeight: 600,
                          fontSize: "14px",
                        }}
                      >
                        Ano
                      </th>
                      <th
                        style={{
                          background: "#0085bd",
                          color: "#fff",
                          padding: "10px 20px",
                          textAlign: "left",
                          fontWeight: 600,
                          fontSize: "14px",
                          borderTopRightRadius: "10px",
                        }}
                      >
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listPlanos && listPlanos.length > 0 ? (
                      listPlanos.map((plano, index) => (
                        <tr key={index}>
                          <td
                            style={{
                              padding: "16px 20px",
                              color: "#4a5568",
                              borderBottom: "1px solid #e2e8f0",
                              fontSize: "15px",
                            }}
                          >
                            {plano.id_plano_municipal}
                          </td>
                          <td
                            style={{
                              padding: "16px 20px",
                              color: "#4a5568",
                              borderBottom: "1px solid #e2e8f0",
                              fontSize: "15px",
                            }}
                          >
                            <InputG>{plano.titulo}</InputG>
                          </td>
                          <td
                            style={{
                              padding: "16px 20px",
                              color: "#4a5568",
                              borderBottom: "1px solid #e2e8f0",
                              fontSize: "15px",
                            }}
                          >
                            {plano.ano}
                          </td>
                          <td
                            style={{
                              padding: "16px 20px",
                              color: "#4a5568",
                              borderBottom: "1px solid #e2e8f0",
                              fontSize: "15px",
                            }}
                          >
                            <Actions>
                              <Image
                                title="Editar"
                                onClick={() => handleEditarPlano(plano)}
                                src={Editar}
                                alt="Editar"
                                width={25}
                                height={25}
                                style={{
                                  cursor:
                                    planoSituacao === "nao_tem"
                                      ? "not-allowed"
                                      : "pointer",
                                  opacity: planoSituacao === "nao_tem" ? 0.5 : 1,
                                }}
                                {...(planoSituacao === "nao_tem"
                                  ? { onClick: (e) => e.preventDefault() }
                                  : {})}
                              />
                              <a
                                href={plano.file}
                                rel="noreferrer"
                                target="_blank"
                                style={{
                                  pointerEvents:
                                    planoSituacao === "nao_tem" ? "none" : "auto",
                                  opacity: planoSituacao === "nao_tem" ? 0.5 : 1,
                                }}
                              >
                                <FaFilePdf></FaFilePdf>
                              </a>
                              <Image
                                src={Excluir}
                                alt="Excluir"
                                width={25}
                                height={25}
                                onClick={() => {
                                  if (planoSituacao !== "nao_tem") {
                                    handleRemoverPlano({
                                      id: plano.id_plano_municipal,
                                      id_arquivo: plano.id_arquivo,
                                    });
                                  }
                                }}
                                style={{
                                  cursor:
                                    planoSituacao === "nao_tem"
                                      ? "not-allowed"
                                      : "pointer",
                                  opacity: planoSituacao === "nao_tem" ? 0.5 : 1,
                                }}
                              />
                            </Actions>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          style={{
                            padding: "20px",
                            textAlign: "center",
                            color: "#999",
                          }}
                        >
                          Nenhum plano cadastrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Form>
            <div style={{ display: activeTabPlano === "dadosComplementaresPlano" ? "block" : "none" }}>
              <Form style={{ backgroundColor: "white" }} onSubmit={handleSubmitIndicadoresPlano(handleCadastroIndicadoresPlano)}>

                <div
                  style={{ width: "97%", padding: "20px", borderBottom: "1px solid #eee" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <label style={{ width: "250px", marginRight: "10px" }}>Selecionar Ano:</label>
                      <select
                        value={anoSelectedPlano || ""}
                        onChange={(e) => selectAnoPlano(e.target.value)}
                        disabled={loadingDadosPlano}
                        style={{ padding: "5px" }}
                      >
                        <option value="">Selecione o ano</option>
                        {anosSelect().map((ano) => (
                          <option key={ano} value={ano}>
                            {ano}
                          </option>
                        ))}
                      </select>
                      {loadingDadosPlano && (
                        <span style={{ marginLeft: "10px", color: "#12B2D5", whiteSpace: "nowrap" }}>
                          Carregando dados...
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: "14px", color: "#666" }}>
                      <strong>{indicadoresPlano.length}</strong> indicador
                      {indicadoresPlano.length !== 1 ? "es" : ""} encontrado
                      {indicadoresPlano.length !== 1 ? "s" : ""}
                      {indicadoresPlano.some((ind) => ind._hasError) && (
                        <span style={{ color: "#dc3545", marginLeft: "10px" }}>
                          | ⚠️ Alguns campos com erro
                        </span>
                      )}
                      {dadosCarregadosPlano.length > 0 && (
                        <span style={{ color: "#28a745", marginLeft: "10px" }}>
                          | ✅ {dadosCarregadosPlano.length} dado
                          {dadosCarregadosPlano.length !== 1 ? "s" : ""} carregado
                          {dadosCarregadosPlano.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    {grupoPlano &&
                      !loadingIndicadoresPlano &&
                      indicadoresPlano.some((ind) => ind._hasError) && (
                        <button
                          type="button"
                          onClick={() => {
                            const menuItem = menuItemsPlano.find(
                              (item) => item.nome_menu_item === grupoPlano
                            );
                            if (menuItem) {
                              getIndicadoresPlano(menuItem);
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

                {!grupoPlano ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <p>Carregando indicadores...</p>
                  </div>
                ) : loadingIndicadoresPlano ? (
                  <div style={{ textAlign: "center", padding: "40px" }}>
                    <p>Carregando indicadores...</p>
                  </div>
                ) : indicadoresPlano.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px" }}>
                    <p>Nenhum indicador encontrado para este grupo.</p>
                  </div>
                ) : (
                  <div
                    suppressHydrationWarning
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      overflow: "hidden",
                      marginTop: "20px",
                      width: "97%",
                    }}
                  >
                    {/* Cabeçalho da Tabela */}
                    <div
                      suppressHydrationWarning
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
                            isMounted && innerWidth > 768
                              ? "180px 1fr 280px 100px"
                              : "1fr",
                          gap: isMounted && innerWidth > 768 ? "15px" : "10px",
                          alignItems: "center",
                          padding: "0 15px",
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: "14px",
                        }}
                        suppressHydrationWarning
                      >
                        {isMounted && innerWidth > 768 ? (
                          <>
                            <div suppressHydrationWarning>CÓDIGO</div>
                            <div suppressHydrationWarning>DESCRIÇÃO DO INDICADOR</div>
                            <div suppressHydrationWarning style={{ textAlign: "center" }}>
                              VALOR - ANO: {anoSelectedPlano || "____"}
                            </div>
                            <div suppressHydrationWarning style={{ textAlign: "center" }}>
                              UNIDADE
                            </div>
                          </>
                        ) : (
                          <div suppressHydrationWarning>
                            INDICADORES - ANO: {anoSelectedPlano || "____"}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Linhas da Tabela */}
                    {indicadoresPlano.map((indicador, index) => {
                      const tipoCampo =
                        indicador.tiposCampo &&
                          indicador.tiposCampo.length > 0
                          ? indicador.tiposCampo[0]
                          : null;
                      const isEven = index % 2 === 0;

                      return (
                        <div
                          key={indicador.id_indicador}
                          suppressHydrationWarning
                          style={{
                            backgroundColor: isEven ? "#f8f9fa" : "#ffffff",
                            borderBottom:
                              index < indicadoresPlano.length - 1
                                ? "1px solid #dee2e6"
                                : "none",
                            padding: "15px 0",
                            transition: "background-color 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#e8f4fd";
                            e.currentTarget.style.borderLeft = "3px solid #1e88e5";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isEven
                              ? "#f8f9fa"
                              : "#ffffff";
                            e.currentTarget.style.borderLeft = "none";
                          }}
                        >
                          {isMounted && innerWidth > 768 ? (
                            <div
                              suppressHydrationWarning
                              style={{
                                display: "grid",
                                gridTemplateColumns: "180px 1fr 280px 100px",
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
                                {anoSelectedPlano ? (
                                  <div style={{ width: "260px" }}>
                                    <CampoIndicadorPlano
                                      indicador={indicador}
                                      register={registerIndicadoresPlano}
                                      anoSelected={anoSelectedPlano}
                                      setValue={setValueIndicadoresPlano}
                                      watch={watchIndicadoresPlano}
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
                              suppressHydrationWarning
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

                              {anoSelectedPlano ? (
                                <CampoIndicadorPlano
                                  indicador={indicador}
                                  register={registerIndicadoresPlano}
                                  anoSelected={anoSelectedPlano}
                                  setValue={setValueIndicadoresPlano}
                                  watch={watchIndicadoresPlano}
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

                {indicadoresPlano.length > 0 && anoSelectedPlano && (
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

              </Form>
            </div>
          </DivFormCadastro>

          <DivFormCadastro active={activeForm === "conselhoSaneamento"} suppressHydrationWarning>
            <DivTituloForm>
              Conselho Municipal de Saneamento Básico
            </DivTituloForm>
            <div style={{ marginLeft: "20px" }}>
              <TabContainer>
                <TabButton
                  $active={activeTabConselho === "conselhoMunicipal"}
                  onClick={() => setActiveTabConselho("conselhoMunicipal")}
                >
                  Conselho Municipal
                </TabButton>
                <TabButton
                  $active={activeTabConselho === "dadosComplementaresConselho"}
                  onClick={() => setActiveTabConselho("dadosComplementaresConselho")}
                >
                  Dados Complementares
                </TabButton>
              </TabContainer>
            </div>
            <Form
              onSubmit={handleSubmitConselho(handleAddConselhoMunicipal)}
            >
              <div
                style={{
                  width: "100%",
                  padding: "20px",
                  borderRadius: "10px",
                  display: activeTabConselho === "conselhoMunicipal" ? "block" : "none",
                }}
                suppressHydrationWarning
              >

                <label
                  style={{
                    display: "block",
                    marginBottom: "10px",
                    fontWeight: "bold",
                    marginLeft: "20px",
                  }}
                >
                  Situação do Conselho Municipal:
                </label>
                <div
                  style={{
                    display: "flex",
                    marginLeft: "20px",
                    gap: "20px",
                    flexDirection: innerWidth <= 768 ? "column" : "row",
                  }}
                  suppressHydrationWarning
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="conselho_situacao"
                      checked={conselhoSituacao === "operante"}
                      onChange={() => handleConselhoSituacaoChange("operante")}
                    />
                    Operante
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="conselho_situacao"
                      checked={conselhoSituacao === "nao_operante"}
                      onChange={() =>
                        handleConselhoSituacaoChange("nao_operante")
                      }
                    />
                    Não operante
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="conselho_situacao"
                      checked={conselhoSituacao === "nao_tem"}
                      onChange={() => handleConselhoSituacaoChange("nao_tem")}
                    />
                    Não tem
                  </label>
                </div>

                <table
                  style={{
                    width: "97%",
                    borderRadius: "10px",
                    border: "1px solid #eee",
                    boxShadow: "0 3.8px 5.7px rgba(0, 0, 0, 0.1)",
                    margin: "0 0 20px 20px",
                    padding: "15px",
                  }}
                >
                  <tbody>
                    <tr>
                      <td style={{ width: "40%", padding: "10px" }}>

                        <label>Título</label>
                        <input
                          style={{ width: "100%" }}
                          type="text"
                          {...registerConselho("conselho_titulo")}
                          defaultValue={dadosGestao?.conselho_titulo}
                          onChange={(e) => {
                            const value = capitalizeFrasal(e.target.value);
                            setValueConselho("conselho_titulo", value);
                          }}
                          onKeyPress={onlyLettersAndCharacters}
                          disabled={conselhoSituacao === "nao_tem"}
                        />
                      </td>
                      <td style={{ width: "10%", padding: "10px" }}>
                        <label>Ano</label>
                        <input
                          style={{ width: "100%" }}
                          {...registerConselho("conselho_ano")}
                          defaultValue={dadosGestao?.conselho_ano}
                          onChange={(e) => {
                            setValueConselho("conselho_ano", e.target.value);
                          }}
                          type="text"
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          disabled={conselhoSituacao === "nao_tem"}
                        />
                      </td>
                      <td style={{ width: "30%", padding: "10px" }}>
                        <label>Arquivo</label>
                        <input
                          style={{ width: "100%" }}
                          {...registerConselho("conselho_arquivo")}
                          type="file"
                          disabled={conselhoSituacao === "nao_tem"}
                        ></input>
                      </td>
                      <td style={{ textAlign: "right", width: "10%" }}>
                        {usuario?.id_permissao !== 4 && (
                          <button
                            type="submit"
                            disabled={conselhoSituacao === "nao_tem"}
                            style={{
                              padding: "12px 24px",
                              fontSize: "14px",
                              fontWeight: "500",
                              borderRadius: "6px",
                              transition: "all 0.2s",
                              backgroundColor: "#0085bd",
                              color: "#fff",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            Gravar
                          </button>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>



                <TablesContainer>
                  <div>
                    <DivEixo
                      style={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      Presidentes
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleShowModalPresidente();
                        }}
                        disabled={!conselhoMunicipal || conselhoMunicipal.length === 0}
                        style={{
                          padding: "12px 24px",
                          fontSize: "14px",
                          fontWeight: "500",
                          borderRadius: "6px",
                          transition: "all 0.2s",
                          backgroundColor: "#0085bd",
                          color: "#fff",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Adicionar Presidente
                      </button>
                    </DivEixo>
                    <table
                      cellSpacing={0}
                      style={{
                        width: "98%",
                        borderRadius: "10px",
                        boxShadow: "0 3.8px 5.7px rgba(0, 0, 0, 0.1)",
                        margin: "0 0 20px 20px",
                        borderCollapse: "separate",
                        borderSpacing: 0,
                      }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              background: "#0085bd",
                              color: "#fff",
                              padding: "10px 20px",
                              textAlign: "left",
                              fontWeight: 600,
                              fontSize: "14px",
                              borderTopLeftRadius: "10px",
                            }}
                          >
                            Presidente
                          </th>
                          <th
                            style={{
                              background: "#0085bd",
                              color: "#fff",
                              padding: "10px 20px",
                              textAlign: "left",
                              fontWeight: 600,
                              fontSize: "14px",
                            }}
                          >
                            Setor Responsável
                          </th>
                          <th
                            style={{
                              background: "#0085bd",
                              color: "#fff",
                              padding: "10px 20px",
                              textAlign: "left",
                              fontWeight: 600,
                              fontSize: "14px",
                              borderTopRightRadius: "10px",
                            }}
                          >
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {conselho && conselho.length > 0 ? (
                          conselho.map((presidente, index) => (
                            <tr role="row" key={index}>
                              <td
                                style={{
                                  padding: "16px 20px",
                                  color: "#4a5568",
                                  borderBottom: "1px solid #e2e8f0",
                                  fontSize: "15px",
                                }}
                              >
                                <InputM>{presidente.nome_presidente}</InputM>
                              </td>
                              <td
                                style={{
                                  padding: "16px 20px",
                                  color: "#4a5568",
                                  borderBottom: "1px solid #e2e8f0",
                                  fontSize: "15px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {presidente.setor_responsavel}
                              </td>
                              <td
                                style={{
                                  padding: "16px 20px",
                                  color: "#4a5568",
                                  borderBottom: "1px solid #e2e8f0",
                                  fontSize: "15px",
                                }}
                              >
                                <Actions>
                                  <Image
                                    title="Editar"
                                    onClick={() =>
                                      handleEditarPresidente(presidente)
                                    }
                                    src={Editar}
                                    alt="Editar"
                                    width={25}
                                    height={25}
                                    style={{
                                      cursor:
                                        conselhoSituacao === "nao_tem"
                                          ? "not-allowed"
                                          : "pointer",
                                      opacity:
                                        conselhoSituacao === "nao_tem" ? 0.5 : 1,
                                    }}
                                    {...(conselhoSituacao === "nao_tem"
                                      ? { onClick: (e) => e.preventDefault() }
                                      : {})}
                                  />
                                  <Image
                                    onClick={() => {
                                      if (conselhoSituacao !== "nao_tem") {
                                        handleRemoverPresidente({
                                          id: presidente.id_presidencia_conselho_municipal_saneamento_basico,
                                        });
                                      }
                                    }}
                                    src={Excluir}
                                    alt="Excluir"
                                    width={25}
                                    height={25}
                                    style={{
                                      cursor:
                                        conselhoSituacao === "nao_tem"
                                          ? "not-allowed"
                                          : "pointer",
                                      opacity:
                                        conselhoSituacao === "nao_tem" ? 0.5 : 1,
                                    }}
                                  />
                                </Actions>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={3}
                              style={{
                                padding: "20px",
                                textAlign: "center",
                                color: "#999",
                              }}
                            >
                              Nenhum presidente cadastrado
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ marginTop: "15px" }}>
                    <DivEixo style={{ paddingBottom: "14px" }}>Atualizações</DivEixo>
                    <table
                      cellSpacing={0}
                      style={{
                        width: "98%",
                        borderRadius: "10px",
                        boxShadow: "0 3.8px 5.7px rgba(0, 0, 0, 0.1)",
                        margin: "0 0 20px 20px",
                        borderCollapse: "separate",
                        borderSpacing: 0,
                      }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              background: "#0085bd",
                              color: "#fff",
                              padding: "10px 20px",
                              textAlign: "left",
                              fontWeight: 600,
                              fontSize: "14px",
                              borderTopLeftRadius: "10px",
                            }}
                          >
                            Título
                          </th>
                          <th
                            style={{
                              background: "#0085bd",
                              color: "#fff",
                              padding: "10px 20px",
                              textAlign: "left",
                              fontWeight: 600,
                              fontSize: "14px",
                            }}
                          >
                            Ano
                          </th>
                          <th
                            style={{
                              background: "#0085bd",
                              color: "#fff",
                              padding: "10px 20px",
                              textAlign: "left",
                              fontWeight: 600,
                              fontSize: "14px",
                              borderTopRightRadius: "10px",
                            }}
                          >
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {conselhoMunicipal && conselhoMunicipal.length > 0 ? (
                          conselhoMunicipal.map((conselho, index) => (
                            <tr key={index}>
                              <td
                                style={{
                                  padding: "16px 20px",
                                  color: "#4a5568",
                                  borderBottom: "1px solid #e2e8f0",
                                  fontSize: "15px",
                                }}
                              >
                                <InputG>{conselho.titulo}</InputG>
                              </td>
                              <td
                                style={{
                                  padding: "16px 20px",
                                  color: "#4a5568",
                                  borderBottom: "1px solid #e2e8f0",
                                  fontSize: "15px",
                                }}
                              >
                                {conselho.ano}
                              </td>
                              <td
                                style={{
                                  padding: "16px 20px",
                                  color: "#4a5568",
                                  borderBottom: "1px solid #e2e8f0",
                                  fontSize: "15px",
                                }}
                              >
                                <Actions>
                                  {conselho.file && (
                                    <a
                                      href={conselho.file}
                                      rel="noreferrer"
                                      target="_blank"
                                    >
                                      <FaFilePdf></FaFilePdf>
                                    </a>
                                  )}
                                  <Image
                                    src={Excluir}
                                    alt="Excluir"
                                    width={25}
                                    height={25}
                                    onClick={() => {
                                      handleRemoverConselho({
                                        id: conselho.id_conselho_municipal_saneamento_basico,
                                      });
                                    }}
                                  />
                                </Actions>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={3}
                              style={{
                                padding: "20px",
                                textAlign: "center",
                                color: "#999",
                              }}
                            >
                              Nenhum conselho cadastrado
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </TablesContainer>
              </div>
            </Form>
            <div style={{ display: activeTabConselho === "dadosComplementaresConselho" ? "block" : "none" }} suppressHydrationWarning>
              <Form style={{ backgroundColor: "white" }} onSubmit={handleSubmitIndicadoresConselho(handleCadastroIndicadoresConselho)}>

                <div
                  style={{ width: "97%", padding: "20px", borderBottom: "1px solid #eee" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <label style={{ width: "250px", marginRight: "10px" }}>Selecionar Ano:</label>
                      <select
                        value={anoSelectedConselho || ""}
                        onChange={(e) => selectAnoConselho(e.target.value)}
                        disabled={loadingDadosConselho}
                        style={{ padding: "5px" }}
                      >
                        <option value="">Selecione o ano</option>
                        {anosSelect().map((ano) => (
                          <option key={ano} value={ano}>
                            {ano}
                          </option>
                        ))}
                      </select>
                      {loadingDadosConselho && (
                        <span style={{ marginLeft: "10px", color: "#12B2D5", whiteSpace: "nowrap" }}>
                          Carregando dados...
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: "14px", color: "#666" }}>
                      <strong>{indicadoresConselho.length}</strong> indicador
                      {indicadoresConselho.length !== 1 ? "es" : ""} encontrado
                      {indicadoresConselho.length !== 1 ? "s" : ""}
                      {indicadoresConselho.some((ind) => ind._hasError) && (
                        <span style={{ color: "#dc3545", marginLeft: "10px" }}>
                          | ⚠️ Alguns campos com erro
                        </span>
                      )}
                      {dadosCarregadosConselho.length > 0 && (
                        <span style={{ color: "#28a745", marginLeft: "10px" }}>
                          | ✅ {dadosCarregadosConselho.length} dado
                          {dadosCarregadosConselho.length !== 1 ? "s" : ""} carregado
                          {dadosCarregadosConselho.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    {grupoConselho &&
                      !loadingIndicadoresConselho &&
                      indicadoresConselho.some((ind) => ind._hasError) && (
                        <button
                          type="button"
                          onClick={() => {
                            const menuItem = menuItemsConselho.find(
                              (item) => item.nome_menu_item === grupoConselho
                            );
                            if (menuItem) {
                              getIndicadoresConselho(menuItem);
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

                {!grupoConselho ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <p>Carregando indicadores...</p>
                  </div>
                ) : loadingIndicadoresConselho ? (
                  <div style={{ textAlign: "center", padding: "40px" }}>
                    <p>Carregando indicadores...</p>
                  </div>
                ) : indicadoresConselho.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px" }}>
                    <p>Nenhum indicador encontrado para este grupo.</p>
                  </div>
                ) : (
                  <div
                    suppressHydrationWarning
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      overflow: "hidden",
                      marginTop: "20px",
                      width: "97%",
                    }}
                  >
                    {/* Cabeçalho da Tabela */}
                    <div
                      suppressHydrationWarning
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
                            isMounted && innerWidth > 768
                              ? "180px 1fr 280px 100px"
                              : "1fr",
                          gap: isMounted && innerWidth > 768 ? "15px" : "10px",
                          alignItems: "center",
                          padding: "0 15px",
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: "14px",
                        }}
                        suppressHydrationWarning
                      >
                        {isMounted && innerWidth > 768 ? (
                          <>
                            <div suppressHydrationWarning>CÓDIGO</div>
                            <div suppressHydrationWarning>DESCRIÇÃO DO INDICADOR</div>
                            <div suppressHydrationWarning style={{ textAlign: "center" }}>
                              VALOR - ANO: {anoSelectedConselho || "____"}
                            </div>
                            <div suppressHydrationWarning style={{ textAlign: "center" }}>
                              UNIDADE
                            </div>
                          </>
                        ) : (
                          <div suppressHydrationWarning>
                            INDICADORES - ANO: {anoSelectedConselho || "____"}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Linhas da Tabela */}
                    {indicadoresConselho.map((indicador, index) => {
                      const tipoCampo =
                        indicador.tiposCampo &&
                          indicador.tiposCampo.length > 0
                          ? indicador.tiposCampo[0]
                          : null;
                      const isEven = index % 2 === 0;

                      return (
                        <div
                          key={indicador.id_indicador}
                          suppressHydrationWarning
                          style={{
                            backgroundColor: isEven ? "#f8f9fa" : "#ffffff",
                            borderBottom:
                              index < indicadoresConselho.length - 1
                                ? "1px solid #dee2e6"
                                : "none",
                            padding: "15px 0",
                            transition: "background-color 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#e8f4fd";
                            e.currentTarget.style.borderLeft = "3px solid #1e88e5";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isEven
                              ? "#f8f9fa"
                              : "#ffffff";
                            e.currentTarget.style.borderLeft = "none";
                          }}
                        >
                          {isMounted && innerWidth > 768 ? (
                            <div
                              suppressHydrationWarning
                              style={{
                                display: "grid",
                                gridTemplateColumns: "180px 1fr 280px 100px",
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
                                {anoSelectedConselho ? (
                                  <div style={{ width: "260px" }}>
                                    <CampoIndicadorConselho
                                      indicador={indicador}
                                      register={registerIndicadoresConselho}
                                      anoSelected={anoSelectedConselho}
                                      setValue={setValueIndicadoresConselho}
                                      watch={watchIndicadoresConselho}
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
                              suppressHydrationWarning
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

                              {anoSelectedConselho ? (
                                <CampoIndicadorConselho
                                  indicador={indicador}
                                  register={registerIndicadoresConselho}
                                  anoSelected={anoSelectedConselho}
                                  setValue={setValueIndicadoresConselho}
                                  watch={watchIndicadoresConselho}
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

                {indicadoresConselho.length > 0 && anoSelectedConselho && (
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

              </Form>
            </div>
          </DivFormCadastro>

          <Form onSubmit={handleSubmitParticipacao(handleAddParticipacao)}>
            <DivFormCadastro active={activeForm === "participacaoSocial"} suppressHydrationWarning>
              <DivTituloForm>Participação e Controle Social</DivTituloForm>
              <table
                style={{
                  width: "97%",
                  borderRadius: "10px",
                  border: "1px solid #eee",
                  boxShadow: "0 3.8px 5.7px rgba(0, 0, 0, 0.1)",
                  margin: "0 0 20px 20px",
                  padding: "15px",
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ width: "40%", padding: "10px" }}>

                      <label>Titulo</label>
                      <input
                        style={{ width: "100%" }}
                        {...registerParticipacao("pcs_titulo")}
                        onChange={(e) => {
                          const value = capitalizeFrasal(e.target.value);
                          setValueParticipacao("pcs_titulo", value);
                        }}
                        type="text"
                        onKeyPress={onlyLettersAndCharacters}
                      ></input>
                    </td>
                    <td style={{ width: "10%", padding: "10px" }}>
                      <label>Ano</label>
                      <input
                        style={{ width: "100%" }}
                        {...registerParticipacao("pcs_ano")}
                        type="text"
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        onChange={(e) => {
                          setValueParticipacao("pcs_ano", e.target.value);
                        }}
                      ></input>

                    </td>
                    <td style={{ width: "30%", padding: "10px" }}>

                      <label>Arquivo</label>
                      <input style={{ width: "100%" }} {...registerParticipacao("pcs_arquivo")} type="file"></input>

                    </td>
                    <td style={{ textAlign: "right", width: "10%" }}>
                      {usuario?.id_permissao !== 4 && (
                        <button
                          type="submit"
                          style={{
                            padding: "12px 24px",
                            fontSize: "14px",
                            fontWeight: "500",
                            borderRadius: "6px",
                            transition: "all 0.2s",
                            backgroundColor: "#0085bd",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Gravar
                        </button>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>



              <DivEixo>Atualizações</DivEixo>

              <table
                cellSpacing={0}
                style={{
                  width: "98%",
                  borderRadius: "10px",
                  boxShadow: "0 3.8px 5.7px rgba(0, 0, 0, 0.1)",
                  margin: "0 0 20px 20px",
                  borderCollapse: "separate",
                  borderSpacing: 0,
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        background: "#0085bd",
                        color: "#fff",
                        padding: "10px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                        borderTopLeftRadius: "10px",
                      }}
                    >
                      ID
                    </th>
                    <th
                      style={{
                        background: "#0085bd",
                        color: "#fff",
                        padding: "10px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      Título
                    </th>
                    <th
                      style={{
                        background: "#0085bd",
                        color: "#fff",
                        padding: "10px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      Ano
                    </th>
                    <th
                      style={{
                        background: "#0085bd",
                        color: "#fff",
                        padding: "10px 20px",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "14px",
                        borderTopRightRadius: "10px",
                      }}
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {listParticipacoes && listParticipacoes.length > 0 ? (
                    listParticipacoes.map((participacao, index) => (
                      <tr key={index}>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#4a5568",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "15px",
                          }}
                        >
                          {participacao.id_participacao_controle_social}
                        </td>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#4a5568",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "15px",
                          }}
                        >
                          <InputG>{participacao.titulo}</InputG>
                        </td>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#4a5568",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "15px",
                          }}
                        >
                          {participacao.ano}
                        </td>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#4a5568",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "15px",
                          }}
                        >
                          <Actions>
                            <Image
                              title="Editar"
                              onClick={() =>
                                handleEditarParticipacao(participacao)
                              }
                              src={Editar}
                              alt="Editar"
                              width={25}
                              height={25}
                            />
                            <a
                              href={participacao.file}
                              rel="noreferrer"
                              target="_blank"
                            >
                              <FaFilePdf></FaFilePdf>
                            </a>
                            <Image
                              src={Excluir}
                              alt="Excluir"
                              width={25}
                              height={25}
                              onClick={() =>
                                handleRemoverParticipacao({
                                  id: participacao.id_participacao_controle_social,
                                  id_arquivo: participacao.id_arquivo,
                                })
                              }
                            />
                          </Actions>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        style={{
                          padding: "20px",
                          textAlign: "center",
                          color: "#999",
                        }}
                      >
                        Nenhuma participação cadastrada
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </DivFormCadastro>
          </Form>

          <Form onSubmit={handleSubmitSR(handleAddSaneamentoRural)}>
            <DivFormCadastro
              active={activeForm === "saneamentoRural"}
              style={{
                minWidth: typeof window !== "undefined" && isMounted && innerWidth > 0 && innerWidth <= 1000 ? "95%" : "1045px",
                minHeight: "380px",
              }}
              suppressHydrationWarning
            >
              <DivTituloForm
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                Saneamento Rural
                <Actions>
                  <Tooltip>
                    <Image
                      src={ajuda}
                      alt="Ajuda"
                      width={20}
                      height={20}
                      style={{ cursor: "pointer" }}
                    />
                    <TooltipText>
                      Insira informações sobre o saneamento rural, como por
                      exemplo: informações sobre população rural, situação atual
                      dos serviços de saneamento, aspectos ambientais, etc.
                    </TooltipText>
                  </Tooltip>
                </Actions>
              </DivTituloForm>
              <DivTextArea>
                <label style={{ margin: "10px 0 0 30px" }}>Breve Descrição</label>
                <textarea
                  style={{ width: "95%", margin: "10px 0 0 30px" }}
                  ref={txtArea}
                  {...registerSR("sr_descricao")}
                  onChange={(e) => {
                    setValueSR("sr_descricao", e.target.value);
                  }}
                // required
                ></textarea>
              </DivTextArea>

              <SubmitButtonContainer
                style={{
                  bottom: "-50px",
                  right: "-10px",
                }}
              >
                {usuario?.id_permissao !== 4 && (
                  <SubmitButton type="submit">Gravar</SubmitButton>
                )}
              </SubmitButtonContainer>
            </DivFormCadastro>
          </Form>

          <Form onSubmit={handleSubmitCT(handleAddComunidadesTradicionais)}>
            <DivFormCadastro
              active={activeForm === "comunidadesTradicionais"}
              style={{
                minWidth: typeof window !== "undefined" && isMounted && innerWidth > 0 && innerWidth <= 1000 ? "95%" : "1045px",
                height: "658px",
              }}
              suppressHydrationWarning
            >
              <DivTituloForm
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                Comunidades Tradicionais
                <Actions>
                  <Tooltip>
                    <Image
                      src={ajuda}
                      alt="Ajuda"
                      width={20}
                      height={20}
                      style={{ cursor: "pointer" }}
                    />
                    <TooltipText>
                      Insira informações sobre as comunidades tradicionais, como
                      por exemplo: condições da infraestrutura e serviços de
                      saneamento nessas comunidades.
                    </TooltipText>
                  </Tooltip>
                </Actions>
              </DivTituloForm>

              <DivTextArea>
                <label style={{ margin: "10px 0 0 30px" }}>Nome das Comunidades Beneficiadas</label>

                <textarea
                  style={{ width: "95%", margin: "10px 0 0 30px" }}
                  ref={txtArea}
                  {...registerCT("ct_nomes_comunidades")}
                // required
                ></textarea>

                <label style={{ margin: "10px 0 0 30px" }}>Breve Descrição</label>

                <textarea
                  style={{ width: "95%", margin: "10px 0 0 30px" }}
                  ref={txtArea}
                  {...registerCT("ct_descricao")}
                // required
                ></textarea>
              </DivTextArea>

              <SubmitButtonContainer
                style={{
                  bottom: "-50px",
                  right: "-10px",
                }}
              >
                {usuario?.id_permissao !== 4 && (
                  <SubmitButton type="submit">Gravar</SubmitButton>
                )}
              </SubmitButtonContainer>
            </DivFormCadastro>
          </Form>

          {isDynamicMenuItemActive && ( 
            <Form  onSubmit={handleSubmitIndicadores(handleCadastroIndicadores)}>
              <DivTituloForm style={{ margin: 0 }}  >{grupo}</DivTituloForm>

              <div
                style={{ width: "97%", padding: "20px", borderBottom: "1px solid #eee" }}
                suppressHydrationWarning
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    flexWrap: "wrap",
                    
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
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
                        width: "97%",
                        margin: "20px 20px",
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
                              isMounted && innerWidth > 768
                                ? "180px 1fr 280px 100px"
                                : "1fr",
                            gap: isMounted && innerWidth > 768 ? "15px" : "10px",
                            alignItems: "center",
                            padding: "0 15px",
                          }}
                          suppressHydrationWarning
                        >
                          {isMounted && innerWidth > 768 ? (
                            <>
                              <div suppressHydrationWarning>CÓDIGO</div>
                              <div suppressHydrationWarning>DESCRIÇÃO DO INDICADOR</div>
                              <div suppressHydrationWarning style={{ textAlign: "center" }}>
                                VALOR - ANO: {anoSelected || "____"}
                              </div>
                              <div suppressHydrationWarning style={{ textAlign: "center" }}>
                                UNIDADE
                              </div>
                            </>
                          ) : (
                            <div suppressHydrationWarning>
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
                            {isMounted && innerWidth > 768 ? (
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns:
                                    "180px 1fr 280px 100px",
                                  gap: "15px",
                                  alignItems: "center",
                                  padding: "0 15px",
                                }}
                                suppressHydrationWarning
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
             

            </Form>
          )}


          {ShowModalPresidente && (
            <ContainerModal>
              <Modal>
                <Form
                  onSubmit={handleSubmit(
                    updatePresidente
                      ? updatePresidenteConselho
                      : handleAddPresidente
                  )}
                >
                  <CloseModalButton
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCloseModalPresidente();
                    }}
                  >
                    X
                  </CloseModalButton>
                  <ConteudoModal>
                    <InputG>
                      <label>
                        Nome<span> *</span>
                      </label>
                      <input
                        {...register("nome_presidente", {
                          required: "O nome é obrigatório",
                        })}
                        onKeyPress={onlyLettersAndCharacters}
                        style={{ textTransform: "capitalize" }}
                        onChange={(e) => {
                          const value = toTitleCase(e.target.value);
                          setValue("nome_presidente", value);
                        }}
                        type="text"
                      ></input>
                    </InputG>
                    {errors.nome_presidente && (
                      <span>{errors.nome_presidente.message}</span>
                    )}
                    <InputP>
                      <label>
                        Telefone<span> *</span>
                      </label>
                      <Controller
                        name="telefone_presidente"
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
                              onChange={(e) => onChange(e.target.value)}
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
                    {errors.telefone_presidente && (
                      <span>{errors.telefone_presidente.message}</span>
                    )}
                    <InputP>
                      <label>
                        Email<span> *</span>
                      </label>
                      <input
                        {...register("email_presidente", {
                          required: "O email é obrigatório",
                        })}
                        // defaultValue={dadosGestao?.ga_telefone}
                        onChange={handleOnChange}
                        type="text"
                      ></input>
                    </InputP>
                    {errors.email_presidente && (
                      <span>{errors.email_presidente.message}</span>
                    )}
                    <InputM>
                      <label>
                        Setor Responsável<span> *</span>
                      </label>
                      <input
                        {...register("setor_responsavel", {
                          required: "O setor é obrigatório",
                        })}
                        onKeyPress={onlyLettersAndCharacters}
                        style={{ textTransform: "capitalize" }}
                        onChange={(e) => {
                          const value = toTitleCase(e.target.value);
                          setValue("setor_responsavel", value);
                        }}
                        type="text"
                      ></input>
                    </InputM>
                    {errors.setor_responsavel && (
                      <span>{errors.setor_responsavel.message}</span>
                    )}
                    <InputG>
                      <label>
                        Integrantes<span> *</span>
                      </label>
                      <input
                        {...register("integrantes", {
                          required: "Os integrantes são obrigatórios",
                        })}
                        style={{ textTransform: "capitalize" }}
                        onChange={(e) => {
                          const value = toTitleCase(e.target.value);
                          setValue("integrantes", value);
                        }}
                        type="text"
                      ></input>
                    </InputG>
                    {errors.integrantes && (
                      <span>{errors.integrantes.message}</span>
                    )}
                    <ModalSubmitButton type="submit">Gravar</ModalSubmitButton>
                  </ConteudoModal>
                </Form>
              </Modal>
            </ContainerModal>
          )}

          {showModalPolitica && (
            <ContainerModal>
              <Modal>
                <Form
                  onSubmit={handleSubmit(
                    updatePolitica
                      ? updatePoliticaMunicipal
                      : handleAddRepresentante
                  )}
                >
                  <CloseModalButton
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCloseModal();
                    }}
                  >
                    X
                  </CloseModalButton>

                  <ConteudoModal>
                    <InputG>
                      <label>
                        Título<span> *</span>
                      </label>
                      <input
                        {...register("politica_titulo", {
                          required: "O título é obrigatório",
                        })}
                        onKeyPress={onlyLettersAndCharacters}
                        type="text"
                        onChange={(e) => {
                          const value = capitalizeFrasal(e.target.value);
                          setValue("politica_titulo", value);
                        }}
                        disabled={politicaSituacao === "nao_tem"}
                      ></input>
                    </InputG>
                    {errors.politica_titulo && (
                      <span>{errors.politica_titulo.message}</span>
                    )}
                    <InputP>
                      <label>
                        Ano<span> *</span>
                      </label>
                      <input
                        {...register("politica_ano", {
                          required: "O ano é obrigatório",
                          pattern: {
                            value: /^[0-9]{4}$/,
                            message: "Digite um ano válido com 4 dígitos",
                          },
                        })}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        type="text"
                        maxLength={4}
                        onChange={(e) => {
                          // Remove qualquer caractere que não seja número
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          setValue("politica_ano", value);
                        }}
                        disabled={politicaSituacao === "nao_tem"}
                      ></input>
                    </InputP>
                    {errors.politica_ano && (
                      <span>{errors.politica_ano.message}</span>
                    )}

                    <ModalSubmitButton
                      type="submit"
                      disabled={politicaSituacao === "nao_tem"}
                      style={{
                        opacity: politicaSituacao === "nao_tem" ? 0.5 : 1,
                      }}
                    >
                      Gravar
                    </ModalSubmitButton>
                  </ConteudoModal>
                </Form>
              </Modal>
            </ContainerModal>
          )}
          {showModal && (
            <ContainerModal>
              <Modal>
                <Form
                  onSubmit={handleSubmit(
                    updateRepresentantes
                      ? updateRepresentantesServicos
                      : handleAddRepresentante
                  )}
                  suppressHydrationWarning
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      padding: "24px 32px",

                    }}
                    suppressHydrationWarning
                  >
                    <h2
                      style={{
                        margin: 0,
                        color: "#006d9a",
                        fontSize: "20px",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <FaUser style={{ fontSize: "18px" }} />
                      {updateRepresentantes
                        ? "Editar Representante"
                        : "Adicionar Representante"}
                    </h2>

                  </div>
                  <ConteudoModal
                    style={{
                      padding: "32px",
                      background: "#f8fafc",
                      width: "92%",
                      marginBottom: "20px",
                      border: "1px solid #e2e8f0",
                    }}
                    suppressHydrationWarning
                  >
                    <CloseModalButton
                      onClick={() => {
                        handleCloseModal();
                      }}
                      style={{
                        background: "red",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        width: "36px",
                        height: "36px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        fontSize: "18px",
                        padding: 0,
                        marginRight: "40px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "red";
                        e.currentTarget.style.transform = "rotate(90deg)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "red";
                        e.currentTarget.style.transform = "rotate(0deg)";
                      }}
                    >
                      <FaTimes />
                    </CloseModalButton>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                        marginBottom: "8px",
                      }}
                      suppressHydrationWarning
                    >
                      <InputG
                        style={{
                          marginBottom: 0,
                        }}
                      >
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "#2d3748",
                            fontWeight: "500",
                            fontSize: "14px",
                            marginBottom: "8px",
                          }}
                        >
                          <FaUser style={{ color: "#0085bd", fontSize: "14px" }} />
                          Nome<span style={{ color: "#e53e3e" }}> *</span>
                        </label>
                        <input
                          {...register("ga_nome_representante", {
                            required: "O nome é obrigatório",
                          })}
                          onKeyPress={onlyLettersAndCharacters}
                          type="text"
                          placeholder="Digite o nome completo"
                          onChange={(e) => {
                            const value = capitalizeFrasal(e.target.value);
                            setValue("ga_nome_representante", value);
                          }}
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "2px solid #e2e8f0",
                            borderRadius: "8px",
                            fontSize: "14px",
                            color: "#2d3748",
                            transition: "all 0.2s ease",
                            background: "#fff",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#0085bd";
                            e.target.style.boxShadow = "0 0 0 3px rgba(0, 133, 189, 0.1)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "#e2e8f0";
                            e.target.style.boxShadow = "none";
                          }}
                        ></input>
                      </InputG>
                      {errors.ga_nome_representante && (
                        <span
                          style={{
                            color: "#e53e3e",
                            fontSize: "12px",
                            marginTop: "-16px",
                            display: "block",
                          }}
                        >
                          {errors.ga_nome_representante.message}
                        </span>
                      )}

                      <InputG
                        style={{
                          marginBottom: 0,
                        }}
                      >
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "#2d3748",
                            fontWeight: "500",
                            fontSize: "14px",
                            marginBottom: "8px",
                          }}
                        >
                          <FaBriefcase style={{ color: "#0085bd", fontSize: "14px" }} />
                          Cargo<span style={{ color: "#e53e3e" }}> *</span>
                        </label>
                        <input
                          {...register("ga_cargo", {
                            required: "O cargo é obrigatório",
                          })}
                          onKeyPress={onlyLettersAndCharacters}
                          type="text"
                          placeholder="Digite o cargo"
                          onChange={(e) => {
                            const value = capitalizeFrasal(e.target.value);
                            setValue("ga_cargo", value);
                          }}
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "2px solid #e2e8f0",
                            borderRadius: "8px",
                            fontSize: "14px",
                            color: "#2d3748",
                            transition: "all 0.2s ease",
                            background: "#fff",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#0085bd";
                            e.target.style.boxShadow = "0 0 0 3px rgba(0, 133, 189, 0.1)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "#e2e8f0";
                            e.target.style.boxShadow = "none";
                          }}
                        ></input>
                      </InputG>
                      {errors.ga_cargo && (
                        <span
                          style={{
                            color: "#e53e3e",
                            fontSize: "12px",
                            marginTop: "-16px",
                            display: "block",
                          }}
                        >
                          {errors.ga_cargo.message}
                        </span>
                      )}

                      <InputP
                        style={{
                          marginBottom: 0,
                        }}
                      >
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "#2d3748",
                            fontWeight: "500",
                            fontSize: "14px",
                            marginBottom: "8px",
                          }}
                        >
                          <FaPhone style={{ color: "#0085bd", fontSize: "14px" }} />
                          Telefone<span style={{ color: "#e53e3e" }}> *</span>
                        </label>
                        <Controller
                          name="ga_telefone"
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
                                  <PhoneInput
                                    {...inputProps}
                                    type="text"
                                    placeholder="(00) 00000-0000"
                                  />
                                )}
                              </InputMask>
                              {error && (
                                <span
                                  style={{
                                    color: "#e53e3e",
                                    fontSize: "12px",
                                    marginTop: "4px",
                                    display: "block",
                                  }}
                                >
                                  {error.message}
                                </span>
                              )}
                            </>
                          )}
                        />
                      </InputP>

                      <InputM
                        style={{
                          marginBottom: 0,
                        }}
                      >
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "#2d3748",
                            fontWeight: "500",
                            fontSize: "14px",
                            marginBottom: "8px",
                          }}
                        >
                          <FaEnvelope style={{ color: "#0085bd", fontSize: "14px" }} />
                          Email<span style={{ color: "#e53e3e" }}> *</span>
                        </label>
                        <input
                          {...register("ga_email", {
                            required: "O email é obrigatório",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Email inválido",
                            },
                          })}
                          defaultValue={dadosGestao?.ga_email}
                          onChange={handleOnChange}
                          type="email"
                          placeholder="exemplo@email.com"
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "2px solid #e2e8f0",
                            borderRadius: "8px",
                            fontSize: "14px",
                            color: "#2d3748",
                            transition: "all 0.2s ease",
                            background: "#fff",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#0085bd";
                            e.target.style.boxShadow = "0 0 0 3px rgba(0, 133, 189, 0.1)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "#e2e8f0";
                            e.target.style.boxShadow = "none";
                          }}
                        ></input>
                        {errors.ga_email && (
                          <span
                            style={{
                              color: "#e53e3e",
                              fontSize: "12px",
                              marginTop: "4px",
                              display: "block",
                            }}
                          >
                            {errors.ga_email.message}
                          </span>
                        )}
                      </InputM>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "12px",
                        marginTop: "32px",
                        paddingTop: "24px",
                        borderTop: "1px solid #e2e8f0",
                      }}
                    >
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        style={{
                          padding: "12px 24px",
                          fontSize: "14px",
                          fontWeight: "500",
                          borderRadius: "8px",
                          border: "2px solid #e2e8f0",
                          background: "#fff",
                          color: "#64748b",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#cbd5e0";
                          e.currentTarget.style.color = "#475569";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#e2e8f0";
                          e.currentTarget.style.color = "#64748b";
                        }}
                      >
                        Cancelar
                      </button>
                      <ModalSubmitButton
                        type="submit"
                        style={{
                          padding: "12px 32px",
                          fontSize: "14px",
                          fontWeight: "600",
                          borderRadius: "8px",
                          background: "linear-gradient(135deg, #0085bd 0%, #006d9a 100%)",
                          color: "#fff",
                          border: "none",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          boxShadow: "0 4px 6px rgba(0, 133, 189, 0.2)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 133, 189, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 133, 189, 0.2)";
                        }}
                      >
                        {updateRepresentantes ? "Atualizar" : "Salvar"}
                      </ModalSubmitButton>
                    </div>
                  </ConteudoModal>
                </Form>
              </Modal>
            </ContainerModal>
          )}
          {showModalPlano && (
            <ContainerModal>
              <Modal>
                <Form
                  onSubmit={handleSubmit(
                    updatePlano ? handleCadastro : handleAddPlano
                  )}
                >
                  <CloseModalButton
                    onClick={() => {
                      setShowModalPlano(false);
                    }}
                  >
                    X
                  </CloseModalButton>

                  <ConteudoModal>
                    <InputG>
                      <label>
                        Título<span> *</span>
                      </label>
                      <input
                        {...register("plano_titulo", {
                          required: "O título é obrigatório",
                        })}
                        onKeyPress={onlyLettersAndCharacters}
                        type="text"
                        onChange={(e) => {
                          const value = capitalizeFrasal(e.target.value);
                          setValue("plano_titulo", value);
                        }}
                        disabled={planoSituacao === "nao_tem"}
                      ></input>
                    </InputG>
                    {errors.plano_titulo && (
                      <span>{errors.plano_titulo.message}</span>
                    )}
                    <InputP>
                      <label>
                        Ano<span> *</span>
                      </label>
                      <input
                        {...register("plano_ano", {
                          required: "O ano é obrigatório",
                          pattern: {
                            value: /^[0-9]{4}$/,
                            message: "Digite um ano válido com 4 dígitos",
                          },
                        })}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        type="text"
                        maxLength={4}
                        onChange={(e) => {
                          // Remove qualquer caractere que não seja número
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          setValue("plano_ano", value);
                        }}
                        disabled={planoSituacao === "nao_tem"}
                      ></input>
                    </InputP>
                    {errors.plano_ano && (
                      <span>{errors.plano_ano.message}</span>
                    )}

                    <ModalSubmitButton
                      type="submit"
                      disabled={planoSituacao === "nao_tem"}
                      style={{
                        opacity: planoSituacao === "nao_tem" ? 0.5 : 1,
                      }}
                    >
                      Gravar
                    </ModalSubmitButton>
                  </ConteudoModal>
                </Form>
              </Modal>
            </ContainerModal>
          )}
          {showModalParticipacao && (
            <ContainerModal>
              <Modal>
                <Form
                  onSubmit={handleSubmit(
                    updateParticipacao
                      ? updateParticipacaoControleSocial
                      : handleAddParticipacao
                  )}
                >
                  <CloseModalButton
                    onClick={() => {
                      setShowModalParticipacao(false);
                    }}
                  >
                    X
                  </CloseModalButton>

                  <ConteudoModal>
                    <InputG>
                      <label>
                        Título<span> *</span>
                      </label>
                      <input
                        {...register("pcs_titulo", {
                          required: "O título é obrigatório",
                        })}
                        onKeyPress={onlyLettersAndCharacters}
                        type="text"
                        onChange={(e) => {
                          const value = capitalizeFrasal(e.target.value);
                          setValue("pcs_titulo", value);
                        }}
                      ></input>
                    </InputG>
                    {errors.pcs_titulo && (
                      <span>{errors.pcs_titulo.message}</span>
                    )}
                    <InputP>
                      <label>
                        Ano<span> *</span>
                      </label>
                      <input
                        {...register("pcs_ano", {
                          required: "O ano é obrigatório",
                          pattern: {
                            value: /^[0-9]{4}$/,
                            message: "Digite um ano válido com 4 dígitos",
                          },
                        })}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        type="text"
                        maxLength={4}
                        onChange={(e) => {
                          // Remove qualquer caractere que não seja número
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          setValue("pcs_ano", value);
                        }}
                      ></input>
                    </InputP>
                    {errors.pcs_ano && <span>{errors.pcs_ano.message}</span>}

                    <ModalSubmitButton type="submit">Gravar</ModalSubmitButton>
                  </ConteudoModal>
                </Form>
              </Modal>
            </ContainerModal>
          )}
        </DivCenter>
      </MainContent>
    </Container>
  );
}
