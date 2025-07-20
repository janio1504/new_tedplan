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
    formState: { errors },
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
      toast.notify("Erro ao carregar dados do menu!", {
        title: "Erro!",
        duration: 7,
        type: "error",
      });
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
        id_modulo: id_modulo ? parseInt(id_modulo) : null,
        id_eixo: id_eixo ? parseInt(id_eixo) : null,
      };

      if (isEditing && menuId) {
        // Atualizar menu existente
        await apiClient.put(`/menus/${menuId}`, menuData);
        toast.notify("Menu atualizado com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
      } else {
        // Criar novo menu
        await apiClient.post("/menus", menuData);
        toast.notify("Menu cadastrado com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
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
      toast.notify("Erro ao salvar menu!", {
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
          <b>{isEditing ? "Editar Menu:" : "Cadastro de Menu:"}</b>
        </DivInstrucoes>
        <Form onSubmit={handleSubmit(handleAddMenu)}>
          <label>Título *</label>
          <input
            aria-invalid={errors.titulo ? "true" : "false"}
            {...register("titulo", { required: true })}
            type="text"
            placeholder="Título do menu"
            name="titulo"
          />
          {errors.titulo && errors.titulo.type === "required" && (
            <span>O campo Título é obrigatório!</span>
          )}

          <label>Descrição</label>
          <textarea
            {...register("descricao")}
            placeholder="Descrição do menu (opcional)"
            name="descricao"
            rows={3}
          />

          <label>Módulo</label>
          <select
            {...register("id_modulo")}
            name="id_modulo"
          >
            <option value="">Selecione um módulo (opcional)</option>
            {modulosData?.map((modulo, key) => (
              <option key={key} value={modulo.id_modulo}>
                {modulo.nome}
              </option>
            ))}
          </select>

          <label>Eixo</label>
          <select
            {...register("id_eixo")}
            name="id_eixo"
          >
            <option value="">Selecione um eixo (opcional)</option>
            {eixosData?.map((eixo, key) => (
              <option key={key} value={eixo.id_eixo}>
                {eixo.nome}
              </option>
            ))}
          </select>

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