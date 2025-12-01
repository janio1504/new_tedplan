/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { parseCookies } from "nookies";
import { AuthContext } from "../contexts/AuthContext";
import { getAPIClient } from "../services/axios";
import api from "../services/api";
import Router from "next/router";
import MenuSuperior from "../components/head";
import { toast } from "react-toastify";
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
  ConfirmModal,
} from "../styles/dashboard";
import { useForm } from "react-hook-form";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

interface IManual {
  id_manual: string;
  nome: string;
  data_cadastro: string;
  id_arquivo: string;
}

interface ManuaisProps {
  manuais: IManual[];
}

export default function Postagens({ manuais }: ManuaisProps) {
  const { register, handleSubmit, reset } = useForm();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalUpdateVisible, setModalUpdateVisible] = useState(false);
  const [isModalConfirm, setModalConfirm] = useState(false);
  const [manual, setManual] = useState<null | any>(null);
  const [arquivo, setArquivo] = useState<String | any>(null);
  const [idManual, setIdManual] = useState(null);
  const [idImagem, setIdImagem] = useState(null);
  const [idArquivo, setIdArquivo] = useState(null);

  useEffect(() => {}, [manuais]);

  async function handleShowUpdateModal(id_arquivo, id_manual) {
    if (id_arquivo) {
      const arquivo = await api({
        method: "GET",
        url: "getFile",
        params: { id: id_arquivo },
        responseType: "blob",
      }).then((response) => {
        return URL.createObjectURL(response.data);
      });
      setArquivo(arquivo);
    } else {
      setArquivo(null);
    }

    if (id_manual) {
      const m = await api.get("getManual", {
        params: { id_manual: id_manual },
      });

      setManual(m.data[0]);
    }

    setModalUpdateVisible(true);
  }

  async function handleShowModal({ id_manual }) {
    setIdManual(id_manual);

    setModalVisible(true);
  }

  function handleCloseModal() {
    Router.reload();
    setModalVisible(false);
  }

  function handleOpenConfirm({ id_manual, id_arquivo }) {
    setIdManual(id_manual);
    setIdArquivo(id_arquivo);
    setModalConfirm(true);
  }

  function handleCloseConfirm() {
    setModalConfirm(false);
  }

  async function handleUpdateManual(data) {
    const formData = new FormData();

    formData.append("arquivo", data.arquivo[0]);
    formData.append("titulo", data.titulo);
    formData.append("id_arquivo", data.id_arquivo);
    formData.append("id_manual", data.id_manual);
    await api
      .post("updateManual", formData, {
        headers: {
          "Content-Type": `multipart/form-data=${formData}`,
        },
      })
      .then((response) => {
        toast.success("Dados gravados com sucesso!", { position: "top-right", autoClose: 5000 });
      })
      .catch((error) => {
        toast.error("Erro ao gravar os dados!", { position: "top-right", autoClose: 5000 });
        console.log(error);
        return error;
      });
  }

  async function handleUpdateImagem(data) {
    const apiClient = getAPIClient();
    const formData = new FormData();

    formData.append("imagem", data.imagem[0]);
    formData.append("id_manual", data.id_manual);
    formData.append("id_imagem", data.id_imagem);
    const res = await apiClient
      .post("updateImagemManual", formData, {
        headers: {
          "Content-Type": `multipart/form-data=${formData}`,
        },
      })
      .then((response) => {
        toast.success("Imagem atualizada com sucesso!", { position: "top-right", autoClose: 5000 });

        return response;
      })
      .catch((error) => {
        return error;
      });
  }

  async function handleRemoverManual() {
    const resDelete = await api
      .delete("deleteManual", {
        params: {
          id_manual: idManual,
          id_arquivo: idArquivo,
        },
      })
      .then((response) => {
        toast.success("Manual removido com sucesso!", { position: "top-right", autoClose: 5000 });
        setModalConfirm(false);
        Router.push("/listarManuais");
      })
      .catch((error) => {
        toast.error("Aconteceu um erro!", { position: "top-right", autoClose: 5000 });
        setModalConfirm(false);
        Router.push("/listarManuais");
      });
  }

  function handleAddManual() {
    Router.push("/addManuais");
  }

  function handleOnChange(content) {
    let texto = content;
  }

  const { usuario } = useContext(AuthContext);

  return (
    <Container>
      <MenuSuperior usuarios={[]}></MenuSuperior>

      <DivCenter>
        <NewButton onClick={handleAddManual}>Adicionar Manual</NewButton>
        <ListPost>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Data de cadastro</th>
              <th>Ações</th>
            </tr>
          </thead>
          {manuais?.map((manual) => {
            return (
              <tbody key={manual.id_manual}>
                <tr>
                  <td>{manual.nome}</td>
                  <td>{manual.data_cadastro}</td>
                  <td>
                    <BotaoRemover
                      onClick={() =>
                        handleOpenConfirm({
                          id_manual: manual.id_manual,
                          id_arquivo: manual.id_arquivo,
                        })
                      }
                      style={{ display: "flex", alignItems: "center", gap: "6px" }}
                    >
                      <FaTrash /> Remover
                    </BotaoRemover>
                    <BotaoEditar
                      onClick={() =>
                        handleShowUpdateModal(
                          manual.id_arquivo,
                          manual.id_manual
                        )
                      }
                      style={{ display: "flex", alignItems: "center", gap: "6px" }}
                    >
                      <FaEdit /> Editar
                    </BotaoEditar>

                    {isModalVisible && (
                      <ContainerModal>
                        <BotaoVisualizar
                          onClick={() =>
                            handleShowModal({
                              id_manual: manual.id_manual,
                            })
                          }
                        >
                          Editar Imagem
                        </BotaoVisualizar>

                        <Modal>
                          <CloseModalButton onClick={handleCloseModal}>
                            Fechar
                          </CloseModalButton>
                          <FormModal
                            onSubmit={handleSubmit(handleUpdateImagem)}
                          >
                            <ConteudoModal>
                              <input
                                type="hidden"
                                {...register("id_manual")}
                                defaultValue={idManual}
                                onChange={handleOnChange}
                                name="id_manual"
                              />
                              <input
                                type="hidden"
                                {...register("id_imagem")}
                                defaultValue={idImagem}
                                onChange={handleOnChange}
                                name="id_imagem"
                              />
                              <label>
                                Selecione uma imagem para substituir a atual!
                              </label>

                              <input
                                {...register("imagem")}
                                type="file"
                                accept="image/*"
                              />
                            </ConteudoModal>
                            <SubmitButton type="submit">Gravar</SubmitButton>
                          </FormModal>
                        </Modal>
                      </ContainerModal>
                    )}
                  </td>
                </tr>
              </tbody>
            );
          })}
        </ListPost>
      </DivCenter>
      <Footer>
        &copy; Todos os direitos reservados 
      </Footer>

      {isModalUpdateVisible && (
        <ContainerModal>
          <Modal>
            <CloseModalButton onClick={handleCloseModal}>
              Fechar
            </CloseModalButton>
            <FormModal onSubmit={handleSubmit(handleUpdateManual)}>
              <ConteudoModal>
                <TituloModal>
                  <input
                    type="hidden"
                    {...register("id_manual")}
                    value={manual?.id_manual}
                  />
                  <input
                    type="hidden"
                    {...register("id_arquivo")}
                    value={manual?.id_arquivo}
                  />
                  <ImagemModal></ImagemModal>
                  <label>Nome</label>
                  <input
                    {...register("titulo")}
                    defaultValue={manual?.nome}
                    name="titulo"
                    onChange={handleOnChange}
                  />
                  <button>
                    <a href={arquivo} rel="noreferrer" target="_blank">
                      Clique aqui para ver o arquivo atual!
                    </a>
                  </button>
                  <label>Para trocar o arquivo, selecione outro!</label>
                  <input
                    {...register("arquivo")}
                    accept=".pdf, .doc, .docx, .xls, .xlsx"
                    type="file"
                    name="arquivo"
                  />
                </TituloModal>
              </ConteudoModal>
              <SubmitButton type="submit">Gravar</SubmitButton>
            </FormModal>
          </Modal>
        </ContainerModal>
      )}

      {isModalConfirm && (
        <ContainerModal>
          <Modal>
            <ConteudoModal>
              <TituloModal>
                <h3>
                  <b>Você confirma a exclusão!</b>
                </h3>
              </TituloModal>
              <ConfirmModal>
                <CancelButton onClick={handleCloseConfirm}>
                  <b>Cancelar</b>
                </CancelButton>
                <ConfirmButton onClick={() => handleRemoverManual()}>
                  <b>Confirmar</b>
                </ConfirmButton>
              </ConfirmModal>
            </ConteudoModal>
          </Modal>
        </ContainerModal>
      )}
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<ManuaisProps> = async (
  ctx
) => {
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

  const resManuais = await apiClient.get("/getManuais");
  const manuais = await resManuais.data;

  return {
    props: {
      manuais,
    },
  };
};
