/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import {
  DivInput,
  MenuMunicipio,
  Municipio,
  MenuMunicipioItem,
  DivTitulo,
  DivFormEixo,
  DivTituloEixo,
  DivTituloConteudo,
  InputGG,
  InputP,
  InputM,
  DivSeparadora,
  InputSNIS,
  InputXL,
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
  Table,
} from "../../styles/esgoto-indicadores";

import HeadIndicadores from "../../components/headIndicadores";
import { toast } from "react-toastify";
import "suneditor/dist/css/suneditor.min.css";
import { getAPIClient } from "../../services/axios";
import MenuIndicadores from "../../components/MenuIndicadores";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../services/api";
import MenuHorizontal from "../../components/MenuHorizontal";
import MenuIndicadoresCadastro from "../../components/MenuIndicadoresCadastro";
import { Sidebar, SidebarItem } from "../../styles/residuo-solidos-in";
import { DivFormConteudo } from "../../styles/drenagem-indicadores";
import { BreadCrumbStyle, MainContent } from "../../styles/indicadores";
import { anosSelect } from "../../util/util";
import Link from "next/link";

interface IMunicipio {
  id_municipio: string;
  municipio_codigo_ibge: string;
  municipio_nome: string;
}

interface MunicipioProps {
  municipio: IMunicipio[];
}

