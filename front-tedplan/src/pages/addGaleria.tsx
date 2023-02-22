import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { parseCookies } from "nookies";
import { toast, ToastContainer } from 'react-nextjs-toast';

import {
  Container,
  Form,
  SubmitButton,
  DivCenter,
  DivInstrucoes,
  Footer,
} from "../styles/dashboard";
import { getAPIClient } from "../services/axios";
import { useForm } from "react-hook-form";
import MenuSuperior from "../components/head";
import Textarea from "@uiw/react-md-editor/lib/components/TextArea/Textarea";

interface IGaleria {
  id_galeria: string;
  titulo: string;
  descricao: string;
  mes: string;
  ano: string;
  imagem: File;
  id_municipio: string;
  id_eixo: string;
}

interface IMes {
  mes: string;
}

interface IAno {
  ano: string;
}
interface IMunicipios {
  id_municipio: string;
  nome: string;
}

interface IEixos {
  id_eixo: string;
  nome: string;
}

interface GaleriaProps {
  galeria: IGaleria[];
  mes: IMes[];
  ano: IAno[];
  municipios: IMunicipios[];
  eixos: IEixos[];
}

interface MunicipiosProps {
  municipios: IMunicipios[];
}

export default function AddGaleria({ municipios, eixos }: GaleriaProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();


  const [contentForEditor, setContentForEditor] = useState(null);
  const [content, setContent] = useState("");
  const editor = useRef(null);
  let txtArea = useRef();
  const firstRender = useRef(true);
  const editorContent = useMemo(() => contentForEditor, [contentForEditor]);
  
  async function handleAddGaleria({
    titulo,
    mes,
    ano,
    imagem,
    id_municipio,
    id_eixo,
  }) {
    const descricao = content.toString();
    const formData = new FormData();

    formData.append("imagem", imagem[0]);
    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("mes", mes);
    formData.append("ano", ano);
    formData.append("id_municipio", id_municipio);
    formData.append("id_eixo", id_eixo);
    const apiClient = getAPIClient();
    const response = await apiClient
      .post("addGaleria", formData, {
        headers: {
          "Content-Type": `multipart/form-data=${formData}`,
        },
      })
      .then((response) => {
        toast.notify('Dados gravados com sucesso!',{
          title: "Sucesso!",
          duration: 7,
          type: "success",
        })   
        reset({
          imagem: "",
          titulo: "",
          descricao: "",
          mes: "",
          ano: "",
          eixo: "",
          id_municipio: "",
        });
      })
      .catch((error) => {
        if (error) {
          toast.notify('Erro ao gravar dados!',{
            title: "Erro!",
            duration: 7,
            type: "error",
          })   
          return error;
        }
      });
  }
  const anos = [
    { ano: "2015" },
    { ano: "2016" },
    { ano: "2017" },
    { ano: "2018" },
    { ano: "2019" },
    { ano: "2020" },
    { ano: "2021" },
    { ano: "2022" },
    { ano: "2023" },
    { ano: "2024" },
    { ano: "2025" },
    { ano: "2026" },
  ];

  const meses = [
    { mes: "Janeiro" },
    { mes: "Fevereiro" },
    { mes: "Março" },
    { mes: "Abril" },
    { mes: "Maio" },
    { mes: "Junho" },
    { mes: "Julho" },
    { mes: "Agosto" },
    { mes: "Setembro" },
    { mes: "Outubro" },
    { mes: "Novenbro" },
    { mes: "Dezembro" },
  ];

  function handleOnChange(content) {
    setContent(content);
  }

  
  return (
    <Container>
      <MenuSuperior usuarios={[]}></MenuSuperior>

      <DivCenter>
        <DivInstrucoes>
          <b>Cadastro de galeria: </b>
          <p>Adicione uma galeria com os dados solicitados abaixo, escolha uma imagem de capa 
          que será mostrada no portal galerias, e se desejar, escreva uma <b>Descrição</b>.</p>
          <p>Após gravar a galeria clique no menu galerias e na lista clique no botão Adicionar imagens!</p>
          
        </DivInstrucoes>
        <Form onSubmit={handleSubmit(handleAddGaleria)}>
          <label>Titulo</label>
          <input
            aria-invalid={errors.name ? "true" : "false"}
            {...register("titulo", { required: true })}
            type="text"
            placeholder="Titulo da Galeria"
            name="titulo"
          />
          {errors.titulo && errors.titulo.type && (
            <span>O campo Titulo é obrigatório!</span>
          )}
          <select
            aria-invalid={errors.value ? "true" : "false"}
            {...register("mes", { required: true })}
            name="mes"
          >
            <option value="">Selecione o mês</option>
            {meses.map((mes) => (
              <option key={mes.mes} value={mes.mes}>
                {mes.mes}
              </option>
            ))}
          </select>
          {errors.mes && errors.mes.type && (
            <span>Selecionar um mês é obrigatório!</span>
          )}

          <select
            aria-invalid={errors.value ? "true" : "false"}
            {...register("ano", { required: true })}
            name="ano"
          >
            <option value="">Selecione um ano</option>
            {anos.map((ano, key) => (
              <option key={key} value={ano.ano}>
                {ano.ano}
              </option>
            ))}
          </select>
          {errors.ano && errors.ano.type && (
            <span>Selecionar um ano é obrigatório!</span>
          )}

          <select
            aria-invalid={errors.value ? "true" : "false"}
            {...register("id_municipio", { required: true })}
            name="id_municipio"
          >
            <option value="">Selecione um Municipio</option>
            {municipios.map((municipio) => (
              <option
                key={municipio.id_municipio}
                value={municipio.id_municipio}
              >
                {municipio.nome}
              </option>
            ))}
          </select>
          {errors.id_municipio && errors.id_municipio.type && (
            <span>Selecionar um Municipio é obrigatório!</span>
          )}

          <select
            aria-invalid={errors.value ? "true" : "false"}
            {...register("id_eixo", { required: true })}
            name="id_eixo"
          >
            <option value="">Selecione o eixo</option>
            {eixos.map((eixo, key) => (
              <option key={key} value={eixo.id_eixo}>
                {eixo.nome}
              </option>
            ))}
          </select>
          {errors.id_eixo && errors.id_eixo.type && (
            <span>Selecionar um Eixo é obrigatório!</span>
          )}

          <label>Imagem de Rótulo da Galeria</label>
          <input
            aria-invalid={errors.value ? "true" : "false"}
            {...register("imagem", { required: true })}
            type="file"
            name="imagem"
          />
          {errors.imagem && errors.imagem.type && (
            <span>Selecionar uma imagem é obrigatório!</span>
          )}
          <label>Descricão</label>
          <textarea ref={txtArea} {...register("descricao")} onChange={handleOnChange}></textarea>

          <SubmitButton type="submit">Gravar</SubmitButton>
        </Form>
      </DivCenter>
      <Footer>&copy; Todos os direitos reservados<ToastContainer></ToastContainer></Footer>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<MunicipiosProps> = async (
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

  const resMunicipio = await apiClient.get("/getMunicipios");
  const municipios = await resMunicipio.data;

  const resEixo = await apiClient.get("/getEixos");
  const eixos = await resEixo.data;

  return {
    props: {
      municipios,
      eixos,
    },
  };
};
