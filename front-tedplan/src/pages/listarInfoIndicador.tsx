import { useState, useEffect } from "react";
import { parseCookies } from "nookies";
import Router from "next/router";
import MenuSuperior from "../components/head";
import { toast, ToastContainer } from "react-nextjs-toast";
import { useInfoIndicador } from "../contexts/InfoIndicadorContext";
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
  TextoModal,
  SubmitButton,
} from "../styles/dashboard";
import { useForm } from "react-hook-form";
import { InfoIndicador } from "../types/InfoIndicador";

export default function ListarIndicadores() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const {
    indicadores,
    loadInfoIndicadores,
    updateInfoIndicador,
    deleteInfoIndicador,
    error,
    clearError,
  } = useInfoIndicador();

  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalConfirm, setModalConfirm] = useState(false);
  const [indicadorModal, setIndicadorModal] = useState(null);
  const [idImagem, setIdImagem] = useState(null);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const { ["tedplan.token"]: token } = parseCookies();
    if (!token) {
      Router.push("/login");
      return;
    }

    loadInfoIndicadores();
  }, [loadInfoIndicadores]);

  useEffect(() => {
    if (error) {
      toast.notify(error, {
        type: "error",
        duration: 7,
      });
      clearError();
    }
  }, [error, clearError]);

  function handleAddIndicador() {
    Router.push("/addInfoIndicador");
  }

  async function handleShowModal(indicador: InfoIndicador) {
    setIndicadorModal(indicador);
    setValue("id_descricao_indicador", indicador.id_descricao_indicador);
    setValue("nome_indicador", indicador.nome_indicador);
    setValue("codigo", indicador.codigo);
    setValue("eixo", indicador.eixo);
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

  function handleOpenConfirm({
    id_descricao_indicador,
    id_imagem,
  }: InfoIndicador) {
    setIndicadorModal(id_descricao_indicador);
    setIdImagem(id_imagem);
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

  async function handleRemoverIndicador(id: number, id_imagem?: number) {
    try {
      await deleteInfoIndicador(id, id_imagem);
      toast.notify("Indicador removido com sucesso!", {
        type: "success",
        duration: 7,
      });
      setModalConfirm(false);
      loadInfoIndicadores();
      Router.push("/listarInfoIndicador");
    } catch (error) {
      toast.notify("Erro ao remover indicador!", {
        type: "error",
        duration: 7,
      });
    }
  }

  async function handleUpdateIndicador(data: Partial<InfoIndicador>) {
    const formData = new FormData();
    if (data.metodo_calculo?.[0]) {
      formData.append("imagem", data.metodo_calculo[0]);
    }

    formData.append("nome_indicador", data.nome_indicador);
    formData.append("codigo", data.codigo);
    formData.append("eixo", data.eixo);
    formData.append("descricao", data.descricao);
    formData.append("finalidade", data.finalidade);
    formData.append("limitacoes", data.limitacoes);

    try {
      await updateInfoIndicador(formData);
      toast.notify("Indicador atualizado com sucesso!", {
        type: "success",
        duration: 7,
      });
      handleCloseModal();
      loadInfoIndicadores();
    } catch (error) {
      toast.notify("Erro ao atualizar indicador!", {
        type: "error",
        duration: 7,
      });
    }
  }

  return (
    <Container>
      <MenuSuperior usuarios={[]} />
      <DivCenter>
        <NewButton onClick={handleAddIndicador}>Adicionar Indicador</NewButton>
        <ListPost>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Eixo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {indicadores.map((indicador) => (
              <tr key={indicador.id_descricao_indicador}>
                <td>{indicador.codigo}</td>
                <td>{indicador.nome_indicador}</td>
                <td>{indicador.eixo}</td>
                <td>
                  <BotaoRemover
                    onClick={() =>
                      handleOpenConfirm({
                        id_descricao_indicador:
                          indicador.id_descricao_indicador,
                        id_imagem: indicador.id_imagem,
                      })
                    }
                  >
                    Remover
                  </BotaoRemover>
                  <BotaoEditar
                    onClick={() =>
                      Router.push(
                        `/addInfoIndicador?id=${indicador.id_descricao_indicador}`
                      )
                    }
                  >
                    Editar
                  </BotaoEditar>

                  {isModalConfirm && (
                    <ContainerModal>
                      <Modal>
                        <ConteudoModal>
                          <TituloModal>
                            <h3>Confirmar exclusão</h3>
                          </TituloModal>
                          <TextoModal>
                            <p>Deseja realmente excluir este indicador?</p>
                            <CancelButton onClick={handleCloseConfirm}>
                              Cancelar
                            </CancelButton>
                            <ConfirmButton
                              onClick={() =>
                                handleRemoverIndicador(
                                  indicador.id_descricao_indicador,
                                  indicador.id_imagem
                                )
                              }
                            >
                              Confirmar
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
                    <input
                      type="hidden"
                      {...register("id_descricao_indicador")}
                    />

                    <label>Nome</label>
                    <input
                      {...register("nome_indicador", {
                        required: "O campo Nome é obrigatório!",
                      })}
                      type="text"
                      placeholder="Nome do indicador"
                    />
                    {errors.nome_indicador && (
                      <span>{errors.nome_indicador.message}</span>
                    )}

                    <label>Código</label>
                    <input {...register("codigo")} type="text" disabled />

                    <label>Eixo</label>
                    <select
                      {...register("eixo", {
                        required: "O eixo é obrigatório!",
                      })}
                    >
                      <option value="">Selecione o eixo</option>
                      <option value="agua">Água</option>
                      <option value="esgoto">Esgoto</option>
                      <option value="drenagem">Drenagem</option>
                      <option value="residuos">Resíduos</option>
                    </select>
                    {errors.eixo && <span>{errors.eixo.message}</span>}

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
                      {...register("descricao", {
                        required: "A descrição é obrigatória!",
                      })}
                      rows={4}
                    />
                    {errors.descricao && (
                      <span>{errors.descricao.message}</span>
                    )}

                    <label>Finalidade</label>
                    <textarea
                      {...register("finalidade", {
                        required: "A finalidade é obrigatória!",
                      })}
                      rows={4}
                    />
                    {errors.finalidade && (
                      <span>{errors.finalidade.message}</span>
                    )}

                    <label>Limitações</label>
                    <textarea
                      {...register("limitacoes", {
                        required: "As limitações são obrigatórias!",
                      })}
                      rows={3}
                    />
                    {errors.limitacoes && (
                      <span>{errors.limitacoes.message}</span>
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
