/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import {
  DivInput,
  InputP,
  InputM,
  MenuMunicipio,
  Municipio,
  MenuMunicipioItem,
  DivTitulo,
  DivFormEixo,
  DivTituloEixo,
  DivTituloConteudo,
  InputGG,
  DivSeparadora,
  InputSNIS,
  InputXL,
  DivTituloFormResiduo,
  DivFormResiduo,
  DivBorder,
  LabelCenter,
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
import { toast } from "react-toastify";
import "suneditor/dist/css/suneditor.min.css";
import Router from "next/router";
import MenuIndicadoresCadastro from "../../components/MenuIndicadoresCadastro";
import { AuthContext } from "../../contexts/AuthContext";
import {
  Tabela,
  ContainerModal,
  Modal,
  CloseModalButton,
  ConteudoModal,
  FormModal,
  SubmitButtonModal,
  DivBotaoAdicionar,
  BreadCrumbStyle,
} from "../../styles/indicadores";
import api from "../../services/api";
import { DivFormConteudo } from "../../styles/drenagem-indicadores";

import { MainContent } from "../../styles/indicadores";
import { Sidebar, SidebarItem } from "../../styles/residuo-solidos-in";
import MenuHorizontal from "../../components/MenuHorizontal";
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

export default function ResiduosUnidades({ municipio }: MunicipioProps) {
  const { usuario, isEditor, anoEditorSimisab } = useContext(AuthContext);
  const [dadosMunicipio, setDadosMunicipio] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [modalCO020, setModalCO020] = useState(null);
  const [dadosQualidade, setDadosQualidade] = useState(null);
  const [content, setContent] = useState("");
  const [activeForm, setActiveForm] = useState("agua");

  useEffect(() => {
    getMunicipio();
      if (anoEditorSimisab) {
      getDadosQualidade(anoEditorSimisab);
      setAnoSelected(anoEditorSimisab);
    }
  }, [municipio, anoEditorSimisab]);

  async function getMunicipio() {
    const res = await api
      .get("getMunicipio", {
        params: { id_municipio: usuario.id_municipio },
      })
      .then((response) => {
        const res = response.data;
        setDadosMunicipio(res[0]);
      });
  }

  function handleOnChange(content) {
    setContent(content);
  }

  async function handleCadastro(data) {
    if (!isEditor) {
      toast.error("Você não tem permissão para editar!", { position: "top-right", autoClose: 5000 });
      return;
    }

    data.id_qualidade = dadosQualidade?.id_qualidade;
    data.id_municipio = usuario.id_municipio;
    data.ano = anoSelected;
    const resCad = await api
      .post("create-qualidade", data)
      .then((response) => {
        toast.success("Dados gravados com sucesso!", { position: "top-right", autoClose: 5000 });
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    getDadosQualidade(anoSelected);
  }

  async function getDadosQualidade(ano) {
    const id_municipio = usuario.id_municipio;
    await api
      .post("get-qualidade", { id_municipio: id_municipio, ano: ano })
      .then((response) => {
        setDadosQualidade(response.data[0]);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const [anoSelected, setAnoSelected] = useState(null);

  function seletcAno(ano: any) {
    setDadosQualidade(null);
    setAnoSelected(ano);

    getDadosQualidade(ano);
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
          active={activeForm === "agua"}
          onClick={() => setActiveForm("agua")}
        >
          Paralisações no sistema de distribuição de água
        </SidebarItem>
        <SidebarItem
          active={activeForm === "interrupcoes"}
          onClick={() => setActiveForm("interrupcoes")}
        >
          Interrupções sistemáticas no sistema de distribuição de água
        </SidebarItem>
        <SidebarItem
          active={activeForm === "extravasamento"}
          onClick={() => setActiveForm("extravasamento")}
        >
          Extravasamento de esgoto
        </SidebarItem>
        <SidebarItem
          active={activeForm === "tipoatendimento"}
          onClick={() => setActiveForm("tipoatendimento")}
        >
          Tipo de atendimento
        </SidebarItem>
        <SidebarItem
          active={activeForm === "amostra"}
          onClick={() => setActiveForm("amostra")}
        >
          Amostras
        </SidebarItem>

        <SidebarItem
          active={activeForm === "reclamacoes"}
          onClick={() => setActiveForm("reclamacoes")}
        >
          Reclamações sobre a qualidade da água
        </SidebarItem>
        <SidebarItem
          active={activeForm === "observacoes"}
          onClick={() => setActiveForm("observacoes")}
        >
          Observações
        </SidebarItem>
      </Sidebar>
      <MainContent>
        <BreadCrumbStyle style={{ width: '27%'}}>
                                      <nav>
                                        <ol>
                                          <li>
                                            <Link href="/indicadores/home_indicadores">Home</Link>
                                            <span> / </span>
                                          </li>
                                          <li>
                                            <Link href="./prestacao-servicos">Prestação de Serviços</Link>
                                            <span> / </span>
                                          </li>
                                          <li>
                                            <span>Qualidade</span>
                                          </li>
                                        </ol>
                                      </nav>
          </BreadCrumbStyle>
        <DivCenter>
          <Form onSubmit={handleSubmit(handleCadastro)}>
            <DivForm>
              <DivTituloForm>Qualidade</DivTituloForm>
              {/* <DivFormEixo>
                <DivTituloEixo>Água e Esgoto Sanitário</DivTituloEixo>
              </DivFormEixo> */}
              <DivFormEixo>
                <DivFormConteudo
                  active={
                    activeForm === "agua" ||
                    activeForm === "interrupcoes" ||
                    activeForm === "extravasamento" ||
                    activeForm === "tipoatendimento" ||
                    activeForm === "amostra" ||
                    activeForm === "reclamacoes" ||
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
                <DivFormConteudo active={activeForm === "agua"}>
                  <DivTitulo>
                    <DivTituloConteudo>
                      Paralisações no sistema de distribuição de água
                    </DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <tbody>
                      <tr>
                        <th>Código SNIS</th>
                        <th>Descrição</th>
                        <th>Ano: {anoSelected}</th>
                      </tr>

                      <tr>
                        <td>
                          <InputSNIS>QD002</InputSNIS>
                        </td>
                        <td>Quantidade de paralisações </td>
                        <td>
                          <InputP>
                            <input
                              {...register("QD002")}
                              defaultValue={dadosQualidade?.qd002}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </InputP>
                        </td>
                        <td>Paralisações</td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>QD003</InputSNIS>
                        </td>
                        <td>Duração das paralisações </td>
                        <td>
                          <InputP>
                            <input
                              {...register("QD003")}
                              defaultValue={dadosQualidade?.qd003}
                              onChange={handleOnChange}
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              type="text"
                            ></input>
                          </InputP>
                        </td>
                        <td>Horas</td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>QD004</InputSNIS>
                        </td>
                        <td>Quantidade de economias ativas atingidas.</td>
                        <td>
                          <InputP>
                            <input
                              {...register("QD004")}
                              defaultValue={dadosQualidade?.qd004}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </InputP>
                        </td>
                        <td>Economias</td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>

                <DivFormConteudo active={activeForm === "interrupcoes"}>
                  <DivTitulo>
                    <DivTituloConteudo>
                      Interrupções sistemáticas no sistema de distribuição de
                      água
                    </DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <tbody>
                      <tr>
                        <th>Código SNIS</th>
                        <th>Descrição</th>
                        <th>Ano {anoSelected}</th>
                      </tr>

                      <tr>
                        <td>
                          <InputSNIS>QD021</InputSNIS>
                        </td>
                        <td>Qualidade de interrupções sistemáticas </td>
                        <td>
                          <InputP>
                            <input
                              {...register("QD021")}
                              defaultValue={dadosQualidade?.qd021}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </InputP>
                        </td>
                        <td>Interrupções</td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>QD022</InputSNIS>
                        </td>
                        <td>Duração das interrupções sistemáticas</td>
                        <td>
                          <InputP>
                            <input
                              {...register("QD022")}
                              defaultValue={dadosQualidade?.qd022}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </InputP>
                        </td>
                        <td>Horas</td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>QD015</InputSNIS>
                        </td>
                        <td>Quantidade de economias ativas atingidas</td>
                        <td>
                          <InputP>
                            <input
                              {...register("QD015")}
                              defaultValue={dadosQualidade?.qd015}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </InputP>
                        </td>
                        <td>Economia</td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>

                <DivFormConteudo active={activeForm === "extravasamento"}>
                  <DivTitulo>
                    <DivTituloConteudo>
                      Extravasamento de esgoto
                    </DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <tbody>
                      <tr>
                        <th>Código SNIS</th>
                        <th>Descrição</th>
                        <th>Ano: {anoSelected}</th>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>QD011</InputSNIS>
                        </td>
                        <td>Quantidade de extravasamento registrados</td>
                        <td>
                          <InputP>
                            <input
                              {...register("QD011")}
                              defaultValue={dadosQualidade?.qd011}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </InputP>
                        </td>
                        <td>Extravasamento</td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>QD012</InputSNIS>
                        </td>
                        <td>Duração dos extravasamento registrado</td>
                        <td>
                          <InputP>
                            <input
                              {...register("QD012")}
                              defaultValue={dadosQualidade?.qd012}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </InputP>
                        </td>
                        <td>Hora</td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>

                <DivFormConteudo active={activeForm === "tipoatendimento"}>
                  <DivTitulo>
                    <DivTituloConteudo>Tipo de atendimento</DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <tbody>
                      <tr>
                        <th>Código SNIS</th>
                        <th>Descrição</th>
                        <th>Ano: {anoSelected}</th>
                      </tr>

                      <tr>
                        <td>
                          <InputSNIS>QD001</InputSNIS>
                        </td>
                        <td>
                          Tipo de atendimento da portaria sobre qualidade da
                          água
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("QD001")}
                              defaultValue={dadosQualidade?.qd001}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </InputP>
                        </td>
                        <td>1000 R$/ano</td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>

                <DivFormConteudo active={activeForm === "amostra"}>
                  <DivTitulo>
                    <DivTituloConteudo>
                      Amostra, na(s) saída(s) Unidade(s) de Tratamento e na
                      rede, para determinação do cloro residual
                    </DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <tbody>
                      <tr>
                        <th>Código SNIS</th>
                        <th style={{ width: "500px" }}>Descrição</th>
                        <th>Ano {anoSelected}</th>
                      </tr>

                      <tr>
                        <td>
                          <InputSNIS>QD020</InputSNIS>
                        </td>
                        <td>
                          Quantidade mínima de amostras obrigatórias para
                          aferição de cloro residual livre{" "}
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("QD020")}
                              defaultValue={dadosQualidade?.qd020}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </InputP>
                        </td>
                        <td>Amostra</td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>QD006</InputSNIS>
                        </td>
                        <td>
                          Quantidade de amostras analisadas para aferição de
                          cloro residual livre{" "}
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("QD006")}
                              defaultValue={dadosQualidade?.qd006}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </InputP>
                        </td>
                        <td>Amostra</td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>QD007</InputSNIS>
                        </td>
                        <td>
                          Quantidade de amostras analisadas para aferição de
                          cloro residual livre com resultados fora do padrão{" "}
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("QD007")}
                              defaultValue={dadosQualidade?.qd007}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </InputP>
                        </td>
                        <td>Amostra</td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>

                <DivFormConteudo active={activeForm === "amostra"}>
                  <DivTitulo>
                    <DivTituloConteudo>
                      Amostra, na(s) saída(s) Unidade(s) de Tratamento e na
                      rede, para determinação de turbidez
                    </DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <tbody>
                      <tr>
                        <th>Código SNIS</th>
                        <th style={{ width: "500px" }}>Descrição</th>
                        <th>Ano {anoSelected}</th>
                      </tr>

                      <tr>
                        <td>
                          <InputSNIS>QD019</InputSNIS>
                        </td>
                        <td>
                          Quantidade mínima de amostras obrigatórias para
                          aferição de turbidez{" "}
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("QD019")}
                              defaultValue={dadosQualidade?.qd019}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </InputP>
                        </td>
                        <td>Amostra</td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>QD008</InputSNIS>
                        </td>
                        <td>
                          Quantidade de amostras analisadas para aferição de
                          turbidez{" "}
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("QD008")}
                              defaultValue={dadosQualidade?.qd008}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </InputP>
                        </td>
                        <td>Amostra</td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>QD009</InputSNIS>
                        </td>
                        <td>
                          Quantidade de amostras analisadas para aferição de
                          turbidez com resultados fora do padrão{" "}
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("QD009")}
                              defaultValue={dadosQualidade?.qd009}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </InputP>
                        </td>
                        <td>Amostra</td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>
                <DivFormConteudo active={activeForm === "amostra"}>
                  <DivTitulo>
                    <DivTituloConteudo>
                      Amostra, na(s) saída(s) Unidade(s) de Tratamento e na
                      rede, para determinação de coliformes fecais
                    </DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <tbody>
                      <tr>
                        <th>Código SNIS</th>
                        <th style={{ width: "500px" }}>Descrição</th>
                        <th>Ano {anoSelected}</th>
                      </tr>

                      <tr>
                        <td>
                          <InputSNIS>QD018</InputSNIS>
                        </td>
                        <td>
                          Quantidade mínima de amostras obrigatórias para
                          aferição de coliformes fecais
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("QD018")}
                              defaultValue={dadosQualidade?.qd018}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </InputP>
                        </td>
                        <td>Amostra</td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>QD016</InputSNIS>
                        </td>
                        <td>
                          Quantidade de amostras analisadas para aferição de
                          coliformes fecais
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("QD016")}
                              defaultValue={dadosQualidade?.qd016}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </InputP>
                        </td>
                        <td>Amostra</td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>QD017</InputSNIS>
                        </td>
                        <td>
                          Quantidade de amostras analisadas para aferição de
                          coliformes fecais com resultados fora do padrão
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("QD017")}
                              defaultValue={dadosQualidade?.qd017}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </InputP>
                        </td>
                        <td>Amostra</td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>

                <DivFormConteudo active={activeForm === "amostra"}>
                  <DivTitulo>
                    <DivTituloConteudo>
                      Amostra, na(s) saída(s) Unidade(s) de Tratamento e na
                      rede, para determinação de coliformes totais
                    </DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <tbody>
                      <tr>
                        <th>Código SNIS</th>
                        <th style={{ width: "500px" }}>Descrição</th>
                        <th>Ano {anoSelected}</th>
                      </tr>

                      <tr>
                        <td>
                          <InputSNIS>QD028</InputSNIS>
                        </td>
                        <td>
                          Quantidade mínima de amostras obrigatórias para
                          aferição de coliformes totais
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("QD028")}
                              defaultValue={dadosQualidade?.qd028}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </InputP>
                        </td>
                        <td>Amostra</td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>QD026</InputSNIS>
                        </td>
                        <td>
                          Quantidade de amostras analisadas para aferição de
                          coliformes totais
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("QD026")}
                              defaultValue={dadosQualidade?.qd026}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </InputP>
                        </td>
                        <td>Amostra</td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>QD027</InputSNIS>
                        </td>
                        <td>
                          Quantidade de amostras analisadas para aferição de
                          coliformes totais com resultados fora do padrão{" "}
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("QD027")}
                              defaultValue={dadosQualidade?.qd027}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </InputP>
                        </td>
                        <td>Amostra</td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>

                <DivFormConteudo active={activeForm === "reclamacoes"}>
                  <DivTitulo>
                    <DivTituloConteudo>
                      Reclamações ou solicitações de serviços
                    </DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <tbody>
                      <tr>
                        <th>Código SNIS</th>
                        <th>Descrição</th>
                        <th>Ano {anoSelected}</th>
                      </tr>

                      <tr>
                        <td>
                          <InputSNIS>QD023</InputSNIS>
                        </td>
                        <td>
                          Quantidade de reclamações ou solicitações de serviços
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("QD023")}
                              defaultValue={dadosQualidade?.qd023}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </InputP>
                        </td>
                        <td>Reclamações</td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>QD024</InputSNIS>
                        </td>
                        <td>
                          Quantidade de serviços executados relativa às
                          reclamações ou solicitações feitas
                        </td>
                        <td>
                          <InputP>
                            <input
                              {...register("QD024")}
                              defaultValue={dadosQualidade?.qd024}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </InputP>
                        </td>
                        <td>Serviços</td>
                      </tr>
                      <tr>
                        <td>
                          <InputSNIS>QD025</InputSNIS>
                        </td>
                        <td>Tempo total de execução dos serviços </td>
                        <td>
                          <InputP>
                            <input
                              {...register("QD025")}
                              defaultValue={dadosQualidade?.qd025}
                              onChange={handleOnChange}
                              type="text"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            ></input>
                          </InputP>
                        </td>
                        <td>Horas</td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>

                <DivFormConteudo active={activeForm === "observacoes"}>
                  <DivTitulo>
                    <DivTituloConteudo>Observações</DivTituloConteudo>
                  </DivTitulo>

                  <table>
                    <tbody>
                      <tr>
                        <th>Código SNIS</th>
                        <th>Descrição</th>
                        <th>Ano {anoSelected}</th>
                      </tr>
                      <tr>
                        <td>QD099</td>
                        <td>Observações, esclarecimentos ou sugestões</td>
                        <td>
                          <textarea
                            style={{ width: "500px" }}
                            {...register("QD099")}
                            defaultValue={dadosQualidade?.qd099}
                            onChange={handleOnChange}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