export default function Esgoto({ municipio }: MunicipioProps) {
  const { usuario, isEditor, isAuthenticated, anoEditorSimisab, permission } =
    useContext(AuthContext);
  const [dadosMunicipio, setDadosMunicipio] = useState<IMunicipio | any>(
    municipio
  );
  const [anoSelected, setAnoSelected] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [content, setContent] = useState("");
  const [dadosEsgoto, setDadosEsgoto] = useState(null);
  const [activeForm, setActiveForm] = useState("ligacoes");

  useEffect(() => {
    getMunicipio();
    if (anoEditorSimisab) {
      getDadosEsgoto(anoEditorSimisab);
      setAnoSelected(anoEditorSimisab);
    }
  }, [municipio, anoEditorSimisab]);

  async function getMunicipio() {
    const res = await api
      .get("getMunicipio", {
        params: { id_municipio: usuario.id_municipio },
      })
      .then((response) => {
        setDadosMunicipio(response.data);
      });
  }

  async function handleCadastro(data) {
    if (!isEditor) {
      toast.error("Você não tem permissão para editar!", { position: "top-right", autoClose: 5000 });
      return;
    }

    data.id_esgoto = dadosEsgoto?.id_esgoto;
    data.id_municipio = usuario.id_municipio;
    data.ano = anoSelected;
    const resCad = await api
      .post("create-esgoto", data)
      .then((response) => {
        toast.success("Dados gravados com sucesso!", { position: "top-right", autoClose: 5000 });
        return response.data;
      })
      .catch((error) => {
        toast.error("Erro ao gravar os dados!", { position: "top-right", autoClose: 5000 });
        console.log(error);
      });
    getDadosEsgoto(anoSelected);
  }

  async function getDadosEsgoto(ano: any) {
    const id_municipio = usuario.id_municipio;

    await api
      .post("get-esgoto-por-ano", { id_municipio: id_municipio, ano: ano })
      .then((response) => {
        const res = response.data;
        setDadosEsgoto(res[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const setOptions = {
    attributesWhitelist: {
      all: "data-id|data-type",
    },
    defaultTag: "p",
  };

  function handleOnChange(content) {
    setContent(content);
  }

  function seletcAno(ano: any) {
    setAnoSelected(ano);

    getDadosEsgoto(ano);
  }

  return (
    <Container>
      
      <HeadIndicadores usuarios={[]}></HeadIndicadores>
      <MenuHorizontal
        municipio={dadosMunicipio?.municipio_nome}
      ></MenuHorizontal>
      <MenuIndicadoresCadastro></MenuIndicadoresCadastro>
      <Sidebar>
        <SidebarItem
          active={activeForm === "ligacoes"}
          onClick={() => setActiveForm("ligacoes")}
        >
          Ligações e economias
        </SidebarItem>
        <SidebarItem
          active={activeForm === "volumes"}
          onClick={() => setActiveForm("volumes")}
        >
          Volumes
        </SidebarItem>
        <SidebarItem
          active={activeForm === "extencao"}
          onClick={() => setActiveForm("extencao")}
        >
          Extenção da rede
        </SidebarItem>
        <SidebarItem
          active={activeForm === "consumo"}
          onClick={() => setActiveForm("consumo")}
        >
          Consumo de energia elétrica
        </SidebarItem>
        <SidebarItem
          active={activeForm === "observacoes"}
          onClick={() => setActiveForm("observacoes")}
        >
          Observações, esclarecimentos ou sugestões
        </SidebarItem>
      </Sidebar>
      <MainContent>
        <BreadCrumbStyle style={{ width: '25%'}}>
                                <nav>
                                  <ol>
                                    <li>
                                      <Link href="/indicadores/home_indicadores">Home</Link>
                                      <span> / </span>
                                    </li>
                                    <li>
                                      <Link href="/indicadores/prestacao-servicos">Prestação de Serviços</Link>
                                      <span> / </span>
                                    </li>
                                    <li>
                                      <span>Esgoto</span>
                                    </li>
                                  </ol>
                                </nav>
            </BreadCrumbStyle>
        <DivCenter>
          <Form onSubmit={handleSubmit(handleCadastro)}>
            <DivForm>
              <DivTituloForm style={{ borderColor: "#0085bd" }}>
                Esgoto
              </DivTituloForm>
              <DivFormEixo>
                <DivFormConteudo
                  active={
                    activeForm === "ligacoes" ||
                    activeForm === "volumes" ||
                    activeForm === "extencao" ||
                    activeForm === "consumo" ||
                    activeForm === "observacoes"
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
                <DivFormConteudo active={activeForm === "ligacoes"}>
                  <DivTitulo>
                    <DivTituloConteudo>Ligações e economias</DivTituloConteudo>
                  </DivTitulo>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <table>
                      <tbody>
                        <tr>
                          <th>Código SNIS</th>
                          <th>Descrição</th>
                          <th>Ano: {anoSelected}</th>
                          <th></th>
                        </tr>
                        <tr>
                          <td>ES009</td>
                          <td>Quantidade de ligações totais de esgoto</td>
                          <td>
                            <input
                              {...register("ES009")}
                              defaultValue={dadosEsgoto?.es009}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </td>
                          <td>ligação</td>
                        </tr>

                        <tr>
                          <td>ES002</td>
                          <td>Quantidade de ligações ativas de esgoto</td>
                          <td>
                            <input
                              {...register("ES002")}
                              defaultValue={dadosEsgoto?.es002}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </td>
                          <td>ligação</td>
                        </tr>

                        <tr>
                          <td>ES003</td>
                          <td>Quantidade de economias ativas de esgoto</td>
                          <td>
                            <input
                              {...register("ES003")}
                              defaultValue={dadosEsgoto?.es003}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </td>
                          <td>ligação</td>
                        </tr>

                        <tr>
                          <td>ES008</td>
                          <td>
                            Quantidade de economias residenciais ativas de
                            esgoto
                          </td>
                          <td>
                            <input
                              {...register("ES008")}
                              defaultValue={dadosEsgoto?.es008}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </td>
                          <td>ligação</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </DivFormConteudo>

                <DivFormConteudo active={activeForm === "volumes"}>
                  <DivTitulo>
                    <DivTituloConteudo>Volumes</DivTituloConteudo>
                  </DivTitulo>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <table>
                      <tbody>
                        <tr>
                          <th>Código SNIS</th>
                          <th>Descrição</th>
                          <th>Ano: {anoSelected}</th>
                          <th></th>
                        </tr>
                        <tr>
                          <td>ES005</td>
                          <td>Volume de esgoto coletado</td>
                          <td>
                            <input
                              {...register("ES005")}
                              defaultValue={dadosEsgoto?.es005}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </td>
                          <td>1.000m³/ano</td>
                        </tr>
                        <tr>
                          <td>ES006</td>
                          <td>Volume de esgoto tratado</td>
                          <td>
                            <input
                              {...register("ES006")}
                              defaultValue={dadosEsgoto?.es006}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </td>
                          <td>1.000m³/ano</td>
                        </tr>
                        <tr>
                          <td>ES007</td>
                          <td>Volume de esgoto faturado</td>
                          <td>
                            <input
                              {...register("ES007")}
                              defaultValue={dadosEsgoto?.es007}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </td>
                          <td>1.000m³/ano</td>
                        </tr>
                        <tr>
                          <td>ES012</td>
                          <td>Volume de esgoto bruto exportado</td>
                          <td>
                            <input
                              {...register("ES012")}
                              defaultValue={dadosEsgoto?.es012}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </td>
                          <td>1.000m³/ano</td>
                        </tr>
                        <tr>
                          <td>ES015</td>
                          <td>
                            Volume de esgoto bruto tratado nas instalações do
                            importador
                          </td>
                          <td>
                            <input
                              {...register("ES015")}
                              defaultValue={dadosEsgoto?.es015}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </td>
                          <td>1.000m³/ano</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </DivFormConteudo>

                <DivFormConteudo active={activeForm === "extencao"}>
                  <DivTitulo>
                    <DivTituloConteudo>Extenção da rede</DivTituloConteudo>
                  </DivTitulo>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <table>
                      <tbody>
                        <tr>
                          <th>Código SNIS</th>
                          <th>Descrição</th>
                          <td>Ano: {anoSelected}</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>ES004</td>
                          <td>Extenção da rede</td>
                          <td>
                            <input
                              {...register("ES004")}
                              defaultValue={dadosEsgoto?.es004}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </td>
                          <td>KM</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </DivFormConteudo>

                <DivFormConteudo active={activeForm === "consumo"}>
                  <DivTitulo>
                    <DivTituloConteudo>
                      Consumo de energia elétrica
                    </DivTituloConteudo>
                  </DivTitulo>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <table>
                      <tbody>
                        <tr>
                          <th>Código SNIS</th>
                          <th>Descrição</th>
                          <td>Ano: {anoSelected}</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>ES028</td>
                          <td>
                            Consumo total de energia elétrica nos sistemas de
                            esgoto
                          </td>
                          <td>
                            <input
                              {...register("ES028")}
                              defaultValue={dadosEsgoto?.es028}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </td>
                          <td>1.000kWh/ano</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </DivFormConteudo>

                <DivFormConteudo active={activeForm === "observacoes"}>
                  <DivTitulo>
                    <DivTituloConteudo>
                      Observações, esclarecimentos ou sugestões
                    </DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <tbody>
                      <tr>
                        <th>Código SNIS</th>
                        <th>Descrição</th>
                        <td>Ano: {anoSelected}</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>ES098</td>
                        <td>Campo de justificativa</td>
                        <td>
                          <textarea
                            style={{ width: "500px" }}
                            {...register("ES098")}
                            defaultValue={dadosEsgoto?.es098}
                            onChange={handleOnChange}
                          />
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>ES099</td>
                        <td>Observações</td>
                        <td>
                          <textarea
                            style={{ width: "500px" }}
                            {...register("ES099")}
                            defaultValue={dadosEsgoto?.es099}
                            onChange={handleOnChange}
                          />
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>
                {anoSelected && isEditor && (
                  <SubmitButton type="submit">Gravar</SubmitButton>
                )}
              </DivFormEixo>
            </DivForm>
          </Form>
        </DivCenter>
      </MainContent>
    </Container>
  );
}
