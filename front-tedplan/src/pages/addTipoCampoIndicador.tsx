import {} from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { toast, ToastContainer } from "react-nextjs-toast";

import {
  Container,
  Form,
  Footer,
  DivCenter,
  DivInstrucoes,
} from "../styles/dashboard";

import { SubmitButton } from "../styles/dashboard-original";

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
    formState: { errors },
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
      toast.notify("Erro ao carregar dados do tipo de campo!", {
        title: "Erro!",
        duration: 7,
        type: "error",
      });
    }
  }

  async function handleAddTipoCampo({
    name_campo,
    type,
    id_campo,
    enable,
    default_value,
  }) {
    try {
      const apiClient = getAPIClient();
      
      const tipoCampoData = {
        name_campo,
        type,
        id_campo: id_campo || null,
        enable: enable || false,
        default_value: default_value || null,
      };

      if (isEditing && tipoCampoId) {
        // Atualizar tipo de campo existente
        await apiClient.put(`/tipos-campo/${tipoCampoId}`, tipoCampoData);
        toast.notify("Tipo de campo atualizado com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
      } else {
        // Criar novo tipo de campo
        await apiClient.post("/tipos-campo", tipoCampoData);
        toast.notify("Tipo de campo cadastrado com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
      }

      reset({
        name_campo: "",
        type: "",
        id_campo: "",
        enable: true,
        default_value: "",
      });

      setTimeout(() => {
        router.push("/listarTiposCampo");
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar tipo de campo:", error);
      toast.notify("Erro ao salvar tipo de campo!", {
        title: "Erro!",
        duration: 7,
        type: "error",
      });
    }
  }

  return (
    <Container>
      <MenuSuperior usuarios={[]}></MenuSuperior>

      <DivCenter>
        <DivInstrucoes>
          <b>{isEditing ? "Editar Tipo de Campo:" : "Cadastro de Tipo de Campo:"}</b>
        </DivInstrucoes>
        <Form onSubmit={handleSubmit(handleAddTipoCampo)}>
          <label>Nome do Campo *</label>
          <input
            aria-invalid={errors.name_campo ? "true" : "false"}
            {...register("name_campo", { required: true })}
            type="text"
            placeholder="Nome do campo (ex: Título, Descrição, etc.)"
            name="name_campo"
          />
          {errors.name_campo && errors.name_campo.type === "required" && (
            <span>O campo Nome do Campo é obrigatório!</span>
          )}

          <label>Tipo de Campo *</label>
          <select
            aria-invalid={errors.type ? "true" : "false"}
            {...register("type", { required: true })}
            name="type"
          >
            <option value="">Selecione o tipo de campo</option>
            {tiposCampo.map((tipo, key) => (
              <option key={key} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
          {errors.type && errors.type.type === "required" && (
            <span>Selecionar o tipo de campo é obrigatório!</span>
          )}

          <label>ID do Campo</label>
          <input
            {...register("id_campo")}
            type="text"
            placeholder="ID único do campo (opcional, será gerado automaticamente se vazio)"
            name="id_campo"
          />

          <label>Valor Padrão</label>
          {watchType === "textarea" ? (
            <textarea
              {...register("default_value")}
              placeholder="Valor padrão do campo (opcional)"
              name="default_value"
              rows={3}
            />
          ) : (
            <input
              {...register("default_value")}
              type={watchType === "number" ? "number" : "text"}
              placeholder="Valor padrão do campo (opcional)"
              name="default_value"
            />
          )}

          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              {...register("enable")}
              type="checkbox"
              name="enable"
              defaultChecked={true}
            />
            Campo Ativo
          </label>

          <SubmitButton type="submit">
            {isEditing ? "Atualizar" : "Gravar"}
          </SubmitButton>
        </Form>
      </DivCenter>
      <Footer>
        &copy; Todos os direitos reservados<ToastContainer></ToastContainer>
      </Footer>
    </Container>
  );
}
