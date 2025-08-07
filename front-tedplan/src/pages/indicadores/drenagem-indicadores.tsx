/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import {
  Container,
  DivInput,
  Form,
  InputP,
  InputM,
  InputG,
  SubmitButton,
  DivEixo,
  TextArea,
  DivTextArea,
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
  DivTituloFormDrenagem,
} from "../../styles/financeiro";

import {
  DivCenter,
  DivForm,
  DivFormCadastro,
  DivTituloForm,
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
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../services/api";
import MenuIndicadoresCadastro from "../../components/MenuIndicadoresCadastro";
import MenuHorizontal from "../../components/MenuHorizontal";
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

export default function Drenagem({ municipio }: MunicipioProps) {
  const { usuario, anoEditorSimisab, isEditor } = useContext(AuthContext);
  const [dadosMunicipio, setDadosMunicipio] = useState<IMunicipio | any>(
    municipio
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [activeForm, setActiveForm] = useState("ViasUrbanas");
  const [dadosDrenagem, setDadosDrenagem] = useState(null);
  const [content, setContent] = useState("");
  const [anoSelected, setAnoSelected] = useState(null);

  useEffect(() => {
    getMunicipio();
    if (anoEditorSimisab) {
      getDadosDrenagem(anoEditorSimisab);
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

  function handleOnChange(content) {
    setContent(content);
  }

  async function handleCadastro(data) {
     if (!isEditor) {
          toast.error("Você não tem permissão para editar!", { position: "top-right", autoClose: 5000 });
          return;
        }

    data.id_drenagem_aguas_pluviais = dadosDrenagem?.id_drenagem_aguas_pluviais;

    data.id_municipio = usuario.id_municipio;
    data.ano = anoSelected;

    const resCad = await api
      .post("create-drenagem", data)
      .then((response) => {
        toast.success("Dados gravados com sucesso!", { position: "top-right", autoClose: 5000 });
        return response.data;
      })
      .catch((error) => {
        toast.error("Erro ao gravar os dados!", { position: "top-right", autoClose: 5000 });
        console.log(error);
      });
  }

  async function getDadosDrenagem(ano) {
    const id_municipio = usuario.id_municipio;
    const res = await api
      .post("get-drenagem", { id_municipio: id_municipio, ano: ano })
      .then((response) => {
        setDadosDrenagem(response.data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function seletcAno(ano: any) {
    setAnoSelected(ano);
    getDadosDrenagem(ano);
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
          active={activeForm === "ViasUrbanas"}
          onClick={() => setActiveForm("ViasUrbanas")}
        >
          Vias Urbanas
        </SidebarItem>
        <SidebarItem
          active={activeForm === "CursosAguas"}
          onClick={() => setActiveForm("CursosAguas")}
        >
          Cursos d'água - áreas urbanas
        </SidebarItem>
        <SidebarItem
          active={activeForm === "observaçoes"}
          onClick={() => setActiveForm("observacoes")}
        >
          Observações, esclarecimentos e sugestões
        </SidebarItem>
        <SidebarItem
          active={activeForm === "eventosHidrologicos"}
          onClick={() => setActiveForm("eventosHidrologicos")}
        >
          Eventos hidrológicos
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
                                      <span>Drenagem</span>
                                    </li>
                                  </ol>
                                </nav>
          </BreadCrumbStyle>
        <DivCenter>
          <Form onSubmit={handleSubmit(handleCadastro)}>
            <DivForm>
              <DivTituloForm>Drenagem e Águas Pluviais</DivTituloForm>

              <DivFormEixo>
                <DivFormConteudo
                  active={
                    activeForm === "ViasUrbanas" ||
                    activeForm === "CursosAguas" ||
                    activeForm === "observacoes" ||
                    activeForm === "eventosHidrologicos"
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
                <DivFormConteudo active={activeForm === "ViasUrbanas"}>
                  <DivTitulo>
                    <DivTituloConteudo>Vias urbanas</DivTituloConteudo>
                  </DivTitulo>

                  <table>
                    <tbody>
                      <tr>
                        <th>Código SNIS</th>
                        <th>Descrição</th>
                        <th>Ano: {anoSelected}</th>
                        <th></th>
                      </tr>
                      <tr>
                        <td>IE017</td>
                        <td>Extensão total das vias públicas urbanas</td>
                        <td>
                          <input
                            {...register("IE017")}
                            defaultValue={dadosDrenagem?.ie017}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            type="text"
                          ></input>
                        </td>
                        <td>km</td>
                      </tr>
                      <tr>
                        <td>IE018</td>
                        <td>
                          Extensão total das vias públicas urbanas implantadas
                        </td>
                        <td>
                          <input
                            {...register("IE018")}
                            defaultValue={dadosDrenagem?.ie018}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            type="text"
                          ></input>
                        </td>
                        <td>km</td>
                      </tr>
                      <tr>
                        <td>IE019</td>
                        <td>
                          Extensão total das vias públicas com pavimento e
                          meio-fio (ou semelhante)
                        </td>
                        <td>
                          <input
                            {...register("IE019")}
                            defaultValue={dadosDrenagem?.ie019}
                            onChange={handleOnChange}
                            type="text"
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>km</td>
                      </tr>
                      <tr>
                        <td>IE020</td>
                        <td>
                          {" "}
                          Extensão total das vias públicas com pavimento e
                          meio-fio (ou semelhante) implantadas no ano de
                          referência
                        </td>
                        <td>
                          <input
                            {...register("IE020")}
                            defaultValue={dadosDrenagem?.ie020}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            type="text"
                          ></input>
                        </td>
                        <td>km</td>
                      </tr>
                      <tr>
                        <td>IE021</td>
                        <td>Quantidade de bocas de lobo existentes</td>
                        <td>
                          <input
                            {...register("IE021")}
                            defaultValue={dadosDrenagem?.ie021}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            type="text"
                          ></input>
                        </td>
                        <td>unidades</td>
                      </tr>
                      <tr>
                        <td>IE022</td>
                        <td>
                          Quantidade de bocas de leão ou de bocas de lobo
                          múltiplas (duas ou mais bocas de lobo conjugadas)
                          existentes
                        </td>
                        <td>
                          <input
                            {...register("IE022")}
                            defaultValue={dadosDrenagem?.ie022}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            type="text"
                          ></input>
                        </td>
                        <td>unidades</td>
                      </tr>
                      <tr>
                        <td>IE023</td>
                        <td>Quantidade de poços de visita (PV) existentes</td>
                        <td>
                          <input
                            {...register("IE023")}
                            defaultValue={dadosDrenagem?.ie023}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            type="text"
                          ></input>
                        </td>
                        <td>unidades</td>
                      </tr>
                      <tr>
                        <td>IE024</td>
                        <td>
                          Extensão total das vias públicas urbanas com redes de
                          águas pluviais subterrâneos
                        </td>
                        <td>
                          <input
                            {...register("IE024")}
                            defaultValue={dadosDrenagem?.ie024}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            type="text"
                          ></input>
                        </td>
                        <td>km</td>
                      </tr>
                      <tr>
                        <td>IE025</td>
                        <td>
                          Extensão total das vias públicas urbanas com redes de
                          águas pluviais subterrâneos implantados no ano de
                          referência
                        </td>
                        <td>
                          <input
                            {...register("IE025")}
                            defaultValue={dadosDrenagem?.ie025}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            type="text"
                          ></input>
                        </td>
                        <td>km</td>
                      </tr>
                      <tr>
                        <td>IE026</td>
                        <td>
                          Existem vias públicas urbanas com canais artificiais
                          abertos?
                        </td>
                        <td>
                          <select
                            {...register("IE026")}
                            defaultValue={dadosDrenagem?.ie026}
                            onChange={handleOnChange}
                          >
                            <option>{dadosDrenagem?.ie026}</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                          </select>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>IE027</td>
                        <td>
                          Existem vias públicas urbanas com soluções de drenagem
                          natural (faixas ou valas de infiltração)?
                        </td>
                        <td>
                          <select
                            {...register("IE027")}
                            onChange={handleOnChange}
                          >
                            <option>{dadosDrenagem?.ie027}</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                          </select>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>IE028</td>
                        <td>
                          Extensão total das vias públicas urbanas com soluções
                          de drenagem natural (faixas ou valas de infiltração)
                        </td>
                        <td>
                          <input
                            {...register("IE028")}
                            defaultValue={dadosDrenagem?.ie028}
                            onChange={handleOnChange}
                            type="text"
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          ></input>
                        </td>
                        <td>km</td>
                      </tr>
                      <tr>
                        <td>IE029</td>
                        <td>
                          Existem extensões elevatórias de águas pluviais na
                          rede de drenagem?
                        </td>
                        <td>
                          <select
                            {...register("IE029")}
                            onChange={handleOnChange}
                          >
                            <option>{dadosDrenagem?.ie029}</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                          </select>
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>

                <DivFormConteudo active={activeForm === "CursosAguas"}>
                  <DivTitulo>
                    <DivTituloConteudo>
                      Cursos d’água - áreas urbanas
                    </DivTituloConteudo>
                  </DivTitulo>

                  <table>
                    <tbody>
                      <tr>
                        <th>Código SNIS</th>
                        <th>Descrição</th>
                        <th>Ano: {anoSelected}</th>
                        <th></th>
                      </tr>
                      <tr>
                        <td>IE032</td>
                        <td>
                          Extensão total dos Cursos d’água naturais perenes
                        </td>
                        <td>
                          <input
                            {...register("IE032")}
                            defaultValue={dadosDrenagem?.ie032}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            type="text"
                          ></input>
                        </td>
                        <td>km</td>
                      </tr>
                      <tr>
                        <td>IE040</td>
                        <td>
                          Extensão total dos Cursos d’água naturais perenes com
                          outro tipo de intervenção
                        </td>
                        <td>
                          <input
                            {...register("IE040")}
                            defaultValue={dadosDrenagem?.ie040}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            type="text"
                          ></input>
                        </td>
                        <td>km</td>
                      </tr>
                      <tr>
                        <td>IE033</td>
                        <td>
                          Extensão total dos Cursos d’água naturais perenes com
                          diques
                        </td>
                        <td>
                          <input
                            {...register("IE033")}
                            defaultValue={dadosDrenagem?.ie033}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            type="text"
                          ></input>
                        </td>
                        <td>km</td>
                      </tr>
                      <tr>
                        <td>IE034</td>
                        <td>
                          Extensão total dos Cursos d’água naturais perenes
                          canalizados abertos
                        </td>
                        <td>
                          <input
                            {...register("IE034")}
                            defaultValue={dadosDrenagem?.ie034}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            type="text"
                          ></input>
                        </td>
                        <td>km</td>
                      </tr>
                      <tr>
                        <td>IE035</td>
                        <td>
                          Extensão total dos Cursos d’água naturais perenes
                          canalizados fechados
                        </td>
                        <td>
                          <input
                            {...register("IE035")}
                            defaultValue={dadosDrenagem?.ie035}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            type="text"
                          ></input>
                        </td>
                        <td>km</td>
                      </tr>
                      <tr>
                        <td>IE036</td>
                        <td>
                          Extensão total dos Cursos d’água naturais perenes com
                          retificação
                        </td>
                        <td>
                          <input
                            {...register("IE036")}
                            defaultValue={dadosDrenagem?.ie036}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            type="text"
                          ></input>
                        </td>
                        <td>km</td>
                      </tr>
                      <tr>
                        <td>IE037</td>
                        <td>
                          Extensão total dos Cursos d’água naturais perenes com
                          desenrocamento ou rebaixamento do leito
                        </td>
                        <td>
                          <input
                            {...register("IE037")}
                            defaultValue={dadosDrenagem?.ie037}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            type="text"
                          ></input>
                        </td>
                        <td>km</td>
                      </tr>
                      <tr>
                        <td>IE041</td>
                        <td>
                          Existe serviço de drenagem ou desassoreamento dos
                          cursos de águas naturais perenes?
                        </td>
                        <td>
                          <select
                            {...register("IE041")}
                            defaultValue={dadosDrenagem?.ie041}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <option>Sim</option>
                            <option>Não</option>
                          </select>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>IE044</td>
                        <td>
                          Extensão total de parques lineares ao longo de Cursos
                          d’água perenes
                        </td>
                        <td>
                          <input
                            {...register("IE044")}
                            defaultValue={dadosDrenagem?.ie044}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            type="text"
                          ></input>
                        </td>
                        <td>km</td>
                      </tr>
                      <tr>
                        <td>IE050</td>
                        <td>
                          Existe algum tipo de tratamento das águas pluviais?
                        </td>
                        <td>
                          <select {...register("IE050")}>
                            <option></option>
                            <option>Não existe tratamento</option>
                            <option>Barragens</option>
                            <option>Reservatórios de qualidade</option>
                            <option>Reservatório de amortecimento</option>
                            <option>Gradeamento e desarenação</option>
                            <option>Decantação e/ou floculação</option>
                            <option>Desinfecção quimica</option>
                            <option>Outros(Especificar)</option>
                          </select>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>IE050A</td>
                        <td>
                          Especifique qual é o outro tipo de tratamento das
                          águas pluviais
                        </td>
                        <td>
                          <input
                            {...register("IE050A")}
                            defaultValue={dadosDrenagem?.ie050a}
                            onChange={handleOnChange}
                            type="text"
                          ></input>
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
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
                        <th>Ano: {anoSelected}</th>
                        <td></td>
                      </tr>
                      <tr>
                        <td>IE999</td>
                        <td>Observações, esclarecimentos ou sugestões</td>
                        <td>
                          <textarea
                            {...register("IE999")}
                            style={{ width: "500px" }}
                            defaultValue={dadosDrenagem?.ie999}
                            onChange={handleOnChange}
                          ></textarea>
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </DivFormConteudo>

                <DivFormConteudo active={activeForm === "eventosHidrologicos"}>
                  <DivTitulo>
                    <DivTituloConteudo>
                      Eventos hidrológicos impactantes
                    </DivTituloConteudo>
                  </DivTitulo>
                  <table>
                    <tbody>
                      <tr>
                        <th>Código SNIS</th>
                        <th>Descrição</th>
                        <th></th>
                        <th></th>
                      </tr>
                      <tr>
                        <td>RI023</td>
                        <td>
                          Número de enxurradas na área urbana do município
                        </td>
                        <td>
                          <input
                            {...register("RI023")}
                            defaultValue={dadosDrenagem?.ri023}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            type="text"
                          ></input>
                        </td>
                        <td>enxurradas</td>
                      </tr>
                      <tr>
                        <td>RI025</td>
                        <td>
                          Número de alagementos na área urbana do município
                        </td>
                        <td>
                          <input
                            {...register("RI025")}
                            defaultValue={dadosDrenagem?.ri025}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            type="text"
                          ></input>
                        </td>
                        <td>alagamentos</td>
                      </tr>
                      <tr>
                        <td>RI027</td>
                        <td>
                          Número de inundações na área urbana do município
                        </td>
                        <td>
                          <input
                            {...register("RI027")}
                            defaultValue={dadosDrenagem?.ri027}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            type="text"
                          ></input>
                        </td>
                        <td>inundações</td>
                      </tr>
                      <tr>
                        <td>RI029</td>
                        <td>
                          Número de pessoas desabrigadas ou desalojadas, na área
                          urbana do município
                        </td>
                        <td>
                          <input
                            {...register("RI029")}
                            defaultValue={dadosDrenagem?.ri029}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            type="text"
                          ></input>
                        </td>
                        <td>pessoas</td>
                      </tr>
                      <tr>
                        <td>RI031</td>
                        <td>Número de óbitos, na área urbana do município</td>
                        <td>
                          <input
                            {...register("RI031")}
                            defaultValue={dadosDrenagem?.ri031}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            type="text"
                          ></input>
                        </td>
                        <td>óbitos</td>
                      </tr>
                      <tr>
                        <td>RI032</td>
                        <td>Número de imóveis urbanos atingidos</td>
                        <td>
                          <input
                            {...register("RI032")}
                            defaultValue={dadosDrenagem?.ri032}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            type="text"
                          ></input>
                        </td>
                        <td>imóveis</td>
                      </tr>
                      <tr>
                        <td>RI042</td>
                        <td>
                          {" "}
                          Houve alojamento ou reassentamento de população
                          residente em área de risco hidrológico, durante ou
                          após eventos hidrológicos impactantes
                        </td>
                        <td>
                          <select
                            {...register("RI042")}
                            defaultValue={dadosDrenagem?.ri042}
                            onChange={handleOnChange}
                          >
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                          </select>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>RI043</td>
                        <td>
                          {" "}
                          Quantidade de pessoas tranferidas para habitações
                          provisórias durante ou após os eventos hidrológicos
                          impactantes
                        </td>
                        <td>
                          <input
                            {...register("RI043")}
                            defaultValue={dadosDrenagem?.ri043}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            type="text"
                          ></input>
                        </td>
                        <td>pessoas</td>
                      </tr>
                      <tr>
                        <td>RI044</td>
                        <td>
                          {" "}
                          Quantidade de pessoas realocadas para habitações
                          permanentes durante ou após os eventos hidrológicos
                          impactantes
                        </td>
                        <td>
                          <input
                            {...register("RI044")}
                            defaultValue={dadosDrenagem?.ri044}
                            onChange={handleOnChange}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            type="text"
                          ></input>
                        </td>
                        <td>pessoas</td>
                      </tr>
                      <tr>
                        <td>RI045</td>
                        <td>
                          Houve atuação (federal, estadual ou municipal) para
                          reassentamento da população e/ou para recuperação de
                          imóveis urbanos afetados por eventos hidrológicos
                          impactantes?
                        </td>
                        <td>
                          <select
                            {...register("RI045")}
                            defaultValue={dadosDrenagem?.ri045}
                            onChange={handleOnChange}
                          >
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                          </select>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>RI999</td>
                        <td>Observações, esclarecimentos ou sugestões</td>
                        <td colSpan={2}>
                          <textarea
                            {...register("RI999")}
                            defaultValue={dadosDrenagem?.ri999}
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
