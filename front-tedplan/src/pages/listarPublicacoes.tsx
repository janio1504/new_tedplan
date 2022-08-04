/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import React, { useContext, useState } from "react";
import { parseCookies } from "nookies";
import { AuthContext } from "../contexts/AuthContext";
import { getAPIClient } from "../services/axios";
import api from "../services/api";
import Router from "next/router";
import MenuSuperior from "../components/head";
import {
  FaSearch,
  FaDatabase,
  FaHome,
  FaSignOutAlt,
  FaRegTimesCircle,
} from "react-icons/fa";
import { toast, ToastContainer } from 'react-nextjs-toast';
import Image from "next/image";

import {
  Container,
  NewButton,
  ListPost,
  Footer,
  DivCenter,
  BotaoVisualizar,
  BotaoEditar,
  BotaoRemover,
  ContainerModal,
  Modal,
  CloseModalButton,
  ConteudoModal,
  ImagemModal,
  DivInput,
  Form,
  SubmitButton,
  TituloModal,
  ConfirmModal,
  CancelButton,
  ConfirmButton,
  FormModal,
} from "../styles/dashboard";
import { useForm } from "react-hook-form";

type IPublicacao = {
  id_publicacao: string;
  titulo: string;
  id_eixo: string;
  id_tipo_publicacao: string;
  id_categoria: string;
  categoria: string;
  id_municipio: string;
  eixo: string;
  tipo_publicacao: string;
  municipio: string;
  id_arquivo: string;
  id_imagem: string;
  imagem: string;
};

interface IMunicipios {
  id_municipio: string;
  nome: string;
}

interface IEixos {
  id_eixo: string;
  nome: string;
}

interface ITipoPublicacao {
  id_tipo_publicacao: string;
  nome: string;
}
interface ICategorias {
  id_categoria: string;
  nome: string;
}

interface PublicacaoProps {
  publicacoes: IPublicacao[];
  eixos: IEixos[];
  municipios: IMunicipios[];
  tipoPublicacao: ITipoPublicacao[];
  categorias: ICategorias[];
}

