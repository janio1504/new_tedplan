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

interface IMenuItem {
  id_menu_item: string;
  nome_menu_item: string;
  id_menu: string;
}

interface IMenu {
  id_menu: string;
  titulo: string;
  descricao: string;
}

interface MenuItemProps {
  menuItem: IMenuItem[];
  menus: IMenu[];
}

export default function AddMenuItem({ menuItem, menus }: MenuItemProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [menusData, setMenusData] = useState<any>(menus);
  const [isEditing, setIsEditing] = useState(false);
  const [menuItemId, setMenuItemId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const { ["tedplan.token"]: token } = parseCookies();
    if (!token) {
      Router.push("/login");
    }
    getMenus();
    
    // Verificar se é edição
    if (router.query.id) {
      setIsEditing(true);
      setMenuItemId(router.query.id as string);
      loadMenuItemData(router.query.id as string);
    }
  }, [router.query]);

  async function getMenus() {
    try {
      const apiClient = getAPIClient();
      const resMenus = await apiClient.get("/menus");
      setMenusData(resMenus.data);
    } catch (error) {
      console.error("Erro ao carregar menus:", error);
    }
  }

  async function loadMenuItemData(id: string) {
    try {
      const apiClient = getAPIClient();
      const response = await apiClient.get(`/menu-items/${id}`);
      const menuItemData = response.data;
      
      // Preencher o formulário com os dados do item de menu
      reset({
        nome_menu_item: menuItemData.nome_menu_item,
        id_menu: menuItemData.id_menu,
      });
    } catch (error) {
      console.error("Erro ao carregar dados do item de menu:", error);
      toast.notify("Erro ao carregar dados do item de menu!", {
        title: "Erro!",
        duration: 7,
        type: "error",
      });
    }
  }

  async function handleAddMenuItem({
    nome_menu_item,
    id_menu,
  }) {
    try {
      const apiClient = getAPIClient();
      
      const menuItemData = {
        nome_menu_item,
        id_menu: parseInt(id_menu),
      };

      if (isEditing && menuItemId) {
        // Atualizar item de menu existente
        await apiClient.put(`/menu-items/${menuItemId}`, menuItemData);
        toast.notify("Item de menu atualizado com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
      } else {
        // Criar novo item de menu
        await apiClient.post("/menu-items", menuItemData);
        toast.notify("Item de menu cadastrado com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
      }

      reset({
        nome_menu_item: "",
        id_menu: "",
      });

      setTimeout(() => {
        router.push("/listarMenuItems");
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar item de menu:", error);
      toast.notify("Erro ao salvar item de menu!", {
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
          <b>{isEditing ? "Editar Item de Menu:" : "Cadastro de Item de Menu:"}</b>
        </DivInstrucoes>
        <Form onSubmit={handleSubmit(handleAddMenuItem)}>
          <label>Menu *</label>
          <select
            aria-invalid={errors.id_menu ? "true" : "false"}
            {...register("id_menu", { required: true })}
            name="id_menu"
          >
            <option value="">Selecione um menu</option>
            {menusData?.map((menu, key) => (
              <option key={key} value={menu.id_menu}>
                {menu.titulo}
              </option>
            ))}
          </select>
          {errors.id_menu && errors.id_menu.type === "required" && (
            <span>Selecionar um menu é obrigatório!</span>
          )}

          <label>Nome do Item *</label>
          <input
            aria-invalid={errors.nome_menu_item ? "true" : "false"}
            {...register("nome_menu_item", { required: true })}
            type="text"
            placeholder="Nome do item de menu"
            name="nome_menu_item"
          />
          {errors.nome_menu_item && errors.nome_menu_item.type === "required" && (
            <span>O campo Nome do Item é obrigatório!</span>
          )}

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
