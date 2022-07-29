import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { parseCookies } from "nookies";
import { AuthContext } from "../contexts/AuthContext";
import { useToasts } from "react-toast-notifications";
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
import InputMask from "react-input-mask";

interface IArquivo {
  id_arquivo: string;
  titulo: string;
  link: string;
  id_eixo: string;
  id_tipo_arquivo_ondrive: string;
  id_status: string;
  data_entrega: string;
  data_final: string;
}
interface IEixo {
  id_eixo: string;
  nome: string;
}

interface IStatus {
  id_status: string;
  nome: string;
}

interface ITipo {
  id_tipo_arquivo_ondrive: string;
  nome: string;
}

interface ArquivoProps {
  arquivos: IArquivo[];
  eixos: IEixo[];
  status: IStatus[];
  tipo_arquivo_ondrive: ITipo[];
}

export default function AddNorma({
  eixos,
  arquivos,
  status,
  tipo_arquivo_ondrive,
}: ArquivoProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { addToast } = useToasts();

  async function handleAddArquivo(data: IArquivo) {
    
    const apiClient = getAPIClient();
    const response = await apiClient
      .post("addArquivoOndrive", {
        titulo: data.titulo,
        link: data.link,
        id_eixo: data.id_eixo,
        id_status: data.id_status,
        id_tipo_arquivo_ondrive: data.id_tipo_arquivo_ondrive,
        data_entrega: data.data_entrega,
        data_final: data.data_final,
      })
      .then((response) => {
        addToast("Publicação Adicionada com sucesso!", {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((error) => {
        if (error) {
          console.log(error);
          addToast("Todos os campos são obrigatórios!", {
            appearance: "error",
            autoDismiss: true,
          });
          return error;
        }
      });

    reset({
      
      titulo: "",
      link:"",
      id_eixo: "",
      id_status: "",
      id_tipo_arquivo_ondrive: "",
      data_entrega: "",
      data_final: ""
    });
  }

  return (
    <Container>
      <MenuSuperior usuarios={[]}></MenuSuperior>

      <DivCenter>
        <DivInstrucoes>
          <b>Cadastro de Arquivo do Ondrive:</b>
        </DivInstrucoes>
        <Form onSubmit={handleSubmit(handleAddArquivo)}>
          <label>Titulo</label>
          <input
            aria-invalid={errors.value ? "true" : "false"}
            {...register("titulo", { required: true })}
            type="text"
            placeholder="Titulo do arquivo"
            name="titulo"
          />
          {errors.titulo && errors.titulo.type && (
            <span>O campo Titulo é obrigatório!</span>
          )}

          <label>Titulo</label>
          <input
            aria-invalid={errors.value ? "true" : "false"}
            {...register("link", { required: true })}
            type="text"
            placeholder="Link do arquivo no ondrive"
          />
          {errors.link && errors.link.type && (
            <span>O Link do arquivo no ondrive é obrigatório!</span>
          )}

          <select {...register("id_tipo_arquivo_ondrive", { required: true })}>
            aria-invalid={errors.value ? "true" : "false"}
            <option value="">Selecione um Tipo</option>
            {tipo_arquivo_ondrive.map((tipo) => (
              <option
                key={tipo.id_tipo_arquivo_ondrive}
                value={tipo.id_tipo_arquivo_ondrive}
              >
                {tipo.nome}
              </option>
            ))}
          </select>
          {errors.id_tipo && errors.id_tipo.type && (
            <span>Selecionar um Tipo é obrigatório!</span>
          )}

          <select {...register("id_status", { required: true })}>
            aria-invalid={errors.value ? "true" : "false"}
            <option value="">Selecione um status</option>
            {status.map((status) => (
              <option key={status.id_status} value={status.id_status}>
                {status.nome}
              </option>
            ))}
          </select>
          {errors.id_status && errors.id_status.type && (
            <span>Selecionar um status é obrigatório!</span>
          )}

          <select {...register("id_eixo", { required: true })}>
            aria-invalid={errors.value ? "true" : "false"}
            <option value="">Selecione um eixo</option>
            {eixos.map((eixo) => (
              <option key={eixo.id_eixo} value={eixo.id_eixo}>
                {eixo.nome}
              </option>
            ))}
          </select>
          {errors.id_eixo && errors.id_eixo.type && (
            <span>Selecionar um Eixo é obrigatório!</span>
          )}

          <label>Data da entrega</label>
          <InputData>
            <InputMask {...register("data_entrega")} mask="99/99/9999" />
          </InputData>
          {errors.arquivo && errors.arquivo.type && (
            <span>Selecionar uma imagem é obrigatório!</span>
          )}

          <label>Data final</label>
          <InputData>
            <InputMask {...register("data_final")} mask="99/99/9999" />
          </InputData>

          <SubmitButton type="submit">Gravar</SubmitButton>
        </Form>
      </DivCenter>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<ArquivoProps> = async (
  ctx
) => {
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

  const resArquivos = await apiClient.get("/getArquivosOndrive");
  const arquivos = await resArquivos.data;

  const resEixo = await apiClient.get("/getEixos");
  const eixos = await resEixo.data;

  const resStatus = await apiClient.get("/getStatus");
  const status = await resStatus.data;

  const resTipo = await apiClient.get("/getTipoArquivo");
  const tipo_arquivo_ondrive = await resTipo.data;

  return {
    props: {
      eixos,
      arquivos,
      status,
      tipo_arquivo_ondrive,
    },
  };
};
