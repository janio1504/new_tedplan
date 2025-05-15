import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { parseCookies } from "nookies";
import { AuthContext } from "../contexts/AuthContext";
import { getAPIClient } from "../services/axios";
import api from "../services/api";
import Router from "next/router";
import MenuSuperior from "../components/headArquivos";
import {
  FaSearch,
  FaDatabase,
  FaHome,
  FaSignOutAlt,
  FaRegTimesCircle,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";
import { useToasts } from "react-toast-notifications";
import { toast, ToastContainer } from "react-nextjs-toast";
import "suneditor/dist/css/suneditor.min.css";
import { getData } from "./api/post";

import { useForm } from "react-hook-form";
import {
  DivFormConteudo,
  DivInput,
  DivCenter,
  SubmitButton,
  Form,
  Lista,
  Footer,
  Container,
  ColunaLista,
  ColTitulo,
  Collink,
  ColEixo,
  ColStatus,
  ColTipo,
  ColData,
  ColAcoes,
  HeaderLista,
  FooterLista,
  ContainerModal,
  Modal,
  CloseModalButton,
  ConteudoModal,
  FormModal,
  ColAcoesButton,
} from "../styles/views";

interface IArquivo {
  id_arquivo_ondrive: string;
  titulo: string;
  link: string;
  id_eixo: string;
  eixo: string;
  id_tipo_arquivo_ondrive: string;
  tipo_arquivo_ondrive: string;
  id_status: string;
  status: string;
  data_entrega: string;
  data_final: string;
}
interface IEixo {
  id_eixo: string;
  nome: string;
}

interface IStatus {
  id_status: string;
  nome: string;
}

interface ITipo {
  id_tipo_arquivo_ondrive: string;
  nome: string;
}

interface ArquivoProps {
  arquivos: IArquivo[];
  eixos: IEixo[];
  status: IStatus[];
  tipo_arquivo_ondrive: ITipo[];
}

export default function ArquivosOndrive({
  arquivos,
  eixos,
  status,
  tipo_arquivo_ondrive,
}: ArquivoProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalUpdateVisible, setModalUpdateVisible] = useState(false);
  const [isModalConfirm, setModalConfirm] = useState(false);
  const [imagem, setImagem] = useState<String | ArrayBuffer>(null);

  async function handlebuscaFiltrada(data: IArquivo) {}

  function handleCloseModal() {
    Router.reload();
    setModalVisible(false);
  }

  async function handleUpdateArquivo(data: IArquivo) {
    return;
    const apiClient = getAPIClient();

    const post = await apiClient.post("updateArquivoOndrive", { data });
    console.log(post.data);
  }

  function handleOpenConfirm() {
    setModalConfirm(true);
  }

  function handleCloseConfirm() {
    setModalConfirm(false);
  }

  async function handleRemoverArquivo({ id_arquivo_ondrive }) {
    const resDelete = await api.delete("deletePost", {
      params: { id_arquivo_ondrive: id_arquivo_ondrive },
    });
    toast.notify("Dados removidos com sucesso!", {
      title: "Sucesso!",
      duration: 7,
      type: "success",
    });
    setModalConfirm(false);
    Router.push("/postagens");
  }

  function handleOpenModal() {
    setModalVisible(true);
  }

  const setOptions = {
    attributesWhitelist: {
      all: "data-id|data-type",
    },
    defaultTag: "p",
  };

  const { usuario } = useContext(AuthContext);

  return (
    <Container>
      <MenuSuperior></MenuSuperior>

      <DivCenter>
        <DivFormConteudo>
          <Form onSubmit={handleSubmit(handlebuscaFiltrada)}>
            <DivInput>
              <label>Titulo:</label>
              <input
                {...register("titulo")}
                placeholder="Titulo da publicação"
              ></input>
            </DivInput>

            <DivInput>
              <label>Eixos:</label>
              <select {...register("id_eixo")}>
                <option value="">Todos</option>
                {eixos.map((eixo, key) => (
                  <option key={key} value={eixo.id_eixo}>
                    {eixo.nome}
                  </option>
                ))}
              </select>
            </DivInput>

            <DivInput>
              <label>Tipo de arquivo:</label>
              <select {...register("id_tipo_arquivo_ondrive")}>
                <option value="">Todos</option>
                {tipo_arquivo_ondrive.map((tipo, key) => (
                  <option key={key} value={tipo.id_tipo_arquivo_ondrive}>
                    {tipo.nome}
                  </option>
                ))}
              </select>
            </DivInput>

            <DivInput>
              <label>Status:</label>
              <select {...register("status")}>
                <option value="">Todos</option>
                {status.map((status, key) => (
                  <option key={key} value={status.id_status}>
                    {status.nome}
                  </option>
                ))}
              </select>
            </DivInput>

            <DivInput>
              <SubmitButton>Filtrar</SubmitButton>
            </DivInput>
          </Form>
          <HeaderLista>
            <ColTitulo>Titulo</ColTitulo>
            <ColEixo>Eixo</ColEixo>
            <ColTipo>Tipo Arquivo</ColTipo>
            <Collink>Link</Collink>
            <ColStatus>Status</ColStatus>
            <ColData>Data Entrega</ColData>
            <ColData>Data Final</ColData>
          </HeaderLista>
          {arquivos.map((arquivo) => (
            <Lista key={arquivo.id_arquivo_ondrive}>
              <ColTitulo>{arquivo.titulo}</ColTitulo>
              <ColEixo>{arquivo.eixo}</ColEixo>
              <ColTipo>{arquivo.tipo_arquivo_ondrive}</ColTipo>
              <Collink>{arquivo.link}</Collink>
              <ColStatus>{arquivo.status}</ColStatus>
              <ColData>{arquivo.data_entrega}</ColData>
              <ColData>{arquivo.data_final}</ColData>
              <ColAcoes>
                <ColAcoesButton onClick={() => handleOpenModal()}>
                  <FaEdit title="Editar" size={18} />
                </ColAcoesButton>
              </ColAcoes>
              <ColAcoes>
                <ColAcoesButton
                  onClick={() =>
                    handleRemoverArquivo({
                      id_arquivo_ondrive: arquivo.id_arquivo_ondrive,
                    })
                  }
                >
                  <FaTrashAlt title="Remover" size={18} />
                </ColAcoesButton>

                {isModalVisible && (
                  <ContainerModal>
                    <Modal>
                      <CloseModalButton onClick={handleCloseModal}>
                        Fechar
                      </CloseModalButton>
                      <FormModal onSubmit={handleSubmit(handleUpdateArquivo)}>
                        <ConteudoModal>
                          <input
                            type="hidden"
                            {...register("id_arquivo_ondrive")}
                            value={arquivo.id_arquivo_ondrive}
                          />
                          <p>Selecione um status para o documento</p>

                          <select
                            aria-invalid={errors.value ? "true" : "false"}
                            {...register("id_status", { required: true })}
                          >
                            <option value="">Status</option>
                            {status.map((value) => (
                              <option
                                key={value.id_status}
                                value={value.id_status}
                              >
                                {value.nome}
                              </option>
                            ))}
                          </select>
                          {errors.id_status && errors.id_status.type && (
                            <span>Selecionar um status é obrigatório!</span>
                          )}
                        </ConteudoModal>
                        <SubmitButton type="submit">Gravar</SubmitButton>
                      </FormModal>
                    </Modal>
                  </ContainerModal>
                )}
              </ColAcoes>
            </Lista>
          ))}
          <FooterLista></FooterLista>
        </DivFormConteudo>
      </DivCenter>
      <Footer>
        &copy; Todos os direitos reservados<ToastContainer></ToastContainer>{" "}
      </Footer>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<ArquivoProps> = async (
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

  const resArquivos = await apiClient.get("/getArquivosOndrive");
  const arquivos = await resArquivos.data;

  const resEixo = await apiClient.get("/getEixos");
  const eixos = await resEixo.data;

  const resStatus = await apiClient.get("/getStatus");
  const status = await resStatus.data;

  const resTipo = await apiClient.get("/getTipoArquivo");
  const tipo_arquivo_ondrive = await resTipo.data;

  return {
    props: {
      eixos,
      arquivos,
      status,
      tipo_arquivo_ondrive,
    },
  };
};
