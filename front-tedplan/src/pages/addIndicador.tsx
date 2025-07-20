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
  id_tipo_campo_indicador: string;
}

interface IMenuItem {
  id_menu_item: string;
  nome_menu_item: string;
  menu: {
    titulo: string;
  };
}

interface ITipoCampo {
  id_tipo_campo_indicador: string;
  name_campo: string;
  type: string;
}

interface IndicadorProps {
  indicador: IIndicador[];
  menuItems: IMenuItem[];
  tiposCampo: ITipoCampo[];
}

export default function AddIndicador({ indicador, menuItems, tiposCampo }: IndicadorProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [menuItemsData, setMenuItemsData] = useState<any>(menuItems);
  const [tiposCampoData, setTiposCampoData] = useState<any>(tiposCampo);
  const [isEditing, setIsEditing] = useState(false);
  const [indicadorId, setIndicadorId] = useState<string | null>(null);
  const router = useRouter();

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
    getTiposCampo();
    
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

  async function getTiposCampo() {
    try {
      console.log("Iniciando carregamento de tipos de campo...");
      const apiClient = getAPIClient();
      
      // Tentar primeiro buscar apenas os ativos
      let resTiposCampo;
      try {
        console.log("Tentando buscar tipos ativos...");
        resTiposCampo = await apiClient.get("/tipos-campo/ativos");
        console.log("Resposta tipos ativos:", resTiposCampo);
      } catch (error) {
        console.log("Falha ao buscar tipos ativos, tentando buscar todos...", error);
        // Se falhar, buscar todos
        resTiposCampo = await apiClient.get("/tipos-campo");
        console.log("Resposta todos os tipos:", resTiposCampo);
      }
      
      console.log("Tipos de campo carregados:", resTiposCampo.data);
      console.log("Quantidade de tipos:", resTiposCampo.data?.length);
      setTiposCampoData(resTiposCampo.data);
    } catch (error) {
      console.error("Erro ao carregar tipos de campo:", error);
      console.error("Detalhes do erro:", error.response?.data);
      toast.notify("Erro ao carregar tipos de campo!", {
        title: "Erro!",
        duration: 7,
        type: "error",
      });
    }
  }

  async function loadIndicadorData(id: string) {
    try {
      const apiClient = getAPIClient();
      const response = await apiClient.get(`/indicadores-novo/${id}`);
      const indicadorData = response.data;
      
      // Preencher o formulário com os dados do indicador
      reset({
        codigo_indicador: indicadorData.codigo_indicador,
        nome_indicador: indicadorData.nome_indicador,
        grupo_indicador: indicadorData.grupo_indicador,
        palavra_chave: indicadorData.palavra_chave,
        unidade_indicador: indicadorData.unidade_indicador,
        formula_calculo_indicador: indicadorData.formula_calculo_indicador,
        informacoes_indicador: indicadorData.informacoes_indicador,
        indicador_correspondente_ou_similar_snis: indicadorData.indicador_correspondente_ou_similar_snis,
        id_menu_item: indicadorData.id_menu_item,
        id_tipo_campo_indicador: indicadorData.id_tipo_campo_indicador,
      });
    } catch (error) {
      console.error("Erro ao carregar dados do indicador:", error);
      toast.notify("Erro ao carregar dados do indicador!", {
        title: "Erro!",
        duration: 7,
        type: "error",
      });
    }
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
    id_tipo_campo_indicador,
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
        id_tipo_campo_indicador: id_tipo_campo_indicador ? parseInt(id_tipo_campo_indicador) : null,
      };

      if (isEditing && indicadorId) {
        // Atualizar indicador existente
        await apiClient.put(`/indicadores-novo/${indicadorId}`, indicadorData);
        toast.notify("Indicador atualizado com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
      } else {
        // Criar novo indicador
        await apiClient.post("/indicadores-novo", indicadorData);
        toast.notify("Indicador cadastrado com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
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
        id_tipo_campo_indicador: "",
      });

      setTimeout(() => {
        router.push("/listarIndicadores");
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar indicador:", error);
      toast.notify("Erro ao salvar indicador!", {
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
          <b>{isEditing ? "Editar Indicador:" : "Cadastro de Indicador:"}</b>
        </DivInstrucoes>
        <Form onSubmit={handleSubmit(handleAddIndicador)}>
          <label>Código do Indicador *</label>
          <input
            aria-invalid={errors.codigo_indicador ? "true" : "false"}
            {...register("codigo_indicador", { required: true })}
            type="text"
            placeholder="Código único do indicador (ex: AG001, ES002)"
            name="codigo_indicador"
          />
          {errors.codigo_indicador && errors.codigo_indicador.type === "required" && (
            <span>O campo Código do Indicador é obrigatório!</span>
          )}

          <label>Nome do Indicador *</label>
          <input
            aria-invalid={errors.nome_indicador ? "true" : "false"}
            {...register("nome_indicador", { required: true })}
            type="text"
            placeholder="Nome completo do indicador"
            name="nome_indicador"
          />
          {errors.nome_indicador && errors.nome_indicador.type === "required" && (
            <span>O campo Nome do Indicador é obrigatório!</span>
          )}

          <label>Grupo do Indicador</label>
          <select
            {...register("grupo_indicador")}
            name="grupo_indicador"
          >
            <option value="">Selecione um grupo (opcional)</option>
            {gruposIndicador.map((grupo, key) => (
              <option key={key} value={grupo}>
                {grupo}
              </option>
            ))}
          </select>

          <label>Item de Menu</label>
          <select
            {...register("id_menu_item")}
            name="id_menu_item"
          >
            <option value="">Selecione um item de menu (opcional)</option>
            {menuItemsData?.map((menuItem, key) => (
              <option key={key} value={menuItem.id_menu_item}>
                {menuItem.menu?.titulo} - {menuItem.nome_menu_item}
              </option>
            ))}
          </select>

          <label>Tipo de Campo</label>
          <select
            {...register("id_tipo_campo_indicador")}
            name="id_tipo_campo_indicador"
          >
            <option value="">Selecione um tipo de campo (opcional)</option>
            {tiposCampoData?.length > 0 ? (
              tiposCampoData.map((tipoCampo, key) => (
                <option key={key} value={tipoCampo.id_tipo_campo_indicador}>
                  {tipoCampo.name_campo} ({tipoCampo.type})
                </option>
              ))
            ) : (
              <option disabled>Nenhum tipo de campo disponível</option>
            )}
          </select>
          {process.env.NODE_ENV === 'development' && (
            <small style={{ color: '#666', fontSize: '12px' }}>
              Debug: {tiposCampoData?.length || 0} tipos carregados
            </small>
          )}

          <label>Unidade do Indicador</label>
          <input
            {...register("unidade_indicador")}
            type="text"
            placeholder="Unidade de medida (ex: %, L/s, R$, etc.)"
            name="unidade_indicador"
          />

          <label>Palavra-chave</label>
          <input
            {...register("palavra_chave")}
            type="text"
            placeholder="Palavras-chave para busca (separadas por vírgula)"
            name="palavra_chave"
          />

          <label>Fórmula de Cálculo</label>
          <textarea
            {...register("formula_calculo_indicador")}
            placeholder="Fórmula matemática para cálculo do indicador"
            name="formula_calculo_indicador"
            rows={3}
          />

          <label>Informações do Indicador</label>
          <textarea
            {...register("informacoes_indicador")}
            placeholder="Descrição detalhada, metodologia, fontes de dados, etc."
            name="informacoes_indicador"
            rows={4}
          />

          <label>Indicador Correspondente SNIS</label>
          <input
            {...register("indicador_correspondente_ou_similar_snis")}
            type="text"
            placeholder="Código do indicador correspondente no SNIS (se aplicável)"
            name="indicador_correspondente_ou_similar_snis"
          />

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
