/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  InputP,
  InputM,
  MenuMunicipio,
  Municipio,
  MenuMunicipioItem,
  DivTitulo,
  DivTituloConteudo,
  InputGG,
  InputSNIS,
  DivFormEixo,
} from "../../styles/financeiro";

import {
  Container,
  DivCenter,
  DivForm,
  DivFormCadastro,
  DivTituloForm,
  Form,
  InputG,
  SubmitButton,
  DivEixo,
  TextArea,
  DivTextArea,
  StepButton,
  StepContent,
  StepLabel,
  StepperNavigation,
  StepperWrapper,
  StepperContainer,
  StepperButton,
} from "../../styles/esgoto-indicadores";

import HeadIndicadores from "../../components/headIndicadores";
import { getAPIClient } from "../../services/axios";
import MenuIndicadores from "../../components/MenuIndicadores";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../services/api";
import MenuHorizontal from "../../components/MenuHorizontal";
import { toast, ToastContainer } from "react-nextjs-toast";
import MenuIndicadoresCadastro from "../../components/MenuIndicadoresCadastro";
import { Sidebar, SidebarItem } from "../../styles/residuo-solidos-in";
import { DivFormConteudo } from "../../styles/drenagem-indicadores";
import { BreadCrumbStyle, MainContent } from "../../styles/indicadores";
import { anosSelect } from "../../util/util";
import { bold } from "@uiw/react-md-editor/lib/commands";
import Link from "next/link";

interface IMunicipio {
  id_municipio: string;
  municipio_codigo_ibge: string;
  municipio_nome: string;
}

interface MunicipioProps {
  Imunicipio: IMunicipio[];
}

export default function Agua() {
  const { usuario, signOut, anoEditorSimisab, permission, isEditor } =
    useContext(AuthContext);
  const [dadosMunicipio, setDadosMunicipio] = useState<IMunicipio>(null);
  const [anoSelected, setAnoSelected] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [dadosAgua, setDadosAgua] = useState(null);
  const [content, setContent] = useState(null);
  const [activeForm, setActiveForm] = useState("teste");

  useEffect(() => {
    getMunicipio();
    if (anoEditorSimisab) {
      getDadosAgua(anoEditorSimisab);
      setAnoSelected(anoEditorSimisab);
    }
  }, [anoEditorSimisab]);

  async function getMunicipio() {
    const res = await api
      .get("getMunicipio", {
        params: { id_municipio: usuario.id_municipio },
      })
      .then((response) => {
        setDadosMunicipio(response.data);
      });
  }

  function handleOnChange(content) {
    setContent(content);
  }

  async function handleCadastro(data) {
    if (!isEditor) {
      toast.notify("Você não tem permissão para editar!", {
        title: "Atenção!",
        duration: 7,
        type: "error",
      });
      return;
    }

    data.id_agua = dadosAgua?.id_agua;
    data.id_municipio = usuario?.id_municipio;
    data.ano = anoSelected;

    const resCad = await api
      .post("create-agua", data)
      .then((response) => {
        toast.notify("Dados gravados com sucesso!", {
          title: "Sucesso!",
          duration: 7,
          type: "success",
        });
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    getDadosAgua(anoSelected);
  }

  async function getDadosAgua(ano) {
    const id_municipio = usuario?.id_municipio;
    const res = await api
      .post("get-agua-por-ano", { id_municipio: id_municipio, ano: ano })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    setDadosAgua(res[0]);
  }

  function seletcAno(ano: any) {
    setAnoSelected(ano);

    getDadosAgua(ano);
  }

  return (
    <Container>
      <ToastContainer></ToastContainer>
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuHorizontal
        municipio={dadosMunicipio?.municipio_nome}
      ></MenuHorizontal>
      <MenuIndicadoresCadastro></MenuIndicadoresCadastro>
      <Sidebar>
        <SidebarItem
          active={activeForm === "teste"}
          onClick={() => setActiveForm("teste")}
        >
          Teste
        </SidebarItem>
      </Sidebar>

      <MainContent>
        <BreadCrumbStyle style={{ width: '25%'}}>
                        <nav>
                          <ol>
                            <li>
                              <Link href="./home_indicadores">Home</Link>
                              <span> / </span>
                            </li>
                            <li>
                              <Link href="./prestacao-servicos-sinisa">Prestação de Serviços SINISA</Link>
                              <span> / </span>
                            </li>
                            <li>
                              <span>Água</span>
                            </li>
                          </ol>
                        </nav>
        </BreadCrumbStyle>
        <DivCenter>
          <Form onSubmit={handleSubmit(handleCadastro)}>
            <DivForm style={{ borderColor: "#12B2D5" }}>
              <DivTituloForm>Água</DivTituloForm>
              <DivFormEixo>
                <DivFormConteudo
                  active={
                    activeForm === "teste"
                  }
                >
                  <DivTitulo>
                    <DivTituloConteudo>Ano</DivTituloConteudo>
                  </DivTitulo>
                  {anoEditorSimisab ? (
                    <div
                      style={{
                        marginLeft: 40,
                        fontSize: 18,
                        fontWeight: "bolder",
                      }}
                    >
                      {anoEditorSimisab}
                    </div>
                  ) : (
                    ""
                  )}
                  {!anoEditorSimisab && (
                    <>
                      <label>Selecione o ano desejado:</label>
                      <select
                        name="ano"
                        id="ano"
                        onChange={(e) => seletcAno(e.target.value)}
                      >
                        <option>Selecionar</option>
                        {anosSelect().map((ano) => (
                          <option value={ano}>{ano}</option>
                        ))}
                      </select>
                    </>
                  )}
                </DivFormConteudo>
              </DivFormEixo>

              <DivFormEixo>
                <DivFormConteudo active={activeForm === "teste"}>
                  <DivTitulo>
                    <DivTituloConteudo>Teste</DivTituloConteudo>
                  </DivTitulo>
                  
                </DivFormConteudo>
                {isEditor && <SubmitButton type="submit">Gravar</SubmitButton>}
              </DivFormEixo>
            </DivForm>
          </Form>
        </DivCenter>
      </MainContent>
    </Container>
  );
}
