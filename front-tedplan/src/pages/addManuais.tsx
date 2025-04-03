import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { parseCookies } from "nookies";
import { AuthContext } from "../contexts/AuthContext";
import { toast, ToastContainer } from "react-nextjs-toast";
import {
  FaSearch,
  FaDatabase,
  FaHome,
  FaSignOutAlt,
  FaRegTimesCircle,
} from "react-icons/fa";
import {
  Container,
  Form,
  SubmitButton,
  Footer,
  DivCenter,
  DivInstrucoes,
  InputData,
} from "../styles/dashboard";
import { getAPIClient } from "../services/axios";
import { useForm } from "react-hook-form";
import MenuSuperior from "../components/head";
const InputMask = require("react-input-mask");

import api from "../services/api";

export default function AddManual() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  async function handleAddManual(data) {
    const formData = new FormData();

    formData.append("file", data.file[0]);
    formData.append("nome", data.nome);
    formData.append("data_cadastro", data.data_cadastro);

    const response = await api
      .post("addManual", formData, {
        headers: {
          "Content-Type": `multipart/form-data=${formData}`,
        },
      })
      .then((response) => {
        toast.notify("Dados gravados com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
        reset({
          nome: "",
          data_cadastro: "",
          file: "",
        });
      })
      .catch((error) => {
        if (error) {
          console.log(error);
          toast.notify("Ocorreu um erro ao gravar os dados!", {
            title: "Erro!",
            duration: 7,
            type: "error",
          });
          return error;
        }
      });
  }

  return (
    <Container>
      <MenuSuperior usuarios={[]}></MenuSuperior>
      <ToastContainer></ToastContainer>
      <DivCenter>
        <DivInstrucoes>
          <b>Cadastro de Manuais:</b>
        </DivInstrucoes>
        <Form onSubmit={handleSubmit(handleAddManual)}>
          <label>Titulo</label>
          <input
            aria-invalid={errors.value ? "true" : "false"}
            {...register("nome", { required: true })}
            type="text"
            placeholder="Nome do manual"
          />
          {errors.titulo && errors.titulo.type && (
            <span>O campo é obrigatório!</span>
          )}

          <label>Data de cadastro</label>
          <InputData>
            <InputMask {...register("data_cadastro")} mask="99/99/9999" />
          </InputData>

          <label>manual</label>

          <input
            aria-invalid={errors.value ? "true" : "false"}
            {...register("file", { required: true })}
            type="file"
          />
          {errors.titulo && errors.titulo.type && (
            <span>O campo é obrigatório!</span>
          )}

          <SubmitButton type="submit">Gravar</SubmitButton>
        </Form>
      </DivCenter>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["tedplan.token"]: token } = parseCookies(ctx);
  const apiClient = getAPIClient(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
