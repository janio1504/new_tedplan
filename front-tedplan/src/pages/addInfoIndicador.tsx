import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { toast, ToastContainer } from "react-nextjs-toast";
import { useForm } from "react-hook-form";
import { useInfoIndicador } from "../contexts/InfoIndicadorContext";
import MenuSuperior from "../components/head";
import {
  Container,
  Form,
  Footer,
  DivCenter,
  DivInstrucoes,
} from "../styles/dashboard";
import { SubmitButton } from "../styles/dashboard-original";

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
    setValue,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { id } = router.query;

  const {
    createInfoIndicador,
    updateInfoIndicador,
    currentInfoIndicador,
    loadInfoIndicadores,
  } = useInfoIndicador();

  useEffect(() => {
    const loadIndicador = async () => {
      if (id) {
        try {
          const response = await currentInfoIndicador(id);

          const indicador = response[0];

          if (indicador) {
            setValue("nome_indicador", indicador.nome_indicador || "");
            setValue("codigo", indicador.codigo || "");
            setValue("eixo", indicador.eixo || "");
            setValue("descricao", indicador.descricao || "");
            setValue("finalidade", indicador.finalidade || "");
            setValue("limitacoes", indicador.limitacoes || "");

            if (indicador.metodo_calculo) {
              setPreviewImage(indicador.metodo_calculo);
            }
          }
        } catch (error) {
          console.error("Error loading indicator:", error);
          toast.notify("Erro ao carregar dados do indicador!", {
            type: "error",
            duration: 7,
          });
        }
      }
    };

    loadIndicador();
  }, [id, setValue, currentInfoIndicador]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    if (data?.metodo_calculo[0]) {
      formData.append("imagem", data?.metodo_calculo[0]);
    }
    formData.append("nome_indicador", data.nome_indicador);
    formData.append("codigo", data.codigo);
    formData.append("eixo", data.eixo);
    formData.append("descricao", data.descricao);
    formData.append("finalidade", data.finalidade);
    formData.append("limitacoes", data.limitacoes);

    try {
      if (id) {
        formData.append("id_descricao_indicador", id as string);
        await updateInfoIndicador(formData);
        toast.notify("Indicador atualizado com sucesso!", {
          type: "success",
          duration: 7,
        });

        loadInfoIndicadores();
      } else {
        await createInfoIndicador(formData);
        toast.notify("Indicador cadastrado com sucesso!", {
          type: "success",
          duration: 7,
        });
      }

      reset();
      setPreviewImage(null);
      setTimeout(() => {
        router.push("/listarInfoIndicador");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.notify(`Erro ao ${id ? "atualizar" : "cadastrar"} indicador!`, {
        type: "error",
        duration: 7,
      });
    }
  };

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
      <MenuSuperior usuarios={[]} />
      <ToastContainer></ToastContainer>
      <DivCenter>
        <DivInstrucoes>
          <b>{id ? "Editar" : "Adicionar"} Informações de Indicador:</b>
        </DivInstrucoes>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <label>Nome</label>
          <input
            {...register("nome_indicador", {
              required: "O campo Nome é obrigatório!",
            })}
            type="text"
            placeholder="Nome do indicador"
          />
          {errors.nome && <span>{errors.nome.message}</span>}

          <label>Código</label>
          <select
            {...register("codigo", {
              required: "O código do indicador é obrigatório!",
            })}
          >
            <option value="">Selecione o código</option>
            {codigosIndicadores.map((codigo) => (
              <option key={codigo} value={codigo}>
                {codigo}
              </option>
            ))}
          </select>
          {errors.codigo && <span>{errors.codigo.message}</span>}

          <label>Eixo</label>
          <select {...register("eixo", { required: "O eixo é obrigatório!" })}>
            <option value="">Selecione o eixo</option>
            <option value="agua">Água</option>
            <option value="esgoto">Esgoto</option>
            <option value="drenagem">Drenagem</option>
            <option value="residuos">Resíduos</option>
          </select>
          {errors.eixo && <span>{errors.eixo.message}</span>}

          <label>Método de Cálculo (Imagem)</label>
          <input
            type="file"
            {...register("metodo_calculo", { required: !id })}
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

          <textarea
            {...register("finalidade", { required: true })}
            placeholder="Finalidade do indicador"
            name="finalidade"
            rows={4}
          />
          {errors.finalidade && <span>A finalidade é obrigatória!</span>}
          <label>Limitações</label>
          <textarea
            {...register("limitacoes", { required: true })}
            placeholder="Limitações do indicador"
            name="limitacoes"
            rows={4}
          />
          {errors.limitacoes && <span>As limitações são obrigatórias!</span>}
          <SubmitButton type="submit">
            {id ? "Atualizar" : "Gravar"}
          </SubmitButton>
        </Form>
      </DivCenter>
      <Footer>&copy; Todos os direitos reservados</Footer>
    </Container>
  );
}
