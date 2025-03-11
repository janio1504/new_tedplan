import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
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
import { getAPIClient } from "../services/axios";
import { useForm } from "react-hook-form";
import MenuSuperior from "../components/head";
import dynamic from "next/dynamic";
import { SubmitButton } from "../styles/dashboard-original";
import { useRouter } from "next/router";

interface INorma {
  id_norma: string;
  titulo: string;
  descricao: string;
  id_eixo: string;
  id_tipo_norma: string;
  id_escala: string;
  tipo_norma: string;
  imagem: File;
  arquivo: File;
}
interface IEixo {
  id_eixo: string;
  nome: string;
}

interface IEscala {
  id_escala: string;
  nome: string;
}

interface ITipoNorma {
  id_tipo_norma: string;
  nome: string;
}

interface NormaProps {
  normas: {
    total: string;
    perPage: number;
    page: number;
    lastPage: number;
    data: Array<{
      id_norma: number;
      titulo: string;
      escala: string;
      eixo: string;
      tipo_norma: string;
      id_imagem: number;
      id_arquivo: number;
    }>;
  };
  eixos: IEixo[];
  escalas: IEscala[];
  tipoNorma: ITipoNorma[];
}

export default function AddNorma({
  eixos,
  normas,
  escalas,
  tipoNorma,
}: NormaProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      titulo: "",
      id_tipo_norma: "",
      id_eixo: "",
      id_escala: "",
      imagem: null,
      arquivo: null,
    },
  });
  const [imagem, setImagem] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      // Encontrar a norma pelo id no array data
      const normaSelecionada = normas.data.find(
        (norma) => norma.id_norma === Number(id)
      );

      if (normaSelecionada) {
        // Encontrar os IDs correspondentes
        const tipoNormaEncontrado = tipoNorma.find(
          (tn) => tn.nome.trim() === normaSelecionada.tipo_norma.trim()
        );

        const eixoEncontrado = eixos.find(
          (e) => e.nome.trim() === normaSelecionada.eixo.trim()
        );

        const escalaEncontrada = escalas.find(
          (e) => e.nome.trim() === normaSelecionada.escala.trim()
        );

        reset({
          titulo: normaSelecionada.titulo,
          id_tipo_norma: tipoNormaEncontrado?.id_tipo_norma || "",
          id_eixo: eixoEncontrado?.id_eixo || "",
          id_escala: escalaEncontrada?.id_escala || "",
        });
      }
    }
  }, [id, normas, setValue, tipoNorma, eixos, escalas]);
  async function handleAddNorma(data: INorma) {
    const formData = new FormData();

    formData.append("imagem", data.imagem[0]);
    formData.append("arquivo", data.arquivo[0]);
    formData.append("titulo", data.titulo);
    formData.append("id_eixo", data.id_eixo);
    formData.append("id_tipo_norma", data.id_tipo_norma);
    formData.append("id_escala", data.id_escala);
    const apiClient = getAPIClient();
    const response = await apiClient
      .post("addNorma", formData, {
        headers: {
          "Content-Type": `multipart/form-data=${formData}`,
          "Access-Control-Allow-Origin": "*",
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
          toast.notify("Erro ao gravar dados!", {
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
      id_eixo: "",
      id_escala: "",
      id_tipo_norma: "",
    });
    setTimeout(() => {
      router.push("/listarNormas");
    }, 2000);
  }

  const onSubmit = async (data) => {
    const formData = new FormData();

    if (data.imagem?.[0]) {
      formData.append("imagem", data.imagem[0]);
    }

    if (data.arquivo?.[0]) {
      formData.append("arquivo", data.arquivo[0]);
    }

    formData.append("titulo", data.titulo);
    formData.append("id_eixo", data.id_eixo);
    formData.append("id_tipo_norma", data.id_tipo_norma);
    formData.append("id_escala", data.id_escala);

    const apiClient = getAPIClient();

    try {
      if (id) {
        formData.append("id_norma", id as string);
        await apiClient.post("updateNorma", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.notify("Norma atualizada com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
      } else {
        await apiClient.post("addNorma", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.notify("Norma criada com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
      }

      setTimeout(() => {
        router.push("/listarNormas");
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar norma:", error);
      toast.notify("Erro ao salvar norma!", {
        title: "Erro!",
        duration: 7,
        type: "error",
      });
    }
  };

  return (
    <Container>
      <MenuSuperior usuarios={[]}></MenuSuperior>
      <DivCenter>
        <DivInstrucoes>
          <b>{id ? "Edição" : "Cadastro"} de Norma:</b>
        </DivInstrucoes>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <label>Titulo</label>
          <input
            {...register("titulo", { required: true })}
            type="text"
            placeholder="Titulo da Norma"
          />
          {errors.titulo && <span>O campo Titulo é obrigatório!</span>}

          <label>Tipo de Norma</label>
          <select
            {...register("id_tipo_norma", { required: true })}
            defaultValue=""
          >
            <option value="">Selecione um Tipo</option>
            {tipoNorma.map((tipo) => (
              <option key={tipo.id_tipo_norma} value={tipo.id_tipo_norma}>
                {tipo.nome.trim()}
              </option>
            ))}
          </select>
          {errors.id_tipo_norma && (
            <span>Selecionar um Tipo de Norma é obrigatório!</span>
          )}

          <label>Escala</label>
          <select
            {...register("id_escala", { required: true })}
            defaultValue=""
          >
            <option value="">Selecione uma escala</option>
            {escalas.map((escala) => (
              <option key={escala.id_escala} value={escala.id_escala}>
                {escala.nome.trim()}
              </option>
            ))}
          </select>
          {errors.id_escala && (
            <span>Selecionar uma escala é obrigatório!</span>
          )}

          <label>Eixo</label>
          <select {...register("id_eixo", { required: true })} defaultValue="">
            <option value="">Selecione um eixo</option>
            {eixos.map((eixo) => (
              <option key={eixo.id_eixo} value={eixo.id_eixo}>
                {eixo.nome.trim()}
              </option>
            ))}
          </select>
          {errors.id_eixo && <span>Selecionar um Eixo é obrigatório!</span>}

          <label>Imagem {id && "(opcional para edição)"}</label>
          <input
            {...register("imagem", { required: !id })}
            type="file"
            accept="image/*"
          />
          {errors.imagem && <span>Selecionar uma imagem é obrigatório!</span>}

          <label>Arquivo {id && "(opcional para edição)"}</label>
          <input
            {...register("arquivo", { required: !id })}
            type="file"
            accept=".pdf, .doc, .docx, .xls, .xlsx"
          />
          {errors.arquivo && <span>Selecionar um Arquivo é obrigatório!</span>}

          <SubmitButton type="submit">
            {id ? "Atualizar" : "Gravar"}
          </SubmitButton>
        </Form>
      </DivCenter>
      <Footer>
        &copy; Todos os direitos reservados
        <ToastContainer />
      </Footer>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<NormaProps> = async (
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

  const resNorma = await apiClient.get("/getNormas");
  const normas = await resNorma.data;

  const resEixo = await apiClient.get("/getEixos");
  const eixos = await resEixo.data;

  const resEscala = await apiClient.get("/getEscalas");
  const escalas = await resEscala.data;

  const resTipoNorma = await apiClient.get("/listTipoNorma");
  const tipoNorma = await resTipoNorma.data;

  return {
    props: {
      eixos,
      normas,
      escalas,
      tipoNorma,
    },
  };
};
