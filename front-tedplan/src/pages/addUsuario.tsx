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

interface IUsuario {
  id_usuario: string;
  login: string;
  senha: string;
  nome: string;
  email: string;
  telefone: string;
  curriculo_lattes: string;
}

interface IMunicipio {
  id_municipio: string;
  nome: string;
}

interface UsuarioProps {
  usuario: IUsuario[];
  municipio: IMunicipio[];
}

export default function AddUsuario({ usuario, municipio }: UsuarioProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [municipios, setMunicipios] = useState<any>(municipio);
  const [permissoes, setPermissoes] = useState<any>(null);
  const [visibleMunicipiosSistemas, setVisibleMunicipiosSistemas] =
    useState(false);
  const router = useRouter();

  useEffect(() => {
    const { ["tedplan.token"]: token } = parseCookies();
    if (!token) {
      Router.push("/login");
    }
    getMunicipios();
    getPermissoes();
  }, [municipio]);

  async function getMunicipios() {
    const apiClient = getAPIClient();
    const res = new Promise(async (resolve) => {});
    const resMunicipio = await apiClient
      .get("/getMunicipios")
      .then((response) => {
        return response.data;
      });
    setMunicipios(resMunicipio);
  }

  async function getPermissoes() {
    const permissoes = await api.get("/get-permissoes").then((response) => {
      return response.data;
    });
    setPermissoes(permissoes);
  }

  async function handleAddUsuario({
    nome,
    login,
    senha,
    email,
    curriculo_lattes,
    id_sistema,
    id_municipio,
  }) {
    const formData = new FormData();

    const apiClient = getAPIClient();
    const response = await apiClient
      .post("addUsuario", {
        nome,
        login,
        senha,
        email,
        curriculo_lattes,
        id_sistema,
        id_municipio,
      })
      .then((response) => {
        toast.success("Dados gravados com sucesso!", { position: "top-right", autoClose: 5000 });
      })
      .catch((error) => {
        toast.error("Erro ao gravar dados!", { position: "top-right", autoClose: 5000 });
      });

    reset({
      login: "",
      senha: "",
      nome: "",
      email: "",
      telefone: "",
      curriculo_lattes: "",
    });
    setTimeout(() => {
      router.push("/listarUsuarios");
    }, 2000);
  }

  function onChange(e) {
    e.target.value == 2 || e.target.value == 3
      ? setVisibleMunicipiosSistemas(true)
      : setVisibleMunicipiosSistemas(false);
  }
  return (
    <Container>
      <MenuSuperior usuarios={[]}></MenuSuperior>

      <DivCenter>
        <DivInstrucoes>
          <b>Cadastro de Usuário:</b>
        </DivInstrucoes>
        <Form onSubmit={handleSubmit(handleAddUsuario)}>
          <label>Nome</label>
          <input
            aria-invalid={errors.name ? "true" : "false"}
            {...register("nome", { required: true })}
            type="text"
            placeholder="Nome completo"
            name="nome"
          />
          {errors.nome && errors.nome.type && (
            <span>O campo Nome é obrigatório!</span>
          )}

          <label>Login</label>
          <input
            aria-invalid={errors.name ? "true" : "false"}
            {...register("login", { required: true })}
            type="text"
            placeholder="Login"
            name="login"
          />
          {errors.login && errors.login.type && (
            <span>O campo Login é obrigatório!</span>
          )}

          <label>Senha</label>
          <input
            aria-invalid={errors.name ? "true" : "false"}
            {...register("senha", { required: true })}
            type="text"
            placeholder="Senha"
            name="senha"
          />
          {errors.senha && errors.senha.type && (
            <span>O campo Senha é obrigatório!</span>
          )}

          <label>Email</label>
          <input
            aria-invalid={errors.name ? "true" : "false"}
            {...register("email", { required: true })}
            type="text"
            placeholder="Email"
            name="email"
          />
          {errors.email && errors.email.type && (
            <span>O campo Email é obrigatório!</span>
          )}

          <select
            {...register("id_permissao")}
            name="id_permissao"
            onChange={(e) => onChange(e)}
          >
            aria-invalid={errors.value ? "true" : "false"}
            <option value="">Selecione a permissão</option>
            {permissoes?.map((permissao, key) => (
              <option key={key} value={permissao.id_permissao}>
                {permissao.nome}
              </option>
            ))}
          </select>

          {visibleMunicipiosSistemas && (
            <>
              <select
                {...register("id_sistema", { required: true })}
                name="id_sistema"
              >
                aria-invalid={errors.value ? "true" : "false"}
                <option value="">Selecione um Sistema</option>
                <option value="1">Sou Tedplan</option>
                <option value="2">Sou Municipio</option>
              </select>
              {errors.id_sistema && errors.id_sistema.type && (
                <span>Selecionar um Sistema é obrigatório!</span>
              )}

              <select {...register("id_municipio")} name="id_municipio">
                aria-invalid={errors.value ? "true" : "false"}
                <option value="">Selecione um Municipio</option>
                {municipios?.map((municipio, key) => (
                  <option key={key} value={municipio.id_municipio}>
                    {municipio.nome}
                  </option>
                ))}
              </select>
            </>
          )}
          {errors.id_sistema && errors.id_sistema.type && (
            <span>Selecionar um Sistema é obrigatório!</span>
          )}

          <SubmitButton type="submit">Gravar</SubmitButton>
        </Form>
      </DivCenter>
      <Footer>
        &copy; Todos os direitos reservados
      </Footer>
    </Container>
  );
}
