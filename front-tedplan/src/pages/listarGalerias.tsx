/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { parseCookies } from "nookies";
import { AuthContext } from "../contexts/AuthContext";
import { getAPIClient } from "../services/axios";
import api from "../services/api";
import Router from "next/router";
import MenuSuperior from "../components/head";
import headIndicadores from "../components/headIndicadores";
import {
  FaSearch,
  FaDatabase,
  FaHome,
  FaSignOutAlt,
  FaRegTimesCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";


import {
  Container,
  NewButton,
  ListPost,
  Footer,
  DivCenter,
  BotaoVisualizar,
  BotaoEditar,
  BotaoRemover,
  ModalGaleria,
  ImagemGaleria,
  ImagensGaleria,
  ContainerImagems,
  ModalImgAmpliada,
  ImagenAmpliada,
  DivMenuTitulo,
  MenuMunicipioItem,
} from "../styles/dashboard";

import {
  ContainerModal,
  Modal,
  CloseModalButton,
  ConteudoModal,
  ImagemModal,
  SubmitButton,
  TituloModal,
  ConfirmModal,
  CancelButton,
  ConfirmButton,
  FormModal,
  BodyDashboard,
} from "../styles/dashboard-original";

import { useForm } from "react-hook-form";
import image from "next/image";
import { Form } from "../styles/indicadores";
import HeadIndicadores from "../components/headIndicadores";

interface IGaleria {
  id_galeria: string;
  titulo: string;
  descricao: string;
  mes: string;
  ano: string;
  id_imagem: string;
  imagem: string;
}

interface GaleriaProps {
  galerias: IGaleria[];
}

type Imagem = {
  img: string | ArrayBuffer;
};

export default function Postagens({ galerias }: GaleriaProps) {
  const { register, handleSubmit, reset } = useForm();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalGaleria, setModalGaleria] = useState(false);
  const [isModalConfirm, setModalConfirm] = useState(false);
  const [isModalUpdateVisible, setModalUpdateVisible] = useState(false);
  const [isGaleria, setGaleria] = useState(null);
  const [idGaleria, setIdGaleria] = useState(null);
  const [idImagem, setIdImagen] = useState(null);
  const [imagem, setImagem] = useState(null);
  const [imagensGaleria, setImagensGaleria] = useState(null);
  const [modalImagemAmpliada, setModalImagemAmpliada] = useState(false);
  const [imagemAmpliada, setImagemAmpliada] = useState(null);
  const {signOut} = useContext(AuthContext);

  const fileInputRef = useRef<HTMLInputElement>();

  async function handleShowModal(galeria) {
    setGaleria(galeria);
    setModalVisible(true);
  }

  function handleImagemAmpliada(imagem) {
    setImagemAmpliada(imagem);
    setModalImagemAmpliada(true);
  }
  function handleCloseModalImgAmpliada() {
    setModalImagemAmpliada(false);
  }

  function handleCloseModal() {
    Router.reload();
    setModalVisible(false);
  }

  function handleOpenConfirm({ id_galeria, id_imagem }) {
    setIdGaleria(id_galeria);
    setIdImagen(id_imagem);
    setModalConfirm(true);
  }

  function handleCloseConfirm() {
    Router.reload();
    setModalConfirm(false);
  }

  async function handleModalGaleriaOpen({ id_galeria }) {
    const apiClient = getAPIClient();
    const resImagens = await api.get("/getImagens", {
      params: { id_galeria: id_galeria },
    });

    const imagens = await Promise.all(
      resImagens.data.map(async (imagem) => {
        const img = await apiClient({
          method: "GET",
          url: "getImagem",
          params: { id: imagem.id },
          responseType: "blob",
        })
          .then((response) => {
            return {
              imagen: URL.createObjectURL(response.data),
              id: imagem.id,
            };
          })
          .catch((error) => {
            console.log(error);
          });
        return img;
      })
    );
    setIdGaleria(id_galeria);
    setImagensGaleria(imagens);
    setModalGaleria(true);
  }

  function handleModalGaleriaClose() {
    setModalGaleria(false);
  }

  async function handleRemoverGaleria() {
    const resDelete = await api.delete("deleteGaleria", {
      params: { id_galeria: idGaleria, id_imagem: idImagem },
    });
    toast.error("Os dados foram removidos!", { position: "top-right", autoClose: 5000 });
    setModalConfirm(false);
    Router.push("/listarGalerias");
  }

  async function handleAddImagens(data) {
    try {
      // Verificar se há arquivos selecionados
      if (!data.imagem || !data.imagem.length) {
        toast.warning("Selecione pelo menos uma imagem!", { position: "top-right", autoClose: 5000 });
        return;
      }

      for (let img of data.imagem) {
        const formData = new FormData();
        formData.append("imagem", img);
        formData.append("id_galeria", data.id_galeria);

        await api.post("/addImagensGaleria", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Corrigido o Content-Type
          },
        });
      }

      toast.success("Imagens adicionadas com sucesso!", { position: "top-right", autoClose: 5000 });

      // Fechar modal e atualizar lista
      setModalVisible(false);
      Router.reload();
    } catch (error) {
      console.error("Erro ao adicionar imagens:", error);
      toast.error("Erro ao adicionar imagens!", { position: "top-right", autoClose: 5000 });
    }
  }

  async function handleRemoverImagem(id_imagem) {
    const resDelete = await api.delete("deleteImagem", {
      params: { id_imagem: id_imagem },
    });
    toast.error("Os dados foram removidos!", { position: "top-right", autoClose: 5000 });
    handleModalGaleriaOpen({ id_galeria: idGaleria });
  }

  async function handleShowUpdateModal({ id_galeria }) {
    if (id_galeria) {
      const p = await api.get("getGaleria", {
        params: { id_galeria: id_galeria },
      });
      const galery = p.data.map((r: IGaleria) => {
        return r;
      });
      setGaleria(galery[0]);
    }

    setModalUpdateVisible(true);
  }

  function handleUpdateGaleria(data: IGaleria) {
    console.log(data);
  }

  function handleOnChange(event) {
    const files = event.target.files;
    const imagem = [];
    imagem[0] = URL.createObjectURL(files[0]);

    setImagem(imagem);
  }

  function handleAddGaleria() {
    Router.push("/addGaleria");
  }

  const setOptions = {
    attributesWhitelist: {
      all: "data-id|data-type",
    },
    defaultTag: "p",
  };

  const { usuario } = useContext(AuthContext);
   async function handleSignOut() {
        signOut();
      }
    
      function handleSimisab() {
            Router.push("/indicadores/home_indicadores");
          }

  return (
    <Container>
      {/* <MenuSuperior usuarios={[]}></MenuSuperior> */}
       <HeadIndicadores usuarios={[]}></HeadIndicadores>
              <DivMenuTitulo> 
                    <text style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      padding: '15px 20px',
                      float: 'left'
                      }}>
                       Painel de Edição 
                      </text>
                    <ul style={{}}>
                    <MenuMunicipioItem style={{marginRight: '18px'}}  onClick={handleSignOut}>Sair</MenuMunicipioItem>
                    <MenuMunicipioItem onClick={handleSimisab}>SIMISAB</MenuMunicipioItem>
                    </ul>
              </DivMenuTitulo>
      <BodyDashboard>
        <Sidebar />
      <DivCenter>
        <NewButton onClick={handleAddGaleria}>Adicionar Galeria</NewButton>
        <ListPost>
          <thead>
            <tr>
              <th>Titulo</th>
              <th>Mês</th>
              <th>Ano</th>
              <th>Ações</th>
            </tr>
          </thead>
          {galerias.map((galeria) => {
            return (
              <tbody key={galeria.id_galeria}>
                <tr>
                  <td>{galeria.titulo}</td>
                  <td>{galeria.mes}</td>
                  <td>{galeria.ano}</td>
                  <td>
                    <BotaoRemover
                      onClick={() =>
                        handleOpenConfirm({
                          id_galeria: galeria.id_galeria,
                          id_imagem: galeria.id_imagem,
                        })
                      }
                    >
                      Remover
                    </BotaoRemover>

                    <BotaoVisualizar onClick={() => handleShowModal(galeria)}>
                      Adicionar imagens
                    </BotaoVisualizar>
                    <BotaoVisualizar
                      onClick={() =>
                        handleModalGaleriaOpen({
                          id_galeria: galeria.id_galeria,
                        })
                      }
                    >
                      Visualizar imagens
                    </BotaoVisualizar>
                  </td>
                </tr>
              </tbody>
            );
          })}
        </ListPost>
      </DivCenter>
      </BodyDashboard>

      <Footer>
        &copy; Todos os direitos reservados{" "}
      </Footer>
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
                <ConfirmButton onClick={() => handleRemoverGaleria()}>
                  <b>Confirmar</b>
                </ConfirmButton>
              </ConfirmModal>
            </ConteudoModal>
          </Modal>
        </ContainerModal>
      )}

      {isModalVisible && (
        <ContainerModal>
          <Modal>
            <CloseModalButton onClick={handleCloseModal}>
              Fechar
            </CloseModalButton>
            <Form onSubmit={handleSubmit(handleAddImagens)}>
              <SubmitButton type="submit">Gravar</SubmitButton>
              <ConteudoModal>
                <TituloModal>
                  <input
                    {...register("id_galeria")}
                    type="hidden"
                    value={isGaleria.id_galeria}
                  />
                  <label>Insira uma imagem!</label>
                  <input
                    {...register("imagem")}
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const files = event.target.files;
                      if (files) {
                        setImagem(URL.createObjectURL(files[0]));
                      }
                    }}
                  />

                  <ImagemModal>
                    {imagem && <img src={`${imagem}`} alt="TedPlan" />}
                  </ImagemModal>
                </TituloModal>
              </ConteudoModal>
            </Form>
          </Modal>
        </ContainerModal>
      )}

      {isModalGaleria && (
        <ContainerModal>
          <ModalGaleria>
            <CloseModalButton onClick={handleCloseModal}>
              Fechar
            </CloseModalButton>

            <ContainerImagems>
              {imagensGaleria.map((imagem, key) => (
                <ImagensGaleria key={key}>
                  <button onClick={() => handleRemoverImagem(imagem.id)}>
                    <b>Remover</b>
                  </button>
                  <p>
                    <img
                      onClick={() => handleImagemAmpliada(imagem.imagen)}
                      src={imagem.imagen}
                      alt="TedPlan"
                    />
                  </p>
                </ImagensGaleria>
              ))}
            </ContainerImagems>
          </ModalGaleria>
        </ContainerModal>
      )}

      {modalImagemAmpliada && (
        <ContainerModal>
          <ModalImgAmpliada>
            <CloseModalButton onClick={handleCloseModalImgAmpliada}>
              Fechar
            </CloseModalButton>
            <ImagenAmpliada>
              <img src={`${imagemAmpliada}`} />
            </ImagenAmpliada>
          </ModalImgAmpliada>
        </ContainerModal>
      )}

      {isModalUpdateVisible && (
        <ContainerModal>
          <Modal>
            <CloseModalButton onClick={handleCloseModal}>
              Fechar
            </CloseModalButton>
            <FormModal onSubmit={handleSubmit(handleUpdateGaleria)}>
              <ConteudoModal>
                <TituloModal>
                  <input
                    type="hidden"
                    {...register("id_galeria")}
                    value={isGaleria.id_galeria}
                    onChange={handleOnChange}
                    name="id_galeria"
                  />

                  <label>Titulo</label>
                  <input
                    {...register("titulo")}
                    defaultValue={isGaleria.titulo}
                    onChange={handleOnChange}
                    name="titulo"
                  />
                </TituloModal>
              </ConteudoModal>
              <SubmitButton type="submit">Gravar</SubmitButton>
            </FormModal>
          </Modal>
        </ContainerModal>
      )}
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<GaleriaProps> = async (
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

  const res = await apiClient.get("/listGalerias");
  const galerias = await res.data;
  //const res = await apiClient.get('/getUsuario', { params: { id_usuario: 1 }})

  return {
    props: {
      galerias,
    },
  };
};
