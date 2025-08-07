import {} from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { toast } from "react-toastify";

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
  ordem_item_menu?: number;
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
        ordem_item_menu: menuItemData.ordem_item_menu,
      });
    } catch (error) {
      console.error("Erro ao carregar dados do item de menu:", error);
      toast.error("Erro ao carregar dados do item de menu!", { position: "top-right", autoClose: 5000 });
    }
  }

  async function handleAddMenuItem({
    nome_menu_item,
    id_menu,
    ordem_item_menu,
  }) {
    try {
      const apiClient = getAPIClient();
      
      const menuItemData = {
        nome_menu_item,
        id_menu: parseInt(id_menu),
        ordem_item_menu: ordem_item_menu ? parseInt(ordem_item_menu) : null,
      };

      if (isEditing && menuItemId) {
        // Atualizar item de menu existente
        await apiClient.put(`/menu-items/${menuItemId}`, menuItemData);
        toast.success("Item de menu atualizado com sucesso!", { position: "top-right", autoClose: 5000 });
      } else {
        // Criar novo item de menu
        await apiClient.post("/menu-items", menuItemData);
        toast.success("Item de menu cadastrado com sucesso!", { position: "top-right", autoClose: 5000 });
      }

      reset({
        nome_menu_item: "",
        id_menu: "",
        ordem_item_menu: "",
      });

      setTimeout(() => {
        router.push("/listarMenuItems");
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar item de menu:", error);
      toast.error("Erro ao salvar item de menu!", { position: "top-right", autoClose: 5000 });
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

          <label>Ordem do Item</label>
          <input
            aria-invalid={errors.ordem_item_menu ? "true" : "false"}
            {...register("ordem_item_menu")}
            type="number"
            placeholder="Ex: 1, 2, 3..."
            name="ordem_item_menu"
            min="1"
          />
          <small style={{ color: "#666", fontSize: "12px", marginTop: "5px", display: "block" }}>
            Defina a ordem de exibição dos itens no menu (opcional)
          </small>

          <SubmitButton type="submit">
            {isEditing ? "Atualizar" : "Gravar"}
          </SubmitButton>
        </Form>
      </DivCenter>
      <Footer>
        &copy; Todos os direitos reservados
      </Footer>
    </Container>
  );
}