export default function Publicacoes({
  tipoPublicacao,
  categorias,
  municipios,
  eixos,
  publicacoes,
}: PublicacaoProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalUpdateVisible, setModalUpdateVisible] = useState(false);
  const [isPublicacao, setIsPublicacao] = useState<IPublicacao | any>(
    publicacoes
  );
  const [content, setContent] = useState("");
  const [imagem, setImagem] = useState<String | any>(null);
  const [isModalConfirm, setModalConfirm] = useState(false);
  const [idImagem, setIdImagem] = useState(null);
  const [idPublicacao, setIdPublicacao] = useState(null);
  const [idArquivo, setIdArquivo] = useState(null);
  

  function handleOnChange(content) {
    setContent(content);
  }

  async function handleShowModal({ id_publicacao }) {
    setIdPublicacao(id_publicacao);

    setModalVisible(true);
  }

  async function handleShowUpdateModal({ id_publicacao, id_imagem }) {
    const apiClient = getAPIClient();
    if (id_imagem) {
      const file = await apiClient({
        method: "GET",
        url: "getImagem",
        params: { id: id_imagem },
        responseType: "blob",
      });
      const img = URL.createObjectURL(file.data);
      setImagem(img);
    } else {
      setImagem(null);
    }

    const pub = await api.get("getPublicacao", {
      params: { id_publicacao: id_publicacao },
    });
    const publicacao = pub.data.map((value) => {
      setIsPublicacao(value);
    });
    setModalUpdateVisible(true);
  }

  function handleCloseModal() {
    Router.reload();
    setModalUpdateVisible(false);
  }

  function handleOpenConfirm({ id_publicacao, id_imagem, id_arquivo }) {
    setIdPublicacao(id_publicacao);
    setIdImagem(id_imagem);
    setIdArquivo(id_arquivo);
    setModalConfirm(true);
  }

  function handleCloseConfirm() {
    setModalConfirm(false);
  }

  async function handleRemoverPublicacao() {
    const resDelete = await api.delete("deletePublicacao", {
      params: {
        id_publicacao: idPublicacao,
        id_imagem: idImagem,
        id_arquivo: idArquivo,
      },
    });
    if (resDelete) {
    
    }
    Router.push("/listarPublicacoes");
  }

  function handleNewPublicacao() {
    Router.push("/addPublicacao");
  }

  async function handleUpdatePublicacao(data: IPublicacao) {
    const resPublicacao = await api
      .post("updatePublicacao", {
        id_publicacao: data.id_publicacao,
        id_categoria: data.id_categoria,
        id_eixo: data.id_eixo,
        id_tipo_publicacao: data.id_tipo_publicacao,
        id_municipio: data.id_municipio,
        titulo: data.titulo,
      })
      .then((response) => {
        return response;
      });
  }

  async function handleUpdateImagem(data: IPublicacao) {
    const apiClient = getAPIClient();
    const formData = new FormData();

    formData.append("imagem", data.imagem[0]);
    formData.append("id_publicacao", data.id_publicacao);
    formData.append("id_imagem", data.id_imagem);
    const res = await apiClient
      .post("updateImagemPublicacao", formData, {
        headers: {
          "Content-Type": `multipart/form-data=${formData}`,
        },
      })
      .then((response) => {
      
        return response;
      })
      .catch((error) => {
        return error;
      });
  }

  function handleImagemOnChange(files) {
    if (files) {
      let lista = [];
      for (let i = 0; i < files.length; i++) {
        let f = i;
        lista.push(URL.createObjectURL(files[f]));
      }
      setImagem(lista);
    }
  }

  const { usuario } = useContext(AuthContext);

  return (
    <Container>
      <MenuSuperior usuarios={[]}></MenuSuperior>

      <DivCenter>
        <NewButton onClick={handleNewPublicacao}>
          Adicionar Publicação
        </NewButton>
        <ListPost>
          <thead>
            <tr>
              <th>Titulo</th>
              <th>Eixo</th>
              <th>Tipo Publicação</th>
              <th>Municipio</th>
              <th>Ações</th>
            </tr>
          </thead>
          {publicacoes.map((publicacao) => {
            return (
              <tbody key={publicacao.id_publicacao}>
                <tr>
                  <td>{publicacao.titulo}</td>
                  <td>{publicacao.eixo}</td>
                  <td>{publicacao.tipo_publicacao}</td>
                  <td>{publicacao.municipio}</td>
                  <td>
                    <BotaoRemover
                      onClick={() =>
                        handleOpenConfirm({
                          id_publicacao: publicacao.id_publicacao,
                          id_imagem: publicacao.id_imagem,
                          id_arquivo: publicacao.id_arquivo,
                        })
                      }
                    >
                      Remover
                    </BotaoRemover>
                    <BotaoEditar
                      onClick={() =>
                        handleShowUpdateModal({
                          id_publicacao: publicacao.id_publicacao,
                          id_imagem: publicacao.id_imagem,
                        })
                      }
                    >
                      Editar
                    </BotaoEditar>
                    <BotaoVisualizar
                      onClick={() =>
                        handleShowModal({
                          id_publicacao: publicacao.id_publicacao,
                        })
                      }
                    >
                      Editar Imagem
                    </BotaoVisualizar>
                    {isModalVisible && (
                      <ContainerModal>
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
                                {...register("id_publicacao")}
                                defaultValue={idPublicacao}
                                onChange={handleOnChange}
                                name="id_publicacao"
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
                              <ConfirmButton
                                onClick={() => handleRemoverPublicacao()}
                              >
                                <b>Confirmar</b>
                              </ConfirmButton>
                            </ConfirmModal>
                          </ConteudoModal>
                        </Modal>
                      </ContainerModal>
                    )}

                    {isModalUpdateVisible && (
                      <ContainerModal>
                        <Modal>
                          <CloseModalButton onClick={handleCloseModal}>
                            Fechar
                          </CloseModalButton>
                          <FormModal
                            onSubmit={handleSubmit(handleUpdatePublicacao)}
                          >
                            <ConteudoModal>
                              <input
                                type="hidden"
                                {...register("id_publicacao")}
                                defaultValue={isPublicacao.id_publicacao}
                                onChange={handleOnChange}
                                name="id_publicacao"
                              />
                              <TituloModal>
                                <label>Titulo</label>
                                <input
                                  {...register("titulo")}
                                  placeholder="Titulo da Publicacao"
                                  defaultValue={isPublicacao.titulo}
                                  onChange={handleOnChange}
                                />
                              </TituloModal>
                              <select
                                {...register("id_tipo_publicacao")}
                                name="id_tipo_publicacao"
                              >
                                <option value="">
                                  {isPublicacao.tipo_publicacao}
                                </option>
                                {tipoPublicacao.map((tipo) => (
                                  <option
                                    key={tipo.id_tipo_publicacao}
                                    value={tipo.id_tipo_publicacao}
                                  >
                                    {tipo.nome}
                                  </option>
                                ))}
                              </select>

                              <select
                                {...register("id_municipio")}
                                name="id_municipio"
                              >
                                <option value="">
                                  {isPublicacao.municipio}
                                </option>
                                {municipios.map((municipio) => (
                                  <option
                                    key={municipio.id_municipio}
                                    value={municipio.id_municipio}
                                  >
                                    {municipio.nome}
                                  </option>
                                ))}
                              </select>

                              <select {...register("id_eixo")} name="id_eixo">
                                <option value="">{isPublicacao.eixo}</option>
                                {eixos.map((eixo, key) => (
                                  <option key={key} value={eixo.id_eixo}>
                                    {eixo.nome}
                                  </option>
                                ))}
                              </select>
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
      <Footer>&copy; Todos os direitos reservados </Footer>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<PublicacaoProps> = async (
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


  const resMunicipio = await apiClient.get("/getMunicipios");
  const municipios = await resMunicipio.data;

  const resTipoPublicacao = await apiClient.get("/listTipoPublicacao");
  const tipoPublicacao = await resTipoPublicacao.data;

  const resEixo = await apiClient.get("/getEixos");
  const eixos = await resEixo.data;

  const resPublicacoes = await apiClient.get("/getPublicacoes");
  const publicacoes = await resPublicacoes.data;

  const resCategorias = await apiClient.get("/getCategorias");
  const categorias = await resCategorias.data;

  return {
    props: {
      publicacoes,
      municipios,
      tipoPublicacao,
      eixos,
      categorias,
    },
  };
};
