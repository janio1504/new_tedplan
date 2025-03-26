import { GetServerSideProps } from "next";
import React, { useContext, useState } from "react";
import { parseCookies } from "nookies";
import { AuthContext } from "../contexts/AuthContext";
import { getAPIClient } from "../services/axios";
import api from "../services/api";
import Router from "next/router";
import MenuSuperior from "../components/head";
import { toast, ToastContainer } from "react-nextjs-toast";
import {
  Container,
  NewButton,
  ListPost,
  FormModal,
  ConfirmButton,
  CancelButton,
  Footer,
  DivCenter,
  BotaoVisualizar,
  BotaoEditar,
  BotaoRemover,
  ContainerModal,
  Modal,
  CloseModalButton,
  ConteudoModal,
  TituloModal,
  ImagemModal,
  TextoModal,
  SubmitButton,
} from "../styles/dashboard";
import { useForm } from "react-hook-form";

interface IIndicador {
  id_indicador: string;
  nome: string;
  codigo: string;
  metodo_calculo: string;
  descricao: string;
  finalidade: string;
  limitacoes: string;
}

interface IndicadorProps {
  indicadores: IIndicador[];
}

export default function ListarIndicadores({ indicadores }: IndicadorProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalConfirm, setModalConfirm] = useState(false);
  const [indicadorModal, setIndicadorModal] = useState<IIndicador | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  function handleAddIndicador() {
    Router.push("/addInfoIndicador");
  }

  async function handleShowModal(indicador: IIndicador) {
    setIndicadorModal(indicador);
    setValue("id_indicador", indicador.id_indicador);
    setValue("nome", indicador.nome);
    setValue("codigo", indicador.codigo);
    setValue("descricao", indicador.descricao);
    setValue("finalidade", indicador.finalidade);
    setValue("limitacoes", indicador.limitacoes);
    setModalVisible(true);
  }

  function handleCloseModal() {
    setModalVisible(false);
    reset();
    setPreviewImage(null);
  }

  function handleOpenConfirm(indicador: IIndicador) {
    setIndicadorModal(indicador);
    setModalConfirm(true);
  }

  function handleCloseConfirm() {
    setModalConfirm(false);
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

  async function handleRemoverIndicador(id_indicador: string) {
    try {
      await api.delete("removerIndicador", { params: { id_indicador } });
      toast.notify("Indicador removido com sucesso!", {
        title: "Sucesso",
        duration: 7,
        type: "success",
      });
      setModalConfirm(false);
      Router.push("/listarInfoIndicador");
    } catch (error) {
      toast.notify("Não foi possível remover o indicador!", {
        title: "Erro",
        duration: 7,
        type: "error",
      });
    }
  }

  async function handleUpdateIndicador(data: IIndicador) {
    const formData = new FormData();
    if (data.metodo_calculo?.[0]) {
      formData.append("metodo_calculo", data.metodo_calculo[0]);
    }

    try {
      await api.post("updateIndicador", {
        ...data,
        metodo_calculo: data.metodo_calculo?.[0] ? formData : undefined,
      });

      toast.notify("Indicador atualizado com sucesso!", {
        title: "Sucesso!",
        duration: 7,
        type: "success",
      });

      setTimeout(() => {
        setModalVisible(false);
        Router.push("/listarInfoIndicador");
      }, 2000);
    } catch (error) {
      toast.notify("Erro ao atualizar indicador!", {
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
        <NewButton onClick={handleAddIndicador}>Adicionar Indicador</NewButton>
        <ListPost>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Finalidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {indicadores.map((indicador) => (
              <tr key={indicador.id_indicador}>
                <td>{indicador.codigo}</td>
                <td>{indicador.nome}</td>
                <td>{indicador.finalidade}</td>
                <td>
                  <BotaoVisualizar onClick={() => handleShowModal(indicador)}>
                    Visualizar
                  </BotaoVisualizar>
                  <BotaoEditar onClick={() => handleShowModal(indicador)}>
                    Editar
                  </BotaoEditar>
                  <BotaoRemover onClick={() => handleOpenConfirm(indicador)}>
                    Remover
                  </BotaoRemover>

                  {isModalConfirm &&
                    indicadorModal?.id_indicador === indicador.id_indicador && (
                      <ContainerModal>
                        <Modal>
                          <ConteudoModal>
                            <TituloModal>
                              <h3>
                                <b>Confirmar exclusão</b>
                              </h3>
                            </TituloModal>
                            <TextoModal>
                              <p>Deseja realmente excluir este indicador?</p>
                              <CancelButton onClick={handleCloseConfirm}>
                                <b>Cancelar</b>
                              </CancelButton>
                              <ConfirmButton
                                onClick={() =>
                                  handleRemoverIndicador(indicador.id_indicador)
                                }
                              >
                                <b>Confirmar</b>
                              </ConfirmButton>
                            </TextoModal>
                          </ConteudoModal>
                        </Modal>
                      </ContainerModal>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </ListPost>

        {isModalVisible && indicadorModal && (
          <ContainerModal>
            <Modal>
              <FormModal onSubmit={handleSubmit(handleUpdateIndicador)}>
                <TextoModal>
                  <CloseModalButton onClick={handleCloseModal}>
                    Fechar
                  </CloseModalButton>
                  <SubmitButton type="submit">Atualizar</SubmitButton>

                  <ConteudoModal>
                    <input type="hidden" {...register("id_indicador")} />

                    <label>Nome</label>
                    <input
                      {...register("nome", { required: true })}
                      type="text"
                      placeholder="Nome do indicador"
                    />
                    {errors.nome && <span>O campo Nome é obrigatório!</span>}

                    <label>Código</label>
                    <input {...register("codigo")} type="text" disabled />

                    <label>Método de Cálculo</label>
                    <input
                      type="file"
                      {...register("metodo_calculo")}
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

                    <label>Descrição</label>
                    <textarea
                      {...register("descricao", { required: true })}
                      rows={4}
                    />
                    {errors.descricao && (
                      <span>A descrição é obrigatória!</span>
                    )}

                    <label>Finalidade</label>
                    <input
                      {...register("finalidade", { required: true })}
                      type="text"
                    />
                    {errors.finalidade && (
                      <span>A finalidade é obrigatória!</span>
                    )}

                    <label>Limitações</label>
                    <textarea
                      {...register("limitacoes", { required: true })}
                      rows={3}
                    />
                    {errors.limitacoes && (
                      <span>As limitações são obrigatórias!</span>
                    )}
                  </ConteudoModal>
                </TextoModal>
              </FormModal>
            </Modal>
          </ContainerModal>
        )}
      </DivCenter>
      <Footer>
        &copy; Todos os direitos reservados
        <ToastContainer align={"center"} position={"button"} />
      </Footer>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const apiClient = getAPIClient(ctx);
    const { ["tedplan.token"]: token } = parseCookies(ctx);

    if (!token) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const response = await apiClient.get("/getIndicadores");
    const indicadores = response.data;

    return {
      props: {
        indicadores,
      },
    };
  } catch (error) {
    console.error("Error fetching indicadores:", error);

    // Return empty array if API fails
    return {
      props: {
        indicadores: [],
      },
    };
  }
};
