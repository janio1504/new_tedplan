import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { AuthContext } from "../contexts/AuthContext";
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
import { useRouter } from "next/router";
import api from "@/services/api";

interface IPublicacao {
  id_posts: string;
  titulo: string;
  id_eixo: string;
  id_tipo_publicacao: string;
  id_categoria: string;
  id_municipio: string;
  arquivo: File;
  imagem: File;
}

interface IMunicipios {
  id_municipio: string;
  nome: string;
}

interface IEixos {
  id_eixo: string;
  nome: string;
}

interface ICategorias {
  id_categoria: string;
  nome: string;
}

interface ITipoPublicacao {
  id_tipo_publicacao: string;
  nome: string;
}

interface MunicipiosProps {
  eixos: IEixos[];
  categorias: ICategorias[];
  municipios: IMunicipios[];
  tipoPublicacao: ITipoPublicacao[];
}

export default function AddPublicacao({
  municipios,
  tipoPublicacao,
  eixos,
  categorias,
}: MunicipiosProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [disabledTipoPublicacao, setdisabledTipoPublicacao] = useState(false);
  const [disabledMunicipio, setdisabledMunicipio] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const [publicacao, setPublicacao] = useState(null);

  useEffect(() => {
    if (id) {
      api
        .get("getPublicacao", {
          params: { id_publicacao: id },
        })
        .then((response) => {
          const pub = response.data[0];

          const tipoPublicacaoId = tipoPublicacao.find(
            (tp) => tp.nome.trim() === pub.tipo_publicacao.trim()
          )?.id_tipo_publicacao;

          const eixoId = eixos.find(
            (e) => e.nome.trim() === pub.eixo.trim()
          )?.id_eixo;

          const municipioId = municipios.find(
            (m) => m.nome.trim() === pub.municipio.trim()
          )?.id_municipio;

          const publicacaoFormatted = {
            ...pub,
            id_tipo_publicacao: tipoPublicacaoId,
            id_eixo: eixoId,
            id_municipio: municipioId,
          };

          setPublicacao(publicacaoFormatted);

          reset({
            titulo: pub.titulo,
            id_tipo_publicacao: tipoPublicacaoId,
            id_municipio: municipioId,
            id_eixo: eixoId,
            id_categoria: pub.categoria,
          });
        })
        .catch((error) => {
          console.error("Error fetching publication:", error);
          toast.notify("Erro ao carregar publicação!", {
            title: "Erro!",
            duration: 7,
            type: "error",
          });
        });
    }
  }, [id, reset, tipoPublicacao, eixos, municipios]);

  const onSubmit = async (data) => {
    const formData = new FormData();

    if (data.imagem?.[0]) {
      formData.append("imagem", data.imagem[0]);
    }

    if (data.arquivo?.[0]) {
      formData.append("file", data.arquivo[0]);
    }

    formData.append("titulo", data.titulo);
    formData.append("id_eixo", data.id_eixo);
    formData.append("id_tipo_publicacao", data.id_tipo_publicacao);
    formData.append("id_categoria", data.id_categoria);
    formData.append("id_municipio", data.id_municipio);

    const apiClient = getAPIClient();

    try {
      if (id) {
        // Modo edição
        formData.append("id_publicacao", id as string);
        await apiClient.post("updatePublicacao", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.notify("Publicação atualizada com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
      } else {
        // Modo criação
        await apiClient.post("addPublicacao", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.notify("Publicação criada com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
      }

      setTimeout(() => {
        router.push("/listarPublicacoes");
      }, 2000);
    } catch (error) {
      toast.notify("Erro ao salvar publicação!", {
        title: "Erro!",
        duration: 7,
        type: "error",
      });
    }
  };
  async function handleAddPublicacao({
    titulo,
    id_eixo,
    id_categoria,
    id_tipo_publicacao,
    id_municipio,
    arquivo,
    imagem,
  }: IPublicacao) {
    const formData = new FormData();

    formData.append("imagem", imagem[0]);
    formData.append("file", arquivo[0]);
    formData.append("titulo", titulo);
    formData.append("id_eixo", id_eixo);
    formData.append("id_tipo_publicacao", id_tipo_publicacao);
    formData.append("id_categoria", id_categoria);
    formData.append("id_municipio", id_municipio);
    const apiClient = getAPIClient();
    const response = await apiClient
      .post("addPublicacao", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        toast.notify("Dados gravados com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
      })
      .catch((error) => {
        if (error) {
          toast.notify("Erro ao gravar!", {
            title: "Erro!",
            duration: 7,
            type: "error",
          });
          return error;
        }
      });

    reset({
      imagem: "",
      arquivo: "",
      titulo: "",
      eixo: "",
      id_categoria: "",
      id_municipio: "",
    });
    setTimeout(() => {
      router.push("/listarPublicacoes");
    }, 2000);
  }

  function handleDisabledTp(id) {
    console.log(id);

    if (id === 1) {
      setdisabledTipoPublicacao(true);
    }
  }
  return (
    <Container>
      <MenuSuperior usuarios={[]}></MenuSuperior>

      <DivCenter>
        <DivInstrucoes>
          <b>{id ? "Edição" : "Cadastro"} de Publicações:</b>
        </DivInstrucoes>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <label>Titulo</label>
          <input
            aria-invalid={errors.name ? "true" : "false"}
            {...register("titulo", { required: true })}
            type="text"
            placeholder="Titulo da Publicacao"
            name="titulo"
            defaultValue={publicacao?.titulo}
          />
          {errors.titulo && errors.titulo.type && (
            <span>O campo Titulo é obrigatório!</span>
          )}

          <input {...register("id_categoria")} type="hidden" defaultValue={2} />

          <select
            {...register("id_tipo_publicacao", { required: true })}
            defaultValue={publicacao?.id_tipo_publicacao}
          >
            <option value="">Selecione um Tipo de Publicação</option>
            {tipoPublicacao.map((tipo) => (
              <option
                key={tipo.id_tipo_publicacao}
                value={tipo.id_tipo_publicacao}
              >
                {tipo.nome}
              </option>
            ))}
          </select>
          {errors.id_tipo_publicacao && errors.id_tipo_publicacao.type && (
            <span>Selecionar um Tipo de Publicação é obrigatório!</span>
          )}

          <select
            aria-invalid={errors.value ? "true" : "false"}
            {...register("id_municipio", {
              required: true,
              disabled: disabledMunicipio,
            })}
            name="id_municipio"
            defaultValue={publicacao?.id_municipio}
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
          {errors.id_municipio && errors.id_municipio.type === "required" && (
            <span>Selecionar um Municipio é obrigatório!</span>
          )}

          <select
            aria-invalid={errors.value ? "true" : "false"}
            {...register("id_eixo", { required: true })}
            name="id_eixo"
            defaultValue={publicacao?.id_eixo}
          >
            <option value="">Selecione o eixo</option>
            {eixos.map((eixo) => (
              <option key={eixo.id_eixo} value={eixo.id_eixo}>
                {eixo.nome}
              </option>
            ))}
          </select>
          {errors.id_eixo && errors.id_eixo.type === "required" && (
            <span>Selecionar um Eixo é obrigatório!</span>
          )}

          <label>Arquivo da Publicação {id && "(opcional para edição)"}</label>
          <input
            {...register("arquivo", { required: !id })}
            accept=".pdf, .doc, .docx, .xls, .xlsx"
            type="file"
          />
          {errors.arquivo && errors.arquivo.type && (
            <span>Selecionar um Arquivo é obrigatório!</span>
          )}

          <label>
            Imagem de Rótulo Publicação {id && "(opcional para edição)"}
          </label>
          <input
            {...register("imagem", { required: !id })}
            type="file"
            accept="image/*"
          />
          {errors.imagem && errors.imagem.type && (
            <span>Selecionar uma imagem é obrigatório!</span>
          )}

          <SubmitButton type="submit">
            {id ? "Atualizar" : "Gravar"}
          </SubmitButton>
        </Form>
      </DivCenter>
      <Footer>
        &copy; Todos os direitos reservados<ToastContainer></ToastContainer>
      </Footer>
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

  const resTipoPublicacao = await apiClient.get("/listTipoPublicacao");
  const tipoPublicacao = await resTipoPublicacao.data;

  const resEixo = await apiClient.get("/getEixos");
  const eixos = await resEixo.data;

  const resCategorias = await apiClient.get("/getCategorias");
  const categorias = await resCategorias.data;

  return {
    props: {
      municipios,
      tipoPublicacao,
      eixos,
      categorias,
    },
  };
};
