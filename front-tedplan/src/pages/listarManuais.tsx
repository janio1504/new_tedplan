/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
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
import { toast, ToastContainer } from 'react-nextjs-toast'
import "suneditor/dist/css/suneditor.min.css";
import { getData } from "./api/post";

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
  const [isNorma, setNorma] = useState<null | any>(null);
  const [imagem, setImagem] = useState<String | ArrayBuffer>(null);
  const [arquivo, setArquivo] = useState<String | any>(null);
  const [idNorma, setIdNorma] = useState(null);
  const [idImagem, setIdImagem] = useState(null);
  const [idArquivo, setIdArquivo] = useState(null);
  

  useEffect(() => {});

  async function handleShowModal(id_imagem, id_norma) {
    if (id_imagem) {
      const file = await api({
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

    setIdNorma(id_norma)
    setIdImagem(id_imagem)

    setModalVisible(true);
  }

  async function handleShowUpdateModal() {
    // if (id_arquivo) {
    //   const arquivo = await api({
    //     method: "GET",
    //     url: "getFile",
    //     params: { id: id_arquivo },
    //     responseType: "blob",
    //   }).then((response) => {
        
    //     return URL.createObjectURL(response.data);
    //   });
    //   setArquivo(arquivo);
    // } else {
    //   setArquivo(null);
    // }

    // if (id_norma) {
    //   const n = await api.get("getNorma", { params: { id_norma: id_norma } });
    //   const norma = n.data.map((r) => {
    //     return r;
    //   });

    //   setNorma(norma[0]);
    // }

    // setModalUpdateVisible(true);
  }

  function handleCloseModal() {
    Router.reload();
    setModalVisible(false);
  }

  function handleOpenConfirm({ id_manual,  id_arquivo }) {
  
    setIdArquivo(id_arquivo);
    setModalConfirm(true);
  }

  function handleCloseConfirm() {
    setModalConfirm(false);
  }

  async function handleUpdateNorma(data) {
    const formData = new FormData();

    formData.append("arquivo", data.arquivo[0]);
    formData.append("titulo", data.titulo);
    formData.append("id_arquivo", data.id_arquivo);
    formData.append("id_norma", data.id_norma);
    const resNorma = await api
      .post("updateNorma", formData, {
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
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }

  async function handleRemoverNorma() {
    const resDelete = await api
      .delete("deleteNorma", {
        params: {
          id_norma: idNorma,
          id_imagem: idImagem,
          id_arquivo: idArquivo,
        },
      })
      .then((response) => {
        toast.notify('Norma removida com sucesso!',{
          title: "Sucesso!",
          duration: 7,
          type: "success",
        })
        setModalConfirm(false);
        Router.push("/listarNormas");
      })
      .catch((error) => {
        toast.notify('Aconteceu um erro!',{
          title: "Erro!",
          duration: 7,
          type: "error",
        })
        setModalConfirm(false);
        Router.push("/listarNormas");
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
      <ToastContainer></ToastContainer>
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
                    >
                      Remover
                    </BotaoRemover>
                    <BotaoEditar
                      onClick={() =>('')}
                    >
                      Editar
                    </BotaoEditar>
                    <BotaoVisualizar
                      onClick={() =>('')}
                    >
                      Editar Imagem
                    </BotaoVisualizar>

             
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
