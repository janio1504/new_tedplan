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
  nome: string;
  codigo: string;
  metodo_calculo: string;
  descricao: string;
  finalidade: string;
  limitacoes: string;
}

const codigosIndicadores = [
  "IN002",
  "IN003",
  "IN004",
  "IN005",
  "IN006",
  "IN007",
  "IN008",
  "IN009",
  "IN010",
  "IN011",
  "IN012",
  "IN013",
  "IN014",
  "IN015",
  "IN016",
  "IN017",
  "IN018",
  "IN019",
  "IN020",
  "IN021",
  "IN022",
  "IN023",
  "IN024",
  "IN025",
  "IN026",
  "IN027",
  "IN028",
  "IN029",
  "IN030",
  "IN031",
  "IN032",
  "IN033",
  "IN034",
  "IN035",
  "IN036",
  "IN037",
  "IN038",
  "IN039",
  "IN040",
  "IN041",
  "IN042",
  "IN043",
  "IN044",
  "IN045",
  "IN046",
  "IN047",
  "IN048",
  "IN049",
  "IN050",
  "IN051",
  "IN052",
  "IN053",
  "IN054",
  "IN055",
  "IN056",
  "IN057",
  "IN058",
];

export default function AddIndicador() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const { ["tedplan.token"]: token } = parseCookies();
    if (!token) {
      Router.push("/login");
    }
  }, []);

  async function handleAddIndicador({
    nome,
    codigo,
    metodo_calculo,
    descricao,
    finalidade,
    limitacoes,
  }) {
    const formData = new FormData();
    formData.append("metodo_calculo", metodo_calculo[0]);

    const apiClient = getAPIClient();
    try {
      await apiClient.post("addIndicador", {
        nome,
        codigo,
        metodo_calculo: formData,
        descricao,
        finalidade,
        limitacoes,
      });

      toast.notify("Indicador cadastrado com sucesso!", {
        title: "Sucesso!",
        duration: 7,
        type: "success",
      });

      reset();
      setPreviewImage(null);

      setTimeout(() => {
        router.push("/listarIndicadores");
      }, 2000);
    } catch (error) {
      toast.notify("Erro ao cadastrar indicador!", {
        title: "Erro!",
        duration: 7,
        type: "error",
      });
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container>
      <MenuSuperior usuarios={[]}></MenuSuperior>

      <DivCenter>
        <DivInstrucoes>
          <b>Informações de Indicador:</b>
        </DivInstrucoes>
        <Form onSubmit={handleSubmit(handleAddIndicador)}>
          <label>Nome</label>
          <input
            {...register("nome", { required: true })}
            type="text"
            placeholder="Nome do indicador"
            name="nome"
          />
          {errors.nome && <span>O campo Nome é obrigatório!</span>}

          <label>Código</label>
          <select {...register("codigo", { required: true })} name="codigo">
            <option value="">Selecione o código</option>
            {codigosIndicadores.map((codigo) => (
              <option key={codigo} value={codigo}>
                {codigo}
              </option>
            ))}
          </select>
          {errors.codigo && <span>O código do indicador é obrigatório!</span>}

          <label>Método de Cálculo (Imagem)</label>
          <input
            type="file"
            {...register("metodo_calculo", { required: true })}
            accept="image/*"
            onChange={handleImageChange}
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              style={{
                maxWidth: "100%",
                marginTop: "10px",
                maxHeight: "200px",
              }}
            />
          )}
          {errors.metodo_calculo && (
            <span>A imagem do método de cálculo é obrigatória!</span>
          )}

          <label>Descrição</label>
          <textarea
            {...register("descricao", { required: true })}
            placeholder="Descrição detalhada do indicador"
            name="descricao"
            rows={4}
          />
          {errors.descricao && <span>A descrição é obrigatória!</span>}

          <label>Finalidade</label>
          <input
            {...register("finalidade", { required: true })}
            type="text"
            placeholder="Finalidade do indicador"
            name="finalidade"
          />
          {errors.finalidade && <span>A finalidade é obrigatória!</span>}

          <label>Limitações</label>
          <input
            {...register("limitacoes", { required: true })}
            type="text"
            placeholder="Limitacoes do indicador"
            name="limitacoes"
          />
          {errors.limitacoes && <span>As limitações são obrigatórias!</span>}

          <SubmitButton type="submit">Gravar</SubmitButton>
        </Form>
      </DivCenter>
      <Footer>
        &copy; Todos os direitos reservados
        <ToastContainer />
      </Footer>
    </Container>
  );
}
