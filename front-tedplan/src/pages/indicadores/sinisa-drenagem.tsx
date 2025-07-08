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

export default function SinisaDrenagem() {
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


  const [content, setContent] = useState(null);
  const [activeForm, setActiveForm] = useState("teste");

  useEffect(() => {
    getMunicipio();
    if (anoEditorSimisab) {
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

  }

  async function selectAno(ano: string) {
  setAnoSelected(ano);
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
                              <span>Drenagem</span>
                            </li>
                          </ol>
                        </nav>
        </BreadCrumbStyle>
        <DivCenter>
          <Form onSubmit={handleSubmit(handleCadastro)}>
            <DivForm style={{ borderColor: "#12B2D5" }}>
              <DivTituloForm>Drenagem</DivTituloForm>
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
                        onChange={(e) => selectAno(e.target.value)}
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
